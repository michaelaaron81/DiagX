# DiagX Engines Inventory

This file is the canonical list of engine entry points targeted for Phase 2 normalization and review.

Engines:
- Airside
  - `src/modules/airside/airside.engine.ts`
- Refrigeration
  - `src/modules/refrigeration/refrigeration.engine.ts`
  - Notes: flags-driven recommendation mapping completed for superheat/subcooling/compression ratio/water-transfer patterns; differentiates standard vs unknown refrigerant disclaimers.
  - Flag set: superheatStatus, subcoolingStatus, compressionRatioStatus, waterTransferStatus, refrigerantProfile
  - Mapped failure-mode IDs: refrigeration_liquid_slug_safety_stop, refrigeration_charge_pattern_low, refrigeration_subcooling_elevated_pattern, refrigeration_flow_or_heat_transfer_limited, refrigeration_compression_ratio_abnormal, refrigeration_water_transfer_abnormal, refrigerant_profile_unknown
- Compressor – Reciprocating
  - `src/modules/compressor/recip.engine.ts`
  - Notes: critical compression and critical current flags now each produce dedicated safety recommendations via the engine's recommendation helper. Flags non-standard refrigerants as `refrigerantProfile = 'unknown'` and limits analysis to generic compression/current behavior.
  - Flag set: compressionStatus, currentStatus, unloadingStatus, recipHealth.*, refrigerantProfile
  - Mapped failure-mode IDs: compressor_recip_internal_bypass_suspected, compressor_recip_current_far_above_rla, compressor_recip_current_high_alert, compressor_recip_current_low_warning, compressor_recip_unloading_abnormal_alert, compressor_recip_unloading_partial_warning, compressor_recip_reed_valve_issue_suspected, compressor_recip_piston_ring_wear_suspected
- Compressor – Scroll
  - `src/modules/compressor/scroll.engine.ts`
- Reversing Valve
  - `src/modules/reversingValve/reversing.engine.ts`
- Hydronic Source (new Phase 2.4)
  - `src/modules/hydronic/hydronic.engine.ts`
  - Flag set: deltaTStatus, flowStatus, disclaimers
  - Mapped failure-mode IDs (suggested): hydronic_deltaT_critical, hydronic_deltaT_alert, hydronic_flow_issue, hydronic_preventive_trend
- Condenser Approach (new Phase 2.4)
  - `src/modules/condenserApproach/condenserApproach.engine.ts`
  - Flag set: approachStatus, subcoolingStatus, refrigerantProfile, disclaimers
  - Mapped failure-mode IDs: condenser_approach_critical, condenser_approach_alert, condenser_subcooling_issue, condenser_preventive_trend
