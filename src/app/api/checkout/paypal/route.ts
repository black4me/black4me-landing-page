import { NextResponse } from 'next/server';

const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const generateAccessToken = async () => {
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
  return data.access_token;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, title, price, customerEmail } = body;

    if (!productId || !title || !price || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const accessToken = await generateAccessToken();

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: price.toString(),
          },
          description: title,
          custom_id: JSON.stringify({ product_id: productId, customer_email: customerEmail }),
        },
      ],
      application_context: {
        return_url: `${req.headers.get('origin') || 'http://localhost:3000'}/thankyou?paypal=true`,
        cancel_url: `${req.headers.get('origin') || 'http://localhost:3000'}/`,
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
