import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase-admin';
import { Resend } from 'resend';
import WelcomeEmail from '../../../../../emails/WelcomeEmail';

const PAYPAL_API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

const generateAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: { Authorization: `Basic ${auth}` },
  });

  const data = await response.json();
  return data.access_token;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderID } = body;

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 });
    }

    const accessToken = await generateAccessToken();

    // Capture the order
    const captureResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await captureResponse.json();

    if (captureData.status === 'COMPLETED') {
      // Extract custom metadata we passed earlier
      const purchaseUnit = captureData.purchase_units[0];
      const customId = purchaseUnit.custom_id;
      let productId = '';
      let customerEmail = '';

      if (customId) {
        try {
          const parsed = JSON.parse(customId);
          productId = parsed.product_id;
          customerEmail = parsed.customer_email;
        } catch (e) {
          console.error("Failed to parse custom_id", customId);
        }
      }

      // Fallback email from PayPal payer
      if (!customerEmail && captureData.payer?.email_address) {
         customerEmail = captureData.payer.email_address;
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
        await supabaseAdmin.from('orders').insert({
          id: orderID,
          customer_email: customerEmail,
          product_id: productId || 'unknown',
          amount: amount,
          payment_gateway: 'paypal',
          status: 'completed',
        });

        // Add to subscribers
        await supabaseAdmin.from('subscribers').upsert(
          { email: customerEmail, name: captureData.payer?.name?.given_name || 'Customer' },
          { onConflict: 'email' }
        );

        // Fetch product to get file_url
        let fileUrl = null;
        let productTitle = 'Your Product';
        
        if (productId) {
           const { data: prod } = await supabaseAdmin.from('products').select('*').eq('id', productId).single();
           if (prod) {
             fileUrl = prod.file_url;
             productTitle = prod.title;
           }
        }

        // Send welcome email
        if (process.env.RESEND_API_KEY && customerEmail) {
          try {
            await resend.emails.send({
              from: 'Black4me <noreply@black4me.com>',
              to: [customerEmail],
              subject: 'شكرًا لطلبك من Black4me!',
              react: WelcomeEmail({ userFirstname: customerEmail.split('@')[0], downloadLink: fileUrl }) as React.ReactElement,
            });
          } catch (e) {
            console.error("Resend error:", e);
          }
        }
        
        return NextResponse.json({
          success: true,
          product: {
            title: productTitle,
            file_url: fileUrl
          }
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Capture failed or not completed' }, { status: 400 });

  } catch (err: any) {
    console.error('PayPal Capture Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
