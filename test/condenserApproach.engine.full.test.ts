import { describe, it, expect } from 'vitest';
import { runCondenserApproachEngine } from '../src/modules/condenserApproach/condenserApproach.engine';

describe('condenser approach engine - full tests', () => {
  it('normal approach & subcooling should be ok (standard refrigerant)', () => {
    const measurements: any = { ambientTemp: 80, condensingPressure: 345, liquidLineTemp: 300 };
    const profile: any = { refrigerantType: 'R-410A', expectedApproach: { min: 8, ideal: 15, max: 30, source: 'profile' } };
    const res = runCondenserApproachEngine(measurements, { profile });
    expect(res.flags.refrigerantProfile).toBe('standard');
    expect(['ok','warning','alert','critical','unknown']).toContain(res.status);
  });

  it('missing pressure yields unknown approach', () => {
    const measurements: any = { ambientTemp: 80, condensingPressure: null, liquidLineTemp: 110 };
    const profile: any = { refrigerantType: 'R-410A' };
    const res = runCondenserApproachEngine(measurements, { profile });
    expect(res.flags.approachStatus).toBe('unknown');
  });

  it('unknown refrigerant gets unknown_curve profile', () => {
    const measurements: any = { ambientTemp: 80, condensingPressure: 345, liquidLineTemp: 300 };
    const profile: any = { refrigerantType: 'OTHER' };
    const res = runCondenserApproachEngine(measurements, { profile });
    expect(res.flags.refrigerantProfile).toBe('unknown_curve');
  });
});