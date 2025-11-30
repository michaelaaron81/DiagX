import { AirsideMeasurements, AirsideEngineResult, AirsideConfig, AirsideEngineValues, AirsideEngineFlags } from './airside.types';
import { DiagnosticStatus, Recommendation, round, formatTemperature, formatFlow } from '../../shared/wshp.types';

// Helpers: expected ranges (fallback 'industry' if no nameplate data)
export function getExpectedDeltaT(profile: AirsideConfig, mode: 'cooling' | 'heating' | 'fan_only') {
  // Prefer user-provided manufacturer values in profile (profile.airside.manufacturerExpectedDeltaT)
  const m = (profile as any)?.airside?.manufacturerExpectedDeltaT;
  if (m && typeof m.min === 'number' && typeof m.ideal === 'number' && typeof m.max === 'number') {
    return { min: m.min, ideal: m.ideal, max: m.max, source: 'manufacturer' } as any;
  }
  // If manufacturer provides coil performance (not available in simplified profile), choose calculated from nameplate.
  // Fallback industry defaults
  if (mode === 'fan_only') return { min: 0, ideal: 0, max: 0, source: 'industry' };
  if (mode === 'cooling') return { min: 8, ideal: 12, max: 16, source: 'industry' };
  return { min: 10, ideal: 20, max: 30, source: 'industry' };
}

export function getExpectedCFMPerTon(profile: AirsideConfig, mode: 'cooling' | 'heating' | 'fan_only') {
  // Prefer user-provided manufacturer CFM/ton if present
  const m = (profile as any)?.airside?.manufacturerCFMPerTon;
  if (m && typeof m.min === 'number' && typeof m.ideal === 'number' && typeof m.max === 'number') {
    return { min: m.min, ideal: m.ideal, max: m.max, source: 'manufacturer' } as any;
  }
  // If profile contains nameplate designCFM, compute per-ton
  const designCFM = profile.airside?.designCFM?.[mode === 'cooling' ? 'cooling' : 'heating'] ?? profile.airside?.designCFM?.cooling;
  if (designCFM && profile.nominalTons) {
    const ideal = designCFM / profile.nominalTons;
    return { min: Math.max(200, Math.round(ideal * 0.9)), ideal: Math.round(ideal), max: Math.round(ideal * 1.1), source: 'nameplate_calculated' } as any;
  }
  // Fallback industry
  return { min: 350, ideal: 400, max: 450, source: 'industry' } as any;
}

export function requiresManufacturerDataDisclaimer(profile: AirsideConfig, subject: string): boolean {
  // Simplified: if profile.model present consider manufacturer-specific; otherwise require disclaimer
  return !profile.model;
}

export function getManufacturerDataDisclaimer(subject: string): string {
  return `Manufacturer data for ${subject} not found in profile — relying on industry defaults. Verify with equipment documentation.`;
}

export function validateAirsideMeasurements(measurements: AirsideMeasurements) {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!measurements) return { valid: false, ok: false, errors: ['No measurements provided'] };
  if (measurements.returnAirTemp === undefined) errors.push('returnAirTemp is required');
  if (measurements.supplyAirTemp === undefined) errors.push('supplyAirTemp is required');
  if (!measurements.mode) warnings.push('mode not provided, assuming cooling');
  const deltaT = Math.abs((measurements.supplyAirTemp ?? 0) - (measurements.returnAirTemp ?? 0));
  if (deltaT < 1) errors.push('Delta-T is too small (<1°F) - unit may not be running.');

  return { valid: errors.length === 0, ok: errors.length === 0, errors: errors.length ? errors : undefined, warnings };
}

function analyzeDeltaT(deltaT: number, expectedRange: any, mode: 'cooling' | 'heating' | 'fan_only') {
  if (mode === 'fan_only') return { status: 'ok' as DiagnosticStatus };
  if (mode === 'cooling') {
    if (deltaT > 30) return { status: 'critical' as DiagnosticStatus };
    if (deltaT > expectedRange.max) return { status: 'alert' as DiagnosticStatus };
    if (deltaT < expectedRange.min) return { status: 'warning' as DiagnosticStatus };
    return { status: 'ok' as DiagnosticStatus };
  }
  // heating
  if (deltaT > expectedRange.max || deltaT < expectedRange.min) return { status: 'warning' as DiagnosticStatus };
  return { status: 'ok' as DiagnosticStatus };
}

