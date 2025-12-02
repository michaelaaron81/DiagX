import { RefrigerationConfig, RefrigerationMeasurements, RefrigerantProfileType, RefrigerationValues, RefrigerationFlags } from './refrigeration.types';
import { REFRIGERANT_DATA, getRefrigerantData, PTChartData } from './refrigerantData';
import {
  DiagnosticStatus,
  ValidationResult,
  Recommendation,
  CONSTANTS,
  round,
  EngineResult,
} from '../../shared/wshp.types';

// Phase-3: Use canonical types from refrigeration.types.ts
export type RefrigerationEngineValues = RefrigerationValues;
export type RefrigerationEngineFlags = RefrigerationFlags;

export interface RefrigerationEngineResult extends EngineResult<RefrigerationValues, RefrigerationFlags> {
  status: DiagnosticStatus;
  mode: 'cooling' | 'heating';

  suctionPressure: number;
  dischargePressure: number;

  suctionSatTemp: number;
  dischargeSatTemp: number;

  superheat: number;
  subcooling: number;
  compressionRatio: number;
  waterDeltaT: number;

  dischargeSuperheat?: number;

  superheatStatus: DiagnosticStatus;

  subcoolingStatus: DiagnosticStatus;

  compressionRatioStatus: DiagnosticStatus;

  waterTransferStatus: DiagnosticStatus;

  recommendations: Recommendation[];
  disclaimers?: string[];
}

// Interpolate a PT chart (ptData: Array<[tempF, pressurePSIG]>)
export function interpolatePT(pressure: number, ptData: PTChartData): number | null {
  if (!ptData || ptData.length === 0) return null;

  // Data: [tempF, pressurePsig] sorted by pressure ascending
  for (let i = 0; i < ptData.length - 1; i++) {
    const [t1, p1] = ptData[i];
    const [t2, p2] = ptData[i + 1];
    if (pressure >= p1 && pressure <= p2) {
      const ratio = (pressure - p1) / (p2 - p1);
      return t1 + ratio * (t2 - t1);
    }
  }

  // Extrapolate using nearest interval
  if (ptData.length >= 2) {
    if (pressure < ptData[0][1]) {
      const [t1, p1] = ptData[0];
      const [t2, p2] = ptData[1];
      const slope = (t2 - t1) / (p2 - p1);
      return t1 + slope * (pressure - p1);
    }
    if (pressure > ptData[ptData.length - 1][1]) {
      const [t1, p1] = ptData[ptData.length - 2];
      const [t2, p2] = ptData[ptData.length - 1];
      const slope = (t2 - t1) / (p2 - p1);
      return t2 + slope * (pressure - p2);
    }
  }

  return null;
}

function getSaturationTemp(pressure: number, refrigerantType: string): number {
  const data = getRefrigerantData(refrigerantType) || REFRIGERANT_DATA[refrigerantType];
  if (!data) return 0.215 * pressure + 10.5; // fallback

  const temp = interpolatePT(pressure, data.pt);
  if (temp === null) return 0.215 * pressure + 10.5;
  return temp;
}

export function validateRefrigerationMeasurements(measurements: RefrigerationMeasurements): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (measurements.suctionPressure <= 0) errors.push('Suction pressure must be positive');
  if (measurements.dischargePressure <= 0) errors.push('Discharge pressure must be positive');
  if (measurements.dischargePressure <= measurements.suctionPressure) errors.push('Discharge pressure must be higher than suction pressure');

  if (measurements.suctionTemp < -40 || measurements.suctionTemp > 150) errors.push('Suction temperature out of reasonable range');
  if (measurements.liquidTemp < -20 || measurements.liquidTemp > 250) errors.push('Liquid temperature out of reasonable range');

  if (measurements.enteringWaterTemp !== undefined && (measurements.enteringWaterTemp < 20 || measurements.enteringWaterTemp > 150)) warnings.push('Entering water temp outside typical range (20-150F)');
  if (measurements.leavingWaterTemp !== undefined && (measurements.leavingWaterTemp < 20 || measurements.leavingWaterTemp > 150)) warnings.push('Leaving water temp outside typical range (20-150F)');

  const valid = errors.length === 0;
  return { valid, ok: valid, errors: valid ? undefined : errors, warnings };
}

