import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Check, AlertCircle, Sparkles } from 'lucide-react';

export default function NewsletterSection() {
  const { subscribeNewsletter } = useApp();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    try {
      const res = await subscribeNewsletter(name, email, country);
      if (res.success) {
        setStatus({ type: 'success', message: res.message });
        setName('');
        setEmail('');
      } else {
        setStatus({ type: 'error', message: res.message });
      }
    } catch (error: any) {
      setStatus({ type: 'error', message: 'حدث خطأ غير متوقع' });
    } finally {
      // Auto clear newsletter status after 7 seconds
      setTimeout(() => {
        setStatus({ type: null, message: '' });
      }, 7000);
    }
  };

  return (
    <section id="newsletter-section" className="bg-brand-darkgray text-brand-white py-24 px-4 border-b border-brand-purple/10" dir="rtl">
      <div className="max-w-4xl mx-auto bg-brand-black border border-brand-white/10 p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-2xl">
        {/* Glow ambient decoration */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-48 bg-brand-purple/10 rounded-full blur-[80px]" />
        
        <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Right: Pitch copy */}
          <div className="md:col-span-6 space-y-4 text-right">
            <span className="text-brand-gold font-bold text-xs uppercase tracking-widest px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نشرة مبيعية استراتيجية فائقة القيمة</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">انضم لحضن المعرفة السرية</h3>
            <p className="text-sm text-gray-400 leading-relaxed font-semibold">
              انضم لأكثر من 1,200 مستشار ورائد رقمي في عالم العرب، وتلقى دورياً رسائل بريدية حصرية تفكك عيوب السوق وتعرض أسرار زيادة القيمة والتسويق المؤتمت مباشرة في صندوق بريدك الإلكتروني.
            </p>
          </div>

          {/* Left: Subscribe interactive form */}
          <div className="md:col-span-6">
            {status.type === 'success' ? (
              <div className="bg-brand-green/10 border border-brand-green/20 text-brand-green p-6 rounded-2xl text-center space-y-3 animate-fadeIn">
                <span className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center font-bold text-lg mx-auto">✓</span>
                <p className="text-sm font-bold">{status.message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                
                {status.type === 'error' && (
                  <div className="bg-brand-red/10 border border-brand-red/25 text-brand-red p-3 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{status.message}</span>
                  </div>
                )}

                <div>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="w-full bg-brand-darkgray border border-brand-white/10 p-3.5 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition"
                  />
                </div>

                <div>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="بريدك الإلكتروني التفصيلي"
                    className="w-full bg-brand-darkgray border border-brand-white/10 p-3.5 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition text-left font-mono"
                  />
                </div>

                <div>
                  <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-brand-darkgray border border-brand-white/10 p-3.5 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition"
                  >
                    <option value="المملكة العربية السعودية">المملكة العربية السعودية (موقع رئيسي)</option>
                    <option value="دولة الإمارات العربية المتحدة">دولة الإمارات العربية المتحدة</option>
                    <option value="دولة قطر">دولة قطر</option>
                    <option value="سلطنة عمان">سلطنة عمان</option>
                    <option value="جمهورية مصر العربية">جمهورية مصر العربية</option>
                    <option value="دولة الكويت">دولة الكويت</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-purple hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-xl transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer text-sm font-medium"
                >
                  <Mail className="w-4.5 h-4.5" />
                  <span>اشترك في النشرة المجانية اليوم</span>
                </button>

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
