/**
 * Batch 3D Dark Glassmorphic Image Generator
 * 
 * Generates unique 3D renders for every single page and blog post using
 * the unified prompt formula (Style 2: 3D Dark Glassmorphic Tensor Hardware).
 * 
 * Prompt Template:
 * "Futuristic dark mode 3D render of [SUBJECT], isometric perspective, 
 * floating dark obsidian geometric monoliths, frosted glass prism with 
 * interior glowing neon circuit board, electric acid lime green (#CCFF00) 
 * and cyan light beams, deep cyber black background with subtle wireframe 
 * grid reflection, sleek high tech enterprise hardware aesthetic, 
 * volumetric cinematic lighting, no text, no laptop frame, premium modern tech render"
 */

export const BATCH_3D_PROMPTS = [
  // ─── CORE HUBS ─────────────────────────────────────────────────────────────
  {
    key: 'services-hero',
    filename: 'services-hero.webp',
    subject: 'an enterprise search and AI capability matrix core with interconnected computational nodes and high-bandwidth telemetry channels',
  },
  {
    key: 'blog-hero',
    filename: 'blog-hero.webp',
    subject: 'a search intelligence research laboratory core analyzing real-time algorithmic dossiers and Core Web Vitals streams',
  },
  {
    key: 'about-hero',
    filename: 'about-hero.webp',
    subject: 'a deterministic systems infrastructure core representing zero-fluff engineering and automated cloud architecture',
  },
  {
    key: 'contact-hero',
    filename: 'contact-hero.webp',
    subject: 'a secure communication terminal and encrypted collaboration gateway with real-time engineer dispatch channels',
  },

  // ─── CATEGORY HUBS ────────────────────────────────────────────────────────
  {
    key: 'services-marketing',
    filename: 'services-marketing.webp',
    subject: 'a multi-channel algorithmic growth marketing engine coordinating cross-platform PPC, conversion funnels, and search arbitrage',
  },
  {
    key: 'services-content',
    filename: 'services-content.webp',
    subject: 'a semantic topical authority architecture engine mapping high-density knowledge graphs and entity cluster hierarchies',
  },
  {
    key: 'services-web',
    filename: 'services-web.webp',
    subject: 'a sub-second edge web engineering unit with optical speed accelerators and zero-shift layout stabilizers',
  },
  {
    key: 'services-seo',
    filename: 'seo-service-hero.webp',
    subject: 'an autonomous search crawl architecture and indexation pipeline with server monoliths connected by laser data tracks',
  },
  {
    key: 'services-ai',
    filename: 'ai-service-hero.webp',
    subject: 'an AI neural search infrastructure tensor core with glowing neural pathways and generative answer retrieval engines',
  },

  // ─── SEO SUITE ─────────────────────────────────────────────────────────────
  {
    key: 'technical-onpage',
    filename: 'technical-onpage-hero.webp',
    subject: 'a technical DOM parsing and Core Web Vitals optimization engine with sub-100ms INP execution tracks',
  },
  {
    key: 'local-seo',
    filename: 'local-seo-hero.webp',
    subject: 'a multi-location geospatial entity mapping grid with radiant geo-coordinates and high-density local citation clusters',
  },
  {
    key: 'content-authority',
    filename: 'content-authority-hero.webp',
    subject: 'a topical authority PageRank link vector processor balancing internal link equity across clustered content nodes',
  },
  {
    key: 'content-authority-checklist',
    filename: 'content-authority-post-checklist.webp',
    subject: 'an automated entity verification chassis scanning structured data schemas against Googlebot ingestion rules',
  },
  {
    key: 'seo-tips',
    filename: 'seo-tips-hero.webp',
    subject: 'an algorithmic advancement tactical control board indexing enterprise search optimization protocols',
  },

  // ─── WEB SPEED & UX SUITE ──────────────────────────────────────────────────
  {
    key: 'web-design',
    filename: 'web-design-hero.webp',
    subject: 'a performance-first web design framework with semantic component modules floating along precision optical tracks',
  },
  {
    key: 'website-speed',
    filename: 'website-speed-hero.webp',
    subject: 'an extreme edge CDN cache accelerator delivering sub-20ms TTFB and instantaneous resource preloading',
  },
  {
    key: 'ux-architecture',
    filename: 'ux-architecture-hero.webp',
    subject: 'a cognitive flow UX architecture schematic with ergonomic user path conduits and frictionless interactive cards',
  },
  {
    key: 'landing-page',
    filename: 'landing-page-hero.webp',
    subject: 'a high-conversion landing page architectural node optimizing real-time lead capture and visual hierarchy',
  },
  {
    key: 'seo-web-design',
    filename: 'seo-web-design-hero.webp',
    subject: 'a crawlable semantic DOM structure engine with zero JavaScript hydration overhead and native accessibility layers',
  },

  // ─── MARKETING & ADS SUITE ─────────────────────────────────────────────────
  {
    key: 'google-ads',
    filename: 'google-ads-hero.webp',
    subject: 'an algorithmic PPC bidding matrix processing real-time search auctions and Quality Score arbitrations',
  },
  {
    key: 'marketing-google-ads',
    filename: 'marketing-google-ads-hero.webp',
    subject: 'a performance marketing campaign command hub monitoring ROAS curves and dynamic ad budget allocations',
  },
  {
    key: 'integrated-campaigns',
    filename: 'integrated-campaigns-hero.webp',
    subject: 'a unified multi-channel funnel synchronizing search intent, programmatic display, and social audience graphs',
  },
  {
    key: 'sales-funnel',
    filename: 'sales-funnel-hero.webp',
    subject: 'a mathematical conversion rate optimization pipeline guiding enterprise leads through sequential decision gates',
  },
  {
    key: 'social-media',
    filename: 'social-media-hero.webp',
    subject: 'a viral multi-network social distribution matrix radiating engagement telemetry across decentralized nodes',
  },
  {
    key: 'social-media-content',
    filename: 'social-media-content-hero.webp',
    subject: 'a creative asset engineering workstation rendering high-resonance social formats and algorithmic content drops',
  },
  {
    key: 'email-marketing',
    filename: 'email-marketing-hero.webp',
    subject: 'an automated behavioral email lifecycle trigger engine processing event-driven message sequences',
  },
  {
    key: 'marketing-engagement',
    filename: 'marketing-engagement-hero.webp',
    subject: 'an autonomous AI customer engagement node handling conversational dispatch and real-time qualification',
  },

  // ─── CONTENT & AUTHORITY SUITE ─────────────────────────────────────────────
  {
    key: 'content-creation',
    filename: 'content-creation-hero.webp',
    subject: 'a semantic content generation chassis assembling multi-layered topical articles and entity taxonomies',
  },
  {
    key: 'translation',
    filename: 'translation-hero.webp',
    subject: 'a cross-lingual search localization core maintaining strict entity alignment across 12 international languages',
  },
  {
    key: 'visual-content',
    filename: 'visual-content-hero.webp',
    subject: 'a technical data visualization unit projecting 3D architectural schematics and high-density infographics',
  },
  {
    key: 'content-calendar',
    filename: 'content-calendar-hero.webp',
    subject: 'a publishing cadence scheduling matrix orchestrating automated editorial pipelines against seasonal search demand',
  },
  {
    key: 'content-calendar-template',
    filename: 'content-calendar-post-template.webp',
    subject: 'a structural EEAT production specification blueprint verifying author authority and entity trust signals',
  },

  // ─── AI & GENERATIVE SEARCH ────────────────────────────────────────────────
  {
    key: 'ai-content',
    filename: 'ai-content-hero.webp',
    subject: 'an AI content operations engine injecting high-density semantic facts into large language model retrieval pipelines',
  },
  {
    key: 'analysis-strategy',
    filename: 'analysis-strategy-hero.webp',
    subject: 'a competitive vector retrieval radar detecting real-time algorithmic ranking gaps across industry competitors',
  },
  {
    key: 'geo-ai-citations-service',
    filename: 'geo-ai-citations-hero.webp',
    subject: 'a Generative Engine Optimization command center securing primary citations in SearchGPT and Perplexity overviews',
  },

  // ─── 12 DEDICATED BLOG POSTS ───────────────────────────────────────────────
  {
    key: 'blog-ai-content-automation',
    filename: 'blog-ai-content-automation.webp',
    subject: 'an automated end-to-end content production and distribution pipeline running continuous validation routines',
    ogCard: true,
  },
  {
    key: 'blog-ai-seo-guide',
    filename: 'blog-ai-seo-guide.webp',
    subject: 'an algorithmic Google #1 ranking execution framework with predictive crawl budget optimization cores',
    ogCard: true,
  },
  {
    key: 'blog-content-calendar-guide',
    filename: 'blog-content-calendar-guide.webp',
    subject: 'an editorial cadence matrix and content velocity blueprint eliminating zero-search-volume bottlenecks',
    ogCard: true,
  },
  {
    key: 'blog-content-strategy-guide',
    filename: 'blog-content-strategy-guide.webp',
    subject: 'a seven-step entity authority framework architecting interconnected topical pillar and cluster hierarchies',
    ogCard: true,
  },
  {
    key: 'blog-digital-marketing-trends',
    filename: 'blog-digital-marketing-trends.webp',
    subject: 'a next-generation marketing radar tracking multi-modal search agents and autonomous acquisition pipelines',
    ogCard: true,
  },
  {
    key: 'blog-geo-ai-citations',
    filename: 'blog-geo-ai-citations.webp',
    subject: 'a ten-tactic tactical array securing high-frequency citation placement within Perplexity and Gemini answers',
    ogCard: true,
  },
  {
    key: 'blog-google-ads-guide',
    filename: 'blog-google-ads-guide.webp',
    subject: 'a master Google Ads optimization console managing negative keywords, smart bidding, and conversion tracking',
    ogCard: true,
  },
  {
    key: 'blog-page-authority-guide',
    filename: 'blog-page-authority-guide.webp',
    subject: 'a Page Authority audit instrumentation chassis measuring link equity flow and anchor text distributions',
    ogCard: true,
  },
  {
    key: 'blog-seo-digital-marketing-tips',
    filename: 'blog-seo-digital-marketing-tips.webp',
    subject: 'an enterprise SEO tactics matrix validating production ranking recommendations for large-scale websites',
    ogCard: true,
  },
  {
    key: 'blog-seo-faq-guide',
    filename: 'blog-seo-faq-guide.webp',
    subject: 'an executive decision matrix answering 30 critical enterprise search questions for C-suite managers',
    ogCard: true,
  },
  {
    key: 'blog-seo-friendly-web-design',
    filename: 'blog-seo-friendly-web-design.webp',
    subject: 'a developer blueprint connecting design tokens and semantic HTML elements to Googlebot indexing parsers',
    ogCard: true,
  },
  {
    key: 'blog-seo-guide',
    filename: 'blog-seo-guide.webp',
    subject: 'a comprehensive SEO foundation monolith uniting technical crawlability, entity graphs, and quality signals',
    ogCard: true,
  },

  // ─── PORTFOLIO CASES ───────────────────────────────────────────────────────
  {
    key: 'portfolio-asreseo-command-center',
    filename: 'portfolio-asreseo-command-center.webp',
    subject: 'a Model Context Protocol developer gateway coordinating 32 edge tools with real-time MCP server telemetry',
  },
  {
    key: 'portfolio-emdash-seo',
    filename: 'portfolio-emdash-seo.webp',
    subject: 'a programmatic SERP dominance engine delivering triple-digit revenue expansion without ranking drops',
  },
  {
    key: 'portfolio-fintech-scaleup',
    filename: 'portfolio-fintech-scaleup.webp',
    subject: 'a high-trust fintech application interface maintaining sub-800ms speed under heavy transaction throughput',
  },
  {
    key: 'portfolio-b2b-saas-global',
    filename: 'portfolio-b2b-saas-global.webp',
    subject: 'a global B2B SaaS inbound conversion machine turning high-intent enterprise search into qualified demos',
  },
  {
    key: 'portfolio-global-ecommerce-rescue',
    filename: 'portfolio-global-ecommerce-rescue.webp',
    subject: 'a massive 50,000 SKU ecommerce re-indexing system preserving historical link equity through 301 maps',
  },
  {
    key: 'portfolio-ads-reporting',
    filename: 'portfolio-ads-reporting.webp',
    subject: 'an enterprise multi-touch marketing attribution dashboard reconciling ad spend with backend closed deals',
  },
  {
    key: 'portfolio-ai-callcenter',
    filename: 'portfolio-ai-callcenter.webp',
    subject: 'an ultra-low latency voice dispatch matrix routing inbound enterprise callers to AI support agents',
  },
  {
    key: 'portfolio-content-pipeline',
    filename: 'portfolio-content-pipeline.webp',
    subject: 'an enterprise editorial pipeline engine synchronizing n8n workflows with Cloudflare D1 storage clusters',
  },
  {
    key: 'portfolio-law-rag',
    filename: 'portfolio-law-rag.webp',
    subject: 'a hybrid HyDE legal retrieval engine extracting precise regulatory clauses from multi-terabyte corpora',
  },
  {
    key: 'portfolio-seo-monitoring',
    filename: 'portfolio-seo-monitoring.webp',
    subject: 'a 24/7 autonomous rank tracker daemon continuously querying global search clusters across 50 regions',
  },
];

/**
 * Builds the complete unified prompt for any entry
 */
export function buildPrompt(subject) {
  return `Futuristic dark mode 3D render of ${subject}, isometric perspective, floating dark obsidian geometric monoliths, frosted glass prism with interior glowing neon circuit board, electric acid lime green (#CCFF00) and cyan light beams, deep cyber black background with subtle wireframe grid reflection, sleek high tech enterprise hardware aesthetic, volumetric cinematic lighting, no text, no laptop frame, premium modern tech render`;
}
