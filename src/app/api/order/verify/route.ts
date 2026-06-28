import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'No session id' }, { status: 400 });
    }

    // Retrieve session from Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (e: any) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
    }

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Not paid' }, { status: 400 });
    }

    const productId = session.metadata?.product_id;
    
    if (!productId) {
       return NextResponse.json({ error: 'No product metadata' }, { status: 400 });
    }

    // Fetch product details from Supabase to get the file_url
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('title, file_url, file_type')
      .eq('id', productId)
      .single();

    return NextResponse.json({
      success: true,
      product: {
        title: product?.title || 'Your Product',
        file_url: product?.file_url || null,
      }
    });

  } catch (err: any) {
    console.error('Verify Order Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
