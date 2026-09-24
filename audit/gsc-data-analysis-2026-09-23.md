# GSC Performance Data Analysis — asreseo.com

**Date:** 2026-09-23
**Source:** `asreseo.com-Performance-on-Search-2026-09-23.xlsx` (Google Search Console → Performance → Search results → Export → Google Sheets/Excel)
**Filters in export:** Search type = **Web**, Date = **Last 3 months**
**Coverage window:** 2026-06-21 → 2026-09-20 (**92 days**)
**Method:** full programmatic read of all 7 sheets (`Chart`, `Queries`, `Pages`, `Countries`, `Devices`, `Search appearance`, `Filters`), arithmetic reconciliation across dimensions, and correlation against git deploy history.
**Companion docs:** [`seo-aeo-geo-audit-2026-09-23.md`](./seo-aeo-geo-audit-2026-09-23.md) · [`content-plan-zero-click-2026-09-23.md`](./content-plan-zero-click-2026-09-23.md) · [`action-plan-2026-09-23.md`](./action-plan-2026-09-23.md)

---

## 0. Headline

> **Search clicks collapsed by ~99% on 2026-08-27/28 and have not recovered.**
> 12.6 clicks/day → **0.13 clicks/day**, sustained for **24 consecutive days** (2026-08-28 → 2026-09-20: **3 clicks total**).
> Impressions continued throughout, so the site **is still indexed** — this is a **ranking/position collapse**, not a deindexing.

Three findings, in priority order:

| # | Finding | Severity |
|---|---|:---|
| 1 | **Click collapse from 2026-08-27.** 24 days, 3 clicks. Average position degraded 35 → 69 over the same window. | 🔴 Critical |
| 2 | **Single-point-of-failure traffic.** `/services/ai/` produced **869 of 874 clicks (99.4%)**. One page = the entire business's organic pipeline. | 🔴 Critical |
| 3 | **65% of the site is invisible.** Only **16 of 46** sitemap URLs appear in the Pages report. **All 9 blog posts received 0 impressions.** | 🟠 High |

Plus a data-integrity flag: the reported CTR/position pair is **arithmetically impossible** (§6) — verify the numbers before optimizing against them.

---

## 1. Totals and reconciliation

| Dimension | Clicks | Impressions | CTR | Avg position |
|---|---:|---:|---:|---:|
| **Total (all 92 days)** | **874** | **1,386** | **63.06%** | **~50** |

Cross-dimension reconciliation (a data-quality check — do the dimension sheets sum to the same total?):

| Sheet | Σ Clicks | Σ Impressions | Reconciles? |
|---|---:|---:|---|
| Chart (daily) | 874 | 1,386 | ✅ baseline |
| Devices | 874 | 1,386 | ✅ exact |
| Countries | 874 | 1,386 | ✅ exact |
| Queries | 868 | 1,304 | ✅ (−6 clicks / −82 impr = `(not set)` bucket) |
| **Pages** | **874** | **1,465** | ⚠️ **impressions +79 over baseline** |

The Pages sheet over-counts impressions by **79 (5.7%)**. Visible cause: `/services/content/content-calendar/` **and** `/services/content/content-calendar` (slash + non-slash) both appear as separate rows (178 + 1) — URL-variant double counting. Implication for §5: page-level impression figures are directionally reliable, not precise.

**Search appearance sheet: empty (header row only).** Zero Discover, zero AI Overview, zero image, zero video, zero sitelink-appearance data. The site earns **no appearances in any enhanced search surface** — relevant to AEO/GEO (§7).

---

## 2. The collapse — monthly trend

| Month | Days | Clicks | Impressions | CTR | Avg pos | Clicks/day | Impr/day |
|---|---:|---:|---:|---:|---:|---:|---:|
| 2026-06 (21–30) | 10 | 172 | 185 | 92.97% | 50.8 | **17.2** | 18.5 |
| 2026-07 | 31 | 443 | 534 | 82.96% | 51.5 | **14.3** | 17.2 |
| 2026-08 | 31 | 256 | 471 | 54.35% | 44.6 | **8.3** | 15.2 |
| **2026-09 (1–20)** | 20 | **3** | 196 | **1.53%** | **65.2** | **0.15** | 9.8 |

```
Clicks/day     ████████████████████ 17.2   (Jun 21-30)
                █████████████████ 14.3      (Jul)
                ██████████ 8.3              (Aug)
                ▏ 0.15                       (Sep 1-20)  ← -99%
```

