import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, CheckCircle, Award, Compass, Sparkles } from 'lucide-react';

export default function ProductSection() {
  const { products } = useApp();
  const [activeTab, setActiveTab] = useState<'chapters' | 'features'>('chapters');

  // Find products or fallback
  const mainBook = products.find(p => p.id === 'prod-main-book') || {
    title: 'كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"',
    description: 'الدليل العملي الشامل لهندسة الأنظمة التسويقية وصناعة المبيعات المستقرة وبناء عروض عالية القيمة تتجاوز المنافسة التقليدية.',
    features: [],
    chapters: []
  };

  const giftBook = products.find(p => p.id === 'prod-bonus-gift') || {
    title: 'كتاب "10 مبادئ للنجاح المالي والشخصي"',
    description: 'أسرار البرمجة المالية وإعادة صياغة أهدافك وعاداتك اليومية لتوليد الثروة وإدارة التدفق النقدي الفردي.',
    features: []
  };

  return (
    <section id="products-section" className="bg-brand-black text-brand-white py-24 px-4 border-b border-brand-purple/10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center space-y-4 mb-20">
          <span className="text-brand-gold font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
            أقوى أصولنا المعرفية للبيع
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            المحتويات التفصيلية للحزمة الشاملة
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            نحن لا نبيع مجرد كلمات منسقة، بل نبيع نظاماً متدرجاً مبرهناً لصاحب العمل والمستشار الطموح.
          </p>
        </div>

        {/* Product Comparison Display Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-stretch mb-20">
          
          {/* Main Book Column (Right) */}
          <div className="lg:col-span-7 bg-brand-darkgray border border-brand-white/5 p-6 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-3xl" />
            
            <div className="space-y-6">
              <span className="text-brand-gold font-bold text-xs bg-brand-gold/10 border border-brand-gold/20 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                المنتج الرئيسي الأكثر تأثيراً
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {mainBook.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-semibold">
                {mainBook.description}
              </p>

              {/* Toggle Chapters / Features to save vertical space on iframe */}
              <div className="flex gap-4 border-b border-brand-white/10 pb-2 pt-4">
                <button 
                  onClick={() => setActiveTab('chapters')}
                  className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${activeTab === 'chapters' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                  فصول الكتاب الستة الأساسية
                </button>
                <button 
                  onClick={() => setActiveTab('features')}
                  className={`pb-2 text-sm font-bold border-b-2 transition cursor-pointer ${activeTab === 'features' ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                  ما الذي ستتعلمه بدقة؟
                </button>
              </div>

              {activeTab === 'chapters' ? (
                <div className="grid gap-3.5 pt-2">
                  {mainBook.chapters?.map((chap, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-brand-black/50 p-3 rounded-xl border border-brand-white/5 transition hover:border-brand-purple/20">
                      <span className="text-xs font-mono font-bold text-brand-purple bg-brand-purple/10 border border-brand-purple/20 w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-200">{chap}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 pt-2">
                  {mainBook.features?.map((feat, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-300 font-semibold">{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-8 mt-8 border-t border-brand-white/5 text-[11px] text-gray-400 font-mono">
              BLACK4ME © Educational Masterclass Series
            </div>
          </div>

          {/* Gift Book Column (Left) */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-brand-darkgray to-brand-black border border-brand-purple/20 p-6 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="absolute -top-6 -left-6 bg-brand-purple text-brand-white font-extrabold px-6 py-2 rounded-br-2xl text-[10px] tracking-widest uppercase shadow-lg z-20">
              قيمة مجانية مضافة 100٪
            </div>
            
            <div className="space-y-6 pt-4">
              <span className="text-brand-purple font-bold text-xs bg-brand-purple/15 border border-brand-purple/30 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                هدية التمكين والنجاح المالي
              </span>

              <h3 className="text-2xl font-extrabold text-brand-gold">
                {giftBook.title}
              </h3>

              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-brand-white/10 shadow-2xl bg-brand-darkgray flex items-center justify-center p-6 mb-4">
                {/* Book spine artwork */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-brand-purple/40 border-r border-brand-purple/20" />
                <BookOpen className="w-16 h-16 text-brand-purple/50 mb-6" />
                <div className="absolute inset-x-0 bottom-0 bg-brand-black/90 p-3 text-center border-t border-brand-white/15">
                  <span className="text-xs font-bold text-brand-white">تأليف: جاسم محمد</span>
                </div>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed font-semibold">
                {giftBook.description}
              </p>

              <div className="space-y-3 pt-2">
                {giftBook.features?.map((feat, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <Award className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-300 font-semibold">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-brand-white/5 text-[11px] text-gray-400 font-mono">
              BLACK4ME © Core Financial Guide Book
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
