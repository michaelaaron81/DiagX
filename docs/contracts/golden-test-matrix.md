<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->

# Golden Test Matrix

**Phase 3.5 — Engine Hardening & Freeze**

This document is the "no drift permitted" oracle. Any change to test behavior
must be reflected here with architect approval.

---

## Summary

| Metric | Value |
|--------|-------|
| Generated | 2025-12-03T03:24:47.984Z |
| Total Test Suites | 80 |
| Total Tests | 135 |
| Passed | 135 |
| Failed | 0 |
| Success | ✓ |

---

## Test Matrix by Domain

### Airside

#### `airside.engine.full.test.ts`

File Hash: `f26769e3af3422e0`

| Test | Hash |
|------|------|
| nominal fixture should be ok | `cf031a73fa2c` |
| lowflow fixture should indicate low airflow (alert or critical) | `ab826379d654` |
| frozen fixture should indicate critical overallFinding due to deltaT | `8978545b34f3` |

#### `airside.module.test.ts`

File Hash: `5d6ac10388919b00`

| Test | Hash |
|------|------|
| validate catches missing temps | `2ae471f63e0c` |
| getMeasurementHelp returns MeasurementHelp for known keys | `1d6c78aaaf8e` |
| diagnose delegates to engine and explainDiagnosis returns structured object | `cdb7f2d3516d` |

#### `airside.override.test.ts`

File Hash: `2acb53767283f0f9`

| Test | Hash |
|------|------|
| accepts override within CFM/ton bounds for low TESP | `6623a4506fe2` |
| rejects override when CFM/ton too low for TESP | `b6b2fc6c9e4d` |
| rejects override when CFM/ton too high for TESP | `d80bd8a45f6a` |
| uses conservative default TESP (0.5) when not provided | `a4fd9b68a271` |
| rejects when nominalTons is zero or missing | `c07eb9b1259e` |
| rejects negative override values | `447adebd94b3` |
| handles high restriction scenario (TESP > 1.0) | `a1f629bc25b4` |
| accepts valid override and sets airflowSource to technician_override | `11386e2a19d7` |
| includes technician note in disclaimer when provided | `b717a4d0cbe4` |
| rejects override and falls back to inferred when CFM/ton too low | `d7a9529b9e82` |
| rejects override and falls back when CFM/ton too high | `14a6aef11566` |
| uses externalStatic as fallback when totalExternalStatic not provided | `d369b361f4a9` |
| infers airflow from deltaT when no override provided | `637a7a37a4ac` |
| uses measuredCFM when provided without override | `1e6b1f67f414` |
| override takes precedence over measuredCFM when valid | `8281c9258286` |
| includes airflowCFM and airflowSource in values object | `f7c4a8857104` |
| preserves existing engine output fields | `3d1554167c4f` |

#### `airside.recommendations.test.ts`

File Hash: `1cf3f53531353e4c`

| Test | Hash |
|------|------|
| generates critical recommendation for critical deltaT | `c3ac859804ef` |
| returns a preventive low-priority recommendation when conditions are normal | `56e07c93b1f0` |
| emits all required advisories for frozen_coil_like scenario | `32e61ecff9be` |
| emits low airflow and abnormal deltaT advisories for low_delta_but_low_cfm scenario | `2ce530ca4835` |
| emits high airflow / low deltaT advisory for very_high_airflow scenario | `14d558c95192` |
| does not emit new advisory IDs for nominal cooling fixture | `c0526cb9fe25` |

#### `airside.validation.test.ts`

File Hash: `8ce13aec738567dc`

| Test | Hash |
|------|------|
| flags missing critical field returnAirTemp as error | `c2e3a45785d3` |
| accepts a minimal valid measurement set | `12bb78d2ffb9` |

#### `debug.airside.badvalues.test.ts`

File Hash: `e3d3b0b40f4d7e51`

| Test | Hash |
|------|------|
| debug airside - bad values produce critical frozen coil recommendation | `e3d3b0b40f4d` |

### Combined/Orchestrator

#### `combined.profile.refrigerant.stress.test.ts`

File Hash: `c2de741bd6414033`

| Test | Hash |
|------|------|
| combined profile refrigerant stress test - generate detailed log | `c2de741bd641` |

#### `combined.profile.stress.test.ts`

File Hash: `ebe234ee27b94ddc`

