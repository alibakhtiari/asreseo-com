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

  // Merged Consultation -> Contact Terminal
  '/consultation': '/contact/',
  '/consultation/': '/contact/',
};

/** A2A Agent Card manifest per A2A Protocol Specification */
const AGENT_CARD = {
  $schema: 'https://a2a-protocol.org/schemas/v1.0/agent-card.json',
  protocolVersion: '0.3.0',
  name: 'AsreSEO',
  version: '1.0.1',
  description:
    'Public agent interface and discovery card for AsreSEO — leading digital marketing and enterprise AI agency specializing in professional SEO, AI services, automated workflows, and MCP edge tools.',
  url: 'https://asreseo.com',
  preferredTransport: 'HTTP+JSON',
  provider: {
    organization: 'AsreSEO',
    url: 'https://asreseo.com/',
  },
  documentationUrl: 'https://asreseo.com/llms.txt',
  iconUrl: 'https://asreseo.com/Logo.svg',
  supportedInterfaces: [
    {
      url: 'https://asreseo.com',
      transport: 'HTTP+JSON',
      protocolBinding: 'HTTP+JSON',
      protocolVersion: '1.0',
    },
  ],
  additionalInterfaces: [
    {
      url: 'https://asreseo.com',
      transport: 'HTTP+JSON',
    },
  ],
  capabilities: {
    streaming: false,
    pushNotifications: false,
    stateTransitionHistory: false,
  },
  defaultInputModes: ['application/json', 'text/plain'],
  defaultOutputModes: ['application/json', 'text/plain'],
  skills: [
    {
      id: 'services-catalog',
      name: 'Service Catalog',
      description:
        'Discover AsreSEO core offerings across SEO (Technical & On-Page, Content & Page Authority, Local SEO), AI Services (Content Creation, Analysis & Strategy, Marketing & Engagement), Marketing & Google Ads, and SEO Web Design.',
      tags: ['services', 'seo', 'ai-services', 'digital-marketing', 'web-development'],
      examples: [
        'What services does AsreSEO offer?',
        'Tell me about AsreSEO technical SEO services',
        'How does AsreSEO implement AI content creation?',
      ],
    },
    {
      id: 'consultation-and-contact',
      name: 'Consultation & Contact Dispatch',
      description:
        'Submit inquiries for free website SEO audits, AI workflow assessments, custom digital marketing packages, and direct dispatch to AsreSEO specialists.',
      tags: ['consultation', 'audit', 'contact', 'quote'],
      examples: [
        'How can I book a free SEO consultation?',
        'What is the contact email for AsreSEO?',
        'Submit an inquiry for technical SEO audit',
      ],
    },
    {
      id: 'mcp-and-automation',
      name: 'MCP Gateway & Automation Infrastructure',
      description:
        'Query information about AsreSEO Command Center edge MCP gateway (32 tools for Claude/Cursor/Antigravity), self-hosted n8n automation cluster, and open-source community nodes.',
      tags: ['mcp', 'automation', 'n8n', 'ai-agents', 'telemetry'],
      examples: [
        'What MCP tools does AsreSEO support?',
        'Describe the AsreSEO n8n workflow cluster',
        'Where are open-source n8n nodes by Ali Bakhtiari?',
      ],
    },
    {
      id: 'portfolio-and-proof-of-work',
      name: 'Portfolio & Case Studies Archive',
      description:
        'Explore verified case studies and telemetry yields including programmatic SEO, sub-90ms edge TTFB optimization, and autonomous orphan URL recovery via IndexNow.',
      tags: ['portfolio', 'case-studies', 'results', 'proof-of-work'],
      examples: [
        'What results has AsreSEO achieved in SEO case studies?',
        'Tell me about the FinTech scaleup case study',
      ],
    },
  ],
};

/** RFC 9727 and RFC 9264 API Catalog Linkset */
const API_CATALOG = {
  linkset: [
    {
      anchor: 'https://asreseo.com/',
      'service-desc': [
        {
          href: 'https://asreseo.com/openapi.json',
          type: 'application/json',
          title: 'OpenAPI Specification',
        },
        {
          href: 'https://asreseo.com/api/send-email',
          type: 'application/json',
          title: 'Contact and Consultation Dispatch Endpoint',
        },
      ],
      'service-doc': [
        {
          href: 'https://asreseo.com/llms.txt',
          type: 'text/plain',
          title: 'LLM Context and Service Summary',
        },
        {
          href: 'https://asreseo.com/llms-full.txt',
          type: 'text/plain',
          title: 'Full LLM Documentation',
        },
      ],
      'service-meta': [
        {
          href: 'https://asreseo.com/.well-known/agent-card.json',
          type: 'application/json',
          title: 'A2A Agent Card',
        },
      ],
      describedby: [
        {
          href: 'https://asreseo.com/llms.txt',
          type: 'text/plain',
          title: 'Site and Agent Context',
        },
      ],
    },
  ],
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

    // 1b. A2A Agent Card endpoint (/.well-known/agent-card.json)
    if (url.pathname === '/.well-known/agent-card.json') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
      const headers = new Headers({
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
        Link:
          '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", ' +
          '</openapi.json>; rel="service-desc"; type="application/json", ' +
          '</llms.txt>; rel="service-doc"; type="text/plain"',
      });
      return new Response(
        request.method === 'HEAD' ? null : JSON.stringify(AGENT_CARD, null, 2),
        {
          status: 200,
          headers,
        },
      );
    }

    // 1c. RFC 9727 API Catalog endpoint (/.well-known/api-catalog and .json)
    if (
      url.pathname === '/.well-known/api-catalog' ||
      url.pathname === '/.well-known/api-catalog.json'
    ) {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
      const headers = new Headers({
        'Content-Type': 'application/linkset+json; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
        'X-Content-Type-Options': 'nosniff',
      });
      return new Response(
        request.method === 'HEAD' ? null : JSON.stringify(API_CATALOG, null, 2),
        {
          status: 200,
          headers,
        },
      );
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

    // 2b. Legacy path redirects: Any /fa/* request 301s to its equivalent
    // so legacy bookmarks and inbound links keep working instead of 404ing.
    if (url.pathname === '/fa' || url.pathname.startsWith('/fa/')) {
      const stripped =
        url.pathname === '/fa' ? '/' : url.pathname.replace(/^\/fa(?=\/)/, '');
      const destination = stripped === '' ? '/' : stripped;
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
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
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
    } else if (
      pathname === '/.well-known/agent-card.json' ||
      pathname === '/.well-known/api-catalog' ||
      pathname === '/.well-known/api-catalog.json' ||
      pathname === '/openapi.json'
    ) {
      headers.set('Cache-Control', 'public, max-age=86400');
    } else {
      headers.set('Cache-Control', 'public, max-age=3600');
    }

    // 6. Agent discovery Link response headers (RFC 8288, RFC 9727 Section 3)
    if (pathname === '/' || pathname === '/index.html') {
      headers.set(
        'Link',
        '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json", ' +
          '</openapi.json>; rel="service-desc"; type="application/json", ' +
          '</llms.txt>; rel="service-doc"; type="text/plain", ' +
          '</llms-full.txt>; rel="service-doc"; type="text/plain", ' +
          '</.well-known/agent-card.json>; rel="service-meta"; type="application/json", ' +
          '</llms.txt>; rel="describedby"; type="text/plain", ' +
          '</sitemap-index.xml>; rel="sitemap"; type="application/xml", ' +
          '</robots.txt>; rel="robots"; type="text/plain"',
      );
    } else if (pathname === '/openapi.json') {
      headers.set('Content-Type', 'application/json; charset=utf-8');
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
