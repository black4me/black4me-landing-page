import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, ShieldCheck, Ticket, Calendar, AlertCircle, Sparkles, Receipt } from 'lucide-react';

interface CheckoutPageProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CheckoutPage({ onSuccess, onCancel }: CheckoutPageProps) {
  const { createOrder, coupons } = useApp();

  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  // Stripe Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'paypal'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  // Pricing math
  const originalPrice = 49;
  const discountAmount = Math.round((originalPrice * discountPercent) / 100);
  const finalPrice = originalPrice - discountAmount;

  const applyCoupon = () => {
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (found) {
      setDiscountPercent(found.discountPercent);
      setCouponStatus({ type: 'success', message: `تهانينا! تم تطبيق الخصم بنسبه %${found.discountPercent} بنجاح.` });
    } else {
      setCouponStatus({ type: 'error', message: "عذراً، كود الخصم هذا غير صالح أو قد انتهت صلاحيته!" });
    }
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    if (paymentGateway === 'stripe') {
      if (cardNumber.length < 16 || cardCvv.length < 3) {
        alert('الرجاء التأكد من إدخال معلومات بطاقة ائتمانية صالحة للاختبار (16 رقم للبطاقة و 3 للرمز المالي Cvv).');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate 2 seconds loading for server side authentication and bank query
    setTimeout(() => {
      // Create order into persistent context state
      createOrder({
        customerId: `cust-${Math.random().toString(36).substr(2, 9)}`,
        customerName: name,
        customerEmail: email,
        productId: 'prod-main-book',
        productTitle: 'كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"',
        amount: finalPrice,
        paymentGateway,
        status: 'completed'
      });

      setIsProcessing(false);
      onSuccess(); // Redirect to thank-you downloads page
    }, 2000);
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
                
                <div className="grid grid-cols-2 gap-4">
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
                    <span>بطاقة الائتمان (Stripe)</span>
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
              ) : (
                <div className="bg-brand-gold/5 border border-brand-gold/20 p-5 rounded-2xl text-center space-y-2 animate-fadeIn">
                  <span className="text-xs text-brand-gold font-bold">بوابة سداد PayPal التفاعلية</span>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    بمجرد الضغط على زر الشراء، سيقوم النظام بمحاكاة سداد المدفوعات عبر الواجهات المعتمدة بـ PayPal وإصدار سند شراء تلقائي.
                  </p>
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
                فاتورة حزمة العميل
              </div>

              <h4 className="text-sm font-bold text-white border-b border-brand-white/5 pb-4 mb-4 flex items-center gap-2">
                <Receipt className="w-4.5 h-4.5 text-brand-purple" />
                <span>ملخص الأصول المطلوبة للحزمة</span>
              </h4>

              <div className="space-y-4 text-xs">
                
                <div className="flex justify-between items-center bg-brand-black/30 p-3 rounded-lg border border-brand-white/5">
                  <div className="text-right">
                    <span className="text-white font-bold block">كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"</span>
                    <span className="text-gray-500 font-medium block mt-0.5">النسخة التعليمية + كافة التمارين المرفقة</span>
                  </div>
                  <span className="text-brand-gold font-bold font-mono">$49 USD</span>
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

                <div className="border-t border-brand-white/5 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>السعر الأساسي للحزمة:</span>
                    <span className="font-mono">$49.00</span>
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
