````markdown
# Recommendation Suggestions — 2025-11-29

This running document collects additional recommended recommendations (and tests) identified during the recommendation gap scan conducted on 2025-11-29. It complements `docs/gap-scans/Recommendation_Gaps_2025-11-29.md` which contains the raw automated scan output.

Summary of gaps found (auto-scan highlights):
- Airside (`airside`): in frozen/low-airflow scenarios the engine provides a critical frozen coil recommendation, but lacks suggestions to measure airflow/ESP and to inspect/replace filters, blower or ducts. In other scenarios with low airflow the engine doesn't include step-by-step diagnostic actions beyond 'check filter and coil'.
- Refrigeration (`refrigeration`): in some superheat/subcooling conditions there are gaps around recommending specific measurement or safety-stop actions (e.g., stop equipment when low superheat indicates liquid slugging) and more explicit guidance for leak checks and refrigerant handling.
- Reciprocating compressor (`compressor_recip`): some scenarios returned no recommendations even when flags indicated critical compression ratio or critical current; ensure generator creates high-priority safety recommendations for these cases.

Proposed additional recommendations (engine-agnostic format)

1) Airside — Measure airflow & ESP (diagnostic / high priority)

```json
{
  "id": "airside_measure_airflow_and_esp",
  "domain": "airside",
  "severity": "alert",
  "intent": "diagnostic",
  "summary": "Collect airflow and ESP measurements to support diagnostic evaluation; record measurement context and conditions.",
  "rationale": "Confirm CFM/ton and ESP to narrow down root cause (filter / blower / duct).",
  "requiresShutdown": false,
  "notes": ["Confirm CFM/ton and ESP to narrow down root cause (filter / blower / duct)."]
}
```

2) Airside — Replace or clean filter (maintenance / high priority)

```json
{
  "id": "airside_replace_clean_filter",
  "domain": "airside",
  "severity": "alert",
  "intent": "diagnostic",
  "summary": "Filter condition may be a contributing factor to observed performance deviations.",
  "rationale": "Dirty filters are a common cause of high ΔT and low airflow; measure filter pressure drop to determine impact on system performance.",
  "requiresShutdown": false,
  "notes": ["Dirty filters are a common cause of high ΔT and low airflow."]
}
```

3) Airside — Inspect blower, motor & controls (diagnostic/repair)

```json
{
  "id": "airside_inspect_blower_fan",
  "domain": "airside",
  "severity": "critical",
  "intent": "routing",
  "summary": "Blower subsystem or drive performance may be contributing to low airflow and requires specialist evaluation.",
  "rationale": "Measurements indicate a subsystem-level issue that is outside the diagnostic layer and should be routed to a repair/planning workflow.",
  "requiresShutdown": true,
  "notes": ["Measurements indicate subsystem-level issues that may need specialist service."]
}
```

4) Airside — Inspect ductwork and registers (diagnostic)

```json
{
  "id": "airside_inspect_ducts_registers",
  "domain": "airside",
  "severity": "alert",
  "intent": "diagnostic",
  "summary": "Ductwork, registers, or balancing components may be contributing to airflow issues; inspect for obstructions and configuration issues.",
  "rationale": "Patterns in airflow and pressure indicate outlet-side restrictions may be present.",
  "requiresShutdown": false
}
```

5) Airside — Defrost / Controlled thaw for frozen coil (safety-critical)

```json
{
  "id": "airside_defrost_and_assess",
  "domain": "airside",
  "severity": "critical",
  "intent": "safety",
  "summary": "Measured coil and airflow conditions indicate a frozen coil which poses immediate equipment risk.",
  "rationale": "Operating the compressor against a frozen coil can cause liquid migration and compressor damage; this condition is flagged as safety-critical.",
  "requiresShutdown": true
}
```

6) Refrigeration — Safety stop & liquid slugging protection

```json
{
  "id": "refrigeration_stop_for_low_superheat",
  "domain": "refrigeration",
  "severity": "critical",
  "intent": "safety",
  "summary": "Measured superheat and related patterns indicate an elevated risk of liquid entry into the compressor.",
  "rationale": "Low superheat can indicate liquid refrigerant presence in the compressor inlet which risks severe equipment damage; this is flagged as safety-critical.",
  "requiresShutdown": true
}
```

7) Refrigeration — Recommend leak check and controlled refrigerant handling

```json
{
  "id": "refrigeration_leak_check_and_repair",
  "domain": "refrigeration",
  "severity": "alert",
  "intent": "routing",
  "summary": "Patterns in superheat and subcooling suggest a potential charge anomaly that requires a leak investigation and repair workflow.",
  "rationale": "Anomalies in refrigerant charge typically require planning-level repair steps and validation prior to recharging.",
  "requiresShutdown": false
}
```

8) Recip compressor — Explicit high-priority actions for low compression and high current

Observation: The gap scan found there were no recommendations returned in some scenarios that produced critical compression/current flags. The engine's helper should be reviewed so that the generator returns explicit critical recommendations for compression ratio < 2.5 & critical current.

Suggested examples (safety-critical):

```json
{ "id": "compressor_recip_internal_bypass_suspected", "domain": "compressor_recip", "severity":"critical", "intent":"routing", "summary": "Observed patterns are consistent with reversing-valve-related internal bypass; route to repair/planning workflow for further evaluation.", "requiresShutdown": true }
```

```json
{ "id": "compressor_recip_current_far_above_rla", "domain": "compressor_recip", "severity":"critical", "intent":"safety", "summary": "Measured current is far above RLA and indicates a hazardous electrical/mechanical operating state.", "requiresShutdown": true }
```

9) Tests to add
- Add unit tests that create the failing scenarios used in the gap scan and assert that the generated recommendations include the IDs from our suggested additions above. This guards against regressions where engines produce flags but forget to recommend an action.

Next steps I can take (pick one or more)
- Implement the new recommendations into `src/modules/airside/airside.engine.ts` (or its recommendation helper) and add tests.
- Implement the refrigeration and reciprocating-compressor suggestions and tests.
- Perform additional, fuzz-based scenario generation to further expand coverage (e.g., sensor anomalies, impossible values).

If you want me to continue, tell me which engines to prioritize first (airside, refrigeration, compressor_recip) and I will implement the recommended additions + tests and push a PR.

````
