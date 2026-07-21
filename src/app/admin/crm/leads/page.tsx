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
      full_name,
      lead_score, 
      lead_source, 
      created_at,
      lead_funnel_progress ( funnel_stages ( name ) ),
      lead_offer_state ( ladder_level, status )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return <div className="p-8 text-red-500">خطأ في جلب العملاء المحتملين: {error.message}</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800" dir="rtl">
      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">إدارة العملاء المحتملين (Leads)</h2>
      {leads && leads.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p className="text-lg">لا يوجد عملاء محتملون حالياً.</p>
          <p className="text-sm">بمجرد تسجيل شخص ما، سيظهر هنا.</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-6 py-3">الاسم</th>
              <th className="px-6 py-3">البريد الإلكتروني</th>
              <th className="px-6 py-3">نقاط التفاعل (Score)</th>
              <th className="px-6 py-3">مرحلة القمع البيعي</th>
              <th className="px-6 py-3">حالة العروض</th>
              <th className="px-6 py-3">المصدر</th>
              <th className="px-6 py-3">تاريخ الانضمام</th>
              <th className="px-6 py-3">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {leads?.map((lead: any) => (
              <tr key={lead.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 font-medium">{lead.full_name || 'غير متوفر'}</td>
                <td className="px-6 py-4 font-medium" dir="ltr">{lead.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${lead.lead_score >= 50 ? 'bg-red-100 text-red-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                    {lead.lead_score || 0}
                  </span>
                </td>
                <td className="px-6 py-4">{lead.lead_funnel_progress?.[0]?.funnel_stages?.name || 'الوعي (Awareness)'}</td>
                <td className="px-6 py-4">
                  {lead.lead_offer_state && lead.lead_offer_state.length > 0 ? lead.lead_offer_state.map((s: any) => (
                    <div key={s.ladder_level} className="text-xs text-slate-500 dark:text-slate-400">{s.ladder_level}: {s.status}</div>
                  )) : 'لا يوجد'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${lead.lead_source === 'lead_magnet' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {lead.lead_source === 'lead_magnet' ? 'هدية مجانية' : (lead.lead_source || 'طبيعي')}
                  </span>
                </td>
                <td className="px-6 py-4" dir="ltr">{new Date(lead.created_at).toLocaleDateString('ar-EG')}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/crm/leads/${lead.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    عرض التفاصيل
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
