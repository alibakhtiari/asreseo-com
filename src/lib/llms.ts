// Single source of truth for llms.txt / llms-full.txt.
//
// These files used to be hand-written in `public/`, which meant they drifted
// silently: renaming a blog slug (as happened with the three `-2024` posts) or
// adding a service page left the AI-consumer files pointing at stale URLs.
// They are now generated at build time, and every hard-coded URL is validated
// against the real page routes — a broken link fails the build instead of
// quietly shipping.

export const SITE = 'https://asreseo.com';

/** Static routes that exist as .astro pages, derived at build time. */
export function collectRoutes(): Set<string> {
  const routes = new Set<string>();
  const pages = import.meta.glob('/src/pages/**/*.astro');
  for (const key of Object.keys(pages)) {
    let p = key.replace('/src/pages', '').replace(/\.astro$/, '');
    if (p.endsWith('/index')) p = p.slice(0, -'/index'.length);
    if (p === '') p = '/';
    if (!p.endsWith('/')) p += '/';
    // Dynamic routes ([slug], [...path]) can't be resolved to one URL.
    if (p.includes('[')) continue;
    routes.add(p);
  }
  return routes;
}

export interface Link {
  label: string;
  path: string;
}

export interface ServiceItem extends Link {
  /** Short label */
  shortLabel?: string;
  /** Long description, used only by llms-full.txt. */
  blurb?: string;
}

export interface ServiceGroup {
  en: string;
  path: string;
  items: ServiceItem[];
}

export const MAIN_PAGES: Link[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about/' },
  { label: 'Services Overview', path: '/services/' },
  { label: 'Blog', path: '/blog/' },
  { label: 'Portfolio', path: '/portfolio/' },
  { label: 'FAQ', path: '/faq/' },
  { label: 'Free Consultation', path: '/consultation/' },
  { label: 'Contact', path: '/contact/' },
  { label: 'Support', path: '/support/' },
  { label: 'HTML Sitemap', path: '/sitemap/' },
];

export const POLICY_PAGES: Link[] = [
  { label: 'Privacy', path: '/privacy/' },
  { label: 'Terms', path: '/terms/' },
];

export const AUTOMATION_INFRASTRUCTURE = {
  n8nInstance: {
    label: 'n8n Workflow Automation Engine',
    url: 'https://n8n.asreseo.com',
    description:
      'High-throughput self-hosted workflow automation cluster orchestrating SEO telemetry triggers, webhook ingestion, AI content pipelines, and automated Google indexing alerts.',
  },
  customNodes: [
    {
      name: 'n8n-nodes-avvalai',
      author: 'Ali Bakhtiari',
      url: 'https://github.com/alibakhtiari/n8n-nodes-avvalai',
      description:
        'Open-source custom n8n community node providing seamless enterprise integration between n8n workflows and AvvalAI intelligence services for multimodal LLM completion, embeddings, and chat flows.',
    },
    {
      name: 'n8n-nodes-imagerouter',
      author: 'Ali Bakhtiari',
      url: 'https://github.com/alibakhtiari/n8n-nodes-imagerouter',
      description:
        'Open-source custom n8n node extension engineered for high-throughput conditional image routing, compression, and AI vision dispatching.',
    },
  ],
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    en: 'AI Services',
    path: '/services/ai/',
    items: [
      {
        label: 'AI Content Creation',
        path: '/services/ai/content-creation/',
        blurb:
          'SEO-focused articles, scriptwriting and promo videos combining generative AI with expert human review to avoid Google algorithmic penalties.',
      },
      {
        label: 'AI Analysis & Strategy',
        path: '/services/ai/analysis-strategy/',
        blurb:
          'Google ranking optimization with AI algorithms, real-time competitor behavior analysis, keyword monitoring and conversion rate optimization (CRO).',
      },
      {
        label: 'AI Marketing & Engagement',
        path: '/services/ai/marketing-engagement/',
        blurb:
          'Smart chatbots for 24/7 support, email and SMS automation, and personalized customer experiences powered by self-hosted n8n workflows.',
      },
    ],
  },
  {
    en: 'Content Marketing & Strategy',
    path: '/services/content/',
    items: [
      {
        label: 'Content Calendar & Scheduling',
        path: '/services/content/content-calendar/',
        blurb:
          'Monthly and seasonal publishing plans for websites and social channels for consistency, steady engagement and an automated content cycle.',
      },
      {
        label: 'Text Content',
        path: '/services/content/text-content/',
        blurb:
          'Specialized original articles, press releases and landing-page copy based on deep keyword research and Google E-E-A-T quality guidelines.',
      },
      {
        label: 'Visual Content',
        path: '/services/content/visual-content/',
        blurb:
          'Data-driven infographics, motion graphics and custom video teasers.',
      },
      {
        label: 'Social Media Content',
        path: '/services/content/social-media-content/',
      },
      {
        label: 'Translation & Localization',
        path: '/services/content/translation/',
      },
    ],
  },
  {
    en: 'SEO',
    path: '/services/seo/',
    items: [
      {
        label: 'Content & Page Authority',
        path: '/services/seo/content-authority/',
        blurb:
          'Topic-cluster strategy, pillar-page writing, quality backlinks and targeted advertorials to grow authority.',
      },
      {
        label: 'Technical & On-Page SEO',
        path: '/services/seo/technical-onpage/',
        blurb:
          'Site speed and Core Web Vitals optimization, crawlability and indexability fixes, schema (JSON-LD) structuring and standard information architecture.',
      },
      {
        label: 'Local SEO',
        path: '/services/seo/local-seo/',
        blurb:
          'Google Maps listing and optimization, winning regional customers and more local calls.',
      },
    ],
  },
  {
    en: 'Marketing & Google Ads',
    path: '/services/marketing/',
    items: [
      {
        label: 'Google Ads',
        path: '/services/marketing/google-ads/',
        blurb:
          'Expert management of Google Ads Search, Display and Remarketing campaigns with low cost per click (CPC) and high conversion rates.',
      },
      {
        label: 'Social Media Marketing',
        path: '/services/marketing/social-media/',
      },
      {
        label: 'Email Marketing',
        path: '/services/marketing/email-marketing/',
      },
      {
        label: 'Sales Funnel Management',
        path: '/services/marketing/sales-funnel-management/',
        blurb:
          'Design and implementation of multi-stage sales funnels (sales funnel optimization).',
      },
      {
        label: 'Integrated Campaigns',
        path: '/services/marketing/integrated-campaigns/',
        blurb:
          'Integrated omnichannel advertising campaign management.',
      },
    ],
  },
  {
    en: 'Web Design & Development',
    path: '/services/web/',
    items: [
      {
        label: 'SEO Web Design',
        path: '/services/web/seo-web-design/',
        blurb:
          'Modern, fast, responsive websites built on technical SEO principles, UX architecture and high-converting landing pages.',
      },
      {
        label: 'Landing Pages',
        path: '/services/web/landing-pages/',
      },
      {
        label: 'UX Architecture',
        path: '/services/web/ux-architecture/',
      },
      {
        label: 'Website Speed',
        path: '/services/web/website-speed/',
      },
    ],
  },
];