### 2.1 The break point

Daily data shows the decline is not gradual — it is a **step change**:

| Date range | Clicks | Clicks/day | Avg pos |
|---|---:|---:|---:|
| 2026-07-01 → 2026-08-24 (55 d) | 693 | **12.6** | ~43 |
| 2026-08-25 → 2026-08-27 (3 d) | 6 | 2.0 | ~53 |
| **2026-08-28 → 2026-09-20 (24 d)** | **3** | **0.125** | **~66** |

The only three clicks in the entire last-24-day window: **2026-09-01 (1), 2026-09-06 (1), 2026-09-12 (1)**.

Position trajectory around the break:
- 2026-08-15 → 08-24 (10 days): avg position **35.1**
- 2026-09-15 → 09-20 (6 days): avg position **68.8**

**Position roughly doubled (fell ~3–4 SERP places deeper) while impressions persisted at ~9–11/day.**

### 2.2 Deploy correlation — the collapse PRECEDES the Astro launch

Git history, cross-referenced against the break point:

| Date | Event | GSC |
|---|---|---|
| 2026-08-15 → 09-10 | **no commits at all** (codebase frozen) | clicks die **08-27/28** |
| 2026-09-11 → 09-14 | Astro rebuild launch push (45-fix batch, worker, redirects, schema, robots) | ~0 clicks |
| **2026-09-14** | 16 commits — biggest deploy of the project | ⚠️ **0 impressions, 0 clicks** (total gap day) |
| 2026-09-15 → 09-20 | stable | 0 clicks, pos 65–75, impr resumed (13, 15, 11, 12, 6, 12) |

**Two conclusions:**

1. **The collapse is NOT caused by the Astro migration.** Clicks stopped on 2026-08-27 while the codebase was frozen and (per `audit-full-2026-09-12.md`) production was still serving the legacy Next.js app. Whatever caused it is **external to this repo's recent changes**.
2. ⚠️ **2026-09-14 recorded zero impressions** — the same day as the largest deploy of the project. Impressions resumed normally on 09-15, so this is most likely a GSC processing gap rather than an outage, but **verify**: check Cloudflare analytics for 09-14 traffic, and confirm no 5xx window during the worker cutover.

### 2.3 Competing hypotheses for the collapse (unranked until verified)

The codebase is frozen, so the cause is external. Ranked by plausibility:

| # | Hypothesis | How to falsify (do this) |
|---|---|---|
| H1 | **Google algorithmic ranking adjustment** (broad/core update, helpful-content re-evaluation, or link-based demotion) hitting a 46-page site with thin authority. | Check Google Search Status Archive + industry volatility trackers for late-Aug 2026. Compare with GSC "last 16 months" to see if position recovered. |
| H2 | **Manual action / spam directive.** | **GSC → Security & Manual Actions → Manual Actions.** Must be checked first; it is the single highest-value 2-minute check. |
| H3 | **Lost a high-CTR placement** (featured snippet / top-result slot on `خدمات هوش مصنوعی`) that the site held Jun–Aug. | GSC → Compare → 2026-08-01..08-24 vs 2026-09-01..09-20, filter query = `خدمات هوش مصنوعی`, read position delta. |
| H4 | **Measurement/data anomaly ending** — the anomalous click stream (§6) stopped on 08-27. | Cross-check GSC API (`searchanalytics.query`) against server/Cloudflare logs for Jun–Aug. If server hits ≠ GSC clicks, the historical clicks were artifact. |
| H5 | **Index/canonical reprocessing** during the Next→Astro URL-parity rebuild. | URL Inspection on `/services/ai/` + `sitemap-0.xml` → "Discovered, currently not crawled" vs "Crawled - currently not indexed". |

**Sequence:** run **H2 first** (2 min), then H3, then H1/H5 (10 min), then H4 (needs log access).

---

## 3. Page concentration — 99.4% from one URL

| Page | Clicks | Impressions | CTR | Position | Share of all clicks |
|---|---:|---:|---:|---:|---:|
| `/services/ai/` | **869** | 1,064 | 81.7% | 48.79 | **99.4%** |
| `/` | 4 | 22 | 18.2% | 4.23 | 0.5% |
| `/services/ai/content-creation/` | 1 | 4 | 25.0% | 6.75 | 0.1% |
| *all other 43 pages* | **0** | 296 | 0% | — | **0%** |

