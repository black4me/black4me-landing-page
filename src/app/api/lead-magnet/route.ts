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

    // Save to Supabase (Lead Magnets)
    const { data, error } = await supabase
      .from('lead_magnets')
      .insert({ email, name, magnet, created_at: new Date().toISOString() });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    // Upsert to subscribers table for marketing emails
    await supabase
      .from('subscribers')
      .upsert({ email, name, created_at: new Date().toISOString() }, { onConflict: 'email' });

    // Fetch site settings
    const { data: settingsData } = await supabase.from('site_settings').select('*');
    const settings = (settingsData || []).reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);

    // Attempt to send email via Resend if key exists
    if (process.env.RESEND_API_KEY) {
      const { render } = await import('@react-email/render');
      const UnifiedEmail = (await import('../../../emails/UnifiedEmail')).default;

      const htmlContent = await render(
        UnifiedEmail({
          userFirstname: name,
          type: 'gift',
          downloadLink: settings.lead_magnet_file_url ||
            'https://drive.google.com/drive/folders/14-SIzFYoOu7uIqs4qDNbQF-IrRlG8ker?usp=sharing',
          blogUrl: 'https://black4me.com/blog',
          newsletterUrl: 'https://black4me.com/#free-gift',
          instagramUrl: settings.social_instagram_url || 'https://www.instagram.com/black4mee/',
          logoUrl: settings.site_logo,
          authorPhotoUrl: settings.author_photo_url,
          authorName: settings.author_name || 'جاسم محمد',
        })
      );

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'جاسم محمد — BLACK4ME <noreply@black4me.com>',
          to: email,
          subject: `🎁 هديتك جاهزة يا ${name} — تحمّل الآن`,
          html: htmlContent
        })
      }).catch(err => console.error('Email send failed:', err));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead magnet error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
