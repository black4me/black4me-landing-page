import React from 'react';
import { Download, MessageCircle, PhoneCall, Mail, CheckCircle, Sparkles } from 'lucide-react';

interface ThankYouPageProps {
  onBackToHome: () => void;
  onNavigateToPortal: () => void;
}

export default function ThankYouPage({ onBackToHome, onNavigateToPortal }: ThankYouPageProps) {
  
  // Custom dummy download links that generate native browser file transfers
  const handleDownload = (fileName: string) => {
    // Mimic actual binary download helper
    alert(`[تنزيل رقمي] جاري بدء تنزيل ملف "${fileName}" بجودة عالية PDF فورا... المرجو حفظ الأصول.`);
  };

  return (
    <div className="bg-brand-black min-h-screen text-brand-white py-20 px-4 md:px-8 flex flex-col items-center justify-center relative overflow-hidden" dir="rtl">
      {/* Glow decorative items */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-green/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-purple/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-3xl w-full text-center space-y-8 relative z-10">
        
        {/* Animated Check badge */}
        <div className="w-20 h-20 rounded-full bg-brand-green/20 border-2 border-brand-green flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(34,197,94,0.3)] animate-pulse">
          <CheckCircle className="w-12 h-12 text-brand-green" />
        </div>

        <div className="space-y-3">
          <span className="text-brand-gold font-bold text-xs uppercase tracking-widest bg-brand-gold/10 border border-brand-gold/20 px-3 py-1 rounded-full">
            عملية الشراء آمنة ومكتملة بنجاح %100
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">نشكـرك لعظيم ثقتك بنظام BLACK4ME!</h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto font-medium">
            مرحباً بك في نادي النخبة. تم تسجيل حساب العميل الخاص بك وتفعيل خوادم التراخيص. يمكنك تنزيل أصولك الرقمية تالياً مدى الحياة.
          </p>
        </div>

        {/* Dynamic Download Buttons Column */}
        <div className="bg-brand-darkgray border border-brand-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
          <h3 className="text-sm font-bold text-gray-400 text-right border-b border-brand-white/5 pb-3">روابط التنزيل المباشرة المفعلة</h3>
          
          <div className="grid sm:grid-cols-2 gap-4 text-right">
            
            {/* Download Main Book */}
            <div className="bg-brand-black p-4 rounded-xl border border-brand-gold/20 flex flex-col justify-between items-start gap-4">
              <div>
                <span className="text-[10px] text-brand-gold font-bold uppercase block">المنتج الأساسي</span>
                <h4 className="text-sm font-bold text-white mt-1">كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"</h4>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">SIZE: 14.5 MB | FORMAT: PDF High-Res</p>
              </div>
              <button
                onClick={() => handleDownload('بدون التسويق كارثة تهدد ثروتك.pdf')}
                className="w-full py-2.5 bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold text-xs rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل كتاب المبيعات</span>
              </button>
            </div>

            {/* Download Gift Book */}
            <div className="bg-brand-black p-4 rounded-xl border border-brand-purple/20 flex flex-col justify-between items-start gap-4">
              <div>
                <span className="text-[10px] text-brand-purple font-bold uppercase block">الهدية الكبرى المرفقة</span>
                <h4 className="text-sm font-bold text-white mt-1">كتاب "10 مبادئ للنجاح المالي والشخصي"</h4>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">SIZE: 8.2 MB | FORMAT: PDF Complete</p>
              </div>
              <button
                onClick={() => handleDownload('10 مبادئ للنجاح المالي والشخصي.pdf')}
                className="w-full py-2.5 bg-brand-purple hover:bg-indigo-700 text-white font-extrabold text-xs rounded-lg transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل كتاب النجاح المالي</span>
              </button>
            </div>

          </div>
        </div>

        {/* Promotion Call to Actions list */}
        <div className="grid sm:grid-cols-12 gap-4">
          
          {/* Action: WhatsApp Chat */}
          <a
            href="https://wa.me/966XXXXXXXXX" 
            target="_blank" 
            rel="noreferrer"
            className="sm:col-span-6 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/25 p-5 rounded-2xl flex items-center gap-4 transition text-right group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-6 h-6 shrink-0" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-gold transition leading-none">انضم لمجتمع الدعم المباشر (WhatsApp)</h4>
              <p className="text-xs text-gray-400 mt-1 leading-normal font-medium">مستعدون للإجابة على أي تحديات وتجيبك خدمة عملائنا فوراً.</p>
            </div>
          </a>

          {/* Action: Link to Consultation Scheduler */}
          <button
            onClick={onNavigateToPortal}
            className="sm:col-span-6 bg-brand-purple/15 hover:bg-brand-purple/25 border border-brand-purple/35 p-5 rounded-2xl flex items-center gap-4 transition text-right group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-purple/25 text-brand-gold flex items-center justify-center">
              <PhoneCall className="w-5 h-5 shrink-0" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-gold transition leading-none">جدولة استشاراتك الحرة الأولى</h4>
              <p className="text-xs text-gray-400 mt-1 leading-normal font-medium">احجز مقعدك الان عبر جدول المواعيد في لوحة العميل الخاصة بك.</p>
            </div>
          </button>

        </div>

        {/* Back Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            type="button" 
            onClick={onBackToHome}
            className="px-6 py-2.5 bg-brand-darkgray hover:bg-brand-white/5 border border-brand-white/10 text-gray-300 rounded-xl text-xs transition font-semibold cursor-pointer"
          >
            العودة للصفحة الرئيسية
          </button>
          
          <button 
            type="button" 
            onClick={onNavigateToPortal}
            className="px-6 py-2.5 bg-gradient-to-l from-brand-purple/40 to-brand-purple/10 border border-brand-purple/40 text-white rounded-xl text-xs transition font-bold cursor-pointer"
          >
            الذهاب لمنطقة العميل وإدارة الطلبات
          </button>
        </div>

      </div>
    </div>
  );
}
