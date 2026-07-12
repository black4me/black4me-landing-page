import React from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import BlogPostClient from './BlogPostClient';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
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

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, authors(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return { title: 'مقال غير موجود | BLACK4ME' };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.subtitle || '',
    alternates: {
      canonical: post.canonical_url || `https://black4me.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.subtitle || '',
      url: `https://black4me.com/blog/${post.slug}`,
      siteName: 'BLACK4ME',
      images: [
        {
          url: post.og_image || post.featured_image || 'https://black4me.com/assets/og-default.jpg',
          width: 1200,
          height: 630,
        },
      ],
      type: 'article',
      publishedTime: post.publish_date || post.created_at,
      authors: post.authors ? [post.authors.name] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
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

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, authors(*)')
    .eq('slug', slug)
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

  // Fetch ad settings
  const { getAdSettings } = await import('@/lib/ads/getAdSettings');
  const { shouldShowAds } = await import('@/lib/ads/shouldShowAds');
  const adSettings = await getAdSettings();
  const showAds = shouldShowAds('blog_post', post, adSettings);

  // Generate structured data
  const hasVideoBlock = post.content_blocks?.find((b: any) => b.type === 'video' && b.videoUrl);
  
  const jsonLd: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.featured_image ? [post.featured_image] : [],
    datePublished: post.publish_date || post.created_at,
    dateModified: post.updated_at,
    author: [{
      '@type': 'Person',
      name: post.authors?.name || 'فريق BLACK4ME',
      url: 'https://black4me.com',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'BLACK4ME',
      logo: {
        '@type': 'ImageObject',
        url: 'https://black4me.com/assets/logo.png',
      },
    },
    description: post.meta_description || post.subtitle || '',
  };

  const videoJsonLd: any = hasVideoBlock ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: post.title,
    description: post.meta_description || post.subtitle || post.title,
    thumbnailUrl: [post.og_image || post.featured_image || 'https://black4me.com/assets/video-thumb.jpg'],
    uploadDate: post.publish_date || post.created_at,
    contentUrl: hasVideoBlock.videoUrl,
    embedUrl: hasVideoBlock.videoUrl,
  } : null;

  return (
    <div className="bg-[#0a0a0c] min-h-screen flex flex-col font-sans" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {videoJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
        />
      )}
      <main className="flex-1">
        <BlogPostClient post={post} products={products || []} adSettings={showAds ? adSettings : null} />
      </main>
    </div>
  );
}
