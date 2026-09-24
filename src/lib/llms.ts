// Single source of truth for llms.txt / llms-full.txt.
//
// These files used to be hand-written in `public/`, which meant they drifted
// silently: renaming a blog slug (as happened with the three `-2024` posts) or
// adding a service page left the AI-consumer files pointing at stale URLs.
// They are now generated at build time, and every hard-coded URL is validated
// against the real page routes — a broken link fails the build instead of
// quietly shipping.

export const SITE = 'https://asreseo.com';

/** Static routes that exist as .astro pages, derived at build time. */
export function collectRoutes(): Set<string> {
  const routes = new Set<string>();
  const pages = import.meta.glob('/src/pages/**/*.astro');
  for (const key of Object.keys(pages)) {
    let p = key.replace('/src/pages', '').replace(/\.astro$/, '');
    if (p.endsWith('/index')) p = p.slice(0, -'/index'.length);
    if (p === '') p = '/';
    if (!p.endsWith('/')) p += '/';
    // Dynamic routes ([slug], [...path]) can't be resolved to one URL.
    if (p.includes('[')) continue;
    routes.add(p);
  }
  return routes;
}

export interface Link {
  label: string;
  path: string;
}

export interface ServiceItem extends Link {
  /** Persian label shown in parentheses. */
  fa: string;
  /** Long description, used only by llms-full.txt. */
  blurb?: string;
}

export interface ServiceGroup {
  en: string;
  fa: string;
  path: string;
  items: ServiceItem[];
}

export const MAIN_PAGES: Link[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about/' },
  { label: 'Services Overview', path: '/services/' },
  { label: 'Blog', path: '/blog/' },
  { label: 'Portfolio', path: '/portfolio/' },
  { label: 'FAQ', path: '/faq/' },
  { label: 'Free Consultation', path: '/consultation/' },
  { label: 'Contact', path: '/contact/' },
  { label: 'Support', path: '/support/' },
  { label: 'HTML Sitemap', path: '/sitemap/' },
];

