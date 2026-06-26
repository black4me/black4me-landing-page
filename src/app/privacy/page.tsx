import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'سياسة خصوصية BLACK4ME — كيف نجمع ونستخدم ونحمي بياناتك الشخصية.',
  alternates: {
    canonical: 'https://www.black4me.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-black py-16 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">سياسة الخصوصية</h1>
        <p className="text-xs text-gray-500 mb-8">آخر تحديث: يونيو 2026</p>

        <div className="space-y-8 text-sm text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. المعلومات التي نجمعها</h2>
            <p>
              نجمع المعلومات التالية عند تسجيلك أو شرائك: الاسم الكامل، البريد الإلكتروني، البلد. لا نجمع بيانات بطاقات الدفع — يتم معالجتها مباشرة عبر Stripe أو PayPal بتشفير SSL 256-bit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. كيف نستخدم بياناتك</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>تسليم المنتجات الرقمية المشتراة</li>
              <li>إرسال بريد ترحيبي وروابط التنزيل</li>
              <li>إرسال نشرة تسويقية (إذا اشتركت فيها)</li>
              <li>التواصل بخصوص الاستشارات والدعم</li>
              <li>تحسين تجربة المنصة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. حماية البيانات</h2>
            <p>
              نستخدم بنية تحتية مؤمنة عبر Supabase وVercel. جميع البيانات مشفرة أثناء النقل والتخزين. نلتزم بأفضل ممارسات حماية البيانات.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. ملفات تعريف الارتباط (Cookies)</h2>
            <p>
              نستخدم ملفات تعريف الارتباط لتسجيل الدخول وتحسين التجربة. كما نستخدم Google Analytics لفهم سلوك الزوار على الموقع بشكل مجهول.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. مشاركة البيانات</h2>
            <p>
              لا نبيع أو نشارك بياناتك مع أطراف خارجية. نشارك البيانات فقط مع مزودي الخدمة الضروريين (Stripe، PayPal، Resend) لإتمام عمليات الدفع والتواصل.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. حقوقك</h2>
            <p>
              يحق لك طلب الوصول إلى بياناتك الشخصية، تعديلها، أو حذفها في أي وقت. أرسل طلبك إلى support@black4me.com وسنستجيب خلال 48 ساعة.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. التواصل</h2>
            <p>
              لأي أسئلة حول سياسة الخصوصية: support@black4me.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
