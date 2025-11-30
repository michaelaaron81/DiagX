import { DiagnosticStatus, Recommendation, EngineResult } from '../../shared/wshp.types';

export type RefrigerantProfileType = 'standard' | 'unknown';

export interface ReciprocatingCompressorMeasurements {
  compressorId?: string;

  // Pressures (PSIG)
  suctionPressure: number;
  dischargePressure: number;

  // Temperatures (°F)
  suctionTemp: number;
  dischargeTemp?: number;

  // Electrical
  compressorCurrent?: number; // Measured amps
  isRunning?: boolean;

  // Unloading / configuration
  totalCylinders?: number;
  unloadedCylinders?: number;

  // Subjective sound observations
  soundCharacteristics?: {
    knocking?: boolean;
    clicking?: boolean;
    hissing?: boolean;
  };
}

export interface ReciprocatingHealthFlags {
  reedValveSuspected?: boolean;
  pistonRingWearSuspected?: boolean;
}

export interface ReciprocatingUnloadingInfo {
  unloadedCount?: number;
  total?: number;
  status: DiagnosticStatus;
}

export interface ReciprocatingCompressorValues {
  compressionRatio: number;
  current?: number;
  running?: boolean;
  // Unloading facts
  unloadingInfo?: { unloadedCount?: number; total?: number };
}

export interface ReciprocatingCompressorFlags {
  compressionStatus: DiagnosticStatus;
  currentStatus: DiagnosticStatus;
  recipHealth?: ReciprocatingHealthFlags;
  // overall presentation strings removed from engine — modules should generate message text
  disclaimers?: string[];
  refrigerantProfile?: RefrigerantProfileType;
}

export interface ReciprocatingCompressorResult extends EngineResult<ReciprocatingCompressorValues, ReciprocatingCompressorFlags> {
  status: DiagnosticStatus;
  compressorId?: string;

  // Backward-compatible flattened fields
  compressionRatio: number;
  compressionStatus: DiagnosticStatus;

  current?: number;
  currentStatus: DiagnosticStatus;

  running?: boolean;

  unloadingInfo?: ReciprocatingUnloadingInfo;

  disclaimers: string[];
  recommendations: Recommendation[];
}

// You can make this a real type later if you want compressor-specific config
// Generic compressor config placeholder — prefer unknown for safety until explicitly typed
export type ReciprocatingCompressorConfig = Record<string, unknown> | unknown;

