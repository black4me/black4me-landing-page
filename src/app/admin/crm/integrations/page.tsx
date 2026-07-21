import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export default async function IntegrationsPage() {
  const { data: integrations, error: intError } = await supabase
    .from('integrations')
    .select(`
      *,
      integration_accounts ( account_name, is_active )
    `)
    .order('name');

  const { data: recentEvents, error: evError } = await supabase
    .from('integration_events')
    .select(`
      *,
      integrations ( name )
    `)
    .order('created_at', { ascending: false })
    .limit(20);

  if (intError || evError) {
    return <div className="p-8 text-red-500">Error fetching integrations data.</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Integrations & Webhooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations?.map((integ: any) => (
            <div key={integ.id} className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg capitalize">{integ.name.replace('_', ' ')}</h3>
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${integ.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {integ.is_active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="text-sm text-slate-500 mb-4">Type: {integ.type}</div>
              
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-slate-400">Connected Accounts</div>
                {integ.integration_accounts?.length > 0 ? (
                  integ.integration_accounts.map((acc: any, idx: number) => (
                    <div key={idx} className="text-sm flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${acc.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {acc.account_name}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-slate-500 italic">No accounts configured</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Recent Sync Logs</h3>
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3">Integration</th>
                <th className="px-6 py-3">Event Type</th>
                <th className="px-6 py-3">Direction</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents?.map((ev: any) => (
                <tr key={ev.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 font-semibold capitalize">{ev.integrations?.name.replace('_', ' ')}</td>
                  <td className="px-6 py-4">{ev.event_type}</td>
                  <td className="px-6 py-4 text-slate-500">{ev.direction}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      ev.status === 'success' ? 'bg-green-100 text-green-700' :
                      ev.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(ev.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {recentEvents?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No sync events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
