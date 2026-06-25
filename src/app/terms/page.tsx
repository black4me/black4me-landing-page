import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-base text-gray-200" dir="rtl">
      <Navbar />
      <main className="pt-32 pb-24 section-padding">
        <div className="max-w-4xl mx-auto bg-surface-1 p-8 md:p-12 rounded-2xl border border-white/5 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-8 border-b border-white/10 pb-6">
            شروط الخدمة (Terms of Service)
          </h1>
          
          <div className="space-y-8 text-base md:text-lg leading-relaxed text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-brand-gold mb-3">1. مقدمة وتعريفات</h2>
              <p>
                مرحباً بك في BLACK4ME. تُطبق هذه الشروط على جميع زوار موقعنا والعملاء الذين يستفيدون من حزمة المنتجات الرقمية أو أنظمة التسويق الخاصة بنا.
                بمجرد شرائك لأي من منتجاتنا، فأنت توافق صراحة على هذه الشروط.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-gold mb-3">2. نطاق الخدمة</h2>
              <p>
                نحن نقدم كتباً رقمية، قوالب تسويقية جاهزة، واستشارات متخصصة تهدف إلى تحسين آلية جلب العملاء وعمليات البيع لديك. 
                لا نضمن تحقيق أرقام مبيعات معينة دون جهد حقيقي من طرفك وتطبيق صارم للمنهجية المطروحة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-gold mb-3">3. الشراء والدفع</h2>
              <p>
                تتم جميع المعاملات المالية عبر بوابات دفع آمنة ومعتمدة (Stripe و PayPal). كافة الأسعار المعروضة نهائية، وقد تضاف بعض الضرائب المحلية 
                حسب موقعك الجغرافي. تحتفظ BLACK4ME بالحق في تعديل الأسعار في أي وقت.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-gold mb-3">4. الضمان وسياسة الاسترداد</h2>
              <p>
                نحن واثقون من جودة الحزمة المقدمة. نقدم ضماناً يشمل العمل المجاني أو استرداد المبلغ بالكامل خلال [14 يوماً] 
                من تاريخ الشراء، وذلك إذا طبقت جميع الإرشادات والخطوات حرفياً ولم تحقق أي نتيجة ملموسة في معدلات التحويل لديك.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-gold mb-3">5. حقوق الملكية الفكرية</h2>
              <p>
                جميع المواد المقدمة في الحزمة (الكتاب التأسيسي، القوالب، الفيديوهات) محمية بحقوق الطبع والنشر. 
                يُمنع منعاً باتاً إعادة بيع، توزيع، أو مشاركة هذه المواد مع أي طرف ثالث دون إذن كتابي مسبق منا.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-gold mb-3">6. حدود المسؤولية</h2>
              <p>
                لا تتحمل BLACK4ME أو أي من ممثليها المسؤولية عن أية أضرار عرضية أو غير مباشرة قد تنشأ عن سوء استخدام القوالب أو الإخفاق في تحقيق أهدافك التجارية.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-gold mb-3">7. القانون الواجب التطبيق</h2>
              <p>
                تخضع هذه الشروط والأحكام وتُفسر وفقاً لقوانين [سلطنة عمان]. في حال حدوث أي نزاع، تكون المحاكم في [سلطنة عمان] هي صاحبة الاختصاص.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-gold mb-3">8. معلومات التواصل</h2>
              <p>
                في حال وجود أي استفسارات أو طلبات دعم، يمكنك مراسلتنا دائماً على: 
                <br/>
                <strong>البريد الإلكتروني:</strong> support@black4me.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
