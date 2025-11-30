# Engines — Core Spec (Phase 2)

Phase 2 introduced a set of structural rules that all engine authors and module maintainers must follow. These rules are intentionally conservative and non-physics-changing — they are about packaging, consistency, testing, and safety.

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

## Quick usage example (for engine authors)

Below is a minimal example showing the recommended `EngineResult<V,F>` contract in practice. Engines should return numeric `values`, boolean-typed `flags`, a top-level `status` and `recommendations` produced by a generator helper.

```ts
// src/shared/wshp.types.ts
export type DiagnosticStatus = 'ok' | 'warning' | 'alert' | 'critical';

export interface Recommendation { id: string; module: string; priority: string; action: string; reason?: string; requiresShutdown?: boolean }

export interface EngineResult<V extends Record<string, number>, F extends Record<string, any>> {
  status: DiagnosticStatus;
  values: V;
  flags: F;
  recommendations: Recommendation[];
}

// Example engine: src/modules/example/example.engine.ts
export function runExampleEngine(measurements: any): EngineResult<{ foo: number }, { fooStatus: DiagnosticStatus }> {
  const values = { foo: Number(measurements.foo ?? 0) };
  const flags = { fooStatus: values.foo > 10 ? 'critical' : 'ok' };

  const recs = generateExampleRecommendations({ values, flags, status: flags.fooStatus });

  return { status: flags.fooStatus, values, flags, recommendations: recs };
}

export function generateExampleRecommendations(result: EngineResult<{ foo: number }, { fooStatus: DiagnosticStatus }>) {
  const recs: Recommendation[] = [];
  if (result.flags.fooStatus === 'critical') {
    recs.push({ id: 'example_foo_critical', module: 'example', priority: 'critical', action: 'Take immediate action', reason: 'foo value exceeded safe limit', requiresShutdown: true });
  }
  return recs;
}

Refer to the tests under `test/` for concrete examples of engine inputs and expected behavior; adapt your tests from the engine-specific `.recommendations.test.ts` patterns for consistency.

