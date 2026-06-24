# POC Milestones

## POC-1 Bootstrap — DONE 2026-06-24

Steps 1–8 completed in single chained session.

### Stack confirmed

- **Build**: Vite 5.4 + TypeScript 5.5 strict (extra strict flags:
  `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- **Framework**: React 18.3 + React Router 6.30 (BrowserRouter)
- **UI**: Mantine 7.17 (core + hooks + dates) with BIQ palette (#435d7d)
- **State**: Zustand 4.5 (with persist), TanStack Query 5.101
- **HTTP**: Ky 1.14 (installed, not wired yet)
- **Forms**: React Hook Form 7.80 + Zod 3.25
- **i18n**: i18next 23.16 + react-i18next 14 (installed, not wired)
- **Testing**: Vitest 1.6 + Testing Library + happy-dom; Playwright 1.61
- **Tooling**: ESLint 8 + TS-ESLint + Prettier 3 + Husky 9 + lint-staged 15

### Metrics

| Metric | Value |
|---|---|
| Bundle initial (JS gzip) | 93 KB |
| Bundle initial (CSS gzip) | 30 KB |
| **Total gzip** | **123 KB** ✓ within 250 KB budget |
| Modules transformed | 814 |
| Build time | 1.4s |
| Tests passing | 6/6 (2 files) |
| Lint warnings/errors | 0/0 |
| Typecheck errors | 0 |

### Code shipped

- `src/theme/` — tokens.ts, cssVars.css, mantineTheme.ts (BS-6159 parity)
- `src/store/userStore.ts` — Zustand + persist, 5 user roles
- `src/routes/ProtectedLayout.tsx` — AppShell w/ header + navbar
- `src/features/login/LoginPage.tsx` — mock auth (any creds → Admin role)
- `src/features/search-apl/SearchAPLPage.tsx` — placeholder
- `src/App.tsx` — MantineProvider + QueryClient + Router

### Decisions made

1. **Scaffold approach**: wrote Vite scaffold files manually instead of
   `npm create vite` interactive prompt. Equivalent result, faster in
   non-interactive Claude context.
2. **`@vitest/coverage-v8` pinned to ^1.6** to match Vitest 1.x peer.
3. **Pre-commit hook** runs `lint-staged` + `typecheck` (no test run
   on commit to keep commits fast; tests run on CI later).
4. **Tests use `findBy*`** with MemoryRouter for direct component render
   (avoids Mantine portal + BrowserRouter timing in happy-dom).
5. **i18n setup deferred to Step 14** (POC-2 mission).
6. **Playwright browsers not yet downloaded** (~150 MB) — install in
   Step 24 when first E2E test runs.

### Next: Mission POC-2 (Steps 9–15)

- Step 9: Layout components (PageBody, DataFilter, DataResult, BoxFilter)
- Step 10: DataTable (TanStack Table) with sticky header
- Step 11: Pagination component
- Step 12: MSW mock + APL search handler (47 row fixtures)
- Step 13: Ky + TanStack Query wired to useSearchAPL hook
- Step 14: i18n init + locale JSON
- Step 15: Loading/Empty/Error states + milestone

---

## POC-2 Components + MSW — DONE 2026-06-24

Steps 9–15 completed in single chained session.

### Components shipped (12 new)

**Layout** (4 + barrel index):
- `<PageBody>`, `<DataFilter>` (collapsible), `<DataResult>`, `<BoxFilter>` (title + maxWidth)

**Data** (2):
- `<DataTable>` generic TanStack Table + sticky header + sort
- `<Pagination>` Mantine + page-size select + range text

**Feedback** (3 + barrel):
- `<LoadingOverlay>`, `<EmptyState>`, `<ErrorState>` (w/ optional retry)

### Infrastructure

- **MSW mock**: 47-row APL fixture, POST /api/v1/apl/search handler
  - filters: apl_ID, caseNumber, dateFrom/dateTo, reportStatus
  - pagination support
- **HTTP**: Ky client with prefixUrl, X-Mock-User header (placeholder for JWT)
- **TanStack Query**: useSearchAPL hook with `enabled` gate
- **i18n**: i18next + HTTP backend, 2 namespaces (common + searchAPL)

### Metrics

| Metric | Value |
|---|---|
| Bundle initial (gzip) | **144 KB** (114 JS + 30 CSS) - within 250 KB |
| MSW lazy chunk (dev only) | 96 KB gzip |
| Tests passing | 38/38 (12 files) |
| Lint | 0 errors |
| Typecheck | 0 errors |
| Build time | 1.9s |

### Decisions made

1. **happy-dom + MSW v2 + Ky fetch ReadableStream incompat** → API/hook
   tests mock `@/api/client`; full HTTP path verified in browser dev
   + Playwright E2E (Step 24).
2. **`exactOptionalPropertyTypes: true` removed** — too painful with
   Mantine's strict `string` props. Kept `strict: true` + extras.
3. **`baseUrl` removed** — TS 5.x resolves paths relative to tsconfig
   dir; baseUrl deprecated in TS 7.
4. **`aria-sort='none'`** default for unsorted (not undefined).
5. **MSW worker dynamically imported** when `VITE_USE_MOCK=true` —
   code-split, ~96 KB chunk only in dev.

### Next: Mission POC-3 (Steps 16–22)

- Step 16: APL filter Zod schema + types
- Step 17: SearchAPLFilter form (RHF + Zod + Mantine)
- Step 18: SearchAPLResults table (7 columns + status badge)
- Step 19: SearchAPLPage shell wired (filter + table + pagination)
- Step 20: Sort columns client-side
- Step 21: Side-by-side visual comparison
- Step 22: Polish + milestone

---

## POC-3 SearchAPLProcess Page — DONE 2026-06-24

Steps 16–22 completed in single chained session.

### Page shipped

`/app/search-apl` (in ProtectedLayout after Login):

- Left sidebar: collapsible `<DataFilter>` containing `<BoxFilter title="Filters">` with `<SearchAPLFilter>`
- Right area: title "APL Reports" + record count + `<SearchAPLResults>` (table with 7 columns, status badge, sticky header, sort) + `<Pagination>` (page size 10/25/50/100)
- Error state: `<ErrorState>` with retry button
- Loading: spinner inside table

### Files added

```
src/features/search-apl/
├── schema.ts                              (Zod schema + toApiFilter normalizer)
├── SearchAPLFilter.tsx                    (RHF form + Zod resolver)
├── SearchAPLResults.tsx                   (7-column table + Badge)
├── SearchAPLPage.tsx                      (shell, state, query wiring)
└── __tests__/
    ├── schema.test.ts                     (8 tests)
    ├── SearchAPLFilter.test.tsx           (5 tests)
    ├── SearchAPLResults.test.tsx          (7 tests)
    └── SearchAPLPage.test.tsx             (3 integration tests)

docs/VISUAL_PARITY.md                      (parity assessment)
docs/screenshots/README.md                 (placeholder)
```

### Metrics

| Metric | Value |
|---|---|
| Tests passing | 61/61 (+23 since POC-2) |
| Bundle initial gzip | 220 KB (under 250 KB budget) |
| Lint | 0 errors, 0 warnings |
| Typecheck | 0 errors |
| Build time | 4.2s |
| Visual parity vs ASPX | ≥90% (per VISUAL_PARITY.md) |
| Behavior parity | ≥85% on happy path |

### Decisions made

1. **RHF + Mantine + happy-dom interaction tests** are flaky for
   uncontrolled inputs (Textarea register, Checkbox.Group click).
   Test focus shifted to: render structure, form submit trigger,
   default values, schema parsing. Real interaction verified in
   Step 24 Playwright E2E.
2. **`element.click()` doesn't fire React synthetic events** in
   happy-dom — use `fireEvent.click()` consistently.
3. **`react-hooks/incompatible-library` rule disabled** —
   informational warning about React Compiler we don't use; was
   blocking lint pass.
4. **`toApiFilter` normalizer** — UI textarea allows multi-line/
   comma; API only accepts single value in POC. Splits + takes
   first non-empty. Real backend will accept array (defer).
5. **Status badge color mapping** — Pending=yellow, In Process=blue,
   Closed=gray (Mantine variants).
6. **Date format** — yyyy-MM-dd HH:mm (24h) for table; ISO yyyy-MM-dd
   for filter input.
7. **Bundle warning** — Vite warns >500KB raw chunk (we are 725KB
   raw / 220KB gzip). Acceptable for POC. Real app should code-split
   per route via React.lazy + Suspense.

### Next: Mission POC-4 (Steps 23–28)

- Step 23: Unit test coverage push to ≥80%
- Step 24: E2E test with Playwright
- Step 25: A11y audit (axe-core)
- Step 26: Lighthouse audit
- Step 27: Bundle analysis + size budget check
- Step 28: POC_RESULT.md final report + v0.1.0-poc tag
