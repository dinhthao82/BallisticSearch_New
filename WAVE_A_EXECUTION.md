# Wave A — Foundation Hardening (post-POC)

**Repo**: `BallisticSearch_New` (continuing from v0.1.0-poc tag)
**Backend strategy**: TBD — continue with MSW mock until decision
**Branch**: continue on `main` (1 commit per step, mission tag on completion)
**Target**: ship 7 missions to harden component library before scaling to P3/P4 pages

---

## Mission overview

| Mission                   | Steps | Effort | Outcome                                                        |
| ------------------------- | ----- | ------ | -------------------------------------------------------------- |
| W1: i18n converter        | 29-32 | ~2h    | Script convert XML → JSON; 50 langs ready                      |
| W2: BIQ primitives        | 33-36 | ~3h    | Button/Input/Textarea/Select/Checkbox wrappers + a11y baked in |
| W3: LoadingOverlay        | 37-39 | ~2h    | EIQ_LoadingUI port w/ Cancel button + tests                    |
| W4: Modal + ConfirmDialog | 40-42 | ~2h    | Modal base + ConfirmDialog + focus trap                        |
| W5: MessageBox            | 43-45 | ~2h    | GCTWindow.openNew replacement + 4 variants                     |
| W6: Filter primitives     | 46-49 | ~3h    | DateRange + Location + CaseNumber filters                      |
| W7: Multiselect           | 50-52 | ~2h    | jquery.multiselect replacement + tests                         |

**Total**: 24 steps, ~16h, ~$22 Claude API (mid-estimate).

---

## W1: i18n XML→JSON converter (Steps 29-32)

### Step 29 — Audit legacy XML files

- Read `d:/LEADSONLINE_Project/BallisticSearch_2026_05_26/Languages/*.xml`
- Identify schema (key/value structure)
- List all 50+ language files
- Output: `docs/i18n/AUDIT.md`
- Commit: `chore: Step 29 — audit legacy i18n XML files`

### Step 30 — Build converter script

- `scripts/convertLanguages.ts` — TypeScript Node script
- Parse XML w/ `fast-xml-parser`
- Emit JSON per namespace (common, searchAPL, login, ...)
- Output to `public/locales/<lang>/<namespace>.json`
- Commit: `feat: Step 30 — i18n XML→JSON converter script`

### Step 31 — Run converter for primary langs

- Convert en, es, fr, de, vi (top 5 by user count)
- Verify JSON valid + key count matches
- Commit: `chore: Step 31 — convert 5 primary languages (en/es/fr/de/vi)`

### Step 32 — Wire i18n loader + tests

- Update `src/i18n/i18n.ts` to use converted JSON
- Test: switch language → UI text changes
- Commit: `test: Step 32 — i18n primary lang switching verified`

---

## W2: BIQ Primitives wrapper (Steps 33-36)

### Step 33 — BIQButton + BIQInput

- `src/components/primitives/BIQButton.tsx` — wraps Mantine Button, BS-6159 colors baked in
- `BIQInput.tsx` — wraps TextInput w/ auto-label, error display
- Replace 3 usages in SearchAPL feature to verify
- Commit: `feat: Step 33 — BIQButton + BIQInput primitives`

### Step 34 — BIQTextarea + BIQSelect

- `BIQTextarea.tsx`, `BIQSelect.tsx`
- Multi-row textarea matches BS-6159 styling
- Select uses native (not Combobox) for speed
- Commit: `feat: Step 34 — BIQTextarea + BIQSelect primitives`

### Step 35 — BIQCheckbox + BIQRadio + BIQSwitch + BIQBadge

- All 4 in `src/components/primitives/`
- BIQBadge color map (Pending=yellow, In Process=blue, Closed=gray) extracted from POC
- Commit: `feat: Step 35 — BIQ form controls (Checkbox/Radio/Switch/Badge)`

### Step 36 — Migrate SearchAPL to BIQ primitives + tests

- Replace all Mantine direct imports with BIQ wrappers
- Verify visual parity (screenshot before/after)
- Test count maintained at 69
- Commit: `refactor: Step 36 — migrate SearchAPL to BIQ primitives`

---

## W3: LoadingOverlay port (Steps 37-39)

### Step 37 — Analyze EIQ_LoadingUI legacy

- Read legacy `JScript/EIQ_LoadingUI.js`
- Identify API: ShowProcessing, CloseProcessing, OnClose
- Document in `docs/migration/loading-overlay.md`
- Commit: `chore: Step 37 — analyze EIQ_LoadingUI legacy API`

### Step 38 — Build BIQLoadingOverlay

- `src/components/feedback/BIQLoadingOverlay.tsx`
- Props: visible, message, onCancel?
- Backdrop blur + spinner + cancel button (if onCancel set)
- Use Mantine LoadingOverlay underneath
- Commit: `feat: Step 38 — BIQLoadingOverlay w/ Cancel button`

### Step 39 — Wire to SearchAPL + tests

- Replace inline loading state in SearchAPLPage with BIQLoadingOverlay
- Test: cancel callback fires
- Commit: `test: Step 39 — BIQLoadingOverlay integrated + tested`

