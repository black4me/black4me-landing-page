"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '../../context/AppContext';
import {
  CreditCard, ShieldCheck, Lock, CheckCircle2, Sparkles,
  ArrowRight, Loader2, AlertCircle, Tag, Star, RefreshCw
} from 'lucide-react';
import * as tracking from '@/lib/tracking';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const { coupons, products, siteSettings } = useApp();

  // Find the selected product from DB
  const actualProduct = products.find(p => p.id === productId) || products[0];
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [couponCode, setCouponCode] = useState('');
  const [validatedCoupon, setValidatedCoupon] = useState<{ originalPrice: number; discountAmount: number; finalPrice: number } | null>(null);
  const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error' | null; msg: string }>({ type: null, msg: '' });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Pricing
  const basePrice = actualProduct?.salePrice || actualProduct?.price || 49;
  const originalPrice = validatedCoupon ? validatedCoupon.originalPrice : basePrice;
  const discountAmount = validatedCoupon ? validatedCoupon.discountAmount : 0;
  const finalPrice = validatedCoupon ? validatedCoupon.finalPrice : basePrice;
  const discountPercent = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;
  const productTitle = actualProduct?.title || 'الحزمة الشاملة';

  useEffect(() => {
    tracking.trackEvent('CheckoutStarted', {
      cart_value: finalPrice,
      currency: 'USD',
      items: [{ id: productId, name: productTitle }]
    });
    tracking.trackEvent('DiscountCodeShown');
  }, [productId, productTitle, finalPrice]);

  // Apply coupon via API
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setCouponStatus({ type: null, msg: 'جاري التحقق...' });
    try {
      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode, productId: actualProduct.id }),
      });
      const data = await res.json();
      
      if (data.valid) {
        setValidatedCoupon(data);
        setCouponStatus({ type: 'success', msg: data.msg || 'تم تطبيق الخصم بنجاح!' });
        tracking.trackEvent('DiscountCodeUsed', { discount_code: couponCode, discount_value: data.discountValue });
      } else {
        setValidatedCoupon(null);
        setCouponStatus({ type: 'error', msg: data.msg || 'رمز الخصم غير صالح.' });
      }
    } catch (err) {
      setValidatedCoupon(null);
      setCouponStatus({ type: 'error', msg: 'حدث خطأ أثناء التحقق من الكوبون.' });
    }
  };

  // Handle payment
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('يرجى تعبئة الاسم والبريد الإلكتروني.');
      return;
    }
    setError('');
    setIsProcessing(true);

    try {
      tracking.trackEvent('InitiateCheckout', {
        cart_value: finalPrice,
        currency: 'USD',
        payment_method: paymentMethod,
        email: email,
        customer_name: name
      });
      const actualProductId = actualProduct?.id || 'prod-main-book';

      const endpoint = paymentMethod === 'stripe' ? '/api/checkout/stripe' : '/api/checkout/paypal';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: actualProductId,
          title: productTitle,
          customerEmail: email,
          customerName: name,
          customerCountry: country,
          couponCode: validatedCoupon ? couponCode : undefined,
        }),
      });

      const data = await response.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          setError(data.error || 'حدث خطأ في بوابة الدفع. يرجى المحاولة مرة أخرى.');
          tracking.trackEvent('PaymentAttemptFailed', {
            error_msg: data.error || 'حدث خطأ في بوابة الدفع.',
            payment_method: paymentMethod,
            cart_value: finalPrice,
            currency: 'USD'
          });
        }
    } catch (err: any) {
      setError('تعذر الاتصال ببوابة الدفع. تحقق من اتصالك بالإنترنت.');
      tracking.trackEvent('PaymentAttemptFailed', {
        error_msg: err?.message || 'تعذر الاتصال',
        payment_method: paymentMethod,
        cart_value: finalPrice,
        currency: 'USD'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-brand-gold transition mb-8"
        >
          <ArrowRight className="w-3 h-3" />
          <span>العودة للمنصة</span>
        </Link>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ─── Form Column (3/5) ─── */}
          <div className="lg:col-span-3">
            <div className="glass rounded-3xl p-6 md:p-8">
              <h1 className="text-xl font-black text-white mb-1">إتمام عملية الشراء</h1>
              <p className="text-sm text-gray-400 mb-8">أكمل بياناتك للحصول على وصول فوري</p>

              <form onSubmit={handlePayment} className="space-y-5" aria-label="إتمام عملية الشراء">
                {/* Name */}
                <div>
                  <label htmlFor="checkout-name" className="block text-xs font-bold text-gray-400 mb-2">الاسم الكامل *</label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="مثال: أحمد محمد"
                    className="w-full bg-brand-black border border-brand-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="checkout-email" className="block text-xs font-bold text-gray-400 mb-2">البريد الإلكتروني *</label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    dir="ltr"
                    className="w-full bg-brand-black border border-brand-white/10 rounded-xl py-3.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition font-mono text-sm text-left"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">سيتم إرسال روابط التنزيل وبيانات الدخول على هذا البريد</p>
                </div>

                {/* Coupon */}
                <div>
                  <label htmlFor="checkout-coupon" className="block text-xs font-bold text-gray-400 mb-2">رمز الخصم (اختياري)</label>
                  <div className="flex gap-2">
                    <input
                      id="checkout-coupon"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="COUPON"
                      dir="ltr"
                      className="flex-1 bg-brand-black border border-brand-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition font-mono text-sm text-left"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-brand-white/5 border border-brand-white/10 hover:bg-brand-white/10 text-white font-bold py-3 px-5 rounded-xl transition text-sm flex-shrink-0"
                    >
                      تطبيق
                    </button>
                  </div>
                  {couponStatus.type && (
                    <p className={`text-xs mt-2 ${couponStatus.type === 'success' ? 'text-brand-green' : 'text-brand-red'}`}>
                      {couponStatus.msg}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-brand-white/5 pt-5">
                  <span id="payment-method-label" className="block text-xs font-bold text-gray-400 mb-3">طريقة الدفع</span>
                  <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="payment-method-label">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={paymentMethod === 'stripe'}
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-4 rounded-xl border transition text-center ${
                        paymentMethod === 'stripe'
                          ? 'border-brand-purple bg-brand-purple/10'
                          : 'border-brand-white/10 bg-transparent hover:bg-brand-white/5'
                      }`}
                    >
                      <CreditCard className={`w-5 h-5 mx-auto mb-1 ${paymentMethod === 'stripe' ? 'text-brand-purple-light' : 'text-gray-400'}`} />
                      <span className={`text-xs font-bold ${paymentMethod === 'stripe' ? 'text-white' : 'text-gray-400'}`}>
                        بطاقة ائتمان
                      </span>
                      <span className="block text-[10px] text-gray-400 mt-0.5">Visa, Mastercard, Amex</span>
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={paymentMethod === 'paypal'}
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-4 rounded-xl border transition text-center ${
                        paymentMethod === 'paypal'
                          ? 'border-brand-gold bg-brand-gold/10'
                          : 'border-brand-white/10 bg-transparent hover:bg-brand-white/5'
                      }`}
                    >
                      <span className={`text-lg font-bold ${paymentMethod === 'paypal' ? 'text-brand-gold' : 'text-gray-400'}`}>P</span>
                      <span className={`text-xs font-bold block ${paymentMethod === 'paypal' ? 'text-white' : 'text-gray-400'}`}>
                        PayPal
                      </span>
                      <span className="block text-[10px] text-gray-400 mt-0.5">حساب أو بطاقة</span>
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-brand-red/10 border border-brand-red/20 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-brand-red flex-shrink-0" />
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full cta-glow bg-brand-gold hover:bg-yellow-400 text-brand-black font-black py-4 rounded-xl transition-all text-base flex items-center justify-center gap-2 ${
                    isProcessing ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري التحويل لبوابة الدفع...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>ادفع الآن — ${finalPrice}</span>
                    </>
                  )}
                </button>

                {/* Trust Micro */}
                <div className="flex flex-wrap justify-center gap-4 text-[10px] text-gray-400 pt-2">
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> تشفير 256-bit SSL</span>
                  <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> استرداد 7 أيام</span>
                  <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> PCI Compliant</span>
                </div>
              </form>
            </div>
          </div>

          {/* ─── Summary Column (2/5) ─── */}
          <div className="lg:col-span-2">
            <div className="glass-gold rounded-3xl p-6 sticky top-24">
              <h2 className="text-sm font-bold text-gray-400 mb-4">ملخص الطلب</h2>

              {/* Product */}
              <div className="flex gap-3 mb-6 pb-6 border-b border-brand-white/5">
                <div className="relative w-16 h-20 bg-brand-blue/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <Image
                    src={siteSettings?.checkout_cover_image || "/images/book-cover.png"}
                    alt="غلاف الكتاب"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white leading-tight mb-1">{productTitle}</h3>
                  <p className="text-[10px] text-gray-400">وصول فوري ودائم</p>
                </div>
              </div>

              {/* What's included */}
              <div className="space-y-2 mb-6 pb-6 border-b border-brand-white/5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">يتضمن:</span>
                {[
                  'كتاب "بدون التسويق" PDF',
                  'كتاب هدية "10 مبادئ"',
                  'نظام تعليمي (9 وحدات)',
                  'قوالب وأدوات جاهزة',
                  'تحديثات مدى الحياة',
                  ...(actualProduct?.features || []),
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle2 className="w-3 h-3 text-brand-green flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">السعر الأصلي</span>
                  <span className="text-gray-400 line-through">${originalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">خصم العرض</span>
                  <span className="text-brand-green">-${originalPrice - basePrice}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">كوبون ({discountPercent}%)</span>
                    <span className="text-brand-green">-${discountAmount}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline border-t border-brand-white/10 pt-4 mb-4">
                <span className="text-sm font-bold text-white">الإجمالي</span>
                <span className="text-2xl font-black text-brand-gold">${finalPrice}</span>
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                ))}
              </div>
              <p className="text-center text-[10px] text-gray-400">تقييمات ممتازة من عملائنا</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-purple animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
