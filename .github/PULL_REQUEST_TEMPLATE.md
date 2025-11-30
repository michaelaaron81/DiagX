# PR: docs reorg + small runtime fixes

### Summary

Consolidated documentation into canonical subfolders under `docs/` (process, inventory, plans, audits, gap-scans, recommendations), updated cross-references, and applied minor mechanical/runtime fixes so tests remain green.

### What changed
- Moved internal docs (seeds, guardrails, instructions) into `docs/process/`
- Moved inventory/spec/catalog files into `docs/inventory/`
- Moved implementation/repair plans into `docs/plans/`
- Placed audits, gap-scans, and recommendation artifacts into their own folders under `docs/`
- Small mechanical fixes to both code and configs to ensure tests pass (see changed files)

### Validation
- Ran the full test suite (24 files, 56 tests) — all passing
- Re-ran recommendation gap-scan script — artifacts generated in `docs/gap-scans/`

### Notes for reviewers
- Reviewers: this PR is mostly documentation reorganization and references; two small mechanical code changes were required to keep tests / scripts working:
  - `src/modules/compressor/recip.engine.ts` — include recommendations in returned result (fix tests expecting recommendations)
  - `src/wshp/wshp.config.refrigeration.ts` — robust fallback for designWaterFlowGPM when profile.waterSide is missing (prevents runtime errors in orchestrator tests)

If you prefer a completely clean delete of the old top-level files instead of redirect notes, let me know and I can remove them in a follow-up PR.

---
PR created by automation for branch: `docs/reorg/2025-11-29`
