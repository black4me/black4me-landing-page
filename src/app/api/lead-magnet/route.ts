import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, name, magnet } = await req.json();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Save to Supabase
    const { data, error } = await supabase
      .from('lead_magnets')
      .insert({ email, name, magnet, created_at: new Date().toISOString() });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    // Attempt to send email via Resend if key exists
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'BLACK4ME <hello@black4me.com>',
          to: email,
          subject: '🎁 هديتك المجانية جاهزة',
          html: `<h1>مرحباً ${name}!</h1><p>حمّل نموذج صفحة الهبوط من هنا: <a href="https://www.black4me.com/magnet-download">رابط التحميل</a></p>`
        })
      }).catch(err => console.error('Email send failed:', err));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead magnet error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
