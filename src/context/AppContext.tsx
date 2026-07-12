"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Product, Order, Consultation, NewsletterSubscriber, Testimonial, FAQ, Coupon, SiteSettings, ComparisonItem, FunnelStage, ValueStackItem } from '../types';
import { useSiteSettings, useComparisonItems, useFunnelStages, useValueStackItems, useCoupons, DbSiteSetting, DbComparisonItem, DbFunnelStage, DbValueStackItem, DbCoupon } from '../hooks/useSupabaseData';
import { updateAdminSiteSetting } from '../server/actions/admin';

// ─── Fallback data (used when Supabase tables don't exist yet) ─────────────

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-main-book',
    title: 'كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"',
    description: 'الدليل العملي الشامل لهندسة الأنظمة التسويقية وصناعة المبيعات المستقرة وبناء عروض عالية القيمة تتجاوز المنافسة التقليدية.',
    price: 199,
    salePrice: 49,
    features: [
      'فهم عميق لسلوك المشترين ذوي الدخل المرتفع وكيفية جذبهم',
      'صياغة العرض الذي لا يمكن رفضه (The Irresistible Offer) بالتفصيل',
      'خطوات بناء قمع المبيعات (Sales Funnel) الخاص بمشروعك الرقمي',
      'أسرار صناعة المحتوى التسويقي التحويلي بدلاً من المحتوى التفاعلي الفارغ',
      'تمارين عملية تفاعلية لكل فصل لمساعدتك على التنفيذ المباشر'
    ],
    chapters: [
      'الفصل الأول: وهم المهارة وسر الأنظمة المبيعية المغلقة',
      'الفصل الثاني: تشريح عقلية المشتري الثري والشرائح النخبوية',
      'الفصل الثالث: هندسة العروض فائقة القيمة (High-Ticket Offers)',
      'الفصل الرابع: بناء الفنل: البوابة الذهبية التي تجمع البيانات وتصنع النقود',
      'الفصل الخامس: المحتوى المستهدف: كيف تقنع النخبة دون ملاحقة',
      'الفصل السادس: تشغيل الآلة: الأتمتة الكاملة وخريطة الطريق للنمو المضاعف'
    ],
    isActive: true,
    createdAt: new Date(2026, 5, 1).toISOString(),
  },
  {
    id: 'prod-bonus-gift',
    title: 'كتاب "10 مبادئ للنجاح المالي والشخصي"',
    description: 'كتاب إرشادي خاص وحصري من تأليف جاسم محمد، يغطي القواعد الأساسية لإعادة برمجة عقليتك المالية وبناء عادات الثروة والإنتاجية الشخصية.',
    price: 29,
    salePrice: 0,
    features: [
      'المبادئ الذهبية لترتيب المدخرات والاستثمار وإدارة التدفق المالي',
      'تشريح لصوص العقل والوقت وبناء جدول عالي الكفاءة ومصمم لتوليد الفرص',
      'تجارب عملية مباشرة للمؤسس جاسم محمد من السوق الخليجي والعالمي'
    ],
    isActive: true,
    createdAt: new Date(2026, 5, 2).toISOString(),
  },
  {
    id: 'prod-consultation',
    title: 'استشارة استراتيجية خاصة',
    description: 'جلسة استشارة مباشرة لتحليل مسار عملك التسويقي وتقديم التوجيهات الدقيقة.',
    price: 150,
    features: [
      'تحليل وضعك التسويقي الحالي',
      'بناء خريطة طريق مخصصة'
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  }
];

