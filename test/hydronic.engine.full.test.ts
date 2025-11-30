import { describe, it, expect } from 'vitest';
import { runHydronicEngine } from '../src/modules/hydronic/hydronic.engine';

describe('hydronic engine - full tests', () => {
  it('normal deltaT & flow should be ok', () => {
    const measurements = { enteringWaterTemp: 60, leavingWaterTemp: 72, flowRateGPM: 50 };
    const profile = { designFlowGPM: 50, expectedDeltaT: { min: 10, ideal: 12, max: 14, source: 'profile' } };
    const res = runHydronicEngine(measurements, { profile });
    expect(res.status).toBe('ok');
    expect(res.flags.deltaTStatus).toBe('ok');
  });

  it('very low deltaT should be critical', () => {
    const measurements = { enteringWaterTemp: 60, leavingWaterTemp: 61, flowRateGPM: 50 };
    const profile = { designFlowGPM: 50, expectedDeltaT: { min: 10, ideal: 12, max: 14, source: 'profile' } };
    const res = runHydronicEngine(measurements, { profile });
    expect(res.flags.deltaTStatus).toBe('critical');
    expect(res.status).toBe('critical');
  });

  it('missing measurements yield unknown flags', () => {
    const measurements = { enteringWaterTemp: null, leavingWaterTemp: null, flowRateGPM: null };
    const profile = { designFlowGPM: 50 };
    const res = runHydronicEngine(measurements, { profile });
    expect(res.flags.deltaTStatus).toBe('unknown');
    expect(res.flags.flowStatus).toBe('unknown');
    expect(['ok','unknown','warning','alert','critical']).toContain(res.status);
  });
});
