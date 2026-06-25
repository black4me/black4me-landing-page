"use server";

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2024-12-18.acacia' as any,
});

export async function createCheckoutSession(payload: {
  productId: string;
  title: string;
  price: number;
  email: string;
  name?: string;
  country?: string;
}) {
  try {
    const unitAmount = Math.round(Number(payload.price) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: payload.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: payload.title,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com'}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.black4me.com'}/`,
      metadata: {
        product_id: payload.productId,
        customer_email: payload.email,
        customer_name: payload.name || '',
        customer_country: payload.country || '',
      },
    });

    return { success: true, sessionId: session.id, url: session.url };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return { success: false, error: error.message };
  }
}
