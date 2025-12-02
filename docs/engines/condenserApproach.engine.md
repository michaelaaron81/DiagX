<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->

# Condenser Approach — Diagnostic Engine Contract

## 1. Purpose

The Condenser Approach engine evaluates condenser performance by analyzing the relationship between ambient temperature, condensing pressure, and liquid line temperature. It produces diagnostic flags and recommendations based on structural comparisons against expected approach ranges.

## 2. Inputs (Measurements)

From `CondenserApproachMeasurements`:

| Field | Type | Required |
|-------|------|----------|
| ambientTemp | number \| null | No |
| condensingPressure | number \| null | No |
| liquidLineTemp | number \| null | No |

## 3. Inputs (Profile Fields)

From `CondenserApproachProfile`:

| Field | Path |
|-------|------|
| refrigerantType | profile.refrigerantType |
| expectedApproach | profile.expectedApproach |

## 4. Outputs — Values

From `CondenserApproachValues`:

| Field | Type |
|-------|------|
| condenserApproach | number \| null |
| condensingSatTemp | number \| null |
| liquidSubcooling | number \| null |

## 5. Outputs — Flags

From `CondenserApproachFlags`:

| Field | Type |
|-------|------|
| approachStatus | CondenserStatus |
| subcoolingStatus | CondenserStatus |
| refrigerantProfile | 'standard' \| 'unknown_curve' \| 'standard_override' \| undefined |

Where:
- CondenserStatus = 'unknown' | 'ok' | 'warning' | 'alert' | 'critical'

## 6. Recommendations Produced

Recommendations are generated via `generateCondenserApproachRecommendations`:

| Recommendation ID | Severity |
|-------------------|----------|
| condenser_approach_critical | critical |
| condenser_approach_alert | alert |
| condenser_subcooling_critical | critical |
| condenser_subcooling_alert | alert |
| condenser_preventive | info |

## 7. Status Mapping

The engine determines overall status using worst-case aggregation:

1. Collect statuses: approachStatus, subcoolingStatus
2. If any status is 'critical' → overall = 'critical'
3. Else if any status is 'alert' → overall = 'alert'
4. Else if any status is 'warning' → overall = 'warning'
5. Else → overall = 'ok'

## 8. Invariants (Architect-Defined)

- Engine does not modify profile or measurement inputs
- Engine produces deterministic output for identical inputs
- Null measurements result in 'unknown' status (not error)
- PT interpolation uses embedded refrigerant data when refrigerantType is recognized
- Default expected approach range applies when profile.expectedApproach is not provided

## 9. Validation Handshake

Tier-A validation executes before engine invocation. Completeness gating applies based on ProfileInputSchema requirements. Engine assumes measurements have passed structural validation.
