import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Quote, Send, Sparkles, Check } from 'lucide-react';

export default function Testimonials() {
  const { testimonials, submitTestimonial } = useApp();
  
  // Local state for the add testimonial form
  const [name, setName] = useState('');
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Filter only approved testimonials for visitor landing page
  const approvedTestimonials = testimonials.filter(t => t.isApproved);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;
    submitTestimonial(name, country, rating, comment);
    setName('');
    setComment('');
    setRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="testimonials-section" className="bg-brand-black text-brand-white py-24 px-4 border-b border-brand-purple/10" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center space-y-4 mb-20">
          <span className="text-brand-gold font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
            قصص النجاح الحية لشركائنا
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
            ماذا يقول عملاء ومقتنو أصول BLACK4ME؟
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            تجارب حقيقية لمستشارين ومقدمي خدمات حوّلوا هيكل مشاريعهم وحققوا مبيعات ذات قيمة نخبوية.
          </p>
        </div>

        {/* Testimonials Masonry / Flex Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {approvedTestimonials.map((test) => (
            <div 
              key={test.id} 
              className="bg-brand-darkgray border border-brand-white/5 p-6 sm:p-8 rounded-2xl relative shadow-lg flex flex-col justify-between hover:border-brand-purple/30 transition duration-300 group"
            >
              <div className="absolute top-6 left-6 text-brand-purple/20">
                <Quote className="w-10 h-10 group-hover:text-brand-purple/40 transition" />
              </div>

              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex gap-1 text-brand-gold">
                  {[...Array(5)].map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`w-4.5 h-4.5 ${idx < test.rating ? 'fill-current' : 'text-gray-600'}`} 
                    />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-semibold">
                  "{test.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 border-t border-brand-white/5 mt-6">
                {/* Default User Avatars Initials */}
                <span className="w-10 h-10 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-gold font-bold flex items-center justify-center text-xs">
                  {test.customerName.charAt(0)}
                </span>
                <div className="text-right">
                  <h4 className="text-sm font-bold text-white leading-none">{test.customerName}</h4>
                  <span className="text-[10px] text-gray-500 font-medium block mt-1">{test.country}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submission of review Form */}
        <div className="max-w-xl mx-auto bg-brand-darkgray border border-brand-white/10 p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <span>شاركنا تجربتك وتقييمك الشخصي</span>
          </h3>
          <p className="text-xs text-gray-400 mb-6 font-semibold">
            رأيك يهمنا في تحسين وتطوير أصولنا المعرفية. (ملاحظة: تظهر المراجعات على الصفحة بعد مراجعتها واعتمادها من قِبل مسؤول النظام).
          </p>

          {submitted ? (
            <div className="bg-brand-green/10 border border-brand-green/20 text-brand-green p-5 rounded-2xl text-center space-y-2">
              <span className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center font-bold text-base mx-auto">✓</span>
              <h4 className="text-sm font-bold">تم إرسال تقييمك بنجاح!</h4>
              <p className="text-xs text-gray-300">نشكرك بعمق على وقتك. تم فتح بطاقة مراجعة وستقوم الإدارة بالتحقق منها والموافقة عليها قريباً.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">الاسم الكامل</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="على سبيل المثال: فيصل العروي"
                    className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1">الدولة أو الإقامة</label>
                  <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition"
                  >
                    <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                    <option value="دولة الإمارات العربية المتحدة">دولة الإمارات العربية المتحدة</option>
                    <option value="دولة قطر">دولة قطر</option>
                    <option value="سلطنة عمان">سلطنة عمان</option>
                    <option value="جمهورية مصر العربية">جمهورية مصر العربية</option>
                    <option value="دولة الكويت">دولة الكويت</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">تقييمك للحزمة (1-5 نجوم)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`w-10 h-10 rounded-lg font-bold border flex items-center justify-center transition cursor-pointer text-sm ${
                        rating === num 
                          ? 'bg-brand-gold text-brand-black border-brand-gold font-black' 
                          : 'bg-brand-black text-gray-400 border-brand-white/10 hover:border-brand-gold/50'
                      }`}
                    >
                      {num} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">تعليقك أو مراجعتك التفصيلية</label>
                <textarea 
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="اكتب هنا تجربتك الحقيقية مع قراءة الكتاب أو تطبيق نظام الفنل والأثر المالي المتولد..."
                  className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-purple hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer text-sm"
              >
                <Send className="w-4 h-4" />
                <span>إرسال تقييمك للمراجعة الفورية</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
