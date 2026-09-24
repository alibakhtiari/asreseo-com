# Full SEO / AEO / GEO Audit — asreseo.com

**Date:** 2026-09-23
**Scope:** production site `https://asreseo.com` + full codebase + GSC performance data (last 3 months)
**Stack:** Astro 7 static (`output: static`, `trailingSlash: always`), Tailwind 4, Cloudflare **Workers with Static Assets** (`wrangler.toml` → `worker.ts` → `env.ASSETS.fetch`)
**Evidence sources (all three, this audit):**
1. **Live HTTP probing** of production — framework, headers, redirects, robots, sitemaps, llms.txt, per-page `<title>`/description/`<h1>`/canonical/hreflang/JSON-LD on `/`, `/services/ai/`, `/blog/`, `/faq/`, `/about/`.
2. **Full codebase read** — all 41 page files, 42 schema emitters, `BaseLayout`, `site-claims.ts`, `llms.ts`, blog MDX, `worker.ts`, `astro.config.mjs`.
3. **GSC export** `asreseo.com-Performance-on-Search-2026-09-23.xlsx` → deep-dived in [`gsc-data-analysis-2026-09-23.md`](./gsc-data-analysis-2026-09-23.md).

**Skills/methods:** `seo-audit` (orchestrator) + `seo-technical`, `seo-geo`, `seo-schema`, `seo-content`, `seo-sitemap`, `seo-page`, `seo`, and `blog` (blog-cluster/content-plan criteria for §5).
**Predecessor:** [`seo-aeo-geo-audit-2026-09-14.md`](./seo-aeo-geo-audit-2026-09-14.md) (codebase-only, pre-deploy). This audit **re-verifies every high/critical finding from it** — several are now fixed (§1.3).

> **Limitation stated up front:** no GSC API, no backlink export, no CrUX/PageSpeed field data, and no Manual Actions status were available to this audit. Scores are heuristics over live HTML + code + a 3-month GSC export, not Google-internal signals. Unavailable checks are listed as actions, never guessed.

---

## 0. Executive summary

### Overall SEO/AEO/GEO Health: **71/100** (was ~75/100 on 2026-09-14)

The score **dropped despite the technical work landing**, because the two audits measure different things: 09-14 scored a codebase pre-launch with no traffic data; this one scores a **live site whose organic traffic collapsed 99% on 2026-08-27**. Technical craft improved; measured business outcome did not.

| Category (weight) | Score | Δ vs 09-14 | Verdict |
|---|---:|---:|---|
| **Technical SEO** (20%) | 86/100 | +4 | Strong. Astro live, robots/sitemap/redirects verified working in prod. Residual header + redirect-type gaps. |
| **Content / E-E-A-T** (20%) | 62/100 | −6 | **Weakest category.** 65% of pages invisible, all 9 blog posts at 0 impressions, unverified headline stats still rendered. |
| **On-Page SEO** (15%) | 80/100 | +6 | 1 `<h1>`/page, canonicals perfect, hreflang correct. ~~titles/descriptions all in range — verified live~~ **Corrected 2026-09-23:** the full build was out of band (8 blog titles 61–82 chars, 9 descriptions >155, 10 titles <40). Now 40–60 / 104–154 site-wide. |
| **Schema / Structured Data** (10%) | 74/100 | +9 | Duplicate-article + relative-image + breadcrumb-prop bugs **all confirmed fixed**. Entity fragmentation remains. |
| **Performance / CWV** (10%) | 78/100 | −2 | Static + 0 bundles is excellent, but **still no field data**; HSTS/CSP absent; mobile pos gap unfixed. |
| **Search demand capture (GSC)** (15%) | **48/100** | new | **New category.** 99.4% click concentration, 99% click collapse, 65% invisible pages. |
| **AI search readiness / AEO-GEO** (10%) | 80/100 | +2 | `llms.txt` system is best-in-class and **verified live**. But zero appearances in any enhanced search surface. |

### The three findings that matter

1. 🔴 **Organic clicks collapsed 99% on 2026-08-27 and have not recovered** — 12.6/day → 0.13/day for 24 consecutive days; average position degraded 35 → 69. Cause is **external to this repo** (codebase was frozen 08-15 → 09-10). **First action: check Manual Actions** (2 minutes, currently unknown). → `gsc-data-analysis` §2.

2. 🔴 **The entire organic business is one URL.** `/services/ai/` = **869 of 874 clicks (99.4%)**. Six other pages rank in Google's **top 10** and produced **zero clicks**. There is no redundancy and no second source of demand.

3. 🟠 **65% of the site earns no impressions at all — including 100% of the blog.** 16 of 46 sitemap URLs appear in GSC; **all 9 cornerstone articles got 0 impressions in 92 days**. Meanwhile `content-calendar` (178 impr) and `content-authority` (102 impr) sit on **page 6 with zero clicks** — the cheapest available wins.

### What is genuinely good (verified live, not assumed)

- **Astro rebuild is live.** `/_astro/` ×6, `/_next/static/` ×0 — the 09-12 "never deployed" blocker is resolved.
- **`robots.txt` serves real directives** with all 7 AI crawlers explicitly allowed; **no Cloudflare Content Signals override** present (the 09-12 risk did not materialize).
- **`llms.txt` (7.7 KB) + `llms-full.txt` (40 KB) both 200** with build-time dead-link assertion.
- **`/sitemap.xml` → 301 → `/sitemap-index.xml` → 200**, 46 URLs, 9 `lastmod`.
- **1 `<h1>` per page, absolute canonicals, `hreflang` `fa-IR` + `x-default`, no `AggregateRating` anywhere.**
- **No duplicate content from slash variance** — non-slash URLs 307-redirect (though should be 308, §1.4).

