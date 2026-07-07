import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'استشارة تسويقية | BLACK4ME',
  description: 'احجز جلسة استشارية مع الأستاذ جاسم محمد — خطة تسويق مخصصة لمشروعك في 60 دقيقة',
};

export default function ConsultationPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#0a0a0a] text-white selection:bg-amber-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            متاح الآن للحجز
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            استشارة تسويقية مع <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-200 to-amber-500">الأستاذ جاسم</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            احصل على خارطة طريق واضحة، وحلول عملية لمشاكل مشروعك، وخطوات دقيقة لزيادة مبيعاتك في جلسة واحدة مركزة.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-zinc-300">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>المدة: 60 دقيقة</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>اجتماع مرئي (Zoom/Meet)</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>سرية تامة</span>
            </div>
          </div>

          <a 
            href="#booking-calendar" 
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#0a0a0a] bg-amber-500 rounded-lg hover:bg-amber-400 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-1"
          >
            احجز موعدك الآن
          </a>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-6 lg:px-8 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ماذا ستحصل من هذه الاستشارة؟</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">خلاصة خبرات عملية نضعها بين يديك لتختصر على نفسك الكثير من الوقت والجهد والمال.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">خطة تسويق مخصصة</h3>
              <p className="text-zinc-400 leading-relaxed">
                لن نتحدث في النظريات. سنقوم ببناء خطة تسويقية محددة الخطوات تناسب طبيعة مشروعك وميزانيتك الحالية.
              </p>
            </div>

            <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">تحليل المنافسين والسوق</h3>
              <p className="text-zinc-400 leading-relaxed">
                سنحلل نقاط قوة وضعف منافسيك، ونكتشف الفرص البيعية غير المستغلة في السوق لكي تستحوذ عليها.
              </p>
            </div>

            <div className="bg-[#111] border border-white/5 p-8 rounded-2xl hover:border-amber-500/30 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">خطوات عملية للتطبيق فوراً</h3>
              <p className="text-zinc-400 leading-relaxed">
                ستخرج من الجلسة بمهام واضحة جداً (1، 2، 3) لتبدأ بتنفيذها فور انتهاء المكالمة لتحقيق نتائج سريعة وملموسة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Calendar Section */}
      <section id="booking-calendar" className="py-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">اختر الموعد المناسب لك</h2>
            <p className="text-zinc-400">جميع الأوقات المعروضة تظهر بتوقيتك المحلي تلقائياً.</p>
          </div>
          
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <iframe
              src="https://cal.com/black4me"
              width="100%"
              style={{ minHeight: "700px", border: "none" }}
            />
          </div>
        </div>
      </section>

      {/* Testimonials (Placeholders) */}
      <section className="py-20 px-6 lg:px-8 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">شركاء النجاح</h2>
            <p className="text-zinc-400">آراء بعض العملاء الذين سعدنا بتقديم الاستشارة لهم.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#111] p-8 rounded-2xl border border-white/5">
              <div className="flex text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-300 mb-6 italic">"كانت ساعة واحدة كفيلة بتغيير مسار خطتنا التسويقية بالكامل. الأستاذ جاسم وضع يده على الجرح وأعطانا حلولاً سريعة واضحة جداً. العائد من الاستشارة كان أضعاف تكلفتها!"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-lg text-amber-500">A</div>
                <div>
                  <h4 className="font-bold text-white">عبدالله المرزوقي</h4>
                  <p className="text-sm text-zinc-500">مؤسس متجر إلكتروني</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111] p-8 rounded-2xl border border-white/5">
              <div className="flex text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-zinc-300 mb-6 italic">"كنت تائهاً وسط الكثير من الاستراتيجيات ولا أعرف من أين أبدأ. الاستشارة رتبت أفكاري وأعطتني خارطة طريق واضحة جداً. أنصح بها وبشدة لأي صاحب مشروع."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-lg text-amber-500">M</div>
                <div>
                  <h4 className="font-bold text-white">محمد العتيبي</h4>
                  <p className="text-sm text-zinc-500">صاحب وكالة تسويق</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-6">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">ضمان القيمة الحقيقية</h2>
          <p className="text-zinc-400">
            نحن نقدر وقتك واستثمارك. إذا لم تخرج من هذه الاستشارة بفائدة ملموسة وخطوات واضحة قابلة للتطبيق تحدث فرقاً في مشروعك، فنحن نلتزم باسترجاع قيمة الاستشارة بالكامل.
          </p>
        </div>
      </section>
    </div>
  );
}
