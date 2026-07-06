"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { DollarSign, Users, ShoppingBag, Tag, TrendingUp, TrendingDown, ClipboardList } from 'lucide-react';

interface Order {
  id: string;
  customer_email: string;
  customer_name?: string;
  amount: number;
  product_id?: string;
  status: string;
  created_at: string;
}

export function StatsTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeProductsCount, setActiveProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('id', { count: 'exact' }).eq('is_active', true)
      ]);
      
      if (ordersRes.data) setOrders(ordersRes.data);
      if (productsRes.count !== null) setActiveProductsCount(productsRes.count);
      
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
        <div className="w-8 h-8 border-2 border-[#ceae88] border-t-transparent rounded-full animate-spin" />
        <p className="animate-pulse">جاري تحميل الإحصائيات...</p>
      </div>
    );
  }

  const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;
  const recentOrders = orders.slice(0, 8);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white mb-2">نظرة عامة</h2>
        <p className="text-gray-400 text-sm">مراجعة أداء منصتك الشامل</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue Card */}
        <div className="bg-[#111114] border border-[#ceae88]/20 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ceae88]/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ceae88]/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] flex items-center justify-center border border-white/5">
              <DollarSign className="w-5 h-5 text-[#ceae88]" />
            </div>
            <h3 className="text-gray-400 text-sm font-bold">إجمالي الإيرادات</h3>
          </div>
          <div className="flex items-end justify-between relative z-10">
            <div>
              <h3 className="text-3xl font-black text-white mb-2">${totalRevenue.toLocaleString()}</h3>
              {/* Fake sparkline & trend for visual */}
              <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded-md w-fit">
                <TrendingDown className="w-3 h-3 text-red-400" />
                <span className="text-xs font-bold text-red-400">1.06%</span>
              </div>
            </div>
            <div className="w-16 h-8 opacity-50 flex items-end gap-1">
              {[4, 7, 3, 5, 2, 6, 8, 4].map((h, i) => (
                <div key={i} className="w-1.5 bg-[#ceae88] rounded-t-sm" style={{ height: `${h * 4}px` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-[#111114] border border-[#ceae88]/20 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ceae88]/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ceae88]/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] flex items-center justify-center border border-white/5">
              <Users className="w-5 h-5 text-[#ceae88]" />
            </div>
            <h3 className="text-gray-400 text-sm font-bold">العملاء الفريدون</h3>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white">{uniqueCustomers}</h3>
          </div>
        </div>

        {/* Total Orders Card */}
        <div className="bg-[#111114] border border-[#ceae88]/20 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ceae88]/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ceae88]/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] flex items-center justify-center border border-white/5">
              <ClipboardList className="w-5 h-5 text-[#ceae88]" />
            </div>
            <h3 className="text-gray-400 text-sm font-bold">إجمالي الطلبات</h3>
          </div>
          <div className="flex items-end justify-between relative z-10">
            <div>
              <h3 className="text-3xl font-black text-white mb-2">{orders.length}</h3>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-md w-fit">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs font-bold text-green-400">0.82%</span>
              </div>
            </div>
            <div className="w-16 h-8 opacity-50 flex items-end gap-1">
              {[2, 4, 3, 6, 8, 5, 7, 9].map((h, i) => (
                <div key={i} className="w-1.5 bg-[#ceae88] rounded-t-sm" style={{ height: `${h * 4}px` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Active Products Card */}
        <div className="bg-[#111114] border border-[#ceae88]/20 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ceae88]/40 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ceae88]/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] flex items-center justify-center border border-white/5">
              <Tag className="w-5 h-5 text-[#ceae88]" />
            </div>
            <h3 className="text-gray-400 text-sm font-bold">المنتجات النشطة</h3>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white">{activeProductsCount}</h3>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden mt-8">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white tracking-wide">أحدث الطلبات</h3>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-[#151518]">لا توجد طلبات حتى الآن</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400" dir="rtl">
              <thead className="text-xs text-gray-500 bg-[#151518]/50 uppercase border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tr-lg">معرف الطلب</th>
                  <th className="px-6 py-4 font-semibold">العميل</th>
                  <th className="px-6 py-4 font-semibold">المنتج</th>
                  <th className="px-6 py-4 font-semibold">التاريخ</th>
                  <th className="px-6 py-4 font-semibold">الإجمالي</th>
                  <th className="px-6 py-4 font-semibold rounded-tl-lg">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#111114]">
                {recentOrders.map((order, i) => {
                  const statusColor = order.status === 'completed' 
                    ? 'text-green-400 bg-green-500/10 border-green-500/20' 
                    : 'text-[#ceae88] bg-[#ceae88]/10 border-[#ceae88]/20';
                  
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-500">
                        #{order.id.split('-')[0].toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {order.customer_name || order.customer_email.split('@')[0]}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {order.product_id ? 'منتج مخصص' : 'Premium Package'}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('en-CA')}
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        ${order.amount}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                          {order.status === 'completed' ? 'Completed' : 'Processing'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
