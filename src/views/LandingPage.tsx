"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Sparkles, ArrowLeft, ArrowDown, Star, Lock, CreditCard, RefreshCw, Target, ShieldCheck, Headphones, Clock } from 'lucide-react';
import { trackAllPixels } from '../lib/tracking';
import { useApp } from '../context/AppContext';

import BookPreviewSection from '../components/sections/BookPreviewSection';
import BookDetails from '../components/sections/BookDetails';

// Dynamic imports for code splitting - SSR enabled for fast FCP/LCP
const ProblemSection = dynamic(() => import('../components/sections/ProblemSection'));
const HowItWorksSection = dynamic(() => import('../components/sections/HowItWorksSection'));
const PricingSection = dynamic(() => import('../components/sections/PricingSection'), { loading: () => <div className="h-[600px] w-full animate-pulse bg-gray-900 rounded-lg" /> });
const TestimonialsSection = dynamic(() => import('../components/sections/TestimonialsSection'), { loading: () => <div className="h-[400px] w-full animate-pulse bg-gray-900 rounded-lg" /> });
const GuaranteeSection = dynamic(() => import('../components/sections/GuaranteeSection'));
const FAQSection = dynamic(() => import('../components/sections/FAQSection'), { loading: () => <div className="h-[300px] w-full animate-pulse bg-gray-900 rounded-lg" /> });
const ConsultationSection = dynamic(() => import('../components/sections/ConsultationSection'));
const NewsletterSection = dynamic(() => import('../components/sections/NewsletterSection'));
const StickyMobileCTA = dynamic(() => import('../components/sections/StickyMobileCTA'));
const FinalCTA = dynamic(() => import('../components/sections/FinalCTA'), { loading: () => <div className="h-[200px] w-full animate-pulse bg-gray-900 rounded-lg" /> });
const LeadMagnet = dynamic(() => import('../components/LeadMagnet'));
const HeroVideo = dynamic(() => import('../components/sections/HeroVideo'), { ssr: false });
const ProductsSection = dynamic(() => import('../components/sections/ProductsSection'), { loading: () => <div className="h-[600px] w-full animate-pulse bg-gray-900 rounded-lg" /> });

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION — Above the fold, result-oriented
   ═══════════════════════════════════════════════════════════════ */

