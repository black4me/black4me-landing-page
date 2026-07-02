"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, TrendingUp, Radio, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ConsultationSection() {
  const router = useRouter();

  return (
    <section id="consultations-section" className="section-padding bg-[#050505] border-y border-white/5" dir="rtl" aria-labelledby="consultation-heading">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Right Side - Text Content */}
          <div className="lg:col-span-7 pt-4">
            <h2 id="consultation-heading" className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              استشارة خاصة <br />
              <span className="text-[#ceae88]">مع جاسم محمد</span>
            </h2>
            
            <p className="text-[#ceae88] font-bold mb-6 text-sm md:text-base">
              جلسة فيديو لمدة 60 دقيقة نركز فيها على تشخيص وضع مشروعك بدقة.
            </p>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
              أغلب أصحاب المشاريع يعتقدون بأن النجاح في أي عمل تجاري يعتمد على قوة المنتج وينسون وقد لا يعرفون بأن هناك أعمدة أخرى أساسية يجب التركيز عليها وهنا يخسر الكثير.
            </p>
            
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-10">
              الهدف من الاستشارات ليس حل المشكلة (هذا ليس واقعي) وإنما تشخيص المشكلة الحقيقية ووضع خطة عملية بسيطة مناسبة لك لتعمل عليها استناداً بتنطيق للموضوع.
            </p>

            <h3 className="text-white font-bold mb-5 text-sm md:text-base">بعض مواضيع الاستشارة حسب احتياجك:</h3>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
                <TrendingUp className="w-5 h-5 text-[#ceae88] flex-shrink-0" />
                <span className="text-sm md:text-base text-gray-200">نناقش أساسيات التسويق وكيف تكسب العميل بأقل تكلفة.</span>
              </div>
              <div className="flex items-center gap-4 bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
                <Radio className="w-5 h-5 text-[#ceae88] flex-shrink-0" />
                <span className="text-sm md:text-base text-gray-200">كيف ينتشر براندك التجاري أو الشخصي على السوشل ميديا وتخلق تأثير حقيقي.</span>
              </div>
            </div>

            <h3 className="text-white font-bold mb-5 text-sm md:text-base">بعد الجلسة تحصل على:</h3>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm md:text-base text-gray-300">
               <span className="flex items-center gap-2">
                 <span className="text-[#ceae88] font-black text-xl leading-none">|</span> ملخص مخصص
               </span>
               <span className="flex items-center gap-2">
                 <span className="text-[#ceae88] font-black text-xl leading-none">|</span> مراجع إضافية
               </span>
               <span className="flex items-center gap-2">
                 <span className="text-[#ceae88] font-black text-xl leading-none">|</span> عرض عمل لنتائج العمل سوياً
               </span>
            </div>
          </div>

          {/* Left Side - Portrait & Booking Box */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#111111] border border-white/10 rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
               <div className="relative h-[400px] md:h-[500px] w-full bg-[#1a1a1a]">
                 <Image 
                   src={siteSettings?.author_image || "/images/jassim-author.jpg"} 
                   alt="استشارة جاسم محمد" 
                   fill
                   className="object-cover object-top" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/20 to-transparent"></div>
               </div>
               
               <button 
                 onClick={() => router.push('/checkout?mode=consultation')}
                 className="bg-[#ceae88] hover:bg-[#b89b78] p-6 flex items-center justify-between transition-colors group w-full text-right"
                 aria-label="احجز موعد استشارتك الآن"
               >
                 <span className="text-black font-black flex items-center gap-3 text-lg md:text-xl">
                   احجز موعد استشارتك الآن
                   <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                 </span>
                 <span className="text-black font-bold border border-black/30 px-4 py-1.5 rounded-xl text-lg">
                   $49
                 </span>
               </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
