'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft, Download, Calendar } from 'lucide-react';
import { trackEvent } from '../../lib/tracking';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isPaypal = searchParams.get('paypal');
  const token = searchParams.get('token');
  const spaceremitOrder = searchParams.get('spaceremit_order');

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<{id?: string, title: string, file_url: string | null} | null>(null);
  const [isPendingSpaceremit, setIsPendingSpaceremit] = useState(false);
  const [error, setError] = useState('');
  const [purchaseTracked, setPurchaseTracked] = useState(false);

  useEffect(() => {
    async function processPayment() {
      try {
        if (sessionId) {
          // Verify Stripe Payment
          const res = await fetch(`/api/order/verify?session_id=${sessionId}`);
          const data = await res.json();
          if (data.success) {
            setProduct(data.product);
          } else {
            setError(data.error || 'فشل التحقق من الدفع');
          }
        } else if (isPaypal && token) {
          // Capture PayPal Payment
          const res = await fetch('/api/checkout/paypal/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: token })
          });
          const data = await res.json();
          if (data.success) {
             setProduct(data.product);
          } else {
             setError(data.error || 'فشل تأكيد الدفع عبر بايبال');
          }
        } else if (spaceremitOrder) {
          setIsPendingSpaceremit(true);
          // Set a dummy product title so the rest of the page doesn't crash
          setProduct({ title: 'طلب الشراء عبر الحوالة (قيد المراجعة)', file_url: null });
        } else {
          setError('رابط غير صالح');
        }
      } catch (err) {
        setError('حدث خطأ أثناء معالجة الطلب');
      } finally {
        setLoading(false);
      }
    }

    processPayment();
  }, [sessionId, isPaypal, token]);

  useEffect(() => {
    if (loading || error || !product || purchaseTracked) {
      return;
    }

    trackEvent('Purchase', {
      currency: 'USD',
      cart_value: product.file_url ? 49 : 149,
      transaction_id: sessionId || token || product.title,
      product_name: product.title,
      product_id: product.id || 'unknown',
    });
    setPurchaseTracked(true);
  }, [error, loading, product, purchaseTracked, sessionId, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-16 h-16 text-brand-purple animate-spin mb-6" />
        <h2 className="text-2xl font-black text-white mb-2">جاري تأكيد الدفع...</h2>
        <p className="text-gray-400 text-sm">يرجى الانتظار، لا تقم بإغلاق هذه الصفحة.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-brand-red/10 text-brand-red rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-4">عذراً، حدث خطأ!</h2>
        <p className="text-gray-400 mb-8">{error}</p>
        <Link href="/" className="bg-brand-white/5 hover:bg-brand-white/10 border border-brand-white/10 text-white font-bold py-3 px-8 rounded-xl transition-all">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const handleCtaClick = (target: string) => {
    trackEvent('ThankYouOfferClicked', {
      product_name: product?.title || 'unknown',
      target_cta: target
    });
  };

  const isBook = !!product?.file_url;
  const isBundle = !isBook && !isPendingSpaceremit;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto" dir="rtl">
      <div className="w-24 h-24 bg-brand-green/10 text-brand-green rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-lg shadow-brand-green/10">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      
      <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
        شكرًا لك!<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-gold to-brand-gold-dark">تم الدفع بنجاح 🎉</span>
      </h1>
      
      {isPendingSpaceremit ? (
        <p className="text-base text-gray-400 mb-12 leading-relaxed">
          لقد تم استلام طلبك وإيصال الدفع بنجاح. وهو الآن <span className="text-brand-blue font-bold">قيد المراجعة</span>.
          سيتم تفعيل حسابك وإرسال بيانات الدخول إلى بريدك الإلكتروني بمجرد التأكد من الحوالة خلال 24 ساعة كحد أقصى.
        </p>
      ) : (
        <p className="text-base text-gray-400 mb-12 leading-relaxed">
          لقد تم استلام طلبك لـ <span className="text-brand-purple-light font-bold">"{product?.title}"</span> بنجاح. 
          تم إرسال رسالة تأكيد إلى بريدك الإلكتروني تحتوي على جميع التفاصيل اللازمة لدخول النظام.
        </p>
      )}

      {isBook ? (
        <div className="glass-gold rounded-3xl p-8 w-full mb-12 text-right space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-3">تحميل الكتاب والملحقات</h3>
            <p className="text-sm text-gray-400 mb-4">يمكنك تنزيل الكتاب والقوالب المرفقة مباشرة من الرابط أدناه.</p>
            <a 
              href={product.file_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => handleCtaClick('download_book')}
              className="cta-glow inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3 bg-brand-gold hover:bg-yellow-400 text-brand-black font-black rounded-2xl transition-all"
            >
              <Download className="w-5 h-5" />
              <span>تنزيل الملفات الآن</span>
            </a>
          </div>

          <div className="border-t border-white/5 pt-6 space-y-4">
            <span className="text-xs text-brand-gold font-black uppercase tracking-wider">🎯 الخطوة التالية المقترحة:</span>
            <h4 className="text-lg font-bold text-white">هل تريد تطبيق محتوى الكتاب عملياً على مشروعك؟</h4>
            <div className="space-y-3">
              <Link
                href="/consultation"
                onClick={() => handleCtaClick('book_consultation')}
                className="w-full py-4 px-6 rounded-2xl bg-brand-gold hover:bg-yellow-400 text-black font-black text-base flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 shrink-0" />
                  <span>احجز جلسة لتطبيق ما تعلمته من الكتاب</span>
                </div>
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <Link
                href="/product/black-digital-marketing-bundle"
                onClick={() => handleCtaClick('view_bundle')}
                className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-between transition-all"
              >
                <span>استكشف الباقة المتكاملة للتسويق الرقمي</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : isBundle ? (
        <div className="glass-gold rounded-3xl p-8 w-full mb-12 text-right space-y-6">
          <div className="space-y-4">
            <span className="text-xs text-brand-gold font-black uppercase tracking-wider">🚀 الخطوة الأولى لبدء رحلتك:</span>
            <h4 className="text-lg font-bold text-white">ابدأ رحلتك التعليمية معنا اليوم</h4>
            <div className="space-y-3">
              <Link
                href="/portal"
                onClick={() => handleCtaClick('login_portal')}
                className="w-full py-4 px-6 rounded-2xl bg-brand-gold hover:bg-yellow-400 text-black font-black text-base flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 shrink-0" />
                  <span>ابدأ الدخول إلى الأكاديمية الآن</span>
                </div>
                <ArrowLeft className="w-5 h-5" />
              </Link>

              <Link
                href="/blog"
                onClick={() => handleCtaClick('watch_welcome')}
                className="w-full py-4 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm flex items-center justify-between transition-all"
              >
                <span>شاهد رسالة البداية أو الخطوة الأولى</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-3xl p-8 w-full mb-12">
          <h3 className="text-lg font-bold text-white mb-2">الخطوة القادمة</h3>
          <p className="text-sm text-gray-400">
            سنقوم بمراجعة إيصال التحويل قريباً. سيصلك إشعار بالبريد الإلكتروني فور تفعيل الحساب.
          </p>
        </div>
      )}

      <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
        <span>العودة إلى المنصة</span>
        <ArrowLeft className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-brand-black py-16 px-4">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-brand-purple animate-spin" />
        </div>
      }>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
