"use client";

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ConsultationSection() {
  return (
    <section id="consultations-section" className="section-padding bg-brand-black" dir="rtl" aria-labelledby="consultation-heading">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-3 block">للجادين فقط</span>
            <h2 id="consultation-heading" className="text-2xl md:text-3xl font-black text-white mb-4">
              استشارة استراتيجية فردية مع جاسم محمد
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              جلسة مباشرة مدتها 60 دقيقة نحلل فيها مسار عملك التسويقي بالكامل، نحدد الثغرات، ونبني لك خريطة طريق مخصصة للنمو. تشمل متابعة بريدية لمدة 30 يوم بعد الجلسة.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'تحليل شامل لوضعك التسويقي الحالي',
                'بناء خريطة طريق مخصصة لمشروعك',
                'تحديد أولويات التنفيذ والميزانية',
                'متابعة ودعم لمدة 30 يوم',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/checkout?mode=consultation"
              className="inline-flex items-center gap-2 bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-brand-purple/20"
              aria-label="احجز استشارتك — $149"
            >
              <span>احجز استشارتك — $149</span>
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="glass rounded-3xl p-8 text-center">
            <div className="w-20 h-20 bg-brand-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-brand-gold" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">جلسة 1-على-1</h3>
            <p className="text-sm text-gray-300 mb-4">مع المؤسس جاسم محمد شخصياً</p>
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-3xl font-black text-white">$149</span>
              <span className="text-sm text-gray-300 line-through" aria-label="السعر الأصلي">$399</span>
            </div>
            <span className="text-xs text-gray-300">متضمنة في الحزمة المتقدمة</span>
          </div>
        </div>
      </div>
    </section>
  );
}
