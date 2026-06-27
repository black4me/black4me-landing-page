import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-admin';
import { sendPendingEmail } from '../../../../server/actions/email';
import { checkRateLimit, getClientIp } from '../../../../lib/rate-limiter';

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
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 });
    }

    const { productId, title, customerEmail, customerName, customerCountry, receiptUrl, couponCode } = await req.json();

    if (!customerEmail || !receiptUrl || !productId) {
      return NextResponse.json({ error: 'Missing customer email, receipt URL, or product ID' }, { status: 400 });
    }

    // SECURITY SHIELD: Fetch the true price from the database, DO NOT trust the client's price!
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('price, sale_price, is_active')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Invalid product or product inactive' }, { status: 400 });
    }

    let finalPrice = Number(product.sale_price ?? product.price);

    // Apply coupon if provided securely
    if (couponCode) {
      const normalizedCouponCode = typeof couponCode === 'string' ? couponCode.trim().toUpperCase() : '';
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('discount_percentage, is_active')
        .eq('code', normalizedCouponCode)
        .eq('is_active', true)
        .maybeSingle();

      if (coupon) {
        const discountPercent = Math.max(0, Math.min(100, Number(coupon.discount_percentage) || 0));
        finalPrice = Math.max(0, Number((finalPrice * (1 - discountPercent / 100)).toFixed(2)));
      }
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
      amount: finalPrice,
      payment_gateway: 'spaceremit',
      status: 'pending_verification',
      receipt_url: receiptUrl
    }).select('id').single();

    if (orderError) {
      console.error('Error inserting order:', orderError);
      throw orderError;
    }

    // Send pending notification email
    await sendPendingEmail(customerEmail, customerName || '', newOrder.id);

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch (error: any) {
    console.error('Spaceremit checkout error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
