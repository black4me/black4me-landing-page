"use client";

import React from 'react';
import { Target, TrendingDown, Clock, AlertTriangle } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      icon: Target,
      title: 'ملاحقة بدون نتيجة',
      desc: 'ترسل مئات الرسائل يومياً وتنشر محتوى عشوائي لكن لا أحد يتحول إلى عميل حقيقي.',
      color: 'from-orange-500/20 to-red-500/20',
      iconColor: 'text-orange-500',
      borderColor: 'group-hover:border-orange-500/50'
    },
    {
      icon: TrendingDown,
      title: 'أسعار منخفضة تأكل أرباحك',
      desc: 'تتنازل في السعر لجذب أي عميل، فتنتهي بربح ضعيف وعمل مرهق لا يستحق الجهد.',
      color: 'from-red-500/20 to-rose-500/20',
      iconColor: 'text-red-500',
      borderColor: 'group-hover:border-red-500/50'
    },
    {
      icon: Clock,
      title: 'دوران بلا تقدم',
      desc: 'تعمل 12+ ساعة يومياً لكن الدخل الشهري لا يتغير. لا نظام، لا استقرار، لا نمو.',
      color: 'from-rose-500/20 to-pink-500/20',
      iconColor: 'text-rose-500',
      borderColor: 'group-hover:border-rose-500/50'
    },
  ];

  return (
    <section id="problem-section" className="section-padding bg-brand-black border-y border-brand-white/5 relative overflow-hidden" dir="rtl" aria-labelledby="problem-heading">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-brand-red/10 border border-brand-red/20 mb-6">
          <AlertTriangle className="w-4 h-4 text-brand-red" />
          <span className="text-brand-red text-xs font-bold uppercase tracking-widest">المشكلة الحقيقية</span>
        </div>
        
        <h2 id="problem-heading" className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
          تملك مهارة ممتازة... <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-red to-orange-500">لكن لا أحد يشتري منك؟</span>
        </h2>
        
        <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-16">
          90% من أصحاب المهارات والمشاريع الصغيرة يخسرون آلاف الدولارات شهرياً — ليس لأن منتجهم سيء، بل لأنهم يفتقدون نظام تسويقي يعمل بشكل مؤتمت ويحوّل المشاهدات إلى عملاء يدفعون.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative" role="list">
          {/* Connector Line behind cards */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-brand-red/20 to-transparent -translate-y-1/2 z-0" />

          {problems.map((item, i) => (
            <div key={i} className={`relative z-10 bg-[#0F0F0F]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 text-center transition-all duration-500 group ${item.borderColor} hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]`} role="listitem">
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-inner`}>
                <item.icon className={`w-8 h-8 ${item.iconColor}`} aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l group-hover:from-white group-hover:to-gray-400 transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
