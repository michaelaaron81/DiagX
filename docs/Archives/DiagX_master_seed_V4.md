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
```

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

... (content abbreviated in this file for brevity; full seed exists under docs/process) ...

---

## V. Current State (V4)

As of V4:

* Engines (airside, refrigeration, recip, scroll, reversing valve, hydronic, condenser approach) are normalized and tested.
* Recommendation helpers exist for all engines and are flags-driven.
* Combined-profile orchestrator integrates all engines.
* Tests and stress runs are green; lint requires config cleanup and incremental hygiene. 

---

## VI. Governance

* `DiagX_master_seed_V4.md` is the canonical product and safety spec.
* `DiagX_engineer_seed_V2.md` defines what engineers are allowed to change.
* NO changes to physics, thresholds, or new engines are permitted outside an explicit roadmap update.
