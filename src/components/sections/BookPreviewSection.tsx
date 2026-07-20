"use client";

import React from 'react';
import Image from 'next/image';
import { BookOpen, Lightbulb, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function BookPreviewSection() {
  const { siteSettings } = useApp();

  return (
    <section id="products-section" className="section-padding bg-surface-1 border-y border-brand-white/5" dir="rtl" aria-labelledby="products-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-purple-light text-xs font-bold uppercase tracking-widest mb-3 block">ماذا ستحصل</span>
          <h2 id="products-heading" className="text-2xl md:text-4xl font-black text-white mb-4">
            حزمة شاملة تحوّل مهارتك إلى مصدر دخل حقيقي
          </h2>
        </div>

        {/* Infographic Preview Image & Map */}
        <div className="relative w-full mb-12 rounded-[2rem] overflow-hidden border border-brand-white/10 shadow-2xl bg-brand-black p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Features Map */}
            <div className="space-y-8 order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-black text-white">
                خريطة محتويات <span className="text-brand-gold">النظام الشامل</span>
              </h3>
              
              <div className="space-y-6">
                {[
                  { title: 'الأساسيات الاستراتيجية', desc: 'بناء العقلية وتحديد الأهداف بوضوح قبل الانطلاق لضمان نتائج حقيقية' },
                  { title: 'كتاب "بدون التسويق كارثة"', desc: 'دليلك الشامل لمعرفة أسرار بناء الثروة من خلال التسويق الرقمي الفعال' },
                  { title: 'بناء مسار المبيعات (Sales Funnel)', desc: 'نظام خطوة بخطوة لتحويل الزوار العابرين إلى عملاء دائمين ومستمرين' },
                  { title: 'أدوات ونماذج تطبيقية جاهزة', desc: 'قوالب ونماذج قابلة للتعديل والنسخ توفر عليك مئات الساعات من العمل' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold shrink-0 mt-0.5 group-hover:bg-brand-gold group-hover:text-brand-black transition-colors">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Preview */}
            <div className="order-1 lg:order-2 flex justify-center items-center w-full">
              <div className="relative w-full max-w-[700px] space-y-6">
                {/* Book Cover */}
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-brand-white/10 bg-white">
                  <Image
                    src={siteSettings?.book_preview_image || '/images/book-preview.png'}
                    alt="كتاب بدون تسويق كارثة — من داخل الكتاب"
                    width={700}
                    height={700}
                    className="w-full h-auto drop-shadow-2xl"
                    priority
                    unoptimized
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Bonus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            {
              icon: BookOpen,
              title: 'كتاب هدية مجانية',
              desc: '"10 مبادئ للنجاح المالي والشخصي" — بقلم جاسم محمد',
              value: '$29',
            },
            {
              icon: Lightbulb,
              title: 'نظام تعليمي متكامل',
              desc: '9 وحدات تعليمية + قوالب + أدوات احترافية جاهزة',
              value: '$99',
            },
            {
              icon: MessageSquare,
              title: 'استشارة فردية مباشرة',
              desc: 'جلسة خاصة مع المؤسس لتحليل مسارك وتعديل استراتيجيتك',
              value: '$150',
            },
          ].map((bonus, i) => (
            <div key={i} className="glass rounded-2xl p-5 hover:border-brand-gold/20 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
                  <bonus.icon className="w-5 h-5 text-brand-purple-light" aria-hidden="true" />
                </div>
                <span className="text-xs font-mono font-bold text-gray-300 line-through">قيمتها {bonus.value}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{bonus.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{bonus.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
