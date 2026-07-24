import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ConsultationClient from './ConsultationClient';

export const metadata: Metadata = {
  title: 'استشارة تسويقية | BLACK4ME',
  description: 'احجز جلسة استشارية مع الأستاذ جاسم محمد — خطة تسويق مخصصة لمشروعك في 60 دقيقة',
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
