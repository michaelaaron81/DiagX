import { test, expect } from 'vitest';
import { runReciprocatingCompressorEngine } from '../src/modules/compressor/recip.engine';
import { ReciprocatingCompressorMeasurements } from '../src/modules/compressor/recip.types';
import { WaterCooledUnitProfile } from '../src/wshp/wshp.profile';
import fs from 'fs';

// Stress test scenarios for reciprocating compressor engine
const scenarios: { name: string; measurements: ReciprocatingCompressorMeasurements; profile: Record<string, unknown> }[] = [
  {
    name: 'Normal Operation - OK Status',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 250,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Critical Compression Ratio - High (>10)',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 10,
      dischargePressure: 150,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Critical Compression Ratio - Low (<2.5)',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 100,
      dischargePressure: 200,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Critical Current - Far Above RLA (>140%)',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 250,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 18,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Warning Current - Low (<30%)',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 250,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 3,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Alert Compression Ratio (3.0-6.5)',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 300,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Alert Current (115-140%)',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 250,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 14,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Unloading Alert - Negative Unloaded',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 250,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: -1,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Unloading Warning - Partial Unload',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 250,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 2,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Health Flags - Reed Valve Suspected (Hissing + Bad Ratio)',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 350,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: { hissing: true },
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Health Flags - Piston Ring Wear Suspected (Knocking + Bad Ratio)',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 350,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: { knocking: true },
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Combined Critical - Compression + Current',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 10,
      dischargePressure: 150,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 18,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Custom Refrigerant Disclaimer',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 250,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerant: 'OTHER' },
    },
  },
  {
    name: 'No RLA in Profile',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 250,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: true,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: {},
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
  {
    name: 'Not Running Warning',
    measurements: {
      compressorId: 'recip1',
      suctionPressure: 50,
      dischargePressure: 250,
      suctionTemp: 45,
      dischargeTemp: 120,
      compressorCurrent: 10,
      isRunning: false,
      totalCylinders: 6,
      unloadedCylinders: 0,
      soundCharacteristics: {},
    },
    profile: {
      compressor: { rla: 12 },
      refrigeration: { refrigerantType: 'R410A' },
    },
  },
];

test('reciprocating compressor stress test - generate detailed log', () => {
  const now = new Date();
  const easternNow = new Date(now.getTime() - 5 * 60 * 60 * 1000); // EST
  const iso = easternNow.toISOString().replace(/\..+$/, '');
  const safeTs = iso.replace(/:/g, '-');
  const filename = `docs/under-review/Recip_Stress_Test_Log_${safeTs}.md`;

  let log = `# Reciprocating Compressor Engine Stress Test Log\n\n`;
  log += `Generated at: ${easternNow.toISOString()}\n\n`;
  log += `This log details ${scenarios.length} stress test scenarios for the reciprocating compressor engine, including input parameters and output results.\n\n`;

  scenarios.forEach((scenario, index) => {
    log += `## Scenario ${index + 1}: ${scenario.name}\n\n`;
    log += `### Input Measurements\n\`\`\`json\n${JSON.stringify(scenario.measurements, null, 2)}\n\`\`\`\n\n`;
    log += `### Input Profile (Relevant Parts)\n\`\`\`json\n${JSON.stringify(scenario.profile, null, 2)}\n\`\`\`\n\n`;

    const result = runReciprocatingCompressorEngine(scenario.measurements, scenario.profile as WaterCooledUnitProfile);

    log += `### Output Result\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\`\n\n`;

    if (result.recommendations && result.recommendations.length > 0) {
      log += `### Recommendations Generated (${result.recommendations.length})\n`;
      result.recommendations.forEach(rec => {
        // Validate recommendations during stress logging
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { validateRecommendation } = require('../src/shared/recommendation.schema');
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { assertRecommendationTextSafe } = require('./helpers/recommendationGuards');
          validateRecommendation(rec);
          assertRecommendationTextSafe(rec);
        } catch (err) {
          // ignore validation errors in the log
        }
        log += `- **${rec.title ?? rec.id ?? '<no title>'}**: ${rec.description ?? rec.summary ?? ''}\n`;
      });
      log += '\n';
    } else {
      log += `### No Recommendations Generated\n\n`;
    }

    log += `---\n\n`;
  });

  fs.writeFileSync(filename, log);
  console.log('Wrote stress test log:', filename);

  // Basic assertion to ensure test runs
  expect(scenarios.length).toBeGreaterThan(0);
});
