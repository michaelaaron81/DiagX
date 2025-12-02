import { WaterCooledUnitProfile } from './wshp.profile';
import { DomainResult, DiagnosticStatus, DomainFinding, Recommendation } from '../shared/wshp.types';
import { ValidationIssue } from '../shared/validation.types';
import { RefrigerationMeasurements } from '../modules/refrigeration/refrigeration.types';
import { runRefrigerationDomain } from '../modules/refrigeration/refrigeration.domain';
import { RefrigerationEngineResult } from '../modules/refrigeration/refrigeration.engine';
import { hydronicModule } from '../modules/hydronic/hydronic.module';
import { HydronicMeasurements } from '../modules/hydronic/hydronic.types';
import { condenserApproachModule } from '../modules/condenserApproach/condenserApproach.module';
import { runAirsideEngine } from '../modules/airside/airside.engine';
import { AirsideMeasurements, AirsideEngineResult } from '../modules/airside/airside.types';
import { runReciprocatingCompressorEngine } from '../modules/compressor/recip.engine';
import { ReciprocatingCompressorResult, ReciprocatingCompressorMeasurements } from '../modules/compressor/recip.types';
import { runScrollCompressorEngine } from '../modules/compressor/scroll.engine';
import { ScrollCompressorResult, ScrollCompressorMeasurements } from '../modules/compressor/scroll.types';
import { runReversingValveEngine } from '../modules/reversingValve/reversing.engine';
import { ReversingValveDiagnosis, ReversingValveMeasurements } from '../modules/reversingValve/reversing.types';
import { buildRefrigerationConfigFromWSHP } from './wshp.config.refrigeration';

import type { ProfileInputSchema, CompletenessLevel } from '../shared/profileInput.types';
import type { CombinedProfileResult } from '../shared/combinedProfileResult.types';
import type {
  ModuleResult,
  AirsideModuleResult,
  RefrigerationModuleResult,
  HydronicModuleResult,
  CondenserApproachModuleResult,
  ReciprocatingCompressorModuleResult,
  ScrollCompressorModuleResult,
  ReversingValveModuleResult,
} from '../shared/moduleResult.types';
import { runTierAValidation } from '../validation/tierA';
import { classifyCompleteness, CompletenessClassification } from '../shared/completeness';

export type WshpDiagxInput = ProfileInputSchema;

// Legacy result shape for backward compatibility
export interface WshpDiagxResult {
  profileId?: string;
  domainResults: DomainResult[];
  overallStatus: DiagnosticStatus;
}

/**
 * Legacy orchestrator function - maintains backward compatibility with existing tests.
 * Returns raw engine results in domainResults[].details for existing callers.
 */
