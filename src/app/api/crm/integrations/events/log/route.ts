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
    const { 
      integration_name, 
      event_type, 
      direction, 
      payload, 
      status = 'pending', 
      error_message = null,
      request_payload = null,
      response_payload = null,
      status_code = null,
      duration_ms = null
    } = await req.json();

    if (!integration_name || !event_type || !direction) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Resolve Integration & Account
    const { data: integration } = await supabase
      .from('integrations')
      .select('id, integration_accounts(id)')
      .eq('name', integration_name)
      .single();

    if (!integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    const account_id = integration.integration_accounts?.[0]?.id || null;

    // 2. Insert Integration Event
    const { data: event, error: eventError } = await supabase
      .from('integration_events')
      .insert([{
        integration_id: integration.id,
        account_id,
        event_type,
        direction,
        payload,
        status,
        error_message
      }])
      .select()
      .single();

    if (eventError) throw eventError;

    // 3. Insert Sync Log
    await supabase.from('integration_sync_logs').insert([{
      integration_event_id: event.id,
      request_payload,
      response_payload,
      status_code,
      duration_ms
    }]);

    return NextResponse.json({ 
      success: true, 
      event_id: event.id,
      message: 'Integration event logged successfully'
    });

  } catch (error: any) {
    console.error('Integration Event Log Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
