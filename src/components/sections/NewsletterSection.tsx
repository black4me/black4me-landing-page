"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

import * as tracking from '@/lib/tracking';

export default function NewsletterSection() {
  const { subscribeNewsletter } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const result = await subscribeNewsletter(name, email, '');
    setStatus({ type: result.success ? 'success' : 'error', message: result.message });
    if (result.success) { 
      tracking.trackEvent('NewsletterSignup', { email, customer_name: name });
      tracking.trackEvent('Lead', { email, customer_name: name });
      setName(''); 
      setEmail(''); 
    }
  };

  return (
    <section className="section-padding bg-surface-1 border-t border-brand-white/5" dir="rtl" aria-labelledby="newsletter-heading">
      <div className="max-w-2xl mx-auto text-center">
        <h2 id="newsletter-heading" className="text-xl md:text-2xl font-black text-white mb-3">
          انضم لنشرتنا التسويقية المجانية
        </h2>
        <p className="text-sm text-gray-300 mb-8">
          نصائح تسويقية أسبوعية، قوالب مجانية، وعروض حصرية مباشرة في بريدك.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" aria-label="اشترك في النشرة التسويقية">
          <div className="flex-1">
            <label htmlFor="newsletter-name" className="sr-only">الاسم</label>
            <input
              id="newsletter-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك"
              required
              className="w-full bg-brand-black border border-brand-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:border-brand-purple text-sm"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">البريد الإلكتروني</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="بريدك الإلكتروني"
              required
              dir="ltr"
              className="w-full bg-brand-black border border-brand-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:border-brand-purple text-sm text-left"
            />
          </div>
          <button
            type="submit"
            className="bg-brand-gold hover:bg-yellow-400 text-brand-black font-bold py-3 px-6 rounded-xl transition-all text-sm flex-shrink-0"
          >
            اشترك مجاناً
          </button>
        </form>

        {status.type && (
          <p className={`mt-4 text-sm ${status.type === 'success' ? 'text-brand-green' : 'text-brand-red'}`}>
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
}
