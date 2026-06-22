import React, { useState } from 'react';
import { ArrowDown, Layers, BookOpen, Lightbulb, PenTool, CheckSquare, MessageSquareCode, Rocket } from 'lucide-react';

export default function Funnel() {
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const stages = [
    {
      num: 1,
      title: "قراءة الكتاب التأسيسي الاستراتيجي",
      icon: BookOpen,
      subtitle: "المرحلة الأولى: امتلاك العقلية القيادية وفك شفرة الغموض التسويقي",
      details: "تبدأ رحلتك بتصفح كتاب 'بدون التسويق... كارثة تهدد ثروتك المستقبلية'. ستتعلم فيه تفكيك المفاهيم الصعبة التي تعوق تقدمك المالي، وتكتشف نماذج الاستهداف النخبوية لسلوك المستهلك المعاصر.",
      badge: "نقطة الدخول التأسيسية"
    },
    {
      num: 2,
      title: "بناء وتصميم عرضك فائق القيمة",
      icon: Lightbulb,
      subtitle: "المرحلة الثانية: تحويل المعرفة والمهارة إلى حل جاهز ومطلوب بشدة",
      details: "تطبيق التمارين المرفقة لوضع هيكل تسعيري متدرج لخدماتك ومنتجاتك. ستخرج من صراع السعر المنخفض لتصعد لعرض ذو تذكرة مرتفعة (High-Ticket Offer) يستحقه جمهورك الحقيقي.",
      badge: "صياغة الميزة الفريدة"
    },
    {
      num: 3,
      title: "هندسة المحتوى التحويلي المستهدف",
      icon: PenTool,
      subtitle: "المرحلة الثالثة: صياغة الرسائل التسويقية وصنع هيبتك القيادية",
      details: "هنا سنعير اهتمامنا لجذب عقول المهتمين عاليي الدخل. تتوقف عن النشر العشوائي وتبدأ باتخاذ أساليب صناعة محتوى مصممة بعناية لإغلاق الصفقات وإقناع متلقيها بجودة عروضك.",
      badge: "محرك السيطرة المعرفية"
    },
    {
      num: 4,
      title: "إطلاق نظام قمع المبيعات والفنل",
      icon: CheckSquare,
      subtitle: "المرحلة الرابعة: الأتمتة الكاملة لقمع المبيعات وبناء قوائم البيانات",
      details: "ربط النماذج وقواعد البيانات، وإعداد بوابات الدفع (Stripe & PayPal) التلقائية. النظام يضمن جمع الأسماء والايميلات وتسهيل عملية السداد وتحميل المنتجات بنقرة واحدة.",
      badge: "التحصيل والأتمتة الرقمية"
    },
    {
      num: 5,
      title: "جلسة الاستشارة الاستراتيجية الفردية",
      icon: MessageSquareCode,
      subtitle: "المرحلة الخامسة: تشريح عملك والتحقق المباشر مع جاسم محمد",
      details: "جلسة مباشرة وجهاً لوجه لغربلة الهيكل، ومعالجة الثغرات التقنية، والتحقق التام من قابلية نظامك للتوسع والربح السلبي المستقر.",
      badge: "المصادقة وتعديل الثغرات"
    },
    {
      num: 6,
      title: "النمو الرقمي الشامل ومضاعفة الأرقام",
      icon: Rocket,
      subtitle: "المرحلة السادسة: توسيع النطاق ومرحلة بناء الثروة المتكاملة",
      details: "بعد اختبار وصيانة المراحل السابقة، نطلق العنان للمبيعات عبر توسيع الجمهور، وتحسين التحويل، وزيادة معدل الشراء المتكرر لبناء قيمة لا تنتهي لعلامتك الموثوقة.",
      badge: "الهروب نحو الحرية المالية"
    }
  ];

  return (
    <section id="funnel-section" className="bg-brand-black text-brand-white py-24 px-4 border-b border-brand-purple/10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center space-y-4 mb-20">
          <span className="text-brand-purple font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-purple/15 border border-brand-purple/30 rounded-full">
            خريطة العميل التسويقية المتكاملة
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            نظام BLACK4ME الفَنَل البصري المتعاقب
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            اضغط على أي مرحلة من مراحل قمع المبيعات تالياً لعرض الخريطة التشغيلية وتفاصيل رحلة التحول لعملائنا.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Interactive Visual Funnel Stack */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-sm font-bold text-gray-400 mb-6 text-center lg:text-right">اضغط لمشاهدة التفاصيل الهيكلية</h3>
            <div className="flex flex-col items-center">
              {stages.map((stage) => {
                const isSelected = activeStage === stage.num;
                // Dynamically narrowing widths to represent a funnel shape
                const widthStyle = [
                  "w-full",
                  "w-[95%]",
                  "w-[90%]",
                  "w-[85%]",
                  "w-[80%]",
                  "w-[75%]"
                ][stage.num - 1];

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

                    {stage.num < 6 && (
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
                const current = stages.find(s => s.num === activeStage)!;
                const Icon = current.icon;
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
                        onClick={() => setActiveStage(activeStage === 6 ? 1 : activeStage + 1)}
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
