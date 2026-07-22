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
    <div className="p-6 bg-[#161b22] border border-gray-800 rounded-3xl" dir="rtl">
      <h2 className="text-xl font-bold mb-4 text-white">إدارة العملاء المحتملين (Leads)</h2>
      {leads && leads.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">لا يوجد عملاء محتملون حالياً.</p>
          <p className="text-sm">بمجرد تسجيل شخص ما، سيظهر هنا.</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-gray-200">
          <thead className="text-xs text-gray-400 uppercase bg-[#0d1117]">
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
              <tr key={lead.id} className="border-b border-gray-800 hover:bg-[#1f242c]">
                <td className="px-6 py-4 font-medium text-white">{lead.full_name || 'غير متوفر'}</td>
                <td className="px-6 py-4 font-medium text-gray-300" dir="ltr">{lead.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${lead.lead_score >= 50 ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-300'}`}>
                    {lead.lead_score || 0}
                  </span>
                </td>
                <td className="px-6 py-4">{lead.lead_funnel_progress?.[0]?.funnel_stages?.name || 'الوعي (Awareness)'}</td>
                <td className="px-6 py-4">
                  {lead.lead_offer_state && lead.lead_offer_state.length > 0 ? lead.lead_offer_state.map((s: any) => (
                    <div key={s.ladder_level} className="text-xs text-gray-400">{s.ladder_level}: {s.status}</div>
                  )) : 'لا يوجد'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${lead.lead_source === 'lead_magnet' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {lead.lead_source === 'lead_magnet' ? 'هدية مجانية' : (lead.lead_source || 'طبيعي')}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400" dir="ltr">{new Date(lead.created_at).toLocaleDateString('ar-EG')}</td>
                <td className="px-6 py-4">
                  <Link href={`/admin/crm/leads/${lead.id}`} className="text-[#6C3BFF] hover:text-[#5b32d9] hover:underline font-bold">
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
