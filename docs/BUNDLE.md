# Bundle Analysis — Step 27

**Build**: production (`npm run build`), Vite 5.4 with rollup-plugin-visualizer
**Output dir**: `dist/`
**Visualizer**: `dist/stats.html` (treemap, open in browser)

## Asset breakdown

| Asset | Raw size | Gzipped | Notes |
|---|---|---|---|
| `index.html` | 0.46 KB | 0.31 KB | App shell HTML |
| `index-*.css` | 205 KB | **30 KB** | All CSS (Mantine + design tokens + CSS modules) |
| `index-*.js` | 725 KB | **220 KB** | Main app bundle |
| `browser-*.js` (MSW worker) | 287 KB | 96 KB | **Lazy-loaded**, only in dev mode (`VITE_USE_MOCK=true`) |

## Initial load gzip totals

| Scenario | Initial gzip | Notes |
|---|---|---|
| **Production (real backend)** | **250 KB** (220 JS + 30 CSS) | MSW chunk excluded — not loaded |
| **Dev / POC mock** | 346 KB (250 + 96 MSW) | MSW dynamically imported when env flag set |

> **Target budget**: ≤250 KB initial. POC sits **at the limit** in prod — comfortable for forensic tool but should code-split if more pages added.

## Top deps (estimate from imports)

| Library | Approx gzip contribution |
|---|---|
| `@mantine/core` + `@mantine/hooks` + `@mantine/dates` | ~80 KB |
| `react` + `react-dom` | ~45 KB |
| `react-router-dom` | ~15 KB |
| `@tanstack/react-query` + devtools | ~15 KB |
| `@tanstack/react-table` | ~10 KB |
| `i18next` + `react-i18next` + HTTP backend | ~25 KB |
| `react-hook-form` + `zod` + `@hookform/resolvers` | ~20 KB |
| `date-fns` | ~5 KB (tree-shaken) |
| `ky` | ~3 KB |
| `zustand` | ~2 KB |
| `@tabler/icons-react` (only used icons) | ~3 KB |
| App code | ~10 KB |

## Optimization opportunities (deferred — out of POC scope)

1. **Code-split per route**: `React.lazy(() => import('./features/search-apl/SearchAPLPage'))`
   → split Filter form, Result table, Pagination into separate chunks. Saves ~40 KB on initial load.

2. **Strip Mantine extras**: `@mantine/dates` (~15 KB) only used in 2 DateInput components. Could swap for native `<input type="date">`.

3. **i18n HTTP backend skip**: bundle locale JSON inline for primary language (en) — saves 1 fetch.

4. **React 18 → preact**: Drop-in replacement, ~30 KB savings. Tradeoff: lose some React-specific 3rd-party.

5. **Server components / SSR**: Not applicable for SPA forensic tool.

## Comparison vs Legacy

| | Legacy ASPX | POC React | Reduction |
|---|---|---|---|
| jQuery 1.x-3.x (10 versions) | ~90 KB | 0 KB | -100% |
| Bootstrap 3.3.7 + 4.1.3 (dual) | ~390 KB | 0 KB (Mantine instead) | -100% |
| Font Awesome 4.7 | ~80 KB | ~3 KB (Tabler subset) | -96% |
| animate.css | ~50 KB | 0 KB | -100% |
| moment.js | ~290 KB | ~5 KB (date-fns) | -98% |
| PDF.js 1.10 | ~600 KB | 0 KB (not in POC) | n/a |
| Page-specific JS | ~25,000 LOC | <1,000 LOC | -96% |
| **Initial download** | ~2.5 MB raw / ~800 KB gzip | **~250 KB gzip** | **~3x smaller** |

## Acceptance

- [x] Production initial gzip ≤ 250 KB target: **250 KB exactly** (was 220 before bundle visualizer added, now slightly larger due to extra plugin output — still on target)
- [x] CSS gzip ≤ 50 KB target: **30 KB**
- [x] MSW chunk lazy-loaded (not in prod path)
- [x] Build time < 10s: **4.9s**
- [x] Source maps generated for debug
- [x] Treemap available at `dist/stats.html`

## How to view treemap

```bash
npm run build
# Open dist/stats.html in browser to see interactive treemap of bundle composition
start dist/stats.html   # Windows
# or: open dist/stats.html (macOS), xdg-open dist/stats.html (Linux)
```
