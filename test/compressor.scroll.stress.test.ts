import { test, expect } from 'vitest';
import { runScrollCompressorEngine } from '../src/modules/compressor/scroll.engine';
import { ScrollCompressorMeasurements } from '../src/modules/compressor/scroll.types';
import { WaterCooledUnitProfile } from '../src/wshp/wshp.profile';
import fs from 'fs';

// Stress test scenarios for scroll compressor engine
const scrollScenarios: { name: string; measurements: ScrollCompressorMeasurements; profile: WaterCooledUnitProfile }[] = [
  {
    name: 'Normal Operation - OK Status',
    measurements: {
      mode: 'cooling',
      suctionPressure: 110,
      dischargePressure: 400,
      suctionTemp: 60,
      dischargeTemp: 180,
      runningCurrent: 8,
    },
    profile: {
      compressor: { type: 'scroll', rla: 10 },
      refrigeration: { refrigerantType: 'R-410A' },
    } as WaterCooledUnitProfile,
  },
  {
    name: 'High Current - Above RLA',
    measurements: {
      mode: 'cooling',
      suctionPressure: 110,
      dischargePressure: 400,
      suctionTemp: 60,
      dischargeTemp: 180,
      runningCurrent: 14,
    },
    profile: {
      compressor: { type: 'scroll', rla: 10 },
      refrigeration: { refrigerantType: 'R-410A' },
    } as WaterCooledUnitProfile,
  },
  {
    name: 'Bad Compression - High Ratio',
    measurements: {
      mode: 'cooling',
      suctionPressure: 40,
      dischargePressure: 520,
      suctionTemp: 60,
      dischargeTemp: 300,
      runningCurrent: 9,
    },
    profile: {
      compressor: { type: 'scroll', rla: 10 },
      refrigeration: { refrigerantType: 'R-410A' },
    } as WaterCooledUnitProfile,
  },
  {
    name: 'Low Current - Below Expected Range',
    measurements: {
      mode: 'cooling',
      suctionPressure: 110,
      dischargePressure: 400,
      suctionTemp: 60,
      dischargeTemp: 180,
      runningCurrent: 3,
    },
    profile: {
      compressor: { type: 'scroll', rla: 10 },
      refrigeration: { refrigerantType: 'R-410A' },
    } as WaterCooledUnitProfile,
  },
  {
    name: 'Combined Critical - High Ratio and High Current',
    measurements: {
      mode: 'cooling',
      suctionPressure: 40,
      dischargePressure: 520,
      suctionTemp: 60,
      dischargeTemp: 300,
      runningCurrent: 16,
    },
    profile: {
      compressor: { type: 'scroll', rla: 10 },
      refrigeration: { refrigerantType: 'R-410A' },
    } as WaterCooledUnitProfile,
  },
];

test('scroll compressor stress test - generate detailed log', () => {
  const now = new Date();
  const easternNow = new Date(now.getTime() - 5 * 60 * 60 * 1000); // EST
  const iso = easternNow.toISOString().replace(/\..+$/, '');
  const safeTs = iso.replace(/:/g, '-');
  const filename = `docs/under-review/Scroll_Stress_Test_Log_${safeTs}.md`;

  let log = `# Scroll Compressor Engine Stress Test Log\n\n`;
  log += `Generated at: ${easternNow.toISOString()}\n\n`;
  log += `This log details ${scrollScenarios.length} stress test scenarios for the scroll compressor engine, including input parameters and output results.\n\n`;

  scrollScenarios.forEach((scenario, index) => {
    log += `## Scenario ${index + 1}: ${scenario.name}\n\n`;
    log += `### Input Measurements\n\`\`\`json\n${JSON.stringify(scenario.measurements, null, 2)}\n\`\`\`\n\n`;
    log += `### Input Profile (Relevant Parts)\n\`\`\`json\n${JSON.stringify(scenario.profile, null, 2)}\n\`\`\`\n\n`;

    const result = runScrollCompressorEngine(scenario.measurements, scenario.profile as WaterCooledUnitProfile);

    log += `### Output Result\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\`\n\n`;

    if (result.recommendations && result.recommendations.length > 0) {
      log += `### Recommendations Generated (${result.recommendations.length})\n`;
      result.recommendations.forEach(rec => {
        log += `- **${rec.title}**: ${rec.description}\n`;
      });
      log += '\n';
    } else {
      log += `### No Recommendations Generated\n\n`;
    }

    log += `---\n\n`;
  });

  fs.writeFileSync(filename, log);
  console.log('Wrote scroll stress test log:', filename);

  // Basic assertion to ensure test runs
  expect(scrollScenarios.length).toBeGreaterThan(0);
});
