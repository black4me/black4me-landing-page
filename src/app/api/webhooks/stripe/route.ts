import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { sendWelcomeEmail, sendAdminNotificationEmail, sendReviewRequestEmail } from '../../../../server/actions/email';
import { Redis } from '@upstash/redis';
import { stripeWebhookSchema } from '../../../../server/validation/webhook.schema';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('Stripe-Signature');

  const { data: privateSettings } = await supabaseAdmin.from('private_settings').select('key, value');
  const settingsMap = privateSettings?.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};

  const stripeSecret = settingsMap['STRIPE_SECRET_KEY'] || process.env.STRIPE_SECRET_KEY;
  const webhookSecret = settingsMap['STRIPE_WEBHOOK_SECRET'] || process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret || !stripeSecret) {
    return NextResponse.json({ error: 'Missing signature, webhook secret, or stripe secret' }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2024-12-18.acacia' as any,
  });

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    // 1. Zod Strict Validation on Payload
    const parsedEvent = stripeWebhookSchema.parse(event);

    // 2. Drift Control (Reject events older than 5 minutes)
    const eventTimestamp = parsedEvent.created * 1000;
    const fiveMinutes = 5 * 60 * 1000;
    if (Date.now() - eventTimestamp > fiveMinutes) {
      console.warn(`[Drift Control] Rejected stale webhook ${parsedEvent.id}`);
      return NextResponse.json({ error: 'Webhook payload too old' }, { status: 400 });
    }

    // 3. Replay Protection (Idempotency via Redis)
    if (redis) {
      // SETNX: Only set if it does not exist. EX: Expire in 24 hours (86400 seconds)
      const lockAcquired = await redis.set(`webhook:${parsedEvent.id}`, 'processed', { nx: true, ex: 86400 });
      if (!lockAcquired) {
        console.log(`[Replay Protection] Webhook ${parsedEvent.id} already processed.`);
        return NextResponse.json({ received: true }); // Acknowledge safely to Stripe
      }
    }

    if (parsedEvent.type === 'checkout.session.completed') {
      const session = parsedEvent.data.object as any;

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
            product_title: product?.title || 'Unknown Product',
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
          await sendAdminNotificationEmail(orderId, customerEmail, customerName || '', (session.amount_total || 0) / 100, product?.title || 'Unknown Product');
          await sendReviewRequestEmail(customerEmail, customerName || '', 'product', orderId, product?.title || 'Unknown Product');
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      console.error('Webhook Validation Error:', err.errors);
      return NextResponse.json({ error: 'Payload validation failed' }, { status: 400 });
    }
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
