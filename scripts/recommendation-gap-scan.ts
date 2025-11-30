import { runAirsideEngine } from '../src/modules/airside/airside.engine';
import { runRefrigerationEngine } from '../src/modules/refrigeration/refrigeration.engine';
import { runHydronicEngine } from '../src/modules/hydronic/hydronic.engine';
import { runCondenserApproachEngine } from '../src/modules/condenserApproach/condenserApproach.engine';
import { runReciprocatingCompressorEngine } from '../src/modules/compressor/recip.engine';
import { runScrollCompressorEngine } from '../src/modules/compressor/scroll.engine';
import { runReversingValveEngine } from '../src/modules/reversingValve/reversing.engine';
import fs from 'fs';

function severityRank(s: any) {
  if (!s) return 3;
  return s === 'critical' ? 0 : s === 'high' || s === 'alert' ? 1 : s === 'warning' ? 2 : 3;
}

function hasRelevantRecommendation(engineModule: string, result: any, keywords: string[]) {
  if (!Array.isArray(result.recommendations)) return false;
  return result.recommendations.some((r:any) => {
    if (r.module && r.module !== engineModule) return false;
    const text = ((r.title||'') + ' ' + (r.description||'') + ' ' + (r.notes||'')).toLowerCase();
    for (const k of keywords) if (text.includes(k)) return true;
    return false;
  });
}

console.log('Starting recommendation-gap-scan');
const findings: any[] = [];

// Airside scenarios
const airProfile = { nominalTons: 5, airside: { designCFM: { cooling: 2400 }, externalStaticPressure: { design: 0.3, max: 0.6 } } } as any;
const airScenarios = [
  { name: 'frozen_coil_like', m: { mode: 'cooling', returnAirTemp: 75, supplyAirTemp: 30, measuredCFM: 600, externalStatic: 0.8 } },
  { name: 'very_high_airflow', m: { mode: 'cooling', returnAirTemp: 75, supplyAirTemp: 72, measuredCFM: 4000, externalStatic: 0.1 } },
  { name: 'low_delta_but_low_cfm', m: { mode: 'cooling', returnAirTemp: 75, supplyAirTemp: 70, measuredCFM: 500, externalStatic: 0.4 } },
];

for (const s of airScenarios) {
  const r = runAirsideEngine(s.m as any, airProfile);
  const gaps:string[] = [];
  if (r.flags.deltaTStatus !== 'ok') {
    if (!hasRelevantRecommendation('airside', r, ['delta', 'frozen', 'restriction', 'defrost'])) gaps.push('No recommendation relating to delta-T / frozen coil / restriction');
  }
  if (r.flags.airflowStatus && r.flags.airflowStatus !== 'ok') {
    if (!hasRelevantRecommendation('airside', r, ['airflow', 'cfm', 'register', 'box', 'blow'])) gaps.push('No recommendation relating to airflow (measure/inspect/repair)');
  }
  if (r.flags.staticPressureStatus && r.flags.staticPressureStatus !== 'ok') {
    if (!hasRelevantRecommendation('airside', r, ['static', 'esp', 'duct', 'pressure'])) gaps.push('No recommendation relating to static pressure / ductwork');
  }
  findings.push({ engine: 'airside', scenario: s.name, flags: r.flags, recCount: r.recommendations?.length||0, gaps });
}

