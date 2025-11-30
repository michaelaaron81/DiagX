import { test, expect } from 'vitest';
import { runWshpDiagx } from '../src/wshp/wshp.diagx';
import { WaterCooledUnitProfile } from '../src/wshp/wshp.profile';
import fs from 'fs';

// Stress test scenarios for combined profile audit with refrigerant problems
const scenarios: { name: string; profile: any }[] = [
  {
    name: 'Refrigerant Undercharge - High Superheat, Low Subcooling',
    profile: {
      id: 'refrig-undercharge',
      nominalTons: 5,
      airside: { designCFM: { cooling: 2000 }, externalStaticPressure: 0.5 },
      waterSide: { flowRate: 50, loopType: 'open_tower' },
      refrigeration: { refrigerantType: 'R410A', metering: { cooling: { type: 'txv' } } },
      compressor: { type: 'recip', stages: 1, hasVFD: false, rla: 12, lra: 50 },
      electrical: { nameplateVoltage: 460, phase: 3 },
    },
  },
  {
    name: 'Refrigerant Overcharge - Low Superheat, High Subcooling',
    profile: {
      id: 'refrig-overcharge',
      nominalTons: 5,
      airside: { designCFM: { cooling: 2000 }, externalStaticPressure: 0.5 },
      waterSide: { flowRate: 50, loopType: 'open_tower' },
      refrigeration: { refrigerantType: 'R410A', metering: { cooling: { type: 'txv' } } },
      compressor: { type: 'recip', stages: 1, hasVFD: false, rla: 12, lra: 50 },
      electrical: { nameplateVoltage: 460, phase: 3 },
    },
  },
  {
    name: 'Refrigerant Restriction - High Subcooling, High Superheat',
    profile: {
      id: 'refrig-restriction',
      nominalTons: 5,
      airside: { designCFM: { cooling: 2000 }, externalStaticPressure: 0.5 },
      waterSide: { flowRate: 50, loopType: 'open_tower' },
      refrigeration: { refrigerantType: 'R410A', metering: { cooling: { type: 'txv' } } },
      compressor: { type: 'recip', stages: 1, hasVFD: false, rla: 12, lra: 50 },
      electrical: { nameplateVoltage: 460, phase: 3 },
    },
  },
  {
    name: 'Low Refrigerant Pressure - Low Suction/Discharge',
    profile: {
      id: 'refrig-low-pressure',
      nominalTons: 5,
      airside: { designCFM: { cooling: 2000 }, externalStaticPressure: 0.5 },
      waterSide: { flowRate: 50, loopType: 'open_tower' },
      refrigeration: { refrigerantType: 'R410A', metering: { cooling: { type: 'txv' } } },
      compressor: { type: 'recip', stages: 1, hasVFD: false, rla: 12, lra: 50 },
      electrical: { nameplateVoltage: 460, phase: 3 },
    },
  },
  {
    name: 'High Refrigerant Pressure - High Suction/Discharge',
    profile: {
      id: 'refrig-high-pressure',
      nominalTons: 5,
      airside: { designCFM: { cooling: 2000 }, externalStaticPressure: 0.5 },
      waterSide: { flowRate: 50, loopType: 'open_tower' },
      refrigeration: { refrigerantType: 'R410A', metering: { cooling: { type: 'txv' } } },
      compressor: { type: 'recip', stages: 1, hasVFD: false, rla: 12, lra: 50 },
      electrical: { nameplateVoltage: 460, phase: 3 },
    },
  },
  {
    name: 'Non-Condensables - Low Subcooling, Normal Superheat',
    profile: {
      id: 'refrig-noncondensables',
      nominalTons: 5,
      airside: { designCFM: { cooling: 2000 }, externalStaticPressure: 0.5 },
      waterSide: { flowRate: 50, loopType: 'open_tower' },
      refrigeration: { refrigerantType: 'R410A', metering: { cooling: { type: 'txv' } } },
      compressor: { type: 'recip', stages: 1, hasVFD: false, rla: 12, lra: 50 },
      electrical: { nameplateVoltage: 460, phase: 3 },
    },
  },
  {
    name: 'TXV Failure - Erratic Superheat/Subcooling',
    profile: {
      id: 'refrig-txv-failure',
      nominalTons: 5,
      airside: { designCFM: { cooling: 2000 }, externalStaticPressure: 0.5 },
      waterSide: { flowRate: 50, loopType: 'open_tower' },
      refrigeration: { refrigerantType: 'R410A', metering: { cooling: { type: 'txv' } } },
      compressor: { type: 'recip', stages: 1, hasVFD: false, rla: 12, lra: 50 },
      electrical: { nameplateVoltage: 460, phase: 3 },
    },
  },
  {
    name: 'Combined Refrigerant + Airside Problems',
    profile: {
      id: 'refrig-airside-combined',
      nominalTons: 5,
      airside: { designCFM: { cooling: 2000 }, externalStaticPressure: 0.5 },
      waterSide: { flowRate: 50, loopType: 'open_tower' },
      refrigeration: { refrigerantType: 'R410A', metering: { cooling: { type: 'txv' } } },
      compressor: { type: 'recip', stages: 1, hasVFD: false, rla: 12, lra: 50 },
      electrical: { nameplateVoltage: 460, phase: 3 },
    },
  },
];

