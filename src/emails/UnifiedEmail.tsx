import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Heading,
  Hr,
  Row,
  Column,
  Img
} from '@react-email/components';

interface UnifiedEmailProps {
  userFirstname: string;
  type: 'purchase' | 'gift'; // purchase = bought product, gift = free lead magnet
  downloadLink?: string;
  productTitle?: string;
  blogUrl?: string;
  newsletterUrl?: string;
  instagramUrl?: string;
  logoUrl?: string;
  authorPhotoUrl?: string;  // Profile photo of the sender (like Khalid's email)
  authorName?: string;       // Display name of the sender
  customerEmail?: string;
  tempPassword?: string;
  discountCode?: string;
}

export default function UnifiedEmail({
  userFirstname,
  type,
  downloadLink,
  productTitle,
  blogUrl = 'https://black4me.com/blog',
  newsletterUrl = 'https://black4me.com/#free-gift',
  instagramUrl = 'https://www.instagram.com/black4mee/',
  logoUrl,
  authorPhotoUrl,
  authorName = 'جاسم محمد',
  customerEmail,
  tempPassword = '12345678', // Default temp password if not provided
  discountCode,
}: UnifiedEmailProps) {
  const isPurchase = type === 'purchase';

  const heroTitle = isPurchase
    ? `طلبك تم بنجاح يا ${userFirstname} 🔥`
    : `هديتك جاهزة يا ${userFirstname} 🎁`;
  const heroPara = isPurchase
    ? `ما وصلتلك هذي الرسالة إلا لأن عندك عقلية مختلفة. قررت تستثمر في نفسك — وهذا القرار راح يغير مسارك.`
    : `أنت الآن جزء من مجتمع يبني ثروته بالتسويق الذكي. الهدية في انتظارك — خطوة واحدة وتكون في المقدمة.`;

  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Body style={main}>
        <div style={wrapper}>
          <Container style={container}>

            {/* ── Author Profile Header (like Khalid's email) ── */}
            <Section style={profileHeader}>
              {authorPhotoUrl ? (
                <Img
                  src={authorPhotoUrl}
                  alt={authorName}
                  width="72"
                  height="72"
                  style={profileImg}
                />
              ) : (
                <div style={profilePlaceholder}>
                  <Text style={profileInitial}>
                    {authorName ? authorName.charAt(0) : 'ج'}
                  </Text>
                </div>
              )}
              <Text style={profileName}>{authorName}</Text>
              <Text style={profileHandle}>BLACK4ME — نظام التسويق الذكي</Text>
            </Section>

            <Hr style={divider} />

            {/* ── Hero Section ── */}
            <Section style={heroSection}>
              <Heading style={h1}>{heroTitle}</Heading>
              <Text style={heroParagraph}>{heroPara}</Text>
            </Section>

            <Hr style={divider} />

            {/* 🎁 Download Button 🎁 */}
            {downloadLink && (
              <Section style={btnSection}>
                <Link href={downloadLink} style={primaryBtn}>
                  {isPurchase ? '📥 تحميل الكتاب الآن' : '🎁 تنزيل الهدية المجانية'}
                </Link>
              </Section>
            )}

            {discountCode && (
              <Section style={{ textAlign: 'center', margin: '20px 0', backgroundColor: '#fffbe6', padding: '15px', borderRadius: '8px', border: '1px dashed #f59e0b' }}>
                <Heading style={{ color: '#d97706', fontSize: '18px', margin: '0 0 10px' }}>كود خصم خاص بك!</Heading>
                <Text style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 5px' }}>
                  استخدم هذا الكود عند الدفع للحصول على خصم 10%:
                </Text>
                <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#b45309', margin: '0' }}>
                  {discountCode}
                </Text>
              </Section>
            )}

            {isPurchase && (
              <Section style={academySection}>
                <Heading style={academyTitle}>🎓 حسابك في المنصة التعليمية:</Heading>
                <Text style={academyText}>
                  تم إنشاء حساب لك للوصول إلى كافة المواد التعليمية المرفقة مع الكتاب.
                </Text>
                <Link href="https://marketing-academy-liard.vercel.app/login" style={academyLink}>
                  دخول الأكاديمية
                </Link>
                <div style={credentialsBox}>
                  <Text style={credentialItem}>
                    <strong>البريد:</strong> {customerEmail || '[إيميل العميل]'}
                  </Text>
                  <Text style={credentialItem}>
                    <strong>كلمة المرور:</strong> {tempPassword || '[كلمة المرور المؤقتة]'}
                  </Text>
                </div>
              </Section>
            )}

            <Hr style={divider} />

            {/* ── Newsletter CTA ── */}
            <Section style={ctaBox}>
              <Text style={ctaIcon}>✉️</Text>
              <Heading style={ctaTitle}>اشترك في نشرتي البريدية اليومية</Heading>
              <Text style={ctaBody}>
                كل يوم أشاركك إستراتيجية تسويقية عملية، قصة نجاح، أو نظام مجرّب يساعدك على بناء برند يدفع لك — حتى وأنت نايم.
                نشرة خاصة، مجانية، لمجتمع BLACK4ME فقط.
              </Text>
              <Section style={btnSection}>
                <Link href={newsletterUrl} style={secondaryBtn}>
                  🖊 اشترك مجاناً الآن
                </Link>
              </Section>
            </Section>

            <Hr style={divider} />

            {/* ── Blog CTA ── */}
            <Section style={blogBox}>
              <Row>
                <Column style={{ paddingLeft: '20px' }}>
                  <Text style={blogLabel}>📖 آخر المقالات والتحليلات</Text>
                  <Text style={blogDesc}>
                    مقالات أسبوعية عميقة عن التسويق، بناء البراند الشخصي، والبيع بدون متاعب.
                    مكان واحد لكل ما تحتاجه لتبني امبراطوريتك.
                  </Text>
                  <Link href={blogUrl} style={blogLink}>
                    اقرأ المقالات ←
                  </Link>
                </Column>
              </Row>
            </Section>

            <Hr style={divider} />

            {/* ── Instagram Follow CTA ── */}
            <Section style={igSection}>
              <Text style={igText}>
                تابعني يومياً على انستغرام للاستراتيجيات الحصرية والقصص المحفزة.
              </Text>
              <Link href={instagramUrl} style={igBtn}>
                📸 تابع @black4mee على انستغرام
              </Link>
            </Section>

            {/* ── Footer ── */}
            <Section style={footerSection}>
              <Text style={footerText}>
                © {new Date().getFullYear()} BLACK4ME. جميع الحقوق محفوظة.
              </Text>
              <Text style={footerSmall}>
                وصلتك هذي الرسالة لأنك سجلت على black4me.com.{' '}
                <Link href="https://black4me.com" style={{ color: '#555' }}>إلغاء الاشتراك</Link>
              </Text>
            </Section>

          </Container>
        </div>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const main = {
  backgroundColor: '#000000',
  fontFamily: 'Tajawal, Cairo, "Helvetica Neue", Arial, sans-serif',
};

const wrapper = {
  backgroundColor: '#000',
  padding: '48px 0',
};

const container = {
  backgroundColor: '#0a0a0a',
  border: '1px solid #1c1c1f',
  maxWidth: '580px',
  margin: '0 auto',
  color: '#fff',
  textAlign: 'center' as const,
  direction: 'rtl' as const,
  borderRadius: '8px',
  overflow: 'hidden',
};

// ── Profile header (sender photo like Khalid) ──
const profileHeader = {
  backgroundColor: '#050505',
  padding: '32px 32px 24px',
  textAlign: 'center' as const,
};

const profileImg = {
  display: 'block',
  margin: '0 auto 12px',
  borderRadius: '50%',
  border: '2px solid #ff8c00',
  objectFit: 'cover' as const,
};

const profilePlaceholder = {
  width: '72px',
  height: '72px',
  borderRadius: '50%',
  backgroundColor: '#ff8c00',
  margin: '0 auto 12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const profileInitial = {
  fontSize: '28px',
  fontWeight: '800',
  color: '#000',
  margin: '0',
  lineHeight: '72px',
};

const profileName = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 4px',
  textAlign: 'center' as const,
};