| Test | Hash |
|------|------|
| combined profile stress run | `ebe234ee27b9` |

#### `wshp.orchestrator.correlation.test.ts`

File Hash: `57c042240948b9dd`

| Test | Hash |
|------|------|
| runWshpDiagx correlates airside + refrigeration + compressor problems into controls findings | `57c042240948` |

### Compressor (Recip)

#### `compressor.recip.engine.full.test.ts`

File Hash: `8451d2850da55662`

| Test | Hash |
|------|------|
| nominal should be ok or warning | `fc903095f28f` |
| highcurrent should show high/critical current status | `b840f00570a7` |
| low compression should show critical compression and include disclaimer for OTHER refrigerant | `e7318266f696` |

#### `compressor.recip.module.test.ts`

File Hash: `b74837acdda88818`

| Test | Hash |
|------|------|
| validate should return invalid when required fields missing | `582bc0030d4b` |
| diagnose delegates to engine and summarizeForReport returns readable text including status | `06f939f187dd` |

#### `compressor.recip.recommendations.test.ts`

File Hash: `09864003fa17ca15`

| Test | Hash |
|------|------|
| produces critical internal bypass recommendation for very low compression | `45daeb27c3be` |
| produces critical current recommendation when current >> rla | `9da1dab3d672` |
| produces critical compression recommendation when compressionStatus flag is critical (flags-driven) | `95a0cc64a4c5` |
| produces critical current recommendation even when RLA is missing | `750f167770ac` |
| produces critical current recommendation when flag is critical and current is missing | `897575a519d9` |
| produces both critical recommendations when both flags are critical | `c1113b52d510` |
| produces a low-priority preventive recommendation for ok systems | `3a066a5dcb9a` |
| produces current warning recommendation for currentStatus warning | `6e755f114a1f` |
| produces current alert recommendation for currentStatus alert | `82dfc055a9d4` |
| produces unloading warning recommendation for unloadingStatus warning | `69271b27c44c` |
| produces unloading alert recommendation for unloadingStatus alert | `af1d63ae0b5c` |
| produces reed valve recommendation when reedValveSuspected is true | `5adb1082b7d7` |
| produces piston ring wear recommendation when pistonRingWearSuspected is true | `c278c329540d` |
| does not produce warning/alert recommendations for ok systems | `dd20a1739081` |

#### `compressor.recip.stress.test.ts`

File Hash: `f798473ffc9735bd`

| Test | Hash |
|------|------|
| reciprocating compressor stress test - generate detailed log | `f798473ffc97` |

### Compressor (Scroll)

#### `compressor.scroll.engine.full.test.ts`

File Hash: `06a21e863e1210a9`

| Test | Hash |
|------|------|
| nominal should be ok or warning | `d18125272e3d` |
| highcurrent should show high/critical current status | `6712b77d3c2f` |
| badcompression should show critical or alert compression issues | `e8ce6d610dc9` |

#### `compressor.scroll.module.test.ts`

File Hash: `94eefaf5e52d9f2c`

| Test | Hash |
|------|------|
| validate should return invalid when required fields missing | `5903a57051d2` |
| diagnose delegates to engine and explainDiagnosis returns structured object | `03bae015c511` |

#### `compressor.scroll.recommendations.test.ts`

File Hash: `b8d0d63f448bf722`

| Test | Hash |
|------|------|
| produces a recommendation when compression ratio is critical | `c93fbbeab383` |
| returns a low priority rec when all ok | `6c21f2394d60` |

#### `compressor.scroll.stress.test.ts`

File Hash: `21cf156a763ce5ee`

| Test | Hash |
|------|------|
| scroll compressor stress test - generate detailed log | `21cf156a763c` |

### Condenser Approach

#### `condenser-approach.engine.full.test.ts`

File Hash: `33e926ba9004a03c`

| Test | Hash |
|------|------|
| populates approach & lift values for nominal input | `41d75e1a0e23` |
| flags abnormal approach when values are out of threshold (placeholder) | `7be2f2ae92e7` |

#### `condenser-approach.recommendations.test.ts`

File Hash: `e7a2958673a9e56f`

| Test | Hash |
|------|------|
| emits critical approach recommendation when approachStatus is critical | `682de5c01b4f` |
| emits subcooling alert when subcoolingStatus is alert | `da186b954843` |
| emits preventive rec when all OK | `9ed80fc87e25` |