export const POLICY_PAGES: Link[] = [
  { label: 'Privacy', path: '/privacy/' },
  { label: 'Terms', path: '/terms/' },
];

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    en: 'AI Services',
    fa: 'خدمات هوش مصنوعی و سئو',
    path: '/services/ai/',
    items: [
      {
        label: 'AI Content Creation',
        fa: 'تولید محتوای هوشمند',
        path: '/services/ai/content-creation/',
        blurb:
          'تولید مقالات سئومحور، سناریونویسی و ویدیوهای تبلیغاتی با ترکیب هوش مصنوعی مولد و نظارت انسانی متخصص جهت جلوگیری از جریمه‌های الگوریتمی گوگل.',
      },
      {
        label: 'AI Analysis & Strategy',
        fa: 'تحلیل و استراتژی هوشمند',
        path: '/services/ai/analysis-strategy/',
        blurb:
          'بهینه‌سازی رتبه گوگل با الگوریتم‌های هوش مصنوعی، آنالیز بلادرنگ رفتار رقبا، پایش کلمات کلیدی و بهینه‌سازی نرخ تبدیل (CRO).',
      },
      {
        label: 'AI Marketing & Engagement',
        fa: 'بازاریابی و چت‌بات هوشمند فارسی',
        path: '/services/ai/marketing-engagement/',
        blurb:
          'طراحی و راه‌اندازی چت‌بات‌های هوشمند فارسی برای پشتیبانی ۲۴/۷، اتوماسیون ایمیل و پیامک و شخصی‌سازی تجربه کاربری برای مشتریان.',
      },
    ],
  },
  {
    en: 'Content Marketing & Strategy',
    fa: 'خدمات استراتژی محتوا',
    path: '/services/content/',
    items: [
      {
        label: 'Content Calendar & Scheduling',
        fa: 'تقویم محتوایی سایت و شبکه‌های اجتماعی',
        path: '/services/content/content-calendar/',
        blurb:
          'طراحی برنامه‌ریزی ماهانه و فصلی انتشار محتوا برای وب‌سایت و شبکه‌های اجتماعی (اینستاگرام، لینکدین، تلگرام) به منظور ایجاد نظم، تعامل پایدار و اتوماسیون چرخه محتوا.',
      },
      {
        label: 'Text Content',
        fa: 'تولید محتوای متنی و سئومحور',
        path: '/services/content/text-content/',
        blurb:
          'نگارش مقالات تخصصی و یونیک، رپرتاژهای خبری و متون صفحات فرود بر پایه تحقیق کلمات کلیدی عمیق و راهنماهای کیفی E-E-A-T گوگل.',
      },
      {
        label: 'Visual Content',
        fa: 'محتوای تصویری و ویدیو مارکتینگ',
        path: '/services/content/visual-content/',
        blurb:
          'طراحی اینفوگرافیک‌های داده‌محور، موشن گرافیک و تیزرهای ویدیویی اختصاصی.',
      },
      {
        label: 'Social Media Content',
        fa: 'محتوای شبکه‌های اجتماعی',
        path: '/services/content/social-media-content/',
      },
      {
        label: 'Translation & Localization',
        fa: 'ترجمه و بومی‌سازی تخصصی',
        path: '/services/content/translation/',
      },
    ],
  },
  {
    en: 'SEO',
    fa: 'خدمات سئو حرفه‌ای',
    path: '/services/seo/',
    items: [
      {
        label: 'Content & Page Authority',
        fa: 'سئو محتوا و افزایش اعتبار صفحه',
        path: '/services/seo/content-authority/',
        blurb:
          'استراتژی Topic Clusters، نگارش Pillar Pages و ایجاد پیوندهای خارجی باکیفیت و رپرتاژ آگهی‌های هدفمند جهت ارتقای Authority.',
      },
      {
        label: 'Technical & On-Page SEO',
        fa: 'سئو تکنیکال و داخلی',
        path: '/services/seo/technical-onpage/',
        blurb:
          'بهینه‌سازی سرعت سایت و Core Web Vitals، رفع خطاهای Crawlability & Indexability، ساختاردهی اسکیما (JSON-LD) و معماری استاندارد اطلاعات.',
      },
      {
        label: 'Local SEO',
        fa: 'سئو محلی و گوگل مپ',
        path: '/services/seo/local-seo/',
        blurb:
          'ثبت و بهینه‌سازی در گوگل مپ (Google Maps)، جذب مشتریان منطقه‌ای و افزایش تماس‌های محلی.',
      },
    ],
  },
  {
    en: 'Marketing & Google Ads',
    fa: 'بازاریابی دیجیتال',
    path: '/services/marketing/',
    items: [
      {
        label: 'Google Ads',
        fa: 'تبلیغات گوگل ادز حرفه‌ای PPC',
        path: '/services/marketing/google-ads/',
        blurb:
          'مدیریت و بهینه‌سازی تخصصی کمپین‌های Search، Display و Remarketing گوگل ادز با کمترین هزینه به ازای هر کلیک (CPC) و بالاترین نرخ تبدیل.',
      },
      {
        label: 'Social Media Marketing',
        fa: 'مدیریت شبکه‌های اجتماعی',
        path: '/services/marketing/social-media/',
      },
      {
        label: 'Email Marketing',
        fa: 'بازاریابی ایمیلی و اتوماسیون',
        path: '/services/marketing/email-marketing/',
      },
      {
        label: 'Sales Funnel Management',
        fa: 'مدیریت قیف فروش',
        path: '/services/marketing/sales-funnel-management/',
        blurb:
          'طراحی و پیاده‌سازی قیف‌های فروش چندمرحله‌ای (Sales Funnel Optimization).',
      },
      {
        label: 'Integrated Campaigns',
        fa: 'کمپین‌های تبلیغاتی یکپارچه',
        path: '/services/marketing/integrated-campaigns/',
        blurb:
          'بازاریابی شبکه‌ای و مدیریت کمپین‌های تبلیغاتی یکپارچه (Omnichannel Campaigns).',
      },
    ],
  },
  {
    en: 'Web Design & Development',
    fa: 'طراحی سایت سئومحور',
    path: '/services/web/',
    items: [
      {
        label: 'SEO Web Design',
        fa: 'طراحی سایت سئو محور',
        path: '/services/web/seo-web-design/',
        blurb:
          'طراحی وب‌سایت‌های مدرن، پرسرعت و ریسپانسیو با رعایت ۱۰۰٪ اصول سئو تکنیکال، معماری تجربه کاربری (UX) و لندینگ پیج‌های با نرخ تبدیل بالا.',
      },
      {
        label: 'Landing Pages',
        fa: 'طراحی صفحات فرود با نرخ تبدیل بالا',
        path: '/services/web/landing-pages/',
      },
      {
        label: 'UX Architecture',
        fa: 'معماری اطلاعات و طراحی تجربه کاربری',
        path: '/services/web/ux-architecture/',
      },
      {
        label: 'Website Speed',
        fa: 'بهینه‌سازی سرعت سایت و Core Web Vitals',
        path: '/services/web/website-speed/',
      },
    ],
  },
];

