'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '../lib/tracking';
import { useRouter } from 'next/navigation';

export default function DynamicOfferForm({ offer }: { offer: any }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    trackEvent('DynamicOfferViewed', {
      offer_id: offer.id,
      offer_slug: offer.slug,
      offer_type: offer.type,
      offer_title: offer.title
    });
  }, [offer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      trackEvent('DynamicOfferStarted', {
        offer_id: offer.id,
        offer_slug: offer.slug,
        offer_type: offer.type,
        email,
        name
      });

      // Submit to an endpoint to register the lead & trigger automation if needed
      await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, magnet: offer.slug, type: offer.type })
      });

      trackEvent('DynamicOfferClaimed', {
        offer_id: offer.id,
        offer_slug: offer.slug,
        offer_type: offer.type,
        email
      });

      // Redirect logic based on free vs paid
      if (offer.type === 'free_gift') {
        window.location.href = offer.redirect_url || '/success?gift=true';
      } else {
        // Paid flow
        trackEvent('DynamicOfferCheckoutStarted', {
          offer_slug: offer.slug,
          offer_type: offer.type
        });
        window.location.href = offer.redirect_url || `/checkout?offer=${offer.slug}`;
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">الاسم الكامل</label>
        <input
          type="text"
          placeholder="محمد أحمد"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-4 rounded-xl border transition-all"
          required
          disabled={submitting}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">البريد الإلكتروني</label>
        <input
          type="email"
          placeholder="mohamed@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 rounded-xl border transition-all"
          required
          disabled={submitting}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-gold text-black py-4 rounded-xl font-black text-lg hover:bg-yellow-400 transition-all cta-glow disabled:opacity-50 mt-4"
      >
        {submitting ? 'جاري المعالجة...' : offer.button_text}
      </button>
      
      {offer.type === 'free_gift' && (
        <p className="text-center text-xs text-gray-500 mt-4">
          ✓ خصوصية كاملة • ✓ قابل للإلغاء في أي وقت • ✓ بدون مزعجات
        </p>
      )}
      {offer.type !== 'free_gift' && (
        <p className="text-center text-xs text-gray-500 mt-4 flex justify-center items-center gap-2">
          <span>🔒 دفع آمن</span>
          <span>•</span>
          <span>ضمان استرداد 7 أيام</span>
        </p>
      )}
    </form>
  );
}
