# Phase 3.1 — Shared Types Implementation Report

**Date:** 2025-12-01  
**Branch:** `phase-3.1-profile-runner`  
**Status:** ✅ Complete (135/135 tests passing)

---

## Summary

Phase 3.1 establishes the structural layer for the unified profile runner, introducing canonical types, validation, and completeness classification. All deliverables were implemented exactly as specified with full backward compatibility maintained.

---

## Files Created

| File | Purpose | Lines |
|------|---------|-------|
| `src/shared/profileInput.types.ts` | Canonical ingestion surface (`ProfileInputSchema`, `CompletenessLevel`) | ~30 |
| `src/shared/moduleResult.types.ts` | `ModuleResult<V,F>` wrapper + 7 domain-specific aliases | ~65 |
| `src/shared/combinedProfileResult.types.ts` | Top-level orchestrator output contract | ~35 |
| `src/shared/completeness.ts` | `classifyCompleteness()` function for domain gating | ~100 |
| `src/validation/tierA.ts` | `runTierAValidation()` with 6 structural checks | ~180 |

---

## Files Modified

| File | Change | Impact |
|------|--------|--------|
| `src/modules/airside/airside.types.ts` | Added `AirsideValues` type alias | Type alignment only |
| `src/modules/refrigeration/refrigeration.types.ts` | Added `RefrigerationValues`, `RefrigerationFlags` interfaces | Type alignment only |
| `src/modules/refrigeration/refrigeration.engine.ts` | Wired to use canonical types | No runtime change |
| `src/wshp/wshp.diagx.ts` | Major refactor: dual-path architecture | Backward compatible |

---

## Type Definitions

### ProfileInputSchema
```typescript
export interface ProfileInputSchema {
  profile: WaterCooledUnitProfile;
  measurements: {
    refrigeration?: Partial<RefrigerationMeasurements>;
    airside?: Partial<AirsideMeasurements>;
    hydronic?: Partial<HydronicMeasurements>;
    condenserApproach?: Partial<CondenserApproachMeasurements>;
    recipCompressor?: Partial<ReciprocatingCompressorMeasurements>;
    scrollCompressor?: Partial<ScrollCompressorMeasurements>;
    reversingValve?: Partial<ReversingValveMeasurements>;
  };
}
```

### CompletenessLevel
```typescript
export type CompletenessLevel = 'full' | 'limited' | 'advisory' | 'skipped';
```

### ModuleResult<V, F>
```typescript
export interface ModuleResult<V, F> extends EngineResult<V, F> {
  validation: ValidationIssue[];
  completeness: CompletenessLevel;
  summary: string;
}
```

### Domain-Specific Aliases
- `AirsideModuleResult`
- `RefrigerationModuleResult`
- `ScrollCompressorModuleResult`
- `ReciprocatingCompressorModuleResult`
- `HydronicModuleResult`
- `ReversingValveModuleResult`
- `CondenserApproachModuleResult`

### CombinedProfileResult
```typescript
export interface CombinedProfileResult {
  profileId?: string;
  modules: {
    airside: AirsideModuleResult | null;
    refrigeration: RefrigerationModuleResult | null;
    compressor_scroll: ScrollCompressorModuleResult | null;
    compressor_recip: ReciprocatingCompressorModuleResult | null;
    hydronic: HydronicModuleResult | null;
    reversing_valve: ReversingValveModuleResult | null;
    condenser_approach: CondenserApproachModuleResult | null;
  };
  status: DiagnosticStatus;
  recommendations: Recommendation[];
  validation: ValidationIssue[];
  summary: string;
}
```

---

## Tier-A Validation Checks

| # | Check | Severity |
|---|-------|----------|
| 1 | Null profile | error |
| 2 | Negative pressures | error |
| 3 | Impossible temperatures (< -50°F or > 300°F) | error |
| 4 | Contradictory mode (cooling/heating vs. measured temps) | warning |
| 5 | Missing required-for-engine fields (per domain) | error |
| 6 | Airflow override plausibility (TESP required) | warning |

---

## Orchestrator Architecture

### Legacy Function (Backward Compatible)
```typescript
export function runWshpDiagx(input: WshpDiagxInput): WshpDiagxResult
```
- Returns `WshpDiagxResult` with `domainResults: DomainResult[]`
- Raw engine results in `details` field (not wrapped in ModuleResult)
- Controls domain with correlation findings for backward compatibility

### New Function (Phase 3.1)
```typescript
export function runCombinedProfile(input: ProfileInputSchema): CombinedProfileResult
```
- Returns `CombinedProfileResult` with typed `modules` object
- Engine results wrapped in `ModuleResult` with validation/completeness/summary
- Tier-A validation run before engine execution

---

## Type Alignment (Architect Override)

Added type aliases to bridge existing engine types to canonical names:

```typescript
// src/modules/airside/airside.types.ts
export type AirsideValues = AirsideEngineValues;

// src/modules/refrigeration/refrigeration.types.ts
export interface RefrigerationValues { ... }
export interface RefrigerationFlags { ... }
```

**Constraint:** No engine behavior changed. All 135 tests pass identically.

---

## Test Verification

```
 Test Files  43 passed (43)
      Tests  135 passed (135)
   Start at  22:24:35
   Duration  2.26s
```

---

## Next Steps

- Phase 3.2: Integrate `runCombinedProfile` with completeness-based domain skipping
- Phase 3.3: Add cross-domain correlation findings to CombinedProfileResult
- Future: Migrate consumers to new `ProfileInputSchema` ingestion surface
