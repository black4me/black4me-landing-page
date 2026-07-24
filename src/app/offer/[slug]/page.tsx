import { notFound } from 'next/navigation';
import { getOfferBySlug } from '../../../server/actions/offers';
import OfferPageClient from './OfferPageClient';

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const offer = await getOfferBySlug(slug);

  if (!offer) {
    return {
      title: 'عرض غير متوفر | BLACK4ME',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com';
  const url = `${siteUrl}/offer/${slug}`;
  const title = `${offer.title} | BLACK4ME`;
  const description = offer.description || 'احصل على هذا العرض الحصري من BLACK4ME.';

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
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
  }>;
}

export default async function OfferPage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;
  const offer = await getOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  return (
    <OfferPageClient 
      offer={offer}
      utmSource={searchParams.utm_source}
      utmMedium={searchParams.utm_medium}
      utmCampaign={searchParams.utm_campaign}
      utmContent={searchParams.utm_content}
      utmTerm={searchParams.utm_term}
    />
  );
}
