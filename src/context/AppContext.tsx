import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Order, Consultation, NewsletterSubscriber, Testimonial, FAQ, Coupon } from '../types';

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
  
  // Products API
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Orders API
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrder: (id: string, status: Order['status']) => void;
  
  // Consultations API
  bookConsultation: (consultation: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => void;
  updateConsultationStatus: (id: string, status: Consultation['status']) => void;
  
  // Newsletter API
  subscribeNewsletter: (name: string, email: string, country: string) => { success: boolean; message: string };
  
  // Testimonials API
  submitTestimonial: (name: string, country: string, rating: number, comment: string) => void;
  approveTestimonial: (id: string) => void;
  rejectTestimonial: (id: string) => void;
  
  // FAQ API
  addFAQ: (faq: Omit<FAQ, 'id'>) => void;
  updateFAQ: (id: string, faq: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;
  reorderFAQs: (faqs: FAQ[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Seed Data
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-main-book',
    title: 'كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"',
    description: 'الدليل العملي الشامل لهندسة الأنظمة التسويقية وصناعة المبيعات المستقرة وبناء عروض عالية القيمة تتجاوز المنافسة التقليدية.',
    price: 199,
    salePrice: 49,
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
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
    salePrice: 0, // Free bundle
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=400',
    features: [
      'المبادئ الذهبية لترتيب المدخرات والاستثمار وإدارة التدفق المالي',
      'تشريح لصوص العقل والوقت وبناء جدول عالي الكفاءة ومصمم لتوليد الفرص',
      'تجارب عملية مباشرة للمؤسس جاسم محمد من السوق الخليجي والعالمي'
    ],
    isActive: true,
    createdAt: new Date(2026, 5, 2).toISOString(),
  }
];

const DEFAULT_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'ما الذي سأحصل عليه بدقة عند شراء الحزمة الآن؟',
    answer: 'ستحصل على وصول فوري وبمدى الحياة لكتاب "بدون التسويق كارثة تهدد ثروتك المستقبلية" بصيغة PDF عالية الدقة، بالإضافة إلى كتاب الهدية المجانية "10 مبادئ للنجاح المالي والشخصي" وكافة التمارين التفاعلية والقوالب الجاهزة للتنزيل.',
    orderIndex: 1
  },
  {
    id: 'faq-2',
    question: 'كيف يمكنني تنزيل الملفات بعد تأكيد الشراء؟',
    answer: 'بمجرد استكمال الدفع بنجاح عبر Stripe أو PayPal، سيتم توجيهك تلقائياً لصفحة الشكر لتحميل الكتب مباشرة بجودة فائقة. كما سنرسل لك بريداً إلكترونياً يحتوي على روابط التنزيل الفورية مدى الحياة ومعلومات لوحة العميل الخاصة بك للمتابعة.',
    orderIndex: 2
  },
  {
    id: 'faq-3',
    question: 'هل هذا الكتاب مناسب للمبتدئين تماماً؟',
    answer: 'نعم، الكتاب يركز على العقلية والأساسيات العملية وتفصيل المصطلحات المعقدة بلغة عربية مبسطة وواضحة جداً بعيداً عن الفلسفة النظرية. سينقلك خطوة بخطوة من العشوائية إلى بناء أسرار الأنظمة المتكاملة بذكاء.',
    orderIndex: 3
  },
  {
    id: 'faq-4',
    question: 'كيف تعمل جلسات الاستشارات الاستراتيجية المحجوزة؟',
    answer: 'بعد حجز موعدك من خلال منصة جدولة المواعيد (Calendly) المضمنة، نرسل لك استبياناً قصيراً لتفاصيل مشروعك لكي يدرسها المؤسس جاسم محمد بدقة قبل الجلسة. الجلسة تتم عبر اتصال مرئي مباشر لمناقشة التحديات وبناء الخريطة التشغيلية.',
    orderIndex: 4
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    customerName: 'فيصل الشمري',
    country: 'المملكة العربية السعودية',
    rating: 5,
    comment: 'قرأت مئات الكتب في التسويق والمبيعات، لكن هذا الكتاب يقدم خريطة عملية مبنية خصيصاً لتفاصيل السوق الخليجي وبناء العروض النخبوية. طبقت فلسفة العرض عالي القيمة على خدماتي الاستشارية وتغير مستوى مبيعاتي بالكامل بفضل الله.',
    isApproved: true,
    createdAt: new Date(2026, 5, 15).toISOString()
  },
  {
    id: 'test-2',
    customerName: 'مريم الصايغ',
    country: 'دولة الإمارات العربية المتحدة',
    rating: 5,
    comment: 'محتوى استثنائي ومرتب بعناية. الفصول تشرح بدقة كيف تصنع نظام مبيعات مؤتمت مستدام بدلاً من ملاحقة العملاء وإزعاجهم. الهدية المرفقة بحد ذاتها كنز مالي حقيقي للإدارة والإنتاجية الشخصية.',
    isApproved: true,
    createdAt: new Date(2026, 5, 18).toISOString()
  },
  {
    id: 'test-3',
    customerName: 'عبدالرحمن الكواري',
    country: 'دولة قطر',
    rating: 5,
    comment: 'الكتاب فتح عيني على ثغرات خطيرة كنت أقوم بها في عملي وتتسبب في إهدار نسبة تحويل العملاء. أنصح بشدة باقتناء الحزمة ومتابعة نصائح الاستشارات.',
    isApproved: false, // Pending approval for review moderation demo
    createdAt: new Date(2026, 5, 21).toISOString()
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'B4M-100234',
    customerId: 'cust-1',
    customerName: 'خالد اليوسف',
    customerEmail: 'khaled@example.com',
    productId: 'prod-main-book',
    productTitle: 'كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"',
    amount: 49,
    paymentGateway: 'stripe',
    status: 'completed',
    createdAt: new Date(2026, 5, 19, 14, 30).toISOString()
  },
  {
    id: 'B4M-100235',
    customerId: 'cust-2',
    customerName: 'ريم المطيري',
    customerEmail: 'reem.m@example.com',
    productId: 'prod-main-book',
    productTitle: 'كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"',
    amount: 49,
    paymentGateway: 'paypal',
    status: 'completed',
    createdAt: new Date(2026, 5, 20, 11, 15).toISOString()
  },
  {
    id: 'B4M-100236',
    customerId: 'cust-3',
    customerName: 'أنس الحربي',
    customerEmail: 'anas@example.com',
    productId: 'prod-main-book',
    productTitle: 'كتاب "بدون التسويق... كارثة تهدد ثروتك المستقبلية"',
    amount: 49,
    paymentGateway: 'stripe',
    status: 'failed',
    createdAt: new Date(2026, 5, 21, 18, 45).toISOString()
  }
];

