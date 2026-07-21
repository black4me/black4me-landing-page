'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, Download, Mail, ArrowLeft } from 'lucide-react';
import * as tracking from '@/lib/tracking';

function SuccessContent() {
  const searchParams = useSearchParams();
  const isGift = searchParams.get('gift') === 'true';
  const { siteSettings } = useApp();

  const downloadUrl = siteSettings?.lead_magnet_file_url || 'https://drive.google.com/drive/folders/14-SIzFYoOu7uIqs4qDNbQF-IrRlG8ker?usp=sharing';

  React.useEffect(() => {
    if (isGift) {
      tracking.trackEvent('CompleteRegistration', { content_name: 'Lead Magnet Registration' });
    } else {
      tracking.trackEvent('Purchase', { cart_value: 49, currency: 'USD' });
    }
  }, [isGift]);

  if (isGift) {
    return (
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-brand-green/10 text-brand-green rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg shadow-brand-green/10">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        
        <h1 className="text-white text-3xl md:text-5xl font-black mb-6 leading-tight">
          تهانينا! 🎉<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-gold to-brand-gold-dark">هديتك المجانية جاهزة</span>
        </h1>

        <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
          تم إرسال رابط تحميل الكتاب الإلكتروني أيضاً إلى بريدك الإلكتروني بنجاح. يمكنك أيضاً تحميله مباشرة من الرابط أدناه الآن.
        </p>

        <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-8 mb-8 text-center shadow-lg">
          <h3 className="text-lg font-bold text-white mb-2">📥 تحميل فوري ومباشر</h3>
          <p className="text-xs text-gray-500 mb-6">اضغط على الزر أدناه لتحميل كتاب "بدون تسويق كارثة" بصيغة PDF مباشرة من مجلد Google Drive.</p>
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-brand-gold hover:bg-yellow-400 text-brand-black font-black rounded-2xl transition-all duration-300 shadow-[0_4px_12px_rgba(245,197,66,0.3)] hover:scale-105"
          >
            <Download className="w-5 h-5" />
            <span>تحميل كتاب الهدية الآن</span>
          </a>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <Link href="/" className="text-gray-500 hover:text-white transition text-sm flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  // Default success page (for paid product purchase)
  return (
    <div className="text-center max-w-lg">
      <div className="text-7xl mb-6">🎉</div>
      <h1 className="text-white text-3xl font-bold mb-4">
        مبروك! حزمتك في طريقها إليك
      </h1>
      <p className="text-gray-400 text-lg mb-8">
        تم إرسال رابط التحميل لبريدك الإلكتروني — تحقق من صندوق الوارد أو Spam
      </p>
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 mb-6">
        <p className="text-brand-gold font-semibold mb-2">ماذا ستجد في إيميلك؟</p>
        <ul className="text-gray-300 text-sm space-y-2 text-right">
          <li>📖 رابط تحميل الكتاب PDF (81 صفحة)</li>
          <li>📋 6 قوالب جاهزة للاستخدام الفوري</li>
          <li>🎓 رابط النظام التعليمي الكامل</li>
          <li>📅 رابط حجز الاستشارة الفردية</li>
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <a
          href="mailto:black4mestore@gmail.com"
          className="bg-brand-gold hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl transition"
        >
          لم يصلك الإيميل؟ تواصل معنا
        </a>
        <Link href="/" className="text-gray-500 hover:text-white transition text-sm">
          ← العودة للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12" dir="rtl">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
