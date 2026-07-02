import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4" dir="rtl">
      <div className="text-center max-w-lg">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-white text-3xl font-bold mb-4">
          مبروك! حزمتك في طريقها إليك
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          تم إرسال رابط التحميل لبريدك الإلكتروني — تحقق من صندوق الوارد أو Spam
        </p>
        <div className="bg-gray-900 border border-yellow-400/20 rounded-2xl p-6 mb-6">
          <p className="text-yellow-400 font-semibold mb-2">ماذا ستجد في إيميلك؟</p>
          <ul className="text-gray-300 text-sm space-y-2 text-right">
            <li>📖 رابط تحميل الكتاب PDF (81 صفحة)</li>
            <li>📋 6 قوالب جاهزة للاستخدام الفوري</li>
            <li>🎓 رابط النظام التعليمي الكامل</li>
            <li>📅 رابط حجز الاستشارة الفردية</li>
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <a
            href="mailto:black4mestore@gmail.com"
            className="bg-yellow-400 text-black font-bold py-3 px-6 rounded-xl hover:bg-yellow-300 transition"
          >
            لم يصلك الإيميل؟ تواصل معنا
          </a>
          <Link href="/" className="text-gray-500 hover:text-white transition text-sm">
            ← العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
