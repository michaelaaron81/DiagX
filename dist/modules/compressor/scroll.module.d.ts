import { DiagnosticModule, ValidationResult, Recommendation, MeasurementHelp, ModuleMetadata, ModuleHelp } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
import { ScrollCompressorMeasurements, ScrollCompressorResult, ScrollCompressorConfig } from './scroll.types';
export declare const scrollCompressorMetadata: ModuleMetadata;
export declare const scrollCompressorHelp: ModuleHelp<ScrollCompressorMeasurements>;
export declare class ScrollCompressorDiagnosticModule implements DiagnosticModule<ScrollCompressorConfig, ScrollCompressorMeasurements, ScrollCompressorResult> {
    metadata: ModuleMetadata;
    help: ModuleHelp<ScrollCompressorMeasurements>;
    validate(measurements: ScrollCompressorMeasurements): ValidationResult;
    diagnose(measurements: ScrollCompressorMeasurements, profile: ScrollCompressorConfig): ScrollCompressorResult;
    getRecommendations(diagnosis: ScrollCompressorResult): Recommendation[];
    summarizeForReport(diagnosis: ScrollCompressorResult, profile: WaterCooledUnitProfile): string;
    getMeasurementHelp(field: keyof ScrollCompressorMeasurements): MeasurementHelp;
    explainDiagnosis(diagnosis: ScrollCompressorResult): any;
}
export declare const scrollCompressorModule: ScrollCompressorDiagnosticModule;
