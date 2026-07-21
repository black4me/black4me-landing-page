'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function CRMDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [overviewRes, funnelRes, offersRes] = await Promise.all([
          fetch('/api/crm/kpi/overview'),
          fetch('/api/crm/kpi/funnel'),
          fetch('/api/crm/kpi/offers')
        ]);
        
        const overview = await overviewRes.json();
        const funnel = await funnelRes.json();
        const offers = await offersRes.json();
        
        setData({ overview, funnel, offers });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500" dir="rtl">جاري تحميل لوحة القيادة...</div>;
  if (error) return <div className="p-8 text-center text-red-500" dir="rtl">خطأ: {error}</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500" dir="rtl">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">إجمالي العملاء المحتملين</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold dark:text-white">{data?.overview?.totals?.totalLeads || 0}</div></CardContent>
        </Card>
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">العملاء الساخنون</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-red-600 dark:text-red-500">{data?.overview?.totals?.totalHotLeads || 0}</div></CardContent>
        </Card>
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">إجمالي الإيرادات</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-600 dark:text-green-400">${data?.overview?.totals?.totalRevenue || 0}</div></CardContent>
        </Card>
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">إجمالي الطلبات</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold dark:text-white">{data?.overview?.totals?.totalSales || 0}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Revenue Trend */}
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader><CardTitle className="dark:text-white">اتجاه الإيرادات اليومي</CardTitle></CardHeader>
          <CardContent className="h-[300px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.overview?.daily_trends?.revenue?.slice().reverse() || []}>
                <XAxis dataKey="metric_date" stroke="#888" fontSize={12} tickFormatter={(value) => new Date(value).toLocaleDateString('ar-EG', {month: 'short', day: 'numeric'})} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip labelFormatter={(label) => new Date(label as string).toLocaleDateString('ar-EG')} />
                <Line type="monotone" dataKey="total_revenue" name="إجمالي الإيرادات" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funnel Overview */}
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader><CardTitle className="dark:text-white">تقدم القمع البيعي</CardTitle></CardHeader>
          <CardContent className="h-[300px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.funnel?.aggregated_funnel || []} layout="vertical" margin={{ left: 100 }}>
                <XAxis type="number" stroke="#888" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} width={90} />
                <Tooltip />
                <Bar dataKey="count" name="عدد العملاء" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
