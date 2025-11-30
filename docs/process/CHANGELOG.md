## 2025-11-29 Phase 2.3 — Refrigeration recommendation completeness

- Refrigeration engine: completed flags-driven recommendation mapping for superheat/subcooling/compression ratio/water-transfer; differentiated standard vs unknown refrigerant disclaimer behavior; no changes to physics or thresholds.
- Added RefrigerantProfileType ('standard' | 'unknown') to classify refrigerant profiles based on known data availability.
- Implemented generateRefrigerationRecommendations helper with complete coverage for non-OK flags.
- Updated tests for refrigeration recommendations and combined profile stress tests.
- Documentation: updated DiagX_Engines_Inventory.md with refrigeration rec mapping.

## 2025-11-29 Phase 1 — Initial validation layer

- Added shared validation types `src/shared/validation.types.ts` (ValidationSeverity, ValidationIssue, ValidationResult).
- Added refrigeration validation helper `src/modules/refrigeration/refrigeration.validation.ts`.
- Wired refrigeration module to perform validation before running engine; engine run is blocked on validation errors.
- Documentation: updated `docs/process/DiagX_master_seed_V3.md` with Phase 1 validation notes.

## 2025-11-29 Phase 2 — Engine normalization and airside validation

- Inventory: added `docs/inventory/DiagX_Engines_Inventory.md` (canonical list of engine entry points for Phase 2).
- Normalized engine result types to use `EngineResult<V,F>` for engines: airside, refrigeration, compressor (recip & scroll), reversing valve.
- Exported and standardized engine recommendation helpers (generateXxxRecommendations) for testing and lock-in of behavior.
- Implemented conservative airside validation `src/modules/airside/airside.validation.ts` and wired into `airside.module` to block engine runs when fatal validation errors exist.
- Added recommendation helper tests and airside validation tests to lock current behavior in place.

## Unreleased
 - Safety update: recommendations must not include step-by-step instructions, estimated time, required parts, or cost/price estimates. Updated Recommendation contract and refactored recommendation helpers to use advisory wording only; added tests enforcing this safety policy.

## 2025-11-29 Phase 2.4 — Hydronic & Condenser Approach engines

- Added Hydronic Source Engine (Phase 2.4): new engine, recommendation helper, module wrapper, and full test coverage. Hydronic engine analyzes entering/leaving water ΔT and loop flow rate vs design to classify deltaTStatus and flowStatus. Recommendation helper maps non-OK states to targeted recommendations and preventive trending recs. No physics thresholds altered; all logic uses flags-driven recommendations.

- Added Condenser Approach Engine (Phase 2.4): new engine, recommendation helper, module wrapper, and full test coverage. Uses refrigerant PT data to compute condensing saturation temperature, condenser approach (satTemp - ambient), and liquid subcooling. Flags include approachStatus and subcoolingStatus with neutral disclaimers for unknown refrigerant curves. Recommendation helper provides priority mapping for approach/subcooling deviations. No physics thresholds changed.

- Orchestrator: Combined profile orchestration updated to invoke hydronic diagnostics when `profile.waterSide` and water measurements present, and to run condenser approach checks when ambient + condensing pressure measurements are available. New domain results are added under `water_loop` and `condenser_approach` domains in orchestrated results.

- Tests: Added engine, recommendation, and module tests for both new engines. Extended combined profile stress test and recommendation gap-scan tests to include hydronic & condenser scenarios. Full test run: 94/94 tests passed in latest run.

- Added `docs/process/DiagX_Safety_Manual_Outline.md` (safety manual section outline only).
- Added `docs/process/Local_Editor_Guardrails.md` (local editor / VS Code guardrails).
- Updated shared types in `src/shared/wshp.types.ts` to introduce `Recommendation` and `EngineResult` contracts.
- Updated airside, refrigeration, compressor, and reversing-valve modules to compile against shared types.
- Added `commander` dependency and fixed CLI build.
- Extended `src/modules/airside/airside.engine.ts` recommendation helper with architect-approved advisory branches for low airflow, abnormal static pressure, and combined deltaT/airflow patterns, and updated `test/airside.recommendations.test.ts` to lock the new IDs and ensure nominal cases do not emit them; engine physics, thresholds, and flag logic remain unchanged.
 - Added `docs/under-review/` as a staging area for machine-generated reports; updated recommendation gap-scan and stress-test logging to write new artifacts into `docs/under-review/…` so humans can review and manually promote them into `docs/audits/` or `docs/gap-scans/`.

### 2025-11-29 Patch — Reciprocating compressor recommendations

- Fixed recommendation-gap for reciprocating compressors: when `compressionStatus === 'critical'` or `currentStatus === 'critical'` the engine now produces explicit critical safety recommendations. The recip recommendation generator was made flags-driven (no physics re-checks in the helper) and tests were added to lock this behavior. (see `test/compressor.recip.recommendations.test.ts`)

