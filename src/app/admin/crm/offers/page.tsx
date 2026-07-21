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

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Offers Data...</div>;

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold mb-4">Value Ladder & Offer Performance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((offer: any) => (
          <Card key={offer.offer_id} className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-slate-50 dark:bg-slate-800/50 rounded-t-xl pb-4">
              <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">{offer.ladder_level.replace('_', ' ')}</div>
              <CardTitle className="text-lg">{offer.offer_name}</CardTitle>
              <div className="text-sm font-semibold text-slate-500">${offer.price}</div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Views</span>
                <span className="font-semibold">{offer.total_views}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Purchased/Accepted</span>
                <span className="font-bold text-green-600">{offer.total_purchases}</span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                <div 
                  className="bg-red-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(100, (offer.total_purchases / Math.max(1, offer.total_views)) * 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-sm pt-2 border-t dark:border-slate-800">
                <span className="text-slate-500">Conversion Rate</span>
                <span className="font-semibold">{Number(offer.conversion_rate).toFixed(1)}%</span>
              </div>
              
              <div className="flex justify-between items-center text-sm font-bold bg-slate-50 dark:bg-slate-800 p-2 rounded">
                <span>Revenue Generated</span>
                <span className="text-green-600">${offer.total_revenue_generated}</span>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
