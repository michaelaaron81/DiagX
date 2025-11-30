Good. I’m going to give you **two full engine scaffolds** at the same level of detail as your existing domains, but without any “cute” naming:

* **Hydronic source domain** (WSHP / GSHP loop side)
* **Condenser approach domain** (ASHP outdoor coil)

Both are structured to match your current patterns:

* `*.types.ts` → measurements, config, values, flags, EngineResult alias
* `*.engine.ts` → pure numeric logic + boolean flags + recommendation helper
* `values` = numbers only
* `flags` = booleans only
* `recommendations` = `Recommendation[]` via `generateXxxRecommendations`

You will need to align a couple of small things (exact import paths and the `Recommendation` shape) to your `wshp.types.ts`, but the physics and structure are ready to drop in.

---

## 1) Hydronic Source Domain (WSHP / GSHP loop)

### 1.1 Proposed file layout

```text
src/modules/hydronicSource/
├─ hydronicSource.types.ts
└─ hydronicSource.engine.ts
```

You’ll add `hydronicSource.module.ts` later in the Phase-2/3 mini-cycle, once profiles are ready.

---

### 1.2 `src/modules/hydronicSource/hydronicSource.types.ts`

```ts
import {
  DiagnosticStatus,
  EngineResult,
  Recommendation,
} from '../../shared/wshp.types';

/**
 * Measurements required from the field for hydronic loop evaluation.
 *
 * All temps in °F, flow in GPM.
 * Null / undefined = not measured or not applicable.
 */
export interface HydronicSourceMeasurements {
  /**
   * Entering water temperature to the unit (loop side).
   * For WSHP: this is typically loop entering the heat pump.
   */
  enteringWaterTemp: number | null;

  /**
   * Leaving water temperature from the unit (loop side).
   */
  leavingWaterTemp: number | null;

  /**
   * Optional measured flow through the unit, if available.
   * This is NOT required for the basic ΔT-based evaluation.
   */
  flowGpm?: number | null;

  /**
   * Optional “as found” loop temperature at a remote point
   * (header or common manifold), if available.
   */
  loopHeaderTemp?: number | null;
}

/**
 * Configuration for interpreting hydronic measurements.
 * This is profile-level or design-level data, not live measurements.
 */
export interface HydronicSourceConfig {
  /**
   * Expected (design) loop ΔT across the unit in cooling/heating mode.
   * Example: 10°F or 12°F depending on WSHP/GSHP design.
   */
  expectedDeltaT: number;

  /**
   * Allowed deviation below expected ΔT before flagging as low-load
   * or over-pumping. Example: 2°F.
   */
  deltaTLowTolerance: number;

  /**
   * Allowed deviation above expected ΔT before flagging as low-flow
   * or high-load. Example: 3°F.
   */
  deltaTHighTolerance: number;

  /**
   * Minimum acceptable loop entering temp for the unit to operate
   * as designed (e.g., min EWT for cooling, or for GSHP heating).
   */
  minOperatingTemp: number;

  /**
   * Maximum acceptable loop entering temp for the unit to operate
   * as designed.
   */
  maxOperatingTemp: number;
}

/**
 * Numeric outputs from the hydronic source engine.
 */
export interface HydronicSourceValues {
  /**
   * Simple ΔT across the unit coil on the water side.
   * Positive = entering hotter than leaving.
   */
  deltaT: number | null;

  /**
   * deltaT normalized against expectedDeltaT.
   * 1.0 ≈ on target, <1 low ΔT, >1 high ΔT.
   */
  normalizedDeltaT: number | null;

  /**
   * Resolved “effective entering temp” used for bounds checks.
   * Typically just enteringWaterTemp, but may fall back to
   * loopHeaderTemp if needed.
   */
  effectiveEnteringTemp: number | null;
}

/**
 * Boolean flags representing facts about the hydronic loop,
 * not interpretations or “likely causes”.
 */
export interface HydronicSourceFlags {
  /**
   * True when we have enough temperature data to compute ΔT.
   */
  hasValidTemps: boolean;

  /**
   * True when one or more critical measurements are missing.
   */
  missingRequiredMeasurements: boolean;

  /**
   * True when the measured ΔT is below the acceptable band
   * around expectedDeltaT.
   */
  deltaTBelowExpected: boolean;

  /**
   * True when the measured ΔT is above the acceptable band
   * around expectedDeltaT.
   */
  deltaTAboveExpected: boolean;

  /**
   * True when the loop entering temp is below minimum
   * operating temperature for this unit/profile.
   */
  enteringTempBelowMin: boolean;

  /**
   * True when the loop entering temp is above maximum
   * operating temperature for this unit/profile.
   */
  enteringTempAboveMax: boolean;
}

/**
 * EngineResult alias for the hydronic source domain.
 */
export type HydronicSourceEngineResult = EngineResult<
  HydronicSourceValues,
  HydronicSourceFlags
>;

/**
 * Optional context for generating recommendations.
 * You can expand this as needed to carry profile/model info.
 */
export interface HydronicSourceRecommendationContext {
  profileId?: string;
  loopType?: 'building_loop' | 'ground_loop' | 'unknown';
  mode?: 'cooling' | 'heating';
}
```

