import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { runReciprocatingCompressorEngine } from '../src/modules/compressor/recip.engine';

describe('reciprocating compressor engine - full tests', () => {
  it('nominal should be ok or warning', () => {
    const f = JSON.parse(readFileSync('test/fixtures/compressor/recip/nominal.json', 'utf-8'));
    const r = runReciprocatingCompressorEngine(f.measurements.compressor, f.profile);
    expect(['ok','warning','alert','critical']).toContain(r.status);
    expect(r.flags.refrigerantProfile).toBe('standard');
    expect(r.disclaimers && !r.disclaimers.some(d => d.includes('standard profile library'))).toBeTruthy();
    expect(r.recommendations.every(rec => rec.id !== 'refrigerant_profile_unknown')).toBeTruthy();
  });

  it('highcurrent should show high/critical current status', () => {
    const f = JSON.parse(readFileSync('test/fixtures/compressor/recip/highcurrent.json', 'utf-8'));
    const r = runReciprocatingCompressorEngine(f.measurements.compressor, f.profile);
    expect(r.currentStatus === 'alert' || r.currentStatus === 'critical').toBeTruthy();
  });

  it('low compression should show critical compression and include disclaimer for OTHER refrigerant', () => {
    const f = JSON.parse(readFileSync('test/fixtures/compressor/recip/lowcompression.json', 'utf-8'));
    const r = runReciprocatingCompressorEngine(f.measurements.compressor, f.profile);
    expect(r.compressionStatus === 'critical' || r.compressionStatus === 'alert').toBeTruthy();
    expect(Array.isArray(r.disclaimers)).toBeTruthy();
    expect(r.disclaimers && r.disclaimers.some(d => d.includes('standard profile library'))).toBeTruthy();
    expect(r.flags.refrigerantProfile).toBe('unknown');
    expect(r.recommendations.some(rec => rec.id === 'refrigerant_profile_unknown')).toBeTruthy();
  });
});
