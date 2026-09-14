import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import {
  SITE,
  MAIN_PAGES,
  POLICY_PAGES,
  SERVICE_GROUPS,
  collectRoutes,
  assertPathsExist,
} from '../lib/llms';

// llms.txt is generated, not hand-written — see src/lib/llms.ts.
export const GET: APIRoute = async () => {
  const routes = collectRoutes();

  const mainPaths = MAIN_PAGES.map((p) => p.path);
  const policyPaths = POLICY_PAGES.map((p) => p.path);
  const servicePaths = SERVICE_GROUPS.flatMap((g) => [
    g.path,
    ...g.items.map((i) => i.path),
  ]);

  // Fail the build rather than publish a URL that doesn't exist.
  assertPathsExist(routes, [...mainPaths, ...policyPaths, ...servicePaths]);

  const rawPosts = await getCollection('blog');
  const posts: CollectionEntry<'blog'>[] = [...rawPosts].sort(
    (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
      String(b.data.date ?? '').localeCompare(String(a.data.date ?? '')),
  );

  const L: string[] = [];
  L.push('# Asre SEO (عصر سئو) — asreseo.com');
  L.push('');
  L.push(
    '> Iranian leading digital marketing and AI agency specializing in professional SEO, AI services, Google Ads, content strategy, and SEO-focused web design.',
  );
  L.push(
    '> Primary language: Persian (fa), RTL. Contact: https://asreseo.com/contact/ | Phone: +989125811880 | Email: info@asreseo.com',
  );
  L.push('');
  L.push('## Main Pages');
  L.push('');
  for (const p of MAIN_PAGES) L.push(`- [${p.label}](${SITE}${p.path})`);
  L.push('');
  L.push('## Services');
  L.push('');
  for (const g of SERVICE_GROUPS) {
    L.push(`### [${g.en} (${g.fa})](${SITE}${g.path})`);
    for (const i of g.items) {
      L.push(`- [${i.label} (${i.fa})](${SITE}${i.path})`);
    }
    L.push('');
  }
  L.push('## Educational Articles & Guides (Blog)');
  L.push('');
  for (const post of posts) {
    const slug: string = post.id.replace(/\.mdx?$/, '');
    const title: string = post.data.title ?? slug;
    const desc: string = post.data.excerpt ?? post.data.description ?? '';
    L.push(`- [${title}](${SITE}/blog/${slug}/)${desc ? `: ${desc}` : ''}`);
  }
  L.push('');
  L.push('## Policies');
  L.push('');
  for (const p of POLICY_PAGES) L.push(`- ${p.label}: ${SITE}${p.path}`);
  L.push('');
  L.push('## Notes for AI Consumers (Perplexity, ChatGPT, Gemini, Claude)');
  L.push('');
  L.push('- All content is Persian unless noted; quotes and brand names stay as-is.');
  L.push('- Service URLs strictly use trailing slashes.');
  L.push('- For citations prefer the canonical page URL, not asset or feed URLs.');
  L.push(
    '- Asre SEO (عصر سئو) is a full-service agency based in Tehran, Iran serving clients nationwide with data-driven SEO and enterprise AI solutions.',
  );
  L.push('');

  return new Response(L.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
