import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '30'); // default 30 days

    const { data: leads, error: leadsErr } = await supabase
      .from('v_daily_leads')
      .select('*')
      .limit(limit);
      
    if (leadsErr) throw leadsErr;

    const { data: revenue, error: revErr } = await supabase
      .from('v_daily_revenue')
      .select('*')
      .limit(limit);
      
    if (revErr) throw revErr;

    // Aggregate totals for the overview cards
    const totalLeads = leads.reduce((acc, row) => acc + Number(row.total_leads), 0);
    const totalHotLeads = leads.reduce((acc, row) => acc + Number(row.hot_leads), 0);
    const totalRevenue = revenue.reduce((acc, row) => acc + Number(row.total_revenue), 0);
    const totalSales = revenue.reduce((acc, row) => acc + Number(row.total_sales), 0);

    return NextResponse.json({
      success: true,
      totals: {
        totalLeads,
        totalHotLeads,
        totalRevenue,
        totalSales,
      },
      daily_trends: {
        leads,
        revenue
      }
    });
  } catch (error: any) {
    console.error('KPI Overview Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
