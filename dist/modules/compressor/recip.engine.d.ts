import { ReciprocatingCompressorMeasurements, ReciprocatingCompressorResult } from './recip.types';
import { DiagnosticStatus, Recommendation, ValidationResult } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
export declare function validateReciprocatingCompressorMeasurements(measurements: ReciprocatingCompressorMeasurements): ValidationResult;
export declare function generateRecipRecommendations(params: {
    compressionRatio: number;
    compressionStatus: DiagnosticStatus;
    current?: number;
    currentStatus: DiagnosticStatus;
    compressorId?: string;
    rla?: number;
    overallStatus: DiagnosticStatus;
    unloadingStatus?: DiagnosticStatus;
    recipHealth?: {
        reedValveSuspected?: boolean;
        pistonRingWearSuspected?: boolean;
    };
}): Recommendation[];
export declare function runReciprocatingCompressorEngine(measurements: ReciprocatingCompressorMeasurements, profile: WaterCooledUnitProfile): ReciprocatingCompressorResult;
