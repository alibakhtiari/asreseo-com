import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SVG_MARK = `
  <!-- Left Brutalist Bracket [ -->
  <path d="M28 18 H16 V82 H28" stroke="#FFFFFF" stroke-width="5" stroke-linecap="square" fill="none" />
  <!-- Right Brutalist Bracket ] -->
  <path d="M72 18 H84 V82 H72" stroke="#FFFFFF" stroke-width="5" stroke-linecap="square" fill="none" />
  <!-- Ascending Monolith A -->
  <path d="M50 18 L68 64 H56 L50 48 L44 64 H32 L50 18 Z" fill="#FFFFFF" />
  <!-- Search Aperture Reticle / Diamond in Acid Yellow -->
  <polygon points="50,30 57,42 50,54 43,42" fill="#CCFF00" />
  <!-- Terminal Prompt Cursor _ -->
  <rect x="36" y="74" width="28" height="5.5" fill="#CCFF00" />
  <!-- Live Status Dot -->
  <circle cx="84" cy="18" r="4" fill="#CCFF00" />
`;

// 1. Favicon SVG source with dark background (rounded corners)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="20" fill="#080C14" />
  ${SVG_MARK}
</svg>`;

// 2. Full-bleed background with safe-padding for Apple Touch Icon & PWA Manifest
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#080C14" />
  <g transform="translate(10, 10) scale(0.8)">
    ${SVG_MARK}
  </g>
</svg>`;

// 3. Apple Touch Icon source (slightly tighter padding for iOS home screen)
const appleTouchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" fill="#080C14" />
  <g transform="translate(8, 8) scale(0.84)">
    ${SVG_MARK}
  </g>
</svg>`;

// Helper: Pack PNG images into standard multi-size .ico container
function createIco(images) {
  const count = images.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  let currentOffset = headerSize + count * dirEntrySize;
  const entries = [];

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(currentOffset, 12); // offset
    entries.push(entry);
    currentOffset += img.buffer.length;
  }

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4); // count

  return Buffer.concat([header, ...entries, ...images.map((img) => img.buffer)]);
}

async function generateAll() {
  const publicDir = path.resolve('public');

  console.log('Generating new favicons and app icons for AsreSEO...');

  // 1. apple-touch-icon.png (180x180)
  const appleTouchBuf = await sharp(Buffer.from(appleTouchSvg))
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchBuf);
  console.log('✓ Created public/apple-touch-icon.png (180x180)');

  // 2. favicon-96x96.png (96x96)
  const fav96Buf = await sharp(Buffer.from(faviconSvg))
    .resize(96, 96)
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), fav96Buf);
  console.log('✓ Created public/favicon-96x96.png (96x96)');

  // 3. web-app-manifest-192x192.png (192x192)
  const manifest192Buf = await sharp(Buffer.from(maskableSvg))
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'web-app-manifest-192x192.png'), manifest192Buf);
  console.log('✓ Created public/web-app-manifest-192x192.png (192x192)');

  // 4. web-app-manifest-512x512.png (512x512)
  const manifest512Buf = await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'web-app-manifest-512x512.png'), manifest512Buf);
  console.log('✓ Created public/web-app-manifest-512x512.png (512x512)');

  // 5. favicon.ico (multi-size: 48, 32, 16)
  const p48 = await sharp(Buffer.from(faviconSvg)).resize(48, 48).png().toBuffer();
  const p32 = await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toBuffer();
  const p16 = await sharp(Buffer.from(faviconSvg)).resize(16, 16).png().toBuffer();
  const icoBuf = createIco([
    { width: 48, height: 48, buffer: p48 },
    { width: 32, height: 32, buffer: p32 },
    { width: 16, height: 16, buffer: p16 },
  ]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuf);
  console.log('✓ Created public/favicon.ico (48x48, 32x32, 16x16)');

  // 6. logo.png and Logo-spaced.png (512x512 fallback raster)
  const logoBuf = await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'logo.png'), logoBuf);
  fs.writeFileSync(path.join(publicDir, 'Logo-spaced.png'), logoBuf);
  console.log('✓ Created public/logo.png & public/Logo-spaced.png (512x512)');

  console.log('All favicon and brand assets generated successfully!');
}

generateAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
