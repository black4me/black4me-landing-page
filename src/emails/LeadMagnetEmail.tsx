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
  Img,
  Row,
  Column,
  Hr
} from '@react-email/components';

interface LeadMagnetEmailProps {
  userFirstname: string;
  downloadLink?: string;
  emailSubject: string;
  emailBody: string;
  logoUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  supportEmail?: string;
}

export default function LeadMagnetEmail({
  userFirstname,
  downloadLink,
  emailSubject,
  emailBody,
  logoUrl,
  instagramUrl,
  whatsappUrl,
  supportEmail
}: LeadMagnetEmailProps) {
  // Use the provided logo URL or fallback to the standard one
  const finalLogoUrl = logoUrl || 'https://www.black4me.com/logo.png';

  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Body style={main}>
        <div style={wrapper}>
          <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img src={finalLogoUrl} alt="BLACK4ME" height="40" style={logo} />
          </Section>

          {/* Hero Icon */}
          <Section style={heroIconContainer}>
            <Text style={heroIcon}>🎁</Text>
          </Section>

          <Section style={contentSection}>
            <Heading style={h1}>
              {downloadLink ? `هديتك الحصرية بانتظارك يا ` : `مرحباً يا `}
              <span style={highlightName}>{userFirstname}</span>
            </Heading>

            <Hr style={divider} />

            <Section style={messageContainer}>
              <Text style={text}>
                {emailBody || 'النجاح ليس ضربة حظ، بل هو نتيجة لنظام تسويقي دقيق تبنيه اليوم ليقودك نحو الثراء غداً. لأننا في BLACK4ME نؤمن بأن مهاراتك تستحق أن تصل للعالم.'}
              </Text>
            </Section>

            {downloadLink && (
              <Section style={btnContainer}>
                <Link href={downloadLink} style={button}>
                  احصل على هديتك الآن 🚀
                </Link>
              </Section>
            )}

            <Section style={trustSection}>
              <Text style={trustText}>
                <span style={dot}>●</span> نضمن لك قيمة حقيقية وفورية
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Row>
              <Column align="center">
                <Row style={socialRow}>
                  {instagramUrl && (
                    <Column style={socialColumn}>
                      <Link href={instagramUrl}>
                        <Img src="https://img.icons8.com/ios-filled/50/a1a1aa/instagram-new.png" width="24" height="24" alt="Instagram" />
                      </Link>
                    </Column>
                  )}
                  {whatsappUrl && (
                    <Column style={socialColumn}>
                      <Link href={whatsappUrl}>
                        <Img src="https://img.icons8.com/ios-filled/50/a1a1aa/whatsapp--v1.png" width="24" height="24" alt="WhatsApp" />
                      </Link>
                    </Column>
                  )}
                  {supportEmail && (
                    <Column style={socialColumn}>
                      <Link href={`mailto:${supportEmail}`}>
                        <Img src="https://img.icons8.com/ios-filled/50/a1a1aa/email.png" width="24" height="24" alt="Email" />
                      </Link>
                    </Column>
                  )}
                </Row>
              </Column>
            </Row>
            
            <Text style={bottomFooterText}>
              © {new Date().getFullYear()} BLACK4ME. جميع الحقوق محفوظة.
            </Text>
          </Section>
        </Container>
        </div>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#000000',
  fontFamily: 'Tajawal, Cairo, "Helvetica Neue", Arial, sans-serif',
};

const wrapper = {
  backgroundColor: '#000000',
  padding: '60px 0',
  width: '100%',
};

const container = {
  backgroundColor: '#0a0a0a',
  margin: '0 auto',
  border: '1px solid #1f1f22',
  maxWidth: '560px',
  color: '#ffffff',
  textAlign: 'center' as const,
  direction: 'rtl' as const,
};

const header = {
  padding: '40px 20px',
  textAlign: 'center' as const,
  backgroundColor: '#000000',
  borderBottom: '1px solid #1f1f22',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const heroIconContainer = {
  textAlign: 'center' as const,
  paddingTop: '40px',
};

const heroIcon = {
  fontSize: '48px',
  margin: '0',
  lineHeight: '1',
  textShadow: '0 0 40px rgba(255,140,0,0.5)',
};

const contentSection = {
  padding: '20px 40px 40px',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 30px 0',
  lineHeight: '1.4',
};

const highlightName = {
  color: '#ff8c00', // Premium Orange
};

const divider = {
  borderColor: '#1f1f22',
  margin: '30px 0',
};

const messageContainer = {
  marginBottom: '40px',
};

const text = {
  color: '#a1a1aa', // Elegant light gray
  fontSize: '16px',
  lineHeight: '30px',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const button = {
  backgroundColor: '#ff8c00',
  borderRadius: '4px',
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 40px',
  letterSpacing: '0.5px',
};

const trustSection = {
  backgroundColor: '#111111',
  border: '1px solid #1f1f22',
  borderRadius: '4px',
  padding: '12px',
  display: 'inline-block',
};

const trustText = {
  color: '#a1a1aa',
  fontSize: '14px',
  margin: '0',
  display: 'inline-block',
};

const dot = {
  color: '#10b981', // Emerald Green
  marginRight: '6px',
};

const footerSection = {
  backgroundColor: '#050505',
  padding: '30px 40px',
  textAlign: 'center' as const,
  borderTop: '1px solid #1f1f22',
};

const socialRow = {
  display: 'inline-block',
  margin: '0 auto 20px',
};

const socialColumn = {
  padding: '0 12px',
  display: 'inline-block',
};

const bottomFooterText = {
  color: '#52525b', // Very dim gray
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: 0,
  letterSpacing: '1px',
};
