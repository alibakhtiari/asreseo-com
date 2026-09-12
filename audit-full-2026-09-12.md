# Full Audit — asreseo.com (UI · UX · SEO · GEO · AEO · Performance)

> Run: 2026-09-12 against `https://asreseo.com` (live) and `http://localhost:4321` (local Astro dev) + built `dist/` (production build).
> Methodology: title/desc/canonical/H1/schema crawl of all 45 built pages; structured-data parse + JSON‑LD validation; Lighthouse 12 (desktop + mobile) on the production build served locally; visual inspection via headless Chrome screenshots; manual comparison live ↔ local.
> Prior context: `audit-seo-aeo-geo-2026-09-08.md` and `further-optimizations.md`. Those audits cover SEO/GEO deltas — this report covers **UI/UX, performance, full-site SEO, GEO, AEO** and verifies whether the prior work is even live.

---

## TL;DR (read this first)

1. **The site live at asreseo.com is NOT the Astro codebase in this repo.** It is still the previous Next.js deployment. Every optimization audit you have done in this repo (titles, schemas, FAQ expansion, llms.txt, hub pages, blog posts) is invisible to Google and users. **This is the single biggest issue and must be confirmed/fixed before anything else.**
2. **Two Google‑structured‑data violations exist** that could cause a manual action if surfaced: a self‑serving `aggregateRating` on the homepage and a `FAQPage` on `/consultation/` whose answers do not exist on the page.
3. **Homepage H1 is brand‑only** ("به عصر سئو خوش آمدید") on a page that ranks #4.37 for your money query. The H1 carries zero keyword — you are leaving the strongest on‑page signal on the table.
4. **Two forms (`/contact/`, `/consultation/`) have labels that are not programmatically associated with their inputs** — 5 fields per form, no `for=`/`id=` pairing. Click‑label‑to‑focus and screen‑reader labelling are broken.
5. **Homepage is 15,392 px tall and one section (`AllServicesSection`) is 6,122 px** (~7 viewports). Excessive single‑page scroll without anchor nav. Visual hero is content‑sparse (no imagery).
6. **Lighthouse is genuinely strong on the production build** (desktop 99 / 100 / 100 / 100; mobile 90 / 100 / 100 / 100). Caveat: served uncompressed in this audit; Cloudflare in production will compress and the real numbers will be better than the local runs.

---

## 1. Deployment mismatch — P0

### Evidence
| Probe | Live (asreseo.com) | Local Astro (`localhost:4321`) |
|---|---|---|
| HTML markers | `__next_f` ×1, `/_next/static/` ×2, `turbopack` ×1 (Next.js RSC payload) | `astro` ×4, `__astro` ×1 |
| Homepage HTML size | **482 KB raw / 72 KB gzip** (RSC payload) | 314 KB raw |
| `/sitemap-index.xml` | **404** (text/html, 239 KB) | n/a (Astro dev serves 404 — see note) |
| `/sitemap.xml` | **404** (the 301 → 404 chain) | n/a |
| `/llms.txt` | **404** | 200, 5.3 KB |
| `/llms-full.txt` | **404** | 200, 6.5 KB |
| `/robots.txt` | 1,248 bytes (Next.js default with content‑signal directives; no `Sitemap:` lines, no AI bot allow rules) | 391 bytes (custom, sitemap referenced, GPTBot/ClaudeBot/PerplexityBot/Google‑Extended allowed) |
| Homepage title | `عصر سئو \| بهترین خدمات دیجیتال مارکتینگ، سئو و هوش مصنوعی در ایران` | `آژانس دیجیتال مارکتینگ، خدمات سئو و هوش مصنوعی \| عصر سئو` |
| `/services/ai/` title | `خدمات هوش مصنوعی \| راه‌حل‌های AI برای کسب‌وکار شما` | `خدمات هوش مصنوعی \| اتوماسیون و سئو با AI \| عصر سئو` |
| `/contact/` title | **same as homepage** (duplicate titles) | `تماس با ما \| مشاوره رایگان دیجیتال مارکتینگ و سئو \| عصر سئو` |