/** Company-level Q&As used by llms-full.txt (direct answers for AI citation). */
export const COMPANY_FAQS: { q: string; a: string }[] = [
  {
    q: 'مدت زمان بهینه‌سازی سئو چقدر است؟',
    a: 'معمولاً بین ۳ تا ۶ ماه زمان لازم است تا استراتژی‌های سئو نتایج پایدار و رشد چشمگیر در رتبه‌بندی‌های صفحه اول گوگل را نشان دهند.',
  },
  {
    q: 'هوش مصنوعی در سئو چه کاربردی دارد؟',
    a: 'هوش مصنوعی در عصر سئو برای تحلیل حجم عظیم داده‌های سرچ کنسول، شناسایی الگوهای جستجوی کاربران، سرعت‌بخشی به فرآیند تولید محتوای اولیه و پیش‌بینی روندهای آتی بازار استفاده می‌شود؛ در عین حال تمامی خروجی‌ها تحت نظارت کارشناسان سئو بازبینی می‌شوند.',
  },
  {
    q: 'تقویم محتوایی چه مزیتی برای کسب‌وکار دارد؟',
    a: 'تقویم محتوا با ایجاد نظم در انتشار، سازماندهی تیم، پوشش تمام کلمات کلیدی خوشه موضوعی و تطابق با رویدادهای فصلی فروش، نرخ تعامل کاربران را افزایش می‌دهد.',
  },
  {
    q: 'هزینه سئو چگونه محاسبه می‌شود؟',
    a: 'هزینه بر اساس وضعیت فعلی وب‌سایت، میزان رقابت در کلمات کلیدی، نیاز به سئو تکنیکال و حجم تولید محتوا و لینک‌سازی در قالب پکیج‌های ماهانه و سفارشی تعیین می‌گردد. مشاوره اولیه در عصر سئو رایگان است.',
  },
];

/** Portfolio cases, listed for AI consumers that summarise proof of work. */
export const PORTFOLIO = {
  path: '/portfolio/',
  en: 'Portfolio — Real AI & Automation Case Studies',
  fa: 'نمونه‌کارهای واقعی',
  cases: [
    'Persian RAG chatbot over Iranian statutes (qavanin/dotic/ara sources)',
    'AI call-center with VoIP transcription + smart forwarding',
    'Automated SEO monitoring with alerts',
    'Content pipeline automation',
    'Ads reporting automation',
  ],
  note: 'هر نمونه‌کار شامل چالش‌ها، اقدامات، فناوری‌ها و نتایج به‌همراه لینک خدمات مرتبط و اسکیمای ItemList.',
};

/**
 * Validate every hard-coded path against the real page routes.
 * Throws so `astro build` fails loudly instead of shipping a dead link to
 * Perplexity / ChatGPT / Gemini.
 */
export function assertPathsExist(routes: Set<string>, paths: string[]): void {
  const missing = paths.filter((p) => !routes.has(p));
  if (missing.length) {
    throw new Error(
      `llms.txt references ${missing.length} path(s) with no matching page in src/pages: ${missing.join(', ')}\n` +
        `Fix src/lib/llms.ts or create the missing page.`,
    );
  }
}
