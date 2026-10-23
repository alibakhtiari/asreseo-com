import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

// Generates ultra-optimized, shadcn/ogimagecn inspired OpenGraph cards (1200x630)
// matching AsreSEO's pure Neo-Brutalist Wireframe & Acid Yellow design system.

function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildOgSvg(props = {}) {
  const title = escapeXml(props.title || "Dominate AI Search & Conversational Engines");
  const eyebrow = escapeXml(props.eyebrow || "[AUTONOMOUS_INFRASTRUCTURE // V3.8]");
  const descLine1 = escapeXml(props.descLine1 || "Autonomous agent infrastructure engineered to capture AI citations, Google AI Overviews,");
  const descLine2 = escapeXml(props.descLine2 || "and programmatic SERP dominance with mathematical precision & sub-2s velocity.");
  const tag1 = escapeXml(props.tag1 || "LLM Citation Yield");
  const tag1Sub = escapeXml(props.tag1Sub || "+412% verified citation surge");
  const tag2 = escapeXml(props.tag2 || "Automated Indexing");
  const tag2Sub = escapeXml(props.tag2Sub || "99.8% crawl efficiency");
  const tag3 = escapeXml(props.tag3 || "Edge Performance");
  const tag3Sub = escapeXml(props.tag3Sub || "< 18ms TTFB sub-second cycle");
  const badge = escapeXml(props.badge || "asreseo.com");
  const eyebrowWidth = props.eyebrowWidth || Math.max(160, Math.min(560, Math.round(eyebrow.length * 8.6 + 28)));
  const titleFontSize = props.titleFontSize || (title.length > 42 ? 40 : title.length > 34 ? 45 : 50);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <!-- Technical Wireframe Grid -->
    <pattern id="og-grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>

    <!-- Dense Wireframe Dots -->
    <pattern id="og-dots" width="16" height="16" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.08)"/>
    </pattern>

    <!-- Subtle Acid Glow in Top Right -->
    <radialGradient id="acid-glow" cx="85%" cy="15%" r="65%">
      <stop offset="0%" stop-color="#CCFF00" stop-opacity="0.12"/>
      <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#050811" stop-opacity="0"/>
    </radialGradient>

    <!-- Subtle Bottom Left Ambient Glow -->
    <radialGradient id="subtle-glow" cx="15%" cy="85%" r="50%">
      <stop offset="0%" stop-color="#CCFF00" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#050811" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Deep Cyber Black Background -->
  <rect width="1200" height="630" fill="#04060B"/>
  <rect width="1200" height="630" fill="url(#og-grid)"/>
  <rect width="1200" height="630" fill="url(#acid-glow)"/>
  <rect width="1200" height="630" fill="url(#subtle-glow)"/>

  <!-- Shadcn Inset Card Container -->
  <g transform="translate(36, 32)">
    <!-- Container Backdrop -->
    <rect width="1128" height="566" fill="#070B14" fill-opacity="0.94" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>

    <!-- Brutalist Hard Offset Shadow Effect -->
    <path d="M 0 566 L 1128 566" stroke="#CCFF00" stroke-width="3"/>

    <!-- Inner Grid Texture -->
    <rect width="1128" height="566" fill="url(#og-dots)" opacity="0.6"/>

    <!-- Technical Corner Crosshairs (+) -->
    <path d="M -8 0 L 8 0 M 0 -8 L 0 8" stroke="#CCFF00" stroke-width="2"/>
    <path d="M 1120 0 L 1136 0 M 1128 -8 L 1128 8" stroke="#CCFF00" stroke-width="2"/>
    <path d="M -8 566 L 8 566 M 0 558 L 0 574" stroke="#CCFF00" stroke-width="2"/>
    <path d="M 1120 566 L 1136 566 M 1128 558 L 1128 574" stroke="#CCFF00" stroke-width="2"/>

    <!-- TOP BAR -->
    <g transform="translate(44, 40)">
      <!-- Brand Logo Box -->
      <rect width="52" height="52" fill="#000000" stroke="#CCFF00" stroke-width="2"/>
      
      <!-- Vector Logo Mark: Concept 3 Terminal Aperture -->
      <g transform="translate(6, 6) scale(0.4)">
        <path d="M28 18 H16 V82 H28" stroke="#FFFFFF" stroke-width="5" stroke-linecap="square" />
        <path d="M72 18 H84 V82 H72" stroke="#FFFFFF" stroke-width="5" stroke-linecap="square" />
        <path d="M50 18 L68 64 H56 L50 48 L44 64 H32 L50 18 Z" fill="#FFFFFF" />
        <polygon points="50,30 57,42 50,54 43,42" fill="#CCFF00" />
        <rect x="36" y="74" width="28" height="6" fill="#CCFF00" />
        <circle cx="84" cy="18" r="4" fill="#CCFF00" />
      </g>

      <!-- Brand Typography -->
      <text x="68" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="1">AsreSEO</text>
      <text x="210" y="32" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" font-weight="700" font-size="12" fill="#CCFF00" letter-spacing="2">[AUTONOMOUS_SEARCH_SYSTEMS]</text>

      <!-- Right Pill Status (Shadcn style badge) -->
      <g transform="translate(860, 4)">
        <rect width="180" height="42" fill="#000000" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
        <circle cx="22" cy="21" r="5" fill="#CCFF00"/>
        <text x="36" y="26" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" font-weight="800" font-size="14" fill="#FFFFFF" letter-spacing="1.5">${badge}</text>
      </g>
    </g>

    <!-- Top Border Line -->
    <line x1="44" y1="116" x2="1084" y2="116" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>

    <!-- HERO CONTENT -->
    <g transform="translate(44, 150)">
      <!-- Monospace Eyebrow Badge -->
      <rect x="0" y="0" width="480" height="28" fill="#000000" stroke="#CCFF00" stroke-width="1"/>
      <text x="14" y="19" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" font-weight="800" font-size="12" fill="#CCFF00" letter-spacing="1.5">${eyebrow}</text>

      <!-- Main Title (Bold, High-Contrast Neo-Brutalist) -->
      <text x="0" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-weight="900" font-size="50" fill="#FFFFFF" letter-spacing="-0.5">
        ${title}
      </text>

      <!-- Description / Subtitle -->
      <text x="0" y="152" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-weight="400" font-size="20" fill="#94A3B8" letter-spacing="0.2">
        ${descLine1}
      </text>
      <text x="0" y="180" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif" font-weight="400" font-size="20" fill="#64748B" letter-spacing="0.2">
        ${descLine2}
      </text>
    </g>

    <!-- BOTTOM THREE-COLUMN FEATURE STRIP (ogimagecn Block Style) -->
    <g transform="translate(44, 386)">
      <!-- Divider Line -->
      <line x1="0" y1="0" x2="1040" y2="0" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>

      <!-- Card 1 -->
      <g transform="translate(0, 22)">
        <rect width="328" height="116" fill="#04060B" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>
        <path d="M 0 0 L 0 116" stroke="#CCFF00" stroke-width="3"/>
        <text x="20" y="32" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" font-weight="700" font-size="11" fill="#CCFF00" letter-spacing="1.5">// CAPABILITY_01</text>
        <text x="20" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="18" fill="#FFFFFF">${tag1}</text>
        <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="13" fill="#64748B">${tag1Sub}</text>
      </g>

      <!-- Card 2 -->
      <g transform="translate(356, 22)">
        <rect width="328" height="116" fill="#04060B" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>
        <path d="M 0 0 L 0 116" stroke="#38BDF8" stroke-width="3"/>
        <text x="20" y="32" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" font-weight="700" font-size="11" fill="#38BDF8" letter-spacing="1.5">// CAPABILITY_02</text>
        <text x="20" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="18" fill="#FFFFFF">${tag2}</text>
        <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="13" fill="#64748B">${tag2Sub}</text>
      </g>

      <!-- Card 3 -->
      <g transform="translate(712, 22)">
        <rect width="328" height="116" fill="#04060B" stroke="rgba(255,255,255,0.16)" stroke-width="1"/>
        <path d="M 0 0 L 0 116" stroke="#FFFFFF" stroke-width="3"/>
        <text x="20" y="32" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" font-weight="700" font-size="11" fill="#94A3B8" letter-spacing="1.5">// CAPABILITY_03</text>
        <text x="20" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="18" fill="#FFFFFF">${tag3}</text>
        <text x="20" y="90" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="13" fill="#64748B">${tag3Sub}</text>
      </g>
    </g>
  </g>
