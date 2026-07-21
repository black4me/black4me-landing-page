import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export async function POST(req: Request) {
  try {
    // 1. Fetch pending events
    const { data: pendingEvents, error: fetchError } = await supabase
      .from('integration_events')
      .select(`
        id, event_type, direction, payload, created_at,
        integration_accounts ( config ),
        integrations ( name )
      `)
      .eq('status', 'pending')
      .eq('direction', 'outbound')
      .limit(10); // Batch size

    if (fetchError) throw fetchError;
    if (!pendingEvents || pendingEvents.length === 0) {
      return NextResponse.json({ success: true, processed: 0, message: 'No pending events' });
    }

    let processedCount = 0;

    // 2. Process each event
    for (const event of pendingEvents) {
      const config = event.integration_accounts?.config || {};
      const webhookUrl = config.webhook_url;
      const startTime = Date.now();
      
      let finalStatus = 'failed';
      let errorMessage = null;
      let statusCode = null;
      let responsePayload = null;

      if (!webhookUrl) {
        errorMessage = 'Missing webhook_url in integration_accounts config';
      } else {
        try {
          const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': config.api_key ? `Bearer ${config.api_key}` : ''
            },
            body: JSON.stringify({
              event_id: event.id,
              event_type: event.event_type,
              integration_name: event.integrations?.name,
              payload: event.payload,
              timestamp: event.created_at
            })
          });

          statusCode = res.status;
          const text = await res.text();
          try {
             responsePayload = JSON.parse(text);
          } catch(e) {
             responsePayload = { raw: text };
          }

          if (res.ok) {
            finalStatus = 'success';
          } else {
            finalStatus = 'failed';
            errorMessage = `HTTP Error ${statusCode}: ${res.statusText}`;
          }
        } catch (fetchErr: any) {
          finalStatus = 'failed';
          errorMessage = fetchErr.message || 'Network request failed';
        }
      }

      const durationMs = Date.now() - startTime;

      // 3. Update the event
      await supabase
        .from('integration_events')
        .update({
          status: finalStatus,
          error_message: errorMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', event.id);

      // 4. Upsert/Update the sync log (since /api/crm/integrations/events/log already created it without response)
      // Actually, if it was created by /log, we need to update it. If not, insert.
      // Let's just insert a new log for the worker processing attempt, or update existing if it has a null status_code.
      const { data: existingLog } = await supabase
        .from('integration_sync_logs')
        .select('id')
        .eq('integration_event_id', event.id)
        .order('attempted_at', { ascending: false })
        .limit(1)
        .single();

      if (existingLog) {
        await supabase
          .from('integration_sync_logs')
          .update({
            response_payload: responsePayload,
            status_code: statusCode,
            duration_ms: durationMs
          })
          .eq('id', existingLog.id);
      } else {
        await supabase
          .from('integration_sync_logs')
          .insert([{
            integration_event_id: event.id,
            request_payload: event.payload, // Approximation
            response_payload: responsePayload,
            status_code: statusCode,
            duration_ms: durationMs
          }]);
      }

      processedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      processed: processedCount 
    });

  } catch (error: any) {
    console.error('Integration Worker Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
