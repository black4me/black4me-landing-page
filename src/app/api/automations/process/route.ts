import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export async function POST(req: Request) {
  // This endpoint can be triggered by a Vercel Cron Job every 5 minutes
  try {
    // Fetch pending items in automation_queue
    const { data: queueItems, error } = await supabase
      .from('automation_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(10);

    if (error) throw error;
    if (!queueItems || queueItems.length === 0) {
      return NextResponse.json({ message: 'No pending tasks in queue' });
    }

    const processedCount = 0;

    for (const item of queueItems) {
      // Mark as processing
      await supabase.from('automation_queue').update({ status: 'processing' }).eq('id', item.id);

      try {
        if (item.action_type === 'send_email') {
          // Internal Logic to send email (e.g., using Resend)
          // await resend.emails.send(...)
          console.log(`Sending email to lead ${item.lead_id}`);
          
          await supabase.from('email_history').insert([{
            lead_id: item.lead_id,
            subject: item.payload?.subject || 'Automated Email',
            body: item.payload?.body || '',
            status: 'sent'
          }]);
        } else if (item.action_type === 'webhook_out') {
          // Forward event to an external platform (e.g., Zapier/ActivePieces)
          await fetch(item.payload.url, {
            method: 'POST',
            body: JSON.stringify(item.payload.data)
          });
        }

        // Mark as completed
        await supabase.from('automation_queue').update({ status: 'completed' }).eq('id', item.id);
      } catch (err: any) {
        // Mark as failed
        await supabase.from('automation_queue').update({ status: 'failed', error_log: err.message }).eq('id', item.id);
      }
    }

    return NextResponse.json({ success: true, processed: queueItems.length });
  } catch (error: any) {
    console.error('Automation processing error:', error);
    return NextResponse.json({ error: 'Automation processing failed' }, { status: 500 });
  }
}
