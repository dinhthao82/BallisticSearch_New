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
