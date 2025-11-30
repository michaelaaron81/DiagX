// Demo CLI harness placeholder. The real implementation will be added in Phase 1.
import { runWshpDiagx } from '../wshp/wshp.diagx';
import { WaterCooledUnitProfile } from '../wshp/wshp.profile';
import type { RefrigerationMeasurements } from '../modules/refrigeration/refrigeration.types';

console.log('cli/demo starting');

const profile: WaterCooledUnitProfile = {
	id: 'demo-unit',
	nominalTons: 3,
	airside: {
		designCFM: { cooling: 1000 },
		externalStaticPressure: { design: 0.25, max: 0.5 },
	},
	waterSide: { flowRate: 30, loopType: 'closed_tower' },
	refrigeration: {
		refrigerantType: 'R410A',
		metering: { cooling: { type: 'txv' } },
	},
	compressor: { type: 'scroll', stages: 1, hasVFD: false, rla: 10, lra: 40 },
	electrical: { nameplateVoltage: 460, phase: 3 },
	supportsHeating: false,
};

const refrigeration: RefrigerationMeasurements = {
	mode: 'cooling',
	suctionPressure: 120,
	dischargePressure: 300,
	suctionTemp: 55,
	liquidTemp: 95,
	enteringWaterTemp: 80,
	leavingWaterTemp: 88,
	indoorAirTemp: 75,
};

const result = runWshpDiagx({ profile, measurements: { refrigeration } });

console.log(JSON.stringify(result, null, 2));
