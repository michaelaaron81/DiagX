import { DiagnosticStatus, EngineResult } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';

export interface AirsideMeasurements {
  returnAirTemp: number;
  supplyAirTemp: number;
  returnAirRH?: number;
  supplyAirRH?: number;
  returnPlenum?: number;
  supplyPlenum?: number;
  externalStatic?: number; // in. W.C.
  mode: 'cooling' | 'heating' | 'fan_only';
  wetBulbTemp?: number;
  supplyWetBulb?: number;
  airVelocity?: number;
  measuredCFM?: number;
  /** Technician-supplied airflow override in CFM */
  airflowCFMOverride?: number;
  /** Optional technician note explaining the override source/method */
  airflowOverrideNote?: string;
  /** Total external static pressure (supply + return) in inches W.C. */
  totalExternalStatic?: number;
}

/** Source of the authoritative airflow value used in engine calculations */
export type AirflowSource = 'inferred_deltaT' | 'technician_override' | 'measured';

export interface AirsideEngineValues {
  deltaT: number;
  expectedDeltaT: { min: number; ideal: number; max: number; source: string };
  estimatedCFM?: number;
  measuredCFM?: number;
  /** Authoritative airflow value used for calculations (may be override, measured, or inferred) */
  airflowCFM?: number;
  /** Source of the authoritative airflowCFM value */
  airflowSource?: AirflowSource;
  cfmPerTon?: number;
  expectedCFMPerTon: { min: number; ideal: number; max: number; source: string };
  totalESP?: number;
  ratedESP?: { design: number; max: number };
  sensibleHeatRatio?: number;
}

export interface AirsideEngineFlags {
  mode: 'cooling' | 'heating' | 'fan_only';
  deltaTStatus: DiagnosticStatus;
  deltaTSource: 'manufacturer' | 'calculated' | 'industry';
  cfmSource: 'manufacturer' | 'nameplate_calculated' | 'industry';
  airflowStatus: DiagnosticStatus;
  staticPressureStatus?: DiagnosticStatus;
  humidityRemovalStatus?: DiagnosticStatus;
  disclaimers: string[];
}

// EngineResult-based core with flattened, backward-compatible fields for existing callers
export interface AirsideEngineResult extends EngineResult<AirsideEngineValues, AirsideEngineFlags> {
  mode: 'cooling' | 'heating' | 'fan_only';

  deltaT: number;
  deltaTStatus: DiagnosticStatus;
  expectedDeltaT: { min: number; ideal: number; max: number; source: string };
  deltaTSource: 'manufacturer' | 'calculated' | 'industry';

  estimatedCFM?: number;
  measuredCFM?: number;
  /** Authoritative airflow value used for calculations */
  airflowCFM?: number;
  /** Source of the authoritative airflowCFM value */
  airflowSource?: AirflowSource;
  cfmPerTon?: number;
  expectedCFMPerTon: { min: number; ideal: number; max: number; source: string };
  cfmSource: 'manufacturer' | 'nameplate_calculated' | 'industry';
  airflowStatus: DiagnosticStatus;

  staticPressureStatus?: DiagnosticStatus;
  totalESP?: number;
  ratedESP?: { design: number; max: number };

  humidityRemovalStatus?: DiagnosticStatus;
  sensibleHeatRatio?: number;

  // overallFinding is presentation layer and not part of core engine outputs

  disclaimers: string[];
}

export type AirsideConfig = WaterCooledUnitProfile;

// Phase-3 alias to align with canonical naming
export type AirsideValues = AirsideEngineValues;

// Note: prefer named exports only — avoid default exports for types to keep imports explicit
