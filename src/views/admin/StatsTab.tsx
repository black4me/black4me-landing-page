"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  DollarSign, Users, ShoppingBag, Tag, TrendingUp, TrendingDown,
  ClipboardList, Mail, BookOpen, MousePointerClick, Eye
} from 'lucide-react';

interface Order { id: string; customer_email: string; customer_name?: string; amount: number; status: string; created_at: string; }
interface Subscriber { id: string; email: string; created_at: string; }
interface BlogPost { id: string; title: string; slug: string; view_count?: number; created_at: string; }

// Mini bar chart using divs (no external lib needed)
function MiniBarChart({ data, color = '#ceae88' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all duration-500"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, minHeight: '2px', opacity: 0.7 + (i / data.length) * 0.3 }}
        />
      ))}
    </div>
  );
}

// 30-day sparkline dataset grouped by day
function groupByDay(items: { created_at: string }[], days = 30) {
  const result: number[] = new Array(days).fill(0);
  const now = Date.now();
  items.forEach(item => {
    const diff = Math.floor((now - new Date(item.created_at).getTime()) / 86400000);
    if (diff < days) result[days - 1 - diff]++;
  });
  return result;
}

export function StatsTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeProductsCount, setActiveProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [ordersRes, productsRes, subsRes, postsRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('id,title,slug,view_count,created_at').order('view_count', { ascending: false }).limit(10),
      ]);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (productsRes.count !== null) setActiveProductsCount(productsRes.count);
      if (subsRes.data) setSubscribers(subsRes.data);
      if (postsRes.data) setPosts(postsRes.data);
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

  // Charts data
  const ordersByDay = groupByDay(orders);
  const subsByDay = groupByDay(subscribers);

  // This week vs last week subscribers
  const thisWeekSubs = subsByDay.slice(-7).reduce((a, b) => a + b, 0);
  const lastWeekSubs = subsByDay.slice(-14, -7).reduce((a, b) => a + b, 0);
  const subGrowth = lastWeekSubs > 0 ? Math.round(((thisWeekSubs - lastWeekSubs) / lastWeekSubs) * 100) : 0;

  // Monthly labels (last 4 weeks)
  const weekLabels = ['الأسبوع 4', 'الأسبوع 3', 'الأسبوع 2', 'هذا الأسبوع'];
  const weeklySubData = [
    subsByDay.slice(0, 7).reduce((a, b) => a + b, 0),
    subsByDay.slice(7, 14).reduce((a, b) => a + b, 0),
    subsByDay.slice(14, 21).reduce((a, b) => a + b, 0),
    subsByDay.slice(21, 28).reduce((a, b) => a + b, 0),
  ];

  const maxWeeklySub = Math.max(...weeklySubData, 1);

  // Blog stats
  const totalViews = posts.reduce((s, p) => s + (p.view_count || 0), 0);

  return (
    <div className="space-y-10 animate-fade-in" dir="rtl">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black tracking-tight text-white mb-2">نظرة عامة</h2>
        <p className="text-gray-400 text-sm">مراجعة أداء منصتك الشامل — مبيعات، نشرة بريدية، ومحتوى</p>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          icon={<DollarSign className="w-5 h-5 text-[#ceae88]" />}
          label="إجمالي الإيرادات"
          value={`$${totalRevenue.toLocaleString()}`}
          chart={<MiniBarChart data={ordersByDay.slice(-8)} color="#ceae88" />}
          trend={null}
        />
        <KpiCard
          icon={<Users className="w-5 h-5 text-[#ceae88]" />}
          label="المشتركون في النشرة"
          value={subscribers.length.toString()}
          chart={<MiniBarChart data={subsByDay.slice(-8)} color="#10b981" />}
          trend={subGrowth}
          trendLabel="هذا الأسبوع"
        />
        <KpiCard
          icon={<ClipboardList className="w-5 h-5 text-[#ceae88]" />}
          label="إجمالي الطلبات"
          value={orders.length.toString()}
          chart={<MiniBarChart data={ordersByDay.slice(-8)} color="#3b82f6" />}
          trend={null}
        />
        <KpiCard
          icon={<Eye className="w-5 h-5 text-[#ceae88]" />}
          label="إجمالي مشاهدات المقالات"
          value={totalViews.toLocaleString()}
          chart={<MiniBarChart data={posts.map(p => p.view_count || 0).slice(0, 8)} color="#a855f7" />}
          trend={null}
        />
      </div>

      {/* ── Newsletter Analytics ── */}
      <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-400" />
              أداء النشرة البريدية
            </h3>
            <p className="text-xs text-gray-500 mt-1">نمو المشتركين خلال آخر 30 يوماً</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-white">{subscribers.length}</span>
            <p className="text-xs text-gray-500">إجمالي المشتركين</p>
          </div>
        </div>

        {/* Weekly bar chart */}
        <div className="grid grid-cols-4 gap-3">
          {weeklySubData.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="w-full bg-[#1a1a1d] rounded-t-lg flex items-end justify-center" style={{ height: '80px' }}>
                <div
                  className="w-full rounded-t-lg transition-all duration-700"
                  style={{
                    height: `${(val / maxWeeklySub) * 100}%`,
                    backgroundColor: idx === 3 ? '#10b981' : '#ceae88',
                    minHeight: val > 0 ? '4px' : '0',
                    opacity: 0.6 + idx * 0.1
                  }}
                />
              </div>
              <span className="text-[10px] text-gray-500">{weekLabels[idx]}</span>
              <span className="text-xs font-bold text-white">{val}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-gray-500">هذا الأسبوع</p>
              <p className="text-lg font-bold text-white">{thisWeekSubs} مشترك</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">الأسبوع السابق</p>
              <p className="text-lg font-bold text-white">{lastWeekSubs} مشترك</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${subGrowth >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {subGrowth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {subGrowth >= 0 ? '+' : ''}{subGrowth}% نمو
          </div>
        </div>

        {/* Recent subscribers list */}
        {subscribers.length > 0 && (
          <div className="space-y-2 border-t border-white/5 pt-4">
            <p className="text-xs text-gray-500 mb-3">آخر المشتركين الجدد</p>
            {subscribers.slice(0, 5).map(sub => (
              <div key={sub.id} className="flex items-center justify-between py-2 px-3 bg-[#0d0d10] rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Mail className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-sm text-gray-300">{sub.email}</span>
                </div>
                <span className="text-xs text-gray-600">{new Date(sub.created_at).toLocaleDateString('ar-SA')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Blog Performance ── */}
      <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            أداء المقالات والمحتوى
          </h3>
          <div className="text-right">
            <span className="text-2xl font-black text-white">{totalViews.toLocaleString()}</span>
            <p className="text-xs text-gray-500">إجمالي المشاهدات</p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-600">لا توجد مقالات منشورة حتى الآن</div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, idx) => {
              const pct = totalViews > 0 ? Math.round(((post.view_count || 0) / totalViews) * 100) : 0;
              return (
                <div key={post.id} className="flex items-center gap-4 py-3 px-4 bg-[#0d0d10] rounded-xl hover:bg-[#141417] transition">
                  <span className="text-gray-600 text-sm font-mono w-5">#{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-[#1a1a1d] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, backgroundColor: pct > 30 ? '#a855f7' : '#6366f1' }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 w-8">{pct}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-sm font-bold">{(post.view_count || 0).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold text-white tracking-wide">أحدث الطلبات</h3>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-[#151518]">لا توجد طلبات حتى الآن</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-400" dir="rtl">
              <thead className="text-xs text-gray-500 bg-[#151518]/50 uppercase border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 font-semibold text-right">معرف الطلب</th>
                  <th className="px-6 py-4 font-semibold text-right">العميل</th>
                  <th className="px-6 py-4 font-semibold text-right">التاريخ</th>
                  <th className="px-6 py-4 font-semibold text-right">الإجمالي</th>
                  <th className="px-6 py-4 font-semibold text-right">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#111114]">
                {recentOrders.map(order => {
                  const statusColor = order.status === 'completed'
                    ? 'text-green-400 bg-green-500/10 border-green-500/20'
                    : 'text-[#ceae88] bg-[#ceae88]/10 border-[#ceae88]/20';
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-gray-500">#{order.id.split('-')[0].toUpperCase()}</td>
                      <td className="px-6 py-4 font-medium text-white">
                        {order.customer_name || order.customer_email.split('@')[0]}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString('ar-SA')}</td>
                      <td className="px-6 py-4 font-bold text-white">${order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                          {order.status === 'completed' ? '✅ مكتمل' : '⏳ قيد المعالجة'}
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

// ── Shared KPI Card component ──────────────────────────────────────────────

function KpiCard({
  icon, label, value, chart, trend, trendLabel
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  chart: React.ReactNode;
  trend: number | null;
  trendLabel?: string;
}) {
  return (
    <div className="bg-[#111114] border border-[#ceae88]/20 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ceae88]/40 transition-colors">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ceae88]/5 rounded-full blur-3xl -mr-10 -mt-10" />
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] flex items-center justify-center border border-white/5">
          {icon}
        </div>
        <h3 className="text-gray-400 text-xs font-bold text-right">{label}</h3>
      </div>
      <div className="relative z-10 mb-4">
        <h3 className="text-3xl font-black text-white">{value}</h3>
        {trend !== null && (
          <div className={`flex items-center gap-1 mt-1.5 w-fit px-2 py-0.5 rounded-md ${trend >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="text-xs font-bold">{trend >= 0 ? '+' : ''}{trend}% {trendLabel || ''}</span>
          </div>
        )}
      </div>
      <div className="relative z-10">
        {chart}
      </div>
    </div>
  );
}
