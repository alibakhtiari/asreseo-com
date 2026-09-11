# SEO / AEO / GEO Audit Log — asreseo.com (GSC last 3 months, export 2026-09-08)

> Scope: GSC file `asreseo.com-Performance-on-Search-2026-09-08.xlsx` (Web, last 3 months, 2026-06-07 → 2026-09-06) + codebase inventory (39 Astro pages, 7 blog MDX). No code changed. Prior `plan.md` / `further-optimizations.md` not duplicated — this log is the execution checklist.
> Site already optimized for titles/meta/schemas. Findings below are deltas only.

## 1. GSC truth (numbers used for every recommendation)

- Totals: **1092 clicks / 1503 impressions**. Chart sheet (93 days): June ~17–19 clicks/day → early Sept **0–1/day**. P0: confirm cause (manual action, indexation, title-rewrite shuffle, Core Update, seasonality) before chasing positions.
- Queries (15): top-2 own 99% of clicks:
  - `خدمات هوش مصنوعی` 995/1146, CTR 86.8%, pos **47.5**
  - `خدمات هوش مصنوعی و سئو` 88/99, CTR 88.9%, pos **91.9**
  - Rest **0 clicks**: `خدمات استراتژی محتوا` 41 impr pos 40.5 · `تقویم محتوا` 35 pos 60.6 · `تقویم محتوایی سایت` 20 pos 93.9 · `اعتبار صفحه` 18 pos 63.7 · `سوالات متداول سئو` 17 pos 57.2 · `اتوماسیون انتشار محتوا` 16 pos 59.0 · `خدمات سئو هوش مصنوعی` 10 pos 65.2 · `اتوماسیون چرخه محتوا` 9 pos 70.3 · rest ≤1.
  - Anomaly: 86–88% CTR at pos 47–91 is not normal web ranking (brand/navigational, Discover, or SGE artifact). Optimize for **position + impressions**, ignore CTR on those two rows.
- Pages (17): `…/services/ai/` 1087/1270 pos 50.75 (**99.5% of clicks, cannibalizing everything**). Striking-distance-but-far: `…/content/content-calendar/` 0/110 pos 63.7 · `…/seo/content-authority/` 0/80 pos 51.2 · `/faq/` 0/25 pos 40.2. Good-pos-low-impr (expand impressions): `/` 4/19 pos 4.37 · `…/seo/technical-onpage/` pos 3.0 · `/about/` pos 3.94 · `…/seo/` pos 7.0 · `…/content/social-media-content/` pos 7.7. Duplicate: `…/content-calendar` (no slash) 1 impr pos 95 alongside slashed version — enforce one canonical.
- Countries: Iran 1092/1483 (99%). US 11 impr pos 3.09, UK 2 impr pos 6.5 — English intent exists but negligible; keep fa-IR focus.
- Devices: Mobile 945 clicks pos 54.7 vs Desktop 147 clicks pos 39.9. **15-position mobile gap** = mobile UX/CWV is the technical P0.

## 2. Inventory baseline (what is already good — do not regress)

- `src/layouts/BaseLayout.astro`: dynamic title/description/canonical/OG/Twitter present + font preload. `public/robots.txt` (incl. AI-crawler rules) + sitemap-index + `llms.txt`/`llms-full.txt` present (GEO-ready). Hero images single-sourced in `src/assets/images/`, generated to `public/images/` at prebuild.
- Schemas on 30/39 pages. `ogImage` on 32/39. FAQPage present on money pages. Blog `[slug].astro` uses dynamic `seoTitle`/description/canonical/article OG (earlier "missing title" scanner hit was a false positive — it uses `title={seoTitle}`).
- 7 blogs map 1:1 to GSC demand (`content-calendar-guide`, `page-authority-guide`, `seo-faq-guide`, `ai-seo-guide`).

## 3. P0 — this week (traffic + cannibalization + mobile)

1. **Diagnose June→Sept collapse.** GSC: Performance chart, Pages delta, Indexing → Pages, Manual Actions, Security, robots diff, deploy log for title rewrites. Do not ship mass title changes until cause is known.
2. **Mobile gap (partially done: font preload + Picture `aspectRatio` prop shipped).** Remaining: test top-5 URLs on mobile PageSpeed/CrUX; LCP image dimensions, `display=swap` + subset check, tap targets in `Header/MegaMenu`.
3. **Canonical duplication.** One canonical (trailing slash) for content-calendar; verify `sitemap-index.xml` lists canonical only; keep both sitemap lines in robots or drop `sitemap.xml` if redundant.

## 4. SEO titles (done — 0 over 60 chars; H1 check remains)
- Homepage H1 lives in `src/components/Home/HeroSection.astro` (1× H1, good). Ensure H1 = primary keyword once; page files `index.astro`/`services/index.astro`/`blog/index.astro` rely on component H1 — audit rendered HTML for exactly one H1 per URL.

## 5. Meta descriptions (done — 0 thin; CTR tuning later)
- Homepage + money pages are within length — only adjust for CTR after position improves (add عدد/مزیت/CTA, one keyword, no stuffing).

