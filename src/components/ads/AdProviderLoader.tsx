"use client";

import Script from 'next/script';
import { AdSettings } from '@/types';

interface AdProviderLoaderProps {
  settings: AdSettings;
}

export default function AdProviderLoader({ settings }: AdProviderLoaderProps) {
  if (!settings.enabled || settings.provider === 'disabled') return null;

  if (settings.provider === 'adsterra' && settings.script_url) {
    return (
      <Script 
        src={settings.script_url} 
        strategy="afterInteractive" 
      />
    );
  }

  if (settings.provider === 'adsense' && settings.script_url) {
    return (
      <Script 
        src={settings.script_url} 
        strategy="afterInteractive" 
        crossOrigin="anonymous"
      />
    );
  }

  // Fallback or custom inline script if any
  if (settings.script_inline) {
    return (
      <Script id="custom-ad-provider" strategy="afterInteractive">
        {settings.script_inline}
      </Script>
    );
  }

  return null;
}
