# BallisticSearch_New — React POC

POC (proof-of-concept) migration of BIQ V5.1 (ASP.NET WebForms) frontend to React.

## Target

- 1 page migrated end-to-end: **SearchAPLProcess** (Rapid Ballistics APL Reports)
- Stack: Vite + React 18 + TypeScript strict + Mantine + TanStack Query + Zustand + MSW
- Mock backend (MSW) — no real API integration in POC

## Status

See [STATUS.md](STATUS.md) for current execution progress.

## Execution

This repo is executed step-by-step per the plan in the legacy project:
`d:/LEADSONLINE_Project/BallisticSearch_2026_05_26/EXECUTION_STEPS.md`

User triggers each step via "chạy step N" → Claude Code executes, commits, pushes.

## Decision after POC

Generate [POC_RESULT.md](POC_RESULT.md) (Step 28) for go/no-go decision on full migration.
