'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function OffersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/crm/kpi/offers');
        const json = await res.json();
        setData(json.offer_performance);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500" dir="rtl">جاري تحميل بيانات العروض...</div>;

  const translateLadderLevel = (level: string) => {
    const map: Record<string, string> = {
      'lead_magnet': 'هدية مجانية (Lead Magnet)',
      'tripwire': 'عرض مبدئي (Tripwire)',
      'core_offer': 'العرض الأساسي (Core Offer)',
      'profit_maximizer': 'مُعظّم الأرباح',
      'continuity': 'الاستمرارية (اشتراك)',
      'premium': 'خدمة النخبة (Premium)'
    };
    return map[level] || level.replace('_', ' ');
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">أداء العروض وتسلسل القيمة (Value Ladder)</h2>

      {data && data.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <p className="text-lg text-slate-600 dark:text-slate-300">لا توجد عروض مكوّنة حالياً.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((offer: any) => (
          <Card key={offer.offer_id} className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-xl pb-4">
              <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">{translateLadderLevel(offer.ladder_level)}</div>
              <CardTitle className="text-lg text-slate-900 dark:text-white">{offer.offer_name}</CardTitle>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{offer.price == 0 ? 'مجاني' : `$${offer.price}`}</div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">المشاهدات</span>
                <span className="font-semibold dark:text-white">{offer.total_views}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">{offer.price == 0 ? 'المستلمون' : 'المشترون'}</span>
                <span className="font-bold text-green-600 dark:text-green-400">{offer.total_purchases}</span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5" dir="ltr">
                <div 
                  className="bg-red-600 dark:bg-red-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (offer.total_purchases / Math.max(1, offer.total_views)) * 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">معدل التحويل</span>
                <span className="font-semibold dark:text-white" dir="ltr">{Number(offer.conversion_rate).toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between items-center text-sm font-bold bg-slate-50 dark:bg-slate-800 p-2 rounded">
                <span className="text-slate-700 dark:text-slate-300">الإيرادات المحققة</span>
                <span className="text-green-600 dark:text-green-400" dir="ltr">${offer.total_revenue_generated || 0}</span>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
