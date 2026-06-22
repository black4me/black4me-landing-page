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
