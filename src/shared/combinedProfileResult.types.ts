import type { DiagnosticStatus, Recommendation } from './wshp.types';
import type { ValidationIssue } from './validation.types';
import type {
  AirsideModuleResult,
  RefrigerationModuleResult,
  ScrollCompressorModuleResult,
  ReciprocatingCompressorModuleResult,
  HydronicModuleResult,
  ReversingValveModuleResult,
  CondenserApproachModuleResult,
} from './moduleResult.types';

export interface CombinedProfileResult {
  profileId?: string;

  modules: {
    airside: AirsideModuleResult | null;
    refrigeration: RefrigerationModuleResult | null;
    compressor_scroll: ScrollCompressorModuleResult | null;
    compressor_recip: ReciprocatingCompressorModuleResult | null;
    hydronic: HydronicModuleResult | null;
    reversing_valve: ReversingValveModuleResult | null;
    condenser_approach: CondenserApproachModuleResult | null;
  };

  status: DiagnosticStatus;
  recommendations: Recommendation[];
  validation: ValidationIssue[];
  summary: string;
}
