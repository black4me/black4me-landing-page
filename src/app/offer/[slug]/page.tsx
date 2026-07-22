import React from 'react';
import { notFound } from 'next/navigation';
import { getOfferPageBySlug } from '../../../server/actions/crm';
import OfferPageClient from './OfferPageClient';

interface OfferPageProps {
  params: Promise<{ slug: string }> | { slug: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: OfferPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const resolvedSearchParams = await searchParams;
  const utmSource = typeof resolvedSearchParams.utm_source === 'string' ? resolvedSearchParams.utm_source : undefined;
  const utmMedium = typeof resolvedSearchParams.utm_medium === 'string' ? resolvedSearchParams.utm_medium : undefined;
  const utmCampaign = typeof resolvedSearchParams.utm_campaign === 'string' ? resolvedSearchParams.utm_campaign : undefined;

  const offer = await getOfferPageBySlug(slug);

  if (!offer || !offer.is_active) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#070709] text-gray-200" dir="rtl">
      <OfferPageClient 
        offer={offer} 
        utmSource={utmSource}
        utmMedium={utmMedium}
        utmCampaign={utmCampaign}
      />
    </div>
  );
}
