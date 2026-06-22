import * as React from 'react';
import { Html, Head, Body, Container, Heading, Text, Link, Preview, Section, Img } from '@react-email/components';

interface WelcomeEmailProps {
  email: string;
  tempPassword?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ email, tempPassword }) => {
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>أهلاً بك في منصة BLACK4ME - تفاصيل تسجيل الدخول</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>مرحباً بك في BLACK4ME</Heading>
          
          <Text style={text}>
            لقد تم إتمام عملية الشراء بنجاح! يسعدنا انضمامك إلى مجتمع BLACK4ME.
            تم إنشاء حساب خاص بك في المنصة لتتمكن من الوصول إلى منتجاتك الرقمية في أي وقت ومن أي جهاز.
          </Text>

          <Section style={credentialsBox}>
            <Text style={credentialText}><strong>رابط المنصة:</strong> https://black4me-landing-page.vercel.app</Text>
            <Text style={credentialText}><strong>البريد الإلكتروني:</strong> {email}</Text>
            {tempPassword && (
              <Text style={credentialText}><strong>كلمة المرور المؤقتة:</strong> {tempPassword}</Text>
            )}
          </Section>

          <Text style={text}>
            يمكنك تسجيل الدخول عبر بوابة العملاء في الموقع باستخدام البيانات أعلاه. نوصي بتغيير كلمة المرور فور دخولك.
          </Text>

          <Section style={btnContainer}>
            <Link style={button} href="https://black4me-landing-page.vercel.app">
              الذهاب إلى بوابة العملاء
            </Link>
          </Section>

          <Text style={footer}>
            أطيب التحيات،<br />
            فريق BLACK4ME<br />
            JASIM MOHAMMED
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main = {
  backgroundColor: '#000000',
  fontFamily: '"Cairo", -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: '40px 0',
  color: '#ffffff',
};

const container = {
  backgroundColor: '#0A0A0A',
  border: '1px solid #1a1a1a',
  borderRadius: '8px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
  margin: '0 auto',
  padding: '40px',
  maxWidth: '600px',
};

const h1 = {
  color: '#F5C542',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 20px',
};

const text = {
  color: '#e5e5e5',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '20px',
};

const credentialsBox = {
  backgroundColor: '#111111',
  border: '1px solid #F5C542',
  borderRadius: '6px',
  padding: '20px',
  marginBottom: '20px',
};

const credentialText = {
  color: '#ffffff',
  fontSize: '15px',
  margin: '5px 0',
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '30px',
  marginBottom: '30px',
};

const button = {
  backgroundColor: '#F5C542',
  borderRadius: '4px',
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const footer = {
  color: '#888888',
  fontSize: '14px',
  marginTop: '40px',
  textAlign: 'center' as const,
};
