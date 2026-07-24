import React from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ProductDetailsClient from './ProductDetailsClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);
  
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
    .select('name, description, image_url')
    .eq(isUuid ? 'id' : 'slug', slug)
    .single();

  if (!product) {
    return {
      title: 'المنتج غير متوفر | BLACK4ME',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com';
  const url = `${siteUrl}/product/${slug}`;
  const title = `${product.name} | BLACK4ME`;
  const description = product.description || 'اكتشف هذا المنتج المميز من BLACK4ME.';
  const imageUrl = product.image_url || `${siteUrl}/images/book-cover.jpg`;

  return {
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
          url: imageUrl,
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
      images: [imageUrl],
    },
  };
}

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
