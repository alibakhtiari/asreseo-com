import type { MenuCategory } from './types';

export const menuCategories: MenuCategory[] = [
  {
    title: 'SEO Services',
    icon: 'search',
    href: '/services/seo/',
    color: 'text-blue-600',
    items: [
      { title: 'Technical & On-Page SEO', href: '/services/seo/technical-onpage/' },
      { title: 'Content & Authority SEO', href: '/services/seo/content-authority/' },
      { title: 'Local SEO', href: '/services/seo/local-seo/' },
    ],
  },
  {
    title: 'Design & Development',
    icon: 'code',
    href: '/services/web/',
    color: 'text-purple-600',
    items: [
      { title: 'SEO-Focused Web Design', href: '/services/web/seo-web-design/' },
      { title: 'Speed Optimization', href: '/services/web/website-speed/' },
      { title: 'Landing Pages', href: '/services/web/landing-pages/' },
      { title: 'User Experience', href: '/services/web/ux-architecture/' },
    ],
  },
  {
    title: 'Digital Marketing',
    icon: 'trending-up',
    href: '/services/marketing/',
    color: 'text-green-600',
    items: [
      { title: 'Google Ads', href: '/services/marketing/google-ads/' },
      { title: 'Email Marketing', href: '/services/marketing/email-marketing/' },
      { title: 'Social Media', href: '/services/marketing/social-media/' },
      { title: 'Sales Funnel', href: '/services/marketing/sales-funnel-management/' },
      { title: 'Integrated Campaigns', href: '/services/marketing/integrated-campaigns/' },
    ],
  },
  {
    title: 'Content Strategy',
    icon: 'file-text',
    href: '/services/content/',
    color: 'text-amber-600',
    items: [
      { title: 'Content Strategy Services', href: '/services/content/' },
      { title: 'Content Calendar', href: '/services/content/content-calendar/' },
      { title: 'Copywriting', href: '/services/content/text-content/' },
      { title: 'Social Media Content', href: '/services/content/social-media-content/' },
      { title: 'Specialized Translation', href: '/services/content/translation/' },
    ],
  },
  {
    title: 'AI Services',
    icon: 'bot',
    href: '/services/ai/',
    color: 'text-violet-600',
    items: [
      { title: 'Smart Content Creation', href: '/services/ai/content-creation/' },
      { title: 'AI Marketing & Engagement', href: '/services/ai/marketing-engagement/' },
      { title: 'Analysis & Strategy', href: '/services/ai/analysis-strategy/' },
    ],
  },
];

export const menuCategoriesEn: MenuCategory[] = menuCategories;
export const getMenuCategories = (): MenuCategory[] => menuCategories;