---

## 1. Technical SEO — 86/100

### 1.1 Verified working in production (live HTTP)

| Check | Result |
|---|---|
| Framework | ✅ **Astro static** — `/_astro/` ×6, `/_next/static/` ×0, no `__NEXT_DATA__` |
| `robots.txt` | ✅ 200, 622 B, `User-agent: *` + `Allow: /` + `Disallow: /api/` + `Sitemap: …/sitemap-index.xml`; **GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended, Amazonbot all explicitly `Allow: /`**; **no Cloudflare Content Signals block** |
| `/sitemap-index.xml` | ✅ 200 → 1 child, `lastmod 2026-09-14` |
| `/sitemap-0.xml` | ✅ 200, **46 `<url>`**, 9 with `<lastmod>` |
| `/sitemap.xml` | ✅ **301** → `/sitemap-index.xml` |
| `/llms.txt` | ✅ 200, **7,723 B** |
| `/llms-full.txt` | ✅ 200, **40,212 B** |
| Canonical | ✅ absolute + trailing slash on all tested pages |
| `<h1>` count | ✅ **1 on every tested page** (5/5) |
| hreflang | ✅ `fa-IR` + `x-default`, self-referential |
| Slash variance | ✅ no duplicate content — `/services/ai`, `/about`, `/blog`, `/faq` all redirect to slash form |
| Legacy `/home` | ✅ 301 → `/` |
| Legacy `-2024` slugs | ✅ 301 → evergreen |
| JSON-LD present | ✅ 1–4 blocks per tested page |

**This resolves the #4 "High" deployment risk from 09-14 and the entire §1.5 of `audit-full-2026-09-12.md`.** Production target is Cloudflare Workers with Static Assets; `worker.ts` implements `REDIRECT_MAP` 301s + security headers + `/blog/post/:slug` dynamic redirect, and `_headers`/`_redirects` are also parsed by Workers for static-asset responses. Both mechanisms run on disjoint paths and back each other up — verified live.

### 1.2 Issues

| # | Severity | Issue | Evidence | Fix |
|---|---|---|---|---|
| T1 | **High** | **No `Strict-Transport-Security` and no `Content-Security-Policy`** on any tested response. Present: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `cache-control: public, max-age=3600`, `cf-cache-status: HIT`. | live header dump on `/` | Add `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (only after HTTPS verified site-wide) + baseline CSP in `worker.ts` header block (`worker.ts:126-147`) **and** `public/_headers` — keep them in sync. |
| T2 | **High** | **Sitemap `lastmod` coverage 9/46.** 37 URLs — including `/`, `/about/`, `/blog/` — have **no `<lastmod>`**. `astro.config.mjs:14-28` only maps MDX `updated` → blog paths. | `dist/sitemap-0.xml`, live | Extend the serialize pass to stamp non-blog pages from git last-commit date, or from a `lastUpdated` frontmatter field. Freshness is one of the few levers left post-collapse. |
| T3 | Medium | **Slash normalization returns 307 (temporary), not 308 (permanent).** `X-Robots-Tag` equity transfer is weaker for a permanent, canonical change. | `/about` → 307 | Emit **308** for trailing-slash normalization (Cloudflare assets default). Legacy `_redirects` rules correctly use 301. |
| T4 | Medium | **Malformed duplicate `Cache-Control`** on robots/sitemap responses: `public, max-age=3600, public, max-age=86400` — two values concatenated; parsers honour only the first, so the intended 1-day TTL is silently truncated to 1 hour. | live `/robots.txt`, `/sitemap-index.xml` | Set headers once — the `_headers` file and `worker.ts` are both writing `Cache-Control` for overlapping paths. Drop one. |
| T5 | Medium | **Redirect chain (2 hops):** `/blog/post/seo-guide-2024` → `/blog/seo-guide-2024/` → `/blog/seo-guide/`. Chains dilute equity and waste crawl budget. | live, `-L` traced | Add `/blog/post/seo-guide-2024` (and the other `-2024` slugs under `/blog/post/`) as **direct** 301s to the final URL in `worker.ts` `REDIRECT_MAP`. |
| T6 ✅ | Low | **HTML cache rule mismatch risk:** `cache-control: public, max-age=3600` on `/` is correct live, but `_headers` pattern-based rules and Workers Static Assets path matching can diverge. | — | Covered by `scripts/verify-deploy.mjs` — extend it to assert `max-age=3600` on an HTML path (it currently checks cache headers at `:95-107`). **Resolved (action 2.11):** the gate now asserts exactly one `public, max-age=3600` on an HTML path, plus HSTS and CSP, on every deploy. |
| T7 | Low | **`manifest.json` vs `site.webmanifest` duplication** — Persian vs English name, `#3b82f6` vs `#ffffff` theme. Both shipped in `public/`. | `public/` | Keep one (the linked `site.webmanifest`), delete the orphan. |
| T8 | Info | `WebSite > SearchAction` targets `/blog/?q=…` but blog search is client-side with no `?q=` handling. Sitelinks SearchBox retired 2024 → zero benefit either way. | `OrganizationStructuredData.astro` | Drop the `SearchAction` block. |
| T9 ✅ | Info | `geoRadius: '50000'` is a bare string, not a `QuantitativeValue`. | `ProfessionalService` | Wrap as `{"@type":"QuantitativeValue","value":50000,"unitCode":"MTK"}`. **Resolved 2026-09-24 — by removal, not wrapping:** `geoRadius` no longer appears anywhere in `src/` or `public/` (0 references), so there is nothing left to wrap. The `Service` half of this item shipped as action 2.13. |

