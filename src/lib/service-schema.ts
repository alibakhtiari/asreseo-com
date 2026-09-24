/**
 * Normalise every `Service` node in a JSON-LD graph before it is serialised.
 *
 * Audit 2026-09-23 (items T9 / D3) measured **92 Service nodes** in the
 * production build and found that every single one declared none of `url`,
 * `image`, `inLanguage` or `@id`, while `areaServed` was written four
 * different ways: `'IR'`, `'Iran'`, `{ '@type': 'Country', name: 'Iran' }`
 * and `'Worldwide'`.
 *
 * `@id` is the load-bearing one: entity resolution ties a Service to its
 * provider through it, so without it the node is effectively unattributable
 * in both Google and the AI crawlers. The four variants of `areaServed` are
 * the same fact spelled differently, which defeats aggregation.
 *
 * Wrapping at the emit site (rather than editing 92 object literals) means a
 * Service added later picks the fields up automatically.
 */

const IRAN = {
  '@type': 'Country',
  name: 'Iran',
  alternateName: 'IR',
  identifier: 'IR',
} as const;

/**
 * `areaServed` accepts `AdministrativeArea | Country | City | GeoCoordinates |
 * Place`. "Worldwide" is not a Country, so it is expressed as a `Place`
 * rather than forced into a Country node that would be false.
 */
const WORLDWIDE = {
  '@type': 'Place',
  name: 'Worldwide',
} as const;

const DEFAULT_AREA = IRAN;
const IN_LANGUAGE = 'fa-IR';

export interface ServiceMetaOptions {
  /** Canonical absolute URL of the page owning this schema. */
  url: string;
  /** Page image — root-relative is accepted and resolved against `url`. */
  image: string;
  /**
   * Fragment prefix for generated `@id`s. Two components emitting Services on
   * the same page must use different prefixes — otherwise they mint identical
   * `@id`s and describe the same entity twice with different properties, which
   * is precisely the ambiguity `@id` exists to remove. Defaults to `service`.
   */
  idNamespace?: string;
}

function absolute(path: string, base: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  let origin: string;
  try {
    origin = new URL(base).origin;
  } catch {
    return path;
  }
  return path.startsWith('/') ? `${origin}${path}` : `${origin}/${path}`;
}

function normaliseArea(value: unknown): unknown {
  if (value && typeof value === 'object') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === 'iran' || v === 'ir') return IRAN;
    if (v === 'worldwide') return WORLDWIDE;
    return { '@type': 'Country', name: value.trim() };
  }
  return DEFAULT_AREA;
}

function isService(node: Record<string, unknown>): boolean {
  const t = node['@type'];
  return t === 'Service' || (Array.isArray(t) && t.includes('Service'));
}

/**
 * Mutates and returns `schema`. A nested Service inherits its nearest
 * ancestor's `areaServed`, so the translation catalog (Worldwide at the top)
 * does not silently re-default its children to Iran.
 */
export function withServiceMeta<T>(schema: T, options: ServiceMetaOptions): T {
  const { url, image, idNamespace = 'service' } = options;
  const resolvedImage = absolute(image, url);
  let seen = 0;

  const walk = (node: unknown, inheritedArea: unknown): unknown => {
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) node[i] = walk(node[i], inheritedArea);
      return node;
    }
    if (node === null || typeof node !== 'object') return node;

    const obj = node as Record<string, unknown>;
    let area = inheritedArea;

    if (isService(obj)) {
      seen += 1;
      area = normaliseArea(obj['areaServed'] !== undefined ? obj['areaServed'] : inheritedArea);
      if (typeof obj['@id'] !== 'string') {
        obj['@id'] =
          seen === 1 ? `${url}#${idNamespace}` : `${url}#${idNamespace}-${seen}`;
      }
      if (typeof obj['url'] !== 'string') obj['url'] = url;
      if (typeof obj['image'] !== 'string') obj['image'] = resolvedImage;
      if (typeof obj['inLanguage'] !== 'string') obj['inLanguage'] = IN_LANGUAGE;
      obj['areaServed'] = area;
    }

    for (const key of Object.keys(obj)) obj[key] = walk(obj[key], area);
    return obj;
  };

  return walk(schema, undefined) as T;
}
