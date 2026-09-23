# Zero-Click Query → Content Plan — asreseo.com

**Date:** 2026-09-23
**Purpose:** convert the 297 zero-click impressions and the 9 invisible blog posts into a concrete content plan.
**Skills used:** `blog-cluster` (hub-and-spoke architecture, SERP-intent grouping, internal-link matrix), `blog-brief` (target keywords, section structure), `seo-content-brief` (opportunity scoring), `blog-cannibalization` (overlap detection).
**Data source:** [`gsc-data-analysis-2026-09-23.md`](./gsc-data-analysis-2026-09-23.md) §5–§6.
**Companion:** [`action-plan-2026-09-23.md`](./action-plan-2026-09-23.md) (P1 items 6 and 9 originate here).

> **Core finding:** the site does **not** have a content-quantity problem. It has a **content-routing problem** — Google has already told us which 3 pages it wants to rank, and they are on page 6 with zero clicks. Meanwhile 9 blog posts compete with those same service pages and lose.

---

## 1. Priority 1 — Strengthen existing pages (280 impressions, page 6, zero clicks)

**This beats writing anything new.** These queries already produce impressions; they just need to move ~5 SERP places.

| Query | Impr | Pos | Owner | Action |
|---|---:|---:|---|---|
| `تقویم محتوا` | 47 | 66.21 | `/services/content/content-calendar/` | §1.1 |
| `اتوماسیون انتشار محتوا` | 42 | 53.67 | `/services/content/content-calendar/` | §1.1 |
| `اتوماسیون چرخه محتوا` | 35 | 75.91 | `/services/content/content-calendar/` | §1.1 |
| `تقویم محتوایی سایت` | 21 | 94.19 | `/services/content/content-calendar/` | §1.1 |
| `تقویم محتوایی` | 4 | 71.25 | `/services/content/content-calendar/` | §1.1 |
| `اعتبار صفحه` | 29 | 64.69 | `/services/seo/content-authority/` | §1.2 |
| `سوالات متداول سئو` | 17 | 57.24 | `/faq/` | §1.3 |
| `خدمات استراتژی محتوا` | 52 | 42.48 | **⚠️ unresolved** | §1.4 |
| **Subtotal** | **247** (297 incl. tail) | | | |

### 1.1 `/services/content/content-calendar/` — 149 query-impressions, 4 queries
Already the richest service page (7 H2s, `HowTo` schema). Gap vs intent:

- **All 4 queries are `چرخه محتوا` / `اتوماسیون` / `تقویم` variants — one semantic cluster.** The page targets them but sits at positions 53–94.
- **Actions:**
  1. Add an **answer-first block (130–170 words)** directly under the H1 that answers *"تقویم محتوا چیست؟"* as a standalone definition — this is the AEO unit AI engines quote.
  2. Ensure `تقویم محتوا` appears in the **H1 or first H2** (currently H1 = `تقویم محتوایی سایت و اتوماسیون انتشار` — close; add the short head term verbatim in the answer block).
  3. Add an **H2 per zero-click query**: `اتوماسیون انتشار محتوا چیست؟`, `اتوماسیون چرخه محتوا چگونه کار می‌کند؟`, `بهترین ابزار تقویم محتوایی سایت`.
  4. **Internal link in/out** with exact-match anchors to/from `content-strategy-guide` (see §3, cannibalization resolution).
  5. Body depth: currently strong; push to ≥1,500 words with a concrete Persian-language example calendar (week-by-week table) — that is the missing information gain.

### 1.2 `/services/seo/content-authority/` — 102 impressions, position 52.73
- Single query `اعتبار صفحه` (29 impr) plus unlisted tail to reach 102.
- **Actions:**
  1. Answer-first definition block: *"اعتبار صفحه (Page Authority) چیست و چگونه افزایش یابد؟"*
  2. Differentiate hard from the competing blog post `page-authority-guide` (§2.2) — service page = *we do this for you* (process, deliverables, pricing signal); blog = *how it works* (definition, factors, checklist).
  3. Add an H2 matching `افزایش اعتبار صفحه` verbatim (already in H1 — keep).
  4. Add concrete before/after metrics with sources.

### 1.3 `/faq/` — `سوالات متداول سئو`, 17 impr, position 57.24
- Page is ~3,000 words with **16 `Question`/`Answer` pairs in `FAQPage` schema** — genuinely strong.
- Rank 57 means relevance exists but authority doesn't. **Actions:** (a) make the top 5 answers self-contained 40–60 word units (ideal AI-citation length); (b) add `BreadcrumbList` (already present ✅ — verify); (c) link each FAQ answer to its owning service page with descriptive anchors, consolidating internal authority.

