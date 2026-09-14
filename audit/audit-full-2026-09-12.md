# Full Site Audit — asreseo.com (live) vs. local Astro rebuild

**Date:** 2026-09-12
**Scope:** UI · UX · SEO · AEO · GEO · Performance · Accessibility · Conversion
**Targets audited:** `https://asreseo.com` (production) and `http://localhost:4321/` (dev) + the built static output in `dist/`
**Method:** live HTTP probing, response-header analysis, full HTML/JSON-LD parsing of all 45 built pages, headless-Chrome (DevTools Protocol) rendering with network + CPU throttling, and screenshot review at 1440×900 and 390×844.

---

## 0. Headline finding — the site you think is live, isn't

**Production `asreseo.com` is still serving the old Next.js application. The Astro rebuild in this repo has never been deployed.**

Proof:

| Evidence | Live production | This repo's `dist/` |
|---|---|---|
| Homepage markup | `<!DOCTYPE html><!--K1Fir7AO4VoIyNFx1j8U5--><html lang="fa" dir="rtl"><head><meta charSet="utf-8"/>` + `/_next/static/...` | `<html lang="fa" dir="rtl"><head><meta charset="utf-8">` (Astro) |
| HTML payload | **482 KB** raw / 44.8 KB brotli | **170 KB** raw |
| `/_astro/Button.BMEhnMuM.css` | **404** | 200 (119 KB → 16 KB gzip) |
| `/llms.txt` | **404** | 200 (5.3 KB) |
| `/sitemap-index.xml`, `/sitemap-0.xml`, `/sitemap.xml` | **all 404** | 200 |
| `/services/content/` (content-strategy hub) | **404** | 200 |
| Client JS | 14 bundles, **628 KB decoded** + 20 fetch payloads (270 KB) | **0 bundles**, 2.4 KB inline |
| Branch that produced it | `main` (Next.js 16, `app/*.tsx`, `resend`, `next-sitemap`) | `astro-migration` (Astro 7) |

Cache-busting (`?cb=<ts>`) returns the identical Next.js document, so this is **not** an edge-cache artifact — the deployed build genuinely is Next.js. Git confirms `origin/HEAD -> origin/main` (Next.js) while all Astro work sits on the local `astro-migration` branch (`b4606bd`), which has **no Cloudflare Pages production deployment**.

**Consequence:** every SEO/AEO/GEO improvement described in `audit-seo-aeo-geo-2026-09-08.md` and `further-optimizations.md` — the new `content/` hub, `llms.txt`, the sitemap, the FAQ schema rollout, the single-H1 fix, the description rewrites — **is not reaching users or crawlers.** The 1092-click GSC baseline is being earned by the *old* site.

Everything below is therefore reported in two columns: **[LIVE]** = what Google sees today, **[ASTRO]** = what will ship when you deploy.

---

## 1. P0 — fix before anything else

### 1.1 The contact form is broken in production [LIVE]

