const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const emailHtml = `
  <div dir="rtl" style="background-color: #000; padding: 48px 0; font-family: Tajawal, sans-serif; text-align: center; color: white;">
    <img src="https://rgfiszmnxktetnahufpm.supabase.co/storage/v1/object/public/products/author_photo_1784344185972.png" width="72" height="72" style="border-radius: 50%; border: 2px solid #ff8c00;" />
    <h3 style="color: white;">جاسم محمد</h3>
    <h1 style="color: white;">هديتك جاهزة يا نبراس 🎁</h1>
    <p>تم الإصلاح بنجاح! الصورة الآن تظهر بشكل صحيح في الإيميل.</p>
  </div>
`;

fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'جاسم محمد — BLACK4ME <noreply@black4me.com>',
    to: 'jasstylesg1@gmail.com',
    subject: '✅ Email Profile Image Fix Report - Test',
    html: emailHtml
  })
}).then(res => res.json()).then(console.log).catch(console.error);
