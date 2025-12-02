<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->

# Airside — Diagnostic Engine Contract

## 1. Purpose

The Airside engine evaluates air-side performance of water-cooled heat pump units by analyzing temperature differentials, airflow rates, and static pressure conditions. It produces diagnostic flags and recommendations based on structural comparisons against expected ranges.

## 2. Inputs (Measurements)

From `AirsideMeasurements`:

| Field | Type | Required |
|-------|------|----------|
| returnAirTemp | number | Yes |
| supplyAirTemp | number | Yes |
| returnAirRH | number | No |
| supplyAirRH | number | No |
| returnPlenum | number | No |
| supplyPlenum | number | No |
| externalStatic | number | No |
| mode | 'cooling' \| 'heating' \| 'fan_only' | Yes |
| wetBulbTemp | number | No |
| supplyWetBulb | number | No |
| airVelocity | number | No |
| measuredCFM | number | No |
| airflowCFMOverride | number | No |
| airflowOverrideNote | string | No |
| totalExternalStatic | number | No |

## 3. Inputs (Profile Fields)

From `WaterCooledUnitProfile`:

| Field | Path |
|-------|------|
| nominalTons | profile.nominalTons |
| model | profile.model |
| designCFM.cooling | profile.airside.designCFM.cooling |
| designCFM.heating | profile.airside.designCFM.heating |
| externalStaticPressure.design | profile.airside.externalStaticPressure.design |
| externalStaticPressure.max | profile.airside.externalStaticPressure.max |
| manufacturerExpectedDeltaT | profile.airside.manufacturerExpectedDeltaT |
| manufacturerCFMPerTon | profile.airside.manufacturerCFMPerTon |

## 4. Outputs — Values

From `AirsideEngineValues`:

| Field | Type |
|-------|------|
| deltaT | number |
| expectedDeltaT | { min: number; ideal: number; max: number; source: string } |
| estimatedCFM | number \| undefined |
| measuredCFM | number \| undefined |
| airflowCFM | number \| undefined |
| airflowSource | AirflowSource \| undefined |
| cfmPerTon | number \| undefined |
| expectedCFMPerTon | { min: number; ideal: number; max: number; source: string } |
| totalESP | number \| undefined |
| ratedESP | { design: number; max: number } \| undefined |
| sensibleHeatRatio | number \| undefined |

## 5. Outputs — Flags

From `AirsideEngineFlags`:

| Field | Type |
|-------|------|
| mode | 'cooling' \| 'heating' \| 'fan_only' |
| deltaTStatus | DiagnosticStatus |
| deltaTSource | 'manufacturer' \| 'calculated' \| 'industry' |
| cfmSource | 'manufacturer' \| 'nameplate_calculated' \| 'industry' |
| airflowStatus | DiagnosticStatus |
| staticPressureStatus | DiagnosticStatus \| undefined |
| humidityRemovalStatus | DiagnosticStatus \| undefined |
| disclaimers | string[] |

## 6. Recommendations Produced

| Recommendation ID | Severity |
|-------------------|----------|
| airside_frozen_coil_or_restriction | critical |
| airside_airflow_below_design | alert |
| airside.low_airflow.inspect_air_path | critical \| advisory |
| airside_static_pressure_exceeds_rating | alert |
| airside.static_pressure.inspect_ductwork | critical \| advisory |
| airside.abnormal_deltaT.check_for_icing_or_restriction | critical \| advisory |
| airside.high_airflow.low_deltaT_review | critical \| advisory |
| airside_preventive_filter_maintenance | info |

## 7. Status Mapping

The engine determines overall status using worst-case aggregation:

1. Collect statuses: deltaTStatus, airflowStatus, staticPressureStatus
2. If any status is 'critical' → overall = 'critical'
3. Else if any status is 'alert' → overall = 'alert'
4. Else if any status is 'warning' → overall = 'warning'
5. Else → overall = 'ok'

## 8. Invariants (Architect-Defined)

- Engine does not modify profile or measurement inputs
- Engine produces deterministic output for identical inputs
- Flattened backward-compatible fields mirror values/flags structure
- Recommendations are sorted by severity (critical → alert → advisory → info)

## 9. Validation Handshake

Tier-A validation executes before engine invocation. Completeness gating applies based on ProfileInputSchema requirements. Engine assumes measurements have passed structural validation.
