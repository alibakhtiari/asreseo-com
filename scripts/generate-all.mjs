import { createSchematic, buildImage } from './generate-all-schematics.mjs';
import { copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir = join(root, 'src', 'assets', 'images');
const pubDir = join(root, 'public', 'images');
const ogDir = join(root, 'public', 'og');

const schematics = [
  // 1. SEO Service Hero
  {
    filename: 'seo-service-hero.webp',
    config: {
      tag: 'SERVICE_01 // SEO_CORE',
      title: 'AUTONOMOUS SEO & SEARCH CRAWL ARCHITECTURE',
      badge: 'ACTIVE_CRAWL',
      leftTitle: 'CRAWL ARCHITECTURE & INDEXING PIPELINE',
      leftContent: `
        <rect x="20" y="20" width="380" height="70" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="36" y="50" fill="#CCFF00" font-family="monospace" font-size="12" font-weight="bold">GOOGLEBOT &amp; INDEXNOW DAEMON</text>
        <text x="36" y="70" fill="#888888" font-family="monospace" font-size="10">Sub-second priority pinging via edge hooks</text>
        
        <line x1="210" y1="90" x2="210" y2="120" stroke="#CCFF00" stroke-width="2"/>
        
        <rect x="20" y="120" width="380" height="70" fill="#000000" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.4"/>
        <text x="36" y="150" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="bold">EDGE CANONICAL &amp; DYNAMIC SSR</text>
        <text x="36" y="170" fill="#888888" font-family="monospace" font-size="10">Zero orphan URLs, dynamic XML sitemap shard</text>
        
        <line x1="210" y1="190" x2="210" y2="220" stroke="#CCFF00" stroke-width="2"/>
        
        <rect x="20" y="220" width="380" height="70" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="36" y="250" fill="#CCFF00" font-family="monospace" font-size="12" font-weight="bold">SCHEMA.ORG ENTITY GRAPH GRAPH</text>
        <text x="36" y="270" fill="#888888" font-family="monospace" font-size="10">Automated WebPage, FAQ, Service &amp; Breadcrumb</text>
      `,
      rightTitle: 'SERP FOOTPRINT & TRAFFIC VELOCITY',
      rightContent: `
        <rect x="20" y="20" width="380" height="200" fill="#000000" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.3"/>
        <path d="M 35 180 L 100 165 L 180 140 L 260 95 L 340 55 L 385 40" fill="none" stroke="#CCFF00" stroke-width="3"/>
        <circle cx="385" cy="40" r="4" fill="#CCFF00"/>
        <text x="240" y="35" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold">+412% SERP SURGE</text>
        <line x1="35" y1="190" x2="385" y2="190" stroke="#222222" stroke-width="1"/>
        
        <rect x="20" y="240" width="180" height="60" fill="#000000" stroke="#CCFF00" stroke-width="1"/>
        <text x="30" y="265" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold">CRAWL EFFICIENCY</text>
        <text x="30" y="285" fill="#FFFFFF" font-family="monospace" font-size="14" font-weight="900">99.8% VERIFIED</text>
        
        <rect x="220" y="240" width="180" height="60" fill="#000000" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.4"/>
        <text x="230" y="265" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold">EDGE LATENCY</text>
        <text x="230" y="285" fill="#CCFF00" font-family="monospace" font-size="14" font-weight="900">&lt; 38ms TTFB</text>
      `,
      midTitle: 'ALGORITHMIC OPTIMIZATION PIPELINE',
      midContent: `
        <line x1="40" y1="90" x2="880" y2="90" stroke="#CCFF00" stroke-width="2"/>
        <rect x="40" y="50" width="180" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="130" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">BOT DISCOVERY</text>
        <text x="130" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">Log Analysis</text>

        <rect x="270" y="50" width="180" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
        <text x="360" y="85" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">CANONICAL AUDIT</text>
        <text x="360" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">Zero Duplication</text>

        <rect x="500" y="50" width="180" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="590" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">INTERNAL PR</text>
        <text x="590" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">Link Equity Flow</text>

        <rect x="730" y="50" width="180" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
        <text x="820" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">INDEX MONITOR</text>
        <text x="820" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">24/7 SERP Tracking</text>
      `,
      metrics: [
        { value: '+412%', label: 'SERP VELOCITY', sub: 'Top-3 Keyword Surge' },
        { value: '99.8%', label: 'INDEXATION RATE', sub: 'Passing Googlebot' },
        { value: '48', label: 'CRAWL NODES', sub: 'Global Edge Ingestion' },
        { value: '0', label: 'PENALTIES', sub: '100% White-Hat Schema' },
      ],
    },
  },

  // 2. Technical Onpage Hero
  {
    filename: 'technical-onpage-hero.webp',
    config: {
      tag: 'SERVICE_02 // TECH_SEO',
      title: 'TECHNICAL ON-PAGE & CORE WEB VITALS HARDENING',
      badge: 'CWV_PASSED',
      leftTitle: 'DOM & RESOURCE ARCHITECTURE',
      leftContent: `
        <rect x="20" y="20" width="380" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="36" y="52" fill="#CCFF00" font-family="monospace" font-size="12" font-weight="bold">ZERO-JS HYDRATION ENGINE</text>
        <text x="36" y="74" fill="#888888" font-family="monospace" font-size="10">Eliminating client runtime overhead completely</text>
        
        <rect x="20" y="120" width="380" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.4"/>
        <text x="36" y="152" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="bold">STRICT DIMENSION RESERVATION</text>
        <text x="36" y="174" fill="#888888" font-family="monospace" font-size="10">Zero layout shift (CLS = 0.00) guaranteed</text>

        <rect x="20" y="220" width="380" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="36" y="252" fill="#CCFF00" font-family="monospace" font-size="12" font-weight="bold">CACHE-CONTROL &amp; HSTS HARDENING</text>
        <text x="36" y="274" fill="#888888" font-family="monospace" font-size="10">Immutable 1y asset caching &amp; preload scanners</text>
      `,
      rightTitle: 'CORE WEB VITALS METRICS (CrUX)',
      rightContent: `
        <rect x="20" y="20" width="180" height="120" fill="#000000" stroke="#CCFF00" stroke-width="2"/>
        <text x="35" y="65" fill="#CCFF00" font-family="monospace" font-size="28" font-weight="900">0.00</text>
        <text x="35" y="95" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold">CLS SCORE</text>
        <text x="35" y="115" fill="#888888" font-family="monospace" font-size="9">Zero Layout Shift</text>

        <rect x="220" y="20" width="180" height="120" fill="#000000" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.4"/>
        <text x="235" y="65" fill="#CCFF00" font-family="monospace" font-size="28" font-weight="900">0.8s</text>
        <text x="235" y="95" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold">LCP TIME</text>
        <text x="235" y="115" fill="#888888" font-family="monospace" font-size="9">Instant Paint</text>

        <rect x="20" y="160" width="380" height="120" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="35" y="200" fill="#CCFF00" font-family="monospace" font-size="24" font-weight="900">100 / 100</text>
        <text x="35" y="230" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="bold">GOOGLE PAGESPEED MOBILE AUDIT</text>
        <text x="35" y="250" fill="#888888" font-family="monospace" font-size="10">Validated Core Web Vitals Pass Across All Slugs</text>
      `,
      midTitle: 'TECHNICAL COMPLIANCE GATES',
      midContent: `
        <line x1="40" y1="90" x2="880" y2="90" stroke="#CCFF00" stroke-width="2"/>
        <rect x="40" y="50" width="180" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="130" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">ROBOTS.TXT</text>
        <text x="130" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">AI Bots Allowed</text>

        <rect x="270" y="50" width="180" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
        <text x="360" y="85" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">HREFLANG MAP</text>
        <text x="360" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">Sub-5ms Compute</text>

        <rect x="500" y="50" width="180" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="590" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">JSON-LD GRAPH</text>
        <text x="590" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">100% Typed Nodes</text>

        <rect x="730" y="50" width="180" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
        <text x="820" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">EDGE HEADERS</text>
        <text x="820" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">CSP &amp; Strict HSTS</text>
      `,
      metrics: [
        { value: '100/100', label: 'CWV AUDIT', sub: 'Mobile & Desktop' },
        { value: '0.00', label: 'LAYOUT SHIFT', sub: 'Strict Dimensions' },
        { value: '38ms', label: 'GLOBAL TTFB', sub: 'Cloudflare Edge' },
        { value: '100%', label: 'VALID SCHEMA', sub: 'Schema.org Graph' },
      ],
    },
  },

  // 3. AI Service Hero (GEO / AEO)
  {
    filename: 'ai-service-hero.webp',
    config: {
      tag: 'SERVICE_03 // GEO_ENGINE',
      title: 'GENERATIVE SEARCH OPTIMIZATION & LLM GROUNDING',
      badge: 'AEO_ACTIVE',
      leftTitle: 'MULTI-LLM CONTEXT & CITATION MATRIX',
      leftContent: `
        <circle cx="120" cy="100" r="36" fill="#000000" stroke="#CCFF00" stroke-width="2"/>
        <text x="120" y="105" fill="#CCFF00" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">PERPLEXITY</text>

        <circle cx="280" cy="80" r="32" fill="#000000" stroke="#FFFFFF" stroke-width="1.5"/>
        <text x="280" y="85" fill="#FFFFFF" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">SEARCHGPT</text>

        <circle cx="320" cy="220" r="34" fill="#000000" stroke="#CCFF00" stroke-width="2"/>
        <text x="320" y="225" fill="#CCFF00" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">GOOGLE SGE</text>

        <circle cx="140" cy="240" r="32" fill="#000000" stroke="#FFFFFF" stroke-width="1.5"/>
        <text x="140" y="245" fill="#FFFFFF" font-family="monospace" font-size="9" font-weight="bold" text-anchor="middle">CLAUDE BOT</text>

        <line x1="145" y1="125" x2="295" y2="200" stroke="#CCFF00" stroke-width="1.5" stroke-dasharray="4,4"/>
        <line x1="250" y1="95" x2="165" y2="220" stroke="#CCFF00" stroke-width="1.5"/>

        <rect x="20" y="300" width="380" height="70" fill="#000000" stroke="#CCFF00" stroke-width="1"/>
        <text x="36" y="328" fill="#888888" font-family="monospace" font-size="10">&gt; llm_ingest_rate: 96.2% top slot</text>
        <text x="36" y="348" fill="#CCFF00" font-family="monospace" font-size="10">&gt; grounding_consensus: 100% FACTUAL</text>
      `,
      rightTitle: 'LLM EXTRACTION READINESS',
      rightContent: `
        <rect x="20" y="20" width="380" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="36" y="52" fill="#CCFF00" font-family="monospace" font-size="12" font-weight="bold">STRUCTURED AEO DEFINITIONS</text>
        <text x="36" y="74" fill="#888888" font-family="monospace" font-size="10">High-density bullet nodes designed for LLM citations</text>

        <rect x="20" y="120" width="380" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.4"/>
        <text x="36" y="152" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="bold">DYNAMIC /LLMS.TXT PIPELINE</text>
        <text x="36" y="174" fill="#888888" font-family="monospace" font-size="10">Edge rendered markdown corpus for autonomous bots</text>

        <rect x="20" y="220" width="380" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="36" y="252" fill="#CCFF00" font-family="monospace" font-size="12" font-weight="bold">HALLUCINATION DEFENSE SHIELD</text>
        <text x="36" y="274" fill="#888888" font-family="monospace" font-size="10">Continuous consensus monitoring &amp; fact validation</text>
      `,
      midTitle: 'GEO DEPLOYMENT PIPELINE',
      midContent: `
        <line x1="40" y1="90" x2="880" y2="90" stroke="#CCFF00" stroke-width="2"/>
        <rect x="40" y="50" width="180" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="130" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">PROMPT AUDIT</text>
        <text x="130" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">500+ Simulated Prompts</text>

        <rect x="270" y="50" width="180" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
        <text x="360" y="85" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">WIKIDATA SEED</text>
        <text x="360" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">Entity Triple Injection</text>

        <rect x="500" y="50" width="180" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="590" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">AEO NODES</text>
        <text x="590" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">Synthesized Summaries</text>

        <rect x="730" y="50" width="180" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
        <text x="820" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">CONSENSUS</text>
        <text x="820" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">100% Ingestion Yield</text>
      `,
      metrics: [
        { value: '96.2%', label: 'TOP CITATION', sub: 'Perplexity & SGE' },
        { value: '500+', label: 'DAILY PROBES', sub: 'Multi-Model Benchmarks' },
        { value: '< 60ms', label: 'EDGE INGESTION', sub: 'Markdown Corpus' },
        { value: '0', label: 'HALLUCINATIONS', sub: 'Grounding Verification' },
      ],
    },
  },

  // 4. Web Design Hero
  {
    filename: 'web-design-hero.webp',
    config: {
      tag: 'SERVICE_04 // EDGE_WEB',
      title: 'EDGE WEB ARCHITECTURE & HEADLESS DESIGN SYSTEM',
      badge: 'ZERO_JS_SSR',
      leftTitle: 'ASTRO ISLANDS & MODULAR UI',
      leftContent: `
        <rect x="20" y="20" width="380" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="36" y="52" fill="#CCFF00" font-family="monospace" font-size="12" font-weight="bold">ASTRO 7 ISLANDS ARCHITECTURE</text>
        <text x="36" y="74" fill="#888888" font-family="monospace" font-size="10">Zero hydration penalty, HTML-first delivery</text>

        <rect x="20" y="120" width="380" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.4"/>
        <text x="36" y="152" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="bold">TAILWIND CSS V4 COMPILED</text>
        <text x="36" y="174" fill="#888888" font-family="monospace" font-size="10">Lightweight brutalist stylesheet &lt; 20KB</text>

        <rect x="20" y="220" width="380" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="36" y="252" fill="#CCFF00" font-family="monospace" font-size="12" font-weight="bold">SHARP NATIVE PICTURE PIPELINE</text>
        <text x="36" y="274" fill="#888888" font-family="monospace" font-size="10">Responsive AVIF &amp; WebP variants at build time</text>
      `,
      rightTitle: 'BENCHMARK RUNTIME SCORE',
      rightContent: `
        <rect x="20" y="20" width="180" height="120" fill="#000000" stroke="#CCFF00" stroke-width="2"/>
        <text x="35" y="65" fill="#CCFF00" font-family="monospace" font-size="28" font-weight="900">100</text>
        <text x="35" y="95" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold">PERFORMANCE</text>
        <text x="35" y="115" fill="#888888" font-family="monospace" font-size="9">Lighthouse Audit</text>

        <rect x="220" y="20" width="180" height="120" fill="#000000" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.4"/>
        <text x="235" y="65" fill="#CCFF00" font-family="monospace" font-size="28" font-weight="900">100</text>
        <text x="235" y="95" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold">ACCESSIBILITY</text>
        <text x="235" y="115" fill="#888888" font-family="monospace" font-size="9">WCAG AAA Score</text>

        <rect x="20" y="160" width="380" height="120" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="35" y="200" fill="#CCFF00" font-family="monospace" font-size="24" font-weight="900">&lt; 50ms TTFB</text>
        <text x="35" y="230" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="bold">GLOBAL TIME-TO-FIRST-BYTE</text>
        <text x="35" y="250" fill="#888888" font-family="monospace" font-size="10">Cloudflare Workers Edge Network Deploy</text>
      `,
      midTitle: 'EDGE DEPLOYMENT FLOW',
      midContent: `
        <line x1="40" y1="90" x2="880" y2="90" stroke="#CCFF00" stroke-width="2"/>
        <rect x="40" y="50" width="180" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="130" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">ASTRO BUILD</text>
        <text x="130" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">Static Generation</text>

        <rect x="270" y="50" width="180" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
        <text x="360" y="85" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">SHARP COMPRESS</text>
        <text x="360" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">AVIF/WebP Sets</text>

        <rect x="500" y="50" width="180" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="590" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">EDGE UPLOAD</text>
        <text x="590" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">300+ Edge POPs</text>

        <rect x="730" y="50" width="180" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
        <text x="820" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">SECURITY CSP</text>
        <text x="820" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">A+ Security Grade</text>
      `,
      metrics: [
        { value: '100/100', label: 'PAGESPEED', sub: 'Core Web Vitals' },
        { value: '< 50ms', label: 'EDGE TTFB', sub: 'Global Latency' },
        { value: '0 KB', label: 'UNUSED JS', sub: 'Zero-JS Hydration' },
        { value: '0.00', label: 'LAYOUT SHIFT', sub: 'CLS Free Layout' },
      ],
    },
  },

  // 5. Blog Hero
  {
    filename: 'blog-hero.webp',
    config: {
      tag: 'RESEARCH // DISPATCH',
      title: 'ASRESEO RESEARCH ARCHIVE & SEARCH DISPATCH HUB',
      badge: 'EVERGREEN',
      leftTitle: 'RESEARCH STREAMS & DOMAINS',
      leftContent: `
        <rect x="20" y="20" width="380" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="36" y="52" fill="#CCFF00" font-family="monospace" font-size="12" font-weight="bold">AI SEARCH &amp; GEO ENGINE PAPERS</text>
        <text x="36" y="74" fill="#888888" font-family="monospace" font-size="10">Reverse-engineering Perplexity &amp; Google SGE</text>

        <rect x="20" y="120" width="380" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.4"/>
        <text x="36" y="152" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="bold">TECHNICAL &amp; EDGE COMPUTING LOGS</text>
        <text x="36" y="174" fill="#888888" font-family="monospace" font-size="10">Cloudflare Workers, D1 SQL, and Astro benchmarks</text>

        <rect x="20" y="220" width="380" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="36" y="252" fill="#CCFF00" font-family="monospace" font-size="12" font-weight="bold">TOPICAL AUTHORITY FRAMEWORKS</text>
        <text x="36" y="274" fill="#888888" font-family="monospace" font-size="10">Semantic topic trees &amp; knowledge graph engineering</text>
      `,
      rightTitle: 'DISPATCH VELOCITY & SYNDICATION',
      rightContent: `
        <rect x="20" y="20" width="180" height="120" fill="#000000" stroke="#CCFF00" stroke-width="2"/>
        <text x="35" y="65" fill="#CCFF00" font-family="monospace" font-size="28" font-weight="900">12</text>
        <text x="35" y="95" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold">RESEARCH LOGS</text>
        <text x="35" y="115" fill="#888888" font-family="monospace" font-size="9">Tier-A Architectural</text>

        <rect x="220" y="20" width="180" height="120" fill="#000000" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.4"/>
        <text x="235" y="65" fill="#CCFF00" font-family="monospace" font-size="28" font-weight="900">100%</text>
        <text x="235" y="95" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold">EVERGREEN</text>
        <text x="235" y="115" fill="#888888" font-family="monospace" font-size="9">Continuous Refresh</text>

        <rect x="20" y="160" width="380" height="120" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="35" y="200" fill="#CCFF00" font-family="monospace" font-size="22" font-weight="900">RSS // LLMS.TXT LIVE</text>
        <text x="35" y="230" fill="#FFFFFF" font-family="monospace" font-size="12" font-weight="bold">GLOBAL AI &amp; READER SYNDICATION</text>
        <text x="35" y="250" fill="#888888" font-family="monospace" font-size="10">Sub-second build times via Astro Content Collections</text>
      `,
      midTitle: 'RESEARCH PIPELINE',
      midContent: `
        <line x1="40" y1="90" x2="880" y2="90" stroke="#CCFF00" stroke-width="2"/>
        <rect x="40" y="50" width="180" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="130" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">EMPIRICAL AUDIT</text>
        <text x="130" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">SERP Telemetry</text>

        <rect x="270" y="50" width="180" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
        <text x="360" y="85" fill="#FFFFFF" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">MDX SYNTHESIS</text>
        <text x="360" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">Structured Frontmatter</text>

        <rect x="500" y="50" width="180" height="80" fill="#000000" stroke="#CCFF00" stroke-width="1.5"/>
        <text x="590" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">SCHEMA INJECTION</text>
        <text x="590" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">FAQPage &amp; BlogPosting</text>

        <rect x="730" y="50" width="180" height="80" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
        <text x="820" y="85" fill="#CCFF00" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">EDGE CACHE</text>
        <text x="820" y="105" fill="#888888" font-family="monospace" font-size="9" text-anchor="middle">1hr Freshness TTL</text>
      `,
      metrics: [
        { value: '12', label: 'RESEARCH LOGS', sub: 'Engineering In-Depth' },
        { value: '100%', label: 'ORIGINAL DATA', sub: 'Zero Content Farms' },
        { value: '< 1s', label: 'BUILD TIME', sub: 'Astro Content Loader' },
        { value: '0', label: 'THIN CONTENT', sub: 'Flesch Scored' },
      ],
    },
  },
];

// Run the batch builder
async function run() {
  console.log('Starting Batch Schematic Generation...\n');
  for (const item of schematics) {
    const svg = createSchematic(item.config);
    await buildImage(item.filename, svg);
  }

  // Also duplicate to paired names
  const duplicatePairs = [
    ['technical-onpage-hero.webp', 'content-authority-hero.webp'],
    ['technical-onpage-hero.webp', 'content-authority-post-checklist.webp'],
    ['seo-service-hero.webp', 'local-seo-hero.webp'],
    ['ai-service-hero.webp', 'ai-content-hero.webp'],
    ['seo-service-hero.webp', 'analysis-strategy-hero.webp'],
    ['web-design-hero.webp', 'website-speed-hero.webp'],
    ['web-design-hero.webp', 'ux-architecture-hero.webp'],
    ['web-design-hero.webp', 'landing-page-hero.webp'],
    ['seo-service-hero.webp', 'content-creation-hero.webp'],
    ['seo-service-hero.webp', 'translation-hero.webp'],
    ['web-design-hero.webp', 'visual-content-hero.webp'],
    ['seo-service-hero.webp', 'content-calendar-hero.webp'],
    ['seo-service-hero.webp', 'content-calendar-post-template.webp'],
    ['seo-service-hero.webp', 'marketing-engagement-hero.webp'],
    ['seo-service-hero.webp', 'social-media-hero.webp'],
    ['seo-service-hero.webp', 'social-media-content-hero.webp'],
    ['seo-service-hero.webp', 'sales-funnel-hero.webp'],
    ['seo-service-hero.webp', 'email-marketing-hero.webp'],
    ['seo-service-hero.webp', 'marketing-google-ads-hero.webp'],
    ['seo-service-hero.webp', 'google-ads-hero.webp'],
    ['seo-service-hero.webp', 'integrated-campaigns-hero.webp'],
    ['blog-hero.webp', 'geo-ai-citations-hero.webp'],
    ['blog-hero.webp', 'seo-tips-hero.webp'],
    ['web-design-hero.webp', 'seo-web-design-hero.webp'],
    ['seo-service-hero.webp', 'about-hero.webp'],
    ['seo-service-hero.webp', 'contact-hero.webp'],
    // Legacy portfolio aliases to modern portfolio schematics
    ['portfolio-asreseo-command-center.webp', 'portfolio-ads-reporting.webp'],
    ['portfolio-fintech-scaleup.webp', 'portfolio-ai-callcenter.webp'],
    ['portfolio-emdash-seo.webp', 'portfolio-content-pipeline.webp'],
    ['portfolio-b2b-saas-global.webp', 'portfolio-law-rag.webp'],
    ['portfolio-global-ecommerce-rescue.webp', 'portfolio-seo-monitoring.webp'],
  ];

  for (const [srcName, destName] of duplicatePairs) {
    const srcPath = join(assetsDir, srcName);
    const destPath = join(assetsDir, destName);
    const pubDestPath = join(pubDir, destName);
    const ogSrc = join(ogDir, srcName.replace(/\.webp$/, '.jpg'));
    const ogDest = join(ogDir, destName.replace(/\.webp$/, '.jpg'));

    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      copyFileSync(srcPath, pubDestPath);
      if (existsSync(ogSrc)) {
        copyFileSync(ogSrc, ogDest);
      }
      console.log(`✓ Synchronized modern schematic: ${destName} (from ${srcName})`);
    }
  }

  console.log('\nAll modern images successfully generated and synchronized!');
}

run().catch(console.error);
