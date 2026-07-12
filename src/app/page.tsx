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

export default async function HomePage() {
  const { count: reviewCount, data: reviews } = await supabaseAdmin
    .from('testimonials')
    .select('rating', { count: 'exact' });

  let aggregateRating = '5.0';
  if (reviewCount && reviewCount > 0 && reviews) {
    const sum = reviews.reduce((acc, row) => acc + (row.rating || 5), 0);
    aggregateRating = (sum / reviewCount).toFixed(1);
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <CountdownTimer hours={24} label="العرض ينتهي خلال" />
      </div>
      <LandingPage reviewCount={reviewCount || 0} aggregateRating={aggregateRating} />
    </>
  );
}
