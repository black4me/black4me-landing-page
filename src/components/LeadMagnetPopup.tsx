'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function LeadMagnetPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Show popup after 5 seconds on the home page
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('hasSeenLeadMagnetPopup');
      if (!hasSeenPopup) {
        setIsOpen(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenLeadMagnetPopup', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, magnet: 'WELCOME10' })
      });
      
      if (res.ok) {
        setSuccess(true);
        localStorage.setItem('hasSeenLeadMagnetPopup', 'true');
        setTimeout(() => {
          setIsOpen(false);
          window.location.href = '/success?gift=true';
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" dir="rtl">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative">
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-center text-black">
          <h2 className="text-2xl font-bold mb-2">هدية مجانية وكود خصم!</h2>
          <p className="text-sm font-medium opacity-90">سجل الآن واحصل على دليل مجاني بالإضافة إلى كود خصم 10%</p>
        </div>
        
        <div className="p-6">
          {success ? (
            <div className="text-center text-green-600 py-6">
              <h3 className="text-xl font-bold mb-2">تم التسجيل بنجاح!</h3>
              <p>جاري توجيهك لصفحة الهدية...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">الاسم</label>
                <input
                  type="text"
                  placeholder="أدخل اسمك"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-brand-gold transition"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-slate-300">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:border-brand-gold transition text-left"
                  dir="ltr"
                  required
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-gold text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition cursor-pointer disabled:opacity-50 mt-2"
              >
                {submitting ? 'جاري الإرسال...' : 'احصل على الهدية الآن'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
