0. Phase marker

Update your internal notes / docs:

Phase: 2.4 – New engines (HydronicSource + CondenserApproach)

Constraint: Still no UI / profile wiring / tech-view work. Only engines, flags, rec helpers, modules, and tests.

1. HydronicSourceEngine – Types + File Skeleton

Goal: Add a dedicated WSHP/GSHP hydronic-source engine with clean separation:

src/modules/hydronics/source/hydronicSource.types.ts

src/modules/hydronics/source/hydronicSource.engine.ts

src/modules/hydronics/source/hydronicSource.recommendations.ts

src/modules/hydronics/source/hydronicSource.module.ts

Tests under test/ mirroring the compressor / refrigeration patterns.

1.1. Create the types file

In src/modules/hydronics/source/hydronicSource.types.ts:

Define the measurement input type that the engine consumes, e.g.:

entering water temp

leaving water temp

water flow (if measured)

loopType (open_tower / closed_loop / pond_loop / etc.) – from profile, not engine

operatingMode (cooling / heating) – consistent with existing profile schema

Define profile slice type for the hydronic source:

rated water ΔT ranges (min/ideal/max) for cooling and heating if available

expected entering water temp ranges by loopType (if you want; you can start with just ΔT)

flags for whether you’re using manufacturer vs industry curves (follow the pattern used in airside/refrigeration).

Define status/flags enums:

waterDeltaTStatus: 'ok' | 'warning' | 'alert' | 'critical'

optional: loopTempStatus if you plan to flag out-of-range entering water temps

disclaimers: string[]

Define EngineResult type for this engine that respects the global schema:

export interface HydronicSourceEngineResult {
  status: DiagnosticStatus;               // existing shared type
  values: {
    enteringWaterTemp: number | null;
    leavingWaterTemp: number | null;
    waterDeltaT: number | null;
    expectedWaterDeltaT?: {
      min: number;
      ideal: number;
      max: number;
      source: 'manufacturer' | 'industry' | 'profile_override';
    };
    loopType?: string;
  };
  flags: {
    waterDeltaTStatus: 'ok' | 'warning' | 'alert' | 'critical';
    loopTempStatus?: 'ok' | 'warning' | 'alert' | 'critical';
    disclaimers: string[];
  };
  recommendations: Recommendation[];      // shared Recommendation type
}


No physics or thresholds here; just structure.

2. HydronicSourceEngine – Physics + Flags (engine file)

In src/modules/hydronics/source/hydronicSource.engine.ts:

Constraints:

No recommendations.

No human-language summaries.

Only numeric calculations and boolean/enum flags.

Must follow the same PT/default vs manufacturer pattern you used in refrigeration and airside for ΔT expectations.

2.1. Compute core values

Implement a pure function, e.g. runHydronicSourceEngine(input, profile): HydronicSourceEngineResult that:

Pulls entering/leaving water temps from measurements.

Computes waterDeltaT = entering - leaving (sign convention: match your existing refrigeration waterDeltaT implementation).

Resolves expectedWaterDeltaT:

Prefer manufacturer ranges from profile.waterSide.manufacturerExpectedDeltaT if provided.

Otherwise fall back to industry defaults from your internal constants (similar to airside expected ΔT handling).

Classifies waterDeltaTStatus by comparing waterDeltaT against the expected band.

Optionally sets loopTempStatus if you want to flag entering water temps far outside expected ranges for the loop type. Do not reference OEM; treat any constants as generic/industry.

Builds status based on the worst of waterDeltaTStatus and loopTempStatus, using your existing helper pattern for “status from flag set”.

2.2. Disclaimers

Add a single hydronic disclaimer string when you are using generic/industry bands similar to PT and airside:

Example content shape (tune language to your style):

“Manufacturer hydronic performance data not found in profile — using generic water ΔT guidelines. Verify with equipment/loop design documents.”

Attach it to flags.disclaimers and duplicate into the flattened disclaimers field if that’s your established pattern.

No references to specific OEMs, no procedure steps.

3. HydronicSourceEngine – Recommendation helper + tests
3.1. Recommendation helper

Create src/modules/hydronics/source/hydronicSource.recommendations.ts:

Export generateHydronicSourceRecommendations(result: HydronicSourceEngineResult, context: RecommendationContext): Recommendation[].

Logic must be flags-driven only:

If waterDeltaTStatus === 'critical':

Push a safety / high/critical priority recommendation that states the hydronic heat transfer is in a critical range and further diagnostics are required (non-procedural, no how-to).

If waterDeltaTStatus === 'alert':

Push a repair or diagnostic level recommendation describing abnormal hydronic ΔT.

If waterDeltaTStatus === 'warning':

Optional: a medium priority recommendation to monitor or schedule a more detailed hydronic check.

If loopTempStatus is non-OK:

Add a recommendation that loop entering water temperatures are outside expected design ranges and should be investigated.

Do not:

Recompute thresholds.

Look at raw temperatures directly as gates; use flags and values only as display.

Attach appropriate rationaleFlag strings referencing the flags you evaluate, e.g.:

