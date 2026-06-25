# Legacy i18n XML Audit

**Source**: `d:/LEADSONLINE_Project/BallisticSearch_2026_05_26/Languages/`
**Generated**: Step 29 (Wave A — W1)

## Reality check vs. plan

WAVE_A_EXECUTION.md said "50 languages" and "primary 5 = en/es/fr/de/vi". Reality:

- **5 language files** exist on disk: `en`, `es`, `ru`, `tr`, `vn`
- `fr` and `de` do not exist in legacy
- `vn` is Vietnamese — maps to ISO code `vi` in i18next
- `en_dev.xml` is a near-duplicate of `en.xml` (dev/translator working copy) — ignored
- `en.json` already in legacy dir is a broken naive xml2js dump (keys lost) — ignored

**Pivot**: convert the 5 real langs. Primary set becomes **en, es, ru, tr, vi**.

## XML schema

```xml
<?xml version="1.0" encoding="utf-8" ?>
<profile>
  <section name="login-page">
    <entry name="login">Login</entry>
    <entry note="update" name="username">Username</entry>
    ...
  </section>
  ...
</profile>
```

- Root: `<profile>`
- One `<section name="...">` per logical namespace
- `<entry name="key">value</entry>` — flat key/value within a section
- `note` attribute is metadata (translator workflow), discarded
- Values may contain HTML entity-escaped markup (`&lt;br&gt;`, `&lt;strong&gt;`) and `{0}` `{1}` C#-style placeholders
- Some entries have duplicate names within the same section (last one wins in C#; we'll keep last for parity)

## Per-file totals

| File   | Sections | Entries | Size (KB) |
| ------ | -------- | ------- | --------- |
| en.xml | 94       | 4210    | 312       |
| es.xml | 61       | 2229    | 167       |
| ru.xml | 62       | 2067    | 194       |
| tr.xml | 67       | 2752    | 185       |
| vn.xml | 56       | 1722    | 127       |

en is the master; other langs are partial translations. Missing keys must fall back to en at runtime (i18next `fallbackLng`).

## Top 20 sections (en.xml)

| Section                          | Entries |
| -------------------------------- | ------: |
| common                           |     253 |
| dashboardfs                      |     214 |
| previewanalysis                  |     187 |
| profile                          |     130 |
| compare                          |     127 |
| info-detail                      |     124 |
| button                           |     117 |
| message-code                     |     116 |
| dashboardschedulefs              |     114 |
| audit-virtual-correlation-center |     108 |
| ballistic-import                 |     101 |
| auditalltransactionfs            |      99 |
| home-page                        |      96 |
| grid-view                        |      88 |
| dashboard                        |      87 |
| search-user-agency               |      83 |
| vcc                              |      78 |
| vectorserverfs                   |      75 |
| view-watchlist                   |      71 |
| audit                            |      71 |

Full list: 94 sections — see [scripts/convertLanguages.ts](../../scripts/convertLanguages.ts) output.

## Collision with POC namespaces

POC Step 14 hand-crafted two namespaces with curated, nested keys:

- `common.json` — POC's UI shell vocab (`button.search`, `state.loading`, `app.title`) — DIFFERENT shape from legacy `common` section (which is flat `entry name="..."`)
- `searchAPL.json` — POC's APL page strings (`column.apl_ID`) — no direct legacy equivalent

**Resolution**: legacy sections emit to a separate prefix to avoid clobbering POC's curated work.

- Legacy output path: `public/locales/<lang>/legacy/<section>.json`
- i18next namespace: `legacy/<section>` (e.g. `legacy/login-page`, `legacy/common`)
- POC namespaces (`common`, `searchAPL`) stay untouched and stay primary for current code
- Future ported pages opt into legacy namespaces as needed

## Key/value transformation rules

The converter (Step 30) will:

1. Parse with `fast-xml-parser` (`preserveOrder: false`, `attributeNamePrefix: ''`, `ignoreAttributes: false`)
2. Map each `<section name="X"><entry name="K">V</entry></section>` → file `<X>.json` with `{ "K": "V", ... }`
3. **Drop** the `fileinfo` section (metadata, not translatable strings)
4. **Discard** the `note` attribute on entries
5. **Preserve** `{0}` / `{1}` placeholders as-is (i18next consumes them via custom interpolation OR app code converts to `{{0}}` style — TBD; for now, verbatim so legacy strings match what page-migration code expects)
6. **Keep** HTML markup verbatim — translators authored it that way; runtime decides whether to `dangerouslySetInnerHTML` or render escaped
7. **Last-write-wins** for duplicate keys within a section (matches legacy C# `Dictionary` behavior)
8. **Sanitize** filenames: section names already URL-safe (lowercase + hyphens), used directly

## Output structure

```
public/locales/
├── en/
│   ├── common.json          ← POC (untouched)
│   ├── searchAPL.json       ← POC (untouched)
│   └── legacy/
│       ├── login-page.json  ← 60 keys
│       ├── home-page.json   ← 96 keys
│       ├── common.json      ← 253 keys (legacy 'common' section)
│       ├── button.json      ← 117 keys
│       └── ... (94 - 1 = 93 files)
├── es/legacy/...  (61 files)
├── ru/legacy/...  (62 files)
├── tr/legacy/...  (67 files)
└── vi/legacy/...  (56 files — sourced from vn.xml)
```

Total expected legacy JSON files: 339 (sum of section counts per lang, minus 5 `fileinfo` skips).

## Out of scope (Wave A)

- French (`fr`) / German (`de`) — not in legacy, will need professional translation pass later
- Pluralization rules (i18next v4 syntax) — legacy XML has no plural variants
- ICU MessageFormat — out of scope; legacy uses simple `{0}` placeholders
- Translation memory / glossary export — separate tooling

## Verification plan (Step 31)

For each of 5 langs, after conversion:

1. JSON files written count == XML sections count − 1 (fileinfo)
2. Each output JSON parses (no malformed entities, no stray XML)
3. Random spot-check: 3 keys per lang match XML source
4. Total key count per file matches `<entry>` count in source section
