"use client";

import { useEffect, useRef } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { trackEvent } from '../server/actions/tracking';

export default function Tracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const utmSource = searchParams?.get('utm_source');
    const utmMedium = searchParams?.get('utm_medium');
    const utmCampaign = searchParams?.get('utm_campaign');

    if (utmSource) localStorage.setItem('utm_source', utmSource);
    if (utmMedium) localStorage.setItem('utm_medium', utmMedium);
    if (utmCampaign) localStorage.setItem('utm_campaign', utmCampaign);

    // Safe JSON.parse — prevents site crash if session data is malformed
    let currentUserEmail: string | undefined = undefined;
    try {
      const cu = localStorage.getItem('currentUser');
      if (cu && cu !== 'undefined' && cu !== 'null') {
        currentUserEmail = JSON.parse(cu).email;
      }
    } catch (e) {
      // Silently ignore malformed data
    }

    trackEvent({
      eventType: 'page_view',
      userEmail: currentUserEmail,
      utmSource: utmSource || localStorage.getItem('utm_source'),
      utmMedium: utmMedium || localStorage.getItem('utm_medium'),
      utmCampaign: utmCampaign || localStorage.getItem('utm_campaign'),
      parameters: { path: pathname }
    });

  }, [searchParams, pathname]);

  return null;
}

export const getUTMs = () => {
  if (typeof window === 'undefined') return {};
  return {
    utmSource: localStorage.getItem('utm_source'),
    utmMedium: localStorage.getItem('utm_medium'),
    utmCampaign: localStorage.getItem('utm_campaign'),
  };
};