function analyzeAirflow(cfmPerTon: number | undefined, expectedRange: any, mode: string, measured: boolean) {
  if (!cfmPerTon) return { status: 'ok' as DiagnosticStatus };
  const method = measured ? 'Measured' : 'Calculated';
  const sourceNote = expectedRange.source === 'nameplate_calculated' ? ' from nameplate design CFM' : ' (industry standard)';
  if (cfmPerTon < 250) return { status: 'critical' as DiagnosticStatus };
  const deviation = ((cfmPerTon - expectedRange.ideal) / expectedRange.ideal) * 100;
  if (cfmPerTon < expectedRange.min) return { status: 'alert' as DiagnosticStatus };
  if (cfmPerTon > 550) return { status: 'alert' as DiagnosticStatus };
  if (cfmPerTon > expectedRange.max) return { status: 'warning' as DiagnosticStatus };
  return { status: 'ok' as DiagnosticStatus };
}

function analyzeStaticPressure(totalESP: number, ratedESP: { design: number; max: number }) {
  if (totalESP > ratedESP.max * 1.3) return { status: 'critical' as DiagnosticStatus };
  if (totalESP > ratedESP.max) return { status: 'alert' as DiagnosticStatus };
  if (totalESP > ratedESP.max * 0.9) return { status: 'warning' as DiagnosticStatus };
  return { status: 'ok' as DiagnosticStatus };
}

