import { runHydronicEngine } from '../src/modules/hydronic/hydronic.engine';
import { generateHydronicRecommendations } from '../src/modules/hydronic/hydronic.recommendations';
import { test, expect } from 'vitest';

test('runHydronicEngine should attach recommendations for critical deltaT', () => {
  const res = runHydronicEngine({ enteringWaterTemp: 80, leavingWaterTemp: 81, flowRateGPM: 50 }, { profile: { designFlowGPM: 50 } as any });
  // deltaT = 1 -> critical per engine thresholds
  expect(res.flags.deltaTStatus).toBe('critical');
  // direct call to the generator should include alerts for deltaT critical
  const direct = generateHydronicRecommendations(res as any, { profile: { designFlowGPM: 50 } as any } as any);
  expect(Array.isArray(direct)).toBeTruthy();
  expect(direct.length).toBeGreaterThan(0);
});
