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
    const { lead_id, offer_id, order_id } = await req.json();

    if (!lead_id || !offer_id) {
      return NextResponse.json({ error: 'lead_id and offer_id are required' }, { status: 400 });
    }

    // 1. Fetch Offer details
    const { data: offer } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offer_id)
      .single();

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // 2. Upsert State to 'accepted'
    const { data: existingState } = await supabase
      .from('lead_offer_state')
      .select('*')
      .eq('lead_id', lead_id)
      .eq('offer_id', offer_id)
      .single();

    if (existingState) {
      await supabase
        .from('lead_offer_state')
        .update({ status: 'accepted' })
        .eq('id', existingState.id);
    } else {
      await supabase
        .from('lead_offer_state')
        .insert([{
          lead_id,
          offer_id,
          ladder_level: offer.ladder_level,
          status: 'accepted',
          source: 'checkout'
        }]);
    }

    // 3. Log to lead_timeline
    await supabase.from('lead_timeline').insert([{
      lead_id,
      action_type: 'offer_purchased',
      description: `Purchased offer: ${offer.name}`,
      metadata: {
        offer_id,
        ladder_level: offer.ladder_level,
        order_id: order_id || null,
        price: offer.price
      }
    }]);

    // 4. Update Daily Metrics (naive incremental approach for immediate results)
    const today = new Date().toISOString().split('T')[0];
    
    // We try to upsert manually, or just rely on a robust KPI layer later.
    // For now, we leave the exact aggregation to Module 4 KPI Layer as requested,
    // but we can ensure the event is logged.

    return NextResponse.json({ 
      success: true, 
      message: 'Offer marked as purchased'
    });

  } catch (error: any) {
    console.error('Mark Purchased Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
