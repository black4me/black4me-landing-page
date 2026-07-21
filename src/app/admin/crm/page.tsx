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

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Total Leads</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.overview?.totals?.totalLeads || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Hot Leads</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-red-600">{data?.overview?.totals?.totalHotLeads || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-green-600">${data?.overview?.totals?.totalRevenue || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Total Orders</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{data?.overview?.totals?.totalSales || 0}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Revenue Trend */}
        <Card>
          <CardHeader><CardTitle>Daily Revenue Trend</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.overview?.daily_trends?.revenue?.slice().reverse() || []}>
                <XAxis dataKey="metric_date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="total_revenue" stroke="#dc2626" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funnel Overview */}
        <Card>
          <CardHeader><CardTitle>Funnel Progression</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.funnel?.aggregated_funnel || []} layout="vertical" margin={{ left: 40 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" stroke="#888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