### 1.3 Re-verification of 09-14 findings — what's fixed

The predecessor audit's High/Critical items were re-checked against current code. **Do not re-fix these:**

| 09-14 finding | Status now | Evidence |
|---|:---:|---|
| Deployment-target mismatch (T1, "High") | ✅ **Fixed** | Live serves Astro; `worker.ts` + `_headers`/`_redirects` both active; verified by HTTP tests |
| Breadcrumb prop bug on 9 service pages | ✅ **Fixed** | All 31 call sites now pass `{position, name, item}`; component hardened to accept `url` (`BreadcrumbStructuredData.astro:32`) |
| Duplicate article entity (`BlogPosting` + `Article`) | ✅ **Fixed** | `BlogPost.astro:31` now emits **`FAQPage` only**; single `BlogPosting` with `@id` in `blog/[slug].astro:64` |
| Relative image URLs in blog schema | ✅ **Fixed** | `blog/[slug].astro:74` and `blog/index.astro:34` both `new URL(post.image, 'https://asreseo.com')` |
| Empty `author` → `Person{name:''}` | ✅ **Fixed** | `author` set on all 9 MDX posts; `[slug].astro:77-79` falls back to `Organization` |
| `AggregateRating` / `LocalBusiness` spam risk | ✅ **Fixed** | **Absent live on all 5 tested pages**; `LocalBusiness` gone from `src/` entirely |
| Homepage duplicate meta description | ✅ **Fixed** | Live `/` description is unique (150 chars); `BaseLayout` fallback rewritten to non-claim text (`BaseLayout.astro:30-34`) |
| Stars rendered on unverified testimonials | ✅ **Fixed** | Both `TestimonialsSection`s gate on `verified` — and all 6 entries are `false`, so **no stars render** |

**⚠️ Stale comment to correct:** `src/lib/site-claims.ts:43-48` still claims the stars are *"NOT gated on `verified` today … all six entries currently show 5 stars"*. The components **do** gate now. Update the comment so the next audit doesn't re-report it.

---

## 2. On-Page SEO — 80/100

### 2.1 Live-verified metadata (all 5 sampled pages)

| Page | Title (len) | Description (len) | H1 | Canonical | JSON-LD blocks |
|---|---|---:|---|---|---:|
| `/` | `آژانس دیجیتال مارکتینگ، خدمات سئو و هوش مصنوعی \| عصر سئو` (56) | 150 | `خدمات هوش مصنوعی و سئو حرفه‌ای در ایران` | `https://asreseo.com/` | 2 |
| `/services/ai/` | `خدمات هوش مصنوعی \| اتوماسیون و سئو با AI \| عصر سئو` (50) | 144 | `خدمات هوش مصنوعی و سئو سازمانی` | `…/services/ai/` | 4 |
| `/blog/` | `وبلاگ عصر سئو \| آموزش دیجیتال مارکتینگ \| مطالب آموزشی تخصصی` (59) | 128 | `وبلاگ عصر سئو` | `…/blog/` | 1 |
| `/faq/` | `سوالات متداول سئو و دیجیتال مارکتینگ \| عصر سئو` (46) | 139 | `سوالات متداول سئو و دیجیتال مارکتینگ` | `…/faq/` | 2 |
| `/about/` | `درباره ما \| آژانس دیجیتال مارکتینگ و سئو عصر سئو` (48) | 126 | `درباره عصر سئو؛ آژانس تخصصی رشد ارگانیک و سئو مدرن` | `…/about/` | 3 |

- **Titles:** ~~all 46–59 chars, none >60~~ — **corrected 2026-09-23**: that reading came from a 5-page sample. The full 50-page build had 8 blog titles at 61–82 chars and 10 indexed titles under 40. All now land in a **40–60** band site-wide (`seoTitle` frontmatter shortens the blog `<title>` only; H1/headline/breadcrumb keep the full title).
- **Descriptions:** ~~all 126–150~~ — **corrected 2026-09-23**: a full scan found 9 over 155 (max 173) and some under 100. All now **104–154** across the 49 indexed pages.
- **H1:** exactly 1 per page site-wide; homepage H1 now carries `خدمات هوش مصنوعی و سئو` (the 09-14 "generic H1" and 09-12 "welcome H1" complaints are **fixed**).
- **`/services/` H1** sharpened from `خدمات حرفه‌ای ما` → keyword-bearing (commit `3e14ee0`).

### 2.2 Issues

