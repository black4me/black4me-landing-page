import type { Metadata } from "next";
import "./globals.css";
import { supabase } from '../lib/supabase';
import TrackingScripts from '../components/TrackingScripts';

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from('site_settings').select('setting_key, setting_value');
  const settings: Record<string, string> = {};
  if (data) {
    data.forEach(d => { settings[d.setting_key] = d.setting_value; });
  }

  const title = settings.seo_title || "BLACK4ME - نظام التسويق الذكي";
  const description = settings.seo_description || "المنصة المتكاملة للتسويق الذكي والمبيعات الرقمية المتقدمة";
  const keywords = settings.seo_keywords || "تسويق, ذكاء اصطناعي, مبيعات, أعمال";
  const ogImage = settings.og_image || "";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await supabase.from('site_settings').select('setting_key, setting_value');
  const settings: Record<string, string> = {};
  if (data) {
    data.forEach(d => { settings[d.setting_key] = d.setting_value; });
  }

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-full font-sans bg-brand-black text-brand-white">
        {children}
        <TrackingScripts
          gaId={settings.ga_id}
          metaPixelId={settings.meta_pixel_id}
          tiktokPixelId={settings.tiktok_pixel_id}
        />
      </body>
    </html>
  );
}
