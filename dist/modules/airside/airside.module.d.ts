import { DiagnosticModule, ValidationResult, MeasurementHelp, DiagnosisExplanation, ModuleMetadata, ModuleHelp } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
import { AirsideMeasurements, AirsideEngineResult } from './airside.types';
export declare const airsideMetadata: ModuleMetadata;
export declare const airsideHelp: ModuleHelp<AirsideMeasurements>;
export declare class AirsideDiagnosticModule implements DiagnosticModule<WaterCooledUnitProfile, AirsideMeasurements, AirsideEngineResult> {
    metadata: ModuleMetadata;
    help: ModuleHelp<AirsideMeasurements>;
    validate(measurements: AirsideMeasurements): ValidationResult;
    diagnose(measurements: AirsideMeasurements, profile: WaterCooledUnitProfile): AirsideEngineResult;
    getRecommendations(diagnosis: AirsideEngineResult): import("../../shared/wshp.types").Recommendation[];
    summarizeForReport(diagnosis: AirsideEngineResult, profile: WaterCooledUnitProfile): string;
    getMeasurementHelp(field: keyof AirsideMeasurements): MeasurementHelp | undefined;
    explainDiagnosis(diagnosis: AirsideEngineResult): DiagnosisExplanation;
}
export declare const airsideModule: AirsideDiagnosticModule;
