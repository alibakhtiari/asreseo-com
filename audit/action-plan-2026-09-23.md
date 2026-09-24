# SEO / AEO / GEO Action Plan — asreseo.com

**Date:** 2026-09-23
**Derived from:** [`seo-aeo-geo-audit-2026-09-23.md`](./seo-aeo-geo-audit-2026-09-23.md) · [`gsc-data-analysis-2026-09-23.md`](./gsc-data-analysis-2026-09-23.md) · [`content-plan-zero-click-2026-09-23.md`](./content-plan-zero-click-2026-09-23.md)
**Sequencing principle:** resolve **unknown state** first (things we cannot currently see), then **diagnose** the collapse, then take the **cheapest measurable wins**, then structural work. Off-site authority runs in parallel because it is likely blocking everything.

**Baseline (from GSC, 2026-06-21 → 09-20):** 874 clicks · 1,386 impressions · clicks/day **0.13** (was 12.6) · avg position **65–69** · page coverage **16/46** · blog impressions **0/9** · click concentration on `/services/ai/` **99.4%**.

---

## Execution status — updated 2026-09-23

**Completed and gate-verified:**

| # | Item | Evidence |
|---|---|---|
| **0.4** | Gate `HEADLINE_STATS` + `PROSE_STATS` on `verified` | **Superseded — swept far wider than planned.** See "unverified claims" below. |
| **0.5** | HSTS + CSP | `worker.ts` + `public/_headers`, kept in sync; asserted by `scripts/verify-deploy.mjs` |
| **1.1** | `content-calendar` strengthened | 2,027 words, answer-first block, 1 internal link |
| **1.2** | `content-authority` strengthened | 1,638 words |
| **1.3** | Blog↔service cannibalization resolved | 3 tier-A re-aims: `content-calendar-guide`, `page-authority-guide`, `content-strategy-guide` |
| **1.4** | Sitemap `lastmod` coverage | **49/49 URLs**, none future-dated (was 9/46) |
| **1.5** | `Organization` entity fragmentation | Single `#organization`; contact/services/about emit `@id` refs; phone/`foundingDate`/`sameAs`/`logo` unified |
| **1.6** | `BreadcrumbList` added | `blog/[slug]`, `services/`, `blog/` |
| **1.8** | Undeclared MDX fields | `tags`/`featured`/`readTime` verified present on all posts |
| **1.10** | Stale comment + false word counts | `site-claims.ts:43-48`, `fixes-2026-09-12.md:257-258` |
| **2.1** | `/blog/` H1 reworded | `وبلاگ عصر سئو` → `مقالات تخصصی سئو، محتوا و هوش مصنوعی`; answer block moved directly under it |
| **2.3** | Tier-A blog re-aims executed | see 1.3 |
| **2.2** | Utility pages expanded + `/sitemap/` noindexed | privacy **729w**, terms **760w**, support **931w** (all ≥300w); `/sitemap/` = `noindex, follow` (404 keeps `noindex, nofollow`); `/sitemap/` removed from `sitemap-0.xml` — **48 URLs, all with `lastmod`** |
| **2.4** | True 1200×630 JPEG OGs | 35 files in `public/og/` (4.99 MB), all byte-verified 1200×630; all 30 `ogImages` rewired off `.webp`; 3 new 2×2 montage cards break the 3 named duplicate pairs |
| **2.5** | Short titles/descriptions lengthened | utility titles 40–55 / descriptions 120–155 — **extended site-wide**: every indexed title now 40–60, every description 104–154 (was 8 blog titles 61–82 and 9 descriptions >155) |
| **2.6** | FID → INP | `faq/index.astro`; only remaining "FID" in `dist/` is the `seo-guide` explainer describing the replacement |
| **2.7** | Invalid `blogPost[].position` | **Already satisfied** — 73 JSON-LD blocks parse, **0** `BlogPosting` nodes carry `position` |
| **2.9** | Single-hop `-2024` redirects | `_redirects` + `REDIRECT_MAP` |

**Beyond plan — full unverified-claim sweep (this was P0.4, expanded):**

