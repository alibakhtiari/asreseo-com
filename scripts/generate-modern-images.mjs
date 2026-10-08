import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'assets', 'images');
mkdirSync(outDir, { recursive: true });

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
  leftBox = null,
  rightBox = null,
  midBox = null,
  metrics = [],
}) {
  return `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid-${escapeXml(tag)}" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#CCFF00" stroke-width="0.5" stroke-opacity="0.07"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1024" height="1024" fill="#000000"/>
  <rect width="1024" height="1024" fill="url(#grid-${escapeXml(tag)})"/>

  <!-- Outer Frame -->
  <rect x="24" y="24" width="976" height="976" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.25"/>
  <rect x="32" y="32" width="960" height="960" fill="none" stroke="#CCFF00" stroke-width="2"/>

  <!-- Corner Registration Crosses -->
  <path d="M 24 52 L 52 52 L 52 24" fill="none" stroke="#CCFF00" stroke-width="3"/>
  <path d="M 1000 52 L 972 52 L 972 24" fill="none" stroke="#CCFF00" stroke-width="3"/>
  <path d="M 24 972 L 52 972 L 52 1000" fill="none" stroke="#CCFF00" stroke-width="3"/>
  <path d="M 1000 972 L 972 972 L 972 1000" fill="none" stroke="#CCFF00" stroke-width="3"/>

  <!-- Top Console Header -->
  <rect x="48" y="48" width="928" height="64" fill="#0A0E17" stroke="#CCFF00" stroke-width="1.5"/>
  <g transform="translate(48, 48)">
    <rect x="0" y="0" width="240" height="64" fill="#CCFF00"/>
    <text x="16" y="39" fill="#000000" font-family="monospace, Courier" font-size="14" font-weight="900" letter-spacing="1">${escapeXml(tag)}</text>
    <text x="260" y="39" fill="#FFFFFF" font-family="monospace, Courier" font-size="16" font-weight="800" letter-spacing="1.5">${escapeXml(title)}</text>
    <rect x="800" y="14" width="112" height="36" fill="#000000" stroke="#CCFF00" stroke-width="1"/>
    <circle cx="816" cy="32" r="4" fill="#CCFF00"/>
    <text x="828" y="36" fill="#CCFF00" font-family="monospace, Courier" font-size="11" font-weight="bold">${escapeXml(badge)}</text>
  </g>

  <!-- Left Column Box -->
  ${leftBox ? `
  <rect x="48" y="132" width="448" height="420" fill="#080C14" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.2"/>
  <rect x="48" y="132" width="448" height="34" fill="#141B29" stroke="#CCFF00" stroke-width="1"/>
  <text x="64" y="154" fill="#CCFF00" font-family="monospace, Courier" font-size="12" font-weight="bold">${escapeXml(leftBox.title)}</text>
  <g transform="translate(48, 166)">
    ${leftBox.content || ''}
  </g>
  ` : ''}

  <!-- Right Column Box -->
  ${rightBox ? `
  <rect x="528" y="132" width="448" height="420" fill="#080C14" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.2"/>
  <rect x="528" y="132" width="448" height="34" fill="#141B29" stroke="#CCFF00" stroke-width="1"/>
  <text x="544" y="154" fill="#CCFF00" font-family="monospace, Courier" font-size="12" font-weight="bold">${escapeXml(rightBox.title)}</text>
  <g transform="translate(528, 166)">
    ${rightBox.content || ''}
  </g>
  ` : ''}

  <!-- Middle Full-Width Box -->
  ${midBox ? `
  <rect x="48" y="572" width="928" height="240" fill="#0A0E17" stroke="#CCFF00" stroke-width="1.5"/>
  <rect x="48" y="572" width="928" height="32" fill="#141B29"/>
  <text x="64" y="593" fill="#CCFF00" font-family="monospace, Courier" font-size="12" font-weight="bold">${escapeXml(midBox.title)}</text>
  <g transform="translate(48, 604)">
    ${midBox.content || ''}
  </g>
  ` : ''}

  <!-- Bottom Metrics Row (4 cards) -->
  <g transform="translate(48, 832)">
    ${metrics.map((m, i) => {
      const x = i * 238;
      const isAcid = i % 2 === 0;
      return `
      <g transform="translate(${x}, 0)">
        <rect x="0" y="0" width="222" height="136" fill="#000000" stroke="${isAcid ? '#CCFF00' : '#FFFFFF'}" stroke-width="${isAcid ? '2' : '1.5'}" stroke-opacity="${isAcid ? '1' : '0.4'}"/>
        <text x="18" y="46" fill="#CCFF00" font-family="monospace, Courier" font-size="32" font-weight="900">${escapeXml(m.value)}</text>
        <text x="18" y="76" fill="#FFFFFF" font-family="monospace, Courier" font-size="11" font-weight="bold">${escapeXml(m.label)}</text>
        <text x="18" y="98" fill="#888888" font-family="monospace, Courier" font-size="10">${escapeXml(m.sub)}</text>
      </g>
      `;
    }).join('')}
  </g>
</svg>
`;
}

export { createSchematic, outDir };