```
$ curl -X POST -F "name=T" -F "email=t@t.com" -F "message=hi" https://asreseo.com/api/send-email
HTTP 500
{"error":"Missing API key. Pass it to the constructor `new Resend(\"re_123\")`"}
```

The live endpoint is a Resend-backed function with **no `RESEND_API_KEY` configured**. Every consultation/contact submission from the site's primary conversion path fails. This is the single highest-business-impact defect found.

⚠️ **The Astro rebuild has the same dependency risk.** `functions/api/send-email.ts` uses Cloudflare's native `send_email` binding, and `wrangler.toml` explicitly warns:

> *"for Pages projects, bindings attach in the dashboard … `wrangler pages deploy` exposes no binding flags, so this stanza documents the binding the code expects but does NOT attach it."*

So the form will keep failing after migration **unless** the `EMAIL` binding is attached in the Cloudflare dashboard (Settings → Functions → Bindings) and the Email Service is onboarded for `asreseo.com`. Verify with a real submission immediately after deploy.

### 1.2 The two hero CTAs are dead buttons [LIVE + ASTRO]

Both primary homepage CTAs render as bare `<button>` elements with no `href`, no `onclick`, no `data-*` hook, and no wrapping `<a>`:

```html
<button class="… gradient-bg …">مشاوره رایگان دریافت کنید</button>
<button class="… border-2 border-blue-500 …">مشاهده نمونه کارها</button>
```

I enumerated every `<button>` on the homepage: the only buttons carrying identifying attributes are the mega-menu trigger (`aria-haspopup`, `aria-expanded`), the mobile menu toggle (`aria-label`), and the back-to-top control. The page's inline JS only queries `[data-megamenu]`, `[data-header]`, `[data-backtotop]` — nothing binds to the hero buttons. **Clicking "Get free consultation" or "View portfolio" does nothing.**

Root cause: `src/components/ui/button/Button.astro` renders `<button>` unconditionally and ignores an `href`; `HeroSection.astro` uses `<Button>` without wrapping it in an `<a>` (unlike `Header.astro`, which does wrap it and therefore works).

### 1.3 Mobile header overlaps hero content [LIVE + ASTRO]

At 390×844 the fixed header sits **on top of** the hero's trust-indicator row and clips the H1:

- **[ASTRO]** the floating header card covers the top of `به عصر سئو خوش آمدید` and the `۴.۹ از ۵ امتیاز / ضمانت کیفیت` row.
- **[LIVE]** worse — the trust row collides with the logo, and the hamburger icon overlaps `برترین در ایران`.

Cause: `HeroSection.astro` uses `min-h-screen flex items-center justify-center` while `Header.astro` is `fixed top-3`. The hero's content stack is taller than a 390×844 viewport, so vertical centring pushes the top of the stack *above* the viewport, directly under the fixed header.

This is almost certainly a contributor to the **15-position mobile/desktop ranking gap** in GSC (mobile pos 54.7 vs desktop 39.9).

Fix: replace `min-h-screen` with `min-h-[100svh]` **plus** top padding that clears the header (`pt-24 sm:pt-28`), or un-fix the header below `lg`.

### 1.4 No `scroll-padding-top` for the fixed header [ASTRO]

`globals.css` contains no `scroll-padding`/`scroll-margin` rules, and `Header.astro` is `fixed`. Every in-page anchor (`#faq`, service jump links, TOC in blog posts) lands with its heading hidden behind the header. Add `html { scroll-padding-top: 6rem; }`.

### 1.5 Production has no sitemap and no robots directives [LIVE]

- `/sitemap.xml`, `/sitemap-0.xml`, `/sitemap-index.xml` → **404**. `next-sitemap.config.js` sets `generateIndexSitemap: false` and writes to `out/`, but no sitemap is reachable in production.
- `/robots.txt` → 200, but the response is **only** Cloudflare's "Content Signals Policy" comment block (1248 bytes). It contains **no `User-agent` lines, no `Allow`/`Disallow`, and no `Sitemap:` directive** — Cloudflare's managed robots.txt feature has replaced the file wholesale.

⚠️ **This will also hit the Astro deploy.** `dist/robots.txt` (391 bytes, with `User-agent: *`, two `Sitemap:` lines and explicit GPTBot/PerplexityBot/ClaudeBot/Google-Extended allowances) is correct — but the same Cloudflare override is serving in its place. **Disable "Content Signals Policy" / managed robots.txt in the Cloudflare dashboard**, or the entire GEO crawler strategy stays invisible.

Bonus: `dist/robots.txt` points at `https://asreseo.com/sitemap.xml`, and `public/_redirects` maps `/sitemap.xml → /sitemap-index.xml 301`. That reference is fine once deployed, but currently `/sitemap.xml` 404s rather than redirecting.

---

## 2. SEO

### 2.1 On-page metadata — [ASTRO] is strong, [LIVE] is weak

Across all **45** built Astro pages:

| Metric | Result |
|---|---|
| Titles present / ≤ 60 chars | 45/45 · **0 over 60** |
| Descriptions present | 45/45 · range **102–158 chars** (0 thin, 0 truncated) |
| Exactly one `<h1>` | **45/45** ✅ |
| Canonical present | 45/45 |
| OG image present | 45/45 |
| `lang="fa"` / `dir="rtl"` | 45/45 |
| `<img>` missing `alt` | **0** |
| Images missing `width`/`height` | **0** |

Live production, by contrast:

| URL | Title len | Desc len | H1 count | Schema blocks |
|---|---|---|---|---|
| `/` | **66** (truncation risk) | 153 | **2** | 2 |
| `/about/` | 19 | **97** | **2** | **0** |
| `/services/ai/` *(99.5% of all clicks)* | 50 | **96** | **2** | **0** |
| `/services/` | 64 | 141 | **2** | **0** |
| `/services/content/` | — | — | — | **404** |
| `/blog/seo-guide-2024/` | 39 | **59** | **2** | **0** |
| `/faq/` | 23 | **70** | **2** | **0** |
| `/portfolio/` | 21 | **66** | **2** | **0** |
| `/privacy/` | 20 | **52** | **2** | **0** |
| `/terms/` | 25 | **47** | **2** | **0** |
| `/support/` | 18 | 87 | **2** | **0** |
| `/sitemap/` | 19 | 61 | **2** | **0** |

Two systemic live issues: **every page has duplicate H1s**, and **only 3 of 18 sampled pages carry any structured data** — including the flagship `/services/ai/` money page, which has none.

### 2.2 Structured data — [ASTRO]

42/45 pages carry JSON-LD (only `/404`, `/privacy/`, `/terms/` are bare — acceptable).

| Type | Pages |
|---|---|
| Organization | 37 |
| FAQPage / Question / Answer | 34 |
| BreadcrumbList / ListItem | 30 |
| Service | 28 |
| Offer / OfferCatalog | 27 |
| BlogPosting | 8 |
| SpeakableSpecification | 8 |
| Article | 7 |
| Person | 7 |
| WebSite + SearchAction, LocalBusiness, AggregateRating | 1 (homepage) |

Notable: service pages use `<script id="…" type="application/ld+json">` — valid, but the `id` attribute breaks naive validators/scanners that match `<script type="application/ld+json">` exactly. Worth knowing before you trust a third-party audit tool.

Gaps vs. the plan documents: **no `HowTo`** on `content-calendar`, **no `CollectionPage`** on `/portfolio/` (only `ItemList`), no `VideoObject` anywhere.

### 2.3 The `AggregateRating` risk [LIVE + ASTRO] — read this one

The homepage emits:

```
"@type":"AggregateRating"
```

and renders `۴.۹ از ۵ امتیاز` next to a single star icon. There are **no visible customer reviews** on the page, no `Review` nodes, and no review source. Google's structured-data policy requires aggregate ratings to be **genuinely collected from users about that specific business** — self-serving, unsourced `AggregateRating` markup is a documented cause of *"Spammy structured markup"* manual actions, and rating rich results get silently dropped.

Given the June→September collapse in GSC (≈17–19 clicks/day → 0–1/day) and the 86–88% CTR at positions 47–91 flagged in the previous audit as an SGE/Discover artifact, **verify in Search Console → Manual Actions and Security & Manual Actions → Structured data** before doing anything else. If the rating isn't backed by real reviews, remove both the schema node and the visible claim.

### 2.4 Duplicate / redirect hygiene

| Test | Result |
|---|---|
| `/about` → `/about/` | 308 permanent ✅ |
| `/home` | **404** — the `/home / 301!` rule in `_redirects` is not firing |
| `/blog/post/:slug` → `/blog/:slug` | **404** — wildcard rule not firing |
| `/services/ai/smart-seo` | 200 after 2 hops ✅ |
| `/sitemap.xml` | **404** (should be 301 → `sitemap-index.xml` after deploy) |

