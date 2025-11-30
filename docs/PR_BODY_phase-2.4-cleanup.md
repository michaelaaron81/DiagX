Phase 2.4 cleanup — Lock Recommendation contract & remove repair/presentation fields

Summary
-------
This PR completes the Phase‑2.4 cleanup and hardening work:

- Lock the shared `Recommendation` contract to diagnostic-only outputs (id, domain, severity, intent, summary, rationale, notes, requiresShutdown).
- Add JSON Schema and runtime AJV validator for Recommendations (`src/schema/recommendation.schema.json` + `src/shared/recommendation.schema.ts`) and wire validation into recommendation tests.
- Implemented wording guards and tests to disallow procedural/repair wording in Recommendations (`test/helpers/recommendationGuards.ts`).
- Removed presentation / repair fields from documented examples; converted examples to the diagnostic-only shape.
- Added an integration test scanning compiled `dist/` artifacts for forbidden repair fields and added CI that runs `npm run build` before tests so the dist-scan is effective (`test/integration/forbidden-in-dist.test.ts`, `.github/workflows/ci.yml`).
- Regenerated coverage, verified outputs, then removed generated coverage artifacts from the repo and added `coverage/` to `.gitignore`.
- Added `docs/CHANGELOG.md` summarizing the Phase‑2.4 work.

Verification
------------
- Local build: `npm run build` completed (no TypeScript errors)
- Tests: `npm test` — 118 / 118 passed locally including integration + wording guards
- Lint: `npm run lint` ran (non-fatal TypeScript parser warning from ESLint)

Notes & constraints
-------------------
- No engine physics, thresholds, or flag roll-up behaviors were changed — only presentation, docs, tests, and types/schema.
- Synthesizing repair/action plans or step-by-step guidance is out-of-scope for the engines and should be implemented in a separate planner/synthesis layer if needed (keeps diagnostics safe and non-procedural).

Files of note (non-exhaustive)
-----------------------------
- `src/shared/wshp.types.ts` (Recommendation type locked)
- `src/schema/recommendation.schema.json` + `src/shared/recommendation.schema.ts`
- `test/helpers/recommendationGuards.ts` + recommendation tests updated
- `test/integration/forbidden-in-dist.test.ts` (dist-scan)
- `.github/workflows/ci.yml` (build before tests)
- `docs/recommendations/Recommendation_Suggestions_2025-11-29.md` (examples updated)
- `docs/CHANGELOG.md` (new entry)

Please review and merge when CI is green.
