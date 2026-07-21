'use client';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePathname } from 'next/navigation';

function getSessionId() {
  if (typeof window === 'undefined') return null;
  let session = localStorage.getItem('crm_session_id');
  if (!session) {
    session = uuidv4();
    localStorage.setItem('crm_session_id', session);
  }
  return session;
}

export default function CrmTracker() {
  const pathname = usePathname();
  const session_id = getSessionId();
  const hasTrackedPageView = useRef(false);
  const maxScroll = useRef(0);

  const sendEvent = async (event_name: string, metadata: any = {}) => {
    try {
      await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id, event_name, metadata }),
      });
    } catch (e) {
      console.error('Tracking Error', e);
    }
  };

  useEffect(() => {
    if (!hasTrackedPageView.current) {
      sendEvent('page_view', { path: pathname, referrer: document.referrer });
      hasTrackedPageView.current = true;
    }

    // Scroll Tracking
    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll.current + 25) { // Track every 25% threshold
        maxScroll.current = Math.floor(scrollPercent / 25) * 25;
        sendEvent(`scroll_${maxScroll.current}`, { path: pathname });
      }
    };

    // Exit Intent Tracking
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        sendEvent('exit_intent', { path: pathname });
      }
    };

    // Button Click Tracking (Delegation)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button, a');
      if (button) {
        const ctaText = button.textContent?.trim();
        const ctaLink = button.getAttribute('href');
        sendEvent('button_click', { text: ctaText, link: ctaLink, path: pathname });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('click', handleClick);
    };
  }, [pathname]);

  return null;
}
