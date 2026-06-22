"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { Shield, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      // Successful login
      if (data.user?.email === 'info@black4me.com') {
        router.push('/admin'); // Redirect Super Admin
      } else {
        router.push('/portal'); // Redirect Customers
      }
    } catch (err: any) {
      setError(err.message || 'بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4" dir="rtl">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-purple/5 rounded-full blur-3xl mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-3xl mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

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

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-black border border-brand-white/10 rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple transition-colors font-mono text-left"
                placeholder="user@example.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">كلمة المرور</label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-black border border-brand-white/10 rounded-xl py-3.5 pr-12 pl-4 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple transition-colors font-mono text-left"
                placeholder="••••••••••••"
                dir="ltr"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-brand-gold hover:bg-yellow-500 text-black font-black py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(245,197,66,0.39)] flex items-center justify-center gap-2 mt-4 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
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
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            اتصال مشفر ومحمي بتقنية 256-bit SSL
          </p>
        </div>
      </div>
    </div>
  );
}
