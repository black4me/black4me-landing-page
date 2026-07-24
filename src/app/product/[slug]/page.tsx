import React from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ProductDetailsClient from './ProductDetailsClient';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
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

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .eq(isUuid ? 'id' : 'slug', slug)
    .eq('is_active', true)
    .single();

  if (!product) {
    notFound();
  }

  const { data: reviews } = await supabase
    .from('testimonials')
    .select('*')
    .eq('product_id', product.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return (
    <div className="bg-brand-black min-h-screen">
      <ProductDetailsClient product={product} initialReviews={reviews || []} />
    </div>
  );
}
