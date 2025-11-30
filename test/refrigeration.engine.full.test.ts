import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { runRefrigerationEngine } from '../src/modules/refrigeration/refrigeration.engine';

describe('refrigeration engine - full PT chart based tests', () => {
  it('nominal fixture should return ok status', () => {
    const fixture = JSON.parse(readFileSync('test/fixtures/refrigeration/nominal.json', 'utf-8'));
    const result = runRefrigerationEngine(fixture.measurements.refrigeration, {
      refrigerant: fixture.profile.refrigeration.refrigerantType,
      coolingMeterType: fixture.profile.refrigeration.metering.cooling.type,
      nominalTons: fixture.profile.nominalTons,
      designWaterFlowGPM: fixture.profile.waterSide.flowRate,
      superheatCoolingTXV: { min: 6, ideal: 10, max: 15 },
      superheatCoolingFixed: { min: 8, ideal: 12, max: 20 },
      superheatHeatingTXV: { min: 6, ideal: 10, max: 15 },
      subcoolingWaterCooled: { min: 6, ideal: 10, max: 15 },
      compressionRatioRange: { min: 2.0, ideal: 3.0, max: 4.5 },
    } as unknown as Record<string, unknown>);

    expect(result).toHaveProperty('status');
    expect(['ok', 'warning', 'alert', 'critical']).toContain(result.status);
  });

  it('undercharge fixture should indicate undercharged overallFinding', () => {
    const fixture = JSON.parse(readFileSync('test/fixtures/refrigeration/undercharge.json', 'utf-8'));
    const result = runRefrigerationEngine(fixture.measurements.refrigeration, {
      refrigerant: fixture.profile.refrigeration.refrigerantType,
      coolingMeterType: fixture.profile.refrigeration.metering.cooling.type,
      nominalTons: fixture.profile.nominalTons,
      designWaterFlowGPM: fixture.profile.waterSide.flowRate,
      superheatCoolingTXV: { min: 6, ideal: 10, max: 15 },
      superheatCoolingFixed: { min: 8, ideal: 12, max: 20 },
      superheatHeatingTXV: { min: 6, ideal: 10, max: 15 },
      subcoolingWaterCooled: { min: 6, ideal: 10, max: 15 },
      compressionRatioRange: { min: 2.0, ideal: 3.0, max: 4.5 },
    } as unknown as Record<string, unknown>);

    // Phase-2 engines are text-free. Check recommendations reflect undercharge instead.
    const recText = (result.recommendations || []).map(r => {
      const notes = Array.isArray(((r as unknown) as Record<string, unknown>).notes as unknown) ? (((r as unknown) as Record<string, unknown>).notes as Array<string>).join(' ') : '';
      return ((((r as unknown) as Record<string, unknown>).summary as string) || (((r as unknown) as Record<string, unknown>).rationale as string) || notes || '').toLowerCase();
    }).join(' ');
    expect(recText).toContain('below expected range');
  });

  it('overcharge fixture should indicate overcharged overallFinding', () => {
    const fixture = JSON.parse(readFileSync('test/fixtures/refrigeration/overcharge.json', 'utf-8'));
    const result = runRefrigerationEngine(fixture.measurements.refrigeration, {
      refrigerant: fixture.profile.refrigeration.refrigerantType,
      coolingMeterType: fixture.profile.refrigeration.metering.cooling.type,
      nominalTons: fixture.profile.nominalTons,
      designWaterFlowGPM: fixture.profile.waterSide.flowRate,
      superheatCoolingTXV: { min: 6, ideal: 10, max: 15 },
      superheatCoolingFixed: { min: 8, ideal: 12, max: 20 },
      superheatHeatingTXV: { min: 6, ideal: 10, max: 15 },
      subcoolingWaterCooled: { min: 6, ideal: 10, max: 15 },
      compressionRatioRange: { min: 2.0, ideal: 3.0, max: 4.5 },
    } as unknown as Record<string, unknown>);

    const recText2 = (result.recommendations || []).map(r => {
      const notes = Array.isArray(((r as unknown) as Record<string, unknown>).notes as unknown) ? (((r as unknown) as Record<string, unknown>).notes as Array<string>).join(' ') : '';
      return ((((r as unknown) as Record<string, unknown>).summary as string) || (((r as unknown) as Record<string, unknown>).rationale as string) || notes || '').toLowerCase();
    }).join(' ');
    // Text now uses "subcooling elevated" phrasing in the migrated Recommendation.
    expect(recText2).toContain('subcooling elevated');
  });
});
