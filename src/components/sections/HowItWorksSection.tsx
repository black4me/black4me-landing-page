"use client";

import React from 'react';
import { BookOpen, PenTool, Rocket, TrendingUp } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      num: 1,
      icon: BookOpen,
      title: 'اقرأ الكتاب التأسيسي',
      desc: 'افهم قواعد التسويق الحقيقية وتعلّم كيف تصيغ عرضاً لا يُرفض يستهدف العملاء ذوي الملاءة العالية.',
      color: 'brand-purple',
    },
    {
      num: 2,
      icon: PenTool,
      title: 'طبّق القوالب الجاهزة',
      desc: 'استخدم قوالب المحتوى التسويقي ونماذج الفنل الجاهزة لبناء نظامك في أيام بدلاً من أشهر.',
      color: 'brand-gold',
    },
    {
      num: 3,
      icon: Rocket,
      title: 'أطلق نظامك المؤتمت',
      desc: 'ربط بوابات الدفع وأنظمة البريد الإلكتروني والأتمتة. نظامك يعمل 24/7 حتى وأنت نائم.',
      color: 'brand-green',
    },
    {
      num: 4,
      icon: TrendingUp,
      title: 'احصل على أول عميل',
      desc: 'خلال 60 يوم من التطبيق، ستبدأ في استقبال عملاء مؤهلين ومستعدين للدفع بشكل منتظم.',
      color: 'brand-gold',
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-brand-black" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-gold text-xs font-bold uppercase tracking-widest mb-3 block">كيف يعمل النظام</span>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
            4 خطوات من الصفر إلى أول عميل يدفع
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            لا تحتاج خبرة سابقة. النظام مصمم ليأخذك خطوة بخطوة من المبتدئ إلى صاحب نظام مبيعات مؤتمت.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -left-3 w-6 h-[2px] bg-gradient-to-l from-brand-white/10 to-transparent" />
              )}
              <div className="glass rounded-2xl p-6 hover:border-brand-gold/20 transition-all h-full">
                <div className={`w-12 h-12 rounded-xl bg-${step.color}/10 flex items-center justify-center mb-4`}>
                  <step.icon className={`w-6 h-6 text-${step.color}`} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-gray-400">الخطوة {step.num}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