rationaleFlag: 'waterDeltaTStatus'

rationaleFlag: 'loopTempStatus'

3.2. Recommendation tests

Add test/hydronicSource.recommendations.test.ts:

Cover at least:

waterDeltaTStatus = 'critical' ⇒ at least one critical recommendation with requiresShutdown set according to your safety policy (you may decide that critical hydronic performance does or does not require shutdown; just be consistent and non-procedural).

waterDeltaTStatus = 'alert' ⇒ at least one non-empty rec, lower severity than critical.

loopTempStatus = 'alert' or 'critical' ⇒ dedicated loop-temperature recommendation present.

All tests should:

Construct synthetic HydronicSourceEngineResult objects (no engine calls).

Assert IDs, severity, and requiresShutdown where you define them.

4. HydronicSourceEngine – Engine tests + gap scan wiring
4.1. Engine full test

Create test/hydronicSource.engine.full.test.ts:

Mirror the style of refrigeration.engine.full.test.ts and airside.engine.full.test.ts:

Nominal scenario → status = 'ok', waterDeltaTStatus = 'ok', no high-severity flags.

Low water ΔT scenario → waterDeltaTStatus = 'alert' or 'critical' depending on thresholds.

Excessively high water ΔT scenario → flagged accordingly.

4.2. Gap scanner integration

Add hydronic cases to your recommendation-gap test (where you enumerate scenarios and assert recCount > 0 whenever status/flags are abnormal):

Include at least one alert and one critical hydronic case.

Assert gaps: [] and recCount >= 1 for those cases.

This puts hydronics into the same integrity mesh as refrigeration, compressors, airside, and reversing valve.

5. CondenserApproachEngine – Types + Engine

Repeat the pattern for air-source condenser approach for ASHP/RTU/AC:

New files (paths consistent with your current organization):

src/modules/condenser/approach/condenserApproach.types.ts

src/modules/condenser/approach/condenserApproach.engine.ts

src/modules/condenser/approach/condenserApproach.recommendations.ts

src/modules/condenser/approach/condenserApproach.module.ts

Tests under test/ for engine + recommendations.

5.1. Types

In condenserApproach.types.ts define:

Measurements:

Ambient dry bulb (or entering air to condenser).

Liquid line temperature.

Possibly condensing saturation temperature if reused from refrigeration; if so, treat that as an input value, not recomputed here.

Values:

condenserApproach = liquidTemp - ambientTemp (or condensingSat - ambient, depending on your definition; choose one and keep it consistent).

Expected approach band (min/ideal/max) with a source field as in other engines.

Flags:

approachStatus: 'ok' | 'warning' | 'alert' | 'critical'

disclaimers: string[]

EngineResult complying with the global schema.

5.2. Engine

In condenserApproach.engine.ts:

Compute numeric approach.

Determine approachStatus from manufacturer or industry ranges.

Set status from flags.

Set disclaimers (industry vs manufacturer data).

No recommendations.

6. CondenserApproachEngine – Rec helper + tests
6.1. Recommendations

condenserApproach.recommendations.ts:

generateCondenserApproachRecommendations(result, context): Recommendation[].

Flags-driven:

approachStatus = 'critical' ⇒ at least one critical recommendation about condenser approach being outside safe operating range.

approachStatus = 'alert' ⇒ a repair/diagnostic level recommendation.

approachStatus = 'warning' ⇒ monitoring / maintenance-level rec (optional, but consistent with your existing style).

No thresholds; just flags.

6.2. Tests

test/condenserApproach.recommendations.test.ts:

Synthetic results for ok, warning, alert, critical.

Assert presence, severity, and IDs as appropriate.

7. Integrate into orchestrator + gap scan + combined tests

Once both engines and rec helpers exist:

Wire the new engines into your orchestrator / profile audit layer where domainResults are built:

New domain: 'hydronic_source' (or similar).

New domain: 'condenser_approach'.

Extend combined-profile stress tests:

Add scenarios that exercise hydronic and condenser-approach abnormal states along with existing domains.

Assert:

overallStatus behavior is consistent with added domains.

Each new domain’s abnormal flags produce non-empty recommendations.

Update the recommendation gap scanner scenarios:

Add at least one hydronic-critical and one condenser-approach-critical case.

Confirm gaps: [] after implementation.

8. Documentation and hygiene (for both new engines)

When hydronic + condenser engines are implemented and tests are passing:

CHANGELOG.md

Add entries under Phase 2.4 noting:

Addition of HydronicSourceEngine with flags-driven recommendations and gap-scan coverage.

Addition of CondenserApproachEngine with flags-driven recommendations and gap-scan coverage.

Engine Inventory doc

Add both engines, listing:

Inputs

Outputs (values + flags)

Recommendation triggers (flags only)

Disclaimer behavior

FILE_TREE.md

Add all new files in their correct paths.

Integrity / stress report

Run the full Vitest suite and regenerate your integrity report with current date/time including:

Test pass summary

New domain coverage

Updated gap-scan artifacts.