### 1.4 ⚠️ `خدمات استراتژی محتوا` — 52 impressions, position 42.48, **no owning page in GSC**
`/services/content/` (the content hub) shows **0 impressions**, yet this query holds 52. Either:
- the impression is attributed to `content-calendar` (whose 178 exceeds its four mapped queries: 47+42+35+21+4 = 149 → 30 unexplained), or
- the Pages export is incomplete for that URL.

**Resolve first (5 min in GSC):** Pages → click `/services/content/` → filter queries → confirm ownership.

**Then:** if `/services/content/` owns it, that page's H1 (`خدمات استراتژی محتوا و بازاریابی محتوایی`) already matches — so position 42 with 0 impressions shown is a reporting artifact; if `content-calendar` owns it, the **content hub is not ranking for its own head term** and needs an answer-first block on `استراتژی محتوا چیست؟`.

---

## 2. Priority 2 — The 9 blog posts: 0 impressions, 0 clicks

### 2.1 Diagnosis

| Post | ~Words | `updated` | Status |
|---|---:|---|---|
| `seo-faq-guide` | 1,684 | 2026-09-14 | 🔴 0 impressions |
| `digital-marketing-trends` | 1,521 | 2026-09-12 | 🔴 0 impressions |
| `ai-seo-guide` | 1,495 | 2026-09-12 | 🔴 0 impressions |
| `seo-guide` | ~1,300–1,500 | 2026-09-12 | 🔴 0 impressions |
| `google-ads-guide` | ~1,300–1,500 | 2026-09-12 | 🔴 0 impressions |
| `page-authority-guide` | ~1,100–1,300 | 2026-09-11 | 🔴 0 impressions |
| `content-calendar-guide` | ~900–1,100 | 2026-09-12 | 🔴 0 impressions |
| `content-strategy-guide` | ~750–950 | 2026-09-14 | 🔴 0 impressions |
| `ai-content-automation` | ~700–900 | 2026-09-14 | 🔴 0 impressions |

**Why zero — ranked causes:**

| # | Cause | Evidence | Verifiable? |
|---|---|---|:---:|
| 1 | **Cannibalization — Google chose the service page over the blog post for the same intent** | `تقویم محتوا` → `content-calendar` (178 impr), `اعتبار صفحه` → `content-authority` (102 impr); blog posts get 0 | ✅ GSC: compare both URLs for the query |
| 2 | **Insufficient body depth for the target query** | 700–1,100 words on 4 of 9 vs 1,500–2,500 competitor norm | ✅ SERP comparison |
| 3 | **Zero external authority to any post** | Unknown — **no backlink data available** | ✅ GSC Links report / `seo-backlinks` |
| 4 | **Hub ranks, spokes don't → no authority flowing outward** | `/blog/` at position 13.09, 11 impr; 9 spokes at 0 | ✅ internal-link audit |
| 5 | Posts too new to have accrued | 4 published/refreshed 2026-09-11→14, *after* the collapse | ⚠️ partially — but 5 older posts also 0 |

### 2.2 Cannibalization matrix — resolve before writing more

| Intent | Blog post | Service page | Winner (GSC) | Decision |
|---|---|---|:---:|---|
| `تقویم محتوا` | `content-calendar-guide` | `content-calendar/` (178 impr) | **Service** | **Differentiate:** service = commercial (`خدمات تقویم محتوا`, process, CTA); blog = definitional/how-to, no hard CTA, link *to* service with `خدمات تقویم محتوایی` anchor. |
| `اعتبار صفحه` | `page-authority-guide` | `content-authority/` (102 impr) | **Service** | Same pattern: blog = `اعتبار صفحه چیست` (definition + factors checklist); service = `افزایش اعتبار صفحه` (we do it for you). |
| `استراتژی محتوا` | `content-strategy-guide` | `content/` (0 impr) | **neither** | **Both weak.** Put the definition on the hub, expand the blog post to a pillar, cross-link with explicit ` pillar ↔ spoke` anchors. |
| `سئو با هوش مصنوعی` | `ai-seo-guide`, `ai-content-automation` | `services/ai/` (**99.4% of all clicks**) | **Service, decisively** | ⚠️ **Protect the money page.** Blog posts must NOT target `خدمات هوش مصنوعی`. Restrict them to informational phrasing only and link inward once each. |

**Rule going forward:** every new post must declare its target query **and** its non-owner (which URL must *not* compete for it).

### 2.3 Per-post actions (in priority order)

**Tier A — fix routing, don't rewrite (fastest win)**
1. **`content-calendar-guide`** — re-aim at `تقویم محتوا چیست` / `نمونه تقویم محتوا`; add answer-first block; add descriptive anchor → `/services/content/content-calendar/`.
2. **`page-authority-guide`** — re-aim at `اعتبار صفحه چیست`; add factors table with sourced metrics; anchor → `/services/seo/content-authority/`.
3. **`content-strategy-guide`** (~750–950w, too thin) — expand to ≥1,500; target `استراتژی محتوا چیست`; cross-link bidirectionally with `/services/content/`.

