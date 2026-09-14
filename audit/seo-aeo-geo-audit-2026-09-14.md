# SEO / AEO / GEO Audit — asreseo.com (codebase + local build)

**Date:** 2026-09-14
**Scope:** full codebase audit (not live site), verified against local `astro build` output (`dist/`)
**Stack:** Astro 7 static (`output: static`, `trailingSlash: always`), Tailwind, Cloudflare Workers Static Assets (`wrangler.toml` + `worker.ts`)
**Methods / skills used:** `seo-audit` (orchestrator) + `seo-technical`, `seo-content`, `seo-schema`, `seo-geo`, `seo-images`, `seo-sitemap`, `seo-page`, `seo`
**Build proof:** `npm run build` ✅ — `47 page(s) built`, `sitemap-index.xml created`, 46 `index.html` files in `dist/`, `robots.txt` + `llms.txt` (7.7 KB) + `llms-full.txt` (40 KB) all emitted.

> This is a pre-launch audit. No live HTTP, GSC/CrUX, or backlink API data was available. Scores below are codebase + rendered-HTML heuristics, not Google-internal signals.

---

## Executive summary

### SEO Health Score: ~75/100

| Category (weight) | Score | Verdict |
|---|---|---|
| Technical SEO (22%) | 82/100 | Strong. One deployment risk to confirm. |
| Content Quality / E-E-A-T (23%) | 68/100 | Good service/blog depth, dragged down by thin utility pages + unverified claims. |
| On-Page SEO (20%) | 74/100 | H1s perfect (1/page), canonicals perfect, titles/metas need targeted fixes. |
| Schema / Structured Data (10%) | 65/100 | Broad coverage, but 1 critical duplication + fragmentation. |
| Performance / CWV proxy (10%) | 80/100 | Static + modern images. No field data yet. |
| AI Search Readiness / GEO (10%) | 78/100 | `llms.txt` system is excellent; citation plumbing mostly good. |
| Images (5%) | 85/100 | 57/57 alt + dimensions in `dist/`. OG format risk only. |

