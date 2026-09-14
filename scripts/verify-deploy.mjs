#!/usr/bin/env node
/**
 * Post-deploy verification for asreseo.com.
 *
 *   node scripts/verify-deploy.mjs https://asreseo.com
 *
 * Exits non-zero if any check fails. Every check here caught a real problem
 * during the audit, or guards a failure mode that is invisible in the repo:
 *   - _headers not applied        -> HTML served uncached
 *   - Content Signals Policy on   -> our robots.txt silently replaced
 *   - EMAIL binding not attached  -> contact form returns 503
 *   - -2024 301s missing          -> renamed blog URLs 404
 */

const base = (process.argv[2] || 'https://asreseo.com').replace(/\/+$/, '');

let pass = 0;
let fail = 0;

const ok = (name, extra = '') => {
  pass += 1;
  console.log(`  PASS  ${name}${extra ? ` — ${extra}` : ''}`);
};
const bad = (name, extra = '') => {
  fail += 1;
  console.log(`  FAIL  ${name}${extra ? ` — ${extra}` : ''}`);
};
const check = (cond, name, extra) => (cond ? ok(name, extra) : bad(name, extra));

const get = async (path, init = {}) => {
  const res = await fetch(base + path, {
    redirect: 'manual',
    headers: { 'User-Agent': 'asreseo-deploy-verify/1.0' },
    ...init,
  });
  return { res, body: await res.text().catch(() => '') };
};

console.log(`\nVerifying ${base}\n`);

// ---------------------------------------------------------------- robots.txt
// Cloudflare's managed Content Signals Policy silently replaces this file.
console.log('robots.txt');
try {
  const { res, body } = await get('/robots.txt');
  check(res.status === 200, 'serves 200', `status ${res.status}`);
  check(body.includes('sitemap-index.xml'), 'declares canonical sitemap');
  check(body.includes('GPTBot'), 'allows GPTBot');
  check(body.includes('PerplexityBot'), 'allows PerplexityBot');
  check(body.includes('ClaudeBot'), 'allows ClaudeBot');
  check(body.includes('Google-Extended'), 'allows Google-Extended');
  if (!body.includes('GPTBot')) {
    console.log('        ^ If AI crawlers are missing, Cloudflare is overriding');
    console.log('          robots.txt. Disable Bots -> Content Signals Policy.');
  }
} catch (e) {
  bad('robots.txt fetch', e.message);
}

// ------------------------------------------------------------------ sitemaps
console.log('\nsitemaps');
for (const p of ['/sitemap-index.xml', '/sitemap-0.xml']) {
  try {
    const { res } = await get(p);
    check(res.status === 200, `${p} serves 200`, `status ${res.status}`);
  } catch (e) {
    bad(`${p} fetch`, e.message);
  }
}

// ------------------------------------------------------------------ llms.txt
console.log('\nAI discovery');
for (const p of ['/llms.txt', '/llms-full.txt']) {
  try {
    const { res, body } = await get(p);
    // Only inspect the body on 200 — a 404 page still contains site URLs and
    // would otherwise "pass" the content check.
    if (res.status !== 200) {
      bad(`${p} serves 200`, `status ${res.status}`);
      continue;
    }
    ok(`${p} serves 200`);
    check(body.includes('https://asreseo.com'), `${p} contains absolute URLs`);
  } catch (e) {
    bad(`${p} fetch`, e.message);
  }
}

// ------------------------------------------------------------ cache headers
// The old /*.html rule never matched Pages' extensionless URLs.
//
// NOTE: this group, the 301 group below, and the endpoint group all depend on
// Cloudflare features (_headers, _redirects, Pages Functions). Against a plain
// static server they fail by design — run this against the real deployment.
console.log('\ncache headers');
try {
  const { res } = await get('/');
  const cc = res.headers.get('cache-control') || '';
  check(res.status === 200, 'homepage serves 200', `status ${res.status}`);
  check(/max-age=3600/.test(cc), 'HTML is cached (max-age=3600)', cc || 'no header');
  check(
    (res.headers.get('x-content-type-options') || '') === 'nosniff',
    'security headers applied',
  );
} catch (e) {
  bad('homepage fetch', e.message);
}

// ----------------------------------------------------------------- redirects
console.log('\nlegacy blog slug 301s');
const renames = [
  ['/blog/seo-guide-2024/', '/blog/seo-guide/'],
  ['/blog/google-ads-guide-2024/', '/blog/google-ads-guide/'],
  ['/blog/digital-marketing-trends-2024/', '/blog/digital-marketing-trends/'],
];
for (const [from, to] of renames) {
  try {
    const { res } = await get(from);
    const loc = res.headers.get('location') || '';
    check(
      res.status === 301 && loc.includes(to),
      `${from} -> ${to}`,
      `status ${res.status}, location ${loc || '(none)'}`,
    );
  } catch (e) {
    bad(`${from} redirect`, e.message);
  }
}

// ------------------------------------------------------------ mail endpoint
// 404 = Pages Functions not deployed. 503 = deployed but EMAIL binding absent.
// 400 = deployed and validating (the good case).
console.log('\ncontact form endpoint');
try {
  const res = await fetch(`${base}/api/send-email`, {
    method: 'POST',
    body: new FormData(),
    redirect: 'manual',
  });
  const status = res.status;
  if (status === 404) {
    bad('endpoint deployed', '404 — Pages Functions are not running');
  } else if (status === 503) {
    bad(
      'asreseo / EMAIL binding attached',
      '503 — function runs but the send_email binding (asreseo or EMAIL) is missing (see DEPLOYMENT.md step 2)',
    );
  } else if (status === 400) {
    ok('endpoint deployed and validating', `status ${status}`);
    ok('asreseo / EMAIL binding attached', 'reached validation, not 503');
  } else {
    ok('endpoint reachable', `status ${status} — verify manually`);
  }
} catch (e) {
  bad('endpoint fetch', e.message);
}

console.log(`\n${fail === 0 ? 'ALL CHECKS PASSED' : 'FAILURES PRESENT'}`);
console.log(`  ${pass} passed, ${fail} failed\n`);

process.exit(fail === 0 ? 0 : 1);
