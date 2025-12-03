# Phase 3.4 — Kernel API Documentation

**Generated:** 2025-12-02  
**Status:** Implemented  
**Location:** `src/physics/`

---

## Module Structure

```
src/physics/
├── index.ts              # Main entry point (re-exports all)
├── hvac/
│   └── index.ts          # Thermodynamic & heat transfer physics
├── electrical/
│   └── index.ts          # Motor/compressor electrical physics
└── hydronic/
    └── index.ts          # Water-side physics (re-exports + constants)
```

---

## HVAC Physics API (`src/physics/hvac/index.ts`)

### Refrigeration Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `computeSuperheat` | `(suctionTemp: number, suctionSatTemp: number) => number` | Suction line superheat (°F) |
| `computeSubcooling` | `(dischargeSatTemp: number, liquidTemp: number) => number` | Liquid line subcooling (°F) |
| `computeCompressionRatio` | `(dischargePressure: number, suctionPressure: number) => number` | Pressure ratio (dimensionless) |
| `computeDischargeSuperheat` | `(dischargeTemp: number, dischargeSatTemp: number) => number` | Discharge line superheat (°F) |

### Air-Side Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `computeAirDeltaT` | `(supplyAirTemp: number, returnAirTemp: number) => number` | Absolute air ΔT (°F) |
| `computeAirflowFromDeltaT` | `(nominalTons: number, deltaT: number) => number` | Estimated CFM from sensible heat equation |
| `computeCFMPerTon` | `(cfm: number, nominalTons: number) => number` | CFM per ton of capacity |

### Water-Side / Hydronic Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `computeWaterDeltaT` | `(leavingWaterTemp: number, enteringWaterTemp: number) => number` | Water ΔT (signed, °F) |
| `computeWaterDeltaTAbsolute` | `(leavingWaterTemp: number, enteringWaterTemp: number) => number` | Absolute water ΔT (°F) |
| `computeExpectedWaterDeltaT` | `(tons: number, designGPM: number) => number` | Expected ΔT from load/flow |
| `computeHydronicBTU` | `(gpm: number, deltaT: number) => number` | Heat transfer rate (BTU/hr) |
| `computeDesignFlowGPM` | `(tons: number, expectedDeltaT: number) => number` | Design flow from load/ΔT |
| `computeNormalizedFlowIndex` | `(measuredFlow: number, designFlow: number) => number` | Flow ratio (1.0 = at design) |

### Approach Temperature

| Function | Signature | Description |
|----------|-----------|-------------|
| `computeApproachTemperature` | `(processTemp: number, ambientTemp: number) => number` | Approach temperature (°F) |

### PT Chart Interpolation

| Function | Signature | Description |
|----------|-----------|-------------|
| `interpolatePT` | `(pressure: number, ptData: PTChartData) => number \| null` | Saturation temp from PT chart |
| `computeFallbackSaturationTemp` | `(pressure: number) => number` | Generic linear approximation |

### Status Utilities

| Function | Signature | Description |
|----------|-----------|-------------|
| `getWorstStatus` | `(statuses: DiagnosticStatus[]) => DiagnosticStatus` | Reduce to worst severity |

### Constants

```typescript
export const HEAT_TRANSFER_CONSTANTS = {
  BTU_PER_TON: 12000,           // BTU per ton of refrigeration
  AIR_SENSIBLE_FACTOR: 1.08,    // Sensible heat factor for air
  WATER_HEAT_FACTOR: 500,       // Water heat transfer constant
  FALLBACK_PT_SLOPE: 0.215,     // Generic PT slope
  FALLBACK_PT_OFFSET: 10.5,     // Generic PT offset
};
```

---

## Electrical Physics API (`src/physics/electrical/index.ts`)

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `computePercentRLA` | `(measuredCurrent: number, rla: number) => number` | Percent of RLA (decimal) |
| `analyzeVoltageStatus` | `(actualVoltage: number, ratedVoltage: number, minRatio?: number, noVoltageThreshold?: number) => VoltageStatus` | Voltage status analysis |

### Types

```typescript
export type VoltageStatus = 'ok' | 'low_voltage' | 'no_voltage';
```

### Constants

```typescript
export const ELECTRICAL_CONSTANTS = {
  DEFAULT_MIN_VOLTAGE_RATIO: 0.85,  // 85% minimum acceptable
  NO_VOLTAGE_THRESHOLD: 2,          // Below 2V = no voltage
};
```

---

## Hydronic Physics API (`src/physics/hydronic/index.ts`)

Re-exports from HVAC kernel plus hydronic-specific constants.

### Re-exported Functions

- `computeWaterDeltaT`
- `computeWaterDeltaTAbsolute`
- `computeExpectedWaterDeltaT`
- `computeHydronicBTU`
- `computeDesignFlowGPM`
- `computeNormalizedFlowIndex`
- `computeApproachTemperature`
- `HEAT_TRANSFER_CONSTANTS`

### Constants

```typescript
export const HYDRONIC_INDUSTRY_DEFAULTS = {
  EXPECTED_DELTA_T: { min: 10, ideal: 12, max: 14, source: 'industry' },
};

export const HYDRONIC_SOURCE_DEFAULTS = {
  OPEN_TOWER_APPROACH: { min: 5, ideal: 7, max: 10 },
  DRY_COOLER_APPROACH: { min: 10, ideal: 15, max: 25 },
};
```

---

## Usage Example

```typescript
import {
  computeSuperheat,
  computeSubcooling,
  computeCompressionRatio,
  computeAirflowFromDeltaT,
  interpolatePT,
  getWorstStatus,
  HEAT_TRANSFER_CONSTANTS,
} from '../../physics';

import { computePercentRLA } from '../../physics/electrical';

// In engine:
const superheat = computeSuperheat(measurements.suctionTemp, suctionSatTemp);
const subcooling = computeSubcooling(dischargeSatTemp, measurements.liquidTemp);
const ratio = computeCompressionRatio(measurements.dischargePressure, measurements.suctionPressure);
const pctRLA = computePercentRLA(measurements.current, profile.compressor.rla);
```

---

## Design Principles

1. **Pure Functions**: All physics functions are pure — same inputs always produce same outputs.

2. **No Side Effects**: Functions do not modify state or call external services.

3. **No Thresholds**: Physics functions compute values only. Threshold comparisons remain in engines.

4. **No Status Logic**: Functions like `getWorstStatus` are utility reducers, not physics.

5. **Constants Are Physics**: Only physics constants (BTU/ton, sensible heat factor, etc.) are in kernel. Diagnostic thresholds (superheat limits, compression ratio bounds) remain in engines.

---

## Verification Checklist

Before proceeding to Step 3 (extraction), verify:

- [ ] All functions match existing engine math exactly
- [ ] No new physics introduced
- [ ] Constants match existing values in engines
- [ ] Type signatures are compatible with engine usage
- [ ] No circular dependencies introduced
