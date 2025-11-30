export interface AirsideSpec {
    designCFM: {
        cooling: number;
        heating?: number;
    };
    externalStaticPressure: {
        design: number;
        max: number;
    };
    manufacturerExpectedDeltaT?: {
        min: number;
        ideal: number;
        max: number;
    };
    manufacturerCFMPerTon?: {
        min: number;
        ideal: number;
        max: number;
    };
}
export interface WaterSideSpec {
    flowRate: number;
    loopType: 'open_tower' | 'closed_tower' | 'boiler' | 'ground_loop';
    expectedDeltaT?: {
        min: number;
        ideal: number;
        max: number;
        source?: string;
    } | null;
}
export interface MeteringConfig {
    type: 'txv' | 'eev' | 'fixed' | 'bidirectional_txv';
}
export interface RefrigerationConfigProfile {
    refrigerantType: string;
    metering: {
        cooling: MeteringConfig;
        heating?: MeteringConfig;
    };
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
export declare function hasReversingValve(profile: WaterCooledUnitProfile): boolean;
export declare function hasVFD(profile: WaterCooledUnitProfile): boolean;