**Risk:** the site's entire organic channel is one URL targeting one query. Any movement on `/services/ai/` = an existential traffic event. There is **no redundancy**: no second page earns clicks, and the homepage — despite ranking **position 4.23** — converted only 4 of 22 impressions.

**What the concentration is NOT:** it is not because other pages rank badly. Several rank *well* and still earn nothing (§4).

---

## 4. The zero-click pages — good rankings, no traffic

Pages that appear in the report with a **top-15 position but 0 clicks**:

| Page | Position | Impressions | Clicks |
|---|---:|---:|---:|
| `/about/` | **3.70** | 20 | 0 |
| `/sitemap/` | **5.82** | 11 | 0 |
| `/services/seo/technical-onpage/` | **5.33** | 3 | 0 |
| `/services/seo/` | **6.60** | 10 | 0 |
| `/services/content/translation/` | **7.33** | 3 | 0 |
| `/services/ai/analysis-strategy/` | **8.50** | 2 | 0 |
| `/services/ai/marketing-engagement/` | **9.50** | 2 | 0 |
| `/blog/` | 13.09 | 11 | 0 |

**6 pages rank in the top 10 and produced zero clicks.** At these positions a normal CTR would be 2–5%, so the impressions are simply too few (2–20 each) — this is a **volume problem, not a CTR problem**. The site does not generate enough impressions for good positions to matter.

**Deliberate note:** `/sitemap/` and `/about/` ranking top-5 is not a target to optimize; the HTML sitemap draws impressions away from content pages. See `action-plan` P2 for whether to keep `/sitemap/` indexable.

---

## 5. Visibility coverage — 65% of the site earns nothing

Comparing the 46 `sitemap-0.xml` URLs against the Pages report:

| | Count | % of sitemap |
|---|---:|---:|
| URLs with ≥1 impression | **16** | **35%** |
| URLs with **0** impressions | **30** | **65%** |
| **Blog posts with ≥1 impression** | **0 / 9** | **0%** |

### 5.1 All 9 blog posts are invisible

```
/blog/ai-content-automation/        0 impressions
/blog/ai-seo-guide/                 0 impressions
/blog/content-calendar-guide/       0 impressions
/blog/content-strategy-guide/       0 impressions
/blog/digital-marketing-trends/     0 impressions
/blog/google-ads-guide/             0 impressions
/blog/page-authority-guide/         0 impressions
/blog/seo-faq-guide/                0 impressions
/blog/seo-guide/                    0 impressions
```

The blog index itself ranks **position 13.09** with 11 impressions — so Google sees and ranks the hub, but **not one of the 9 articles earns a single impression for any query in 92 days.**

This is the largest content finding in the audit. Nine cornerstone articles (673–1,684 words each, all with `keyTakeaways` + FAQs, all refreshed Sept 2026) are producing **exactly zero measurable search value.**

Contributing factors to investigate (see `content-plan` doc):
- Body word counts 673–1,684 vs competitor-level 1,500–2,500 for the target queries.
- Zero external links / referring domains to any post (unverified — needs a backlink export).
- `lastmod` present on all 9 posts but **37 of 46 sitemap URLs have no `<lastmod>`** — freshness signalling is blog-only.
- Possible overlap: `page-authority-guide` vs `/services/seo/content-authority/` (both target `اعتبار صفحه`).

### 5.2 High-impression pages with 0 clicks

| Page | Impressions | Position |
|---|---:|---:|
| `/services/content/content-calendar/` | **178** | 65.39 |
| `/services/seo/content-authority/` | **102** | 52.73 |
| `/faq/` | 27 | 37.48 |
| `/` | 22 | 4.23 |
| `/about/` | 20 | 3.70 |

`content-calendar` (178) + `content-authority` (102) = **280 impressions, positions 53–65, zero clicks.** These are the two cheapest ranking gains available: they already have impression volume and sit on **page 6** — moving them to page 1–2 is worth more than creating new pages.

---

## 6. Zero-click queries and the data-integrity anomaly

### 6.1 Query table (all 15 rows)

