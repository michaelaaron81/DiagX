import { DiagnosticStatus, Recommendation, EngineResult } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';

export interface ScrollCompressorMeasurements {
  mode: 'cooling' | 'heating';
  suctionPressure: number; // PSIG
  dischargePressure: number; // PSIG
  suctionTemp: number; // °F
  dischargeTemp?: number; // °F optional
  runningCurrent?: number; // amps
  voltage?: number; // V
  isRunning?: boolean;
}

export interface ScrollCompressorValues {
  suctionPressure: number;
  dischargePressure: number;
  compressionRatio: number;
  dischargeSuperheat?: number;
  currentDraw?: number;
}

export interface ScrollCompressorFlags {
  currentStatus?: DiagnosticStatus;
  compressionStatus?: DiagnosticStatus;
  // presentation strings moved to module layer (not returned by engine)
  disclaimers?: string[];
}

export interface ScrollCompressorResult extends EngineResult<ScrollCompressorValues, ScrollCompressorFlags> {
  status: DiagnosticStatus;
  compressorType: 'scroll';

  suctionPressure: number;
  dischargePressure: number;
  compressionRatio: number;

  dischargeSuperheat?: number;

  currentDraw?: number;
  currentStatus?: DiagnosticStatus;
  compressionStatus?: DiagnosticStatus;

  // presentation-level fields (overallFinding / likelyIssue) are not included in engine core result

  disclaimers?: string[];
  recommendations: Recommendation[];
}

export type ScrollCompressorConfig = WaterCooledUnitProfile;

// Note: prefer named exports only — avoid default exports for types