const profileHandle = {
  color: '#71717a',
  fontSize: '12px',
  margin: '0',
  textAlign: 'center' as const,
};

const heroSection = {
  padding: '32px 40px 20px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: '800',
  textAlign: 'center' as const,
  margin: '0 0 16px',
  lineHeight: '1.4',
};

const heroParagraph = {
  color: '#a1a1aa',
  fontSize: '15px',
  lineHeight: '28px',
  textAlign: 'center' as const,
  margin: '0',
};

const divider = {
  borderColor: '#1c1c1f',
  margin: '0',
};

const btnSection = {
  textAlign: 'center' as const,
  padding: '24px 40px',
};

const primaryBtn = {
  backgroundColor: '#ff8c00',
  color: '#000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  padding: '14px 36px',
  borderRadius: '4px',
};

const ctaBox = {
  padding: '32px 40px',
  backgroundColor: '#0f0f12',
  textAlign: 'center' as const,
};

const ctaIcon = {
  fontSize: '28px',
  margin: '0 0 8px',
};

const ctaTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '800',
  margin: '0 0 12px',
};

const ctaBody = {
  color: '#71717a',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 24px',
};

const secondaryBtn = {
  backgroundColor: 'transparent',
  border: '1px solid #ceae88',
  color: '#ceae88',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'inline-block',
  padding: '12px 32px',
  borderRadius: '4px',
};

