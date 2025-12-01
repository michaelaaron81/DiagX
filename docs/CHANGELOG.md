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

## 2025-12-01 — Phase 3 — Profile wiring & config validation block

- Phase 2.4 (schema + lint cleanup) is complete and merged on `main`.
- Starting Phase 3: focus on profile wiring across engines and introducing a structured config validation/guard block so that profiles passed into engines are validated, clearly typed, and have safe defaults.
- Initial work planned for Phase 3:
	- Wire canonical profile fields into module entry points so engines consume typed profiles (avoid any runtime-shaping/casts).
	- Add a config-validation layer (JSON schema + runtime checks) for profiles and engine configuration to prevent malformed inputs from reaching engine logic.
	- Expand tests to include negative cases for malformed/partial profiles and confirm safe handling.
	- Update developer docs and local VS Code guardrails to document expected profile shapes and how to supply safe overrides.

Next steps for Phase 3:
- Begin the same iterative approach used in Phase 2.4: enforce schema + add test coverage for each module, remove remaining `any` in `src/` where required and tighten build/lint rules in CI.
