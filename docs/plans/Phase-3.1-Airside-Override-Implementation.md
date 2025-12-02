# Phase 2.5light — Airside Airflow Override + TESP Safety Gate

**Date:** 2025-12-01  
**Branch:** `phase-3.1-profile-runner`  
**Status:** ✅ Complete

---

## Executive Summary

This phase implements technician-supplied airflow override capability for the airside diagnostic module. The override is gated by physics-based plausibility checks using Total External Static Pressure (TESP) and CFM-per-ton bounds to prevent nonsensical values from corrupting diagnostic outputs.

---

## Problem Statement

Previously, the airside engine could only infer airflow from delta-T calculations or accept a raw `measuredCFM` value. Technicians with calibrated instruments (anemometer traverses, flow hoods) had no way to inject their field-measured airflow values with proper validation.

**Risks of unvalidated overrides:**
- Implausible CFM values could corrupt downstream diagnostics
- No traceability of override source in engine outputs
- Potential for human error (typos, unit confusion) to go undetected

---

## Solution Architecture

### 1. Schema Layer (`airside.types.ts`)

**New fields on `AirsideMeasurements`:**
| Field | Type | Description |
|-------|------|-------------|
| `airflowCFMOverride` | `number?` | Technician-supplied airflow override in CFM |
| `airflowOverrideNote` | `string?` | Optional note explaining override source/method |
| `totalExternalStatic` | `number?` | Total external static pressure (supply + return) in in. W.C. |

**New type:**
```typescript
export type AirflowSource = 'inferred_deltaT' | 'technician_override' | 'measured';
```

**New fields on `AirsideEngineValues` and `AirsideEngineResult`:**
| Field | Type | Description |
|-------|------|-------------|
| `airflowCFM` | `number?` | Authoritative airflow value used for calculations |
| `airflowSource` | `AirflowSource?` | Source of the authoritative airflow value |

### 2. Validation Layer (`airside.validation.ts`)

**New function: `validateAirflowOverrideCFM()`**

Validates technician-supplied override against physics-based plausibility using a TESP-indexed CFM/ton matrix:

| TESP (in. W.C.) | CFM/ton Min | CFM/ton Max |
|-----------------|-------------|-------------|
| ≤ 0.3 | 300 | 550 |
| ≤ 0.5 | 280 | 500 |
| ≤ 0.7 | 250 | 450 |
| ≤ 1.0 | 200 | 400 |
| > 1.0 | 150 | 350 |

**Logic:**
- Calculate CFM/ton from override value and profile `nominalTons`
- Use `totalExternalStatic` if provided, else `externalStatic`, else conservative default (0.5)
- Reject if CFM/ton falls outside bounds for the given TESP band
- Return `AirflowOverrideCheckResult` with acceptance status and reason

### 3. Engine Layer (`airside.engine.ts`)

**Changes:**
- Import new `AirflowSource` type
- Track `airflowCFM` and `airflowSource` through engine calculations
- Default: `inferred_deltaT` when using delta-T estimation
- Upgrade to `measured` when `measuredCFM` is provided
- Note: `technician_override` is set at module layer after validation

### 4. Module Layer (`airside.module.ts`)

**Changes to `diagnose()` method:**
1. Check if `airflowCFMOverride` is present and positive
2. Call `validateAirflowOverrideCFM()` with override, profile tons, and TESP
3. If accepted:
   - Inject override as `measuredCFM` in effective measurements
   - Post-process result to set `airflowSource = 'technician_override'`
   - Add disclaimer documenting override acceptance
4. If rejected:
   - Add warning disclaimer with rejection reason
   - Fall back to inferred/measured airflow

**New measurement help entries:**
- `airflowCFMOverride`
- `airflowOverrideNote`
- `totalExternalStatic`

---

## Test Coverage

**New test file:** `test/airside.override.test.ts`

### Validation Helper Tests (7)
- ✅ Accepts override within CFM/ton bounds for low TESP
- ✅ Rejects override when CFM/ton too low for TESP
- ✅ Rejects override when CFM/ton too high for TESP
- ✅ Uses conservative default TESP (0.5) when not provided
- ✅ Rejects when nominalTons is zero or missing
- ✅ Rejects negative override values
- ✅ Handles high restriction scenario (TESP > 1.0)

### Module Integration Tests (8)
- ✅ Accepts valid override and sets airflowSource to technician_override
- ✅ Includes technician note in disclaimer when provided
- ✅ Rejects override and falls back to inferred when CFM/ton too low
- ✅ Rejects override and falls back when CFM/ton too high
- ✅ Uses externalStatic as fallback when totalExternalStatic not provided
- ✅ Infers airflow from deltaT when no override provided
- ✅ Uses measuredCFM when provided without override
- ✅ Override takes precedence over measuredCFM when valid

### Structure Tests (2)
- ✅ Includes airflowCFM and airflowSource in values object
- ✅ Preserves existing engine output fields

---

## Files Modified

| File | Lines Changed | Description |
|------|---------------|-------------|
| `src/modules/airside/airside.types.ts` | +25 | New fields, AirflowSource type |
| `src/modules/airside/airside.validation.ts` | +75 | validateAirflowOverrideCFM function |
| `src/modules/airside/airside.engine.ts` | +15 | airflowCFM/airflowSource tracking |
| `src/modules/airside/airside.module.ts` | +45 | Override gating logic, new help entries |
| `test/airside.override.test.ts` | +175 | New test file |

---

## Verification

```
✓ 135 tests passing (17 new + 118 existing)
✓ ESLint clean
✓ No regressions in existing airside tests
✓ All stress tests pass
```

---

## Design Decisions

### Why TESP-based validation?
Static pressure is a direct indicator of system restriction. Higher TESP physically limits maximum airflow. Using TESP as a gating factor ensures overrides are plausible given actual system conditions.

### Why reject rather than clamp?
Clamping silently adjusts technician input, which could mask measurement errors or equipment issues. Rejecting with a clear reason forces the technician to investigate the discrepancy.

### Why track airflowSource?
Downstream consumers (reports, UI, correlation engines) need to know whether airflow came from inference, measurement, or technician override for appropriate confidence weighting.

### Why handle override at module layer?
The module layer owns input validation and orchestration. The engine should remain a pure calculation function that trusts its inputs. This separation keeps the engine testable with synthetic data.

---

## Backwards Compatibility

- All existing `AirsideMeasurements` remain valid (new fields are optional)
- All existing `AirsideEngineResult` consumers continue to work (new fields are additive)
- No changes to recommendation IDs or severities
- Existing tests pass without modification

---

## Future Enhancements

1. **Duct leakage correlation** — Cross-reference override with measured duct leakage
2. **Historical trending** — Track override frequency per technician/site
3. **Confidence intervals** — Report uncertainty bounds based on override source
4. **Fan curve integration** — Validate against OEM fan curves when available (runtime injection only)

---

## Session Summary

This implementation completes the first major feature of Phase 3.1, adding robust technician input support to the airside module while maintaining the project's physics-first, no-OEM-data architecture.
