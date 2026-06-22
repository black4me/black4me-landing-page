"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { LogOut, BookOpen, Download, User, CheckCircle2, Shield } from 'lucide-react';

interface Order {
  id: string;
  product_id: string;
  amount: number;
  payment_gateway: string;
  status: string;
  created_at: string;
}

export default function CustomerPortal() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email);

      if (!ordersError && ordersData) {
        setOrders(ordersData);
      }

      setLoading(false);
    };

    fetchUserAndOrders();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
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
        <div className="mb-10">
          <h2 className="text-2xl font-black text-white mb-2">مرحباً بك مجدداً 👋</h2>
          <p className="text-gray-400">هنا تجد جميع منتجاتك الرقمية والمواد التي قمت بشرائها.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-brand-darkgray border border-brand-white/5 rounded-3xl p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">لا توجد منتجات بعد</h3>
            <p className="text-gray-400 max-w-md mx-auto">لم نتمكن من العثور على أي مشتريات مرتبطة بحسابك. إذا كنت قد أتممت الشراء للتو، يرجى الانتظار دقيقة وتحديث الصفحة.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-brand-darkgray border border-brand-white/10 rounded-3xl overflow-hidden hover:border-brand-gold/30 transition-all group">
                <div className="h-40 bg-brand-black flex items-center justify-center border-b border-brand-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <BookOpen className="w-16 h-16 text-brand-gold" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-white leading-tight">منتج رقمي <span className="text-xs text-gray-500 block font-normal font-mono mt-1">{order.product_id}</span></h3>
                    <div className="bg-brand-green/10 text-brand-green p-1.5 rounded-md flex items-center gap-1 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>مفعل</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-6 font-mono">
                    تاريخ الشراء: {new Date(order.created_at).toLocaleDateString('ar-SA')}
                  </p>
                  
                  <button className="w-full bg-brand-white text-brand-black hover:bg-brand-gold hover:text-black font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md">
                    <Download className="w-4 h-4" />
                    <span>تحميل الملفات (PDF)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
