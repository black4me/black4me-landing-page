import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
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
    return <div className="p-8 text-red-500">Error fetching lead: {error?.message}</div>;
  }

  // Sort timeline newest first
  const timeline = lead.lead_timeline?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold">{lead.email}</h2>
          <p className="text-slate-500">Joined: {new Date(lead.created_at).toLocaleDateString()}</p>
          <div className="mt-2 text-sm text-slate-600">Source: <span className="font-semibold">{lead.source}</span></div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">Lead Score</div>
          <div className={`text-4xl font-black ${lead.lead_score >= 50 ? 'text-red-600' : 'text-slate-800 dark:text-slate-100'}`}>
            {lead.lead_score}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Funnel & Offers & Sequences */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold border-b dark:border-slate-800 pb-2 mb-4">Current Status</h3>
            <div className="mb-4">
              <div className="text-xs text-slate-500 uppercase">Funnel Stage</div>
              <div className="font-medium">{lead.lead_funnel_progress?.[0]?.funnel_stages?.name || 'Awareness'}</div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-slate-500 uppercase">Active Sequences</div>
              {lead.sequence_enrollments?.length ? (
                lead.sequence_enrollments.map((enr: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    {enr.sequences?.name} <span className="text-xs text-slate-400">({enr.status} - step {enr.current_step_index})</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">None</div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold border-b dark:border-slate-800 pb-2 mb-4">Value Ladder State</h3>
            {lead.lead_offer_state?.map((s: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span className="capitalize">{s.ladder_level.replace('_', ' ')}</span>
                <span className={`font-semibold ${s.status === 'purchased' || s.status === 'accepted' ? 'text-green-600' : 'text-slate-500'}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Unified Timeline */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold border-b dark:border-slate-800 pb-2 mb-4">Unified Timeline</h3>
          <div className="space-y-4">
            {timeline?.map((event: any) => (
              <div key={event.id} className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-slate-400">{new Date(event.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{event.action_type}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{event.description}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(event.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