| # | Severity | Issue | Fix |
|---|---|---|---|
| O1 | **High** | **`/blog/` H1 is `وبلاگ عصر سئو`** — a brand label, not a query match. The blog is the single biggest underperforming asset (§5). | Reword to intent: `آموزش سئو و دیجیتال مارکتینگ` / `مقالات تخصصی سئو، محتوا و هوش مصنوعی`. Pair with a one-line answer block for AEO. |
| O2 ✅ | Medium | **Thin indexable utility pages** still `index, follow`: `support/` (~80w), `privacy/`, `terms/`, `sitemap/`. `/sitemap/` actively draws **11 impressions at position 5.82** — it competes with content pages. | Expand `support`/`privacy`/`terms` to ≥300w of genuinely useful policy text; **`noindex` `/sitemap/`** (standard for HTML sitemaps) — `BaseLayout` already supports `noindex` (`BaseLayout.astro:22,41`), only `404.astro` uses it today. |
| O3 ✅ | Medium | **4 duplicate `og:image` assignments** remain (09-14 §2.1): `web/`↔`seo-web-design`, `marketing/`↔`ai/marketing-engagement`, `content/`↔`content/text-content`. | Assign distinct OG per URL. |
| O4 ✅ | Medium | **OG images are `.webp` declared as 1200×630.** X/Telegram/LinkedIn WebP support is inconsistent; declared dims may not match true dims. | Serve PNG/JPEG OG variants at true 1200×630 (`public/og-default.png` already correct as fallback). |
| O5 ✅ | Low | Short titles/descriptions on utility pages (`support` 18, `privacy` 20, `terms` 25, `sitemap` 19 chars). | Lengthen to 40–55 / 120–155 when expanding in O2. |
| O6 ✅ | Low | `/sitemap/` has 7 raw-URL anchor texts (09-14 item — **partially fixed** by `3e14ee0`; re-verify any remainder). | Persian descriptive labels. |
| O7 ✅ | Low | `website-speed` page still cites **FID** targets (superseded by **INP** since 2024). Sibling `technical-onpage` already uses INP. | Replace FID → INP (≤200ms). |

> **✅ = resolved 2026-09-23.** O1 shipped earlier as P2.1 (`/blog/` H1 reworded + answer block). O2/O5 shipped as P2.2/P2.5 (privacy 729w, terms 760w, support 931w; `/sitemap/` now `noindex, follow` and dropped from the XML sitemap; all four utility titles 40–55, descriptions 120–155). O3/O4 shipped as P2.4 — 35 true **1200×630 JPEG**s in `public/og/`, 3 new 2×2 montage cards for the named duplicate pairs, zero `og:image` still pointing at `.webp`. O6 re-verified clean (0 raw-URL anchors). O7 shipped as P2.6 (`faq/` FID→INP; only remaining "FID" is the `seo-guide` explainer describing the replacement).
>
> **Deliberately not "fixed":** `/`, `/faq/`, `/services/` and the utility pages share `og-default.png`, and 6 blog posts reuse their subject service page's hero. Distinct branded art for these would be decoration, not an SEO or sharing fix — documented rather than changed.

---

## 3. Content quality / E-E-A-T — 62/100 ← *weakest category*

### 3.1 The measurable content failure

From [`gsc-data-analysis` §5](./gsc-data-analysis-2026-09-23.md):

| Metric | Value |
|---|---|
| Sitemap URLs | 46 |
| URLs with ≥1 impression | **16 (35%)** |
| URLs with **0** impressions | **30 (65%)** |
| **Blog posts with ≥1 impression** | **0 of 9 (0%)** |
| Zero-click query impressions | **297 across 12 queries** |

**Nine cornerstone articles — 673–1,684 words each, every one with `keyTakeaways` + FAQs, all refreshed Sept 2026, all carrying `lastmod` — produced zero measurable search impressions in 92 days.**

Assessed against blog-cluster/content criteria:

| Criterion | Status | Detail |
|---|:---:|---|
| Hub-and-spoke architecture | ⚠️ | `/blog/` hub ranks **13.09** but spokes earn 0 — the hub ranks because of brand+nav, not topic authority. No internal-link depth carrying authority outward. |
| Body depth vs target query | ⚠️ | 673–1,684 words. Competitor level for `سئو`, `تقویم محتوا`, `اعتبار صفحه` is typically 1,500–2,500. Three posts are under 1,000 rendered words. |
| External authority (links) | ❓ **unknown** | No backlink export available. Strongest correlate of both ranking and AI citation — **must be measured** (`seo-backlinks` / GSC Links report). |
| Cannibalization | ⚠️ | `page-authority-guide` ↔ `/services/seo/content-authority/` both target `اعتبار صفحه`; `content-calendar-guide` ↔ `/services/content/content-calendar/` both target `تقویم محتوا`. The **service** pages hold the impressions (178, 102) and the **blog** posts hold none — Google chose one URL per intent and the blog lost. |
| Freshness signal | ✅ | All 9 posts `updated` Sept 2026 with `lastmod` emitted. |
| Authorship / Who | ✅ | `author` set on all 9 (`مهندس علی بختیاری`, `سارا احمدی`, `تیم …`); `Person` in `BlogPosting`; `about/` emits `AboutPage` + `Person`. 09-14's "empty author" warning is **fixed**. |
| Process / How | ✅ | AI-service pages disclose human oversight; `llms-full.txt` documents methodology. |
| People-first / Why | ✅ | No doorway/stuffing signals; the old `تضمین رتبه یک` claim removed. |

### 3.2 Trust — still the pre-existing blocker (partially mitigated)

`src/lib/site-claims.ts`:

| Claim | `verified` | Rendered? |
|---|:---:|---|
| 6 testimonials, all `rating: 5`, specific outcome claims (e.g. `فروش آنلاین ما ۳۰۰٪ افزایش پیدا کرد`) | **all `false`** | ✅ text renders, **stars correctly hidden** |
| `۵۰۰+ مشتری راضی` | `false` | ⚠️ **renders unconditionally** (`HEADLINE_STATS`) |
| `۹۸% میزان رضایت` | `false` | ⚠️ **renders unconditionally** |
| `۵۰۰٪ متوسط رشد فروش` | `false` | ⚠️ **renders unconditionally** |
| `۲۴/۷ پشتیبانی` | `true` | ✅ |
| `۵` سال / `۵۰۰` پروژه / `۳۰۰٪` رشد (`PROSE_STATS`) | `false` | ⚠️ **renders unconditionally** (`WhyChooseUsSection.astro:7,12,13,31`) |

