'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FunnelPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/crm/kpi/funnel');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Funnel Data...</div>;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold mb-4">Sales Funnel Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Standard Funnel Visual */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Funnel Conversion</CardTitle></CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.aggregated_funnel || []} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" stroke="#888" fontSize={14} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#dc2626" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#888' }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right: Funnel Breakdown Table */}
        <Card>
          <CardHeader><CardTitle>Stage Counts</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.aggregated_funnel?.map((stage: any, index: number) => {
                const prevCount = index > 0 ? data.aggregated_funnel[index - 1].count : stage.count;
                const conversion = prevCount > 0 ? Math.round((stage.count / prevCount) * 100) : 0;
                
                return (
                  <div key={stage.name} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                    <div>
                      <div className="font-semibold">{stage.name}</div>
                      {index > 0 && <div className="text-xs text-slate-400">Dropoff: {100 - conversion}%</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{stage.count}</div>
                      {index > 0 && <div className="text-xs text-green-600">{conversion}% of prev</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
