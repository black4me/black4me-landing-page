import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { checkRateLimit, getClientIp } from '../../../../lib/rate-limiter';

// We will initialize stripe inside the POST handler dynamically

type CheckoutProduct = {
  id: string;
  title: string;
  price: number;
  sale_price: number | null;
  is_active: boolean;
};

type CouponRecord = {
  id: string;
  code: string;
  discount_percentage: number;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  product_id?: string | null;
  expiry_date?: string | null;
  max_uses?: number | null;
  used_count?: number;
  is_active: boolean;
};

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
    }

    const { data: privateSettings } = await supabaseAdmin.from('private_settings').select('key, value');
    const settingsMap = privateSettings?.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {}) || {};
    
    const stripeSecret = settingsMap['STRIPE_SECRET_KEY'] || process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecret) {
      return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2024-12-18.acacia' as any,
    });

    const body = await req.json();
    const { productId, customerEmail, customerName, customerCountry, couponCode } = body;

    if (!productId || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedEmail = String(customerEmail).trim().toLowerCase();
    const normalizedCouponCode = typeof couponCode === 'string' ? couponCode.trim().toUpperCase() : '';


    const { data: dbProduct, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, title, price, sale_price, is_active')
      .eq('id', productId)
      .eq('is_active', true)
      .single<CheckoutProduct>();
      
    let product: CheckoutProduct | null = (!productError && dbProduct) ? dbProduct : null;

    if (!product) {
      return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
    }

    const basePrice = Number(product.sale_price ?? product.price);

    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      return NextResponse.json({ error: 'Invalid product price' }, { status: 400 });
    }

    let discountAmount = 0;
    let appliedCouponCode = null;
    let appliedDiscountType = null;
    let appliedDiscountValue = null;

    if (normalizedCouponCode) {
      const { data: coupon, error: couponError } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', normalizedCouponCode)
        .eq('is_active', true)
        .maybeSingle<CouponRecord>();

      if (couponError) {
        return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
      }

      if (coupon) {
        let valid = true;
        if (coupon.product_id && coupon.product_id !== productId) valid = false;
        if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) valid = false;
        if (coupon.max_uses && (coupon.used_count || 0) >= coupon.max_uses) valid = false;

        if (valid) {
          appliedCouponCode = coupon.code;
          appliedDiscountType = coupon.discount_type || 'percentage';
          appliedDiscountValue = coupon.discount_value !== undefined && coupon.discount_value !== null ? coupon.discount_value : coupon.discount_percentage;

          if (appliedDiscountType === 'percentage') {
            discountAmount = basePrice * (appliedDiscountValue / 100);
          } else if (appliedDiscountType === 'fixed') {
            discountAmount = appliedDiscountValue;
          }
        }
      }
    }

    let finalPrice = basePrice - discountAmount;
    if (finalPrice < 0) finalPrice = 0;
    
    // Create pending internal order
    const { data: internalOrder, error: orderInsertError } = await supabaseAdmin.from('orders').insert({
      customer_email: normalizedEmail,
      customer_name: customerName || '',
      product_id: productId,
      amount: finalPrice,
      original_amount: basePrice,
      discount_amount: discountAmount,
      final_amount: finalPrice,
      coupon_code: appliedCouponCode,
      discount_type: appliedDiscountType,
      discount_value: appliedDiscountValue,
      status: 'pending',
      payment_gateway: 'stripe',
      currency: 'USD'
    }).select('id').single();

    if (orderInsertError || !internalOrder) {
      console.error('Failed to create pending order:', orderInsertError);
      return NextResponse.json({ error: 'Failed to initialize order' }, { status: 500 });
    }

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
        internal_order_id: internalOrder.id,
        product_id: productId,
        customer_email: normalizedEmail,
        customer_name: customerName || '',
        customer_country: customerCountry || '',
        coupon_code: appliedCouponCode || '',
        original_amount: basePrice.toFixed(2),
        discount_amount: discountAmount.toFixed(2),
        final_price: finalPrice.toFixed(2),
      },
    });

    // Link session to order
    await supabaseAdmin.from('orders').update({ receipt_url: session.id }).eq('id', internalOrder.id);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
