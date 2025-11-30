import { ValidationResult, ValidationIssue } from '../../shared/validation.types';
import { RefrigerationMeasurements } from './refrigeration.types';

export function validateRefrigerationMeasurements(m: RefrigerationMeasurements): ValidationResult {
  const issues: ValidationIssue[] = [];

  // 1) Missing critical fields
  if (m.suctionPressure == null) {
    issues.push({ field: 'suctionPressure', code: 'missing', message: 'Suction pressure is required for refrigeration diagnostics.', severity: 'error' });
  }
  if (m.dischargePressure == null) {
    issues.push({ field: 'dischargePressure', code: 'missing', message: 'Discharge pressure is required for refrigeration diagnostics.', severity: 'error' });
  }
  if (m.suctionTemp == null) {
    issues.push({ field: 'suctionTemp', code: 'missing', message: 'Suction temperature is required for refrigeration diagnostics.', severity: 'error' });
  }
  if (m.liquidTemp == null) {
    issues.push({ field: 'liquidTemp', code: 'missing', message: 'Liquid line temperature is required for refrigeration diagnostics.', severity: 'error' });
  }

  // If required fields are missing, short-circuit some further checks
  const hasCritical = issues.some(i => i.severity === 'error');

  if (!hasCritical) {
    // 2) Obviously impossible values (absurd pressures/temps)
    if (m.suctionPressure <= 0) {
      issues.push({ field: 'suctionPressure', code: 'impossible', message: 'Suction pressure must be greater than zero.', severity: 'error' });
    }
    if (m.dischargePressure <= 0) {
      issues.push({ field: 'dischargePressure', code: 'impossible', message: 'Discharge pressure must be greater than zero.', severity: 'error' });
    }
    if (m.dischargePressure <= m.suctionPressure) {
      issues.push({ field: 'dischargePressure', code: 'inconsistent', message: 'Discharge pressure must be greater than suction pressure.', severity: 'error' });
    }

    // Temperatures that are physically improbable (very extreme values)
    if (m.suctionTemp < -100 || m.suctionTemp > 300) {
      issues.push({ field: 'suctionTemp', code: 'out_of_range', message: 'Suction temperature is outside physically reasonable bounds.', severity: 'error' });
    }
    if (m.liquidTemp < -100 || m.liquidTemp > 400) {
      issues.push({ field: 'liquidTemp', code: 'out_of_range', message: 'Liquid temperature is outside physically reasonable bounds.', severity: 'error' });
    }

    // 3) Conservative non-fatal warnings
    if (m.enteringWaterTemp !== undefined && (m.enteringWaterTemp < 0 || m.enteringWaterTemp > 200)) {
      issues.push({ field: 'enteringWaterTemp', code: 'suspicious', message: 'Entering water temp is unusual — confirm units and sensor placement.', severity: 'warning' });
    }
    if (m.leavingWaterTemp !== undefined && (m.leavingWaterTemp < 0 || m.leavingWaterTemp > 200)) {
      issues.push({ field: 'leavingWaterTemp', code: 'suspicious', message: 'Leaving water temp is unusual — confirm units and sensor placement.', severity: 'warning' });
    }
  }

  return { ok: issues.every(i => i.severity !== 'error'), issues };
}
