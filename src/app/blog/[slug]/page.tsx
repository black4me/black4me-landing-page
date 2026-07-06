import React from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import BlogPostClient from './BlogPostClient';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
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

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    notFound();
  }

  // Fetch products to hydrate the product blocks
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);

  return (
    <div className="bg-[#0a0a0c] min-h-screen flex flex-col font-sans" dir="rtl">
      <Navbar />
      <main className="flex-1">
        <BlogPostClient post={post} products={products || []} />
      </main>
      <Footer />
    </div>
  );
}
