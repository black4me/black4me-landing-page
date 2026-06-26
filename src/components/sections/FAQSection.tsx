"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const { faqs: dbFaqs } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = dbFaqs.length > 0 ? dbFaqs : [
    { id: '1', question: 'ماذا سأحصل عليه بالضبط عند الشراء؟', answer: 'ستحصل على وصول فوري ودائم لكتاب "بدون التسويق" بصيغة PDF، كتاب الهدية "10 مبادئ"، النظام التعليمي الرقمي (9 وحدات)، القوالب والأدوات الجاهزة، وجميع التحديثات المستقبلية مجاناً.', orderIndex: 1 },
    { id: '2', question: 'هل هذا مناسب للمبتدئين تماماً؟', answer: 'نعم 100%. الكتاب والنظام مصمم للأشخاص الذين لا يملكون أي خبرة تسويقية. ستجد شرح مبسط وخطوات واضحة مع تمارين عملية تطبقها مباشرة على مشروعك.', orderIndex: 2 },
    { id: '3', question: 'ما طرق الدفع المتاحة؟', answer: 'نقبل جميع البطاقات الدولية (Visa, Mastercard, Amex) عبر Stripe، وPayPal، بالإضافة إلى التحويل البنكي المحلي لعدة دول عربية (السعودية، عمان، الجزائر، الأردن، السودان).', orderIndex: 3 },
    { id: '4', question: 'كيف يعمل ضمان الاسترداد؟', answer: 'إذا لم تكن راضياً عن المحتوى خلال 7 أيام من الشراء، أرسل بريد إلكتروني إلى info@black4me.com وسنعيد لك كامل المبلغ فوراً بدون أي أسئلة.', orderIndex: 4 },
    { id: '5', question: 'كيف أصل للمحتوى بعد الشراء؟', answer: 'بمجرد إتمام الدفع، ستُوجَّه تلقائياً لصفحة التحميل. كما ستتلقى بريد إلكتروني يحتوي على روابط التنزيل وبيانات الدخول للنظام التعليمي.', orderIndex: 5 },
    { id: '6', question: 'هل يوجد دعم بعد الشراء؟', answer: 'نعم! جميع المشترين يحصلون على دعم عبر البريد الإلكتروني. مشتري الحزمة المتقدمة يحصلون على دعم أولوية ومتابعة لمدة 30 يوم مع المؤسس شخصياً.', orderIndex: 6 },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq-section" className="section-padding bg-surface-1 border-y border-brand-white/5" dir="rtl" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-purple-light text-xs font-bold uppercase tracking-widest mb-3 block">أسئلة شائعة</span>
          <h2 id="faq-heading" className="text-2xl md:text-4xl font-black text-white mb-4">
            عندك سؤال؟ عندنا الإجابة
          </h2>
        </div>

        <div className="space-y-3" role="list">
          {faqs.map((faq, i) => (
            <div
              key={faq.id}
              className="glass rounded-xl overflow-hidden transition-all"
              role="listitem"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-right cursor-pointer"
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${faq.id}`}
                id={`faq-question-${faq.id}`}
              >
                <span className="text-sm font-bold text-white flex-1">{faq.question}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-brand-gold flex-shrink-0 mr-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mr-4" aria-hidden="true" />
                )}
              </button>
              {openIndex === i && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="px-5 pb-5 border-t border-brand-white/5"
                  role="region"
                  aria-labelledby={`faq-question-${faq.id}`}
                >
                  <p className="text-sm text-gray-400 leading-relaxed pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
