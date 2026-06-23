import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Sparkles, Send, CheckCircle2, PhoneCall } from 'lucide-react';

export default function ConsultationSection() {
  const { bookConsultation } = useApp();
  
  // Local state for interactive calendar scheduler
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) return;

    try {
      // Call our backend API which sends the email and tries to save to DB
      await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, customerEmail, notes })
      });
    } catch (err) {
      console.error("Failed to post consultation:", err);
    }

    setIsBooked(true);
    
    // Open Notion Calendar
    const notionUrl = `https://calendar.notion.so/meet/black4me/di783v4a?name=${encodeURIComponent(customerName)}&email=${encodeURIComponent(customerEmail)}`;
    window.open(notionUrl, '_blank');

    // Clear inputs
    setCustomerName('');
    setCustomerEmail('');
    setNotes('');
  };

  return (
    <section id="consultations-section" className="bg-brand-black text-brand-white py-24 px-4 border-b border-brand-white/5" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Promotion and Calendly External */}
          <div className="lg:col-span-6 space-y-6 text-right">
            <span className="text-brand-gold font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full inline-block">
              جلسة عمل فردية 1:1 غاية في القيمة
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              فك شفرات عملك مع جاسم محمد شخصياً
            </h2>

            <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-semibold">
              هل تجد صعوبة في مواءمة فصول الكتاب المكتشفة مع طبيعة مهاراتك أو خدماتك الفريدة؟ احجز جلسة استراتيجية مغلقة لدراسة تفاصيل مشروعك واستخراج العرض عالي القيمة المناسب لجمهورك.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 bg-brand-darkgray/50 p-4 rounded-xl border border-brand-white/5">
                <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="text-sm font-bold text-white">جلسة نقد ومكاشفة متكاملة</h4>
                  <p className="text-xs text-gray-400 mt-1 font-medium">سندرس حساباتك، عروضك، صفحات البيع، وقمع المبيعات الحالي لتشخيص نقاط التشتت.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-brand-darkgray/50 p-4 rounded-xl border border-brand-white/5">
                <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="text-sm font-bold text-white">رسم خريطة طريق تشغيلية فورية</h4>
                  <p className="text-xs text-gray-400 mt-1 font-medium">ستخرج من الجلسة بملف عملي صريح يحدد أولوية خطواتك للأيام الثلاثين القادمة.</p>
                </div>
              </div>
            </div>

            {/* Direct External Link */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <a 
                href="https://calendly.com/your-username" 
                target="_blank" 
                rel="noreferrer" 
                className="px-6 py-3 bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold/10 font-bold rounded-xl transition text-center text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>افتح حجز المواعيد المباشر (Calendly)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Custom Appointment Scheduler */}
          <div className="lg:col-span-6">
            <div className="bg-brand-darkgray border border-brand-white/10 p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

              <h3 className="text-xl font-bold text-white mb-1.5 flex items-center gap-1.5 border-b border-brand-white/5 pb-4">
                <Sparkles className="w-5 h-5 text-brand-gold" />
                <span>احجز وجدول جلستك هنا مجاناً (عرض توضيحي)</span>
              </h3>

              {isBooked ? (
                <div className="bg-brand-green/10 border border-brand-green/20 text-brand-green p-6 sm:p-8 rounded-2xl text-center space-y-4 my-6">
                  <CheckCircle2 className="w-12 h-12 text-brand-green mx-auto animate-bounce" />
                  <h4 className="text-lg font-bold">تم تسجيل طلبك بنجاح!</h4>
                  <p className="text-sm text-gray-200">
                    يرجى إكمال اختيار اليوم والساعة من خلال نافذة تقويم Notion التي فُتحت لك.
                  </p>
                  <p className="text-xs text-gray-400">
                    (إذا لم تفتح النافذة، <a href="https://calendar.notion.so/meet/black4me/di783v4a" target="_blank" rel="noreferrer" className="text-brand-gold underline">اضغط هنا</a>)
                  </p>
                  <button 
                    onClick={() => setIsBooked(false)}
                    className="text-xs mt-4 bg-brand-green/20 hover:bg-brand-green/30 border border-brand-green/30 px-4 py-2 rounded-lg font-bold transition cursor-pointer"
                  >
                    حجز موعد إضافي آخر
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-5 pt-3">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">اسمك الكامل</label>
                      <input 
                        type="text" 
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="على سبيل المثال: فيصل السديري"
                        className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1">بريدك الإلكتروني</label>
                      <input 
                        type="email" 
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="faisal@example.com"
                        className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition text-left font-mono" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 block mb-1">تحدي عملك الحالي (اختياري)</label>
                    <textarea 
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="صف بايجاز طبيعة عملك الحالي أو العائق الأكثر إحباطاً لتسريع وقت دراسته..."
                      className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition resize-none"
                    />
                  </div>

                  <div className="bg-brand-purple/10 border border-brand-purple/20 p-4 rounded-xl flex items-start gap-3 mt-2">
                    <Calendar className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-300 leading-relaxed font-medium">
                      سيتم تحويلك في الخطوة التالية إلى <strong className="text-white">Notion Calendar</strong> لاختيار اليوم والساعة المناسبة لك لتأكيد الجلسة.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold py-3.5 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer text-sm mt-4"
                  >
                    <span>المتابعة لاختيار التاريخ والوقت</span>
                    <Calendar className="w-4 h-4 ml-1" />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
