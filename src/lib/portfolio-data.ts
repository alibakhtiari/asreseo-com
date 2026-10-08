export interface PortfolioProject {
  slug: string;
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  client: string;
  category: string;
  categorySlug: 'ai-mcp' | 'edge-cms' | 'fintech' | 'saas' | 'ecommerce';
  featured: boolean;
  repoUrl?: string;
  liveUrl?: string;
  showcaseUrl?: string;
  isPrivateRepo?: boolean;
  challenge: string;
  solution: string;
  architecture: string[];
  results: string[];
  metrics: Array<{ label: string; value: string }>;
  telemetry: {
    crawlVelocity?: string;
    indexingWindow?: string;
    citationIndex?: string;
    riskScore?: string;
    edgeLatency?: string;
    toolsCount?: string;
    cpuTime?: string;
  };
  techStack: string[];
  keyFeatures: Array<{ title: string; description: string }>;
  deliverables: string[];
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: 'asreseo-command-center',
    tag: 'PROJECT_01 // AGENTIC_MCP_GATEWAY',
    badge: 'INTERNAL_PLATFORM',
    title: 'Asre SEO Command Center & MCP Gateway',
    subtitle: 'Unified SEO Intelligence Platform & 32 Model Context Protocol (MCP) Tools on Cloudflare Workers',
    client: 'AsreSEO Core Engineering Infrastructure',
    category: 'AI Intelligence & MCP Gateway',
    categorySlug: 'ai-mcp',
    featured: true,
    repoUrl: 'https://github.com/alibakhtiari/asreseo-command-center',
    liveUrl: 'https://mcp.asreseo.com',
    showcaseUrl: 'https://mcp.asreseo.com/showcase',
    isPrivateRepo: true,
    challenge:
      'Traditional enterprise SEO tools isolate search signals (GSC, GA4, Bing Webmaster, CrUX, PageSpeed) in disparate proprietary dashboards with manual clicks, zero AI-agent interoperability, and rate-limited CSV exports.',
    solution:
      'Architected an edge-native SEO Intelligence Platform and Model Context Protocol (MCP) Gateway on Cloudflare Workers. Connects Google OAuth token caching in KV, automated D1 SQL snapshot warehousing, striking distance classifiers, content decay detectors, and exposes 32 unified MCP tools via stdio and WebMCP JSON-RPC 2.0 to AI agents (Claude, Cursor, Antigravity).',
    architecture: [
      'Cloudflare Workers Edge API Gateway (122 proxy endpoints)',
      'Astro 7 + React 19 + Tailwind v4 + shadcn/ui Dashboard with 9 Feature Tabs',
      'Unified Stdio & WebMCP JSON-RPC 2.0 Protocol Handlers',
      'Automated Daily GSC/GA4 Cron Ingestion with D1 Data Warehouse & KV Caching',
      'Gemini AI Contextual Insights & A4 Executive PDF Export Engine',
    ],
    results: [
      '32 Autonomous MCP Tools deployed for Claude, Cursor, and Antigravity agents',
      '122 Edge API proxy endpoints operating at sub-20ms global latency',
      '100% elimination of third-party SaaS dashboard recurring licensing costs',
      'Continuous daily ingestion of 500,000+ organic search queries into Cloudflare D1',
    ],
    metrics: [
      { label: 'Agent Tools', value: '32 MCP' },
      { label: 'Edge Endpoints', value: '122 API' },
      { label: 'Gateway Latency', value: 'sub-20ms' },
      { label: 'Dash Tabs', value: '9 Suites' },
    ],
    telemetry: {
      crawlVelocity: 'Sub-20ms JSON-RPC',
      indexingWindow: 'Daily Automated Cron',
      citationIndex: '100% Edge Grounded',
      riskScore: 'Zero Data Leaks (KV Bound)',
      edgeLatency: '< 20ms',
      toolsCount: '32 Tools',
    },
    techStack: [
      'Cloudflare Workers',
      'Astro 7',
      'React 19',
      'Tailwind CSS v4',
      'TypeScript',
      'Cloudflare D1 SQL',
      'Cloudflare KV',
      'Google Search Console API',
      'Google Analytics Data API (GA4)',
      'Model Context Protocol (MCP)',
    ],
    keyFeatures: [
      {
        title: '32 Unified MCP Tools',
        description:
          'Native integration enabling AI agents (Claude, Cursor, Antigravity) to query live rankings, inspect cannibalization, test Schema.org, and audit PageSpeed via standard tools.',
      },
      {
        title: 'WebMCP Gateway (/webmcp)',
        description:
          'JSON-RPC 2.0 HTTP POST remote MCP execution endpoint with token authorization, bypassing local process execution for browser and serverless agents.',
      },
      {
        title: 'Algorithmic Opportunity Engine',
        description:
          'Striking distance keyword identification (ranks 4-20 with high CTR potential), query intent classification, and content decay detection.',
      },
      {
        title: 'Executive PDF Reporting',
        description:
          'Automated client-facing A4 summaries with visual delta metrics, CrUX performance distribution, and strategic next steps.',
      },
    ],
    deliverables: [
      'Live edge dashboard deployment at mcp.asreseo.com',
      'Interactive public showcase & mock data sandbox at mcp.asreseo.com/showcase',
      'Stdio MCP server package for Claude Desktop & Cursor',
      'D1 SQL data warehouse schema and cron ingestion scripts',
      'Enterprise Google OAuth 2.0 flow with automated token refresh',
    ],
  },
  {
    slug: 'emdash-seo',
    tag: 'PROJECT_02 // OPEN_SOURCE_PLUGIN',
    badge: 'PUBLIC_RELEASES',
    title: 'WebABC SEO Suite — Native Astro & EmDash CMS Plugin',
    subtitle: 'In-Process Edge SEO, Generative Search (GEO), AEO, and Readability Engine for Cloudflare Workers',
    client: 'Open Source Community & Enterprise Astro Publishers',
    category: 'Edge CMS Plugin & GEO/AEO Engine',
    categorySlug: 'edge-cms',
    featured: true,
    repoUrl: 'https://github.com/alibakhtiari/emdash-seo',
    isPrivateRepo: false,
    challenge:
      'CMS plugins traditionally depend on heavy PHP runtimes or complex multi-tenant worker loaders that blow past Cloudflare Workers Free Tier CPU limits (10ms) and cause severe TTFB regressions.',
    solution:
      'Engineered an in-process native plugin (@emdash/plugin-seo / webabcSeoPlugin) for Astro and EmDash CMS. Runs under 10ms CPU constraints with zero subscription dependencies. Features Hemingway-style readability color-scoring, live SERP/social previews, automated Schema.org entity inference, alt-image accessibility auditing, fuzzy 301 redirects, and dynamic edge-rendered /llms.txt knowledge bases.',
    architecture: [
      'In-Process Native Astro Plugin Architecture (Zero Worker Loader Dependency)',
      'Levenshtein & Jaccard Algorithmic Fuzzy 301 Redirect Remediation',
      'Dynamic Schema.org Inference Engine (inferSchemaType) with Manual Overrides',
      'Flesch Reading Ease & Passive Voice Live Analysis Studio',
      'Dynamic Edge-Rendered /llms.txt and /llms-full.txt Endpoints',
    ],
    results: [
      '< 10ms edge CPU execution time verified on Cloudflare Workers Free Tier',
      '100% automated WordPress SEO data migration (Rank Math Pro, Yoast, AIOSEO)',
      'Sub-second fuzzy redirect matching eliminating 404 crawl budget penalties',
      'Full typed SVG icon library with strict 500-line modular code standard',
    ],
    metrics: [
      { label: 'Edge CPU', value: '< 10ms' },
      { label: 'Worker Tier', value: 'Free & Paid' },
      { label: 'Redirect Logic', value: 'Lev-Jaccard' },
      { label: 'AI Endpoints', value: 'llms.txt Live' },
    ],
    telemetry: {
      crawlVelocity: 'Instantaneous In-Process',
      indexingWindow: 'Real-Time Edge Hook',
      citationIndex: 'Direct AEO Extraction',
      riskScore: 'Zero Hydration Penalty',
      edgeLatency: '< 5ms',
      cpuTime: '< 10ms',
    },
    techStack: [
      'Astro 7',
      'EmDash CMS',
      'TypeScript',
      'Cloudflare Workers',
      'Schema.org Graph Engine',
      'Levenshtein & Jaccard Matching',
      'Flesch-Kincaid Readability',
      'Vitest',
    ],
    keyFeatures: [
      {
        title: 'Unified Admin Hub',
        description:
          'Consolidated under a single WebABC SEO menu item in EmDash with clean tabs: SEO Settings, SERP/Social Preview, Readability Checker, Alt Image Auditor, and Fuzzy 301 Redirects.',
      },
      {
        title: 'GEO & AEO Citation Readiness',
        description:
          'Scores lead paragraphs, definition blocks, structured bullet lists, and summary tables for direct extraction by ChatGPT, Perplexity, and Google AI Overviews.',
      },
      {
        title: 'Fuzzy 301 Redirect Matching',
        description:
          'Calculates combined Levenshtein distance and Jaccard token similarity across published slugs to automatically rescue broken or dead URLs.',
      },
      {
        title: 'Dynamic /llms.txt Generator',
        description:
          'Generates clean markdown entity specifications and full corpus summaries on-the-fly at the edge without manual disk maintenance.',
      },
    ],
    deliverables: [
      'Published open-source repository at github.com/alibakhtiari/emdash-seo',
      'Automated WordPress migration scripts for Yoast, Rank Math, and AIOSEO',
      'Comprehensive test suite in vitest covering edge schema and fuzzy matching',
      'Drop-in Astro config integration (webabcSeoPlugin)',
    ],
  },
  {
    slug: 'fintech-scaleup',
    tag: 'DOSSIER_01 // FINTECH_SCALEUP',
    badge: 'VERIFIED_CLIENT',
    title: 'From Unnoticed to #1 Perplexity & Google AI Overview Source',
    subtitle: 'Series C Decentralized Banking Protocol ($45M Raised)',
    client: 'Series C Decentralized Banking Protocol ($45M Raised)',
    category: 'Generative Search & Knowledge Graph',
    categorySlug: 'fintech',
    featured: true,
    challenge:
      'Trapped behind legacy banking incumbent content farms. 0% generative AI search citations, zero Google SGE visibility on core cross-border payment queries, and $150k/month wasted on traditional agency retainers.',
    solution:
      'Deployed 4,200 programmatic semantic nodes, structured high-density entity schemas, and injected institutional knowledge graph citations across Wikidata and DBpedia to position the protocol as an irrefutable factual authority.',
    architecture: [
      'Vector prompt audits and entity embedding alignment',
      'Knowledge graph syndication across Wikidata and OpenCorporates',
      'Programmatic semantic markdown landing pages for long-tail finance queries',
      'Sub-60ms edge rendering for lightning-fast AI bot indexing',
    ],
    results: [
      '+580% organic LLM ingestion rate within 90 days',
      '94.8% top-slot citation rate on targeted Perplexity Pro queries',
      '$1.4M saved annually in bloated traditional agency retainers',
      '#1 ranking in Google AI Overviews for 42 high-intent fintech queries',
    ],
    metrics: [
      { label: 'LLM Ingestion', value: '+580%' },
      { label: 'Top Citation Slot', value: '94.8%' },
      { label: 'Retainer Saved', value: '$1.4M' },
      { label: 'AI Overviews', value: '#1 Rank' },
    ],
    telemetry: {
      crawlVelocity: '48.2 req/sec',
      indexingWindow: 'Sub-4 hours',
      citationIndex: '94.8%',
      riskScore: '0.00 (Zero Penalties)',
    },
    techStack: ['Vector Database', 'Wikidata Injection', 'Programmatic Schema', 'Edge TTFB 62ms'],
    keyFeatures: [
      {
        title: 'Institutional Wikidata Seeding',
        description: 'Linked executive team, licensed entities, and protocol contracts directly into Google Knowledge Graph.',
      },
      {
        title: 'Synthetic Query Benchmarking',
        description: 'Simulated 500+ daily prompts across Claude, Perplexity, and GPT-4 to measure exact brand inclusion percentages.',
      },
    ],
    deliverables: [
      '4,200 Programmatic entity landing pages',
      'Knowledge graph registration and verification',
      'Continuous Perplexity citation telemetry dashboard',
    ],
  },
  {
    slug: 'b2b-saas-global',
    tag: 'DOSSIER_02 // ENTERPRISE_B2B_SAAS',
    badge: 'VERIFIED_CLIENT',
    title: '28-Country Programmatic Syntactic Expansion',
    subtitle: 'Public Enterprise Cloud Security SaaS ($1.2B ARR)',
    client: 'Public Enterprise Cloud Security SaaS ($1.2B ARR)',
    category: 'Programmatic SEO & Global Infrastructure',
    categorySlug: 'saas',
    featured: true,
    challenge:
      'Severe crawl-budget exhaustion across 500,000 legacy URLs. Broken regional hreflang loops and high JavaScript rendering latency preventing global search indexing across Europe and APAC.',
    solution:
      'Engineered serverless edge-computed dynamic hreflang routing with zero-JS SSR hydration. Synthesized localized long-tail query nodes matching 28 international buyer intents without disk bloat.',
    architecture: [
      'Edge Cloudflare Workers compute routing hreflang headers dynamically',
      'Zero-JS server-rendered Astro component architecture',
      'Automated sitemap shard generation partitioned by language locale',
      'Continuous crawl-budget telemetry monitoring Googlebot request frequency',
    ],
    results: [
      '89ms global Time-to-First-Byte across all 28 target international markets',
      '2.8M monthly incremental organic search impressions (+340% lift)',
      '12,400+ competitive top-3 keyword positions captured in 6 months',
      'Zero crawl-budget waste with 99.4% Googlebot crawl efficiency',
    ],
    metrics: [
      { label: 'Edge TTFB', value: '89ms' },
      { label: 'Impression Lift', value: '+340%' },
      { label: 'Top-3 Positions', value: '12,400+' },
      { label: 'Crawl Efficiency', value: '99.4%' },
    ],
    telemetry: {
      crawlVelocity: '124.6 req/sec',
      indexingWindow: 'Continuous (Instant)',
      citationIndex: '88.3%',
      riskScore: '0.00 (Zero Penalties)',
    },
    techStack: ['Cloudflare Workers Edge', 'Zero-JS Hydration', 'Automated Hreflang', 'Core Web Vitals 99/100'],
    keyFeatures: [
      {
        title: 'Dynamic Edge Hreflang',
        description: 'Computed localized response headers in sub-5ms without touching origin application servers.',
      },
      {
        title: 'Zero-JS Hydration',
        description: 'Stripped 800KB of client JavaScript while preserving interactive search and filtering via pure CSS/HTML.',
      },
    ],
    deliverables: [
      '28 Localized programmatic search subtrees',
      'Global edge caching configuration',
      'International hreflang validation telemetry',
    ],
  },
  {
    slug: 'global-ecommerce-rescue',
    tag: 'DOSSIER_03 // GLOBAL_ECOMMERCE',
    badge: 'VERIFIED_CLIENT',
    title: 'Autonomous Core Web Vitals & Indexation Rescue',
    subtitle: 'Multi-Brand Global Retail Conglomerate (12M Monthly Visitors)',
    client: 'Multi-Brand Global Retail Conglomerate (12M Monthly Visitors)',
    category: 'Edge Infrastructure & Telemetry',
    categorySlug: 'ecommerce',
    featured: true,
    challenge:
      'Google Core Update wiped out 42,000 orphaned catalog URLs due to slow server response times, layout shifts, and missing canonical headers. Immediate monthly revenue drop of $2.1M.',
    solution:
      'Deployed a 24/7 headless bot crawler pipeline connected directly to Google Indexing API and IndexNow. Re-architected edge caching to deliver sub-40ms page loads and passing Core Web Vitals across 2.5 million SKUs.',
    architecture: [
      'Autonomous bot daemon executing IndexNow and Google Indexing API pings',
      'Edge static caching with stale-while-revalidate invalidation hooks',
      'Automated schema reconciliation fixing Product and AggregateOffer trees',
      'Strict image dimension reservation eliminating CLS completely',
    ],
    results: [
      '100% orphan URL catalog recovery achieved in 14 days',
      '+$34.2M verified incremental pipeline revenue over 12 months',
      'Passing 100% of Core Web Vitals across 2.5 million catalog URLs',
      'Automated sitemap reconciliation running every 15 minutes',
    ],
    metrics: [
      { label: 'Orphan Recovery', value: '100%' },
      { label: 'Recovery Time', value: '14 Days' },
      { label: 'Pipeline Lift', value: '+$34.2M' },
      { label: 'CWV Score', value: '100/100' },
    ],
    telemetry: {
      crawlVelocity: '210.0 req/sec',
      indexingWindow: '14 Days Recovery',
      citationIndex: '91.2%',
      riskScore: '0.00 (Zero Penalties)',
    },
    techStack: ['Google Indexing API', 'IndexNow Daemon', 'Edge Caching', 'Sub-40ms TTFB'],
    keyFeatures: [
      {
        title: 'Headless Re-Indexing Daemon',
        description: 'Auto-detects dropped URLs from Search Console API and triggers priority re-indexing in sub-second cycles.',
      },
      {
        title: 'Core Web Vitals Edge Hardening',
        description: 'Achieved 99+ PageSpeed scores across millions of dynamic product variants.',
      },
    ],
    deliverables: [
      'Automated indexing daemon microservice',
      'Full catalog schema restoration',
      '12-Month executive revenue attribution report',
    ],
  },
];