export function runWshpDiagx(input: WshpDiagxInput): WshpDiagxResult {
  const { profile, measurements } = input;
  const domainResults: DomainResult[] = [];

  let airResult: AirsideEngineResult | undefined = undefined;
  let refResult: DomainResult<RefrigerationEngineResult> | undefined = undefined;
  let recipResult: ReciprocatingCompressorResult | undefined = undefined;
  let scrollResult: ScrollCompressorResult | undefined = undefined;
  let revResult: ReversingValveDiagnosis | undefined = undefined;

  if (measurements.airside) {
    airResult = runAirsideEngine(measurements.airside as unknown as AirsideMeasurements, profile);
    domainResults.push({ domain: 'airside', ok: airResult.status === 'ok', findings: [], details: airResult });
  }

  if (measurements.refrigeration) {
    const cfg = buildRefrigerationConfigFromWSHP(profile);
    // Cast to full type - orchestrator guards ensure required fields present at runtime
    refResult = runRefrigerationDomain(measurements.refrigeration as RefrigerationMeasurements, cfg);
    domainResults.push(refResult);
  }

  // Hydronic source diagnostics: run when profile.waterSide present and refrigeration measurements include water temps
  if (profile.waterSide && measurements.refrigeration && (measurements.refrigeration.enteringWaterTemp !== undefined || measurements.refrigeration.leavingWaterTemp !== undefined)) {
    try {
      const hydMeasurements: HydronicMeasurements = {
        enteringWaterTemp: measurements.refrigeration.enteringWaterTemp ?? null,
        leavingWaterTemp: measurements.refrigeration.leavingWaterTemp ?? null,
        flowRateGPM: profile.waterSide?.flowRate ?? null,
      };
      const expectedDelta = profile.waterSide?.expectedDeltaT
        ? { ...profile.waterSide.expectedDeltaT, source: 'profile' as const }
        : undefined;
      const hydResult = hydronicModule.diagnose(hydMeasurements, { designFlowGPM: profile.waterSide?.flowRate, expectedDeltaT: expectedDelta, loopType: profile.waterSide?.loopType });
      domainResults.push({ domain: 'water_loop', ok: hydResult.status === 'ok', findings: [], details: hydResult });
    } catch (e) {
      // ignore failures here to keep orchestrator resilient
    }
  }

  if (measurements.recipCompressor) {
    recipResult = runReciprocatingCompressorEngine(measurements.recipCompressor as unknown as ReciprocatingCompressorMeasurements, profile);
    domainResults.push({ domain: 'compressor', ok: recipResult.status === 'ok', findings: [], details: recipResult });
  }

  // Condenser approach diagnostics: run when ambient + condensing pressure present in measurements.refrigeration
  if (measurements.refrigeration && (measurements.refrigeration.ambientTemp !== undefined || measurements.refrigeration.condensingPressure !== undefined)) {
    try {
      const cMeasurements: import('../modules/condenserApproach/condenserApproach.types').CondenserApproachMeasurements = {
        ambientTemp: measurements.refrigeration.ambientTemp ?? null,
        condensingPressure: measurements.refrigeration.condensingPressure ?? null,
        liquidLineTemp: measurements.refrigeration.liquidTemp ?? null,
      };
      const cProfile: import('../modules/condenserApproach/condenserApproach.types').CondenserApproachProfile = { refrigerantType: profile.refrigeration?.refrigerantType };
      const cResult = condenserApproachModule.diagnose(cMeasurements, cProfile);
      domainResults.push({ domain: 'condenser_approach', ok: cResult.status === 'ok', findings: [], details: cResult });
    } catch (e) {
      // keep orchestrator stable on unexpected module errors
    }
  }

  if (measurements.scrollCompressor) {
    scrollResult = runScrollCompressorEngine(measurements.scrollCompressor as unknown as ScrollCompressorMeasurements, profile);
    domainResults.push({ domain: 'compressor', ok: scrollResult.status === 'ok', findings: [], details: scrollResult });
  }

  if (measurements.reversingValve) {
    revResult = runReversingValveEngine(measurements.reversingValve as unknown as ReversingValveMeasurements, profile);
    domainResults.push({ domain: 'reversing_valve', ok: revResult.status === 'ok', findings: [], details: revResult });
  }

  const overallStatus = reduceOverallStatus(domainResults);

  // Correlation rules (orchestrator-level)
  const correlations: DomainFinding[] = [];

  // If airside is critical, add a system-level advisory to avoid compressor operation
  if (airResult && airResult.flags && (airResult.flags.deltaTStatus === 'critical' || airResult.flags.airflowStatus === 'critical')) {
    correlations.push({ code: 'SYS_AIRSIDE_CRITICAL', severity: 'critical', message: 'Severe airside restriction detected — do not operate refrigeration or compressors until airside restriction is cleared and evaporator inspected.', relatedMeasurements: ['airside.deltaT', 'airside.measuredCFM'] });
  }

  // If refrigeration indicates liquid slugging risk (superheat critical), require immediate stop
  if (refResult && refResult.details && refResult.details.flags && refResult.details.flags.superheatStatus === 'critical') {
    correlations.push({ code: 'SYS_REFRIGERATION_SLUG_RISK', severity: 'critical', message: 'Refrigeration superheat extremely low — compressor operation risks liquid slugging. Do not run compressors until cleared.', relatedMeasurements: ['refrigeration.superheat', 'refrigeration.suctionTemp'] });
  }

  // If a compressor is in critical current while airside or refrigeration is critical, raise an electrical safety advisory
  const recipCritical = recipResult && recipResult.flags && recipResult.flags.currentStatus === 'critical';
  const scrollCritical = scrollResult && scrollResult.flags && scrollResult.flags.currentStatus === 'critical';
  if ((recipCritical || scrollCritical) && (airResult && airResult.status === 'critical' || (refResult && refResult.details && refResult.details.status === 'critical'))) {
    correlations.push({ code: 'SYS_COMPRESSOR_ELECTRICAL_RISK', severity: 'critical', message: 'Compressor electrical overload detected while other domains are in failure state — immediate shutdown and isolate power for safety.', relatedMeasurements: ['compressor.current', 'airside.deltaT', 'refrigeration.superheat'] });
  }

  if (correlations.length) {
    domainResults.push({ domain: 'controls', ok: false, findings: correlations });
  }

  return { profileId: profile.id, domainResults, overallStatus };
}