**Status:** `AggregateRating`/`Review` schema correctly withheld (verified absent live — no manual-action exposure there ✅). But **`HEADLINE_STATS` and `PROSE_STATS` are not gated on `verified`**, so unverifiable numbers still appear as visible copy. This is the **E-E-A-T / YMYL-adjacent trust risk** and it also directly harms GEO: generative engines discount unsourced numeric claims.

**Fix:** gate `HEADLINE_STATS`/`PROSE_STATS` rendering on `verified` exactly like the stars already are, or replace with sourced values. Also correct the stale comment at `site-claims.ts:43-48`.

### 3.3 Undeclared frontmatter silently stripped

`src/content.config.ts:9-25` declares only `title, excerpt, description, category, author, date, updated, image, keywords, keyTakeaways, faqs`. Fields present in MDX but **absent from the Zod schema are dropped at parse time**:

| Field | Consequence |
|---|---|
| `tags` | `BlogPost.astro:171` maps over `[]` → tag list never renders |
| `featured` | featured badge (`BlogPost.astro:40`) never shows |
| `readTime` | `{post.readTime}` (`BlogPost.astro:59`) renders **empty** |
| `slug` | harmless (routes use `entry.id`) |

Confirmed in build output: no `ویژه` badge, no `N دقیقه` read-time text anywhere in `dist/blog/`. **Silent data loss** — either add the fields to the schema or delete them from the MDX so they stop lying.

### 3.4 Word-count claim conflict

`audit/fixes-2026-09-12.md:257-258` claims `ai-content-automation` = "2,100+ words" and `content-strategy-guide` = "2,200+ words". Measured rendered bodies are **~700–900** and **~750–950** respectively (and the 09-14 audit measured the set at 673–1,684). Two files disagree; the rendered measurement is authoritative. Correct the fixes log.

---

## 4. Schema / structured data — 74/100 (+9 vs 09-14)

**42 of 43 page files emit `application/ld+json`; only `404.astro` is bare.** Live JSON-LD block counts: `/` 2, `/services/ai/` 4, `/blog/` 1, `/faq/` 2, `/about/` 3.

### 4.1 Inventory (live + code)

| Type | Where | Notes |
|---|---|---|
| `Organization` + `ProfessionalService` (`@id #organization`) | `OrganizationStructuredData.astro:42` | ✅ has `@id` |
| `WebSite` (`@id #website`) | same file | ✅ |
| `OfferCatalog` → `Offer` → `Service`×3 | `HomepageStructuredData.astro:46` | provider → `#organization` ✅ |
| `BreadcrumbList` | `BreadcrumbStructuredData.astro:36`, 31 call sites | ✅ all `{position, name, item}` |
| `FAQPage` | `ServiceFAQ.astro:40` (25 pages), `consultation`, `about`, `contact`, `faq`, `support`, `blog/[slug]` | ~25 pages |
| `Service` + nested `Organization`/`Offer` | all 25 service pages | |
| `BlogPosting` + `@id` + gated author + absolute image + `speakable` | `blog/[slug].astro:64` | ✅ fixed |
| `Blog` → 9 `BlogPosting` | `blog/index.astro:16` | ⚠️ see D2 |
| `WebPage` + `SpeakableSpecification` | `services/ai:131` | |
| `HowTo` | `content-calendar:242` only | see D5 |
| `AboutPage` + `Person` | `about:14` | |
| `CollectionPage` + `ItemList` + `WebSite` | `portfolio:186` | |
| `WebPage` | `sitemap`, `terms`, `privacy` | |
| **`AggregateRating` / `Review` / `LocalBusiness`** | **nowhere** | ✅ correct — verified absent live |

### 4.2 Remaining issues

