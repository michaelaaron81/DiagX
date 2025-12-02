import { ValidationIssue, ValidationResult } from '../../shared/validation.types';
import { AirsideMeasurements } from './airside.types';

/**
 * Result of airflow override plausibility check
 */
export interface AirflowOverrideCheckResult {
  /** Whether the override passes physics-based plausibility checks */
  accepted: boolean;
  /** Reason for rejection if not accepted */
  reason?: string;
  /** CFM per ton derived from the override value */
  cfmPerTon?: number;
  /** TESP used in validation (in. W.C.) */
  tespUsed?: number;
}

/**
 * Physics-based CFM/ton bounds by TESP range (industry standards)
 * Lower TESP = higher airflow possible; Higher TESP = restricted airflow
 */
const CFM_PER_TON_BY_TESP: Array<{ tespMax: number; cfmMin: number; cfmMax: number }> = [
  { tespMax: 0.3, cfmMin: 300, cfmMax: 550 },
  { tespMax: 0.5, cfmMin: 280, cfmMax: 500 },
  { tespMax: 0.7, cfmMin: 250, cfmMax: 450 },
  { tespMax: 1.0, cfmMin: 200, cfmMax: 400 },
  { tespMax: Infinity, cfmMin: 150, cfmMax: 350 }, // High restriction scenario
];

/**
 * Get CFM/ton bounds for a given TESP value
 */
function getCFMBoundsForTESP(tesp: number): { cfmMin: number; cfmMax: number } {
  for (const band of CFM_PER_TON_BY_TESP) {
    if (tesp <= band.tespMax) {
      return { cfmMin: band.cfmMin, cfmMax: band.cfmMax };
    }
  }
  // Fallback to most restrictive
  return { cfmMin: 150, cfmMax: 350 };
}

/**
 * Validates a technician-supplied airflow override against physics-based plausibility.
 * Uses TESP (Total External Static Pressure) and CFM/ton bounds to gate acceptance.
 * 
 * @param overrideCFM - Technician-supplied airflow in CFM
 * @param nominalTons - Equipment nominal capacity in tons
 * @param tesp - Total external static pressure in inches W.C. (optional)
 * @returns AirflowOverrideCheckResult indicating acceptance or rejection with reason
 */
export function validateAirflowOverrideCFM(
  overrideCFM: number,
  nominalTons: number,
  tesp?: number
): AirflowOverrideCheckResult {
  // Guard: nominal tons must be positive
  if (!nominalTons || nominalTons <= 0) {
    return {
      accepted: false,
      reason: 'Cannot validate override: nominalTons missing or invalid in profile.',
    };
  }

  // Guard: override must be positive
  if (overrideCFM <= 0) {
    return {
      accepted: false,
      reason: 'Airflow override must be a positive value.',
      cfmPerTon: 0,
    };
  }

  const cfmPerTon = overrideCFM / nominalTons;

  // Use TESP if provided, otherwise use conservative default (0.5 in. W.C.)
  const tespUsed = tesp ?? 0.5;
  const bounds = getCFMBoundsForTESP(tespUsed);

  // Check if CFM/ton falls within physics-based bounds
  if (cfmPerTon < bounds.cfmMin) {
    return {
      accepted: false,
      reason: `Override rejected: ${Math.round(cfmPerTon)} CFM/ton is below minimum ${bounds.cfmMin} CFM/ton for TESP ${tespUsed.toFixed(2)} in. W.C.`,
      cfmPerTon: Math.round(cfmPerTon),
      tespUsed,
    };
  }

  if (cfmPerTon > bounds.cfmMax) {
    return {
      accepted: false,
      reason: `Override rejected: ${Math.round(cfmPerTon)} CFM/ton exceeds maximum ${bounds.cfmMax} CFM/ton for TESP ${tespUsed.toFixed(2)} in. W.C.`,
      cfmPerTon: Math.round(cfmPerTon),
      tespUsed,
    };
  }

  // Override passes plausibility checks
  return {
    accepted: true,
    cfmPerTon: Math.round(cfmPerTon),
    tespUsed,
  };
}

export function validateAirsideMeasurements(m: AirsideMeasurements): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Missing critical fields
  if (m.returnAirTemp == null) {
    issues.push({ field: 'returnAirTemp', code: 'missing', message: 'Return air temperature is required for airside diagnostics.', severity: 'error' });
  }
  if (m.supplyAirTemp == null) {
    issues.push({ field: 'supplyAirTemp', code: 'missing', message: 'Supply air temperature is required for airside diagnostics.', severity: 'error' });
  }

  // Obvious impossible values
  if (m.returnAirTemp != null && (m.returnAirTemp < -100 || m.returnAirTemp > 300)) {
    issues.push({ field: 'returnAirTemp', code: 'out_of_range', message: 'Return air temperature is outside reasonable bounds.', severity: 'error' });
  }
  if (m.supplyAirTemp != null && (m.supplyAirTemp < -100 || m.supplyAirTemp > 300)) {
    issues.push({ field: 'supplyAirTemp', code: 'out_of_range', message: 'Supply air temperature is outside reasonable bounds.', severity: 'error' });
  }

  // Conservative warning: suspicious humidity values
  if (m.returnAirRH !== undefined && (m.returnAirRH < 0 || m.returnAirRH > 100)) {
    issues.push({ field: 'returnAirRH', code: 'suspicious', message: 'Return air relative humidity outside 0-100%.', severity: 'warning' });
  }

  // delta-T too small may indicate not running (fatal)
  if (m.returnAirTemp != null && m.supplyAirTemp != null) {
    const deltaT = Math.abs(m.supplyAirTemp - m.returnAirTemp);
    if (deltaT < 0.5) {
      issues.push({ field: 'deltaT', code: 'impossible', message: 'Measured Delta-T is too small (<0.5°F) — unit may not be running or sensors misread.', severity: 'error' });
    }
  }

  return { ok: issues.every(i => i.severity !== 'error'), issues };
}
