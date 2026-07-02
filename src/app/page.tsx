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

export default function HomePage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <CountdownTimer hours={24} label="العرض ينتهي خلال" />
      </div>
      <LandingPage />
    </>
  );
}
