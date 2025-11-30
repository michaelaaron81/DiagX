import { describe, it, expect } from 'vitest';
import { generateRecipRecommendations } from '../src/modules/compressor/recip.engine';
import { validateRecommendation } from '../src/shared/recommendation.schema';
import { assertRecommendationTextSafe } from './helpers/recommendationGuards';
import { DiagnosticStatus } from '../src/shared/wshp.types';

describe('reciprocating compressor recommendation generator', () => {
  it('produces critical internal bypass recommendation for very low compression', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 2.0, compressionStatus: 'critical' as DiagnosticStatus, current: undefined, currentStatus: 'ok' as DiagnosticStatus, rla: undefined, overallStatus: 'critical' as DiagnosticStatus });
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.severity === 'critical' && r.domain === 'compressor_recip')).toBeTruthy();
  });

  it('produces critical current recommendation when current >> rla', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: 80, currentStatus: 'critical' as DiagnosticStatus, rla: 50, overallStatus: 'critical' as DiagnosticStatus });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.severity === 'critical' && r.domain === 'compressor_recip')).toBeTruthy();
  });

  it('produces critical compression recommendation when compressionStatus flag is critical (flags-driven)', () => {
    // Even if compressionRatio appears not extremely low, the engine flag drives recommendations
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'critical' as DiagnosticStatus, current: undefined, currentStatus: 'ok' as DiagnosticStatus, rla: undefined, overallStatus: 'critical' as DiagnosticStatus });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'compressor_recip_internal_bypass_suspected')).toBeTruthy();
    expect(recs.some(r => r.severity === 'critical' && r.requiresShutdown === true)).toBeTruthy();
  });

  it('produces critical current recommendation even when RLA is missing', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: 90, currentStatus: 'critical' as DiagnosticStatus, rla: undefined, overallStatus: 'critical' as DiagnosticStatus });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.severity === 'critical' && r.domain === 'compressor_recip')).toBeTruthy();
  });

  it('produces critical current recommendation when flag is critical and current is missing', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: undefined, currentStatus: 'critical' as DiagnosticStatus, rla: undefined, overallStatus: 'critical' as DiagnosticStatus });
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'compressor_recip_current_far_above_rla')).toBeTruthy();
    expect(recs.some(r => r.severity === 'critical' && r.requiresShutdown === true)).toBeTruthy();
  });

  it('produces both critical recommendations when both flags are critical', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 1.0, compressionStatus: 'critical' as DiagnosticStatus, current: undefined, currentStatus: 'critical' as DiagnosticStatus, rla: undefined, overallStatus: 'critical' as DiagnosticStatus });
    expect(recs.length).toBeGreaterThanOrEqual(2);
    expect(recs.some(r => r.id === 'compressor_recip_internal_bypass_suspected')).toBeTruthy();
    expect(recs.some(r => r.id === 'compressor_recip_current_far_above_rla')).toBeTruthy();
  });

  it('produces a low-priority preventive recommendation for ok systems', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: 10, currentStatus: 'ok' as DiagnosticStatus, rla: 50, overallStatus: 'ok' as DiagnosticStatus });
    expect(recs.length).toBeGreaterThan(0);
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs[0].severity).toBeDefined();
  });

  it('produces current warning recommendation for currentStatus warning', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: 10, currentStatus: 'warning' as DiagnosticStatus, rla: 50, overallStatus: 'warning' as DiagnosticStatus });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'compressor_recip_current_low_warning')).toBeTruthy();
  });

  it('produces current alert recommendation for currentStatus alert', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: 10, currentStatus: 'alert' as DiagnosticStatus, rla: 50, overallStatus: 'alert' as DiagnosticStatus });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'compressor_recip_current_high_alert')).toBeTruthy();
  });

  it('produces unloading warning recommendation for unloadingStatus warning', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: 10, currentStatus: 'ok' as DiagnosticStatus, rla: 50, overallStatus: 'warning' as DiagnosticStatus, unloadingStatus: 'warning' as DiagnosticStatus });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'compressor_recip_unloading_partial_warning')).toBeTruthy();
  });

  it('produces unloading alert recommendation for unloadingStatus alert', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: 10, currentStatus: 'ok' as DiagnosticStatus, rla: 50, overallStatus: 'alert' as DiagnosticStatus, unloadingStatus: 'alert' as DiagnosticStatus });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'compressor_recip_unloading_abnormal_alert')).toBeTruthy();
  });

  it('produces reed valve recommendation when reedValveSuspected is true', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: 10, currentStatus: 'ok' as DiagnosticStatus, rla: 50, overallStatus: 'alert' as DiagnosticStatus, recipHealth: { reedValveSuspected: true } });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'compressor_recip_reed_valve_issue_suspected')).toBeTruthy();
  });

  it('produces piston ring wear recommendation when pistonRingWearSuspected is true', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: 10, currentStatus: 'ok' as DiagnosticStatus, rla: 50, overallStatus: 'alert' as DiagnosticStatus, recipHealth: { pistonRingWearSuspected: true } });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.some(r => r.id === 'compressor_recip_piston_ring_wear_suspected')).toBeTruthy();
  });

  it('does not produce warning/alert recommendations for ok systems', () => {
    const recs = generateRecipRecommendations({ compressionRatio: 4.0, compressionStatus: 'ok' as DiagnosticStatus, current: 10, currentStatus: 'ok' as DiagnosticStatus, rla: 50, overallStatus: 'ok' as DiagnosticStatus, unloadingStatus: 'ok' as DiagnosticStatus, recipHealth: {} });
    for (const r of recs) { expect(validateRecommendation(r)).toBe(true); expect(() => assertRecommendationTextSafe(r)).not.toThrow(); }
    expect(recs.every(r => r.severity === 'info')).toBeTruthy();
  });
});
