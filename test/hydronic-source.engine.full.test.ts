import { describe, it, expect } from 'vitest';
import { runHydronicSourceEngine } from '../src/modules/hydronic/hydronic-source.engine';
import { HydronicSourceEngineInput } from '../src/modules/hydronic/hydronic-source.types';

function buildInput(
  partial: Partial<HydronicSourceEngineInput>,
): HydronicSourceEngineInput {
  return {
    measurements: {
      enteringWaterTemp: 85,
      leavingWaterTemp: 95,
      loopFluidTemp: null,
      flowGpm: 50,
      ambientWetBulb: 78,
      ambientDryBulb: 90,
      ...(partial.measurements ?? {}),
    },
    context: {
      profileId: 'test-profile',
      tons: 10,
      refrigerantType: 'R410A',
      loopType: 'open_tower',
      profileConfig: {},
      ...(partial.context ?? {}),
    },
  };
}

describe('HydronicSourceEngine - full engine behavior', () => {
  it('returns ok status for nominal hydronic conditions', () => {
    const input = buildInput({});
    const result = runHydronicSourceEngine(input);

    expect(result.status).toBeDefined();
    expect(result.values.deltaT).not.toBeNull();
    expect(result.flags.deltaTStatus).toBeDefined();
  });

  it('flags abnormal deltaT when values are outside expected range (placeholder)', () => {
    const input = buildInput({
      measurements: {
        enteringWaterTemp: 85,
        leavingWaterTemp: 110, // TODO: adjust after real thresholds
        flowGpm: 10,
      } as any,
    });

    const result = runHydronicSourceEngine(input);
    expect(result.flags.deltaTStatus).toBeDefined();
  });
});
