import { createClient } from '@supabase/supabase-js';
import { Clock, Tag, Search, ArrowRightCircle, Target, BarChart, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: lead, error } = await supabase
    .from('leads')
    .select(`
      *,
      lead_timeline ( * ),
      lead_funnel_progress ( funnel_stages ( name ) ),
      lead_offer_state ( ladder_level, status ),
      sequence_enrollments ( sequences ( name ), status, current_step_index )
    `)
    .eq('id', id)
    .single();

  if (error || !lead) {
    return <div className="p-8 text-red-500 bg-red-500/10 rounded-lg">Error fetching lead: {error?.message}</div>;
  }

  // Sort timeline newest first
  const timeline = lead.lead_timeline?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];
  
  // Calculate analytics
  const totalDurationSeconds = timeline.reduce((acc: number, cur: any) => acc + (cur.duration_seconds || 0), 0);
  const totalDurationMinutes = Math.floor(totalDurationSeconds / 60);
  
  const mostViewedOffers = [...timeline.reduce((acc: any, cur: any) => {
    if (cur.offer_slug) {
      acc.set(cur.offer_slug, (acc.get(cur.offer_slug) || 0) + 1);
    }
    return acc;
  }, new Map()).entries()].sort((a, b) => b[1] - a[1]);
  
  const couponsUsed = timeline.filter((e: any) => e.coupon_code).reduce((acc: any, cur: any) => {
    acc.add(cur.coupon_code);
    return acc;
  }, new Set());

  const hasHesitation = timeline.some((e: any) => e.event_type === 'HesitationDetected');
  const hasPurchased = lead.lead_offer_state?.some((s: any) => s.status === 'purchased');

  return (
    <div className="p-6 space-y-6">
      {/* 1) Basic Profile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#161b22] p-6 rounded-3xl border border-gray-800">
        <div>
          <h2 className="text-2xl font-bold text-white">{lead.name || 'Unknown'}</h2>
          <p className="text-gray-400">{lead.email}</p>
          <div className="mt-4 flex gap-4 text-sm text-gray-400">
            <div><span className="font-semibold text-gray-200">Source:</span> {lead.source || 'Direct'}</div>
            <div><span className="font-semibold text-gray-200">Visits:</span> {timeline.filter((e:any)=>['PageView', 'OfferView'].includes(e.event_type)).length}</div>
            <div><span className="font-semibold text-gray-200">Time on site:</span> {totalDurationMinutes} mins</div>
          </div>
        </div>
        <div className="text-right mt-4 md:mt-0 flex gap-6">
          <div>
            <div className="text-sm text-gray-400">Funnel Stage</div>
            <div className="font-semibold capitalize text-white">{lead.lead_funnel_progress?.[0]?.funnel_stages?.name || 'Awareness'}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Lead Score</div>
            <div className={`text-4xl font-black ${lead.lead_score >= 50 ? 'text-red-500' : 'text-white'}`}>
              {lead.lead_score || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Strategic Summary */}
        <div className="space-y-6">
          {/* 3) Commercial Intent Summary */}
          <div className="bg-[#161b22] p-6 rounded-3xl border border-gray-800">
            <h3 className="font-bold border-b border-gray-800 pb-2 mb-4 flex items-center gap-2 text-white">
              <Target size={18} className="text-blue-500"/> Commercial Intent
            </h3>
            
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-gray-400 block">Top Interest:</span>
                <span className="font-semibold text-white">{mostViewedOffers.length > 0 ? mostViewedOffers[0][0] : 'None'}</span>
              </div>
              
              <div>
                <span className="text-gray-400 block">Checkout Started?</span>
                <span className="font-semibold text-white">{timeline.some((e:any) => e.event_type === 'CheckoutStarted') ? 'Yes' : 'No'}</span>
              </div>
              
              <div>
                <span className="text-gray-400 block">Purchased?</span>
                <span className={`font-semibold ${hasPurchased ? 'text-green-400' : 'text-orange-400'}`}>
                  {hasPurchased ? 'Yes' : 'No'}
                </span>
              </div>
              
              {hasHesitation && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-500 flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>Hesitation detected! Client spent &gt;3 mins on offer without buying. Coupon auto-generated.</span>
                </div>
              )}
            </div>
          </div>
          
          {/* 4) Coupon Usage */}
          <div className="bg-[#161b22] p-6 rounded-3xl border border-gray-800">
            <h3 className="font-bold border-b border-gray-800 pb-2 mb-4 flex items-center gap-2 text-white">
              <Tag size={18} className="text-emerald-500"/> Coupons & Offers
            </h3>
            
            <div className="mb-4">
              <span className="text-xs text-gray-500 uppercase block mb-1">Coupons Interacted</span>
              {Array.from(couponsUsed).length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {Array.from(couponsUsed).map((c: any) => (
                    <span key={c} className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-xs font-mono">{c}</span>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-gray-500">No coupons used</span>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <span className="text-xs text-gray-500 uppercase block mb-2">Value Ladder State</span>
              {lead.lead_offer_state?.map((s: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm py-1">
                  <span className="capitalize text-gray-300">{s.ladder_level.replace('_', ' ')}</span>
                  <span className={`font-semibold ${s.status === 'purchased' || s.status === 'accepted' ? 'text-green-400' : 'text-gray-500'}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Unified Timeline */}
        {/* 2) Activity Timeline */}
        <div className="md:col-span-2 bg-[#161b22] p-6 rounded-3xl border border-gray-800">
          <h3 className="font-bold border-b border-gray-800 pb-2 mb-4 flex items-center gap-2 text-white">
            <Clock size={18} /> Activity Timeline
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
            {timeline?.map((event: any) => {
              const eventDate = new Date(event.created_at || event.timestamp);
              const isStrategic = event.event_category === 'Strategic' || event.event_type.includes('Hesitation');
              
              return (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-800 bg-[#0d1117] text-gray-400 group-[.is-active]:bg-emerald-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <Search size={16} />
                  </div>
                  <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#0a0a0a] p-4 rounded-2xl border ${isStrategic ? 'border-red-500/30 bg-red-500/5' : 'border-gray-800'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-bold text-sm ${isStrategic ? 'text-red-400' : 'text-white'}`}>{event.event_type}</span>
                      <time className="text-xs font-mono text-gray-500">
                        {eventDate.toLocaleDateString()} {eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
                      </time>
                    </div>
                    <p className="text-sm text-gray-300">{event.description}</p>
                    
                    {/* Rich Meta Tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {event.duration_seconds > 0 && (
                        <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">
                          ⏱ {event.duration_seconds}s
                        </span>
                      )}
                      {event.offer_slug && (
                        <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400">
                          🎯 {event.offer_slug}
                        </span>
                      )}
                      {event.coupon_code && (
                        <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400">
                          🎟 {event.coupon_code}
                        </span>
                      )}
                      {event.page_path && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-400">
                          🔗 {event.page_path}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
