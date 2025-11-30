import { describe, it, expect } from 'vitest';
import { runCondenserApproachEngine } from '../src/modules/condenserApproach/condenserApproach.engine';
import type { CondenserApproachEngineInput, CondenserApproachMeasurements, CondenserApproachProfile } from '../src/modules/condenserApproach/condenserApproach.types';

function buildInput(partial: Partial<CondenserApproachEngineInput>) {
  return {
    measurements: {
      liquidLineTemp: 110,
      condensingPressure: 523, // approximate PSIG (maps to ~100°F for R-410A in PT chart)
      ambientTemp: 85,
      ...(partial.measurements ?? {}),
    },
    profile: {
      profileId: 'test-profile',
      tons: 10,
      refrigerantType: 'R-410A',
      profileConfig: {},
      ...(partial.profile ?? {}),
    },
  };
}

describe('CondenserApproachEngine - full engine behavior', () => {
  it('populates approach & lift values for nominal input', () => {
    const input = buildInput({});
    const result = runCondenserApproachEngine(input.measurements as CondenserApproachMeasurements, { profile: input.profile as CondenserApproachProfile });

    expect(result.values.condenserApproach).not.toBeNull();
    expect(result.values.liquidSubcooling).not.toBeNull();
    expect(result.flags.approachStatus).toBeDefined();
  });

  it('flags abnormal approach when values are out of threshold (placeholder)', () => {
    const input = buildInput({ measurements: { liquidLineTemp: 50, ambientTemp: 95 } as CondenserApproachMeasurements });
    const result = runCondenserApproachEngine(input.measurements as CondenserApproachMeasurements, { profile: input.profile as CondenserApproachProfile });
    expect(result.flags.approachStatus).toBeDefined();
  });
});
