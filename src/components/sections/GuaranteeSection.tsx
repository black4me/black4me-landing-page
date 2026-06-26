"use client";

import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function GuaranteeSection() {
  return (
    <section className="section-padding bg-brand-black" dir="rtl">
      <div className="max-w-3xl mx-auto text-center">
        <div className="glass-gold rounded-3xl p-8 md:p-12">
          <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-brand-gold" />
          </div>
          <h2 className="text-xl md:text-3xl font-black text-white mb-4">
            ضمان استرداد كامل — بدون أي شروط معقدة
          </h2>
          <p className="text-gray-400 leading-relaxed mb-6 max-w-xl mx-auto">
            إذا اشتريت الحزمة ولم تجد فيها قيمة حقيقية خلال 7 أيام، أرسل لنا بريد إلكتروني واحد وسنُعيد لك كامل المبلغ فوراً — بدون أسئلة وبدون إجراءات معقدة. <strong className="text-white">نحن واثقون من جودة المحتوى.</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-green" /> استرداد كامل 100%</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-green" /> خلال 7 أيام</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-green" /> بدون أسئلة</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-green" /> بريد إلكتروني واحد</span>
          </div>
        </div>
      </div>
    </section>
  );
}