function reduceOverallStatus(results: DomainResult[]): DiagnosticStatus {
  const statuses: DiagnosticStatus[] = results.flatMap(r => r.findings.map(f => f.severity));

  if (statuses.includes('critical')) return 'critical';
  if (statuses.includes('alert')) return 'alert';
  if (statuses.includes('warning')) return 'warning';
  return 'ok';
}

// ============================================================================
// NEW Phase-3 Orchestrator: runCombinedProfile
// ============================================================================

/**
 * Creates a skipped ModuleResult for domains with insufficient data.
 */
function createSkippedModuleResult<V extends object, F extends object>(
  completeness: CompletenessLevel,
  tierAIssues: ValidationIssue[]
): ModuleResult<V, F> {
  return {
    status: 'ok',
    values: {} as V,
    flags: {} as F,
    recommendations: [],
    validation: tierAIssues,
    completeness,
    summary: 'Domain skipped due to insufficient data.',
  };
}

/**
 * Wraps an engine result into a ModuleResult.
 */
function wrapEngineResult<V extends object, F extends object>(
  engineResult: { status: DiagnosticStatus; values: V; flags: F; recommendations: Recommendation[] },
  tierAIssues: ValidationIssue[],
  completeness: CompletenessLevel,
  summary: string
): ModuleResult<V, F> {
  return {
    status: engineResult.status,
    values: engineResult.values,
    flags: engineResult.flags,
    recommendations: engineResult.recommendations,
    validation: tierAIssues,
    completeness,
    summary,
  };
}

/**
 * New Phase-3 orchestrator entry point returning CombinedProfileResult.
 * Uses Tier-A validation and completeness classification before running engines.
 */
