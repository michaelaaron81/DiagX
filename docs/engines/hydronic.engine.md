<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->

# Hydronic — Diagnostic Engine Contract

## 1. Purpose

The Hydronic engine evaluates water-side performance of water-cooled heat pump units by analyzing water temperature differentials and flow rates. It produces diagnostic flags and recommendations based on structural comparisons against expected ranges.

## 2. Inputs (Measurements)

From `HydronicMeasurements`:

| Field | Type | Required |
|-------|------|----------|
| enteringWaterTemp | number \| null | No |
| leavingWaterTemp | number \| null | No |
| flowRateGPM | number \| null | No |
| enteringLoopTemp | number \| null | No |
| leavingLoopTemp | number \| null | No |

## 3. Inputs (Profile Fields)

From `HydronicProfileConfig`:

| Field | Path |
|-------|------|
| designFlowGPM | profile.designFlowGPM |
| expectedDeltaT | profile.expectedDeltaT |
| loopType | profile.loopType |

## 4. Outputs — Values

From `HydronicValues`:

| Field | Type |
|-------|------|
| waterDeltaT | number \| null |
| flowRateGPM | number \| null |
| expectedDeltaT | { min: number; ideal: number; max: number; source: 'industry' \| 'profile' } \| null \| undefined |

## 5. Outputs — Flags

From `HydronicFlags`:

| Field | Type |
|-------|------|
| deltaTStatus | HydronicDeltaTStatus |
| flowStatus | HydronicFlowStatus |
| disclaimers | string[] |

Where:
- HydronicDeltaTStatus = 'unknown' | 'ok' | 'warning' | 'alert' | 'critical'
- HydronicFlowStatus = 'unknown' | 'ok' | 'warning' | 'alert' | 'critical'

## 6. Recommendations Produced

Recommendations are generated via `generateHydronicRecommendations`:

| Recommendation ID | Severity |
|-------------------|----------|
| hydronic_delta_t_critical | critical |
| hydronic_delta_t_alert | alert |
| hydronic_flow_critical | critical |
| hydronic_flow_alert | alert |
| hydronic_preventive | info |

## 7. Status Mapping

The engine determines overall status using worst-case aggregation:

1. Collect statuses: deltaTStatus, flowStatus
2. If any status is 'critical' → overall = 'critical'
3. Else if any status is 'alert' → overall = 'alert'
4. Else if any status is 'warning' → overall = 'warning'
5. Else → overall = 'ok'

## 8. Invariants (Architect-Defined)

- Engine does not modify profile or measurement inputs
- Engine produces deterministic output for identical inputs
- Null measurements result in 'unknown' status (not error)
- Industry defaults apply when profile.expectedDeltaT is not provided

## 9. Validation Handshake

Tier-A validation executes before engine invocation. Completeness gating applies based on ProfileInputSchema requirements. Engine assumes measurements have passed structural validation via validateHydronicMeasurements.