const DEFAULT_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    name: 'سلطان القحطاني',
    email: 'sultan@example.com',
    country: 'المملكة العربية السعودية',
    createdAt: new Date(2026, 5, 10).toISOString()
  },
  {
    id: 'sub-2',
    name: 'فاطمة العوضي',
    email: 'fatma.a@example.com',
    country: 'دولة الكويت',
    createdAt: new Date(2026, 5, 14).toISOString()
  }
];

const DEFAULT_CONSULTATIONS: Consultation[] = [
  {
    id: 'con-1',
    customerName: 'فهد الرشيد',
    customerEmail: 'fahad@example.com',
    appointmentDate: '2026-06-25',
    appointmentTime: '18:00',
    status: 'scheduled',
    notes: 'أحتاج مراجعة قمع المبيعات الخاص بمشروعي لبيع البرمجيات كخدمة SaaS',
    createdAt: new Date(2026, 5, 20).toISOString()
  }
];

const DEFAULT_COUPONS: Coupon[] = [
  { code: 'BLACK20', discountPercent: 20, isActive: true },
  { code: 'JASIM10', discountPercent: 10, isActive: true }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Load from LocalStorage or seed defaults
  useEffect(() => {
    const loadData = <T,>(key: string, defaults: T): T => {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(`Error parsing stored key "${key}":`, e);
        }
      }
      localStorage.setItem(key, JSON.stringify(defaults));
      return defaults;
    };

    setProducts(loadData('b4m_products', DEFAULT_PRODUCTS));
    setOrders(loadData('b4m_orders', DEFAULT_ORDERS));
    setConsultations(loadData('b4m_consultations', DEFAULT_CONSULTATIONS));
    setSubscribers(loadData('b4m_subscribers', DEFAULT_SUBSCRIBERS));
    setTestimonials(loadData('b4m_testimonials', DEFAULT_TESTIMONIALS));
    setFaqs(loadData('b4m_faqs', DEFAULT_FAQS));
    setCoupons(loadData('b4m_coupons', DEFAULT_COUPONS));
    
    // Auto login as a default demo admin to make initial inspection easy, or let user switch
    const storedUser = localStorage.getItem('b4m_current_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        // Safe default
      }
    } else {
      // Setup default guest or let it be null. Let's make it null (Guest) by default.
    }
  }, []);

  // Save changes to LocalStorage
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

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
      role: role,
      country: userDetails?.country || 'المملكة العربية السعودية',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    saveToStorage('b4m_current_user', newUser);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('b4m_current_user');
  };

  // Products CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveToStorage('b4m_products', updated);
  };

  const updateProduct = (id: string, prodData: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...prodData } : p);
    setProducts(updated);
    saveToStorage('b4m_products', updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveToStorage('b4m_products', updated);
  };

  // Orders API
  const createOrder = (orderData: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `B4M-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveToStorage('b4m_orders', updated);

    // If order was completed successfully, promote the user is logged in as Customer
    if (newOrder.status === 'completed' && (!currentUser || currentUser.role !== 'admin')) {
      loginAs('customer', {
        id: newOrder.customerId,
        name: newOrder.customerName,
        email: newOrder.customerEmail
      });
    }

    return newOrder;
  };

  const updateOrder = (id: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    setOrders(updated);
    saveToStorage('b4m_orders', updated);
  };

  // Consultations API
  const bookConsultation = (consData: Omit<Consultation, 'id' | 'createdAt' | 'status'>) => {
    const newCons: Consultation = {
      ...consData,
      id: `con-${Math.random().toString(36).substr(2, 9)}`,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    const updated = [newCons, ...consultations];
    setConsultations(updated);
    saveToStorage('b4m_consultations', updated);

    // Call simulated Make / webhook integration here
    triggerWebhookNotification({
      type: 'CONSULTATION_BOOKED',
      title: 'جدولة موعد استشارة جديدة',
      customerName: newCons.customerName,
      customerEmail: newCons.customerEmail,
      date: `${newCons.appointmentDate} مـ في تمام الساعة ${newCons.appointmentTime}`,
      notes: newCons.notes
    });
  };

  const updateConsultationStatus = (id: string, status: Consultation['status']) => {
    const updated = consultations.map(c => c.id === id ? { ...c, status } : c);
    setConsultations(updated);
    saveToStorage('b4m_consultations', updated);
  };

  // Newsletter API
  const subscribeNewsletter = (name: string, email: string, country: string) => {
    // Check if check duplicate email
    if (subscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'مرحبًا بك، هذا البريد الإلكتروني مسجل مسبقًا معنا!' };
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      country,
      createdAt: new Date().toISOString()
    };
    const updated = [newSub, ...subscribers];
    setSubscribers(updated);
    saveToStorage('b4m_subscribers', updated);

    // Simulate Brevo / newsletter hook
    triggerWebhookNotification({
      type: 'NEWSLETTER_SUBSCRIBE',
      title: 'مشترك جديد في النشرة البريدية',
      customerName: name,
      customerEmail: email,
      country: country,
      date: new Date().toLocaleString('ar-SA')
    });

    return { success: true, message: 'تهانينا! تم تسجيل اشتراكك بنجاح في رسائلنا التسويقية الحصرية.' };
  };

  // Testimonials API
  const submitTestimonial = (name: string, country: string, rating: number, comment: string) => {
    const newTestimonial: Testimonial = {
      id: `test-${Math.random().toString(36).substr(2, 9)}`,
      customerName: name,
      avatarUrl: undefined,
      country,
      rating,
      comment,
      isApproved: false, // Must be approved by admin
      createdAt: new Date().toISOString()
    };
    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);
    saveToStorage('b4m_testimonials', updated);
  };

  const approveTestimonial = (id: string) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, isApproved: true } : t);
    setTestimonials(updated);
    saveToStorage('b4m_testimonials', updated);
  };

  const rejectTestimonial = (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    saveToStorage('b4m_testimonials', updated);
  };

  // FAQ API
  const addFAQ = (faqData: Omit<FAQ, 'id'>) => {
    const newFaq: FAQ = {
      ...faqData,
      id: `faq-${Math.random().toString(36).substr(2, 9)}`,
    };
    const updated = [...faqs, newFaq];
    setFaqs(updated);
    saveToStorage('b4m_faqs', updated);
  };

  const updateFAQ = (id: string, faqData: Partial<FAQ>) => {
    const updated = faqs.map(f => f.id === id ? { ...f, ...faqData } : f);
    setFaqs(updated);
    saveToStorage('b4m_faqs', updated);
  };

  const deleteFAQ = (id: string) => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    saveToStorage('b4m_faqs', updated);
  };

  const reorderFAQs = (reorderedFaqs: FAQ[]) => {
    setFaqs(reorderedFaqs);
    saveToStorage('b4m_faqs', reorderedFaqs);
  };

  // Webhook notifier simulator (Brevo / Make integrations)
  const triggerWebhookNotification = (payload: any) => {
    console.log('[INTEGRATION EVENT] Webhook Sent to Make & Brevo:', payload);
    // Visual indicator of simulation
    const alertText = `[تكامل خارجي - محاكاة] تم إرسال إشعار فوري إلى Brevo و Make:\n${payload.title}\nشخص: ${payload.customerName}\nبريد: ${payload.customerEmail}`;
    console.log(alertText);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      products,
      orders,
      consultations,
      subscribers,
      testimonials,
      faqs,
      coupons,
      loginAs,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      createOrder,
      updateOrder,
      bookConsultation,
      updateConsultationStatus,
      subscribeNewsletter,
      submitTestimonial,
      approveTestimonial,
      rejectTestimonial,
      addFAQ,
      updateFAQ,
      deleteFAQ,
      reorderFAQs
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
