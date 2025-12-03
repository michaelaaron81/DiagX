# Changelog

All notable changes to this repository are recorded in this file. This project follows a lightweight, date-first changelog.

## 2025-12-02 — Phase 3.4 + 3.5 — Physics Kernel Extraction & Engine Freeze

### Phase 3.4: Physics Kernel Extraction

#### Physics Kernel Created
New `src/physics/` directory with domain-specific modules:
- `src/physics/hvac/index.ts` — 21 HVAC physics functions + constants
- `src/physics/electrical/index.ts` — 2 electrical analysis functions
- `src/physics/hydronic/index.ts` — Hydronic re-exports
- `src/physics/index.ts` — Main entry point

#### Functions Extracted
| Function | Domain |
|----------|--------|
| `computeSuperheat` | Refrigeration |
| `computeSubcooling` | Refrigeration |
| `computeCompressionRatio` | Refrigeration/Compressor |
| `computeDischargeSuperheat` | Refrigeration |
| `computeAirDeltaT` | Airside |
| `computeAirflowFromDeltaT` | Airside |
| `computeCFMPerTon` | Airside |
| `computeWaterDeltaT` | Hydronic |
| `computeWaterDeltaTAbsolute` | Hydronic |
| `computeExpectedWaterDeltaT` | Hydronic |
| `computeHydronicBTU` | Hydronic |
| `computeDesignFlowGPM` | Hydronic |
| `computeNormalizedFlowIndex` | Hydronic |
| `computeApproachTemperature` | Condenser |
| `interpolatePT` | PT Chart |
| `computeFallbackSaturationTemp` | PT Chart |
| `getWorstStatus` | Status Aggregation |
| `computePercentRLA` | Electrical |
| `analyzeVoltageStatus` | Electrical |

#### Engines Refactored
All 8 engines now call kernel exclusively:
- `refrigeration.engine.ts` — Uses 6 kernel functions
- `airside.engine.ts` — Uses 4 kernel functions
- `hydronic.engine.ts` — Uses 3 kernel functions
- `hydronic-source.engine.ts` — Uses 4 kernel functions
- `scroll.engine.ts` — Uses 2 kernel functions
- `recip.engine.ts` — Uses 3 kernel functions
- `condenserApproach.engine.ts` — Uses 1 kernel function
- `reversing.engine.ts` — Uses 1 kernel function

#### Documentation
- `docs/phase-3.4/engine_math_inventory.md` — Complete physics inventory
- `docs/phase-3.4/kernel_api.md` — Kernel API documentation
- Updated all 7 engine docs with "Physics Core Dependencies" section

### Phase 3.5: Engine Hardening & Freeze

#### Tools Created
- `tools/validate-engine-docs.ts` — Engine Documentation Validator (EDV)
- `tools/generate-golden-matrix.ts` — Golden Test Matrix generator
- `tools/generate-fingerprints.ts` — Integrity fingerprint generator

#### Freeze Mechanisms
- `.github/workflows/freeze.yml` — CI workflow to block unauthorized engine edits
- `docs/contracts/ENGINE_FINGERPRINTS.json` — SHA-256 fingerprints for all frozen files
- `docs/contracts/golden-test-matrix.md` — "No drift permitted" test oracle

#### Documentation Mirror
All critical documentation copied to `docs/contracts/`:
- 7 engine contract documents
- Kernel API documentation
- Phase 3.4/3.5 completion docs
- DIL-1.0 license

### Completion Criteria (All Met)
- ✅ All physics removed from engines
- ✅ All engines call kernel exclusively
- ✅ All tests pass with 0 diffs (43 files, 135 tests)
- ✅ EDV passes all engine docs (7/7)
- ✅ Golden Test Matrix matches existing behavior
- ✅ Freeze enforcer active in CI
- ✅ Fingerprints generated
- ✅ Documentation mirror complete

**Phase 3 is now FROZEN.** Ready for Phase 4 (RTU + Split Systems).

---

## 2025-12-01 — Phase 3.3 — Engine Documentation & Licensing

### License Integration
- Added DiagX Internal License (DIL-1.0) at repository root (`LICENSE`)
- All engine documentation files include DIL-1.0 header
- Phase-3.3 strategy document includes DIL-1.0 header

