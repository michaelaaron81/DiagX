1. **Concrete to-do checklist** (what you / actually do in VS Code + git)
2. **`DiagX_master_seed_V4.md`** (clean, non-contradictory master seed)
3. **`DiagX_engineer_seed_V2.md`** (what engineers are allowed to touch right now)

---

## 1. Phase-2.4 Cleanup & Hardening – To-Do Checklist

### 1) Create a cleanup branch (optional but sane)

In repo root:

```bash
git checkout main
git pull
git checkout -b phase-2.4-cleanup
```

You can skip the branch if you truly don’t care about history, but this keeps the work grouped.

---

### 2) Delete conceptual / unusable engines

Per the file tree, conceptual engines live in the parking lot folder: `Engines to be extracted/`. 

1. In VS Code Explorer:

   * Right-click `Engines to be extracted/` → **Delete**.

2. Clean any references in docs:

   ```bash
   rg "Engines to be extracted" .
   rg "to be extracted" docs -n
   ```

   * Edit `FILE_TREE.md` and any process docs that mention that folder; remove or replace those lines. 

No changes in `src/` should be needed; these engines were not wired in.

---

### 3) Lock the Recommendation contract (types)

**File:** `src/shared/wshp.types.ts` 

1. Define `RecommendationIntent` and `RecommendationDomain`:

```ts
export type RecommendationIntent =
  | 'diagnostic'   // interpret flags, suggest further diagnostic clarification
  | 'safety'       // highlight risk; may set requiresShutdown
  | 'routing';     // send case to another workflow (repair/planning/etc.)

export type RecommendationDomain =
  | 'airside'
  | 'refrigeration'
  | 'compressor_recip'
  | 'compressor_scroll'
  | 'reversing_valve'
  | 'hydronic'
  | 'condenser_approach'
  | 'combined';
```

2. Replace the existing `Recommendation` interface with:

```ts
export interface Recommendation {
  id: string;
  domain: RecommendationDomain;
  severity: 'info' | 'advisory' | 'alert' | 'critical';
  intent: RecommendationIntent;

  summary: string;      // description of detected condition/risk
  rationale?: string;   // why it matters / flags behind it
  notes?: string[];     // optional clarifications, still non-procedural

  requiresShutdown?: boolean; // safety hint only, no “how”
}
```

3. If old fields exist (`action`, `estimatedTime`, `requiredParts`, `category`, etc.), **temporarily** leave them commented as deprecated so you can chase references:

```ts
// @deprecated – remove once migration complete
// action?: string;
// estimatedTime?: string;
// requiredParts?: string[];
// category?: string;
// priority?: string;
```

You’ll delete them fully at the end once tests are green.

---

### 4) Normalize all recommendation helpers to the new contract

**Files (examples, check `docs/inventory/DiagX_Engines_Inventory.md` for the full list):** 

* `src/modules/airside/airside.recommendations.ts`
* `src/modules/refrigeration/refrigeration.recommendations.ts`
* `src/modules/compressor/recip.recommendations.ts`
* `src/modules/compressor/scroll.recommendations.ts`
* `src/modules/reversingValve/reversing.recommendations.ts`
* `src/modules/hydronic/hydronic-source.recommendations.ts`
* `src/modules/condenser/condenser-approach.recommendations.ts`

For each `generateXxxRecommendations(...)`:

1. **Ensure every returned `Recommendation` sets:**

   * `domain`: the engine domain literal,
   * `intent`: one of

     * `'diagnostic'` – interpret flags, suggest more diagnostic checks,
     * `'safety'` – risk language; optional `requiresShutdown: true`,
     * `'routing'` – “this needs a different workflow/plan”.

2. **Stop writing repair fields**:

   * Remove assignments to `action`, `estimatedTime`, `requiredParts`, `category: 'repair'`, etc.
   * If you need to preserve meaning, rewrite into neutral `summary`/`rationale`/`notes`:

     * Describe the condition/risk.
     * Do **not** describe how to repair it.

3. **For clearly repair-oriented recs:**

   * Change them to `intent: 'routing'`.

   * Keep `summary` high-level, e.g.:

     > “Conditions indicate a non-trivial deviation from expected performance that cannot be resolved at the diagnostic layer; this case should be routed to a repair evaluation workflow.”

   * No steps, no parts, no times.

4. Run:

   ```bash
   npm run build
   npm test
   ```

   Fix compile errors and any broken tests due to missing fields.

---

### 5) Add Recommendation JSON schema + validator

