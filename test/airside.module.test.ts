import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { airsideModule } from '../src/modules/airside/airside.module';
import { runAirsideEngine } from '../src/modules/airside/airside.engine';

describe('airside module - integration tests', () => {
  it('validate catches missing temps', () => {
    const v = airsideModule.validate({} as any);
    expect(v.valid).toBeFalsy();
  });

  it('getMeasurementHelp returns MeasurementHelp for known keys', () => {
    const h = airsideModule.getMeasurementHelp('supplyAirTemp');
    expect(h).toHaveProperty('label');
    expect(h).toHaveProperty('description');
  });

  it('diagnose delegates to engine and explainDiagnosis returns structured object', () => {
    const f = JSON.parse(readFileSync('test/fixtures/airside/nominal.json', 'utf-8'));
    const diag = airsideModule.diagnose(f.measurements.airside, f.profile as any);
    const engine = runAirsideEngine(f.measurements.airside, f.profile as any);
    expect(diag.deltaT).toBe(engine.deltaT);

    const exp = airsideModule.explainDiagnosis(diag as any);
    expect(exp).toHaveProperty('finding');
    expect(exp).toHaveProperty('whatToDoNext');
    expect(Array.isArray(exp.whatToDoNext.immediate)).toBeTruthy();
  });
});
