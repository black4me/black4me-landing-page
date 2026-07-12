import { AdSettings, BlogPost } from '@/types';

/**
 * Determines if ads should be shown based on global settings and post settings.
 */
export function shouldShowAds(
  pageType: 'blog_post' | 'other',
  post: BlogPost,
  adSettings: AdSettings
): boolean {
  if (pageType !== 'blog_post') {
    return false;
  }

  if (adSettings.article_only && pageType !== 'blog_post') {
    return false;
  }

  if (!adSettings.enabled || adSettings.provider === 'disabled') {
    return false;
  }

  if (post.status !== 'published') {
    return false;
  }

  if (post.ads_enabled === false) {
    return false;
  }

  return true;
}
