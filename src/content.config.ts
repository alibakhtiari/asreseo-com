import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Blog posts live in src/content/blog/<slug>.md(x) — same slugs as before
// (/blog/seo-guide-2024 etc.), rendered with Astro content collections + MDX.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    author: z.string().optional(),
    date: z.string().optional(),
    image: z.string().optional(),
    keywords: z.string().optional(),
  }),
});

export const collections = { blog };