The 4-line leak P0.4 described turned out to be **35 files / 269 claim lines**, plus a second-pass scan that found **19 more** in shapes the first regex missed (the Persian word «درصد», `+` as a *prefix*, multipliers like `۵ برابر`, elapsed counts). All are now in one of three allowed states:

1. **GATED** — renders only on `verified: true` in `src/lib/site-claims.ts`
2. **QUALITATIVE** — digit removed, process/measurement fact kept
3. **SOURCED** — a real primary source, with its URL, actually opened and cited

Work order: [`claim-inventory-2026-09-23.md`](./claim-inventory-2026-09-23.md). Regression gate: **`node scripts/verify-claims.mjs`** (exits 1 on any hit; skips structural numbers, corroborated dates, comments and MDX code fences; accepts a stat only if an absolute `https://` sits within 7 lines).

**Blocked — needs credentials the assistant does not hold:** 0.1 (Manual Actions), 0.2 (collapse diagnosis), 0.3 (CTR vs server logs), 0.6 (09-14 outage), 1.7 (PSI/CrUX — 403/404), 1.9 (backlinks).

**P2.1–P2.7 completed and gate-verified** (see the P2 row status below). **2.8** is documented as non-configurable host behaviour (the 307 is emitted by Cloudflare, not by this repo).

**Not started:** 2.3 (already covered by 1.3 — tier-A re-aims shipped), and the remainder of the P2 technical / accessibility blocks (2.9–2.19).

---

## P0 — this week (unknown state + business-critical)

Unknowns are ranked above known bugs: a manual action would explain the entire collapse, and checking costs 2 minutes.

