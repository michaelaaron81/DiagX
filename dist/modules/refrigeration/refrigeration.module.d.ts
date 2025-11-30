import { DiagnosticModule, ValidationResult, MeasurementHelp, DiagnosisExplanation, ModuleMetadata, ModuleHelp } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
import { RefrigerationMeasurements } from './refrigeration.types';
import { RefrigerationEngineResult } from './refrigeration.engine';
export declare const refrigerationMetadata: ModuleMetadata;
export declare const refrigerationHelp: ModuleHelp<RefrigerationMeasurements>;
export declare class RefrigerationDiagnosticModule implements DiagnosticModule<WaterCooledUnitProfile, RefrigerationMeasurements, RefrigerationEngineResult> {
    metadata: ModuleMetadata;
    help: ModuleHelp<RefrigerationMeasurements>;
    validate(measurements: RefrigerationMeasurements): ValidationResult;
    diagnose(measurements: RefrigerationMeasurements, profile: WaterCooledUnitProfile): RefrigerationEngineResult;
    getRecommendations(diagnosis: RefrigerationEngineResult): import("../../shared/wshp.types").Recommendation[];
    summarizeForReport(diagnosis: RefrigerationEngineResult, profile: WaterCooledUnitProfile): string;
    getMeasurementHelp(field: keyof RefrigerationMeasurements): MeasurementHelp | undefined;
    explainDiagnosis(diagnosis: RefrigerationEngineResult): DiagnosisExplanation;
}
export declare const refrigerationModule: RefrigerationDiagnosticModule;
