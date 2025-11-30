import { describe, it, expect } from 'vitest';
import { generateScrollRecommendations } from '../src/modules/compressor/scroll.engine';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';

describe('scroll compressor recommendations', () => {
  it('produces a recommendation when compression ratio is critical', () => {
    const compAnalysis = { status: 'critical', message: 'CRITICAL' } as any;
    const currentAnalysis = { status: 'ok', message: '' } as any;
    const recs = generateScrollRecommendations(compAnalysis, currentAnalysis, { suctionPressure: 10, dischargePressure: 4 } as any);
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.severity === 'critical')).toBeTruthy();
  });

  it('returns a low priority rec when all ok', () => {
    const compAnalysis = { status: 'ok', message: 'OK' } as any;
    const currentAnalysis = { status: 'ok', message: 'OK' } as any;
    const recs = generateScrollRecommendations(compAnalysis, currentAnalysis, { suctionPressure: 100, dischargePressure: 300 } as any);
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.severity === 'info')).toBeTruthy();
  });
});
