import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DbProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  sale_price?: number;
  file_url?: string;
  payment_link?: string;
  is_active: boolean;
  created_at: string;
}

export interface DbFAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

export interface DbTestimonial {
  id: string;
  customer_name: string;
  country: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

export interface DbSiteSetting {
  key: string;
  value: string;
}

export interface DbComparisonItem {
  id: string;
  aspect: string;
  before_system: string;
  after_system: string;
  order_index: number;
}

export interface DbFunnelStage {
  id: string;
  num: number;
  title: string;
  subtitle: string;
  details: string;
  badge: string;
  icon_name: string;
}

export interface DbValueStackItem {
  id: string;
  name: string;
  real_value: number;
  notes: string;
  order_index: number;
}

export interface DbCoupon {
  id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
}

// ─── Hook: Products ──────────────────────────────────────────────────────────

export function useProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setProducts(data);
        setLoading(false);
      });
  }, []);

  return { products, loading };
}

// ─── Hook: FAQs ──────────────────────────────────────────────────────────────

export function useFAQs() {
  const [faqs, setFaqs] = useState<DbFAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        if (data) setFaqs(data);
        setLoading(false);
      });
  }, []);

  return { faqs, loading };
}

// ─── Hook: Testimonials ───────────────────────────────────────────────────────

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<DbTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setTestimonials(data);
        setLoading(false);
      });
  }, []);

  return { testimonials, loading };
}

// ─── Hook: Site Settings ───────────────────────────────────────────────────────

export function useSiteSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .then(({ data, error }) => {
        if (data && !error) {
          const settingsObj: Record<string, string> = {};
          data.forEach(item => { settingsObj[item.key] = item.value; });
          setSettings(settingsObj);
        }
        setLoading(false);
      });
  }, []);

  return { settings, loading };
}

// ─── Hook: Comparison Items ────────────────────────────────────────────────────

export function useComparisonItems() {
  const [comparisonItems, setComparisonItems] = useState<DbComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('comparison_items')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data, error }) => {
        if (data && !error) setComparisonItems(data);
        setLoading(false);
      });
  }, []);

  return { comparisonItems, loading };
}

// ─── Hook: Funnel Stages ───────────────────────────────────────────────────────

export function useFunnelStages() {
  const [funnelStages, setFunnelStages] = useState<DbFunnelStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('funnel_stages')
      .select('*')
      .order('num', { ascending: true })
      .then(({ data, error }) => {
        if (data && !error) setFunnelStages(data);
        setLoading(false);
      });
  }, []);

  return { funnelStages, loading };
}

// ─── Hook: Value Stack Items ───────────────────────────────────────────────────

export function useValueStackItems() {
  const [valueStackItems, setValueStackItems] = useState<DbValueStackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('value_stack_items')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data, error }) => {
        if (data && !error) setValueStackItems(data);
        setLoading(false);
      });
  }, []);

  return { valueStackItems, loading };
}

// ─── Hook: Coupons ─────────────────────────────────────────────────────────────

export function useCoupons() {
  const [coupons, setCoupons] = useState<DbCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .then(({ data, error }) => {
        if (data && !error) setCoupons(data);
        setLoading(false);
      });
  }, []);

  return { coupons, loading };
}

// ─── Submit testimonial ───────────────────────────────────────────────────────

export async function submitTestimonial(
  customer_name: string,
  country: string,
  rating: number,
  comment: string
) {
  return supabase.from('testimonials').insert([{
    customer_name,
    country,
    rating,
    comment,
    is_approved: false,
  }]);
}

// ─── Subscribe to newsletter ──────────────────────────────────────────────────

export async function subscribeNewsletter(name: string, email: string, country: string) {
  return supabase.from('subscribers').upsert([{ name, email, country }], { onConflict: 'email', ignoreDuplicates: true });
}
