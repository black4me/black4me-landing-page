import React from 'react';
import { AlertTriangle, TrendingDown, EyeOff, ShieldAlert, BadgeDollarSign, Swords } from 'lucide-react';

export default function Problem() {
  const problems = [
    {
      title: "انقطاع أو عشوائية تدفق العملاء الجدد",
      desc: "تعتمد على الترشيحات العفوية أو الحظ، وتستيقظ كل شهر متسائلاً من أين سيأتي العميل القادم لدفع فواتيرك.",
      icon: EyeOff,
    },
    {
      title: "صناعة محتوى يومي مستنزف بلا أي نتائج",
      desc: "تكتب منشورات وتصور مقاطع فيديو لساعات متواصلة، وتحصل على إعجابات فارغة من غير فئة المشترين الأثرياء المستهدفين.",
      icon: TrendingDown,
    },
    {
      title: "الخوف المرضي من زيادة أسعار الخدمات",
      desc: "تظن أنه لو رفعت سعر خدمتك بمقدار $20 دولاراً فقط سوف يهرب كل العملاء وتتوقف المبيعات فوراً.",
      icon: ShieldAlert,
    },
    {
      title: "مبيعات موسمية متأرجحة وغير مستقرة",
      desc: "تحقق ربحاً مقبولاً في شهر واحد لتفاجأ بجفاف كامل وضغط نفسي مرير في الـ 90 يوماً التالية.",
      icon: BadgeDollarSign,
    },
    {
      title: "عدم وجود نظام مبيعات (Funnel) مؤتمت",
      desc: "تبدد وقتك الثمين في الشرح الفردي لكل زائر في الرسائل الخاصة، بدلاً من جعل الفنل يقوم بالتصفية والإغلاق التلقائي.",
      icon: AlertTriangle,
    },
    {
      title: "السقوط في وحل حرب تكسير الأسعار",
      desc: "المنافسة التقليدية تجبرك على تدمير هامش ربحك لتقديم الخدمة الأرخص بدلاً من أن تصبح اختيار العميل الأوحد بمرتبة خبير.",
      icon: Swords,
    }
  ];

  return (
    <section className="bg-brand-darkgray text-brand-white py-24 px-4 border-b border-brand-purple/10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center space-y-4 mb-16">
          <span className="text-brand-red font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-red/10 border border-brand-red/20 rounded-full">
            أعراض الفشل وعشوائية الإدارة الرقمية
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold max-w-3xl mx-auto leading-tight text-white">
            لماذا تتبخر أحلام 95٪ من مقدمي الخدمات والمستشارين؟
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            إذا كنت تقع في واحدة من هذه المشاكل الكارثية، فتأكد أنك لست ضعيفاً فنياً، بل تفتقد إلى التوجيه الهيكلي والنظام التسويقي الصارم.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((prob, i) => {
            const Icon = prob.icon;
            return (
              <div 
                key={i} 
                className="bg-brand-black p-6 sm:p-8 rounded-2xl border border-brand-red/10 hover:border-brand-red/30 hover:shadow-[0_8px_30px_rgb(239,68,68,0.05)] transition duration-300 relative overflow-hidden group"
              >
                {/* Visual red gradient glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/5 rounded-full blur-2xl group-hover:bg-brand-red/10 transition" />
                
                <div className="w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/25 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-brand-red" />
                </div>
                
                <h3 className="text-lg font-bold text-brand-white mb-2 group-hover:text-brand-red transition">
                  {prob.title}
                </h3>
                
                <p className="text-sm text-gray-400 leading-relaxed font-medium">
                  {prob.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
