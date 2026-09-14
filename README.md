# عصر سئو — وب‌سایت آژانس بازاریابی دیجیتال و هوش مصنوعی (Asre SEO)

پلتفرم مدرن، فوق‌سریع و بهینه‌سازی‌شده برای موتورهای جستجوی سنتی (**SEO**)، موتورهای پاسخ‌دهی مستقیم (**AEO**) و موتورهای جستجوی مولد مبتنی بر هوش مصنوعی (**GEO**).

این کدبیس با معماری **Astro 5** بازسازی شده و به عنوان جایگزین مستقیم نسخه قدیمی (Next.js) آماده استقرار روی **Cloudflare Pages** است.

---

## ویژگی‌های کلیدی و معماری پروژه

- **انطباق ۱۰۰٪ آدرس‌ها (1:1 URL Parity):** حفظ کامل تمام ۳۷ مسیر و ساختار لینک‌های قبلی سایت بدون ایجاد کوچک‌ترین خطای ۴۰۴ یا افت اعتبار سئو.
- **ریدایرکت‌های استاندارد ۳۰۱:** انتقال خودکار و قطعی اسلاگ‌های قدیمی تاریخ‌دار (`-2024`) به آدرس‌های سبز و دائمی در `public/_redirects`.
- **عملکرد خیره‌کننده (Core Web Vitals):**
  - زمان مسدودی کل (TBT): **۰ میلی‌ثانیه** در تمام صفحات.
  - سرعت لود بزرگ‌ترین عنصر بصری (LCP): کمتر از ۱.۲ ثانیه.
  - ثبات بصری چیدمان (CLS): نزدیک به صفر.
  - تعامل‌پذیری مدرن: انطباق کامل با معیار **INP** گوگل.
- **آمادگی AEO و GEO (پاسخ به چت‌بات‌ها و موتورهای مولد):**
  - تولید خودکار و اعتبارسنجی‌شده فایل‌های [`llms.txt`](/llms.txt) و [`llms-full.txt`](/llms-full.txt) در زمان بیلد جهت ارجاع مستقیم توسط مدل‌های زبانی (Perplexity, ChatGPT Search, Gemini, Claude).
  - درج کپسول‌های پاسخ مستقیم (Direct Answer Capsules) در ۴۰ تا ۶۰ کلمه در ابتدای صفحات و مقالات.
  - پیکربندی دسترسی خزنده‌های هوش مصنوعی (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Applebot-Extended, Amazonbot) در `public/robots.txt`.
- **داده‌های ساختاریافته پیشرفته (JSON-LD Schemas):**
  - اسکیماهای استاندارد و معتبر `FAQPage`، `Service`، `Article`، `BreadcrumbList`، `WebSite`، و `CollectionPage` مطابق با جدیدترین استانداردهای Google Search Central.
- **طراحی دسترسی‌پذیر و بومی (RTL & A11y):**
  - تایپوگرافی اصیل با فونت وزیرمتن (پری‌لود هر دو وزن Regular و Bold).
  - تطابق با استانداردهای کنتراست رنگ WCAG 2.1 AA.
  - کلیدهای کنترلی دسترسی‌پذیر (پشتیبانی از کلید Escape، محصور شدن فوکوس Tab در منوی موبایل و برچسب‌های متصل `for`/`id` در فرم‌ها).

---

## استک فنی (Tech Stack)

