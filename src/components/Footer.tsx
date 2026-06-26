"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-brand-black border-t border-brand-white/5 pt-16 pb-8 px-4" dir="rtl" role="contentinfo" aria-label="تذييل الموقع">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-lg bg-brand-gold text-brand-black font-black flex items-center justify-center font-mono text-sm" aria-hidden="true">B4</span>
              <span className="font-mono text-base font-black tracking-widest text-white">BLACK4ME</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              منصة متخصصة في بناء أنظمة تسويق رقمية متكاملة للسوق العربي. أدوات عملية، قوالب جاهزة، واستشارات مباشرة.
            </p>
            <p className="text-xs text-gray-400 mt-3">بواسطة جاسم محمد (Jasim Mohammed)</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm text-gray-400" role="list" aria-label="روابط سريعة">
              <li><Link href="/#pricing-section" className="hover:text-brand-gold transition">العرض والأسعار</Link></li>
              <li><Link href="/#faq-section" className="hover:text-brand-gold transition">الأسئلة الشائعة</Link></li>
              <li><Link href="/#consultations-section" className="hover:text-brand-gold transition">حجز استشارة</Link></li>
              <li><Link href="/login" className="hover:text-brand-gold transition">دخول العملاء</Link></li>
            </ul>
          </div>

          {/* Legal + Contact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">الدعم والقانون</h4>
            <ul className="space-y-2.5 text-sm text-gray-400" role="list" aria-label="الدعم والقانون">
              <li><Link href="/terms" className="hover:text-brand-gold transition">الأحكام والشروط</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-gold transition">سياسة الخصوصية</Link></li>
              <li>
                <a href="mailto:info@black4me.com" className="hover:text-brand-gold transition flex items-center gap-1.5" aria-label="إرسال بريد إلكتروني إلى info@black4me.com">
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  info@black4me.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 py-6 border-t border-brand-white/5 mb-6" role="list" aria-label="معلومات الثقة والأمان">
          <div className="flex items-center gap-1.5 text-xs text-gray-400" role="listitem">
            <Shield className="w-4 h-4 text-brand-green" aria-hidden="true" />
            <span>دفع آمن 256-bit SSL</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400" role="listitem">
            <span className="font-mono font-bold text-gray-300">Stripe</span>
            <span>•</span>
            <span className="font-mono font-bold text-gray-300">PayPal</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400" role="listitem">
            <span>ضمان استرداد 7 أيام</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-[11px] text-gray-400">
          جميع الحقوق محفوظة © {new Date().getFullYear()} BLACK4ME. مصممة ومطوّرة بمعايير احترافية لتسريع مبيعاتك الرقمية.
        </div>
      </div>
    </footer>
  );
}
