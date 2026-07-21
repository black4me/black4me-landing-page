import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getOfferBySlug } from '../../../server/actions/offers';
import DynamicOfferForm from '../../../components/DynamicOfferForm';
import CountdownTimer from '../../../components/CountdownTimer';

export const revalidate = 0; // Dynamic route

export default async function OfferPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params.slug;
  const offer = await getOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  // Check if timer expired
  const now = new Date().getTime();
  const timerEnd = offer.timer_end ? new Date(offer.timer_end).getTime() : null;
  const isExpired = offer.enable_timer && timerEnd && now > timerEnd;

  return (
    <div className="min-h-screen bg-brand-black flex flex-col justify-center items-center py-16 px-4" dir="rtl">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-gold/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-surface-2/80 p-8 md:p-12 rounded-3xl border border-white/5 backdrop-blur-xl shadow-2xl">
        
        {/* Visual/Image Column */}
        <div className="relative order-2 md:order-1 flex justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/20 to-brand-purple/20 blur-[60px] rounded-full" />
          <div className="relative animate-float">
            <Image
              src={offer.image_url || "/images/book-cover.jpg"}
              alt={offer.title}
              width={500}
              height={500}
              className="rounded-2xl shadow-2xl object-cover"
              priority
            />
          </div>
        </div>

        {/* Content Column */}
        <div className="order-1 md:order-2 space-y-6">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {offer.title}
          </h1>
          
          {offer.subtitle && (
            <h2 className="text-xl text-brand-gold font-bold">
              {offer.subtitle}
            </h2>
          )}

          {offer.description && (
            <p className="text-gray-300 leading-relaxed text-lg">
              {offer.description}
            </p>
          )}

          {offer.enable_timer && offer.timer_end && !isExpired && (
            <div className="py-4 border-y border-white/10 my-6">
              <CountdownTimer 
                hours={0} 
                targetDate={offer.timer_end} 
                label="ينتهي العرض في:"
              />
            </div>
          )}

          {isExpired ? (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
              <h3 className="text-2xl font-bold mb-2">عذراً، لقد انتهى هذا العرض!</h3>
              <p>نرجو متابعتنا للحصول على عروض قادمة قريباً.</p>
            </div>
          ) : (
            <div className="pt-4">
              <DynamicOfferForm offer={offer} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
