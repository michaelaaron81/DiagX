import { WaterCooledUnitProfile } from './wshp.profile';
import { DomainResult, DiagnosticStatus } from '../shared/wshp.types';
import { RefrigerationMeasurements } from '../modules/refrigeration/refrigeration.types';
export interface WshpDiagxInput {
    profile: WaterCooledUnitProfile;
    measurements: {
        refrigeration?: RefrigerationMeasurements;
        airside?: Record<string, unknown>;
        recipCompressor?: Record<string, unknown>;
        scrollCompressor?: Record<string, unknown>;
        reversingValve?: Record<string, unknown>;
    };
}
export interface WshpDiagxResult {
    profileId?: string;
    domainResults: DomainResult[];
    overallStatus: DiagnosticStatus;
}
export declare function runWshpDiagx(input: WshpDiagxInput): WshpDiagxResult;
