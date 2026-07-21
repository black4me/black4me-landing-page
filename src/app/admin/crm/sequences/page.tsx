import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export default async function SequencesPage() {
  // Fetch sequences along with counts
  const { data: sequences, error } = await supabase
    .from('message_sequences')
    .select(`
      id, name, target_offer_id, is_active, created_at,
      message_sequence_steps ( count ),
      sequence_enrollments ( status )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Error fetching sequences: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Message Sequences</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {sequences?.map((seq: any) => {
          const enrollments = seq.sequence_enrollments || [];
          const activeCount = enrollments.filter((e: any) => e.status === 'active').length;
          const completedCount = enrollments.filter((e: any) => e.status === 'completed').length;
          const stepsCount = seq.message_sequence_steps?.[0]?.count || 0;

          return (
            <div key={seq.id} className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{seq.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${seq.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                    {seq.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-sm text-slate-500">Target Offer: <span className="font-medium text-slate-700 dark:text-slate-300">{seq.target_offer_id || 'None'}</span></div>
                <div className="text-sm text-slate-500">{stepsCount} Steps configured</div>
              </div>

              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{activeCount}</div>
                  <div className="text-xs text-slate-500 uppercase">Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{completedCount}</div>
                  <div className="text-xs text-slate-500 uppercase">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{enrollments.length}</div>
                  <div className="text-xs text-slate-500 uppercase">Total</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
