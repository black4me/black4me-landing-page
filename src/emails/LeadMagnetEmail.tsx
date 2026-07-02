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
  Img,
  Row,
  Column
} from '@react-email/components';

interface LeadMagnetEmailProps {
  userFirstname: string;
  downloadLink: string;
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
  // Replace newlines with <br /> for HTML formatting
  const formattedBody = emailBody.replace(/\n/g, '<br />');

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            {logoUrl ? (
              <Img src={logoUrl} alt="BLACK4ME Logo" width="140" style={logo} />
            ) : (
              <Heading style={logoText}>BLACK4ME</Heading>
            )}
          </Section>

          <Section style={contentSection}>
            <Heading style={h1}>{emailSubject}</Heading>
            
            <Text style={greeting}>
              أهلاً بك يا بطل <span style={highlightRed}>{userFirstname}</span>،
            </Text>

            <Text style={text} dangerouslySetInnerHTML={{ __html: formattedBody }} />

            <Section style={quoteSection}>
              <Text style={quoteText}>
                "النجاح الحقيقي يبدأ عندما تتوقف عن الاستهلاك، وتبدأ في الاستثمار في عقلك وأدواتك."
              </Text>
            </Section>

            <Section style={btnContainer}>
              <Link href={downloadLink} style={button}>
                تحميل هديتك المجانية الآن 🚀
              </Link>
            </Section>

            <Text style={successMessage}>
              <span style={highlightGreen}>●</span> نضمن لك قيمة حقيقية في هذه الهدية.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              استمر في رحلة صعودك، وكن جزءاً من مجتمعنا النخبوي:
            </Text>

            <Row style={{ marginTop: '20px' }}>
              {instagramUrl && (
                <Column align="center" style={socialColumn}>
                  <Link href={instagramUrl} style={socialLink}>
                    <Img src="https://img.icons8.com/fluent/48/000000/instagram-new.png" width="36" height="36" alt="Instagram" />
                    <Text style={socialText}>انستجرام</Text>
                  </Link>
                </Column>
              )}
              {whatsappUrl && (
                <Column align="center" style={socialColumn}>
                  <Link href={whatsappUrl} style={socialLink}>
                    <Img src="https://img.icons8.com/color/48/000000/whatsapp--v1.png" width="36" height="36" alt="WhatsApp" />
                    <Text style={socialText}>واتساب</Text>
                  </Link>
                </Column>
              )}
              {supportEmail && (
                <Column align="center" style={socialColumn}>
                  <Link href={`mailto:${supportEmail}`} style={socialLink}>
                    <Img src="https://img.icons8.com/color/48/000000/circled-envelope.png" width="36" height="36" alt="Email" />
                    <Text style={socialText}>فريق الدعم</Text>
                  </Link>
                </Column>
              )}
            </Row>
          </Section>
          
          <Section style={bottomFooter}>
            <Text style={bottomFooterText}>
              © {new Date().getFullYear()} BLACK4ME. جميع الحقوق محفوظة.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#050505',
  fontFamily: 'Tajawal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 0',
};

const container = {
  backgroundColor: '#111111',
  margin: '0 auto',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid #222222',
  maxWidth: '600px',
  boxShadow: '0 4px 24px rgba(108, 59, 255, 0.1)', // Subtle purple glow
};

const header = {
  backgroundColor: '#0a0a0a',
  padding: '30px 20px',
  textAlign: 'center' as const,
  borderBottom: '2px solid #6C3BFF', // Purple accent
};

const logo = {
  margin: '0 auto',
};

const logoText = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  margin: '0',
  textAlign: 'center' as const,
};

const contentSection = {
  padding: '40px 30px',
  textAlign: 'center' as const,
  direction: 'rtl' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const greeting = {
  color: '#e0e0e0',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  marginBottom: '16px',
};

const text = {
  color: '#b0b0b0',
  fontSize: '16px',
  lineHeight: '28px',
  textAlign: 'right' as const,
  marginBottom: '32px',
};

const quoteSection = {
  backgroundColor: '#1a1a1a',
  padding: '20px',
  borderRadius: '8px',
  borderRight: '4px solid #E53935', // Red accent
  marginBottom: '32px',
};

const quoteText = {
  color: '#ffffff',
  fontSize: '16px',
  fontStyle: 'italic',
  textAlign: 'center' as const,
  margin: 0,
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '10px',
  marginBottom: '20px',
};

const button = {
  backgroundColor: '#F5C542', // Orange/Gold
  borderRadius: '8px',
  color: '#000000',
  fontSize: '18px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  boxShadow: '0 4px 14px rgba(245, 197, 66, 0.4)',
};

const successMessage = {
  color: '#888888',
  fontSize: '14px',
  textAlign: 'center' as const,
  marginTop: '20px',
};

const hr = {
  borderColor: '#222222',
  margin: '0',
};

const footerSection = {
  backgroundColor: '#0a0a0a',
  padding: '40px 30px',
  direction: 'rtl' as const,
};

const footerText = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const socialColumn = {
  padding: '0 10px',
};

const socialLink = {
  textDecoration: 'none',
  display: 'inline-block',
};

const socialText = {
  color: '#888888',
  fontSize: '12px',
  marginTop: '8px',
  textAlign: 'center' as const,
};

const bottomFooter = {
  backgroundColor: '#050505',
  padding: '16px',
};

const bottomFooterText = {
  color: '#555555',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: 0,
};

const highlightRed = { color: '#E53935' };
const highlightGreen = { color: '#00C853' };