---

### 1.3 `src/modules/hydronicSource/hydronicSource.engine.ts`

```ts
import {
  DiagnosticStatus,
  Recommendation,
} from '../../shared/wshp.types';
import {
  HydronicSourceConfig,
  HydronicSourceEngineResult,
  HydronicSourceFlags,
  HydronicSourceMeasurements,
  HydronicSourceValues,
  HydronicSourceRecommendationContext,
} from './hydronicSource.types';

/**
 * Primary hydronic source evaluation.
 *
 * Inputs:
 *  - field measurements (temps, optional flow)
 *  - profile / design config (expected ΔT and bounds)
 *
 * Outputs:
 *  - EngineResult<HydronicSourceValues, HydronicSourceFlags>
 *    with status, numeric values, boolean flags, and recommendations.
 */
export function runHydronicSourceEngine(
  measurements: HydronicSourceMeasurements,
  config: HydronicSourceConfig,
  context: HydronicSourceRecommendationContext = {}
): HydronicSourceEngineResult {
  const values: HydronicSourceValues = {
    deltaT: null,
    normalizedDeltaT: null,
    effectiveEnteringTemp: null,
  };

  const flags: HydronicSourceFlags = {
    hasValidTemps: false,
    missingRequiredMeasurements: false,
    deltaTBelowExpected: false,
    deltaTAboveExpected: false,
    enteringTempBelowMin: false,
    enteringTempAboveMax: false,
  };

  const { enteringWaterTemp, leavingWaterTemp, loopHeaderTemp } =
    measurements;

  const enteringIsNumber = typeof enteringWaterTemp === 'number';
  const leavingIsNumber = typeof leavingWaterTemp === 'number';

  // Effective entering temp = primary EWT if available, else header.
  const effectiveEntering =
    typeof enteringWaterTemp === 'number'
      ? enteringWaterTemp
      : typeof loopHeaderTemp === 'number'
      ? loopHeaderTemp
      : null;

  values.effectiveEnteringTemp = effectiveEntering;

  // Check if we can compute ΔT.
  if (!enteringIsNumber || !leavingIsNumber) {
    flags.missingRequiredMeasurements = true;

    const result: HydronicSourceEngineResult = {
      status: deriveHydronicSourceStatus(flags),
      values,
      flags,
      recommendations: [],
    };

    return {
      ...result,
      recommendations: generateHydronicSourceRecommendations(
        result,
        context
      ),
    };
  }

  flags.hasValidTemps = true;

  const deltaT = enteringWaterTemp! - leavingWaterTemp!;
  values.deltaT = deltaT;

  const expected = config.expectedDeltaT;
  const hasExpected =
    typeof expected === 'number' && expected > 0;

  if (hasExpected) {
    values.normalizedDeltaT = deltaT / expected;

    const lowThreshold =
      expected - config.deltaTLowTolerance;
    const highThreshold =
      expected + config.deltaTHighTolerance;

    if (deltaT < lowThreshold) {
      flags.deltaTBelowExpected = true;
    }

    if (deltaT > highThreshold) {
      flags.deltaTAboveExpected = true;
    }
  } else {
    values.normalizedDeltaT = null;
  }

  // Operating temp bounds check based on effective entering temp
  if (typeof effectiveEntering === 'number') {
    if (effectiveEntering < config.minOperatingTemp) {
      flags.enteringTempBelowMin = true;
    }

    if (effectiveEntering > config.maxOperatingTemp) {
      flags.enteringTempAboveMax = true;
    }
  }

  const status = deriveHydronicSourceStatus(flags);

  const baseResult: HydronicSourceEngineResult = {
    status,
    values,
    flags,
    recommendations: [],
  };

  return {
    ...baseResult,
    recommendations: generateHydronicSourceRecommendations(
      baseResult,
      context
    ),
  };
}

/**
 * Map flag set → overall DiagnosticStatus.
 *
 * Status priority:
 *  - critical: missingRequiredMeasurements OR both temp bound + ΔT issue
 *  - alert: any temp bound violation OR clear ΔT deviation
 *  - warning: mild ΔT deviation only
 *  - ok: none of the above
 */
function deriveHydronicSourceStatus(
  flags: HydronicSourceFlags
): DiagnosticStatus {
  if (flags.missingRequiredMeasurements) {
    return 'critical';
  }

  if (
    flags.enteringTempBelowMin ||
    flags.enteringTempAboveMax
  ) {
    if (flags.deltaTBelowExpected || flags.deltaTAboveExpected) {
      return 'critical';
    }
    return 'alert';
  }

  if (
    flags.deltaTAboveExpected ||
    flags.deltaTBelowExpected
  ) {
    // If we wanted to distinguish severe vs mild we could do so
    // via normalizedDeltaT bands in future, but for now:
    return 'alert';
  }

  return 'ok';
}

/**
 * Recommendation helper for hydronic source domain.
 *
 * NOTE:
 * - This uses only flags and numeric values.
 * - It does NOT infer root causes; it proposes checks.
 * - Align Recommendation shape with `src/shared/wshp.types.ts`.
 */
export function generateHydronicSourceRecommendations(
  result: HydronicSourceEngineResult,
  context: HydronicSourceRecommendationContext = {}
): Recommendation[] {
  const recs: Recommendation[] = [];
  const { flags } = result;

  const moduleId = 'hydronic_source';

  // Missing data: prompt technician to capture required temps.
  if (flags.missingRequiredMeasurements) {
    recs.push({
      // Adjust fields to match your Recommendation type.
      id: `${moduleId}.capture_temps`,
      module: moduleId,
      priority: 'critical',
      title: 'Capture loop entering and leaving water temperatures',
      description:
        'Measure and record entering and leaving water temperatures at the unit to allow hydronic loop evaluation.',
    } as unknown as Recommendation);
    return recs;
  }

  // Loop temp bounds
  if (flags.enteringTempBelowMin) {
    recs.push({
      id: `${moduleId}.loop_too_cold`,
      module: moduleId,
      priority: 'alert',
      title: 'Loop entering temperature below configured minimum',
      description:
        'Verify loop temperature source (tower/ground loop/plant) and confirm the loop is within design range for this unit before continued operation.',
    } as unknown as Recommendation);
  }

  if (flags.enteringTempAboveMax) {
    recs.push({
      id: `${moduleId}.loop_too_hot`,
      module: moduleId,
      priority: 'alert',
      title: 'Loop entering temperature above configured maximum',
      description:
        'Verify loop temperature source and confirm tower/heat-rejection capacity and flows are adequate. Investigate system-level loading on the loop.',
    } as unknown as Recommendation);
  }

  // ΔT deviations
  if (flags.deltaTBelowExpected) {
    recs.push({
      id: `${moduleId}.delta_t_low`,
      module: moduleId,
      priority: 'warning',
      title: 'Hydronic ΔT below expected band',
      description:
        'Check for over-pumping, bypass, or very low load across the unit. Confirm control valve operation and verify that loop flow matches design.',
    } as unknown as Recommendation);
  }

  if (flags.deltaTAboveExpected) {
    recs.push({
      id: `${moduleId}.delta_t_high`,
      module: moduleId,
      priority: 'warning',
      title: 'Hydronic ΔT above expected band',
      description:
        'Check for reduced flow or high load conditions. Verify valve position, strainers, and any flow-limiting devices in the circuit.',
    } as unknown as Recommendation);
  }

  // If everything is ok, we may still add a very low-priority
  // "no action" or maintenance reminder if desired later.
  return recs;
}
```