| # | Severity | Finding | Fix |
|---|---|---|---|
| D1 | **High** | **`Organization` declared in 3+ places with inconsistent identity.** `OrganizationStructuredData.astro:7` (has `@id`), `services/index.astro:19` (**no `@id`**, `url` without trailing slash, `sameAs` includes twitter), `contact/index.astro:12` (**no `@id`**), `about/index.astro:18` (nested). Plus identity drift: `foundingDate 2020` vs about-timeline `۱۳۹۸`/2019; phone `+989125811880` vs `+98-912-581-1880`; address `Tehran/Tehran/IR` vs `تهران/تهران/IR`; trailing-slash inconsistency. | Emit `#organization` **once**; replace the duplicates with `{"@id":"https://asreseo.com/#organization"}` references. Unify phone/address/foundingDate/`sameAs`. |
| D2 | Medium | **Cross-page `BlogPosting` duplication without `@id` on the list.** The same 9 entities appear on `/blog/` (no `@id`) and `/blog/<slug>/` (`#article`). | Add the identical `@id` to the `/blog/` list nodes so both resolve to one entity. |
| D3 ✅ | Medium | **`Service` nodes unlinkable** — no top-level `url` / `image` / `inLanguage` / `@id`; `areaServed` is a bare `"Iran"`/`"IR"` string on some, `Country` object on `ai/`+`content/` hubs; `provider` lacks `@id`/logo on leaves. | Add `url`, absolute `image`, `inLanguage: "fa-IR"`, `@id`; normalize `areaServed` to `Country`; point `provider` at `#organization`. **Directly improves AEO entity resolution.** **Resolved 2026-09-24 (action 2.13):** measured **92** Service nodes, not the 6 originally counted — **92/92** now carry all four fields, `areaServed` is **89 `Country` + 3 `Place`** (from five spellings), **92 unique `@id`s, 0 duplicates**, `provider` still linked. Normalising surfaced a real defect: `/` emits two structured-data components and both were minting `#service`/`#service-2`/`#service-3`, so the same entity was described twice with different properties — separated by an `idNamespace`. `src/lib/service-schema.ts` wraps all 28 emit sites so later additions inherit the fields. Asserted on every deploy. |
| D4 | Medium | **Missing `BreadcrumbList` where visual crumbs exist:** `blog/[slug]` (renders a visual `<ol>` but no schema), `services/` hub, `blog/` index. | Add `BreadcrumbStructuredData` to those 3. |
| D5 | Info | `FAQPage` (~25 pages) + `HowTo` (1 page) are **valid but give zero Google SERP benefit** — FAQ rich results retired for all sites (May 2026), HowTo retired Sept 2023. | **Keep** for LLM/AEO entity understanding (genuinely useful for AI answers). Never add `HowTo` elsewhere. `HowTo.totalTime: P30D` is arbitrary — set a defensible value. |
| D6 ✅ | Info | `Blog` index `blogPost[].position` is not a valid `BlogPosting` property. | Wrap in `ItemList<ListItem>` or drop `position`. **Resolved 2026-09-23:** the built output has **141** valid JSON-LD blocks and **zero** `BlogPosting` nodes containing `position`. *(The first measurement read 73 blocks — an attribute-ordered regex missed the 68 that put `id=` before `type=`. Re-measured on all 141, 2026-09-24, and now asserted on every deploy by `verify-deploy.mjs`.)* |
| D7 | Low | Publisher logo `ImageObject{url}` without `width`/`height`; file `Logo-spaced.png` is case-sensitive-fragile. | Add dimensions. |
| D8 | Low | `services/index.astro` uses double-quoted keys — harmless but stylistically inconsistent with the rest. | Normalize. |

**No `Review`/`AggregateRating` — correct, keep it that way until testimonials are `verified: true` with on-page visible reviews.**

---

## 5. Content architecture / blog readiness — covered in §3, expanded here

Per blog-cluster criteria, the site has a hub (`/blog/`) and 9 spokes but **no measurable authority flowing to spokes** (0 impressions each). Full diagnosis, the zero-click-query → owning-page map, and a per-post action plan are in:

**→ [`content-plan-zero-click-2026-09-23.md`](./content-plan-zero-click-2026-09-23.md)**

Summary of the architecture verdict:

- **Two cannibalization pairs resolved the wrong way** — Google ranks the *service* page and ignores the *blog* post for the same intent (`تقویم محتوا`, `اعتبار صفحه`). Decision needed: differentiate intent (blog = how-to/definition, service = commercial) or consolidate.
- **297 zero-click impressions across 12 queries** map cleanly onto 3 existing pages — these need on-page strengthening, not new pages.
- **`/services/content/` hub shows 0 impressions** while `خدمات استراتژی محتوا` holds 52 impressions at position 42 — attribution ambiguity to resolve in GSC (checklist §9).

---

## 6. Performance / CWV — 78/100

**No CrUX or PageSpeed field data available to this audit** — this is a checklist item, not a guess.

### What's good (static-build reasoning + live evidence)
- **Zero client JS bundles.** Astro static; homepage 180 KB HTML, `cf-cache-status: HIT`, `cache-control: public, max-age=3600`. Compare legacy Next.js: 14 bundles, 628 KB decoded, 40 requests, TTFB 553 ms, FCP 812 ms.
- `Picture.astro` with `astro:assets`, `formats=[avif,webp]`, `widths=[320…1024]`, responsive `sizes`, `decoding=async`, heroes `eager` / below-fold `lazy`.
- Fonts preloaded (`regular.woff2`, `bold.woff2`).
- **`dist/`: 57 `<img>`, 0 missing `alt`, 0 missing `width`** ✅.
- Static assets immutable 1y; HTML cached 1h live.

### Issues
| # | Severity | Issue | Fix |
|---|---|---|---|
| P1 | **High** | **No field data at all.** Cannot confirm LCP ≤2.5s / INP ≤200ms / CLS ≤0.1. | Run PSI on `/` + `/services/ai/` (mobile) and `/blog/`; publish results. This also closes the mobile-position gap question (§7). |
| P2 ✅ | Medium | **No `fetchpriority="high"` on LCP hero**; `ServicesHero` lacks explicit `aspectRatio`. | Add to above-fold heroes. **Resolved 2026-09-24 (action 2.18):** `Picture.astro` defaults `fetchpriority` to `high` when `eager`, so **40/40** eager images carry it and **0** of the 23 lazy ones do — no call site had to be edited, and a future eager image is covered automatically. **`aspectRatio` deliberately not added:** Astro already emits `width`/`height` and Tailwind preflight applies `max-width:100%; height:auto`, so the browser reserves the box from the intrinsic ratio; the heroes sit in fixed-height containers (`h-[400px]`, `h-87.5`), where injecting `aspect-ratio` risks a visual regression for no CLS gain. Asserted on every deploy. |
| P3 | Medium | **No `prefers-reduced-motion`** despite `float`, `pulse-glow`, `glow`, `zoom-in`, `slide-in-up`, `gradient`, `bounce` keyframes (also a WCAG 2.3.3 failure). | Add a `@media (prefers-reduced-motion: reduce)` block in `globals.css`. |
| P4 ✅ | Low | `Picture` fallback branch renders bare `<img>` without dimensions (currently unhit — all sources `.webp` — but fragile). | Add `width`/`height` to the fallback branch. **Resolved 2026-09-24:** the branch now accepts `width`/`height` and forwards them; the metadata-backed branch was already emitting dimensions (**40/40** eager images sized). |
| P5 | Low | Dead assets: `dist/sw.js` referenced by no page (BaseLayout actively unregisters SW); `dist/js/ajax-form.js` only used by `/consultation/`. | Remove `sw.js`; confirm `ajax-form.js` needed. |

