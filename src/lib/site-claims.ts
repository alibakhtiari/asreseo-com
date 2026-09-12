// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for every *verifiable* claim the site makes about
// itself: client testimonials and the headline numbers.
//
// WHY THIS FILE EXISTS
// These claims were previously hard-coded and scattered across ~30 components
// and pages, so nobody could audit them and updating one meant hunting for the
// other copies. Everything now lives here with an explicit `verified` flag.
//
// ⚠️  AUTHENTICITY — READ BEFORE EDITING
// Every entry below is currently `verified: false` because none of it can be
// substantiated from this repository:
//   • The six testimonials name real-looking people at real-looking companies
//     with specific outcome claims («فروش آنلاین ما ۳۰۰٪ افزایش پیدا کرد»).
//   • The headline numbers (۵۰۰+ / ۹۸٪ / ۵۰۰٪ / ۵+ سال) have no source.
//   • All six testimonials carry `rating: 5`. Six out of six perfect scores is
//     itself the strongest signal that the data is placeholder content.
//
// WHY NO `Review` / `AggregateRating` SCHEMA IS EMITTED
// Google requires rating markup to reflect genuine, on-page, user-visible
// reviews. Emitting Review schema for unverifiable reviews is a structured-data
// violation and risks a Manual Action — it would make things *worse*, not
// better. The section is therefore rendered as plain visible content only.
// This mirrors the unsourced AggregateRating that was removed from
// HomepageStructuredData (see fixes log #18).
//
// TO MAKE THESE CLAIMS SAFE — do this, in this order:
//   1. Replace any placeholder with the real value (or delete the entry).
//   2. Set `verified: true` on that entry.
//   3. Only then ask for `Review` schema to be added — it is intentionally
//      withheld until the data is real.
// Until an entry is `verified: true`, treat it as unproven marketing copy.
// ─────────────────────────────────────────────────────────────────────────────

/** Render a number with Persian digits so labels match the rest of the copy. */
export const faNum = (n: number | string): string =>
  String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export interface Testimonial {
  name: string;
  company: string;
  text: string;
  /** Rendered as stars. Only shown when `verified` is true — see note above. */
  rating?: number;
  avatar: string;
  verified?: boolean;
}

export interface Stat {
  value: string;
  label: string;
  verified?: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'علی محمدی',
    company: 'شرکت تجارت آنلاین پارس',
    text: 'با خدمات عصر سئو، رتبه سایت ما در گوگل بطور چشمگیری بهبود یافت. فروش آنلاین ما ۳۰۰٪ افزایش پیدا کرد.',
    rating: 5,
    avatar: '👨‍💼',
    verified: false,
  },
  {
    name: 'مریم احمدی',
    company: 'فروشگاه مد زنانه شیک',
    text: 'طراحی سایت جدید ما فوق‌العاده شد. سرعت سایت بالا رفت و تجربه کاربری بهتر شد. مشتریان راضی‌تر هستند.',
    rating: 5,
    avatar: '👩‍💼',
    verified: false,
  },
  {
    name: 'رضا کریمی',
    company: 'شرکت ساختمانی کوثر',
    text: 'کمپین تبلیغات گوگل آنها عالی بود. سرنخ‌های کیفی زیادی دریافت کردیم و پروژه‌های جدید زیادی گرفتیم.',
    rating: 5,
    avatar: '👨‍🏗️',
    verified: false,
  },
  {
    name: 'فاطمه رضایی',
    company: 'کلینیک زیبایی نور',
    text: 'چت‌بات فارسی که برایمان طراحی کردند، خیلی کمکمان کرده. الان ۲۴ ساعته پاسخگوی مشتریان هستیم.',
    rating: 5,
    avatar: '👩‍⚕️',
    verified: false,
  },
  {
    name: 'محمد حسینی',
    company: 'رستوران‌های زنجیره‌ای طعم',
    text: 'مدیریت شبکه‌های اجتماعی‌مان رو کاملاً دگرگون کردن. فالوور و مشتری‌هامون خیلی زیاد شدن.',
    rating: 5,
    avatar: '👨‍🍳',
    verified: false,
  },
  {
    name: 'زهرا موسوی',
    company: 'آموزشگاه زبان برایت',
    text: 'محتواهای تولیدی با هوش مصنوعی کیفیت بالایی داشت. وقت زیادی برامون صرفه‌جویی شد.',
    rating: 5,
    avatar: '👩‍🏫',
    verified: false,
  },
];

/** Shown in the homepage testimonials section and reused by WhyChooseUs. */
export const HEADLINE_STATS: Stat[] = [
  { value: '۵۰۰+', label: 'مشتری راضی', verified: false },
  { value: '۹۸%', label: 'میزان رضایت', verified: false },
  { value: '۵۰۰%', label: 'متوسط رشد فروش', verified: false },
  // Not a performance claim — a support-hours promise, so it is safe as-is.
  { value: '۲۴/۷', label: 'پشتیبانی', verified: true },
];

/**
 * Figures reused in prose across the homepage. Centralised so there is exactly
 * one place to correct them once real numbers exist.
 */
export const PROSE_STATS = {
  yearsExperience: '۵',
  projectsCompleted: '۵۰۰',
  averageGrowth: '۳۰۰',
  verified: false,
} as const;
