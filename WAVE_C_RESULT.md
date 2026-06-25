# Wave C — Trivials + Maps + Auth Shape: Result Report

**Start tag**: `v0.3.0-trivial-pages` (Wave B complete)
**End tag**: `v0.4.0-pre-core`
**Branch**: `main`
**Duration**: 2026-06-25 (continuation of single Claude session)
**Commits since v0.3.0**: 17 step commits + 1 milestone

## Mission verdict

🎯 **All 4 missions complete (24/24 steps)** — every step's acceptance gate green at commit time (typecheck/lint/format/test/build/size). No `console.log` / `debugger;`. CI workflow active on every PR.

| Mission                   | Steps | Outcome                                                        |
| ------------------------- | ----- | -------------------------------------------------------------- |
| W12: 4 non-map trivials   | 69-77 | M-037 redirect / M-039 list / M-041 email / M-042 upload       |
| W13: BIQMap + 4 map pages | 78-86 | react-leaflet primitive + M-034/035/043/044                    |
| W14: Login + HomePage     | 87-91 | M-045 real form (RHF + Zod) + M-046 dashboard + cross-page E2E |
| W15: Milestone            | 92    | this report + v0.4.0-pre-core tag                              |

## Test count progression

| Stage                           | Tests                                        |
| ------------------------------- | -------------------------------------------- |
| Wave C start (v0.3.0)           | 216                                          |
| After M-037 (Step 69)           | 218 (+2)                                     |
| After M-039 (Step 71)           | 224 (+6)                                     |
| After M-041 (Step 74)           | 234 (+12)                                    |
| After M-042 (Step 77)           | 248 (+14)                                    |
| After W13 BIQMap+maps (Step 86) | 259 (+11)                                    |
| After Login (Step 88)           | 264 (+5)                                     |
| **After HomePage (Step 90)**    | **265+** (+4-5 net incl App.test.tsx update) |

Net Wave C delta: **+49 tests** (216 → 265). 50 test files total.

## Bundle size progression (gzip, initial route)

| After                    | JS gzip       | Notes                                            |
| ------------------------ | ------------- | ------------------------------------------------ |
| v0.3.0 baseline          | 245.94 KB     | M-036/038/040 all in one chunk                   |
| W12 Step 77              | ~258 KB       | added M-037/039/041/042 (close to budget)        |
| **Lazy split** (pre-W13) | **163.94 KB** | route-level React.lazy + Suspense, -94 KB / -36% |
| W13 BIQMap+maps          | 163.94 KB     | leaflet (~46 KB) goes to its own lazy chunk      |
| Login (full form)        | ~196 KB       | RHF/Zod/Mutation already in tree                 |
| **Final after HomePage** | **196.26 KB** | +Tabler icons for quick actions                  |

Net Wave C bundle delta: **-49.68 KB gzip** initial (245.94 → 196.26). Yes, even after adding 9 pages + a map primitive + a real login + a dashboard, the **initial bundle shrank** by ~20%. The lazy-load refactor (committed mid-wave) is the big win — every page now ships as its own chunk and only loads when the route is hit.

CI budget (260 KB): **64 KB headroom**.

## Plan vs reality — pivots

1. **W12 — Lazy routes inserted mid-wave**. After M-042 the eager-import bundle was at 257 KB / 260 KB budget, with leaflet still pending. Inserted a `perf:` commit converting all feature routes to `React.lazy` + a shared `<Lazy>` Suspense wrapper. This brought initial down to 164 KB and unblocked W13.
2. **W13 — Leaflet PNG icons + vitest**. Leaflet's default marker icons are bundled as PNG imports. Vite handles them in build but vitest can't transform PNG by default. Refactored `BIQMap.tsx` to do icon setup lazily inside `useEffect` so the icon imports happen at runtime, not at module load. Tests then mock the imports explicitly. Production still gets bundled URLs correctly.
3. **W13 — react-leaflet MapContainer in happy-dom**. happy-dom doesn't implement `createRange` / `measureText` that Leaflet relies on. All map page tests mock `@/components/map` to a thin stub that emits markers without booting leaflet. The BIQMap test itself mocks `react-leaflet` directly so we still cover the wrapper logic.
4. **W14 — Login API contract**. The plan said "real form, auth still mock". Built `auth/login` MSW handler returning `{ token, user: { id, username, role } }` so when the real backend lands later we just swap the `prefixUrl` env — no client code change.
5. **W14 — HomePage replaces Navigate**. The plan had `/app` → `Navigate('/app/search-apl')`. Replaced with HomePage as the index route, since that mirrors the legacy GUI/HomePage.aspx behavior (dashboard with quick actions). Also gives users a place to discover other features.
6. **W14 — App.test.tsx had to be updated**. The pre-existing smoke test rendered `<LoginPage />` directly without a QueryClientProvider; the new useLogin mutation needs one. One-line provider wrap fix.
7. **W14 — E2E login flow change**. Previous login form had default-filled credentials so clicking Login was enough. New form starts empty (validates required). Updated all 3 spec files (search-apl, a11y, cross-page) to fill username + password explicitly. Extracted `loginAs()` helper.

