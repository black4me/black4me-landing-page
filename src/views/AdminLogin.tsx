import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onBack, onSuccess }: { onBack: () => void, onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const [otp, setOtp] = useState('');

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'info@black4me.com' && password === 'Stylesg1995@@') {
      setShowPhoneVerify(true);
      setError('');
    } else {
      setError('بيانات الدخول غير صحيحة. الرجاء المحاولة مرة أخرى.');
    }
  };

  const handleFinalStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate OTP verification
    if (otp.length === 4) {
      onSuccess();
    } else {
      setError('الرمز غير صحيح، الرجاء إدخال 4 أرقام.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4 rtl" dir="rtl">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-md w-full bg-brand-darkgray border border-brand-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-gray-500 hover:text-white transition cursor-pointer"
        >
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4 mb-8 mt-2">
          <div className="w-16 h-16 bg-brand-gold/10 border border-brand-gold/20 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-brand-gold" />
          </div>
          <h2 className="text-2xl font-black text-white">بوابة الإدارة الخاصة</h2>
          <p className="text-xs text-gray-400 font-medium">مرحباً جاسم، يرجى إدخال بياناتك للمتابعة.</p>
        </div>

        {!showPhoneVerify ? (
          <form onSubmit={handleFirstStep} className="space-y-4">
            {error && (
              <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs p-3 rounded-lg text-center font-bold">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 block">البريد الإلكتروني للإدارة</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@black4me.com"
                  className="w-full bg-brand-black border border-brand-white/10 pl-10 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold font-mono text-left"
                  required
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 block">كلمة المرور المشفرة</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-brand-black border border-brand-white/10 pl-10 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:border-brand-gold font-mono text-left"
                  required
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold py-3.5 rounded-xl transition cursor-pointer mt-4 text-sm"
            >
              التحقق من الهوية
            </button>
          </form>
        ) : (
          <form onSubmit={handleFinalStep} className="space-y-6">
            <div className="bg-brand-black border border-brand-gold/20 p-4 rounded-xl text-center space-y-2">
              <Phone className="w-6 h-6 text-brand-gold mx-auto" />
              <p className="text-xs text-gray-300 font-semibold leading-relaxed">
                تم التحقق من بيانات الدخول. كإجراء أمان إضافي، يرجى مصادقة الرمز المرسل إلى هاتفك:
              </p>
              <div className="font-mono text-lg font-bold text-brand-gold tracking-widest bg-brand-gold/10 inline-block px-4 py-1 rounded-lg border border-brand-gold/20">
                +968 7919 1793
              </div>
            </div>

            {error && (
              <div className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs p-3 rounded-lg text-center font-bold">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 block text-center">أدخل الرمز المكون من 4 أرقام (أدخل 1234 للمحاكاة)</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1234"
                className="w-full text-center tracking-[1em] font-mono text-xl bg-brand-black border border-brand-white/10 py-3 rounded-xl text-white focus:outline-none focus:border-brand-gold transition"
                maxLength={4}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-black font-extrabold py-3.5 rounded-xl transition cursor-pointer text-sm"
            >
              تأكيد الدخول كمسؤول
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