> When you wire this in, you’ll:
>
> * Add `HydronicSourceEngineResult` to your engine inventory doc.
> * Create `test/hydronicSource.engine.full.test.ts` with:
>
>   * Nominal ΔT, in-range temps → `status: 'ok'`.
>   * Low ΔT, in-range temps → `deltaTBelowExpected = true`, `status: 'alert'`.
>   * High ΔT, in-range temps → `deltaTAboveExpected = true`, `status: 'alert'`.
>   * Missing temps → `missingRequiredMeasurements = true`, `status: 'critical'`.

---

## 2) Condenser Approach Domain (ASHP outdoor coil)

### 2.1 Proposed file layout

```text
src/modules/condenserApproach/
├─ condenserApproach.types.ts
└─ condenserApproach.engine.ts
```

Again, module wrapper comes later.

---

### 2.2 `src/modules/condenserApproach/condenserApproach.types.ts`

```ts
import {
  DiagnosticStatus,
  EngineResult,
  Recommendation,
} from '../../shared/wshp.types';

/**
 * Measurements for outdoor air-cooled condenser evaluation.
 *
 * All temps in °F.
 */
export interface CondenserApproachMeasurements {
  /**
   * Outdoor ambient air temperature at the condenser intake.
   */
  outdoorAirTemp: number | null;

  /**
   * Condensing saturation temperature.
   * Typically derived from discharge/head pressure via PT chart.
   */
  condensingSatTemp: number | null;

  /**
   * Optional measured liquid line temperature at condenser outlet.
   * Used to calculate a secondary "liquid approach" if available.
   */
  liquidLineTemp?: number | null;

  /**
   * Optional condenser fan status if observed (for context only).
   */
  fanStatus?: 'on' | 'off' | 'unknown';
}

/**
 * Config for interpreting condenser approach behavior.
 */
export interface CondenserApproachConfig {
  /**
   * Target (nominal) condensing approach: condensingSatTemp - outdoorAirTemp.
   */
  targetApproach: number;

  /**
   * Allowed deviation above target before we flag high approach.
   */
  highApproachTolerance: number;

  /**
   * Allowed deviation below target before we flag low approach
   * (e.g., very low approach could indicate over-rejection or sensor issues).
   */
  lowApproachTolerance: number;

  /**
   * Maximum acceptable condensing saturation temperature for
   * the profile under typical conditions.
   */
  maxCondensingTemp: number;
}

/**
 * Numeric outputs from condenser approach engine.
 */
export interface CondenserApproachValues {
  /**
   * Condensing approach = condensingSatTemp - outdoorAirTemp.
   */
  condenserApproach: number | null;

  /**
   * Liquid approach = liquidLineTemp - outdoorAirTemp, if available.
   */
  liquidApproach: number | null;
}

/**
 * Boolean flags describing condenser-side facts.
 */
export interface CondenserApproachFlags {
  hasValidTemps: boolean;
  missingRequiredMeasurements: boolean;

  /**
   * True when condenserApproach > (target + high tolerance).
   */
  approachAboveBand: boolean;

  /**
   * True when condenserApproach < (target - low tolerance).
   */
  approachBelowBand: boolean;

  /**
   * True when condensingSatTemp > maxCondensingTemp.
   */
  condensingTempAboveMax: boolean;
}

/**
 * EngineResult alias for condenser approach.
 */
export type CondenserApproachEngineResult = EngineResult<
  CondenserApproachValues,
  CondenserApproachFlags
>;

/**
 * Optional recommendation context for condenser side.
 */
export interface CondenserApproachRecommendationContext {
  profileId?: string;
  mode?: 'cooling' | 'heating';
}
```