const FALLBACK_FAQS: FAQ[] = [
  { id: 'faq-1', question: 'ما الذي سأحصل عليه بدقة عند شراء الحزمة الآن؟', answer: 'ستحصل على وصول فوري وبمدى الحياة لكتاب "بدون التسويق كارثة تهدد ثروتك المستقبلية" بصيغة PDF عالية الدقة، بالإضافة إلى كتاب الهدية المجانية "10 مبادئ للنجاح المالي والشخصي" وكافة التمارين التفاعلية والقوالب الجاهزة للتنزيل.', orderIndex: 1 },
  { id: 'faq-2', question: 'كيف يمكنني تنزيل الملفات بعد تأكيد الشراء؟', answer: 'بمجرد استكمال الدفع بنجاح عبر Stripe أو PayPal، سيتم توجيهك تلقائياً لصفحة الشكر لتحميل الكتب مباشرة. كما سنرسل لك بريداً إلكترونياً يحتوي على روابط التنزيل.', orderIndex: 2 },
  { id: 'faq-3', question: 'هل هذا الكتاب مناسب للمبتدئين تماماً؟', answer: 'نعم، الكتاب يركز على العقلية والأساسيات العملية بلغة عربية مبسطة. سينقلك خطوة بخطوة من العشوائية إلى بناء الأنظمة المتكاملة.', orderIndex: 3 },
  { id: 'faq-4', question: 'كيف تعمل جلسات الاستشارات الاستراتيجية؟', answer: 'بعد حجز موعدك عبر Calendly، نرسل لك استبياناً قصيراً ثم يقوم جاسم محمد بدراسة مشروعك بدقة قبل الجلسة المرئية المباشرة.', orderIndex: 4 },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: 'test-1', customerName: 'فيصل الشمري', country: 'المملكة العربية السعودية', rating: 5, comment: 'قرأت مئات الكتب في التسويق لكن هذا الكتاب يقدم خريطة عملية مبنية للسوق الخليجي. تغير مستوى مبيعاتي بالكامل.', isApproved: true, createdAt: new Date(2026, 5, 15).toISOString() },
  { id: 'test-2', customerName: 'مريم الصايغ', country: 'دولة الإمارات العربية المتحدة', rating: 5, comment: 'محتوى استثنائي ومرتب بعناية. الفصول تشرح بدقة كيف تصنع نظام مبيعات مؤتمت مستدام. الهدية المرفقة كنز مالي حقيقي.', isApproved: true, createdAt: new Date(2026, 5, 18).toISOString() },
  { id: 'test-3', customerName: 'عبدالرحمن الكواري', country: 'دولة قطر', rating: 5, comment: 'الكتاب فتح عيني على ثغرات خطيرة كنت أقوم بها في عملي. أنصح بشدة باقتناء الحزمة ومتابعة الاستشارات.', isApproved: true, createdAt: new Date(2026, 5, 21).toISOString() },
];

const FALLBACK_SITE_SETTINGS: SiteSettings = {
  hero_subtitle: 'JASIM MOHAMMED يقدم',
  comparison_title: 'قارن وشاهد الفارق: هندسة التحول الجذري لعملك',
  comparison_subtitle: 'الانتقال من مرحلة العشوائية الفردية إلى مرحلة العلامة التجارية الممتازة ذات الدخل البارد المؤتمت.',
  funnel_title: 'نظام BLACK4ME الفَنَل البصري المتعاقب',
  funnel_subtitle: 'اضغط على أي مرحلة من مراحل قمع المبيعات تالياً لعرض الخريطة التشغيلية وتفاصيل رحلة التحول لعملائنا.',
  payment_stripe_enabled: 'true',
  payment_paypal_enabled: 'true',
  seo_title: 'BLACK4ME - نظام التسويق الذكي',
  seo_description: 'المنصة المتكاملة للتسويق الذكي والمبيعات الرقمية المتقدمة',
  seo_keywords: 'تسويق, مبيعات, تجارة إلكترونية, كورسات, جاسم محمد',
  og_image: '',
  ga_id: '',
  meta_pixel_id: '',
  tiktok_pixel_id: '',
  checkout_cover_image: '',
  book_preview_image: '',
};

const FALLBACK_COMPARISON_ITEMS: ComparisonItem[] = [
  { id: 'comp-1', aspect: 'آلية جلب العملاء والمهتمين', beforeSystem: 'ملاحقة مستمرة وإرسال مئات الرسائل العشوائية المكتوبة بالذكاء الاصطناعي دون إنصات أو استجابة.', afterSystem: 'الفنل يقوم بجذب وغربلة العملاء عاليي الملاءة وجلبهم مهيئين للشراء بنسبة 80% قبل التحدث الفردي.', orderIndex: 1 },
  { id: 'comp-2', aspect: 'قواعد التسعير والتحصيل المالي', beforeSystem: 'النزول بالتسعير للحد الأدنى لجذب المترددين، ما يؤثر على جودة الخدمة ويبقي أرباحك متعثرة.', afterSystem: 'بناء وتصميم عروض نخبوية (High-Ticket Program) بأسعار تبدأ من $2,000 وتبريرها بقيمتها الحقيقية.', orderIndex: 2 },
  { id: 'comp-3', aspect: 'العائد الزمني والمجهود التشغيلي', beforeSystem: 'تعمل 14 ساعة يومياً بمحاولات ترويجية مبعثرة، دون أي تكرار منهجي أو بنية أصول حقيقية لعلامتك.', afterSystem: 'نظام مؤتمت مكرر ومستقر، يحتاج فقط 3-4 ساعات مراجعة أسبوعية وتحديثات فنية لتوسيع الأرقام.', orderIndex: 3 },
  { id: 'comp-4', aspect: 'صناعة الأثر والهيبة المعرفية', beforeSystem: 'صانع محتوى عام ينشر يومياً "أفضل 5 نصائح برمجية" دون ترابط حقيقي يهدف للبيع.', afterSystem: 'هيبة فكرية كقائد رأي مستهدف، يفصل بدقة خريطة طريق تحل مشكلة العميل العميقة بوضوح.', orderIndex: 4 },
];

