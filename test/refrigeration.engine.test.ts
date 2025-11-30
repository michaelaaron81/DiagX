import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';

import { runWshpDiagx } from '../src/wshp/wshp.diagx';

describe('refrigeration demo fixture', () => {
  it('runs diagnostics and returns a result structure', () => {
    const fixture = JSON.parse(readFileSync('test/fixtures/refrigeration/demo.json', 'utf-8'));

    const result = runWshpDiagx({ profile: fixture.profile, measurements: fixture.measurements });

    expect(result).toHaveProperty('profileId', 'demo-unit');
    expect(Array.isArray(result.domainResults)).toBe(true);
    expect(result.domainResults.length).toBeGreaterThanOrEqual(1);

    const d = result.domainResults[0];
    expect(d).toHaveProperty('domain', 'refrigeration');
    expect(d.details).toHaveProperty('superheat');
    expect(typeof d.details?.superheat).toBe('number');
  });
});
