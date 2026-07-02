"use client";

import React, { useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { loginAction } from './actions';
import { Shield, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const [isPending, startTransition] = useTransition();
  const [clientError, setClientError] = useState('');

  const error = clientError || errorParam || '';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClientError('');
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await loginAction(formData);
      } catch (err: any) {
        // redirect() throws — only real errors land here
        if (!err?.message?.includes('NEXT_REDIRECT')) {
          setClientError(err?.message || 'بيانات الدخول غير صحيحة.');
        }
      }
    });
  };

  return (
    <div className="max-w-md w-full bg-brand-darkgray/80 backdrop-blur-xl border border-brand-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-black border border-brand-gold/30 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(245,197,66,0.15)]">
          <Shield className="w-8 h-8 text-brand-gold" />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">بوابة الدخول الآمنة</h1>
        <p className="text-sm text-gray-400">سجل دخولك للوصول إلى مكتبتك الرقمية أو لوحة التحكم الخاصة بك.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400 font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="login-email" className="block text-xs font-bold text-gray-400 mb-2">البريد الإلكتروني</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              className="w-full bg-brand-black border border-brand-white/10 rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-colors font-mono text-left"
              placeholder="user@example.com"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="block text-xs font-bold text-gray-400 mb-2">كلمة المرور</label>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              className="w-full bg-brand-black border border-brand-white/10 rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-colors font-mono text-left"
              placeholder="••••••••••••"
              dir="ltr"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className={`w-full bg-brand-gold hover:bg-yellow-500 text-black font-black py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(245,197,66,0.39)] flex items-center justify-center gap-2 mt-4 ${
            isPending ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري المصادقة...</span>
            </>
          ) : (
            <span>تسجيل الدخول</span>
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-brand-white/5 pt-6">
        <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          اتصال مشفر ومحمي بتقنية 256-bit SSL
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4" dir="rtl">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