/** Company-level Q&As used by llms-full.txt (direct answers for AI citation). */
export const COMPANY_FAQS: { q: string; a: string }[] = [
  {
    q: 'How long does SEO take to work?',
    a: 'SEO strategies typically take 3 to 6 months to show stable results and strong growth in Google first-page rankings.',
  },
  {
    q: 'How is AI used in SEO?',
    a: 'At AsreSEO, AI analyzes large Search Console datasets, identifies user search patterns, accelerates first-draft content production and forecasts market trends — with all output reviewed by SEO specialists.',
  },
  {
    q: 'What are the benefits of a content calendar for business?',
    a: 'A content calendar boosts user engagement through publishing discipline, team organization, full topic-cluster keyword coverage and alignment with seasonal sales events.',
  },
  {
    q: 'How is SEO pricing calculated?',
    a: 'Pricing depends on the current state of the website, keyword competition, technical SEO needs and content/link-building volume, in monthly or custom packages. The initial consultation at AsreSEO is free.',
  },
];

/** Portfolio cases, listed for AI consumers that summarise proof of work. */
export const PORTFOLIO = {
  path: '/portfolio/',
  en: 'Portfolio — Real AI & Automation Case Studies',
  cases: [
    'Legal RAG chatbot over statutory sources',
    'AI call-center with VoIP transcription + smart forwarding',
    'Automated SEO monitoring with alerts',
    'Content pipeline automation with n8n and custom nodes',
    'Ads reporting automation',
  ],
  note: 'Each case covers challenges, actions, technologies and results, with related service links and ItemList schema.',
};

/**
 * Validate every hard-coded path against the real page routes.
 * Throws so `astro build` fails loudly instead of shipping a dead link to
 * Perplexity / ChatGPT / Gemini.
 */
export function assertPathsExist(routes: Set<string>, paths: string[]): void {
  const missing = paths.filter((p) => !routes.has(p));
  if (missing.length) {
    throw new Error(
      `llms.txt references ${missing.length} path(s) with no matching page in src/pages: ${missing.join(', ')}\n` +
        `Fix src/lib/llms.ts or create the missing page.`,
    );
  }
}
