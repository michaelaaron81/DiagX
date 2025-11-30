// WSHP profile types and helpers

export interface AirsideSpec {
  designCFM: {
    cooling: number;
    heating?: number;
  };
  externalStaticPressure: {
    design: number;
    max: number;
  };
  // Optional manufacturer-provided performance ranges. Do NOT include OEM reference tables in the repo.
  // These may be provided by the user at runtime/profile ingestion to override industry defaults.
  manufacturerExpectedDeltaT?: { min: number; ideal: number; max: number };
  manufacturerCFMPerTon?: { min: number; ideal: number; max: number };
}

export interface WaterSideSpec {
  flowRate: number; // GPM
  loopType: 'open_tower' | 'closed_tower' | 'boiler' | 'ground_loop';
  expectedDeltaT?: { min: number; ideal: number; max: number; source?: string } | null;
}

export interface MeteringConfig {
  type: 'txv' | 'eev' | 'fixed' | 'bidirectional_txv';
}

export interface RefrigerationConfigProfile {
  refrigerantType: string; // simplified for now
  metering: {
    cooling: MeteringConfig;
    heating?: MeteringConfig;
  };
  // Optional manual PT table/override provided in the profile by the user (do NOT add OEM data into repo)
  ptOverride?: Array<[number, number]>;
}

export interface ReversingValveProfile {
  type: 'four_way' | 'none';
  solenoid: {
    voltage: number;
  };
}

export interface CompressorProfile {
  type: 'scroll' | 'recip';
  stages: number;
  hasVFD: boolean;
  rla: number;
  lra: number;
}

export interface ElectricalProfile {
  nameplateVoltage: number;
  phase: 1 | 3;
  mca?: number;
  mop?: number;
}

export interface WaterCooledUnitProfile {
  id?: string;
  model?: string;
  nominalTons: number;

  airside: AirsideSpec;
  waterSide: WaterSideSpec;
  refrigeration: RefrigerationConfigProfile;
  reversingValve?: ReversingValveProfile;
  compressor: CompressorProfile;
  electrical: ElectricalProfile;

  supportsHeating: boolean;
  hasElectricHeat?: boolean;
}

export function hasReversingValve(profile: WaterCooledUnitProfile): boolean {
  return !!profile.reversingValve && profile.supportsHeating;
}

export function hasVFD(profile: WaterCooledUnitProfile): boolean {
  return !!profile.compressor && profile.compressor.hasVFD;
}
