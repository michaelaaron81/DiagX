import { describe, it, expect } from 'vitest';
import { generateCondenserApproachRecommendations } from '../src/modules/condenserApproach/condenserApproach.recommendations';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';

describe('condenser approach recommendations', () => {
  it('approach critical yields critical recommendation', () => {
    const res: any = { flags: { approachStatus: 'critical', subcoolingStatus: 'ok' }, values: { condenserApproach: -5 }, status: 'critical' };
    const recs = generateCondenserApproachRecommendations(res);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'condenser_approach_critical')).toBeTruthy();
  });

  it('ok status yields preventive rec', () => {
    const res: any = { flags: { approachStatus: 'ok', subcoolingStatus: 'ok' }, values: { condenserApproach: 12, liquidSubcooling: 10 }, status: 'ok' };
    const recs = generateCondenserApproachRecommendations(res);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'condenser_preventive_trend')).toBeTruthy();
  });
});