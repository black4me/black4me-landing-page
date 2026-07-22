"use server";

import { headers } from 'next/headers';
import { supabaseAdmin } from '../../lib/supabase-admin';
import crypto from 'crypto';

export async function trackEvent(payload: {
  eventType: string;
  userEmail?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  parameters?: Record<string, any>;
}) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const sourceUrl = headersList.get('referer') || '';

    // Simple parsing for browser and device from User-Agent
    let browser = 'Unknown';
    let device = 'Desktop';

    if (/mobile/i.test(userAgent)) device = 'Mobile';
    if (/tablet/i.test(userAgent)) device = 'Tablet';

    if (/chrome|crios/i.test(userAgent)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
    else if (/safari/i.test(userAgent)) browser = 'Safari';
    else if (/edg/i.test(userAgent)) browser = 'Edge';

    const eventParams = payload.parameters || {};
    
    // Resolve lead_id
    let leadId = eventParams.lead_id;
    if (!leadId && payload.userEmail) {
      const { data: lead } = await supabaseAdmin
        .from('leads')
        .select('id')
        .eq('email', payload.userEmail)
        .single();
      if (lead) leadId = lead.id;
    }

    // 1. Log event in crm.events
    const { error: eventError } = await supabaseAdmin.schema('crm').from('events').insert([{
      event_name: payload.eventType,
      lead_id: leadId || null,
      metadata: {
        ...eventParams,
        ip_address: ip,
        device,
        browser,
        utm_source: payload.utmSource || null,
        utm_medium: payload.utmMedium || null,
        utm_campaign: payload.utmCampaign || null,
        user_agent: userAgent,
        source_url: sourceUrl
      }
    }]);

    if (eventError) {
      console.error('Tracking DB Error (events):', eventError);
    }

    // 2. Log event in crm.lead_timeline if lead is known
    if (leadId) {
      // If it's a heartbeat, we just update the duration of the latest page view
      if (payload.eventType === 'Heartbeat') {
        await handleHeartbeat(leadId, eventParams.page_path, eventParams.duration_seconds, eventParams.offer_slug);
        return { success: true };
      }

      const description = generateTimelineDescription(payload.eventType, eventParams);
      await supabaseAdmin.schema('crm').from('lead_timeline').insert([{
        lead_id: leadId,
        event_type: payload.eventType,
        event_category: getEventCategory(payload.eventType),
        page_path: eventParams.page_path || null,
        offer_slug: eventParams.offer_slug || null,
        coupon_code: eventParams.coupon_code || null,
        description: description,
        metadata: eventParams,
        timestamp: new Date().toISOString()
      }]);
    }

    // 3. Send to Meta Conversions API (CAPI)
    await sendToMetaConversionsAPI(payload, ip, userAgent, sourceUrl);

    // 4. Send global event to Activepieces BI/Tracking Webhook
    if (process.env.ACTIVEPIECES_WEBHOOK_URL_EVENTS) {
      try {
        await fetch(process.env.ACTIVEPIECES_WEBHOOK_URL_EVENTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: payload.eventType,
            user_email: payload.userEmail || null,
            ip_address: ip,
            device,
            browser,
            utm_source: payload.utmSource || null,
            utm_medium: payload.utmMedium || null,
            utm_campaign: payload.utmCampaign || null,
            parameters: eventParams,
            timestamp: new Date().toISOString()
          }),
        });
      } catch (e) {
        console.error('Failed to push to Activepieces Events Webhook:', e);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Track Event Exception:', error);
    await logError('tracking_system', error.message, payload);
    return { success: false, error: error.message };
  }
}

