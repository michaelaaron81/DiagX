import { DiagnosticModule, ValidationResult, MeasurementHelp, DiagnosisExplanation, ModuleMetadata, ModuleHelp } from '../../shared/wshp.types';
import { HydronicMeasurements, HydronicProfileConfig, HydronicEngineResult } from './hydronic.types';
export declare const hydronicMetadata: ModuleMetadata;
export declare const hydronicHelp: ModuleHelp<HydronicMeasurements>;
export declare class HydronicDiagnosticModule implements DiagnosticModule<HydronicProfileConfig, HydronicMeasurements, HydronicEngineResult> {
    metadata: ModuleMetadata;
    help: ModuleHelp<HydronicMeasurements>;
    validate(measurements: HydronicMeasurements): ValidationResult;
    diagnose(measurements: HydronicMeasurements, profile: HydronicProfileConfig): HydronicEngineResult;
    getRecommendations(diagnosis: HydronicEngineResult): import("../../shared/wshp.types").Recommendation[];
    summarizeForReport(diagnosis: HydronicEngineResult, profile: HydronicProfileConfig): string;
    getMeasurementHelp(field: keyof HydronicMeasurements): MeasurementHelp | undefined;
    explainDiagnosis(diagnosis: HydronicEngineResult): DiagnosisExplanation;
}
export declare const hydronicModule: HydronicDiagnosticModule;