// Refrigeration scenarios
const refProfile = { refrigerant: 'R-410A', nominalTons: 10, metering: {cooling:{type:'fixed'}, heating:{type:'fixed'}}, designWaterFlowGPM: 100 } as any;
const refScenarios = [
  { name: 'very_low_superheat', m: { mode: 'cooling', suctionPressure: 120, dischargePressure: 300, suctionTemp: 40, liquidTemp: 115, enteringWaterTemp: 80, leavingWaterTemp: 88 } },
  { name: 'overcharge_like', m: { mode: 'cooling', suctionPressure: 110, dischargePressure: 420, suctionTemp: 30, liquidTemp: 60, enteringWaterTemp: 80, leavingWaterTemp: 88 } },
  { name: 'high_water_dt', m: { mode: 'cooling', suctionPressure: 120, dischargePressure: 300, suctionTemp: 95, liquidTemp: 115, enteringWaterTemp: 60, leavingWaterTemp: 100 } },
];
for (const s of refScenarios) {
  const r = runRefrigerationEngine(s.m as any, refProfile);
  const gaps:string[] = [];
  // check superheat status
  if (r.flags.superheatStatus && r.flags.superheatStatus !== 'ok') {
    if (!hasRelevantRecommendation('refrigeration', r, ['superheat', 'liquid', 'undercharged', 'stop', 'slugging'])) gaps.push('No recommendation addressing superheat / liquid slugging / safety stop');
  }
  if (r.flags.subcoolingStatus && r.flags.subcoolingStatus !== 'ok') {
    if (!hasRelevantRecommendation('refrigeration', r, ['subcooling', 'overcharge', 'recover', 'charge'])) gaps.push('No recommendation addressing subcooling/overcharge');
  }
  if (r.flags.compressionRatioStatus && r.flags.compressionRatioStatus !== 'ok') {
    if (!hasRelevantRecommendation('refrigeration', r, ['compression', 'bypass', 'reversing', 'internal bypass'])) gaps.push('No recommendation addressing compression ratio issues');
  }
  if (r.flags.waterTransferStatus && r.flags.waterTransferStatus !== 'ok') {
    if (!hasRelevantRecommendation('refrigeration', r, ['water', 'delta', 'flow', 'pump', 'strainer'])) gaps.push('No recommendation addressing water-side ΔT / flow');
  }
  findings.push({ engine: 'refrigeration', scenario: s.name, flags: r.flags, recCount: r.recommendations?.length||0, gaps });
}

// Hydronic scenarios (water loop)
const hydroProfile = { designFlowGPM: 50 } as any;
const hydroScenarios = [
  { name: 'very_low_dt', m: { enteringWaterTemp: 80, leavingWaterTemp: 81, flowRateGPM: 50 } },
  { name: 'high_dt', m: { enteringWaterTemp: 80, leavingWaterTemp: 110, flowRateGPM: 50 } },
  { name: 'missing_measurements', m: { enteringWaterTemp: null, leavingWaterTemp: null, flowRateGPM: null } },
];
for (const s of hydroScenarios) {
  const r = runHydronicEngine(s.m as any, { profile: hydroProfile });
  const gaps:string[] = [];
  if (r.flags.deltaTStatus && r.flags.deltaTStatus !== 'ok') {
    // check for relevant recommendation text if generation tools produce them
    // scanning existing hydronic module recommendations occurs in later phases; ensure at least placeholder
    if (!Array.isArray(r.recommendations) || r.recommendations.length === 0) gaps.push('No hydronic recommendations present for deltaT abnormal');
  }
  if (r.flags.flowStatus && r.flags.flowStatus !== 'ok') {
    if (!Array.isArray(r.recommendations) || r.recommendations.length === 0) gaps.push('No hydronic recommendations present for flow abnormal');
  }
  findings.push({ engine: 'hydronic', scenario: s.name, flags: r.flags, recCount: r.recommendations?.length||0, gaps });
}

// Condenser approach scenarios
const condenserProfile = { refrigerantType: 'R-410A' } as any;
const condenserScenarios = [
  { name: 'missing_pressure', m: { ambientTemp: 90, condensingPressure: null, liquidLineTemp: 100 } },
  { name: 'bad_approach', m: { ambientTemp: 80, condensingPressure: 900, liquidLineTemp: 50 } },
];
for (const s of condenserScenarios) {
  const r = runCondenserApproachEngine(s.m as any, { profile: condenserProfile });
  const gaps:string[] = [];
  if (r.flags.approachStatus && r.flags.approachStatus !== 'ok') {
    if (!Array.isArray(r.recommendations) || r.recommendations.length === 0) gaps.push('No recommendation addressing condenser approach');
  }
  if (r.flags.subcoolingStatus && r.flags.subcoolingStatus !== 'ok') {
    if (!Array.isArray(r.recommendations) || r.recommendations.length === 0) gaps.push('No recommendation addressing condenser subcooling');
  }
  findings.push({ engine: 'condenser_approach', scenario: s.name, flags: r.flags, recCount: r.recommendations?.length||0, gaps });
}

