import {
  HydronicSourceEngineInput,
  HydronicSourceEngineResult,
  HydronicSourceMeasurements,
  HydronicSourceContext,
} from './hydronic-source.types';
import { runHydronicSourceEngine } from './hydronic-source.engine';

import { CombinedProfile } from '../../profiles/types';
import { CombinedMeasurements } from '../../measurements/types';

function buildHydronicSourceEngineInput(
  profile: CombinedProfile,
  measurements: CombinedMeasurements,
): HydronicSourceEngineInput {
  const hydronicProfile = profile.waterSide ?? {};
  const hydronicMeas = measurements.waterSide ?? {};

  const context: HydronicSourceContext = {
    profileId: profile.id,
    tons: profile.nominalTons ?? null,
    loopType:
      hydronicProfile.loopType === 'open_tower' || hydronicProfile.loopType === 'closed_tower'
        ? 'open_tower'
        : hydronicProfile.loopType === 'closed_loop' || hydronicProfile.loopType === 'ground_loop' || hydronicProfile.loopType === 'boiler'
        ? 'closed_loop'
        : 'unknown',
    profileConfig: {
      // Map existing profile fields into HydronicSourceProfileConfig as needed
      designFlowGPM: hydronicProfile.flowRate ?? undefined,
      designDeltaT: hydronicProfile.expectedDeltaT ?? undefined,
    },
  } as HydronicSourceContext;

  const inputMeasurements: HydronicSourceMeasurements = {
    enteringWaterTemp: hydronicMeas.enteringWaterTemp ?? null,
    leavingWaterTemp: hydronicMeas.leavingWaterTemp ?? null,
    loopFluidTemp: hydronicMeas.loopFluidTemp ?? hydronicMeas.enteringLoopTemp ?? hydronicMeas.leavingLoopTemp ?? null,
    flowGpm: hydronicMeas.flowGpm ?? null,
    ambientWetBulb: hydronicMeas.ambientWetBulb ?? null,
    ambientDryBulb: hydronicMeas.ambientDryBulb ?? null,
  };

  return {
    measurements: inputMeasurements,
    context,
  };
}

export function runHydronicSourceModule(
  profile: CombinedProfile,
  measurements: CombinedMeasurements,
): HydronicSourceEngineResult {
  const engineInput = buildHydronicSourceEngineInput(profile, measurements);
  const result = runHydronicSourceEngine(engineInput);

  return result;
}