---

## W4: Modal + ConfirmDialog (Steps 40-42)

### Step 40 — BIQModal base

- `src/components/modal/BIQModal.tsx` — wraps Mantine Modal
- Focus trap, esc to close, click outside disabled by default
- Title + body + footer slots
- Commit: `feat: Step 40 — BIQModal base w/ focus trap`

### Step 41 — BIQConfirmDialog

- `src/components/modal/BIQConfirmDialog.tsx`
- API: confirm(title, message, options) → Promise<boolean>
- Replaces native `confirm()` calls (4 found in POC)
- Commit: `feat: Step 41 — BIQConfirmDialog imperative API`

### Step 42 — Demo + tests

- Demo page `/dev/modal-showcase` (DEV only)
- Tests: 5 scenarios (confirm yes/no, esc, outside, focus return)
- Commit: `test: Step 42 — Modal+ConfirmDialog 5 scenarios green`

---

## W5: MessageBox replacement (Steps 43-45)

### Step 43 — Analyze GCTWindow + MessageBox legacy

- Read `JScript/MessageBox.js`, `JScript/GCTWindow.js`
- Identify variants: alert, info, warning, error, prompt
- ~40 call sites across ASPX
- Commit: `chore: Step 43 — analyze GCTWindow/MessageBox legacy API`

### Step 44 — Build BIQMessageBox

- `src/components/modal/BIQMessageBox.tsx`
- API: `messageBox.alert/info/warn/error(message)` → Promise<void>
- Built on BIQModal
- Toast variant for non-blocking (uses sonner)
- Commit: `feat: Step 44 — BIQMessageBox 4 variants + toast`

### Step 45 — Migration helper + tests

- Create `legacy-adapter/GCTWindow.ts` that forwards to BIQMessageBox
- So future ported pages can drop-in replace
- Tests: each variant + accessibility
- Commit: `feat: Step 45 — GCTWindow legacy adapter + tests`

---

## W6: Filter primitives (Steps 46-49)

### Step 46 — BIQDateRangeFilter

- `src/components/filters/BIQDateRangeFilter.tsx`
- 2 date inputs + quick options (Today, Last 7d, Last 30d, Custom)
- Uses Mantine DatePickerInput
- Commit: `feat: Step 46 — BIQDateRangeFilter w/ quick options`

### Step 47 — BIQLocationFilter

- Country/State/City cascading dropdowns
- Loads from API (MSW handler) → ucLocationFilter equivalent
- Commit: `feat: Step 47 — BIQLocationFilter cascading dropdowns`

### Step 48 — BIQCaseFilter

- Case number multi-input (textarea or comma-separated)
- Validation: alphanumeric + dash only
- Used by ~15 search pages in legacy
- Commit: `feat: Step 48 — BIQCaseFilter multi-input + validation`

### Step 49 — Demo + tests

- Demo page `/dev/filter-showcase`
- Tests: each filter renders + onChange fires + reset works
- Commit: `test: Step 49 — filter primitives 9 scenarios green`

---

## W7: Multiselect replacement (Steps 50-52)

### Step 50 — Analyze jquery.multiselect legacy

- Read `Scripts/jquery.multiselect.js`
- Identify features: search, select-all, max-display, fixed-position
- Find ~30 call sites
- Commit: `chore: Step 50 — analyze jquery.multiselect legacy`

### Step 51 — Build BIQMultiselect

- `src/components/primitives/BIQMultiselect.tsx`
- Uses Mantine MultiSelect underneath
- Custom position fix for `.data-filter { overflow: hidden }` clip (lesson from POC CLAUDE.md)
- Commit: `feat: Step 51 — BIQMultiselect w/ overflow-fix`

### Step 52 — Wave A milestone + final report

- All 7 missions verified
- Bundle delta check
- WAVE_A_RESULT.md report
- Tag: `v0.2.0-foundation`
- Commit: `docs: Step 52 — Wave A complete + v0.2.0-foundation tag`

---

## Acceptance criteria per step

Every step must pass before commit:

- `npm run typecheck` → 0 errors
- `npm run lint` → 0 errors
- `npm test -- --run` → all pass
- `npm run build` → success
- Bundle delta documented (target: total <300 KB gzip after Wave A)
- No `console.log` / `debugger;` in committed code
- STATUS.md updated

---

## How to trigger

User says: `chạy step N` (single) or `chạy step N-M` (range).

Steps 29-32 = W1 (chạy nguyên Wave 1)
Steps 29-52 = toàn bộ Wave A (~16h Claude work)

Claude will:

1. Read this plan + STATUS.md
2. Verify prerequisites (POC tag exists, build clean)
3. Run step(s)
4. Self-verify acceptance criteria
5. Commit per step
6. Push at end of mission
7. Report back

---

## Out of scope for Wave A

- Real auth flow (M-028+) — needs backend decision
- Page migration (P3 Trivial, P4 Core) — comes after Wave A
- CI/CD GitHub Actions — Wave B (separate)
- OpenAPI codegen — needs backend contract
