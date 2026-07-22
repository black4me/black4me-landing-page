"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, Clock, AlertTriangle, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { registerOfferLead, OfferPage } from '../../../server/actions/crm';

interface OfferPageClientProps {
  offer: OfferPage;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export default function OfferPageClient({ offer, utmSource, utmMedium, utmCampaign }: OfferPageClientProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // Track page view event and heartbeat
  useEffect(() => {
    // 1. Initial Page View
    let sessionId = localStorage.getItem('b4m_session');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('b4m_session', sessionId);
    }
    
    let duration = 0;
    const startTime = Date.now();

    const trackPageEvent = async (type: string, currentDuration: number) => {
      try {
        await fetch('/api/tracking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: type,
            parameters: {
              offer_slug: offer.slug,
              page_path: window.location.pathname,
              session_id: sessionId,
              duration_seconds: currentDuration,
              utm_source: utmSource,
              utm_medium: utmMedium,
              utm_campaign: utmCampaign
            }
          })
        });
      } catch (e) {
        // ignore
      }
    };

    // Track initial view
    trackPageEvent(offer.type === 'free_gift' ? 'GiftView' : 'OfferView', 0);
    console.log(`[Tracking] DynamicOfferViewed: ${offer.slug}`);
    
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'DynamicOfferViewed', {
        slug: offer.slug,
        type: offer.type,
        title: offer.title
      });
    }

    // 2. Heartbeat every 10 seconds
    const heartbeatInterval = setInterval(() => {
      duration = Math.floor((Date.now() - startTime) / 1000);
      trackPageEvent('Heartbeat', duration);
    }, 10000);

    // 3. Set up timer if enabled
    let timerInterval: any;
    if (offer.enable_timer && offer.timer_end) {
      const targetTime = new Date(offer.timer_end).getTime();

      const updateTimer = () => {
        const now = Date.now();
        const diff = targetTime - now;

        if (diff <= 0) {
          setIsExpired(true);
          setTimeLeft(null);
        } else {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000)
          });
        }
      };

      updateTimer();
      timerInterval = setInterval(updateTimer, 1000);
    }

    // 4. Page Leave
    const handleBeforeUnload = () => {
      duration = Math.floor((Date.now() - startTime) / 1000);
      // We use navigator.sendBeacon for reliable exit tracking if possible, or synchronous fetch
      const payload = JSON.stringify({
        eventType: 'PageLeave',
        parameters: {
          offer_slug: offer.slug,
          page_path: window.location.pathname,
          session_id: sessionId,
          duration_seconds: duration
        }
      });
      navigator.sendBeacon('/api/tracking', payload);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(heartbeatInterval);
      if (timerInterval) clearInterval(timerInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Also track leave on component unmount (SPA navigation)
      duration = Math.floor((Date.now() - startTime) / 1000);
      trackPageEvent('PageLeave', duration);
    };
  }, [offer, utmSource, utmMedium, utmCampaign]);

  const handleInputFocus = () => {
    console.log(`[Tracking] DynamicOfferStarted: ${offer.slug}`);
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'DynamicOfferStarted', {
        slug: offer.slug
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isExpired) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Register lead
      const res = await registerOfferLead({
        name,
        email,
        slug: offer.slug,
        offerId: offer.id || '',
        type: offer.type,
        utmSource,
        utmMedium,
        utmCampaign
      });

      if (!res.success) {
        throw new Error(res.error || 'حدث خطأ ما أثناء تسجيل البيانات.');
      }

      // Track claimed event
      console.log(`[Tracking] DynamicOfferClaimed: ${offer.slug}`);
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('trackCustom', 'DynamicOfferClaimed', {
          slug: offer.slug,
          type: offer.type
        });
      }

      setSuccessMessage('تم تسجيل بياناتك بنجاح! جاري تحويلك...');

      // Logic based on type
      if (offer.type === 'free_gift') {
        // Free gift routes to thank you page or custom redirect
        setTimeout(() => {
          if (offer.redirect_url) {
            router.push(offer.redirect_url);
          } else {
            router.push(`/offer/${offer.slug}/thank-you`);
          }
        }, 1500);
      } else {
        // Paid offer / product / service routes to checkout
        console.log(`[Tracking] DynamicOfferCheckoutStarted: ${offer.slug}`);
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('trackCustom', 'DynamicOfferCheckoutStarted', {
            slug: offer.slug
          });
        }

        setTimeout(() => {
          if (offer.redirect_url) {
            router.push(offer.redirect_url);
          } else {
            router.push('/checkout');
          }
        }, 1500);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'عذراً، فشل تسجيل الطلب. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#070709]">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full space-y-8 bg-[#0e0e12] border border-white/5 p-6 sm:p-10 rounded-3xl shadow-2xl relative z-10">
        
        {/* Top Header Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            {offer.type === 'free_gift' ? 'هدية مجانية حصرية' : 'عرض مميز وخاص'}
          </span>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          
          {/* Right/Left Image Side */}
          <div className="lg:col-span-5 flex justify-center">
            {offer.image_url ? (
              <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-lg aspect-square w-full max-w-[320px]">
                <img 
                  src={offer.image_url} 
                  alt={offer.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            ) : (
              <div className="w-full max-w-[320px] aspect-square rounded-2xl bg-gradient-to-br from-brand-gold/10 to-purple-900/10 border border-white/5 flex flex-col items-center justify-center p-6 text-center shadow-inner">
                <div className="w-16 h-16 rounded-full bg-brand-gold/20 flex items-center justify-center mb-4">
                  <Gift className="w-8 h-8 text-brand-gold" />
                </div>
                <h4 className="text-white font-bold text-lg mb-1">{offer.title}</h4>
                <p className="text-xs text-gray-500">BLACK4ME PREMIUM OS</p>
              </div>
            )}
          </div>

          {/* Form & Info Side */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3 text-right">
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {offer.title}
              </h1>
              {offer.subtitle && (
                <p className="text-base sm:text-lg text-brand-gold font-bold">
                  {offer.subtitle}
                </p>
              )}
              {offer.description && (
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-light">
                  {offer.description}
                </p>
              )}
            </div>

            {/* Countdown Timer UI */}
            {offer.enable_timer && (
              <div className="bg-[#121217] border border-white/5 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">الوقت المتبقي للحصول على العرض:</span>
                  <Clock className="w-4 h-4 text-brand-gold" />
                </div>

                {isExpired ? (
                  <div className="flex items-center gap-2 justify-center py-2 text-red-500 font-bold bg-red-950/20 border border-red-900/30 rounded-xl">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>عذراً، لقد انتهى هذا العرض المؤقت!</span>
                  </div>
                ) : timeLeft ? (
                  <div className="flex justify-center gap-4 text-center" dir="ltr">
                    <div className="bg-[#1a1a24] px-3 py-2 rounded-xl min-w-[60px] border border-white/5">
                      <span className="block text-xl font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                      <span className="text-[10px] text-gray-500 font-bold">يوم</span>
                    </div>
                    <div className="bg-[#1a1a24] px-3 py-2 rounded-xl min-w-[60px] border border-white/5">
                      <span className="block text-xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-[10px] text-gray-500 font-bold">ساعة</span>
                    </div>
                    <div className="bg-[#1a1a24] px-3 py-2 rounded-xl min-w-[60px] border border-white/5">
                      <span className="block text-xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-[10px] text-gray-500 font-bold">دقيقة</span>
                    </div>
                    <div className="bg-[#1a1a24] px-3 py-2 rounded-xl min-w-[60px] border border-white/5">
                      <span className="block text-xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-[10px] text-gray-500 font-bold">ثانية</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-10 animate-pulse bg-white/5 rounded-xl" />
                )}
              </div>
            )}

            {/* Success and Error messages */}
            {successMessage && (
              <div className="bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
                <p className="text-sm font-medium">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-950/30 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-500" />
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Input Form */}
            {!successMessage && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fullname" className="block text-xs font-bold text-gray-400 mb-1">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    required
                    disabled={isExpired || isSubmitting}
                    onFocus={handleInputFocus}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ادخل اسمك الكامل هنا"
                    className="w-full px-4 py-3 bg-[#111116] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-gold transition duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-400 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    disabled={isExpired || isSubmitting}
                    onFocus={handleInputFocus}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full px-4 py-3 bg-[#111116] border border-white/10 rounded-xl text-white placeholder-gray-600 text-left focus:outline-none focus:border-brand-gold transition duration-200"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isExpired || isSubmitting}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition duration-300 shadow-lg ${
                    isExpired 
                      ? 'bg-neutral-800 text-gray-500 cursor-not-allowed border border-white/5' 
                      : 'bg-brand-gold hover:bg-yellow-400 text-black active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{offer.button_text || 'احصل على العرض الآن'}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