**Tier B — depth + information gain**
4. **`ai-content-automation`** (~700–900w, newest) — expand with a real workflow diagram/table; target `اتوماسیون تولید محتوا`. ⚠️ Must not touch `خدمات هوش مصنوعی`.
5. **`seo-faq-guide`** (1,684w, largest, yet 0 impressions) — depth is fine; the issue is authority + cannibalization with `/faq/`. Differentiate: blog = long-form explained answers; `/faq/` = short definitional units. Add 3–5 *unique* questions `/faq/` doesn't have.

**Tier C — already adequate depth, blocked on authority**
6. `seo-guide` · 7. `digital-marketing-trends` · 8. `google-ads-guide` · 9. `ai-seo-guide` — 1,300–1,521 words each, freshly updated, correct schema. **Do not rewrite.** They need external links (§4), not more words.

### 2.4 Internal-link matrix (blog ↔ services)

Current hub-and-spoke is implicit. Make it explicit — every post links out to its owning service page and one sibling post; every service page links to its spoke:

```
/services/content/  ←→  content-strategy-guide
/services/content/content-calendar/  ←→  content-calendar-guide
/services/seo/content-authority/  ←→  page-authority-guide
/services/ai/  ←→  ai-seo-guide, ai-content-automation   (1-way out only — protect money page)
/services/seo/  ←→  seo-guide, seo-faq-guide
/services/marketing/google-ads/  ←→  google-ads-guide
/services/marketing/  ←→  digital-marketing-trends
/faq/  ←→  seo-faq-guide   (explicit intent split, §2.3.5)
```

Plus `/blog/` hub should feature-link the 3 tier-A posts (currently they lose to the service pages for their own head terms).

---

## 3. Priority 3 — New content (only after P1/P2)

Do **not** create new posts before the 280-impression existing pages move. When ready, gaps identified from the query table:

| Opportunity | Supporting signal | Notes |
|---|---|---|
| `خدمات سئو هوش مصنوعی` (10 impr, pos 65.2) | already in report | Owned by `/services/ai/`; **do not create a competing post** — add an H2/FAQ instead. |
| `شرکت خدمات هوش مصنوعی` (1 impr, pos 32) | low volume, commercial | Add to `/services/ai/` FAQ, not a new page. |
| English/international (`United States`, pos 3.21, 14 impr, 0 clicks) | real foreign demand signal | Only if the business wants diaspora/GCC revenue — requires a genuine `hreflang` `en` version, currently self-referential `fa-IR` only. **Business decision, not a content task.** |
| AI-engine citation probes | §8.2 G1 of the main audit | No measurable appearance in any enhanced surface yet. |

**On new posts:** if commissioned, apply the `blog-cluster` discipline — declare target query + non-owner, ≥1,500 words, answer-first block, `keyTakeaways`, 4–7 FAQs, absolute internal links, `lastmod` on publish *and* refresh.

---

## 4. The blocking unknown — external authority

Everything in §1–§3 assumes on-site fixes are the constraint. **That is unverified.** No backlink/referring-domain data was available to this audit.

- A 46-page site with 9 fresh, well-structured posts earning **0 impressions across all 9** is consistent with **near-zero external authority**, not just weak on-page SEO.
- **Measure before committing to a content budget:** GSC → Links → *Top linking sites* (and/or `seo-backlinks` skill).
- **Decision rule:** if referring domains ≈ 0–3 → prioritise §4 of the main audit (off-site entity footprint: LinkedIn → YouTube → Reddit → Wikidata) *in parallel with* §1, because on-site work alone will plateau.

---

## 5. Success metrics (re-measure on next GSC export)

| Metric | Now | Target (30 days) | Target (90 days) |
|---|---:|---:|---:|
| URLs with ≥1 impression | **16 / 46 (35%)** | 22 / 46 | 30 / 46 |
| Blog posts with ≥1 impression | **0 / 9** | ≥ 4 / 9 | ≥ 7 / 9 |
| Clicks/day | **0.13** | ≥ 2 | ≥ 8 |
| Avg position | **65–69** | ≤ 55 | ≤ 45 |
| `content-calendar` position | **65.39** | ≤ 40 | ≤ 25 |
| `content-authority` position | **52.73** | ≤ 40 | ≤ 25 |
| Click concentration on `/services/ai/` | **99.4%** | ≤ 90% | ≤ 75% |

**Falsifiability:** if §1 (strengthening existing pages) is executed and `content-calendar`/`content-authority` positions do not improve within one export cycle, the binding constraint is external authority (§4), not content — stop writing and pivot to off-site.

---

*Generated 2026-09-23 from the GSC export + codebase audit. Part of the asreseo.com audit dossier — see [`README.md`](./README.md).*
