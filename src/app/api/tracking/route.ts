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
    const { error } = await supabase.from('events').insert([
      {
        session_id,
        event_name,
        metadata: metadata || {},
        lead_id: lead_id || null,
      },
    ]);

    if (error) {
      console.error('Error inserting CRM event:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('CRM Tracking API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
