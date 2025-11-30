import { AirsideMeasurements, AirsideEngineResult, AirsideConfig } from './airside.types';
import { DiagnosticStatus, Recommendation } from '../../shared/wshp.types';
export declare function getExpectedDeltaT(profile: AirsideConfig, mode: 'cooling' | 'heating' | 'fan_only'): {
    min: number;
    ideal: number;
    max: number;
    source: string;
};
export declare function getExpectedCFMPerTon(profile: AirsideConfig, mode: 'cooling' | 'heating' | 'fan_only'): {
    min: number;
    ideal: number;
    max: number;
    source: string;
};
export declare function requiresManufacturerDataDisclaimer(profile: AirsideConfig): boolean;
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
export declare function generateRecommendations(deltaTAnalysis: {
    status: DiagnosticStatus;
}, airflowAnalysis: {
    status: DiagnosticStatus;
}, staticPressureAnalysis: {
    status: DiagnosticStatus;
} | undefined, measurements: AirsideMeasurements, profile: AirsideConfig): Recommendation[];
export declare function runAirsideEngine(measurements: AirsideMeasurements, profile: AirsideConfig): AirsideEngineResult;