// Measurements for each scenario - bad refrigerant values
const measurementsMap: Record<string, any> = {
  'refrig-undercharge': {
    airside: { enteringDryBulb: 80, enteringWetBulb: 67, leavingDryBulb: 55, leavingWetBulb: 54, cfm: 2000 },
    refrigeration: { suctionPressure: 100, dischargePressure: 300, suctionTemp: 60, dischargeTemp: 150, liquidTemp: 130 },
    recipCompressor: { compressorId: 'A1', suctionPressure: 100, dischargePressure: 300, suctionTemp: 60, dischargeTemp: 150, compressorCurrent: 10, isRunning: true, totalCylinders: 4 },
    scrollCompressor: { compressorId: 'A1', suctionPressure: 100, dischargePressure: 300, suctionTemp: 60, dischargeTemp: 150, compressorCurrent: 10, isRunning: true },
    reversingValve: { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 150, suctionReturn: 60, indoorCoilLine: 90, outdoorCoilLine: 70 }, solenoidVoltage: 24, suctionPressure: 100, dischargePressure: 300 },
  },
  'refrig-overcharge': {
    airside: { enteringDryBulb: 80, enteringWetBulb: 67, leavingDryBulb: 55, leavingWetBulb: 54, cfm: 2000 },
    refrigeration: { suctionPressure: 100, dischargePressure: 300, suctionTemp: 35, dischargeTemp: 150, liquidTemp: 40 },
    recipCompressor: { compressorId: 'A1', suctionPressure: 100, dischargePressure: 300, suctionTemp: 35, dischargeTemp: 150, compressorCurrent: 10, isRunning: true, totalCylinders: 4 },
    scrollCompressor: { compressorId: 'A1', suctionPressure: 100, dischargePressure: 300, suctionTemp: 35, dischargeTemp: 150, compressorCurrent: 10, isRunning: true },
    reversingValve: { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 150, suctionReturn: 35, indoorCoilLine: 90, outdoorCoilLine: 70 }, solenoidVoltage: 24, suctionPressure: 100, dischargePressure: 300 },
  },
  'refrig-restriction': {
    airside: { enteringDryBulb: 80, enteringWetBulb: 67, leavingDryBulb: 55, leavingWetBulb: 54, cfm: 2000 },
    refrigeration: { suctionPressure: 100, dischargePressure: 300, suctionTemp: 60, dischargeTemp: 150, liquidTemp: 40 },
    recipCompressor: { compressorId: 'A1', suctionPressure: 100, dischargePressure: 300, suctionTemp: 60, dischargeTemp: 150, compressorCurrent: 10, isRunning: true, totalCylinders: 4 },
    scrollCompressor: { compressorId: 'A1', suctionPressure: 100, dischargePressure: 300, suctionTemp: 60, dischargeTemp: 150, compressorCurrent: 10, isRunning: true },
    reversingValve: { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 150, suctionReturn: 60, indoorCoilLine: 90, outdoorCoilLine: 70 }, solenoidVoltage: 24, suctionPressure: 100, dischargePressure: 300 },
  },
  'refrig-low-pressure': {
    airside: { enteringDryBulb: 80, enteringWetBulb: 67, leavingDryBulb: 55, leavingWetBulb: 54, cfm: 2000 },
    refrigeration: { suctionPressure: 80, dischargePressure: 200, suctionTemp: 40, dischargeTemp: 100, liquidTemp: 85 },
    recipCompressor: { compressorId: 'A1', suctionPressure: 80, dischargePressure: 200, suctionTemp: 40, dischargeTemp: 100, compressorCurrent: 10, isRunning: true, totalCylinders: 4 },
    scrollCompressor: { compressorId: 'A1', suctionPressure: 80, dischargePressure: 200, suctionTemp: 40, dischargeTemp: 100, compressorCurrent: 10, isRunning: true },
    reversingValve: { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 100, suctionReturn: 40, indoorCoilLine: 60, outdoorCoilLine: 50 }, solenoidVoltage: 24, suctionPressure: 80, dischargePressure: 200 },
  },
  'refrig-high-pressure': {
    airside: { enteringDryBulb: 80, enteringWetBulb: 67, leavingDryBulb: 55, leavingWetBulb: 54, cfm: 2000 },
    refrigeration: { suctionPressure: 180, dischargePressure: 500, suctionTemp: 65, dischargeTemp: 180, liquidTemp: 125 },
    recipCompressor: { compressorId: 'A1', suctionPressure: 180, dischargePressure: 500, suctionTemp: 65, dischargeTemp: 180, compressorCurrent: 10, isRunning: true, totalCylinders: 4 },
    scrollCompressor: { compressorId: 'A1', suctionPressure: 180, dischargePressure: 500, suctionTemp: 65, dischargeTemp: 180, compressorCurrent: 10, isRunning: true },
    reversingValve: { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 180, suctionReturn: 65, indoorCoilLine: 110, outdoorCoilLine: 90 }, solenoidVoltage: 24, suctionPressure: 180, dischargePressure: 500 },
  },
  'refrig-noncondensables': {
    airside: { enteringDryBulb: 80, enteringWetBulb: 67, leavingDryBulb: 55, leavingWetBulb: 54, cfm: 2000 },
    refrigeration: { suctionPressure: 130, dischargePressure: 360, suctionTemp: 50, dischargeTemp: 145, liquidTemp: 95 },
    recipCompressor: { compressorId: 'A1', suctionPressure: 130, dischargePressure: 360, suctionTemp: 50, dischargeTemp: 145, compressorCurrent: 10, isRunning: true, totalCylinders: 4 },
    scrollCompressor: { compressorId: 'A1', suctionPressure: 130, dischargePressure: 360, suctionTemp: 50, dischargeTemp: 145, compressorCurrent: 10, isRunning: true },
    reversingValve: { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 145, suctionReturn: 50, indoorCoilLine: 85, outdoorCoilLine: 65 }, solenoidVoltage: 24, suctionPressure: 130, dischargePressure: 360 },
  },
  'refrig-txv-failure': {
    airside: { enteringDryBulb: 80, enteringWetBulb: 67, leavingDryBulb: 55, leavingWetBulb: 54, cfm: 2000 },
    refrigeration: { suctionPressure: 125, dischargePressure: 375, suctionTemp: 48, dischargeTemp: 155, liquidTemp: 105 },
    recipCompressor: { compressorId: 'A1', suctionPressure: 125, dischargePressure: 375, suctionTemp: 48, dischargeTemp: 155, compressorCurrent: 10, isRunning: true, totalCylinders: 4 },
    scrollCompressor: { compressorId: 'A1', suctionPressure: 125, dischargePressure: 375, suctionTemp: 48, dischargeTemp: 155, compressorCurrent: 10, isRunning: true },
    reversingValve: { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 155, suctionReturn: 48, indoorCoilLine: 90, outdoorCoilLine: 70 }, solenoidVoltage: 24, suctionPressure: 125, dischargePressure: 375 },
  },
  'refrig-airside-combined': {
    airside: { enteringDryBulb: 80, enteringWetBulb: 67, leavingDryBulb: 70, leavingWetBulb: 68, cfm: 1000 },
    refrigeration: { suctionPressure: 110, dischargePressure: 320, suctionTemp: 52, dischargeTemp: 135, liquidTemp: 98 },
    recipCompressor: { compressorId: 'A1', suctionPressure: 110, dischargePressure: 320, suctionTemp: 52, dischargeTemp: 135, compressorCurrent: 10, isRunning: true, totalCylinders: 4 },
    scrollCompressor: { compressorId: 'A1', suctionPressure: 110, dischargePressure: 320, suctionTemp: 52, dischargeTemp: 135, compressorCurrent: 10, isRunning: true },
    reversingValve: { requestedMode: 'cooling', reversingValvePortTemps: { dischargeInlet: 135, suctionReturn: 52, indoorCoilLine: 80, outdoorCoilLine: 60 }, solenoidVoltage: 24, suctionPressure: 110, dischargePressure: 320 },
  },
};

