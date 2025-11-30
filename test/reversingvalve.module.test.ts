import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { reversingValveModule } from '../src/modules/reversingValve/reversing.module';
import { runReversingValveEngine } from '../src/modules/reversingValve/reversing.engine';

describe('reversing valve module - integration tests', () => {
  it('validate should require port temps and profile to have reversing valve', () => {
    const v = reversingValveModule.validate({} as unknown as Record<string, unknown>, { supportsHeating: false } as unknown as Record<string, unknown>);
    expect(v.valid).toBeFalsy();
  });

  it('getMeasurementHelp returns help for reversingValvePortTemps', () => {
    const h = reversingValveModule.getMeasurementHelp('reversingValvePortTemps');
    expect(h).toHaveProperty('label');
  });

  it('diagnose delegates and summarizeForReport includes key fields', () => {
    const f = JSON.parse(readFileSync('test/fixtures/reversingValve/nominal.json', 'utf-8'));
    const diag = reversingValveModule.diagnose(f.measurements.reversingValve, f.profile as unknown as Record<string, unknown>);
    const engine = runReversingValveEngine(f.measurements.reversingValve as unknown as Record<string, unknown>, f.profile as unknown as Record<string, unknown>);
    expect(diag.patternMatch).toBe(engine.patternMatch);

    const report = reversingValveModule.summarizeForReport(diag as unknown as Record<string, unknown>, f.profile as unknown as Record<string, unknown>);
    expect(report.includes('REVERSING VALVE')).toBeTruthy();
    expect(report.includes('Port Temperatures')).toBeTruthy();
  });
});
