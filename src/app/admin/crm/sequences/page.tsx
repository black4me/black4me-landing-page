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
      lead_sequence_enrollments ( status )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500" dir="rtl">خطأ في جلب التسلسلات: {error.message}</div>;
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">التسلسلات (Sequences)</h2>
      
      {sequences && sequences.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-lg">لا يوجد تسلسلات رسائل حالياً.</p>
          <p className="text-sm">قم بإنشاء تسلسل جديد لاستهداف العملاء المحتملين.</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 gap-4">
        {sequences?.map((seq: any) => {
          const enrollments = seq.lead_sequence_enrollments || [];
          const activeCount = enrollments.filter((e: any) => e.status === 'active').length;
          const completedCount = enrollments.filter((e: any) => e.status === 'completed').length;
          const stepsCount = seq.message_sequence_steps?.[0]?.count || 0;

          return (
            <div key={seq.id} className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{seq.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${seq.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                    {seq.is_active ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">العرض المستهدف: <span className="font-medium text-slate-700 dark:text-slate-300">{seq.target_offer_id || 'لا يوجد'}</span></div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{stepsCount} خطوات معدّة</div>
              </div>

              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeCount}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">نشط</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{completedCount}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">مكتمل</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{enrollments.length}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">الإجمالي</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