export function runCombinedProfile(input: WshpDiagxInput): CombinedProfileResult {
  const { profile, measurements } = input;

  // 8.1 Before engines run: Tier-A validation and completeness classification
  const tierAIssues = runTierAValidation(input);
  const completeness = classifyCompleteness(input);

  // Initialize module results
  let airsideModule: AirsideModuleResult | null = null;
  let refrigerationModule: RefrigerationModuleResult | null = null;
  let hydronicModule_: HydronicModuleResult | null = null;
  let condenserApproachModule_: CondenserApproachModuleResult | null = null;
  let recipCompressorModule: ReciprocatingCompressorModuleResult | null = null;
  let scrollCompressorModule: ScrollCompressorModuleResult | null = null;
  let reversingValveModule: ReversingValveModuleResult | null = null;

  // Track engine results for correlation rules
  let airResult: AirsideEngineResult | undefined = undefined;
  let refResult: DomainResult<RefrigerationEngineResult> | undefined = undefined;
  let recipResult: ReciprocatingCompressorResult | undefined = undefined;
  let scrollResult: ScrollCompressorResult | undefined = undefined;

  // 8.2 For each domain: run engine if full, else produce skipped ModuleResult

  // AIRSIDE
  if (completeness.airside === 'full' && measurements.airside) {
    airResult = runAirsideEngine(measurements.airside as unknown as AirsideMeasurements, profile);
    airsideModule = wrapEngineResult(
      airResult,
      tierAIssues,
      completeness.airside,
      `Airside analysis complete: ${airResult.status}.`
    );
  } else if (measurements.airside && Object.keys(measurements.airside).length > 0) {
    airsideModule = createSkippedModuleResult(completeness.airside, tierAIssues);
  }

  // REFRIGERATION
  if (completeness.refrigeration === 'full' && measurements.refrigeration) {
    const cfg = buildRefrigerationConfigFromWSHP(profile);
    refResult = runRefrigerationDomain(measurements.refrigeration as RefrigerationMeasurements, cfg);
    if (refResult.details) {
      refrigerationModule = wrapEngineResult(
        refResult.details,
        tierAIssues,
        completeness.refrigeration,
        `Refrigeration analysis complete: ${refResult.details.status}.`
      );
    }
  } else if (measurements.refrigeration && Object.keys(measurements.refrigeration).length > 0) {
    refrigerationModule = createSkippedModuleResult(completeness.refrigeration, tierAIssues);
  }

  // HYDRONIC
  if (completeness.hydronic === 'full' && measurements.hydronic && profile.waterSide) {
    try {
      const hydMeasurements: HydronicMeasurements = {
        enteringWaterTemp: measurements.hydronic.enteringWaterTemp ?? null,
        leavingWaterTemp: measurements.hydronic.leavingWaterTemp ?? null,
        flowRateGPM: measurements.hydronic.flowRateGPM ?? profile.waterSide?.flowRate ?? null,
      };
      const expectedDelta = profile.waterSide?.expectedDeltaT
        ? { ...profile.waterSide.expectedDeltaT, source: 'profile' as const }
        : undefined;
      const hydResult = hydronicModule.diagnose(hydMeasurements, {
        designFlowGPM: profile.waterSide?.flowRate,
        expectedDeltaT: expectedDelta,
        loopType: profile.waterSide?.loopType,
      });
      hydronicModule_ = wrapEngineResult(
        hydResult,
        tierAIssues,
        completeness.hydronic,
        `Hydronic analysis complete: ${hydResult.status}.`
      );
    } catch {
      hydronicModule_ = createSkippedModuleResult(completeness.hydronic, tierAIssues);
    }
  } else if (measurements.hydronic && Object.keys(measurements.hydronic).length > 0) {
    hydronicModule_ = createSkippedModuleResult(completeness.hydronic, tierAIssues);
  }

  // CONDENSER APPROACH
  if (completeness.condenserApproach === 'full' && measurements.condenserApproach) {
    try {
      const cMeasurements: import('../modules/condenserApproach/condenserApproach.types').CondenserApproachMeasurements = {
        ambientTemp: measurements.condenserApproach.ambientTemp ?? null,
        condensingPressure: measurements.condenserApproach.condensingPressure ?? null,
        liquidLineTemp: measurements.condenserApproach.liquidLineTemp ?? null,
      };
      const cProfile: import('../modules/condenserApproach/condenserApproach.types').CondenserApproachProfile = {
        refrigerantType: profile.refrigeration?.refrigerantType,
      };
      const cResult = condenserApproachModule.diagnose(cMeasurements, cProfile);
      condenserApproachModule_ = wrapEngineResult(
        cResult,
        tierAIssues,
        completeness.condenserApproach,
        `Condenser approach analysis complete: ${cResult.status}.`
      );
    } catch {
      condenserApproachModule_ = createSkippedModuleResult(completeness.condenserApproach, tierAIssues);
    }
  } else if (measurements.condenserApproach && Object.keys(measurements.condenserApproach).length > 0) {
    condenserApproachModule_ = createSkippedModuleResult(completeness.condenserApproach, tierAIssues);
  }

  // RECIP COMPRESSOR
  if (completeness.recipCompressor === 'full' && measurements.recipCompressor) {
    recipResult = runReciprocatingCompressorEngine(
      measurements.recipCompressor as unknown as ReciprocatingCompressorMeasurements,
      profile
    );
    recipCompressorModule = wrapEngineResult(
      recipResult,
      tierAIssues,
      completeness.recipCompressor,
      `Reciprocating compressor analysis complete: ${recipResult.status}.`
    );
  } else if (measurements.recipCompressor && Object.keys(measurements.recipCompressor).length > 0) {
    recipCompressorModule = createSkippedModuleResult(completeness.recipCompressor, tierAIssues);
  }

  // SCROLL COMPRESSOR
  if (completeness.scrollCompressor === 'full' && measurements.scrollCompressor) {
    scrollResult = runScrollCompressorEngine(
      measurements.scrollCompressor as unknown as ScrollCompressorMeasurements,
      profile
    );
    scrollCompressorModule = wrapEngineResult(
      scrollResult,
      tierAIssues,
      completeness.scrollCompressor,
      `Scroll compressor analysis complete: ${scrollResult.status}.`
    );
  } else if (measurements.scrollCompressor && Object.keys(measurements.scrollCompressor).length > 0) {
    scrollCompressorModule = createSkippedModuleResult(completeness.scrollCompressor, tierAIssues);
  }

  // REVERSING VALVE
  if (completeness.reversingValve === 'full' && measurements.reversingValve) {
    const revResult = runReversingValveEngine(
      measurements.reversingValve as unknown as ReversingValveMeasurements,
      profile
    );
    reversingValveModule = wrapEngineResult(
      revResult,
      tierAIssues,
      completeness.reversingValve,
      `Reversing valve analysis complete: ${revResult.status}.`
    );
  } else if (measurements.reversingValve && Object.keys(measurements.reversingValve).length > 0) {
    reversingValveModule = createSkippedModuleResult(completeness.reversingValve, tierAIssues);
  }

  // Collect all recommendations from modules
  const allRecommendations: Recommendation[] = [];
  if (airsideModule) allRecommendations.push(...airsideModule.recommendations);
  if (refrigerationModule) allRecommendations.push(...refrigerationModule.recommendations);
  if (hydronicModule_) allRecommendations.push(...hydronicModule_.recommendations);
  if (condenserApproachModule_) allRecommendations.push(...condenserApproachModule_.recommendations);
  if (recipCompressorModule) allRecommendations.push(...recipCompressorModule.recommendations);
  if (scrollCompressorModule) allRecommendations.push(...scrollCompressorModule.recommendations);
  if (reversingValveModule) allRecommendations.push(...reversingValveModule.recommendations);

  // Add correlation-based recommendations
  const correlationRecs = generateCorrelationRecommendations(
    airResult,
    refResult?.details,
    recipResult,
    scrollResult
  );
  allRecommendations.push(...correlationRecs);

  // Roll up overall status
  const moduleStatuses: DiagnosticStatus[] = [];
  if (airsideModule) moduleStatuses.push(airsideModule.status);
  if (refrigerationModule) moduleStatuses.push(refrigerationModule.status);
  if (hydronicModule_) moduleStatuses.push(hydronicModule_.status);
  if (condenserApproachModule_) moduleStatuses.push(condenserApproachModule_.status);
  if (recipCompressorModule) moduleStatuses.push(recipCompressorModule.status);
  if (scrollCompressorModule) moduleStatuses.push(scrollCompressorModule.status);
  if (reversingValveModule) moduleStatuses.push(reversingValveModule.status);

  const overallStatus = reduceStatus(moduleStatuses);

  // Build summary
  const runCount = moduleStatuses.length;
  const criticalCount = moduleStatuses.filter(s => s === 'critical').length;
  const alertCount = moduleStatuses.filter(s => s === 'alert').length;
  const summary = buildSummary(runCount, overallStatus, criticalCount, alertCount);

  // 8.3 Build CombinedProfileResult
  return {
    profileId: input.profile.id,
    modules: {
      airside: airsideModule,
      refrigeration: refrigerationModule,
      compressor_scroll: scrollCompressorModule,
      compressor_recip: recipCompressorModule,
      hydronic: hydronicModule_,
      reversing_valve: reversingValveModule,
      condenser_approach: condenserApproachModule_,
    },
    status: overallStatus,
    recommendations: allRecommendations,
    validation: tierAIssues,
    summary,
  };
}