**New file:** `src/schema/recommendation.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DiagX Recommendation",
  "type": "object",
  "additionalProperties": false,
  "required": ["id", "domain", "severity", "intent", "summary"],
  "properties": {
    "id": { "type": "string" },
    "domain": {
      "type": "string",
      "enum": [
        "airside",
        "refrigeration",
        "compressor_recip",
        "compressor_scroll",
        "reversing_valve",
        "hydronic",
        "condenser_approach",
        "combined"
      ]
    },
    "severity": {
      "type": "string",
      "enum": ["info", "advisory", "alert", "critical"]
    },
    "intent": {
      "type": "string",
      "enum": ["diagnostic", "safety", "routing"]
    },
    "summary": { "type": "string" },
    "rationale": { "type": "string" },
    "notes": {
      "type": "array",
      "items": { "type": "string" }
    },
    "requiresShutdown": { "type": "boolean" }
  }
}
```

**New file:** `src/shared/recommendation.schema.ts`

```ts
import Ajv, { ValidateFunction } from 'ajv';
import schema from '../schema/recommendation.schema.json';
import type { Recommendation } from './wshp.types';

const ajv = new Ajv({ allErrors: true, strict: true });
const validateFn: ValidateFunction = ajv.compile(schema);

export function validateRecommendation(rec: Recommendation): boolean {
  const valid = validateFn(rec);
  return Boolean(valid);
}
```

Install `ajv` if it’s not already in `package.json`:

```bash
npm install ajv
```

---

### 6) Add forbidden-wording guard

**New file:** `test/helpers/recommendationGuards.ts`

```ts
import type { Recommendation } from '../../src/shared/wshp.types';

const FORBIDDEN_PATTERNS: RegExp[] = [
  /\bshut\s+off\b/i,
  /\bturn\s+off\b/i,
  /\bturn\s+on\b/i,
  /\bcycle\s+power\b/i,
  /\breset\b/i,
  /\bclean\b/i,
  /\breplace\b/i,
  /\bchange\b/i,
  /\badjust\b/i,
  /\btighten\b/i,
  /\bloosen\b/i,
  /\bopen\b/i,
  /\bclose\b/i,
  /\bjumper\b/i,
  /\bverify\s+breaker\b/i
];

export function assertRecommendationTextSafe(rec: Recommendation): void {
  const text = [rec.summary, rec.rationale, ...(rec.notes ?? [])]
    .filter(Boolean)
    .join(' ');

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      throw new Error(
        `Forbidden repair-like wording in recommendation ${rec.id}: ${pattern}`
      );
    }
  }
}
```

You can tune the pattern list later.

---

### 7) Wire schema + guard into tests

For **each** `*.recommendations.test.ts` and any test that assembles combined recommendations:

1. At top of file:

```ts
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';
```

2. After getting `const recs = generateXxxRecommendations(...);`, add:

```ts
for (const rec of recs) {
  expect(validateRecommendation(rec)).toBe(true);
  expect(() => assertRecommendationTextSafe(rec)).not.toThrow();
}
```

3. For combined profile / orchestrator tests (where you have `result.recommendations`), run the same loop over the combined list.

4. Run:

```bash
npm test
```

Fix any failing rec wording by neutralizing language or switching intent to `'routing'`.

---

### 8) Remove legacy repair fields from `Recommendation`

Once tests are green and no code writes or reads the old repair fields:

1. Delete the deprecated fields from `Recommendation` in `wshp.types.ts`.

2. Search for any remaining references:

   ```bash
   rg "estimatedTime" .
   rg "requiredParts" .
   rg "action\"" .
   rg "category\": \"repair" .
   ```

   Clean any leftover JSON fixtures or docs. Combined stress-audit files from before are already consolidated and flagged as pre-policy artifacts in the report. 

3. Run:

   ```bash
   npm run build
   npm test
   ```

No remaining references = contract is locked.

---

### 9) ESLint / tsconfig cleanup (minimal but important)

From the consolidated report: ESLint currently sees 238 problems, many due to parserOptions pointing at files not in tsconfig. 

Do the minimum fix:

1. Create `tsconfig.eslint.json`:

