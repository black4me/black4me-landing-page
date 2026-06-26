"use client";

import React from 'react';
import Image from 'next/image';
import { BookOpen, Gift, Lightbulb, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function BookPreviewSection() {
  return (
    <section id="products-section" className="section-padding bg-surface-1 border-y border-brand-white/5" dir="rtl" aria-labelledby="products-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-purple-light text-xs font-bold uppercase tracking-widest mb-3 block">ماذا ستحصل</span>
          <h2 id="products-heading" className="text-2xl md:text-4xl font-black text-white mb-4">
            حزمة شاملة تحوّل مهارتك إلى مصدر دخل حقيقي
          </h2>
        </div>

        {/* Main Product Card */}
        <div className="glass rounded-3xl overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="bg-gradient-to-br from-brand-blue/40 to-brand-black p-8 flex items-center justify-center min-h-[350px] relative">
              <div className="relative w-full aspect-[4/3] shadow-2xl rounded-xl overflow-hidden">
                <Image
                  src="/images/book-interior.png"
                  alt="من داخل كتاب بدون التسويق — محتوى عملي مع قوالب وخرائط تنفيذ"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            {/* Content Side */}
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-3 py-1 mb-4 w-fit">
                <Gift className="w-3 h-3 text-brand-gold" aria-hidden="true" />
                <span className="text-xs font-bold text-brand-gold">كتابان بسعر كتاب واحد</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-4">
                كتاب "بدون التسويق… كارثة تهدد ثروتك المستقبلية"
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                دليل عملي متكامل من 6 فصول يأخذك من فهم عقلية المشتري إلى بناء نظام مبيعات مؤتمت بالكامل. مع تمارين تفاعلية وقوالب جاهزة في كل فصل.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'فهم سلوك المشترين ذوي الدخل المرتفع وكيفية جذبهم',
                  'صياغة العرض الذي لا يُرفض (Irresistible Offer)',
                  'بناء قمع المبيعات (Sales Funnel) خطوة بخطوة',
                  'أسرار المحتوى التسويقي التحويلي',
                  'تمارين عملية تفاعلية لكل فصل',
                  'قوالب جاهزة للتطبيق الفوري',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bonus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Platform Preview */}
        <div className="mt-12 glass rounded-3xl overflow-hidden">
          <div className="p-6 pb-0 text-center">
            <h3 className="text-lg font-bold text-white mb-2">النظام التعليمي المرفق</h3>
            <p className="text-sm text-gray-300 mb-6">نظام رقمي متكامل بواجهة عربية يحتوي على 9 وحدات تعليمية وأدوات تطبيقية</p>
          </div>
          <div className="relative w-full aspect-video">
            <Image
              src="/images/platform-screenshot.png"
              alt="لقطة من النظام التعليمي — أكاديمية التسويق المتكاملة"
              fill
              className="w-full rounded-t-xl object-cover"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
