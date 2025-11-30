export type RefrigerantType = 'R410A' | 'R134A' | 'R407C' | 'R22' | string;

import { PTChartData } from './refrigerantData';

export type RefrigerantProfileType = 'standard' | 'unknown';

export interface RefrigerationConfig {
  refrigerant: RefrigerantType;
  coolingMeterType: 'txv' | 'eev' | 'fixed' | 'bidirectional_txv';
  heatingMeterType?: 'txv' | 'eev' | 'fixed' | 'bidirectional_txv';

  nominalTons: number;
  designWaterFlowGPM: number;

  superheatCoolingTXV: { min: number; ideal: number; max: number };
  superheatCoolingFixed: { min: number; ideal: number; max: number };
  superheatHeatingTXV: { min: number; ideal: number; max: number };
  subcoolingWaterCooled: { min: number; ideal: number; max: number };
  compressionRatioRange: { min: number; ideal: number; max: number };
  // Optional manual PT table override (user-supplied only; don't add OEM tables to repo)
  ptOverride?: PTChartData;
}

export interface RefrigerationMeasurements {
  mode: 'cooling' | 'heating';

  suctionPressure: number; // psig
  dischargePressure: number; // psig

  suctionTemp: number; // °F measured at suction
  liquidTemp: number; // °F measured at liquid line (liquid pressure temp)

  enteringWaterTemp?: number; // °F
  leavingWaterTemp?: number; // °F
  dischargeTemp?: number; // °F (optional - measured at discharge if available)
  indoorAirTemp?: number; // °F
  // Additional ambient / condensing data sometimes provided in combined measurements
  ambientTemp?: number | null; // °F ambient (outside) used for condenser approach
  condensingPressure?: number | null; // psig - condensing/discharge pressure for condenser approach analysis
}

