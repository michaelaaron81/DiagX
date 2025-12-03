# Phase 3.4 — Engine Math Inventory

**Generated:** 2025-12-02  
**Scope:** All embedded physics math, formulas, transformations, magic numbers, and repeated patterns.

---

## 1. Refrigeration Engine (`refrigeration.engine.ts`)

### 1.1 Formulas

| Formula | Description | Location |
|---------|-------------|----------|
| `superheat = suctionTemp - suctionSatTemp` | Calculates suction superheat | `runRefrigerationEngine()` |
| `subcooling = dischargeSatTemp - liquidTemp` | Calculates liquid subcooling | `runRefrigerationEngine()` |
| `compressionRatio = dischargePressure / suctionPressure` | Pressure ratio across compressor | `runRefrigerationEngine()` |
| `waterDeltaT = abs(leavingWaterTemp - enteringWaterTemp)` | Water temperature differential | `runRefrigerationEngine()` |
| `dischargeSuperheat = dischargeTemp - dischargeSatTemp` | Discharge line superheat (optional) | `runRefrigerationEngine()` |
| `expectedDeltaT = (tons × 12000) / (designGPM × 500)` | Expected water ΔT from load | `analyzeWaterTransfer()` |

### 1.2 PT Chart Interpolation

| Function | Description | Location |
|----------|-------------|----------|
| `interpolatePT(pressure, ptData)` | Linear interpolation of saturation temp from pressure | Standalone function |
| `getSaturationTemp(pressure, refrigerantType)` | Lookup saturation temp using PT chart data | Helper function |
| Fallback: `0.215 × pressure + 10.5` | Generic linear approximation when no PT data | `getSaturationTemp()` |

### 1.3 Magic Numbers / Thresholds

| Value | Context | Location |
|-------|---------|----------|
| `12000` | BTU per ton (constant) | `analyzeWaterTransfer()` |
| `500` | BTU/(hr·°F·GPM) water heat transfer constant | `analyzeWaterTransfer()` |
| `0.25` | Tolerance (25%) for expected ΔT comparison | `analyzeWaterTransfer()` |
| `0.215` | Fallback PT slope coefficient | `getSaturationTemp()` |
| `10.5` | Fallback PT offset | `getSaturationTemp()` |
| `5` | Critical superheat threshold (°F) | `analyzeSuperheat()` |
| `25` | High superheat alert threshold (°F) | `analyzeSuperheat()` |
| `3` | Low subcooling alert threshold (°F) | `analyzeSubcooling()` |
| `18` | High subcooling alert threshold (°F) | `analyzeSubcooling()` |
| `2.5` | Low compression ratio critical threshold | `analyzeCompressionRatio()` |
| `6.5` | High compression ratio alert threshold | `analyzeCompressionRatio()` |

### 1.4 CONSTANTS Usage (from `wshp.types.ts`)

- `CONSTANTS.SUPERHEAT_COOLING_TXV`: `{ min: 6, ideal: 10, max: 15 }`
- `CONSTANTS.SUPERHEAT_COOLING_FIXED`: `{ min: 8, ideal: 12, max: 20 }`
- `CONSTANTS.SUPERHEAT_HEATING_TXV`: `{ min: 6, ideal: 10, max: 15 }`
- `CONSTANTS.SUBCOOLING_WATER_COOLED`: `{ min: 6, ideal: 10, max: 15 }`
- `CONSTANTS.COMPRESSION_RATIO`: `{ min: 2.0, ideal: 3.0, max: 4.5 }`

---

## 2. Airside Engine (`airside.engine.ts`)

### 2.1 Formulas

| Formula | Description | Location |
|---------|-------------|----------|
| `deltaT = abs(supplyAirTemp - returnAirTemp)` | Air temperature differential | `runAirsideEngine()` |
| `estimatedCFM = (nominalTons × 12000) / (1.08 × deltaT)` | Airflow from sensible heat equation | `runAirsideEngine()` |
| `cfmPerTon = estimatedCFM / nominalTons` | CFM per ton of capacity | `runAirsideEngine()` |

### 2.2 Sensible Heat Equation Constants

