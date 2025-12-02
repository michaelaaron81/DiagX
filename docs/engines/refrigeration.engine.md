<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->

# Refrigeration — Diagnostic Engine Contract

## 1. Purpose

The Refrigeration engine evaluates refrigerant-side performance of water-cooled heat pump units by analyzing pressure-temperature relationships, superheat, subcooling, compression ratio, and water-side heat transfer. It produces diagnostic flags and recommendations based on structural comparisons against expected ranges.

## 2. Inputs (Measurements)

From `RefrigerationMeasurements`:

| Field | Type | Required |
|-------|------|----------|
| mode | 'cooling' \| 'heating' | Yes |
| suctionPressure | number | Yes |
| dischargePressure | number | Yes |
| suctionTemp | number | Yes |
| liquidTemp | number | Yes |
| enteringWaterTemp | number | No |
| leavingWaterTemp | number | No |
| dischargeTemp | number | No |
| indoorAirTemp | number | No |
| ambientTemp | number \| null | No |
| condensingPressure | number \| null | No |

## 3. Inputs (Profile Fields)

From `RefrigerationConfig`:

| Field | Path |
|-------|------|
| refrigerant | config.refrigerant |
| coolingMeterType | config.coolingMeterType |
| heatingMeterType | config.heatingMeterType |
| nominalTons | config.nominalTons |
| designWaterFlowGPM | config.designWaterFlowGPM |
| superheatCoolingTXV | config.superheatCoolingTXV |
| superheatCoolingFixed | config.superheatCoolingFixed |
| superheatHeatingTXV | config.superheatHeatingTXV |
| subcoolingWaterCooled | config.subcoolingWaterCooled |
| compressionRatioRange | config.compressionRatioRange |
| ptOverride | config.ptOverride |
| metering | config.metering |

## 4. Outputs — Values

From `RefrigerationValues`:

| Field | Type |
|-------|------|
| suctionPressure | number |
| dischargePressure | number |
| suctionSatTemp | number |
| dischargeSatTemp | number |
| superheat | number |
| subcooling | number |
| compressionRatio | number |
| waterDeltaT | number |
| dischargeSuperheat | number \| undefined |

## 5. Outputs — Flags

From `RefrigerationFlags`:

| Field | Type |
|-------|------|
| superheatStatus | DiagnosticStatus |
| subcoolingStatus | DiagnosticStatus |
| compressionRatioStatus | DiagnosticStatus |
| waterTransferStatus | DiagnosticStatus |
| refrigerantProfile | 'standard' \| 'unknown' |
| disclaimers | string[] \| undefined |

## 6. Recommendations Produced

| Recommendation ID | Severity |
|-------------------|----------|
| refrigeration_liquid_slug_safety_stop | critical |
| refrigeration_charge_pattern_low | alert |
| refrigeration_subcooling_elevated_pattern | alert |
| refrigeration_flow_or_heat_transfer_limited | alert |
| refrigeration_compression_ratio_abnormal | alert |
| refrigeration_water_transfer_abnormal | alert |
| refrigeration_preventive_trending | info |
| refrigerant_profile_unknown | info |
| refrigeration_severe_internal_bypass | critical |
| refrigeration_undercharge_pattern | alert |
| refrigeration_overcharge_pattern | alert |
| refrigeration_water_side_issue | alert |
| refrigeration_no_immediate_action | info |

## 7. Status Mapping

The engine determines overall status using worst-case aggregation:

1. Collect statuses: superheatStatus, subcoolingStatus, compressionRatioStatus, waterTransferStatus
2. If any status is 'critical' → overall = 'critical'
3. Else if any status is 'alert' → overall = 'alert'
4. Else if any status is 'warning' → overall = 'warning'
5. Else → overall = 'ok'

## 8. Invariants (Architect-Defined)

- Engine does not modify config or measurement inputs
- Engine produces deterministic output for identical inputs
- PT interpolation uses embedded refrigerant data or user-supplied ptOverride (for 'OTHER' refrigerant only)
- Flattened backward-compatible fields mirror values/flags structure
- Recommendations are generated via generateRefrigerationRecommendations

## 9. Validation Handshake

Tier-A validation executes before engine invocation. Completeness gating applies based on ProfileInputSchema requirements. Engine assumes measurements have passed structural validation via validateRefrigerationMeasurements.
