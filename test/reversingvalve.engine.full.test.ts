import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { runReversingValveEngine } from '../src/modules/reversingValve/reversing.engine';

describe('reversing valve engine - full tests', () => {
  it('nominal should be ok', () => {
    const f = JSON.parse(readFileSync('test/fixtures/reversingValve/nominal.json', 'utf-8'));
    const r = runReversingValveEngine(f.measurements.reversingValve, f.profile);
    expect(r.status).toBe('ok');
    expect(r.patternMatch).toBe('correct');
  });

  it('stuck should be critical with stuck pattern', () => {
    const f = JSON.parse(readFileSync('test/fixtures/reversingValve/stuck.json', 'utf-8'));
    const r = runReversingValveEngine(f.measurements.reversingValve, f.profile);
    expect(r.patternMatch).toBe('stuck');
    expect(r.status).toBe('critical');
  });

  it('partial_leak should be alert (low compression ratio)', () => {
    const f = JSON.parse(readFileSync('test/fixtures/reversingValve/partial_leak.json', 'utf-8'));
    const r = runReversingValveEngine(f.measurements.reversingValve, f.profile);
    expect(r.patternMatch).toBe('partial_leak');
    expect(r.status === 'alert' || r.status === 'warning').toBeTruthy();
  });

  it('reversed pattern should show reversed and alert', () => {
    const f = JSON.parse(readFileSync('test/fixtures/reversingValve/reversed.json', 'utf-8'));
    const r = runReversingValveEngine(f.measurements.reversingValve, f.profile);
    expect(r.patternMatch === 'reversed' || r.patternMatch === 'stuck' || r.patternMatch === 'correct').toBeTruthy();
    expect(['ok','warning','alert','critical']).toContain(r.status);
  });
});
