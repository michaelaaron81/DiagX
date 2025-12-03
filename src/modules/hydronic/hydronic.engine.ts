import { HydronicMeasurements, HydronicProfileConfig, HydronicEngineResult } from './hydronic.types';
import { generateHydronicRecommendations } from './hydronic.recommendations';
import { DiagnosticStatus, ValidationResult, round } from '../../shared/wshp.types';

// Phase 3.4: Physics Kernel imports
import {
  computeWaterDeltaT,
  computeNormalizedFlowIndex,
  getWorstStatus,
} from '../../physics/hvac';

export const HYDRONIC_INDUSTRY_EXPECTED: { min: number; ideal: number; max: number; source: 'industry' } = { min: 10, ideal: 12, max: 14, source: 'industry' };

export function getExpectedHydronicDeltaT(profile: HydronicProfileConfig) {
  if (profile && profile.expectedDeltaT) return profile.expectedDeltaT;
  return HYDRONIC_INDUSTRY_EXPECTED;
}

export function validateHydronicMeasurements(measurements: HydronicMeasurements): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!measurements) return { valid: false, ok: false, errors: ['No measurements provided'] };
  // allow nulls; treat as unknown but not strictly invalid
  if (measurements.enteringWaterTemp === null || measurements.leavingWaterTemp === null) warnings.push('Water temperature measurements incomplete - delta-T may be unknown');
  if (measurements.flowRateGPM === null) warnings.push('Flow rate measurement missing - flow status will be unknown');
  return { valid: errors.length === 0, ok: errors.length === 0, errors: errors.length ? errors : undefined, warnings };
}

function analyzeDeltaT(deltaT: number | null, expected: { min: number; ideal: number; max: number; source?: string }): { status: DiagnosticStatus } {
  if (deltaT === null) return { status: 'unknown' as DiagnosticStatus };

  // extreme cases
  if (deltaT <= 1) return { status: 'critical' as DiagnosticStatus };
  // very low, likely flow or exchange issue
  if (deltaT < expected.min) return { status: 'alert' as DiagnosticStatus };
  if (deltaT > expected.max * 1.5) return { status: 'critical' as DiagnosticStatus };
  if (deltaT > expected.max) return { status: 'alert' as DiagnosticStatus };
  if (deltaT < expected.min * 0.9) return { status: 'warning' as DiagnosticStatus };
  return { status: 'ok' as DiagnosticStatus };
}

function analyzeFlow(flow: number | null, designFlow: number | null): { status: DiagnosticStatus } {
  if (flow === null || designFlow == null) return { status: 'unknown' as DiagnosticStatus };
  // Phase 3.4: Use kernel for flow ratio calculation
  const ratio = computeNormalizedFlowIndex(flow, designFlow);
  if (ratio < 0.5) return { status: 'critical' as DiagnosticStatus };
  if (ratio < 0.8) return { status: 'alert' as DiagnosticStatus };
  if (ratio < 0.95 || ratio > 1.05) return { status: 'warning' as DiagnosticStatus };
  return { status: 'ok' as DiagnosticStatus };
}

// Phase 3.4: getWorstStatus now imported from kernel

export function runHydronicEngine(measurements: HydronicMeasurements, context: { profile: HydronicProfileConfig }): HydronicEngineResult {
  const profile = context.profile || {};
  const disclaimers: string[] = [];

  const expected = getExpectedHydronicDeltaT(profile);
  if (expected.source === 'industry') {
    disclaimers.push('Hydronic expected ΔT values are industry defaults; provide profile.expectedDeltaT to tune performance checks.');
  }

  // Phase 3.4: Use kernel for water deltaT calculation
  const waterDeltaT = (measurements.leavingWaterTemp !== null && measurements.enteringWaterTemp !== null)
    ? round(computeWaterDeltaT(measurements.leavingWaterTemp ?? 0, measurements.enteringWaterTemp ?? 0), 1)
    : null;

  const flowRateGPM = measurements.flowRateGPM ?? null;

  const deltaTAnalysis = analyzeDeltaT(waterDeltaT, expected);
  const flowAnalysis = analyzeFlow(flowRateGPM, profile.designFlowGPM ?? null);

  const statuses: DiagnosticStatus[] = [deltaTAnalysis.status, flowAnalysis.status];
  const overall = getWorstStatus(statuses);

  const values = {
    waterDeltaT,
    flowRateGPM,
    expectedDeltaT: expected,
  };

  const flags = {
    deltaTStatus: deltaTAnalysis.status,
    flowStatus: flowAnalysis.status,
    disclaimers,
  };

  const result: HydronicEngineResult = {
    status: overall,
    values,
    flags,
    recommendations: [],
  };

  // attach recommendations from helper so engine-level runs include recs for audits/gap-scans
  try {
    result.recommendations = generateHydronicRecommendations(result, { profile });
  } catch (e) {
    // ignore
  }

  return result;
}
