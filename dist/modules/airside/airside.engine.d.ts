import { AirsideMeasurements, AirsideEngineResult, AirsideConfig } from './airside.types';
import { Recommendation } from '../../shared/wshp.types';
export declare function getExpectedDeltaT(profile: AirsideConfig, mode: 'cooling' | 'heating' | 'fan_only'): any;
export declare function getExpectedCFMPerTon(profile: AirsideConfig, mode: 'cooling' | 'heating' | 'fan_only'): any;
export declare function requiresManufacturerDataDisclaimer(profile: AirsideConfig, subject: string): boolean;
export declare function getManufacturerDataDisclaimer(subject: string): string;
export declare function validateAirsideMeasurements(measurements: AirsideMeasurements): {
    valid: boolean;
    ok: boolean;
    errors: string[];
    warnings?: undefined;
} | {
    valid: boolean;
    ok: boolean;
    errors: string[] | undefined;
    warnings: string[];
};
export declare function generateRecommendations(deltaTAnalysis: any, airflowAnalysis: any, staticPressureAnalysis: any, measurements: AirsideMeasurements, profile: AirsideConfig, expectedCFM: any): Recommendation[];
export declare function runAirsideEngine(measurements: AirsideMeasurements, profile: AirsideConfig): AirsideEngineResult;
