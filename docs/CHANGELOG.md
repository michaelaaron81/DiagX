# Changelog

All notable changes to this repository are recorded in this file. This project follows a lightweight, date-first changelog.

## 2025-11-30 — Phase 2.4 cleanup (diag-only recommendations, docs, CI)

- Locked the shared `Recommendation` contract to diagnostic-only outputs (id, domain, severity, intent, summary, rationale, notes, requiresShutdown).
- Added a JSON Schema and runtime AJV validator for `Recommendation` objects (`src/schema/recommendation.schema.json` + `src/shared/recommendation.schema.ts`).
- Implemented wording guards and unit tests to prevent procedural/repair language in recommendations (`test/helpers/recommendationGuards.ts` + tests updated).
- Removed presentation & repair fields from documentation examples and removed generated coverage artifacts that contained legacy fields.
- Added an integration test that scans compiled `dist/` output to prevent shipping forbidden repair fields (`test/integration/forbidden-in-dist.test.ts`) and created a CI workflow that runs `npm run build` before tests so the dist scan is effective.
- Updated docs and plans to reflect the diagnostic-only policy and to recommend a separate synthesis/planner layer for any future repair-action content.

Next steps:
- Review CI run on the branch and merge to `main` after review.
- Keep `coverage/` out of the repo (it's intentionally ignored now) and regenerate any archival artifacts only after the canonical tests + docs are verified.
