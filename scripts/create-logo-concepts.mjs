import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const outputDir = path.resolve('src/assets/logos');
const previewDir = path.resolve('public/logos-preview');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

// 1. Concept 1: "The Apex Vector" (Algorithmic A + Rising Trajectory)
const svgConcept1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <!-- Left Pillar of A -->
  <polygon points="20,84 34,84 50,34 38,34" fill="#FFFFFF" />
  <!-- Right Pillar of A -->
  <polygon points="52,44 64,84 78,84 64,44" fill="#FFFFFF" />
  <!-- Apex Cap -->
  <polygon points="41,20 50,14 59,20 54,34 46,34" fill="#FFFFFF" />
  <!-- Ascending Vector Arrow launching out to Top-Right -->
  <polygon points="34,58 76,16 76,30 48,62" fill="#CCFF00" />
  <polygon points="56,16 84,16 84,44 74,44 74,26 56,26" fill="#CCFF00" />
  <!-- Stencil Tech Crossbar -->
  <rect x="34" y="58" width="32" height="4.5" fill="#CCFF00" />
  <!-- Base Telemetry Line -->
  <line x1="20" y1="84" x2="78" y2="84" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
</svg>`;

// 2. Concept 2: "The Neural Matrix" (AI Knowledge Graph & Isometric Core)
const svgConcept2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <!-- Isometric Facets -->
  <polygon points="50,14 82,32 50,50 18,32" fill="#0C1322" stroke="#FFFFFF" stroke-width="2" />
  <polygon points="18,32 50,50 50,86 18,68" fill="#060911" stroke="#FFFFFF" stroke-width="2" />
  <polygon points="50,50 82,32 82,68 50,86" fill="#090E1A" stroke="#FFFFFF" stroke-width="2" />
  <!-- Isometric 3D 'A' Framework -->
  <line x1="50" y1="14" x2="50" y2="50" stroke="#CCFF00" stroke-width="3.5" />
  <line x1="18" y1="68" x2="50" y2="50" stroke="#FFFFFF" stroke-width="3" />
  <line x1="82" y1="68" x2="50" y2="50" stroke="#FFFFFF" stroke-width="3" />
  <polygon points="50,30 68,40 50,50 32,40" fill="rgba(204,255,0,0.18)" stroke="#CCFF00" stroke-width="2" />
  <!-- Knowledge Vertices -->
  <circle cx="50" cy="14" r="4.5" fill="#CCFF00" />
  <circle cx="82" cy="32" r="3.5" fill="#FFFFFF" />
  <circle cx="82" cy="68" r="3.5" fill="#CCFF00" />
  <circle cx="50" cy="86" r="3.5" fill="#FFFFFF" />
  <circle cx="18" cy="68" r="3.5" fill="#CCFF00" />
  <circle cx="18" cy="32" r="3.5" fill="#FFFFFF" />
  <circle cx="50" cy="50" r="5" fill="#CCFF00" />
</svg>`;

// 3. Concept 3: "Terminal Aperture" (Brutalist Code & Search Reticle)
const svgConcept3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <!-- Left Brutalist Bracket [ -->
  <path d="M28 18 H16 V82 H28" stroke="#FFFFFF" stroke-width="4" stroke-linecap="square" />
  <!-- Right Brutalist Bracket ] -->
  <path d="M72 18 H84 V82 H72" stroke="#FFFFFF" stroke-width="4" stroke-linecap="square" />
  <!-- Ascending Monolith A -->
  <path d="M50 18 L68 64 H56 L50 48 L44 64 H32 L50 18 Z" fill="#FFFFFF" />
  <!-- Search Aperture Reticle / Diamond in Acid Yellow -->
  <polygon points="50,30 57,42 50,54 43,42" fill="#CCFF00" />
  <!-- Prompt Cursor -->
  <rect x="36" y="74" width="28" height="5" fill="#CCFF00" />
  <!-- Status Live Dot -->
  <circle cx="84" cy="18" r="3.5" fill="#CCFF00" />
</svg>`;

// 4. Concept 4: "SERP Monolith" (Ascending Rank Dominance Columns)
const svgConcept4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <!-- Base Grid Platform -->
  <line x1="16" y1="84" x2="84" y2="84" stroke="rgba(255,255,255,0.25)" stroke-width="2" />
  <!-- Pillar 1: Rank #4 / Crawl -->
  <rect x="18" y="60" width="12" height="24" fill="#FFFFFF" />
  <!-- Pillar 2: Rank #3 / Index -->
  <rect x="34" y="44" width="12" height="40" fill="#FFFFFF" />
  <!-- Pillar 3: Rank #2 / Authority -->
  <rect x="50" y="28" width="12" height="56" fill="#FFFFFF" />
  <!-- Pillar 4: Rank #1 Dominance (Acid Yellow) -->
  <rect x="66" y="14" width="16" height="70" fill="#CCFF00" />
  <!-- Architectural Laser Beam / A Cross-Bar -->
  <polygon points="14,64 78,14 82,18 18,68" fill="#CCFF00" />
  <!-- Rank #1 Crown Block -->
  <rect x="66" y="10" width="16" height="3" fill="#FFFFFF" />
</svg>`;

