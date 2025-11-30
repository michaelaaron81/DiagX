import { describe, it, expect } from 'vitest';
import { generateCondenserApproachRecommendations } from '../src/modules/condenserApproach/condenserApproach.recommendations';
import { CondenserApproachEngineResult } from '../src/modules/condenserApproach/condenserApproach.types';

function buildBaseResult(overrides?: Partial<CondenserApproachEngineResult>): CondenserApproachEngineResult {
  const base: CondenserApproachEngineResult = {
    status: 'ok',
    values: {
      liquidLineTemp: 110,
      condensingSatTemp: 100,
      ambientTemp: 85,
      condenserApproach: 25,
      lift: 15,
    },
    flags: {
      approachStatus: 'ok',
      subcoolingStatus: 'ok',
      dataQualityStatus: 'ok',
      disclaimers: [],
    },
    recommendations: [],
  };

  return { ...base, ...(overrides ?? {}) } as CondenserApproachEngineResult;
}

// no context required for recommendation generation; keep tests focused on result flags

describe('CondenserApproach recommendations - flag-driven behavior', () => {
  it('emits critical approach recommendation when approachStatus is critical', () => {
    const base = buildBaseResult({ flags: { ...buildBaseResult().flags, approachStatus: 'critical' } });

    const recs = generateCondenserApproachRecommendations(base);
    expect(recs.some(r => r.id === 'condenser_approach_critical')).toBe(true);
  });

  it('emits subcooling alert when subcoolingStatus is alert', () => {
    const base = buildBaseResult({ flags: { ...buildBaseResult().flags, subcoolingStatus: 'alert' }, values: { ...buildBaseResult().values, liquidSubcooling: 2 } });
    const recs = generateCondenserApproachRecommendations(base);
    expect(recs.some(r => r.id === 'condenser_subcooling_issue')).toBe(true);
  });

  it('emits preventive rec when all OK', () => {
    const base = buildBaseResult();
    const recs = generateCondenserApproachRecommendations(base);
    expect(recs.some(r => r.id === 'condenser_preventive_trend')).toBe(true);
  });
});
