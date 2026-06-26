"use client";

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const { testimonials } = useApp();

  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    { id: '1', customerName: 'فيصل الشمري', country: 'السعودية', rating: 5, comment: 'قرأت مئات الكتب في التسويق لكن هذا الكتاب يقدم خريطة عملية مبنية للسوق الخليجي. خلال 45 يوم بدأت أستقبل عملاء من نظام الفنل بشكل يومي.', isApproved: true, createdAt: '' },
    { id: '2', customerName: 'مريم الصايغ', country: 'الإمارات', rating: 5, comment: 'محتوى استثنائي ومرتب بعناية. النظام التعليمي المرفق وفّر عليّ شهور من التعلم العشوائي. أنصح بشدة لكل صاحب مشروع صغير.', isApproved: true, createdAt: '' },
    { id: '3', customerName: 'عبدالرحمن الكواري', country: 'قطر', rating: 5, comment: 'الكتاب فتح عيني على ثغرات خطيرة في عملي. جلسة الاستشارة مع جاسم كانت نقطة تحول حقيقية. دخلي تضاعف 3 مرات في 90 يوم.', isApproved: true, createdAt: '' },
  ];

  return (
    <section id="testimonials-section" className="section-padding bg-surface-1 border-y border-brand-white/5" dir="rtl" aria-labelledby="testimonials-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-3 block">آراء العملاء</span>
          <h2 id="testimonials-heading" className="text-2xl md:text-4xl font-black text-white mb-4">
            نتائج حقيقية من عملاء حقيقيين
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list" aria-label="شهادات العملاء">
          {displayTestimonials.slice(0, 3).map((t) => (
            <div key={t.id} className="glass rounded-2xl p-6 hover:border-brand-gold/15 transition-all" role="listitem">
              <div className="flex gap-0.5 mb-4" aria-label={`تقييم ${t.rating} من 5 نجوم`}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" aria-hidden="true" />
                ))}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-6 min-h-[80px]">
                &quot;{t.comment}&quot;
              </p>
              <div className="flex items-center gap-3 border-t border-brand-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-sm font-bold text-brand-purple-light" aria-hidden="true">
                  {t.customerName.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">{t.customerName}</span>
                  <span className="text-xs text-gray-400">{t.country}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
