import { DiagnosticModule, ValidationResult, MeasurementHelp, DiagnosisExplanation, ModuleMetadata, ModuleHelp } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
import { ReversingValveMeasurements, ReversingValveDiagnosis } from './reversing.types';
export declare const reversingValveMetadata: ModuleMetadata;
export declare const reversingValveHelp: ModuleHelp<ReversingValveMeasurements>;
export declare class ReversingValveDiagnosticModule implements DiagnosticModule<WaterCooledUnitProfile, ReversingValveMeasurements, ReversingValveDiagnosis> {
    metadata: ModuleMetadata;
    help: ModuleHelp<ReversingValveMeasurements>;
    validate(measurements: ReversingValveMeasurements, profile: WaterCooledUnitProfile): ValidationResult;
    diagnose(measurements: ReversingValveMeasurements, profile: WaterCooledUnitProfile): ReversingValveDiagnosis;
    getRecommendations(diagnosis: ReversingValveDiagnosis): import("../../shared/wshp.types").Recommendation[];
    summarizeForReport(diagnosis: ReversingValveDiagnosis, profile: WaterCooledUnitProfile): string;
    getMeasurementHelp(field: keyof ReversingValveMeasurements): MeasurementHelp;
    explainDiagnosis(diagnosis: ReversingValveDiagnosis): DiagnosisExplanation;
}
export declare const reversingValveModule: ReversingValveDiagnosticModule;