6 of 8 sampled pages have **different titles** live vs local. Live `/contact/` literally serves the homepage title.

The Astro build *does* generate a sitemap (`dist/sitemap-index.xml`, `dist/sitemap-0.xml`) — but live returns 404 because the Next.js deployment doesn't include it.

### Action
- Confirm the Astro rebuild has been deployed to Cloudflare Pages. If the live deployment is still pointing at the old Next.js `_next/` output, the entire `audit-seo-aeo-geo-2026-09-08.md` and `further-optimizations.md` work is currently unseen by Google.
- After deploy, re-verify: `curl -I` the URLs above; check that live `/llms.txt` returns 200 and `/sitemap-index.xml` returns `application/xml`.
- The stale `sw.js` (which unregisters any legacy SW on activate) is a good safety net, but returning users may still have the old SW cached. Consider shipping a one-time cache-bust prompt.

> Note on local dev: `astro dev` does not emit the sitemap integration output, so local `/sitemap-index.xml` 404s are expected; the file is present in `dist/` after `astro build`. This is normal.

---

## 2. Structured data violations — P0

### 2.1 Homepage: self‑serving `aggregateRating` (LocalBusiness)

`dist/index.html` contains:
```json
{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"127"}
```
The hero visually shows **۴.۹ از ۵ امتیاز** (as a decorative trust badge) but:
- There is **no Review schema** anywhere on the site.
- There are **no review/testimonial entities that feed the aggregate count** — `TestimonialsSection.astro` uses plain cards (text + 5 stars + emoji avatar), not structured Review markup.
- No `AggregateRating` is repeated in the `Organization` or other entities — it's only in `LocalBusiness`.

Google's "Self-serving reviews" guidance: a site cannot both declare and fulfil its own aggregate rating without independent sources. This can cause a manual action / rich‑result suppression for LocalBusiness.

**Fix (one of):**
- Remove `aggregateRating` from the `LocalBusiness` JSON‑LD entirely. Keep the visual badge as decorative.
- Or add real `Review` entries (visible on the page, with reviewer name + `datePublished` + `reviewBody`) and wire `aggregateRating` to them. This is much more work and requires genuine customer permission.

### 2.2 `/consultation/`: `FAQPage` with invisible content

```
FAQPage: 4 Q
Qnotvisible=4/4  AnswNotVisible=4/4
```
The page schema declares 4 Q&As in `mainEntity`. The rendered page only has the heading **رزرو مشاوره تخصصی رایگان**, an `<h2> درخواست جلسه مشاوره`, a contact form, and an aside. There is no `<details>`, no accordion, no FAQ heading — none of the 4 questions or their answers appear in visible HTML.

**Fix:**
- Either delete the `FAQPage` block on `/consultation/` until visible Q&A is added.
- Or add a real "سوالات متداول" section to `/consultation/` (e.g., "آیا مشاوره واقعاً رایگان است؟", "چه اطلاعاتی باید ارسال کنم؟", "چقدر طول می‌کشد؟", "چه کسی با من تماس می‌گیرد؟") with `<details>` / schema‑tagged answers.

### 2.3 Other JSON‑LD observations
- **BreadcrumbList missing on 14 pages:** homepage, all 8 blog posts, `/consultation/`, `/contact/`, `/services/`, `/privacy/`, `/terms/`. Easy win.
- **Service schema missing `serviceType`** on `/services/seo/`, `/services/marketing/`, `/services/web/`, `/consultation/`. Add a precise `serviceType` (e.g., `"Search Engine Optimization"`).
- All 45 page JSON‑LD blocks **parse cleanly** (no malformed JSON). 34 pages have FAQPage, 28 have Service, 30 have BreadcrumbList. This part is solid.

---

## 3. SEO findings — P1

