import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Static export preserving the exact URL set of the previous Next.js
// `output: export` + `trailingSlash: true` build (e.g. /about/index.html).

// ---------------------------------------------------------------------------
// <lastmod> sources (P1.4): every sitemap URL should carry a truthful lastmod.
//   1. Blog posts  -> frontmatter `updated` (fallback `date`), read from the MDX
//      files by one cheap regex sweep (unchanged behaviour).
//   2. Other pages -> the git commit date of that page's own `src/pages/**`
//      file, collected from ONE `git log --name-only` call and parsed
//      in-process (never one execSync per page).
// serialize() resolves blog -> page -> site-wide fallback and normalises every
// value through toLastmod(), so an emitted <lastmod> is always a valid W3C
// datetime and never in the future. Everything below fails soft: no git, a
// shallow/CI checkout, or odd output degrades to "URL without <lastmod>"
// instead of failing the build.
// ---------------------------------------------------------------------------

const PAGES_DIR = 'src/pages/';

// --- 1) blog frontmatter dates -------------------------------------------
const BLOG_DIR = join(process.cwd(), 'src', 'content', 'blog');
const blogLastmod = new Map();
let newestBlogDate = null; // ms epoch; site-wide fallback when git is unusable
try {
  // recursive: posts may live in subdirectories. Routes are built from
  // entry.id (relative path, no extension), so keys must keep that relative
  // path — e.g. `cluster/post.mdx` -> `/blog/cluster/post/`.
  for (const file of readdirSync(BLOG_DIR, { recursive: true })) {
    const rel = String(file).split(/[\\/]/).join('/');
    if (!/\.mdx?$/.test(rel)) continue;
    const src = readFileSync(join(BLOG_DIR, rel), 'utf8');
    const fm = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const pick = (key) => fm[1].match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'))?.[1]?.trim();
    const lastmod = pick('updated') || pick('date');
    if (lastmod) {
      blogLastmod.set(`/blog/${rel.replace(/\.mdx?$/, '')}/`, lastmod);
      const t = Date.parse(lastmod);
      if (!Number.isNaN(t) && (newestBlogDate === null || t > newestBlogDate)) {
        newestBlogDate = t;
      }
    }
  }
} catch {
  // Non-fatal: sitemap still builds, just without blog <lastmod> values.
}

// --- 2) git last-commit date per page (single call) -----------------------
// `git log` prints newest-first: <ISO committer date> lines followed by the
// files that commit touched. The first time a path appears is its last change.
const pageLastmod = new Map(); // 'src/pages/...' -> ms epoch of last commit
let newestCommitDate = null; // ms epoch of newest commit touching src/pages
try {
  const log = execSync('git log --no-renames --format=%cI --name-only -- ' + PAGES_DIR, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    timeout: 15000, // fail soft instead of hanging the build
    maxBuffer: 16 * 1024 * 1024,
  });
  let current = null;
  for (const line of log.split('\n')) {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(line)) {
      const t = Date.parse(line.trim());
      current = Number.isNaN(t) ? null : t;
      if (current !== null && (newestCommitDate === null || current > newestCommitDate)) {
        newestCommitDate = current;
      }
      continue;
    }
    if (!line.startsWith(PAGES_DIR) || current === null || pageLastmod.has(line)) continue;
    pageLastmod.set(line, current);
  }
} catch {
  // Non-fatal: git may be absent (no .git, shallow CI clone, no binary).
}

// --- page source file -> canonical URL (trailingSlash: 'always') ----------
//   src/pages/index.astro          -> '/'
//   src/pages/about/index.astro    -> '/about/'
//   src/pages/llms.txt.ts          -> '/llms.txt' (endpoint: literal path)
// Dynamic routes ('[...]') are skipped: they resolve per entry, and blog
// entries are already covered by blogLastmod.
const pageUrlOf = (rel) => {
  let p = rel.slice(PAGES_DIR.length);
  if (p.includes('[')) return null;
  if (p.endsWith('.astro')) {
    p = p.slice(0, -'.astro'.length);
    if (p === 'index') return '/';
    if (p.endsWith('/index')) return `/${p.slice(0, -'/index'.length)}/`;
    return `/${p}/`;
  }
  if (p.endsWith('.ts') || p.endsWith('.js')) return `/${p.slice(0, p.lastIndexOf('.'))}`;
  return null; // legacy/foreign files (e.g. old .tsx) never map to live URLs
};

const urlLastmod = new Map(); // '/about/' -> ms epoch
try {
  for (const [file, t] of pageLastmod) {
    // Ignore paths that no longer exist: a file deleted after its page was
    // rewritten must not shadow the live page's date.
    if (!existsSync(join(process.cwd(), file))) continue;
    const url = pageUrlOf(file);
    if (url !== null && !urlLastmod.has(url)) urlLastmod.set(url, t);
  }
} catch {
  // Non-fatal: without this map, pages simply emit no <lastmod>.
}

// Used only when a URL has neither a blog date nor a page date (git
// unavailable, shallow clone, brand-new uncommitted file). Prefers the last
// commit seen, else the newest blog date: both are real content timestamps —
// never build time — so <lastmod> keeps meaning "content changed", not
// "a build ran".
const fallbackLastmod = newestCommitDate ?? newestBlogDate;

// Valid W3C datetime (ISO 8601 with offset / Z), clamped to now so it can
// never be in the future; null when the input is missing or unparseable.
const toLastmod = (value) => {
  try {
    const t = typeof value === 'number' ? value : Date.parse(String(value ?? ''));
    if (Number.isNaN(t)) return null;
    return new Date(Math.min(t, Date.now())).toISOString();
  } catch {
    return null;
  }
};

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
        try {
          const path = new URL(item.url).pathname;
          // Resolve each source through toLastmod() separately: an
          // unparseable blog date must fall through to the page/fallback
          // date (a non-null junk string would otherwise block `??` and
          // suppress <lastmod> entirely).
          const lastmod =
            toLastmod(blogLastmod.get(path)) ??
            toLastmod(urlLastmod.get(path)) ??
            toLastmod(fallbackLastmod);
          if (lastmod) item.lastmod = lastmod;
        } catch {
          // Never fail the build over <lastmod>; the URL is emitted as-is.
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
