import { test, expect } from 'vitest';
import { runWshpDiagx } from '../src/wshp/wshp.diagx';

test('runWshpDiagx correlates airside + refrigeration + compressor problems into controls findings', () => {
  const profile: any = {
    id: 'stress-test-1',
    nominalTons: 5,
    airside: { designCFM: { cooling: 2400 }, externalStaticPressure: { design: 0.25, max: 0.6 } },
    refrigeration: { refrigerantType: 'R-410A', metering: { cooling: { type: 'txv' } } },
    compressor: { type: 'scroll', rla: 10, lra: 35 },
    reversingValve: { type: 'standard', solenoid: { voltage: 24 } },
  };

  const measurements: any = {
    airside: { mode: 'cooling', returnAirTemp: 78, supplyAirTemp: 30, measuredCFM: 600, externalStatic: 0.85 },
    refrigeration: { mode: 'cooling', suctionPressure: 70, dischargePressure: 360, suctionTemp: 60, liquidTemp: 95, enteringWaterTemp: 80, leavingWaterTemp: 88 },
    recipCompressor: { dischargePressure: 360, suctionPressure: 70, suctionTemp: 60, compressorCurrent: 30, totalCylinders: 4 },
    scrollCompressor: { suctionPressure: 70, dischargePressure: 360, suctionTemp: 60, runningCurrent: 12 },
    reversingValve: { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 200, suctionReturn: 65, indoorCoilLine: 190, outdoorCoilLine: 70 }, suctionPressure: 70, dischargePressure: 360, solenoidVoltage: 24 }
  };

  const result = runWshpDiagx({ profile, measurements });
  // Must include domain results and at least one controls finding when airside is critical
  expect(Array.isArray(result.domainResults)).toBeTruthy();

  const controls = result.domainResults.find(d => d.domain === 'controls');
  expect(controls).toBeDefined();
  expect(Array.isArray(controls?.findings)).toBeTruthy();
  // at least one critical advisory should be present in the controls findings
  expect(controls?.findings.some((f: any) => f.severity === 'critical')).toBeTruthy();
});