function analyzeSuperheat(
  superheat: number,
  mode: 'cooling' | 'heating',
  metering: RefrigerationConfig['metering'] | undefined,
): { status: DiagnosticStatus } {
  const meteringType = mode === 'cooling' ? metering?.cooling?.type : metering?.heating?.type;
  const isTXV = meteringType === 'txv' || meteringType === 'eev' || meteringType === 'bidirectional_txv';

  const idealRange = mode === 'cooling' ? (isTXV ? CONSTANTS.SUPERHEAT_COOLING_TXV : CONSTANTS.SUPERHEAT_COOLING_FIXED) : CONSTANTS.SUPERHEAT_HEATING_TXV;

  if (superheat < 5) return { status: 'critical' as DiagnosticStatus };
  if (superheat < idealRange.min) return { status: 'alert' as DiagnosticStatus };
  if (superheat > 25) return { status: 'alert' as DiagnosticStatus };
  if (superheat > idealRange.max) return { status: 'warning' as DiagnosticStatus };
  if (superheat < idealRange.ideal - 2) return { status: 'warning' as DiagnosticStatus };
  return { status: 'ok' as DiagnosticStatus };
}

function analyzeSubcooling(subcooling: number): { status: DiagnosticStatus } {
  const idealRange = CONSTANTS.SUBCOOLING_WATER_COOLED;
  if (subcooling < 3) return { status: 'alert' as DiagnosticStatus };
  if (subcooling < idealRange.min) return { status: 'warning' as DiagnosticStatus };
  if (subcooling > 18) return { status: 'alert' as DiagnosticStatus };
  if (subcooling > idealRange.max) return { status: 'warning' as DiagnosticStatus };
  return { status: 'ok' as DiagnosticStatus };
}

function analyzeCompressionRatio(ratio: number) {
  const idealRange = CONSTANTS.COMPRESSION_RATIO;
  if (ratio < 2.5) return { status: 'critical' as DiagnosticStatus };
  if (ratio < idealRange.min) return { status: 'alert' as DiagnosticStatus };
  if (ratio > 6.5) return { status: 'alert' as DiagnosticStatus };
  if (ratio > idealRange.max) return { status: 'warning' as DiagnosticStatus };
  return { status: 'ok' as DiagnosticStatus };
}

function analyzeWaterTransfer(waterDeltaT: number, tons: number, designGPM: number) {
  const expectedDeltaT = (tons * 12000) / (designGPM * 500);
  const tolerance = 0.25;
  const minAcceptable = expectedDeltaT * (1 - tolerance);
  const maxAcceptable = expectedDeltaT * (1 + tolerance);

  if (waterDeltaT < expectedDeltaT * 0.5) return { status: 'alert' as DiagnosticStatus };
  if (waterDeltaT < minAcceptable) return { status: 'warning' as DiagnosticStatus };
  if (waterDeltaT > expectedDeltaT * 1.5) return { status: 'alert' as DiagnosticStatus };
  if (waterDeltaT > maxAcceptable) return { status: 'warning' as DiagnosticStatus };
  return { status: 'ok' as DiagnosticStatus };
}

function getWorstStatus(statuses: DiagnosticStatus[]): DiagnosticStatus {
  if (statuses.includes('critical')) return 'critical';
  if (statuses.includes('alert')) return 'alert';
  if (statuses.includes('warning')) return 'warning';
  return 'ok';
}