The `301!` (forced) rules in `_redirects` appear to be dead while the plain `301` rules work. Verify `public/_redirects` is actually present in the deployed output and re-test after migration — the legacy React-Router URL space (`/home`, `/blog/post/*`) is currently dropping to 404, which wastes any residual link equity.

### 2.5 Stale `dateModified` on blog posts [ASTRO]

`BlogPosting` correctly carries `author` (Person), `inLanguage: "fa-IR"`, and `SpeakableSpecification` — but the dates are frozen:

```
/blog/seo-guide-2024/  datePublished: 2024-01-15  dateModified: 2024-01-15
/blog/ai-seo-guide/    datePublished: 2024-11-20  dateModified: 2024-11-20
```

These posts were substantively refreshed in 2026 (per the git history). Leaving `dateModified` at 2024 tells both Google and AI answer engines the content is two years stale — and the `-2024` slugs actively date them. Either refresh `dateModified` and add a visible "بهروزرسانی" line, or 301 the year-slugs to evergreen equivalents.

---

## 3. AEO (Answer Engine Optimization)

**What's already right [ASTRO]:** 34 FAQPage blocks with `Question`/`Answer` pairs, `SpeakableSpecification` on the 8 blog/pillar pages, breadcrumbs on 30 pages, `/faq/` expanded to 26 Q&As, and `Article`+`BlogPosting` on all 7 posts. This is a genuinely good answer-engine foundation — better than most agency sites.

**What's missing [ASTRO]:**

- **The H1 does not contain a target keyword.** The homepage H1 is `به عصر سئو خوش آمدید` ("Welcome to Asr SEO") — a greeting, not an answer. Given that `خدمات هوش مصنوعی` alone is 995 clicks / 1146 impressions, the H1 should assert the service: e.g. `خدمات هوش مصنوعی، سئو و دیجیتال مارکتینگ در ایران`. Titles carry the keyword; the H1 does not.
- **No `HowTo` schema** on `/services/content/content-calendar/` despite the page being a step-based process (the plan called for it).
- **`/portfolio/` has no `CollectionPage`** and no per-case-study `Article`/`CreativeWork` nodes, so AI engines can't extract structured case data.
- **No FAQ block on the highest-traffic page.** `/services/ai/` carries one FAQPage block; the 5 zero-click GSC queries (`تقویم محتوا`, `اعتبار صفحه`, `اتوماسیون انتشار محتوا`, …) still have no owner page with a matching FAQ cluster — the mapping in §8 of the previous audit hasn't been executed in content.

---

## 4. GEO (Generative Engine Optimization)

**Foundation is unusually good — but none of it is live.**

| Asset | [ASTRO] | [LIVE] |
|---|---|---|
| `llms.txt` | 200, 5.3 KB, clean page/service taxonomy with Persian + English labels | **404** |
| `llms-full.txt` | 200, 9.7 KB | **404** |
| Explicit GPTBot / PerplexityBot / ClaudeBot / Google-Extended allowances | present in `dist/robots.txt` | **absent** (Cloudflare override stripped them) |
| Cloudflare Content Signals comment block | not in source | present, but **comment-only** — grants nothing |
| `inLanguage` | 12 pages (`fa-IR`) | — |
| Author byline + `Person` link | 7/7 blogs | — |
| `hreflang` | **0** | **0** |

Actions:

1. **Restore robots.txt** (disable the Cloudflare managed override) — without it, the crawler-permission layer is inert.
2. **Add `hreflang="fa-IR"` self-reference** plus `<link rel="alternate" hreflang="x-default">` on every page. Zero hreflang on a Persian-language site is a missed disambiguation signal.
3. **Keep `llms.txt` in sync** with every new FAQ/post — it's currently a static file, so it drifts silently.
4. **Statistics need sources.** The homepage asserts `۵۰۰+ پروژه موفق`, `۹۸% رضایت مشتریان`, `۵+ سال تجربه`, `۴.۹ از ۵ امتیاز`. Generative engines are increasingly trained to discount unsourced numeric claims; cite or remove them.