### Engine Documentation Created
Seven structural engine contract documents following mandatory template:
- `docs/engines/airside.engine.md` — Airside diagnostic engine contract
- `docs/engines/refrigeration.engine.md` — Refrigeration diagnostic engine contract
- `docs/engines/hydronic.engine.md` — Hydronic diagnostic engine contract
- `docs/engines/condenserApproach.engine.md` — Condenser approach diagnostic engine contract
- `docs/engines/reversingValve.engine.md` — Reversing valve diagnostic engine contract
- `docs/engines/scrollCompressor.engine.md` — Scroll compressor diagnostic engine contract
- `docs/engines/recipCompressor.engine.md` — Reciprocating compressor diagnostic engine contract

### Documentation Guardrails Enforced
- NO thresholds exposed
- NO physics formulas revealed
- NO recommendation text included
- NO procedural guidance provided
- NO OEM/IOM references embedded
- Structural inputs/outputs only

### No Code Changes
- All 135 tests pass
- No engine behavior altered
- CombinedProfileResult unchanged

---

## 2025-12-01 — Phase 3.1 — Shared Types + Profile Runner Structural Layer

### Shared Types Created
- `ProfileInputSchema` — canonical ingestion surface with `Partial<Measurements>` per domain
- `CompletenessLevel` — `'full' | 'limited' | 'advisory' | 'skipped'`
- `ModuleResult<V,F>` — extends `EngineResult` with validation, completeness, summary
- 7 domain-specific aliases: `AirsideModuleResult`, `RefrigerationModuleResult`, etc.
- `CombinedProfileResult` — top-level orchestrator output contract

### Validation
- Created `runTierAValidation()` with 6 structural input checks:
  1. Null profile
  2. Negative pressures
  3. Impossible temperatures (< -50°F or > 300°F)
  4. Contradictory mode vs. measured temps
  5. Missing required-for-engine fields per domain
  6. Airflow override plausibility hook

### Completeness Classifier
- Created `classifyCompleteness()` to gate domain execution based on available measurements

### Orchestrator Refactor
- Refactored `wshp.diagx.ts` with dual-path architecture:
  - `runWshpDiagx()` — legacy function, full backward compatibility
  - `runCombinedProfile()` — new function returning `CombinedProfileResult`

### Type Alignment (Architect Override)
- Added `AirsideValues` alias in `airside.types.ts`
- Added `RefrigerationValues`, `RefrigerationFlags` interfaces in `refrigeration.types.ts`
- No engine behavior changed; all 135 tests pass

### Documentation
- Created implementation report: `docs/plans/Phase-3.1-Shared-Types-Implementation.md`

---

## 2025-12-01 — Phase 3.1 — Airside Airflow Override + TESP Safety Gate

### Features
- Added technician-supplied airflow override capability to airside module (`airflowCFMOverride` field)
- Implemented physics-based plausibility validation using TESP/CFM-per-ton matrix (`validateAirflowOverrideCFM`)
- Added `AirflowSource` type to track origin of authoritative airflow value (`inferred_deltaT`, `technician_override`, `measured`)
- Added `airflowCFM` and `airflowSource` fields to `AirsideEngineValues` and `AirsideEngineResult`
- Added `totalExternalStatic` field for explicit TESP input
- Added `airflowOverrideNote` field for technician documentation

### Validation
- Override gating at module layer with clear accept/reject logic
- Rejection reasons added to disclaimers when override fails plausibility checks
- Acceptance documented in disclaimers with technician note when provided

### Tests
- Added 17 new tests in `test/airside.override.test.ts`
- Full test suite: 135 tests passing
- ESLint clean

### Documentation
- Created detailed implementation plan: `docs/plans/Phase-3.1-Airside-Override-Implementation.md`
- Updated measurement help entries for new fields

### Previous Session Work (same date)
- Completed Phase 2.5-lite: Removed fake `dischargeSuperheat` metric from scroll compressor engine
- Created `COMMANDS.md` with all script and git commands
- Created `scripts/consolidate-under-review.js` for audit report generation
- Updated `FILE_TREE.md` with current structure and git links

---

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
