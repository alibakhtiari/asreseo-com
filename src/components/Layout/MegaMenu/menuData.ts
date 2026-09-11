
import type { MenuCategory } from './types';

export const menuCategories: MenuCategory[] = [
  {
    title: 'خدمات سئو',
    icon: 'search',
    color: 'text-blue-600',
    items: [
      { title: 'سئو تکنیکال و داخلی', href: '/services/seo/technical-onpage/' },
      { title: 'سئو محتوا و اعتبار', href: '/services/seo/content-authority/' },
      { title: 'سئو محلی', href: '/services/seo/local-seo/' }
    ]
  },
  {
    title: 'طراحی و توسعه',
    icon: 'code',
    color: 'text-purple-600',
    items: [
      { title: 'طراحی سایت سئو محور', href: '/services/web/seo-web-design/' },
      { title: 'بهینه‌سازی سرعت', href: '/services/web/website-speed/' },
      { title: 'صفحات فرود', href: '/services/web/landing-pages/' },
      { title: 'تجربه کاربری', href: '/services/web/ux-architecture/' }
    ]
  },
  {
    title: 'بازاریابی دیجیتال',
    icon: 'trending-up',
    color: 'text-green-600',
    items: [
      { title: 'تبلیغات گوگل', href: '/services/marketing/google-ads/' },
      { title: 'بازاریابی ایمیلی', href: '/services/marketing/email-marketing/' },
      { title: 'شبکه‌های اجتماعی', href: '/services/marketing/social-media/' },
      { title: 'قیف فروش', href: '/services/marketing/sales-funnel-management/' },
      { title: 'کمپین یکپارچه', href: '/services/marketing/integrated-campaigns/' }
    ]
  },
  {
    title: 'خدمات هوش مصنوعی',
    icon: 'bot',
    color: 'text-violet-600',
    items: [
      { title: 'تولید محتوای هوشمند', href: '/services/ai/content-creation/' },
      { title: 'بازاریابی و تعامل AI', href: '/services/ai/marketing-engagement/' },
      { title: 'تحلیل و استراتژی', href: '/services/ai/analysis-strategy/' }
    ]
  }
];
