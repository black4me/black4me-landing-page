import type { Metadata } from 'next';
import LandingPage from '../views/LandingPage';

export const metadata: Metadata = {
  title: 'BLACK4ME — نظام تسويق يجلب لك 20 عميل شهرياً | جاسم محمد',
  description: 'احصل على الحزمة الشاملة لبناء نظام تسويق رقمي متكامل: كتاب عملي + نظام تعليمي + قوالب جاهزة + استشارة خاصة. ابدأ بـ $49 فقط مع ضمان استرداد كامل.',
  alternates: {
    canonical: 'https://www.black4me.com',
  },
};

export default function HomePage() {
  return <LandingPage />;
}
