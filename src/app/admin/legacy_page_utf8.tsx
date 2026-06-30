"use client";

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import {
  LogOut, Users, DollarSign, ShoppingBag, ShieldCheck,
  TrendingUp, RefreshCw, BarChart3, Filter, CheckCircle2,
  Tag, ClipboardList, Calendar, MessageSquare, HelpCircle,
  Plus, Edit2, Trash2, Search, Download, XCircle, Star,
  ChevronDown, ChevronUp, Eye, EyeOff, Save, X, Settings, GitCompare, Layers, Ticket, Mail
} from 'lucide-react';
import { SiteSettingsTab, ComparisonTab, FunnelsTab, ValueStackTab, CouponsTab } from '../../views/admin/CmsTabs';
import { EmailCampaignsTab } from '../../views/admin/EmailCampaignsTab';
import { AppProvider, FALLBACK_PRODUCTS } from '../../context/AppContext';

// ظ¤ظ¤ظ¤ Types ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

interface Order {
  id: string;
  customer_email: string;
  customer_name?: string;
  country?: string;
  receipt_url?: string;
  product_id: string;
  amount: number;
  payment_gateway: string;
  status: string;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  sale_price?: number;
  salePrice?: number;
  file_url?: string;
  fileUrl?: string;
  payment_link?: string;
  paymentLink?: string;
  is_active?: boolean;
  isActive?: boolean;
  created_at?: string;
  features?: string[];
  chapters?: string[];
}

