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
  Img
} from '@react-email/components';

interface WelcomeEmailProps {
  userFirstname: string;
  downloadLink?: string;
}

export default function WelcomeEmail({ userFirstname, downloadLink }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>مرحباً بك في Black4me</Heading>
          
          <Text style={text}>
            أهلاً {userFirstname}، شكراً لك على ثقتك بنا.
          </Text>

          <Text style={text}>
            لقد تم تأكيد طلبك بنجاح وأصبح منتجك جاهزاً الآن. يمكنك الوصول إليه والبدء في استخدامه فوراً.
          </Text>

          {downloadLink && (
            <Section style={btnContainer}>
              <Link href={downloadLink} style={button}>
                تحميل المنتج / الوصول إليه
              </Link>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={text}>
            إذا كان لديك أي أسئلة أو احتجت إلى مساعدة، فلا تتردد في التواصل معنا.
          </Text>

          <Hr style={hr} />

          {/* Academy Access Section */}
          <Section style={{ padding: '0 40px' }}>
            <Heading style={{ ...h1, fontSize: '18px', paddingBottom: '8px' }}>
              🎓 حسابك في المنصة التعليمية
            </Heading>
            <Text style={text}>
              يمكنك الوصول إلى أكاديمية التسويق الرقمية كجزء من اشتراكك في الحزمة. استخدم كود الدخول الخاص بك لتسجيل الدخول:
            </Text>
            <Text style={{ ...text, marginTop: '8px' }}>
              🔗 رابط الدخول:{' '}
              <Link href="https://www.black4me.com/academy" style={{ color: '#F5C542' }}>
                https://www.black4me.com/academy
              </Link>
            </Text>
            <Text style={{ ...text, marginTop: '4px' }}>
              📧 البريد: {userFirstname} (نفس البريد الذي اشتريت به)
            </Text>
            <Text style={{ ...text, marginTop: '4px', fontSize: '13px', color: '#888' }}>
              ملاحظة: إذا كانت هذه أول مرة تدخل فيها، اضغط على "نسيت كلمة المرور" لإنشاء كلمة مرور جديدة.
            </Text>
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
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  padding: '30px',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'right' as const,
  padding: '0 40px',
  direction: 'rtl' as const,
};

const btnContainer = {
  textAlign: 'center' as const,
  marginTop: '32px',
};

const button = {
  backgroundColor: '#1E1E1E',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  direction: 'rtl' as const,
};
