import { expect, test } from 'vitest';

import { validateRefrigerationMeasurements } from '../src/modules/refrigeration/refrigeration.validation';
import { validateReciprocatingCompressorMeasurements, runReciprocatingCompressorEngine } from '../src/modules/compressor/recip.engine';
import type { RefrigerationMeasurements } from '../src/modules/refrigeration/refrigeration.types';
import type { ReciprocatingCompressorMeasurements } from '../src/modules/compressor/recip.types';
import { WaterCooledUnitProfile } from '../src/wshp/wshp.profile';

test('validation rejects inverted pressures for refrigeration (discharge <= suction)', () => {
  const bad: RefrigerationMeasurements = {
    suctionPressure: 200,
    dischargePressure: 80,
    suctionTemp: 60,
    liquidTemp: 70,
  };

  const r = validateRefrigerationMeasurements(bad);
  expect(r.ok).toBeFalsy();
  expect(r.issues && r.issues.some(i => i.field === 'dischargePressure' && i.code === 'inconsistent')).toBeTruthy();
});

test('reciprocating compressor validation catches inverted pressures', () => {
  const m: ReciprocatingCompressorMeasurements = { suctionPressure: 200, dischargePressure: 50, suctionTemp: 60 } as ReciprocatingCompressorMeasurements;
  const v = validateReciprocatingCompressorMeasurements(m);
  expect(v.valid).toBeFalsy();
  expect(v.errors && v.errors.some(e => /Discharge pressure must be higher/i.test(e))).toBeTruthy();
});

test('engine flags extremely large current (likely extra-zero) as critical and produces a shutdown recommendation', () => {
  const measurements: ReciprocatingCompressorMeasurements = {
    compressorId: 'X1',
    suctionPressure: 80,
    dischargePressure: 350,
    suctionTemp: 60,
    dischargeTemp: 140,
    compressorCurrent: 100, // e.g. extra-zero typo instead of 10
    isRunning: true,
    totalCylinders: 4,
  };

  const profile: WaterCooledUnitProfile = {
    nominalTons: 10,
    airside: { designCFM: { cooling: 4000 }, externalStaticPressure: { design: 0.5, max: 1.5 } },
    waterSide: { flowRate: 50, loopType: 'closed_tower' },
    refrigeration: { refrigerantType: 'R410A', metering: { cooling: { type: 'txv' } } },
    compressor: { type: 'recip', stages: 1, hasVFD: false, rla: 10, lra: 40 },
    electrical: { nameplateVoltage: 460, phase: 3 },
    supportsHeating: false,
  } as WaterCooledUnitProfile;

  const res = runReciprocatingCompressorEngine(measurements, profile);

  // extra-zero current should result in critical current status and a safety + shutdown recommendation
  expect(res.flags.currentStatus).toBe('critical');
  expect(res.recommendations.some(r => r.id === 'compressor_recip_current_far_above_rla')).toBeTruthy();
});
