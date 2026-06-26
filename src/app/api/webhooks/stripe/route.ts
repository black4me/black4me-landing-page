import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { sendWelcomeEmail } from '../../../../server/actions/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const customerEmail = session.customer_details?.email || session.metadata?.customer_email;
      const productId = session.metadata?.product_id;
      const customerName = session.metadata?.customer_name;

      if (customerEmail && productId) {
        // 1. Create order
        const { data: orderData } = await supabaseAdmin.from('orders').insert([{
          customer_email: customerEmail,
          customer_name: customerName || '',
          product_id: productId,
          amount: (session.amount_total || 0) / 100,
          payment_gateway: 'stripe',
          status: 'completed',
        }]).select('id').single();

        // 2. Fetch product details
        const { data: product } = await supabaseAdmin
          .from('products')
          .select('id, title, file_url')
          .eq('id', productId)
          .single();

        // 3. Grant full access to the purchased product
        await supabaseAdmin.from('user_access').insert({
          customer_email: customerEmail,
          product_id: product?.id || productId,
          product_title: product?.title || 'المنتج',
          file_url: product?.file_url || null,
          order_id: session.id,
          payment_gateway: 'stripe',
        });

        // 4. Send welcome email
        if (orderData) {
          await sendWelcomeEmail(customerEmail, customerName || '', orderData.id);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
