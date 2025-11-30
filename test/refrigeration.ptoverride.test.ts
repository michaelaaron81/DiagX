import { describe, it, expect } from 'vitest';
import { runRefrigerationEngine } from '../src/modules/refrigeration/refrigeration.engine';

describe('refrigeration PT override behavior', () => {
  it('uses ptOverride when refrigerant is OTHER', () => {
    const measurements = { mode: 'cooling', suctionPressure: 150, dischargePressure: 300, suctionTemp: 70, liquidTemp: 90, enteringWaterTemp: 80, leavingWaterTemp: 88 } as any;
    // create a fake PT where pressure=150 maps to temp=45 and 300 maps to 75
    const ptOverride = [ [45, 150], [75, 300] ];

    const result = runRefrigerationEngine(measurements, {
      refrigerant: 'OTHER',
      coolingMeterType: 'txv',
      nominalTons: 3,
      designWaterFlowGPM: 30,
      superheatCoolingTXV: { min: 6, ideal: 10, max: 15 },
      superheatCoolingFixed: { min: 8, ideal: 12, max: 20 },
      superheatHeatingTXV: { min: 6, ideal: 10, max: 15 },
      subcoolingWaterCooled: { min: 6, ideal: 10, max: 15 },
      compressionRatioRange: { min: 2.0, ideal: 3.0, max: 4.5 },
      ptOverride,
    } as any);

    // suctionSatTemp should use ptOverride (close to 45)
    expect(result.suctionSatTemp).toBeGreaterThan(40);
    expect(result.suctionSatTemp).toBeLessThan(50);
    expect(result.disclaimers && result.disclaimers.some(d => d.toLowerCase().includes('limited by non-standard or overridden pt data'))).toBeTruthy();
  });

  it('ignores ptOverride for named refrigerants', () => {
    const measurements = { mode: 'cooling', suctionPressure: 150, dischargePressure: 300, suctionTemp: 70, liquidTemp: 90, enteringWaterTemp: 80, leavingWaterTemp: 88 } as any;
    const ptOverride = [ [0, 9999] ];

    const result = runRefrigerationEngine(measurements, {
      refrigerant: 'R-410A',
      coolingMeterType: 'txv',
      nominalTons: 3,
      designWaterFlowGPM: 30,
      superheatCoolingTXV: { min: 6, ideal: 10, max: 15 },
      superheatCoolingFixed: { min: 8, ideal: 12, max: 20 },
      superheatHeatingTXV: { min: 6, ideal: 10, max: 15 },
      subcoolingWaterCooled: { min: 6, ideal: 10, max: 15 },
      compressionRatioRange: { min: 2.0, ideal: 3.0, max: 4.5 },
      ptOverride,
    } as any);

    // When ignored, disclaimers should be standard (not overridden) and suctionSatTemp should be a plausible repository value (not the impossible 0)
    expect(result.disclaimers && result.disclaimers.some(d => d.toLowerCase().includes('generic thermodynamic properties'))).toBeTruthy();
    expect(result.suctionSatTemp).not.toEqual(0);
  });
});
