import { runHydronicSourceEngine } from './hydronic-source.engine';
function buildHydronicSourceEngineInput(profile, measurements) {
    const hydronicProfile = profile.waterSide ?? {};
    const hydronicMeas = measurements.waterSide ?? {};
    const context = {
        profileId: profile.id,
        tons: profile.nominalTons ?? null,
        loopType: hydronicProfile.loopType ?? 'unknown',
        profileConfig: {
        // Map existing profile fields into HydronicSourceProfileConfig as needed
        },
    };
    const inputMeasurements = {
        enteringWaterTemp: hydronicMeas.enteringWaterTemp ?? null,
        leavingWaterTemp: hydronicMeas.leavingWaterTemp ?? null,
        loopFluidTemp: hydronicMeas.loopFluidTemp ?? null,
        flowGpm: hydronicMeas.flowGpm ?? null,
        ambientWetBulb: hydronicMeas.ambientWetBulb ?? null,
        ambientDryBulb: hydronicMeas.ambientDryBulb ?? null,
    };
    return {
        measurements: inputMeasurements,
        context,
    };
}
export function runHydronicSourceModule(profile, measurements) {
    const engineInput = buildHydronicSourceEngineInput(profile, measurements);
    const result = runHydronicSourceEngine(engineInput);
    return result;
}
