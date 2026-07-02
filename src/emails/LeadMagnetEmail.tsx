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
          {logoUrl && (
            <Section style={logoContainer}>
              <Img src={logoUrl} alt="Logo" width="120" style={logo} />
            </Section>
          )}

          <Heading style={h1}>{emailSubject}</Heading>
          
          <Text style={text}>
            أهلاً يا بطل {userFirstname}،
          </Text>

          <Text style={text} dangerouslySetInnerHTML={{ __html: formattedBody }} />

          <Section style={btnContainer}>
            <Link href={downloadLink} style={button}>
              تحميل الهدية المجانية 🎁
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            دعنا نبقى على تواصل! تابعنا على:
          </Text>

          <Section style={socialSection}>
            <Row>
              {instagramUrl && (
                <Column align="center" style={socialColumn}>
                  <Link href={instagramUrl} style={socialLink}>انستجرام</Link>
                </Column>
              )}
              {whatsappUrl && (
                <Column align="center" style={socialColumn}>
                  <Link href={whatsappUrl} style={socialLink}>واتساب</Link>
                </Column>
              )}
              {supportEmail && (
                <Column align="center" style={socialColumn}>
                  <Link href={`mailto:${supportEmail}`} style={socialLink}>تواصل معنا</Link>
                </Column>
              )}
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid #eaeaea',
};

const logoContainer = {
  backgroundColor: '#0a0a0a',
  padding: '30px',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  padding: '20px 30px',
  direction: 'rtl' as const,
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'right' as const,
  padding: '0 40px',
  direction: 'rtl' as const,
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
  marginBottom: '32px',
};

const button = {
  backgroundColor: '#F5C542',
  borderRadius: '5px',
  color: '#000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footerText = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  direction: 'rtl' as const,
};

const socialSection = {
  padding: '10px 40px',
};

const socialColumn = {
  padding: '0 10px',
};

const socialLink = {
  color: '#6C3BFF',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 'bold',
};
