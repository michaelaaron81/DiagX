import { describe, it, expect } from 'vitest';
import { condenserApproachModule } from '../src/modules/condenserApproach/condenserApproach.module';

describe('condenser approach module', () => {
  it('diagnose ok scenario', () => {
    const measurements: any = { ambientTemp: 80, condensingPressure: 345, liquidLineTemp: 300 };
    const profile: any = { refrigerantType: 'R-410A', expectedApproach: { min: 8, ideal: 15, max: 30, source: 'profile' } };
    const res: any = condenserApproachModule.diagnose(measurements, profile);
    expect(res.flags).toBeDefined();
    expect(Array.isArray(res.recommendations)).toBeTruthy();
  });
});