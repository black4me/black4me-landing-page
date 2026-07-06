"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ShoppingBag, Search, CheckCircle2, Download, Eye, ExternalLink } from 'lucide-react';

interface Order {
  id: string;
  customer_email: string;
  customer_name?: string;
  product_title?: string;
  product_id?: string;
  amount: number;
  payment_gateway: string;
  status: string;
  access_code?: string;
  receipt_url?: string;
  created_at: string;
}

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGateway, setFilterGateway] = useState<'all'|'stripe'|'paypal'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  }

  const handleApproveOrder = async (orderId: string) => {
    try {
      const res = await fetch('/api/order/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        alert('فشل الاعتماد: ' + data.error);
      }
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      (o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (o.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (o.id.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesGateway = filterGateway === 'all' || o.payment_gateway === filterGateway;
    
    return matchesSearch && matchesGateway;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-1">الطلبات</h2>
          <p className="text-gray-400 text-sm">إدارة ومتابعة طلبات العملاء</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="ابحث بالاسم، الايميل، أو رقم الطلب..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-10 py-2.5 text-sm w-full sm:w-64 focus:outline-none focus:border-[#6C3BFF]/50 transition text-white placeholder:text-gray-600"
            />
          </div>
          <select 
            value={filterGateway}
            onChange={e => setFilterGateway(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#6C3BFF]/50 transition text-white"
          >
            <option value="all">جميع البوابات</option>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-bold">العميل</th>
                <th className="px-6 py-4 font-bold">المبلغ / البوابة</th>
                <th className="px-6 py-4 font-bold">التاريخ</th>
                <th className="px-6 py-4 font-bold">الحالة</th>
                <th className="px-6 py-4 font-bold">كود الدخول</th>
                <th className="px-6 py-4 font-bold">الإيصال</th>
                <th className="px-6 py-4 font-bold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 animate-pulse">
                    جاري تحميل الطلبات...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    لا توجد طلبات تطابق بحثك
                  </td>
                </tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white mb-1">{order.customer_name || 'عميل مجهول'}</div>
                    <div className="text-gray-500 text-xs">{order.customer_email}</div>
                    <div className="text-gray-600 text-[10px] mt-1 font-mono">#{order.id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 mb-1">{order.product_id === 'prod-consultation' ? 'جلسة استشارية' : order.product_id === 'prod-main-book' ? 'كتاب المبيعات' : order.product_id || 'مجهول'}</div>
                    <div className="font-black text-[#F5C542]">${order.amount} <span className="text-gray-500 text-xs font-normal capitalize mr-1">({order.payment_gateway})</span></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-300">{new Date(order.created_at).toLocaleDateString('ar-EG')}</div>
                    <div className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleTimeString('ar-EG')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      order.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      order.status === 'pending_verification' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      order.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {order.status === 'completed' ? 'مكتمل' : 
                       order.status === 'pending_verification' ? 'بانتظار التأكيد' : 
                       order.status === 'failed' ? 'فشل' : 'معلق'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.access_code ? (
                      <span className="font-mono text-[#F5C542] bg-[#F5C542]/10 px-2 py-1 rounded text-xs border border-[#F5C542]/20">
                        {order.access_code}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {order.receipt_url ? (
                      <a href={order.receipt_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#6C3BFF] hover:text-[#8b63ff] transition">
                        <ExternalLink className="w-3.5 h-3.5" />
                        عرض الإيصال
                      </a>
                    ) : (
                      <span className="text-gray-600 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {order.status === 'pending_verification' && (
                      <button 
                        onClick={() => handleApproveOrder(order.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/40 rounded-lg text-xs font-bold transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        تأكيد الطلب
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
