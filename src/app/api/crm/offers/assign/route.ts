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
    const { lead_id, offer_id, status = 'offered', source = 'unknown' } = await req.json();

    if (!lead_id || !offer_id) {
      return NextResponse.json({ error: 'lead_id and offer_id are required' }, { status: 400 });
    }

    // 1. Validate Offer
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offer_id)
      .single();

    if (offerError || !offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // 2. Check existing state
    const { data: existingState } = await supabase
      .from('lead_offer_state')
      .select('*')
      .eq('lead_id', lead_id)
      .eq('offer_id', offer_id)
      .single();

    let leadOfferState;

    if (existingState) {
      // Don't downgrade status if they already accepted
      if (existingState.status === 'accepted' || existingState.status === 'upsold') {
        return NextResponse.json({ message: 'Lead already accepted this offer', state: existingState });
      }

      // Update state
      const { data: updated } = await supabase
        .from('lead_offer_state')
        .update({ status, source })
        .eq('id', existingState.id)
        .select()
        .single();
      
      leadOfferState = updated;
    } else {
      // Insert new state
      const { data: inserted, error: insertError } = await supabase
        .from('lead_offer_state')
        .insert([{
          lead_id,
          offer_id,
          ladder_level: offer.ladder_level,
          status,
          source
        }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      leadOfferState = inserted;
    }

    return NextResponse.json({ 
      success: true, 
      state: leadOfferState,
      ladder_level: offer.ladder_level 
    });

  } catch (error: any) {
    console.error('Assign Offer Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
