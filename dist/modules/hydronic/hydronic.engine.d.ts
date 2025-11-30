import { HydronicMeasurements, HydronicProfileConfig, HydronicEngineResult } from './hydronic.types';
import { ValidationResult } from '../../shared/wshp.types';
export declare const HYDRONIC_INDUSTRY_EXPECTED: any;
export declare function getExpectedHydronicDeltaT(profile: HydronicProfileConfig): any;
export declare function validateHydronicMeasurements(measurements: HydronicMeasurements): ValidationResult;
export declare function runHydronicEngine(measurements: HydronicMeasurements, context: {
    profile: HydronicProfileConfig;
}): HydronicEngineResult;
