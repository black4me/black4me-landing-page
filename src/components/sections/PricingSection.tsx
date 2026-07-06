"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, X, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PricingSection() {
  const { products } = useApp();

  // If no products loaded yet, or empty
  if (!products || products.length === 0) return null;

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-stretch" role="list">
          {products.map((plan, i) => {
            const finalPrice = plan.salePrice || plan.price;
            const originalPrice = plan.price;
            const discountPercent = originalPrice > finalPrice 
              ? Math.round((1 - finalPrice / originalPrice) * 100) 
              : 0;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 flex flex-col glass`}
                role="listitem"
                aria-label={`${plan.title} - ${finalPrice} دولار`}
              >
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.title}</h3>
                  <p className="text-xs text-gray-400 h-8 line-clamp-2">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">${finalPrice}</span>
                    {discountPercent > 0 && (
                      <span className="text-sm text-gray-300 line-through" aria-label="السعر الأصلي">${originalPrice}</span>
                    )}
                  </div>
                  {discountPercent > 0 && (
                    <span className="text-xs text-brand-green font-bold">وفّر {discountPercent}%</span>
                  )}
                </div>

                <ul className="space-y-2.5 mb-6 flex-1" aria-label="مميزات الخطة">
                  {plan.features?.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                  {/* Using chapters as additional features visually if they exist */}
                  {plan.chapters?.map((f, j) => (
                    <li key={`ch-${j}`} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle2 className="w-4 h-4 text-brand-gold/60 flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?productId=${plan.id}`}
                  className="w-full py-3.5 rounded-xl text-center font-bold text-sm transition-all block bg-brand-white/5 text-white hover:bg-brand-white/10 border border-brand-white/10"
                >
                  احصل على العرض
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
