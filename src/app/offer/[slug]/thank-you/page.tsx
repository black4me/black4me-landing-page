"use client";

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CheckCircle, Home, Calendar, BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import { getOfferPageBySlug } from '../../../../server/actions/crm';

interface ThankYouPageProps {
  params: Promise<{ slug: string }>;
}

export default function ThankYouPage({ params }: ThankYouPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOfferPageBySlug(slug)
      .then(res => {
        setOffer(res);
      })
      .catch(() => {
        // Fallback or ignore
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleCtaClick = (target: string) => {
    import('@/lib/tracking').then(tracking => {
      tracking.trackEvent('ThankYouOfferClicked' as any, {
        offer_slug: slug,
        target_cta: target
      });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-gray-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-xl w-full text-center bg-[#0e0e12] border border-white/5 p-8 sm:p-12 rounded-3xl shadow-2xl relative z-10 space-y-6">
        
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white">شكراً لك!</h1>
          <p className="text-brand-gold font-bold">تم تسجيل اشتراكك بنجاح</p>
        </div>

        {/* Details Card */}
        <div className="bg-[#121217] border border-white/5 rounded-2xl p-6 text-right space-y-4">
          <h3 className="font-bold text-white text-base">تفاصيل طلبك:</h3>
          <p className="text-sm text-gray-400 leading-relaxed font-light">
            لقد تم حجز نسختك بنجاح من: <strong className="text-white font-medium">{offer?.title || 'الهدية الخاصة بك'}</strong>.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed font-light">
            📧 يرجى التحقق من بريدك الإلكتروني الآن، ستجد رسالة تحتوي على رابط التحميل المباشر وتفاصيل الوصول.
          </p>
        </div>

        {/* Dynamic Next Step (Upsell Offer) */}
        <div className="border-t border-white/5 pt-6 space-y-4 text-right">
          <span className="text-xs text-brand-gold font-black uppercase tracking-wider">🎯 الخطوة التالية المقترحة:</span>
          <h4 className="text-lg font-bold text-white">هل تريد تسريع النتائج وتنظيم تسويق مشروعك؟</h4>
          
          <div className="space-y-3">
            {/* Primary CTA: Consultation */}
            <Link
              href="/consultation"
              onClick={() => handleCtaClick('consultation')}
              className="w-full py-4 px-6 rounded-2xl bg-brand-gold hover:bg-yellow-400 text-black font-black text-base flex items-center justify-between transition-all shadow-lg shadow-brand-gold/5 transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 shrink-0" />
                <div className="text-right">
                  <span className="block font-bold">احجز استشارتك التسويقية الفورية</span>
                  <span className="block text-xs font-normal opacity-85">جلسة تشخيصية مباشرة لمدة 60 دقيقة</span>
                </div>
              </div>
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* Secondary CTA: Bundle */}
            <Link
              href="/product/black-digital-marketing-bundle"
              onClick={() => handleCtaClick('bundle')}
              className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 shrink-0 text-brand-gold" />
                <span>اكتشف الباقة المتكاملة للتسويق الرقمي الذكي</span>
              </div>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="pt-4 border-t border-white/5 flex justify-center">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-white transition flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
