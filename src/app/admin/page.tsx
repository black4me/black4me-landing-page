"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { LogOut, Users, DollarSign, ShoppingBag, ShieldCheck, TrendingUp, RefreshCw } from 'lucide-react';

interface Order {
  id: string;
  customer_email: string;
  product_id: string;
  amount: number;
  payment_gateway: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminData = async () => {
    setRefreshing(true);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // SUPER_ADMIN check
    if (authError || !user || user.email !== 'info@black4me.com') {
      router.push('/login');
      return;
    }

    // Fetch all orders
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersData) {
      setOrders(ordersData);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;

  return (
    <div className="min-h-screen bg-[#050505] text-brand-white flex flex-col" dir="rtl">
      {/* Admin Header */}
      <header className="bg-[#0a0a0a] border-b border-brand-purple/20 shadow-[0_4px_30px_rgba(108,59,255,0.05)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-purple/10 border border-brand-purple/30 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-brand-purple" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-none mb-1">لوحة الإدارة العليا</h1>
              <span className="text-[10px] text-brand-purple font-mono tracking-widest bg-brand-purple/10 px-2 py-0.5 rounded-full">SUPER_ADMIN</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchAdminData}
              className={`text-gray-400 hover:text-white p-2 rounded-lg transition ${refreshing ? 'animate-spin text-brand-purple' : ''}`}
              title="تحديث البيانات"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-[#111] border border-brand-white/10 px-4 py-2 rounded-lg transition hover:border-red-500/30 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        
        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111] border border-brand-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign className="w-32 h-32 text-brand-green" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-gray-400 flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-brand-green" />
                إجمالي الإيرادات
              </p>
              <h3 className="text-4xl font-black text-white font-mono">${totalRevenue.toLocaleString()}</h3>
              <p className="text-xs text-brand-green flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3" /> تم حسابها من المدفوعات الناجحة
              </p>
            </div>
          </div>

          <div className="bg-[#111] border border-brand-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="w-32 h-32 text-brand-purple" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-gray-400 flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-brand-purple" />
                العملاء النشطون
              </p>
              <h3 className="text-4xl font-black text-white font-mono">{uniqueCustomers}</h3>
              <p className="text-xs text-brand-purple flex items-center gap-1 mt-2">
                عملاء قاموا بالشراء والتسجيل الآلي
              </p>
            </div>
          </div>

          <div className="bg-[#111] border border-brand-white/5 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShoppingBag className="w-32 h-32 text-brand-gold" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-gray-400 flex items-center gap-2 mb-2">
                <ShoppingBag className="w-4 h-4 text-brand-gold" />
                إجمالي المبيعات
              </p>
              <h3 className="text-4xl font-black text-white font-mono">{orders.length}</h3>
              <p className="text-xs text-brand-gold flex items-center gap-1 mt-2">
                طلب ناجح تم تسجيله
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-[#111] border border-brand-white/5 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-400" />
            سجل المبيعات والطلبات الأخيرة
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="text-xs text-gray-400 border-b border-brand-white/5">
                <tr>
                  <th className="pb-3 font-bold">معرف الطلب</th>
                  <th className="pb-3 font-bold">العميل (البريد الإلكتروني)</th>
                  <th className="pb-3 font-bold">المنتج (Stripe ID)</th>
                  <th className="pb-3 font-bold">المبلغ</th>
                  <th className="pb-3 font-bold">البوابة</th>
                  <th className="pb-3 font-bold">التاريخ</th>
                  <th className="pb-3 font-bold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-white/5">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">لا توجد طلبات مسجلة حتى الآن في قاعدة البيانات.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-brand-white/[0.02] transition-colors">
                      <td className="py-4 font-mono text-xs text-gray-500">{order.id.split('-')[0]}...</td>
                      <td className="py-4 text-white font-medium">{order.customer_email}</td>
                      <td className="py-4 text-gray-400 font-mono text-xs">{order.product_id}</td>
                      <td className="py-4 text-brand-gold font-bold font-mono">${order.amount}</td>
                      <td className="py-4">
                        <span className="bg-brand-white/10 px-2 py-1 rounded text-xs text-gray-300 capitalize">{order.payment_gateway}</span>
                      </td>
                      <td className="py-4 text-gray-500 font-mono text-xs">{new Date(order.created_at).toLocaleString('en-GB')}</td>
                      <td className="py-4">
                        <span className="bg-brand-green/10 text-brand-green px-2 py-1 rounded text-[10px] font-bold">نجاح</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
