import { runHydronicEngine } from '../src/modules/hydronic/hydronic.engine';
import { generateHydronicRecommendations } from '../src/modules/hydronic/hydronic.recommendations';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';
import type { HydronicProfileConfig, HydronicEngineResult } from '../src/modules/hydronic/hydronic.types';
import { test, expect } from 'vitest';

test('runHydronicEngine should attach recommendations for critical deltaT', () => {
  const res = runHydronicEngine({ enteringWaterTemp: 80, leavingWaterTemp: 81, flowRateGPM: 50 }, { profile: { designFlowGPM: 50 } as HydronicProfileConfig });
  // deltaT = 1 -> critical per engine thresholds
  expect(res.flags.deltaTStatus).toBe('critical');
  // direct call to the generator should include alerts for deltaT critical
  const direct = generateHydronicRecommendations(res as HydronicEngineResult, { profile: { designFlowGPM: 50 } as HydronicProfileConfig });
  expect(Array.isArray(direct)).toBeTruthy();
  expect(direct.length).toBeGreaterThan(0);
  for (const r of direct) {
    expect(validateRecommendation(r)).toBe(true);
    expect(() => assertRecommendationTextSafe(r)).not.toThrow();
  }
});
