import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Static export preserving the exact URL set of the previous Next.js
// `output: export` + `trailingSlash: true` build (e.g. /about/index.html).

// Blog posts are content-collection pages, so @astrojs/sitemap can't read their
// frontmatter dates on its own. Parse `updated` (falling back to `date`) from
// each MDX file so the sitemap can emit an accurate <lastmod>.
const BLOG_DIR = join(process.cwd(), 'src', 'content', 'blog');
const blogLastmod = new Map();
try {
  for (const file of readdirSync(BLOG_DIR)) {
    if (!/\.mdx?$/.test(file)) continue;
    const src = readFileSync(join(BLOG_DIR, file), 'utf8');
    const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const pick = (key) => fm[1].match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'))?.[1]?.trim();
    const lastmod = pick('updated') || pick('date');
    if (lastmod) blogLastmod.set(`/blog/${file.replace(/\.mdx?$/, '')}/`, lastmod);
  }
} catch {
  // Non-fatal: sitemap still builds, just without blog <lastmod> values.
}

export default defineConfig({
  site: 'https://asreseo.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize: (item) => {
        const path = new URL(item.url).pathname;
        const lastmod = blogLastmod.get(path);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
