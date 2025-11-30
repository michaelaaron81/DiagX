import { ReversingValveMeasurements, ReversingValveDiagnosis, ReversingValveConfig, ReversingValveFlags } from './reversing.types';
import { ValidationResult, DiagnosticStatus, Recommendation } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
export declare function validateReversingValveMeasurements(measurements: ReversingValveMeasurements, profile: WaterCooledUnitProfile): ValidationResult;
export declare function generateRecommendations(patternAnalysis: {
    pattern: ReversingValveFlags['patternMatch'];
    status: DiagnosticStatus;
}, solenoidStatus: ReversingValveFlags['solenoidStatus'] | undefined, measurements: ReversingValveMeasurements, profile: ReversingValveConfig): Recommendation[];
export declare function runReversingValveEngine(measurements: ReversingValveMeasurements, profile: ReversingValveConfig): ReversingValveDiagnosis;
