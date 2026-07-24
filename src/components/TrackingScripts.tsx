"use client";

import Script from 'next/script';
import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface TrackingScriptsProps {
  gtmId?: string;
  gaId?: string;
  metaPixelId?: string;
  tiktokPixelId?: string;
}

export default function TrackingScripts({ gtmId, gaId, metaPixelId, tiktokPixelId }: TrackingScriptsProps) {
  return (
    <Suspense fallback={null}>
      <TrackingScriptsInner gtmId={gtmId} gaId={gaId} metaPixelId={metaPixelId} tiktokPixelId={tiktokPixelId} />
    </Suspense>
  );
}

function TrackingScriptsInner({ gtmId, gaId, metaPixelId, tiktokPixelId }: TrackingScriptsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    if (typeof (window as any).gtag === 'function' && gaId) {
      (window as any).gtag('config', gaId, {
        page_path: pagePath,
        page_title: document.title,
      });
    }

    if (typeof (window as any).fbq === 'function' && metaPixelId) {
      (window as any).fbq('track', 'PageView');
    }

    if (typeof (window as any).ttq?.page === 'function' && tiktokPixelId) {
      (window as any).ttq.page();
    }
  }, [gaId, metaPixelId, pathname, searchParams, tiktokPixelId]);

  return (
    <>
      {/* Google Tag Manager - deferred until after page load */}
      {gtmId && (
        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      )}

      {/* Google Analytics 4 - deferred until after page load */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = function gtag(){window.dataLayer.push(arguments);};
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_title: document.title,
                send_page_view: true,
              });
            `}
          </Script>
        </>
      )}

      {/* Meta (Facebook) Pixel */}
      <Script id="meta-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID || '4076837489211517'}');
        fbq('track', 'PageView');
      `}} />
      <noscript>
        <img height="1" width="1" style={{ display: 'none' }}
        src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID || '4076837489211517'}&ev=PageView&noscript=1`}
        alt=""
        />
      </noscript>

      {/* TikTok Pixel - deferred until after page load */}
      {tiktokPixelId && (
        <Script id="tiktok-pixel" strategy="lazyOnload">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
              ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
              ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
              for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
              ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
              ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
              ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};
              ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};
              var o=document.createElement("script");o.type="text/javascript";o.async=!0;o.src=i+"?sdkid="+e+"&lib="+t;
              var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
              ttq.load('${tiktokPixelId}');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>
      )}
    </>
  );
}
