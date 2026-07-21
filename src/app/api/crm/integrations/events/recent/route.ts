import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const { data: events, error } = await supabase
      .from('integration_events')
      .select(`
        *,
        integrations ( name, type ),
        integration_accounts ( account_name )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;

    return NextResponse.json({
      success: true,
      events
    });
  } catch (error: any) {
    console.error('Integration Events Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
