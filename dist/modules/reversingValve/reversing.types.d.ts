import { DiagnosticStatus, Recommendation, EngineResult } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
export interface ReversingValvePortTemps {
    dischargeInlet: number;
    suctionReturn: number;
    indoorCoilLine: number;
    outdoorCoilLine: number;
}
export interface ReversingValveMeasurements {
    requestedMode: 'cooling' | 'heating';
    reversingValvePortTemps: ReversingValvePortTemps;
    solenoidVoltage?: number;
    suctionPressure: number;
    dischargePressure: number;
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
    solenoidStatus?: 'ok' | 'no_voltage' | 'low_voltage';
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
    recommendations: Recommendation[];
}
export type ReversingValveConfig = WaterCooledUnitProfile;
