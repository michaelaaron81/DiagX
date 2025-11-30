import { describe, it, expect } from 'vitest';
import { validatePTChart } from '../src/modules/refrigeration/ptUtils';

describe('PT table validator', () => {
  it('rejects empty or missing data', () => {
    expect(validatePTChart(null).ok).toBe(false);
    expect(validatePTChart(undefined).ok).toBe(false);
  });

  it('requires at least two points', () => {
    expect(validatePTChart([[40, 100]]).ok).toBe(false);
  });

  it('flags descending pressures', () => {
    const pt = [[40, 100], [50, 90]];
    const r = validatePTChart(pt);
    expect(r.ok).toBe(false);
    expect(r.errors.some(e => e.includes('not ascending'))).toBeTruthy();
  });

  it('accepts a well-formed ascending PT chart', () => {
    const pt = [[40, 100], [50, 150], [60, 200]];
    const r = validatePTChart(pt);
    expect(r.ok).toBe(true);
    expect(r.errors.length).toBe(0);
  });
});
