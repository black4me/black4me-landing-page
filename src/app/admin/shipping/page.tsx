import React from 'react';
import { ShieldCheck, Mail, Globe, ArrowLeft, Download, Award, Laptop } from 'lucide-react';
import Link from 'next/link';

export default function DigitalDeliveryPage() {
  return (
    <div className="space-y-8 animate-fadeIn" dir="rtl">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">طرق الشحن والتسليم الرقمي (Digital Delivery)</h3>
        <p className="text-sm text-gray-500">نظام تسليم المنتجات الرقمية والخدمات الاستراتيجية التلقائي.</p>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="text-md font-bold text-yellow-400 mb-1">ℹ️ تنبيه التسليم الرقمي</h4>
          <p className="text-sm text-gray-300">
            بما أن منصة **BLACK4ME** تبيع منتجات رقمية 100% (كتّب إلكترونية، أنظمة تعليمية، وجلسات استشارية)، فإن خيارات الشحن الفعلي معطلة. يتم إيصال المنتجات رقمياً وبشكل تلقائي وآمن فور الدفع.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Book Delivery Setup */}
        <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-gold" />
              كتاب "بدون تسويق كارثة"
            </h4>
            <span className="bg-green-500/10 text-green-400 text-xs px-2.5 py-1 rounded-full font-bold">نشط وتلقائي</span>
          </div>
          <p className="text-xs text-gray-400">طريقة تسليم الكتاب الإلكتروني والملفات المجانية المرفقة.</p>
          
          <div className="space-y-3 bg-[#0d1117] p-4 rounded-xl border border-gray-800 text-xs text-gray-300">
            <div className="flex justify-between">
              <span>مسار التسليم:</span>
              <span className="font-mono text-gray-400">إيميل Resend + تحويل فوري لـ Google Drive</span>
            </div>
            <div className="flex justify-between">
              <span>رابط التحميل:</span>
              <a href="https://drive.google.com/drive/folders/14-SIzFYoOu7uIqs4qDNbQF-IrRlG8ker?usp=sharing" target="_blank" rel="noreferrer" className="text-brand-gold hover:underline">عرض المجلد 🔗</a>
            </div>
          </div>
        </div>

        {/* Consulting Delivery Setup */}
        <div className="bg-[#161b22] border border-gray-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-bold text-white flex items-center gap-2">
              <Laptop className="w-5 h-5 text-brand-purple" />
              جلسات الاستشارة الاستراتيجية
            </h4>
            <span className="bg-green-500/10 text-green-400 text-xs px-2.5 py-1 rounded-full font-bold">نشط وتلقائي</span>
          </div>
          <p className="text-xs text-gray-400">طريقة حجز وجدولة جلسات الاستشارة المباشرة عبر Cal.com.</p>
          
          <div className="space-y-3 bg-[#0d1117] p-4 rounded-xl border border-gray-800 text-xs text-gray-300">
            <div className="flex justify-between">
              <span>مسار التسليم:</span>
              <span className="font-mono text-gray-400">إيميل Resend + بوابة Cal.com للجدولة</span>
            </div>
            <div className="flex justify-between">
              <span>رابط الجدولة:</span>
              <a href="https://cal.com/black4me/consultation" target="_blank" rel="noreferrer" className="text-brand-gold hover:underline">افتح Cal.com 🔗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