| # | Action | Why | Effort | Verify |
|---|---|---|:---:|---|
| **0.1** | **GSC → Security & Manual Actions → Manual Actions.** Screenshot the result. | The 2026-08-27 collapse is unexplained; a manual action is the highest-probability single cause and the cheapest to rule out. **Currently unknown.** | 2 min | Screenshot filed in `audit/` |
| **0.2** | Run collapse hypotheses **H1–H5** in order (`gsc-data-analysis` §2.3): Manual Actions → position delta (compare 08-01..08-24 vs 09-01..09-20) → algorithm trackers → URL Inspection on 2 URLs → GSC API vs server logs. | Cause is **external to this repo** (codebase frozen 08-15 → 09-10). Without cause, all downstream SEO work is guesswork. | 1h | Written conclusion + cause recorded in `gsc-data-analysis` §2.3 |
| **0.3** | **Resolve the CTR/position impossibility** — pull GSC API `searchanalytics` for the window and compare against Cloudflare organic hits on `/services/ai/`. | 83% CTR at position 47.6 and site-wide 63% CTR are arithmetically impossible. If server hits ≈ 0, **the site has never had working organic traffic** — that changes every priority below. | 30 min | Reconciliation table with real numbers |
| **0.4** | **Gate `HEADLINE_STATS` + `PROSE_STATS` rendering on `verified`** in `src/lib/site-claims.ts` consumers (`Home/TestimonialsSection.astro:79-84`, `Home/WhyChooseUsSection.astro:7,12,13,31`). | Unverifiable `۵۰۰+` / `۹۸٪` / `۵۰۰٪` / `۳۰۰٪` render as visible copy — E-E-A-T trust risk and a known AI-discount factor for unsourced numbers. Stars are **already** correctly gated; these two are not. | 30 min | No `۵۰۰+`/`۹۸٪`/`۵۰۰٪` in `dist/` HTML |
| **0.5** | **Add HSTS + CSP.** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` + baseline CSP — add to **both** `worker.ts` (`:126-147`) and `public/_headers`, keeping them in sync. | Both headers absent on every tested response. HSTS only after HTTPS confirmed site-wide. | 30 min | `curl -I` shows both headers |
| **0.6** | Confirm **2026-09-14** had no outage (Cloudflare analytics) — GSC recorded **0 impressions** that day, the day of the 16-commit deploy. | If the deploy caused an outage it may be contributing to the degradation. Impressions resumed 09-15, so likely a GSC gap — but confirm. | 10 min | Traffic graph for 09-14 |

---

## P1 — next 2 weeks (biggest measurable wins, all cheap)

| # | Action | Why | Effort | Verify |
|---|---|---|:---:|---|
| **1.1** | **Strengthen `content-calendar`** — answer-first block (130–170w) under H1; one H2 per zero-click query (`اتوماسیون انتشار محتوا چیست؟`, `اتوماسیون چرخه محتوا…`, `بهترین ابزار تقویم محتوایی`); ≥1,500w with a real Persian example calendar. | **178 impressions at position 65, zero clicks.** Cheapest ranking gain available — already has volume, needs ~5 places. → `content-plan` §1.1 | 2–3h | Position ≤40 on next export |
| **1.2** | **Strengthen `content-authority`** — answer-first block `اعتبار صفحه چیست؟`; differentiate from `page-authority-guide` (service = we do it, blog = how it works); sourced before/after metrics. | **102 impressions at position 52.73, zero clicks.** → `content-plan` §1.2 | 2h | Position ≤40 |
| **1.3** | **Resolve blog↔service cannibalization** for `تقویم محتوا` and `اعتبار صفحه` — re-aim blog posts to definitional intent, service pages to commercial intent, add explicit cross-links. | Google picked the service page and gave the blog post **0 impressions** for both intents. → `content-plan` §2.2 | 1h | Both blog posts gain impressions |
| **1.4** | **Fix sitemap `lastmod` coverage 9/46 → 46/46.** Extend `astro.config.mjs:14-28` serialize pass to non-blog pages (git last-commit or a `lastUpdated` frontmatter field). | 37 URLs — including `/` and `/about/` — emit no `lastmod`. Freshness is a scarce, cheap signal right after a collapse. | 1h | `grep -c lastmod dist/sitemap-0.xml` = 46 |
| **1.5** | **Fix `Organization` entity fragmentation** — emit `#organization` once (`OrganizationStructuredData.astro`), replace duplicates at `services/index.astro:19` and `contact/index.astro:12` with `{"@id":"…/#organization"}`. Unify phone (`+989125811880` vs `+98-912-581-1880`), address, founding date (`2020` vs `۱۳۹۸`), `sameAs`, trailing slashes. | 4 inconsistent declarations of the same entity — harms Google + AI entity resolution. → audit §4 D1 | 1–2h | Rich Results Test: one Organization |
| **1.6** | **Add `BreadcrumbList` to `blog/[slug]`, `services/`, `blog/`** (visual crumbs exist on `blog/[slug]` but no schema). | Entity completeness on the 3 highest-value templates. → audit §4 D4 | 30 min | JSON-LD count +1 on those routes |
| **1.7** | **Run PSI/CrUX on `/`, `/services/ai/`, `/blog/` (mobile).** Record LCP / INP / CLS. | **Zero field data exists.** Also needed to confirm the mobile header-overlap fix landed and to explain the **9.8-position mobile/desktop gap** (mobile = 84% of clicks). → audit §6 P1 | 30 min | Results appended to audit §6 |
| **1.8** | **Add undeclared MDX fields to `src/content.config.ts:9-25`** — `tags`, `featured`, `readTime` — or delete them from the MDX. | Silent data loss: tags list renders `[]`, featured badge never shows, readTime renders **empty**. → audit §3.3 | 20 min | `dist/blog/` shows read-time + featured badge |
| **1.9** | **Measure backlinks** — GSC → Links → Top linking sites (or `seo-backlinks`). | The single biggest unknown. 9/9 posts at 0 impressions is consistent with near-zero external authority. **Determines whether to keep writing content at all.** → `content-plan` §4 | 30 min | Referring-domain count recorded |
| **1.10** | Correct the **stale comment** at `src/lib/site-claims.ts:43-48` (stars *are* gated now) and the **word-count claims** at `audit/fixes-2026-09-12.md:257-258` (measured 700–900 / 750–950, not 2,100+/2,200+). | Prevents the next audit from re-reporting two non-issues and one false claim. | 10 min | Text corrected |

---

## P2 — next month (structural + hygiene)

