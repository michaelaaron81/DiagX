import { describe, it, expect } from 'vitest';
import { generateRecommendations } from '../src/modules/reversingValve/reversing.engine';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';

describe('reversing valve recommendations', () => {
  it('provides a critical recommendation when pattern is stuck/critical', () => {
    const patternAnalysis: any = { pattern: 'stuck', status: 'critical', overallFinding: 'CRITICAL', likelyIssue: 'stuck' };
    const recs = generateRecommendations(patternAnalysis, 'ok', { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 100, suctionReturn: 90, indoorCoilLine: 95, outdoorCoilLine: 92 } } as any, {} as any);
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.severity === 'critical')).toBeTruthy();
  });

  it('returns a preventive low-priority rec when pattern ok', () => {
    const patternAnalysis: any = { pattern: 'correct', status: 'ok' };
    const recs = generateRecommendations(patternAnalysis, 'ok', { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 200, suctionReturn: 100, indoorCoilLine: 120, outdoorCoilLine: 120 } } as any, {} as any);
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.severity === 'info')).toBeTruthy();
  });
});
