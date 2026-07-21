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
              <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1a1d] rounded-xl border border-white/5">
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

    </div>
  );
}
