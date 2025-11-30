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
    loopType: (hydronicProfile as any).loopType ?? 'unknown',
    profileConfig: {
      // Map existing profile fields into HydronicSourceProfileConfig as needed
    },
  } as HydronicSourceContext;

  const inputMeasurements: HydronicSourceMeasurements = {
    enteringWaterTemp: (hydronicMeas as any).enteringWaterTemp ?? null,
    leavingWaterTemp: (hydronicMeas as any).leavingWaterTemp ?? null,
    loopFluidTemp: (hydronicMeas as any).loopFluidTemp ?? null,
    flowGpm: (hydronicMeas as any).flowGpm ?? null,
    ambientWetBulb: (hydronicMeas as any).ambientWetBulb ?? null,
    ambientDryBulb: (hydronicMeas as any).ambientDryBulb ?? null,
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
