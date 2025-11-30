# Reciprocating Compressor Failure Mode Map

This table maps reciprocating compressor engine flags to their corresponding recommendation IDs. These IDs are stable and aligned with future failure modes for synthesis layers.

| Flag / Condition               | Recommendation ID                           | Severity |
|-------------------------------|---------------------------------------------|----------|
| compressionStatus = critical   | compressor_recip_internal_bypass_suspected  | critical |
| currentStatus = critical       | compressor_recip_current_far_above_rla      | critical |
| currentStatus = alert          | compressor_recip_current_high_alert         | alert    |
| currentStatus = warning        | compressor_recip_current_low_warning        | warning  |
| unloadingStatus = alert        | compressor_recip_unloading_abnormal_alert   | alert    |
| unloadingStatus = warning      | compressor_recip_unloading_partial_warning  | warning  |
| reedValveSuspected = true      | compressor_recip_reed_valve_issue_suspected | alert    |
| pistonRingWearSuspected = true | compressor_recip_piston_ring_wear_suspected | alert    |