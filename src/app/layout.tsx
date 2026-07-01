import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import TrackingScripts from '../components/TrackingScripts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Providers } from './providers';
import React from 'react';
import Tracker from '../components/Tracker';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cairo',
  display: 'optional',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: true,
  preload: true,
});

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-ibm',
  display: 'optional',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: true,
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
  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', ['hero_title', 'hero_subtitle', 'site_favicon']);

  const settings: Record<string, string> = data?.reduce((acc: Record<string, string>, row) => ({
    ...acc,
    [row.key]: row.value,
  }), {}) || {};

  // Normalize favicon URL — must be absolute for external, relative for local
  const faviconUrl = settings.site_favicon
    ? settings.site_favicon.startsWith('http')
      ? settings.site_favicon
      : `/${settings.site_favicon.replace(/^\//, '')}`
    : '/favicon.ico';

  return {
    metadataBase: new URL('https://www.black4me.com'),
    title: {
      default: settings.hero_title
        ? `${settings.hero_title} | BLACK4ME`
        : 'BLACK4ME — نظام تسويق يجلب لك 20 عميل شهرياً | جاسم محمد',
      template: '%s | BLACK4ME',
    },
    description:
      settings.hero_subtitle ||
      'احصل على الحزمة الشاملة لبناء نظام تسويق رقمي متكامل: كتاب عملي + نظام تعليمي + قوالب جاهزة + استشارة خاصة. ابدأ بـ $49 فقط مع ضمان استرداد كامل.',
    icons: {
      icon: [
        { url: faviconUrl, sizes: 'any' },
      ],
      apple: [
        { url: faviconUrl, sizes: '180x180', type: 'image/png' },
      ],
      shortcut: faviconUrl,
    },
    keywords: [
      'كتاب تسويق رقمي',
      'نظام جذب العملاء',
      'قوالب تسويق جاهزة',
      'تسويق إلكتروني عربي',
      'بناء نظام مبيعات',
      'جاسم محمد',
      'BLACK4ME',
      'كتاب بدون التسويق',
      'نظام تسويقي متكامل',
      'تسويق رقمي للمبتدئين',
    ],
    authors: [{ name: 'جاسم محمد', url: 'https://www.black4me.com' }],
    creator: 'جاسم محمد',
    publisher: 'BLACK4ME',
    openGraph: {
      type: 'website',
      locale: 'ar_SA',
      url: 'https://www.black4me.com',
      siteName: 'BLACK4ME',
      title: settings.hero_title
        ? `${settings.hero_title} | BLACK4ME`
        : 'BLACK4ME — نظام تسويق يجلب لك 20 عميل شهرياً',
      description:
        settings.hero_subtitle ||
        'الحزمة الشاملة لبناء نظام تسويق رقمي: كتاب + نظام تعليمي + قوالب + استشارة. ابدأ بـ $49 مع ضمان استرداد.',
      images: [
        {
          url: '/images/book-cover.png',
          width: 1200,
          height: 628,
          alt: 'كتاب بدون التسويق كارثة تهدد ثروتك المستقبلية — جاسم محمد',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@black4me',
      creator: '@black4me',
      title: settings.hero_title
        ? `${settings.hero_title} | BLACK4ME`
        : 'BLACK4ME — نظام تسويق يجلب لك 20 عميل شهرياً',
      description:
        settings.hero_subtitle ||
        'الحزمة الشاملة لبناء نظام تسويق رقمي متكامل. ابدأ بـ $49 مع ضمان استرداد كامل.',
      images: ['/images/book-cover.png'],
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
      canonical: 'https://www.black4me.com',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GSC_ID || '',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${ibmPlex.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/book-cover.png"
          fetchPriority="high"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://rgfiszmnxktetnahufpm.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.stripe.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://analytics.tiktok.com" />
      </head>
      <body className="min-h-full font-sans bg-brand-black text-brand-white antialiased">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-brand-gold focus:text-brand-black focus:p-2 focus:rounded"
          >
            انتقل للمحتوى الرئيسي
          </a>
          <Navbar />
          <main id="main-content" className="min-h-[calc(100dvh-80px)]">
            {children}
          </main>
          <Footer />
        </Providers>
        <TrackingScripts
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
          tiktokPixelId={process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}
        />
        <React.Suspense fallback={null}>
          <Tracker />
        </React.Suspense>
      </body>
    </html>
  );
}
