import { runAirsideEngine } from '../src/modules/airside/airside.engine';

console.log('running airside engine test script');

// Fabricate a profile and measurements that represent bad conditions:
// - Very high delta-T (frozen coil / severe restriction)
// - Low measured CFM/ton (low airflow)
// - High external static pressure

const profile = {
  nominalTons: 5,
  airside: {
    designCFM: { cooling: 2400 }, // 480 CFM/ton nominal
    externalStaticPressure: { design: 0.3, max: 0.6 },
  },
};

const measurements = {
  mode: 'cooling',
  returnAirTemp: 75,
  supplyAirTemp: 30, // very low supply -> Delta-T 45°F
  measuredCFM: 600, // low absolute airflow (120 CFM/ton)
  externalStatic: 0.8, // higher than max
};

try {
  const result = runAirsideEngine(measurements as unknown as Record<string, unknown>, profile as unknown as Record<string, unknown>);
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error('engine threw:', err);
  process.exitCode = 2;
}
