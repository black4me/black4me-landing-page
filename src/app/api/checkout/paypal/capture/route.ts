import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase-admin';
import { sendWelcomeEmail } from '../../../../../server/actions/email';

const generateAccessToken = async (clientId: string, secret: string, apiBase: string) => {
  if (!clientId || !secret) {
    throw new Error('PayPal credentials are not configured');
  }

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const response = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: { Authorization: `Basic ${auth}` },
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
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 });
    }

    const accessToken = await generateAccessToken(clientId, secret, PAYPAL_API_BASE);

    // Capture the order
    const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureResponse.json();

    if (!captureResponse.ok) {
      return NextResponse.json({ error: captureData.message || 'PayPal capture failed' }, { status: 502 });
    }

    if (captureData.status === 'COMPLETED') {
      // Extract custom metadata we passed earlier
      const purchaseUnit = captureData.purchase_units[0];
      const customId = purchaseUnit.custom_id;
      let productId = '';
      let customerEmail = '';
      let customerName = '';

      if (customId) {
        try {
          const parsed = JSON.parse(customId);
          productId = parsed.product_id;
          customerEmail = parsed.customer_email;
          customerName = parsed.customer_name || '';
        } catch (e) {
          console.error("Failed to parse custom_id", customId);
        }
      }

      // Fallback email from PayPal payer
      if (!customerEmail && captureData.payer?.email_address) {
         customerEmail = captureData.payer.email_address;
      }

      if (!customerName) {
        customerName = captureData.payer?.name?.given_name || '';
      }

      if (!customerEmail || !productId) {
        return NextResponse.json({ error: 'Missing PayPal order metadata' }, { status: 400 });
      }

      const amount = Number(purchaseUnit.payments.captures[0].amount.value);

      // Check if order already exists (idempotency)
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('id', orderID)
        .single();

      if (!existingOrder) {
        // Save to Supabase
        const { error: orderInsertError } = await supabaseAdmin.from('orders').insert({
          id: orderID,
          customer_email: customerEmail,
          customer_name: customerName,
          product_id: productId || 'unknown',
          amount: amount,
          payment_gateway: 'paypal',
          status: 'completed',
        });

        if (orderInsertError) {
          throw orderInsertError;
        }

        // Add to subscribers
        const { error: subscriberError } = await supabaseAdmin.from('subscribers').upsert(
          { email: customerEmail, name: captureData.payer?.name?.given_name || 'Customer' },
          { onConflict: 'email' }
        );

        if (subscriberError) {
          console.error('Failed to upsert subscriber:', subscriberError);
        }

        // Fetch product to get file_url and title
        let fileUrl = null;
        let productTitle = 'المنتج';
        let productDbId = productId;

        if (productId) {
          const { data: prod } = await supabaseAdmin
            .from('products')
            .select('id, title, file_url')
            .eq('id', productId)
            .single();
          if (prod) {
            fileUrl = prod.file_url;
            productTitle = prod.title;
            productDbId = prod.id;
          }
        }

        // Grant full access to the purchased product
        const { error: accessError } = await supabaseAdmin.from('user_access').insert({
          customer_email: customerEmail,
          product_id: productDbId,
          product_title: productTitle,
          file_url: fileUrl,
          order_id: orderID,
          payment_gateway: 'paypal',
        });

        if (accessError) {
          throw accessError;
        }

        // Send welcome email using unified function
        if (customerEmail) {
          await sendWelcomeEmail(customerEmail, customerName || '', orderID);
        }

        return NextResponse.json({
          success: true,
          product: {
            title: productTitle,
            file_url: fileUrl,
          }
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Capture failed or not completed' }, { status: 400 });

  } catch (err: any) {
    console.error('PayPal Capture Error:', err);
    return NextResponse.json({ error: 'Internal server error during PayPal capture.' }, { status: 500 });
  }
}
