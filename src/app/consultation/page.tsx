import { Metadata } from 'next';
import ConsultationClient from './ConsultationClient';

export const metadata: Metadata = {
  title: 'استشارة تسويقية | BLACK4ME',
  description: 'احجز جلسة استشارية مع الأستاذ جاسم محمد — خطة تسويق مخصصة لمشروعك في 60 دقيقة',
};

export default function ConsultationPage() {
  return <ConsultationClient />;
}
