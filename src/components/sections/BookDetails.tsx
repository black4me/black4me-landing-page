"use client";

import { BookOpen, Users, Award, TrendingUp, Megaphone, Layers } from "lucide-react";
import Image from "next/image";
import { useApp } from "../../context/AppContext";

const chapters = [
  {
    icon: <Megaphone className="w-6 h-6" />,
    number: "01",
    title: "لماذا يموت مشروعك بدون تسويق؟",
    description: "الفرق بين مشروع هواية ومشروع نمو حقيقي — وكيف يُهدر غياب التسويق ثروتك بصمت",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    number: "02",
    title: "معادلة القيمة",
    description: "كيف تسعّر بناءً على النتيجة لا على وقتك — وتتحول من بائع خدمة إلى صاحب حل متكامل",
  },
  {
    icon: <Users className="w-6 h-6" />,
    number: "03",
    title: 'قانون "الحشد الجائع"',
    description: "اختر السوق الصحيح قبل أن تبدأ — الأسواق الثلاثة الكبرى التي تسكنها الأموال الضخمة",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    number: "04",
    title: "علم نفس العنوان المغناطيسي",
    description: "أوقف التمرير واجعل العميل يقرأ كل كلمة — معادلة الجذب في 3 ثوانٍ",
  },
  {
    icon: <Award className="w-6 h-6" />,
    number: "05",
    title: "هندسة الإعلان الرابح",
    description: "الهيكل الكامل من Hook إلى CTA — لماذا تفشل الإعلانات الجيدة وكيف تُصلحها",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    number: "06",
    title: "نظام المبيعات المتكامل",
    description: "Lead Magnet ← Landing Page ← Email ← Upsell — بناء آلة مبيعات لا تتوقف",
  },
];

export default function BookDetails() {
  const { siteSettings } = useApp();
  return (
    <section className="bg-black py-20 px-4" dir="rtl">
      <div className="max-w-6xl mx-auto">

        {/* ── Book Header ── */}
        <div className="text-center mb-16">
          <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-3">
            الكتاب
          </p>
          <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-4">
            بدون تسويق
            <span className="text-yellow-400"> كارثة تهدد ثروتك المستقبلية</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            دليل بناء العروض التي لا تُرفض وتحويل المهارات إلى أرباح طائلة
          </p>

          {/* ── Book Meta ── */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-yellow-400">✍️</span>
              <span>تأليف: <strong className="text-white">جاسم محمد</strong></span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-yellow-400">📄</span>
              <span><strong className="text-white">81</strong> صفحة</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-yellow-400">📅</span>
              <span>الطبعة الأولى — <strong className="text-white">2025</strong></span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span className="text-yellow-400">🏢</span>
              <span>النشر: <strong className="text-white">BLACK4ME</strong></span>
            </div>
          </div>
        </div>

        {/* ── Chapters Grid ── */}
        <div className="mb-16">
          <h3 className="text-white text-2xl font-bold text-center mb-10">
            ماذا ستتعلم؟
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <div
                key={chapter.number}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400/10 text-yellow-400 rounded-xl p-3 flex-shrink-0">
                    {chapter.icon}
                  </div>
                  <div>
                    <span className="text-yellow-400/60 text-xs font-mono">
                      الفصل {chapter.number}
                    </span>
                    <h4 className="text-white font-bold text-base mt-1 mb-2">
                      {chapter.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {chapter.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Author Bio ── */}
        <section className="bg-gradient-to-br from-[#0d0d0d] to-black border border-yellow-400/20 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Author Photo */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-yellow-400/40 shadow-2xl">
                <Image
                  src={siteSettings?.author_image || "/images/jassim-author.jpg"}
                  alt="جاسم محمد — مؤسس BLACK4ME"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover object-top"
                  unoptimized
                />
              </div>
            </div>

            {/* Author Details */}
            <div className="flex-1 text-center md:text-right">
              <p className="text-yellow-400 text-sm font-semibold tracking-widest uppercase mb-2">عن المؤلف</p>
              <h2 className="text-white text-3xl font-bold mb-2">جاسم محمد</h2>
              <p className="text-yellow-400/80 text-sm mb-4 font-medium">مؤسس BLACK4ME | مستشار التسويق الرقمي</p>

              <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-2xl">
                خبير في بناء أنظمة تسويق رقمية متكاملة للسوق العربي.
                خلال <strong className="text-white">5 سنوات</strong> من العمل الميداني، ساعد أكثر من{' '}
                <strong className="text-yellow-400">300 رائد أعمال</strong> على تحقيق نتائج ملموسة في التسويق الرقمي.
              </p>

              {/* Achievements */}
              <ul className="text-gray-300 space-y-2 mb-6 text-right">
                <li className="flex items-start gap-2 justify-center md:justify-start">
                  <span className="text-yellow-400 mt-0.5">●</span>
                  <span>بناء عروض تسويقية لا ترفض لأكثر من <strong className="text-white">300 رائد أعمال</strong></span>
                </li>
                <li className="flex items-start gap-2 justify-center md:justify-start">
                  <span className="text-yellow-400 mt-0.5">●</span>
                  <span>تطوير أنظمة تسويق مؤتمتة لقطاعات متعددة</span>
                </li>
                <li className="flex items-start gap-2 justify-center md:justify-start">
                  <span className="text-yellow-400 mt-0.5">●</span>
                  <span>تحقيق أكثر من <strong className="text-white">2 مليون دولار</strong> في مبيعات لعملائه</span>
                </li>
              </ul>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 justify-center md:justify-start mb-6">
                {[
                  { value: '+300', label: 'رائد أعمال' },
                  { value: '5+', label: 'سنوات خبرة' },
                  { value: '$2M+', label: 'مبيعات لعملائه' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-yellow-400 text-2xl font-black">{stat.value}</div>
                    <div className="text-gray-400 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                <a href="https://www.linkedin.com/in/jasim-mohmmed-b18849268/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0077B5]/10 text-[#0077B5] border border-[#0077B5]/30 rounded-full text-sm font-semibold hover:bg-[#0077B5]/20 transition">
                  in LinkedIn
                </a>
                <a href="https://x.com/black4mestore" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 text-white border border-white/20 rounded-full text-sm font-semibold hover:bg-white/10 transition">
                  𝕏 Twitter
                </a>
                <a href="https://www.instagram.com/black4mee/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-600/10 text-pink-400 border border-pink-500/30 rounded-full text-sm font-semibold hover:bg-pink-600/20 transition">
                  📷 Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </section>
  );
}