---

## 5. Performance

### 5.1 [ASTRO] — the rebuild is dramatically faster

| | Astro build | Live Next.js |
|---|---|---|
| Client JS bundles | **0** | 14 |
| JS transferred / decoded | **2.4 KB inline** | 195 KB / **628 KB** |
| Next.js RSC `fetch` payloads | n/a | 20 requests, **270 KB decoded** |
| Homepage HTML | 170 KB raw | 482 KB raw |
| Total requests (home) | ~19–27 | 40 |
| TTFB (throttled, desktop) | 1–55 ms | **553–654 ms** |
| FCP (throttled, desktop) | 64–260 ms | **812–1120 ms** |
| Load (throttled, desktop) | 44–850 ms | **1105–2106 ms** |
| TTFB `/services/ai/` | 5–31 ms | **146–1897 ms** |

Measured with cache disabled, 40 ms latency, 10 Mbps, 1× CPU (desktop) and 150 ms latency, 1.6 Mbps, 4× CPU (mobile). The Astro build ships **essentially zero client-side JavaScript** — only ~2.4 KB of inline script for the header, mega-menu and back-to-top. Removing React hydration and the RSC payload stream is the single biggest performance win available, and it's already built.

### 5.2 Already-good delivery (both)

- **Brotli confirmed** on HTML (`content-encoding: br`) and gzip on CSS.
- Static assets correctly immutable: `cache-control: public, max-age=31536000, immutable` on `.webp`, `.ico`, `.woff2`.
- Security headers present via `public/_headers`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- CSS: 119 KB raw → **16 KB gzip** (Tailwind 4, acceptable).
- Hero images shipped in **both WebP and AVIF** with responsive variants in `dist/_astro/`.

### 5.3 Performance issues to fix

1. **HTML caching is not applied.** `_headers` declares `/*.html → Cache-Control: public, max-age=3600`, but production returns `cache-control: public, max-age=0, must-revalidate` with `cf-cache-status: DYNAMIC`. Cloudflare Pages serves directory-format URLs extensionlessly, so the `/*.html` pattern never matches. Change the rule to match the actual served paths (or use `/*` with an exception for assets) — otherwise every page view is a full origin round-trip.
2. **The 404 page is 239 KB** [LIVE] — it's the full Next.js shell. Astro's is 43-char-title/small; verify it stays lean.
3. **Homepage loads zero images.** Both builds render the hero from gradients only — no product screenshot, no team, no portfolio proof. See §6.
4. **No `prefers-reduced-motion`** anywhere despite `float`, `pulse-glow`, `glow`, `zoom-in`, `slide-in-up`, `gradient` and `bounce` animations. See §7.
5. **[ASTRO] dead files:** `dist/js/ajax-form.js` is only referenced by `/consultation/`; `dist/sw.js` is referenced by **no** page (BaseLayout actively unregisters service workers). Consider removing `sw.js` and confirming `ajax-form.js` is still needed.

---

## 6. UI / UX

I rendered every page at 1440×900 and 390×844 and reviewed the screenshots (`./shots/`). The Astro rebuild is a **faithful, pixel-close reproduction** of the live design — the visual regression risk is low.

### What works

- Clean, modern, genuinely pleasant visual language: soft gradient hero, rounded floating header (Astro), consistent card system, generous whitespace, good Persian typography via Vazirmatn (2 preloaded woff2 files, `font-display: swap`).
- Strong RTL correctness: `dir="rtl"`, `lang="fa"`, mirrored layouts, logo correctly at the right edge, `dir="ltr"` applied only to phone/WhatsApp FABs.
- Persistent conversion affordances: WhatsApp + tap-to-call FABs, back-to-top, sticky header CTA.
- Blog grid is well-executed: 7 cards, lazy-loaded images, category filters, featured card.

