import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { scrollCompressorModule } from '../src/modules/compressor/scroll.module';
import { runScrollCompressorEngine } from '../src/modules/compressor/scroll.engine';

describe('scroll compressor module - integration tests', () => {
  it('validate should return invalid when required fields missing', () => {
    const v = scrollCompressorModule.validate({} as any);
    expect(v.valid).toBeFalsy();
  });

  it('diagnose delegates to engine and explainDiagnosis returns structured object', () => {
    const f = JSON.parse(readFileSync('test/fixtures/compressor/scroll/nominal.json', 'utf-8'));
    const diag = scrollCompressorModule.diagnose(f.measurements.compressor, f.profile as any);
    const engine = runScrollCompressorEngine(f.measurements.compressor, f.profile as any);
    expect(diag.compressionRatio).toBe(engine.compressionRatio);

    const exp = scrollCompressorModule.explainDiagnosis(diag as any);
    expect(exp).toHaveProperty('finding');
    expect(exp).toHaveProperty('whatToDoNext');
    expect(Array.isArray(exp.whatToDoNext.immediate)).toBeTruthy();
  });
});
