import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إتمام الشراء',
  description: 'أكمل عملية الشراء للحصول على الحزمة الشاملة من BLACK4ME. دفع آمن عبر Stripe أو PayPal مع ضمان استرداد كامل.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
