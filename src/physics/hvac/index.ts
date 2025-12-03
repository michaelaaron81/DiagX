/**
 * HVAC Physics Kernel
 * Phase 3.4 — Physics extraction from engines
 * 
 * This module contains all thermodynamic and heat transfer calculations
 * used across HVAC diagnostic engines. No physics is modified — only extracted.
 * 
 * @module physics/hvac
 */

import { DiagnosticStatus } from '../../shared/wshp.types';

// ============================================================================
// REFRIGERATION PHYSICS
// ============================================================================

/**
 * Compute suction superheat.
 * Superheat = Suction Line Temperature - Suction Saturation Temperature
 * 
 * @param suctionTemp - Measured suction line temperature (°F)
 * @param suctionSatTemp - Saturation temperature at suction pressure (°F)
 * @returns Superheat in °F
 */
export function computeSuperheat(suctionTemp: number, suctionSatTemp: number): number {
  return suctionTemp - suctionSatTemp;
}

/**
 * Compute liquid subcooling.
 * Subcooling = Discharge Saturation Temperature - Liquid Line Temperature
 * 
 * @param dischargeSatTemp - Saturation temperature at discharge pressure (°F)
 * @param liquidTemp - Measured liquid line temperature (°F)
 * @returns Subcooling in °F
 */
export function computeSubcooling(dischargeSatTemp: number, liquidTemp: number): number {
  return dischargeSatTemp - liquidTemp;
}

/**
 * Compute compression ratio from pressures.
 * Ratio = Discharge Pressure / Suction Pressure
 * 
 * @param dischargePressure - Discharge pressure (PSIG)
 * @param suctionPressure - Suction pressure (PSIG)
 * @returns Compression ratio (dimensionless)
 */
export function computeCompressionRatio(dischargePressure: number, suctionPressure: number): number {
  return dischargePressure / suctionPressure;
}

/**
 * Compute discharge superheat.
 * Discharge Superheat = Discharge Line Temperature - Discharge Saturation Temperature
 * 
 * @param dischargeTemp - Measured discharge line temperature (°F)
 * @param dischargeSatTemp - Saturation temperature at discharge pressure (°F)
 * @returns Discharge superheat in °F
 */
export function computeDischargeSuperheat(dischargeTemp: number, dischargeSatTemp: number): number {
  return dischargeTemp - dischargeSatTemp;
}

// ============================================================================
// AIR-SIDE PHYSICS
// ============================================================================

/**
 * Compute air temperature differential.
 * 
 * @param supplyAirTemp - Supply air temperature (°F)
 * @param returnAirTemp - Return air temperature (°F)
 * @returns Absolute temperature differential in °F
 */
export function computeAirDeltaT(supplyAirTemp: number, returnAirTemp: number): number {
  return Math.abs(supplyAirTemp - returnAirTemp);
}

/**
 * Compute airflow from sensible heat equation.
 * CFM = (Tons × 12000) / (1.08 × ΔT)
 * 
 * Where:
 * - 12000 = BTU/hr per ton
 * - 1.08 = Sensible heat factor (ρ × Cp × 60 for standard air)
 * 
 * @param nominalTons - Equipment capacity in tons
 * @param deltaT - Air temperature differential (°F)
 * @returns Estimated airflow in CFM
 */
export function computeAirflowFromDeltaT(nominalTons: number, deltaT: number): number {
  if (deltaT < 1) return 0; // Prevent divide-by-zero
  return (nominalTons * 12000) / (1.08 * deltaT);
}

/**
 * Compute CFM per ton of capacity.
 * 
 * @param cfm - Airflow in CFM
 * @param nominalTons - Equipment capacity in tons
 * @returns CFM per ton
 */
export function computeCFMPerTon(cfm: number, nominalTons: number): number {
  if (nominalTons <= 0) return 0;
  return cfm / nominalTons;
}

// ============================================================================
// HYDRONIC / WATER-SIDE PHYSICS
// ============================================================================

/**
 * Compute water temperature differential.
 * 
 * @param leavingWaterTemp - Leaving water temperature (°F)
 * @param enteringWaterTemp - Entering water temperature (°F)
 * @returns Temperature differential in °F (can be negative for directional analysis)
 */
export function computeWaterDeltaT(leavingWaterTemp: number, enteringWaterTemp: number): number {
  return leavingWaterTemp - enteringWaterTemp;
}

/**
 * Compute absolute water temperature differential.
 * 
 * @param leavingWaterTemp - Leaving water temperature (°F)
 * @param enteringWaterTemp - Entering water temperature (°F)
 * @returns Absolute temperature differential in °F
 */
export function computeWaterDeltaTAbsolute(leavingWaterTemp: number, enteringWaterTemp: number): number {
  return Math.abs(leavingWaterTemp - enteringWaterTemp);
}

/**
 * Compute expected water ΔT for a given load and flow.
 * ΔT = (Tons × 12000) / (GPM × 500)
 * 
 * Where:
 * - 12000 = BTU/hr per ton
 * - 500 = BTU/(hr·°F·GPM) water heat transfer constant
 * 
 * @param tons - Load in tons
 * @param designGPM - Design water flow rate (GPM)
 * @returns Expected temperature differential in °F
 */
export function computeExpectedWaterDeltaT(tons: number, designGPM: number): number {
  if (designGPM <= 0) return 0;
  return (tons * 12000) / (designGPM * 500);
}

