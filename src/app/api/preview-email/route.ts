import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import LeadMagnetEmail from '../../../emails/LeadMagnetEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET() {
  const html = await render(
    LeadMagnetEmail({
      userFirstname: 'جاسم',
      downloadLink: 'https://example.com',
      emailSubject: '🎁 هديتك المجانية جاهزة',
      emailBody: 'شكراً لاهتمامك! لقد قمنا بتجهيز الهدية المجانية خصيصاً لك.',
      logoUrl: 'https://www.black4me.com/logo.png',
      instagramUrl: 'https://www.instagram.com/black4mee/',
      whatsappUrl: 'https://wa.me/123456789',
      supportEmail: 'hello@black4me.com'
    })
  );
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}

export async function POST(req: Request) {
  try {
    const { email, subject, body, name } = await req.json();

    if (!email || !body) {
      return NextResponse.json({ error: 'البريد الإلكتروني والمحتوى مطلوبان' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'مفتاح Resend غير مهيأ' }, { status: 500 });
    }

    // Dynamic variables replacement for preview mode
    const firstName = (name || '').split(' ')[0] || 'صديقنا';
    const personalizedSubject = (subject || 'معاينة حملة بريدية')
      .replace(/{{name}}/g, name || 'صديقنا المميز')
      .replace(/{{first_name}}/g, firstName)
      .replace(/{{email}}/g, email)
      .replace(/{{offer_name}}/g, 'برنامج BLACK4ME التجريبي')
      .replace(/{{discount_code}}/g, 'BLACKTEST')
      .replace(/{{consultation_link}}/g, 'https://black4me.com/#consultation')
      .replace(/{{instagram_handle}}/g, '@black4mee');

    const personalizedHtml = body
      .replace(/{{name}}/g, name || 'صديقنا المميز')
      .replace(/{{first_name}}/g, firstName)
      .replace(/{{email}}/g, email)
      .replace(/{{offer_name}}/g, 'برنامج BLACK4ME التجريبي')
      .replace(/{{discount_code}}/g, 'BLACKTEST')
      .replace(/{{consultation_link}}/g, 'https://black4me.com/#consultation')
      .replace(/{{instagram_handle}}/g, '@black4mee');

    const res = await resend.emails.send({
      from: 'جاسم محمد — BLACK4ME <noreply@black4me.com>',
      to: email,
      subject: personalizedSubject,
      html: personalizedHtml,
    });

    if (res.error) {
      throw new Error(res.error.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Test email error:', err);
    return NextResponse.json({ error: err.message || 'فشل إرسال البريد التجريبي' }, { status: 500 });
  }
}
