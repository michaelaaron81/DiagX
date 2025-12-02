import { runHydronicSourceEngine } from './hydronic-source.engine';
function buildHydronicSourceEngineInput(profile, measurements) {
    const hydronicProfile = profile.waterSide ?? {};
    const hydronicMeas = measurements.waterSide ?? {};
    const context = {
        profileId: profile.id,
        tons: profile.nominalTons ?? null,
        loopType: hydronicProfile.loopType === 'open_tower' || hydronicProfile.loopType === 'closed_tower'
            ? 'open_tower'
            : hydronicProfile.loopType === 'closed_loop' || hydronicProfile.loopType === 'ground_loop' || hydronicProfile.loopType === 'boiler'
                ? 'closed_loop'
                : 'unknown',
        profileConfig: {
            // Map existing profile fields into HydronicSourceProfileConfig as needed
            designFlowGPM: hydronicProfile.flowRate ?? undefined,
            designDeltaT: hydronicProfile.expectedDeltaT ?? undefined,
        },
    };
    const inputMeasurements = {
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
export function runHydronicSourceModule(profile, measurements) {
    const engineInput = buildHydronicSourceEngineInput(profile, measurements);
    const result = runHydronicSourceEngine(engineInput);
    return result;
}
