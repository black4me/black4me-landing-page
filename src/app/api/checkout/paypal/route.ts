import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

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

const generateAccessToken = async (clientId: string, secret: string, apiBase: string) => {
  if (!clientId || !secret) {
    throw new Error('PayPal credentials are not configured');
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const response = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || 'Failed to authenticate with PayPal');
  }

  return data.access_token;
};

export async function POST(req: Request) {
  try {
    const { data: privateSettings } = await supabaseAdmin.from('private_settings').select('key, value');
    const settingsMap = privateSettings?.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {}) || {};

    const paypalMode = settingsMap['PAYPAL_MODE'] || process.env.PAYPAL_MODE || 'live';
    const clientId = settingsMap['NEXT_PUBLIC_PAYPAL_CLIENT_ID'] || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = settingsMap['PAYPAL_SECRET'] || process.env.PAYPAL_SECRET;
    
    const PAYPAL_API_BASE = paypalMode === 'sandbox' 
      ? 'https://api-m.sandbox.paypal.com'
      : (process.env.NODE_ENV === 'production'
          ? 'https://api-m.paypal.com'
          : 'https://api-m.sandbox.paypal.com');

    if (!clientId || !secret) {
      return NextResponse.json({ error: 'PayPal credentials not configured' }, { status: 500 });
    }

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
      payment_gateway: 'paypal',
      currency: 'USD'
    }).select('id').single();

    if (orderInsertError || !internalOrder) {
      console.error('Failed to create pending order:', orderInsertError);
      return NextResponse.json({ error: 'Failed to initialize order' }, { status: 500 });
    }

    const priceString = finalPrice.toFixed(2);

    if (finalPrice <= 0) {
      return NextResponse.json({ error: 'Invalid checkout amount' }, { status: 400 });
    }

    const accessToken = await generateAccessToken(clientId, secret, PAYPAL_API_BASE);

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: priceString,
          },
          description: product.title,
          custom_id: JSON.stringify({
            internal_order_id: internalOrder.id,
            product_id: productId,
            customer_email: normalizedEmail,
            customer_name: customerName || '',
            coupon_code: appliedCouponCode || '',
            original_amount: basePrice.toFixed(2),
            discount_amount: discountAmount.toFixed(2),
            final_price: priceString,
          }),
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com'}/thankyou?paypal=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com'}/`,
      },
    };

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await response.json();

    if (!response.ok || !data.id) {
      console.error('PayPal Order Error Response:', data);
      throw new Error(data.message || 'Failed to create PayPal order');
    }

    // Link session to order
    await supabaseAdmin.from('orders').update({ receipt_url: data.id }).eq('id', internalOrder.id);

    if (data.id) {
      // Find the approve link
      const approveLink = data.links.find((link: any) => link.rel === 'approve');
      if (approveLink) {
        return NextResponse.json({ url: approveLink.href });
      }
    }

    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
  } catch (err: any) {
    console.error('PayPal Checkout Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
