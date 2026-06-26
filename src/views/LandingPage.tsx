"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Sparkles, ArrowLeft, ArrowDown, Star, Lock, CreditCard, RefreshCw, Target, ShieldCheck, Headphones, Clock } from 'lucide-react';

// Dynamic imports for split sections - reduces initial bundle
const ProblemSection = dynamic(() => import('../components/sections/ProblemSection'), { ssr: false });
const HowItWorksSection = dynamic(() => import('../components/sections/HowItWorksSection'), { ssr: false });
const BookPreviewSection = dynamic(() => import('../components/sections/BookPreviewSection'), { ssr: false });
const PricingSection = dynamic(() => import('../components/sections/PricingSection'), { ssr: false });
const TestimonialsSection = dynamic(() => import('../components/sections/TestimonialsSection'), { ssr: false });
const GuaranteeSection = dynamic(() => import('../components/sections/GuaranteeSection'), { ssr: false });
const FAQSection = dynamic(() => import('../components/sections/FAQSection'), { ssr: false });
const ConsultationSection = dynamic(() => import('../components/sections/ConsultationSection'), { ssr: false });
const NewsletterSection = dynamic(() => import('../components/sections/NewsletterSection'), { ssr: false });
const StickyMobileCTA = dynamic(() => import('../components/sections/StickyMobileCTA'), { ssr: false });
const FinalCTA = dynamic(() => import('../components/sections/FinalCTA'), { ssr: false });

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION — Above the fold, result-oriented
   ═══════════════════════════════════════════════════════════════ */

function HeroSection() {
  return (
    <section id="hero" className="relative bg-brand-black text-brand-white pt-8 pb-0 overflow-hidden" dir="rtl">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#6C3BFF 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-brand-purple/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-brand-gold/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[80vh]">
          
          {/* Text Column */}
          <div className="lg:col-span-7 py-8 lg:py-16">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-purple/10 border border-brand-purple/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-xs font-bold text-brand-purple-light">+300 مشترك في النظام التسويقي</span>
            </div>

            {/* H1 — Result-oriented headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-black leading-[1.15] mb-6">
              <span className="block">أبني لك نظام تسويق يجلب</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-l from-brand-gold via-brand-gold to-brand-purple drop-shadow-[0_2px_15px_rgba(245,197,66,0.15)]">
                20 عميل مؤكد شهرياً
              </span>
              <span className="block text-2xl sm:text-3xl md:text-3xl mt-2 text-gray-300 font-bold">
                خلال 60 يوم — ضمان استرداد أو عمل مجاني حتى تحقق النتيجة.
              </span>
            </h1>

            {/* Description paragraph */}
            <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-8 max-w-2xl">
              حزمة متكاملة تجمع كتاب عملي + نظام تعليمي رقمي + قوالب تسويقية جاهزة + استشارة فردية مباشرة — كل ما تحتاجه لتحوّل مهارتك إلى مصدر دخل مستقر بدون ملاحقة العملاء.
            </p>

            {/* Value Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                { icon: Target, text: 'نتيجة مضمونة: 20 عميل أو استرداد' },
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
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/checkout"
                className="cta-glow bg-brand-gold hover:bg-yellow-400 text-brand-black text-base font-black py-4 px-8 rounded-2xl transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                <span>احصل على الحزمة الشاملة $49 — ابدأ الآن</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <button
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent border border-brand-white/15 hover:border-brand-purple/40 text-white text-sm font-bold py-4 px-6 rounded-2xl transition-all text-center hover:bg-brand-white/5"
              >
                اطّلع على القوالب مجاناً
              </button>
            </div>

            {/* Micro Trust */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>دفع آمن</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                <span>Stripe & PayPal</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                <span>استرداد 7 أيام</span>
              </div>
            </div>
          </div>

          {/* Book Cover Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow behind book */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-gold/10 blur-[60px] rounded-full scale-110" />
              
              {/* Book Image */}
              <div className="relative animate-float w-full max-w-[450px] aspect-[4/5] mx-auto">
                <Image
                  src="/images/book-cover.png"
                  alt="كتاب بدون التسويق كارثة تهدد ثروتك المستقبلية — تأليف جاسم محمد"
                  fill
                  className="drop-shadow-2xl object-cover rounded-2xl"
                  priority
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 glass-gold rounded-2xl px-4 py-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1 rtl:space-x-reverse">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">4.9/5 — 127 تقييم</p>
                </div>
              </div>

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

      {/* Scroll Indicator */}
      <div className="flex justify-center pb-8 pt-4">
        <button 
          onClick={() => document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-brand-gold transition animate-bounce"
          aria-label="اكتشف المزيد"
        >
          <span className="text-[10px]">اكتشف المزيد</span>
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LANDING PAGE — Main Export
   ═══════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  // Product Schema (JSON-LD)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "بدون التسويق كارثة",
    "image": [
      "https://www.black4me.com/images/book-cover.png"
    ],
    "description": "دليل عملي لبناء نظام تسويق رقمي متكامل وتحويل المهارات إلى أرباح.",
    "brand": {
      "@type": "Brand",
      "name": "BLACK4ME"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://www.black4me.com",
      "priceCurrency": "USD",
      "price": "49.00",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      
      {/* Trust Banner */}
      <div className="bg-gradient-to-l from-brand-purple to-brand-purple/90 text-white text-center py-2.5 text-xs font-bold sticky top-[64px] z-40 flex items-center justify-center gap-1.5 px-4" dir="rtl">
        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
        <span>🔥 عرض محدود: الحزمة الشاملة بـ $49 بدلاً من $199 — وفّر 75% اليوم!</span>
      </div>

      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <BookPreviewSection />
      <PricingSection />
      <TestimonialsSection />
      <GuaranteeSection />
      <FAQSection />
      <ConsultationSection />
      <FinalCTA />
      <NewsletterSection />
      <StickyMobileCTA />
    </>
  );
}