function getEventCategory(eventType: string): string {
  const interactions = ['PageView', 'PageLeave', 'Heartbeat', 'OfferView', 'GiftView', 'ProductView', 'ServiceView'];
  const conversions = ['LeadCaptured', 'FormStarted', 'FormSubmitted', 'CheckoutStarted', 'CheckoutAbandoned', 'CheckoutSuccess'];
  const retention = ['EmailSent', 'EmailOpened', 'CouponViewed', 'CouponApplied'];
  
  if (interactions.includes(eventType)) return 'Interaction';
  if (conversions.includes(eventType)) return 'Conversion';
  if (retention.includes(eventType)) return 'Retention';
  if (eventType === 'HesitationDetected') return 'Strategic';
  
  return 'General';
}

async function handleHeartbeat(leadId: string, pagePath: string, durationSeconds: number, offerSlug?: string) {
  try {
    // 1. Find the latest page view event for this lead
    const { data: latestView } = await supabaseAdmin.schema('crm')
      .from('lead_timeline')
      .select('id, duration_seconds')
      .eq('lead_id', leadId)
      .in('event_type', ['PageView', 'OfferView', 'GiftView', 'ProductView', 'ServiceView'])
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (latestView) {
      // 2. Update duration
      const maxDuration = Math.max(latestView.duration_seconds || 0, durationSeconds);
      await supabaseAdmin.schema('crm')
        .from('lead_timeline')
        .update({ duration_seconds: maxDuration })
        .eq('id', latestView.id);

      // 3. Hesitation Detection: > 3 minutes (180 seconds) on an offer page
      if (maxDuration >= 180 && offerSlug) {
        // Check if we already registered hesitation for this offer
        const { data: existingHesitation } = await supabaseAdmin.schema('crm')
          .from('lead_timeline')
          .select('id')
          .eq('lead_id', leadId)
          .eq('event_type', 'HesitationDetected')
          .eq('offer_slug', offerSlug)
          .single();

        if (!existingHesitation) {
          await triggerHesitationAutomation(leadId, offerSlug);
        }
      }
    }
  } catch (e) {
    console.error('Failed to handle heartbeat:', e);
  }
}

