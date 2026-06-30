"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DollarSign, Users, TrendingUp, ShoppingBag, ArrowUpRight } from 'lucide-react';

interface Order {
  id: string;
  customer_email: string;
  customer_name?: string;
  amount: number;
  created_at: string;
}

export function StatsTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500 animate-pulse">جاري تحميل الإحصائيات...</div>;
  }

  const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1">نظرة عامة</h2>
          <p className="text-gray-400 text-sm">مؤشرات الأداء الرئيسية لمنصتك</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C542]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm mb-1">إجمالي الإيرادات</p>
              <h3 className="text-3xl font-black text-white">${totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#F5C542]/20 flex items-center justify-center border border-[#F5C542]/30">
              <DollarSign className="w-5 h-5 text-[#F5C542]" />
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C3BFF]/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm mb-1">العملاء الفريدون</p>
              <h3 className="text-3xl font-black text-white">{uniqueCustomers}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#6C3BFF]/20 flex items-center justify-center border border-[#6C3BFF]/30">
              <Users className="w-5 h-5 text-[#6C3BFF]" />
            </div>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm mb-1">إجمالي الطلبات</p>
              <h3 className="text-3xl font-black text-white">{orders.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
              <ShoppingBag className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-8">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#F5C542]" />
          أحدث الطلبات
        </h3>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">لا توجد طلبات حتى الآن</div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#6C3BFF]/20 flex items-center justify-center border border-[#6C3BFF]/30">
                    <span className="text-[#6C3BFF] font-bold text-sm">
                      {order.customer_name ? order.customer_name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{order.customer_name || 'عميل غير معروف'}</p>
                    <p className="text-xs text-gray-500">{order.customer_email}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-black text-[#F5C542]">${order.amount}</p>
                  <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('ar-EG')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
