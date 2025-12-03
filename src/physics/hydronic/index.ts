/**
 * Hydronic Physics Kernel
 * Phase 3.4 — Physics extraction from engines
 * 
 * This module re-exports hydronic-specific functions from the HVAC kernel
 * and provides any hydronic-specific constants or utilities.
 * 
 * @module physics/hydronic
 */

// Re-export hydronic-related functions from HVAC kernel
export {
  computeWaterDeltaT,
  computeWaterDeltaTAbsolute,
  computeExpectedWaterDeltaT,
  computeHydronicBTU,
  computeDesignFlowGPM,
  computeNormalizedFlowIndex,
  computeApproachTemperature,
  HEAT_TRANSFER_CONSTANTS,
} from '../hvac/index';

// ============================================================================
// HYDRONIC-SPECIFIC CONSTANTS
// ============================================================================

/**
 * Industry default expected hydronic ΔT values.
 * These are defaults when no manufacturer data is available.
 */
export const HYDRONIC_INDUSTRY_DEFAULTS = {
  /** Standard chilled water / condenser water ΔT range */
  EXPECTED_DELTA_T: {
    min: 10,
    ideal: 12,
    max: 14,
    source: 'industry' as const,
  },
} as const;

/**
 * Open tower / dry cooler approach defaults.
 */
export const HYDRONIC_SOURCE_DEFAULTS = {
  /** Expected approach for open cooling tower (to wet bulb) */
  OPEN_TOWER_APPROACH: {
    min: 5,
    ideal: 7,
    max: 10,
  },
  
  /** Expected approach for dry cooler (to dry bulb) */
  DRY_COOLER_APPROACH: {
    min: 10,
    ideal: 15,
    max: 25,
  },
} as const;
