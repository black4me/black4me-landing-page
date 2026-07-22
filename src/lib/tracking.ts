import { trackEvent as serverTrackEvent } from '@/server/actions/tracking';

// Standard Meta Events that use fbq('track')
const STANDARD_EVENTS = [
  'PageView',
  'ViewContent',
  'Lead',
  'CompleteRegistration',
  'InitiateCheckout',
  'AddPaymentInfo',
  'Purchase',
];

export interface TrackingData {
  // Common tracking fields
  event_time?: number;
  page_url?: string;
  page_path?: string;
  referrer?: string;
  
  // UTMs
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  
  // User/CRM info
  lead_id?: string;
  customer_name?: string;
  email?: string;
  phone?: string;
  session_id?: string;
  is_returning_user?: boolean;
  
  // eCommerce / Funnel Data
  product_id?: string;
  product_name?: string;
  service_name?: string;
  offer_id?: string;
  offer_name?: string;
  offer_type?: string;
  funnel_stage?: string;
  lead_source?: string;
  discount_code?: string;
  cart_value?: number;
  currency?: string;
  
  // Environment (Usually captured server-side, but can be added here)
  device_type?: string;
  browser?: string;
  country?: string;
  city?: string;
  
  // Any extra
  [key: string]: any;
}

/**
 * Tracks an event globally to Meta Pixel (Client) and Supabase CRM + CAPI (Server)
 * @param eventName The event name (Standard or Custom)
 * @param eventData Additional rich data payload
 */
export const trackEvent = async (eventName: string, eventData: TrackingData = {}) => {
  try {
    if (typeof window === 'undefined') return; // Only execute on client side

    // Enrich eventData with basic browser info if missing
    const payload = {
      ...eventData,
      page_url: eventData.page_url || window.location.href,
      page_path: eventData.page_path || window.location.pathname,
      referrer: eventData.referrer || document.referrer,
      event_time: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
    };

    // Retrieve UTMs from local storage if available
    const utms = {
      utm_source: localStorage.getItem('utm_source') || undefined,
      utm_medium: localStorage.getItem('utm_medium') || undefined,
      utm_campaign: localStorage.getItem('utm_campaign') || undefined,
    };
    Object.assign(payload, utms);

    // Get current user email from local storage (if user is returning/logged in)
    try {
      const cu = localStorage.getItem('currentUser');
      if (cu && cu !== 'undefined') {
        const parsed = JSON.parse(cu);
        if (parsed.email) payload.email = payload.email || parsed.email;
        if (parsed.id) payload.lead_id = payload.lead_id || parsed.id;
      }
    } catch (e) {
      // ignore parse errors
    }

    // 1. Send to Meta Pixel (Client Side)
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      const isStandard = STANDARD_EVENTS.includes(eventName);
      
      // Formatting Meta Standard fields for FB Pixel
      const fbPayload: Record<string, any> = {};
      if (payload.cart_value) fbPayload.value = payload.cart_value;
      if (payload.currency) fbPayload.currency = payload.currency || 'USD';
      if (payload.product_name) fbPayload.content_name = payload.product_name;
      if (payload.product_id) fbPayload.content_ids = [payload.product_id];
      if (payload.email) fbPayload.em = payload.email;
      if (payload.phone) fbPayload.ph = payload.phone;

      if (isStandard) {
        fbq('track', eventName, fbPayload);
      } else {
        // Use trackCustom for non-standard events
        fbq('trackCustom', eventName, { ...fbPayload, ...payload });
      }
    } else {
      console.warn('Meta Pixel not found (fbq is not defined)');
    }

    // 2. Send to Server for CRM Logging & Conversions API
    // We run this async so it doesn't block the UI
    serverTrackEvent({
      eventType: eventName,
      userEmail: payload.email,
      utmSource: payload.utm_source,
      utmMedium: payload.utm_medium,
      utmCampaign: payload.utm_campaign,
      parameters: payload,
    }).catch(err => {
      console.error('Failed to send tracking data to server', err);
    });
    
  } catch (error) {
    console.error('Global Tracking Error:', error);
  }
};
