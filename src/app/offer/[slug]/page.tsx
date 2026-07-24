import { notFound } from 'next/navigation';
import { getOfferBySlug } from '../../../server/actions/offers';
import OfferPageClient from './OfferPageClient';

export const dynamic = 'force-dynamic';

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