### What's broken or weak

| # | Issue | Severity |
|---|---|---|
| 1 | **Hero CTAs are non-functional** (§1.2) | 🔴 Critical |
| 2 | **Mobile header overlaps hero H1 + trust row** (§1.3) | 🔴 Critical |
| 3 | **Contact form returns 500** (§1.1) | 🔴 Critical |
| 4 | **~40% of the hero viewport is dead space.** `min-h-screen` with ~60% content fill leaves a large empty band before the next section on desktop | 🟠 High |
| 5 | **No imagery on the homepage at all** — `document.images.length === 0` on both builds. For an agency selling design/SEO/AI, the homepage shows no work, no team, no dashboard, no proof | 🟠 High |
| 6 | **Stray decorative artifacts.** The `animate-float`/`animate-bounce` "particles" render as a lone yellow blob near the top-right corner and a purple dot floating mid-content. They read as rendering bugs, not design | 🟠 High |
| 7 | **RTL CTA hierarchy inverted.** In RTL the primary action should occupy the first reading position (right). The outline secondary (`مشاهده نمونه کارها`) sits right; the filled primary sits left | 🟡 Medium |
| 8 | **Logo mark is illegible** at header size — a small dark scribble; `AsreSEO Digital Marketing` is doing all the work | 🟡 Medium |
| 9 | **FABs collide with content on mobile.** WhatsApp/phone buttons overlap the `بدون پیش پرداخت / مشاوره رایگان / ضمانت نتیجه` proof row | 🟡 Medium |
| 10 | **Unverifiable trust claims.** `۵۰۰+ پروژه`, `۹۸% رضایت`, `۵+ سال`, `۴.۹ از ۵`, `ضمانت نتیجه` ("guaranteed results"), `بدون پیش پرداخت`. Beyond the schema risk (§2.3), "guaranteed results" is a claim regulators in many markets treat as misleading | 🟡 Medium |
| 11 | **Header CTA label mismatch.** Header says `مشاوره رایگان` but links to `/contact/`, while a dedicated `/consultation/` page exists | 🟢 Low |

---

## 7. Accessibility

| Check | Result |
|---|---|
| `<html lang>` / `dir` | ✅ `fa` / `rtl` on all 45 pages |
| `<img>` without `alt` | ✅ 0 |
| Images without dimensions | ✅ 0 |
| Form fields with `required` / `type=email` / `type=tel` + `pattern` | ✅ present on `/consultation/` |
| **`<label>` associated with input (`for`/`id`/nesting)** | ❌ **0 of 0** — labels are bare siblings: `<label …>نام و نام خانوادگی</label><input type="text" name="name" …>` with no `id`. Screen readers announce unlabeled fields (WCAG 1.3.1, 3.3.2, 4.1.2) |
| **`prefers-reduced-motion`** | ❌ **absent** despite 11 `@keyframes` animations (WCAG 2.3.3) |
| **Global `:focus-visible` styling** | ❌ 0 occurrences in `globals.css`; only `Button.astro` carries focus-ring utilities, so links/inputs/nav have no consistent visible focus indicator (WCAG 2.4.7) |
| **Duplicate `class` attributes** | ❌ **2,518 instances across all 45 pages** — invalid HTML. `Icon.astro:40` injects `class="{className}"` into lucide SVGs that already ship `class="lucide lucide-*"`, producing `<svg class="h-5 w-5" aria-hidden="true" class="lucide lucide-play" …>`. Browsers keep the first and drop the second |
| `aria-*` attributes sitewide | 26 total — low. Verify the accordion (`AccordionTrigger.astro`) exposes `aria-expanded`/`aria-controls`, and that the mega-menu traps focus |
| Tap targets < 24×24 px | 3 per page (10 on `/blog/`) — minor |