const FALLBACK_FUNNEL_STAGES: FunnelStage[] = [
  { id: 'fs-1', num: 1, title: 'قراءة الكتاب التأسيسي الاستراتيجي', subtitle: 'المرحلة الأولى: امتلاك العقلية القيادية وفك شفرة الغموض التسويقي', details: 'تبدأ رحلتك بتصفح كتاب...', badge: 'نقطة الدخول التأسيسية', iconName: 'BookOpen' },
  { id: 'fs-2', num: 2, title: 'بناء وتصميم عرضك فائق القيمة', subtitle: 'المرحلة الثانية: تحويل المعرفة والمهارة إلى حل جاهز ومطلوب بشدة', details: 'تطبيق التمارين المرفقة...', badge: 'صياغة الميزة الفريدة', iconName: 'Lightbulb' },
  { id: 'fs-3', num: 3, title: 'هندسة المحتوى التحويلي المستهدف', subtitle: 'المرحلة الثالثة: صياغة الرسائل التسويقية وصنع هيبتك القيادية', details: 'هنا سنعير اهتمامنا لجذب عقول المهتمين...', badge: 'محرك السيطرة المعرفية', iconName: 'PenTool' },
  { id: 'fs-4', num: 4, title: 'إطلاق نظام قمع المبيعات والفنل', subtitle: 'المرحلة الرابعة: الأتمتة الكاملة لقمع المبيعات وبناء قوائم البيانات', details: 'ربط النماذج وقواعد البيانات...', badge: 'التحصيل والأتمتة الرقمية', iconName: 'CheckSquare' },
  { id: 'fs-5', num: 5, title: 'جلسة الاستشارة الاستراتيجية الفردية', subtitle: 'المرحلة الخامسة: تشريح عملك والتحقق المباشر', details: 'جلسة مباشرة وجهاً لوجه لغربلة الهيكل...', badge: 'المصادقة وتعديل الثغرات', iconName: 'MessageSquareCode' },
  { id: 'fs-6', num: 6, title: 'النمو الرقمي الشامل ومضاعفة الأرقام', subtitle: 'المرحلة السادسة: توسيع النطاق ومرحلة بناء الثروة المتكاملة', details: 'بعد اختبار وصيانة المراحل السابقة...', badge: 'الهروب نحو الحرية المالية', iconName: 'Rocket' },
];

const FALLBACK_VALUE_STACK: ValueStackItem[] = [
  { id: 'vs-1', name: "كتاب 'بدون التسويق... كارثة تهدد ثروتك المستقبلية'", realValue: 99, notes: "النسخة الرقمية الكاملة عالية الجودة", orderIndex: 1 },
  { id: 'vs-2', name: "كتاب الهدية الممتازة '10 مبادئ للنجاح المالي والشخصي'", realValue: 29, notes: "بقلم جاسم محمد - غير متاحة للبيع المنفرد", orderIndex: 2 },
  { id: 'vs-3', name: "الحقيبة التسويقية الشاملة والقوالب العملية الجاهزة", realValue: 39, notes: "نماذج ملفات وهياكل جاهزة للاستخدام", orderIndex: 3 },
  { id: 'vs-4', name: "تمارين تفاعلية ودفتر تمارين لكل فصل", realValue: 19, notes: "لضمان تطبيق الأفكار التسويقية فورياً", orderIndex: 4 },
  { id: 'vs-5', name: "التحديثات الدورية وكافة الفصول الإضافية مدى الحياة", realValue: 25, notes: "ترقية مستمرة لأحدث استراتيجيات السوق", orderIndex: 5 },
  { id: 'vs-6', name: "الوصول الحصري لمجتمع BLACK4ME ودعم الخبراء والمؤسس", realValue: 49, notes: "قنوات تفاعلية لحل مشكلات أعمالك", orderIndex: 6 }
];

