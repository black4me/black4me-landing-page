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

  if (loading) return <div className="p-8 text-center text-slate-500" dir="rtl">جاري تحميل بيانات القمع البيعي...</div>;

  const getArabicStageName = (name: string) => {
    const stageMap: Record<string, string> = {
      'Awareness': 'الوعي',
      'Interest': 'الاهتمام',
      'Desire': 'الرغبة',
      'Action': 'القرار (اتخاذ الإجراء)',
      'Purchase': 'الشراء',
      'Retention': 'الاحتفاظ'
    };
    return stageMap[name] || name;
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">تحليل القمع البيعي (Sales Funnel)</h2>

      {data?.aggregated_funnel?.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <p className="text-lg text-slate-600 dark:text-slate-300">لا توجد بيانات حالية للقمع البيعي.</p>
          <p className="text-sm text-slate-500 mt-2">قم بإنشاء عملاء محتملين لتظهر البيانات هنا.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Standard Funnel Visual */}
        <Card className="lg:col-span-2 dark:bg-slate-900 dark:border-slate-800">
          <CardHeader><CardTitle className="dark:text-white">معدل التحويل (Funnel Conversion)</CardTitle></CardHeader>
          <CardContent className="h-[400px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.aggregated_funnel?.map((d: any) => ({...d, name: getArabicStageName(d.name)})) || []} layout="vertical" margin={{ left: 100, right: 20 }}>
                <XAxis type="number" stroke="#888" />
                <YAxis dataKey="name" type="category" stroke="#888" fontSize={14} width={90} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" name="عدد العملاء" fill="#dc2626" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#888' }} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right: Funnel Breakdown Table */}
        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader><CardTitle className="dark:text-white">توزيع المراحل</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.aggregated_funnel?.map((stage: any, index: number) => {
                const prevCount = index > 0 ? data.aggregated_funnel[index - 1].count : stage.count;
                const conversion = prevCount > 0 ? Math.round((stage.count / prevCount) * 100) : 0;
                
                return (
                  <div key={stage.name} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 last:border-0">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{getArabicStageName(stage.name)}</div>
                      {index > 0 && <div className="text-xs text-slate-400">معدل التسرب: {100 - conversion}%</div>}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg dark:text-white">{stage.count}</div>
                      {index > 0 && <div className="text-xs text-green-600 dark:text-green-400">{conversion}% من السابق</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
}