// Recip compressor scenarios
const recipProfile = { compressor: { rla: 50 }, refrigeration: { refrigerantType: 'OTHER' } } as any;
const recipScenarios = [
  { name: 'low_compression_ratio', m:{ dischargePressure: 120, suctionPressure: 80, suctionTemp: 90, compressorCurrent: 20, totalCylinders: 4, unloadedCylinders: 0 } },
  { name: 'very_high_current', m:{ dischargePressure: 360, suctionPressure: 60, suctionTemp: 55, compressorCurrent: 80, totalCylinders: 4 } },
];
for (const s of recipScenarios) {
  const r = runReciprocatingCompressorEngine(s.m as any, recipProfile as any);
  const gaps:string[] = [];
  if (r.flags.compressionStatus && r.flags.compressionStatus !== 'ok') {
    if (!hasRelevantRecommendation('compressor_recip', r, ['compression', 'bypass', 'valve', 'compressor'])) gaps.push('No recommendation for compression ratio abnormal');
  }
  if (r.flags.currentStatus && r.flags.currentStatus !== 'ok') {
    if (!hasRelevantRecommendation('compressor_recip', r, ['current', 'amp', 'rla', 'overload'])) gaps.push('No recommendation for high/low current');
  }
  findings.push({ engine: 'compressor_recip', scenario: s.name, flags: r.flags, recCount: r.recommendations?.length||0, gaps });
}

// Scroll compressor
const scrollProfile = { compressor: { rla: 10 }, refrigeration: { refrigerantType: 'R-410A' } } as any;
const scrollScenarios = [
  { name: 'bad_compression', m:{ suctionPressure: 40, dischargePressure: 520, suctionTemp: 60, dischargeTemp: 300, runningCurrent: 9 } },
  { name: 'high_current', m:{ suctionPressure: 110, dischargePressure: 400, suctionTemp: 60, runningCurrent: 14 } },
];
for (const s of scrollScenarios) {
  const r = runScrollCompressorEngine(s.m as any, scrollProfile as any);
  const gaps:string[] = [];
  if (r.flags.compressionStatus && r.flags.compressionStatus !== 'ok') {
    if (!hasRelevantRecommendation('compressor', r, ['compression', 'valve', 'bypass'])) gaps.push('No recommendation for scroll compression ratio issues');
  }
  if (r.flags.currentStatus && r.flags.currentStatus !== 'ok') {
    if (!hasRelevantRecommendation('compressor', r, ['current', 'rla', 'amp'])) gaps.push('No recommendation for current abnormal');
  }
  findings.push({ engine: 'compressor_scroll', scenario: s.name, flags: r.flags, recCount: r.recommendations?.length||0, gaps });
}

// Reversing valve
const revProfile = { reversingValve: { solenoid: { voltage: 24 } } } as any;
const revScenarios = [
  { name: 'stuck_valve', m:{ requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet:150, suctionReturn:150, indoorCoilLine:150, outdoorCoilLine:150 }, suctionPressure: 80, dischargePressure: 85, solenoidVoltage: 24 } },
  { name: 'reversed_pattern', m:{ requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet:200, suctionReturn:60, indoorCoilLine:190, outdoorCoilLine:65 }, suctionPressure: 80, dischargePressure: 370, solenoidVoltage: 24 } },
];
for (const s of revScenarios) {
  const r = runReversingValveEngine(s.m as any, revProfile as any);
  const gaps:string[] = [];
  if (r.flags.patternMatch && r.flags.patternMatch !== 'correct') {
    if (!hasRelevantRecommendation('reversing_valve', r, ['revers', 'stuck', 'partial', 'valve'])) gaps.push('No recommendation for pattern match issues');
  }
  if (r.flags.solenoidStatus && r.flags.solenoidStatus !== 'ok') {
    if (!hasRelevantRecommendation('reversing_valve', r, ['solenoid', 'voltage'])) gaps.push('No recommendation for solenoid voltage issues');
  }
  findings.push({ engine: 'reversing_valve', scenario: s.name, flags: r.flags, recCount: r.recommendations?.length||0, gaps });
}

// Use an ISO timestamp (without fractional seconds) and make it filesystem-safe
const now = new Date();
const easternNow = new Date(now.getTime() - 5 * 60 * 60 * 1000); // EST (Eastern Standard Time)
const iso = easternNow.toISOString().replace(/\..+$/, ''); // drop fractional seconds
const safeTs = iso.replace(/:/g, '-'); // e.g. 2025-11-29T18-11-40
const out = {
  scannedAt: easternNow.toISOString(),
  findings,
};

try {
  const filename = `docs/under-review/Recommendation_Gaps_${safeTs}.md`;
  fs.writeFileSync(filename, `# Recommendation Gaps Scan — ${iso}\n\nScanned at: ${easternNow.toISOString()}\n\n` + JSON.stringify(out, null, 2));
  console.log('Wrote', filename);
} catch (err) {
  console.error('failed to write file', err);
}
