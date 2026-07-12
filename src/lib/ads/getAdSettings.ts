import { AdSettings } from '@/types';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Fetches ad settings from Supabase.
 * Falls back to env variables if Supabase fails or is empty.
 */
export async function getAdSettings(): Promise<AdSettings> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const defaultSettings: AdSettings = {
    id: 'default',
    provider: process.env.AD_PROVIDER || 'disabled',
    enabled: process.env.AD_PROVIDER !== undefined && process.env.AD_PROVIDER !== 'disabled',
    article_only: true,
    script_url: process.env.NEXT_PUBLIC_ADSTERRA_SCRIPT_URL,
    publisher_id: process.env.ADSTERRA_PUBLISHER_ID,
    placement_config: {
      after_intro: true,
      mid_content: true,
      end_content: true,
    },
    style_config: {
      label: 'إعلان',
      containerVariant: 'subtle',
    },
  };

  try {
    const { data, error } = await supabase
      .from('ad_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching ad settings:', error);
      return defaultSettings;
    }

    if (data) {
      return data as AdSettings;
    }
  } catch (error) {
    console.error('Failed to get ad settings:', error);
  }

  return defaultSettings;
}
