import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use service role to insert across schema

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, event_name, metadata, lead_id } = body;

    if (!session_id || !event_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert event
    const { error: eventError } = await supabase.from('events').insert([
      {
        session_id,
        event_name,
        metadata: metadata || {},
        lead_id: lead_id || null,
      },
    ]);

    if (eventError) {
      console.error('Error inserting CRM event:', eventError);
      return NextResponse.json({ error: eventError.message }, { status: 500 });
    }

    // Lead Scoring Logic
    if (lead_id) {
      let scoreIncrement = 0;
      switch (event_name) {
        case 'page_view': scoreIncrement = 1; break;
        case 'scroll_50': scoreIncrement = 2; break;
        case 'scroll_75': scoreIncrement = 3; break;
        case 'scroll_100': scoreIncrement = 5; break;
        case 'button_click': scoreIncrement = 5; break;
        case 'form_started': scoreIncrement = 10; break;
        case 'checkout_started': scoreIncrement = 20; break;
        case 'payment_success': scoreIncrement = 50; break;
        case 'consultation_click': scoreIncrement = 15; break;
      }

      if (scoreIncrement > 0) {
        const { data: lead } = await supabase.from('leads').select('lead_score').eq('id', lead_id).single();
        if (lead) {
          await supabase.from('leads').update({ lead_score: lead.lead_score + scoreIncrement }).eq('id', lead_id);
        }
      }

      // 3. Trigger Funnel Engine Progression
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        await fetch(`${baseUrl}/api/crm/funnel/update-from-event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead_id,
            event_name,
            event_id: null,
            source: 'tracking_engine'
          })
        });

        // 4. Offer Engine Integration
        const offer_id = metadata?.offer_id;
        if (offer_id) {
          if (event_name === 'payment_success') {
            await fetch(`${baseUrl}/api/crm/offers/mark-purchased`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lead_id, offer_id, order_id: metadata?.order_id })
            });
          } else {
            await fetch(`${baseUrl}/api/crm/offers/assign`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lead_id, offer_id, status: 'viewed', source: 'tracking' })
            });
          }
        }

      } catch (e) {
        console.error('Funnel/Offer Trigger Error:', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('CRM Tracking API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