function HeroSection({ reviewCount, aggregateRating }: { reviewCount: number; aggregateRating: string }) {
  const { siteSettings } = useApp();

  const handleHeroCheckoutClick = () => {
    trackAllPixels('click_cta', {
      location: 'hero_primary',
      destination: '/checkout',
      value: 49,
      currency: 'USD',
    });
  };

  const handleHeroExploreClick = () => {
    trackAllPixels('view_hero', {
      location: 'hero_secondary',
      target: 'products-section',
    });
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative bg-brand-black text-brand-white pt-8 pb-0 overflow-hidden" dir="rtl">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#6C3BFF 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-brand-purple/15 blur-[140px] rounded-full pointer-events-none" aria-hidden="true" style={{ contain: 'strict' }} />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-gold/8 blur-[120px] rounded-full pointer-events-none" aria-hidden="true" style={{ contain: 'strict' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Column */}
          <div className="lg:col-span-7 py-8 lg:py-16">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-xs font-bold text-brand-purple-light">{siteSettings?.hero_badge || "+300 مشترك في النظام التسويقي"}</span>
            </div>

            {/* H1 — Result-oriented headline */}
            <h1 className="text-4xl md:text-6xl font-bold mt-6 leading-tight mb-4">
              {siteSettings?.hero_title || "بدون تسويق كارثة تهدد ثروتك المستقبلية"}
            </h1>

            <h2 className="text-xl md:text-2xl mt-4 text-gray-300 font-bold mb-6">
              {siteSettings?.hero_subtitle || "الكتاب العملي + النظام التعليمي + 6 قوالب جاهزة"}
            </h2>

            {/* Description paragraph */}
            <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-8 max-w-2xl">
              {siteSettings?.hero_support_text || "دليل بناء العروض التي لا ترفض وتحويل المهارات إلى أرباح طائلة. من تأليف جاسم محمد — مستشار التسويق الرقمي في BLACK4ME."}
            </p>

            {/* Value Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                { icon: Target, text: 'استرداد 100% خلال 7 أيام — بدون أسئلة' },
                { icon: Clock, text: 'تطبيق عملي خلال 60 يوم فقط' },
                { icon: ShieldCheck, text: 'ضمان استرداد كامل 7 أيام' },
                { icon: Headphones, text: 'دعم مباشر من المؤسس جاسم محمد' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-brand-gold" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center sm:items-start gap-3 mb-6">
              <Link
                href="/checkout"
                onClick={handleHeroCheckoutClick}
                className="cta-glow bg-brand-gold hover:bg-yellow-400 text-brand-black text-base font-black py-4 px-8 rounded-2xl transition-all duration-300 text-center flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span>احصل على الحزمة الشاملة $49 — ابدأ الآن</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <button
                onClick={handleHeroExploreClick}
                className="text-xs font-medium text-gray-400 hover:text-white underline underline-offset-4 transition-colors px-2 py-1 mx-auto sm:mx-0"
              >
                أو اطّلع على القوالب مجاناً
              </button>
            </div>

            {/* Micro Trust */}
            <div className="flex items-center gap-4 text-xs text-gray-300">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" aria-hidden="true" />
                <span>دفع آمن</span>
              </div>
              <span aria-hidden="true">•</span>
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" aria-hidden="true" />
                <span>Stripe & PayPal</span>
              </div>
              <span aria-hidden="true">•</span>
              <div className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                <span>استرداد 7 أيام</span>
              </div>
            </div>
          </div>

          {/* Book Cover Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow behind book */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-gold/10 blur-[60px] rounded-full scale-110" />
              
              {/* Book Image - no animation to prevent CLS */}
              <div className="relative flex justify-center w-full mx-auto">
                <Image
                  src={siteSettings?.hero_image || "/images/book-cover.jpg"}
                  priority={true}
                  fetchPriority="high"
                  loading="eager"
                  alt="غلاف كتاب بدون تسويق كارثة تهدد ثروتك المستقبلية - جاسم محمد"
                  width={420}
                  height={580}
                  className="drop-shadow-2xl"
                />
              </div>

              {/* Floating Badge */}
              {reviewCount > 0 && (
                <div className="absolute -bottom-4 -right-4 glass-gold rounded-2xl px-4 py-3 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1 rtl:space-x-reverse">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">{aggregateRating}/5 — {reviewCount} تقييم</p>
                  </div>
                </div>
              )}

              {/* Price Badge */}
              <div className="absolute -top-4 -left-4 bg-brand-green/90 text-white rounded-xl px-3 py-2 text-center">
                <span className="text-[10px] font-medium block line-through text-white/60">$199</span>
                <span className="text-lg font-black block leading-none">$49</span>
                <span className="text-[9px] font-bold">خصم 75%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Video — below the fold split */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-12 relative z-10">
        <HeroVideo />
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center pb-8 pt-4">
        <button 
          onClick={() => document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-gray-300 hover:text-brand-gold transition animate-bounce"
          aria-label="اكتشف المزيد"
        >
          <span className="text-xs">اكتشف المزيد</span>
          <ArrowDown className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE — Main Export
   ═══════════════════════════════════════════════════════════════ */

export default function LandingPage({ reviewCount = 0, aggregateRating = "5.0" }: { reviewCount?: number; aggregateRating?: string }) {
  React.useEffect(() => {
    trackAllPixels('view_hero', {
      location: 'landing_page',
      page: '/',
    });
  }, []);

  return (
    <>
      <HeroSection reviewCount={reviewCount} aggregateRating={aggregateRating} />
      <ProblemSection />
      <BookDetails />
      <ProductsSection />
      <HowItWorksSection />
      <BookPreviewSection />
      <PricingSection />
      <TestimonialsSection reviewCount={reviewCount} aggregateRating={aggregateRating} />
      <GuaranteeSection />
      <FAQSection />
      <FinalCTA />
      
      {/* Exit Intent / Secondary options pushed to the bottom */}
      <LeadMagnet />
      <ConsultationSection />
      <NewsletterSection />
      <StickyMobileCTA />
    </>
  );
}