### 3.1 H1 vs. target query mismatch on money pages
| URL | H1 (current) | Target GSC query / intent | Recommended H1 anchor |
|---|---|---|---|
| `/` | `به عصر سئو خوش آمدید` | "خدمات هوش مصنوعی" (1,146 impr, pos 47.5), brand/site | Include "خدمات دیجیتال مارکتینگ، سئو و هوش مصنوعی" in the H1. Keep the warm welcome, but lead with the keyword. |
| `/services/seo/content-authority/` | `سئو محتوا و لینک‌سازی` | "اعتبار صفحه" (18 impr, pos 63.7), "سئو محتوا" | Add "افزایش اعتبار صفحه" to H1 or make it the lead. |
| `/blog/` | `وبلاگ عصر سئو` | informational | OK as branded index, but `/blog/<post>/` H1s already include the keyword. |

### 3.2 Meta descriptions — all within bounds
All 44 non-404 pages have meta descriptions between 70 and 160 chars (no thin, no truncations). Prior audit's "thin description" issue is resolved.

### 3.3 Title tags — all within 60 chars
All 44 titles ≤ 60 chars. Good.

### 3.4 Canonical / hreflang
- Every page has a self-referencing canonical to `https://asreseo.com/<path>/`. Good.
- No `hreflang` set — fine for a single-language fa site. The OG `og:locale: fa_IR` is present.