| Value | Context | Description |
|-------|---------|-------------|
| `12000` | BTU per ton | Capacity conversion |
| `1.08` | Sensible heat factor (BTU/(min·°F·CFM)) | Air heat transfer coefficient (ρ × Cp × 60 ≈ 1.08) |

### 2.3 Magic Numbers / Thresholds

| Value | Context | Location |
|-------|---------|----------|
| `30` | Critical high ΔT (°F) for cooling | `analyzeDeltaT()` |
| `250` | Critical low CFM/ton threshold | `analyzeAirflow()` |
| `550` | High CFM/ton alert threshold | `analyzeAirflow()` |
| `1.3` | Static pressure critical multiplier | `analyzeStaticPressure()` |
| `0.9` | Static pressure warning threshold | `analyzeStaticPressure()` |
| `1` | Minimum ΔT for calculations | `runAirsideEngine()` |

### 2.4 Industry Defaults

| Parameter | Default Range | Source |
|-----------|---------------|--------|
| Expected ΔT (cooling) | `{ min: 8, ideal: 12, max: 16 }` | `getExpectedDeltaT()` |
| Expected ΔT (heating) | `{ min: 10, ideal: 20, max: 30 }` | `getExpectedDeltaT()` |
| CFM per ton | `{ min: 350, ideal: 400, max: 450 }` | `getExpectedCFMPerTon()` |

---

## 3. Scroll Compressor Engine (`scroll.engine.ts`)

### 3.1 Formulas

| Formula | Description | Location |
|---------|-------------|----------|
| `compressionRatio = dischargePressure / suctionPressure` | Pressure ratio | `runScrollCompressorEngine()` |
| `percentRLA = current / rla` | Percent of rated load amps | `analyzeCurrent()` |

### 3.2 Magic Numbers / Thresholds

| Value | Context | Location |
|-------|---------|----------|
| `2.5` | Low compression ratio critical threshold | `analyzeCompressionRatio()` |
| `3.0` | Low compression ratio alert threshold | `analyzeCompressionRatio()` |
| `6.0` | High compression ratio alert threshold | `analyzeCompressionRatio()` |
| `8.0` | High compression ratio critical threshold | `analyzeCompressionRatio()` |
| `1.3` | Current critical (130% RLA) | `analyzeCurrent()` |
| `1.1` | Current alert (110% RLA) | `analyzeCurrent()` |
| `0.4` | Current warning low (40% RLA) | `analyzeCurrent()` |

---

## 4. Reciprocating Compressor Engine (`recip.engine.ts`)

### 4.1 Formulas

| Formula | Description | Location |
|---------|-------------|----------|
| `compressionRatio = dischargePressure / suctionPressure` | Pressure ratio | `runReciprocatingCompressorEngine()` |
| `percentRLA = measured / rla` | Percent of rated load amps | `analyzeCurrent()` |

### 4.2 Magic Numbers / Thresholds

| Value | Context | Location |
|-------|---------|----------|
| `2.5` | Low compression ratio critical threshold | `analyzeCompressionRatio()` |
| `3.0` | Low compression ratio alert threshold | `analyzeCompressionRatio()` |
| `6.5` | High compression ratio alert threshold | `analyzeCompressionRatio()` |
| `10` | High compression ratio critical threshold | `analyzeCompressionRatio()` |
| `1.4` | Current critical (140% RLA) | `analyzeCurrent()` |
| `1.15` | Current alert (115% RLA) | `analyzeCurrent()` |
| `0.3` | Current warning low (30% RLA) | `analyzeCurrent()` |

---

## 5. Hydronic Engine (`hydronic.engine.ts`)

### 5.1 Formulas

| Formula | Description | Location |
|---------|-------------|----------|
| `waterDeltaT = leavingWaterTemp - enteringWaterTemp` | Water temperature differential | `runHydronicEngine()` |
| `flowRatio = flow / designFlow` | Normalized flow index | `analyzeFlow()` |

### 5.2 Magic Numbers / Thresholds

