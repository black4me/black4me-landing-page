import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ConsultationClient from './ConsultationClient';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com';
const title = 'استشارة خاصة مع جاسم محمد | BLACK4ME';
const description = 'جلسة استشارية تشخيصية لمدة 60 دقيقة نركز فيها على وضع مشروعك والتسويق والأتمتة.';
const url = `${siteUrl}/consultation`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/book-cover.jpg`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`${siteUrl}/images/book-cover.jpg`],
  },
};

export default async function ConsultationPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: reviews } = await supabase
    .from('testimonials')
    .select('*')
    .eq('service_type', 'consultation')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return <ConsultationClient initialReviews={reviews || []} />;
}
