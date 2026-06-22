import React from 'react';
import { AlertTriangle, TrendingDown, EyeOff, ShieldAlert, BadgeDollarSign, Swords } from 'lucide-react';

export function Problem() {
  const problems = [
    {
      title: "انقطاع أو عشوائية تدفق العملاء الجدد",
      desc: "تعتمد على الترشيحات العفوية أو الحظ، وتستيقظ كل شهر متسائلاً من أين سيأتي العميل القادم لدفع فواتيرك.",
      icon: EyeOff,
    },
    {
      title: "محتوى لا يحقق أرباحاً",
      desc: "تقضي ساعات في صناعة المحتوى وتظن أن التفاعل هو الهدف، بينما تظل حسابك البنكي صفراً.",
      icon: TrendingDown,
    },
    {
      title: "حرب الأسعار الرخيصة",
      desc: "يتم مقارنتك بالمبتدئين، وتضطر لخفض سعرك لتكسب العميل، مما يستنزف وقتك ويقلل قيمتك.",
      icon: BadgeDollarSign,
    },
    {
      title: "غياب النظام التسويقي",
      desc: "كل شيء يعتمد على مجهودك الشخصي المباشر؛ إذا توقفت عن العمل، توقف الدخل تماماً.",
      icon: Swords,
    },
    {
      title: "خوف من ضياع الفرص",
      desc: "تشعر أنك خلف الركب، بينما ينمو منافسون أقل خبرة منك بمراحل بسبب امتلاكهم للنظام.",
      icon: ShieldAlert,
    },
    {
      title: "كارثة تهدد الثروة المستقبلية",
      desc: "الاستمرار بدون استراتيجية يعني أنك تبني عملاً هشاً قد ينهار في أي لحظة مع تغير خوارزميات السوق.",
      icon: AlertTriangle,
    },
  ];

  return (
    <section className="py-20 bg-black text-white px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          بدون التسويق... <span className="text-red-500">كارثة تهدد ثروتك المستقبلية</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((item, index) => (
            <div key={index} className="p-6 bg-gray-900 border border-gray-800 rounded-xl hover:border-red-500 transition-colors">
              <item.icon className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Problem;
