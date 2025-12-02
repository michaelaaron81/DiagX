<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->

# Scroll Compressor — Diagnostic Engine Contract

## 1. Purpose

The Scroll Compressor engine evaluates the operational state of scroll-type compressors by analyzing compression ratio and electrical current draw. It produces diagnostic flags and recommendations based on structural comparisons against expected ranges.

## 2. Inputs (Measurements)

From `ScrollCompressorMeasurements`:

| Field | Type | Required |
|-------|------|----------|
| mode | 'cooling' \| 'heating' | Yes |
| suctionPressure | number | Yes |
| dischargePressure | number | Yes |
| suctionTemp | number | Yes |
| dischargeTemp | number | No |
| runningCurrent | number | No |
| voltage | number | No |
| isRunning | boolean | No |

## 3. Inputs (Profile Fields)

From `WaterCooledUnitProfile`:

| Field | Path |
|-------|------|
| compressor.type | profile.compressor.type |
| compressor.rla | profile.compressor.rla |
| compressor.lra | profile.compressor.lra |
| model | profile.model |
| refrigeration.refrigerantType | profile.refrigeration.refrigerantType |

## 4. Outputs — Values

From `ScrollCompressorValues`:

| Field | Type |
|-------|------|
| suctionPressure | number |
| dischargePressure | number |
| compressionRatio | number |
| currentDraw | number \| undefined |

## 5. Outputs — Flags

From `ScrollCompressorFlags`:

| Field | Type |
|-------|------|
| currentStatus | DiagnosticStatus \| undefined |
| compressionStatus | DiagnosticStatus \| undefined |
| disclaimers | string[] \| undefined |

## 6. Recommendations Produced

| Recommendation ID | Severity |
|-------------------|----------|
| compressor_scroll_compression_ratio_issue | critical \| alert |
| compressor_scroll_current_issue | critical \| alert |
| compressor_scroll_no_immediate_action | info |

## 7. Status Mapping

The engine determines overall status using worst-case aggregation:

1. Collect statuses: compressionStatus, currentStatus
2. If any status is 'critical' → overall = 'critical'
3. Else if any status is 'alert' → overall = 'alert'
4. Else if any status is 'warning' → overall = 'warning'
5. Else → overall = 'ok'

## 8. Invariants (Architect-Defined)

- Engine does not modify profile or measurement inputs
- Engine produces deterministic output for identical inputs
- Current analysis requires both runningCurrent and profile.compressor.rla
- Flattened backward-compatible fields mirror values/flags structure
- Recommendations are generated via generateScrollRecommendations

## 9. Validation Handshake

Tier-A validation executes before engine invocation. Completeness gating applies based on ProfileInputSchema requirements. Engine assumes measurements have passed structural validation.
