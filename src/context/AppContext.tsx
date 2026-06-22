"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Product, Order, Consultation, NewsletterSubscriber, Testimonial, FAQ, Coupon } from '../types';

// ─── Fallback data (used when Supabase tables don't exist yet) ─────────────

const FALLBACK_PRODUCTS: Product[] = [
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
  loginAs: (role: 'admin' | 'customer' | 'guest', userDetails?: Partial<User>) => void;
  logout: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrder: (id: string, status: Order['status']) => void;
  bookConsultation: (consultation: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => void;
  updateConsultationStatus: (id: string, status: Consultation['status']) => void;
  subscribeNewsletter: (name: string, email: string, country: string) => { success: boolean; message: string };
  submitTestimonial: (name: string, country: string, rating: number, comment: string) => void;
  approveTestimonial: (id: string) => void;
  rejectTestimonial: (id: string) => void;
  addFAQ: (faq: Omit<FAQ, 'id'>) => void;
  updateFAQ: (id: string, faq: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;
  reorderFAQs: (faqs: FAQ[]) => void;
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
    paymentGateway: row.payment_gateway as 'stripe' | 'paypal',
    status: row.status as 'pending' | 'completed' | 'failed',
    createdAt: row.created_at,
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
  const [coupons] = useState<Coupon[]>([
    { code: 'BLACK20', discountPercent: 20, isActive: true },
    { code: 'JASIM10', discountPercent: 10, isActive: true }
  ]);

  // ─── Load data from Supabase on mount ───────────────────────────────────
  useEffect(() => {
    const loadAll = async () => {
      const [dbProducts, dbFaqs, dbTestimonials, dbOrders, dbConsultations, dbSubscribers] = await Promise.all([
        safeFetch('products', dbToProduct, FALLBACK_PRODUCTS, { filter: { column: 'is_active', value: true }, order: { column: 'created_at', ascending: false } }),
        safeFetch('faqs', dbToFAQ, FALLBACK_FAQS, { order: { column: 'order_index', ascending: true } }),
        safeFetch('testimonials', dbToTestimonial, FALLBACK_TESTIMONIALS, { filter: { column: 'is_approved', value: true }, order: { column: 'created_at', ascending: false } }),
        safeFetch('orders', dbToOrder, [], { order: { column: 'created_at', ascending: false } }),
        safeFetch('consultations', dbToConsultation, [], { order: { column: 'created_at', ascending: false } }),
        safeFetch('subscribers', dbToSubscriber, [], { order: { column: 'created_at', ascending: false } }),
      ]);

      setProducts(dbProducts);
      setFaqs(dbFaqs);
      setTestimonials(dbTestimonials);
      setOrders(dbOrders);
      setConsultations(dbConsultations);
      setSubscribers(dbSubscribers);
    };

    loadAll();

    // Restore user from localStorage
    const storedUser = localStorage.getItem('b4m_current_user');
    if (storedUser) {
      try { setCurrentUser(JSON.parse(storedUser)); } catch { /* ignore */ }
    }
  }, []);

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
      features: prodData.features || [],
      chapters: prodData.chapters || [],
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
    if (prodData.features !== undefined) payload.features = prodData.features;
    if (prodData.chapters !== undefined) payload.chapters = prodData.chapters;

    await supabase.from('products').update(payload).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...prodData } : p));
  };

  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // ─── Orders CRUD → Supabase ─────────────────────────────────────────────

  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `B4M-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
    };

    // Insert to Supabase async
    supabase.from('orders').insert([{
      customer_email: newOrder.customerEmail,
      product_id: newOrder.productId,
      amount: newOrder.amount,
      payment_gateway: newOrder.paymentGateway,
      status: newOrder.status,
    }]).then(() => {});

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

  const subscribeNewsletter = (name: string, email: string, country: string) => {
    if (subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'مرحبًا بك، هذا البريد الإلكتروني مسجل مسبقًا معنا!' };
    }

    // Insert to Supabase async
    supabase.from('subscribers').upsert([{ name, email, country }], { onConflict: 'email', ignoreDuplicates: true }).then(() => {});

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`, name, email, country, createdAt: new Date().toISOString()
    };
    setSubscribers(prev => [newSub, ...prev]);

    return { success: true, message: 'تهانينا! تم تسجيل اشتراكك بنجاح في رسائلنا التسويقية الحصرية.' };
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

  // ─── Provide context ───────────────────────────────────────────────────

  return (
    <AppContext.Provider value={{
      currentUser, products, orders, consultations, subscribers,
      testimonials, faqs, coupons,
      loginAs, logout,
      addProduct, updateProduct, deleteProduct,
      createOrder, updateOrder,
      bookConsultation, updateConsultationStatus,
      subscribeNewsletter,
      submitTestimonial, approveTestimonial, rejectTestimonial,
      addFAQ, updateFAQ, deleteFAQ, reorderFAQs
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
