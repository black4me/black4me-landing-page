import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

const PAYPAL_API_BASE = process.env.PAYPAL_MODE === 'sandbox' 
  ? 'https://api-m.sandbox.paypal.com'
  : (process.env.NODE_ENV === 'production'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com');

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

const generateAccessToken = async () => {
  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
    throw new Error('PayPal credentials are not configured');
  }

  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
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

    if (finalPrice <= 0) {
      return NextResponse.json({ error: 'Invalid checkout amount' }, { status: 400 });
    }

    const accessToken = await generateAccessToken();

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: finalPrice.toFixed(2),
          },
          description: product.title,
          custom_id: JSON.stringify({
            product_id: productId,
            customer_email: normalizedEmail,
            customer_name: customerName,
            customer_country: customerCountry,
            coupon_code: normalizedCouponCode,
            final_price: finalPrice.toFixed(2),
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

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to create PayPal order' }, { status: 502 });
    }

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
