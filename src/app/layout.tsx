import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import TrackingScripts from '../components/TrackingScripts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Providers } from './providers';
import React from 'react';
import MetaPixel from '../components/MetaPixel';
import TopBanner from '../components/TopBanner';

export const revalidate = 0;

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cairo',
  display: 'swap',
  preload: true,
});

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-ibm',
  display: 'swap',
  preload: true,
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

import { supabaseAdmin } from '../lib/supabase-admin';

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabaseAdmin.from('site_settings').select('key, value').in('key', ['hero_title', 'hero_subtitle', 'site_favicon']);
  const settings = data?.reduce((acc: any, row) => ({ ...acc, [row.key]: row.value }), {}) || {};

  const defaultTitle = 'BLACK4ME | جاسم محمد';
  const defaultDescription = 'التسويق الرقمي | بناء العلامة الشخصية | الأتمتة | الاستشارات | الحلول الرقمية';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: '%s | BLACK4ME',
    },
    description: defaultDescription,
    icons: {
      icon: settings.site_favicon || '/favicon.ico',
      apple: settings.site_favicon || '/favicon.ico',
    },
    keywords: [
      'التسويق الرقمي',
      'بناء العلامة الشخصية',
      'الأتمتة',
      'الاستشارات',
      'الحلول الرقمية',
      'جاسم محمد',
      'BLACK4ME',
    ],
    authors: [{ name: 'جاسم محمد', url: siteUrl }],
    creator: 'جاسم محمد',
    publisher: 'BLACK4ME',
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: siteUrl,
      siteName: 'BLACK4ME',
      title: defaultTitle,
      description: defaultDescription,
      images: [
        {
          url: `${siteUrl}/images/book-cover.jpg`,
          width: 1200,
          height: 630,
          alt: 'BLACK4ME | جاسم محمد',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@black4me',
      creator: '@black4me',
      title: defaultTitle,
      description: defaultDescription,
      images: [`${siteUrl}/images/book-cover.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: siteUrl,
    },
    verification: {
      google: '74DHuE556Qb9-QS5PS7hKJsRXL2NR8QQ9eYvAxyx-qk',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch real reviews for schema
  const { count: reviewCount, data: reviews } = await supabaseAdmin
    .from('testimonials')
    .select('rating', { count: 'exact' });

  let aggregateRating = undefined;
  if (reviewCount && reviewCount > 0 && reviews) {
    const sum = reviews.reduce((acc, row) => acc + (row.rating || 5), 0);
    aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": (sum / reviewCount).toFixed(1),
      "reviewCount": reviewCount.toString()
    };
  }

  const productSchema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "بدون تسويق كارثة تهدد ثروتك المستقبلية",
    "description": "حزمة متكاملة: كتاب + نظام تعليمي + 6 قوالب + استشارة فردية",
    "brand": { "@type": "Brand", "name": "BLACK4ME" },
    "offers": {
      "@type": "Offer",
      "url": "https://www.black4me.com/",
      "priceCurrency": "USD",
      "price": "49",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock"
    }
  };
  
  if (aggregateRating) {
    productSchema.aggregateRating = aggregateRating;
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BLACK4ME",
    "url": "https://www.black4me.com/",
    "logo": "https://www.black4me.com/images/book-cover.jpg",
    "founder": { "@type": "Person", "name": "Jasim Mohammed" },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@black4me.com",
      "contactType": "customer service"
    }
  };

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${ibmPlex.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </head>
      <body className="min-h-full font-sans bg-brand-black text-brand-white antialiased">
        <Providers>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-brand-gold focus:text-brand-black focus:p-2 focus:rounded">
            انتقل للمحتوى الرئيسي
          </a>
          <TopBanner />
          <Navbar />
          <main id="main-content" className="min-h-[calc(100vh-80px)]">
            {children}
          </main>
          <Footer />
        </Providers>
        <TrackingScripts
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
          tiktokPixelId={process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}
        />
        <React.Suspense fallback={null}>
          <MetaPixel />
        </React.Suspense>
      </body>
    </html>
  );
}
