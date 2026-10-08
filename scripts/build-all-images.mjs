import sharp from 'sharp';
import { existsSync, copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'images');
const publicDir = join(root, 'public', 'images');
const ogDir = join(root, 'public', 'og');

mkdirSync(outDir, { recursive: true });
mkdirSync(publicDir, { recursive: true });
mkdirSync(ogDir, { recursive: true });

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Creates a Neo-Brutalist & Acid Yellow technical schematic SVG
 */
function createSchematic({
  tag,
  title,
  badge = 'ACTIVE_NODE',
  leftTitle = 'SYSTEM ARCHITECTURE',
  leftSvg = '',
  rightTitle = 'VERIFIED TELEMETRY',
  rightSvg = '',
  midTitle = 'PROCESSING PIPELINE',
  midSvg = '',
  metrics = [],
}) {
  return `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid-${escapeXml(tag).replace(/[^a-zA-Z0-9]/g, '_')}" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#CCFF00" stroke-width="0.5" stroke-opacity="0.08"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="#000000"/>
  <rect width="1024" height="1024" fill="url(#grid-${escapeXml(tag).replace(/[^a-zA-Z0-9]/g, '_')})"/>

  <!-- Outer Frame -->
  <rect x="24" y="24" width="976" height="976" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.25"/>
  <rect x="32" y="32" width="960" height="960" fill="none" stroke="#CCFF00" stroke-width="2"/>

  <!-- Corner Registration Marks -->
  <path d="M 24 52 L 52 52 L 52 24" fill="none" stroke="#CCFF00" stroke-width="3"/>
  <path d="M 1000 52 L 972 52 L 972 24" fill="none" stroke="#CCFF00" stroke-width="3"/>
  <path d="M 24 972 L 52 972 L 52 1000" fill="none" stroke="#CCFF00" stroke-width="3"/>
  <path d="M 1000 972 L 972 972 L 972 1000" fill="none" stroke="#CCFF00" stroke-width="3"/>

  <!-- Top Console Header -->
  <rect x="48" y="48" width="928" height="64" fill="#0A0E17" stroke="#CCFF00" stroke-width="1.5"/>
  <g transform="translate(48, 48)">
    <rect x="0" y="0" width="220" height="64" fill="#CCFF00"/>
    <text x="16" y="38" fill="#000000" font-family="monospace, Courier" font-size="13" font-weight="900" letter-spacing="0.5">${escapeXml(tag)}</text>
    <text x="240" y="38" fill="#FFFFFF" font-family="monospace, Courier" font-size="15" font-weight="800" letter-spacing="1.5">${escapeXml(title)}</text>
    <rect x="796" y="14" width="116" height="36" fill="#000000" stroke="#CCFF00" stroke-width="1"/>
    <circle cx="812" cy="32" r="4" fill="#CCFF00"/>
    <text x="824" y="36" fill="#CCFF00" font-family="monospace, Courier" font-size="11" font-weight="bold">${escapeXml(badge)}</text>
  </g>

  <!-- Left Column Box -->
  <rect x="48" y="132" width="448" height="420" fill="#080C14" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.2"/>
  <rect x="48" y="132" width="448" height="34" fill="#141B29" stroke="#CCFF00" stroke-width="1"/>
  <text x="64" y="154" fill="#CCFF00" font-family="monospace, Courier" font-size="12" font-weight="bold">${escapeXml(leftTitle)}</text>
  <g transform="translate(48, 166)">
    ${leftSvg}
  </g>

  <!-- Right Column Box -->
  <rect x="528" y="132" width="448" height="420" fill="#080C14" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.2"/>
  <rect x="528" y="132" width="448" height="34" fill="#141B29" stroke="#CCFF00" stroke-width="1"/>
  <text x="544" y="154" fill="#CCFF00" font-family="monospace, Courier" font-size="12" font-weight="bold">${escapeXml(rightTitle)}</text>
  <g transform="translate(528, 166)">
    ${rightSvg}
  </g>

  <!-- Middle Full-Width Box -->
  <rect x="48" y="572" width="928" height="240" fill="#0A0E17" stroke="#CCFF00" stroke-width="1.5"/>
  <rect x="48" y="572" width="928" height="32" fill="#141B29"/>
  <text x="64" y="593" fill="#CCFF00" font-family="monospace, Courier" font-size="12" font-weight="bold">${escapeXml(midTitle)}</text>
  <g transform="translate(48, 604)">
    ${midSvg}
  </g>

  <!-- Bottom Metrics Row (4 cards) -->
  <g transform="translate(48, 832)">
    ${metrics.map((m, i) => {
      const x = i * 238;
      const isAcid = i % 2 === 0;
      return `
      <g transform="translate(${x}, 0)">
        <rect x="0" y="0" width="222" height="136" fill="#000000" stroke="${isAcid ? '#CCFF00' : '#FFFFFF'}" stroke-width="${isAcid ? '2' : '1.5'}" stroke-opacity="${isAcid ? '1' : '0.4'}"/>
        <text x="18" y="46" fill="#CCFF00" font-family="monospace, Courier" font-size="30" font-weight="900">${escapeXml(m.value)}</text>
        <text x="18" y="76" fill="#FFFFFF" font-family="monospace, Courier" font-size="11" font-weight="bold">${escapeXml(m.label)}</text>
        <text x="18" y="98" fill="#888888" font-family="monospace, Courier" font-size="10">${escapeXml(m.sub)}</text>
      </g>
      `;
    }).join('')}
  </g>
</svg>
`;
}

// Generate an image to webp
async function generateImage(filename, svgString) {
  const destPath = join(outDir, filename);
  await sharp(Buffer.from(svgString))
    .webp({ quality: 85 })
    .toFile(destPath);
  console.log(`Generated: ${filename}`);
}

export { createSchematic, generateImage, outDir, publicDir, ogDir };
