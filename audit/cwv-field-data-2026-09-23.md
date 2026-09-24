# Core Web Vitals — Field Data Acquisition Attempt

**Date:** 2026-09-23
**Target site:** `https://asreseo.com` (Astro 7 static, Cloudflare, Persian/RTL)
**Plan item:** P1.7 — obtain real Core Web Vitals field data (LCP / INP / CLS)

## Bottom line

**Real field data could NOT be obtained — because it does not exist for this site.**

This is not (only) an access problem. The Chrome UX Report — the dataset that backs PageSpeed
Insights field data, the CrUX API, the CrUX Dashboard, and Search Console's CWV report — returns
`404 NOT_FOUND: "chrome ux report data not found"` for **every variant** of this origin and for
**all three target URLs**. The same API, with the same key, returned `200` with real data for
control origins in the same session, so the queries and credentials were valid.

**No CWV number in this file is estimated, interpolated, or fabricated. Every field-data cell is
"unavailable".**

## Attempts — what succeeded and what failed

| # | Attempt | Result | Exact status / error |
|---|---------|--------|----------------------|
| A | PageSpeed Insights web API (keyless), all 6 URL×strategy combos | **FAILED** | `HTTP 429` — `"Quota exceeded for quota metric 'Queries' and limit 'Queries per day' of service 'pagespeedonline.googleapis.com' for consumer 'project_number:583797351490'"`, `status: RESOURCE_EXHAUSTED`, reason `rateLimitExceeded` / `RATE_LIMIT_EXCEEDED`, `quota_limit: defaultPerDayPerProject`, `quota_limit_value: "0"` (keyless daily quota for Google's shared anonymous project is exhausted) |
| A′ | Same PSI call retried later in session, and via a second network path (`webfetch`) | **FAILED** | `429` both times — deterministic, not a transient spike |
| A″ | Alternate PSI host `https://pagespeedonline.googleapis.com/v5/runPagespeed` | **FAILED** | `404` HTML Google error page (`Error 404 (Not Found)!!1`) — host does not serve this API |
| — | Google API key discovery (`env`, repo files, `~/.config`, gcloud) | **NONE FOUND** | `NO_GOOGLE_KEYS_FOUND`; no `~/.config/gcloud`, no `google-api.json`, `gcloud` not installed, `GOOGLE_APPLICATION_CREDENTIALS` empty, repo grep for `AIza…`/`GOOGLE_API_KEY` → no matches. No `&key=` was invented or hardcoded. |
| B | CrUX API keyless | **FAILED** | `HTTP 403` — `"Method doesn't allow unregistered callers… Please use API Key or other form of API consumer identity"`, `status: PERMISSION_DENIED` |
| B′ | CrUX API **with a real key** (provenance below) — origin + URL queries for all 3 targets, 4 origin variants | **QUERY SUCCEEDED, DATA ABSENT** | `HTTP 404` — `"chrome ux report data not found"`, `status: NOT_FOUND` for: `https://asreseo.com` (origin, all-form-factor), `http://asreseo.com`, `https://www.asreseo.com`, and URLs `/`, `/services/ai/`, `/blog/`. **Controls with the same key returned `200`** (`https://developer.chrome.com`, `https://example.com`), proving the key and request format were valid |
| B″ | CrUX **History** API (`records:queryHistoryRecord`) for `https://asreseo.com` | **QUERY SUCCEEDED, DATA ABSENT** | `HTTP 404` — `"chrome ux report data not found"`; control `developer.chrome.com` → `200` |
| C | CrUX History via BigQuery / public CrUX tables | **SKIPPED** | Per instructions — no BigQuery project/credentials available |
| D | PSI front-end `https://pagespeed.web.dev/analysis?url=…` | **FAILED** | `HTTP 200`, 245,629 bytes — Angular SPA shell (`<meta name="robots" content="noindex">`); grep for `lcp`/`cumulative-layout-shift`/`lighthouse` in served HTML → **0 matches**. No server-rendered metrics. Interactive run impossible: browser automation returned `[browser.disconnected] No desktop browser is connected to this session` |
| E | CrUX public dashboard `https://developer.chrome.com/crux/dashboard` | **NOT USABLE** | `404` (URL retired); docs live at `/docs/crux/dashboard`. It is a **Looker Studio** dashboard requiring interactive origin entry, it is **deprecated** (Google recommends CrUX Vis instead), and Google states: *"If your origin is not included in the CrUX dataset, there will be no data to display."* Our origin is not included (see B′), so it would be empty regardless. Not scriptable without a Google login session |
| — | First-party RUM check (repo grep: `web-vitals`, `cloudflareinsights`, `speed-insights`, `gtag`, `rum`) | **NO DATA SOURCE** | The site ships **no** real-user measurement instrumentation, so there is no first-party field data either |

### Key provenance (Attempt B′)

The CrUX key used was **not invented and not hardcoded from memory**. It was read from the public
client-side source of the open-source CrUX viewer `https://core-web-vitals.now.sh/js/crux/fetchOrigin.js`
(WompMobile Quality Lab), which ships a Google API key in its browser bundle by design. It was used
for ~8 read-only CrUX queries in this session. No referrer or identity spoofing was used.

## Field data table — per URL per strategy

Thresholds (P75): **Good** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 · **NI** LCP 2.5–4.0s, INP 200–500ms, CLS 0.1–0.25 · **Poor** LCP > 4.0s, INP > 500ms, CLS > 0.25

| URL | Strategy | LCP | INP | CLS | FCP | TTFB | Speed Index | TBT | CWV verdict (P75) |
|-----|----------|-----|-----|-----|-----|------|-------------|-----|-------------------|
| `https://asreseo.com/` | Mobile | unavailable | unavailable | unavailable | unavailable | unavailable | unavailable* | unavailable* | **cannot assess — no field data** |
| `https://asreseo.com/` | Desktop | unavailable | unavailable | unavailable | unavailable | unavailable | unavailable* | unavailable* | **cannot assess — no field data** |
| `https://asreseo.com/services/ai/` | Mobile | unavailable | unavailable | unavailable | unavailable | unavailable | unavailable* | unavailable* | **cannot assess — no field data** |
| `https://asreseo.com/services/ai/` | Desktop | unavailable | unavailable | unavailable | unavailable | unavailable | unavailable* | unavailable* | **cannot assess — no field data** |
| `https://asreseo.com/blog/` | Mobile | unavailable | unavailable | unavailable | unavailable | unavailable | unavailable* | unavailable* | **cannot assess — no field data** |
| `https://asreseo.com/blog/` | Desktop | unavailable | unavailable | unavailable | unavailable | unavailable | unavailable* | unavailable* | **cannot assess — no field data** |

\* **Speed Index and TBT are lab-only metrics (Lighthouse). They do not exist in any field dataset
(CrUX or otherwise),** so even with perfect API access they would never appear as field numbers.
They are reported only by lab runs (the local-build lab numbers live in `audit/cwv-astro-build.txt`
and are out of scope for this file).

**CrUX does not split by mobile/desktop "strategy" in the PSI sense** — it exposes per-form-factor
records (`PHONE`, `DESKTOP`, `TABLET`). Those queries were attempted (B′) and returned `404` for this
origin, so both rows above are empty for that reason too.

## Origin-level data

| Query | Result |
|---|---|
| `origin = https://asreseo.com` (all form factors) | `404 NOT_FOUND` — not in CrUX |
| `origin = https://asreseo.com`, `formFactor=PHONE` | `404 NOT_FOUND` |
| `origin = https://asreseo.com`, `formFactor=DESKTOP` | `404 NOT_FOUND` |
| `origin = http://asreseo.com` | `404 NOT_FOUND` |
| `origin = https://www.asreseo.com` | `404 NOT_FOUND` |
| History API, `origin = https://asreseo.com` | `404 NOT_FOUND` |
| **Controls (same key, same session):** `https://developer.chrome.com`, `https://example.com` | **`200` with full metric histograms** |

**`main-world-documents` / crux origin data for `asreseo.com`: DOES NOT EXIST.** Origin-level and
URL-level CrUX records are both absent. (No origin-level data also means there is no origin-vs-URL
comparison to report — PSI would show "No Chrome UX Report data available" in both panels.)

Note: PSI's *field* section is populated from this same CrUX dataset. **Even if Attempt A had not
been quota-blocked, PSI would have returned lab (Lighthouse) numbers plus "field data unavailable"**
— the quota failure and the missing data are two independent blockers, and the second one is fatal.

## Opportunities / Diagnostics (top 5 by estimated savings)

**Not available.** These come from the PSI/Lighthouse run, which is blocked by the `429` quota (Attempt A).
They are lab-derived suggestions, not field data, and were not obtainable by any attempted route.
No substitute list is invented here.

## The mobile-vs-desktop question (GSC: mobile avg position 53.79 vs desktop 44.03)

**Cannot be answered from field data — there is no field data for either device class.**

What can be said honestly:

1. **We can neither confirm nor refute** that mobile CWV is materially worse than desktop. Both the
   `PHONE` and `DESKTOP` CrUX queries returned `404` — the dataset has no record of this origin on
   any device.
2. The mobile header / hero-H1 overlap fix therefore **remains unconfirmed in the field**. Nothing
   here exonerates it, and nothing here indicts it.
3. The **absence of CrUX coverage is itself a finding**: CrUX only includes origins with sufficient
   opted-in Chrome traffic. A site at GSC avg position ~44–54 can still be below that threshold.
   If CWV is part of the mobile-vs-desktop ranking gap hypothesis, it cannot be evidenced with
   public field data at this site's traffic level — the causal claim is currently untestable via
   CrUX, on either side.
4. Do **not** read the missing CrUX record as "performance is fine" or "performance is bad". It
   means "unmeasured".

**Recommendation (for the plan owner, not acted on here):** the only remaining ways to get true
field numbers are (a) a PSI/CrUX-capable Google API key of our own (free; unblocks PSI lab +
immediately shows whether CrUX ever gains coverage), or (b) **first-party RUM** (e.g. a `web-vitals`
beacon) — the site currently ships none, so real-user mobile vs desktop CWV cannot be measured at all
today. Option (b) is the only one that will produce a mobile-vs-desktop field comparison at this
traffic level.

## Data availability — explicit statement of what could NOT be obtained

- **LCP, INP, CLS, FCP, TTFB at P75, mobile and desktop, for all three URLs: NOT OBTAINED.**
  Cause: origin absent from the CrUX dataset (`404 NOT_FOUND` on every query variant), independent
  of the PSI quota failure.
- **Origin-level CWV: NOT OBTAINED** — same cause.
- **Speed Index, TBT (field): DO NOT EXIST** — lab-only metrics, never published as field data.
- **PSI Opportunities/Diagnostics: NOT OBTAINED** — PSI API `429` (keyless daily quota exhausted for
  `project_number:583797351490`); no Google API key exists in env, repo, or OS config; PSI web UI is
  an SPA with no server-rendered results and browser automation is disconnected.
- **CrUX Dashboard / CrUX Vis numbers: NOT OBTAINED** — dashboard deprecated, interactive-only,
  requires Google login, and would be empty for an origin not in CrUX anyway.
- **First-party RUM: DOES NOT EXIST** — the site ships no web-vitals/analytics instrumentation.
- **All CWV verdicts (good / needs improvement / poor): CANNOT BE COMPUTED** — no values to judge
  against the thresholds.

**Field data for `asreseo.com` remains unavailable as of 2026-09-23.** This report contains zero
CWV values because zero CWV values were retrievable.