---

## 7. Mobile & accessibility — cross-cutting

| Check | Result |
|---|:---:|
| `<html lang="fa" dir="rtl">` + `og:locale fa_IR` | ✅ all pages |
| `<img>` missing `alt` / `width` | ✅ 0 / 0 |
| Exactly one `<h1>` | ✅ all pages |
| **Mobile vs desktop position gap** | ❌ **9.8 positions worse on mobile** (53.79 vs 44.03) — and mobile = 84% of clicks |
| **`prefers-reduced-motion`** | ❌ absent |
| **Global `:focus-visible`** | ❌ absent from `globals.css` (only `Button.astro` has focus rings) |
| **Form `<label for>`/`id` association** | ❌ bare sibling labels — WCAG 1.3.1 / 3.3.2 / 4.1.2 |
| **Duplicate `class` attributes** | ❌ `Icon.astro:40` injects `class` into lucide SVGs that already ship `class="lucide …"` → invalid HTML (09-12 measured 2,518 instances; **re-verify — may be fixed**) |

**The mobile position gap is the highest-leverage accessibility item**: mobile is 84% of traffic, ranks 10 places worse, and the mobile header/hero overlap documented in `audit-full-2026-09-12.md` §1.3 was fixed in code but **has no field data confirming it**.

---

## 8. AEO / GEO (AI search readiness) — 80/100

GEO is SEO fundamentals applied to AI surfaces — scored that way, not as a separate discipline.

### 8.1 What works (all verified **live**, not assumed)

| Asset | Evidence |
|---|---|
| **`llms.txt`** | **200, 7,723 B** — agency summary, bilingual service labels, absolute trailing-slash URLs, newest-first blog list, policy links, citation guidance (`prefer canonical`, `fa/RTL` note, phone/email) |
| **`llms-full.txt`** | **200, 40,212 B** — genuine entity KB: services with blurbs, company FAQs, **all blog FAQs deduped**, cornerstone summaries with `Last updated` + key takeaways, portfolio cases |
| **Build-time dead-link guard** | `assertPathsExist()` (`llms.ts:269-277`) called from `llms.txt.ts:24` + `llms-full.txt.ts:16` — a dead URL **fails `astro build`** |
| **AI crawler permissions** | robots.txt explicitly `Allow: /` for GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended, Amazonbot — **verified live, no Cloudflare override stripping them** |
| **Citability plumbing** | question-based H2s, `keyTakeaways` card, FAQ accordion + `FAQPage`, `SpeakableSpecification`, `inLanguage: fa-IR`, fresh `updated` dates |
| **SSR-safe** | all citable content static HTML — no JS dependency for Googlebot or AI fetchers |
| **Canonical hygiene** | absolute canonicals everywhere → clean entity resolution for AI consumers |

### 8.2 Gaps

| # | Severity | Gap | Fix |
|---|---|---|---|
| G1 | **High** | **Zero presence in enhanced search surfaces.** GSC `Search appearance` sheet is **empty** — no Discover, no AI Overview, no image results. The `llms.txt` plumbing is not translating into measurable appearance. | Confirm with GSC API + manual AI-engine probes (ask ChatGPT/Perplexity/Gemini about `خدمات هوش مصنوعی` and record whether asreseo.com is cited). Track monthly. |
| G2 | **High** | **Zero blog impressions** (§3.1) = zero passage-level material for AI engines to cite. AI answers draw from indexed, ranking, well-structured passages. | Execute [`content-plan`](./content-plan-zero-click-2026-09-23.md). |
| G3 | Medium | **Unverified numeric claims** (`۵۰۰+`, `۹۸٪`, `۵۰۰٪`) rendered without sources — generative engines are trained to discount unsourced numbers. | Gate on `verified` or cite (§3.2). |
| G4 | Medium | **No off-site brand-entity footprint** (Wikipedia/Wikidata/Reddit/YouTube/LinkedIn) — the strongest AI-citation correlates; brand mentions ≈ 3× backlinks for citation. | Off-site entity build: LinkedIn → YouTube → Reddit → Wikidata, in that effort order. Nothing to fix in code. |
| G5 | Medium | **`Service` nodes missing `image`/`url`** weakens entity resolution for AI consumers (same fix as D3). | as D3 |
| G6 | Low | `llms.txt` has no `last-updated` timestamp header; `POLICY_PAGES` rendered as plain text, not markdown links. | Add timestamp; linkify policies. |
| G7 | Low | No `CCBot` / `Bytespider` / `Meta-ExternalAgent` entries in robots.txt (optional — decide policy deliberately). | Explicit `Allow`/`Disallow` per desired training posture. |
| G8 | Info | Google ignores `llms.txt` (it serves non-Google crawlers) — correctly *not* claimed as a ranking lever in code comments. | No action; keep the comment honest. |

