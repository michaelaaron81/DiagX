export type DiagnosticStatus = 'ok' | 'warning' | 'alert' | 'critical';

// Core, shared recommendation contract (seed-aligned) with backward-compatible fields
export type RecommendationIntent =
  | 'diagnostic'
  | 'safety'
  | 'routing';

export type RecommendationDomain =
  | 'airside'
  | 'refrigeration'
  | 'compressor_recip'
  | 'compressor_scroll'
  | 'reversing_valve'
  | 'hydronic'
  | 'condenser_approach'
  | 'combined';

export interface Recommendation {
  // Core, diagnostic-only shared recommendation contract.
  id: string;
  domain: RecommendationDomain;
  severity: 'info' | 'advisory' | 'alert' | 'critical';
  intent: RecommendationIntent;

  // Diagnostic-only descriptive content
  summary: string;
  rationale?: string;
  notes?: string[];

  // Safety hint only; NO procedural instructions. Set true when the condition
  // indicates the equipment should not be run (without providing shutdown steps).
  requiresShutdown?: boolean;

  // Backward-compatible fields used by existing engines/modules
  // @deprecated: to be removed after migration to diagnostic-only recommendations
  // action?: string;
  // estimatedTime?: string;
  // requiredParts?: string[];
  priority?: 'critical' | 'high' | 'medium' | 'low' | 'monitor' | 'alert' | 'warning';
  module?: string;
  code?: string;
  title?: string;
  description?: string;
  reason?: string;
  safetyWarning?: string;
  // Note: removed fields that contained procedural/time/cost guidance to avoid
  // telling technicians how to perform repairs or providing price/time estimates.
  // Do NOT add fields that contain step-by-step instructions, estimated time,
  // estimated cost, or required parts; those are not permitted in exported
  // Recommendation objects for safety and liability reasons.
}

export interface EngineResult<
  V extends Record<string, any> = Record<string, number>,
  F extends Record<string, any> = Record<string, boolean>
> {
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

export interface ModuleHelp<T = any> {
  measurementHelp: Partial<Record<keyof T, MeasurementHelp>> | Record<string, MeasurementHelp>;
  diagnosticHelp?: {
    whatWeCheck?: string;
    whyItMatters?: string;
    commonIssues?: string[];
  };
  resultHelp?: Record<DiagnosticStatus, { meaning?: string; urgency?: string; typicalCauses?: string[] | null }>;
  detailedHelpPath?: string;
}

// Loosely-typed explanation payload; individual modules shape this for their UIs
export interface DiagnosisExplanation {
  [key: string]: any;
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
  // optional link to a long-form help file for this module
  detailedHelpPath?: string;
}

export interface DiagnosticContext {
  // Optional context passed into diagnosis (for logging, timestamps, user, debug)
  userId?: string;
  timestamp?: string;
  debug?: boolean;
}

export interface DiagnosticModule<TProfile = any, TMeasurements = any, TDiagnosis = any> {
  metadata: ModuleMetadata;
  help: ModuleHelp<TMeasurements>;
  validate(measurements: TMeasurements, profile: TProfile): ValidationResult;
  diagnose(measurements: TMeasurements, profile: TProfile, context?: DiagnosticContext): TDiagnosis;
  getRecommendations?(diagnosis: TDiagnosis, profile: TProfile): Recommendation[];
  summarizeForReport?(diagnosis: TDiagnosis, profile: TProfile): string;
  getMeasurementHelp?(field: keyof TMeasurements): MeasurementHelp | undefined;
  explainDiagnosis?(diagnosis: TDiagnosis): DiagnosisExplanation | any;
}

// Helpful formatters used across modules
export function formatPressure(p: number): string {
  return `${round(p, 1)} PSIG`;
}

export function formatCurrent(a: number): string {
  return `${round(a, 1)} A`;
}

export function formatVoltage(v: number): string {
  return `${Math.round(v)} V`;
}

export function formatFlow(cfm: number): string {
  return `${Math.round(cfm)} CFM`;
}

export function formatPercentage(p: number): string {
  return `${round(p * 100, 1)}%`;
}

export type DiagnosticDomain =
  | 'refrigeration'
  | 'condenser_approach'
  | 'airside'
  | 'electrical'
  | 'reversing_valve'
  | 'compressor'
  | 'water_loop'
  | 'controls';

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

export const CONSTANTS = {
  SUPERHEAT_COOLING_TXV: { min: 6, ideal: 10, max: 15 },
  SUPERHEAT_COOLING_FIXED: { min: 8, ideal: 12, max: 20 },
  SUPERHEAT_HEATING_TXV: { min: 6, ideal: 10, max: 15 },
  SUBCOOLING_WATER_COOLED: { min: 6, ideal: 10, max: 15 },
  COMPRESSION_RATIO: { min: 2.0, ideal: 3.0, max: 4.5 },
};

export function round(n: number, decimals = 2): number {
  const p = Math.pow(10, decimals);
  return Math.round(n * p) / p;
}

export function formatTemperature(t: number): string {
  return `${round(t, 1)} °F`;
}