Two of these are one-line fixes: `Icon.astro` should strip or merge the pre-existing `class` attribute, and `globals.css` should add a `prefers-reduced-motion: reduce` block plus a global `:focus-visible` ring.

---

## 8. Prioritized roadmap

### P0 — this week (business-critical)

1. **Fix the production contact form.** Set the Resend key today to unblock the live site; then attach the `EMAIL` binding in the Cloudflare dashboard before the Astro deploy, and submit a real test enquiry.
2. **Deploy the Astro build to production** (or explicitly decide not to). Until then, none of the SEO/AEO/GEO work is live. Wire the Cloudflare Pages production deployment to `astro-migration`, or merge it to `main`.
3. **Restore `robots.txt`** — disable Cloudflare's managed Content Signals override so the sitemap directives and AI-crawler allowances actually serve.
4. **Fix the two hero CTAs** — wrap them in `<a href="/consultation/">` and `<a href="/portfolio/">`.
5. **Fix the mobile hero overlap** — `min-h-[100svh]` + `pt-24`, and add `html { scroll-padding-top: 6rem; }`.
6. **Investigate the GSC collapse** — Manual Actions, Security Issues, Structured-data report. Remove the unsourced `AggregateRating` + `۴.۹ از ۵` claim if it isn't backed by real reviews.

### P1 — next 2–4 weeks

7. Rewrite the homepage H1 to carry the primary keyword (`خدمات هوش مصنوعی` / `دیجیتال مارکتینگ`).
8. Replace the live site's duplicate H1s and add schema to `/services/ai/`, `/about/`, `/faq/`, `/portfolio/` (the Astro build already fixes this — just ship it).
9. Expand live descriptions on the 8 pages under 100 chars; trim the live homepage title from 66 to ≤60.
10. Add real imagery to the homepage — portfolio screenshots, team, dashboard. The homepage currently shows zero images.
11. Remove or re-anchor the floating particle artifacts; give the logo mark a legible small-size variant.
12. Accessibility batch: `for`/`id` on all form labels, `prefers-reduced-motion` block, global `:focus-visible`, fix the 2,518 duplicate `class` attributes in `Icon.astro`.
13. Fix the dead `_redirects` rules (`/home`, `/blog/post/*`) and make `/sitemap.xml` resolve.
14. Refresh `dateModified` on the 7 blog posts and add visible update dates.

### P2 — backlog

15. HTML cache-control rule that matches extensionless Pages URLs.
16. Add `HowTo` (content-calendar), `CollectionPage` + per-case `Article` (portfolio), `hreflang="fa-IR"`.
17. Execute the zero-click query → owning-page FAQ/image/internal-link map from §8 of the previous audit.
18. Audit `/faq/` deep links and the service-page footer link blocks.
19. Replace `۵۰۰+ / ۹۸% / ۴.۹` with sourced, verifiable figures.
20. Remove the orphaned `dist/sw.js`; confirm `ajax-form.js` is still required.

---

## 9. Appendix — raw evidence

| File | Contents |
|---|---|
| `perf.json` | DevTools-Protocol measurements, round 1 (desktop + mobile, dev server + live) |
| `perf2.json` | Round 2, cache-disabled + throttled, plus CTA click test |
| `shots/local-home.png` | Astro homepage @1440×900 |
| `shots/local-home-mobile.png` | Astro homepage @390×844 — shows header/hero overlap |
| `shots/live-home.png` | Live Next.js homepage @1440×900 |
| `shots/live-home-mobile.png` | Live homepage @390×844 — shows the worse overlap |
| `shots/local-services-ai.png` | Astro `/services/ai/` |
| `shots/local-blog.png` | Astro `/blog/` |

**Note on method:** `localhost:4321` is `astro dev` (Vite HMR client inflates script counts), so production-build figures were taken by serving `dist/` over a plain static server. Port 4322 was already occupied by an unrelated project ("سمعک آلفا"), which briefly contaminated an early preview measurement — those numbers were discarded and are not used above.
