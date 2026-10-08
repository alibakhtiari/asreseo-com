// Single-source hero images: masters live in src/assets/images (consumed by
// the Picture component via astro:assets). Public OG URLs (/images/*) are
// generated from the same masters so crawlers keep stable absolute URLs
// without committing every file twice.
import { cpSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'src', 'assets', 'images');
const to = join(root, 'public', 'images');

mkdirSync(to, { recursive: true });
for (const f of readdirSync(from)) {
  if (f.endsWith('.webp')) cpSync(join(from, f), join(to, f));
}
console.log(`images synced to public/images`);
