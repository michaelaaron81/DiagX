// Minimal CombinedProfile types used by module tests and orchestration
export interface BaseProfile {
  id?: string;
  nominalTons?: number;
}

export interface WaterSideProfile {
  flowRate?: number;
  loopType?: 'open_tower' | 'closed_tower' | 'boiler' | 'ground_loop' | 'closed_loop' | 'other';
  expectedDeltaT?: { min: number; ideal: number; max: number; source?: string } | null;
}

export interface CombinedProfile extends BaseProfile {
  airside?: any;
  waterSide?: WaterSideProfile;
  refrigeration?: any;
  compressor?: any;
  electrical?: any;
}

export default CombinedProfile;
