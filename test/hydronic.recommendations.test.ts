import { describe, it, expect } from 'vitest';
import { generateHydronicRecommendations } from '../src/modules/hydronic/hydronic.recommendations';
import type { HydronicEngineResult, HydronicProfileConfig } from '../src/modules/hydronic/hydronic.types';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';

describe('hydronic recommendations', () => {
  it('critical deltaT produces critical recommendation', () => {
    const result: HydronicEngineResult = { flags: { deltaTStatus: 'critical', flowStatus: 'ok', disclaimers: [] }, values: { waterDeltaT: 0, flowRateGPM: null, expectedDeltaT: null }, status: 'critical', recommendations: [] };
    const recs = generateHydronicRecommendations(result, { profile: {} as unknown as HydronicProfileConfig });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'hydronic_deltaT_critical')).toBeTruthy();
  });

  it('flow alert produces flow recommendation', () => {
    const result: HydronicEngineResult = { flags: { deltaTStatus: 'ok', flowStatus: 'alert', disclaimers: [] }, values: { waterDeltaT: null, flowRateGPM: 10, expectedDeltaT: null }, status: 'alert', recommendations: [] };
    const recs = generateHydronicRecommendations(result);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'hydronic_flow_issue')).toBeTruthy();
  });

  it('ok status produces preventive recommendation', () => {
    const result: HydronicEngineResult = { flags: { deltaTStatus: 'ok', flowStatus: 'ok', disclaimers: [] }, values: { waterDeltaT: 12, flowRateGPM: 50, expectedDeltaT: null }, status: 'ok', recommendations: [] };
    const recs = generateHydronicRecommendations(result);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'hydronic_preventive_trend')).toBeTruthy();
  });
});