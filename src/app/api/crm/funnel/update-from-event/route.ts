import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export async function POST(req: Request) {
  try {
    const { lead_id, event_name, event_id, source } = await req.json();

    if (!lead_id || !event_name) {
      return NextResponse.json({ error: 'lead_id and event_name are required' }, { status: 400 });
    }

    // 1. Fetch current progress
    const { data: progress } = await supabase
      .from('lead_funnel_progress')
      .select('*, funnel_stages!inner(*)')
      .eq('lead_id', lead_id)
      .single();

    // 2. Fetch all stages ordered
    const { data: stages } = await supabase
      .from('funnel_stages')
      .select('*')
      .order('stage_order', { ascending: true });
      
    if (!stages) throw new Error('No funnel stages found');

    // 3. Determine target stage based on event (Simple rules engine)
    let targetStageName = null;
    if (event_name === 'page_view') targetStageName = 'Awareness';
    if (['lead_created', 'lead_magnet_download', 'manychat_optin'].includes(event_name)) targetStageName = 'Interest';
    if (['email_sequence_engaged', 'link_clicked'].includes(event_name)) targetStageName = 'Desire';
    if (['checkout_started', 'consultation_click'].includes(event_name)) targetStageName = 'Decision';
    if (['payment_success'].includes(event_name)) targetStageName = 'Purchase';
    if (['upsell_purchased', 'repeat_order'].includes(event_name)) targetStageName = 'Retention';

    if (!targetStageName) {
      return NextResponse.json({ message: 'Event does not trigger a funnel progression', stage_changed: false });
    }

    const targetStage = stages.find(s => s.name === targetStageName);
    if (!targetStage) throw new Error(`Target stage ${targetStageName} not found in DB`);

    const currentStageOrder = progress?.funnel_stages?.stage_order || 0;

    // Only progress forward in the funnel
    if (targetStage.stage_order > currentStageOrder) {
      // 4. Update or Insert Progress
      if (progress) {
        // Record History
        await supabase.from('funnel_stage_history').insert([{
          lead_id,
          stage_id: progress.current_stage_id,
          entered_at: progress.entered_at,
          left_at: new Date().toISOString(),
          reason: `Advanced due to event: ${event_name}`
        }]);

        // Update Progress
        await supabase.from('lead_funnel_progress').update({
          current_stage_id: targetStage.id,
          entered_at: new Date().toISOString(),
          last_event_id: event_id || null,
          source: source || progress.source
        }).eq('id', progress.id);
      } else {
        // First entry
        await supabase.from('lead_funnel_progress').insert([{
          lead_id,
          current_stage_id: targetStage.id,
          last_event_id: event_id || null,
          source: source || 'organic'
        }]);
      }

      // 5. Update Metrics (Simple atomic increment can be done via RPC, but for now we rely on a daily cron to sync metrics from history, or direct update)
      // Note: A true production metrics table would be maintained via triggers or batch jobs.

      return NextResponse.json({ 
        current_stage: targetStage.name, 
        previous_stage: progress?.funnel_stages?.name || null, 
        stage_changed: true 
      });
    }

    return NextResponse.json({ 
      current_stage: progress?.funnel_stages?.name || targetStage.name, 
      stage_changed: false,
      message: 'Lead is already at or past this stage'
    });

  } catch (error: any) {
    console.error('Funnel Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
