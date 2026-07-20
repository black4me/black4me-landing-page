"use client";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track?: (event: string, payload?: Record<string, unknown>) => void;
      page?: () => void;
    };
  }
}

type TrackingPayload = Record<string, unknown>;

export function trackGoogleEvent(eventName: string, payload?: TrackingPayload) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, payload);
}

export function trackMetaEvent(eventName: string, payload?: TrackingPayload) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }

  if (payload) {
    window.fbq("trackCustom", eventName, payload);
    return;
  }

  window.fbq("trackCustom", eventName);
}

export function trackTikTokEvent(eventName: string, payload?: TrackingPayload) {
  if (typeof window === "undefined" || typeof window.ttq?.track !== "function") {
    return;
  }

  window.ttq.track(eventName, payload);
}

export function trackAllPixels(eventName: string, payload?: TrackingPayload) {
  trackGoogleEvent(eventName, payload);
  trackMetaEvent(eventName, payload);
  trackTikTokEvent(eventName, payload);
}

export function trackPurchase(payload: TrackingPayload) {
  trackGoogleEvent("purchase", payload);

  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Purchase", payload);
  }

  if (typeof window !== "undefined" && typeof window.ttq?.track === "function") {
    window.ttq.track("CompletePayment", payload);
  }
}
