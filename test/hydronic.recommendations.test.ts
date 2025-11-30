import { describe, it, expect } from 'vitest';
import { generateHydronicRecommendations } from '../src/modules/hydronic/hydronic.recommendations';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';

describe('hydronic recommendations', () => {
  it('critical deltaT produces critical recommendation', () => {
    const result: any = { flags: { deltaTStatus: 'critical', flowStatus: 'ok' }, values: { waterDeltaT: 0 }, status: 'critical' };
    const recs = generateHydronicRecommendations(result, { profile: {} as any });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'hydronic_deltaT_critical')).toBeTruthy();
  });

  it('flow alert produces flow recommendation', () => {
    const result: any = { flags: { deltaTStatus: 'ok', flowStatus: 'alert' }, values: { flowRateGPM: 10 }, status: 'alert' };
    const recs = generateHydronicRecommendations(result as any);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'hydronic_flow_issue')).toBeTruthy();
  });

  it('ok status produces preventive recommendation', () => {
    const result: any = { flags: { deltaTStatus: 'ok', flowStatus: 'ok' }, values: { waterDeltaT: 12, flowRateGPM: 50 }, status: 'ok' };
    const recs = generateHydronicRecommendations(result as any);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'hydronic_preventive_trend')).toBeTruthy();
  });
});