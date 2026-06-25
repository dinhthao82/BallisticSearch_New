# Wave D — Forensic Core (P4)

**Start tag**: `v0.4.0-pre-core` (Wave C complete)
**End tag**: `v0.5.0-forensic-core`
**Repo**: `BallisticSearch_New` (continue main)
**Backend strategy**: continue MSW mock
**Effort**: ~13 steps, ~5-7h Claude, ~$15-22 (mid)

Pattern across these 3 search pages: same shell (filter sidebar + result grid + pagination), different filter shape + result columns + actions per flavor. We reuse the POC SearchAPL layout (PageBody / DataFilter / DataResult / DataTable / Pagination + BIQ primitives + TanStack Query against MSW).

## Mission overview

| Mission                     | Steps   | Outcome                                             |
| --------------------------- | ------- | --------------------------------------------------- |
| W16: M-047 SearchEvent      | 93-97   | Multi-filter + result grid + Compare + Export shape |
| W17: M-048 SearchCSAProcess | 98-100  | CSA search + result grid                            |
| W18: M-050 SearchQAReports  | 101-103 | QA search + result grid                             |
| W19: Integration + audit    | 104     | Cross-page E2E + Lighthouse batch                   |
| W20: Milestone              | 105     | WAVE_D_RESULT + v0.5.0-forensic-core tag            |

## W16: M-047 SearchEvent (Steps 93-97)

### Step 93 — Filter schema + types + MSW

- `src/features/search-event/{schema,types}.ts`
- Filter fields (per legacy): min score, top result count, search by name (radio: any/exact), case number (multi), date range, site (admin only), user filter (admin only)
- MSW: POST /api/v1/search-events returns 50 mock events
- Commit: `feat: Step 93 — SearchEvent schema + types + MSW handler`

### Step 94 — Filter sidebar form

- `SearchEventFilter.tsx` — RHF + Zod + BIQ primitives + BIQDateRangeFilter + BIQCaseFilter
- Sticky in `<DataFilter>` left sidebar
- Permission gate: site/user filters only render for Admin role
- Commit: `feat: Step 94 — SearchEvent filter sidebar`

### Step 95 — Result grid + pagination

- `SearchEventResults.tsx` — DataTable with 8 columns (Event ID, Case#, Score, Site, User, Date, Type, Actions)
- Compare checkbox column → tracks selection in component state (max 2)
- Score column color-coded
- Commit: `feat: Step 95 — SearchEvent result grid w/ Compare selection`

### Step 96 — Compare overlay + Export popup

- BIQModal-based Compare dialog showing 2 selected rows side-by-side
- BIQConfirmDialog-based Export popup: format radio (Excel/PDF), then "Submit" → toast + close
- MSW: POST /api/v1/search-events/export accepts {ids, format} → returns {jobId}
- Commit: `feat: Step 96 — Compare overlay + Export popup`

### Step 97 — Tests

- Schema validation, filter render, result grid render, Compare select limit, Export popup flow
- Commit: `test: Step 97 — SearchEvent tests`

## W17: M-048 SearchCSAProcess (Steps 98-100)

### Step 98 — CSA shell + filter + MSW

- Mirror SearchEvent layout. Fields: case number, date range, CSA status (Open/In Process/Closed multi), assigned-to
- MSW: POST /api/v1/search-csa returns 30 mock CSAs
- Commit: `feat: Step 98 — SearchCSAProcess shell + filter`

### Step 99 — CSA result grid

- 6 columns (CSA ID, Case#, Status, Assigned, Created, Updated)
- BIQBadge for status
- Commit: `feat: Step 99 — SearchCSAProcess result grid`

### Step 100 — CSA tests

- Commit: `test: Step 100 — SearchCSAProcess tests`

## W18: M-050 SearchQAReports (Steps 101-103)

### Step 101 — QA shell + filter + MSW

- Fields: case number, date range, QA result (Pass/Fail/Pending multi), reviewer
- MSW: POST /api/v1/search-qa returns 25 mock QA records
- Commit: `feat: Step 101 — SearchQAReports shell + filter`

### Step 102 — QA result grid

- 6 columns (QA ID, Case#, Result, Reviewer, Reviewed, Notes)
- Commit: `feat: Step 102 — SearchQAReports result grid`

### Step 103 — QA tests

- Commit: `test: Step 103 — SearchQAReports tests`

## W19: Integration (Step 104)

### Step 104 — Cross-page E2E + Lighthouse batch

- New e2e/forensic-flow.spec.ts: login → SearchEvent → select 2 → Compare → close → Export → confirm
- Add nav links to HomePage QUICK_ACTIONS for new pages
- Document Lighthouse manual-audit checklist for top 5 pages (Home, Login, SearchAPL, SearchEvent, MapOfAgencies)
- Commit: `test: Step 104 — Cross-page E2E + audit docs`

## W20: Milestone (Step 105)

### Step 105 — WAVE_D_RESULT + tag

- Per-mission outcomes
- Test progression
- Bundle deltas
- Master plan progress: 40/80 → 46/80 (~57%)
- Tag: `v0.5.0-forensic-core`
- Commit: `docs: Step 105 — Wave D complete + v0.5.0-forensic-core tag`

## Out of scope (Wave E+)

- M-049 SearchAPLProcess: shipped in POC (Wave 0)
- M-051 Cross-page integration test: simplified into Step 104
- M-052 Performance audit batch: documented in Step 104, full run deferred to CI
- Real auth (still MSW)
- P5 admin + agency pages
- P6 beasts (VCC, QuickSearch, EditGallery, ImageEditor)
