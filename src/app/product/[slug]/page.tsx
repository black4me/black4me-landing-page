import React from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ProductDetailsClient from './ProductDetailsClient';

export default async function ProductPage({ params }: { params: { slug: string } }) {
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

  const { data: product } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .eq('slug', params.slug)
    .eq('is_active', true)
    .single();

  if (!product) {
    notFound();
  }

  const { data: reviews } = await supabase
    .from('product_reviews')
    .select('*')
    .eq('product_id', product.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  return (
    <div className="bg-brand-black min-h-screen">
      <ProductDetailsClient product={product} initialReviews={reviews || []} />
    </div>
  );
}
