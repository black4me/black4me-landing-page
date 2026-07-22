'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Users, Filter, MousePointerClick, ArrowUpRight, ArrowDownRight, Eye, UserPlus, Database } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function CrmDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 1250,
    activeSessions: 42,
    conversionRate: 15.2,
    hotLeads: 128
  });

  const chartData = [
    { name: 'Sat', leads: 400, sessions: 240 },
    { name: 'Sun', leads: 300, sessions: 139 },
    { name: 'Mon', leads: 200, sessions: 980 },
    { name: 'Tue', leads: 278, sessions: 390 },
    { name: 'Wed', leads: 189, sessions: 480 },
    { name: 'Thu', leads: 239, sessions: 380 },
    { name: 'Fri', leads: 349, sessions: 430 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn" dir="rtl">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">إدارة العملاء والزيارات</h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">لوحة التحكم التنفيذية - Executive Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#1a1a1d] border border-white/10 hover:border-[#ceae88]/50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-bold">تصفية</span>
          </button>
          <button className="bg-[#ceae88] hover:bg-white text-[#111114] px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-bold">
            <Database className="w-4 h-4" />
            <span className="text-sm">تصدير البيانات</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-[#ceae88]/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ceae88]/5 rounded-full blur-3xl group-hover:bg-[#ceae88]/10 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-[#ceae88]/10 rounded-xl text-[#ceae88]">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center text-green-400 text-sm font-bold gap-1 bg-green-400/10 px-2 py-1 rounded">
              +12% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-bold mb-1 relative z-10">إجمالي العملاء (Leads)</h3>
          <p className="text-3xl font-black text-white relative z-10">{stats.totalLeads}</p>
        </div>

        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <Eye className="w-6 h-6" />
            </div>
            <span className="flex items-center text-green-400 text-sm font-bold gap-1 bg-green-400/10 px-2 py-1 rounded">
              +5% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-bold mb-1 relative z-10">الجلسات النشطة حالياً</h3>
          <p className="text-3xl font-black text-white relative z-10">{stats.activeSessions}</p>
        </div>

        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
              <MousePointerClick className="w-6 h-6" />
            </div>
            <span className="flex items-center text-red-400 text-sm font-bold gap-1 bg-red-400/10 px-2 py-1 rounded">
              -2% <ArrowDownRight className="w-3 h-3" />
            </span>
          </div>
          <h3 className="text-gray-400 text-sm font-bold mb-1 relative z-10">معدل التحويل</h3>
          <p className="text-3xl font-black text-white relative z-10">{stats.conversionRate}%</p>
        </div>

        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-all" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
              <UserPlus className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm font-bold mb-1 relative z-10">العملاء الساخنون (Hot Leads)</h3>
          <p className="text-3xl font-black text-white relative z-10">{stats.hotLeads}</p>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111114] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">تدفق الزيارات والعملاء</h2>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ceae88" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ceae88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1d', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#ceae88" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111114] border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">أحدث الأحداث (Live)</h2>
          <div className="space-y-4">
            {/* Realtime events feed mockup */}
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1a1d] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-2 shrink-0 animate-pulse" />
                <div>
                  <p className="text-sm font-bold text-white">زائر جديد من السعودية</p>
                  <p className="text-xs text-gray-400 mt-1">تصفح صفحة الهبوط وقام بالتمرير لـ 50%</p>
                  <p className="text-[10px] text-gray-500 mt-1">منذ {i} دقيقة</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Table & Profile Section */}
      <div className="bg-[#111114] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1a1a1d]">
          <h2 className="text-lg font-bold text-white">جدول العملاء (Leads)</h2>
          <div className="flex gap-2">
            <input type="text" placeholder="البحث في العملاء..." className="bg-[#111114] border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-[#ceae88]" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-[#161619] text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">العميل</th>
                <th className="px-6 py-4 font-medium">التقييم (Score)</th>
                <th className="px-6 py-4 font-medium">الحالة</th>
                <th className="px-6 py-4 font-medium">تاريخ الانضمام</th>
                <th className="px-6 py-4 font-medium text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {[
                { name: 'أحمد محمد', email: 'ahmed@example.com', score: 125, status: 'Hot', date: '2026-07-21' },
                { name: 'مريم علي', email: 'maryam@example.com', score: 45, status: 'Warm', date: '2026-07-20' },
                { name: 'زائر مجهول', email: '-', score: 12, status: 'Cold', date: '2026-07-21' },
              ].map((lead, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{lead.name}</div>
                    <div className="text-gray-500 text-xs mt-1">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#ceae88]/20 text-[#ceae88] px-2 py-1 rounded font-bold text-xs">
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${lead.status === 'Hot' ? 'bg-red-500/20 text-red-400' : lead.status === 'Warm' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{lead.date}</td>
                  <td className="px-6 py-4 text-left">
                    <button className="text-gray-400 hover:text-white transition-colors bg-[#1a1a1d] px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-xs font-bold">
                      عرض الملف (Timeline)
                    </button>
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
