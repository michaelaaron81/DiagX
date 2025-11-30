import { describe, it, expect } from 'vitest';
import { hydronicModule } from '../src/modules/hydronic/hydronic.module';

describe('hydronic module', () => {
  it('valid inputs yield ok result', () => {
    const measurements = { enteringWaterTemp: 60, leavingWaterTemp: 72, flowRateGPM: 50 };
    const profile = { designFlowGPM: 50, expectedDeltaT: { min: 10, ideal: 12, max: 14, source: 'profile' } };
    const res = hydronicModule.diagnose(measurements, profile);
    expect(res.status).toBe('ok');
    expect(Array.isArray(res.recommendations)).toBeTruthy();
  });

  it('severe low deltaT propagates to findings', () => {
    const measurements = { enteringWaterTemp: 60, leavingWaterTemp: 60.5, flowRateGPM: 50 };
    const profile = { designFlowGPM: 50, expectedDeltaT: { min: 10, ideal: 12, max: 14, source: 'profile' } };
    const res = hydronicModule.diagnose(measurements, profile);
    expect(res.flags.deltaTStatus).toBe('critical');
  });
});
