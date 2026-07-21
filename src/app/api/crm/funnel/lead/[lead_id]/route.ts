import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export async function GET(req: Request, props: { params: Promise<{ lead_id: string }> }) {
  try {
    const params = await props.params;
    const { lead_id } = params;

    if (!lead_id) {
      return NextResponse.json({ error: 'lead_id is required' }, { status: 400 });
    }

    // 1. Fetch current progress
    const { data: progress, error: progError } = await supabase
      .from('lead_funnel_progress')
      .select('*, funnel_stages!inner(name, description, stage_order)')
      .eq('lead_id', lead_id)
      .single();

    if (progError && progError.code !== 'PGRST116') {
      throw progError;
    }

    // 2. Fetch history
    const { data: history, error: histError } = await supabase
      .from('funnel_stage_history')
      .select('*, funnel_stages!inner(name)')
      .eq('lead_id', lead_id)
      .order('entered_at', { ascending: false });

    if (histError) throw histError;

    return NextResponse.json({
      current_stage: progress ? progress.funnel_stages.name : null,
      details: progress || null,
      history: history || []
    });

  } catch (error: any) {
    console.error('Funnel Lead Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
