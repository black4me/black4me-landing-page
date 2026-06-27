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
        const stripeSessionId = session.id;

        const { data: existingOrder, error: existingOrderError } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq('payment_gateway', 'stripe')
          .eq('receipt_url', stripeSessionId)
          .maybeSingle();

        if (existingOrderError) {
          throw existingOrderError;
        }

        let orderId = existingOrder?.id;

        if (!orderId) {
          const { data: orderData, error: orderInsertError } = await supabaseAdmin.from('orders').insert([{
            customer_email: customerEmail,
            customer_name: customerName || '',
            product_id: productId,
            amount: (session.amount_total || 0) / 100,
            payment_gateway: 'stripe',
            status: 'completed',
            receipt_url: stripeSessionId,
          }]).select('id').single();

          if (orderInsertError || !orderData) {
            throw orderInsertError || new Error('Failed to create order');
          }

          orderId = orderData.id;
        }

        const { data: product } = await supabaseAdmin
          .from('products')
          .select('id, title, file_url')
          .eq('id', productId)
          .single();

        const { data: existingAccess, error: existingAccessError } = await supabaseAdmin
          .from('user_access')
          .select('id')
          .eq('payment_gateway', 'stripe')
          .eq('order_id', orderId)
          .maybeSingle();

        if (existingAccessError) {
          throw existingAccessError;
        }

        if (!existingAccess) {
          const { error: accessInsertError } = await supabaseAdmin.from('user_access').insert({
            customer_email: customerEmail,
            product_id: product?.id || productId,
            product_title: product?.title || 'المنتج',
            file_url: product?.file_url || null,
            order_id: orderId,
            payment_gateway: 'stripe',
          });

          if (accessInsertError) {
            throw accessInsertError;
          }
        }

        if (!existingOrder) {
          await sendWelcomeEmail(customerEmail, customerName || '', orderId);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}