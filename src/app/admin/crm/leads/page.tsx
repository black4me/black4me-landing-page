import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export default async function LeadsPage() {
  const { data: leads, error } = await supabase
    .from('leads')
    .select(`
      id, 
      email, 
      lead_score, 
      source, 
      created_at,
      lead_funnel_progress ( funnel_stages ( name ) ),
      lead_offer_state ( ladder_level, status )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return <div className="p-8 text-red-500">Error fetching leads: {error.message}</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
      <h2 className="text-xl font-bold mb-4">Leads Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Score</th>
              <th className="px-6 py-3">Funnel Stage</th>
              <th className="px-6 py-3">Value Ladder</th>
              <th className="px-6 py-3">Source</th>
              <th className="px-6 py-3">Joined</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads?.map((lead: any) => (
              <tr key={lead.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-medium">{lead.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${lead.lead_score >= 50 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                    {lead.lead_score}
                  </span>
                </td>
                <td className="px-6 py-4">{lead.lead_funnel_progress?.[0]?.funnel_stages?.name || 'Awareness'}</td>
                <td className="px-6 py-4">
                  {lead.lead_offer_state?.map((s: any) => (
                    <div key={s.ladder_level} className="text-xs text-slate-500">{s.ladder_level}: {s.status}</div>
                  )) || 'None'}
                </td>
                <td className="px-6 py-4">{lead.source || 'Organic'}</td>
                <td className="px-6 py-4">{new Date(lead.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/crm/leads/${lead.id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
