export type DiagnosticStatus = 'ok' | 'warning' | 'alert' | 'critical';
export type RecommendationIntent = 'diagnostic' | 'safety' | 'routing';
export type RecommendationDomain = 'airside' | 'refrigeration' | 'compressor_recip' | 'compressor_scroll' | 'reversing_valve' | 'hydronic' | 'condenser_approach' | 'combined';
export interface Recommendation {
    id: string;
    domain: RecommendationDomain;
    severity: 'info' | 'advisory' | 'alert' | 'critical';
    intent: RecommendationIntent;
    summary: string;
    rationale?: string;
    notes?: string[];
    requiresShutdown?: boolean;
}
export interface EngineResult<V extends object = Record<string, unknown>, F extends object = Record<string, unknown>> {
    status: DiagnosticStatus;
    values: V;
    flags: F;
    recommendations: Recommendation[];
}
export interface ValidationResult {
    valid: boolean;
    ok?: boolean;
    errors?: string[];
    warnings?: string[];
}
export interface MeasurementHelp {
    field?: string;
    label?: string;
    description?: string;
    howToMeasure?: string;
    units?: string;
    typicalRange?: string;
    tools?: string[];
    safetyWarnings?: string[];
}
export interface ModuleHelp<T = Record<string, unknown>> {
    measurementHelp: Partial<Record<keyof T, MeasurementHelp>> | Record<string, MeasurementHelp>;
    diagnosticHelp?: {
        whatWeCheck?: string;
        whyItMatters?: string;
        commonIssues?: string[];
    };
    resultHelp?: Record<DiagnosticStatus, {
        meaning?: string;
        urgency?: string;
        typicalCauses?: string[] | null;
    }>;
    detailedHelpPath?: string;
}
export interface DiagnosisExplanation {
    [key: string]: unknown;
}
export interface ActionSteps {
    actions: string[];
}
export interface ModuleMetadata {
    id?: string;
    name: string;
    domain?: string;
    version?: string;
    description?: string;
    compatibleEquipment?: string[];
    requiredProfileFields?: string[];
    detailedHelpPath?: string;
}
export interface DiagnosticContext {
    userId?: string;
    timestamp?: string;
    debug?: boolean;
}
export interface DiagnosticModule<TProfile = Record<string, unknown>, TMeasurements = Record<string, unknown>, TDiagnosis = Record<string, unknown>> {
    metadata: ModuleMetadata;
    help: ModuleHelp<TMeasurements>;
    validate(measurements: TMeasurements, profile: TProfile): ValidationResult;
    diagnose(measurements: TMeasurements, profile: TProfile, context?: DiagnosticContext): TDiagnosis;
    getRecommendations?(diagnosis: TDiagnosis, profile: TProfile): Recommendation[];
    summarizeForReport?(diagnosis: TDiagnosis, profile: TProfile): string;
    getMeasurementHelp?(field: keyof TMeasurements): MeasurementHelp | undefined;
    explainDiagnosis?(diagnosis: TDiagnosis): DiagnosisExplanation | unknown;
}
export declare function formatPressure(p: number): string;
export declare function formatCurrent(a: number): string;
export declare function formatVoltage(v: number): string;
export declare function formatFlow(cfm: number): string;
export declare function formatPercentage(p: number): string;
export type DiagnosticDomain = 'refrigeration' | 'condenser_approach' | 'airside' | 'electrical' | 'reversing_valve' | 'compressor' | 'water_loop' | 'controls';
export interface DomainFinding {
    code: string;
    severity: DiagnosticStatus;
    message: string;
    relatedMeasurements: string[];
}
export interface DomainResult<TDetails = unknown> {
    domain: DiagnosticDomain;
    ok: boolean;
    findings: DomainFinding[];
    details?: TDetails;
}
export declare const CONSTANTS: {
    SUPERHEAT_COOLING_TXV: {
        min: number;
        ideal: number;
        max: number;
    };
    SUPERHEAT_COOLING_FIXED: {
        min: number;
        ideal: number;
        max: number;
    };
    SUPERHEAT_HEATING_TXV: {
        min: number;
        ideal: number;
        max: number;
    };
    SUBCOOLING_WATER_COOLED: {
        min: number;
        ideal: number;
        max: number;
    };
    COMPRESSION_RATIO: {
        min: number;
        ideal: number;
        max: number;
    };
};
export declare function round(n: number, decimals?: number): number;
export declare function formatTemperature(t: number): string;
