/**
 * Physics Kernel — Main Entry Point
 * Phase 3.4 — Centralized physics calculations
 * 
 * This is the main entry point for all physics calculations used by DiagX engines.
 * Import from this module to access all physics functions.
 * 
 * @module physics
 */

// HVAC Physics (thermodynamics, heat transfer, refrigeration)
export * from './hvac/index';

// Electrical Physics (motor/compressor electrical)
export * from './electrical/index';

// Hydronic Physics (water-side, includes re-exports from HVAC)
export {
  HYDRONIC_INDUSTRY_DEFAULTS,
  HYDRONIC_SOURCE_DEFAULTS,
} from './hydronic/index';
