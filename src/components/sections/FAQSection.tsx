"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQSection() {
  const { faqs: dbFaqs } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = dbFaqs || [];

  if (faqs.length === 0) {
    return null;
  }

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
                  <ChevronDown className="w-5 h-5 text-gray-300 flex-shrink-0 mr-4" aria-hidden="true" />
                )}
              </button>
              {openIndex === i && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="px-5 pb-5 border-t border-brand-white/5"
                  role="region"
                  aria-labelledby={`faq-question-${faq.id}`}
                >
                  <p className="text-sm text-gray-300 leading-relaxed pt-4">
                    {faq.answer.trim().startsWith(faq.question.trim())
                      ? faq.answer.trim().substring(faq.question.trim().length).trim().replace(/^[-:]\s*/, '')
                      : faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
