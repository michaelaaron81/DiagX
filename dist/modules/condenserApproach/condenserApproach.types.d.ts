import { EngineResult } from '../../shared/wshp.types';
export interface CondenserApproachMeasurements {
    ambientTemp?: number | null;
    condensingPressure?: number | null;
    liquidLineTemp?: number | null;
}
export interface CondenserApproachProfile {
    refrigerantType?: string;
    expectedApproach?: {
        min: number;
        ideal: number;
        max: number;
        source?: string;
    } | null;
}
export interface CondenserApproachValues {
    condenserApproach: number | null;
    condensingSatTemp?: number | null;
    liquidSubcooling?: number | null;
}
export type CondenserStatus = 'unknown' | 'ok' | 'warning' | 'alert' | 'critical';
export interface CondenserApproachFlags {
    approachStatus: CondenserStatus;
    subcoolingStatus: CondenserStatus;
    refrigerantProfile?: 'standard' | 'unknown_curve' | 'standard_override';
}
export type CondenserApproachResult = EngineResult<CondenserApproachValues, CondenserApproachFlags>;
