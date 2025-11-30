import { EngineResult } from '../../shared/wshp.types';

export interface CondenserApproachMeasurements {
  ambientTemp?: number | null;
  condensingPressure?: number | null; // psig
  liquidLineTemp?: number | null;
}

export interface CondenserApproachProfile {
  refrigerantType?: string;
  expectedApproach?: { min: number; ideal: number; max: number; source?: string } | null;
}

export interface CondenserApproachValues {
  condenserApproach: number | null; // liquidTemp - ambient (°F) or derived
  condensingSatTemp?: number | null; // saturation temp computed from condensingPressure
  liquidSubcooling?: number | null; // liquidLineTemp - condensingSatTemp
}

export type CondenserStatus = 'unknown' | 'ok' | 'warning' | 'alert' | 'critical';

export interface CondenserApproachFlags {
  approachStatus: CondenserStatus;
  subcoolingStatus: CondenserStatus;
  refrigerantProfile?: 'standard' | 'unknown_curve' | 'standard_override';
}

export type CondenserApproachResult = EngineResult<CondenserApproachValues, CondenserApproachFlags>;