export function generateRefrigerationRecommendations(result: RefrigerationEngineResult): Recommendation[] {
  const { flags, values, status } = result;
  const recs: Recommendation[] = [];

  // A. Liquid slugging safety
  if (values.superheat <= 0) {
    recs.push({
      id: 'refrigeration_liquid_slug_safety_stop',
      domain: 'refrigeration',
      severity: 'critical',
      intent: 'safety',
      summary: `Superheat extremely low (${values.superheat?.toFixed(1) ?? ''}F) — liquid slugging risk.`,
      rationale: 'Superheat ≤ 0°F indicates liquid refrigerant risk entering the compressor.',
      notes: [`Measured superheat: ${values.superheat?.toFixed(1) ?? ''}F.`],
      requiresShutdown: true,
    });
  }

  // B. Undercharge-pattern
  else if (values.subcooling < 3) {
    recs.push({
      id: 'refrigeration_charge_pattern_low',
      domain: 'refrigeration',
      severity: 'alert',
      intent: 'diagnostic',
      summary: 'Superheat and subcooling pattern indicates refrigerant-side performance below expected range.',
      rationale: `Superheat ${values.superheat?.toFixed(1) ?? ''}F, subcooling ${values.subcooling?.toFixed(1) ?? ''}F.`,
      notes: ['Pattern suggests undercharge or refrigerant-side restriction; confirm with further testing.'],
      requiresShutdown: false,
    });
  }

  // C. High-load / overcharge-pattern
  else if (values.superheat < 8 && values.subcooling > 15) {
    recs.push({
      id: 'refrigeration_subcooling_elevated_pattern',
      domain: 'refrigeration',
      severity: 'alert',
      intent: 'diagnostic',
      summary: 'Superheat low and subcooling elevated; refrigerant-side loading appears high.',
      rationale: `Superheat ${values.superheat?.toFixed(1) ?? ''}F, subcooling ${values.subcooling?.toFixed(1) ?? ''}F.`,
      notes: ['Pattern indicates elevated refrigerant-side loading; verify condenser and liquid line conditions.'],
      requiresShutdown: false,
    });
  }

  // D. Restriction / flow-limited
  else if (values.superheat > 15 && values.subcooling > 18 && flags.waterTransferStatus === 'alert') {
    recs.push({
      id: 'refrigeration_flow_or_heat_transfer_limited',
      domain: 'refrigeration',
      severity: 'alert',
      intent: 'diagnostic',
      summary: 'Superheat and subcooling patterns with water-transfer alert suggest limited refrigerant flow or reduced heat transfer.',
      rationale: `Superheat ${values.superheat?.toFixed(1) ?? ''}F, subcooling ${values.subcooling?.toFixed(1) ?? ''}F.`,
      notes: ['Flagged by superheatStatus, subcoolingStatus, and waterTransferStatus.'],
      requiresShutdown: false,
    });
  }

  // E. Compression ratio abnormal
  if (flags.compressionRatioStatus === 'alert') {
    recs.push({
      id: 'refrigeration_compression_ratio_abnormal',
      domain: 'refrigeration',
      severity: 'alert',
      intent: 'diagnostic',
      summary: `Compression ratio ${values.compressionRatio?.toFixed(2) ?? ''}:1 is outside typical range.`,
      rationale: 'Compression ratio flagged by compressionRatioStatus.',
      notes: [`Compression ratio: ${values.compressionRatio?.toFixed(2) ?? ''}:1.`],
      requiresShutdown: false,
    });
  }

  // Water-transfer abnormal
  if (flags.waterTransferStatus === 'alert' || flags.waterTransferStatus === 'critical') {
    recs.push({
      id: 'refrigeration_water_transfer_abnormal',
      domain: 'refrigeration',
      severity: 'alert',
      intent: 'diagnostic',
      summary: `Water ΔT ${values.waterDeltaT?.toFixed(1) ?? ''}F indicates reduced heat transfer on the fluid side.`,
      rationale: 'Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.',
      notes: [`Water ΔT: ${values.waterDeltaT?.toFixed(1) ?? ''}F.`],
      requiresShutdown: false,
    });
  }

  // OK preventive
  if (status === 'ok') {
    recs.push({
      id: 'refrigeration_preventive_trending',
      domain: 'refrigeration',
      severity: 'info',
      intent: 'diagnostic',
      summary: 'Refrigerant-side conditions within expected range; trend monitoring recommended.',
      rationale: 'Record refrigerant-side pressures and temperatures under stable design conditions for trend analysis.',
      notes: ['Refrigerant conditions currently within expected range.'],
      requiresShutdown: false,
    });
  }

  // Unknown refrigerant informational
  if (flags.refrigerantProfile === 'unknown') {
    recs.push({
      id: 'refrigerant_profile_unknown',
      domain: 'refrigeration',
      severity: 'info',
      intent: 'diagnostic',
      summary: 'Refrigerant type not in the standard profile library; analysis used generic behavior.',
      rationale: 'Analysis based on generic compressor behavior when refrigerant profile is unknown.',
      notes: ['Informational: Unknown refrigerant profile detected.'],
      requiresShutdown: false,
    });
  }

  return recs;
}

