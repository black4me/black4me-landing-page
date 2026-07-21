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
    const { lead_id, sequence_id } = await req.json();

    if (!lead_id || !sequence_id) {
      return NextResponse.json({ error: 'lead_id and sequence_id are required' }, { status: 400 });
    }

    // 1. Check if sequence exists and is active
    const { data: sequence, error: seqError } = await supabase
      .from('message_sequences')
      .select('*')
      .eq('id', sequence_id)
      .single();

    if (seqError || !sequence || sequence.status !== 'active') {
      return NextResponse.json({ error: 'Invalid or inactive sequence' }, { status: 400 });
    }

    // 2. Get the first step to schedule
    const { data: firstStep, error: stepError } = await supabase
      .from('message_sequence_steps')
      .select('*')
      .eq('sequence_id', sequence_id)
      .eq('step_order', 1)
      .single();

    if (stepError || !firstStep) {
      return NextResponse.json({ error: 'Sequence has no steps configured' }, { status: 400 });
    }

    // Calculate next scheduled time based on delay
    let nextScheduledAt = new Date();
    if (firstStep.delay_value > 0) {
      if (firstStep.delay_unit === 'minutes') nextScheduledAt.setMinutes(nextScheduledAt.getMinutes() + firstStep.delay_value);
      if (firstStep.delay_unit === 'hours') nextScheduledAt.setHours(nextScheduledAt.getHours() + firstStep.delay_value);
      if (firstStep.delay_unit === 'days') nextScheduledAt.setDate(nextScheduledAt.getDate() + firstStep.delay_value);
      if (firstStep.delay_unit === 'weeks') nextScheduledAt.setDate(nextScheduledAt.getDate() + (firstStep.delay_value * 7));
    }

    // 3. Enroll Lead
    const { data: enrollment, error: enrollError } = await supabase
      .from('lead_sequence_enrollments')
      .insert([
        {
          lead_id,
          sequence_id,
          current_step_order: 1,
          status: 'active',
          next_step_scheduled_at: nextScheduledAt.toISOString(),
        }
      ])
      .select()
      .single();

    if (enrollError) {
      return NextResponse.json({ error: enrollError.message }, { status: 500 });
    }

    // 4. Log to lead_timeline
    await supabase.from('lead_timeline').insert([
      {
        lead_id,
        action_type: 'sequence_enrolled',
        description: `Enrolled in sequence: ${sequence.name}`,
        metadata: {
          sequence_id,
          channel_plan: firstStep.channel,
          enrollment_id: enrollment.id
        }
      }
    ]);

    // 5. Integration Event: Sequence Enrollment Push
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/crm/integrations/events/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          integration_name: 'activepieces', 
          event_type: 'sequence_enrollment_push', 
          direction: 'outbound', 
          payload: { lead_id, sequence_id, channel: firstStep.channel },
          status: 'pending' 
        })
      });
    } catch (e) {
      console.error('Sequence Integration Trigger Error:', e);
    }

    return NextResponse.json({ success: true, enrollment });
  } catch (error: any) {
    console.error('Sequence Enrollment Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
