import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const brainDir = '/Users/alib/.gemini/antigravity-ide/brain/789ff9c1-27f0-407b-876d-ef2610aa87e5';
const srcTensor = path.join(brainDir, 'sample_type_2_isometric_1791464613261.jpg');
const srcCrawl = path.join(brainDir, 'render_seo_crawl_1791464883737.jpg');
const srcHUD = path.join(brainDir, 'sample_type_3_telemetry_1791464632629.jpg');

const assetsDir = path.resolve('src/assets/images');
const publicDir = path.resolve('public/images');

fs.mkdirSync(assetsDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildOverlay({ tag, title, telemetry, color = '#CCFF00' }) {
  return `<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
  <!-- Subtle Vignette Frame -->
  <rect x="16" y="16" width="1168" height="643" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
  <path d="M 16 659 L 1184 659" stroke="${color}" stroke-width="2.5"/>

  <!-- Corner Registration Marks -->
  <path d="M 10 16 L 22 16 M 16 10 L 16 22" stroke="${color}" stroke-width="2"/>
  <path d="M 1178 16 L 1190 16 M 1184 10 L 1184 22" stroke="${color}" stroke-width="2"/>
  <path d="M 10 659 L 22 659 M 16 653 L 16 665" stroke="${color}" stroke-width="2"/>
  <path d="M 1178 659 L 1190 659 M 1184 653 L 1184 665" stroke="${color}" stroke-width="2"/>

  <!-- Top Left Monospace Protocol Badge -->
  <g transform="translate(32, 32)">
    <rect width="${Math.max(220, tag.length * 8.5 + 40)}" height="34" fill="#000000" fill-opacity="0.88" stroke="${color}" stroke-width="1.2"/>
    <circle cx="16" cy="17" r="4" fill="${color}"/>
    <text x="28" y="22" font-family="monospace" font-size="11" font-weight="900" fill="${color}" letter-spacing="1">${escapeXml(tag)}</text>
  </g>

  <!-- Top Center Title (optional subtle) -->
  ${title ? `
  <g transform="translate(${Math.max(260, tag.length * 8.5 + 85)}, 35)">
    <text x="0" y="20" font-family="monospace" font-size="12" font-weight="700" fill="#FFFFFF" letter-spacing="1">${escapeXml(title)}</text>
  </g>` : ''}

  <!-- Bottom Right Telemetry Box -->
  <g transform="translate(${1200 - Math.max(200, telemetry.length * 7.5 + 36) - 32}, 616)">
    <rect width="${Math.max(200, telemetry.length * 7.5 + 36)}" height="28" fill="#000000" fill-opacity="0.88" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
    <text x="14" y="18" font-family="monospace" font-size="10.5" font-weight="bold" fill="#FFFFFF" letter-spacing="1">${escapeXml(telemetry)}</text>
  </g>
</svg>`;
}

const imageConfigs = [
  // Core Hubs
  { filename: 'services-hero.webp', src: srcTensor, tag: '[SERVICES // TACTICAL_SUITE]', title: 'ENTERPRISE SEARCH & AI CAPABILITY MATRIX', telemetry: 'NODES: 32 ACTIVE | EDGE: 14ms', hue: 0 },
  { filename: 'blog-hero.webp', src: srcCrawl, tag: '[RESEARCH // SEARCH_INTELLIGENCE]', title: 'ALGORITHMIC DOSSIERS & CWV STUDIES', telemetry: 'DOSSIERS: 24 | FREQUENCY: DAILY', hue: 15 },
  { filename: 'about-hero.webp', src: srcTensor, tag: '[MANIFESTO // INFRASTRUCTURE]', title: 'DETERMINISTIC SYSTEMS & ZERO FLUFF', telemetry: 'FOUNDATION: 2019 | VERIFIED SLA', hue: 0 },
  { filename: 'contact-hero.webp', src: srcCrawl, tag: '[DISPATCH // SECURE_TERMINAL]', title: 'DIRECT SENIOR ENGINEER COLLABORATION', telemetry: 'PGP ENCRYPTED | SUB-15M SLA', hue: 0 },

  // SEO Suite
  { filename: 'seo-service-hero.webp', src: srcCrawl, tag: '[SERVICE_01 // CORE_SEO]', title: 'AUTONOMOUS CRAWL ARCHITECTURE', telemetry: 'INDEX RATE: 99.8% | CLUSTERS: 48', hue: 0 },
  { filename: 'technical-onpage-hero.webp', src: srcCrawl, tag: '[PROTOCOL // TECH_ONPAGE]', title: 'CORE WEB VITALS & ENTITY SCHEMA', telemetry: 'CWV 100/100 | ZERO BLOAT', hue: -10 },
  { filename: 'local-seo-hero.webp', src: srcCrawl, tag: '[PROTOCOL // LOCAL_SEO]', title: 'MULTI-LOCATION GEO RELEVANCE', telemetry: 'MAP PACK TOP-3 | 100% CITATION', hue: 10 },
  { filename: 'content-authority-hero.webp', src: srcTensor, tag: '[PROTOCOL // PAGE_AUTHORITY]', title: 'TOPICAL GRAPH VECTORS', telemetry: 'INTERNAL LINK RATIO: 1:4.2', hue: 5 },
  { filename: 'content-authority-post-checklist.webp', src: srcCrawl, tag: '[PROTOCOL // CHECKLIST]', title: 'ENTITY AUDIT & METADATA', telemetry: 'VERIFIED AGAINST GOOGLEBOT', hue: 0 },
  { filename: 'seo-tips-hero.webp', src: srcCrawl, tag: '[DOSSIER // SEO_TACTICS]', title: 'ALGORITHMIC ADVANCEMENT PLAYBOOK', telemetry: 'UPDATED: POST-MARCH CORE', hue: 20 },

  // Web Speed & UX
  { filename: 'web-design-hero.webp', src: srcTensor, tag: '[SERVICE_03 // WEB_ENGINEERING]', title: 'PERFORMANCE-FIRST ARCHITECTURE', telemetry: 'SUB-2S LOAD | 100 LIGHTHOUSE', hue: 180, color: '#38BDF8' },
  { filename: 'website-speed-hero.webp', src: srcTensor, tag: '[PROTOCOL // CORE_WEB_VITALS]', title: 'SUB-100MS INP & ZERO CLS', telemetry: 'TTFB: 18ms | CACHE: IMMUTABLE', hue: 0 },
  { filename: 'ux-architecture-hero.webp', src: srcTensor, tag: '[PROTOCOL // UX_ARCHITECTURE]', title: 'COGNITIVE FLOW & ZERO FRICTION', telemetry: 'CRO BOOST: +64% | HEATMAPS', hue: 190, color: '#38BDF8' },
  { filename: 'landing-page-hero.webp', src: srcTensor, tag: '[PROTOCOL // LANDING_PAGES]', title: 'HIGH-CONVERTING CAMPAIGN NODES', telemetry: 'CONVERSION: 8.4% AVG', hue: -15 },
  { filename: 'seo-web-design-hero.webp', src: srcTensor, tag: '[PROTOCOL // SEO_DESIGN]', title: 'CRAWLABLE SEMANTIC DOM STRUCTURE', telemetry: 'DOM DEPTH: < 32 | ZERO JANK', hue: 0 },

  // Marketing & Ads
  { filename: 'google-ads-hero.webp', src: srcHUD, tag: '[SERVICE_02 // GOOGLE_ADS]', title: 'ALGORITHMIC PPC ACQUISITION', telemetry: 'ROAS: 4.8X | BUDGET: SCALED', hue: 0 },
  { filename: 'marketing-google-ads-hero.webp', src: srcHUD, tag: '[PROTOCOL // PERFORMANCE_PPC]', title: 'SMART BIDDING & SEARCH ARBITRAGE', telemetry: 'QUALITY SCORE: 9.4/10', hue: -10 },
  { filename: 'integrated-campaigns-hero.webp', src: srcHUD, tag: '[PROTOCOL // MULTI_CHANNEL]', title: 'UNIFIED SEARCH & SOCIAL FUNNELS', telemetry: 'CROSS-PLATFORM SYNC: 100%', hue: 15 },
  { filename: 'sales-funnel-hero.webp', src: srcHUD, tag: '[PROTOCOL // FUNNEL_OPTIMIZATION]', title: 'MATHEMATICAL CRO PIPELINE', telemetry: 'LEAD VELOCITY: +142%', hue: 0 },
  { filename: 'social-media-hero.webp', src: srcHUD, tag: '[PROTOCOL // SOCIAL_GROWTH]', title: 'VIRAL MULTI-NETWORK REACH', telemetry: 'ENGAGEMENT: +310%', hue: 25 },
  { filename: 'social-media-content-hero.webp', src: srcHUD, tag: '[PROTOCOL // SOCIAL_CONTENT]', title: 'RESONANT CREATIVE ENGINEERING', telemetry: 'FREQUENCY: SCHEDULED DAILY', hue: 20 },
  { filename: 'email-marketing-hero.webp', src: srcHUD, tag: '[PROTOCOL // EMAIL_SYSTEMS]', title: 'BEHAVIORAL EVENT TRIGGERING', telemetry: 'OPEN RATE: 48.2% | ZERO SPAM', hue: -15 },
  { filename: 'marketing-engagement-hero.webp', src: srcHUD, tag: '[PROTOCOL // AI_ENGAGEMENT]', title: 'AUTONOMOUS MARKETING PIPELINES', telemetry: 'AI CONVERSATION ACCURACY: 99%', hue: 0 },

  // Content & Authority
  { filename: 'content-creation-hero.webp', src: srcTensor, tag: '[PROTOCOL // CONTENT_SYSTEMS]', title: 'SEMANTIC TOPICAL CLUSTERING', telemetry: 'ENTITY INGESTION: VERIFIED', hue: 10 },
  { filename: 'translation-hero.webp', src: srcTensor, tag: '[PROTOCOL // LOCALIZATION]', title: 'INTERNATIONAL SEARCH TOPOLOGIES', telemetry: 'LANGUAGES: 12 | NO ENTITY DRIFT', hue: 180, color: '#38BDF8' },
  { filename: 'visual-content-hero.webp', src: srcTensor, tag: '[PROTOCOL // VISUAL_SCHEMATICS]', title: 'DATA ARCHITECTURE DIAGRAMS', telemetry: 'VECTOR SHARPNESS: 100%', hue: 0 },
  { filename: 'content-calendar-hero.webp', src: srcCrawl, tag: '[PROTOCOL // CONTENT_CADENCE]', title: 'SCHEDULED PUBLISHING TOPOLOGY', telemetry: 'COVERAGE: 100% SERP GAP', hue: 0 },
  { filename: 'content-calendar-post-template.webp', src: srcCrawl, tag: '[TEMPLATE // CADENCE_SHEET]', title: 'PRODUCTION SPECIFICATIONS', telemetry: 'STRUCTURAL EEAT: STRICT', hue: 10 },

  // AI & Generative Search
  { filename: 'ai-service-hero.webp', src: srcTensor, tag: '[SERVICE_04 // NEURAL_AEO_GEO]', title: 'LLM CITATION SURGE ENGINE', telemetry: 'CITATION YIELD: +412%', hue: 0 },
  { filename: 'ai-content-hero.webp', src: srcTensor, tag: '[PROTOCOL // AI_CONTENT_OPS]', title: 'HIGH-DENSITY ENTITY INJECTION', telemetry: 'LLM CITATIONS: 94.2%', hue: -10 },
  { filename: 'analysis-strategy-hero.webp', src: srcTensor, tag: '[PROTOCOL // STRATEGY_NEURAL]', title: 'COMPETITOR VECTOR RETRIEVAL', telemetry: 'GAP CLASSIFICATION: REALTIME', hue: 15 },
  { filename: 'geo-ai-citations-hero.webp', src: srcTensor, tag: '[DOSSIER // GEO_PERPLEXITY]', title: 'SEARCHGPT & OVERVIEWS DOMINANCE', telemetry: 'LLM VISIBILITY: TOP TIER', hue: 0 },

  // Portfolio & MCP Command Center
  { filename: 'portfolio-asreseo-command-center.webp', src: srcTensor, tag: '[PORTFOLIO // MCP_GATEWAY]', title: '32 MODEL CONTEXT PROTOCOL TOOLS', telemetry: 'EDGE CLOUDFLARE WORKERS D1', hue: 0 },
  { filename: 'portfolio-emdash-seo.webp', src: srcCrawl, tag: '[PORTFOLIO // EMDASH_ENGINE]', title: 'PROGRAMMATIC SERP DOMINANCE', telemetry: '+380% REVENUE | 0 DROP', hue: -10 },
  { filename: 'portfolio-fintech-scaleup.webp', src: srcTensor, tag: '[PORTFOLIO // FINTECH_SCALE]', title: 'ZERO-COMPROMISE CWV & TRUST', telemetry: 'SPEED: 0.8s | CONVERSION +92%', hue: 180, color: '#38BDF8' },
  { filename: 'portfolio-b2b-saas-global.webp', src: srcTensor, tag: '[PORTFOLIO // B2B_SAAS]', title: 'ENTERPRISE PIPELINE ENGINE', telemetry: 'HIGH-INTENT DEMO PIPELINE', hue: 0 },
  { filename: 'portfolio-global-ecommerce-rescue.webp', src: srcCrawl, tag: '[PORTFOLIO // ECOM_RESCUE]', title: '50K SKU RE-INDEXATION', telemetry: 'ZERO TRAFFIC LOSS 301 MAP', hue: 10 },
  { filename: 'portfolio-ads-reporting.webp', src: srcHUD, tag: '[PORTFOLIO // ADS_REPORTING]', title: 'INTELLIGENT ATTRIBUTION MODEL', telemetry: 'MULTI-TOUCH ENGINE: ACTIVE', hue: 0 },
  { filename: 'portfolio-ai-callcenter.webp', src: srcTensor, tag: '[PORTFOLIO // AI_CALLCENTER]', title: 'AUTONOMOUS VOICE DISPATCH', telemetry: 'LATENCY: < 250ms ROUNDTRIP', hue: -20 },
  { filename: 'portfolio-content-pipeline.webp', src: srcCrawl, tag: '[PORTFOLIO // PIPELINE_OPS]', title: 'ENTERPRISE WORKFLOW ENGINE', telemetry: 'n8n & D1 STORAGE CLUSTER', hue: 0 },
  { filename: 'portfolio-law-rag.webp', src: srcTensor, tag: '[PORTFOLIO // LEGAL_RAG]', title: 'HYBRID HYDE VECTOR RETRIEVAL', telemetry: 'PRECISION: 99.4% VERIFIED', hue: 180, color: '#38BDF8' },
  { filename: 'portfolio-seo-monitoring.webp', src: srcHUD, tag: '[PORTFOLIO // 24_7_MONITORING]', title: 'REALTIME RANK TRACKER DAEMON', telemetry: 'CRAWL VELOCITY: 482 REQ/SEC', hue: 0 },
];

async function run() {
  console.log(`Starting generation for ${imageConfigs.length} 3D Glassmorphic WebP assets...`);
  let count = 0;

  for (const item of imageConfigs) {
    try {
      const overlaySvg = buildOverlay({
        tag: item.tag,
        title: item.title,
        telemetry: item.telemetry,
        color: item.color || '#CCFF00',
      });

      let pipeline = sharp(item.src)
        .resize(1200, 675, { fit: 'cover' });

      if (item.hue !== 0) {
        pipeline = pipeline.modulate({ hue: item.hue });
      }

      const buffer = await pipeline
        .composite([{ input: Buffer.from(overlaySvg), top: 0, left: 0 }])
        .webp({ quality: 88, effort: 6 })
        .toBuffer();

      fs.writeFileSync(path.join(assetsDir, item.filename), buffer);
      fs.writeFileSync(path.join(publicDir, item.filename), buffer);
      count++;
      console.log(`✓ Generated ${item.filename} (${Math.round(buffer.length / 1024)} KB)`);
    } catch (err) {
      console.error(`Failed ${item.filename}:`, err);
    }
  }

  console.log(`\nSuccessfully generated ${count}/${imageConfigs.length} assets!`);
}

run().catch(console.error);