function generateRecommendations(
  superheatAnalysis: { status: DiagnosticStatus },
  subcoolingAnalysis: { status: DiagnosticStatus },
  compressionRatioAnalysis: { status: DiagnosticStatus },
  waterTransferAnalysis: { status: DiagnosticStatus },
  measurements: RefrigerationMeasurements,
  profile: RefrigerationConfig
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const refrigerant = profile.refrigerant;

  if (superheatAnalysis.status === 'critical') {
    const measuredSuperheat = round(measurements.suctionTemp - getSaturationTemp(measurements.suctionPressure, refrigerant), 1);
    recommendations.push({
      id: 'refrigeration_liquid_slug_safety_stop',
      domain: 'refrigeration',
      severity: 'critical',
      intent: 'safety',
      summary: `Superheat extremely low (${measuredSuperheat}F) — liquid slugging risk.`,
      rationale: 'Measured superheat is critically low; risk of liquid refrigerant entering compressor.',
      notes: [`Measured superheat: ${measuredSuperheat}F.`],
      requiresShutdown: true,
    });
  }

  if (compressionRatioAnalysis.status === 'critical') {
    recommendations.push({ id: 'refrigeration_severe_internal_bypass', domain: 'refrigeration', severity: 'critical', intent: 'diagnostic', summary: 'Compression ratio extremely low — severe internal bypass suspected.', rationale: 'Extremely low compression ratio typically indicates internal bypass or reversing valve failure.', notes: [], requiresShutdown: false });
  }

  if (superheatAnalysis.status === 'alert' && measurements.suctionTemp - getSaturationTemp(measurements.suctionPressure, refrigerant) > 15) {
    recommendations.push({ id: 'refrigeration_undercharge_pattern', domain: 'refrigeration', severity: 'alert', intent: 'diagnostic', summary: 'High superheat with low subcooling indicates potential refrigerant loss (undercharge).', rationale: 'Pattern suggests refrigerant loss; perform targeted diagnostics before modifying charge.', notes: [], requiresShutdown: false });
  }

  if (subcoolingAnalysis.status === 'alert' && (getSaturationTemp(measurements.dischargePressure, refrigerant) - measurements.liquidTemp) > 18) {
    recommendations.push({ id: 'refrigeration_overcharge_pattern', domain: 'refrigeration', severity: 'alert', intent: 'diagnostic', summary: 'High subcooling indicates potential overcharge.', rationale: 'Pattern suggests excess refrigerant; confirm with targeted diagnostics.', notes: [], requiresShutdown: false });
  }

  if (waterTransferAnalysis.status === 'alert' || waterTransferAnalysis.status === 'critical') {
    recommendations.push({ id: 'refrigeration_water_side_issue', domain: 'refrigeration', severity: 'alert', intent: 'diagnostic', summary: 'Water ΔT outside expected range; possible fluid flow or exchanger issues.', rationale: 'Water-side conditions may limit heat rejection; check flow and strainers.', notes: [], requiresShutdown: false });
  }

  if (recommendations.length === 0) {
    recommendations.push({ id: 'refrigeration_no_immediate_action', domain: 'refrigeration', severity: 'info', intent: 'diagnostic', summary: 'System parameters within expected range; continue periodic monitoring.', rationale: 'Normal operation', notes: [], requiresShutdown: false });
  }

  return recommendations;
}

