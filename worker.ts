import { onRequestPost } from './functions/api/send-email';

interface EmailBinding {
  send(message: {
    from: string;
    to: string;
    subject: string;
    replyTo?: string;
    text?: string;
    html?: string;
  }): Promise<unknown>;
}

export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  asreseo?: EmailBinding;
  EMAIL?: EmailBinding;
}

/**
 * Static redirect map covering legacy routes, backwards compatibility,
 * and service consolidations from public/_redirects.
 */
const REDIRECT_MAP: Record<string, string> = {
  // Legacy /home route
  '/home': '/',
  '/home/': '/',

  // Sitemap backward compatibility (Next.js -> Astro)
  '/sitemap.xml': '/sitemap-index.xml',

  // Legacy service worker cleanup
  '/sw.js/': '/sw.js',

  // Evergreen blog slugs (with and without trailing slash)
  '/blog/seo-guide-2024': '/blog/seo-guide/',
  '/blog/seo-guide-2024/': '/blog/seo-guide/',
  '/blog/google-ads-guide-2024': '/blog/google-ads-guide/',
  '/blog/google-ads-guide-2024/': '/blog/google-ads-guide/',
  '/blog/digital-marketing-trends-2024': '/blog/digital-marketing-trends/',
  '/blog/digital-marketing-trends-2024/': '/blog/digital-marketing-trends/',

  // Single-hop for the renamed "-2024" posts: /blog/post/<slug>-2024 must land
  // on the evergreen URL directly instead of chaining through
  // /blog/<slug>-2024/ (which then redirects again — 2-hop chain, audit §1 T5).
  // Mirrors the static rules above the /blog/post/:slug placeholder in
  // public/_redirects, which this host evaluates before the Worker anyway.
  '/blog/post/seo-guide-2024': '/blog/seo-guide/',
  '/blog/post/seo-guide-2024/': '/blog/seo-guide/',
  '/blog/post/google-ads-guide-2024': '/blog/google-ads-guide/',
  '/blog/post/google-ads-guide-2024/': '/blog/google-ads-guide/',
  '/blog/post/digital-marketing-trends-2024': '/blog/digital-marketing-trends/',
  '/blog/post/digital-marketing-trends-2024/': '/blog/digital-marketing-trends/',

  // Merged AI Services (all 301 to trailing slash, with and without trailing slash)
  '/services/ai/auto-content-generation': '/services/ai/content-creation/',
  '/services/ai/auto-content-generation/': '/services/ai/content-creation/',
  '/services/ai/ai-video-generation': '/services/ai/content-creation/',
  '/services/ai/ai-video-generation/': '/services/ai/content-creation/',
  '/services/ai/marketing-automation': '/services/ai/marketing-engagement/',
  '/services/ai/marketing-automation/': '/services/ai/marketing-engagement/',
  '/services/ai/persian-chatbot': '/services/ai/marketing-engagement/',
  '/services/ai/persian-chatbot/': '/services/ai/marketing-engagement/',
  '/services/ai/content-personalization': '/services/ai/marketing-engagement/',
  '/services/ai/content-personalization/': '/services/ai/marketing-engagement/',
  '/services/ai/smart-seo': '/services/ai/analysis-strategy/',
  '/services/ai/smart-seo/': '/services/ai/analysis-strategy/',
  '/services/ai/conversion-optimization': '/services/ai/analysis-strategy/',
  '/services/ai/conversion-optimization/': '/services/ai/analysis-strategy/',
  '/services/ai/user-behavior-analysis': '/services/ai/analysis-strategy/',
  '/services/ai/user-behavior-analysis/': '/services/ai/analysis-strategy/',
  '/services/ai/brand-monitoring': '/services/ai/analysis-strategy/',
  '/services/ai/brand-monitoring/': '/services/ai/analysis-strategy/',
  '/services/ai/ai-consulting': '/services/ai/analysis-strategy/',
  '/services/ai/ai-consulting/': '/services/ai/analysis-strategy/',

  // Merged SEO Services (all 301 to trailing slash, with and without trailing slash)
  '/services/seo/website-seo': '/services/seo/technical-onpage/',
  '/services/seo/website-seo/': '/services/seo/technical-onpage/',
  '/services/seo/technical-seo': '/services/seo/technical-onpage/',
  '/services/seo/technical-seo/': '/services/seo/technical-onpage/',
  '/services/seo/content-seo': '/services/seo/content-authority/',
  '/services/seo/content-seo/': '/services/seo/content-authority/',
  '/services/seo/link-building': '/services/seo/content-authority/',
  '/services/seo/link-building/': '/services/seo/content-authority/',
  '/services/seo/analysis': '/services/seo/technical-onpage/',
  '/services/seo/analysis/': '/services/seo/technical-onpage/',
  '/services/seo/training': '/services/seo/',
  '/services/seo/training/': '/services/seo/',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Contact / consultation form endpoint
    if (url.pathname === '/api/send-email') {
      if (request.method === 'POST') {
        return onRequestPost({ request, env });
      }
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    // 2. Static redirect matching
    if (Object.prototype.hasOwnProperty.call(REDIRECT_MAP, url.pathname)) {
      const destination = REDIRECT_MAP[url.pathname];
      const redirectUrl = new URL(destination, request.url);
      if (url.search) {
        redirectUrl.search = url.search;
      }
      return Response.redirect(redirectUrl.toString(), 301);
    }

    // 3. Dynamic blog post redirects (/blog/post/:slug -> /blog/:slug/)
    if (url.pathname.startsWith('/blog/post/')) {
      const slug = url.pathname.slice('/blog/post/'.length).replace(/\/+$/, '');
      if (slug) {
        const destination = REDIRECT_MAP[`/blog/${slug}`] || REDIRECT_MAP[`/blog/${slug}/`] || `/blog/${slug}/`;
        const redirectUrl = new URL(destination, request.url);
        if (url.search) {
          redirectUrl.search = url.search;
        }
        return Response.redirect(redirectUrl.toString(), 301);
      }
    }

    // 4. Fetch static asset from Workers Static Assets binding
    const response = await env.ASSETS.fetch(request);

    // 5. Inject security and caching headers
    const headers = new Headers(response.headers);

    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Keep HSTS/CSP byte-identical with public/_headers: _headers only covers
    // static-asset hits, this block covers Worker-generated responses (404s).
    // CSP script/style 'unsafe-inline' is a BASELINE — the build emits ~9
    // distinct executable inline scripts (header, mega-menu, back-to-top,
    // accordions, share buttons) whose bodies are minified build output, so
    // their sha256 hashes cannot be pinned without running a build. Harden
    // after the next build by hashing every non-ld+json <script> body in
    // dist/**/*.html and replacing 'unsafe-inline' here and in _headers.
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
    );

    // Cache-Control policy
    const pathname = url.pathname;
    if (
      pathname.startsWith('/_astro/') ||
      /\.(?:png|jpe?g|gif|webp|avif|svg|ico|woff2?)$/i.test(pathname)
    ) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (
      pathname === '/robots.txt' ||
      pathname === '/sitemap-index.xml' ||
      pathname.endsWith('.xml')
    ) {
      headers.set('Cache-Control', 'public, max-age=86400');
    } else {
      headers.set('Cache-Control', 'public, max-age=3600');
    }

    const body =
      request.method === 'HEAD' ||
      response.status === 101 ||
      response.status === 204 ||
      response.status === 205 ||
      response.status === 304
        ? null
        : response.body;

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
