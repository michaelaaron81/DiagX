import { describe, it, expect } from 'vitest';
import { validateRefrigerationMeasurements } from '../src/modules/refrigeration/refrigeration.validation';

describe('refrigeration validation (phase 1)', () => {
  it('flags missing critical field with severity error', () => {
    // missing suctionPressure should produce ok === false and an error issue
    const m: any = {
      mode: 'cooling',
      // suctionPressure: missing
      dischargePressure: 150,
      suctionTemp: 80,
      liquidTemp: 90,
    };

    const r = validateRefrigerationMeasurements(m);
    expect(r.ok).toBe(false);
    expect(r.issues.some(i => i.field === 'suctionPressure' && i.severity === 'error' && i.code === 'missing')).toBeTruthy();
  });
});
