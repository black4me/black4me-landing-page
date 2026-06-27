"use client";

import { useEffect, useRef } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { trackEvent } from '../server/actions/tracking';

export default function Tracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tracked = useRef(false);

  useEffect(() => {
    // Only track page view once per mount to avoid double firing in React strict mode
    if (tracked.current) return;
    tracked.current = true;

    const utmSource = searchParams?.get('utm_source');
    const utmMedium = searchParams?.get('utm_medium');
    const utmCampaign = searchParams?.get('utm_campaign');

    // Store UTMs in localStorage for later attribution (e.g. checkout, consultation)
    if (utmSource) localStorage.setItem('utm_source', utmSource);
    if (utmMedium) localStorage.setItem('utm_medium', utmMedium);
    if (utmCampaign) localStorage.setItem('utm_campaign', utmCampaign);

    // Get current user email if logged in
    const currentUser = localStorage.getItem('currentUser') 
      ? JSON.parse(localStorage.getItem('currentUser') as string).email 
      : undefined;

    trackEvent({
      eventType: 'page_view',
      userEmail: currentUser,
      utmSource: utmSource || localStorage.getItem('utm_source'),
      utmMedium: utmMedium || localStorage.getItem('utm_medium'),
      utmCampaign: utmCampaign || localStorage.getItem('utm_campaign'),
      parameters: { path: pathname }
    });

  }, [searchParams, pathname]);

  return null; // Hidden component
}

export const getUTMs = () => {
  if (typeof window === 'undefined') return {};
  return {
    utmSource: localStorage.getItem('utm_source'),
    utmMedium: localStorage.getItem('utm_medium'),
    utmCampaign: localStorage.getItem('utm_campaign'),
  };
};
