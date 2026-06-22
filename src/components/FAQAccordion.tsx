import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQAccordion() {
  const { faqs } = useApp();
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  // Sort descending/ascending order
  const sortedFaqs = [...faqs].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <section id="faq-section" className="bg-brand-darkgray text-brand-white py-24 px-4 border-b border-brand-purple/10" dir="rtl">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center space-y-4 mb-16">
          <span className="text-brand-gold font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
            الإجابات السريعة والشاملة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            الأسئلة الشائعة والاستفسارات المطروحة
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto font-medium">
            كل ما يدور في ذهنك حول التراخيص الرقمية، آلية السداد، وطريقة حجز الاستشارات الاستراتيجية الخاصة بنمو علامتك.
          </p>
        </div>

        <div className="space-y-4">
          {sortedFaqs.map((faq) => {
            const isOpen = openIndex === faq.id;
            return (
              <div 
                key={faq.id} 
                className="bg-brand-black border border-brand-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-purple/30"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-purple shrink-0" />
                    <span className="text-sm sm:text-base font-extrabold text-white">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-brand-gold' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-gray-300 leading-relaxed font-semibold border-t border-brand-white/5 bg-brand-darkgray/30 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