| Value | Context | Location |
|-------|---------|----------|
| `1` | Critical low ΔT threshold (°F) | `analyzeDeltaT()` |
| `1.5` | High ΔT critical multiplier | `analyzeDeltaT()` |
| `0.9` | Low ΔT warning multiplier | `analyzeDeltaT()` |
| `0.5` | Low flow critical ratio | `analyzeFlow()` |
| `0.8` | Low flow alert ratio | `analyzeFlow()` |
| `0.95` / `1.05` | Flow warning bounds | `analyzeFlow()` |

### 5.3 Industry Defaults

| Parameter | Default Range | Source |
|-----------|---------------|--------|
| Expected ΔT | `{ min: 10, ideal: 12, max: 14 }` | `HYDRONIC_INDUSTRY_EXPECTED` |

---

## 6. Hydronic Source Engine (`hydronic-source.engine.ts`)

### 6.1 Formulas

| Formula | Description | Location |
|---------|-------------|----------|
| `deltaT = leavingWaterTemp - enteringWaterTemp` | Water temperature differential | `computeDeltaT()` |
| `approachToAmbient = leavingWaterTemp - ambientWetBulb` | Open tower approach | `computeApproachToAmbient()` |
| `approachToAmbient = leavingWaterTemp - ambientDryBulb` | Dry cooler approach | `computeApproachToAmbient()` |
| `designFlowGPM = (tons × 12000) / (ideal ΔT × 500)` | Estimated design flow | `evaluateFlags()` |
| `normalizedFlowIndex = flowGpm / designFlowGPM` | Flow ratio | `runHydronicSourceEngine()` |

### 6.2 Heat Transfer Constants

| Value | Context | Description |
|-------|---------|-------------|
| `12000` | BTU per ton | Capacity conversion |
| `500` | BTU/(hr·°F·GPM) | Water heat transfer coefficient |

---

## 7. Condenser Approach Engine (`condenserApproach.engine.ts`)

### 7.1 Formulas

| Formula | Description | Location |
|---------|-------------|----------|
| `condenserApproach = liquidLineTemp - ambientTemp` | Approach temperature (preferred) | `runCondenserApproachEngine()` |
| `condenserApproach = condensingSatTemp - ambientTemp` | Approach temperature (fallback) | `runCondenserApproachEngine()` |
| `liquidSubcooling = liquidLineTemp - condensingSatTemp` | Liquid line subcooling | `runCondenserApproachEngine()` |
| PT interpolation (same as refrigeration) | Saturation temp from pressure | `interpolatePTForPressure()` |

### 7.2 Magic Numbers / Thresholds

| Value | Context | Location |
|-------|---------|----------|
| `0` | Negative approach critical threshold | `approachStatus` logic |
| `3` | Low subcooling critical threshold (°F) | `subcoolingStatus` logic |
| `6` | Low subcooling alert threshold (°F) | `subcoolingStatus` logic |
| `10` | Low subcooling warning threshold (°F) | `subcoolingStatus` logic |

### 7.3 Defaults

| Parameter | Default Range | Source |
|-----------|---------------|--------|
| Expected approach | `{ min: 8, ideal: 15, max: 30 }` | Default in engine |

---

## 8. Reversing Valve Engine (`reversing.engine.ts`)

### 8.1 Formulas

| Formula | Description | Location |
|---------|-------------|----------|
| `tempSpread = max(temps) - min(temps)` | Temperature spread across ports | `runReversingValveEngine()` |
| `compressionRatio = dischargePressure / suctionPressure` | Pressure ratio | `runReversingValveEngine()` |
| Voltage threshold: `minAcceptable = ratedVoltage × 0.85` | Minimum acceptable solenoid voltage | `analyzeSolenoid()` |

### 8.2 Magic Numbers / Thresholds

| Value | Context | Location |
|-------|---------|----------|
| `120` | Hot port threshold (°F) | `runReversingValveEngine()` |
| `50` | Minimum temp spread for stuck detection (°F) | `analyzeValvePattern()` |
| `3.0` | Low compression ratio alert (partial leak) | `analyzeValvePattern()` |
| `3.5` | Low compression ratio warning (partial leak) | `analyzeValvePattern()` |
| `0.85` | Minimum voltage ratio | `analyzeSolenoid()` |
| `2` | Minimum voltage for "no_voltage" detection | `analyzeSolenoid()` |

