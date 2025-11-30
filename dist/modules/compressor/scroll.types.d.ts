import { DiagnosticStatus, Recommendation, EngineResult } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
export interface ScrollCompressorMeasurements {
    mode: 'cooling' | 'heating';
    suctionPressure: number;
    dischargePressure: number;
    suctionTemp: number;
    dischargeTemp?: number;
    runningCurrent?: number;
    voltage?: number;
    isRunning?: boolean;
}
export interface ScrollCompressorValues {
    suctionPressure: number;
    dischargePressure: number;
    compressionRatio: number;
    dischargeSuperheat?: number;
    currentDraw?: number;
}
export interface ScrollCompressorFlags {
    currentStatus?: DiagnosticStatus;
    compressionStatus?: DiagnosticStatus;
    disclaimers?: string[];
}
export interface ScrollCompressorResult extends EngineResult<ScrollCompressorValues, ScrollCompressorFlags> {
    status: DiagnosticStatus;
    compressorType: 'scroll';
    suctionPressure: number;
    dischargePressure: number;
    compressionRatio: number;
    dischargeSuperheat?: number;
    currentDraw?: number;
    currentStatus?: DiagnosticStatus;
    compressionStatus?: DiagnosticStatus;
    disclaimers?: string[];
    recommendations: Recommendation[];
}
export type ScrollCompressorConfig = WaterCooledUnitProfile;
