/**
 * Convert legacy BallisticSearch XML language files to per-section JSON.
 *
 * Source : d:/LEADSONLINE_Project/BallisticSearch_2026_05_26/Languages/<lang>.xml
 * Target : public/locales/<lang>/legacy/<section>.json
 *
 * Schema in:  <profile><section name="X"><entry name="K">V</entry></section></profile>
 * Schema out: { "K": "V", ... }
 *
 * Rules (see docs/i18n/AUDIT.md):
 *  - Drop the `fileinfo` section (not translatable strings)
 *  - Discard `note` attribute on entries
 *  - Preserve `{0}`/`{1}` placeholders and HTML markup verbatim
 *  - Last-write-wins for duplicate keys within a section (C# Dictionary parity)
 *
 * Run:  npx tsx scripts/convertLanguages.ts
 *       npx tsx scripts/convertLanguages.ts --langs=en,vi
 */

import { XMLParser } from 'fast-xml-parser';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const legacyDir = resolve(repoRoot, '../BallisticSearch_2026_05_26/Languages');
const outRoot = resolve(repoRoot, 'public/locales');

const LANG_MAP: Record<string, string> = {
  en: 'en',
  es: 'es',
  ru: 'ru',
  tr: 'tr',
  vn: 'vi',
};

const SKIP_SECTIONS = new Set(['fileinfo']);

type Entry = { name: string; note?: string; '#text'?: string };
type Section = { name: string; entry?: Entry | Entry[] };
type Profile = { profile: { section: Section | Section[] } };

interface ConvertResult {
  langOut: string;
  sectionCount: number;
  entryCount: number;
  files: string[];
}

function parseArgs(argv: string[]): { langs: string[] } {
  const langs: string[] = [];
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--langs=')) {
      langs.push(
        ...arg
          .slice('--langs='.length)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
  }
  return { langs };
}

function asArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

function convertLang(srcCode: string, outCode: string): ConvertResult {
  const xmlPath = resolve(legacyDir, `${srcCode}.xml`);
  const xml = readFileSync(xmlPath, 'utf-8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    textNodeName: '#text',
    parseAttributeValue: false,
    parseTagValue: false,
    trimValues: false,
  });
  const doc = parser.parse(xml) as Profile;

  const sections = asArray(doc.profile?.section);
  const outDir = resolve(outRoot, outCode, 'legacy');

  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const bags = new Map<string, Record<string, string>>();
  for (const section of sections) {
    if (!section?.name || SKIP_SECTIONS.has(section.name)) continue;
    const bag = bags.get(section.name) ?? {};
    for (const e of asArray(section.entry)) {
      if (!e?.name) continue;
      bag[e.name] = e['#text'] ?? '';
    }
    bags.set(section.name, bag);
  }

  const files: string[] = [];
  let totalEntries = 0;
  for (const [name, bag] of bags) {
    writeFileSync(resolve(outDir, `${name}.json`), JSON.stringify(bag, null, 2) + '\n', 'utf-8');
    files.push(`${name}.json`);
    totalEntries += Object.keys(bag).length;
  }

  return { langOut: outCode, sectionCount: files.length, entryCount: totalEntries, files };
}

function main(): void {
  const { langs: requested } = parseArgs(process.argv);
  const pairs: Array<[string, string]> = Object.entries(LANG_MAP).filter(([, out]) =>
    requested.length === 0 ? true : requested.includes(out)
  );

  if (pairs.length === 0) {
    console.error(`No matching langs. Available: ${Object.values(LANG_MAP).join(', ')}`);
    process.exit(1);
  }

  console.log(`Converting from: ${legacyDir}`);
  console.log(`Writing to:      ${outRoot}\n`);

  for (const [src, out] of pairs) {
    try {
      const r = convertLang(src, out);
      console.log(
        `  ${src}.xml → public/locales/${r.langOut}/legacy/  (${r.sectionCount} files, ${r.entryCount} entries)`
      );
    } catch (err) {
      console.error(`  ${src}.xml FAILED: ${(err as Error).message}`);
      process.exitCode = 1;
    }
  }
}

main();