---

## Repeated Patterns Across Engines

### Pattern 1: `getWorstStatus(statuses[])`
**Used in:** refrigeration, airside, hydronic, reversing valve  
**Logic:** Reduces array of DiagnosticStatus to worst severity.

```typescript
function getWorstStatus(statuses: DiagnosticStatus[]): DiagnosticStatus {
  if (statuses.includes('critical')) return 'critical';
  if (statuses.includes('alert')) return 'alert';
  if (statuses.includes('warning')) return 'warning';
  return 'ok';
}
```

### Pattern 2: Compression Ratio Calculation
**Used in:** refrigeration, scroll, recip, reversing valve  
**Formula:** `compressionRatio = dischargePressure / suctionPressure`

### Pattern 3: Percent RLA Calculation
**Used in:** scroll, recip  
**Formula:** `percentRLA = measuredCurrent / rla`

### Pattern 4: Water ΔT Calculation
**Used in:** refrigeration, hydronic, hydronic-source  
**Formula:** `deltaT = leavingWaterTemp - enteringWaterTemp`

### Pattern 5: Heat Transfer Equation (BTU from water flow)
**Used in:** refrigeration (`analyzeWaterTransfer`), hydronic-source  
**Formula:** `BTU = GPM × 500 × ΔT`  
**Inverse:** `GPM = BTU / (500 × ΔT)` or `ΔT = BTU / (500 × GPM)`

### Pattern 6: Sensible Heat Equation (Airflow)
**Used in:** airside  
**Formula:** `CFM = (tons × 12000) / (1.08 × ΔT)`

### Pattern 7: PT Chart Interpolation
**Used in:** refrigeration, condenserApproach  
**Method:** Linear interpolation between PT chart data points.

### Pattern 8: `round(n, decimals)` utility
**Used in:** All engines  
**Location:** `wshp.types.ts`

---

## Summary: Kernel API Candidates

Based on this inventory, the following functions should be extracted to the Physics Kernel:

### HVAC Physics (`src/physics/hvac/`)
1. `computeSuperheat(suctionTemp, suctionSatTemp)` → number
2. `computeSubcooling(dischargeSatTemp, liquidTemp)` → number
3. `computeCompressionRatio(dischargePressure, suctionPressure)` → number
4. `computeDischargeSuperheat(dischargeTemp, dischargeSatTemp)` → number
5. `computeAirDeltaT(supplyAirTemp, returnAirTemp)` → number
6. `computeWaterDeltaT(leavingWaterTemp, enteringWaterTemp)` → number
7. `computeAirflowFromDeltaT(nominalTons, deltaT)` → number (CFM)
8. `computeCFMPerTon(cfm, nominalTons)` → number
9. `computeExpectedWaterDeltaT(tons, designGPM)` → number
10. `computeApproachTemperature(leavingTemp, ambientTemp)` → number
11. `computeHydronicBTU(gpm, deltaT)` → number
12. `computeDesignFlowGPM(tons, expectedDeltaT)` → number
13. `computeNormalizedFlowIndex(measuredFlow, designFlow)` → number
14. `interpolatePT(pressure, ptChartData)` → number | null
15. `getSaturationTemp(pressure, refrigerantType)` → number
16. `getWorstStatus(statuses[])` → DiagnosticStatus

### Electrical Physics (`src/physics/electrical/`)
1. `computePercentRLA(measuredCurrent, rla)` → number
2. `analyzeVoltageStatus(actualVoltage, ratedVoltage, minRatio)` → status

### Constants Module (`src/physics/constants.ts`)
- All threshold values from CONSTANTS object
- Heat transfer coefficients (500, 1.08, 12000)
- Default ranges for superheat, subcooling, compression ratio, etc.

---

## Next Steps

1. **Step 2:** Define TypeScript signatures in `src/physics/hvac/index.ts`, `src/physics/electrical/index.ts`, `src/physics/hydronic/index.ts`
2. **Step 3:** Extract math into kernel, replace inline calculations in engines
3. **Step 4:** Run full regression test suite
4. **Step 5:** Document Physics Core Dependencies in each engine's `.engine.md`
