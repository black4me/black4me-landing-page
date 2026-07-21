"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { siteSettings } = useApp();

  // Don't show navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const isCheckout = pathname === '/checkout';

  const scrollToSection = (id: string, isPage: boolean = false) => {
    if (isPage) {
      window.location.href = id;
      return;
    }
    if (pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'المنتجات', href: '/#products-section' },
    { label: 'المدونة', href: '/blog' },
    { label: 'الاستشارات', href: '/consultation' },
    { label: 'تواصل معنا', href: '/#faq-section' },
  ];

  return (
    <nav className="bg-brand-black/80 backdrop-blur-md border-b border-brand-white/10 py-4 px-6 md:px-12 sticky top-0 z-50" dir="rtl" role="navigation" aria-label="القائمة الرئيسية">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="BLACK4ME - الصفحة الرئيسية">
          {siteSettings.site_logo ? (
            <img src={siteSettings.site_logo} alt="BLACK4ME" className="h-10 object-contain hover:scale-105 transition" />
          ) : (
            <>
              <div className="text-right flex flex-col justify-center">
                <span className="font-mono text-lg font-black tracking-widest leading-none block text-white">BLACK4ME</span>
              </div>
            </>
          )}
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-bold" role="menubar">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== '/');
            return (
              <Link
                key={index}
                href={link.href}
                className={`transition cursor-pointer ${isActive ? 'text-brand-gold shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-gray-400 hover:text-brand-gold'}`}
                role="menuitem"
                aria-label={link.label}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2 items-center">
          <Link
            href="/login"
            className="hidden md:flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white border border-brand-white/10 bg-brand-darkgray/90 hover:bg-brand-white/5 py-1.5 px-3 rounded-lg cursor-pointer transition"
            aria-label="دخول العملاء والإدارة"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400" aria-hidden="true" />
            <span>دخول العملاء والإدارة</span>
          </Link>
          
          <Link
            href={isCheckout ? '/' : '/checkout'}
            className="bg-brand-gold hover:bg-yellow-500 text-brand-black text-[11px] font-black py-2 px-4 rounded-xl shadow shadow-brand-gold/10 transition duration-300 transform hover:scale-[1.02] cursor-pointer"
            aria-label={isCheckout ? 'الرجوع ومراجعة المنصة' : 'امتلك العرض المحدود ($49)'}
          >
            {isCheckout ? 'الرجوع ومراجعة المنصة' : 'امتلك العرض المحدود ($49)'}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="القائمة"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden mt-4 pb-4 border-t border-brand-white/5 pt-4 space-y-3" role="menu">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href || (pathname?.startsWith(link.href) && link.href !== '/');
            return (
              <Link
                key={index}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block w-full text-right text-sm font-bold transition py-2 px-4 ${isActive ? 'text-brand-gold bg-brand-gold/10 border-r-2 border-brand-gold' : 'text-gray-400 hover:text-brand-gold'}`}
                role="menuitem"
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white py-2 px-4"
            onClick={() => setMobileMenuOpen(false)}
            role="menuitem"
          >
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>دخول العملاء والإدارة</span>
          </Link>
        </div>
      )}
    </nav>
  );
}