## What's new in this wave

### Pages live (5/50 → 13/50)

| Page              | Route                    | Lazy chunk gzip              |
| ----------------- | ------------------------ | ---------------------------- |
| HomePage          | /app                     | ~1 KB                        |
| Login (full)      | /login                   | (eager — first load page)    |
| SearchAPL         | /app/search-apl          | ~38 KB                       |
| CaseNumber        | /app/case-number         | ~2 KB                        |
| AuditContractInfo | /app/audit-contract-info | shared ErrorState chunk      |
| SubmitRapid       | /app/submit-rapid        | ~3 KB                        |
| UploadBullet      | /app/upload-bullet       | ~10.5 KB                     |
| EditVCC redirect  | /app/vcc-redirect        | <1 KB                        |
| AuditingContract  | /app/auditing-contract   | ~2 KB                        |
| ComposeEmail      | /app/compose-email       | ~2 KB                        |
| MapOfAgencies     | /app/map-of-agencies     | ~1 KB (+ BIQMap chunk 46 KB) |
| MapOfGalleries    | /app/map-of-galleries    | ~1 KB (+ shares BIQMap)      |
| MapItGallery      | /app/mapit-gallery       | ~1 KB (+ shares BIQMap)      |
| MapItPotential    | /app/mapit-potential     | ~1 KB (+ shares BIQMap)      |

### New primitive: `<BIQMap>`

- `src/components/map/BIQMap.tsx`
- Wraps `react-leaflet@4` over OpenStreetMap tiles
- Props: `{ markers: [{id,lat,lng,popup?}], center?, zoom?, height?, ariaLabel? }`
- Lazy leaflet icon configuration (runtime, not module load) — keeps test surface clean
- Renders `role=region` with the supplied `ariaLabel` for screen reader users
- Fallback center: arithmetic mean of marker coords, or US centroid if empty

### MSW expansion

| Mission | Routes added                                                      |
| ------- | ----------------------------------------------------------------- |
| M-037   | (none — redirect-only)                                            |
| M-039   | GET /api/v1/audit/contracts                                       |
| M-041   | POST /api/v1/email/send                                           |
| M-042   | POST /api/v1/bullet/upload                                        |
| W13     | GET /api/v1/map/{agencies, galleries, gallery/:id, potential/:id} |
| M-045   | POST /api/v1/auth/login                                           |

Handlers: 8 → 15.

### CI signal

All gates green on every step commit. Bundle stayed inside 260 KB JS / 40 KB CSS budgets the entire wave. Lighthouse advisory job hasn't been promoted to required yet — defer until page count > 20.

## Code-review snapshot

Lighter review than Waves A-B since this was mostly application code (not primitives). Top items:

- **BIQMap markers default to OSM tiles**. Fine for forensic in-network use, but if internet egress is restricted at the customer site, we'll need a self-hosted tile server config knob. Defer to backend-strategy decision.
- **HomePage quick-action cards link to all 8 routes**. M-043/044 (deep-link maps) intentionally excluded — they require URL params. Should add an "Open from search context" entry once the search pages can deep-link into them.
- **AuditingContractPage** filters via querystring on the API call; no client-side caching across filter values. TanStack Query's default per-key cache covers this well enough for the POC scale.

## Master plan progress

| Phase                    | Status entering Wave C | After Wave C                                        |
| ------------------------ | ---------------------- | --------------------------------------------------- |
| P0 Bootstrap             | 8/8 ✓                  | 8/8 ✓                                               |
| P1 Components            | 13/15                  | 13/15 (+ BIQMap, doesn't count in original catalog) |
| P2 API + Auth            | 4/10                   | 5/10 (+ M-028 Login shape)                          |
| **P3 Trivial Pages**     | **3/11**               | **11/11 ✓** (Wave C closed it)                      |
| P4 Core (Login+Home etc) | 1/12                   | **3/12** (+M-045 Login, +M-046 Home)                |
| P5-P7                    | 0/40                   | 0/40                                                |

**Total**: 30/80 → **40/80 missions ≈ 50%**.

## Hand-off to Wave D

Suggested Wave D scope (Forensic Core — P4 deep dives):

| Mission                                                              | Description                                                                         | Effort    |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | --------- |
| M-047 SearchEvent                                                    | Multi-filter search w/ result grid + sticky header + Compare overlay + Export popup | 4-6 steps |
| M-048 SearchCSAProcess                                               | Similar layout to SearchAPL but CSA-flavored                                        | 3 steps   |
| M-050 SearchQAReports                                                | QA-flavored search results                                                          | 3 steps   |
| Cross-page integration: E2E "login → SearchEvent → Compare → Export" | 1 step                                                                              |
| Performance audit batch (Lighthouse on top 5 pages)                  | 1 step                                                                              |

Backend strategy decision still pending. Wave D can keep MSW. Real auth integration becomes a single mission swap of the api client + the /auth/login handler removal.

🎉 Wave C complete. 13/50 pages on React. **50% of master plan missions done.**