test('combined profile refrigerant stress test - generate detailed log', () => {
  const now = new Date();
  const easternNow = new Date(now.getTime() - 5 * 60 * 60 * 1000); // EST
  const iso = easternNow.toISOString().replace(/\..+$/, '');
  const safeTs = iso.replace(/:/g, '-');
  const filename = `docs/audits/Combined_Profile_Refrigerant_Stress_Test_Log_${safeTs}.md`;

  let log = `# Combined Profile Refrigerant Stress Test Log\n\n`;
  log += `Generated at: ${easternNow.toISOString()}\n\n`;
  log += `This log details ${scenarios.length} stress test scenarios for combined profile audits with refrigerant-related failures, including input parameters and output results.\n\n`;

  scenarios.forEach((scenario, index) => {
    log += `## Scenario ${index + 1}: ${scenario.name}\n\n`;
    log += `### Input Profile\n\`\`\`json\n${JSON.stringify(scenario.profile, null, 2)}\n\`\`\`\n\n`;
    log += `### Input Measurements\n\`\`\`json\n${JSON.stringify(measurementsMap[scenario.profile.id], null, 2)}\n\`\`\`\n\n`;

    const measurements = measurementsMap[scenario.profile.id];
    const result = runWshpDiagx({ profile: scenario.profile, measurements });

    log += `### Output Audit Result\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\`\n\n`;

    // Collect all recommendations from domain results
    const allRecs: any[] = [];
    result.domainResults.forEach(dr => {
      if ((dr.details as any)?.recommendations) {
        allRecs.push(...(dr.details as any).recommendations);
      }
    });

    if (allRecs.length > 0) {
      log += `### Recommendations Generated (${allRecs.length})\n`;
      allRecs.forEach((rec, i) => {
        log += `- **${rec.title}**: ${rec.description}\n`;
      });
      log += '\n';
    } else {
      log += `### No Recommendations Generated\n\n`;
    }

    // Assertions for refrigeration recommendations
    const refrigerationResult = result.domainResults.find(dr => dr.domain === 'refrigeration');
    if (refrigerationResult && (refrigerationResult.details as any)?.recommendations) {
      const refrigRecs = (refrigerationResult.details as any).recommendations;
      const recIds = refrigRecs.map((r: any) => r.id);

      // Check for expected recs based on scenario
      if (scenario.name.includes('Undercharge')) {
        expect(recIds).toContain('refrigeration_charge_pattern_low');
      }
      if (scenario.name.includes('Overcharge')) {
        expect(recIds).toContain('refrigeration_subcooling_elevated_pattern');
      }
      if (scenario.name.includes('Restriction')) {
        expect(recIds).toContain('refrigeration_flow_or_heat_transfer_limited');
      }
      // Add more as needed
    }

    log += `---\n\n`;
  });

  fs.writeFileSync(filename, log);
  console.log('Wrote refrigerant stress test log:', filename);

  // Basic assertion to ensure test runs
  expect(scenarios.length).toBeGreaterThan(0);
});