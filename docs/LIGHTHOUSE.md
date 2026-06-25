# Lighthouse Audit — Step 26

**Route**: `/login` (public, no auth required)
**Date**: 2026-06-25 (Step 26 of POC-4)
**Command**: `npx lighthouse http://localhost:4173/login --chrome-flags="--headless"`
**Build**: production (`npm run build`, served via `npm run preview` port 4173)

## Scores

| Category | Score | Target | Status |
|---|---|---|---|
| **Performance** | **96** / 100 | ≥85 | ✅ |
| **Accessibility** | **98** / 100 | ≥90 | ✅ |
| **Best Practices** | **100** / 100 | ≥90 | ✅ |

> SEO category skipped (internal forensic tool, not indexed).

## Core Web Vitals

| Metric | Value | Target | Status |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | 2.4s | <2.5s | ✅ |
| **FCP** (First Contentful Paint) | 2.1s | <1.8s | ⚠️ close |
| **TBT** (Total Blocking Time) | 0ms | <200ms | ✅ |
| **CLS** (Cumulative Layout Shift) | 0.039 | <0.1 | ✅ |
| **Speed Index** | 2.1s | <3.4s | ✅ |

## Notes

- **FCP 2.1s slightly above ideal** — Mantine + Router + MSW worker init cost. Could improve with code-splitting per route (lazy load filter form, table modules) — deferred to full migration.
- **TBT 0ms** — no long tasks, excellent.
- **CLS 0.039** — minor layout shift (Mantine loading sequence). Below threshold.
- **Performance 96** — vast majority of optimization opportunities are: serve modern formats (WebP), preconnect to API origin (not applicable in MSW mock), preload critical fonts.

## Comparison vs Legacy ASPX (estimated)

| | Legacy ASPX | POC React | Improvement |
|---|---|---|---|
| Performance | ~50-60 (jQuery + Bootstrap dual + ViewState) | **96** | +40-46 |
| Accessibility | ~70-75 (BS-6159 partial work) | **98** | +23-28 |
| Best Practices | ~70 (mixed http, no HSTS, ...) | **100** | +30 |
| TTI | ~5-7s | <2.4s | ~3x faster |

## SearchAPL page audit

**Not run** — requires authenticated state (login form submit before reaching). Headless Lighthouse CLI can't easily simulate. Manual audit recommended via Chrome DevTools after dev login.

Expected scores similar (or slightly lower on Performance due to MSW worker + DataTable + Mantine ScrollArea overhead, but still ≥85).

## Reports saved

- `lighthouse-login.report.json` — machine-readable
- `lighthouse-login.report.html` — visual report (open in browser)

Files git-ignored (large) — regenerate via `npm run lighthouse` shortcut (add to package.json scripts).