### 8.3 What's already at GEO best-practice level
Definition-first intros, self-contained answer blocks, question-based H2s, dated content, `Person`/`Organization` schemas, `SpeakableSpecification`, deduped FAQ knowledge base, absolute canonicals, static rendering. **The on-site AEO foundation is better than most agency sites** — the deficit is in *demand capture and off-site authority*, not in AEO mechanics.

---

## 9. Prioritized action plan

**Full roadmap with owners/effort:** [`action-plan-2026-09-23.md`](./action-plan-2026-09-23.md)

### P0 — this week (unknown-state + business-critical)
1. **Check GSC → Security & Manual Actions → Manual Actions** (2 min, currently unknown — could explain the entire collapse).
2. **Diagnose the 2026-08-27 collapse** — run hypotheses H1–H5 in `gsc-data-analysis` §2.3, in order.
3. **Resolve the CTR/position impossibility** — GSC API vs Cloudflare server logs for `/services/ai/`. Determines whether historical clicks were real (§6.2 of the GSC doc).
4. **Gate `HEADLINE_STATS`/`PROSE_STATS` on `verified`** — stop rendering unverifiable `۵۰۰+`/`۹۸٪`/`۵۰۰٪`/`۳۰۰٪`.
5. **Add HSTS + CSP** in `worker.ts` **and** `_headers` (keep in sync).

### P1 — next 2 weeks (biggest available wins)
6. **Strengthen the 2 zero-click high-impression pages** — `content-calendar` (178 impr, pos 65) and `content-authority` (102 impr, pos 53). Page 6 → page 1–2 is worth more than new content.
7. **Fix sitemap `lastmod` coverage** 9/46 → 46/46.
8. **Fix `Organization` entity fragmentation** (D1) + add `BreadcrumbList` to `blog/[slug]`, `services/`, `blog/` (D4).
9. **Resolve blog↔service cannibalization** for `تقویم محتوا` and `اعتبار صفحه` (differentiate or consolidate).
10. **Run PSI/CrUX** on `/`, `/services/ai/`, `/blog/` — mobile.
11. **Add undeclared MDX fields to the Zod schema** (or delete them) — `tags`, `featured`, `readTime`.

### P2 — next month
12. Expand or `noindex` thin utility pages; `noindex` `/sitemap/`.
13. Fix 4 duplicate `og:image`s; serve PNG/JPEG OG at true 1200×630.
14. 307 → 308 slash redirects; single-hop `-2024` redirects; de-duplicate `Cache-Control`.
15. A11y batch: `prefers-reduced-motion`, global `:focus-visible`, `label for`/`id`, re-verify `Icon.astro` duplicate `class`.
16. Off-site entity footprint (LinkedIn → YouTube → Reddit → Wikidata).
17. Backlink audit — measure referring domains (currently unknown, strongest missing variable).

---

## 10. Verification log (this audit)

| Check | Result |
|---|---|
| Live framework | ✅ Astro (`/_astro/` ×6, `/_next/static/` ×0) |
| `robots.txt` | ✅ 200, 622 B, 7 AI crawlers allowed, no CF override |
| Sitemaps | ✅ `/sitemap.xml` 301 → index 200 → `sitemap-0.xml` 200, **46 URLs**, 9 `lastmod` |
| `llms.txt` / `llms-full.txt` | ✅ 200 / 200, **7,723 B / 40,212 B** |
| `<h1>` count (5 pages) | ✅ 1 each |
| Canonicals (5 pages) | ✅ absolute + trailing slash |
| hreflang (5 pages) | ✅ `fa-IR` + `x-default` |
| `AggregateRating` (5 pages) | ✅ **absent everywhere** |
| Slash vs non-slash | ✅ 307 redirect, no duplicate content |
| Legacy `/home`, `-2024` | ✅ 301 → 200 (⚠️ 2-hop chain on `/blog/post/*`) |
| Headers | ⚠️ HSTS + CSP **missing**; duplicate `Cache-Control` on robots/sitemap |
| GSC export | ✅ all 7 sheets read programmatically; cross-dim reconciliation in GSC doc §1 |
| Page visibility | ⚠️ **16/46** URLs with impressions; **0/9** blog posts |
| Backlinks / CrUX / Manual Actions / GSC API | ❌ **unavailable — listed as actions, not guessed** |

**Falsifiability:** re-run the live checks in this section plus `gsc-data-analysis` §9 after any fix. The three headline metrics to move are **clicks/day** (§2), **page coverage 16/46** (§5), and **blog impressions 0/9** (§5.1). If none move after the P1 work, the constraint is off-site authority, not on-site SEO.

---

## 11. Files changed by this audit

**Added:**
- `audit/gsc-data-analysis-2026-09-23.md` — deep analysis of the GSC XLSX export
- `audit/seo-aeo-geo-audit-2026-09-23.md` (this report)
- `audit/content-plan-zero-click-2026-09-23.md` — zero-click query → page map + blog action plan
- `audit/action-plan-2026-09-23.md` — prioritized P0/P1/P2 roadmap

**Modified:** `audit/README.md` (index updated)

**No source files modified.**

---

*Generated 2026-09-23. Scores are heuristics over live HTML + codebase + a 3-month GSC export — not Google-internal signals. Part of the asreseo.com audit dossier — see [`README.md`](./README.md).*
