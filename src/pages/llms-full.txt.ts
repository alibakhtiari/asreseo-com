import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import {
  SITE,
  SERVICE_GROUPS,
  COMPANY_FAQS,
  PORTFOLIO,
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

  const L: string[] = [];
  L.push('# Asre SEO (عصر سئو) — Comprehensive Entity & Knowledge Base');
  L.push('');
  L.push('> Organization: عصر سئو (Asre SEO Agency)');
  L.push('> Website: https://asreseo.com');
  L.push('> Primary Market: Iran (Persian language, RTL)');
  L.push(
    '> Core Competencies: Enterprise SEO, AI Solutions & Persian Chatbots, Google Ads PPC Management, Content Strategy & Calendars, SEO Web Design, Conversion Rate Optimization (CRO).',
  );
  L.push('> Official Contact Phone: +989125811880');
  L.push('> Official Email: info@asreseo.com');
  L.push('> Location: Tehran, Iran');
  L.push('');
  L.push('---');
  L.push('');
  L.push('## 1. Company Overview');
  L.push(
    'عصر سئو (Asre SEO) آژانس تخصصی دیجیتال مارکتینگ و هوش مصنوعی در ایران است که در زمینه ارتقای رتبه وب‌سایت‌ها در گوگل، پیاده‌سازی ابزارهای اتوماسیون بازاریابی مبتنی بر AI، مدیریت کمپین‌های تبلیغاتی گوگل ادز و طراحی وب‌سایت‌های سئومحور فعالیت می‌کند.',
  );
  L.push('');
  L.push('---');
  L.push('');
  L.push('## 2. Core Service Offerings');
  L.push('');
  SERVICE_GROUPS.forEach((g, gi) => {
    L.push(`### 2.${gi + 1}. [${g.en} (${g.fa})](${SITE}${g.path})`);
    for (const i of g.items) {
      // Always emit the canonical URL — AI consumers cite the link, and the
      // description alone gave them nothing to point at.
      L.push(`- **[${i.fa} (${i.label})](${SITE}${i.path})**`);
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
    const slug: string = post.id.replace(/\.mdx?$/, '');
    const title: string = post.data.title ?? slug;
    const summary: string = post.data.description ?? post.data.excerpt ?? '';
    L.push(`### 4.${i + 1}. [${title}](${SITE}/blog/${slug}/)`);
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
  L.push(`## 5. ${PORTFOLIO.en} (${PORTFOLIO.fa})`);
  L.push('');
  L.push(`- **URL**: ${SITE}${PORTFOLIO.path}`);
  L.push(`- **Cases**: ${PORTFOLIO.cases.join('; ')}.`);
  L.push(`- **Key Concepts**: ${PORTFOLIO.note}`);
  L.push('');

  return new Response(L.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