</svg>`;
}

export async function renderCardToFile(svgContent, targetPath) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const ext = path.extname(targetPath).toLowerCase();
  const image = sharp(Buffer.from(svgContent));

  let buffer;
  if (ext === '.jpg' || ext === '.jpeg') {
    buffer = await image.jpeg({ quality: 92, mozjpeg: true }).toBuffer();
  } else {
    buffer = await image.png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 }).toBuffer();
  }

  fs.writeFileSync(targetPath, buffer);
  const stats = fs.statSync(targetPath);
  console.log(`Generated: ${targetPath} (${Math.round(stats.size / 1024)} KB)`);
}

export async function renderCardPair(svgContent, baseName) {
  const cleanBase = baseName.replace(/\.(png|jpe?g)$/i, '');
  await renderCardToFile(svgContent, `${cleanBase}.png`);
  await renderCardToFile(svgContent, `${cleanBase}.jpg`);
}

async function main() {
  // 1. Primary default OG image for Home and all fallback pages
  const defaultSvg = buildOgSvg();
  await renderCardToFile(defaultSvg, path.resolve('public/og-default.png'));
  await renderCardToFile(defaultSvg, path.resolve('public/og-default.jpg'));

  // If --all flag is passed, generate additional section-specific cards
  if (process.argv.includes('--all')) {
    const pages = [
      {
        path: 'public/og/services-hero.png',
        title: 'Tactical Search & Engineering Suite',
        eyebrow: '[SERVICES // PROTOCOL_SUITE]',
        descLine1: 'Full-stack algorithmic SEO, Generative Engine Optimization (GEO),',
        descLine2: 'conversion-driven Google Ads campaigns, and sub-2s web speed.',
        tag1: 'Core Search Ops',
        tag1Sub: 'Technical & On-Page SEO',
        tag2: 'AI / GEO Engine',
        tag2Sub: 'LLM Citations & Perplexity',
        tag3: 'Performance Ads',
        tag3Sub: 'Google Ads & CRO',
      },
      {
        path: 'public/og/about-hero.png',
        title: 'Infrastructure Manifesto & Systems',
        eyebrow: '[ABOUT // ARCHITECTURE_OVERVIEW]',
        descLine1: 'Engineering data-backed digital dominance through deterministic systems,',
        descLine2: 'verifiable search telemetry, and zero black-box promises.',
        tag1: 'Deterministic SEO',
        tag1Sub: 'Mathematically proven crawl logic',
        tag2: 'Autonomous Nodes',
        tag2Sub: 'n8n & agentic workflows',
        tag3: 'Verifiable SLAs',
        tag3Sub: 'Full reporting transparency',
      },
      {
        path: 'public/og/contact-hero.png',
        title: 'Dispatch Terminal & Direct Comms',
        eyebrow: '[CONTACT // SECURE_DISPATCH]',
        descLine1: 'Direct technical consultation with senior SEO engineers & AI strategists.',
        descLine2: 'Cloudflare native encrypted dispatch with sub-24h turnaround.',
        tag1: 'Direct Line',
        tag1Sub: 'No junior account managers',
        tag2: 'Free Audit',
        tag2Sub: 'Comprehensive technical crawl',
        tag3: 'Zero Lock-In',
        tag3Sub: 'Transparent engagement models',
      },
    ];

    for (const p of pages) {
      const svg = buildOgSvg(p);
      await renderCardToFile(svg, path.resolve(p.path));
    }
  }
}

main().catch(console.error);
