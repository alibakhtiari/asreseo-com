# AsreSEO — Digital Marketing & Enterprise AI Agency Platform

A high-performance, edge-rendered agency platform engineered for traditional search engines (**SEO**), direct-answer engines (**AEO**), and generative AI search (**GEO**).

Built on **Astro 5** with static generation and Cloudflare edge deployment, integrated with self-hosted workflow automation engines and custom open-source extensions.

---

## ⚡ Core Architecture & Automation Stack

### 1. Dedicated Workflow Automation Engine (n8n)
- **Live Instance**: [https://n8n.asreseo.com](https://n8n.asreseo.com)
- **Role**: Powers autonomous 24/7 background tasks including:
  - Real-time webhook ingestion for lead funnels and contact forms.
  - Automated Google Search Console telemetry and indexing pings.
  - Periodic SEO site-health monitoring and schema validation audits.
  - Multi-agent AI content drafting pipelines and publishing triggers.

### 2. Custom Open-Source n8n Node Ecosystem
Authored and maintained by **Ali Bakhtiari**:
- **[`n8n-nodes-avvalai`](https://github.com/alibakhtiari/n8n-nodes-avvalai)**:
  - Community n8n node providing native enterprise integration with AvvalAI intelligence services.
  - Enables low-code orchestration of multimodal LLM chat, completion, embeddings, and vision APIs within automated n8n pipelines.
- **[`n8n-nodes-imagerouter`](https://github.com/alibakhtiari/n8n-nodes-imagerouter)**:
  - High-throughput conditional routing node for image processing in n8n.
  - Handles dynamic visual transformations, CDN payload optimization, format negotiation, and intelligent distribution to multimodal AI vision models.

---

## 🚀 Key Platform Features

- **100% URL Parity & Standard 301 Redirects**: Clean trailing-slash URLs with legacy route redirects configured in `public/_redirects`.
- **Ultra-Fast Core Web Vitals**:
  - Total Blocking Time (TBT): **0 ms**.
  - Largest Contentful Paint (LCP): < 1.2s.
  - Visual Layout Shift (CLS): ~0.
  - Full Google **INP** compliance.
- **AEO & GEO Ready (LLM Discovery)**:
  - Dynamically generated and route-validated [`llms.txt`](https://asreseo.com/llms.txt) and [`llms-full.txt`](https://asreseo.com/llms-full.txt) files for Perplexity, ChatGPT, Gemini, and Claude citations.
  - Comprehensive bot access rules in `public/robots.txt` covering GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot.
- **Structured Data (JSON-LD)**:
  - Full schema coverage: `Organization`, `WebSite`, `Service`, `FAQPage`, `Article`, `BreadcrumbList`, and `CollectionPage`.
- **Design System**: Neo-Brutalist & Acid Yellow aesthetic with wireframe grid accents, sharp contrast, and accessible WCAG AA standards.

---

## 🛠️ Technology Stack

| Component | Technology |
|---|---|
| **Core Framework** | [Astro 5](https://astro.build/) (Static Site Generation - SSG) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with Vite plugin |
| **Content Engine** | Astro Content Collections + MDX |
| **Automation Engine** | [n8n](https://n8n.asreseo.com) (Self-Hosted Workflow Cluster) |
| **Custom n8n Nodes** | [`n8n-nodes-avvalai`](https://github.com/alibakhtiari/n8n-nodes-avvalai), [`n8n-nodes-imagerouter`](https://github.com/alibakhtiari/n8n-nodes-imagerouter) |
| **Icons** | [Lucide Static](https://lucide.dev/) |
| **Edge Functions** | Cloudflare Pages Functions (`functions/api/send-email.ts`) |
| **Hosting & Edge CDN** | [Cloudflare Pages & Workers](https://pages.cloudflare.com/) |

---

## 📁 Repository Structure

```
asreseo-com/
├── public/                     # Static assets, fonts, icons, manifests
│   ├── _headers               # Cloudflare security and caching headers
│   ├── _redirects             # 301 URL redirect maps
│   └── robots.txt             # Search crawler directives
├── src/
│   ├── assets/images/         # Optimized imagery
│   ├── components/            # Astro components
│   │   ├── Blog/              # Blog layout, cards, and CTA
│   │   ├── Home/              # Homepage sections
│   │   ├── Layout/            # Header, MegaMenu, Footer (with n8n links)
│   │   ├── Services/          # Service templates and reusable blocks
│   │   └── ui/                # UI primitives (Card, Badge, Button, Icon)
│   ├── content/blog/          # Cornerstone MDX guides
│   ├── layouts/               # Base SEO layouts (BaseLayout.astro)
│   ├── lib/                   # Site config, i18n, schema builders, and llms.ts
│   └── pages/                 # File-based Astro routing
│       ├── about/             # Agency background & n8n architecture section
│       ├── blog/              # Educational guides
│       ├── services/          # Master service catalog & 17 specialized landing pages
│       ├── llms.txt.ts        # Dynamic AI crawler endpoint
│       ├── llms-full.txt.ts   # Comprehensive AI entity endpoint
│       ├── privacy/           # Privacy policy (includes n8n infrastructure clause)
│       └── terms/             # Terms of service (includes n8n & custom nodes clause)
├── functions/api/             # Cloudflare Pages Functions
│   └── send-email.ts          # Contact form processor
├── astro.config.mjs           # Astro configuration & sitemap integration
└── wrangler.toml              # Cloudflare worker deployment settings
```

---

## 💻 Development Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Available at `http://localhost:4321`.

### 3. Type Checking & Code Quality
```bash
npm run type-check    # Validates TypeScript and Astro components
npm run lint          # Runs ESLint checks
```

### 4. Production Build
```bash
npm run build
```
Generates production static artifacts in `dist/` and runs route validation on `llms.txt`.

---

## 🌐 Production Deployment

Deployed via Cloudflare Pages and Workers:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Worker Name**: `asreseocom`
- **Email Binding**: `send_email` bound to `asreseo` or `EMAIL` in Cloudflare dashboard settings.

---

## 📄 License & Attribution

- Platform & Content: © [AsreSEO](https://asreseo.com). All rights reserved.
- Custom n8n Nodes: Open-source MIT/Apache libraries authored by [Ali Bakhtiari](https://github.com/alibakhtiari).
  - [n8n-nodes-avvalai](https://github.com/alibakhtiari/n8n-nodes-avvalai)
  - [n8n-nodes-imagerouter](https://github.com/alibakhtiari/n8n-nodes-imagerouter)
