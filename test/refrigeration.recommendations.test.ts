import { describe, it, expect } from 'vitest';
import { generateRefrigerationRecommendations } from '../src/modules/refrigeration/refrigeration.engine';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';
import { RefrigerationEngineResult, RefrigerationEngineValues, RefrigerationEngineFlags } from '../src/modules/refrigeration/refrigeration.types';

describe('generateRefrigerationRecommendations', () => {
  const createMockResult = (
    flags: Partial<RefrigerationEngineFlags>,
    values: Partial<RefrigerationEngineValues> = {},
    status: 'ok' | 'warning' | 'alert' | 'critical' = 'ok'
  ): RefrigerationEngineResult => ({
    status,
    values: {
      suctionPressure: 50,
      dischargePressure: 250,
      suctionSatTemp: 40,
      dischargeSatTemp: 100,
      superheat: 10,
      subcooling: 10,
      compressionRatio: 5,
      waterDeltaT: 10,
      ...values,
    },
    flags: {
      superheatStatus: 'ok',
      subcoolingStatus: 'ok',
      compressionRatioStatus: 'ok',
      waterTransferStatus: 'ok',
      refrigerantProfile: 'standard',
      disclaimers: [],
      ...flags,
    },
    mode: 'cooling',
    suctionPressure: 50,
    dischargePressure: 250,
    suctionSatTemp: 40,
    dischargeSatTemp: 100,
    superheat: 10,
    subcooling: 10,
    compressionRatio: 5,
    waterDeltaT: 10,
    superheatStatus: 'ok',
    subcoolingStatus: 'ok',
    compressionRatioStatus: 'ok',
    waterTransferStatus: 'ok',
    recommendations: [],
    disclaimers: [],
  });

  it('generates undercharge-pattern recommendation for high superheat + low subcooling', () => {
    const result = createMockResult({
      superheatStatus: 'warning',
      subcoolingStatus: 'alert',
    }, { subcooling: -5 }, 'alert');

    const recs = generateRefrigerationRecommendations(result);

    expect(recs).toHaveLength(1);
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    expect(recs[0]).toMatchObject({
      id: 'refrigeration_charge_pattern_low',
      domain: 'refrigeration',
      severity: 'alert',
      intent: 'diagnostic',
    });
  });

  it('generates elevated-loading pattern recommendation for alert superheat + high subcooling', () => {
    const result = createMockResult({
      superheatStatus: 'alert',
      subcoolingStatus: 'alert',
    }, { superheat: 3, subcooling: 25 }, 'alert');

    const recs = generateRefrigerationRecommendations(result);

    expect(recs).toHaveLength(1);
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    expect(recs[0]).toMatchObject({
      id: 'refrigeration_subcooling_elevated_pattern',
      domain: 'refrigeration',
      severity: 'alert',
      intent: 'diagnostic',
    });
  });

  it('generates flow/heat-transfer limited recommendation for combined flags', () => {
    const result = createMockResult({
      superheatStatus: 'warning',
      subcoolingStatus: 'alert',
      waterTransferStatus: 'alert',
    }, { superheat: 20, subcooling: 25 }, 'alert');

    const recs = generateRefrigerationRecommendations(result);

    expect(recs).toHaveLength(2);
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    const ids = recs.map(r => r.id).sort();
    expect(ids).toEqual(['refrigeration_flow_or_heat_transfer_limited', 'refrigeration_water_transfer_abnormal']);
  });

  it('generates compression ratio abnormal recommendation', () => {
    const result = createMockResult({
      compressionRatioStatus: 'alert',
    }, {}, 'alert');

    const recs = generateRefrigerationRecommendations(result);

    expect(recs).toHaveLength(1);
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    expect(recs[0]).toMatchObject({
      id: 'refrigeration_compression_ratio_abnormal',
      domain: 'refrigeration',
      severity: 'alert',
      intent: 'diagnostic',
    });
  });

  it('generates liquid slugging safety stop for critical superheat', () => {
    const result = createMockResult({
      superheatStatus: 'critical',
    }, { superheat: -5 }, 'critical');

    const recs = generateRefrigerationRecommendations(result);

    expect(recs).toHaveLength(1);
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    expect(recs[0]).toMatchObject({
      id: 'refrigeration_liquid_slug_safety_stop',
      domain: 'refrigeration',
      severity: 'critical',
      intent: 'safety',
      requiresShutdown: true,
    });
  });

  it('generates water transfer abnormal recommendation', () => {
    const result = createMockResult({
      waterTransferStatus: 'alert',
    }, {}, 'alert');

    const recs = generateRefrigerationRecommendations(result);

    expect(recs).toHaveLength(1);
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    expect(recs[0]).toMatchObject({
      id: 'refrigeration_water_transfer_abnormal',
      domain: 'refrigeration',
      severity: 'alert',
      intent: 'diagnostic',
    });
  });

  it('generates preventive trending for OK status', () => {
    const result = createMockResult({}, {}, 'ok');

    const recs = generateRefrigerationRecommendations(result);

    expect(recs).toHaveLength(1);
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    expect(recs[0]).toMatchObject({
      id: 'refrigeration_preventive_trending',
      domain: 'refrigeration',
      severity: 'info',
      intent: 'diagnostic',
    });
  });

  it('generates unknown refrigerant profile informational rec', () => {
    const result = createMockResult({
      refrigerantProfile: 'unknown',
    }, {}, 'ok');

    const recs = generateRefrigerationRecommendations(result);

    expect(recs).toHaveLength(2);
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    const ids = recs.map(r => r.id).sort();
    expect(ids).toEqual(['refrigerant_profile_unknown', 'refrigeration_preventive_trending']);
  });

  it('does not generate preventive rec when status is not OK', () => {
    const result = createMockResult({
      superheatStatus: 'warning',
    }, {}, 'warning');

    const recs = generateRefrigerationRecommendations(result);

    expect(recs).toHaveLength(0); // No recs for non-OK if no specific flags
  });

  it('can generate multiple recommendations for multiple flags', () => {
    const result = createMockResult({
      superheatStatus: 'critical',
      compressionRatioStatus: 'alert',
    }, { superheat: -5 }, 'critical');

    const recs = generateRefrigerationRecommendations(result);

    expect(recs).toHaveLength(2);
    for (const r of recs) {
      expect(validateRecommendation(r)).toBe(true);
      expect(() => assertRecommendationTextSafe(r)).not.toThrow();
    }
    const ids = recs.map(r => r.id).sort();
    expect(ids).toEqual(['refrigeration_compression_ratio_abnormal', 'refrigeration_liquid_slug_safety_stop']);
  });
});
