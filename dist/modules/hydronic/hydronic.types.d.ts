import { DiagnosticStatus, Recommendation } from '../../shared/wshp.types';
export interface HydronicMeasurements {
    enteringWaterTemp: number | null;
    leavingWaterTemp: number | null;
    flowRateGPM: number | null;
    enteringLoopTemp?: number | null;
    leavingLoopTemp?: number | null;
}
export interface HydronicProfileConfig {
    designFlowGPM?: number | null;
    expectedDeltaT?: {
        min: number;
        ideal: number;
        max: number;
        source: 'industry' | 'profile';
    } | null;
    loopType?: 'open_tower' | 'closed_loop' | 'closed_tower' | 'boiler' | 'ground_loop' | 'well' | 'lake' | 'other';
}
export interface HydronicValues {
    waterDeltaT: number | null;
    flowRateGPM: number | null;
    expectedDeltaT?: {
        min: number;
        ideal: number;
        max: number;
        source: 'industry' | 'profile';
    } | null;
}
export type HydronicDeltaTStatus = 'unknown' | 'ok' | 'warning' | 'alert' | 'critical';
export type HydronicFlowStatus = 'unknown' | 'ok' | 'warning' | 'alert' | 'critical';
export interface HydronicFlags {
    deltaTStatus: HydronicDeltaTStatus;
    flowStatus: HydronicFlowStatus;
    disclaimers: string[];
}
export interface HydronicEngineResult {
    status: DiagnosticStatus;
    values: HydronicValues;
    flags: HydronicFlags;
    recommendations: Recommendation[];
}
export interface HydronicEngineContext {
    profile: HydronicProfileConfig;
}
export type HydronicEngine = (measurements: HydronicMeasurements, context: HydronicEngineContext) => HydronicEngineResult;
