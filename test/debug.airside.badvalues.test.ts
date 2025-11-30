import { test, expect } from 'vitest';
import { runAirsideEngine } from '../src/modules/airside/airside.engine';

test('debug airside - bad values produce critical frozen coil recommendation', () => {
  const profile = {
    nominalTons: 5,
    airside: {
      designCFM: { cooling: 2400 },
      externalStaticPressure: { design: 0.3, max: 0.6 },
    },
  } as any;

  const measurements = {
    mode: 'cooling',
    returnAirTemp: 75,
    supplyAirTemp: 30, // deltaT 45 -> critical
    measuredCFM: 600, // low airflow
    externalStatic: 0.8, // high static
  } as any;

  const result = runAirsideEngine(measurements, profile);
  console.log('Airside engine result (debug):', JSON.stringify(result, null, 2));

  expect(Array.isArray(result.recommendations)).toBe(true);
  // look for the frozen coil critical recommendation
  const critical = result.recommendations.find(r => r.id === 'airside_frozen_coil_or_restriction' || r.severity === 'critical');
  expect(critical).toBeTruthy();
});
