# Engines — Core Spec (Phase 2) (moved)

Phase 2 introduced a set of structural rules that all engine authors and module maintainers must follow. These rules are intentionally conservative and non-physics-changing — they are about packaging, consistency, testing, and safety.

> NOTE: The canonical copy of this spec is now `docs/inventory/Engines_Core_Spec.md`. Please consult that file for the authoritative EngineResult contract guidance.

Key rules:

- All engines must return an `EngineResult<V, F>` shape (see `src/shared/wshp.types.ts`), where:
  - `values` contains numeric facts only (numbers, optional numeric arrays/objects).
  - `flags` contains diagnostic booleans and `DiagnosticStatus` indicators (no free-form human text).
  - `status` is the domain-level `DiagnosticStatus` (ok | warning | alert | critical).
  - `recommendations` remains a `Recommendation[]` with textual guidance (this is the canonical place for human-facing guidance).

- Engines must export a dedicated recommendation helper `generateXxxRecommendations(resultOrParams)` and populate `recommendations` by calling it from the main engine function. Recommendation logic must be driven only by engine facts and flags (no new hidden thresholds).

- Engines must not produce presentation-level strings (messages, findings) in their outputs; any human-facing text should be created by the module layer or UI using engine facts and flags. This keeps engine outputs machine-friendly and easier to unit-test.

- Validation: Before running the engine, modules should invoke a conservative validation helper to reject obviously invalid input (missing/absurd/inconsistent measurements). Phase 1 implemented this for `refrigeration`; Phase 2 adds `airside`.

Files involved in Phase 2 (non-exhaustive):
- `src/shared/validation.types.ts` (validation contract)
- `src/modules/refrigeration/refrigeration.validation.ts` (refrigeration checks)
- `src/modules/airside/airside.validation.ts` (airside checks)
- Engines normalized to use `EngineResult<V,F>` and exported recommendation helpers.
