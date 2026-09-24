import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Blog posts live in src/content/blog/<slug>.md(x) — same slugs as before
// (/blog/seo-guide etc.), rendered with Astro content collections + MDX.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Optional short form for the <title> tag only. `post.title` is also the
    // on-page H1, the JSON-LD headline and the breadcrumb label, so lengthening
    // it is a content decision — but a title TAG past ~60 chars is truncated in
    // the SERP. Persian renders wide, so 55-60 is the practical ceiling: when
    // `title` overshoots it, `seoTitle` carries the tag while the H1 keeps the
    // full headline. Absent a value the tag falls back to `title`.
    seoTitle: z.string().optional(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    author: z.string().optional(),
    date: z.string().optional(),
    updated: z.string().optional(),
    image: z.string().optional(),
    keywords: z.string().optional(),
    // Rendered by BlogPost.astro as the key-takeaways card and FAQ accordion.
    // Kept in frontmatter (not in the MDX body) so each block appears once.
    keyTakeaways: z.array(z.string()).optional(),
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    // --- P1.8: fields that existed in the MDX frontmatter but were missing
    // from this schema, so Zod silently stripped them at parse time and
    // BlogPost.astro rendered `tags: []`, no ویژه badge, and empty read time.
    // All optional: posts that omit them still parse.
    // Tags are written as a YAML array; tolerate a comma-separated string too
    // (`tags: سئو, تولید محتوا`) so a differently-shaped post can't fail the
    // build or hand `.map()` a string.
    tags: z
      .union([z.array(z.string()), z.string()])
      .optional()
      .transform((v) => {
        if (v === undefined) return undefined;
        const list = Array.isArray(v) ? v : v.split(',');
        return list.map((t) => t.trim()).filter(Boolean);
      }),
    // YAML `true`/`false` parse to booleans; quoted "true"/"false" arrive as
    // strings. Normalise to a real boolean so consumers can test truthiness
    // without a stray `"false"` reading as true.
    featured: z
      .union([z.boolean(), z.enum(['true', 'false'])])
      .optional()
      .transform((v) => {
        if (v === undefined) return undefined;
        return v === true || v === 'true';
      }),
    // Rendered as a Persian read-time label; may be "۱۴ دقیقه" or a bare
    // number of minutes (`readTime: 14`), so accept both and store a string.
    readTime: z
      .union([z.string(), z.number()])
      .optional()
      .transform((v) => (v === undefined ? undefined : String(v).trim())),
    // `slug` is deliberately NOT declared here. Routes are built from
    // `entry.id` (src/pages/blog/[slug].astro), and both blog/index.astro and
    // [slug].astro derive `post.slug` from entry.id — frontmatter slug never
    // affects routing. Omitting it keeps it inert (Zod strips unknown keys)
    // instead of introducing a second, competing source of truth for URLs.
  }),
});

export const collections = { blog };
