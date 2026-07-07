'use client';

import { useState } from 'react';

type Consultation = {
  id: string;
  booking_uid: string;
  title: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_email: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled';
  created_at: string;
};

type Stats = {
  total: number;
  confirmed: number;
  cancelled: number;
  rescheduled: number;
};

const STATUS_LABELS: Record<string, { label: string; bg: string; text: string; border: string }> = {
  confirmed:   { label: 'مؤكد',         bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  cancelled:   { label: 'ملغي',         bg: 'bg-rose-500/10',    text: 'text-rose-400',    border: 'border-rose-500/20' },
  rescheduled: { label: 'معادة جدولة',  bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20' },
};

export default function ConsultationsClient({
  consultations,
  stats,
}: {
  consultations: Consultation[];
  stats: Stats;
}) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = consultations.filter(c => {
    const matchStatus = filter === 'all' || c.status === filter;
    const matchSearch =
      !search ||
      c.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ar-AE', {
      weekday: 'long', year: 'numeric',
      month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="p-6 space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">إدارة الاستشارات</h1>
          <p className="text-gray-400 mt-2 text-sm">متابعة وتنظيم حجوزات الاستشارات الخاصة بك عبر Cal.com</p>
        </div>
        <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          تحديث مباشر: {new Date().toLocaleTimeString('ar-AE')}
        </span>
      </div>

      {/* Stats Cards - Luxury Design */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي الحجوزات', value: stats.total,       accentText: 'text-blue-400',   accentBg: 'bg-blue-500/10',   border: 'border-blue-500/20',   icon: '📊' },
          { label: 'مؤكدة',           value: stats.confirmed,   accentText: 'text-emerald-400', accentBg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '✨' },
          { label: 'ملغاة',           value: stats.cancelled,   accentText: 'text-rose-400',    accentBg: 'bg-rose-500/10',    border: 'border-rose-500/20',    icon: '✕' },
          { label: 'معادة جدولة',     value: stats.rescheduled, accentText: 'text-amber-400',   accentBg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: '↻' },
        ].map(card => (
          <div key={card.label} className="relative overflow-hidden rounded-2xl bg-[#111111] border border-white/10 p-6 transition-all hover:border-white/20 shadow-xl shadow-black/50 group">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full -mr-16 -mt-16 transition-opacity opacity-20 group-hover:opacity-40 ${card.accentBg}`}></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-400">{card.label}</span>
                <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${card.accentBg} ${card.accentText} border ${card.border} text-lg`}>
                  {card.icon}
                </span>
              </div>
              <p className="text-4xl font-bold text-white tracking-tight">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters - Premium Dark */}
      <div className="flex flex-wrap gap-4 items-center bg-[#111111] p-4 rounded-2xl border border-white/10 shadow-lg">
        <div className="relative flex-1 min-w-[250px] md:max-w-md">
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            placeholder="ابحث بالاسم أو الإيميل..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          {['all', 'confirmed', 'cancelled', 'rescheduled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                filter === s
                  ? 'bg-white text-black border-white shadow-lg shadow-white/10'
                  : 'bg-transparent text-gray-400 border-white/10 hover:bg-white/5 hover:text-white'
              }`}
            >
              {s === 'all' ? 'عرض الكل' : STATUS_LABELS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table - Luxury Dark Theme */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/50">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-[#1a1a1a] border-b border-white/10">
              <tr>
                {['العميل', 'تاريخ ووقت الموعد', 'المدة', 'حالة الحجز', 'إجراءات'].map(h => (
                  <th key={h} className="px-6 py-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <span className="text-4xl mb-4 opacity-20">📋</span>
                      <p>لا توجد استشارات مطابقة لبحثك</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center text-gray-400 font-bold shadow-inner">
                          {c.customer_name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-amber-50 transition-colors">{c.customer_name ?? '—'}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{c.customer_email ?? '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <span className="text-gray-500">🗓</span>
                        {c.start_time ? formatDate(c.start_time) : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/5">60 دقيقة</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        STATUS_LABELS[c.status]?.bg ?? 'bg-gray-800'
                      } ${STATUS_LABELS[c.status]?.text ?? 'text-gray-400'} ${
                        STATUS_LABELS[c.status]?.border ?? 'border-gray-700'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-75"></span>
                        {STATUS_LABELS[c.status]?.label ?? c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://app.cal.com/booking/${c.booking_uid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 rounded-xl transition-colors border border-amber-500/20"
                      >
                        إدارة الموعد
                        <span className="text-lg leading-none">↗</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500 pt-4 px-2">
        <p>نظام الحجوزات متصل مباشرة بـ Cal.com</p>
        <p>
          عرض <span className="text-white font-medium">{filtered.length}</span> من أصل <span className="text-white font-medium">{consultations.length}</span>
        </p>
      </div>
    </div>
  );
}
