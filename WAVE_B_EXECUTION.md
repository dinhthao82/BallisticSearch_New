# Wave B — Cleanup + CI/CD + First Trivial Pages

**Start tag**: `v0.2.0-foundation` (Wave A complete)
**End tag**: `v0.3.0-trivial-pages`
**Repo**: `BallisticSearch_New` (continue main branch)
**Backend strategy**: continue MSW mock (TBD)
**Effort**: ~16 steps, ~6-8h Claude, ~$10-12 (mid)
**Long-term track**: P3 trivial (3 of 11) → unblock P4 core forensic later

---

## Mission overview

| Mission | Steps | Effort | Outcome |
|---|---|---|---|
| W8: Cleanup (5 code-review findings) | 53-55 | ~1.5h | BIQBadge + BIQButton + BIQCheckbox type/API fixes |
| W9: CI/CD GitHub Actions | 56-58 | ~1.5h | typecheck + lint + test + build + size gate on every PR |
| W10: 3 Trivial Pages | 59-67 | ~4h | M-040 + M-038 + M-036 shipped |
| W11: Milestone + tag | 68 | ~0.5h | WAVE_B_RESULT.md + v0.3.0-trivial-pages |

---

## W8: Cleanup (Steps 53-55)

Per `WAVE_A_RESULT.md` section "Code-review findings still open" — 5 ranked findings from W2 review.

### Step 53 — BIQBadge fixes (3 findings)
- **Fix 1**: BIQBadge.tsx:33 — `status` + `color` both set → warn + use status; OR drop color when status set (decide via test)
- **Fix 2**: BIQBadge.tsx:33 — unknown status string → return Mantine default with `console.warn` (dev only)
- **Fix 3**: BIQBadge.tsx:11 — type `BIQ_STATUS_COLOR` as `Record<BIQStatus, MantineColor>` (strict union), not `Record<string, string>`
- Test: 3 new tests (status precedence, unknown warn, type-narrowing compile)
- Commit: `fix: Step 53 — BIQBadge type narrowing + status precedence`

### Step 54 — BIQButton + BIQCheckbox fixes (2 findings)
- **Fix 4**: BIQButton.tsx:6 — remove redundant `onClick` declaration, keep polymorphic Mantine `as`/`component` support
- **Fix 5**: BIQCheckbox.tsx:10 — expose `.Group` + `.Indicator` + `.Card` via proper `Object.assign` static-cast or namespace
- Test: BIQButton supports `component={Link}` (compile), BIQCheckbox.Indicator renders
- Commit: `fix: Step 54 — BIQButton polymorphic + BIQCheckbox subcomponent exposure`

### Step 55 — Cleanup verification
- Run full test suite (expect 179+ tests)
- Run code-review skill again on `src/components/primitives/` — expect 5 findings gone
- Commit: `test: Step 55 — cleanup verified, 5 W2 findings closed`

---

## W9: CI/CD GitHub Actions (Steps 56-58)

### Step 56 — Base workflow
- File: `.github/workflows/ci.yml`
- Jobs: `setup → typecheck → lint → test → build`
- Trigger: `push` to main + `pull_request`
- Node 20 + npm ci
- Cache: node_modules + Vite
- Commit: `ci: Step 56 — GitHub Actions baseline (lint/test/build)`

### Step 57 — Size gate + Lighthouse hook
- Add `size-limit` job → fail PR if initial gzip > 280 KB (current 235 + 45 buffer)
- Lighthouse CI: separate job, allow failure for now (target 85+)
- Upload `dist/stats.html` artifact
- Commit: `ci: Step 57 — size-limit gate + Lighthouse advisory job`

### Step 58 — Test CI on dummy PR
- Create dummy branch `ci-smoke` with 1-line README change
- Open PR → verify all jobs green
- Document fail behavior (introduce 281 KB temporarily, confirm size gate fails)
- Merge OR close dummy PR
- Commit on main: `ci: Step 58 — verified CI gates fire (size-limit + lint + test)`

---

## W10: 3 Trivial Pages (Steps 59-67)

Selection rationale: pick 3 NON-MAP pages from P3 catalog to verify migration mechanics without needing leaflet/mapbox tooling.

### Pages chosen:
1. **M-040 Input_Case_Number.aspx** → `/app/case-number` (simple input + submit)
2. **M-038 AuditContractInfo.aspx** → `/app/audit-contract-info` (display + tabular data)
3. **M-036 SubmitRapidBallistics.aspx** → `/app/submit-rapid` (multi-field form + file upload)

### M-040 Input_Case_Number (Steps 59-61)

