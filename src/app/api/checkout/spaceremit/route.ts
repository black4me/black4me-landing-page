import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';

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
  try {
    const { productId, title, price, customerEmail, customerName, customerCountry, receiptUrl } = await req.json();

    if (!customerEmail || !receiptUrl) {
      return NextResponse.json({ error: 'Missing customer email or receipt URL' }, { status: 400 });
    }

    // 1. Check if user exists, create if not
    const { data: usersData, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) throw userError;
    
    let user = usersData.users.find(u => u.email === customerEmail);

    if (!user) {
      const tempPassword = generateSecurePassword();
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: customerEmail,
        password: tempPassword,
        email_confirm: true,
      });

      if (createError) throw createError;
      user = newUser.user;
    }

    // 2. Create the pending order record
    const { data: newOrder, error: orderError } = await supabaseAdmin.from('orders').insert({
      customer_name: customerName || null,
      customer_email: customerEmail,
      country: customerCountry || null,
      product_id: productId,
      amount: price,
      payment_gateway: 'spaceremit',
      status: 'pending_verification',
      receipt_url: receiptUrl
    }).select('id').single();

    if (orderError) {
      console.error('Error inserting order:', orderError);
      throw orderError;
    }

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error: any) {
    console.error('Spaceremit checkout error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