| Query | Clicks | Impr | CTR | Position | Owning page |
|---|---:|---:|---:|---:|---|
| `خدمات هوش مصنوعی` | **822** | 991 | **83.0%** | **47.61** | `/services/ai/` |
| `خدمات هوش مصنوعی و سئو` | 42 | 44 | 95.5% | 90.41 | `/services/ai/` |
| `خدمات ai` | 4 | 8 | 50.0% | 1.62 | `/services/ai/` |
| `خدمات استراتژی محتوا` | 0 | 52 | 0% | **42.48** | `/services/content/` ⚠️ |
| `تقویم محتوا` | 0 | 47 | 0% | 66.21 | `content-calendar` |
| `اتوماسیون انتشار محتوا` | 0 | 42 | 0% | 53.67 | `content-calendar` |
| `اتوماسیون چرخه محتوا` | 0 | 35 | 0% | 75.91 | `content-calendar` |
| `اعتبار صفحه` | 0 | 29 | 0% | 64.69 | `content-authority` |
| `تقویم محتوایی سایت` | 0 | 21 | 0% | 94.19 | `content-calendar` |
| `سوالات متداول سئو` | 0 | 17 | 0% | 57.24 | `/faq/` |
| `خدمات سئو هوش مصنوعی` | 0 | 10 | 0% | 65.20 | `/services/ai/` |
| `تقویم محتوایی` | 0 | 4 | 0% | 71.25 | `content-calendar` |
| `طراحی سایت و سئو` | 0 | 2 | 0% | 99.00 | `seo-web-design` |
| `شرکت خدمات هوش مصنوعی` | 0 | 1 | 0% | 32.00 | `/services/ai/` |
| `نکات سئو و دیجیتال مارکتینگ` | 0 | 1 | 0% | 82.00 | `/faq/` or blog |

⚠️ `خدمات استراتژی محتوا` (52 impressions, pos 42) has **no matching page in the Pages report** — `/services/content/` shows 0 impressions. Either the impression is attributed to `content-calendar` (whose 178 exceeds its mapped queries), or the Pages export is incomplete for that URL. **Resolve by opening GSC → Pages → click `/services/content/` → filter queries.**

**Zero-click query mass: 297 impressions across 12 queries with 0 clicks.**

### 6.2 The CTR/position pair is arithmetically impossible

- `خدمات هوش مصنوعی`: **822 clicks / 991 impressions = 83% CTR at average position 47.61.**
- Position 47.6 = **page 5 of Google**. The #1 result averages ~25–30% CTR; page 5 averages **< 1%**. An 83% CTR there is off by roughly **two orders of magnitude**.
- Site-wide: **63.06% CTR** at position ~50.
- The daily sheet contains numerous days where `clicks == impressions` exactly (CTR = 100%): 06-25, 07-01, 07-02, 07-04, 07-10, 07-16→07-22, … A 100% CTR means *every* impression produced a click — not observed on real organic SERPs.

**This cannot be a genuine organic CTR.** Ranked explanations:

| # | Explanation | Likelihood |
|---|---|:---|
| 1 | **Impressions severely undercounted** while clicks are counted normally — the position metric is then averaged over a small, unrepresentative impression sample. | High |
| 2 | **Historical clicks were artifact** (§2.3 H4) — bot/referral activity, or a GSC property/attribution defect — and stopped on 08-27. | Medium |
| 3 | **A real high-position placement existed Jun–Aug** and the reported position is polluted by low-position impressions. | Low (arithmetically inconsistent) |
| 4 | GSC export/reporting bug on this property. | Low |

**Action — do not skip:** pull the same window via the **GSC API** (`searchanalytics.query`, dimensions `['query']` or `['date']`) and compare against **Cloudflare Web Analytics server hits** for `/services/ai/`. If server-side Google organic hits ≫ 874, the export is broken; if server hits ≈ 0, the historical clicks were artifact and **the real site has effectively never had working organic traffic.** That single test determines whether the "collapse" is a traffic loss or a measurement correction.

**Operational rule until resolved:** treat CTR as **unusable for optimization decisions**. Optimize on **impressions and position**, both of which behave normally.

---

## 7. Geography, device, and appearance

### Countries
| Country | Clicks | Impr | CTR | Position |
|---|---:|---:|---:|---:|
| **Iran** | **874 (100%)** | 1,364 (98.4%) | 64.1% | 51.48 |
| United States | 0 | 14 | 0% | **3.21** |
| Afghanistan | 0 | 3 | 0% | 49.67 |
| Italy / Netherlands / UK / UAE / Colombia | 0 | 1 each | 0% | 2.0–9.0 |

- **100% of clicks originate from Iran** — correct for a Persian-language, Iran-targeted agency. Not a problem; confirms the `fa-IR` hreflang/`lang` strategy is sound.
- **US ranks position 3.21 across 14 impressions with 0 clicks** — a small but real English-language demand signal. If the business wants diaspora/GCC revenue, that is a translation-priority indicator (currently `hreflang` is `fa-IR` + `x-default` self-referential only; no `en` version exists).