function reduceStatus(statuses: DiagnosticStatus[]): DiagnosticStatus {
  if (statuses.includes('critical')) return 'critical';
  if (statuses.includes('alert')) return 'alert';
  if (statuses.includes('warning')) return 'warning';
  return 'ok';
}

function buildSummary(runCount: number, status: DiagnosticStatus, criticalCount: number, alertCount: number): string {
  if (runCount === 0) {
    return 'No diagnostic modules executed due to insufficient input data.';
  }
  if (status === 'ok') {
    return `${runCount} module(s) analyzed; all within expected parameters.`;
  }
  if (status === 'critical') {
    return `${runCount} module(s) analyzed; ${criticalCount} critical condition(s) detected.`;
  }
  if (status === 'alert') {
    return `${runCount} module(s) analyzed; ${alertCount} alert condition(s) detected.`;
  }
  return `${runCount} module(s) analyzed; some conditions require attention.`;
}

function generateCorrelationRecommendations(
  airResult: AirsideEngineResult | undefined,
  refResult: RefrigerationEngineResult | undefined,
  recipResult: ReciprocatingCompressorResult | undefined,
  scrollResult: ScrollCompressorResult | undefined
): Recommendation[] {
  const recs: Recommendation[] = [];

  // If airside is critical, add a system-level advisory
  if (airResult?.flags && (airResult.flags.deltaTStatus === 'critical' || airResult.flags.airflowStatus === 'critical')) {
    recs.push({
      id: 'SYS_AIRSIDE_CRITICAL',
      domain: 'combined',
      severity: 'critical',
      intent: 'safety',
      summary: 'Severe airside restriction detected — do not operate refrigeration or compressors until airside restriction is cleared and evaporator inspected.',
      requiresShutdown: true,
    });
  }

  // If refrigeration indicates liquid slugging risk
  if (refResult?.flags?.superheatStatus === 'critical') {
    recs.push({
      id: 'SYS_REFRIGERATION_SLUG_RISK',
      domain: 'combined',
      severity: 'critical',
      intent: 'safety',
      summary: 'Refrigeration superheat extremely low — compressor operation risks liquid slugging. Do not run compressors until cleared.',
      requiresShutdown: true,
    });
  }

  // If compressor is in critical current while other domains are critical
  const recipCritical = recipResult?.flags?.currentStatus === 'critical';
  const scrollCritical = scrollResult?.flags?.currentStatus === 'critical';
  const otherCritical = airResult?.status === 'critical' || refResult?.status === 'critical';

  if ((recipCritical || scrollCritical) && otherCritical) {
    recs.push({
      id: 'SYS_COMPRESSOR_ELECTRICAL_RISK',
      domain: 'combined',
      severity: 'critical',
      intent: 'safety',
      summary: 'Compressor electrical overload detected while other domains are in failure state — immediate shutdown and isolate power for safety.',
      requiresShutdown: true,
    });
  }

  return recs;
}
