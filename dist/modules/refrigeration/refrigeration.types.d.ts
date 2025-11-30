export type RefrigerantType = 'R410A' | 'R134A' | 'R407C' | 'R22' | string;
import { PTChartData } from './refrigerantData';
export type RefrigerantProfileType = 'standard' | 'unknown';
export interface RefrigerationConfig {
    refrigerant: RefrigerantType;
    coolingMeterType: 'txv' | 'eev' | 'fixed' | 'bidirectional_txv';
    heatingMeterType?: 'txv' | 'eev' | 'fixed' | 'bidirectional_txv';
    nominalTons: number;
    designWaterFlowGPM: number;
    superheatCoolingTXV: {
        min: number;
        ideal: number;
        max: number;
    };
    superheatCoolingFixed: {
        min: number;
        ideal: number;
        max: number;
    };
    superheatHeatingTXV: {
        min: number;
        ideal: number;
        max: number;
    };
    subcoolingWaterCooled: {
        min: number;
        ideal: number;
        max: number;
    };
    compressionRatioRange: {
        min: number;
        ideal: number;
        max: number;
    };
    ptOverride?: PTChartData;
    metering?: {
        cooling?: {
            type: 'txv' | 'eev' | 'fixed' | 'bidirectional_txv';
        };
        heating?: {
            type: 'txv' | 'eev' | 'fixed' | 'bidirectional_txv';
        };
    };
}
export interface RefrigerationMeasurements {
    mode: 'cooling' | 'heating';
    suctionPressure: number;
    dischargePressure: number;
    suctionTemp: number;
    liquidTemp: number;
    enteringWaterTemp?: number;
    leavingWaterTemp?: number;
    dischargeTemp?: number;
    indoorAirTemp?: number;
    ambientTemp?: number | null;
    condensingPressure?: number | null;
}
