import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { checkRateLimit, getClientIp } from '../../../../lib/rate-limiter';

// Initialize stripe carefully to prevent build-time crashes if env var is missing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2024-12-18.acacia' as any,
});

type CheckoutProduct = {
  id: string;
  title: string;
  price: number;
  sale_price: number | null;
  is_active: boolean;
};

type CouponRecord = {
  code: string;
  discount_percentage: number;
  is_active: boolean;
};

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { productId, customerEmail, customerName, customerCountry, couponCode } = body;

    if (!productId || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedEmail = String(customerEmail).trim().toLowerCase();
    const normalizedCouponCode = typeof couponCode === 'string' ? couponCode.trim().toUpperCase() : '';

    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, title, price, sale_price, is_active')
      .eq('id', productId)
      .eq('is_active', true)
      .single<CheckoutProduct>();

    if (productError || !product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    const basePrice = Number(product.sale_price ?? product.price);

    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      return NextResponse.json({ error: 'Invalid product price' }, { status: 400 });
    }

    let discountPercent = 0;

    if (normalizedCouponCode) {
      const { data: coupon, error: couponError } = await supabaseAdmin
        .from('coupons')
        .select('code, discount_percentage, is_active')
        .eq('code', normalizedCouponCode)
        .eq('is_active', true)
        .maybeSingle<CouponRecord>();

      if (couponError) {
        return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
      }

      if (!coupon) {
        return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
      }

      discountPercent = Math.max(0, Math.min(100, Number(coupon.discount_percentage) || 0));
    }

    const finalPrice = Math.max(0, Number((basePrice * (1 - discountPercent / 100)).toFixed(2)));
    const unitAmount = Math.round(finalPrice * 100);

    if (unitAmount <= 0) {
      return NextResponse.json({ error: 'Invalid checkout amount' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: normalizedEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // We'll use absolute URLs for redirects. In dev it's localhost, in prod it's the real domain.
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com'}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com'}/`,
      metadata: {
        product_id: productId, // CRITICAL: This is passed to the webhook
        customer_email: normalizedEmail,
        customer_name: customerName || '',
        customer_country: customerCountry || '',
        coupon_code: normalizedCouponCode,
        final_price: finalPrice.toFixed(2),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
