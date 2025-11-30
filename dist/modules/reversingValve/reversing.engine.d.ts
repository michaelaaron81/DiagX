import { ReversingValveMeasurements, ReversingValveDiagnosis, ReversingValveConfig } from './reversing.types';
import { ValidationResult, Recommendation } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
export declare function validateReversingValveMeasurements(measurements: ReversingValveMeasurements, profile: WaterCooledUnitProfile): ValidationResult;
export declare function generateRecommendations(patternAnalysis: any, solenoidStatus: any, measurements: ReversingValveMeasurements, profile: ReversingValveConfig): Recommendation[];
export declare function runReversingValveEngine(measurements: ReversingValveMeasurements, profile: ReversingValveConfig): ReversingValveDiagnosis;
