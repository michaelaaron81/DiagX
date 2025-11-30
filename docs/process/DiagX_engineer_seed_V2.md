# DiagX Engineer Seed — V2

Version: 2  
Date: 2025-11-29  
Scope: Day-to-day engineering rules for DiagX (Phase 2.4 cleanup & safety hardening)

---

## 1. Role & Boundaries

You are working inside the DiagX diagnostic engine, **not** a repair planner.

Your responsibilities in V2:

- Maintain and extend the engine **within** the constraints of Master Seed V4.
- Implement the **Recommendation contract and safety guards**.
- Clean up repository hygiene issues (lint, conceptual engines, doc alignment).

You may **not**:

- Change physics or thresholds.
- Add new engines.
- Modify engine flags or status rollup behavior.
- Introduce repair guidance, time/cost/parts, or procedural instructions.

---

## 2. Architecture You Must Respect

Layers:

1. **Types** (`src/shared/**.ts`, `src/schema/**.json`)
2. **Engines** (`*.engine.ts`)
3. **Recommendations** (`*.recommendations.ts`)
4. **Modules** (`*.module.ts`)

Rules:

- Engines → **numbers, flags, status only**.
- Recommendations → **flags → `Recommendation[]` only**.
- Modules → **validation, wiring, and presentation**, no new physics.

Do not bypass or blur those boundaries.

---

## 3. Recommendation Contract (What You Must Enforce)

Use the canonical contract from `src/shared/wshp.types.ts`:

```ts
export type RecommendationIntent =
  | 'diagnostic'
  | 'safety'
  | 'routing';

export type RecommendationDomain =
  | 'airside'
  | 'refrigeration'
  | 'compressor_recip'
  | 'compressor_scroll'
  | 'reversing_valve'
  | 'hydronic'
  | 'condenser_approach'
  | 'combined';

export interface Recommendation {
  id: string;
  domain: RecommendationDomain;
  severity: 'info' | 'advisory' | 'alert' | 'critical';
  intent: RecommendationIntent;
  summary: string;
  rationale?: string;
  notes?: string[];
  requiresShutdown?: boolean;
}
```

You must:

* Use this interface everywhere in code.
* Keep schema in sync with `src/schema/recommendation.schema.json`.
* Ensure `validateRecommendation()` passes for *all* recommendations produced by helpers and orchestrator.

You must **not**:

* Re-introduce fields such as `action`, `estimatedTime`, `estimatedCost`, `requiredParts`, or `category: 'repair'` into `Recommendation`.

If a prior artifact or test uses those fields, migrate or delete it — do not extend its usage.

---

## 4. Authorized Work (Phase 2.4 Cleanup)

During this seed, you are authorized to do **only** the following categories of changes.

### 4.1. Remove conceptual / unused engines

* Delete `Engines to be extracted/` and any similar non-wired engine folders.
* Ensure `tsconfig.json` and imports do not reference these files.
* Update `FILE_TREE.md` and any docs that mention the deleted folder.

### 4.2. Lock recommendation helpers to the contract

For each engine:

* `src/modules/airside/airside.recommendations.ts`
* `src/modules/refrigeration/refrigeration.recommendations.ts`
* `src/modules/compressor/recip.recommendations.ts`
* `src/modules/compressor/scroll.recommendations.ts`
* `src/modules/reversingValve/reversing.recommendations.ts`
* `src/modules/hydronic/hydronic-source.recommendations.ts`
* `src/modules/condenser/condenser-approach.recommendations.ts`

You must:

1. Ensure every returned `Recommendation` sets:

   * `domain` to the appropriate literal.
   * `intent` to `diagnostic`, `safety`, or `routing`.

2. Remove any use of repair-style fields:

   * Do not assign `action`, `estimatedTime`, `requiredParts`, or similar.

3. Neutralize wording:

   * `summary`, `rationale`, `notes` must describe conditions, risks, or diagnostic clarifications.
   * No imperative verbs (“replace”, “clean”, “shut off”, “open panel”, etc.).

4. Use `intent: 'routing'` when the appropriate outcome is to hand off to a repair/planning workflow.

### 4.3. Implement schema validation

You must:

* Maintain `src/schema/recommendation.schema.json` to reflect the `Recommendation` type (one source of truth).
* Maintain `src/shared/recommendation.schema.ts`:

  * `validateRecommendation(rec: Recommendation): boolean` must compile the JSON schema once and validate all recs.

All recommendation tests must call `validateRecommendation` on their results.

### 4.4. Implement and apply forbidden-wording guard

You must:

* Maintain `test/helpers/recommendationGuards.ts` (or equivalent shared helper).
* Keep the `FORBIDDEN_PATTERNS` list conservative but covering obvious repair actions.

All tests that see `Recommendation[]` must:

* Call `assertRecommendationTextSafe(rec)` for each rec.
* Fail if any rec text contains forbidden patterns.

If a needed change conflicts with the pattern list, adjust wording, not patterns, unless there is a clear false-positive.

### 4.5. ESLint / tsconfig hygiene

You are authorized to:

* Add `tsconfig.eslint.json` and point `.eslintrc.cjs` at it.
* Restrict ESLint’s `parserOptions.project` to `src/`, `test/`, and `scripts/`.
* Reduce parsing errors related to `dist/*.d.ts` and out-of-scope test files.
* Incrementally clear `no-unused-vars` and `no-explicit-any` warnings in **shared** and **public-facing** modules.

You are **not** required to drive lint to zero warnings in this seed, but you may do so if it does not require changing engine physics.

### 4.6. Documentation updates

You are authorized to:

* Add `docs/process/DiagX_master_seed_V4.md` and `DiagX_engineer_seed_V2.md`.
* Mark V3/V1 seeds as deprecated (do not delete them).
* Update `FILE_TREE.md` to:

  * Remove conceptual engines.
  * Add V4/V2 as canonical seeds.
  * Reflect the current set of curated audits and consolidated reports.

You must not:

* Change `NO_OEM_IOM.md` policy without architect approval.
* Add any OEM/IOM tables or proprietary curves to the repo.

---

## 5. Explicit “Do NOT Touch” List

Until a future seed authorizes new work:

* **Do NOT modify:**

  * Engine physics or thresholds in any `*.engine.ts`.

  * Flag enums or status rollup logic in engines.

  * Combined-profile orchestrator behavior, except:

    * Where necessary to pass schema/guard tests on recommendations only.

  * `NO_OEM_IOM.md` contents.

  * Any file under `docs/` that describes field safety policy beyond adding V4/V2 seeds and aligning references.

* **Do NOT add:**

  * New engine categories.
  * New recommendation domains.
  * New on-disk audit formats that bypass the recommendation schema/guardrails.

---

## 6. Completion Criteria for This Seed

You are “done” with Engineer Seed V2 when all of the following are true:

1. `npm run build` passes.

2. `npm test` passes, including:

   * All engine-specific recommendation tests.
   * All combined-profile/orchestrator tests.
   * All tests calling `validateRecommendation` and `assertRecommendationTextSafe`.

3. `npm run lint` runs with:

   * No parser errors.
   * Only manageable style warnings (or zero, if you choose to fix them).

4. `Recommendation` interface contains **no** repair/time/parts fields.

5. Schema and type are in sync.

6. `FILE_TREE.md` and `docs/process/` reflect:

   * V4 master seed as canonical.
   * V2 engineer seed as active.
   * No `Engines to be extracted/` folder.

At that point, further changes require a new master/engineer seed pair (Phase 2.5 or Phase 3).
