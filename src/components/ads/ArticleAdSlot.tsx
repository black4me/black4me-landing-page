"use client";

import React, { useState, useEffect } from 'react';
import { AdSettings } from '@/types';

function AdsterraBanner({ placement }: { placement: string }) {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  if (!mounted) {
    return <div className="min-h-[250px] w-full bg-transparent" />;
  }

  const iframeSrc = isDesktop ? '/ad-728x90.html' : '/ad-300x250.html';
  const adWidth = isDesktop ? 728 : 300;
  const adHeight = isDesktop ? 90 : 250;

  return (
    <div className={`flex justify-center w-full items-center ${isDesktop ? 'min-h-[90px]' : 'min-h-[250px]'}`}>
      <iframe
        src={iframeSrc}
        width={adWidth}
        height={adHeight}
        frameBorder="0"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        style={{ border: 'none', overflow: 'hidden' }}
        title={`adsterra-banner-${placement}`}
      />
    </div>
  );
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
