/**
 * Electrical Physics Kernel
 * Phase 3.4 — Physics extraction from engines
 * 
 * This module contains electrical calculations used across diagnostic engines.
 * No physics is modified — only extracted.
 * 
 * @module physics/electrical
 */

// ============================================================================
// MOTOR / COMPRESSOR ELECTRICAL
// ============================================================================

/**
 * Compute percent of Rated Load Amps (RLA).
 * 
 * @param measuredCurrent - Measured running current (Amps)
 * @param rla - Rated Load Amps from nameplate
 * @returns Percentage as decimal (1.0 = 100% RLA)
 */
export function computePercentRLA(measuredCurrent: number, rla: number): number {
  if (rla <= 0) return 0;
  return measuredCurrent / rla;
}

/**
 * Voltage status result type.
 */
export type VoltageStatus = 'ok' | 'low_voltage' | 'no_voltage';

/**
 * Analyze voltage status relative to rated voltage.
 * 
 * @param actualVoltage - Measured voltage (V)
 * @param ratedVoltage - Rated/nominal voltage (V)
 * @param minRatio - Minimum acceptable ratio (default 0.85 = 85%)
 * @param noVoltageThreshold - Threshold below which is considered "no voltage" (default 2V)
 * @returns Voltage status
 */
export function analyzeVoltageStatus(
  actualVoltage: number,
  ratedVoltage: number,
  minRatio: number = 0.85,
  noVoltageThreshold: number = 2
): VoltageStatus {
  if (actualVoltage < noVoltageThreshold) {
    return 'no_voltage';
  }
  
  const minAcceptable = ratedVoltage * minRatio;
  if (actualVoltage < minAcceptable) {
    return 'low_voltage';
  }
  
  return 'ok';
}

// ============================================================================
// ELECTRICAL CONSTANTS
// ============================================================================

/**
 * Standard electrical analysis constants.
 */
export const ELECTRICAL_CONSTANTS = {
  /** Default minimum voltage ratio (85%) */
  DEFAULT_MIN_VOLTAGE_RATIO: 0.85,
  
  /** Threshold for "no voltage" detection (V) */
  NO_VOLTAGE_THRESHOLD: 2,
} as const;
