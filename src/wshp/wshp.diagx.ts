import { WaterCooledUnitProfile } from './wshp.profile';
import { DomainResult, DiagnosticStatus, DomainFinding } from '../shared/wshp.types';
import { RefrigerationMeasurements } from '../modules/refrigeration/refrigeration.types';
import { runRefrigerationDomain } from '../modules/refrigeration/refrigeration.domain';
import { hydronicModule } from '../modules/hydronic/hydronic.module';
import { condenserApproachModule } from '../modules/condenserApproach/condenserApproach.module';
import { runAirsideEngine } from '../modules/airside/airside.engine';
import { runReciprocatingCompressorEngine } from '../modules/compressor/recip.engine';
import { runScrollCompressorEngine } from '../modules/compressor/scroll.engine';
import { runReversingValveEngine } from '../modules/reversingValve/reversing.engine';
import { buildRefrigerationConfigFromWSHP } from './wshp.config.refrigeration';

export interface WshpDiagxInput {
  profile: WaterCooledUnitProfile;
  measurements: {
    refrigeration?: RefrigerationMeasurements;
    airside?: any;
    recipCompressor?: any;
    scrollCompressor?: any;
    reversingValve?: any;
  };
}

export interface WshpDiagxResult {
  profileId?: string;
  domainResults: DomainResult[];
  overallStatus: DiagnosticStatus;
}

export function runWshpDiagx(input: WshpDiagxInput): WshpDiagxResult {
  const { profile, measurements } = input;
  const domainResults: DomainResult[] = [];

  let airResult: any = undefined;
  let refResult: any = undefined;
  let recipResult: any = undefined;
  let scrollResult: any = undefined;
  let revResult: any = undefined;

  if (measurements.airside) {
    airResult = runAirsideEngine(measurements.airside as any, profile as any);
    domainResults.push({ domain: 'airside', ok: airResult.status === 'ok', findings: [], details: airResult });
  }

  if (measurements.refrigeration) {
    const cfg = buildRefrigerationConfigFromWSHP(profile);
    refResult = runRefrigerationDomain(measurements.refrigeration, cfg);
    domainResults.push(refResult);
  }

  // Hydronic source diagnostics: run when profile.waterSide present and refrigeration measurements include water temps
  if (profile.waterSide && measurements.refrigeration && (measurements.refrigeration.enteringWaterTemp !== undefined || measurements.refrigeration.leavingWaterTemp !== undefined)) {
    try {
      const hydMeasurements: any = {
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
    recipResult = runReciprocatingCompressorEngine(measurements.recipCompressor as any, profile as any);
    domainResults.push({ domain: 'compressor', ok: recipResult.status === 'ok', findings: [], details: recipResult });
  }

  // Condenser approach diagnostics: run when ambient + condensing pressure present in measurements.refrigeration
  if (measurements.refrigeration && (measurements.refrigeration.ambientTemp !== undefined || measurements.refrigeration.condensingPressure !== undefined)) {
    try {
      const cMeasurements: any = {
        ambientTemp: measurements.refrigeration.ambientTemp ?? null,
        condensingPressure: measurements.refrigeration.condensingPressure ?? null,
        liquidLineTemp: measurements.refrigeration.liquidTemp ?? null,
      };
      const cProfile: any = { refrigerantType: profile.refrigeration?.refrigerantType };
      const cResult = condenserApproachModule.diagnose(cMeasurements, cProfile);
      domainResults.push({ domain: 'condenser_approach', ok: cResult.status === 'ok', findings: [], details: cResult });
    } catch (e) {
      // keep orchestrator stable on unexpected module errors
    }
  }

  if (measurements.scrollCompressor) {
    scrollResult = runScrollCompressorEngine(measurements.scrollCompressor as any, profile as any);
    domainResults.push({ domain: 'compressor', ok: scrollResult.status === 'ok', findings: [], details: scrollResult });
  }

  if (measurements.reversingValve) {
    revResult = runReversingValveEngine(measurements.reversingValve as any, profile as any);
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
