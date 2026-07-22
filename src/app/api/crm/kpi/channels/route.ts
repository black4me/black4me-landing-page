import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
  db: { schema: 'crm' },
});

export async function GET() {
  try {
    const { data: channels, error } = await supabase
      .from('v_channel_performance')
      .select('*');
      
    if (error) throw error;

    return NextResponse.json({
      success: true,
      channel_performance: channels
    });
  } catch (error: any) {
    console.error('KPI Channels Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
