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
  "module": "airside",
  "priority": "high",
  "severity": "high",
  "action": "Collect airflow and ESP measurements to support diagnostic evaluation; record measurement context and conditions.",
  "rationaleFlag": "airflow_diagnostic",
  "requiresShutdown": false,
  "notes": "Confirm CFM/ton and ESP to narrow down root cause (filter / blower / duct)."
}
```

2) Airside — Replace or clean filter (maintenance / high priority)

```json
{
  "id": "airside_replace_clean_filter",
  "module": "airside",
  "priority": "high",
  "severity": "high",
  "action": "Filter condition may be a contributing factor; filter cleaning or replacement could be appropriate depending on measured pressure drop and observed condition.",
  "rationaleFlag": "filter_dirty",
  "requiresShutdown": false,
  "notes": "Dirty filters are a common cause of high ΔT and low airflow; replacing can return the system to nominal before deeper troubleshooting."
}
```

3) Airside — Inspect blower, motor & controls (diagnostic/repair)

```json
{
  "id": "airside_inspect_blower_fan",
  "module": "airside",
  "priority": "high",
  "severity": "high",
  "action": "Blower subsystem or drive performance may be contributing to low airflow; specialist evaluation and repair/replacement may be required depending on findings.",
  "rationaleFlag": "blower_issue",
  "requiresShutdown": true,
  "notes": "Blower/drive failures often reduce airflow even when filters look OK. Electrical safety checks should be performed by a qualified technician."
}
```

4) Airside — Inspect ductwork and registers (diagnostic)

```json
{
  "id": "airside_inspect_ducts_registers",
  "module": "airside",
  "priority": "high",
  "severity": "alert",
  "action": "Ductwork, registers, and balancing components may be contributing to airflow issues; investigation and remediation of obstructions or misconfiguration are recommended.",
  "rationaleFlag": "ductwork_blockage",
  "requiresShutdown": false
}
```

5) Airside — Defrost / Controlled thaw for frozen coil (safety-critical)

```json
{
  "id": "airside_defrost_and_assess",
  "module": "airside",
  "priority": "critical",
  "severity": "critical",
  "action": "Recommend system shutdown where operating conditions pose immediate safety or equipment risk and coordinate a qualified technician evaluation before restart.",
  "rationaleFlag": "frozen_coil",
  "requiresShutdown": true,
  "safetyWarning": "Do not operate compressor against a frozen coil — risk of floodback and compressor damage."
}
```

6) Refrigeration — Safety stop & liquid slugging protection

```json
{
  "id": "refrigeration_stop_for_low_superheat",
  "module": "refrigeration",
  "priority": "critical",
  "severity": "critical",
  "action": "Low superheat with indicators of possible liquid entry represents a critical condition — recommend shutting down affected compressors and coordinating qualified technician assessment before restart.",
  "rationaleFlag": "superheat_critical",
  "requiresShutdown": true,
  "safetyWarning": "Low superheat indicates potential liquid refrigerant entering compressor; continued operation risks compressor failure."
}
```

7) Refrigeration — Recommend leak check and controlled refrigerant handling

```json
{
  "id": "refrigeration_leak_check_and_repair",
  "module": "refrigeration",
  "priority": "high",
  "severity": "high",
  "action": "When superheat/subcooling patterns indicate charge anomalies, leak detection and remediation should be performed and validated prior to any refrigerant charging actions.",
  "rationaleFlag": "charge_issue",
  "requiresShutdown": false
}
```

8) Recip compressor — Explicit high-priority actions for low compression and high current

Observation: The gap scan found there were no recommendations returned in some scenarios that produced critical compression/current flags. The engine's helper should be reviewed so that the generator returns explicit critical recommendations for compression ratio < 2.5 & critical current.

Suggested examples (safety-critical):

```json
{ "id": "compressor_recip_internal_bypass_suspected", "module": "compressor_recip", "priority": "critical", "severity":"critical", "action": "Reversing valve malfunction is a plausible cause for observed patterns; evaluation of valve and compressor operation is recommended. Avoid extended operation under suspected failure conditions.", "requiresShutdown": true }
```

```json
{ "id": "compressor_recip_current_far_above_rla", "module": "compressor_recip", "priority": "critical", "severity":"critical", "action": "High current draw usually indicates a hazardous operating condition; recommend immediate shutdown and qualified electrical/mechanical assessment prior to further operation.", "requiresShutdown": true }
```

9) Tests to add
- Add unit tests that create the failing scenarios used in the gap scan and assert that the generated recommendations include the IDs from our suggested additions above. This guards against regressions where engines produce flags but forget to recommend an action.

Next steps I can take (pick one or more)
- Implement the new recommendations into `src/modules/airside/airside.engine.ts` (or its recommendation helper) and add tests.
- Implement the refrigeration and reciprocating-compressor suggestions and tests.
- Perform additional, fuzz-based scenario generation to further expand coverage (e.g., sensor anomalies, impossible values).

If you want me to continue, tell me which engines to prioritize first (airside, refrigeration, compressor_recip) and I will implement the recommended additions + tests and push a PR.

````
