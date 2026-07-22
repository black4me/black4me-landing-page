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
    const provider = req.headers.get('x-webhook-provider') || 'unknown'; // E.g., 'stripe', 'tally', 'activepieces'
    
    // In production, we should verify webhook signatures here based on the provider.
    
    const body = await req.json();

    // 1. Log the incoming webhook for audit and replay
    const { error: logError } = await supabase.from('webhook_logs').insert([
      {
        provider,
        event_type: body.type || 'unknown_event',
        payload: body,
        status: 'pending'
      }
    ]);

    if (logError) {
      console.error('Webhook Log Error:', logError);
    }

    // 2. Route the webhook to specific handlers
    let leadEmail = null;
    let eventName = '';
    
    if (provider === 'tally') {
      // Tally form submission
      leadEmail = body.data?.fields?.find((f: any) => f.type === 'EMAIL')?.value;
      eventName = 'form_submitted';
    } else if (provider === 'stripe') {
      // Stripe payment success
      leadEmail = body.data?.object?.customer_email || body.data?.object?.receipt_email;
      if (body.type === 'checkout.session.completed') eventName = 'payment_success';
      if (body.type === 'payment_intent.payment_failed') eventName = 'payment_failed';
    } else if (provider === 'activepieces') {
      leadEmail = body.email;
      eventName = body.event || 'automation_event';
    }

    // 3. Update Lead and Record Event
    if (leadEmail && eventName) {
      // Find or create lead
      let { data: lead } = await supabase.from('leads').select('id, lead_score').eq('email', leadEmail).single();
      
      if (!lead) {
        const { data: newLead } = await supabase.from('leads').insert([{ email: leadEmail, source: provider }]).select().single();
        lead = newLead;
      }

      if (lead) {
        // Increment score based on external events
        let scoreIncrement = 0;
        if (eventName === 'payment_success') scoreIncrement = 100;
        if (eventName === 'form_submitted') scoreIncrement = 25;

        if (scoreIncrement > 0) {
          await supabase.from('leads').update({ lead_score: lead.lead_score + scoreIncrement, status: 'Hot' }).eq('id', lead.id);
        }

        // Record event
        await supabase.from('events').insert([{
          lead_id: lead.id,
          event_name: eventName,
          metadata: { provider, raw_type: body.type }
        }]);
      }
    }

    // Update log status
    await supabase.from('webhook_logs').update({ status: 'processed' }).eq('payload->>id', body.id || null); // Assuming body has an id for matching

    return NextResponse.json({ received: true, status: 'processed' });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
