import { MetadataRoute } from 'next';

import { supabaseAdmin } from '../lib/supabase-admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com';

  const baseRoutes = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/checkout`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/consultation`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Fetch active offers
  const { data: offers } = await supabaseAdmin
    .schema('crm')
    .from('offer_pages')
    .select('slug, updated_at')
    .eq('is_active', true);

  const offerRoutes = (offers || []).map((offer) => ({
    url: `${siteUrl}/offer/${offer.slug}`,
    lastModified: offer.updated_at ? new Date(offer.updated_at) : lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Fetch active products
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('slug, updated_at')
    .eq('is_active', true);

  const productRoutes = (products || []).map((product) => ({
    url: `${siteUrl}/product/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...baseRoutes, ...offerRoutes, ...productRoutes];
}
