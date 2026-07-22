import React from 'react';
import Link from 'next/link';
import { CheckCircle, Home, Download, Mail } from 'lucide-react';
import { getOfferPageBySlug } from '../../../../server/actions/crm';

interface ThankYouPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default async function Page({ params }: ThankYouPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const offer = await getOfferPageBySlug(slug);

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
          <p className="text-sm text-gray-400 leading-relaxed font-light flex items-start gap-2">
            <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
            <span>يرجى التحقق من بريدك الإلكتروني في غضون دقائق، ستجد رسالة تحتوي على رابط التحميل المباشر وتفاصيل الوصول.</span>
          </p>
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition font-bold text-sm text-white flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>
          {offer?.redirect_url && (
            <a
              href={offer.redirect_url}
              className="flex-1 py-3 px-4 rounded-xl bg-brand-gold hover:bg-yellow-400 transition font-bold text-sm text-black flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الهدية مباشرة</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