| بخش | ابزار / فریم‌ورک |
|---|---|
| **Core Framework** | [Astro 5](https://astro.build/) (Static Site Generation - SSG) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) با پلاگین Vite |
| **Content Management** | Astro Content Collections + MDX |
| **Icons** | [Lucide Static](https://lucide.dev/) |
| **Image Pipeline** | Sharp + کامپوننت بومی `Picture` (فرمت‌های مدرن WebP و AVIF) |
| **Type Checking** | TypeScript 5.9 + Astro Check |
| **Linter** | ESLint 10 + TypeScript-ESLint |
| **Edge Functions** | Cloudflare Pages Functions (`functions/api/send-email.ts`) با بایندینگ بومی `send_email` |
| **Hosting & CDN** | [Cloudflare Pages](https://pages.cloudflare.com/) |

---

## ساختار دایرکتوری پروژه

```
asreseo-com/
├── public/                     # فایل‌های استاتیک، تصاویر و فونت‌ها
│   ├── _headers               # قواعد کشینگ و امنیت Cloudflare
│   ├── _redirects             # ریدایرکت‌های ۳۰۱ روت‌های قدیمی
│   ├── robots.txt             # دسترسی خزنده‌ها و سایت‌مپ
│   └── js/ajax-form.js        # اسکریپت ارسال ناهمگام فرم‌ها
├── src/
│   ├── assets/images/         # تصاویر منبع و بهینه‌سازی‌شده
│   ├── components/            # کامپوننت‌های ماژولار استرو
│   │   ├── Blog/              # نمایش مقاله، کارت‌ها و CTA وبلاگ
│   │   ├── Home/              # بخش‌های اختصاصی صفحه اصلی
│   │   ├── Layout/            # هدر، فوتر و مگامنو ۵ ستونه
│   │   ├── Services/          # کامپوننت‌های مشترک صفحات خدمات
│   │   └── ui/                # المان‌های پایه (دکمه، آکاردئون، بج و کارت)
│   ├── content/blog/          # مقالات آموزشی مرجع (۹ فایل MDX)
│   ├── layouts/               # تمپلیت پایه سئو (BaseLayout.astro)
│   ├── lib/                   # منطق کمکی، داده‌های سایت و تایپ‌های llms
│   └── pages/                 # ساختار روتینگ صفحات استرو
│       ├── blog/              # صفحه وبلاگ و جزئیات مقالات
│       ├── services/          # ۵ شاخه و ۱۷ زیرسرویس تخصصی
│       ├── llms.txt.ts        # اندپوینت پویا برای مدل‌های هوش مصنوعی
│       ├── llms-full.txt.ts   # پایگاه دانش تفصیلی برای هوش مصنوعی
│       └── consultation/      # صفحه دریافت مشاوره رایگان
├── functions/api/             # Cloudflare Pages Functions
│   └── send-email.ts          # اندپوینت ارسال ایمیل با اعتبارسنجی امن
├── scripts/                   # اسکریپت‌های کمکی بیلد و اعتبارسنجی استقرار
├── audit/                     # مستندات کامل ممیزی‌ها، لاگ اصلاحات و راهنمای استقرار
│   ├── DEPLOYMENT.md          # دستورالعمل استقرار نهایی روی Cloudflare
│   ├── fixes-2026-09-12.md    # لاگ ۸۱ اقدام اصلاحی سئو، فنی و UI
│   └── claims-to-verify.md    # ممیزی ادعاهای بازاریابی و آماری
└── astro.config.mjs           # پیکربندی استرو و افزونه سایت‌مپ
```

---

## دستورات اجرایی و محیط توسعه

### ۱. نصب وابستگی‌ها
```bash
npm install
```

### ۲. اجرای سرور توسعه محلی
```bash
npm run dev
```
سرور محلی روی پورت `http://localhost:4321` اجرا خواهد شد.

### ۳. اعتبارسنجی تایپ‌ها و لینتر
```bash
npm run type-check    # بررسی سلامت کدهای تایپ‌اسکریپت و استرو (0 errors)
npm run lint          # بررسی استانداردهای کدنویسی با ESLint (0 errors)
```

### ۴. ساخت پروژه برای تولید (Production Build)
```bash
npm run build
```
خروجی استاتیک پروژه شامل تمام ۴۷ صفحه در پوشه `dist/` با سایت‌مپ‌های استاندارد ایجاد می‌شود.

---

## راهنمای استقرار نهایی (Production Deployment)

این پروژه برای میزبانی در **Cloudflare Pages** پیکربندی شده است. برای اجرای بدون نقص استقرار:

1. **مستندات استقرار را مطالعه فرمایید:** مراحل دقیق در [`audit/DEPLOYMENT.md`](./audit/DEPLOYMENT.md) ثبت شده است.
2. **اتصال بایندینگ ایمیل (Cloudflare Dashboard):**
   - در داشبورد کلودفلر، برای پروژه Pages خود در مسیر **Settings → Functions → Bindings**، متغیر بایندینگ Send Email را با نام **`asreseo`** (یا **`EMAIL`**) اضافه فرمایید تا فرم‌های تماس و مشاوره فعال شوند. (کد هر دو نام را پشتیبانی می‌کند).
3. **غیرفعال‌سازی Content Signals Policy:**
   - در داشبورد کلودفلر، گزینه Content Signals Policy را غیرفعال کنید تا فایل `robots.txt` پروژه توسط کلودفلر بازنویسی نشود.
4. **تغییر برنچ به `astro-migration` یا مرج در `main`:**
   - برنچ بیلد پروژه در تنظیمات Cloudflare Pages را روی `astro-migration` تنظیم کرده یا تغییرات را در `main` مرج فرمایید.
5. **تست و اعتبارسنجی پس از استقرار:**
   ```bash
   npm run verify:deploy
   ```

---

## لایسنس و حقوق مالکیت

تمامی حقوق این پروژه متعلق به [عصر سئو (Asre SEO)](https://asreseo.com) است.
