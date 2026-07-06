import AcademyAccessForm from "@/components/AcademyAccessForm";

export const metadata = {
  title: "دخول الأكاديمية | BLACK4ME",
  description: "بوابة دخول أكاديمية التسويق الرقمي للمشتركين",
};

export default function AcademyPage() {
  return (
    <div className="flex flex-col font-cairo text-white selection:bg-brand-gold/30 w-full h-full">
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">أكاديمية التسويق الرقمي</h1>
            <p className="text-gray-400 text-sm">
              أدخل كود الدخول الخاص بك للوصول إلى المنصة التعليمية والقوالب.
            </p>
          </div>
          
          <AcademyAccessForm />
        </div>
      </div>
    </div>
  );
}
