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

const forbiddenKeys = ['estimatedTime', 'requiredParts', 'estimatedCost'];

const proceduralPatterns = [
  /\b(check|inspect|replace|install|tap|trace|perform|recover|turn off|turn on|measure|trace wiring|do not add)\b/i,
];

const timePattern = /\b(\d+\s*(?:min(?:ute)?s?|hr|hrs|hours|sec|seconds))\b/i;
const pricePattern = /\$|\bcost\b|\bprice\b|\bestimate(?:d)?\b|\bfee\b/i;

function assertSafe(recs: Recommendation[]) {
  for (const r of recs) {
    // no forbidden keys present
    for (const k of forbiddenKeys) {
      // @ts-ignore allow dynamic key check
      expect((r as any)[k]).toBeUndefined();
    }

    // inspect text fields
    const textFields = [r.title, r.description, r.action, r.reason, r.notes, (r as any).safetyWarning];
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
    const ok = { flags: { deltaTStatus: 'ok', flowStatus: 'ok' }, values: { waterDeltaT: 12, flowRateGPM: 50 }, status: 'ok' } as any;
    const recs = generateHydronicRecommendations(ok, { profile: {} as any } as any);
    assertSafe(recs);
  });

  it('hydronic source recs safe', () => {
    const base = { flags: { deltaTStatus: 'ok', sourceStatus: 'ok' }, values: { waterDeltaT: 10 }, status: 'ok' } as any;
    const recs = generateHydronicSourceRecommendations(base, { profile: {} as any } as any);
    assertSafe(recs);
  });

  it('condenser approach recs safe', () => {
    const res = { flags: { approachStatus: 'alert', subcoolingStatus: 'ok' }, status: 'alert', values: { approach: 8, subcooling: 12 } } as any;
    const recs = generateCondenserApproachRecommendations(res as any);
    assertSafe(recs);
  });

  it('refrigeration recs safe', () => {
    const result: any = { flags: { superheatStatus: 'alert', subcoolingStatus: 'ok' }, values: { superheat: 30, subcooling: 5 }, status: 'alert' };
    const recs = generateRefrigerationRecommendations(result as any);
    assertSafe(recs);
  });

  it('compressor recip recs safe', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'critical', current: undefined, currentStatus: 'ok', rla: undefined, overallStatus: 'critical' } as any);
    assertSafe(recs);
  });

  it('compressor scroll recs safe', () => {
    const recs = generateScrollRecommendations({ compressionRatio: 2.0 } as any, { current: 10 } as any, { suctionPressure: 10, dischargePressure: 40 } as any);
    assertSafe(recs);
  });

  it('airside recs safe', () => {
    const recs = generateAirsideRecommendations({} as any, {} as any, {} as any, { supplyTemp: 50 } as any, {} as any, {} as any);
    assertSafe(recs);
  });

  it('reversing valve recs safe', () => {
    const pattern = { pattern: 'reversed', status: 'alert' } as any;
    const recs = generateReversingRecommendations(pattern, 'no_voltage', { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 200, suctionReturn: 100, indoorCoilLine: 120, outdoorCoilLine: 120 }, dischargePressure: 300, suctionPressure: 100 } as any, { } as any);
    assertSafe(recs);
  });
});
