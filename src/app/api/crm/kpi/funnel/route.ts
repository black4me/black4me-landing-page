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
    const { data: funnel, error } = await supabase
      .from('v_daily_funnel')
      .select('*')
      .limit(100);
      
    if (error) throw error;

    // Aggregate by stage for the complete timeframe
    const stageAggregates = funnel.reduce((acc: any, row) => {
      if (!acc[row.stage_name]) {
        acc[row.stage_name] = { count: 0, order: row.stage_order };
      }
      acc[row.stage_name].count += Number(row.entries_count);
      return acc;
    }, {});

    const sortedStages = Object.entries(stageAggregates)
      .map(([name, data]: any) => ({ name, count: data.count, order: data.order }))
      .sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      aggregated_funnel: sortedStages,
      daily_breakdown: funnel
    });
  } catch (error: any) {
    console.error('KPI Funnel Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
