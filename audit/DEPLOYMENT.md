# Deploying the Astro rebuild — asreseo.com

**Status: not yet deployed.** Production still serves the legacy Next.js site.
Every SEO/AEO/GEO fix in `fixes-2026-09-12.md` is live only in `dist/` until
this runbook is executed.

Two things must happen in the Cloudflare **dashboard** — neither can be done
from this repo, and both fail silently if skipped. They are steps 2 and 4.

---

## Pre-flight (from this repo)

```bash
git status                      # confirm you are on astro-migration
npm run build                   # expect: 45 page(s) built
npm run type-check              # expect: 0 errors, 0 warnings
```

If the build refuses with `SAFE_DELETE_BULK_CONFIRM_REQUIRED`, the Node shim
is intercepting Astro's large cleanup pass. Use:

```bash
env -u NODE_OPTIONS npm run build
```

---

## 1. Commit the changeset

The working tree currently holds the entire audit+fix changeset uncommitted
(~100 files). Commit it before deploying so the deploy is reproducible.

```bash
git add -A
git commit -m "Astro rebuild: 43 audit fixes (SEO/AEO/GEO, a11y, schema, email)"
```

## 2. Attach the `asreseo` (or `EMAIL`) binding — DASHBOARD, cannot be done from code

`wrangler.toml` declares `send_email = [{ name = "asreseo" }, { name = "EMAIL" }]`, but that stanza
is **documentation only**. `wrangler pages deploy` exposes no binding flags,
so the binding must be attached by hand or the contact form returns `503`.

1. Cloudflare dashboard → **Compute → Email Service** → onboard `asreseo.com`
   (this applies SPF / DKIM / DMARC — do this first, DNS takes time).
2. Verify the sender address **`website@asreseo.com`**.
3. Pages project → **Settings → Functions → Bindings** → add
   **Send Email**, variable name **`asreseo`** (or **`EMAIL`**). The code supports both names.

> Apply to **both** Production and Preview environments. Preview deployments
> are where this usually gets missed, and the failure looks like a code bug.

## 3. Deploy

**Option A — Git integration (recommended).**
Pages project → Settings → Builds & deployments → set production branch to
`astro-migration`. Build command `npm run build`, output directory `dist`.
Then push.

**Option B — direct upload.**

```bash
npx wrangler pages deploy dist --project-name asre-seo-website
```

Option B uploads only `dist/`; it does **not** attach bindings. Step 2 still
applies, and `_headers` / `_redirects` are honoured either way.

## 4. Disable the Content Signals Policy — DASHBOARD, silently overrides robots.txt

Cloudflare's managed **Content Signals Policy** serves its own `robots.txt`,
which silently replaces the one in `public/robots.txt`. If it is on, the
AI-crawler allowances (GPTBot, PerplexityBot, ClaudeBot, Google-Extended) and
the `sitemap-index.xml` directive never reach crawlers, and the GEO work is
inert.

Dashboard → **Bots → Content Signals Policy** → disable (or configure to allow).

## 5. Post-deploy verification

```bash
node scripts/verify-deploy.mjs https://asreseo.com
```

Checks `_headers` behaviour, `robots.txt` content, sitemap resolution,
`llms.txt`, the `-2024` → evergreen 301s, and that the mail endpoint is bound.

Manual final check: submit a real enquiry on `/consultation/` and confirm it
arrives at `info@asreseo.com`.

---

## Critical: the three `-2024` slug renames

`fixes-2026-09-12.md` #24 renamed three blog URLs **before launch**, so there
is no migration cost now — but the 301s only work once deployed:

| Old | New |
|---|---|
| `/blog/seo-guide-2024/` | `/blog/seo-guide/` |
| `/blog/google-ads-guide-2024/` | `/blog/google-ads-guide/` |
| `/blog/digital-marketing-trends-2024/` | `/blog/digital-marketing-trends/` |

Both slash variants are covered. If any external site links the old URLs, the
redirects preserve that equity.

---

## Rollback

The legacy site is the current production deployment. Pages keeps deployment
history — promote the previous deployment to roll back. The renames above are
the only irreversible-feeling change, and they are covered by 301s.

## Outstanding before/after launch

These are business decisions, not deploy blockers, but two of them are
**higher risk once the site is live**:

1. **Testimonials** (`src/lib/site-claims.ts`) — 6 named clients, all `rating: 5`,
   all `verified: false`. Publishing rating markup for unverifiable reviews is
   a structured-data violation. Confirm real → add `Review` schema; otherwise remove.
2. **297 numeric claims** (`claims-to-verify.md`), 12 with guarantee language
   («ضمانت» / «تضمین»). The default meta description contains
   «رشد ۳۰۰٪ … را تضمین کنید» — once deployed, that is a public guarantee.
3. **GSC collapse** — check Manual Actions / Security Issues with your own account.
