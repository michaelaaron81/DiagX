export interface WaterSideMeasurements {
    enteringWaterTemp?: number | null;
    leavingWaterTemp?: number | null;
    flowGpm?: number | null;
    ambientWetBulb?: number | null;
    ambientDryBulb?: number | null;
}
export interface RefrigerationMeasurements {
    mode?: 'cooling' | 'heating';
    suctionPressure?: number | null;
    dischargePressure?: number | null;
    suctionTemp?: number | null;
    liquidTemp?: number | null;
    ambientTemp?: number | null;
    condensingPressure?: number | null;
}
export interface CombinedMeasurements {
    airside?: Record<string, unknown> | undefined;
    waterSide?: WaterSideMeasurements;
    refrigeration?: RefrigerationMeasurements;
    recipCompressor?: Record<string, unknown> | undefined;
    scrollCompressor?: Record<string, unknown> | undefined;
    reversingValve?: Record<string, unknown> | undefined;
}
export default CombinedMeasurements;
