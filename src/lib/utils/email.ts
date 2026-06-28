import { Resend } from 'resend';
import { render } from '@react-email/render';
import WelcomeEmail from '../../emails/WelcomeEmail';
import React from 'react';

export const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_for_build');

interface SendWelcomeEmailParams {
  customerEmail: string;
  customerName?: string;
  downloadLink?: string | null;
}

/**
 * Sends a welcome email after successful purchase.
 * Shared across all payment webhooks and order approval.
 */
export async function sendWelcomeEmail({ customerEmail, customerName, downloadLink }: SendWelcomeEmailParams): Promise<boolean> {
  if (!process.env.RESEND_API_KEY || !customerEmail) {
    console.log('Skipping welcome email: no API key or email');
    return false;
  }

  try {
    const firstName = customerName || customerEmail.split('@')[0];
    const htmlContent = await render(
      React.createElement(WelcomeEmail, {
        userFirstname: firstName,
        downloadLink: downloadLink,
      } as any)
    );

    await resend.emails.send({
      from: 'BLACK4ME <noreply@black4me.com>',
      to: customerEmail,
      subject: 'شكرًا لطلبك من Black4me! 🎉',
      html: htmlContent,
    });

    console.log('Welcome email sent to', customerEmail);
    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}