---

### 2.3 `src/modules/condenserApproach/condenserApproach.engine.ts`

```ts
import {
  DiagnosticStatus,
  Recommendation,
} from '../../shared/wshp.types';
import {
  CondenserApproachConfig,
  CondenserApproachEngineResult,
  CondenserApproachFlags,
  CondenserApproachMeasurements,
  CondenserApproachValues,
  CondenserApproachRecommendationContext,
} from './condenserApproach.types';

/**
 * Evaluate outdoor air-cooled condenser performance using
 * condensing approach relative to ambient.
 */
export function runCondenserApproachEngine(
  measurements: CondenserApproachMeasurements,
  config: CondenserApproachConfig,
  context: CondenserApproachRecommendationContext = {}
): CondenserApproachEngineResult {
  const values: CondenserApproachValues = {
    condenserApproach: null,
    liquidApproach: null,
  };

  const flags: CondenserApproachFlags = {
    hasValidTemps: false,
    missingRequiredMeasurements: false,
    approachAboveBand: false,
    approachBelowBand: false,
    condensingTempAboveMax: false,
  };

  const {
    outdoorAirTemp,
    condensingSatTemp,
    liquidLineTemp,
  } = measurements;

  const oaIsNumber = typeof outdoorAirTemp === 'number';
  const condIsNumber = typeof condensingSatTemp === 'number';

  if (!oaIsNumber || !condIsNumber) {
    flags.missingRequiredMeasurements = true;

    const result: CondenserApproachEngineResult = {
      status: deriveCondenserApproachStatus(flags),
      values,
      flags,
      recommendations: [],
    };

    return {
      ...result,
      recommendations: generateCondenserApproachRecommendations(
        result,
        context
      ),
    };
  }

  flags.hasValidTemps = true;

  const condenserApproach =
    condensingSatTemp! - outdoorAirTemp!;
  values.condenserApproach = condenserApproach;

  if (typeof liquidLineTemp === 'number') {
    values.liquidApproach = liquidLineTemp - outdoorAirTemp!;
  } else {
    values.liquidApproach = null;
  }

  const target = config.targetApproach;
  const highTol = config.highApproachTolerance;
  const lowTol = config.lowApproachTolerance;

  const hasTarget =
    typeof target === 'number' && target >= 0;

  if (hasTarget) {
    const highBand = target + highTol;
    const lowBand = target - lowTol;

    if (condenserApproach > highBand) {
      flags.approachAboveBand = true;
    }

    if (condenserApproach < lowBand) {
      flags.approachBelowBand = true;
    }
  }

  if (
    typeof condensingSatTemp === 'number' &&
    condensingSatTemp > config.maxCondensingTemp
  ) {
    flags.condensingTempAboveMax = true;
  }

  const status = deriveCondenserApproachStatus(flags);

  const baseResult: CondenserApproachEngineResult = {
    status,
    values,
    flags,
    recommendations: [],
  };

  return {
    ...baseResult,
    recommendations:
      generateCondenserApproachRecommendations(
        baseResult,
        context
      ),
  };
}

/**
 * Flag set → DiagnosticStatus mapping for condenser approach.
 */
function deriveCondenserApproachStatus(
  flags: CondenserApproachFlags
): DiagnosticStatus {
  if (flags.missingRequiredMeasurements) {
    return 'critical';
  }

  if (flags.condensingTempAboveMax) {
    if (flags.approachAboveBand) {
      return 'critical';
    }
    return 'alert';
  }

  if (flags.approachAboveBand || flags.approachBelowBand) {
    return 'alert';
  }

  return 'ok';
}

/**
 * Recommendation helper.
 *
 * Uses only flag state to propose checks; all interpretation
 * and wording is left to the module/report layer if you want
 * additional nuance there.
 */
export function generateCondenserApproachRecommendations(
  result: CondenserApproachEngineResult,
  context: CondenserApproachRecommendationContext = {}
): Recommendation[] {
  const recs: Recommendation[] = [];
  const { flags, values } = result;
  const moduleId = 'condenser_approach';

  if (flags.missingRequiredMeasurements) {
    recs.push({
      id: `${moduleId}.capture_temps`,
      module: moduleId,
      priority: 'critical',
      title:
        'Capture outdoor air and condensing saturation temperatures',
      description:
        'Measure and record outdoor air temperature and condensing saturation temperature to evaluate condenser approach.',
    } as unknown as Recommendation);

    return recs;
  }

  if (flags.condensingTempAboveMax) {
    recs.push({
      id: `${moduleId}.high_condensing_temp`,
      module: moduleId,
      priority: 'alert',
      title: 'Condensing temperature above configured maximum',
      description:
        'Verify condenser fan operation, coil cleanliness, and clear airflow around the condenser. Confirm head pressure controls and system charge.',
    } as unknown as Recommendation);
  }

  if (flags.approachAboveBand) {
    recs.push({
      id: `${moduleId}.approach_high`,
      module: moduleId,
      priority: 'warning',
      title: 'Condenser approach above expected band',
      description:
        'Check for airflow restrictions, fouled condenser coil, or elevated ambient/recirculation. Confirm condenser fan performance and coil face condition.',
    } as unknown as Recommendation);
  }

  if (flags.approachBelowBand) {
    recs.push({
      id: `${moduleId}.approach_low`,
      module: moduleId,
      priority: 'warning',
      title: 'Condenser approach below expected band',
      description:
        'Confirm sensor placement and readings. Very low approach may indicate instrumentation error or unusual operating conditions.',
    } as unknown as Recommendation);
  }

  // Optional: if you ever want a low-priority maintenance reminder
  // based on very high condenserApproach but still "ok" status, you
  // can add that here as another conditional on `values.condenserApproach`.

  return recs;
}
```

> For tests, you’ll mirror your existing pattern:
>
> * `test/condenserApproach.engine.full.test.ts`:
>
>   * Nominal approach → `status: 'ok'`.
>   * High approach & high condensingSatTemp → `approachAboveBand = true`, `condensingTempAboveMax = true`, `status: 'critical'`.
>   * Missing ambient or condensingSatTemp → `missingRequiredMeasurements = true`, `status: 'critical'`.

---

If you want, the next step can be:

* I sketch **proposed test case tables** for both engines (like your Vitest summary doc) so you can build fixtures and tests in the same style as the rest of the repo.
