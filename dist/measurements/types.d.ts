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
    airside?: any;
    waterSide?: WaterSideMeasurements;
    refrigeration?: RefrigerationMeasurements;
    recipCompressor?: any;
    scrollCompressor?: any;
    reversingValve?: any;
}
export default CombinedMeasurements;