const FALLBACK_COUPONS: Coupon[] = [
  { id: 'cpn-1', code: 'BLACK20', discountPercent: 20, isActive: true },
  { id: 'cpn-2', code: 'JASIM10', discountPercent: 10, isActive: true }
];

// ─── Context Interface ───────────────────────────────────────────────────────

interface AppContextType {
  currentUser: User | null;
  products: Product[];
  orders: Order[];
  consultations: Consultation[];
  subscribers: NewsletterSubscriber[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  coupons: Coupon[];
  siteSettings: SiteSettings;
  comparisonItems: ComparisonItem[];
  funnelStages: FunnelStage[];
  valueStackItems: ValueStackItem[];
  loginAs: (role: 'admin' | 'customer' | 'guest', userDetails?: Partial<User>) => void;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrder: (id: string, status: Order['status']) => void;
  bookConsultation: (consultation: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => void;
  updateConsultationStatus: (id: string, status: Consultation['status']) => void;
  subscribeNewsletter: (name: string, email: string, country: string) => Promise<{ success: boolean; message: string }>;
  submitTestimonial: (name: string, country: string, rating: number, comment: string) => void;
  approveTestimonial: (id: string) => void;
  rejectTestimonial: (id: string) => void;
  addFAQ: (faq: Omit<FAQ, 'id'>) => void;
  updateFAQ: (id: string, faq: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;
  reorderFAQs: (faqs: FAQ[]) => void;
  updateSiteSetting: (key: string, value: string) => void;
  addComparisonItem: (item: Omit<ComparisonItem, 'id'>) => void;
  updateComparisonItem: (id: string, item: Partial<ComparisonItem>) => void;
  deleteComparisonItem: (id: string) => void;
  addFunnelStage: (stage: Omit<FunnelStage, 'id'>) => void;
  updateFunnelStage: (id: string, stage: Partial<FunnelStage>) => void;
  deleteFunnelStage: (id: string) => void;
  addValueStackItem: (item: Omit<ValueStackItem, 'id'>) => void;
  updateValueStackItem: (id: string, item: Partial<ValueStackItem>) => void;
  deleteValueStackItem: (id: string) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ─── Supabase helpers ─────────────────────────────────────────────────────────

// Convert snake_case DB row to camelCase Product
function dbToProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: row.price,
    salePrice: row.sale_price || undefined,
    fileUrl: row.file_url || undefined,
    paymentLink: row.payment_link || undefined,
    features: row.features || [],
    chapters: row.chapters || [],
    isActive: row.is_active ?? true,
    createdAt: row.created_at,
  };
}

function dbToFAQ(row: any): FAQ {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    orderIndex: row.order_index ?? 1,
  };
}

function dbToTestimonial(row: any): Testimonial {
  return {
    id: row.id,
    customerName: row.customer_name,
    country: row.country,
    rating: row.rating,
    comment: row.comment,
    isApproved: row.is_approved ?? false,
    createdAt: row.created_at,
  };
}

function dbToConsultation(row: any): Consultation {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    appointmentDate: row.appointment_date,
    appointmentTime: row.appointment_time,
    status: row.status as 'scheduled' | 'completed' | 'cancelled',
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function dbToSubscriber(row: any): NewsletterSubscriber {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    country: row.country,
    createdAt: row.created_at,
  };
}

function dbToOrder(row: any): Order {
  return {
    id: row.id,
    customerId: row.customer_id || '',
    customerName: row.customer_name || '',
    customerEmail: row.customer_email,
    productId: row.product_id,
    productTitle: row.product_title || '',
    amount: row.amount,
    paymentGateway: row.payment_gateway as 'stripe' | 'paypal' | 'spaceremit',
    status: row.status as 'pending' | 'completed' | 'failed' | 'pending_verification',
    receiptUrl: row.receipt_url,
    createdAt: row.created_at,
  };
}

function dbToComparisonItem(row: any): ComparisonItem {
  return {
    id: row.id,
    aspect: row.aspect,
    beforeSystem: row.before_system,
    afterSystem: row.after_system,
    orderIndex: row.order_index ?? 0,
  };
}

function dbToFunnelStage(row: any): FunnelStage {
  return {
    id: row.id,
    num: row.num,
    title: row.title,
    subtitle: row.subtitle,
    details: row.details,
    badge: row.badge,
    iconName: row.icon_name || 'Layers',
  };
}

function dbToValueStackItem(row: any): ValueStackItem {
  return {
    id: row.id,
    name: row.name,
    realValue: row.real_value,
    notes: row.notes || '',
    orderIndex: row.order_index ?? 0,
  };
}

function dbToCoupon(row: any): Coupon {
  return {
    id: row.id,
    code: row.code,
    discountPercent: row.discount_percentage,
    isActive: row.is_active ?? true,
  };
}

// ─── Safe Supabase fetch (returns fallback on table-not-found) ─────────────

async function safeFetch<T>(
  table: string,
  converter: (row: any) => T,
  fallback: T[],
  options?: { filter?: { column: string; value: any }; order?: { column: string; ascending: boolean } }
): Promise<T[]> {
  try {
    let query = supabase.from(table).select('*');
    if (options?.filter) {
      query = query.eq(options.filter.column, options.filter.value);
    }
    if (options?.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending });
    }
    const { data, error } = await query;
    if (error) {
      console.warn(`[B4M] Table "${table}" not available, using fallback:`, error.message);
      return fallback;
    }
    if (!data || data.length === 0) return fallback;
    return data.map(converter);
  } catch {
    return fallback;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [faqs, setFaqs] = useState<FAQ[]>(FALLBACK_FAQS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(FALLBACK_SITE_SETTINGS);
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>(FALLBACK_COMPARISON_ITEMS);
  const [funnelStages, setFunnelStages] = useState<FunnelStage[]>(FALLBACK_FUNNEL_STAGES);
  const [valueStackItems, setValueStackItems] = useState<ValueStackItem[]>(FALLBACK_VALUE_STACK);
  const [coupons, setCoupons] = useState<Coupon[]>(FALLBACK_COUPONS);

  // ─── Load data via Server Actions on mount ────────────────────────────────
  useEffect(() => {
    const loadAll = async () => {
      // Dynamically import server actions to avoid SSR issues if this is purely client
      const { getProducts } = await import('../server/actions/products');
      const { getFAQs, getTestimonials, getSiteSettings, getComparisonItems, getFunnelStages, getValueStackItems } = await import('../server/actions/cms');

      const [dbProducts, dbFaqs, dbTestimonials, dbSettings, dbComparisons, dbFunnels, dbValueStack] = await Promise.all([
        getProducts(),
        getFAQs(),
        getTestimonials(),
        getSiteSettings(),
        getComparisonItems(),
        getFunnelStages(),
        getValueStackItems(),
      ]);

      setProducts(dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS);
      setFaqs(dbFaqs.length > 0 ? dbFaqs : FALLBACK_FAQS);
      setTestimonials(dbTestimonials.length > 0 ? dbTestimonials : FALLBACK_TESTIMONIALS);
      setComparisonItems(dbComparisons.length > 0 ? dbComparisons : FALLBACK_COMPARISON_ITEMS);
      setFunnelStages(dbFunnels.length > 0 ? dbFunnels : FALLBACK_FUNNEL_STAGES);
      setValueStackItems(dbValueStack.length > 0 ? dbValueStack : FALLBACK_VALUE_STACK);

      if (Object.keys(dbSettings).length > 0) {
        setSiteSettings({ ...FALLBACK_SITE_SETTINGS, ...dbSettings } as SiteSettings);
      }
    };

    loadAll();

    // Restore user from localStorage
    const storedUser = localStorage.getItem('b4m_current_user');
    if (storedUser) {
      try { setCurrentUser(JSON.parse(storedUser)); } catch { /* ignore */ }
    }
  }, []);

  // Update favicon dynamically when siteSettings load or change
  useEffect(() => {
    if (typeof document !== 'undefined' && siteSettings.site_favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteSettings.site_favicon;
    }
  }, [siteSettings.site_favicon]);

  // ─── Auth ───────────────────────────────────────────────────────────────

  const loginAs = (role: 'admin' | 'customer' | 'guest', userDetails?: Partial<User>) => {
    if (role === 'guest') {
      setCurrentUser(null);
      localStorage.removeItem('b4m_current_user');
      return;
    }
    const newUser: User = {
      id: role === 'admin' ? 'admin-1' : (userDetails?.id || 'cust-new'),
      name: userDetails?.name || (role === 'admin' ? 'جاسم محمد (مسؤول)' : 'مستخدم تجريبي'),
      email: userDetails?.email || (role === 'admin' ? 'admin@black4me.com' : 'user@example.com'),
      role,
      country: userDetails?.country || 'المملكة العربية السعودية',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    localStorage.setItem('b4m_current_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('b4m_current_user');
  };

  // ─── Products CRUD → Supabase ───────────────────────────────────────────

  const addProduct = async (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase.from('products').insert([{
      title: prodData.title,
      description: prodData.description,
      price: prodData.price,
      sale_price: prodData.salePrice || null,
      file_url: prodData.fileUrl || null,
      payment_link: prodData.paymentLink || null,
      images: prodData.images || [],
      category_id: prodData.categoryId || null,
      slug: prodData.slug || null,
      benefits: prodData.benefits || [],
      is_active: prodData.isActive ?? true,
    }]).select();

    if (!error && data) {
      setProducts(prev => [dbToProduct(data[0]), ...prev]);
    } else {
      // Fallback to local
      const newProduct: Product = { ...prodData, id: `prod-${Date.now()}`, createdAt: new Date().toISOString() };
      setProducts(prev => [newProduct, ...prev]);
    }
  };

  const updateProduct = async (id: string, prodData: Partial<Product>) => {
    const payload: any = {};
    if (prodData.title !== undefined) payload.title = prodData.title;
    if (prodData.description !== undefined) payload.description = prodData.description;
    if (prodData.price !== undefined) payload.price = prodData.price;
    if (prodData.salePrice !== undefined) payload.sale_price = prodData.salePrice;
    if (prodData.isActive !== undefined) payload.is_active = prodData.isActive;
    if (prodData.fileUrl !== undefined) payload.file_url = prodData.fileUrl;
    if (prodData.paymentLink !== undefined) payload.payment_link = prodData.paymentLink;
    if (prodData.images !== undefined) payload.images = prodData.images;
    if (prodData.categoryId !== undefined) payload.category_id = prodData.categoryId;
    if (prodData.slug !== undefined) payload.slug = prodData.slug;
    if (prodData.benefits !== undefined) payload.benefits = prodData.benefits;

    await supabase.from('products').update(payload).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...prodData } : p));
  };

  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ─── Orders CRUD → Supabase ─────────────────────────────────────────────

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: `B4M-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
    };

    const { createOrder: serverCreateOrder } = await import('../server/actions/orders');
    await serverCreateOrder({
      productId: newOrder.productId || '',
      productTitle: newOrder.productTitle || '',
      customerEmail: newOrder.customerEmail || '',
      customerName: newOrder.customerName || '',
      amount: newOrder.amount,
      paymentGateway: (newOrder.paymentGateway as 'stripe' | 'paypal') || 'stripe'
    });

    setOrders(prev => [newOrder, ...prev]);

    if (newOrder.status === 'completed' && (!currentUser || currentUser.role !== 'admin')) {
      loginAs('customer', { id: newOrder.customerId, name: newOrder.customerName, email: newOrder.customerEmail });
    }

    return newOrder;
  };

  const updateOrder = async (id: string, status: Order['status']) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  // ─── Consultations → Supabase ───────────────────────────────────────────

  const bookConsultation = async (consData: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => {
    const { data, error } = await supabase.from('consultations').insert([{
      customer_name: consData.customerName,
      customer_email: consData.customerEmail,
      appointment_date: consData.appointmentDate,
      appointment_time: consData.appointmentTime,
      notes: consData.notes || null,
      status: 'scheduled',
    }]).select();

    if (!error && data) {
      setConsultations(prev => [dbToConsultation(data[0]), ...prev]);
    } else {
      // Fallback to local
      const newCons: Consultation = {
        ...consData, id: `con-${Date.now()}`, status: 'scheduled', createdAt: new Date().toISOString()
      };
      setConsultations(prev => [newCons, ...prev]);
    }
  };

  const updateConsultationStatus = async (id: string, status: Consultation['status']) => {
    await supabase.from('consultations').update({ status }).eq('id', id);
    setConsultations(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  // ─── Newsletter → Supabase ──────────────────────────────────────────────

  const subscribeNewsletter = async (name: string, email: string, country: string) => {
    const { subscribeToNewsletter } = await import('../server/actions/newsletter');
    const result = await subscribeToNewsletter({ name, email, country });
    
    if (result.success) {
      const newSub: NewsletterSubscriber = {
        id: `sub-${Date.now()}`, name, email, country, createdAt: new Date().toISOString()
      };
      setSubscribers(prev => [newSub, ...prev]);
    }
    return result;
  };

  // ─── Testimonials → Supabase ────────────────────────────────────────────

  const submitTestimonial = async (name: string, country: string, rating: number, comment: string) => {
    await supabase.from('testimonials').insert([{
      customer_name: name, country, rating, comment, is_approved: false,
    }]);
    // Don't add to local state since it needs admin approval
  };

  const approveTestimonial = async (id: string) => {
    await supabase.from('testimonials').update({ is_approved: true }).eq('id', id);
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, isApproved: true } : t));
  };

  const rejectTestimonial = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id);
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  // ─── FAQs → Supabase ───────────────────────────────────────────────────

  const addFAQ = async (faqData: Omit<FAQ, 'id'>) => {
    const { data, error } = await supabase.from('faqs').insert([{
      question: faqData.question, answer: faqData.answer, order_index: faqData.orderIndex,
    }]).select();

    if (!error && data) {
      setFaqs(prev => [...prev, dbToFAQ(data[0])]);
    } else {
      const newFaq: FAQ = { ...faqData, id: `faq-${Date.now()}` };
      setFaqs(prev => [...prev, newFaq]);
    }
  };

  const updateFAQ = async (id: string, faqData: Partial<FAQ>) => {
    const payload: any = {};
    if (faqData.question !== undefined) payload.question = faqData.question;
    if (faqData.answer !== undefined) payload.answer = faqData.answer;
    if (faqData.orderIndex !== undefined) payload.order_index = faqData.orderIndex;

    await supabase.from('faqs').update(payload).eq('id', id);
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...faqData } : f));
  };

  const deleteFAQ = async (id: string) => {
    await supabase.from('faqs').delete().eq('id', id);
    setFaqs(prev => prev.filter(f => f.id !== id));
  };

  const reorderFAQs = (reorderedFaqs: FAQ[]) => {
    setFaqs(reorderedFaqs);
    // Update order_index in Supabase for each
    reorderedFaqs.forEach((f, i) => {
      supabase.from('faqs').update({ order_index: i + 1 }).eq('id', f.id).then(() => {});
    });
  };

  // ─── CMS Functions ───────────────────────────────────────────────────────
  
  const updateSiteSetting = async (key: string, value: string) => {
    // Optimistic update
    setSiteSettings(prev => ({ ...prev, [key]: value }));
    try {
      await updateAdminSiteSetting(key, value);
    } catch (error) {
      console.error("Failed to update setting", error);
    }
  };

  const addComparisonItem = async (itemData: Omit<ComparisonItem, 'id'>) => {
    const { data, error } = await supabase.from('comparison_items').insert([{
      aspect: itemData.aspect,
      before_system: itemData.beforeSystem,
      after_system: itemData.afterSystem,
      order_index: itemData.orderIndex
    }]).select();
    if (!error && data) setComparisonItems(prev => [...prev, dbToComparisonItem(data[0])]);
  };

  const updateComparisonItem = async (id: string, itemData: Partial<ComparisonItem>) => {
    const payload: any = {};
    if (itemData.aspect !== undefined) payload.aspect = itemData.aspect;
    if (itemData.beforeSystem !== undefined) payload.before_system = itemData.beforeSystem;
    if (itemData.afterSystem !== undefined) payload.after_system = itemData.afterSystem;
    if (itemData.orderIndex !== undefined) payload.order_index = itemData.orderIndex;
    await supabase.from('comparison_items').update(payload).eq('id', id);
    setComparisonItems(prev => prev.map(c => c.id === id ? { ...c, ...itemData } : c));
  };

  const deleteComparisonItem = async (id: string) => {
    await supabase.from('comparison_items').delete().eq('id', id);
    setComparisonItems(prev => prev.filter(c => c.id !== id));
  };

  const addFunnelStage = async (stageData: Omit<FunnelStage, 'id'>) => {
    const { data, error } = await supabase.from('funnel_stages').insert([{
      num: stageData.num,
      title: stageData.title,
      subtitle: stageData.subtitle,
      details: stageData.details,
      badge: stageData.badge,
      icon_name: stageData.iconName
    }]).select();
    if (!error && data) setFunnelStages(prev => [...prev, dbToFunnelStage(data[0])]);
  };

  const updateFunnelStage = async (id: string, stageData: Partial<FunnelStage>) => {
    const payload: any = {};
    if (stageData.num !== undefined) payload.num = stageData.num;
    if (stageData.title !== undefined) payload.title = stageData.title;
    if (stageData.subtitle !== undefined) payload.subtitle = stageData.subtitle;
    if (stageData.details !== undefined) payload.details = stageData.details;
    if (stageData.badge !== undefined) payload.badge = stageData.badge;
    if (stageData.iconName !== undefined) payload.icon_name = stageData.iconName;
    await supabase.from('funnel_stages').update(payload).eq('id', id);
    setFunnelStages(prev => prev.map(s => s.id === id ? { ...s, ...stageData } : s));
  };

  const deleteFunnelStage = async (id: string) => {
    await supabase.from('funnel_stages').delete().eq('id', id);
    setFunnelStages(prev => prev.filter(s => s.id !== id));
  };

  const addValueStackItem = async (itemData: Omit<ValueStackItem, 'id'>) => {
    const { data, error } = await supabase.from('value_stack_items').insert([{
      name: itemData.name,
      real_value: itemData.realValue,
      notes: itemData.notes,
      order_index: itemData.orderIndex
    }]).select();
    if (!error && data) setValueStackItems(prev => [...prev, dbToValueStackItem(data[0])]);
  };

  const updateValueStackItem = async (id: string, itemData: Partial<ValueStackItem>) => {
    const payload: any = {};
    if (itemData.name !== undefined) payload.name = itemData.name;
    if (itemData.realValue !== undefined) payload.real_value = itemData.realValue;
    if (itemData.notes !== undefined) payload.notes = itemData.notes;
    if (itemData.orderIndex !== undefined) payload.order_index = itemData.orderIndex;
    await supabase.from('value_stack_items').update(payload).eq('id', id);
    setValueStackItems(prev => prev.map(v => v.id === id ? { ...v, ...itemData } : v));
  };

  const deleteValueStackItem = async (id: string) => {
    await supabase.from('value_stack_items').delete().eq('id', id);
    setValueStackItems(prev => prev.filter(v => v.id !== id));
  };

  const addCoupon = async (couponData: Omit<Coupon, 'id'>) => {
    const { data, error } = await supabase.from('coupons').insert([{
      code: couponData.code,
      discount_percentage: couponData.discountPercent,
      is_active: couponData.isActive
    }]).select();
    if (!error && data) setCoupons(prev => [...prev, dbToCoupon(data[0])]);
  };

  const updateCoupon = async (id: string, couponData: Partial<Coupon>) => {
    const payload: any = {};
    if (couponData.code !== undefined) payload.code = couponData.code;
    if (couponData.discountPercent !== undefined) payload.discount_percentage = couponData.discountPercent;
    if (couponData.isActive !== undefined) payload.is_active = couponData.isActive;
    await supabase.from('coupons').update(payload).eq('id', id);
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...couponData } : c));
  };

  const deleteCoupon = async (id: string) => {
    await supabase.from('coupons').delete().eq('id', id);
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  // ─── Provide context ───────────────────────────────────────────────────

  return (
    <AppContext.Provider value={{
      currentUser, products, orders, consultations, subscribers,
      testimonials, faqs, coupons, siteSettings, comparisonItems, funnelStages, valueStackItems,
      loginAs, logout,
      addProduct, updateProduct, deleteProduct,
      createOrder, updateOrder,
      bookConsultation, updateConsultationStatus,
      subscribeNewsletter,
      submitTestimonial, approveTestimonial, rejectTestimonial,
      addFAQ, updateFAQ, deleteFAQ, reorderFAQs,
      updateSiteSetting,
      addComparisonItem, updateComparisonItem, deleteComparisonItem,
      addFunnelStage, updateFunnelStage, deleteFunnelStage,
      addValueStackItem, updateValueStackItem, deleteValueStackItem,
      addCoupon, updateCoupon, deleteCoupon
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

