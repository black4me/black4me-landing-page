import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إتمام الشراء',
  description: 'أكمل عملية الشراء للحصول على الحزمة الشاملة من BLACK4ME. دفع آمن عبر Stripe أو PayPal مع ضمان استرداد كامل.',
  alternates: {
    canonical: 'https://www.black4me.com/checkout',
  },
  openGraph: {
    title: 'إتمام الشراء | BLACK4ME',
    description: 'أكمل عملية الشراء للحصول على الحزمة الشاملة من BLACK4ME مقابل $49 مع دفع آمن وضمان استرداد.',
    url: 'https://www.black4me.com/checkout',
  },
  twitter: {
    title: 'إتمام الشراء | BLACK4ME',
    description: 'أكمل عملية الشراء للحصول على الحزمة الشاملة من BLACK4ME مقابل $49 مع دفع آمن وضمان استرداد.',
  },
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
