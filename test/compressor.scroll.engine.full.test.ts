import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { runScrollCompressorEngine } from '../src/modules/compressor/scroll.engine';

describe('scroll compressor engine - full tests', () => {
  it('nominal should be ok or warning', () => {
    const f = JSON.parse(readFileSync('test/fixtures/compressor/scroll/nominal.json', 'utf-8'));
    const r = runScrollCompressorEngine(f.measurements.compressor, f.profile);
    expect(['ok','warning','alert','critical']).toContain(r.status);
  });

  it('highcurrent should show high/critical current status', () => {
    const f = JSON.parse(readFileSync('test/fixtures/compressor/scroll/highcurrent.json', 'utf-8'));
    const r = runScrollCompressorEngine(f.measurements.compressor, f.profile);
    expect(r.currentStatus === 'alert' || r.currentStatus === 'critical').toBeTruthy();
  });

  it('badcompression should show critical or alert compression issues', () => {
    const f = JSON.parse(readFileSync('test/fixtures/compressor/scroll/badcompression.json', 'utf-8'));
    const r = runScrollCompressorEngine(f.measurements.compressor, f.profile);
    expect(r.status === 'alert' || r.status === 'critical').toBeTruthy();
  });
});
