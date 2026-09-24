#!/usr/bin/env node
/**
 * Post-deploy verification for asreseo.com.
 *
 *   node scripts/verify-deploy.mjs https://asreseo.com
 *
 * Exits non-zero if any check fails. Every check here caught a real problem
 * during the audit, or guards a failure mode that is invisible in the repo:
 *   - _headers not applied        -> HTML served uncached
 *   - Cache-Control duplicated    -> TTL silently truncated to first value
 *   - HSTS / CSP absent           -> transport + baseline CSP missing
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
  const rcc = res.headers.get('cache-control') || '';
  check(
    rcc === 'public, max-age=86400',
    'serves exactly one Cache-Control (public, max-age=86400)',
    rcc || 'no header',
  );
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
  check(
    cc === 'public, max-age=3600',
    'HTML cached with exactly one Cache-Control (max-age=3600)',
    cc || 'no header',
  );
  check(
    (res.headers.get('x-content-type-options') || '') === 'nosniff',
    'security headers applied',
  );
  const hsts = res.headers.get('strict-transport-security') || '';
  check(
    hsts === 'max-age=31536000; includeSubDomains; preload',
    'HSTS present',
    hsts || '(missing)',
  );
  const csp = res.headers.get('content-security-policy') || '';
  check(
    csp.includes("default-src 'self'") && csp.includes("frame-ancestors 'none'"),
    'CSP present with baseline directives',
    csp ? 'applied' : '(missing)',
  );
  // Asset rules in public/_headers detach + re-set Cache-Control ("! Cache-Control").
  // A joined value here means the detach stopped working and TTLs truncate again.
  const { res: fav } = await get('/favicon.ico');
  const fcc = fav.headers.get('cache-control') || '';
  check(
    fcc === 'public, max-age=31536000, immutable',
    'asset cached with exactly one Cache-Control (immutable 1y)',
    fcc || 'no header',
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
  // Single-hop: /blog/post/<slug>-2024 must land on the evergreen URL in ONE
  // 301 (a Location of /blog/<slug>-2024/ means the 2-hop chain is back).
  ['/blog/post/seo-guide-2024', '/blog/seo-guide/'],
  ['/blog/post/seo-guide-2024/', '/blog/seo-guide/'],
  ['/blog/post/google-ads-guide-2024', '/blog/google-ads-guide/'],
  ['/blog/post/google-ads-guide-2024/', '/blog/google-ads-guide/'],
  ['/blog/post/digital-marketing-trends-2024', '/blog/digital-marketing-trends/'],
  ['/blog/post/digital-marketing-trends-2024/', '/blog/digital-marketing-trends/'],
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

// ---------------------------------------------------------------- og:image
// Two defects this guards, both of which were live on this site:
//   - a `.webp` served as og:image      -> X/LinkedIn/Telegram parse it
//     inconsistently and the card silently disappears
//   - `1200x630` declared over a 1024x1024 file -> every platform crops or
//     letterboxes against metadata that was never true
// Dimensions are read from the image bytes, never trusted from the meta tag.
console.log('\nog:image');

const imageDims = (buf) => {
  // PNG: IHDR width/height sit at fixed offsets.
  if (buf.length > 24 && buf[0] === 0x89 && buf[1] === 0x50) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), type: 'png' };
  }
  // JPEG: walk the segments to the SOF marker that carries frame dimensions.
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      // SOF0-SOF15 minus DHT(c4), JPG(c8) and DAC(cc), which carry no frame.
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5), type: 'jpeg' };
      }
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
        i += 2;
        continue;
      }
      const len = buf.readUInt16BE(i + 2);
      if (len < 2) break;
      i += 2 + len;
    }
  }
  return null;
};

// One probe per card class: the brand default, a 2x2 category montage, a
// cover-cropped wide hero, the blog hub, and a service detail page.
const ogProbe = [
  ['/', '/og-default.png'],
  ['/services/web/', '/og/services-web.jpg'],
  ['/services/seo/', '/og/seo-service-hero.jpg'],
  ['/blog/', '/og/blog-hero.jpg'],
  ['/services/content/content-calendar/', '/og/content-calendar-hero.jpg'],
];

for (const [page, expected] of ogProbe) {
  try {
    const { res, body } = await get(page);
    if (res.status !== 200) {
      bad(`${page} og probe`, `status ${res.status}`);
      continue;
    }
    const og = body.match(/<meta property="og:image" content="([^"]+)"/);
    if (!og) {
      bad(`${page} og:image present`);
      continue;
    }
    check(og[1].endsWith(expected), `${page} og:image target`, og[1].replace(base, ''));

    const dw = body.match(/<meta property="og:image:width" content="(\d+)"/);
    const dh = body.match(/<meta property="og:image:height" content="(\d+)"/);

    const imgRes = await fetch(og[1], {
      headers: { 'User-Agent': 'asreseo-deploy-verify/1.0' },
    });
    check(imgRes.status === 200, `${page} og:image fetchable`, `status ${imgRes.status}`);
    if (imgRes.status !== 200) continue;

    const dims = imageDims(Buffer.from(await imgRes.arrayBuffer()));
    if (!dims) {
      bad(`${page} og:image decodable`, 'not a PNG or JPEG');
      continue;
    }
    check(dims.w === 1200 && dims.h === 630, `${page} true og dimensions`, `${dims.w}x${dims.h}`);
    check(dims.type !== 'webp', `${page} og format is not webp`, dims.type);
    if (dw && dh) {
      check(
        Number(dw[1]) === dims.w && Number(dh[1]) === dims.h,
        `${page} declared og dimensions match the file`,
        `${dw[1]}x${dh[1]} declared vs ${dims.w}x${dims.h} real`,
      );
    } else {
      bad(`${page} declared og dimensions`, 'og:image:width/height missing');
    }
  } catch (e) {
    bad(`${page} og probe`, e.message);
  }
}

// ------------------------------------------------------- JSON-LD integrity
// Three defects this guards, all live on this site during the audit:
//   - Service nodes with no url/image/inLanguage/@id -> entity unresolvable;
//     `@id` is what ties a Service to its provider during entity resolution
//   - `areaServed` written four ways ('IR', 'Iran', {Country}, 'Worldwide')
//     -> one fact aggregated as four
//   - two components emitting Services on one page minting identical `@id`s
//     -> the same entity described twice with different properties
// P2.7 is re-asserted here on every block: an earlier ad-hoc check matched
// only 73 of the 141 blocks because 68 put `id=` before `type=`.
console.log('\nJSON-LD integrity');

const jsonLdBlocks = (html) => {
  const out = [];
  const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    if (!m[1].includes('ld+json')) continue;
    try {
      out.push({ data: JSON.parse(m[2]) });
    } catch (e) {
      out.push({ error: e.message });
    }
  }
  return out;
};

const walkLd = (node, fn) => {
  if (Array.isArray(node)) {
    for (const child of node) walkLd(child, fn);
  } else if (node && typeof node === 'object') {
    fn(node);
    for (const value of Object.values(node)) walkLd(value, fn);
  }
};

const AREA_TYPES = ['Country', 'Place', 'City', 'AdministrativeArea', 'GeoCoordinates'];
const SERVICE_FIELDS = ['url', 'image', 'inLanguage', '@id'];

const jsonLdProbe = [
  '/', // two components emit Services here — the @id collision case
  '/services/seo/',
  '/services/ai/', // money page
  '/consultation/', // this page's areaServed was the string 'IR'
  '/services/content/translation/', // the only 'Worldwide' node
  '/blog/geo-ai-citations/',
];

for (const page of jsonLdProbe) {
  try {
    const { res, body } = await get(page);
    if (res.status !== 200) {
      bad(`${page} JSON-LD probe`, `status ${res.status}`);
      continue;
    }
    const blocks = jsonLdBlocks(body);
    check(blocks.length > 0, `${page} emits JSON-LD`, `${blocks.length} blocks`);

    const unparsed = blocks.filter((b) => b.error);
    check(
      unparsed.length === 0,
      `${page} every JSON-LD block parses`,
      unparsed[0]?.error || `${blocks.length} parsed`,
    );

    const services = [];
    const ids = new Map();
    let badArea = 0;
    let incomplete = 0;
    let blogWithPosition = 0;
    for (const b of blocks) {
      if (!b.data) continue;
      walkLd(b.data, (n) => {
        if (n['@type'] === 'Service') {
          services.push(n);
          if (!SERVICE_FIELDS.every((k) => typeof n[k] === 'string' && n[k].length > 0)) incomplete += 1;
          const a = n['areaServed'];
          if (!a || typeof a !== 'object' || !AREA_TYPES.includes(a['@type'])) badArea += 1;
          if (typeof n['@id'] === 'string') ids.set(n['@id'], (ids.get(n['@id']) || 0) + 1);
        }
        if (n['@type'] === 'BlogPosting' && Object.prototype.hasOwnProperty.call(n, 'position')) {
          blogWithPosition += 1;
        }
      });
    }

    if (services.length > 0) {
      check(
        incomplete === 0,
        `${page} Service nodes carry url/image/inLanguage/@id`,
        `${services.length} nodes, ${incomplete} incomplete`,
      );
      check(
        badArea === 0,
        `${page} Service areaServed is a typed node`,
        badArea ? `${badArea} raw string or absent` : `${services.length} Country/Place`,
      );
      const dups = [...ids].filter(([, count]) => count > 1);
      check(
        dups.length === 0,
        `${page} Service @ids unique on the page`,
        dups.length ? JSON.stringify(dups) : `${ids.size} unique`,
      );
    }
    if (page.startsWith('/blog/')) {
      check(blogWithPosition === 0, `${page} no BlogPosting+position (P2.7)`, `${blogWithPosition} found`);
    }
  } catch (e) {
    bad(`${page} JSON-LD probe`, e.message);
  }
}

// ---------------------------------------------------- LCP image priority
// Audit item 2.18: zero `fetchpriority` attributes in the whole build, while
// each page's single eager image is its LCP candidate by construction.
console.log('\nimage priority');

const imgProbe = ['/', '/services/seo/', '/services/ai/', '/services/', '/blog/geo-ai-citations/', '/about/'];

for (const page of imgProbe) {
  try {
    const { res, body } = await get(page);
    if (res.status !== 200) {
      bad(`${page} image probe`, `status ${res.status}`);
      continue;
    }
    const imgs = body.match(/<img[^>]*>/g) || [];
    const eager = imgs.filter((i) => i.includes('loading="eager"'));
    const lazy = imgs.filter((i) => i.includes('loading="lazy"'));
    const high = imgs.filter((i) => i.includes('fetchpriority="high"'));
    const highOnLazy = high.filter((i) => i.includes('loading="lazy"'));
    const eagerNoDims = eager.filter((i) => !(i.includes('width=') && i.includes('height=')));

    check(
      high.length === eager.length,
      `${page} every eager image is fetchpriority=high`,
      `eager ${eager.length}, high ${high.length}`,
    );
    check(
      highOnLazy.length === 0,
      `${page} no lazy image is fetchpriority=high`,
      highOnLazy.length ? `${highOnLazy.length} wrong` : `0 of ${lazy.length} lazy`,
    );
    check(
      eagerNoDims.length === 0,
      `${page} eager images declare width+height`,
      eagerNoDims.length ? `${eagerNoDims.length} unsized` : `${eager.length} sized`,
    );
  } catch (e) {
    bad(`${page} image probe`, e.message);
  }
}

console.log(`\n${fail === 0 ? 'ALL CHECKS PASSED' : 'FAILURES PRESENT'}`);
console.log(`  ${pass} passed, ${fail} failed\n`);

process.exit(fail === 0 ? 0 : 1);
