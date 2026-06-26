"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="section-padding bg-gradient-to-b from-brand-black to-surface-1" dir="rtl">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
          جاهز تبني نظامك التسويقي؟
        </h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          لا تنتظر أكثر. كل يوم بدون نظام تسويقي = فرص ضائعة وعملاء يذهبون لمنافسيك.
        </p>
        <Link
          href="/checkout"
          className="cta-glow inline-flex items-center gap-2 bg-brand-gold hover:bg-yellow-400 text-brand-black font-black py-4 px-10 rounded-2xl text-lg transition-all"
        >
          <span>ابدأ الآن — $49 فقط</span>
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <p className="text-xs text-gray-400 mt-4">ضمان استرداد كامل خلال 7 أيام • دفع آمن عبر Stripe & PayPal</p>
      </div>
    </section>
  );
}
