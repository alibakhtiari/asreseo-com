#!/usr/bin/env node
/**
 * verify-claims.mjs — fail the build if an unverifiable numeric claim creeps
 * back into `src/`.
 *
 * WHY THIS EXISTS
 * A one-off audit (audit/claim-inventory-2026-09-23.md) found 269 numeric
 * performance claims across 35 files. They fell into two classes:
 *
 *   1. Company self-claims («۵۰۰+ پروژه», «۹۸٪ رضایت») — unsourceable by
 *      definition, and mostly fabricated. These are now either gated on
 *      `verified` in src/lib/site-claims.ts or written qualitatively.
 *   2. Industry statistics that were never sourced.
 *
 * The audit's FIRST scan only looked for the `%` / `٪` / `+` characters and
 * silently missed three whole classes: the Persian word «درصد», `+` as a
 * PREFIX (`+۳۲۰%`), and multipliers (`۵ برابر`). This script encodes all of
 * them so a future edit cannot reintroduce what was removed.
 *
 * ALLOWED END-STATES for any number (see audit/claim-inventory-2026-09-23.md):
 *   GATED      — rendered only when verified: true in site-claims.ts
 *   QUALITATIVE— digit removed, process/measurement fact kept
 *   SOURCED    — a real primary source cited inline
 *
 * USAGE
 *   node scripts/verify-claims.mjs          # scan, exit 1 on any hit
 *   node scripts/verify-claims.mjs --list   # include the matched text
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'src');
const LIST = process.argv.includes('--list');

/** Every shape an unverified claim can take. */
const PATTERNS = [
  ['percent-char', /[۰-۹]{1,4}\s*[%٪]|[0-9]{1,4}\s*[%٪]/u],
  ['plus-suffix', /[۰-۹]{1,4}\+/u],
  ['plus-prefix', /\+\s*[۰-۹]{1,4}/u],
  ['percent-word', /[۰-۹]{1,4}\s*(?:تا\s*[۰-۹]{1,4}\s*|الی\s*[۰-۹]{1,4}\s*)?(?:درصد|بسته)/u],
  ['percent-till', /تا\s*[۰-۹]{1,4}\s*(?:درصد|[%٪])/u],
  ['multiplier', /[۰-۹]{1,4}\s*(?:تا\s*[۰-۹]{1,4}\s*)?(?:برابر|مرتبه)/u],
  ['latin-multiplier', /(?<![A-Za-z0-9])[0-9]{1,4}\s*[xX]\b(?![A-Za-z])/u],
  ['elapsed-count', /[۰-۹]{1,4}\s*(?:سال|دهه)\b/u],
];

/**
 * Structural numbers that are NOT claims. Matched against the whole line — if
 * any of these appear, the line is skipped regardless of what else it holds.
 */
