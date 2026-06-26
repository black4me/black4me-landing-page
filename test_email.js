import { config } from 'dotenv';
import { Resend } from 'resend';

config({ path: '.env.local' });

const resend = new Resend(process.env.RESEND_API_KEY);

resend.emails.send({
  from: 'BLACK4ME <noreply@black4me.com>',
  to: 'jasstylesg1@gmail.com',
  subject: '✅ تم تأكيد طلبك - الدخول لنظام BLACK4ME',
  html: '<div dir="rtl"><h2>مرحباً نبراس محمد!</h2><p>تم تفعيل حسابك كـ مشترٍ جديد وتم إضافتك كـ مشترك.</p><p>رقم الطلب للتحقق: <strong>test-ord-12345</strong></p></div>'
}).then(res => {
  console.log('Email sent successfully:', res);
}).catch(err => {
  console.error('Failed to send email:', err);
});