### Content & on-page
| # | Action | Ref |
|---|---|---|
| 2.1 | Reword **`/blog/` H1** from `وبلاگ عصر سئو` (brand label) to a query match: `مقالات تخصصی سئو، محتوا و هوش مصنوعی` + one-line answer block. | audit §2 O1 |
| 2.2 | Expand `support/` (~80w), `privacy/`, `terms/` to ≥300w **or** `noindex` — plus **`noindex` `/sitemap/`** (it draws 11 impressions at pos 5.82, competing with content). `BaseLayout` already supports `noindex`; only `404.astro` uses it. | audit §2 O2 |
| 2.3 | Execute the **tier-A blog re-aims** (`content-calendar-guide`, `page-authority-guide`, `content-strategy-guide`) + internal-link matrix. | `content-plan` §2.3–2.4 |
| 2.4 | Fix **4 duplicate `og:image`**s; serve **PNG/JPEG OG at true 1200×630** (WebP support inconsistent on X/Telegram/LinkedIn). | audit §2 O3–O4 |
| 2.5 | Lengthen short titles/descriptions on utility pages (18–25 chars → 40–55). | audit §2 O5 |
| 2.6 | Replace **FID → INP** (≤200ms) on `website-speed`. | audit §2 O7 |
| 2.7 | Sharpen `Blog` index schema: wrap posts in `ItemList<ListItem>` or drop the invalid `blogPost[].position`. | audit §4 D6 |

### Technical
| # | Action | Ref |
|---|---|---|
| 2.8 | **307 → 308** for trailing-slash normalization (currently temporary, not permanent). | audit §1 T3 |
| 2.9 | **Single-hop `-2024` redirects** — add `/blog/post/<slug>` direct 301s to final URLs in `worker.ts` `REDIRECT_MAP` (currently chains through `/blog/<slug>-2024/`). | audit §1 T5 |
| 2.10 | **De-duplicate `Cache-Control`** — robots/sitemap return `public, max-age=3600, public, max-age=86400` (two values concatenated; parsers take the first, so the 1-day TTL is truncated to 1h). Both `_headers` and `worker.ts` write it. | audit §1 T4 |
| 2.11 | Extend `scripts/verify-deploy.mjs` to assert HTML `max-age=3600`, HSTS, and CSP (it already checks cache headers + `-2024` 301s). | audit §1 T6 |
| 2.12 | Delete orphan **`manifest.json`** (keep the linked `site.webmanifest`); drop the dead `WebSite > SearchAction` (Sitelinks SearchBox retired 2024). | audit §1 T7–T8 |
| 2.13 | Wrap `geoRadius` as `{"@type":"QuantitativeValue",…}`; add `url`/`image`/`inLanguage`/`@id` to all **`Service`** nodes; normalize `areaServed` to `Country`. | audit §1 T9, §4 D3 |

