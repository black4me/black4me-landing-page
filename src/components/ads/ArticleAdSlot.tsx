"use client";

import React from 'react';
import { AdSettings } from '@/types';
import { useEffect, useRef } from 'react';

// Adsterra Banner component to safely inject scripts in Next.js
function AdsterraBanner({ placement }: { placement: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run on client side and if not already injected
    if (typeof window === 'undefined' || !containerRef.current) return;
    if (containerRef.current.querySelector('script')) return;

    // Use the token provided by the user (or a different one depending on placement)
    // You can customize the key based on the placement if you have multiple units
    const isDesktop = window.innerWidth > 768;
    
    // For this example, we use the token provided: 6a721ecdfe1189bf36689214bbb03a3e
    // In production, we can pull these from env or db settings
    const adKey = '6a721ecdfe1189bf36689214bbb03a3e'; 
    const adWidth = isDesktop && placement !== 'mid_content' ? 728 : 300;
    const adHeight = isDesktop && placement !== 'mid_content' ? 90 : 250;

    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    conf.innerHTML = `atOptions = {
      'key' : '${adKey}',
      'format' : 'iframe',
      'height' : ${adHeight},
      'width' : ${adWidth},
      'params' : {}
    };`;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    // Note: Adsterra often changes this domain. If the ads don't show, update this URL
    // based on what "GET CODE" gives you in the dashboard.
    script.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;

    containerRef.current.appendChild(conf);
    containerRef.current.appendChild(script);
  }, [placement]);

  return <div ref={containerRef} className="flex justify-center w-full min-h-[250px] items-center" />;
}

interface ArticleAdSlotProps {
  placement: 'after_intro' | 'mid_content' | 'end_content';
  settings: AdSettings;
}

export default function ArticleAdSlot({ placement, settings }: ArticleAdSlotProps) {
  // If the placement is disabled in settings, return null
  if (!settings.placement_config[placement]) return null;

  // Placeholder for the actual ad script insertion
  // If you add Adsterra or Adsense, you will place their specific <ins> or <div> code here.
  
  return (
    <div className={`my-12 w-full flex flex-col items-center justify-center 
      ${settings.style_config.containerVariant === 'subtle' ? 'bg-[#0d0d10] border border-white/5 rounded-2xl' : 'bg-transparent'}
      p-4 md:p-6 overflow-hidden min-h-[120px] relative`}
    >
      <div className="absolute top-0 right-4 bg-black/40 text-[10px] text-gray-500 px-2 py-0.5 rounded-b-md border-x border-b border-white/5 uppercase tracking-widest font-bold">
        {settings.style_config.label || 'إعلان'}
      </div>
      
      {/* Adsterra Ad Unit */}
      <div className="w-full flex items-center justify-center py-4">
        <AdsterraBanner placement={placement} />
      </div>
    </div>
  );
}
