# Wave B — Cleanup + CI/CD + First Trivial Pages: Result Report

**Start tag**: `v0.2.0-foundation` (Wave A complete)
**End tag**: `v0.3.0-trivial-pages`
**Branch**: `main`
**Duration**: 2026-06-25 (single Claude session, ~6h wall)
**Commits since v0.2.0**: 17 (16 step commits + 1 milestone commit)

---

## Mission verdict

🎯 **All 4 missions complete (16/16 steps)** — every step's acceptance gate green before commit (typecheck/lint/format/test/build/size). No `console.log` / `debugger;` left behind. CI now enforces the same gates on every PR.

| Mission | Steps | Outcome |
|---|---|---|
| W8: Cleanup (5 W2 findings) | 53-55 | BIQBadge typed + warn / BIQButton polymorphic / BIQCheckbox subcomponents |
| W9: CI/CD GitHub Actions | 56-58 | quality job (typecheck/lint/format/test/build) + size-limit gate 260 KB / 40 KB + Lighthouse advisory |
| W10: 3 Trivial Pages | 59-67 | M-040 Input_Case_Number + M-038 AuditContractInfo + M-036 SubmitRapidBallistics shipped |
| W11: Milestone | 68 | this report + v0.3.0-trivial-pages tag |

## Test count progression

| Stage | Tests at completion |
|---|---|
| Wave B start (v0.2.0) | 179 |
| After W8 (Step 55) | 183 (+4) |
| After W9 (Step 58) | 183 (no test deltas — CI infra) |
| After M-040 (Step 61) | 197 (+14) |
| After M-038 (Step 64) | 203 (+6) |
| **After M-036 (Step 67)** | **216** (+13) |

Net Wave B delta: **+37 tests** (179 → 216). Files: +5 test files (BIQBadge precedence, M-040 schema + page, M-038 page, M-036 schema + page).

## Bundle size progression (gzip, initial route, no MSW chunk)

| After | Bundle | Δ from prior | Notes |
|---|---|---|---|
| Wave A end (v0.2.0) | 235.49 KB | — | baseline |
| W8 Step 55 | 235.52 KB | +0.03 | polymorphic Button (negligible) |
| W9 Step 58 | 235.52 KB | 0 | CI/CD infra only |
| M-040 Step 60 | 241.05 KB | +5.53 | + case-number page + RHF resolver tree |
| M-038 Step 64 | 243.33 KB | +2.28 | + audit-contract-info shell + display |
| **M-036 Step 67** | **245.94 KB** | **+2.61** | + submit-rapid page + PhotoUpload |

Net Wave B bundle delta: **+10.45 KB gzip** (235.49 → 245.94). Within size-limit budget (260 KB JS) with 14 KB headroom for next missions.

## Plan vs reality — pivots

1. **W8 — finding #4 BIQCheckbox subcomponents**. Plan said "expose .Group + .Indicator + .Card" — Mantine v7 surface confirmed via Object.assign; static cast pattern dropped in favor of inline `as { ... }` typing didn't work, replaced with `Object.assign` so subcomponents enrich the forwardRef ref-aware base.
2. **W8 — finding #3 BIQButton polymorphic**. Initial fix using intersection type fell short — `component={Link}` failed typecheck. Used Mantine's `createPolymorphicComponent` helper which is the canonical pattern. Tests added for `component="a"` render-as-anchor.
3. **W9 — Lighthouse job**. Plan called it "advisory" — implemented with `continue-on-error: true` so PR can merge regardless. Real enforcement waits for production deploy / SLO.
4. **W9 — size-limit exit code verification**. gh CLI not installed in env; verified locally by tightening budget to 200 KB and observing `npx size-limit` exit 1 (then restored to 260 KB). Behavior matches what CI will run.
5. **W10 — M-036 form scope**. Legacy SubmitRapidBallistics.aspx is an iframe → SubmitRapidForm.aspx (highly complex form: priority + justification + status + comments + notify-options + additional emails). Followed the simplified Wave B spec (6 fields: case#, location, weapon, priority, comment, photos) instead of full legacy port — the heavy version belongs in P5 standard pages.
6. **W10 — Mantine + happy-dom label associations**. `getByLabelText('Case number')` returned multiple matches because Mantine's input emits both the visible label and `aria-describedby`. Switched all page-level tests to `getByRole('textbox', { name: ... })` which is the WCAG-canonical query anyway.
7. **W10 — File size in schema tests**. Building real 5 MB+ buffers in tests would explode memory; used `Object.defineProperty(file, 'size', { value })` on a 1-byte File instance — Zod still inspects `file.size` correctly. No allocations.

## Code-review findings still open

Light pass over new pages found no ship-blockers. The lowest-priority items worth noting:
- M-038 AuditContractInfoPage: locale-formatted date uses browser default; for a forensic UI we should pin to ISO-like with explicit timezone (defer to i18n pass).
- M-036 PhotoUpload: removing a photo doesn't reset the underlying input.value (Mantine `<FileInput value={[]}>` already nulls). Same-name re-upload still works because the array is rebuilt fresh on every add.
- M-040 messageBox.success on submit then form.reset — if user rapidly double-clicks Continue, both submits race. The mutation key is stable so TanStack dedupes, but UX could disable Submit during isSubmitting (already does via `loading={isSubmitting}`); the modal flicker is harmless.

## What this unlocks

- **4 pages now live** on React (SearchAPL + 3 trivial). 4/50 pages = 8% of total page-migration scope, but per-page velocity established at ~30 min Claude wall (excluding the BIQ primitives investment from Wave A which was front-loaded).
- **CI is the safety net** — future PRs that break typecheck / lint / format / tests / build / bundle budget get caught before merge. Removes the "did Claude regress something" risk that grew with every Wave A commit.
- **MSW handler library expanded** from 4 → 7 routes (apl, location-3, case-number, audit, rapid). Pattern proven for adding new endpoints + matching tests.

## Master plan progress vs initial plan

| Phase | Status entering Wave B | After Wave B |
|---|---|---|
| P0 Bootstrap | 8/8 ✓ | 8/8 ✓ |
| P1 Component Library | 13/15 | 13/15 (no new components) |
| P2 API + Auth | 4/10 | 4/10 |
| P3 Trivial Pages | 0/11 | **3/11** (M-036, M-038, M-040) |
| P4 Core | 1/12 (M-049 from POC) | 1/12 |
| P5-P7 | 0/40 | 0/40 |

**Total**: 29/80 missions ≈ **36%**.

## Hand-off to Wave C

Decisions to make before Wave C kickoff (suggested):

1. **8 trivial pages remaining (P3 finish)**:
   - 3 map-based (M-034, M-035, M-043, M-044) — need a `<BIQMap>` primitive first (Leaflet vs Maplibre vs Google Maps SDK)
   - 5 non-map (M-037, M-039, M-041, M-042) — could ship next without backend dependency
2. **P4 Login + HomePage** (M-045, M-046): would require real auth flow strategy (still TBD)
3. **Open: backend strategy** still unresolved. MSW continues to cover what we ship.
4. **CI Lighthouse threshold**: currently advisory; consider promoting Performance ≥ 85 to fail-the-build once page count > 10.

Recommended Wave C kickoff order:
- W12 — 5 remaining non-map trivial pages (~15 steps)
- W13 — `<BIQMap>` primitive (1 step) + 3 map-based trivial pages (~9 steps)
- W14 — M-045 Login + M-046 HomePage (with real auth shape via MSW)
- W15 — milestone tag v0.4.0-pre-core
