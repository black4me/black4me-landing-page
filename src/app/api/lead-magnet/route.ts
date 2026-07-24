import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, name, magnet } = await req.json();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { persistSession: false },
        db: { schema: 'crm' }
      }
    );

    const publicSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Check if lead already exists in CRM
    let { data: existingLead } = await supabase.from('leads').select('id').eq('email', email).single();
    let leadId = existingLead?.id;

    if (!leadId) {
      // Create new lead in CRM
      const { data: newLead, error: leadError } = await supabase
        .from('leads')
        .insert({
          email,
          full_name: name,
          lead_source: 'lead_magnet',
          lead_score: 10,
        })
        .select('id')
        .single();
      
      if (leadError) throw leadError;
      leadId = newLead.id;

      // Assign Funnel Stage 'Awareness' (Assuming the first stage ID, or we fetch it)
      const { data: stages } = await supabase.from('funnel_stages').select('id').order('order_index').limit(1);
      if (stages && stages.length > 0) {
        await supabase.from('lead_funnel_progress').insert({
          lead_id: leadId,
          current_stage_id: stages[0].id,
          source: 'lead_magnet'
        });
      }
    } else {
      // Update existing lead score
      const { data: currentLead } = await supabase.from('leads').select('lead_score').eq('id', leadId).single();
      if (currentLead) {
        await supabase.from('leads').update({ lead_score: (currentLead.lead_score || 0) + 5 }).eq('id', leadId);
      }
    }

    // Enroll in Lead Magnet Sequence (Self-healing registration)
    try {
      let { data: seq } = await supabase.from('message_sequences').select('id').eq('name', 'Lead Magnet Sequence').maybeSingle();
      let seqId = seq?.id;
      if (!seqId) {
        const { data: newSeq } = await supabase.from('message_sequences').insert({
          name: 'Lead Magnet Sequence',
          description: 'Saves and triggers emails for Lead Magnet claims',
          trigger_type: 'lead_created',
          status: 'active'
        }).select('id').single();
        if (newSeq) {
          seqId = newSeq.id;
          // Create steps
          await supabase.from('message_sequence_steps').insert([
            { sequence_id: seqId, step_order: 1, channel: 'email', delay_value: 0, delay_unit: 'minutes', template_key: 'lead_magnet_1' },
            { sequence_id: seqId, step_order: 2, channel: 'email', delay_value: 24, delay_unit: 'hours', template_key: 'lead_magnet_2' },
            { sequence_id: seqId, step_order: 3, channel: 'email', delay_value: 72, delay_unit: 'hours', template_key: 'lead_magnet_3' }
          ]);
        }
      }

      if (seqId) {
        // Check if already enrolled
        const { data: existingEnroll } = await supabase.from('lead_sequence_enrollments').select('id').eq('lead_id', leadId).eq('sequence_id', seqId).maybeSingle();
        if (!existingEnroll) {
          // Schedule next step (Email 2) to be processed after 24 hours
          const nextTime = new Date();
          nextTime.setHours(nextTime.getHours() + 24);
          
          await supabase.from('lead_sequence_enrollments').insert({
            lead_id: leadId,
            sequence_id: seqId,
            current_step_order: 1, // Email 1 was sent immediately
            status: 'active',
            next_step_scheduled_at: nextTime.toISOString()
          });
        }
      }
    } catch (seqErr) {
      console.error('Sequence Enrollment Error:', seqErr);
    }

    // 2. Log Integration Event
    // Get Activepieces Integration ID
    const { data: activepieces } = await supabase.from('integrations').select('id').eq('name', 'activepieces').single();
    if (activepieces) {
      await supabase.from('integration_events').insert({
        integration_id: activepieces.id,
        event_type: 'lead_magnet_claimed',
        payload: { email, name, magnet },
        direction: 'inbound',
        status: 'success'
      });
    }

    // 3. Save to Public Schema (Legacy / Site Settings)
    await publicSupabase.from('lead_magnets').insert({ email, name, magnet, created_at: new Date().toISOString() }).select().maybeSingle();
    await publicSupabase.from('subscribers').upsert({ email, name, created_at: new Date().toISOString() }, { onConflict: 'email' });

    // Fetch site settings
    const { data: settingsData } = await publicSupabase.from('site_settings').select('*');
    const settings = (settingsData || []).reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);

    // Attempt to send email via Resend if key exists
    if (process.env.RESEND_API_KEY) {
      const { sendLeadMagnetEmail1 } = await import('../../../server/actions/email');
      const downloadLink = settings.lead_magnet_file_url || 'https://drive.google.com/drive/folders/14-SIzFYoOu7uIqs4qDNbQF-IrRlG8ker?usp=sharing';
      await sendLeadMagnetEmail1(email, name, downloadLink).catch(err => console.error('Email send failed:', err));
    }

    return NextResponse.json({ success: true, lead_id: leadId });
  } catch (err) {
    console.error('Lead magnet error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