#### `condenserApproach.engine.full.test.ts`

File Hash: `62c49e4ca793a4a7`

| Test | Hash |
|------|------|
| normal approach & subcooling should be ok (standard refrigerant) | `83c8356d3c5e` |
| missing pressure yields unknown approach | `64796a1d674d` |
| unknown refrigerant gets unknown_curve profile | `efd1fc083785` |

#### `condenserApproach.module.test.ts`

File Hash: `7087fd7f81bf355b`

| Test | Hash |
|------|------|
| diagnose ok scenario | `7087fd7f81bf` |

#### `condenserApproach.recommendations.test.ts`

File Hash: `452ba7c99b9385be`

| Test | Hash |
|------|------|
| approach critical yields critical recommendation | `862e79f7569d` |
| ok status yields preventive rec | `e5cc164e63a8` |

### Hydronic

#### `debug.hydronic.attach.test.ts`

File Hash: `0b9874de685b50ac`

| Test | Hash |
|------|------|
| runHydronicEngine should attach recommendations for critical deltaT | `0b9874de685b` |

#### `hydronic-source.engine.full.test.ts`

File Hash: `81876f077f674d78`

| Test | Hash |
|------|------|
| returns ok status for nominal hydronic conditions | `ac370d4c25ee` |
| flags abnormal deltaT when values are outside expected range (placeholder) | `a6129ab08979` |

#### `hydronic-source.module.test.ts`

File Hash: `2acc606e14d5e95c`

| Test | Hash |
|------|------|
| runs hydronic source engine from combined profile/measurements | `2acc606e14d5` |

#### `hydronic-source.recommendations.test.ts`

File Hash: `e9702a02ee95314d`

| Test | Hash |
|------|------|
| emits critical deltaT recommendation when deltaTStatus is critical | `fd7c9cd25b41` |
| emits preventive recommendation when all primary flags are ok | `f7e92b9f2a06` |
| emits data quality recommendation when dataQualityStatus is warning | `e067a37457d4` |

#### `hydronic.engine.full.test.ts`

File Hash: `5e215dd71a2d93f5`

| Test | Hash |
|------|------|
| normal deltaT & flow should be ok | `b99d28074f3f` |
| very low deltaT should be critical | `5876d699edb2` |
| missing measurements yield unknown flags | `3980d1b2f33d` |

#### `hydronic.module.test.ts`

File Hash: `aabcbd6750c867a3`

| Test | Hash |
|------|------|
| valid inputs yield ok result | `24d026e5cbbf` |
| severe low deltaT propagates to findings | `dde651889b11` |

#### `hydronic.recommendations.test.ts`

File Hash: `03916029e7711e22`

| Test | Hash |
|------|------|
| critical deltaT produces critical recommendation | `969946063628` |
| flow alert produces flow recommendation | `798b2757de02` |
| ok status produces preventive recommendation | `42a1f56db27a` |

### Other

#### `forbidden-in-dist.test.ts`

File Hash: `5878fb5c13d4c60e`

| Test | Hash |
|------|------|
| dist files must not contain legacy recommendation fields | `5878fb5c13d4` |

#### `localOverrides.test.ts`

File Hash: `7d9a063088735183`

| Test | Hash |
|------|------|
| save/load works | `b89f7d487759` |
| list entries shows saved | `5cb0001bb382` |
| remove entry works and returns false for missing | `a73874e3f08d` |

#### `recommendation-gap-scan.test.ts`

File Hash: `cc56eab65a382b72`

| Test | Hash |
|------|------|
| recommendation gap scan should produce a doc with expected structure and valid recommendations | `cc56eab65a38` |

#### `recommendation.safety.test.ts`

File Hash: `c4cccc538ca20aca`

| Test | Hash |
|------|------|
| generated recommendations do not contain time/price fields or procedural instructions (hydronic) | `e50c0c267a01` |
| hydronic source recs safe | `e2e0bf490fd6` |
| condenser approach recs safe | `b9528b9499a6` |
| refrigeration recs safe | `c75fcd8531fd` |
| compressor recip recs safe | `1b1a7a7db251` |
| compressor scroll recs safe | `e1b7e412e29f` |
| airside recs safe | `a92d6b97a779` |
| reversing valve recs safe | `79ddbe9496aa` |

