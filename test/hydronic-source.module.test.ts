import { describe, it, expect } from 'vitest';
import { runHydronicSourceModule } from '../src/modules/hydronic/hydronic-source.module';
import { CombinedProfile } from '../src/profiles/types';
import { CombinedMeasurements } from '../src/measurements/types';

const baseProfile: CombinedProfile = {
  id: 'hydronic-test',
  nominalTons: 10,
  airside: {} as any,
  waterSide: {
    loopType: 'open_tower',
  } as any,
  refrigeration: {} as any,
  compressor: {} as any,
  electrical: {} as any,
};

const baseMeasurements: CombinedMeasurements = {
  airside: {} as any,
  waterSide: {
    enteringWaterTemp: 85,
    leavingWaterTemp: 95,
    flowGpm: 50,
    ambientWetBulb: 78,
  } as any,
  refrigeration: {} as any,
  recipCompressor: {} as any,
  scrollCompressor: {} as any,
  reversingValve: {} as any,
};

describe('HydronicSource module orchestration', () => {
  it('runs hydronic source engine from combined profile/measurements', () => {
    const result = runHydronicSourceModule(baseProfile, baseMeasurements);

    expect(result.values.deltaT).not.toBeNull();
    expect(result.flags.deltaTStatus).toBeDefined();
  });
});