async function triggerHesitationAutomation(leadId: string, offerSlug: string) {
  // 1. Log Hesitation Event
  await supabaseAdmin.schema('crm').from('lead_timeline').insert([{
    lead_id: leadId,
    event_type: 'HesitationDetected',
    event_category: 'Strategic',
    offer_slug: offerSlug,
    description: `Hesitation detected on offer: ${offerSlug}. Waited > 3 minutes.`,
    timestamp: new Date().toISOString()
  }]);

  // 2. Generate unique one-time coupon
  const couponCode = `COMEBACK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  // Create coupon in public.coupons
  await supabaseAdmin.from('coupons').insert([{
    code: couponCode,
    discount_type: 'percentage',
    discount_value: 15,
    max_uses: 1,
    is_active: true,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  }]);

  // Update lead CRM score (+5 for hesitation/high intent)
  const { data: lead } = await supabaseAdmin.from('leads').select('lead_score, email').eq('id', leadId).single();
  if (lead) {
    await supabaseAdmin.from('leads').update({
      lead_score: (lead.lead_score || 0) + 5
    }).eq('id', leadId);
  }

  // Log coupon generation
  await supabaseAdmin.schema('crm').from('lead_timeline').insert([{
    lead_id: leadId,
    event_type: 'CouponAutoGenerated',
    event_category: 'Retention',
    offer_slug: offerSlug,
    coupon_code: couponCode,
    description: `Auto-generated hesitation coupon: ${couponCode} (15% OFF)`,
    timestamp: new Date().toISOString()
  }]);

  // Optionally trigger webhook to Activepieces for email dispatch
  if (process.env.ACTIVEPIECES_WEBHOOK_URL_EVENTS) {
    fetch(process.env.ACTIVEPIECES_WEBHOOK_URL_EVENTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'HesitationDetected',
        lead_id: leadId,
        user_email: lead?.email,
        offer_slug: offerSlug,
        coupon_code: couponCode
      })
    }).catch(console.error);
  }
}

function generateTimelineDescription(eventType: string, params: any): string {
  switch(eventType) {
    case 'Purchase': return `Purchased product: ${params.product_name || 'Unknown'} for ${params.cart_value} ${params.currency || 'USD'}`;
    case 'LeadMagnetClaimed': return `Claimed lead magnet: ${params.offer_name || 'Free Gift'}`;
    case 'InitiateCheckout': return `Started checkout for ${params.product_name || 'cart'}`;
    case 'CheckoutAbandoned': return `Abandoned checkout for ${params.product_name || 'cart'}`;
    case 'NewsletterSignup': return `Signed up for newsletter`;
    case 'PageView': return `Viewed page: ${params.page_path || 'Unknown'}`;
    case 'OfferView': return `Viewed offer: ${params.offer_slug || 'Unknown'}`;
    case 'GiftView': return `Viewed gift: ${params.offer_slug || 'Unknown'}`;
    case 'PageLeave': return `Left page: ${params.page_path || 'Unknown'} after ${params.duration_seconds || 0}s`;
    default: return `Performed action: ${eventType}`;
  }
}

async function sendToMetaConversionsAPI(payload: any, ip: string, userAgent: string, sourceUrl: string) {
  const FB_PIXEL_ID = '1672604016775353';
  const CAPI_TOKEN = process.env.META_CAPI_TOKEN;

  if (!CAPI_TOKEN) {
    console.log('Skipping Meta CAPI: META_CAPI_TOKEN is not configured.');
    return;
  }

  const eventParams = payload.parameters || {};
  const unixTime = eventParams.event_time || Math.floor(Date.now() / 1000);

  // Hash user data as required by Meta CAPI
  const hash = (str?: string) => str ? crypto.createHash('sha256').update(str.trim().toLowerCase()).digest('hex') : undefined;

  const userData: any = {
    client_ip_address: ip,
    client_user_agent: userAgent,
    em: hash(payload.userEmail),
    ph: hash(eventParams.phone)
  };

  const customData: any = {
    value: eventParams.cart_value || undefined,
    currency: eventParams.currency || (eventParams.cart_value ? 'USD' : undefined),
    content_name: eventParams.product_name || undefined,
    content_ids: eventParams.product_id ? [eventParams.product_id] : undefined,
  };

  const capiPayload = {
    data: [
      {
        event_name: payload.eventType,
        event_time: unixTime,
        action_source: "website",
        event_source_url: eventParams.page_url || sourceUrl,
        user_data: userData,
        custom_data: customData,
      }
    ]
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CAPI_TOKEN}`
      },
      body: JSON.stringify(capiPayload)
    });

    const result = await response.json();
    if (result.error) {
      console.error('Meta CAPI Error:', result.error);
    }
  } catch (err) {
    console.error('Failed to send to Meta CAPI:', err);
  }
}

export async function logError(service: string, message: string, payload: any) {
  try {
    await supabaseAdmin.from('error_logs').insert([{
      service,
      error_message: message,
      payload: payload || {},
    }]);
  } catch (e) {
    console.error('CRITICAL: Failed to log error to DB', e);
  }
}

export async function upsertUser(payload: { email: string; name?: string; phone?: string; country?: string; revenue?: number; status?: string; }) {
  try {
    const { data: user } = await supabaseAdmin.from("users").select("*").eq("email", payload.email).single();
    if (user) {
      const newTotal = Number(user.total_revenue || 0) + (payload.revenue || 0);
      await supabaseAdmin.from("users").update({
        last_visit: new Date().toISOString(),
        total_revenue: newTotal,
        clv: newTotal,
        status: payload.status || user.status
      }).eq("id", user.id);
    } else {
      await supabaseAdmin.from("users").insert([{
        email: payload.email,
        name: payload.name || null,
        phone: payload.phone || null,
        country: payload.country || null,
        first_visit: new Date().toISOString(),
        last_visit: new Date().toISOString(),
        total_revenue: payload.revenue || 0,
        clv: payload.revenue || 0,
        status: payload.status || "lead"
      }]);
    }
  } catch (e) {
    console.error("Failed to upsert user:", e);
  }
}
