import { HydronicMeasurements, HydronicProfileConfig, HydronicEngineResult } from './hydronic.types';
import { ValidationResult } from '../../shared/wshp.types';
export declare const HYDRONIC_INDUSTRY_EXPECTED: {
    min: number;
    ideal: number;
    max: number;
    source: 'industry';
};
export declare function getExpectedHydronicDeltaT(profile: HydronicProfileConfig): {
    min: number;
    ideal: number;
    max: number;
    source: "industry" | "profile";
};
export declare function validateHydronicMeasurements(measurements: HydronicMeasurements): ValidationResult;
export declare function runHydronicEngine(measurements: HydronicMeasurements, context: {
    profile: HydronicProfileConfig;
}): HydronicEngineResult;
