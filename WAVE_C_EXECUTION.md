# Wave C — Remaining Trivials + Maps + Auth Shape

**Start tag**: `v0.3.0-trivial-pages` (Wave B complete)
**End tag**: `v0.4.0-pre-core`
**Repo**: `BallisticSearch_New` (continue main)
**Backend strategy**: continue MSW mock (TBD)
**Effort**: ~24 steps, ~6-10h Claude, ~$15-25 (mid)

## Mission overview

| Mission | Steps | Outcome |
|---|---|---|
| W12: 4 non-map trivials | 69-77 | M-037 + M-039 + M-041 + M-042 shipped |
| W13: BIQMap + 4 map pages | 78-86 | Leaflet primitive + 4 map-based trivials |
| W14: Login + HomePage | 87-91 | M-045 real Login + M-046 dashboard shell |
| W15: Milestone | 92 | WAVE_C_RESULT + v0.4.0-pre-core tag |

## W12: Non-map Trivials (Steps 69-77)

### Step 69 — M-037 EditVCC_Redirect
Legacy: redirects to EditVCC.aspx. Port = `/app/vcc-redirect` → Navigate to `/app/edit-vcc` (placeholder).
Commit: `feat: Step 69 — M-037 EditVCC redirect route`

### M-039 AuditingContract (Steps 70-71)
Read-only display similar to M-038. MSW handler returns mock list.
- Step 70: page + GET handler + display
- Step 71: tests

### M-041 ComposeEmail (Steps 72-74)
Email form: to/cc/subject/body + simple validation.
- Step 72: shell + schema (RHF + Zod, comma-separated email list)
- Step 73: form + submit + MSW
- Step 74: tests

### M-042 UploadBullet (Steps 75-77)
File upload — reuse PhotoUpload pattern but for images + metadata fields.
- Step 75: shell + schema (bullet metadata: caliber, mass, photos)
- Step 76: form + upload + MSW
- Step 77: tests

## W13: BIQMap + Map Pages (Steps 78-86)

### Step 78 — BIQMap primitive
Install `react-leaflet` + `leaflet`. Wrap as `<BIQMap markers={[{lat,lng,popup}]}>`.
Lazy-loaded to keep main bundle clean.

### M-034 MapOfAgencies (Steps 79-80)
Map showing agency locations as markers. MSW handler returns mock locations.
- Step 79: shell + page + MSW
- Step 80: tests

### M-035 MapOfGalleries (Steps 81-82)
Same pattern, different markers (galleries).
- Step 81: page + MSW
- Step 82: tests

### M-043 MapIt_Gallery (Steps 83-84)
Single-gallery map with marker + popup. Param: ?galleryId=X.
- Step 83: page + MSW
- Step 84: tests

### M-044 MapIt_Potential (Steps 85-86)
Single-potential-link map. Param: ?potentialId=X.
- Step 85: page + MSW
- Step 86: tests

## W14: Login + HomePage (Steps 87-91)

### M-045 Login full (Steps 87-88)
Real form (RHF + Zod) replacing current placeholder. Auth still mock (any creds → Admin), but flow shape matches real backend contract.
- Step 87: form + Zod schema + validation
- Step 88: tests + integration

### M-046 HomePage (Steps 89-90)
Dashboard layout: welcome + quick actions + recent activity placeholder.
- Step 89: page + layout
- Step 90: tests

### Step 91 — Cross-page integration test
Playwright E2E: login → home → search-apl → submit-rapid → logout.
Commit: `test: Step 91 — Playwright cross-page flow E2E`

## W15: Milestone (Step 92)

WAVE_C_RESULT.md + tag `v0.4.0-pre-core`.

## Out of scope (Wave D+)

- Real auth flow (M-028+) — backend strategy needed
- P4 forensic core (M-047 SearchEvent, M-048 SearchCSA, M-050 SearchQA, ...)
- Image editor, VCC, QuickSearch (P6 beasts)