**Step 59** — Page shell + route
- `src/features/case-number/CaseNumberPage.tsx`
- Read legacy `GUI/Input_Case_Number.aspx` for visual reference + extract i18n keys
- Add route to `routes.tsx`
- Add nav link in ProtectedLayout (under "Tools" group)
- MSW handler stub: `POST /api/v1/case-number/submit`
- Commit: `feat: Step 59 — M-040 Input_Case_Number page shell + route`

**Step 60** — Form + validation
- React Hook Form + Zod schema (case number alphanumeric+dash, required, max 50 chars)
- Use BIQInput (W2) + BIQButton + BIQCaseFilter (W6)
- Loading state via BIQLoadingOverlay (W3)
- Success → BIQMessageBox.success (W5)
- i18n: keys via `useTranslation('caseNumber')`
- Commit: `feat: Step 60 — M-040 form + validation + submit flow`

**Step 61** — Tests
- Unit: render, validation errors, submit success/error
- Integration: form fill → submit → success message
- Coverage: ≥80% for new files
- Commit: `test: Step 61 — M-040 tests (8 new, ~190 total)`

### M-038 AuditContractInfo (Steps 62-64)

**Step 62** — Page shell + read API
- Read legacy `GUI/AuditContractInfo.aspx` for layout
- MSW handler: `GET /api/v1/audit/contract-info?contractId=X` returns mock fixture
- `src/features/audit-contract-info/AuditContractInfoPage.tsx`
- URL query param `contractId` parsed via React Router
- Commit: `feat: Step 62 — M-038 AuditContractInfo page shell + GET handler`

**Step 63** — Display: header + tabs/sections + table
- BIQ layout primitives (PageBody + DataResult)
- BIQ Badge for status
- Read-only display, no edit
- Commit: `feat: Step 63 — M-038 display sections + status badges`

**Step 64** — Tests
- Loading state, success render, error state, missing contractId
- Commit: `test: Step 64 — M-038 tests (~200 total)`

### M-036 SubmitRapidBallistics (Steps 65-67)

**Step 65** — Page shell + form skeleton
- Read legacy `GUI/SubmitRapidBallistics.aspx`
- 6-8 field form (case#, location, weapon, photos, ...)
- MSW handler: `POST /api/v1/rapid-ballistics`
- Commit: `feat: Step 65 — M-036 SubmitRapidBallistics shell + RHF skeleton`

**Step 66** — File upload + photo preview
- Use `<BIQFileInput>` (new primitive — small wrapper around Mantine FileInput, OR use raw)
- Photo preview grid before submit
- Validation: max 10 files, 5MB each, JPEG/PNG only
- Commit: `feat: Step 66 — M-036 file upload + photo preview`

**Step 67** — Tests + integration
- Form validation, file size validation, submit success
- Commit: `test: Step 67 — M-036 tests (~215 total)`

---

## W11: Wave B Milestone (Step 68)

**Step 68** — Final report + tag
- `WAVE_B_RESULT.md`:
  - Mission verdict per W8/W9/W10
  - Test progression (179 → ~215+)
  - Bundle progression (235.49 → expect ~250 KB)
  - CI/CD verified: typecheck/lint/test/build/size-limit all enforce
  - Plan-vs-reality pivots
  - Pages shipped: 1 (POC SearchAPL) → 4 (+3 trivial)
- Update STATUS.md: Wave B 16/16 ✓
- Update master plan progress: 26/80 → ~32/80 (~40%)
- Update MILESTONES.md
- Tag: `v0.3.0-trivial-pages` annotated
- Commit: `docs: Step 68 — Wave B complete + v0.3.0-trivial-pages tag`

---

## Acceptance criteria per step

Same as POC/Wave A:
- `npm run typecheck` → 0 errors
- `npm run lint` → 0 errors
- `npm test -- --run` → all pass
- `npm run build` → success
- Bundle delta documented
- STATUS.md updated
- No `console.log` / `debugger;`

After Step 56, CI/CD runs automatically on every PR.

---

## Out of scope (defer to Wave C)

- Remaining 8 trivial pages (3 map-based + 5 others) — wait for `<BIQMap>` primitive
- M-045 Login full migration (real auth flow) — needs backend decision
- M-046 HomePage — depends on M-045
- P4 forensic search pages — depends on M-045
- OpenAPI codegen — needs backend contract
- Sentry error tracking (M-033) — needs Sentry account

---

## How to trigger

User says: `chạy step N` or `chạy step N-M`.

Khuyến nghị:
- `chạy step 53-55` (W8 Cleanup) — bắt đầu, low-risk
- `chạy step 56-58` (W9 CI/CD) — sau cleanup, để có gate cho W10
- `chạy step 59-67` (W10 3 trivial pages) — ship batch
- `chạy step 68` (W11 milestone) — final tag

Hoặc `chạy step 53-68` để chạy nguyên Wave B end-to-end (~6-8h, $10-12).
