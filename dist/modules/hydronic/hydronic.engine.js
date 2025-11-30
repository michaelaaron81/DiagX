import { generateHydronicRecommendations } from './hydronic.recommendations';
import { round } from '../../shared/wshp.types';
export const HYDRONIC_INDUSTRY_EXPECTED = { min: 10, ideal: 12, max: 14, source: 'industry' };
export function getExpectedHydronicDeltaT(profile) {
    if (profile && profile.expectedDeltaT)
        return profile.expectedDeltaT;
    return HYDRONIC_INDUSTRY_EXPECTED;
}
export function validateHydronicMeasurements(measurements) {
    const errors = [];
    const warnings = [];
    if (!measurements)
        return { valid: false, ok: false, errors: ['No measurements provided'] };
    // allow nulls; treat as unknown but not strictly invalid
    if (measurements.enteringWaterTemp === null || measurements.leavingWaterTemp === null)
        warnings.push('Water temperature measurements incomplete - delta-T may be unknown');
    if (measurements.flowRateGPM === null)
        warnings.push('Flow rate measurement missing - flow status will be unknown');
    return { valid: errors.length === 0, ok: errors.length === 0, errors: errors.length ? errors : undefined, warnings };
}
function analyzeDeltaT(deltaT, expected) {
    if (deltaT === null)
        return { status: 'unknown' };
    // extreme cases
    if (deltaT <= 1)
        return { status: 'critical' };
    // very low, likely flow or exchange issue
    if (deltaT < expected.min)
        return { status: 'alert' };
    if (deltaT > expected.max * 1.5)
        return { status: 'critical' };
    if (deltaT > expected.max)
        return { status: 'alert' };
    if (deltaT < expected.min * 0.9)
        return { status: 'warning' };
    return { status: 'ok' };
}
function analyzeFlow(flow, designFlow) {
    if (flow === null || designFlow == null)
        return { status: 'unknown' };
    const ratio = flow / designFlow;
    if (ratio < 0.5)
        return { status: 'critical' };
    if (ratio < 0.8)
        return { status: 'alert' };
    if (ratio < 0.95 || ratio > 1.05)
        return { status: 'warning' };
    return { status: 'ok' };
}
function getWorstStatus(statuses) {
    if (statuses.includes('critical'))
        return 'critical';
    if (statuses.includes('alert'))
        return 'alert';
    if (statuses.includes('warning'))
        return 'warning';
    return 'ok';
}
export function runHydronicEngine(measurements, context) {
    const profile = context.profile || {};
    const disclaimers = [];
    const expected = getExpectedHydronicDeltaT(profile);
    if (expected.source === 'industry') {
        disclaimers.push('Hydronic expected ΔT values are industry defaults; provide profile.expectedDeltaT to tune performance checks.');
    }
    const waterDeltaT = (measurements.leavingWaterTemp !== null && measurements.enteringWaterTemp !== null)
        ? round((measurements.leavingWaterTemp ?? 0) - (measurements.enteringWaterTemp ?? 0), 1)
        : null;
    const flowRateGPM = measurements.flowRateGPM ?? null;
    const deltaTAnalysis = analyzeDeltaT(waterDeltaT, expected);
    const flowAnalysis = analyzeFlow(flowRateGPM, profile.designFlowGPM ?? null);
    const statuses = [deltaTAnalysis.status, flowAnalysis.status];
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
    const result = {
        status: overall,
        values,
        flags,
        recommendations: [],
    };
    // attach recommendations from helper so engine-level runs include recs for audits/gap-scans
    try {
        result.recommendations = generateHydronicRecommendations(result, { profile });
    }
    catch (e) {
        // ignore
    }
    return result;
}
