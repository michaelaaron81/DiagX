import { DiagnosticStatus, Recommendation, EngineResult } from '../../shared/wshp.types';
export type RefrigerantProfileType = 'standard' | 'unknown';
export interface ReciprocatingCompressorMeasurements {
    compressorId?: string;
    suctionPressure: number;
    dischargePressure: number;
    suctionTemp: number;
    dischargeTemp?: number;
    compressorCurrent?: number;
    isRunning?: boolean;
    totalCylinders?: number;
    unloadedCylinders?: number;
    soundCharacteristics?: {
        knocking?: boolean;
        clicking?: boolean;
        hissing?: boolean;
    };
}
export interface ReciprocatingHealthFlags {
    reedValveSuspected?: boolean;
    pistonRingWearSuspected?: boolean;
}
export interface ReciprocatingUnloadingInfo {
    unloadedCount?: number;
    total?: number;
    status: DiagnosticStatus;
}
export interface ReciprocatingCompressorValues {
    compressionRatio: number;
    current?: number;
    running?: boolean;
    unloadingInfo?: {
        unloadedCount?: number;
        total?: number;
    };
}
export interface ReciprocatingCompressorFlags {
    compressionStatus: DiagnosticStatus;
    currentStatus: DiagnosticStatus;
    recipHealth?: ReciprocatingHealthFlags;
    disclaimers?: string[];
    refrigerantProfile?: RefrigerantProfileType;
}
export interface ReciprocatingCompressorResult extends EngineResult<ReciprocatingCompressorValues, ReciprocatingCompressorFlags> {
    status: DiagnosticStatus;
    compressorId?: string;
    compressionRatio: number;
    compressionStatus: DiagnosticStatus;
    current?: number;
    currentStatus: DiagnosticStatus;
    running?: boolean;
    unloadingInfo?: ReciprocatingUnloadingInfo;
    disclaimers: string[];
    recommendations: Recommendation[];
}
export type ReciprocatingCompressorConfig = Record<string, unknown> | unknown;