const STRUCTURAL =
  /index\s*\+\s*1|tel:|\+989|wa\.me|text=%|%2[0-9A-F]|%D[0-9A-F]|\d+%2|px-\[|px-|grid-cols|viewBox|stroke-|left-\[|right-\[|animation-delay|animation:|aspect-ratio|grid-cols|delay-\d|font-\[|w-\[|h-\[|max-w-\[|radix|z-\[|24\/۷|۲۴\/۷|۳۶۰ درجه/i;

/** A line whose digits are a corroborated date rather than a statistic. */
const DATES = /[۰-۹]{4}\s*(?:تا|الی|-|—)\s*[۰-۹]{4}|سال\s*[۰-۹]{4}|[۰-۹]{4}\s*(?:تومان|ریال)|از سال\s*[۰-۹]{4}/u;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(astro|mdx)$/.test(entry)) out.push(full);
  }
  return out;
}

/** Strip HTML/JS comments so audit history and inline notes never count. */
function stripComments(line) {
  return line
    .replace(/<!--.*?-->/gu, '')
    .replace(/^\s*(?:\/\/|\*|\/\*|#).*/u, '')
    .replace(/\{\s*\/\*.*?\*\/\s*\}/gu, '');
}

const hits = [];
for (const file of walk(ROOT)) {
  const rel = path.relative(process.cwd(), file);
  const lines = readFileSync(file, 'utf8').split('\n');
  let inBlockComment = false;
  let inHtmlComment = false;
  let inFence = false;

  // SOURCED end-state. A citation can sit three places: inline after the
  // number `(Wyzowl، ۲۰۲۶: https://…)`, in the paragraph four lines ABOVE a
  // table's rows, or in a `منبع جدول:` footnote a couple of lines BELOW them.
  // Accept an absolute https:// anywhere within CITE_WINDOW lines.
  // 7 = longest observed distance: a six-row table's FIRST row to its footnote
  // (ai-seo-guide L137 -> L144). Shrinking this re-flags a correctly cited row.
  // Relative links (`/services/...`) deliberately do NOT count — only an
  // external source can vouch for a number.
  const CITE_WINDOW = 7;
  const cited = new Set();
  lines.forEach((l, i) => {
    if (/https:\/\//.test(l)) cited.add(i + 1);
  });
  const isSourced = (n) => [...cited].some((c) => Math.abs(c - n) <= CITE_WINDOW);

  lines.forEach((raw, idx) => {
    const lineNo = idx + 1;
    if (/^\s*\/\*/.test(raw)) inBlockComment = true;
    if (inBlockComment) {
      if (/\*\//.test(raw)) inBlockComment = false;
      return;
    }
    // MDX fenced code blocks are illustrative samples (e.g. `discount: '15%'`
    // inside an audience-segmentation snippet). Demo data is not a claim, and
    // rewriting it would destroy the teaching example.
    if (/^\s*(```|~~~)/.test(raw)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;
    // HTML comments often span many lines (the audit-history notes do). Track
    // entry and exit so their contents never count as rendered copy.
    let line = raw;
    if (inHtmlComment) {
      const end = line.indexOf('-->');
      if (end === -1) return;
      line = line.slice(end + 3);
      inHtmlComment = false;
    }
    const open = line.indexOf('<!--');
    if (open !== -1) {
      const close = line.indexOf('-->', open);
      if (close === -1) {
        inHtmlComment = true;
        line = line.slice(0, open);
      } else {
        line = line.slice(0, open) + line.slice(close + 3);
      }
    }
    line = stripComments(line);
    if (!line.trim()) return;
    if (STRUCTURAL.test(line)) return;
    if (DATES.test(line)) return;
    if (isSourced(lineNo)) return; // SOURCED — a real source vouches for it

    for (const [kind, re] of PATTERNS) {
      const m = line.match(re);
      if (m) {
        hits.push({ file: rel, line: lineNo, kind, match: m[0], text: line.trim().slice(0, 140) });
        break;
      }
    }
  });
}

if (hits.length === 0) {
  console.log('verify-claims: OK — no unverifiable numeric claims in src/');
  process.exit(0);
}

const byFile = new Map();
for (const h of hits) byFile.set(h.file, (byFile.get(h.file) ?? 0) + 1);

console.error(`verify-claims: ${hits.length} unverified numeric claim(s) in ${byFile.size} file(s)\n`);
for (const [file, n] of [...byFile].sort((a, b) => b[1] - a[1])) {
  console.error(`  ${String(n).padStart(3)}  ${file}`);
  if (LIST) {
    for (const h of hits.filter((x) => x.file === file)) {
      console.error(`         L${h.line} [${h.kind}] ${JSON.stringify(h.match)}`);
      console.error(`             ${h.text}`);
    }
  }
}
console.error(
  '\nEach must end in GATED (verified: true in src/lib/site-claims.ts), QUALITATIVE, or SOURCED.\n' +
    'See audit/claim-inventory-2026-09-23.md for the doctrine.',
);
process.exit(1);
