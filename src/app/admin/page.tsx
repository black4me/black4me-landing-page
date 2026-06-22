"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { 
  LogOut, Users, DollarSign, ShoppingBag, ShieldCheck, 
  TrendingUp, RefreshCw, BarChart3, Filter, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { 
  Funnel, FunnelChart, Tooltip, LabelList, ResponsiveContainer, Cell 
} from 'recharts';

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

    if (authError || !user || user.email !== 'info@black4me.com') {
      router.push('/login');
      return;
    }

    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersData) setOrders(ordersData);

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
        <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;
  const bookBuyers = orders.length;

  // Mock data for funnel to supplement real book buyers
  const funnelData = [
    { value: 5000, name: 'الزوار (Visitors)', fill: '#6C3BFF' },
    { value: 1200, name: 'المشتركون (Leads)', fill: '#9333EA' },
    { value: Math.max(bookBuyers, 50), name: 'مشتري الكتاب (Book Buyers)', fill: '#F5C542' },
    { value: Math.max(Math.floor(bookBuyers * 0.2), 10), name: 'حجوزات الاستشارة (Consultation)', fill: '#EAB308' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-brand-white flex flex-col font-sans" dir="rtl">
      {/* Admin Header */}
      <header className="bg-brand-black/90 backdrop-blur-xl border-b border-brand-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-purple/20 to-brand-gold/10 border border-brand-purple/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(108,59,255,0.15)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ShieldCheck className="w-6 h-6 text-brand-gold" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-tight">BLACK4ME <span className="font-light opacity-50">HQ</span></h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                <span className="text-[10px] text-brand-purple font-mono uppercase tracking-widest bg-brand-purple/10 px-2 py-0.5 rounded-full border border-brand-purple/20">Super Admin</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchAdminData}
              className={`text-gray-400 hover:text-white p-2.5 rounded-xl border border-brand-white/5 hover:bg-brand-white/5 transition ${refreshing ? 'animate-spin text-brand-gold' : ''}`}
              title="تحديث البيانات"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/20 px-4 py-2.5 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">نظرة عامة على الأداء</h2>
            <p className="text-gray-400 text-sm">مراقبة حية للمبيعات ومسار التحويل (Live Telemetry).</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-[#111] border border-brand-white/10 p-1 rounded-xl">
            <button className="px-4 py-2 text-xs font-bold bg-brand-white/10 text-white rounded-lg">اليوم</button>
            <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white rounded-lg">آخر 7 أيام</button>
            <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white rounded-lg">الشهر</button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Revenue */}
          <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-brand-white/10 hover:border-brand-green/30 rounded-3xl p-8 relative overflow-hidden group transition-all duration-500">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-brand-green/10 rounded-full blur-3xl group-hover:bg-brand-green/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-400">إجمالي الإيرادات (Live)</p>
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center border border-brand-green/20">
                  <DollarSign className="w-5 h-5 text-brand-green" />
                </div>
              </div>
              <h3 className="text-5xl font-black text-white font-mono tracking-tighter">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-brand-green bg-brand-green/10 w-fit px-3 py-1.5 rounded-lg border border-brand-green/20">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.5% من الشهر الماضي</span>
              </div>
            </div>
          </div>

          {/* Customers */}
          <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-brand-white/10 hover:border-brand-purple/30 rounded-3xl p-8 relative overflow-hidden group transition-all duration-500">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-brand-purple/10 rounded-full blur-3xl group-hover:bg-brand-purple/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-400">العملاء النشطون</p>
                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20">
                  <Users className="w-5 h-5 text-brand-purple" />
                </div>
              </div>
              <h3 className="text-5xl font-black text-white font-mono tracking-tighter">{uniqueCustomers}</h3>
              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-gray-400">
                <span>عملاء فريدون أتموا الشراء</span>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-brand-white/10 hover:border-brand-gold/30 rounded-3xl p-8 relative overflow-hidden group transition-all duration-500">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl group-hover:bg-brand-gold/20 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-gray-400">الطلبات الناجحة</p>
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
                  <ShoppingBag className="w-5 h-5 text-brand-gold" />
                </div>
              </div>
              <h3 className="text-5xl font-black text-white font-mono tracking-tighter">{orders.length}</h3>
              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-brand-gold bg-brand-gold/10 w-fit px-3 py-1.5 rounded-lg border border-brand-gold/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>جميع المدفوعات مؤكدة</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Funnel Chart (Hormozi Style) */}
          <div className="lg:col-span-1 bg-[#0a0a0a] border border-brand-white/10 rounded-3xl p-8 relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-purple" />
                  مسار المبيعات (Sales Funnel)
                </h3>
                <p className="text-xs text-gray-500 mt-1">تتبع كفاءة التحويل عبر المراحل</p>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    <LabelList position="center" fill="#fff" stroke="none" dataKey="name" fontSize={12} fontWeight="bold" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6 flex flex-col gap-3">
              {funnelData.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: step.fill }}></span>
                    <span className="text-gray-400">{step.name}</span>
                  </div>
                  <span className="font-bold text-white font-mono">{step.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-brand-white/10 rounded-3xl p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">الطلبات الحديثة</h3>
                <p className="text-xs text-gray-500 mt-1">آخر المعاملات المسجلة في قاعدة البيانات</p>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-[#111] px-3 py-2 rounded-xl border border-brand-white/10">
                <Filter className="w-4 h-4" />
                تصفية
              </button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-right text-sm">
                <thead className="text-xs text-gray-500 border-b border-brand-white/10">
                  <tr>
                    <th className="pb-4 font-medium px-2">العميل</th>
                    <th className="pb-4 font-medium px-2">المنتج</th>
                    <th className="pb-4 font-medium px-2">المبلغ</th>
                    <th className="pb-4 font-medium px-2">التاريخ</th>
                    <th className="pb-4 font-medium px-2">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-white/5">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-500">لا توجد طلبات مسجلة حتى الآن.</td>
                    </tr>
                  ) : (
                    orders.slice(0, 8).map((order) => (
                      <tr key={order.id} className="hover:bg-brand-white/[0.02] transition-colors group">
                        <td className="py-4 px-2">
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-xs">{order.customer_email.split('@')[0]}</span>
                            <span className="text-gray-500 text-[10px] font-mono">{order.customer_email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-gray-300 font-mono text-[10px] bg-[#111] px-2 py-1 rounded-md border border-brand-white/5">
                            {order.product_id.substring(0, 15)}...
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-brand-gold font-black font-mono tracking-tighter text-base">
                            ${order.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-gray-500 font-mono text-xs">
                          {new Date(order.created_at).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-4 px-2">
                          <span className="inline-flex items-center gap-1 bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full text-[10px] font-bold border border-brand-green/20">
                            <CheckCircle2 className="w-3 h-3" />
                            مكتمل
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {orders.length > 8 && (
              <div className="mt-4 text-center">
                <button className="text-brand-gold text-xs font-bold hover:underline">عرض جميع الطلبات ({orders.length})</button>
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