### Devices
| Device | Clicks | Impr | CTR | Position |
|---|---:|---:|---:|---:|
| **Mobile** | **732 (83.8%)** | 964 | 75.9% | **53.79** |
| Desktop | 142 (16.2%) | 422 | 33.6% | **44.03** |

- **Mobile is 84% of traffic but ranks 9.8 positions worse than desktop.** This mirrors the mobile header/hero overlap defect documented in `audit-full-2026-09-12.md` §1.3 (fixed in Astro per `fixes-2026-09-12.md`, but **unverified in field data**). Mobile is where the money is; closing that 10-position gap is high leverage.
- Mobile and desktop CTRs are both impossible per §6.

### Search appearance
**Empty.** No Discover, no AI Overview, no image, no video, no sitelinks-appearance data. In AEO/GEO terms: **the site has zero presence in Google's enhanced/answer surfaces.** Compare with the opportunity identified in `seo-aeo-geo-audit-2026-09-14.md` §7 — `llms.txt` plumbing is best-in-class but is not yet translating into measurable AI-surface appearance.

---

## 8. What the data says is working

Credit where due — these are real, load-bearing positives:

1. **Indexation is healthy.** 46 URLs in sitemap, 16 earning impressions, 0 marked as errors in this export, impressions continuous through the deploy.
2. **`/services/ai/` genuinely ranks for its head term.** 991 impressions on `خدمات هوش مصنوعی` with position 1.62 on `خدمات ai` — the page has real relevance for the primary commercial query.
3. **Positions on utility/authority pages are strong** (§4) — `/about/` 3.7, `/services/seo/` 6.6, `/technical-onpage/` 5.33. The technical/on-page foundation is not the bottleneck.
4. **geo/hreflang correct:** 100% Iran, `fa-IR` self-referential hreflang, `lang="fa" dir="rtl"` — no wasted international crawl.
5. **Device mix is mobile-heavy but the site is now static Astro** — the biggest mobile performance risk (628 KB of JS) was removed by the migration; field confirmation still pending (no CrUX data available here).

---

## 9. Falsifiable verification checklist

Every claim above can be re-tested. Run these in GSC/webmaster UI (not available to this audit):

- [ ] **H2 first:** GSC → Security & Manual Actions → **Manual Actions**. Screenshot result. *(5 min)*
- [ ] **H3:** GSC → Performance → Compare **2026-08-01..08-24** vs **2026-09-01..09-20**, query `خدمات هوش مصنوعی`. Record position delta. *(10 min)*
- [ ] **H4:** GSC API same window vs Cloudflare analytics Google-organic hits on `/services/ai/`. Determines artifact vs real loss. *(30 min)*
- [ ] **Page completeness:** GSC → Pages → `/services/content/` → filter queries, resolve the `خدمات استراتژی محتوا` attribution gap (§6.1).
- [ ] **Blog reality check:** GSC → Pages → filter `/blog/` → confirm 0 impressions is not an export-truncation artifact; also compare date range to "last 16 months".
- [ ] **Index coverage:** URL Inspection on `/blog/seo-faq-guide/` and `/services/content/content-calendar/` — record index status + "Why not indexed".
- [ ] **09-14 gap:** Cloudflare analytics for 2026-09-14 — confirm no outage during the worker deploy.
- [ ] **Field CWV:** PageSpeed Insights on `/` + `/services/ai/` (mobile) — no CrUX/PSI data was available to this audit.
- [ ] **Re-run this analysis** after the next GSC export; §2's clicks/day table and §5's 16/46 coverage are the two headline metrics to move.

---

## 10. Method notes & limitations

- All figures read programmatically from the workbook; no manual transcription. Chart sheet = 92 daily rows.
- **CTR figures are reported as-is but must not be used for decision-making** (§6.2).
- Page impressions over-count by 79 vs baseline (§1) — treat page impressions as approximate.
- This export has **no Search Console API data, no backlink/referring-domain data, no CrUX/PageSpeed field data, no manual-action status, and no per-query-per-page breakdown.** Those gaps are listed as checklist items in §9 rather than guessed at.
- The export covers only **"last 3 months"** — the collapse cannot be placed in longer historical context without a 16-month pull.

---

*Generated 2026-09-23 from `asreseo.com-Performance-on-Search-2026-09-23.xlsx`. Part of the asreseo.com audit dossier — see [`README.md`](./README.md).*