## 6. Schemas (page gaps filled; content-level schema remains)
- Done: `BlogPosting` + `Speakable` on `blog/[slug]`, `Blog`/`ItemList` on `blog/index`, `Service` + `FAQPage` on `consultation/`, `ItemList` on `portfolio/`, `WebPage` + breadcrumbs on `support/`/`sitemap/`.
- Open: verify rendered JSON-LD holds **6–8 Qs** per money page; add PAA-driven Qs from §8. `content-calendar` gets `HowTo` (steps + tools + time), `content-authority` gets `Table` + checklist in `Article` body, homepage keeps `Organization`/`WebSite` (+ `sameAs`, `inLanguage: fa-IR`).

## 7. Content / internal linking per GSC page

- `…/content-calendar/` (110 impr, pos 63.7, 27KB but invisible): add 50-word answer-first definition at top, نمونه جدول تقویم (downloadable), steps 1–6, mistakes table, link **from** `/services/ai/` + `content-creation` + blog guide with anchor `تقویم محتوایی سایت`.
- `…/content-authority/` (80 impr, pos 51.2): add PA vs DA vs DR comparison table, 15-step checklist, tools (Moz/Ahrefs/Semrush) with caveats, case snippet, FAQ 6 Qs (`اعتبار صفحه` exact), image `content-authority-hero.webp` + new checklist infographic with alt.
- `/faq/` (25 impr, pos 40.2 — expanded to 26 Qs, done). Remaining: deep links to service/blog per answer + links from every service page footer block.
- `/about/` pos 3.94 + `/` pos 4.37: impression-starved — «شرکت خدمات هوش مصنوعی» positioning added to about hero (done). Remaining: E-E-A-T (team, clients, numbers, نمونه‌کار), `AboutPage` schema, internal links to money pages.
- `…/seo/` pos 7.0 + `technical-onpage` pos 3.0: build hub (seo/index links to 3 children with descriptive anchors); technical page needs code/CLS/image examples to hold pos 3.

## 8. Zero-click query → new FAQ/image/section map (AEO-first)

Each gets: 1 FAQ cluster (4–6 Qs, 40–60-word answers) + 1 image/infographic (webp, fa alt, W×H) + 1 internal-link anchor. Place on owning page, not on `/services/ai/`.
- `خدمات استراتژی محتوا` 41/40.5 → owner `services/content/index.astro`: section "استراتژی محتوا شامل چه مواردی است؟" + process diagram image + FAQ.
- `تقویم محتوا / تقویم محتوایی سایت` 35+20 → owner content-calendar: template table image (`content-calendar-template.webp`) + HowTo + FAQ.
- `اعتبار صفحه` 18/63.7 → owner content-authority: PA-factor bar image + FAQ.
- `سوالات متداول سئو` 17/57.2 → `/faq/` expanded to 26 Qs (done; `blog/seo-faq-guide.mdx` kept as companion, jump links still open).
- `اتوماسیون انتشار محتوا` 16/59 + `اتوماسیون چرخه محتوا` 9/70.3 → **no dedicated page (gap)**: new section in `…/ai/content-creation/` (workflow: تولید→بازبینی→انتشار→توزیع) + workflow diagram + FAQ; becomes blog post #4 next month.
- `خدمات سئو هوش مصنوعی` 10/65.2 → owner `/services/ai/` vs `/services/seo/` differentiator table (AI-assisted vs classic) + FAQ to stop intent blur.
- `خدمات سوشال مدیا` pos 11 (nearest win) → title rewritten with exact anchor (done). Remaining: 2 more internal links + FAQ on owner.

## 9. GEO / AEO pass (after user already did schemas/content)

- Keep `llms.txt`/`llms-full.txt` in sync with new FAQs/posts. Add `inLanguage fa-IR`, author byline + `Person` link on all 7 blogs, visible `منتشر/به‌روزرسانی` dates matching schema.
- Per money page: summary box (Key Takeaways, 3–5 bullets), definition sentence quotable in 1 paragraph, one comparison table, pros/cons where commercial, statistics **with source links** (no invented numbers).
- Refresh stale year posts (`digital-marketing-trends-2024`, `google-ads-guide-2024`, `seo-guide-2024`): new `dateModified`, 2026 section, or 301/rename if title-year blocks CTR.

## 10. Measurement (re-run on next GSC export)

- Targets: 4 zero-click queries into pos <30 with >50 impr; `/services/ai/` keeps AI queries, cedes تقویم/اعتبار/سوالات impressions to owners; mobile/desktop pos gap <5; FAQ rich-result impressions on `/faq/` + 2 services; 0 title truncations; 0 missing descriptions (excl. 404).
- Log: export date, deploy hash, before/after title + pos/impr per query in next audit.

*Files touched by scanner: `src/layouts/BaseLayout.astro`, `src/pages/**` (39), `src/content/blog/*.mdx` (7), `public/robots.txt`, `public/images/`.*
