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

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  confirmed:   { label: 'مؤكد',    color: 'bg-green-100 text-green-800' },
  cancelled:   { label: 'ملغي',    color: 'bg-red-100 text-red-800' },
  rescheduled: { label: 'معاد جدولة', color: 'bg-yellow-100 text-yellow-800' },
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
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">لوحة الاستشارات</h1>
        <span className="text-sm text-gray-500">
          آخر تحديث: {new Date().toLocaleTimeString('ar-AE')}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي الحجوزات', value: stats.total,       color: 'bg-blue-50   border-blue-200',   text: 'text-blue-700'  },
          { label: 'مؤكدة',           value: stats.confirmed,   color: 'bg-green-50  border-green-200',  text: 'text-green-700' },
          { label: 'ملغاة',           value: stats.cancelled,   color: 'bg-red-50    border-red-200',    text: 'text-red-700'   },
          { label: 'معادة جدولة',     value: stats.rescheduled, color: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700'},
        ].map(card => (
          <div key={card.label} className={`rounded-xl border p-4 ${card.color}`}>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.text}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="🔍 ابحث بالاسم أو الإيميل..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="flex gap-2">
          {['all', 'confirmed', 'cancelled', 'rescheduled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === s
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'الكل' : STATUS_LABELS[s]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['العميل', 'الموعد', 'المدة', 'الحالة', 'إجراءات'].map(h => (
                <th key={h} className="px-4 py-3 text-right font-medium text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400">
                  لا توجد استشارات مطابقة
                </td>
              </tr>
            ) : (
              filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{c.customer_name ?? '—'}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{c.customer_email ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {c.start_time ? formatDate(c.start_time) : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-500">60 د</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      STATUS_LABELS[c.status]?.color ?? 'bg-gray-100 text-gray-600'
                    }`}>
                      {STATUS_LABELS[c.status]?.label ?? c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://app.cal.com/booking/${c.booking_uid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      عرض في Cal.com ↗
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-center">
        يعرض {filtered.length} من أصل {consultations.length} استشارة
      </p>
    </div>
  );
}
