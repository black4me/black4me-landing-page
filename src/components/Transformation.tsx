import React, { useState } from 'react';
import { ShieldX, ShieldCheck, ArrowLeftRight, Coins, RefreshCw, Star } from 'lucide-react';

export default function Transformation() {
  const [activeTab, setActiveTab] = useState<'both' | 'before' | 'after'>('both');

  const comparisonItems = [
    {
      aspect: "آلية جلب العملاء والمهتمين",
      before: "ملاحقة مستمرة وإرسال مئات الرسائل العشوائية المكتوبة بالذكاء الاصطناعي دون إنصات أو استجابة.",
      after: "الفنل يقوم بجذب وغربلة العملاء عاليي الملاءة وجلبهم مهيئين للشراء بنسبة 80% قبل التحدث الفردي.",
    },
    {
      aspect: "قواعد التسعير والتحصيل المالي",
      before: "النزول بالتسعير للحد الأدنى لجذب المترددين، ما يؤثر على جودة الخدمة ويبقي أرباحك متعثرة.",
      after: "بناء وتصميم عروض نخبوية (High-Ticket Program) بأسعار تبدأ من $2,000 وتبريرها بقيمتها الحقيقية.",
    },
    {
      aspect: "العائد الزمني والمجهود التشغيلي",
      before: "تعمل 14 ساعة يومياً بمحاولات ترويجية مبعثرة، دون أي تكرار منهجي أو بنية أصول حقيقية لعلامتك.",
      after: "نظام مؤتمت مكرر ومستقر، يحتاج فقط 3-4 ساعات مراجعة أسبوعية وتحديثات فنية لتوسيع الأرقام.",
    },
    {
      aspect: "صناعة الأثر والهيبة المعرفية",
      before: "صانع محتوى عام ينشر يومياً 'أفضل 5 نصائح برمجية' دون ترابط حقيقي يهدف للبيع.",
      after: "هيبة فكرية كقائد رأي مستهدف، يفصل بدقة خريطة طريق تحل مشكلة العميل العميقة بوضوح.",
    }
  ];

  return (
    <section className="bg-brand-black text-brand-white py-24 px-4 border-b border-brand-purple/10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center space-y-4 mb-16">
          <span className="text-brand-gold font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
            قوة التحول الحتمي المالي والمعرفي
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            قارن وشاهد الفارق: هندسة التحول الجذري لعملك
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            الانتقال من مرحلة العشوائية الفردية إلى مرحلة العلامة التجارية الممتازة ذات الدخل البارد المؤتمت.
          </p>

          {/* Interactive filter toggle for mobile overview */}
          <div className="flex justify-center pt-4">
            <div className="bg-brand-darkgray border border-brand-white/10 rounded-xl p-1.5 flex gap-2">
              <button 
                onClick={() => setActiveTab('both')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'both' ? 'bg-brand-purple text-white' : 'text-gray-400 hover:text-white'}`}
              >
                قارن الاثنين معاً
              </button>
              <button 
                onClick={() => setActiveTab('before')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'before' ? 'bg-brand-red/20 text-brand-red' : 'text-gray-400 hover:text-white'}`}
              >
                فقط قبل النظام
              </button>
              <button 
                onClick={() => setActiveTab('after')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${activeTab === 'after' ? 'bg-brand-green/20 text-brand-green' : 'text-gray-400 hover:text-white'}`}
              >
                فقط بعد النظام
              </button>
            </div>
          </div>
        </div>

        {/* Comparative Interactive Cards Grid */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {comparisonItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-brand-darkgray border border-brand-white/5 rounded-2xl p-6 md:p-8 hover:border-brand-purple/30 transition duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              <h4 className="text-brand-gold font-extrabold text-base md:text-lg mb-6 border-r-4 border-brand-gold pr-3 leading-none self-start">
                {item.aspect}
              </h4>

              <div className="grid md:grid-cols-2 gap-6 relative">
                
                {/* Before system col */}
                {(activeTab === 'both' || activeTab === 'before') && (
                  <div className="bg-brand-black/40 p-5 rounded-xl border border-brand-red/15 relative overflow-hidden flex flex-col justify-start">
                    <div className="flex items-center gap-2 text-brand-red font-bold text-sm mb-3">
                      <ShieldX className="w-5 h-5 text-brand-red shrink-0" />
                      <span>النمط التقليدي المهدر للفائدة</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-semibold">
                      {item.before}
                    </p>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-brand-red/5 rounded-full blur-xl" />
                  </div>
                )}

                {/* Arrow indicator decoration */}
                {activeTab === 'both' && (
                  <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-black border border-brand-white/10 items-center justify-center text-brand-gold shadow-md">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </div>
                )}

                {/* After system col */}
                {(activeTab === 'both' || activeTab === 'after') && (
                  <div className="bg-brand-black/80 p-5 rounded-xl border border-brand-green/25 relative overflow-hidden flex flex-col justify-start shadow-inner">
                    <div className="flex items-center gap-2 text-brand-green font-bold text-sm mb-3">
                      <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 bg-brand-green/10 rounded-full" />
                      <span>النظام الفاخر لـ BLACK4ME</span>
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed font-bold">
                      {item.after}
                    </p>
                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-brand-green/5 rounded-full blur-xl" />
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
