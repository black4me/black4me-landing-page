"use client";

import React from 'react';
import { AdSettings } from '@/types';
import { useEffect, useRef } from 'react';

function AdsterraBanner({ placement }: { placement: string }) {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;
  const adKey = '4b117f2ed043d3943326e51f8fd5e653'; 
  const adWidth = isDesktop && placement !== 'mid_content' ? 728 : 300;
  const adHeight = isDesktop && placement !== 'mid_content' ? 90 : 250;

  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : ${adHeight},
            'width' : ${adWidth},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.topcreativeformat.com/${adKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="flex justify-center w-full min-h-[250px] items-center">
      <iframe
        srcDoc={iframeContent}
        width={adWidth}
        height={adHeight}
        frameBorder="0"
        scrolling="no"
        sandbox="allow-scripts allow-same-origin allow-popups"
        style={{ border: 'none', overflow: 'hidden' }}
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
