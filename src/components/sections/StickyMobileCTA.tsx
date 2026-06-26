"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StickyMobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="sticky-cta lg:hidden">
      <Link
        href="/checkout"
        className="cta-glow bg-brand-gold hover:bg-yellow-400 text-brand-black font-black py-3 px-6 rounded-xl text-sm text-center block"
      >
        احصل على الحزمة الشاملة — $49
      </Link>
    </div>
  );
}