const blogBox = {
  padding: '28px 40px',
  textAlign: 'right' as const,
};

const blogLabel = {
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700',
  margin: '0 0 8px',
};

const blogDesc = {
  color: '#71717a',
  fontSize: '13px',
  lineHeight: '22px',
  margin: '0 0 12px',
};

const blogLink = {
  color: '#ff8c00',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
};

const igSection = {
  padding: '24px 40px',
  textAlign: 'center' as const,
};

const igText = {
  color: '#71717a',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 12px',
};

const igBtn = {
  color: '#e1e1e1',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  border: '1px solid #333',
  padding: '10px 24px',
  borderRadius: '4px',
  display: 'inline-block',
};

const footerSection = {
  backgroundColor: '#050505',
  padding: '20px 40px 28px',
  textAlign: 'center' as const,
  borderTop: '1px solid #1c1c1f',
};

const footerText = {
  color: '#3f3f46',
  fontSize: '12px',
  margin: '0 0 4px',
};

const footerSmall = {
  color: '#3f3f46',
  fontSize: '11px',
  margin: '0',
};

const academySection = {
  padding: '24px 40px',
  backgroundColor: '#0a0a0a',
  textAlign: 'right' as const,
  borderTop: '1px solid #1c1c1f',
};

const academyTitle = {
  color: '#ff8c00',
  fontSize: '18px',
  fontWeight: '800',
  margin: '0 0 12px',
};

const academyText = {
  color: '#a1a1aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const academyLink = {
  color: '#fff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  backgroundColor: '#1f1f22',
  padding: '10px 20px',
  borderRadius: '4px',
  display: 'inline-block',
  border: '1px solid #3f3f46',
  margin: '0 0 16px',
};

const credentialsBox = {
  backgroundColor: '#111',
  padding: '16px',
  borderRadius: '6px',
  border: '1px dashed #3f3f46',
};

const credentialItem = {
  color: '#e1e1e1',
  fontSize: '14px',
  margin: '0 0 8px',
  fontFamily: 'monospace',
};
