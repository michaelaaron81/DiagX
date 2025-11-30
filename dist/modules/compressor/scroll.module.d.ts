import { DiagnosticModule, ValidationResult, Recommendation, MeasurementHelp, DiagnosisExplanation, ModuleMetadata, ModuleHelp } from '../../shared/wshp.types';
import { ScrollCompressorMeasurements, ScrollCompressorResult, ScrollCompressorConfig } from './scroll.types';
export declare const scrollCompressorMetadata: ModuleMetadata;
export declare const scrollCompressorHelp: ModuleHelp<ScrollCompressorMeasurements>;
export declare class ScrollCompressorDiagnosticModule implements DiagnosticModule<ScrollCompressorConfig, ScrollCompressorMeasurements, ScrollCompressorResult> {
    metadata: ModuleMetadata;
    help: ModuleHelp<ScrollCompressorMeasurements>;
    validate(measurements: ScrollCompressorMeasurements): ValidationResult;
    diagnose(measurements: ScrollCompressorMeasurements, profile: ScrollCompressorConfig): ScrollCompressorResult;
    getRecommendations(diagnosis: ScrollCompressorResult): Recommendation[];
    summarizeForReport(diagnosis: ScrollCompressorResult, profile: ScrollCompressorConfig): string;
    getMeasurementHelp(field: keyof ScrollCompressorMeasurements): MeasurementHelp | undefined;
    explainDiagnosis(diagnosis: ScrollCompressorResult): DiagnosisExplanation;
}
export declare const scrollCompressorModule: ScrollCompressorDiagnosticModule;
