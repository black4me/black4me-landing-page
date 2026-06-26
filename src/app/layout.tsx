import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import TrackingScripts from '../components/TrackingScripts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Providers } from './providers';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://www.black4me.com'),
  title: {
    default: 'BLACK4ME — نظام تسويق يجلب لك 20 عميل شهرياً | جاسم محمد',
    template: '%s | BLACK4ME',
  },
  description: 'احصل على الحزمة الشاملة لبناء نظام تسويق رقمي متكامل: كتاب عملي + نظام تعليمي + قوالب جاهزة + استشارة خاصة. ابدأ بـ $49 فقط مع ضمان استرداد كامل.',
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
    title: 'BLACK4ME — نظام تسويق يجلب لك 20 عميل شهرياً',
    description: 'الحزمة الشاملة لبناء نظام تسويق رقمي: كتاب + نظام تعليمي + قوالب + استشارة. ابدأ بـ $49 مع ضمان استرداد.',
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
    title: 'BLACK4ME — نظام تسويق يجلب لك 20 عميل شهرياً',
    description: 'الحزمة الشاملة لبناء نظام تسويق رقمي متكامل. ابدأ بـ $49 مع ضمان استرداد كامل.',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${ibmPlex.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
      </head>
      <body className="min-h-full font-sans bg-brand-black text-brand-white antialiased">
        <Providers>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-brand-gold focus:text-brand-black focus:p-2 focus:rounded">
            انتقل للمحتوى الرئيسي
          </a>
          <Navbar />
          <main id="main-content" className="min-h-[calc(100vh-80px)]">
            {children}
          </main>
          <Footer />
        </Providers>
        <TrackingScripts
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
          tiktokPixelId={process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}
        />
      </body>
    </html>
  );
}
