"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import {
  LogOut, BookOpen, Download, User, CheckCircle2, Shield,
  Headphones, ExternalLink, Calendar, CreditCard
} from 'lucide-react';

interface UserAccess {
  id: string;
  product_id: string;
  product_title: string;
  file_url: string | null;
  order_id: string;
  payment_gateway: string;
  granted_at: string;
}

const GATEWAY_LABELS: Record<string, string> = {
  stripe: 'بطاقة ائتمانية',
  paypal: 'PayPal',
  spaceremit: 'SpaceRemit',
};

const GATEWAY_COLORS: Record<string, string> = {
  stripe: 'text-blue-400',
  paypal: 'text-yellow-400',
  spaceremit: 'text-green-400',
};

export default function CustomerPortal() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [accessList, setAccessList] = useState<UserAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserAndAccess = async () => {
      const { createBrowserClient } = await import('@supabase/ssr');
      const supabaseBrowser = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { data: { user }, error: authError } = await supabaseBrowser.auth.getUser();

      if (authError || !user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // جلب المنتجات المُشتراة من user_access
      const { data: accessData, error: accessError } = await supabase
        .from('user_access')
        .select('*')
        .eq('customer_email', user.email)
        .order('granted_at', { ascending: false });

      if (accessError) {
        console.error('Error fetching access:', accessError);
        setError('تعذّر تحميل منتجاتك. يرجى تحديث الصفحة.');
      } else if (accessData) {
        setAccessList(accessData);
      }

      setLoading(false);
    };

    fetchUserAndAccess();
  }, [router]);

  const handleLogout = async () => {
    const { createBrowserClient } = await import('@supabase/ssr');
    const supabaseBrowser = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabaseBrowser.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm animate-pulse">جاري تحميل منتجاتك...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black text-brand-white" dir="rtl">
      {/* Header */}
      <header className="bg-brand-darkgray border-b border-brand-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-black border border-brand-gold/30 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(245,197,66,0.1)]">
              <Shield className="w-5 h-5 text-brand-gold" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-none mb-1">بوابة العملاء</h1>
              <span className="text-xs text-brand-gold font-bold">BLACK4ME</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <User className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-brand-black border border-brand-white/10 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Header */}
        <div className="mb-10">
          <h2 className="text-2xl font-black text-white mb-2">مرحباً بك مجدداً 👋</h2>
          <p className="text-gray-400">هنا تجد جميع منتجاتك الرقمية والخدمات التي اشتريتها.</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8 text-center">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && accessList.length === 0 ? (
          <div className="bg-brand-darkgray border border-brand-white/5 rounded-3xl p-16 text-center">
            <div className="w-20 h-20 bg-brand-black border border-brand-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">لا توجد منتجات بعد</h3>
            <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
              لم نعثر على أي مشتريات مرتبطة بهذا الحساب.
              إذا أتممت الشراء للتو، انتظر لحظة ثم حدّث الصفحة.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 text-xs text-brand-gold border border-brand-gold/30 px-5 py-2.5 rounded-lg hover:bg-brand-gold/10 transition"
            >
              تحديث الصفحة
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessList.map((access) => (
              <div
                key={access.id}
                className="bg-brand-darkgray border border-brand-white/10 rounded-3xl overflow-hidden hover:border-brand-gold/30 transition-all duration-300 group flex flex-col"
              >
                {/* Card Header */}
                <div className="h-44 bg-brand-black flex items-center justify-center border-b border-brand-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/20 via-transparent to-brand-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-brand-gold/10 border border-brand-gold/20 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-brand-gold" />
                    </div>
                    {/* Status Badge */}
                    <div className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>وصول مفعّل</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Product Title */}
                  <h3 className="text-base font-bold text-white mb-1 leading-snug">
                    {access.product_title || 'منتج رقمي'}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex flex-col gap-1.5 mb-5 mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{new Date(access.granted_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CreditCard className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span className={`font-medium ${GATEWAY_COLORS[access.payment_gateway] || 'text-gray-400'}`}>
                        {GATEWAY_LABELS[access.payment_gateway] || access.payment_gateway}
                      </span>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Action Button */}
                  {access.file_url ? (
                    <a
                      href={access.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-brand-gold hover:bg-yellow-400 text-brand-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-brand-gold/10 group-hover:shadow-brand-gold/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>تنزيل الملفات الآن</span>
                    </a>
                  ) : (
                    <a
                      href="https://wa.me/96879191793"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-brand-white/5 hover:bg-brand-white/10 border border-brand-white/10 hover:border-brand-gold/30 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Headphones className="w-4 h-4 text-brand-gold" />
                      <span>التواصل للوصول</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Support Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-xs mb-2">هل تواجه مشكلة في الوصول؟</p>
          <a
            href="https://wa.me/96879191793"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-gold hover:underline font-medium"
          >
            تواصل معنا عبر واتساب
          </a>
        </div>
      </main>
    </div>
  );
}
