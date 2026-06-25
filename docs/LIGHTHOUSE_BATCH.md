# Lighthouse Batch Audit Checklist — Wave D

Top-5 page audit plan. Run after every major Wave-end. Manual or via the
existing `npm run lighthouse-*` scripts. CI integration (Lighthouse CI as
PR gate) is deferred until page count > 20.

| Page | Route | Target P / A / BP | Notes |
|---|---|---|---|
| Login | /login | ≥95 / ≥98 / ≥95 | Baseline (eager-loaded, smallest page) |
| HomePage | /app | ≥90 / ≥95 / ≥95 | Dashboard w/ Tabler icons + 11 cards |
| SearchAPL | /app/search-apl | ≥85 / ≥95 / ≥95 | Filter + DataTable + Pagination |
| SearchEvent | /app/search-event | ≥85 / ≥95 / ≥95 | Multi-filter + Compare/Export dialogs |
| MapOfAgencies | /app/map-of-agencies | ≥75 / ≥90 / ≥95 | Lower P target — leaflet tile load is heavy |

## Procedure

For each route after a build:

```powershell
npm run build
npm run preview &
npx lighthouse http://localhost:4173<route> `
  --output=html `
  --output-path=lighthouse-<route-slug>.html `
  --chrome-flags="--headless"
```

Open the HTML report, capture the 4 scores + LCP/FCP/CLS/TBT, paste into
`docs/LIGHTHOUSE.md` (existing Wave 0 baseline) for diff tracking.

## Wave D expected behavior

The Wave C lazy-route refactor should keep all routes' initial parse +
render cost roughly constant (since each route is its own chunk). Adding
3 search pages should not affect Login or HomePage performance.

Known acceptable tradeoffs:
- **MapOfAgencies + MapOfGalleries** Performance scores will dip ~10
  points due to OSM tile loading. Worth keeping the audit on hand to
  catch any regression beyond -15.
- **CompareDialog + ExportDialog** open instantly (BIQModal is in the
  shared chunk via @/components/modal). No measurable cost.

## When to escalate

If any score regresses by >10 points between waves, file a Wave-internal
investigation. Lighthouse is advisory in CI right now (continue-on-error),
so the gates are: build size (size-limit 260 KB) + lint + tests.
