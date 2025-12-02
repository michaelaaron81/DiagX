import { DiagnosticStatus, round } from '../../shared/wshp.types';
import {
  HydronicSourceEngineInput,
  HydronicSourceEngineResult,
  HydronicSourceValues,
  HydronicSourceFlags,
} from './hydronic-source.types';
import { generateHydronicSourceRecommendations } from './hydronic-source.recommendations';

function computeDeltaT(
  enteringWaterTemp: number | null,
  leavingWaterTemp: number | null,
): number | null {
  if (enteringWaterTemp == null || leavingWaterTemp == null) return null;
  return leavingWaterTemp - enteringWaterTemp;
}

function computeApproachToAmbient(
  leavingWaterTemp: number | null,
  ambientWetBulb: number | null,
  ambientDryBulb: number | null,
  loopType: HydronicSourceEngineInput['context']['loopType'],
): number | null {
  if (leavingWaterTemp == null) return null;

  if (loopType === 'open_tower' && ambientWetBulb != null) {
    return leavingWaterTemp - ambientWetBulb;
  }
  if (loopType === 'dry_cooler' && ambientDryBulb != null) {
    return leavingWaterTemp - ambientDryBulb;
  }

  return null;
}

import { getExpectedHydronicDeltaT } from './hydronic.engine';
import type { HydronicProfileConfig } from './hydronic.types';

function analyzeDeltaTForSource(deltaT: number | null, expected: { min: number; ideal: number; max: number; source?: string } | null) {
  if (deltaT === null) return 'unknown' as const;
  if (deltaT <= 1) return 'critical' as const;
  if (!expected) return 'unknown' as const;
  if (deltaT < expected.min) return 'alert' as const;
  if (deltaT > expected.max * 1.5) return 'critical' as const;
  if (deltaT > expected.max) return 'alert' as const;
  if (deltaT < expected.min * 0.9) return 'warning' as const;
  return 'ok' as const;
}

function analyzeFlowForSource(flow: number | null, designFlow: number | null) {
  if (flow === null || designFlow == null) return 'unknown' as const;
  const ratio = flow / designFlow;
  if (ratio < 0.5) return 'critical' as const;
  if (ratio < 0.8) return 'alert' as const;
  if (ratio < 0.95 || ratio > 1.05) return 'warning' as const;
  return 'ok' as const;
}

function evaluateFlags(values: HydronicSourceValues, input: HydronicSourceEngineInput): HydronicSourceFlags {
  const { profileConfig } = input.context;

  const enteringStatus = (() => {
    if (values.enteringWaterTemp == null) return 'unknown';
    return 'ok';
  })();

  const leavingStatus = (() => {
    if (values.leavingWaterTemp == null) return 'unknown';
    return 'ok';
  })();

  const approachStatus = (() => {
    if (values.approachToAmbient == null) return 'unknown';
    return 'ok';
  })();

  // derive design flow GPM if available, prefer explicit designFlowGPM in profileConfig
  const expectedProfile: HydronicProfileConfig = {
    expectedDeltaT: profileConfig?.designDeltaT
      ? {
          min: profileConfig.designDeltaT.min,
          ideal: profileConfig.designDeltaT.ideal,
          max: profileConfig.designDeltaT.max,
          source: 'profile',
        }
      : undefined,
    designFlowGPM: profileConfig?.designFlowGPM ?? undefined,
  };
  const expected = getExpectedHydronicDeltaT(expectedProfile);
  const designFlowFromProfile = profileConfig?.designFlowGPM ?? null;
  const designFlowEstimated = (input.context.tons && expected && expected.ideal)
    ? Math.round((input.context.tons * 12000) / (expected.ideal * 500))
    : null;
  const designFlowGPM = designFlowFromProfile ?? designFlowEstimated ?? null;

  const deltaTStatus = analyzeDeltaTForSource(values.deltaT ?? null, expected);

  // values.normalizedFlowIndex is a ratio (measured / design). Analyze that ratio.
  const flowStatus = analyzeFlowForSource(values.normalizedFlowIndex ?? null, designFlowGPM);

  const dataQualityStatus = (() => {
    const nullCount =
      (values.enteringWaterTemp == null ? 1 : 0) +
      (values.leavingWaterTemp == null ? 1 : 0);
    if (nullCount >= 2) return 'warning';
    return 'ok';
  })();

  const disclaimers: string[] = [];

  return {
    enteringWaterTempStatus: enteringStatus,
    leavingWaterTempStatus: leavingStatus,
    deltaTStatus,
    approachStatus,
    flowStatus,
    dataQualityStatus,
    disclaimers,
  } as HydronicSourceFlags;
}

function summarizeStatus(flags: HydronicSourceFlags): DiagnosticStatus {
  if (
    flags.deltaTStatus === 'critical' ||
    flags.approachStatus === 'critical' ||
    flags.flowStatus === 'critical'
  ) {
    return 'critical';
  }
  if (
    flags.deltaTStatus === 'alert' ||
    flags.approachStatus === 'alert' ||
    flags.flowStatus === 'alert'
  ) {
    return 'alert';
  }
  if (
    flags.deltaTStatus === 'warning' ||
    flags.approachStatus === 'warning' ||
    flags.flowStatus === 'warning'
  ) {
    return 'warning';
  }
  return 'ok';
}

export function runHydronicSourceEngine(
  input: HydronicSourceEngineInput,
): HydronicSourceEngineResult {
  const {
    measurements: {
      enteringWaterTemp,
      leavingWaterTemp,
      flowGpm,
      ambientWetBulb,
      ambientDryBulb,
    },
    context: { loopType },
  } = input;

  const deltaT = computeDeltaT(enteringWaterTemp, leavingWaterTemp);
  const approachToAmbient = computeApproachToAmbient(
    leavingWaterTemp,
    ambientWetBulb ?? null,
    ambientDryBulb ?? null,
    loopType ?? 'unknown',
  );

  // derive design flow for normalized index
  // Map profileConfig.designDeltaT (which may include manufacturer/nameplate source) into HydronicProfileConfig shape
  const expectedProfileFromContext: HydronicProfileConfig = {
    expectedDeltaT: input.context.profileConfig?.designDeltaT
      ? {
          min: input.context.profileConfig.designDeltaT.min,
          ideal: input.context.profileConfig.designDeltaT.ideal,
          max: input.context.profileConfig.designDeltaT.max,
          source: 'profile',
        }
      : undefined,
    designFlowGPM: input.context.profileConfig?.designFlowGPM ?? undefined,
  };
  const expected = getExpectedHydronicDeltaT(expectedProfileFromContext);
  const designFlowEstimated = (input.context.tons && expected && expected.ideal)
    ? Math.round((input.context.tons * 12000) / (expected.ideal * 500))
    : null;
  const designFlowGPM = input.context.profileConfig?.designFlowGPM ?? designFlowEstimated ?? null;

  const values: HydronicSourceValues = {
    enteringWaterTemp: enteringWaterTemp ?? null,
    leavingWaterTemp: leavingWaterTemp ?? null,
    deltaT,
    approachToAmbient,
    normalizedFlowIndex: flowGpm != null && designFlowGPM != null ? round((flowGpm as number) / designFlowGPM, 2) : null,
  };

  const flags = evaluateFlags(values, input);
  const status = summarizeStatus(flags);

  const baseResult: HydronicSourceEngineResult = {
    status,
    values,
    flags,
    recommendations: [],
  };

  const recommendations = generateHydronicSourceRecommendations(baseResult, input.context);

  return {
    ...baseResult,
    recommendations,
  };
}
