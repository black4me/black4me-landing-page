"use server";

import { headers } from 'next/headers';
import { supabaseAdmin } from '../../lib/supabase-admin';

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

    // Simple parsing for browser and device from User-Agent
    let browser = 'Unknown';
    let device = 'Desktop';

    if (/mobile/i.test(userAgent)) device = 'Mobile';
    if (/tablet/i.test(userAgent)) device = 'Tablet';

    if (/chrome|crios/i.test(userAgent)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
    else if (/safari/i.test(userAgent)) browser = 'Safari';
    else if (/edg/i.test(userAgent)) browser = 'Edge';

    // 1. Log event in Supabase
    const { error: eventError } = await supabaseAdmin.from('events').insert([{
      event_type: payload.eventType,
      user_email: payload.userEmail || null,
      ip_address: ip,
      device,
      browser,
      utm_source: payload.utmSource || null,
      utm_medium: payload.utmMedium || null,
      utm_campaign: payload.utmCampaign || null,
      parameters: payload.parameters || {},
    }]);

    if (eventError) {
      console.error('Tracking DB Error:', eventError);
      await logError('supabase', eventError.message, payload);
    }

    // 2. Send global event to Activepieces BI/Tracking Webhook
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
            parameters: payload.parameters || {},
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

export async function upsertUser(payload: {
  email: string;
  name?: string;
  phone?: string;
  country?: string;
  revenue?: number;
  status?: string;
}) {
  try {
    // Check if user exists
    const { data: user } = await supabaseAdmin.from('users').select('*').eq('email', payload.email).single();

    if (user) {
      // Update
      const newTotal = Number(user.total_revenue || 0) + (payload.revenue || 0);
      await supabaseAdmin.from('users').update({
        last_visit: new Date().toISOString(),
        total_revenue: newTotal,
        clv: newTotal, // Simple CLV equals total revenue for now
        status: payload.status || user.status,
      }).eq('id', user.id);
    } else {
      // Insert
      await supabaseAdmin.from('users').insert([{
        email: payload.email,
        name: payload.name || null,
        phone: payload.phone || null,
        country: payload.country || null,
        first_visit: new Date().toISOString(),
        last_visit: new Date().toISOString(),
        total_revenue: payload.revenue || 0,
        clv: payload.revenue || 0,
        status: payload.status || 'lead',
      }]);
    }
  } catch (e) {
    console.error('Failed to upsert user:', e);
  }
}
