import { describe, it, expect } from 'vitest';
import { generateScrollRecommendations } from '../src/modules/compressor/scroll.engine';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';

describe('scroll compressor recommendations', () => {
  it('produces a recommendation when compression ratio is critical', () => {
    const compAnalysis = { status: 'critical' } as const;
    const currentAnalysis = { status: 'ok' } as const;
    const recs = generateScrollRecommendations(compAnalysis, currentAnalysis, { mode: 'cooling', suctionPressure: 10, dischargePressure: 4, suctionTemp: 50 } as const);
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.severity === 'critical')).toBeTruthy();
  });

  it('returns a low priority rec when all ok', () => {
    const compAnalysis = { status: 'ok' } as const;
    const currentAnalysis = { status: 'ok' } as const;
    const recs = generateScrollRecommendations(compAnalysis, currentAnalysis, { mode: 'cooling', suctionPressure: 100, dischargePressure: 300, suctionTemp: 60 } as const);
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.severity === 'info')).toBeTruthy();
  });
});
