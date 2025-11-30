import { describe, it, expect } from 'vitest';
import { validateAirsideMeasurements } from '../src/modules/airside/airside.validation';

describe('airside validation (phase 2)', () => {
  it('flags missing critical field returnAirTemp as error', () => {
    const m: any = { supplyAirTemp: 55, mode: 'cooling' };
    const r = validateAirsideMeasurements(m);
    expect(r.ok).toBe(false);
    expect(r.issues.some(i => i.field === 'returnAirTemp' && i.severity === 'error')).toBeTruthy();
  });

  it('accepts a minimal valid measurement set', () => {
    const m: any = { supplyAirTemp: 55, returnAirTemp: 70, mode: 'cooling' };
    const r = validateAirsideMeasurements(m);
    expect(r.ok).toBe(true);
    expect(r.issues.length).toBe(0);
  });
});
