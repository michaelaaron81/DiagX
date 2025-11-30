import { RefrigerationConfig, RefrigerationMeasurements, RefrigerantProfileType } from './refrigeration.types';
import { PTChartData } from './refrigerantData';
import { DiagnosticStatus, ValidationResult, Recommendation, EngineResult } from '../../shared/wshp.types';
export interface RefrigerationEngineValues {
    suctionPressure: number;
    dischargePressure: number;
    suctionSatTemp: number;
    dischargeSatTemp: number;
    superheat: number;
    subcooling: number;
    compressionRatio: number;
    waterDeltaT: number;
    dischargeSuperheat?: number;
}
export interface RefrigerationEngineFlags {
    superheatStatus: DiagnosticStatus;
    subcoolingStatus: DiagnosticStatus;
    compressionRatioStatus: DiagnosticStatus;
    waterTransferStatus: DiagnosticStatus;
    refrigerantProfile: RefrigerantProfileType;
    disclaimers?: string[];
}
export interface RefrigerationEngineResult extends EngineResult<RefrigerationEngineValues, RefrigerationEngineFlags> {
    status: DiagnosticStatus;
    mode: 'cooling' | 'heating';
    suctionPressure: number;
    dischargePressure: number;
    suctionSatTemp: number;
    dischargeSatTemp: number;
    superheat: number;
    subcooling: number;
    compressionRatio: number;
    waterDeltaT: number;
    dischargeSuperheat?: number;
    superheatStatus: DiagnosticStatus;
    subcoolingStatus: DiagnosticStatus;
    compressionRatioStatus: DiagnosticStatus;
    waterTransferStatus: DiagnosticStatus;
    recommendations: Recommendation[];
    disclaimers?: string[];
}
export declare function interpolatePT(pressure: number, ptData: PTChartData): number | null;
export declare function validateRefrigerationMeasurements(measurements: RefrigerationMeasurements): ValidationResult;
export declare function generateRefrigerationRecommendations(result: RefrigerationEngineResult): Recommendation[];
export declare function runRefrigerationEngine(measurements: RefrigerationMeasurements, config: RefrigerationConfig): RefrigerationEngineResult;
