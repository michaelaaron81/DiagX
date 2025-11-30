import { DiagnosticModule, ValidationResult, DiagnosisExplanation, ModuleMetadata, ModuleHelp } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
import { ReciprocatingCompressorMeasurements, ReciprocatingCompressorResult } from './recip.types';
export declare const recipCompressorMetadata: ModuleMetadata;
export declare const recipCompressorHelp: ModuleHelp<ReciprocatingCompressorMeasurements>;
export declare class ReciprocatingCompressorDiagnosticModule implements DiagnosticModule<WaterCooledUnitProfile, ReciprocatingCompressorMeasurements, ReciprocatingCompressorResult> {
    metadata: ModuleMetadata;
    help: ModuleHelp<ReciprocatingCompressorMeasurements>;
    validate(measurements: ReciprocatingCompressorMeasurements): ValidationResult;
    diagnose(measurements: ReciprocatingCompressorMeasurements, profile: WaterCooledUnitProfile): ReciprocatingCompressorResult;
    summarizeForReport(diagnosis: ReciprocatingCompressorResult): string;
    explainDiagnosis(diagnosis: ReciprocatingCompressorResult): DiagnosisExplanation;
}
export declare const recipCompressorModule: ReciprocatingCompressorDiagnosticModule;