### Accessibility & performance
| # | Action | Ref |
|---|---|---|
| 2.14 | Add **`prefers-reduced-motion`** block to `globals.css` (11+ keyframes present; also WCAG 2.3.3). | audit §6 P3 |
| 2.15 | Add **global `:focus-visible`** ring (currently only `Button.astro`). | audit §7 |
| 2.16 | Associate form **`<label for>` / `input id`** on `/consultation/` + `/contact/` (WCAG 1.3.1 / 3.3.2 / 4.1.2). | audit §7 |
| 2.17 | **Re-verify** `Icon.astro:40` duplicate `class` attributes (09-12 measured 2,518 — may already be fixed; don't assume). | audit §7 |
| 2.18 | Add **`fetchpriority="high"`** to LCP heroes + explicit `aspectRatio` on `ServicesHero`; add `width`/`height` to the `Picture` fallback branch. | audit §6 P2, P4 |
| 2.19 | Remove dead **`dist/sw.js`** (referenced by no page); confirm `dist/js/ajax-form.js` still needed. | audit §6 P5 |

---

## P3 — ongoing / off-site (likely the binding constraint)

| # | Action | Why | Cadence |
|---|---|---|:---:|
| 3.1 | **Off-site entity footprint: LinkedIn → YouTube → Reddit → Wikidata** (that effort order). | Strongest AI-citation correlate; brand mentions ≈ 3× backlinks for citation. Nothing to fix in code. → audit §8 G4 | weekly |
| 3.2 | **Earn external links to the tier-C blog posts** (`seo-guide`, `digital-marketing-trends`, `google-ads-guide`, `ai-seo-guide` — depth already adequate, blocked on authority). | 9/9 posts at 0 impressions despite 1,300–1,684 words → authority deficit, not content deficit. → `content-plan` §4 | ongoing |
| 3.3 | **Track AI-engine citations manually** — monthly probe: ask ChatGPT / Perplexity / Gemini about `خدمات هوش مصنوعی`, `سئو چیست`, `تقویم محتوا`; record whether asreseo.com is cited. | GSC `Search appearance` sheet is **empty** — zero measurable presence in any enhanced surface. → audit §8 G1 | monthly |
| 3.4 | **Guard the money page** — `/services/ai/` is 99.4% of clicks. Monitor its position weekly; no informational blog post may target `خدمات هوش مصنوعی`. | Single point of failure. → `content-plan` §2.2 | weekly |
| 3.5 | Add `CCBot` / `Bytespider` / `Meta-ExternalAgent` policy to robots.txt (decide training posture deliberately). | Currently silent on these. → audit §8 G7 | once |
| 3.6 | Add `last-updated` timestamp + linkified policy entries to `llms.txt`. | → audit §8 G6 | once |
| 3.7 | Consider a genuine `en` hreflang version **only if** the business wants diaspora/GCC revenue — US already ranks at position 3.21 with 14 impressions. | Business decision, not a technical task. → `content-plan` §3 | decision |

### Do NOT do (explicitly)
- ❌ **Do not add `Review` / `AggregateRating` schema** until testimonials are `verified: true` with visible on-page reviews — spammy-markup manual-action risk.
- ❌ **Do not add new `HowTo` schema** (retired from Google SERPs Sept 2023). The one existing instance on `content-calendar` is harmless; keep it, don't spread it.
- ❌ **Do not expect `FAQPage` to win rich results** (retired for all sites May 2026) — keep it **for AEO/LLM entity understanding only**.
- ❌ **Do not write new blog posts** before P1 + `content-plan` §1 are done. 280 existing zero-click impressions beat zero new impressions.
- ❌ **Do not optimize against CTR** until 0.3 resolves — the reported CTR is arithmetically impossible.

---

## Success metrics — re-measure on next GSC export

| Metric | Baseline (now) | 30-day | 90-day |
|---|---:|---:|---:|
| Clicks/day | **0.13** | ≥ 2 | ≥ 8 |
| Average position (last 7d) | **65–69** | ≤ 55 | ≤ 45 |
| URLs with ≥1 impression | **16 / 46** | 22 / 46 | 30 / 46 |
| Blog posts with ≥1 impression | **0 / 9** | ≥ 4 / 9 | ≥ 7 / 9 |
| `content-calendar` position | **65.39** | ≤ 40 | ≤ 25 |
| `content-authority` position | **52.73** | ≤ 40 | ≤ 25 |
| Click concentration on `/services/ai/` | **99.4%** | ≤ 90% | ≤ 75% |
| Manual Actions | **unknown** | **none** | none |
| Referring domains | **unknown** | measured | +growth |
| Field CWV (mobile LCP/INP/CLS) | **unknown** | measured | all green |
| Sitemap `lastmod` coverage | **9 / 46** | 46 / 46 | 46 / 46 |

**Falsifiability:** if P1 items 1.1–1.3 land and `content-calendar`/`content-authority` positions do not improve within one export cycle, the constraint is external authority — stop investing in on-site content and pivot to P3 (§3.1, §3.2). If 0.3 reveals the historical clicks were artifact, re-baseline everything: the site has never had working organic traffic and the plan becomes a cold-start problem rather than a recovery problem.

---

*Generated 2026-09-23. Part of the asreseo.com audit dossier — see [`README.md`](./README.md).*
