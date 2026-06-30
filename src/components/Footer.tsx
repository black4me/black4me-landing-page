"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Mail, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { siteSettings } = useApp();
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
              {siteSettings.site_logo ? (
                <img src={siteSettings.site_logo} alt="BLACK4ME" className="h-8 object-contain" />
              ) : (
                <>
                  <span className="w-9 h-9 rounded-lg bg-brand-gold text-brand-black font-black flex items-center justify-center font-mono text-sm" aria-hidden="true">B4</span>
                  <span className="font-mono text-base font-black tracking-widest text-white">BLACK4ME</span>
                </>
              )}
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
                <a href="https://www.instagram.com/black4mee/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition flex items-center gap-1.5" aria-label="انستقرام">
                  <span className="w-3.5 h-3.5">IG</span>
                  انستقرام
                </a>
              </li>
              <li>
                <a href="https://wa.me/96879191793" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition flex items-center gap-1.5" aria-label="تواصل واتساب">
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  +968 7919 1793
                </a>
              </li>
              <li>
                <a href="mailto:black4mestore@gmail.com" className="hover:text-brand-gold transition flex items-center gap-1.5" aria-label="إرسال بريد إلكتروني">
                  <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                  black4mestore@gmail.com
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

