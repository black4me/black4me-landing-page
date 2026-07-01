import { BookOpen, Users, Award, TrendingUp, Megaphone, Layers } from "lucide-react";
import Image from "next/image";

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
        <div className="bg-gradient-to-l from-yellow-400/5 to-transparent border border-yellow-400/20 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden ring-2 ring-yellow-400/50">
              <Image
                src="/images/jassim-author.jpg"
                alt="جاسم محمد - مستشار تسويقي ومؤسس BLACK4ME"
                width={96}
                height={96}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <p className="text-yellow-400 text-sm font-semibold mb-1">عن المؤلف</p>
              <h4 className="text-white text-xl font-bold mb-2">جاسم محمد</h4>
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                مستشار تسويقي ميداني ومؤسس BLACK4ME. يساعد أصحاب المشاريع والمستقلين على 
                تحويل مهاراتهم إلى عروض لا تُرفض، وبناء أنظمة مبيعات تعمل دون إعلانات مدفوعة.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
