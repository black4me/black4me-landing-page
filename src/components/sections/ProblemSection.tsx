"use client";

import React from 'react';
import { useApp } from '../../context/AppContext';

export default function ProblemSection() {
  return (
    <section id="problem-section" className="section-padding bg-surface-1 border-y border-brand-white/5" dir="rtl">
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-brand-red text-xs font-bold uppercase tracking-widest mb-4 block">المشكلة الحقيقية</span>
        <h2 className="text-2xl md:text-4xl font-black text-white mb-6">
          تملك مهارة ممتازة… لكن لا أحد يشتري منك؟
        </h2>
        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-12">
          90% من أصحاب المهارات والمشاريع الصغيرة يخسرون آلاف الدولارات شهرياً — ليس لأن منتجهم سيء، بل لأنهم يفتقدون نظام تسويقي يعمل بشكل مؤتمت ويحوّل المشاهدات إلى عملاء يدفعون.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: '😤',
              title: 'ملاحقة بدون نتيجة',
              desc: 'ترسل مئات الرسائل يومياً وتنشر محتوى عشوائي لكن لا أحد يتحول إلى عميل حقيقي.',
            },
            {
              emoji: '💸',
              title: 'أسعار منخفضة تأكل أرباحك',
              desc: 'تتنازل في السعر لجذب أي عميل، فتنتهي بربح ضعيف وعمل مرهق لا يستحق الجهد.',
            },
            {
              emoji: '🔄',
              title: 'دوران بلا تقدم',
              desc: 'تعمل 12+ ساعة يومياً لكن الدخل الشهري لا يتغير. لا نظام، لا استقرار، لا نمو.',
            },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-6 text-center hover:border-brand-red/20 transition-all group">
              <span className="text-4xl mb-4 block">{item.emoji}</span>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