// 5. Concept 5: "Cyber Sigil" (Interlocking Unified A-S Circuit)
const svgConcept5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <!-- Outer Wireframe Frame -->
  <rect x="12" y="12" width="76" height="76" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
  <!-- Top Left Corner Tick -->
  <path d="M12 24 V12 H24" stroke="#CCFF00" stroke-width="2" fill="none" />
  <!-- Bottom Right Corner Tick -->
  <path d="M88 76 V88 H76" stroke="#CCFF00" stroke-width="2" fill="none" />
  <!-- The A Framework (White) -->
  <polygon points="50,18 80,78 66,78 50,46 34,78 20,78" fill="#FFFFFF" />
  <!-- Interlocking S-Wave / Continuous Data Highway (Acid Yellow) -->
  <path d="M34 60 H66 V50 H42 C36 50 34 46 34 40 C34 32 40 28 50 28 C60 28 66 34 66 40" stroke="#CCFF00" stroke-width="4.5" stroke-linecap="square" fill="none" />
  <rect x="47" y="47" width="6" height="6" fill="#000000" stroke="#CCFF00" stroke-width="2" />
</svg>`;

const concepts = [
  {
    id: 'concept-1',
    name: 'Apex Vector',
    subtitle: 'The Algorithmic A & Ascending Trajectory',
    description: 'Precision stencil letter "A" fused with a 45° rising vector arrow that breaks through the apex. Symbolizes exponential organic search ranking growth, technical speed, and climbing to #1.',
    svg: svgConcept1,
  },
  {
    id: 'concept-2',
    name: 'Neural Matrix',
    subtitle: 'AI Knowledge Graph & Isometric Tensor Core',
    description: 'Isometric 3D hexagonal wireframe representing multi-dimensional search systems, structured entity graphs, and AEO/GEO (Generative Engine Optimization). Glowing vertices signify active neural indexing.',
    svg: svgConcept2,
  },
  {
    id: 'concept-3',
    name: 'Terminal Aperture',
    subtitle: 'Brutalist Code Syntax & Search Reticle',
    description: 'Monospace terminal brackets `[ ]` framing an ascending monolith with an Acid Yellow search diamond reticle and command line prompt cursor. Reflects developer-grade rigor, automated crawl telemetry, and precision targeting.',
    svg: svgConcept3,
  },
  {
    id: 'concept-4',
    name: 'SERP Monolith',
    subtitle: 'Ascending Rank Dominance Columns',
    description: 'Architectural monolithic columns scaling from baseline to the #1 top ranking spot, intersected by an electric Acid Yellow trajectory beam. Represents unshakeable market authority, sub-2s speed, and SERP dominance.',
    svg: svgConcept4,
  },
  {
    id: 'concept-5',
    name: 'Cyber Sigil',
    subtitle: 'Interlocking A+S Data Highway',
    description: 'Continuous geometric ribbon fusing the letters "A" and "S" within a technical wireframe box. Conveys seamless full-stack synergy across SEO, AI Agents, Content Engineering, and high-conversion web platforms.',
    svg: svgConcept5,
  },
];

async function generate() {
  for (const c of concepts) {
    const svgPath = path.join(outputDir, `${c.id}.svg`);
    fs.writeFileSync(svgPath, c.svg, 'utf8');

    // Standalone Mark Preview (512x512)
    const previewSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#080C14"/>
      <defs>
        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid)" />
      <rect x="4" y="4" width="92" height="92" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
      <g transform="translate(10, 10) scale(0.8)">
        ${c.svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
      </g>
    </svg>`;

    const pngPath = path.join(previewDir, `${c.id}.png`);
    await sharp(Buffer.from(previewSvg)).png().toFile(pngPath);

    // Full Lockup Preview (with brand typography: 600x200)
    const lockupSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200">
      <rect width="600" height="200" fill="#080C14"/>
      <defs>
        <pattern id="lgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.75"/>
        </pattern>
      </defs>
      <rect width="600" height="200" fill="url(#lgrid)" />
      <rect x="12" y="12" width="576" height="176" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1.5"/>
      <!-- Icon Container -->
      <g transform="translate(40, 40) scale(1.2)">
        <rect width="100" height="100" fill="#000000" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
        <g transform="translate(10, 10) scale(0.8)">
          ${c.svg.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
        </g>
      </g>
      <!-- Typography Lockup -->
      <text x="190" y="98" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="46" fill="#FFFFFF" letter-spacing="1">AsreSEO</text>
      <text x="192" y="132" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" font-weight="700" font-size="13" fill="#CCFF00" letter-spacing="2">[SEARCH_SYSTEMS // AI_ENGINEERING]</text>
    </svg>`;

    const lockupPngPath = path.join(previewDir, `${c.id}-lockup.png`);
    await sharp(Buffer.from(lockupSvg)).png().toFile(lockupPngPath);

    console.log(`Generated ${c.id}: mark + lockup`);
  }
}

generate().catch(console.error);
