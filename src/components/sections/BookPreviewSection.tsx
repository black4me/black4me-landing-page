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

        {/* Infographic Preview Image */}
        <div className="relative w-full mb-12 rounded-[1rem] overflow-hidden border border-brand-white/10 shadow-2xl bg-brand-black flex justify-center">
          {siteSettings?.book_preview_image ? (
            <img 
              src={siteSettings.book_preview_image} 
              alt="من داخل الكتاب والنظام" 
              className="w-full max-w-[600px] aspect-video object-contain mix-blend-lighten mx-auto rounded-xl block overflow-hidden" 
            />
          ) : (
            <div className="w-full aspect-[4/3] md:aspect-[21/9] bg-[#050505] flex items-center justify-center">
              <div className="text-center text-gray-500 p-8 border border-dashed border-gray-700 rounded-2xl mx-4">
                <p className="text-lg font-bold mb-2">مكان صورة العرض الشامل</p>
                <p className="text-sm">قم برفع الصورة من لوحة التحكم (إعدادات الموقع - Book Preview Image)</p>
              </div>
            </div>
          )}
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
              <h4 className="text-sm font-bold text-white mb-1">{bonus.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{bonus.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
