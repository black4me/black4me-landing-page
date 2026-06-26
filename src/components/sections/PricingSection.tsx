"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, X, Star } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      name: 'الكتاب الرقمي',
      subtitle: 'للراغبين في البداية',
      price: 29,
      originalPrice: 99,
      features: [
        'كتاب "بدون التسويق" — نسخة PDF',
        'التمارين التفاعلية لكل فصل',
        'تحديثات مجانية مدى الحياة',
      ],
      notIncluded: [
        'كتاب الهدية',
        'النظام التعليمي',
        'القوالب الجاهزة',
        'الاستشارة الفردية',
      ],
      cta: 'ابدأ بالكتاب',
      popular: false,
    },
    {
      name: 'الحزمة الشاملة',
      subtitle: 'الأكثر مبيعاً',
      price: 49,
      originalPrice: 199,
      features: [
        'كتاب "بدون التسويق" — نسخة PDF',
        'كتاب الهدية "10 مبادئ النجاح"',
        'النظام التعليمي الكامل (9 وحدات)',
        'القوالب والأدوات الجاهزة',
        'تحديثات مجانية مدى الحياة',
        'الوصول لمجتمع BLACK4ME',
      ],
      notIncluded: [
        'الاستشارة الفردية المباشرة',
      ],
      cta: 'احصل على الحزمة — $49',
      popular: true,
    },
    {
      name: 'الحزمة + استشارة',
      subtitle: 'للجادين في التغيير',
      price: 149,
      originalPrice: 399,
      features: [
        'كل محتويات الحزمة الشاملة',
        'جلسة استشارة فردية (60 دقيقة)',
        'تحليل شخصي لمشروعك',
        'خريطة طريق مخصصة',
        'متابعة بريدية لمدة 30 يوم',
        'أولوية في الدعم',
      ],
      notIncluded: [],
      cta: 'احجز الحزمة المتقدمة',
      popular: false,
    },
  ];

  return (
    <section id="pricing-section" className="section-padding bg-brand-black" dir="rtl" aria-labelledby="pricing-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-3 block">العرض والأسعار</span>
          <h2 id="pricing-heading" className="text-2xl md:text-4xl font-black text-white mb-4">
            اختر الخطة المناسبة لبدايتك
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            جميع الخطط تأتي مع ضمان استرداد كامل خلال 7 أيام. لا مخاطرة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch" role="list">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-6 flex flex-col ${
                plan.popular
                  ? 'glass-gold border-brand-gold/30 border-2 shadow-[0_0_40px_rgba(245,197,66,0.08)]'
                  : 'glass'
              }`}
              role="listitem"
              aria-label={`${plan.name} - ${plan.price} دولار`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-black text-[11px] font-black px-4 py-1 rounded-full" aria-label="الخطة الأكثر مبيعاً">
                  الأكثر مبيعاً ⭐
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-400">{plan.subtitle}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-sm text-gray-300 line-through" aria-label="السعر الأصلي">${plan.originalPrice}</span>
                </div>
                <span className="text-xs text-brand-green font-bold">وفّر {Math.round((1 - plan.price / plan.originalPrice) * 100)}%</span>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1" aria-label="مميزات الخطة">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
                {plan.notIncluded.map((f, j) => (
                  <li key={`not-${j}`} className="flex items-start gap-2 text-sm text-gray-300">
                    <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/checkout${plan.name === 'الحزمة + استشارة' ? '?mode=consultation' : ''}`}
                className={`w-full py-3.5 rounded-xl text-center font-bold text-sm transition-all block ${
                  plan.popular
                    ? 'cta-glow bg-brand-gold text-brand-black hover:bg-yellow-400'
                    : 'bg-brand-white/5 text-white hover:bg-brand-white/10 border border-brand-white/10'
                }`}
                aria-label={plan.cta}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
