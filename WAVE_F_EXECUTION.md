# Wave F — P6 Beasts

**Start tag**: `v0.6.0-standard-pages`
**End tag**: `v0.7.0-all-pages`
**Effort**: ~7-8 commits, ~6-10h Claude, ~$25-40

P6 "beast" pages are complex in the legacy. For this POC we ship **functional shells** (route + layout + MSW data shape + tests) — not full legacy parity. Real feature completeness lands when backend integration replaces MSW.

| Mission | Commit | Pages |
|---|---|---|
| W27 Detail/View pages | 1 batched | M-073 EditGallery, M-074 ViewDetails, M-075 SearchCSAUploaded, M-076 SearchGalleries, M-077 Detection_info, M-078 SummaryPotentialLinksDetails |
| W28 UserProfiles | 1 | M-079 (a+b: profile shell + MFA/password sub-flows) |
| W29 GalleryMap | 1 | M-080 (a+b: map + S3 imagery placeholder) |
| W30 VCC | 1 | M-081 (a+b+c: shell + Save/Notify + reports) |
| W31 Probe + SearchFace | 1 batched | M-082 ProbeMatches_Info, M-083 SearchFace_Info |
| W32 QuickSearch | 1 | M-084 (a+b+c) |
| W33 ImageEditor + PreviewAnalysis | 1 batched | M-085 PreviewAnalysis, M-086 Compare, M-087 2DCompareTool, M-088 Standardize + BIQCanvas primitive |
| W34 Milestone | 1 | WAVE_F_RESULT + v0.7.0-all-pages tag |

After Wave F: master plan 62/80 → ~77/80 ≈ 96%. Only P7 decommission remaining.
