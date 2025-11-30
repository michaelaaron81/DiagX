> NOTE: The canonical implementation/repair plan now lives at `docs/plans/Plan_to_fix_existing_integrity_issues.md`.

This document copy is kept for traceability; please reference `docs/plans/Plan_to_fix_existing_integrity_issues.md` for the canonical plan.

---

## 0) Pre-flight: lock the target list

These are the files we’re touching in Phase 2:

* `src/modules/airside/airside.engine.ts`
* `src/modules/airside/airside.module.ts`
* `src/modules/airside/airside.types.ts`
* `src/modules/compressor/recip.engine.ts`
* `src/modules/compressor/scroll.engine.ts`
* `src/modules/refrigeration/refrigeration.engine.ts`
* `src/modules/reversingValve/reversing.engine.ts`
* `src/modules/reversingValve/reversing.module.ts`
* Corresponding tests under `test/` for each engine/module

Nothing else.

---

## 1) Ensure shared types are the single source of truth

In `src/shared/wshp.types.ts` make sure you have:

```ts
export type DiagnosticStatus = 'ok' | 'warning' | 'alert' | 'critical';

export interface Recommendation {
  id: string;
  category: 'repair' | 'maintenance' | 'further_testing' | 'safety';
  severity: DiagnosticStatus;
  action: string;
  rationaleFlag: string;
  requiresShutdown: boolean;
  notes?: string;
}

export interface EngineResult<
  V extends Record<string, number> = Record<string, number>,
  F extends Record<string, boolean> = Record<string, boolean>
> {
  status: DiagnosticStatus;
  values: V;
  flags: F;
  recommendations: Recommendation[];
}
```

Then:

* Remove any **local copies** of `DiagnosticStatus`, `Recommendation`, or `EngineResult` from engine/module/type files.
* Import these from `src/shared/wshp.types.ts` everywhere.

If that’s already true, move on.

---

## 2) Airside – define `Values` and `Flags` and clean the return shape

Open `src/modules/airside/airside.types.ts` and:

1. Define explicit types:

```ts
export interface AirsideValues {
  deltaT: number;
  // any other numeric results emitted by the engine
}

export interface AirsideFlags {
  lowDeltaT: boolean;
  highDeltaT: boolean;
  airflowConcern: boolean;
  // all existing boolean flags, but ONLY booleans
}
```

2. In `airside.engine.ts`:

```ts
import { EngineResult } from '../../shared/wshp.types';
import { AirsideValues, AirsideFlags } from './airside.types';

export type AirsideEngineResult = EngineResult<AirsideValues, AirsideFlags>;
```

3. Change the engine signature:

```ts
export function runAirsideEngine(
  measurements: AirsideMeasurements,
  config: AirsideConfig
): AirsideEngineResult {
  // ...
}
```

4. Build the return object as:

```ts
const values: AirsideValues = {
  deltaT,
  // ...
};

const flags: AirsideFlags = {
  lowDeltaT,
  highDeltaT,
  airflowConcern,
  // ...
};

let status: DiagnosticStatus = 'ok';
// derive status from flags exactly as you do now

let result: AirsideEngineResult = {
  status,
  values,
  flags,
  recommendations: []
};

result.recommendations = generateAirsideRecommendations(result);
return result;
```

At this point, **nothing** in the engine result should be:

* free-floating string fields like `deltaTMessage`, `overallFinding`, `likelyIssue`.

Those become module responsibilities.

---

## 3) Airside – move all human text out of the engine into the module

Still in `airside.engine.ts`:

* Remove any string literals that are clearly technician-facing:

  * `"operating normally"`, `"low delta-T"`, `"coil is frozen"`, etc.
* If they’re part of “what’s wrong / what to do” logic, **copy them into a note and paste into the module**.

In `airside.module.ts`:

1. Add helper(s) to translate flags + values into explanation text:

```ts
function buildAirsideFinding(result: AirsideEngineResult): string {
  const { values, flags } = result;

  // Use the same conditions the engine used for its old strings,
  // but now you decide the wording here.
}

function buildAirsideLikelyIssue(result: AirsideEngineResult): string | null {
  // Similar: use flags and values, not new logic.
}
```

2. In the module’s `diagnose` or equivalent:

* Call `runAirsideEngine(...)` to get `AirsideEngineResult`.
* Build your explanation object using those helpers.
* Do NOT modify `result.values`, `result.flags`, or `result.recommendations` in the module.

If tests currently expect strings on the engine result, update them to:

* assert on the module’s explanation output
* assert that `engineResult.values`/`flags` are correct instead of string fields.

---

## 4) Airside – unify recommendations into a helper

In `airside.engine.ts`:

1. Add:

```ts
import { Recommendation } from '../../shared/wshp.types';

export function generateAirsideRecommendations(
  result: AirsideEngineResult
): Recommendation[] {
  const recs: Recommendation[] = [];
  const { flags } = result;

  // Use the same conditions you already have:
  // - lowDeltaT → airflow investigation rec
  // - etc.
  // No new thresholds, no new conditions.

  return recs;
}
```
