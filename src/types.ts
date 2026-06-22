export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  country?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  coverUrl?: string;
  fileUrl?: string; // Links for actual digital downloads (PDF, etc.)
  paymentLink?: string; // External checkout URL like Stripe Payment Link
  features: string[];
  chapters?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productTitle: string;
  amount: number;
  paymentGateway: 'stripe' | 'paypal';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Consultation {
  id: string;
  customerName: string;
  customerEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  country: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  avatarUrl?: string;
  country: string;
  rating: number; // 1-5
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  orderIndex: number;
}

export interface Coupon {
  id?: string;
  code: string;
  discountPercent: number;
  isActive: boolean;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface ComparisonItem {
  id: string;
  aspect: string;
  beforeSystem: string;
  afterSystem: string;
  orderIndex: number;
}

export interface FunnelStage {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  details: string;
  badge: string;
  iconName: string;
}

export interface ValueStackItem {
  id: string;
  name: string;
  realValue: number;
  notes: string;
  orderIndex: number;
}