interface Consultation {
  id: string;
  customer_name: string;
  customer_email: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface Testimonial {
  id: string;
  customer_name: string;
  country: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

interface Subscriber {
  id: string;
  name: string;
  email: string;
  country: string;
  created_at: string;
}

type Tab = 'stats' | 'products' | 'orders' | 'consultations' | 'testimonials' | 'faqs' | 'subscribers' | 'site-settings' | 'comparison' | 'funnels' | 'value-stack' | 'coupons' | 'campaigns';

// ظ¤ظ¤ظ¤ Main Component ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

function AdminDashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  // UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGateway, setFilterGateway] = useState<'all'|'stripe'|'paypal'|'spaceremit'>('all');

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ title: '', description: '', price: 49, sale_price: 0, file_url: '', payment_link: '', is_active: true, features: '', chapters: '' });
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    try {
      setUploadingFile(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      setProductForm({...productForm, file_url: publicUrl});
      alert('╪ز┘à ╪▒┘╪╣ ╪د┘┘à┘┘ ╪ذ┘╪ش╪د╪ص!');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert('╪ص╪»╪س ╪«╪╖╪ث ╪ث╪س┘╪د╪ة ╪▒┘╪╣ ╪د┘┘à┘┘: ' + error.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const [settingsForm, setSettingsForm] = useState({
    site_name: '',
    site_description: '',
    contact_email: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    ga_id: '',
    gsc_id: '',
    gtm_id: ''
  });

  // FAQ form
  const [showFAQForm, setShowFAQForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', order_index: 1 });

  // ظ¤ظ¤ظ¤ Data fetching ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

  const fetchAllData = useCallback(async () => {
    setRefreshing(true);

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Combine hardcoded defaults with dynamic env variables
    const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS 
      ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) 
      : [];
    const adminEmails = ['info@black4me.com', 'admin@black4me.com', 'admin@admin.com', 'test@test.com', 'black4mestore@gmail.com', ...envEmails];
    
    if (authError || !user || !user.email || !adminEmails.includes(user.email.toLowerCase())) {
      router.push('/login');
      return;
    }

    // Fetch all tables in parallel
    const [ordersRes, productsRes, consultRes, testimonRes, faqsRes, subsRes, settingsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('consultations').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('faqs').select('*').order('order_index', { ascending: true }),
      supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
      supabase.from('settings').select('*')
    ]);

    if (ordersRes.data) setOrders(ordersRes.data);
    if (productsRes.data && productsRes.data.length > 0) {
      setProducts(productsRes.data);
    } else {
      setProducts(FALLBACK_PRODUCTS);
    }
    if (consultRes.data) setConsultations(consultRes.data);
    if (testimonRes.data) setTestimonials(testimonRes.data);
    if (faqsRes.data) setFaqs(faqsRes.data);
    if (subsRes.data) setSubscribers(subsRes.data);
    
    if (settingsRes.data) {
        const settingsMap = settingsRes.data.reduce((acc, curr) => ({ ...acc, [curr.setting_key]: curr.setting_value }), {} as any);
        setSettingsForm({
          site_name: settingsMap['site_name'] || '',
          site_description: settingsMap['site_description'] || '',
          contact_email: settingsMap['contact_email'] || '',
          seo_title: settingsMap['seo_title'] || '',
          seo_description: settingsMap['seo_description'] || '',
          seo_keywords: settingsMap['seo_keywords'] || '',
          ga_id: settingsMap['ga_id'] || '',
          gsc_id: settingsMap['gsc_id'] || '',
          gtm_id: settingsMap['gtm_id'] || ''
        });
    }

    setLoading(false);
    setRefreshing(false);
  }, [router]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleApproveOrder = async (orderId: string) => {
    try {
      const res = await fetch('/api/order/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData(); // Refresh the data to show it's completed
      } else {
        alert('┘╪┤┘ ╪د┘╪د╪╣╪ز┘à╪د╪»: ' + data.error);
      }
    } catch (e) {
      console.error(e);
      alert('╪ص╪»╪س ╪«╪╖╪ث ╪ث╪س┘╪د╪ة ╪د┘╪د╪ز╪╡╪د┘ ╪ذ╪د┘╪«╪د╪»┘à');
    }
  };
  
  const handleSettingsSave = async () => {
      const settingsToUpdate = [
        { setting_key: 'site_name', setting_value: settingsForm.site_name },
        { setting_key: 'site_description', setting_value: settingsForm.site_description },
        { setting_key: 'contact_email', setting_value: settingsForm.contact_email },
        { setting_key: 'seo_title', setting_value: settingsForm.seo_title },
        { setting_key: 'seo_description', setting_value: settingsForm.seo_description },
        { setting_key: 'seo_keywords', setting_value: settingsForm.seo_keywords },
        { setting_key: 'ga_id', setting_value: settingsForm.ga_id },
        { setting_key: 'gsc_id', setting_value: settingsForm.gsc_id },
        { setting_key: 'gtm_id', setting_value: settingsForm.gtm_id }
      ];
      for (const s of settingsToUpdate) {
          await supabase.from('settings').upsert(s, { onConflict: 'setting_key' });
      }
      alert('╪ز┘à ╪ص┘╪╕ ╪د┘╪ح╪╣╪»╪د╪»╪د╪ز');
      fetchAllData();
  };

  // ظ¤ظ¤ظ¤ KPIs ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

  const totalRevenue = orders.reduce((s, o) => s + (o.amount || 0), 0);
  const uniqueCustomers = new Set(orders.map(o => o.customer_email)).size;

  // ظ¤ظ¤ظ¤ Product CRUD ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ title: '', description: '', price: 49, sale_price: 0, file_url: '', payment_link: '', is_active: true, features: '', chapters: '' });
    setShowProductForm(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ 
      title: p.title, 
      description: p.description, 
      price: p.price, 
      sale_price: p.salePrice || 0, 
      file_url: p.fileUrl || '', 
      payment_link: p.paymentLink || '', 
      is_active: p.isActive ?? p.is_active ?? true,
      features: p.features ? p.features.join('\n') : '',
      chapters: p.chapters ? p.chapters.join('\n') : ''
    });
    setShowProductForm(true);
  };

  const handleProductSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      title: productForm.title,
      description: productForm.description,
      price: productForm.price,
      sale_price: productForm.sale_price > 0 ? productForm.sale_price : null,
      file_url: productForm.file_url,
      payment_link: productForm.payment_link,
      is_active: productForm.is_active,
      features: productForm.features.split('\n').map(f => f.trim()).filter(Boolean),
      chapters: productForm.chapters.split('\n').map(c => c.trim()).filter(Boolean)
    };
    
    if (editingProduct) {
      // Using upsert in case the product is a fallback product that doesn't exist in the DB yet
      await supabase.from('products').upsert({ ...payload, id: editingProduct.id });
    } else {
      await supabase.from('products').insert([{ ...payload, id: `prod-${Date.now()}` }]);
    }
    setShowProductForm(false);
    fetchAllData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('┘ç┘ ╪ث┘╪ز ┘à╪ز╪ث┘â╪» ┘à┘ ╪ص╪░┘ ┘ç╪░╪د ╪د┘┘à┘╪ز╪ش╪ا')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchAllData();
  };

  const toggleProductActive = async (p: Product) => {
    await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id);
    fetchAllData();
  };

  // ظ¤ظ¤ظ¤ FAQ CRUD ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

  const openAddFAQ = () => {
    setEditingFAQ(null);
    setFaqForm({ question: '', answer: '', order_index: faqs.length + 1 });
    setShowFAQForm(true);
  };

  const openEditFAQ = (f: FAQ) => {
    setEditingFAQ(f);
    setFaqForm({ question: f.question, answer: f.answer, order_index: f.order_index });
    setShowFAQForm(true);
  };

  const handleFAQSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFAQ) {
      await supabase.from('faqs').update(faqForm).eq('id', editingFAQ.id);
    } else {
      await supabase.from('faqs').insert([faqForm]);
    }
    setShowFAQForm(false);
    fetchAllData();
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm('┘ç┘ ╪ث┘╪ز ┘à╪ز╪ث┘â╪» ┘à┘ ╪ص╪░┘ ┘ç╪░╪د ╪د┘╪│╪ج╪د┘╪ا')) return;
    await supabase.from('faqs').delete().eq('id', id);
    fetchAllData();
  };

  // ظ¤ظ¤ظ¤ Testimonial moderation ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

  const toggleTestimonial = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ is_approved: !t.is_approved }).eq('id', t.id);
    fetchAllData();
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('╪ص╪░┘ ┘ç╪░┘ç ╪د┘╪┤┘ç╪د╪»╪ر╪ا')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    fetchAllData();
  };

  // ظ¤ظ¤ظ¤ Consultation actions ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

  const updateConsultationStatus = async (id: string, status: string) => {
    await supabase.from('consultations').update({ status }).eq('id', id);
    fetchAllData();
  };

  // ظ¤ظ¤ظ¤ CSV Export ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

  const exportCSV = (type: 'orders' | 'orders-spaceremit' | 'subscribers') => {
    let csv = '';
    if (type === 'orders') {
      csv = 'ID,Name,Email,Country,Amount,Gateway,Status,Date\n';
      orders.forEach(o => { csv += `"${o.id}","${o.customer_name||''}","${o.customer_email}","${o.country||''}","${o.amount}","${o.payment_gateway}","${o.status}","${o.created_at}"\n`; });
    } else if (type === 'orders-spaceremit') {
      csv = 'ID,Name,Email,Country,Amount,Gateway,Status,Date,Receipt URL\n';
      const spaceOrders = orders.filter(o => o.payment_gateway === 'spaceremit');
      spaceOrders.forEach(o => { csv += `"${o.id}","${o.customer_name||''}","${o.customer_email}","${o.country||''}","${o.amount}","${o.payment_gateway}","${o.status}","${o.created_at}","${o.receipt_url||''}"\n`; });
    } else {
      csv = 'ID,Name,Email,Country,Date\n';
      subscribers.forEach(s => { csv += `"${s.id}","${s.name}","${s.email}","${s.country}","${s.created_at}"\n`; });
    }
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `b4m_${type}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  // ظ¤ظ¤ظ¤ Loading state ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#6C3BFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ظ¤ظ¤ظ¤ Tabs config ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: 'stats', label: '┘╪╕╪▒╪ر ╪╣╪د┘à╪ر', icon: BarChart3 },
    { id: 'products', label: '╪د┘┘à┘╪ز╪ش╪د╪ز', icon: Tag, count: products.length },
    { id: 'orders', label: '╪د┘╪╖┘╪ذ╪د╪ز', icon: ShoppingBag, count: orders.length },
    { id: 'consultations', label: '╪د┘╪د╪│╪ز╪┤╪د╪▒╪د╪ز', icon: Calendar, count: consultations.length },
    { id: 'testimonials', label: '╪د┘╪ت╪▒╪د╪ة', icon: MessageSquare, count: testimonials.length },
    { id: 'faqs', label: '╪د┘╪ث╪│╪خ┘╪ر ╪د┘╪┤╪د╪خ╪╣╪ر', icon: HelpCircle, count: faqs.length },
    { id: 'subscribers', label: '╪د┘┘à╪┤╪ز╪▒┘â┘ê┘', icon: Users, count: subscribers.length },
    { id: 'campaigns', label: '╪د┘╪ز╪│┘ê┘è┘é ╪د┘╪ذ╪▒┘è╪»┘è', icon: Mail },
    { id: 'site-settings', label: '╪ح╪╣╪»╪د╪»╪د╪ز ╪د┘┘à┘ê┘é╪╣ ┘ê╪د┘┘╪╡┘ê╪╡', icon: Settings },
    { id: 'comparison', label: '╪ش╪»┘ê┘ ╪د┘┘à┘é╪د╪▒┘╪ر', icon: GitCompare },
    { id: 'funnels', label: '┘à╪▒╪د╪ص┘ ╪د┘┘┘┘', icon: Layers },
    { id: 'value-stack', label: '╪د┘╪ص╪▓┘à╪ر ╪د┘┘à╪╢╪د┘╪ر', icon: DollarSign },
    { id: 'coupons', label: '┘â┘ê╪ذ┘ê┘╪د╪ز ╪د┘╪«╪╡┘à', icon: Ticket },
  ];

  // ظ¤ظ¤ظ¤ Render ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤ظ¤

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#050505] text-white font-sans relative" dir="rtl">
        {/* Background Decorative Gradients */}
        <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-[#6C3BFF]/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        <div className="fixed bottom-0 left-1/4 w-[500px] h-[500px] bg-[#F5C542]/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {/* ظ¤ظ¤ظ¤ Header ظ¤ظ¤ظ¤ */}
      <header className="bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6C3BFF]/30 to-[#F5C542]/20 border border-[#6C3BFF]/40 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#F5C542]" />
            </div>
            <div>
              <h1 className="text-base font-black text-white tracking-tight">BLACK4ME <span className="opacity-40 font-light">HQ</span></h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[9px] text-[#6C3BFF] font-mono uppercase tracking-widest">Super Admin</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={fetchAllData} className={`p-2 rounded-xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition ${refreshing ? 'animate-spin text-[#F5C542]' : ''}`}>
              <RefreshCw className="w-4 h-4" />
            </button>
            <a href="/" className="text-xs font-bold text-gray-400 hover:text-white border border-white/5 hover:bg-white/5 px-3 py-2 rounded-xl transition">
              ╪د┘┘à┘ê┘é╪╣ ╪د┘╪▒╪خ┘è╪│┘è
            </a>
            <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/20 px-3 py-2 rounded-xl transition">
              <LogOut className="w-4 h-4" />
              ╪«╪▒┘ê╪ش
            </button>
          </div>
        </div>
      </header>

      {/* ظ¤ظ¤ظ¤ Tab Nav ظ¤ظ¤ظ¤ */}
      <div className="bg-[#0A0A0A]/60 backdrop-blur-md border-b border-white/5 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-[#6C3BFF] text-white shadow-lg shadow-[#6C3BFF]/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/5'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ظ¤ظ¤ظ¤ Main Content ظ¤ظ¤ظ¤ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ
            TAB 1: ┘╪╕╪▒╪ر ╪╣╪د┘à╪ر ╪╣┘┘ë ╪د┘╪ث╪»╪د╪ة
        ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">┘╪╕╪▒╪ر ╪╣╪د┘à╪ر ╪╣┘┘ë ╪د┘╪ث╪»╪د╪ة</h2>
              <p className="text-gray-400 text-sm">┘à╪▒╪د┘é╪ذ╪ر ╪ص┘è╪ر ┘┘┘à╪ذ┘è╪╣╪د╪ز ┘ê╪د┘╪ذ┘è╪د┘╪د╪ز ╪د┘┘â╪د┘à┘╪ر ┘┘┘à┘╪╡╪ر.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: '╪ح╪ش┘à╪د┘┘è ╪د┘╪ح┘è╪▒╪د╪»╪د╪ز', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
                { label: '╪د┘╪╣┘à┘╪د╪ة ╪د┘┘╪┤╪╖┘ê┘', value: uniqueCustomers, icon: Users, color: 'text-[#6C3BFF]', bg: 'bg-[#6C3BFF]/10', border: 'border-[#6C3BFF]/20' },
                { label: '╪د┘╪╖┘╪ذ╪د╪ز ╪د┘┘╪د╪ش╪ص╪ر', value: orders.length, icon: ShoppingBag, color: 'text-[#F5C542]', bg: 'bg-[#F5C542]/10', border: 'border-[#F5C542]/20' },
                { label: '╪د┘╪د╪│╪ز╪┤╪د╪▒╪د╪ز', value: consultations.length, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className="bg-[#0a0a0a]/80 backdrop-blur-lg border border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-l ${kpi.color.replace('text-', 'from-').replace('-400', '-500')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-bold text-gray-400 group-hover:text-gray-300 transition-colors">{kpi.label}</p>
                      <div className={`w-10 h-10 rounded-xl ${kpi.bg} border ${kpi.border} flex items-center justify-center shadow-inner`}>
                        <Icon className={`w-5 h-5 ${kpi.color}`} />
                      </div>
                    </div>
                    <p className={`text-3xl font-black font-mono ${kpi.color}`}>{kpi.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Recent orders table */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">╪ت╪«╪▒ ╪د┘╪╖┘╪ذ╪د╪ز</h3>
                <button onClick={() => exportCSV('orders')} className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 px-3 py-2 rounded-xl transition">
                  <Download className="w-3.5 h-3.5" /> ╪ز╪╡╪»┘è╪▒ CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="text-xs text-gray-500 border-b border-white/10">
                    <tr>
                      <th className="pb-3 font-medium px-2">╪د┘╪╣┘à┘è┘</th>
                      <th className="pb-3 font-medium px-2">╪د┘┘à╪ذ┘╪║</th>
                      <th className="pb-3 font-medium px-2">╪د┘╪ذ┘ê╪د╪ذ╪ر</th>
                      <th className="pb-3 font-medium px-2">╪د┘╪ز╪د╪▒┘è╪«</th>
                      <th className="pb-3 font-medium px-2">╪د┘╪ص╪د┘╪ر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.length === 0 ? (
                      <tr><td colSpan={5} className="py-8 text-center text-gray-500 text-xs">┘╪د ╪ز┘ê╪ش╪» ╪╖┘╪ذ╪د╪ز ╪ذ╪╣╪»</td></tr>
                    ) : orders.slice(0, 10).map(o => (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-2 text-xs text-gray-300 font-mono">{o.customer_email}</td>
                        <td className="py-3 px-2 font-black text-[#F5C542] font-mono">${o.amount}</td>
                        <td className="py-3 px-2 text-xs text-gray-400 uppercase">{o.payment_gateway}</td>
                        <td className="py-3 px-2 text-xs text-gray-500 font-mono">{new Date(o.created_at).toLocaleDateString('en-GB')}</td>
                        <td className="py-3 px-2">
                          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" /> ┘à┘â╪ز┘à┘
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ
            TAB 2: ╪ح╪»╪د╪▒╪ر ╪د┘┘à┘╪ز╪ش╪د╪ز
        ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">╪ح╪»╪د╪▒╪ر ╪د┘┘à┘╪ز╪ش╪د╪ز ╪د┘╪▒┘é┘à┘è╪ر</h2>
                <p className="text-gray-400 text-sm">╪ث╪╢┘ ┘ê╪╣╪»┘ّ┘ ┘ê╪ز╪ص┘â┘à ┘┘è ╪د┘┘â╪ز╪ذ ┘ê╪د┘╪«╪»┘à╪د╪ز ╪د┘┘à╪╣╪▒┘ê╪╢╪ر ┘┘è ╪د┘┘à┘ê┘é╪╣.</p>
              </div>
              <button onClick={openAddProduct} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
                <Plus className="w-4 h-4" /> ┘à┘╪ز╪ش ╪ش╪»┘è╪»
              </button>
            </div>

            {/* Product Form */}
            {showProductForm && (
              <div className="bg-[#0a0a0a] border border-[#F5C542]/30 rounded-2xl p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-[#F5C542]">{editingProduct ? '╪ز╪╣╪»┘è┘ ╪د┘┘à┘╪ز╪ش' : '╪ح╪╢╪د┘╪ر ┘à┘╪ز╪ش ╪ش╪»┘è╪»'}</h3>
                  <button onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleProductSave} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">╪د╪│┘à ╪د┘┘à┘╪ز╪ش *</label>
                      <input required type="text" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" placeholder="┘à╪س╪د┘: ┘â╪ز╪د╪ذ ╪ث╪│╪▒╪د╪▒ ╪د┘╪ز╪│┘ê┘è┘é ╪د┘╪▒┘é┘à┘è" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">┘ê╪╡┘ ╪د┘┘à┘╪ز╪ش *</label>
                      <textarea required rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" placeholder="╪د┘â╪ز╪ذ ┘ê╪╡┘╪د┘ï ╪┤╪د┘à┘╪د┘ï ┘┘┘à┘╪ز╪ش ┘ê┘é┘è┘à╪ز┘ç..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">╪د┘┘à┘à┘è╪▓╪د╪ز (┘à╪د ╪د┘╪░┘è ╪│┘è╪ز╪╣┘┘à┘ç╪ا) - ┘â┘ ┘à┘è╪▓╪ر ┘┘è ╪│╪╖╪▒ ┘à┘┘╪╡┘</label>
                      <textarea rows={4} value={productForm.features} onChange={e => setProductForm({...productForm, features: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" placeholder="┘à┘è╪▓╪ر 1&#10;┘à┘è╪▓╪ر 2&#10;┘à┘è╪▓╪ر 3..." />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">╪د┘┘╪╡┘ê┘ / ╪د┘┘à╪ص╪ز┘ê┘è╪د╪ز - ┘â┘ ┘╪╡┘ ┘┘è ╪│╪╖╪▒ ┘à┘┘╪╡┘</label>
                      <textarea rows={4} value={productForm.chapters} onChange={e => setProductForm({...productForm, chapters: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" placeholder="╪د┘┘╪╡┘ ╪د┘╪ث┘ê┘: ┘â╪░╪د...&#10;╪د┘┘╪╡┘ ╪د┘╪س╪د┘┘è: ┘â╪░╪د..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">╪د┘╪│╪╣╪▒ ╪د┘╪ث╪╡┘┘è ($)</label>
                      <input type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">╪│╪╣╪▒ ╪د┘╪╣╪▒╪╢ ($) ظ¤ ╪د╪ز╪▒┘â┘ç ╪╡┘╪▒╪د┘ï ╪ح┘ ┘╪د ┘è┘ê╪ش╪»</label>
                      <input type="number" value={productForm.sale_price} onChange={e => setProductForm({...productForm, sale_price: Number(e.target.value)})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">╪▒╪د╪ذ╪╖ ╪د┘╪»┘╪╣ (Stripe / PayPal)</label>
                      <input type="url" value={productForm.payment_link} onChange={e => setProductForm({...productForm, payment_link: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" placeholder="https://buy.stripe.com/..." dir="ltr" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">╪▒┘╪╣ ┘à┘┘ ╪د┘┘à┘╪ز╪ش (┘â╪ز╪د╪ذ╪î ┘à┘┘ ┘à╪╢╪║┘ê╪╖╪î ╪د┘╪«)</label>
                      <div className="flex gap-2 items-center">
                        <input type="file" onChange={handleFileUpload} disabled={uploadingFile}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#6C3BFF] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#6C3BFF] file:text-white hover:file:bg-[#5b32d9] cursor-pointer" />
                        {uploadingFile && <span className="text-xs text-[#F5C542] whitespace-nowrap">╪ش╪د╪▒┘è ╪د┘╪▒┘╪╣...</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">╪ث┘ê ╪▒╪د╪ذ╪╖ ╪د┘╪ز╪ص┘à┘è┘ ╪د┘┘à╪ذ╪د╪┤╪▒ (PDF / Google Drive)</label>
                      <input type="url" value={productForm.file_url} onChange={e => setProductForm({...productForm, file_url: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" placeholder="https://drive.google.com/..." dir="ltr" />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <input type="checkbox" id="isActive" checked={productForm.is_active} onChange={e => setProductForm({...productForm, is_active: e.target.checked})} className="w-4 h-4 accent-[#6C3BFF]" />
                      <label htmlFor="isActive" className="text-sm text-gray-300 cursor-pointer">┘à┘╪┤┘ê╪▒ ┘ê┘à╪▒╪خ┘è ┘┘è ╪د┘┘à┘ê┘é╪╣</label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-6 py-2.5 rounded-xl transition">
                      <Save className="w-4 h-4" /> ╪ص┘╪╕ ╪د┘┘à┘╪ز╪ش
                    </button>
                    <button type="button" onClick={() => setShowProductForm(false)} className="px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition">
                      ╪ح┘╪║╪د╪ة
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.length === 0 ? (
                <div className="sm:col-span-3 bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
                  <Tag className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">┘╪د ╪ز┘ê╪ش╪» ┘à┘╪ز╪ش╪د╪ز ╪ذ╪╣╪». ╪ث╪╢┘ ╪ث┘ê┘ ┘à┘╪ز╪ش!</p>
                </div>
              ) : products.map(p => (
                <div key={p.id} className={`bg-[#0a0a0a] border rounded-2xl p-5 transition-all duration-300 flex flex-col ${p.is_active ? 'border-white/10 hover:border-[#F5C542]/30' : 'border-white/5 opacity-60'}`}>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white leading-snug">{p.title}</h3>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${(p.isActive ?? p.is_active) ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'}`}>
                        {(p.isActive ?? p.is_active) ? '┘à┘╪┤┘ê╪▒' : '┘à╪«┘┘è'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{p.description}</p>
                    <div className="flex items-center gap-2 pt-1">
                      {p.salePrice || p.sale_price ? (
                        <>
                          <span className="text-[#F5C542] font-black font-mono text-base">${p.salePrice || p.sale_price}</span>
                          <span className="text-gray-500 font-mono text-xs line-through">${p.price}</span>
                        </>
                      ) : (
                        <span className="text-[#F5C542] font-black font-mono text-base">${p.price}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/5 mt-4">
                    <button onClick={() => openEditProduct(p)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white border border-white/10 hover:border-[#6C3BFF]/40 hover:bg-[#6C3BFF]/10 py-2 rounded-xl transition">
                      <Edit2 className="w-3.5 h-3.5" /> ╪ز╪╣╪»┘è┘
                    </button>
                    <button onClick={() => toggleProductActive(p)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl transition border" style={{ color: (p.isActive ?? p.is_active) ? '#F97316' : '#22C55E', borderColor: (p.isActive ?? p.is_active) ? '#F97316' : '#22C55E', background: (p.isActive ?? p.is_active) ? 'rgba(249,115,22,0.05)' : 'rgba(34,197,94,0.05)' }}>
                      {(p.isActive ?? p.is_active) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {(p.isActive ?? p.is_active) ? '╪ح╪«┘╪د╪ة' : '┘╪┤╪▒'}
                    </button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10 rounded-xl transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ
            TAB 3: ╪د┘╪╖┘╪ذ╪د╪ز
        ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">╪ح╪»╪د╪▒╪ر ╪د┘╪╖┘╪ذ╪د╪ز ┘ê╪د┘┘à╪ذ┘è╪╣╪د╪ز</h2>
                <p className="text-gray-400 text-sm">╪│╪ش┘ ┘â╪د┘à┘ ┘╪ش┘à┘è╪╣ ╪╣┘à┘┘è╪د╪ز ╪د┘╪┤╪▒╪د╪ة ╪╣╪ذ╪▒ ╪د┘┘à┘╪╡╪ر.</p>
              </div>
              <button onClick={() => exportCSV('orders')} className="flex items-center gap-2 text-xs font-bold text-gray-300 border border-white/10 hover:bg-white/5 px-4 py-2.5 rounded-xl transition">
                <Download className="w-4 h-4" /> ╪ز╪╡╪»┘è╪▒ CSV
              </button>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button onClick={() => setFilterGateway('all')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterGateway === 'all' ? 'bg-[#6C3BFF] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>╪د┘┘â┘</button>
                  <button onClick={() => setFilterGateway('stripe')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterGateway === 'stripe' ? 'bg-[#6C3BFF] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Stripe</button>
                  <button onClick={() => setFilterGateway('paypal')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterGateway === 'paypal' ? 'bg-[#6C3BFF] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>PayPal</button>
                  <button onClick={() => setFilterGateway('spaceremit')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterGateway === 'spaceremit' ? 'bg-[#6C3BFF] text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>SpaceRemit</button>
                </div>
                <button onClick={() => exportCSV('orders-spaceremit')} className="flex items-center gap-2 text-xs font-bold text-gray-800 bg-[#F5C542] hover:bg-yellow-400 px-4 py-2.5 rounded-xl transition">
                  <Download className="w-4 h-4" /> ╪ز┘é╪▒┘è╪▒ ╪│╪ذ┘è╪│ ╪▒┘è┘à┘è╪ز (CSV)
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="text-xs text-gray-500 border-b border-white/10 bg-black/30 whitespace-nowrap">
                    <tr>
                      <th className="py-4 px-4 font-medium">╪د┘╪╣┘à┘è┘</th>
                      <th className="py-4 px-4 font-medium">╪د┘╪»┘ê┘╪ر</th>
                      <th className="py-4 px-4 font-medium">╪د┘┘à┘╪ز╪ش</th>
                      <th className="py-4 px-4 font-medium">╪د┘┘à╪ذ┘╪║</th>
                      <th className="py-4 px-4 font-medium">╪د┘╪ذ┘ê╪د╪ذ╪ر</th>
                      <th className="py-4 px-4 font-medium">╪د┘╪ز╪د╪▒┘è╪« ┘ê╪د┘┘ê┘é╪ز</th>
                      <th className="py-4 px-4 font-medium">╪د┘╪ص╪د┘╪ر</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.filter(o => filterGateway === 'all' || o.payment_gateway === filterGateway).length === 0 ? (
                      <tr><td colSpan={7} className="py-12 text-center text-gray-500 text-xs">┘╪د ╪ز┘ê╪ش╪» ╪╖┘╪ذ╪د╪ز ╫ئ╫ة╪ش┘╪ر</td></tr>
                    ) : orders.filter(o => filterGateway === 'all' || o.payment_gateway === filterGateway).map(o => (
                      <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 text-xs">
                          <div className="font-bold text-white">{o.customer_name || '╪ذ╪»┘ê┘ ╪د╪│┘à'}</div>
                          <div className="text-gray-400 font-mono mt-0.5 text-[10px]">{o.customer_email}</div>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-300">{o.country || '╪║┘è╪▒ ┘à╪ص╪»╪»'}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-400 font-mono">{o.product_id?.substring(0, 20)}...</td>
                        <td className="py-3.5 px-4 font-black text-[#F5C542] font-mono">${o.amount}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-400 uppercase font-bold">{o.payment_gateway}</td>
                        <td className="py-3.5 px-4 text-[11px] text-gray-500 font-mono whitespace-nowrap">
                          {new Date(o.created_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            o.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                            o.status === 'pending_verification' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {o.status === 'completed' ? <><CheckCircle2 className="w-3 h-3" /> ┘à┘â╪ز┘à┘</> : 
                             o.status === 'pending_verification' ? '┘é┘è╪» ╪د┘┘à╪▒╪د╪ش╪╣╪ر' : 
                             '┘à┘╪║┘ë / ┘╪┤┘'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs">
                          {o.status === 'pending_verification' && (
                            <div className="flex flex-col gap-1 items-end">
                              {(o as any).receipt_url && (
                                <a href={(o as any).receipt_url} target="_blank" rel="noreferrer" className="text-brand-gold hover:underline">
                                  ╪╣╪▒╪╢ ╪د┘╪ح┘è╪╡╪د┘
                                </a>
                              )}
                              <button 
                                onClick={() => handleApproveOrder(o.id)}
                                className="text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-lg hover:bg-green-500/20 transition cursor-pointer mt-1"
                              >
                                ╪د╪╣╪ز┘à╪د╪» ┘ê╪ح╪▒╪│╪د┘
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ
            TAB 4: ╪د┘╪د╪│╪ز╪┤╪د╪▒╪د╪ز
        ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">╪ح╪»╪د╪▒╪ر ╪ش┘╪│╪د╪ز ╪د┘╪د╪│╪ز╪┤╪د╪▒╪ر</h2>
              <p className="text-gray-400 text-sm">┘à┘ê╪د╪╣┘è╪» ╪د┘╪ش┘╪│╪د╪ز ╪د┘┘╪▒╪»┘è╪ر ╪د┘┘à╪ص╪ش┘ê╪▓╪ر ┘à╪╣ ╪د┘╪╣┘à┘╪د╪ة.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {consultations.length === 0 ? (
                <div className="sm:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
                  <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">┘╪د ╪ز┘ê╪ش╪» ╪د╪│╪ز╪┤╪د╪▒╪د╪ز ┘à╪ص╪ش┘ê╪▓╪ر ╪ذ╪╣╪».</p>
                </div>
              ) : consultations.map(c => (
                <div key={c.id} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{c.customer_name}</h3>
                      <p className="text-xs text-[#6C3BFF] font-mono">{c.customer_email}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${
                      c.status === 'scheduled' ? 'bg-[#F5C542]/10 text-[#F5C542] border border-[#F5C542]/20' :
                      c.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {c.status === 'scheduled' ? '┘à╪ص╪ش┘ê╪▓' : c.status === 'completed' ? '┘à┘â╪ز┘à┘' : '┘à┘╪║┘ë'}
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-gray-400"><span className="text-gray-500">╪د┘┘à┘ê╪╣╪»: </span><span className="text-white font-mono">{c.appointment_date} ظ¤ {c.appointment_time}</span></p>
                    {c.notes && <p className="text-gray-400"><span className="text-gray-500">┘à┘╪د╪ص╪╕╪د╪ز: </span>{c.notes}</p>}
                  </div>
                  {c.status === 'scheduled' && (
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <button onClick={() => updateConsultationStatus(c.id, 'completed')} className="flex-1 text-xs font-bold text-green-400 border border-green-500/20 hover:bg-green-500/10 py-2 rounded-xl transition">
                        ظ£ô ┘à┘â╪ز┘à┘╪ر
                      </button>
                      <button onClick={() => updateConsultationStatus(c.id, 'cancelled')} className="flex-1 text-xs font-bold text-red-400 border border-red-500/20 hover:bg-red-500/10 py-2 rounded-xl transition">
                        ظ£ـ ╪ح┘╪║╪د╪ة
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ
            TAB 5: ╪د┘╪ت╪▒╪د╪ة ┘ê╪د┘╪┤┘ç╪د╪»╪د╪ز
        ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-white mb-1">╪ح╪»╪د╪▒╪ر ╪ت╪▒╪د╪ة ╪د┘╪╣┘à┘╪د╪ة</h2>
              <p className="text-gray-400 text-sm">╪د╪╣╪ز┘à╪» ╪ث┘ê ╪ث╪«┘┘ ╪┤┘ç╪د╪»╪د╪ز ╪د┘╪╣┘à┘╪د╪ة ╪د┘┘à╪╣╪▒┘ê╪╢╪ر ┘┘è ╪د┘╪╡┘╪ص╪ر ╪د┘╪▒╪خ┘è╪│┘è╪ر.</p>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="text-xs text-gray-500 border-b border-white/10 bg-black/30">
                    <tr>
                      <th className="py-4 px-4 font-medium">╪د┘╪╣┘à┘è┘</th>
                      <th className="py-4 px-4 font-medium">╪د┘╪»┘ê┘╪ر</th>
                      <th className="py-4 px-4 font-medium">╪د┘╪ز┘é┘è┘è┘à</th>
                      <th className="py-4 px-4 font-medium">╪د┘╪ز╪╣┘┘è┘é</th>
                      <th className="py-4 px-4 font-medium">╪د┘╪ص╪د┘╪ر</th>
                      <th className="py-4 px-4 font-medium">╪ح╪ش╪▒╪د╪ة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {testimonials.length === 0 ? (
                      <tr><td colSpan={6} className="py-12 text-center text-gray-500 text-xs">┘╪د ╪ز┘ê╪ش╪» ╪ت╪▒╪د╪ة ┘à╪│╪ش┘╪ر</td></tr>
                    ) : testimonials.map(t => (
                      <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 text-sm font-bold text-white">{t.customer_name}</td>
                        <td className="py-3.5 px-4 text-xs text-gray-400">{t.country}</td>
                        <td className="py-3.5 px-4">
                          <span className="text-[#F5C542] font-bold text-xs">{'ظءà'.repeat(t.rating)}{'ظء'.repeat(5 - t.rating)}</span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-gray-400 max-w-xs truncate">{t.comment}</td>
                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${t.is_approved ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                            {t.is_approved ? '┘à╪╣╪ز┘à╪»' : '┘é┘è╪» ╪د┘┘à╪▒╪د╪ش╪╣╪ر'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => toggleTestimonial(t)} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition ${t.is_approved ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'}`}>
                              {t.is_approved ? '╪ح╪«┘╪د╪ة' : '╪د╪╣╪ز┘à╪د╪»'}
                            </button>
                            <button onClick={() => deleteTestimonial(t.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ
            TAB 6: ╪د┘╪ث╪│╪خ┘╪ر ╪د┘╪┤╪د╪خ╪╣╪ر
        ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">╪ح╪»╪د╪▒╪ر ╪د┘╪ث╪│╪خ┘╪ر ╪د┘╪┤╪د╪خ╪╣╪ر</h2>
                <p className="text-gray-400 text-sm">╪ث╪╢┘ ┘ê╪╣╪»┘ّ┘ ╪د┘╪ث╪│╪خ┘╪ر ╪د┘┘à╪╣╪▒┘ê╪╢╪ر ┘┘è ╪╡┘╪ص╪ر ╪د┘┘ç╪ذ┘ê╪╖.</p>
              </div>
              <button onClick={openAddFAQ} className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black text-sm px-4 py-2.5 rounded-xl transition">
                <Plus className="w-4 h-4" /> ╪│╪ج╪د┘ ╪ش╪»┘è╪»
              </button>
            </div>

            {/* FAQ Form */}
            {showFAQForm && (
              <div className="bg-[#0a0a0a] border border-[#F5C542]/30 rounded-2xl p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-[#F5C542]">{editingFAQ ? '╪ز╪╣╪»┘è┘ ╪د┘╪│╪ج╪د┘' : '╪ح╪╢╪د┘╪ر ╪│╪ج╪د┘ ╪ش╪»┘è╪»'}</h3>
                  <button onClick={() => setShowFAQForm(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleFAQSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">╪د┘╪│╪ج╪د┘ *</label>
                    <input required type="text" value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" placeholder="┘à╪س╪د┘: ┘ç┘ ┘è╪ز╪╖┘╪ذ ╪«╪ذ╪▒╪ر ╪ز┘é┘┘è╪ر╪ا" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">╪د┘╪ش┘ê╪د╪ذ *</label>
                    <textarea required rows={4} value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF] resize-none" placeholder="╪د┘â╪ز╪ذ ╪د┘╪ح╪ش╪د╪ذ╪ر ╪د┘╪ز┘╪╡┘è┘┘è╪ر ┘ç┘╪د..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5">╪د┘╪ز╪▒╪ز┘è╪ذ</label>
                    <input type="number" value={faqForm.order_index} onChange={e => setFaqForm({...faqForm, order_index: Number(e.target.value)})}
                      className="w-32 bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#6C3BFF]" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="flex items-center gap-2 bg-[#F5C542] hover:bg-yellow-400 text-black font-black px-6 py-2.5 rounded-xl transition">
                      <Save className="w-4 h-4" /> ╪ص┘╪╕
                    </button>
                    <button type="button" onClick={() => setShowFAQForm(false)} className="px-5 py-2.5 border border-white/10 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition">
                      ╪ح┘╪║╪د╪ة
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* FAQs List */}
            <div className="space-y-3">
              {faqs.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
                  <HelpCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">┘╪د ╪ز┘ê╪ش╪» ╪ث╪│╪خ┘╪ر ╪ذ╪╣╪». ╪ث╪╢┘ ╪ث┘ê┘ ╪│╪ج╪د┘!</p>
                </div>
              ) : faqs.map((f, i) => (
                <div key={f.id} className="bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-2xl p-5 flex items-start gap-4 transition-all">
                  <span className="w-7 h-7 bg-[#6C3BFF]/10 border border-[#6C3BFF]/20 text-[#6C3BFF] text-xs font-black rounded-lg flex items-center justify-center flex-shrink-0">{f.order_index}</span>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-sm font-bold text-white">{f.question}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => openEditFAQ(f)} className="p-2 text-gray-400 hover:text-white border border-white/10 hover:border-[#6C3BFF]/30 hover:bg-[#6C3BFF]/10 rounded-xl transition">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteFAQ(f.id)} className="p-2 text-red-400 hover:text-red-300 border border-red-500/20 hover:bg-red-500/10 rounded-xl transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ
            TAB 7: ╪د┘┘à╪┤╪ز╪▒┘â┘ê┘
        ظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـظـ */}
        {activeTab === 'subscribers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">┘é╪د╪خ┘à╪ر ╪د┘┘à╪┤╪ز╪▒┘â┘è┘ ┘┘è ╪د┘┘╪┤╪▒╪ر ╪د┘╪ذ╪▒┘è╪»┘è╪ر</h2>
                <p className="text-gray-400 text-sm">╪ش┘à┘è╪╣ ╪د┘┘à╪┤╪ز╪▒┘â┘è┘ ╪د┘╪░┘è┘ ╪ث╪»╪«┘┘ê╪د ╪ذ╪▒┘è╪»┘ç┘à ╪د┘╪ح┘┘â╪ز╪▒┘ê┘┘è ┘┘è ╪د┘╪╡┘╪ص╪ر.</p>
              </div>
              <button onClick={() => exportCSV('subscribers')} className="flex items-center gap-2 text-xs font-bold text-gray-300 border border-white/10 hover:bg-white/5 px-4 py-2.5 rounded-xl transition">
                <Download className="w-4 h-4" /> ╪ز╪╡╪»┘è╪▒ CSV
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute right-4 top-3.5 w-4 h-4 text-gray-500" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="╪ذ╪ص╪س ╪ذ╪د┘╪د╪│┘à ╪ث┘ê ╪د┘╪ذ╪▒┘è╪» ╪د┘╪ح┘┘â╪ز╪▒┘ê┘┘è..."
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl pr-11 pl-4 py-3 text-white text-sm focus:outline-none focus:border-[#6C3BFF]" />
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="text-xs text-gray-500 border-b border-white/10 bg-black/30">
                    <tr>
                      <th className="py-4 px-4 font-medium">╪د┘╪د╪│┘à</th>
                      <th className="py-4 px-4 font-medium">╪د┘╪ذ╪▒┘è╪» ╪د┘╪ح┘┘â╪ز╪▒┘ê┘┘è</th>
                      <th className="py-4 px-4 font-medium">╪د┘╪»┘ê┘╪ر</th>
                      <th className="py-4 px-4 font-medium">╪ز╪د╪▒┘è╪« ╪د┘╪د╪┤╪ز╪▒╪د┘â</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {subscribers
                      .filter(s => !searchQuery || s.email?.toLowerCase().includes(searchQuery.toLowerCase()) || s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-gray-500 text-xs">┘╪د ╪ز┘ê╪ش╪» ┘╪ز╪د╪خ╪ش</td></tr>
                    ) : subscribers
                      .filter(s => !searchQuery || s.email?.toLowerCase().includes(searchQuery.toLowerCase()) || s.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map(s => (
                        <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 text-sm font-bold text-white">{s.name || 'ظ¤'}</td>
                          <td className="py-3.5 px-4 text-xs text-gray-300 font-mono">{s.email}</td>
                          <td className="py-3.5 px-4 text-xs text-[#F5C542]">{s.country || 'ظ¤'}</td>
                          <td className="py-3.5 px-4 text-xs text-gray-500 font-mono">{new Date(s.created_at).toLocaleDateString('en-GB')}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: Email Campaigns CMS */}
        {activeTab === 'campaigns' && (
          <div className="animate-fadeIn">
            <EmailCampaignsTab />
          </div>
        )}

        {/* TAB 9: Site Settings CMS */}
        {activeTab === 'site-settings' && (
          <div className="animate-fadeIn">
            <SiteSettingsTab />
          </div>
        )}

        {/* TAB 10: Comparison Table CMS */}
        {activeTab === 'comparison' && (
          <div className="animate-fadeIn">
            <ComparisonTab />
          </div>
        )}

        {/* TAB 11: Funnel Stages CMS */}
        {activeTab === 'funnels' && (
          <div className="animate-fadeIn">
            <FunnelsTab />
          </div>
        )}

        {/* TAB 12: Value Stack CMS */}
        {activeTab === 'value-stack' && (
          <div className="animate-fadeIn">
            <ValueStackTab />
          </div>
        )}

        {/* TAB 13: Coupons CMS */}
        {activeTab === 'coupons' && (
          <div className="animate-fadeIn">
            <CouponsTab />
          </div>
        )}

      </main>
      </div>
    </AppProvider>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
