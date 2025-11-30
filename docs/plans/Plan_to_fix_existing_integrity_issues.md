Here’s a **focused repair plan** that covers every deficiency revealed by your integrity test, without leaving Phase 2.

I’ll break it into **11 concrete steps**. You can run them engine-by-engine, and use the VS Code mechanic for the mechanical edits.

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

... (existing text preserved)