```json
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*", "test/**/*", "scripts/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

2. Update `.eslintrc.cjs` to use it:

```js
parserOptions: {
  project: ['./tsconfig.eslint.json'],
  tsconfigRootDir: __dirname,
},
```

3. Run:

```bash
npm run lint
```

* Make sure parsing errors on `dist/*.d.ts` and test files disappear.
* You can leave some `no-explicit-any`/`no-unused-vars` warnings for now; they’re long-term hygiene.

---

### 10) Bump seeds: add V4 master, V2 engineer

**Files:**

* `docs/process/DiagX_master_seed_V3.md`
* `docs/process/DiagX_engineer_seed_V1.md` 

1. Create new files:

* `docs/process/DiagX_master_seed_V4.md` – contents: use the V4 seed I’ll give you below.
* `docs/process/DiagX_engineer_seed_V2.md` – contents: use the V2 seed I’ll give you below.

2. At the very top of V3/V1, add a simple banner:

```text
[DEPRECATED] Superseded by DiagX_master_seed_V4.md as of 2025-11-29.
```

and similar for Engineer seed.

3. Update `FILE_TREE.md` references so V4/V2 are listed as canonical. 

---

### 11) Update FILE_TREE and any doc references

**File:** `FILE_TREE.md` (top-level). 

1. Remove `Engines to be extracted/` from the tree.

2. Under `docs/process/`, add `DiagX_master_seed_V4.md` and `DiagX_engineer_seed_V2.md` and describe them as the *current* seeds.

3. Ensure references to audits match the new reality (you now have a consolidated test/lint report and a small set of curated audits, not all the timestamped artifacts). 

---

### 12) Final verification & commit

1. Run:

```bash
npm run build
npm test
npm run lint
```

2. Commit and merge:

```bash
git status
git add .
git commit -m "Phase 2.4 cleanup: remove conceptual engines, lock recommendation contract, bump seeds to V4/V2"
git push --set-upstream origin phase-2.4-cleanup
# merge however you prefer
```

At that point, the repo is sanitized, recommendation contract locked, and seeds aligned.

---

## 2. `docs/process/DiagX_master_seed_V4.md`

Here’s a clean V4 seed, aligned with repository reality and the new safety constraints:

````md
# DiagX Master Seed — V4

Version: 4  
Date: 2025-11-29  
Scope: DiagX HVAC Diagnostic Engine (WSHP/ASHP focus)  
Status: Phase 2.4 complete; engines normalized and safety contract enforced at recommendation level.

---

## I. System Role

DiagX is a **diagnostic** engine, not a repair planner.

- It converts **measurements + profile** → **numeric analysis → flags → diagnostic status + recommendations**.
- Recommendations are **diagnostic / safety / routing**, never procedural repair steps.
- Any repair planning or step-by-step guidance lives **outside** DiagX (e.g., separate planner, DreamWeaver layer, or human review).

---

## II. Architecture Rules (Four-Layer Model)

DiagX uses a strict four-layer architecture:

1. **Types Layer** (`src/shared/*.ts`)
2. **Engine Layer** (`*.engine.ts`)
3. **Recommendation Layer** (`*.recommendations.ts`)
4. **Module Layer** (`*.module.ts`)

### 1. Types Layer

**Files (non-exhaustive):**

- `src/shared/wshp.types.ts`
- `src/shared/validation.types.ts`
- `src/shared/recommendation.schema.ts`
- `src/schema/recommendation.schema.json`

**Contains ONLY:**

- Measurement definitions
- Profile / config slices
- Shared value objects
- Flag enums
- `EngineResult<V,F>` shape
- `DiagnosticStatus`
- `Recommendation` interface and JSON schema

**Does NOT contain:**

- Numeric thresholds
- Physics
- UI strings
- OEM/IOM tables
- Troubleshooting logic

Types define **structure only**.

---

### 2. Engine Layer

**Files:** `src/modules/**/[*].engine.ts`

**Responsibilities:**

- Pure numeric physics
- Threshold application
- Flag determination
- Status rollup (OK / warning / alert / critical)
- Construct `EngineResult<V,F>` (values + flags, no text)

**Must NOT:**

- Output human language
- Output procedures or steps
- Duplicate thresholds across files
- Recompute or override other engines’ flags
- Contain OEM/IOM data
- Produce recommendations

Engines compute **numbers → flags → status**, nothing else.

---

### 3. Recommendation Layer

**Files:** `src/modules/**/[*].recommendations.ts`

**Responsibilities:**

- Map engine flags → `Recommendation[]`
- Classify intent: `diagnostic` / `safety` / `routing`
- Set severities and domains

**Hard constraints:**

- No numeric thresholds
- No physics
- No new flag derivation
- No UI formatting for reports

**Recommendation contract (canonical):**

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
````

* JSON schema lives in `src/schema/recommendation.schema.json`.
* Runtime validation: `validateRecommendation()` in `src/shared/recommendation.schema.ts`.

**Forbidden in Recommendation objects:**

* Repair plans (no `estimatedTime`, `estimatedCost`, `requiredParts`)
* Procedural actions (no “replace”, “clean”, “adjust”, “shut off”, etc.)

If a condition clearly implies repairs, the recommendation must use:

* `intent: 'routing'`
* Neutral summary describing why this case should be routed to a repair/planning workflow.

---

### 4. Module Layer

**Files:** `src/modules/**/[*].module.ts`

**Responsibilities:**

* Input validation

* Mapping `CombinedProfile` → engine inputs

* Running the engine

* Calling recommendation helpers

* Assembling module-level results for consumption by:

  * CLI / API
  * DreamWeaver schema
  * Combined profile orchestrator

* Generating **human-readable summaries** for the UI (but still non-procedural).

**Must NOT:**

* Change engine values or flags
* Recalculate thresholds
* Add new diagnostic logic or flags
* Introduce repair steps
* Add time/cost/parts details

Modules are **presentation + wiring** only.

---

## III. Safety Rules

DiagX is **life/safety-adjacent**. All outputs must be physics-grounded and conservative.

**Absolute prohibitions:**

* OEM/IOM tables or proprietary manufacturer curves in the repo
* Step-by-step repair instructions
* Instructions about opening panels, cycling power, manipulating electrical components or valves
* Time/cost/parts estimates
* “How to fix it” language

**Allowed:**

* Clear description of **state** and **risk**
* Diagnostic guidance (“additional measurements that would clarify the state”)
* Safety guidance in the form of:

  * `intent: 'safety'`
  * `requiresShutdown: true` when flags indicate critical risk

**Shutdown policy:**

* Shutdown allowed only when:

  * A critical flag exists **and**
  * Engine physics supports this severity

Even then, recommendations describe **why operation is unsafe**, not how to de-energize equipment.

---

## IV. Roadmap (Phase Summary)

Phases describe **code state** and **future work**.

### Phase 1 — Foundation & Framework

Status: **Complete**

* Core types and structures
* `EngineResult<V,F>`, `DiagnosticStatus`, `Recommendation`
* Combined profile structures
* Vitest baseline
* Separation of engine / module / recommendation layers

### Phase 2 — Engine Normalization & Recommendation Integrity

Status: **Complete through 2.4**

Sub-phases:

* **2.1 Engine Normalization**

  * Airside, refrigeration, recip, scroll, reversing valve normalized to `EngineResult<V,F>`.
  * Presentation stripped from engines; shared types enforced. 

* **2.2 Recommendation Baseline**

  * Recommendation helpers for all engines, flags-driven only.
  * No physics in rec helpers; tests added.

* **2.3 Recommendation Completeness & Gaps**

  * Gap-scan harness built, missing rec branches filled for all engines.
  * No engine flags without at least one recommendation path. 

* **2.4 Hydronic & Condenser Approach Engines** 

  * Hydronic Source engine (`water_loop` domain):

    * Computes loop ΔT and compares against design/expected ranges.
    * Computes flow vs design; sets `deltaTStatus`, `flowStatus`.
    * Flags-driven recommendations mapped for non-OK cases.

  * Condenser Approach engine (`condenser_approach` domain):

    * Uses refrigerant PT data for condensing saturation temperature.
    * Computes condenser approach and liquid subcooling.
    * Sets `approachStatus`, `subcoolingStatus`.
    * Flags-driven recommendations mapped for deviations.

  * Orchestrator:

    * Runs hydronic diagnostics when `profile.waterSide` + water measurements present.
    * Runs condenser approach checks when ambient + condensing pressure available.
    * Adds `water_loop` and `condenser_approach` domains to combined results. 

  * Tests:

    * Engine, recommendation, and module tests for both new engines.
    * Combined-profile stress tests include hydronic & condenser scenarios.
    * Full Vitest run: ≥ 114 tests passing. 

### Phase 3 — Profile Wiring & Config Validation

Status: **Design only (locked)**

* Advanced profile shaping
* Cross-profile validations
* Manufacturer-range arbitration logic
* Multi-stage orchestration

**No Phase 3 work is authorized yet.**

---

## V. Current State (V4)

As of V4:

* Engines (airside, refrigeration, recip, scroll, reversing valve, hydronic, condenser approach) are normalized and tested.
* Recommendation helpers exist for all engines and are flags-driven.
* Combined-profile orchestrator integrates all engines.
* Tests and stress runs are green; lint requires config cleanup and incremental hygiene. 

**Authorized work window (pre-Phase 2.5):**

* Recommendation contract enforcement:

  * Implement and maintain `Recommendation` JSON schema + validator.
  * Maintain forbidden-wording guard tests.
* Repository hygiene:

  * Delete conceptual engines not used by `src/`.
  * Maintain consolidated audits; avoid pre-policy artifact proliferation.
  * Fix ESLint configuration and incremental type hygiene.

**No engine physics, thresholds, or flag logic may be changed without explicit architect approval.**

---

## VI. Governance

* `DiagX_master_seed_V4.md` is the canonical product and safety spec.
* `DiagX_engineer_seed_V2.md` defines what engineers are allowed to change.
* NO changes to physics, thresholds, or new engines are permitted outside an explicit roadmap update.

Any future Phase 2.5+ work must be added to this seed and then mirrored into the engineer seed before implementation.

````

---

## 3. `docs/process/DiagX_engineer_seed_V2.md`

Engineer-facing, contradiction-free, aligned with V4:

```md
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
````

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

```

```
