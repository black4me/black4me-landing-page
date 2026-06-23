import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import { CreditCard, ShieldCheck, Ticket, Calendar, AlertCircle, Sparkles, Receipt } from 'lucide-react';

interface CheckoutPageProps {
  checkoutMode?: 'book' | 'consultation';
  initialData?: {name: string, email: string} | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CheckoutPage({ checkoutMode = 'book', initialData, onSuccess, onCancel }: CheckoutPageProps) {
  const { createOrder, coupons, products } = useApp();
  
  // Choose the right product based on checkoutMode
  const targetProductId = checkoutMode === 'consultation' ? 'prod-consultation' : 'prod-main-book';
  const mainProduct = products.find(p => p.id === targetProductId) || products[0];

  // Form input states
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Stripe Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'paypal' | 'spaceremit'>('stripe');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptError, setReceiptError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const originalPrice = mainProduct?.price || 49;
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = originalPrice - discountAmount;

  const handleEmailBlur = async () => {
    if (email && email.includes('@')) {
      try {
        await supabase.from('checkout_sessions').insert([{
          email,
          status: 'pending',
          product_id: mainProduct.id,
          price: finalPrice
        }]);
      } catch (e) {
        // Silent fail for tracking
      }
    }
  };

  const applyCoupon = () => {
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (found) {
      setDiscountPercent(found.discountPercent);
      setCouponStatus({ type: 'success', message: `تهانينا! تم تطبيق الخصم بنسبه %${found.discountPercent} بنجاح.` });
    } else {
      setCouponStatus({ type: 'error', message: "عذراً، كود الخصم هذا غير صالح أو قد انتهت صلاحيته!" });
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsProcessing(true);
    setReceiptError('');

    try {
      if (paymentGateway === 'spaceremit') {
        if (!receiptFile) {
          setReceiptError('يرجى رفع إيصال الدفع أولاً.');
          setIsProcessing(false);
          return;
        }

        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, receiptFile);

        if (uploadError) {
          console.error('Upload Error:', uploadError);
          setReceiptError('فشل رفع الإيصال. يرجى المحاولة مرة أخرى.');
          setIsProcessing(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(fileName);

        const res = await fetch('/api/checkout/spaceremit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: mainProduct.id,
            title: mainProduct.title,
            price: finalPrice,
            customerEmail: email,
            customerName: name,
            customerCountry: country,
            receiptUrl: publicUrl,
            checkoutMode: checkoutMode
          })
        });

        const data = await res.json();
        
        if (data.success) {
           window.location.href = `/thankyou?session_id=${data.orderId}&status=pending`; 
        } else {
           alert('حدث خطأ: ' + (data.error || 'Unknown error'));
           setIsProcessing(false);
        }
        return;
      }

      const endpoint = paymentGateway === 'stripe' ? '/api/checkout/stripe' : '/api/checkout/paypal';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: mainProduct.id,
          title: mainProduct.title,
          price: finalPrice,
          customerEmail: email,
          customerName: name,
          customerCountry: country,
          checkoutMode: checkoutMode
        })
      });

      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe/PayPal Checkout
      } else {
        alert('حدث خطأ أثناء فتح بوابة الدفع: ' + (data.error || 'Unknown error'));
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      alert('فشل الاتصال بخادم الدفع الآمن.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-brand-black min-h-screen text-brand-white py-16 px-4 md:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="text-center md:text-right border-b border-brand-white/10 pb-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-brand-purple font-bold text-xs uppercase tracking-widest block mb-1">بوابة السداد الآمنة</span>
            <h1 className="text-2xl sm:text-3xl font-black text-white">إكمال عملية الشراء الآمن والتحميل الفوري</h1>
          </div>
          <button 
            type="button" 
            onClick={onCancel}
            className="text-xs text-gray-400 hover:text-white transition bg-brand-darkgray px-4 py-2 rounded-lg border border-brand-white/10"
          >
            ← العودة لصفحة العروض والمنتج
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Column: Checkout Inputs FORM */}
          <div className="lg:col-span-7 bg-brand-darkgray border border-brand-white/5 rounded-3xl p-6 sm:p-10 shadow-xl">
            <h3 className="text-lg font-bold text-white border-b border-brand-white/5 pb-4 mb-6">1. معلومات المشتري</h3>
            
            <form onSubmit={handlePay} className="space-y-6">
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1.5">الاسم بالكامل</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="الاسم الثلاثي المعتمد"
                    className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 block mb-1.5">البريد الإلكتروني (لتلقي روابط التنزيل)</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    placeholder="user@example.com"
                    className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition text-left font-mono" 
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1.5">الدولة أو مكان الإقامة</label>
                <select 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition"
                >
                  <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                  <option value="دولة الإمارات العربية المتحدة">دولة الإمارات العربية المتحدة</option>
                  <option value="دولة قطر">دولة قطر</option>
                  <option value="سلطنة عمان">سلطنة عمان</option>
                  <option value="جمهورية مصر العربية">جمهورية مصر العربية</option>
                  <option value="دولة الكويت">دولة الكويت</option>
                </select>
              </div>

              {/* Payment Gateway Selector Tabs */}
              <div className="space-y-3 pt-4 border-t border-brand-white/5">
                <h3 className="text-lg font-bold text-white mb-2">2. اختر بوابة الدفع المشفرة</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentGateway('stripe')}
                    className={`py-3.5 px-6 rounded-xl border flex items-center justify-center gap-2 transition font-bold cursor-pointer text-sm ${
                      paymentGateway === 'stripe' 
                        ? 'bg-brand-purple/20 border-brand-purple text-brand-white shadow-lg' 
                        : 'bg-brand-black border-brand-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-brand-gold" />
                    <span>البطاقة (Stripe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGateway('paypal')}
                    className={`py-3.5 px-6 rounded-xl border flex items-center justify-center gap-2 transition font-bold cursor-pointer text-sm ${
                      paymentGateway === 'paypal' 
                        ? 'bg-brand-gold/15 border-brand-gold text-brand-gold shadow-lg' 
                        : 'bg-brand-black border-brand-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="font-sans italic font-black text-brand-gold text-sm">PayPal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentGateway('spaceremit')}
                    className={`py-3.5 px-4 rounded-xl border flex items-center justify-center gap-2 transition font-bold cursor-pointer text-sm ${
                      paymentGateway === 'spaceremit' 
                        ? 'bg-brand-green/20 border-brand-green text-brand-white shadow-lg' 
                        : 'bg-brand-black border-brand-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-green" />
                    <span>تحويل بنكي</span>
                  </button>
                </div>
              </div>

              {/* Credit Card Details (only if stripe is selected) */}
              {paymentGateway === 'stripe' ? (
                <div className="bg-brand-black/40 border border-brand-white/10 p-5 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-2 justify-between border-b border-brand-white/5 pb-3">
                    <span className="text-xs text-gray-400 font-bold">نموذج البطاقة الافتراضية الآمن لـ Stripe</span>
                    <span className="text-xs text-brand-gold">امن ومحمي بـ AES-256</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">رقم بطاقتك الائتمانية (تجريبي)</label>
                    <input 
                      type="text" 
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition font-mono tracking-widest text-left" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">تاريخ الانتهاء MM/YY</label>
                      <input 
                        type="text" 
                        maxLength={5}
                        placeholder="12/29"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition font-mono text-center" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">رمز التحقق الأمني CVV</label>
                      <input 
                        type="text" 
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        className="w-full bg-brand-black border border-brand-white/10 p-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-purple transition font-mono text-center" 
                      />
                    </div>
                  </div>
                </div>
              ) : paymentGateway === 'paypal' ? (
                <div className="bg-brand-gold/5 border border-brand-gold/20 p-5 rounded-2xl text-center space-y-2 animate-fadeIn">
                  <span className="text-xs text-brand-gold font-bold">بوابة سداد PayPal التفاعلية</span>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    بمجرد الضغط على زر الشراء، سيقوم النظام بمحاكاة سداد المدفوعات عبر الواجهات المعتمدة بـ PayPal وإصدار سند شراء تلقائي.
                  </p>
                </div>
              ) : (
                <div className="bg-brand-green/5 border border-brand-green/20 p-5 rounded-2xl space-y-4 animate-fadeIn text-right">
                  <span className="text-sm text-brand-green font-bold block mb-2">الدفع عبر التحويل البنكي (SpaceRemit)</span>
                  <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                    يمكنك الدفع عبر وسائل الدفع المحلية في بلدك بكل سهولة. يرجى الضغط على الرابط التالي للدفع ثم رفع صورة الإيصال ليتم مراجعة طلبك وإرسال الكتاب لبريدك الإلكتروني (تأكيد الدفع أصبح الآن تلقائياً فور وصول الحوالة).
                  </p>
                  
                  <a href="https://spaceremit.com/spaceseller/marchet/black4me.com" target="_blank" rel="noopener noreferrer" className="block text-center bg-brand-black border border-brand-green/30 text-brand-green py-3 rounded-xl font-bold text-sm hover:bg-brand-green/10 transition mb-4">
                    اضغط هنا للانتقال لصفحة الدفع
                  </a>
                  
                  <div className="mt-4 border-t border-brand-green/20 pt-4">
                    <label className="text-xs font-bold text-gray-400 block mb-2">رفع صورة الإيصال (إلزامي بعد الدفع)</label>
                    <input 
                      type="file" 
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setReceiptFile(e.target.files[0]);
                          setReceiptError('');
                        }
                      }}
                      className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-green/10 file:text-brand-green hover:file:bg-brand-green/20 focus:outline-none cursor-pointer"
                    />
                    {receiptError && <p className="text-brand-red text-[11px] mt-2 font-bold">{receiptError}</p>}
                  </div>
                </div>
              )}

              {/* Purchase Trigger Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold py-4 rounded-xl transition duration-300 shadow-lg text-sm sm:text-base cursor-pointer flex items-center justify-center gap-2 ${
                  isProcessing ? 'opacity-70 cursor-not-allowed animate-pulse' : ''
                }`}
              >
                {isProcessing ? (
                  <span>جاري تفعيل الاتصال الآمن بالمصرف الخاص بك...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>تأكيد ودفع ${finalPrice} دولار رقمياً</span>
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-gray-500">
                الشراء يتم مع مراعاة أعلى بروتوكولات حظر التهديد الإلكتروني والـ SSL.
              </p>

            </form>
          </div>

          {/* Left Column: Summary of Items Pricing */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Coupon Application Box */}
            <div className="bg-brand-darkgray border border-brand-white/5 rounded-3xl p-6 shadow-xl">
              <h4 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5 leading-none">
                <Ticket className="w-4 h-4 text-brand-gold" />
                <span>هل تملك كود خصم ترويجي؟</span>
              </h4>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="مثال: BLACK20"
                  className="w-full bg-brand-black border border-brand-white/10 px-3 py-2 rounded-lg text-white text-xs focus:outline-none focus:border-brand-purple text-left font-mono"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="bg-brand-purple hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition shrink-0 cursor-pointer"
                >
                  تطبيق
                </button>
              </div>

              {couponStatus.type && (
                <div className={`mt-3 text-[10px] font-semibold flex items-center gap-1.5 p-2 rounded ${
                  couponStatus.type === 'success' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-red/10 text-brand-red'
                }`}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponStatus.message}</span>
                </div>
              )}
            </div>

            {/* Order Summary Checkout Container */}
            <div className="bg-brand-darkgray border border-brand-white/5 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-brand-gold/10 text-brand-gold text-[10px] font-extrabold px-3 py-1 rounded-bl-xl border-b border-l border-brand-gold/15">
                {checkoutMode === 'consultation' ? 'فاتورة حجز الاستشارة' : 'فاتورة حزمة العميل'}
              </div>

              <h4 className="text-sm font-bold text-white border-b border-brand-white/5 pb-4 mb-4 flex items-center gap-2">
                <Receipt className="w-4.5 h-4.5 text-brand-purple" />
                <span>{checkoutMode === 'consultation' ? 'ملخص الاستشارة المطلوبة' : 'ملخص الأصول المطلوبة للحزمة'}</span>
              </h4>

              <div className="space-y-4 text-xs">
                
                {checkoutMode === 'consultation' ? (
                  <div className="flex justify-between items-center bg-brand-black/30 p-3 rounded-lg border border-brand-white/5">
                    <div className="text-right">
                      <span className="text-white font-bold block">جلسة عمل فردية 1:1 غاية في القيمة</span>
                      <span className="text-gray-500 font-medium block mt-0.5">فك شفرات عملك مع جاسم محمد شخصياً</span>
                    </div>
                    <span className="text-brand-gold font-bold font-mono">${originalPrice} USD</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center bg-brand-black/30 p-3 rounded-lg border border-brand-white/5">
                      <div className="text-right">
                        <span className="text-white font-bold block">كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"</span>
                        <span className="text-gray-500 font-medium block mt-0.5">النسخة التعليمية + كافة التمارين المرفقة</span>
                      </div>
                      <span className="text-brand-gold font-bold font-mono">${originalPrice} USD</span>
                    </div>

                    <div className="flex justify-between items-center bg-brand-purple/5 p-3 rounded-lg border border-brand-purple/10">
                      <div className="text-right flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-spin" />
                        <div>
                          <span className="text-brand-gold font-bold block">كتاب "10 مبادئ للنجاح المالي والشخصي"</span>
                          <span className="text-gray-400 block mt-0.5">الهدية التمكينية الكبرى المرفقة مجانًا بصيغة PDF</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-gray-500 line-through font-mono block">$29</span>
                        <span className="text-brand-green font-bold block">هدية مضمنة</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="border-t border-brand-white/5 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>السعر الأساسي:</span>
                    <span className="font-mono">${originalPrice}.00</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-brand-green font-semibold">
                      <span>كود خصم التوفير المطبق (%{discountPercent}):</span>
                      <span className="font-mono">-${discountAmount}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-brand-white/5">
                    <span>القيمة الإجمالية المطلوبة للسداد:</span>
                    <span className="font-mono text-brand-gold text-base">${finalPrice}.00 USD</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
