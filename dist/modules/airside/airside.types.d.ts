import { DiagnosticStatus, EngineResult } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
export interface AirsideMeasurements {
    returnAirTemp: number;
    supplyAirTemp: number;
    returnAirRH?: number;
    supplyAirRH?: number;
    returnPlenum?: number;
    supplyPlenum?: number;
    externalStatic?: number;
    mode: 'cooling' | 'heating' | 'fan_only';
    wetBulbTemp?: number;
    supplyWetBulb?: number;
    airVelocity?: number;
    measuredCFM?: number;
}
export interface AirsideEngineValues {
    deltaT: number;
    expectedDeltaT: {
        min: number;
        ideal: number;
        max: number;
        source: string;
    };
    estimatedCFM?: number;
    measuredCFM?: number;
    cfmPerTon?: number;
    expectedCFMPerTon: {
        min: number;
        ideal: number;
        max: number;
        source: string;
    };
    totalESP?: number;
    ratedESP?: {
        design: number;
        max: number;
    };
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
export interface AirsideEngineResult extends EngineResult<AirsideEngineValues, AirsideEngineFlags> {
    mode: 'cooling' | 'heating' | 'fan_only';
    deltaT: number;
    deltaTStatus: DiagnosticStatus;
    expectedDeltaT: {
        min: number;
        ideal: number;
        max: number;
        source: string;
    };
    deltaTSource: 'manufacturer' | 'calculated' | 'industry';
    estimatedCFM?: number;
    measuredCFM?: number;
    cfmPerTon?: number;
    expectedCFMPerTon: {
        min: number;
        ideal: number;
        max: number;
        source: string;
    };
    cfmSource: 'manufacturer' | 'nameplate_calculated' | 'industry';
    airflowStatus: DiagnosticStatus;
    staticPressureStatus?: DiagnosticStatus;
    totalESP?: number;
    ratedESP?: {
        design: number;
        max: number;
    };
    humidityRemovalStatus?: DiagnosticStatus;
    sensibleHeatRatio?: number;
    disclaimers: string[];
}
export type AirsideConfig = WaterCooledUnitProfile;
