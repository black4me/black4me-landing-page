'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isPaypal = searchParams.get('paypal');
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<{title: string, file_url: string | null} | null>(null);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-[#6C3BFF]/30 border-t-[#6C3BFF] rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-white mb-2">جاري تأكيد الدفع...</h2>
        <p className="text-gray-400">يرجى الانتظار، لا تقم بإغلاق هذه الصفحة.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">عذراً، حدث خطأ!</h2>
        <p className="text-gray-400 mb-8">{error}</p>
        <Link href="/" className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-8 mx-auto">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-black text-white mb-6">شكرًا لك! تم الدفع بنجاح 🎉</h1>
      <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
        لقد تم استلام طلبك لـ <span className="text-[#6C3BFF] font-bold">{product?.title}</span> بنجاح. 
        تم إرسال رسالة تأكيد إلى بريدك الإلكتروني تحتوي على جميع التفاصيل.
      </p>

      {product?.file_url ? (
        <div className="bg-[#6C3BFF]/10 border border-[#6C3BFF]/20 rounded-2xl p-8 max-w-xl mx-auto w-full mb-12">
          <h3 className="text-2xl font-bold text-white mb-4">حمل منتجك الآن ⬇️</h3>
          <p className="text-gray-400 mb-6">يمكنك تحميل الملف أو الكورس الخاص بك مباشرة من الرابط أدناه.</p>
          <a 
            href={product.file_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto px-8 py-4 bg-[#6C3BFF] hover:bg-[#5b2ee0] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(108,59,255,0.3)] transition-all transform hover:scale-105"
          >
            اضغط هنا لتحميل المنتج
          </a>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-xl mx-auto w-full mb-12">
          <p className="text-gray-300">
            سيتم التواصل معك قريباً أو تفعيل الخدمة في حسابك.
          </p>
        </div>
      )}

      <Link href="/" className="text-gray-400 hover:text-white underline underline-offset-4 transition-colors">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-4">
      <Suspense fallback={<div className="text-white text-center">جاري التحميل...</div>}>
        <ThankYouContent />
      </Suspense>
    </main>
  );
}
