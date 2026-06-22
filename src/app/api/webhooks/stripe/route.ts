import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from '../../../../emails/WelcomeEmail';
import React from 'react';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
  apiVersion: '2024-12-18.acacia' as any,
});

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

// We need the SERVICE ROLE KEY to bypass RLS and create users safely from the backend.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper to generate a random secure password
const generateSecurePassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve metadata we passed during checkout
    const customerEmail = session.metadata?.customer_email || session.customer_details?.email;
    const productId = session.metadata?.product_id;
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    if (!customerEmail || !productId) {
      console.error('Missing essential metadata in session:', session.id);
      return new NextResponse('Webhook handler failed: Missing metadata', { status: 400 });
    }

    try {
      // 1. Check if user exists in Supabase
      const { data: usersData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
      if (userError) throw userError;
      
      let user = usersData.users.find(u => u.email === customerEmail);
      let tempPassword = '';
      let isNewUser = false;

      // 2. If user doesn't exist, create a new one! (Frictionless Onboarding)
      if (!user) {
        tempPassword = generateSecurePassword();
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: customerEmail,
          password: tempPassword,
          email_confirm: true, // Auto confirm so they can login immediately
        });

        if (createError) throw createError;
        user = newUser.user;
        isNewUser = true;

        // Optionally, insert into users_profiles table if you have one
        /*
        await supabaseAdmin.from('users_profiles').insert({
          id: user.id,
          role: 'customer',
          email: customerEmail,
        });
        */
      }

      // 3. Create order record linking user and product
      const { error: orderError } = await supabaseAdmin.from('orders').insert({
        customer_email: customerEmail, // Or customer_id if your schema uses UUID
        product_id: productId,
        amount: amountTotal,
        payment_gateway: 'stripe',
        status: 'completed',
      });

      if (orderError) throw orderError;

      // 4. Send Welcome Email via Resend if it's a new user
      if (isNewUser && process.env.RESEND_API_KEY) {
        try {
          const htmlContent = await render(
            React.createElement(WelcomeEmail, {
              email: customerEmail,
              tempPassword: tempPassword,
            })
          );
          
          await resend.emails.send({
            from: 'BLACK4ME <noreply@black4me.com>', // Update this to your verified Resend domain
            to: customerEmail,
            subject: 'أهلاً بك في منصة BLACK4ME - تفاصيل الدخول',
            html: htmlContent,
          });
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // We don't throw here to avoid failing the webhook response if email fails
        }
      }

      console.log(`Successfully processed order for ${customerEmail}`);
    } catch (err: any) {
      console.error('Error processing webhook logic:', err);
      return new NextResponse(`Error processing webhook: ${err.message}`, { status: 500 });
    }
  }

  return new NextResponse('Webhook processed successfully', { status: 200 });
}
