import { describe, it, expect } from 'vitest';
import { generateHydronicSourceRecommendations } from '../src/modules/hydronic/hydronic-source.recommendations';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';
import { HydronicSourceEngineResult } from '../src/modules/hydronic/hydronic-source.types';

function buildBaseResult(
  overrides?: Partial<HydronicSourceEngineResult>,
): HydronicSourceEngineResult {
  const base: HydronicSourceEngineResult = {
    status: 'ok',
    values: {
      enteringWaterTemp: 85,
      leavingWaterTemp: 95,
      deltaT: 10,
      approachToAmbient: 10,
      normalizedFlowIndex: 1,
    },
    flags: {
      enteringWaterTempStatus: 'ok',
      leavingWaterTempStatus: 'ok',
      deltaTStatus: 'ok',
      approachStatus: 'ok',
      flowStatus: 'ok',
      dataQualityStatus: 'ok',
      disclaimers: [],
    },
    recommendations: [],
  };

  return { ...base, ...(overrides ?? {}) } as HydronicSourceEngineResult;
}

const context = { profileId: 'test', tons: 10 } as any;

describe('HydronicSource recommendations - flag-driven behavior', () => {
  it('emits critical deltaT recommendation when deltaTStatus is critical', () => {
    const base = buildBaseResult({
      status: 'critical',
      flags: { ...buildBaseResult().flags, deltaTStatus: 'critical' },
    });

    const recs = generateHydronicSourceRecommendations(base, context);
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'hydronic_source_delta_t_critical')).toBe(true);
  });

  it('emits preventive recommendation when all primary flags are ok', () => {
    const base = buildBaseResult({ status: 'ok' });

    const recs = generateHydronicSourceRecommendations(base, context);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'hydronic_source_preventive_check')).toBe(true);
  });

  it('emits data quality recommendation when dataQualityStatus is warning', () => {
    const base = buildBaseResult({ flags: { ...buildBaseResult().flags, dataQualityStatus: 'warning' } });

    const recs = generateHydronicSourceRecommendations(base, context);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'hydronic_source_data_quality_warning')).toBe(true);
  });
});