- Clarified behavior: current-critical recommendations are now produced whenever the engine flags `currentStatus === 'critical'` even when the measured current is not present in the readings; the helper trusts engine flags exclusively for gating safety recs (the engine remains the single source of truth for diagnostic thresholds).

### 2025-11-29 Patch — Audit logs and gap-scan timestamping

- Automated gap-scan runs now write timestamped artifacts to `docs/gap-scans/Recommendation_Gaps_<timestamp>.md` so every scan is archived rather than overwritten.
- The combined-profile stress-run script (`scripts/run-combined-profile.ts`) and test harness now produce a timestamped, full audit report (profile, engine outputs, correlation summary, and combined recommendations) in `docs/audits/` for each run; tests assert a full, human-friendly report is emitted. This ensures stress-test audits capture values, computed flags, how conclusions were reached, and the recommendations returned by each engine.

### 2025-11-29 Patch — Eastern US Time timestamps

- Updated timestamp generation in audit and gap-scan scripts and tests to use Eastern Standard Time (EST, UTC-5) instead of UTC.
- Filenames and logged timestamps now reflect local Eastern US time for better relevance to US-based operations.

## 2025-11-29 Integrity sweep & final engine normalization

- Performed repo-wide integrity scan for single-source-of-truth on shared contracts. Confirmed `DiagnosticStatus`, `Recommendation` and `EngineResult` are defined only in `src/shared/wshp.types.ts`.
- Removed presentation-level strings from engine analysis helpers and engine return objects across modules, enforcing the EngineResult<V,F> contract (engines now return structured `values` and `flags` only):
	- `src/modules/airside/airside.engine.ts` — cleaned analysis helpers and moved message generation to module layer.
	- `src/modules/refrigeration/refrigeration.engine.ts` — removed message fields from analysis helpers and engine returns; engines produce structured flags and values.
	- `src/modules/compressor/recip.engine.ts` — removed message payloads from analysis helpers; engine returns now follow EngineResult<V,F>.
	- `src/modules/compressor/scroll.engine.ts` — removed message payloads and added `compressionStatus` flag; updated recommendation helper to use structured facts rather than textual messages.
	- `src/modules/reversingValve/reversing.engine.ts` — removed message strings and fixed structural issues; engines now produce `values` + `flags` and keep flattened fields for backward compatibility; module layer produces human-facing strings.
- Updated recommendation helpers and module logic to generate human-facing messages and presentation-level summaries in the module/UI layer (no physics or diagnosis logic changed, only presentation extraction).
- Fixed a few TypeScript type/import issues and duplicate-field errors surfaced during the refactor.
- Verified TypeScript build and Vitest test run: 20 test files, 50 tests — all passing after these changes.

### 2025-11-29 Patch — Normalized unknown/custom refrigerant handling

- Added `RefrigerantProfileType` enum ('standard' | 'unknown') and `refrigerantProfile` flag to `ReciprocatingCompressorFlags`.
- Replaced OEM/IOM-oriented disclaimer with neutral "Refrigerant type is not in the standard profile library; analysis is limited to generic compression and current behavior."
- Added informational recommendation for unknown refrigerant profiles in reciprocating compressor engine.
- Updated tests to assert new flag, disclaimer, and recommendation behavior.

### 2025-11-29 Patch — Recip compressor recommendation completeness (Phase 2.3)

- Extended reciprocating compressor recommendations to cover all non-OK flags: currentStatus (warning/alert), unloadingStatus (warning/alert), reedValveSuspected, pistonRingWearSuspected.
- De-proceduralized critical recommendations to describe conditions/risks without step-by-step instructions.
- Added stable failure-mode-aligned recommendation IDs for future synthesis layers.
- Updated tests to enforce completeness and stability.

## 2025-11-29 Test Run — Generation 5

- Full Vitest suite: 94 tests passed (33 files) — all green.
- ESLint linting run reported 196 problems (72 errors, 124 warnings). Many parsing errors are caused by ESLint being configured to include build artifacts or test files not present in tsconfig.json; a focused lint configuration adjustment is recommended to get CI-friendly lint runs.
- Promoted Generation 5 machine-generated artifacts into `docs/audits/` and `docs/gap-scans/` (5_* files). See `docs/audits/5_Test_Run_Summary_2025-11-29T18-10-27.md` for a short run summary.

## 2025-11-29 — Test / Reports (finalize Phase 2.4)

- Completed full stress test run and combined profile test runs — all target engines exercised under stress scenarios and the combined-profile tests passed. Machine-generated stress logs and audit reports written to `docs/under-review/` and `docs/audits/`.
- Generated a machine-readable Vitest run artifact and human-readable summary:
	- `docs/Test_Run_Vitest_2025-11-29T19-18-35.json`
	- `docs/Test_Run_Vitest_2025-11-29T19-18-35.md`
- Ran ESLint on source files and auto-fixed fixable issues; no lint errors remain in `src/` (warnings only). Consider tightening lint config or updating parserOptions to exclude build artifacts/test files for CI-friendly linting.

All tests & reports are green and available in `docs/` — ready for review and next instructions.
