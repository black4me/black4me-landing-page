import React from 'react';
import Image from 'next/image';
import { BookOpen, Gift, Lightbulb, MessageSquare, CheckCircle2, PlayCircle, Lock, LayoutDashboard, FileText, Settings, Video } from 'lucide-react';

export default function BookPreviewSection() {
  return (
    <section id="products-section" className="section-padding bg-surface-1 border-y border-brand-white/5" dir="rtl" aria-labelledby="products-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-brand-purple-light text-xs font-bold uppercase tracking-widest mb-3 block">ماذا ستحصل</span>
          <h2 id="products-heading" className="text-2xl md:text-4xl font-black text-white mb-4">
            حزمة شاملة تحوّل مهارتك إلى مصدر دخل حقيقي
          </h2>
        </div>

        {/* Main Product Card */}
        <div className="glass rounded-3xl overflow-hidden mb-8">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image Side */}
            <div className="bg-gradient-to-br from-brand-blue/40 to-brand-black p-8 flex items-center justify-center min-h-[350px] relative">
              <div className="relative w-full aspect-[4/3] shadow-2xl rounded-xl overflow-hidden">
                <Image
                  src="/images/book-interior.png"
                  alt="من داخل كتاب بدون التسويق — محتوى عملي مع قوالب وخرائط تنفيذ"
                  fill
                  className="object-cover"
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            {/* Content Side */}
            <div className="p-8 lg:p-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-3 py-1 mb-4 w-fit">
                <Gift className="w-3 h-3 text-brand-gold" aria-hidden="true" />
                <span className="text-xs font-bold text-brand-gold">كتابان بسعر كتاب واحد</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-4">
                كتاب "بدون التسويق… كارثة تهدد ثروتك المستقبلية"
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                دليل عملي متكامل من 6 فصول يأخذك من فهم عقلية المشتري إلى بناء نظام مبيعات مؤتمت بالكامل. مع تمارين تفاعلية وقوالب جاهزة في كل فصل.
              </p>
              <ul className="space-y-3 mb-6">
                {[
                  'فهم سلوك المشترين ذوي الدخل المرتفع وكيفية جذبهم',
                  'صياغة العرض الذي لا يُرفض (Irresistible Offer)',
                  'بناء قمع المبيعات (Sales Funnel) خطوة بخطوة',
                  'أسرار المحتوى التسويقي التحويلي',
                  'تمارين عملية تفاعلية لكل فصل',
                  'قوالب جاهزة للتطبيق الفوري',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bonus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: BookOpen,
              title: 'كتاب هدية مجانية',
              desc: '"10 مبادئ للنجاح المالي والشخصي" — بقلم جاسم محمد',
              value: '$29',
            },
            {
              icon: Lightbulb,
              title: 'نظام تعليمي متكامل',
              desc: '9 وحدات تعليمية + قوالب + أدوات احترافية جاهزة',
              value: '$99',
            },
            {
              icon: MessageSquare,
              title: 'استشارة فردية مباشرة',
              desc: 'جلسة خاصة مع المؤسس لتحليل مسارك وتعديل استراتيجيتك',
              value: '$150',
            },
          ].map((bonus, i) => (
            <div key={i} className="glass rounded-2xl p-5 hover:border-brand-gold/20 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center">
                  <bonus.icon className="w-5 h-5 text-brand-purple-light" aria-hidden="true" />
                </div>
                <span className="text-xs font-mono font-bold text-gray-300 line-through">قيمتها {bonus.value}</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{bonus.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{bonus.desc}</p>
            </div>
          ))}
        </div>

        {/* Platform Preview */}
        <div className="mt-16 relative group perspective-1000">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple/20 via-brand-gold/20 to-brand-purple/20 rounded-[2rem] blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative glass rounded-[2rem] overflow-hidden border border-brand-white/10 p-1">
            <div className="bg-[#0A0A0A] rounded-[1.8rem] overflow-hidden">
              <div className="px-6 pt-8 pb-4 text-center border-b border-white/5">
                <span className="inline-block py-1 px-3 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple-light text-xs font-bold mb-3">بيئة تعلم حصرية</span>
                <h3 className="text-xl md:text-2xl font-black text-white mb-2">النظام التعليمي المرفق</h3>
                <p className="text-sm text-gray-400">نظام رقمي متكامل بواجهة عربية يحتوي على 9 وحدات تعليمية وأدوات تطبيقية</p>
              </div>
              
              {/* Dashboard Mock UI */}
              <div className="bg-[#111] p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                 {/* Sidebar Mock */}
                 <div className="hidden md:flex flex-col gap-2 border-l border-white/5 pl-6">
                    <div className="flex items-center gap-3 text-white bg-white/5 p-3 rounded-xl border border-white/10">
                      <LayoutDashboard className="w-5 h-5 text-brand-purple-light" />
                      <span className="text-sm font-bold">لوحة التحكم</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 hover:text-white p-3 rounded-xl transition-colors">
                      <Video className="w-5 h-5" />
                      <span className="text-sm font-bold">المحاضرات</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 hover:text-white p-3 rounded-xl transition-colors">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm font-bold">الملفات والقوالب</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 hover:text-white p-3 rounded-xl transition-colors mt-auto">
                      <Settings className="w-5 h-5" />
                      <span className="text-sm font-bold">الإعدادات</span>
                    </div>
                 </div>

                 {/* Main Content Mock */}
                 <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
                    <div className="aspect-video w-full bg-black rounded-2xl relative border border-white/10 overflow-hidden flex items-center justify-center group/video cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/20 to-transparent mix-blend-screen pointer-events-none" />
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover/video:scale-110 group-hover/video:bg-brand-purple/40 transition-all shadow-[0_0_30px_rgba(108,59,255,0.3)]">
                        <PlayCircle className="w-8 h-8 text-white ml-1" />
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-2 py-1 rounded-md font-mono">14:22</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((module) => (
                        <div key={module} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center justify-between group/module hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${module === 1 ? 'bg-brand-purple/20 text-brand-purple-light' : 'bg-black text-gray-500 border border-white/5'}`}>
                              {module === 1 ? <PlayCircle className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white mb-1">الوحدة {module}</p>
                              <p className="text-xs text-gray-500">عنوان الوحدة التعليمية</p>
                            </div>
                          </div>
                          {module === 1 && <span className="text-[10px] bg-brand-green/20 text-brand-green px-2 py-1 rounded font-bold border border-brand-green/20">حالي</span>}
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
