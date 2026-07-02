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

    // Fetch product details
    let title = 'Your Product';
    let fileUrl = null;
    
    if (productId === 'prod-consultation') {
      title = 'جلسة استشارية + خطة عمل';
    } else if (productId === 'prod-main-book') {
      title = 'كتاب "أسرار المبيعات" الشامل';
    } else {
      const { data: dbProduct, error: productError } = await supabaseAdmin
        .from('products')
        .select('title, file_url, file_type')
        .eq('id', productId)
        .single();
        
      if (!productError && dbProduct) {
        title = dbProduct.title;
        fileUrl = dbProduct.file_url;
      }
    }

    return NextResponse.json({
      success: true,
      product: {
        id: productId,
        title: title,
        file_url: fileUrl,
      }
    });

  } catch (err: any) {
    console.error('Verify Order Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
