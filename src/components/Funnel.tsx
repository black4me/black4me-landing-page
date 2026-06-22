import React, { useState } from 'react';
import { ArrowDown, Layers, BookOpen, Lightbulb, PenTool, CheckSquare, MessageSquareCode, Rocket, LucideIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const iconMap: Record<string, LucideIcon> = {
  BookOpen, Lightbulb, PenTool, CheckSquare, MessageSquareCode, Rocket, Layers
};

export default function Funnel() {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const { funnelStages, siteSettings } = useApp();

  return (
    <section id="funnel-section" className="bg-brand-black text-brand-white py-24 px-4 border-b border-brand-purple/10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center space-y-4 mb-20">
          <span className="text-brand-purple font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-purple/15 border border-brand-purple/30 rounded-full">
            خريطة العميل التسويقية المتكاملة
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            {siteSettings.funnel_title || 'نظام BLACK4ME الفَنَل البصري المتعاقب'}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            {siteSettings.funnel_subtitle || 'اضغط على أي مرحلة من مراحل قمع المبيعات تالياً لعرض الخريطة التشغيلية وتفاصيل رحلة التحول لعملائنا.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Interactive Visual Funnel Stack */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-sm font-bold text-gray-400 mb-6 text-center lg:text-right">اضغط لمشاهدة التفاصيل الهيكلية</h3>
            <div className="flex flex-col items-center">
              {funnelStages.map((stage) => {
                const isSelected = activeStage === stage.num;
                // Dynamically narrowing widths to represent a funnel shape
                const widthStyle = [
                  "w-full",
                  "w-[95%]",
                  "w-[90%]",
                  "w-[85%]",
                  "w-[80%]",
                  "w-[75%]"
                ][stage.num - 1] || "w-[75%]";

                return (
                  <div key={stage.num} className={`contents`}>
                    <button
                      onClick={() => setActiveStage(stage.num)}
                      className={`py-4 px-6 rounded-xl border flex items-center justify-between cursor-pointer transition duration-300 transform ${widthStyle} ${
                        isSelected 
                          ? 'bg-gradient-to-l from-brand-purple/40 to-brand-purple/10 border-brand-gold shadow-[0_4px_20px_rgba(108,59,255,0.25)] scale-[1.02]' 
                          : 'bg-brand-darkgray hover:bg-brand-darkgray/80 border-brand-white/5 hover:border-brand-purple/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition duration-300 ${
                          isSelected ? 'bg-brand-gold text-brand-black' : 'bg-brand-black text-brand-purple border border-brand-purple/30'
                        }`}>
                          {stage.num}
                        </span>
                        <div className="text-right">
                          <span className={`text-sm sm:text-base font-bold block transition ${isSelected ? 'text-brand-gold' : 'text-gray-200'}`}>
                            {stage.title}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono block">STAGE 0{stage.num}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${isSelected ? 'bg-brand-gold/25 text-brand-gold' : 'bg-brand-black text-gray-400'}`}>
                        {stage.badge}
                      </span>
                    </button>

                    {stage.num < funnelStages.length && (
                      <div className="my-1.5 flex justify-center text-brand-purple/40 items-center animate-bounce">
                        <ArrowDown className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Info Box about Selected Stage */}
          <div className="lg:col-span-6 bg-brand-darkgray border border-brand-white/5 rounded-2xl p-6 sm:p-8 sticky top-32 min-h-[350px] flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />
            
            {activeStage === null ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <Layers className="w-16 h-16 text-brand-purple/40 animate-pulse" />
                <h4 className="text-lg font-bold text-white">تفاصيل مراحل الفَنَل التسويقي</h4>
                <p className="text-sm text-gray-400 max-w-sm">
                  الرجاء تحديد أي من خطوات القمع التسويقي التفاعلية المعروضة على الجانب الأيمن لاستكشاف ما الذي ستقوم به وتتعلمه في تلك المرحلة الفريدة.
                </p>
                <button
                  onClick={() => setActiveStage(1)}
                  className="mt-2 text-xs font-bold text-brand-gold hover:text-white transition px-4 py-2 bg-brand-gold/15 rounded-lg border border-brand-gold/25 cursor-pointer"
                >
                  ابدأ الاستعراض التفاعلي الآن
                </button>
              </div>
            ) : (
              (() => {
                const current = funnelStages.find(s => s.num === activeStage);
                if (!current) return null;
                const Icon = iconMap[current.iconName] || Layers;
                return (
                  <div className="space-y-6 text-right flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 border-b border-brand-white/10 pb-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-gold">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs text-brand-purple font-bold tracking-widest uppercase block">STAGE 0{current.num}</span>
                          <h4 className="text-xl font-extrabold text-white">{current.title}</h4>
                        </div>
                      </div>

                      <h5 className="text-sm font-bold text-brand-gold mb-3">{current.subtitle}</h5>
                      <p className="text-sm text-gray-300 leading-relaxed font-semibold">
                        {current.details}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-brand-white/5 flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-mono">BLACK4ME © Core Path</span>
                      <button 
                        onClick={() => setActiveStage(activeStage === funnelStages.length ? 1 : activeStage + 1)}
                        className="text-brand-purple font-bold hover:text-brand-gold transition duration-200 cursor-pointer"
                      >
                        الانتقال للمرحلة التالية ←
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
