# Wave E — P5 Standard Pages

**Start tag**: `v0.5.0-forensic-core`
**End tag**: `v0.6.0-standard-pages`
**Effort**: ~21 steps, ~8-12h Claude, ~$25-40 (mid)

Scope: 19 P5 pages across User Management, Agency Management, Audit, and Sharing/Dashboard. Each page = 1 step (schema + page + MSW + ~3-4 tests + nav).

Pages are simpler than P4 because they're list-style or single-form pattern. Reuse: PageBody / DataFilter / DataResult, BIQ primitives, RHF+Zod, TanStack Query against MSW. No new primitives.

| Mission | Steps | Pages | Pattern |
|---|---|---|---|
| W21: User Management | 106-110 | AddUsers, EditUsers, ManageUser, ManageAdmin, AddAgencyManager | Form / List+Edit |
| W22: Agency Management | 111-115 | AddAgencies, EditAgency, AgencySetting, ContractManagement, ManageSharingAgencies | Form |
| W23: Audit | 116-118 | AuditAllTransactions, LoginAuditing, InformationAuditing | List+filter |
| W24: Sharing + Dashboard | 119-124 | AdminShareToAgencies, AgencyShareToAdmin, GlobalHotlistSharing, SharingProfiles, DashboardVCC, UserManagement | Mix |
| W25: Cross-page E2E + audit | 125 | — | Playwright admin flow + Lighthouse batch update |
| W26: Milestone | 126 | — | WAVE_E_RESULT + v0.6.0 tag |

Each page step commits via: `feat: Step N — M-XXX <PageName>` with schema/page/MSW/test files.

After Wave E: master plan 43/80 → ~62/80 ≈ 78%. Remaining: P6 beasts (5 large pages) + P7 decommission.