### 3.5 Content freshness
- 5 of 7 blog posts dated **2024** (ai-seo-guide 2024-11-20, seo-faq-guide 2024-11-28, seo-guide-2024, google-ads-guide-2024 2024-01-12, digital-marketing-trends-2024 2024-01-10).
- Only `content-calendar-guide` and `page-authority-guide` are 2026.
- For a 2026 site, 5 stale posts with 2024 dates are a YMYL/E-E-A-T risk (especially given Google's "helpful content" emphasis on freshness). Refresh, republish, or 301-redirect.

### 3.6 Author E-E-A-T
Bylines mix generic ("تیم عصر سئو", "تیم محتوای عصر سئو", "تیم سئو عصر سئو") with named authors ("مهندس علی بختیاری", "سارا احمدی", "احمد محمدی"). There are **no author bio pages** and **no `Person` schema** linking posts to a real profile. For a SEO/AI agency writing about SEO, this dilutes E-E-A-T.

### 3.7 Open Graph
- The default OG image on every page is `Logo-spaced.png` (512×512 PNG). That is square, small by current standards (1,200×630), and not optimized for social platforms.
- Custom `og:image` per money page is rare in this codebase.

### 3.8 Internal linking
- 0 orphan pages (every built page has ≥2 internal inlinks).
- `/services/content/` has only 2 inlinks — low for a hub page. Add internal links from blog posts and homepage `AllServicesSection` cards.
- No broken internal links.

### 3.9 Sitemap caveat
The Astro `sitemap` integration produces `sitemap-index.xml` + `sitemap-0.xml` correctly in `dist/`. `_redirects` redirects `/sitemap.xml` → `/sitemap-index.xml` (301). Both depend on the deployment.

---

## 4. GEO / AEO — P1

### 4.1 `llms.txt` and `llms-full.txt`
Both files are present in `public/` and copied to `dist/`. They list all 44 canonical URLs with brief Persian descriptions and end with a "Notes for AI consumers" block. **Coverage is complete** (only `/404/` is excluded). But both **404 on live** — same deploy issue.

### 4.2 `robots.txt`
Local robots has the four explicit AI-bot allow rules (GPTBot, PerplexityBot, ClaudeBot, Google-Extended). Live has Next.js default (no Sitemap, no bot allow). **GEO is actively worse on live than local.**

### 4.3 AEO patterns (answer-first content)
- `/services/ai/` already has the AEO answer block per prior audit.
- Money pages have 4–7 FAQ Q&As each in `FAQPage` (with visible content on most pages).
- **Exceptions**: `/consultation/` Q&As invisible (see 2.2); `/services/marketing/` and `/services/seo/` and `/services/web/` index hubs only have 3 Q&As each — light.
- Hero subtitles carry the "what we do" sentence in one paragraph — good for quote extraction.

### 4.4 Quotable, fact-bearing content
Statistics shown ("98% رضایت مشتریان", "۵۰۰+ پروژه موفق", "۵+ سال تجربه") appear with no source/note. For citation by AI engines, add provenance (case-study links, dates) or you risk "unsourced claim" dilution.

---

## 5. UI / UX — P1

### 5.1 Forms — labels not associated (real a11y + UX bug)
`/contact/` and `/consultation/` both render:
```html
<label class="block text-sm font-medium text-primary mb-2">نام و نام خانوادگی</label>
<input type="text" class="…" />
```
The `<label>` has **no `for=` attribute** and the `<input>` has **no `id`**. Result:
- Clicking the label does **not** focus the field.
- Screen readers do **not** announce the field with its label.
- Lighthouse WCAG audits (axe) would flag this if you turned off the `placeholder` heuristic.

Affected fields: `name`, `email`, `phone`, `service` (select), `message` (textarea) on both pages.

### 5.2 Visible-text ≠ accessible-name on service cards (Lighthouse `label-content-name-mismatch` FAIL)
Each service card wraps the card body in `<a aria-label="مشاهده جزئیات سئو تکنیکال و داخلی">`. The visible card heading is "سئو تکنیکال و داخلی" — but `aria-label` doesn't start with the visible text. Lighthouse scores 0 on this audit. **WCAG 2.5.3 Label in Name** violation; voice-control users can't activate the card by saying its visible name.

### 5.3 Mobile menu button a11y
`<button data-menu-btn aria-label="منوی موبایل">` — no `aria-expanded` / `aria-controls`. Screen-reader users have no programmatic indication that the button toggles a panel.

### 5.4 No "skip to main content" link
None of the 45 pages emit a skip link. Keyboard users must tab through the entire fixed header on every page.

### 5.5 Floating action buttons cover content on mobile
`FloatingActions.astro` is `fixed bottom-6 right-6 z-50` with WhatsApp + call + (delayed) back-to-top. On a 390×844 viewport, the floating stack sits over the right edge of footer CTAs and bottom form buttons, intermittently obscuring primary actions. Add a `pb-20` to `<main>` or a "safe area" on short pages, and consider making them auto-hide when the footer is in view.

### 5.6 Homepage is 15,392 px tall
| Section | Height (px) | vh |
|---|---:|---:|
| HeroSection | 698 | 0.78 |
| ServicesSection | 1,833 | 2.04 |
| AllServicesSection | **6,122** | **6.80** |
| WhyChooseUsSection | 2,921 | 3.25 |
| TestimonialsSection | 1,869 | 2.08 |
| CTASection | 1,005 | 1.12 |
| Footer | 945 | 1.05 |

`AllServicesSection` alone is ~7 viewport heights. This is mostly a giant card grid. **Risks:**
- Users abandon on long single-page scrolls (no anchor nav, no "back to top" until you pass 300px scroll).
- Indexable content bloat: Google's "helpful content" systems weight perceived user value vs scroll depth.
- Mobile data cost (1.5 MB+ to scroll the whole page, much of it dominated by 110 inline SVG icons on the homepage hero/sub-sections).

Recommendation: split `AllServicesSection` into the actual service hubs (`/services/seo/`, `/services/marketing/`, `/services/web/`, `/services/content/`, `/services/ai/`) via short card links, OR add anchor jumps at the top, OR collapse into accordions.

### 5.7 Hero has no images and no keyword H1
- 0 `<img>` tags on homepage. Hero is gradient + animated blurred orbs + emoji. For a digital marketing agency selling design + content + AI, this reads as **no product**.
- H1 = "به عصر سئو خوش آمدید" — pure brand. No service keyword.
- The "stat" cards (24/7, +5, 98%, +500) sit in the hero with no source citations.
- Fixed header (`position: fixed; z-50`) means the hero top is partially obscured and there is no `scroll-margin-top` on anchor targets — jumping to an in-page `#contact` lands behind the header.

### 5.8 Heading structure
- All 44 pages have exactly one H1. ✓
- **Heading skip H1→H3** on 9 pages (the 8 blog posts, `/consultation/`, `/support/`).
- **Footer uses H4 headings** (7 per page) — semantically odd; footers are usually `<h2>` at most, often not headings at all. Dilutes the document outline.

### 5.9 5 service pages have `href="#"` x 4
`/services/ai/`, `/services/ai/content-creation/`, `/services/ai/marketing-engagement/`, `/services/content/content-calendar/`, `/services/seo/content-authority/`. These are dead social-share placeholders. Crawlable dead ends and a UX trap (clicking does nothing).

---

## 6. Performance — P1 / P2

### 6.1 Lighthouse (production build, local, no compression)
| Page | Form factor | Perf | A11y | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| `/` | desktop | **99** | **100** | **100** | **100** | 0.8 s | 0.001 | 0 ms |
| `/` | mobile | **90** | **100** | **100** | **100** | 3.1 s | 0.043 | 0 ms |
| `/services/ai/` | mobile | 90 | 100 | 100 | 100 | 3.5 s | 0.04 | 0 ms |
| `/blog/page-authority-guide/` | mobile | 92 | 100 | 100 | 100 | 3.0 s | 0.05 | 0 ms |
| `/faq/` | mobile | 89 | 100 | 100 | 100 | 3.3 s | 0.04 | 0 ms |

These numbers are **strong**. Caveats: local server has no gzip/brotli, so real Cloudflare-delivered numbers will be better (CSS 119 KB → ~16 KB gz, HTML 170 KB → ~26 KB gz).

### 6.2 What's actually costing mobile
- **Render-blocking CSS: 119 KB.** Single stylesheet (`/_astro/Button.*.css`) with all of Tailwind v4 utilities used across the site. gzipped ~16 KB.
- **Total weight 414 KB** uncompressed: HTML 170 KB, CSS 119 KB, fonts 102 KB (regular + bold), favicon 16 KB.
- **No preload of `bold.woff2`** even though bold is used above the fold (H1 + logo). `font-display: swap` is set, so there is a brief FOUT and CLS risk.
- **Vazirmatn is not subset.** Full Persian glyph table, ~50 KB per weight. Consider `unicode-range` or a Persian‑only subset.
- **110 inline `<svg>` icons on the homepage**, ~30 on service pages. Lucide-static SVGs are inlined by Astro at build. Each one bloats DOM (homepage: **1,084 elements**; median page: **655 elements**). Acceptable but heavy.
- **Cache headers (`_headers`)**: `/`, `/_astro/*`, `/*.woff2`, `/*.webp`, `/*.avif` all set correctly to `public, max-age=31536000, immutable`. ✓ This is good and Cloudflare will honor it.
- **`<link rel="preload" href="/regular.woff2">`** present, with `crossorigin="anonymous"`. ✓ Add a second preload for `/bold.woff2` if the H1 uses bold (it does).

### 6.3 The live homepage is **482 KB / 72 KB gzip** of HTML because it's still serving Next.js RSC payload (`self.__next_f.push(...)`) — this is the **#1 perf win you have available**: deploy Astro.

---

## 7. Consolidated fix list (priority-ordered)

### P0 — Do this week
1. **Deploy the Astro build to asreseo.com.** Until then, every other item is theoretical.
   - Verify: `curl -I https://asreseo.com/` has no `/_next/`, `curl -I https://asreseo.com/llms.txt` is 200, `curl -I https://asreseo.com/sitemap-index.xml` is 200.
2. **Remove the self-serving `aggregateRating`** on the homepage `LocalBusiness` JSON‑LD, or replace with real `Review` markup.
3. **Make `/consultation/` FAQ content visible**, or drop the `FAQPage` schema there.

### P1 — This sprint
4. Rewrite the homepage H1 to lead with "آژانس دیجیتال مارکتینگ، خدمات سئو و هوش مصنوعی" (keep the warm welcome as a subtitle).
5. Update `/services/seo/content-authority/` H1 to include "اعتبار صفحه".
6. Fix form labels on `/contact/` and `/consultation/` (add `id` to every input/select/textarea, add `for=` to every `<label>`).
7. Replace `aria-label` on service card anchors with text that **starts with the visible heading** (or remove the override and let the visible text be the accessible name).
8. Add `aria-expanded`/`aria-controls` to the mobile menu button.
9. Add a "skip to main content" link in `BaseLayout.astro`.
10. Add `<link rel="preload" href="/bold.woff2" as="font" type="font/woff2" crossorigin="anonymous">` to `BaseLayout.astro`.
11. Add BreadcrumbList JSON‑LD to the 14 pages missing it (homepage, all 8 blog posts, `/consultation/`, `/contact/`, `/services/`, `/privacy/`, `/terms/`).
12. Refresh or 301 the 5 stale 2024 blog posts.
13. Add author bio pages + `Person` schema linking blog posts to a real profile.

### P2 — Next sprint
14. Add a per-page 1200×630 OG image (currently falls back to the 512×512 logo).
15. Add `scroll-margin-top` equal to header height on all anchor targets and to the `<main>` element.
16. Split `AllServicesSection` (6,122 px) into anchor tabs or push to service hubs.
17. Persistently hide FloatingActions when footer is in view, and reserve bottom padding on short pages.
18. Repair 5 service pages that have `href="#"` placeholders (replace with share targets or remove).
19. Footer: replace H4 headings with semantic markup (paragraphs / links / lists).
20. Fix H1→H3 skips on the 9 affected pages (insert H2 sections or downgrade H3 to H2 where appropriate).
21. Subset Vazirmatn to Persian glyphs (~40% size reduction typical).
22. Add `serviceType` to the 4 `Service` schema blocks that lack it.

---

## 8. Things the prior audits got right (don't regress)

- Schema coverage is genuinely strong (42 of 44 pages have valid JSON‑LD; 34 have `FAQPage`, 28 have `Service`, 30 have `BreadcrumbList`).
- All title tags within the 60-char SERP limit.
- All meta descriptions in the 70–160 char range.
- `lang="fa" dir="rtl"` on every `<html>`.
- Self-referencing canonical on every page.
- `robots.txt` with explicit GPTBot/ClaudeBot/PerplexityBot/Google‑Extended allow (local version).
- `_headers` with `Cache-Control: immutable` for `/_astro/*`, images, fonts.
- `llms.txt`/`llms-full.txt` with full URL coverage.

## 9. GSC traffic collapse — diagnosed

The prior audit's #1 open question ("why did clicks collapse June → Sept 2026?") can now be answered with high confidence.

### 9.1 The actual curve (from the xlsx, 2026-06-07 → 2026-09-06)
| ISO Week | Date range | Clicks/day (avg) | Impressions/day (avg) |
|---|---|---:|---:|
| W23 | Jun 7-13 | 18.0 | 18.0 |
| W24 | Jun 14-20 | 15.4 | 18.1 |
| W25 | Jun 21-27 | 15.4 | 17.3 |
| W26 | Jun 28-Jul 4 | 17.4 | 18.7 |
| W27 | Jul 5-11 | 18.3 | 18.7 |
| W28 | Jul 12-18 | 17.0 | 18.1 |
| W29 | Jul 19-25 | 10.4 | 10.9 |
| W30 | Jul 26-Aug 1 | 9.6 | 11.9 |
| W31 | Aug 2-8 | 17.0 | 28.1 |
| W32 | Aug 9-15 | 13.1 | 20.7 |
| W33 | Aug 16-22 | 8.3 | 11.7 |
| W34 | Aug 23-29 | 9.3 | 15.0 |
| **W35** | **Aug 30-Sep 5** | **1.9** | **11.7** |
| W36 | Sep 6 | 0.3 | 11.1 |

Last 30 days raw daily clicks: peaked at 18 (Aug 9) → 7-12 (Aug 12-24) → **2 (Aug 25) → 0 (Aug 28 onward)**.

### 9.2 The smoking gun
- **Aug 21, 2026**: Google began the **August 2026 Spam Update** (finished globally a few days later, per Search Engine Journal).
- **Aug 24, 2026**: Google began the **August 2026 broad core update** (Search Status Dashboard, 9:27 a.m. Pacific rollout start, per Brafton).
- **Aug 25, 2026**: Your click curve drops from 7 → 2 (60% single-day drop). It then flatlines at 0-1/day through W35 and W36.

The timing alignment is exact, down to the day.

### 9.3 Why your site specifically
**The live site carries a textbook "self-serving reviews" structured-data violation.** Verified on the live Next.js homepage (and identical in the Astro build):
```json
"@context":"https://schema.org","@type":"LocalBusiness", ...,
"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"127"}
```
There is no `Review` schema, no third-party review widget, no `aggregateRating` source. The 4.9/127 number is asserted by the site about itself. This is the explicit example Google gives for the "self-serving reviews" spam policy.

Why this fits the symptoms:
- **Impressions held (~10-15/day)**: pages still rank, URLs still crawl, SERP coverage unchanged.
- **CTR fell from 86% to 0%** (at "position 47.5" for `خدمات هوش مصنوعی`): a 86% CTR at position 47 is impossible in the organic 10-blue-links SERP. The site was being shown in a **rich placement** — most likely an **SGE/AI Overview citation** or a **local pack / knowledge-panel citation** triggered by the `LocalBusiness` + `aggregateRating` markup. The spam update revoked that rich placement; the URL is still in the index, so impressions still register, but it no longer appears in the clickable rich unit. Hence ~0 clicks.
- **The 86% CTR at pos 47.5 was already flagged as anomalous in the prior audit** — that anomaly was Google giving you free visibility in exchange for your structured data. The August 2026 spam update ended that deal.

### 9.4 The git timeline confirms
- Last commits before the collapse: `dd3b3b3` and `69d32db` on **2026-02-25** (chore + "create missing informational and service pages").
- **No commits on this branch between 2026-02-25 and 2026-09-08** (a 6½-month gap). The collapse therefore cannot be caused by a code change in this repo.
- The Astro migration was committed `d299af9` on 2026-09-08 — **after** the GSC export, and as confirmed in §1, **never deployed**. So the rebuild did not cause the collapse either.

### 9.5 Action plan to recover
This is the only set of moves that addresses the actual cause, not the symptoms:
1. **Remove the self-serving `aggregateRating` from the homepage `LocalBusiness` JSON-LD** in the Astro build (live and local both carry it). This is the single highest-leverage change for recovery. (See §2.1.)
2. **Do not replace it with a manual rewrite of the rating.** Google's spam policy is "must be sourced from users." The right pattern is: remove it entirely, then if you want reviews later, add a real `Review` widget (third-party, opt-in customers) and wire `aggregateRating` to it.
3. **After the schema fix is live**, submit a reconsideration via Search Console only if GSC shows a manual action. The August 2026 spam update is algorithmic, not a manual action, so reconsideration is **not** required. Recovery is automatic once the policy violation is gone; it just takes a few weeks to a few months for the next core update to re-evaluate.
4. **Continue publishing.** Five 2024 blog posts are 18-24 months stale. Refreshing 1-2 of them per month (with `dateModified` updated) gives Google a steady "this site is current" signal that compounds with the schema fix.
5. **The Astro deploy is still important**, but for *different* reasons than the collapse:
   - Real mobile-friendly HTML (current 482 KB / 72 KB gzip is a 60+ KB RSC payload you don't need).
   - Correct sitemap (currently 404) so the 0-click URLs can be discovered and re-evaluated.
   - llms.txt for AI citation.
   - The H1 fix, the form-label fix, the breadcrumb gap, etc. — these improve the *quality* signals but were not the trigger for the collapse.

## 10. Files referenced (no changes made — report only)

- `astro.config.mjs`, `wrangler.toml`, `public/_headers`, `public/_redirects`, `public/robots.txt`, `public/llms.txt`, `public/llms-full.txt`
- `src/layouts/BaseLayout.astro`, `src/components/Layout/Header.astro`, `src/components/FloatingActions.astro`
- `src/components/Home/{Hero,Services,AllServices,WhyChooseUs,Testimonials,CTA}Section.astro`
- `src/pages/{index,contact/index,consultation/index}.astro`
- `src/content/blog/*.mdx` (7 posts)
- 45 built HTML pages in `dist/**`