export function generateRecommendations(deltaTAnalysis: any, airflowAnalysis: any, staticPressureAnalysis: any, measurements: AirsideMeasurements, profile: AirsideConfig, expectedCFM: any) {
  const recommendations: Recommendation[] = [];
  if (deltaTAnalysis.status === 'critical' && measurements.mode === 'cooling') {
    recommendations.push({
      id: 'airside_frozen_coil_or_restriction',
      domain: 'airside',
      severity: 'critical',
      intent: 'safety',
      summary: `Measured ΔT ${formatTemperature(Math.abs(measurements.supplyAirTemp - measurements.returnAirTemp))} indicates severe restriction or possible frozen coil`,
      rationale: 'Delta-T is critically outside expected range and suggests severe airflow restriction or coil icing.',
      notes: [`Delta-T indication: ${formatTemperature(Math.abs(measurements.supplyAirTemp - measurements.returnAirTemp))}`],
      requiresShutdown: true,
    });
  }
  if (airflowAnalysis.status === 'alert') {
    const designCFM = measurements.mode === 'cooling' ? profile.airside.designCFM.cooling : profile.airside.designCFM.heating ?? profile.airside.designCFM.cooling;
    recommendations.push({
      id: 'airside_airflow_below_design',
      domain: 'airside',
      severity: 'alert',
      intent: 'diagnostic',
      summary: `Measured or calculated airflow below equipment design (${designCFM} CFM).`,
      rationale: 'Airflow below design reduces system capacity and may indicate filter, register, or blower issues.',
      notes: [`Design CFM: ${designCFM}`],
      requiresShutdown: false,
    });
  }

  // Architect-approved advisory branches based on existing engine flags (DAC-3)
  if (measurements.mode === 'cooling' && (airflowAnalysis.status === 'alert' || airflowAnalysis.status === 'critical')) {
    recommendations.push({
      id: 'airside.low_airflow.inspect_air_path',
      domain: 'airside',
      severity: airflowAnalysis.status === 'critical' ? 'critical' : 'advisory',
      intent: 'diagnostic',
      summary: 'Airflow indicators suggest system airflow is below expected range for cooling operation.',
      rationale: 'Potential contributors include filter and coil condition, blower wheel issues, or duct restrictions; confirm with field measurements.',
      notes: ['Advisory based on airflow and ΔT status; verify with measurements and equipment documentation.'],
    });
  }

  if (staticPressureAnalysis && staticPressureAnalysis.status === 'alert') {
    recommendations.push({
      id: 'airside_static_pressure_exceeds_rating',
      domain: 'airside',
      severity: 'alert',
      intent: 'diagnostic',
      summary: `Measured external static pressure ${round(measurements.externalStatic ?? 0, 2)} in W.C. exceeds nameplate maximum ${round(profile.airside.externalStaticPressure.max, 2)} in W.C.`,
      rationale: 'Operating above rated external static pressure reduces airflow and capacity.',
      notes: [`Measured ESP: ${round(measurements.externalStatic ?? 0, 2)} in W.C.`],
      requiresShutdown: false,
    });
  }

  if (measurements.mode === 'cooling' && staticPressureAnalysis && (staticPressureAnalysis.status === 'alert' || staticPressureAnalysis.status === 'critical')) {
    recommendations.push({
      id: 'airside.static_pressure.inspect_ductwork',
      domain: 'airside',
      severity: staticPressureAnalysis.status === 'critical' ? 'critical' : 'advisory',
      intent: 'diagnostic',
      summary: 'External static pressure is outside expected range for cooling operation.',
      rationale: 'Duct sizing, balancing dampers, or obstructions can contribute; verify filter loading independently of OEM curves.',
      notes: ['Advisory based on static pressure and airflow flags; confirm with field measurements.'],
      requiresShutdown: false,
    });
  }

  if (
    measurements.mode === 'cooling' &&
    (deltaTAnalysis.status === 'warning' || deltaTAnalysis.status === 'critical') &&
    airflowAnalysis.status === 'critical'
  ) {
    recommendations.push({
      id: 'airside.abnormal_deltaT.check_for_icing_or_restriction',
      domain: 'airside',
      severity: deltaTAnalysis.status === 'critical' ? 'critical' : 'advisory',
      intent: 'diagnostic',
      summary: 'Supply-air ΔT low while airflow is critically low; coil fouling, icing, or airflow restrictions are plausible contributors.',
      rationale: 'When ΔT is low and airflow critically low, refrigeration-side diagnostics are unreliable until airflow/coil issues are resolved.',
      notes: ['Review coil and airflow path before interpreting refrigeration diagnostics.'],
    });
  }

  if (
    measurements.mode === 'cooling' &&
    (deltaTAnalysis.status === 'warning' || deltaTAnalysis.status === 'critical') &&
    airflowAnalysis.status === 'alert'
  ) {
    recommendations.push({
      id: 'airside.high_airflow.low_deltaT_review',
      domain: 'airside',
      severity: deltaTAnalysis.status === 'critical' ? 'critical' : 'advisory',
      intent: 'diagnostic',
      summary: 'Airflow above expected range but ΔT is degraded; verify fan, ducts, and measurement technique before drawing refrigerant-side conclusions.',
      rationale: 'High airflow can reduce ΔT; be cautious when interpreting refrigerant diagnostics based on ΔT in this situation.',
      notes: ['Advisory — do not infer refrigerant charge solely from this recommendation.'],
    });
  }
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'airside_preventive_filter_maintenance',
      domain: 'airside',
      severity: 'info',
      intent: 'diagnostic',
      summary: 'Airflow currently within equipment design specifications.',
      rationale: 'Routine filter maintenance and replacement intervals should be followed per manufacturer guidance.',
      notes: ['Airflow within design specs'],
      requiresShutdown: false,
    });
  }

  return recommendations.sort((a, b) => {
    const order: any = { critical: 0, alert: 1, advisory: 2, info: 3 };
    const ap = a.severity ?? 'info';
    const bp = b.severity ?? 'info';
    return order[ap] - order[bp];
  });
}

function getWorstStatus(statuses: DiagnosticStatus[]): DiagnosticStatus {
  if (statuses.includes('critical')) return 'critical';
  if (statuses.includes('alert')) return 'alert';
  if (statuses.includes('warning')) return 'warning';
  return 'ok';
}