**Top 5 critical/high issues**
1. **E-E-A-T trust risk (High/Critical for YMYL-adjacent claims):** all 6 testimonials + headline stats (`۵۰۰+` / `۹۸٪` / `۵۰۰٪`) are `verified: false` in `src/lib/site-claims.ts`. Correctly *not* emitted as `Review` schema (good), but still rendered as visible marketing copy with 5/5 stars. Replace with real data or soften before launch.
2. **Duplicate article entity on every blog post (High):** `/blog/[slug]` emits both `BlogPosting` (`[slug].astro`) and `Article` (`BlogPost.astro`) for the same URL, no `@id`/`@graph`, drifting fields. Google wants one or the other.
3. **Relative image URLs in blog schema (High):** `BlogPosting.image` / `Article.image` use root-relative `/images/*.webp`. Rich-result validators expect absolute URLs. (`blog/index` already absolutizes correctly — copy that pattern.)
4. **Deployment-target mismatch (High — verify, don't guess):** `wrangler.toml` = Workers Static Assets with bare `env.ASSETS.fetch()`, but `public/_headers` + `public/_redirects` are Cloudflare **Pages** conventions. If prod is Workers, **none of the security/cache headers or the 20+ 301 redirects execute**. Confirm which target serves prod.
5. **Breadcrumb schema prop bug on 9 service pages (High):** `email-marketing`, `sales-funnel`, `social-media` (marketing), `visual-content`, `translation`, `text-content`, `landing-pages`, `website-speed`, `ux-architecture` pass `{name, url}` to `BreadcrumbStructuredData`, whose contract is `{position, name, item}`. Breadcrumb rich result likely invalid there.

**Top 5 quick wins (low effort)**
1. Give the homepage a unique meta description; keep `BaseLayout` fallback generic (currently identical — any future page omitting `description` duplicates the homepage).
2. Expand or `noindex` the 4 thin indexable pages: `support/` (~80 words), `privacy/` / `terms/` / `sitemap/` (~100–150 words each).
3. Fix the 4 duplicate `og:image` assignments (see §3).
4. Lengthen the 5 short titles + 6 short descriptions (see §3 table).
5. Replace the 7 raw-URL anchor texts on `/sitemap/` with Persian labels.

---

## 1. Technical SEO — 82/100

### What works (verified in `dist/`)
- **Static, crawler-safe:** `output: static`, blog via `getStaticPaths`, no SSR adapter. Client JS is progressive enhancement only (blog filter, share button, SW unregister, floating actions). All indexable content is in static HTML. Good for Googlebot + AI fetchers (which don't execute JS reliably).
- **Canonicals:** perfect. `BaseLayout.astro:44-56` normalizes every page to absolute `https://asreseo.com<path/>` with forced trailing slash. Verified: all 46 pages have absolute canonicals, and `og:url` === canonical on all 46.
- **hreflang:** correct for monolingual site. Every page emits `hreflang="fa-IR"` + `hreflang="x-default"`, both self-referential. Paired with `<html lang="fa" dir="rtl">` + `og:locale fa_IR`. No false `en` alternate.
- **robots.txt:** good, AI-forward. `Allow: /`, `Disallow: /api/`, single canonical `Sitemap: https://asreseo.com/sitemap-index.xml`, explicit `Allow: /` for `GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `Amazonbot`. Minor gaps: no `CCBot`, `Bytespider`, `Meta-ExternalAgent` entries (optional).
- **Sitemap:** strong. `@astrojs/sitemap` with `filter: !/404` + custom `serialize` injecting `<lastmod>` from MDX `updated || date`. Build emits `sitemap-index.xml` → `sitemap-0.xml` with **46 URLs** (matches the 46 `index.html` files) and **9 `<lastmod>`** entries (the 9 blog posts). `_redirects:10` keeps legacy `/sitemap.xml → /sitemap-index.xml 301`.
- **robots meta:** correct. 45 pages `index, follow`; only `404.astro` is `noindex, nofollow` ✅.
- **404:** correctly noindexed, has custom description. H1 is `404` (irrelevant for SEO on a noindexed page).
- **Redirect inventory (`_redirects`):** sensible — `/home → /`, `/blog/post/:slug`, three `-2024` evergreen pairs (both slash variants), 9 AI-service + 6 SEO-service merge 301s. Comment honestly notes `301!` forced suffix is *not* honoured on this host, so plain `301` is used.

### Issues
| # | Severity | Issue | Fix |
|---|---|---|---|
| T1 | **High** | `_headers` / `_redirects` may not execute on Workers Static Assets (`worker.ts` is bare `env.ASSETS.fetch()` with no header injection). | Confirm prod target. If Workers: re-implement headers + redirects in `worker.ts`. If Pages: remove `worker.ts`/`wrangler.toml` ambiguity. |
| T2 | Medium | Missing `Strict-Transport-Security` + `Content-Security-Policy` (present: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HTML `max-age=3600`, assets immutable 1y, sitemap/robots 86400). | Add HSTS (after HTTPS verified) + baseline CSP. Low ranking weight, but cheap. |
| T3 | Medium | No global non-slash → slash redirect in code; relies on host/directory serving + explicit legacy pairs. | Covered by redirect fix in T1; add a catch-all trailing-slash rule if the host doesn't enforce it. |
| T4 | Low | `manifest.json` (orphan, Persian name, theme `#3b82f6`) vs linked `/site.webmanifest` (English name, `#ffffff`) — mismatched theme/name. | Keep one, delete the other. |
| T5 | Info | `WebSite > SearchAction` targets `/blog/?q={...}` but blog search is client-side filter with no `?q=` handling. Sitelinks SearchBox retired 2024 anyway — zero SERP benefit even if fixed. | Either implement `?q=` handling or drop the `SearchAction` block. |

---

## 2. On-page SEO (titles / metas / headings) — 74/100

Full read of all 41 `src/pages/**/*.astro` files + `dist/` verification (all 46 pages have exactly **one** `<h1>` — zero pages with 0 or 2+).

### 2.1 Title / description / H1 table

Lengths are characters. `og:image` "shared" means identical social card for distinct URLs.

| Page | Title (len) | Description (len) | H1 | Flag |
|---|---|---|---|---|
| `/` | آژانس دیجیتال مارکتینگ… (56) | 151 | خدمات هوش مصنوعی و سئو حرفه‌ای در ایران | **D == BaseLayout fallback (duplicate)**; og shared |
| `/about/` | درباره ما… (48) | 126 | درباره عصر سئو؛ آژانس تخصصی رشد ارگانیک… | — (strongest about page) |
| `/services/` | خدمات سئو و دیجیتال مارکتینگ (38) | 141 | خدمات حرفه‌ای ما | **H1 generic, no keyword**; og shared |
| `/blog/` | وبلاگ عصر سئو… (59) | 128 | وبلاگ عصر سئو | T borderline; H1 thin; mixed-lang kw |
| `/blog/[slug]` (×9) | dynamic `post.title + عصر سئو` (46–75) | dynamic | `{post.title}` | ✅ `og:type=article` (only correct usage). Title length varies per post |
| `/faq/` | سوالات متداول… (46) | 139 | سوالات متداول سئو و دیجیتال مارکتینگ | og shared; otherwise strong (~3000 words) |
| `/contact/` | تماس با ما… (59) | 112 | تماس با متخصصان و مشاوران عصر سئو | T borderline; D short + phone digits (truncation risk) |
| `/consultation/` | دریافت مشاوره رایگان (30) | 137 | رزرو مشاوره تخصصی رایگان | no kw/ogImg (falls back — ok) |
| `/portfolio/` | نمونه‌کارهای هوش مصنوعی… (45) | 146 | نمونه‌کارهای هوش مصنوعی و اتوماسیون | — |
| `/privacy/` | حریم خصوصی (20) | 104 | سیاست حریم خصوصی | **T short, D short, thin ~150w** |
| `/terms/` | قوانین و مقررات (25) | 105 | قوانین و مقررات | **T short, D short, thin** |
| `/support/` | پشتیبانی (18) | 107 | مرکز پشتیبانی | **Shortest title, thinnest page ~80w** |
| `/sitemap/` | نقشه سایت (19) | 106 | نقشه سایت | **T/D short**; 7 raw-URL anchors |
| `/services/seo/` | خدمات سئو حرفه‌ای… (53) | 147 | خدمات سئو حرفه‌ای وب‌سایت | — |
| `/services/seo/local-seo/` | سئو محلی… (44) | 118 | سئو محلی (Local SEO) | — |
| `/services/seo/content-authority/` | افزایش اعتبار صفحه… (36) | 149 | افزایش اعتبار صفحه و سئو محتوا | — |
| `/services/seo/technical-onpage/` | سئو تکنیکال و داخلی (34) | 133 | سئو تکنیکال و داخلی | — |
| `/services/marketing/` | خدمات دیجیتال مارکتینگ… (47) | 158 | خدمات دیجیتال مارکتینگ و تبلیغات گوگل | D at upper bound; **og dup w/ ai/marketing-engagement** |
| `/services/marketing/google-ads/` | تبلیغات گوگل ادز… (51) | 129 | تبلیغات گوگل ادز | — |
| `/services/marketing/email-marketing/` | بازاریابی ایمیلی حرفه‌ای (34) | 132 | بازاریابی ایمیلی حرفه‌ای | breadcrumb bug (§4) |
| `/services/marketing/integrated-campaigns/` | کمپین‌های تبلیغاتی ترکیبی (42) | 139 | کمپین‌های تبلیغاتی ترکیبی | — |
| `/services/marketing/sales-funnel-management/` | مدیریت قیف فروش… (44) | 109 | مدیریت قیف فروش | D shortish + breadcrumb bug |
| `/services/marketing/social-media/` | خدمات سوشال مدیا… (52) | 131 | مدیریت شبکه‌های اجتماعی | breadcrumb bug; overlap w/ content/social-media-content |
| `/services/ai/` | خدمات هوش مصنوعی… (50) | 144 | خدمات هوش مصنوعی و سئو سازمانی | — (best differentiation content) |
| `/services/ai/marketing-engagement/` | بازاریابی هوشمند… (52) | 155 | بازاریابی و تعامل هوشمند | og dup w/ marketing hub |
| `/services/ai/analysis-strategy/` | تحلیل و استراتژی هوشمند (42) | 152 | تحلیل و استراتژی هوشمند | — |
| `/services/ai/content-creation/` | تولید محتوای هوشمند… (57) | 149 | تولید محتوای متنی و ویدیویی با هوش مصنوعی | — |
| `/services/content/` | خدمات استراتژی محتوا… (50) | 155 | خدمات استراتژی محتوا و بازاریابی محتوایی | — |
| `/services/content/social-media-content/` | تولید محتوای شبکه‌های اجتماعی (39) | 141 | محتوای شبکه‌های اجتماعی | overlap w/ marketing/social-media |
| `/services/content/content-calendar/` | تقویم محتوایی سایت… (47) | 144 | تقویم محتوایی سایت و اتوماسیون انتشار | — (7 H2s, richest service page) |
| `/services/content/visual-content/` | تولید محتوای تصویری و ویدیویی (39) | 139 | محتوای تصویری و ویدیویی | breadcrumb bug |
| `/services/content/translation/` | ترجمه و بومی‌سازی… Translation Services (56) | 136 | ترجمه و بومی‌سازی | bilingual title (only one on site); breadcrumb bug |
| `/services/content/text-content/` | تولید محتوای متنی… (59) | 128 | تولید محتوای متنی | T borderline; **og dup w/ content hub** |
| `/services/web/` | طراحی وب‌سایت سئومحور… (42) | 132 | طراحی وب‌سایت سئومحور و مدرن | **og dup w/ seo-web-design** |
| `/services/web/seo-web-design/` | طراحی سایت سئو محور (29) | 126 | طراحی سایت سئو محور | T shortish; og dup |
| `/services/web/landing-pages/` | طراحی صفحات فرود… (44) | 115 | صفحات فرود پرتبدیل | breadcrumb bug |
| `/services/web/website-speed/` | بهینه‌سازی سرعت وب‌سایت (33) | 131 | بهینه‌سازی سرعت وب‌سایت | breadcrumb bug; cites FID not INP |
| `/services/web/ux-architecture/` | طراحی تجربه کاربری UX (31) | 102 | معماری اطلاعات و تجربه کاربری UX | **shortest service D (102)**; breadcrumb bug |

No exact duplicate titles or descriptions site-wide except `/` D == fallback D. Nothing >60 chars. Persian titles render wider than Latin — treat 55–60 as the practical ceiling (already respected).

### 2.2 OG / Twitter (BaseLayout — good with one risk)
- Default `og-default.png` 1200×630 with alt; `validOgImages` filters non-image URLs and falls back safely. All pages emit `og:type/url/title/description/site_name/locale`, `og:image + width/height/alt`, `twitter:card=summary_large_image` + image/title/description, `twitter:site/creator=@asreseo`. `public/og-default.png` exists ✅.
- **Risk:** most service/blog `og:image`s are `.webp` heroes declared as 1200×630. X/Telegram/LinkedIn WebP support is inconsistent — PNG/JPEG is safer for share images. Verify declared 1200×630 matches true dimensions.

---

## 3. Content quality / E-E-A-T — 68/100

### Who / How / Why (Google helpful-content heuristic)
| Q | Status |
|---|---|
| **Who** | ⚠️ Weak. Blog frontmatter has optional `author` (string, often empty → schema emits `Person{name:''}` — invalid). No visible author bio pages found. Required where readers expect it. |
| **How** | ✅ Relatively strong. AI-service pages disclose human oversight; `llms-full.txt` documents process; service pages describe methodology. |
| **Why** | ✅ Mostly people-first commercial content. No doorway/word-count-stuffing signals. The old `تضمین رتبه یک` claim is already removed (comment in `seo/index.astro` confirms). |

### Depth
- **Service pages:** ~500–1000 words each, with structured H2s, FAQ accordions, workflow steps, comparison tables (notably `ai/index` AI-vs-classic table cross-linking `/services/seo/` + `/services/content/`). `content-calendar` has 7 H2s, the most on site.
- **Blog (9 posts):** 673–1684 words each, every post has `keyTakeaways` + `faqs` frontmatter (rendered once as card + accordion — no body duplication), `date` + `updated` (mostly Sept 2026 refreshes — good freshness signal), category + image. Cornerstones: `seo-faq-guide` (~1684w), `digital-marketing-trends` (~1521w), `ai-seo-guide` (~1495w).
- **Thin indexable pages (fix before launch):** `support/` ~80w, `privacy/`/`terms/`/`sitemap/` ~100–150w, `blog/` shell ~150w + grid. All `index, follow`. Decision needed: expand to genuinely useful content or add `noindex` (standard for HTML sitemap + support stub; policy pages usually stay indexed but deserve >300w).
- **Keyword hygiene:** no stuffing seen. Watch: `marketing/social-media` (manage) vs `content/social-media-content` (produce), `contact` vs `consultation`, `ai/` vs `seo/` for `سئو هوش مصنوعی` (already mitigated by cross-links — monitor in GSC after launch).

### Trust — the main pre-launch blocker
`src/lib/site-claims.ts` is exemplary in honesty (every placeholder flagged `verified: false`, with instructions), but the rendered site still shows:
- 6/6 testimonials at 5 stars with specific outcome claims (`فروش آنلاین ما ۳۰۰٪ افزایش پیدا کرد`), all unverified, with emoji avatars (👨‍💼 etc.) instead of photos.
- Headline stats `۵۰۰+ مشتری` / `۹۸٪ رضایت` / `۵۰۰٪ رشد` + prose stats (`۵ سال` / `۵۰۰ پروژه` / `۳۰۰٪ رشد`), all `verified: false` (only `۲۴/۷ پشتیبانی` is `verified: true`).
- The file correctly withholds `Review`/`AggregateRating` schema (emitting it would risk a Manual Action) — keep that gate. But visible copy still needs real sources before launch, or soften to non-numeric claims.

---

## 4. Schema / structured data — 65/100

42 `.astro` files emit `application/ld+json`; only `404` emits none. `dist/` verification confirms rich entity coverage on every page (see per-page schema column in the build table).

| Finding | Severity | Detail |
|---|---|---|
| Duplicate article entity on blog posts | **High** | `BlogPosting` (`[slug].astro:62-81`) + `Article` (`BlogPost.astro:30-53`) for same URL, no `@id`/`@graph`, drifting fields (`description` vs `excerpt`, author fallback, `mainEntityOfPage`/`inLanguage`/`speakable` only on one). Keep one `BlogPosting` with `@id`. |
| Relative image URLs in blog schema | **High** | `image: post.image` is root-relative (`/images/*.webp`). Use `new URL(img, SITE)` — the pattern `blog/index.astro:35` already uses. Same for `Service` nodes (no `image` at all) and portfolio `ItemList` (no `image`). |
| Breadcrumb prop bug (9 pages) | **High** | Listed in §0. Component expects `{position, name, item}`; 9 pages pass `{name, url}`. Breadcrumb rich result likely invalid there. (All current absolute-`item` callers are safe; `{name}`-only would silently emit the homepage URL.) |
| Organization / LocalBusiness fragmentation | Medium | Homepage emits both `Organization` and `LocalBusiness` with no `@id` linking them; `LocalBusiness` should be `ProfessionalService`; non-standard `services: string[]` (ignored — `hasOfferCatalog` already covers it); `geoRadius: '50000'` bare string; identity drift (`foundingDate 2020` vs about timeline `۱۳۹۸`/2019; `+989125811880` vs `+98-912-581-1880`; address `Tehran/Tehran/IR` vs `تهران/تهران/IR`; `sameAs` twitter-vs-telegram mismatch; trailing-slash inconsistency). Define `https://asreseo.com/#organization` + `/#website` once, reference via `@id` everywhere. |
| Empty-author risk | Medium | `Article.author = Person{name: post.author}` emits `name: ''` when frontmatter `author` is missing. Gate or fall back to Organization. |
| `Blog` index `position` misuse | Medium | `blogPost[].position` is not a `BlogPosting` property (belongs on `ListItem`). Wrap list as `CollectionPage + ItemList<ListItem>` or drop `position`. |
| `Service` nodes unlinkable | Low | No top-level `url`/`image`/`inLanguage`/`@id`; `areaServed` `"Iran"`/`"IR"` string vs `Country` object on `ai/`+`content/` hubs; `provider` lacks `@id`/logo on leaves. Entity-only today (Service has no rich result) but cheap to fix. |
| `FAQPage` (~25 pages) + `HowTo` (1 page) | Info | **Valid but zero Google SERP benefit** (FAQ rich results retired for all sites May 2026; HowTo retired Sept 2023). Keep for LLM/AEO entity understanding; do not add new ones expecting stars/accordions. Never add `HowTo` elsewhere. `HowTo.totalTime: P30D` is arbitrary; anchors `#step-N` do exist ✅. |
| No `Review`/`AggregateRating` | ✅ Correct | Intentionally withheld for unverified claims (`HomepageStructuredData:55-58` comment + `site-claims.ts` gate). Do not add until entries are `verified: true` with on-page visible reviews. |
| Publisher logo | Low | `ImageObject{url}` without `width/height`; logo file is `Logo-spaced.png` (case-sensitive — correct on disk, fragile). Add dimensions. |

Missing `BreadcrumbList` where visual crumbs exist: `blog/[slug]` (visual `<ol>`, no schema), `services/` hub, `blog/` index. Add for entity completeness.

---

## 5. Performance (CWV proxy, no field data) — 80/100

- Static HTML + `Picture.astro` (`astro:assets`, `formats=[avif,webp]`, `widths=[320…1024]`, responsive `sizes`, `decoding=async`, lazy default / eager opt-in). Heroes use `eager`, below-fold grids use `lazy` correctly. Homepage hero is CSS-only (no LCP image — good).
- Fonts preloaded (`regular.woff2`, `bold.woff2`), service-worker cleanup inline, no SPA framework.
- `dist/` check: 57 `<img>`, **0 missing `alt`**, **0 missing `width`** ✅.
- Gaps: no `fetchpriority="high"` on LCP hero; `ServicesHero` has no explicit `aspectRatio` (relies on generated dims + fixed-height container — OK but less explicit); `Picture` fallback branch renders bare `<img>` without dimensions (unhit today — all sources in-bucket `.webp` — but fragile); `website-speed` page still cites `FID` targets (superseded by INP; sibling `technical-onpage` already uses INP).
- No CrUX/PSI field data possible pre-launch. Run PageSpeed Insights + CrUX after deploy; targets LCP ≤2.5s / INP ≤200ms / CLS ≤0.1 (75th percentile).

---

## 6. Images — 85/100

Covered in §5 plus: all 34 content masters are `.webp` → AVIF/WebP output (good); 2 raw `<img>` in pages (`content-authority`, `content-calendar` inline post images 1672×941) are exemplary (long Persian alt, explicit dimensions, lazy + async). File naming is descriptive-hyphenated. Action items: (a) serve PNG/JPEG variants for OG share images (§2.2); (b) fix 4 duplicate OG assignments (§2.1); (c) never reuse the 1672×941 inline files as OG without resize.

---

## 7. AEO / GEO (AI search readiness) — 78/100

Per Google's 2026 AI-optimization guide, GEO *is* SEO fundamentals applied to AI surfaces — scored that way here, not as a separate discipline.

### What works
- **AI crawler access:** explicitly allowed (`GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `Amazonbot`). Correctly *not* blocking training crawlers you want citations from. (User-triggered fetchers — `ChatGPT-User`, `Google-Agent`, `Google-NotebookLM` — ignore robots.txt by design; nothing to do.)
- **`llms.txt` / `llms-full.txt` — excellent, best-in-class pattern.** Generated routes (`/llms.txt`, `/llms-full.txt`, `text/plain; charset=utf-8`) from single source `src/lib/llms.ts`, with `collectRoutes() + assertPathsExist()` **failing the build on dead links** (motivated by a real `-2024` slug-rename drift incident). `llms.txt` has agency summary, bilingual service labels with absolute trailing-slash URLs, newest-first blog list, policies, citation guidance (`prefer canonical`, `trailing slashes`, `fa/RTL` note, phone/email). `llms-full.txt` is a genuine entity KB: services with blurbs, company FAQs, **all blog FAQs deduped**, cornerstone summaries with `Last updated` + key takeaways, portfolio cases. Ideal citation units for ChatGPT/Perplexity/Gemini/Claude.
- **Citability plumbing:** every blog post + most service pages have question-based H2s, `keyTakeaways` card, FAQ accordion + `FAQPage` (kept for LLM understanding), `SpeakableSpecification` (`.speakable-summary` exists), `inLanguage: fa-IR`, fresh `updated` dates (recency is a strong AI-citation correlate).
- **SSR-safe:** all citable content is static HTML, no JS dependency.

### Gaps
| # | Severity | Gap |
|---|---|---|
| G1 | Low | No `last-updated` timestamp header inside `llms.txt` output; `POLICY_PAGES` rendered as plain text, not markdown links. |
| G2 | Info | No `llms.txt` weight for Google (Google ignores it; it serves non-Google crawlers). Correctly *not* claimed as a ranking lever in code comments ✅. |
| G3 | Medium (off-site) | No repo-visible brand-entity footprint on Wikipedia/Wikidata/Reddit/YouTube/LinkedIn — the strongest AI-citation correlates (Ahrefs: brand mentions ~3× backlinks). Nothing to fix in code; needs off-site entity building post-launch. |
| G4 | Low | `Service`/`Article` missing `image`/`url` weakens entity resolution for AI consumers (same fix as §4). |

Quick GEO wins already mostly done (definition-first intros, 134–167-word self-contained answer blocks, Q-based H2s, stats with sources, dates, `Person`/`Organization` schemas). Highest post-launch leverage: original research/case data with real numbers (also fixes §3 trust gap) + YouTube/Reddit presence.

---

## 8. Prioritized action plan

### Critical / High (pre-launch)
1. **[Trust] Resolve `site-claims.ts` unverified copy** — replace testimonials/stats with real sourced values (`verified: true`) or soften to non-numeric claims; gate star rendering on `verified`. (`src/lib/site-claims.ts`, both `TestimonialsSection`s)
2. **[Deploy] Confirm prod target (Pages vs Workers)** and make `_headers` + `_redirects` actually execute (or port to `worker.ts`). Retest headers + all ~20 redirects post-deploy.
3. **[Schema] Collapse blog article entity** to single `BlogPosting` with `@id`, absolute `image`, gated author, `mainEntityOfPage`/`inLanguage`/`speakable`.
4. **[Schema] Absolutize all schema image URLs** (`new URL(img, SITE)`); add `image` to `Service`/portfolio nodes.
5. **[Schema] Fix breadcrumb props** on the 9 listed pages (`{position, name, item}`); add missing `BreadcrumbList` on `blog/[slug]`, `services/`, `blog/`.
6. **[Schema] Introduce global `@id`s** (`#organization`, `#website`), subtype `ProfessionalService`, unify phone/address/founding-date/`sameAs`/trailing-slash.

### Medium (week 1–2 post-launch)
7. Unique homepage meta description; keep fallback generic.
8. Thin pages: expand `support`/`privacy`/`terms`/`sitemap` to genuinely useful content or `noindex` `support` + `sitemap`.
9. Fix 4 duplicate `og:image`s; serve PNG/JPEG OG variants at true 1200×630.
10. Lengthen short titles (`support`, `sitemap`, `privacy`, `terms`, `seo-web-design`) + short descriptions (`ux-architecture`, `privacy`, `terms`, `sitemap`, `support`, `sales-funnel`); sharpen generic `/services/` H1.
11. Replace 7 raw-URL anchors on `/sitemap/`; fix `website-speed` FID → INP; add `fetchpriority="high"` to LCP heroes.
12. Decide `manifest.json` vs `site.webmanifest`; implement `?q=` or drop `SearchAction`.

### Low / ongoing
13. Monitor GSC for `marketing/social-media` vs `content/social-media-content` and `contact` vs `consultation` cannibalization.
14. Add author bylines + bio pages (fixes **Who** + empty-author schema risk).
15. Run PSI/CrUX, publish real CWV; build off-site entity footprint (LinkedIn → YouTube → Reddit → Wikidata, in that effort order).
16. Add `last-updated` to `llms.txt`; linkify policy entries.

---

## 9. Verification log (this audit)

- `npm run build` — ✅ 47 pages, sitemap created, no errors.
- `dist/` crawl — 46 `index.html`, all 1× `<h1>`, all canonicals absolute + trailing slash, all `hreflang` = `fa-IR` + `x-default`, all `og:url` = canonical, 45× `index,follow` + 1× `noindex` (404), 57 `<img>` with 0 missing alt / 0 missing width.
- `sitemap-0.xml` — 46 URLs = page count ✅, 9 `<lastmod>` = post count ✅.
- `robots.txt` / `llms.txt` / `llms-full.txt` — present in `dist/` with expected sizes.
- Falsifiability: re-run `npm run build` + the `dist/` checks in §9 after any fix; any count mismatch (pages vs sitemap URLs, H1 ≠ 1, missing alt) means the fix regressed something. Post-launch, validate with Rich Results Test (blog post, FAQ, breadcrumb, organization), PSI/CrUX, and GSC indexation vs the 46-URL sitemap.

---

## Files changed by this audit
- **Added:** `audit/seo-aeo-geo-audit-2026-09-14.md` (this report). No source files modified.

*Methods: `seo-audit` orchestration with `seo-technical`, `seo-content`, `seo-schema`, `seo-geo`, `seo-images`, `seo-sitemap`, `seo-page` criteria, plus parallel subagent reads of all 41 page files and full `dist/` verification. Scores are heuristics, not Google-internal data.*
