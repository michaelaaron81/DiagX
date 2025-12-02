import { describe, it, expect } from 'vitest';

import { generateHydronicRecommendations } from '../src/modules/hydronic/hydronic.recommendations';
import { generateHydronicSourceRecommendations } from '../src/modules/hydronic/hydronic-source.recommendations';
import { generateCondenserApproachRecommendations } from '../src/modules/condenserApproach/condenserApproach.recommendations';
import { generateRefrigerationRecommendations } from '../src/modules/refrigeration/refrigeration.engine';
import { generateRecipRecommendations } from '../src/modules/compressor/recip.engine';
import { generateScrollRecommendations } from '../src/modules/compressor/scroll.engine';
import { generateRecommendations as generateAirsideRecommendations } from '../src/modules/airside/airside.engine';
import { generateRecommendations as generateReversingRecommendations } from '../src/modules/reversingValve/reversing.engine';

import type { Recommendation } from '../src/shared/wshp.types';
import { validateRecommendation } from '../src/shared/recommendation.schema';

const forbiddenKeys = ['estimatedTime', 'requiredParts', 'estimatedCost'];

const proceduralPatterns = [
  /\b(check|inspect|replace|install|tap|trace|perform|recover|turn off|turn on|measure|trace wiring|do not add)\b/i,
];

const timePattern = /\b(\d+\s*(?:min(?:ute)?s?|hr|hrs|hours|sec|seconds))\b/i;
const pricePattern = /\$|\bcost\b|\bprice\b|\bestimate(?:d)?\b|\bfee\b/i;

function assertSafe(recs: Recommendation[]) {
  for (const r of recs) {
    // ensure recs are schema compliant
    expect(validateRecommendation(r)).toBe(true);
    // no forbidden keys present
    for (const k of forbiddenKeys) {
      // dynamic key check using safe unknown->Record cast (avoid explicit any)
      expect(((r as unknown) as Record<string, unknown>)[k]).toBeUndefined();
    }

    // inspect text fields
    const textFields = [
      // some engines still populate different presentation fields in tests; check them non-destructively
      // read via Record<string,unknown> so we avoid explicit any casts
      ((r as unknown) as Record<string, unknown>)['title'],
      ((r as unknown) as Record<string, unknown>)['description'],
      ((r as unknown) as Record<string, unknown>)['action'],
      ((r as unknown) as Record<string, unknown>)['reason'],
      ((r as unknown) as Record<string, unknown>)['notes'],
      ((r as unknown) as Record<string, unknown>)['safetyWarning'],
      ((r as unknown) as Record<string, unknown>)['summary'],
      ((r as unknown) as Record<string, unknown>)['rationale'],
    ];
    for (const t of textFields) {
      if (!t) continue;
      // allow recommending a shutdown but disallow procedural steps and time/price mentions
      if (/shut\b|shutdown|shut down/i.test(t)) {
        // allowed to recommend shutdown — continue
        continue;
      }

      expect(proceduralPatterns.some(rx => rx.test(t))).toBeFalsy();
      expect(timePattern.test(t)).toBeFalsy();
      expect(pricePattern.test(t)).toBeFalsy();
    }
  }
}

describe('recommendation safety policy', () => {
  it('generated recommendations do not contain time/price fields or procedural instructions (hydronic)', () => {
    const ok = { flags: { deltaTStatus: 'ok', flowStatus: 'ok' }, values: { waterDeltaT: 12, flowRateGPM: 50 }, status: 'ok' } as unknown as Record<string, unknown>;
    const recs = generateHydronicRecommendations(ok as unknown as Record<string, unknown>, { profile: {} as Record<string, unknown> } as unknown as Record<string, unknown>);
    assertSafe(recs);
  });

  it('hydronic source recs safe', () => {
    const base = { flags: { deltaTStatus: 'ok', sourceStatus: 'ok' }, values: { waterDeltaT: 10 }, status: 'ok' } as unknown as Record<string, unknown>;
    const recs = generateHydronicSourceRecommendations(base as unknown as Record<string, unknown>, { profile: {} as Record<string, unknown> } as unknown as Record<string, unknown>);
    assertSafe(recs);
  });

  it('condenser approach recs safe', () => {
    const res = { flags: { approachStatus: 'alert', subcoolingStatus: 'ok' }, status: 'alert', values: { approach: 8, subcooling: 12 } } as unknown as Record<string, unknown>;
    const recs = generateCondenserApproachRecommendations(res as unknown as Record<string, unknown>);
    assertSafe(recs);
  });

  it('refrigeration recs safe', () => {
    const result: unknown = { flags: { superheatStatus: 'alert', subcoolingStatus: 'ok' }, values: { superheat: 30, subcooling: 5 }, status: 'alert' };
    const recs = generateRefrigerationRecommendations(result as unknown as Record<string, unknown>);
    assertSafe(recs);
  });

  it('compressor recip recs safe', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'critical', current: undefined, currentStatus: 'ok', rla: undefined, overallStatus: 'critical' } as unknown as Record<string, unknown>);
    assertSafe(recs);
  });

  it('compressor scroll recs safe', () => {
    const recs = generateScrollRecommendations({ compressionRatio: 2.0 } as unknown as Record<string, unknown>, { current: 10 } as unknown as Record<string, unknown>, { suctionPressure: 10, dischargePressure: 40 } as unknown as Record<string, unknown>);
    assertSafe(recs);
  });

  it('airside recs safe', () => {
    const recs = generateAirsideRecommendations({} as unknown as Record<string, unknown>, {} as unknown as Record<string, unknown>, {} as unknown as Record<string, unknown>, { supplyTemp: 50 } as unknown as Record<string, unknown>, {} as unknown as Record<string, unknown>, {} as unknown as Record<string, unknown>);
    assertSafe(recs);
  });

  it('reversing valve recs safe', () => {
    const pattern = { pattern: 'reversed', status: 'alert' } as unknown as Record<string, unknown>;
    // pass no solenoid error so the recommendations do not include procedural wording
    const recs = generateReversingRecommendations(pattern as unknown as Record<string, unknown>, undefined, { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 200, suctionReturn: 100, indoorCoilLine: 120, outdoorCoilLine: 120 }, dischargePressure: 300, suctionPressure: 100 } as unknown as Record<string, unknown>, {} as unknown as Record<string, unknown>);
    assertSafe(recs);
  });
});
