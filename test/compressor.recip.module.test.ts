import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { runReciprocatingCompressorEngine } from '../src/modules/compressor/recip.engine';
import type { ReciprocatingCompressorMeasurements } from '../src/modules/compressor/recip.types';
import { recipCompressorModule } from '../src/modules/compressor/recip.module';

describe('reciprocating compressor module - integration tests', () => {
  it('validate should return invalid when required fields missing', () => {
    const missing = { compressor: { compressorId: 'X1' } } as unknown as { compressor?: ReciprocatingCompressorMeasurements };
    const v = recipCompressorModule.validate(missing.compressor as ReciprocatingCompressorMeasurements);
    expect(v.valid).toBeFalsy();
    expect(Array.isArray(v.errors)).toBeTruthy();
  });

  it('diagnose delegates to engine and summarizeForReport returns readable text including status', () => {
    const f = JSON.parse(readFileSync('test/fixtures/compressor/recip/lowcompression.json', 'utf-8'));
    const diag = recipCompressorModule.diagnose(f.measurements.compressor, f.profile);

    // validate delegated engine call produced similar fields
    const engine = runReciprocatingCompressorEngine(f.measurements.compressor, f.profile);
    expect(diag.compressionRatio).toBe(engine.compressionRatio);

    const report = recipCompressorModule.summarizeForReport(diag);
    expect(typeof report).toBe('string');
    expect(report.includes(engine.status.toUpperCase())).toBeTruthy();
    // for the lowcompression fixture we expect the disclaimer about custom refrigerant
    expect(report.includes('standard profile library') || (diag.disclaimers && diag.disclaimers.some(d => d.includes('standard profile library')))).toBeTruthy();
  });
});
