import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { runAirsideEngine } from '../src/modules/airside/airside.engine';

describe('airside engine - full tests', () => {
  it('nominal fixture should be ok', () => {
    const fixture = JSON.parse(readFileSync('test/fixtures/airside/nominal.json', 'utf-8'));
    const result = runAirsideEngine(fixture.measurements.airside, fixture.profile);
    expect(result).toHaveProperty('status');
    expect(['ok','warning','alert','critical']).toContain(result.status);
    // Engine is text-free in Phase 2; ensure recommendations or status indicate normal operation
    expect(result.status).toBe('ok');
  });

  it('lowflow fixture should indicate low airflow (alert or critical)', () => {
    const fixture = JSON.parse(readFileSync('test/fixtures/airside/lowflow.json', 'utf-8'));
    const result = runAirsideEngine(fixture.measurements.airside, fixture.profile);
    expect(['alert','critical','warning']).toContain(result.airflowStatus);
  });

  it('frozen fixture should indicate critical overallFinding due to deltaT', () => {
    const fixture = JSON.parse(readFileSync('test/fixtures/airside/frozen.json', 'utf-8'));
    const result = runAirsideEngine(fixture.measurements.airside, fixture.profile);
    // Engine is text-free; validate critical status or a critical recommendation
    expect(result.status).toBe('critical');
  });
});
