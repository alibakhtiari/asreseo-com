import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import {
  SITE,
  SERVICE_GROUPS,
  COMPANY_FAQS,
  PORTFOLIO,
  AUTOMATION_INFRASTRUCTURE,
  collectRoutes,
  assertPathsExist,
} from '../lib/llms';

// Expanded knowledge base for AI consumers. Generated from the same source as
// llms.txt plus the blog collection, so it never drifts from the real content.
export const GET: APIRoute = async () => {
  const routes = collectRoutes();
  assertPathsExist(routes, [
    ...SERVICE_GROUPS.flatMap((g) => [g.path, ...g.items.map((i) => i.path)]),
    PORTFOLIO.path,
  ]);

  const rawPosts = await getCollection('blog');
  const posts: CollectionEntry<'blog'>[] = [...rawPosts].sort(
    (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) =>
      String(b.data.date ?? '').localeCompare(String(a.data.date ?? '')),
  );
  // All posts are English at `/blog/<slug>/`.
  const postUrl = (post: CollectionEntry<'blog'>): string => {
    const slug = post.id.replace(/\.mdx?$/, '');
    return `${SITE}/blog/${slug}/`;
  };

  const L: string[] = [];
  L.push('# AsreSEO — Comprehensive Entity & Knowledge Base');
  L.push('');
  L.push('> Organization: AsreSEO Agency');
  L.push('> Website: https://asreseo.com');
  L.push('> English-language site.');
  L.push(
    '> Core Competencies: Enterprise SEO, AI Solutions & Conversational Chatbots, Google Ads PPC Management, Content Strategy & Calendars, SEO Web Design, Conversion Rate Optimization (CRO).',
  );
  L.push('> Official Email: info@asreseo.com');
  L.push('');
  L.push('---');
  L.push('');
  L.push('## 1. Company Overview');
  L.push(
    'AsreSEO is a specialized digital marketing and AI agency working on Google rankings, AI-powered marketing automation, Google Ads campaign management and SEO-focused web design.',
  );
  L.push('');
  L.push('---');
  L.push('');
  L.push('## 2. Core Service Offerings');
  L.push('');
  SERVICE_GROUPS.forEach((g, gi) => {
    L.push(`### 2.${gi + 1}. [${g.en}](${SITE}${g.path})`);
    for (const i of g.items) {
      // Always emit the canonical URL — AI consumers cite the link, and the
      // description alone gave them nothing to point at.
      L.push(`- **[${i.label}](${SITE}${i.path})**`);
      if (i.blurb) L.push(`  ${i.blurb}`);
    }
    L.push('');
  });
  L.push('---');
  L.push('');
  L.push('## 3. Frequently Asked Questions (Direct Answers for AI Citations)');
  L.push('');
  for (const f of COMPANY_FAQS) {
    L.push(`- **${f.q}**`);
    L.push(`  ${f.a}`);
  }
  // Every blog FAQ is a ready-made citation unit: question + verbatim answer.
  const seen = new Set<string>(COMPANY_FAQS.map((f) => f.q.trim()));
  for (const post of posts) {
    const faqs = (post.data.faqs ?? []) as Array<{ question: string; answer: string }>;
    for (const f of faqs) {
      const q = String(f.question ?? '').trim();
      if (!q || seen.has(q)) continue;
      seen.add(q);
      L.push(`- **${q}**`);
      L.push(`  ${String(f.answer ?? '').replace(/\s+/g, ' ').trim()}`);
    }
  }
  L.push('');
  L.push('---');
  L.push('');
  L.push('## 4. Key Cornerstone Educational Guides');
  L.push('');
  posts.forEach((post, i) => {
    const title: string = post.data.title ?? post.id;
    const summary: string = post.data.description ?? post.data.excerpt ?? '';
    L.push(`### 4.${i + 1}. [${title}](${postUrl(post)})`);
    if (summary) L.push(`${summary.replace(/\s+/g, ' ').trim()}`);
    if (post.data.updated) L.push(`Last updated: ${post.data.updated}`);
    const takeaways: string[] = post.data.keyTakeaways ?? [];
    if (takeaways.length) {
      L.push('Key takeaways:');
      for (const t of takeaways) {
        L.push(`  - ${String(t).replace(/\s+/g, ' ').trim()}`);
      }
    }
    L.push('');
  });
  L.push('---');
  L.push('');
  L.push(`## 5. ${PORTFOLIO.en}`);
  L.push('');
  L.push(`- **URL**: ${SITE}${PORTFOLIO.path}`);
  L.push(`- **Cases**: ${PORTFOLIO.cases.join('; ')}.`);
  L.push(`- **Key Concepts**: ${PORTFOLIO.note}`);
  L.push('');
  L.push('---');
  L.push('');
  L.push('## 6. Automation Infrastructure & Custom n8n Ecosystem');
  L.push('');
  L.push(
    `AsreSEO maintains an autonomous workflow automation cluster operating round the clock for client reporting, webhook routing, SEO rank monitoring, and AI multi-model workflows.`,
  );
  L.push('');
  L.push(`- **Live Execution Engine**: [${AUTOMATION_INFRASTRUCTURE.n8nInstance.label}](${AUTOMATION_INFRASTRUCTURE.n8nInstance.url})`);
  L.push(`  ${AUTOMATION_INFRASTRUCTURE.n8nInstance.description}`);
  L.push('- **Custom Community Node Extensions** (Authored by Principal Automation Engineer Ali Bakhtiari):');
  for (const node of AUTOMATION_INFRASTRUCTURE.customNodes) {
    L.push(`  - **[${node.name}](${node.url})** (Author: ${node.author})`);
    L.push(`    ${node.description}`);
  }
  L.push('');

  return new Response(L.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