export function runRefrigerationEngine(measurements: RefrigerationMeasurements, config: RefrigerationConfig): RefrigerationEngineResult {
  const refrigerant = config.refrigerant;
  const disclaimers: string[] = [];

  // Determine refrigerant profile
  let refrigerantProfile: RefrigerantProfileType = 'unknown';
  const normalizedRefrigerant = refrigerant.startsWith('R-') ? refrigerant.toUpperCase() : refrigerant.replace(/^R/, 'R-').toUpperCase();
  if (getRefrigerantData(normalizedRefrigerant)) {
    refrigerantProfile = 'standard';
  }

  // Set disclaimers based on profile
  if (refrigerantProfile === 'standard') {
    disclaimers.push('Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits.');
  } else {
    disclaimers.push('Refrigerant analysis is limited by non-standard or overridden PT data. This tool cannot guarantee that calculated saturation temperatures and derived values match the actual refrigerant behavior in this system.');
  }

  // Allow an optional, user-supplied PT table override in the config (do NOT commit OEM tables to repo)
  let suctionSatTemp = getSaturationTemp(measurements.suctionPressure, refrigerant);
  let dischargeSatTemp = getSaturationTemp(measurements.dischargePressure, refrigerant);
  if (config.ptOverride) {
    // Only accept a manual PT override when the refrigerant is explicitly set to 'OTHER'
    const refrigerantRaw = String(config.refrigerant || '').toUpperCase();
    if (refrigerantRaw === 'OTHER') {
      const pt = config.ptOverride;
      const sTemp = interpolatePT(measurements.suctionPressure, pt);
      const dTemp = interpolatePT(measurements.dischargePressure, pt);
      if (sTemp !== null) suctionSatTemp = sTemp;
      if (dTemp !== null) dischargeSatTemp = dTemp;
    } else {
      // Ignore override for named refrigerants to prevent accidental falsification of data
      // Disclaimer already set above
    }
  }

  const superheat = measurements.suctionTemp - suctionSatTemp;
  const subcooling = dischargeSatTemp - measurements.liquidTemp;

  const compressionRatio = measurements.dischargePressure / measurements.suctionPressure;
  const waterDeltaT = (measurements.leavingWaterTemp !== undefined && measurements.enteringWaterTemp !== undefined)
    ? Math.abs(measurements.leavingWaterTemp - measurements.enteringWaterTemp)
    : 0;

  let dischargeSuperheat: number | undefined = undefined;
  if (measurements.dischargeTemp !== undefined) dischargeSuperheat = measurements.dischargeTemp - dischargeSatTemp;

  const superheatAnalysis = analyzeSuperheat(superheat, measurements.mode, config.metering);
  const subcoolingAnalysis = analyzeSubcooling(subcooling);
  const compressionRatioAnalysis = analyzeCompressionRatio(compressionRatio);
  const waterTransferAnalysis = analyzeWaterTransfer(waterDeltaT, config.nominalTons, config.designWaterFlowGPM);

  // Legacy helper retained for backward-compatibility; result is not used in the engine core.
  generateRecommendations(superheatAnalysis, subcoolingAnalysis, compressionRatioAnalysis, waterTransferAnalysis, measurements, config);

  const statuses = [superheatAnalysis.status, subcoolingAnalysis.status, compressionRatioAnalysis.status, waterTransferAnalysis.status];
  const overallStatus = getWorstStatus(statuses);


  // Build EngineResult-shaped values and flags
  const values: RefrigerationEngineValues = {
    suctionPressure: measurements.suctionPressure,
    dischargePressure: measurements.dischargePressure,

    suctionSatTemp: round(suctionSatTemp, 1),
    dischargeSatTemp: round(dischargeSatTemp, 1),

    superheat: round(superheat, 1),
    subcooling: round(subcooling, 1),
    compressionRatio: round(compressionRatio, 2),
    waterDeltaT: round(waterDeltaT, 1),

    dischargeSuperheat: dischargeSuperheat ? round(dischargeSuperheat, 1) : undefined,
  };

  const flags: RefrigerationEngineFlags = {
    superheatStatus: superheatAnalysis.status,
    subcoolingStatus: subcoolingAnalysis.status,
    compressionRatioStatus: compressionRatioAnalysis.status,
    waterTransferStatus: waterTransferAnalysis.status,
    refrigerantProfile,
    disclaimers,
  };

  const result: RefrigerationEngineResult = {
    status: overallStatus,
    values,
    flags,

    // Backward-compatible flattened fields
    mode: measurements.mode,
    suctionPressure: values.suctionPressure,
    dischargePressure: values.dischargePressure,
    suctionSatTemp: values.suctionSatTemp,
    dischargeSatTemp: values.dischargeSatTemp,
    superheat: values.superheat,
    subcooling: values.subcooling,
    compressionRatio: values.compressionRatio,
    waterDeltaT: values.waterDeltaT,
    dischargeSuperheat: values.dischargeSuperheat,

    superheatStatus: flags.superheatStatus,
    subcoolingStatus: flags.subcoolingStatus,
    compressionRatioStatus: flags.compressionRatioStatus,
    waterTransferStatus: flags.waterTransferStatus,

    recommendations: [], // temp
    disclaimers,
  };

  result.recommendations = generateRefrigerationRecommendations(result);

  return result;
}
