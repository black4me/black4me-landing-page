'use client';

import { useState } from 'react';

export default function LeadMagnet() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/lead-magnet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, magnet: 'landing-page-template' })
    });
    setSubmitted(true);
  };
  
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          هدية مجانية قبل الشراء 🎁
        </h2>
        <p className="text-xl mb-8">
          حمّل نموذج صفحة هبوط عالية التحويل — جاهز للتعديل والنسخ
        </p>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="اسمك"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mb-3 rounded text-black outline-none border border-transparent focus:border-black transition"
              required
            />
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 rounded text-black outline-none border border-transparent focus:border-black transition"
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition cursor-pointer"
            >
              ← أرسل لي النموذج المجاني
            </button>
            <p className="text-sm mt-3 opacity-75 font-medium">
              ✓ خصوصية كاملة • ✓ قابل للإلغاء في أي وقت • ✓ بدون spam
            </p>
          </form>
        ) : (
          <div className="bg-white p-6 rounded-lg text-center mx-auto max-w-md text-black">
            <p className="text-xl font-bold mb-2 text-green-600">✅ تم بنجاح!</p>
            <p className="font-medium text-gray-700">تفقد بريدك الإلكتروني خلال دقائق. أرسلنا لك النموذج.</p>
          </div>
        )}
      </div>
    </section>
  );
}
