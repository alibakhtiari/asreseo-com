import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Blog posts live in src/content/blog/<slug>.md(x) — same slugs as before
// (/blog/seo-guide etc.), rendered with Astro content collections + MDX.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
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
  }),
});

export const collections = { blog };
