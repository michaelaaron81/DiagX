<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->

# Reciprocating Compressor — Diagnostic Engine Contract

## 1. Purpose

The Reciprocating Compressor engine evaluates the operational state of reciprocating-type compressors by analyzing compression ratio, electrical current draw, cylinder unloading, and sound characteristics. It produces diagnostic flags and recommendations based on structural comparisons against expected ranges.

## 2. Inputs (Measurements)

From `ReciprocatingCompressorMeasurements`:

| Field | Type | Required |
|-------|------|----------|
| compressorId | string | No |
| suctionPressure | number | Yes |
| dischargePressure | number | Yes |
| suctionTemp | number | Yes |
| dischargeTemp | number | No |
| compressorCurrent | number | No |
| isRunning | boolean | No |
| totalCylinders | number | No |
| unloadedCylinders | number | No |
| soundCharacteristics.knocking | boolean | No |
| soundCharacteristics.clicking | boolean | No |
| soundCharacteristics.hissing | boolean | No |

## 3. Inputs (Profile Fields)

From `WaterCooledUnitProfile`:

| Field | Path |
|-------|------|
| compressor.type | profile.compressor.type |
| compressor.rla | profile.compressor.rla |
| compressor.lra | profile.compressor.lra |
| refrigeration.refrigerantType | profile.refrigeration.refrigerantType |

## 4. Outputs — Values

From `ReciprocatingCompressorValues`:

| Field | Type |
|-------|------|
| compressionRatio | number |
| current | number \| undefined |
| running | boolean \| undefined |
| unloadingInfo | { unloadedCount?: number; total?: number } \| undefined |

## 5. Outputs — Flags

From `ReciprocatingCompressorFlags`:

| Field | Type |
|-------|------|
| compressionStatus | DiagnosticStatus |
| currentStatus | DiagnosticStatus |
| recipHealth | ReciprocatingHealthFlags \| undefined |
| disclaimers | string[] \| undefined |
| refrigerantProfile | 'standard' \| 'unknown' \| undefined |

Where ReciprocatingHealthFlags:
| Field | Type |
|-------|------|
| reedValveSuspected | boolean \| undefined |
| pistonRingWearSuspected | boolean \| undefined |

## 6. Recommendations Produced

| Recommendation ID | Severity |
|-------------------|----------|
| compressor_recip_internal_bypass_suspected | critical |
| compressor_recip_current_far_above_rla | critical |
| compressor_recip_current_high_alert | alert |
| compressor_recip_current_low_warning | advisory |
| compressor_recip_unloading_abnormal_alert | alert |
| compressor_recip_unloading_partial_warning | advisory |
| compressor_recip_reed_valve_issue_suspected | alert |
| compressor_recip_piston_ring_wear_suspected | alert |
| compressor_recip_preventive_check | info |
| refrigerant_profile_unknown | info |

## 7. Status Mapping

The engine determines overall status using worst-case aggregation:

1. Collect statuses: compressionStatus, currentStatus, unloadingInfo.status (if present)
2. If any status is 'critical' → overall = 'critical'
3. Else if any status is 'alert' → overall = 'alert'
4. Else if any status is 'warning' → overall = 'warning'
5. Else → overall = 'ok'

## 8. Invariants (Architect-Defined)

- Engine does not modify profile or measurement inputs
- Engine produces deterministic output for identical inputs
- Current analysis requires both compressorCurrent and profile.compressor.rla
- Sound characteristics influence recipHealth flags only when compression status is abnormal
- Flattened backward-compatible fields mirror values/flags structure
- Recommendations are generated via generateRecipRecommendations

## 9. Validation Handshake

Tier-A validation executes before engine invocation. Completeness gating applies based on ProfileInputSchema requirements. Engine assumes measurements have passed structural validation via validateReciprocatingCompressorMeasurements.
