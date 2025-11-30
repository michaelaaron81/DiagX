import { describe, it, expect } from 'vitest';
import { generateRecommendations, runAirsideEngine } from '../src/modules/airside/airside.engine';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';
import { readFileSync } from 'fs';

describe('airside recommendation helper', () => {
  it('generates critical recommendation for critical deltaT', () => {
    const deltaTAnalysis: any = { status: 'critical' };
    const airflowAnalysis: any = { status: 'ok' };
    const recs = generateRecommendations(
      deltaTAnalysis,
      airflowAnalysis,
      undefined,
      { supplyAirTemp: 40, returnAirTemp: 80, mode: 'cooling' } as any,
      { airside: { designCFM: { cooling: 400 }, externalStaticPressure: { design: 0.3, max: 0.6 } } } as any,
      { min: 8, ideal: 12, max: 16 } as any,
    );
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    expect(recs.some(r => r.severity === 'critical')).toBeTruthy();
  });

  it('returns a preventive low-priority recommendation when conditions are normal', () => {
    const deltaTAnalysis: any = { status: 'ok' };
    const airflowAnalysis: any = { status: 'ok' };
    const recs = generateRecommendations(
      deltaTAnalysis,
      airflowAnalysis,
      undefined,
      { supplyAirTemp: 55, returnAirTemp: 70, mode: 'cooling' } as any,
      { airside: { designCFM: { cooling: 400 }, externalStaticPressure: { design: 0.3, max: 0.6 } }, nominalTons: 10 } as any,
      { min: 8, ideal: 12, max: 16 } as any,
    );
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    expect(recs[0].severity).toBeDefined();
  });

  it('emits all required advisories for frozen_coil_like scenario', () => {
    const airProfile = {
      nominalTons: 5,
      airside: { designCFM: { cooling: 2400 }, externalStaticPressure: { design: 0.3, max: 0.6 } },
    } as any;
    const measurements = {
      mode: 'cooling',
      returnAirTemp: 75,
      supplyAirTemp: 30,
      measuredCFM: 600,
      externalStatic: 0.8,
    } as any;

    const result = runAirsideEngine(measurements, airProfile);
    const ids = (result.recommendations || []).map(r => r.id);
    for (const r of result.recommendations || []) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }

    expect(ids).toContain('airside.low_airflow.inspect_air_path');
    expect(ids).toContain('airside.static_pressure.inspect_ductwork');
    expect(ids).toContain('airside.abnormal_deltaT.check_for_icing_or_restriction');
  });

  it('emits low airflow and abnormal deltaT advisories for low_delta_but_low_cfm scenario', () => {
    const airProfile = {
      nominalTons: 5,
      airside: { designCFM: { cooling: 2400 }, externalStaticPressure: { design: 0.3, max: 0.6 } },
    } as any;
    const measurements = {
      mode: 'cooling',
      returnAirTemp: 75,
      supplyAirTemp: 70,
      measuredCFM: 500,
      externalStatic: 0.4,
    } as any;

    const result = runAirsideEngine(measurements, airProfile);
    const ids = (result.recommendations || []).map(r => r.id);
    for (const r of result.recommendations || []) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }

    expect(ids).toContain('airside.low_airflow.inspect_air_path');
    expect(ids).toContain('airside.abnormal_deltaT.check_for_icing_or_restriction');
  });

  it('emits high airflow / low deltaT advisory for very_high_airflow scenario', () => {
    const airProfile = {
      nominalTons: 5,
      airside: { designCFM: { cooling: 2400 }, externalStaticPressure: { design: 0.3, max: 0.6 } },
    } as any;
    const measurements = {
      mode: 'cooling',
      returnAirTemp: 75,
      supplyAirTemp: 72,
      measuredCFM: 4000,
      externalStatic: 0.1,
    } as any;

    const result = runAirsideEngine(measurements, airProfile);
    const ids = (result.recommendations || []).map(r => r.id);
    for (const r of result.recommendations || []) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }

    expect(ids).toContain('airside.high_airflow.low_deltaT_review');
  });

  it('does not emit new advisory IDs for nominal cooling fixture', () => {
    const fixture = JSON.parse(readFileSync('test/fixtures/airside/nominal.json', 'utf-8'));
    const result = runAirsideEngine(fixture.measurements.airside, fixture.profile);
    const ids = new Set((result.recommendations || []).map(r => r.id));
    for (const r of result.recommendations || []) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }

    expect(ids.has('airside.low_airflow.inspect_air_path')).toBeFalsy();
    expect(ids.has('airside.static_pressure.inspect_ductwork')).toBeFalsy();
    expect(ids.has('airside.abnormal_deltaT.check_for_icing_or_restriction')).toBeFalsy();
    expect(ids.has('airside.high_airflow.low_deltaT_review')).toBeFalsy();
  });
});
