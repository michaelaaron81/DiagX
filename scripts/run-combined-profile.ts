import { runAirsideEngine } from '../src/modules/airside/airside.engine';
import { runRefrigerationEngine } from '../src/modules/refrigeration/refrigeration.engine';
import { runReciprocatingCompressorEngine } from '../src/modules/compressor/recip.engine';
import { runScrollCompressorEngine } from '../src/modules/compressor/scroll.engine';
import { runReversingValveEngine } from '../src/modules/reversingValve/reversing.engine';

function print(title: string, obj: Record<string, unknown>) {
  console.log('\n---- ' + title + ' ----');
  console.log(JSON.stringify(obj, null, 2));
}

// Build a profile for a 5-ton unit with typical nameplate
const profile: Record<string, unknown> = {
  id: 'stress-test-1',
  nominalTons: 5,
  airside: { designCFM: { cooling: 2400 }, externalStaticPressure: { design: 0.25, max: 0.6 } },
  refrigeration: { refrigerant: 'R-410A', metering: { cooling: { type: 'txv' } } },
  compressor: { type: 'scroll', rla: 10, lra: 35 },
  reversingValve: { type: 'standard', solenoid: { voltage: 24 } },
};

// Scenario: airside severely restricted -> high delta T / low airflow
const airMeasurements: Record<string, unknown> = {
  mode: 'cooling',
  returnAirTemp: 78,
  supplyAirTemp: 30, // deltaT = 48°F (very high)
  measuredCFM: 600,  // 120 cfm/ton (too low)
  externalStatic: 0.85,
};

// Hypothesis: severe airside restriction -> reduced load on evaporator and possible low refrigerant heat transfer
// We'll feed refrigeration some measurements that are plausibly coupled
const refrigerationMeasurements: Record<string, unknown> = {
  mode: 'cooling',
  suctionPressure: 70,  // low suction pressure
  dischargePressure: 360,
  suctionTemp: 60,      // relatively warm suction sensor
  liquidTemp: 95,
  enteringWaterTemp: 80,
  leavingWaterTemp: 88,
};

// Compressors - provide measurements that simulate normal load but allow us to show interactions
const recipMeasurements: Record<string, unknown> = {
  dischargePressure: 360,
  suctionPressure: 70,
  suctionTemp: 60,
  compressorCurrent: 30,
  totalCylinders: 4,
  unloadedCylinders: 0,
};

const scrollMeasurements: Record<string, unknown> = {
  suctionPressure: 70,
  dischargePressure: 360,
  suctionTemp: 60,
  runningCurrent: 12,
  dischargeTemp: 240,
};

// Reversing valve scenario: normal solenoid voltage, but temperatures might show mismatches
const reversingMeasurements: Record<string, unknown> = {
  requestedMode: 'cooling',
  reversingValvePortTemps: { dischargeInlet: 200, suctionReturn: 65, indoorCoilLine: 190, outdoorCoilLine: 70 },
  suctionPressure: 70,
  dischargePressure: 360,
  solenoidVoltage: 24,
};

// Run engines
const airResult = runAirsideEngine(airMeasurements, profile);
print('Airside Result', airResult);

const refResult = runRefrigerationEngine(refrigerationMeasurements, profile.refrigeration);
print('Refrigeration Result', refResult);

const recipResult = runReciprocatingCompressorEngine(recipMeasurements as unknown as Record<string, unknown>, profile as unknown as Record<string, unknown>);
print('Recip Engine Result', recipResult);

const scrollResult = runScrollCompressorEngine(scrollMeasurements as unknown as Record<string, unknown>, profile as unknown as Record<string, unknown>);
print('Scroll Engine Result', scrollResult);

const revValveResult = runReversingValveEngine(reversingMeasurements as unknown as Record<string, unknown>, profile as unknown as Record<string, unknown>);
print('Reversing Valve Result', revValveResult);

// Analysis: naive correlation summary
console.log('\n==== Correlation Summary ===');
const criticalItems: string[] = [];
if (airResult.status === 'critical') criticalItems.push('Airside is CRITICAL');
if (refResult.status === 'critical') criticalItems.push('Refrigeration is CRITICAL');
if (recipResult.status === 'critical') criticalItems.push('Recip compressor CRITICAL');
if (scrollResult.status === 'critical') criticalItems.push('Scroll compressor CRITICAL');
if (revValveResult.status === 'critical') criticalItems.push('Reversing valve CRITICAL');

console.log('Critical domains:', criticalItems.length ? criticalItems.join(', ') : 'none');

console.log('\nEngine Recommendations (combined):');
const allRecs = [airResult.recommendations || [], refResult.recommendations || [], recipResult.recommendations || [], scrollResult.recommendations || [], revValveResult.recommendations || []].flat();
console.log(JSON.stringify(allRecs, null, 2));

// Write a timestamped, full audit into docs/audits/
import fs from 'fs';
const now = new Date();
const easternNow = new Date(now.getTime() - 5 * 60 * 60 * 1000); // EST
const iso = easternNow.toISOString().replace(/\..+$/, '');
const safeTs = iso.replace(/:/g, '-');
const filename = `docs/under-review/Combined_Profile_Stress_Test_Audit_${safeTs}.md`;
const report = [] as string[];
report.push(`# Combined Profile Stress Test Audit — ${iso}`);
report.push(`Scanned at: ${easternNow.toISOString()}`);
report.push('\n## Profile\n');
report.push('```json');
report.push(JSON.stringify(profile, null, 2));
report.push('```');
report.push('\n## Engine Results\n');
report.push('### Airside');
report.push('```json');
report.push(JSON.stringify(airResult, null, 2));
report.push('```');
report.push('### Refrigeration');
report.push('```json');
report.push(JSON.stringify(refResult, null, 2));
report.push('```');
report.push('### Reciprocating Compressor');
report.push('```json');
report.push(JSON.stringify(recipResult, null, 2));
report.push('```');
report.push('### Scroll Compressor');
report.push('```json');
report.push(JSON.stringify(scrollResult, null, 2));
report.push('```');
report.push('### Reversing Valve');
report.push('```json');
report.push(JSON.stringify(revValveResult, null, 2));
report.push('```');
report.push('\n## Correlation Summary\n');
report.push(criticalItems.length ? criticalItems.join(', ') : 'none');
report.push('\n## Combined Recommendations\n');
report.push('```json');
report.push(JSON.stringify(allRecs, null, 2));
report.push('```');

fs.writeFileSync(filename, report.join('\n'));
console.log('Wrote', filename);

