import { NextResponse } from 'next/server';
import { render } from '@react-email/render';
import LeadMagnetEmail from '../../../emails/LeadMagnetEmail';

export async function GET() {
  const html = await render(
    LeadMagnetEmail({
      userFirstname: 'جاسم',
      downloadLink: 'https://example.com',
      emailSubject: '🎁 هديتك المجانية جاهزة',
      emailBody: 'شكراً لاهتمامك! لقد قمنا بتجهيز الهدية المجانية خصيصاً لك.',
      logoUrl: 'https://www.black4me.com/logo.png',
      instagramUrl: 'https://instagram.com/black4me',
      whatsappUrl: 'https://wa.me/123456789',
      supportEmail: 'hello@black4me.com'
    })
  );
  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
}
