import { DiagnosticStatus, Recommendation, EngineResult } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';

export interface ReversingValvePortTemps {
  dischargeInlet: number; // From compressor
  suctionReturn: number;  // To compressor
  indoorCoilLine: number; // To/from indoor coil
  outdoorCoilLine: number;// To/from outdoor coil
}

export interface ReversingValveMeasurements {
  requestedMode: 'cooling' | 'heating';
  reversingValvePortTemps: ReversingValvePortTemps;
  solenoidVoltage?: number; // VAC
  suctionPressure: number; // PSIG
  dischargePressure: number; // PSIG
}

export interface ReversingValveValues {
  portTemps: ReversingValvePortTemps;
  tempSpread: number;
  hotPorts: string[];
  coldPorts: string[];
  compressionRatio: number;
}

export interface ReversingValveFlags {
  patternMatch: 'correct' | 'reversed' | 'stuck' | 'partial_leak';
  // removed engine-level message strings; modules should produce humane text
  solenoidStatus?: 'ok' | 'no_voltage' | 'low_voltage';
  // patternMessage / solenoidMessage / overallFinding / likelyIssue are presentation-level and not part of engine flags
}

export interface ReversingValveDiagnosis extends EngineResult<ReversingValveValues, ReversingValveFlags> {
  status: DiagnosticStatus;
  requestedMode: 'cooling' | 'heating';

  portTemps: ReversingValvePortTemps;
  tempSpread: number;
  hotPorts: string[];
  coldPorts: string[];
  patternMatch: 'correct' | 'reversed' | 'stuck' | 'partial_leak';
  compressionRatio: number;
  solenoidStatus?: 'ok' | 'no_voltage' | 'low_voltage';
  // presentation-level fields (messages, overallFinding) are produced at the module/UI layer
  recommendations: Recommendation[];
}

export type ReversingValveConfig = WaterCooledUnitProfile;

// prefer named exports only
