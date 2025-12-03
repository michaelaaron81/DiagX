<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->

# Reversing Valve — Diagnostic Engine Contract

## 1. Purpose

The Reversing Valve engine evaluates the operational state of heat pump reversing valves by analyzing port temperatures, compression ratio, and solenoid voltage. It determines whether the valve is operating correctly, stuck, reversed, or experiencing internal leakage.

## 2. Inputs (Measurements)

From `ReversingValveMeasurements`:

| Field | Type | Required |
|-------|------|----------|
| requestedMode | 'cooling' \| 'heating' | Yes |
| reversingValvePortTemps.dischargeInlet | number | Yes |
| reversingValvePortTemps.suctionReturn | number | Yes |
| reversingValvePortTemps.indoorCoilLine | number | Yes |
| reversingValvePortTemps.outdoorCoilLine | number | Yes |
| solenoidVoltage | number | No |
| suctionPressure | number | Yes |
| dischargePressure | number | Yes |

## 3. Inputs (Profile Fields)

From `WaterCooledUnitProfile`:

| Field | Path |
|-------|------|
| reversingValve.type | profile.reversingValve.type |
| reversingValve.solenoid.voltage | profile.reversingValve.solenoid.voltage |
| supportsHeating | profile.supportsHeating |

## 4. Outputs — Values

From `ReversingValveValues`:

| Field | Type |
|-------|------|
| portTemps | ReversingValvePortTemps |
| tempSpread | number |
| hotPorts | string[] |
| coldPorts | string[] |
| compressionRatio | number |

Where ReversingValvePortTemps:
| Field | Type |
|-------|------|
| dischargeInlet | number |
| suctionReturn | number |
| indoorCoilLine | number |
| outdoorCoilLine | number |

## 5. Outputs — Flags

From `ReversingValveFlags`:

| Field | Type |
|-------|------|
| patternMatch | 'correct' \| 'reversed' \| 'stuck' \| 'partial_leak' |
| solenoidStatus | 'ok' \| 'no_voltage' \| 'low_voltage' \| undefined |

## 6. Recommendations Produced

| Recommendation ID | Severity |
|-------------------|----------|
| reversing_valve_stuck_mid_position | critical |
| reversing_valve_not_switching | alert |
| reversing_valve_internal_leak | alert |
| reversing_valve_solenoid_no_voltage | alert |
| reversing_valve_preventive_check | info |

## 7. Status Mapping

The engine determines overall status based on pattern analysis and solenoid status:

1. If patternMatch is 'stuck' with tempSpread < 50 → status = 'critical'
2. If patternMatch is 'reversed' → status = 'alert'
3. If patternMatch is 'partial_leak' → status = 'alert' or 'warning' based on compression ratio
4. If solenoidStatus is 'no_voltage' → status = 'alert'
5. If patternMatch is 'correct' and no solenoid issues → status = 'ok'

## 8. Invariants (Architect-Defined)

- Engine does not modify profile or measurement inputs
- Engine produces deterministic output for identical inputs
- Engine requires profile.supportsHeating and profile.reversingValve to be present
- Flattened backward-compatible fields mirror values/flags structure
- Recommendations are sorted by severity (critical → alert → advisory → info)

## 9. Physics Core Dependencies

The engine delegates thermodynamic calculations to the Physics Kernel (`src/physics/hvac`):

| Kernel Function | Used For |
|-----------------|----------|
| `computeCompressionRatio(dischargePressure, suctionPressure)` | Pressure ratio calculation |

## 10. Validation Handshake

Tier-A validation executes before engine invocation. Completeness gating applies based on ProfileInputSchema requirements. Engine assumes measurements have passed structural validation via validateReversingValveMeasurements.