export function runAirsideEngine(measurements: AirsideMeasurements, profile: AirsideConfig): AirsideEngineResult {
  const disclaimers: string[] = [];
  const deltaT = Math.abs(measurements.supplyAirTemp - measurements.returnAirTemp);

  const expectedDeltaTResult = getExpectedDeltaT(profile, measurements.mode);
  const expectedCFMResult = getExpectedCFMPerTon(profile, measurements.mode);

  // Always ask the user to verify OEM/IOM manuals and offer a place to include manufacturer curves in the profile.
  disclaimers.push('Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).');
  if (expectedDeltaTResult.source === 'industry' && requiresManufacturerDataDisclaimer(profile, 'coil performance')) {
    disclaimers.push(getManufacturerDataDisclaimer('coil performance'));
  }

  let estimatedCFM: number | undefined;
  let cfmPerTon: number | undefined;
  // Only compute estimates when nominalTons is a positive number and deltaT is reasonable (prevent divide-by-zero / nonsense)
  if (measurements.mode !== 'fan_only' && typeof profile.nominalTons === 'number' && profile.nominalTons > 0 && deltaT >= 1) {
    estimatedCFM = (profile.nominalTons * 12000) / (1.08 * deltaT);
    // ensure we don't divide by zero, profile.nominalTons > 0 already ensures safety
    cfmPerTon = estimatedCFM / profile.nominalTons;
  }

  if (measurements.measuredCFM !== undefined && profile.nominalTons) {
    cfmPerTon = measurements.measuredCFM / profile.nominalTons;
  }

  const deltaTAnalysis = analyzeDeltaT(deltaT, expectedDeltaTResult, measurements.mode);
  const airflowAnalysis = analyzeAirflow(cfmPerTon, expectedCFMResult, measurements.mode, measurements.measuredCFM !== undefined);

  let staticPressureAnalysis: any | undefined;
  if (measurements.externalStatic !== undefined) staticPressureAnalysis = analyzeStaticPressure(measurements.externalStatic, profile.airside.externalStaticPressure);

  const statuses = [deltaTAnalysis.status, airflowAnalysis.status];
  if (staticPressureAnalysis) statuses.push(staticPressureAnalysis.status);

  const overallStatus = getWorstStatus(statuses);
  // determineOverallFinding is presentation-level; modules/UI should generate human-facing text
  const recommendations = generateRecommendations(deltaTAnalysis, airflowAnalysis, staticPressureAnalysis, measurements, profile, expectedCFMResult);

  const values: AirsideEngineValues = {
    deltaT: round(deltaT, 1),
    expectedDeltaT: expectedDeltaTResult,
    estimatedCFM: estimatedCFM ? round(estimatedCFM, 0) : undefined,
    measuredCFM: measurements.measuredCFM,
    cfmPerTon: cfmPerTon ? round(cfmPerTon, 0) : undefined,
    expectedCFMPerTon: expectedCFMResult,
    totalESP: measurements.externalStatic,
    ratedESP: profile.airside.externalStaticPressure,
    sensibleHeatRatio: undefined,
  };

  const flags: AirsideEngineFlags = {
    mode: measurements.mode,
    deltaTStatus: deltaTAnalysis.status,
    deltaTSource: expectedDeltaTResult.source as any,
    cfmSource: expectedCFMResult.source as any,
    airflowStatus: airflowAnalysis.status,
    staticPressureStatus: staticPressureAnalysis?.status,
    humidityRemovalStatus: undefined,
    disclaimers,
  };

  const result: AirsideEngineResult = {
    status: overallStatus,
    values,
    flags,
    recommendations,

    // Flattened, backward-compatible fields
    mode: flags.mode,
    deltaT: values.deltaT,
    deltaTStatus: flags.deltaTStatus,
    expectedDeltaT: values.expectedDeltaT,
    deltaTSource: flags.deltaTSource,
    estimatedCFM: values.estimatedCFM,
    measuredCFM: values.measuredCFM,
    cfmPerTon: values.cfmPerTon,
    expectedCFMPerTon: values.expectedCFMPerTon,
    cfmSource: flags.cfmSource,
    airflowStatus: flags.airflowStatus,
    staticPressureStatus: flags.staticPressureStatus,
    totalESP: values.totalESP,
    ratedESP: values.ratedESP,
    humidityRemovalStatus: flags.humidityRemovalStatus,
    sensibleHeatRatio: values.sensibleHeatRatio,
    // overallFinding and likelyIssue are presentation-level and produced by module/UI
    disclaimers: flags.disclaimers,
  };

  return result;
}