/**
 * Compute heat transfer rate from water flow.
 * BTU/hr = GPM × 500 × ΔT
 * 
 * @param gpm - Water flow rate (GPM)
 * @param deltaT - Temperature differential (°F)
 * @returns Heat transfer rate in BTU/hr
 */
export function computeHydronicBTU(gpm: number, deltaT: number): number {
  return gpm * 500 * deltaT;
}

/**
 * Compute design flow GPM from load and expected ΔT.
 * GPM = (Tons × 12000) / (ΔT × 500)
 * 
 * @param tons - Load in tons
 * @param expectedDeltaT - Expected/ideal temperature differential (°F)
 * @returns Design flow rate in GPM
 */
export function computeDesignFlowGPM(tons: number, expectedDeltaT: number): number {
  if (expectedDeltaT <= 0) return 0;
  return (tons * 12000) / (expectedDeltaT * 500);
}

/**
 * Compute normalized flow index (ratio of measured to design flow).
 * 
 * @param measuredFlow - Measured flow rate (GPM)
 * @param designFlow - Design flow rate (GPM)
 * @returns Normalized flow index (1.0 = at design)
 */
export function computeNormalizedFlowIndex(measuredFlow: number, designFlow: number): number {
  if (designFlow <= 0) return 0;
  return measuredFlow / designFlow;
}

// ============================================================================
// APPROACH TEMPERATURE
// ============================================================================

/**
 * Compute approach temperature (difference between process and ambient).
 * Used for condenser approach, cooling tower approach, etc.
 * 
 * @param processTemp - Process temperature (leaving water, liquid line, etc.) (°F)
 * @param ambientTemp - Ambient reference temperature (wet bulb, dry bulb, etc.) (°F)
 * @returns Approach temperature in °F
 */
export function computeApproachTemperature(processTemp: number, ambientTemp: number): number {
  return processTemp - ambientTemp;
}

// ============================================================================
// PT CHART INTERPOLATION
// ============================================================================

/**
 * PT chart data type: Array of [temperature, pressure] pairs.
 */
export type PTChartData = Array<[number, number]>;

/**
 * Interpolate saturation temperature from pressure using PT chart data.
 * Uses linear interpolation between data points with extrapolation beyond range.
 * 
 * @param pressure - Pressure to look up (PSIG)
 * @param ptData - PT chart data array of [temp, pressure] pairs
 * @returns Saturation temperature in °F, or null if no data
 */
export function interpolatePT(pressure: number, ptData: PTChartData): number | null {
  if (!ptData || ptData.length === 0) return null;

  // Data: [tempF, pressurePsig] sorted by pressure ascending
  for (let i = 0; i < ptData.length - 1; i++) {
    const [t1, p1] = ptData[i];
    const [t2, p2] = ptData[i + 1];
    if (pressure >= p1 && pressure <= p2) {
      const ratio = (pressure - p1) / (p2 - p1);
      return t1 + ratio * (t2 - t1);
    }
  }

  // Extrapolate using nearest interval
  if (ptData.length >= 2) {
    if (pressure < ptData[0][1]) {
      const [t1, p1] = ptData[0];
      const [t2, p2] = ptData[1];
      const slope = (t2 - t1) / (p2 - p1);
      return t1 + slope * (pressure - p1);
    }
    if (pressure > ptData[ptData.length - 1][1]) {
      const [t1, p1] = ptData[ptData.length - 2];
      const [t2, p2] = ptData[ptData.length - 1];
      const slope = (t2 - t1) / (p2 - p1);
      return t2 + slope * (pressure - p2);
    }
  }

  return null;
}

/**
 * Fallback saturation temperature calculation when no PT data available.
 * Uses generic linear approximation: T = 0.215 × P + 10.5
 * 
 * @param pressure - Pressure (PSIG)
 * @returns Approximate saturation temperature in °F
 */
export function computeFallbackSaturationTemp(pressure: number): number {
  return 0.215 * pressure + 10.5;
}

// ============================================================================
// STATUS UTILITIES
// ============================================================================

/**
 * Reduce an array of diagnostic statuses to the worst (most severe) status.
 * Priority: critical > alert > warning > ok
 * 
 * @param statuses - Array of DiagnosticStatus values
 * @returns The worst status from the array
 */
export function getWorstStatus(statuses: DiagnosticStatus[]): DiagnosticStatus {
  if (statuses.includes('critical')) return 'critical';
  if (statuses.includes('alert')) return 'alert';
  if (statuses.includes('warning')) return 'warning';
  return 'ok';
}

// ============================================================================
// HEAT TRANSFER CONSTANTS
// ============================================================================

/**
 * Standard HVAC heat transfer constants.
 * These are physics constants, not configurable thresholds.
 */
export const HEAT_TRANSFER_CONSTANTS = {
  /** BTU per ton of refrigeration */
  BTU_PER_TON: 12000,
  
  /** Sensible heat factor for air (BTU/(min·°F·CFM)) = ρ × Cp × 60 */
  AIR_SENSIBLE_FACTOR: 1.08,
  
  /** Water heat transfer constant (BTU/(hr·°F·GPM)) */
  WATER_HEAT_FACTOR: 500,
  
  /** Fallback PT slope coefficient */
  FALLBACK_PT_SLOPE: 0.215,
  
  /** Fallback PT offset */
  FALLBACK_PT_OFFSET: 10.5,
} as const;