### Refrigeration

#### `refrigeration.engine.full.test.ts`

File Hash: `8c42f31fd82f3494`

| Test | Hash |
|------|------|
| nominal fixture should return ok status | `cd34824c85d1` |
| undercharge fixture should indicate undercharged overallFinding | `e226b64efbb8` |
| overcharge fixture should indicate overcharged overallFinding | `3779143ccf11` |

#### `refrigeration.engine.test.ts`

File Hash: `c4704f408739e2fc`

| Test | Hash |
|------|------|
| runs diagnostics and returns a result structure | `c4704f408739` |

#### `refrigeration.ptoverride.test.ts`

File Hash: `239eb69fb5109291`

| Test | Hash |
|------|------|
| uses ptOverride when refrigerant is OTHER | `252ced1097a1` |
| ignores ptOverride for named refrigerants | `e12b6e173abf` |

#### `refrigeration.ptutils.test.ts`

File Hash: `00bdbee457cfd43d`

| Test | Hash |
|------|------|
| rejects empty or missing data | `19d5dfd665b8` |
| requires at least two points | `40d0ff3013b8` |
| flags descending pressures | `88d7682dab3e` |
| accepts a well-formed ascending PT chart | `b2d6a23aeec9` |

#### `refrigeration.recommendations.test.ts`

File Hash: `ab62b57ca75500fe`

| Test | Hash |
|------|------|
| generates undercharge-pattern recommendation for high superheat + low subcooling | `10476d79bacb` |
| generates elevated-loading pattern recommendation for alert superheat + high subcooling | `2d3143abb381` |
| generates flow/heat-transfer limited recommendation for combined flags | `cfba5d33a740` |
| generates compression ratio abnormal recommendation | `971093ac014c` |
| generates liquid slugging safety stop for critical superheat | `8e2e140f8621` |
| generates water transfer abnormal recommendation | `8801e4e8e629` |
| generates preventive trending for OK status | `6780f4184b28` |
| generates unknown refrigerant profile informational rec | `0e4f31e778b7` |
| does not generate preventive rec when status is not OK | `aa9ac1c73268` |
| can generate multiple recommendations for multiple flags | `d6da28357579` |

#### `refrigeration.validation.test.ts`

File Hash: `ae5adcd41a37652f`

| Test | Hash |
|------|------|
| flags missing critical field with severity error | `ae5adcd41a37` |

### Reversing Valve

#### `reversingvalve.engine.full.test.ts`

File Hash: `44df6fe4cbde9915`

| Test | Hash |
|------|------|
| nominal should be ok | `ebf3b2717658` |
| stuck should be critical with stuck pattern | `0aacd370ee91` |
| partial_leak should be alert (low compression ratio) | `2296e10530e1` |
| reversed pattern should show reversed and alert | `19db62701334` |

#### `reversingvalve.module.test.ts`

File Hash: `351891408db3bd10`

| Test | Hash |
|------|------|
| validate should require port temps and profile to have reversing valve | `8d6e1906d073` |
| getMeasurementHelp returns help for reversingValvePortTemps | `7d90a03fc71f` |
| diagnose delegates and summarizeForReport includes key fields | `7b21a3d5e314` |

#### `reversingvalve.recommendations.test.ts`

File Hash: `3e9631f9ad651e12`

| Test | Hash |
|------|------|
| provides a critical recommendation when pattern is stuck/critical | `4d01a3fce0b7` |
| returns a preventive low-priority rec when pattern ok | `c90aefd55b5d` |

### Validation

#### `validation.human-error.test.ts`

File Hash: `4345efafaa62105d`

| Test | Hash |
|------|------|
| validation rejects inverted pressures for refrigeration (discharge <= suction) | `0c132338f4ab` |
| reciprocating compressor validation catches inverted pressures | `a1dce0c91503` |
| engine flags extremely large current (likely extra-zero) as critical and produces a shutdown recommendation | `c1dd04438174` |

---

## Integrity Verification

To verify this matrix against current tests:

```bash
npx vitest run --reporter=json > test-output.json
npx tsx tools/generate-golden-matrix.ts --verify
```

If hashes differ, the test behavior has drifted and must be reviewed.

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-12-03 | Phase 3.5 Automation | Initial golden matrix generation |

