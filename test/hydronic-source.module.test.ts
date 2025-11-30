import { describe, it, expect } from 'vitest';
import { runHydronicSourceModule } from '../src/modules/hydronic/hydronic-source.module';
import { CombinedProfile } from '../src/profiles/types';
import { CombinedMeasurements } from '../src/measurements/types';

const baseProfile: CombinedProfile = {
  id: 'hydronic-test',
  nominalTons: 10,
  airside: {} as Record<string, unknown>,
  waterSide: {
    loopType: 'open_tower',
  },
  refrigeration: {} as Record<string, unknown>,
  compressor: {} as Record<string, unknown>,
  electrical: {} as Record<string, unknown>,
};

const baseMeasurements: CombinedMeasurements = {
  airside: {} as Record<string, unknown>,
  waterSide: {
    enteringWaterTemp: 85,
    leavingWaterTemp: 95,
    flowGpm: 50,
    ambientWetBulb: 78,
  },
  refrigeration: {} as Record<string, unknown>,
  recipCompressor: {} as Record<string, unknown>,
  scrollCompressor: {} as Record<string, unknown>,
  reversingValve: {} as Record<string, unknown>,
};

describe('HydronicSource module orchestration', () => {
  it('runs hydronic source engine from combined profile/measurements', () => {
    const result = runHydronicSourceModule(baseProfile, baseMeasurements);

    expect(result.values.deltaT).not.toBeNull();
    expect(result.flags.deltaTStatus).toBeDefined();
  });
});
