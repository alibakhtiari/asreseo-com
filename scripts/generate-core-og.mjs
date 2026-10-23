import path from 'node:path';
import { buildOgSvg, renderCardPair } from './generate-og-image.mjs';

const corePages = [
  {
    base: 'public/og/faq-hero',
    title: 'SEO & Search Architecture FAQ',
    eyebrow: '[FAQ // KNOWLEDGE_BASE]',
    descLine1: 'Definitive technical and strategic answers on algorithmic SEO, AEO/GEO,',
    descLine2: 'Google Ads budget economics, Core Web Vitals, and agency SLAs.',
    tag1: 'SEO Timeline',
    tag1Sub: '2-3mo early, 6mo stable',
    tag2: 'White-Hat SLA',
    tag2Sub: 'Strict algorithm adherence',
    tag3: 'Pricing Models',
    tag3Sub: 'Transparent milestone contracts',
  },
  {
    base: 'public/og/consultation-hero',
    title: 'Executive Technical Consultation',
    eyebrow: '[CONSULTATION // AUDIT_DISPATCH]',
    descLine1: 'Zero-obligation architectural audit and search engine growth roadmap.',
    descLine2: 'Direct collaboration with principal SEO architects & AI engineers.',
    tag1: 'Full Audit',
    tag1Sub: 'Technical & crawl health check',
    tag2: 'Growth Matrix',
    tag2Sub: 'Competitor gap classification',
    tag3: '100% Free',
    tag3Sub: 'Before any contract commitment',
  },
  {
    base: 'public/og/support-hero',
    title: 'Support SLA & System Telemetry',
    eyebrow: '[SUPPORT // CLIENT_SLA]',
    descLine1: 'Continuous uptime telemetry, search console health monitoring,',
    descLine2: 'security vulnerability defense, and rapid deployment engineering.',
    tag1: 'Uptime SLA',
    tag1Sub: '99.99% edge availability',
    tag2: 'GSC Telemetry',
    tag2Sub: 'Continuous index monitoring',
    tag3: 'Fast Turnaround',
    tag3Sub: 'Dedicated senior engineers',
  },
  {
    base: 'public/og/legal-hero',
    title: 'Privacy Policy & Terms of Service',
    eyebrow: '[LEGAL // DATA_GOVERNANCE]',
    descLine1: 'Transparent data governance, privacy compliance, and service terms.',
    descLine2: 'Engineered for international compliance with zero unauthorized data sharing.',
    tag1: 'Data Privacy',
    tag1Sub: 'Zero unauthorized third-party sharing',
    tag2: 'GDPR / CCPA',
    tag2Sub: 'Privacy by design',
    tag3: 'Service Terms',
    tag3Sub: 'Transparent client rights',
  },
];

async function main() {
  console.log('Generating Core Pages OG cards...');
  for (const page of corePages) {
    const svg = buildOgSvg(page);
    await renderCardPair(svg, path.resolve(page.base));
  }
  console.log('Core Pages OG cards complete.');
}

main().catch(console.error);
