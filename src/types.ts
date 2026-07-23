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
  images?: string[];
  benefits?: string[];
  categoryId?: string | null;
  slug?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  country?: string;
  productId?: string;
  productTitle?: string;
  amount: number;
  paymentGateway?: 'stripe' | 'paypal' | 'spaceremit';
  status: 'pending' | 'completed' | 'failed' | 'pending_verification';
  receiptUrl?: string;
  createdAt?: string;
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
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  serviceType: 'product' | 'consultation' | 'general';
  productId?: string | null;
  userEmail?: string | null;
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

export interface Author {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  social_links?: any;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  featured_image?: string;
  author_id?: string;
  author_name?: string;
  authors?: Author;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string;
  publish_date?: string;
  content_blocks?: any;
  tags?: string[];
  status: 'draft' | 'published';
  ads_enabled?: boolean;
  ad_density?: string;
  views_count?: number;
  comments_count?: number;
  average_rating?: number;
  created_at: string;
  updated_at: string;
}

export interface AdSettings {
  id: string;
  provider: 'disabled' | 'adsterra' | 'adsense' | string;
  enabled: boolean;
  article_only: boolean;
  script_url?: string;
  script_inline?: string;
  publisher_id?: string;
  placement_config: {
    after_intro: boolean;
    mid_content: boolean;
    end_content: boolean;
  };
  style_config: {
    label: string;
    containerVariant: string;
  };
}

export interface BlogComment {
  id: string;
  post_id: string;
  user_name: string;
  user_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  created_at: string;
  updated_at?: string;
}

export interface BlogReview {
  id: string;
  post_id: string;
  user_name: string;
  user_email: string;
  rating: number; // 1-5
  content?: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  created_at: string;
  updated_at?: string;
}

export interface ModerationLog {
  id: string;
  target_type: 'comment' | 'review';
  target_id: string;
  action: 'approve' | 'reject' | 'hide';
  admin_id?: string;
  reason?: string;
  created_at: string;
}

