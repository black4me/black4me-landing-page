import type { Metadata } from 'next';
import LandingPage from '../views/LandingPage';

export const metadata: Metadata = {
  title: 'بدون تسويق كارثة تهدد ثروتك المستقبلية — كتاب + نظام تعليمي | BLACK4ME',
  description: 'كتاب عملي + نظام تعليمي + 6 قوالب تسويقية جاهزة. دليل بناء العروض التي لا ترفض. من تأليف جاسم محمد.',
  alternates: {
    canonical: 'https://www.black4me.com',
  },
};

import CountdownTimer from '../components/CountdownTimer';
import { supabaseAdmin } from '../lib/supabase-admin';

export const revalidate = 0;

export default async function HomePage() {
  const { count: reviewCount, data: reviews } = await supabaseAdmin
    .from('testimonials')
    .select('rating', { count: 'exact' });

  const { data: settingsData } = await supabaseAdmin.from('site_settings').select('key, value');
  const settings = (settingsData || []).reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {} as Record<string, string>);

  let aggregateRating = '5.0';
  if (reviewCount && reviewCount > 0 && reviews) {
    const sum = reviews.reduce((acc, row) => acc + (row.rating || 5), 0);
    aggregateRating = (sum / reviewCount).toFixed(1);
  }

  const { data: latestOffer } = await supabaseAdmin
    .schema('crm')
    .from('offer_pages')
    .select('slug')
    .eq('type', 'free_gift')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const freeGiftSlug = latestOffer?.slug || 'jasim-mohammed-personal-branding';

  const showBanner = settings.enable_top_banner === 'true';

  return (
    <>
      {showBanner && (
        <div className="sticky top-0 z-50">
          <CountdownTimer 
            hours={24} 
            label={settings.top_banner_text || "العرض ينتهي خلال"} 
            targetDate={settings.countdown_end_date} 
          />
        </div>
      )}
      <LandingPage 
        reviewCount={reviewCount || 0} 
        aggregateRating={aggregateRating} 
        freeGiftSlug={freeGiftSlug}
      />
    </>
  );
}
