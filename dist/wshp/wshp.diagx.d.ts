import { WaterCooledUnitProfile } from './wshp.profile';
import { DomainResult, DiagnosticStatus } from '../shared/wshp.types';
import { RefrigerationMeasurements } from '../modules/refrigeration/refrigeration.types';
export interface WshpDiagxInput {
    profile: WaterCooledUnitProfile;
    measurements: {
        refrigeration?: RefrigerationMeasurements;
        airside?: any;
        recipCompressor?: any;
        scrollCompressor?: any;
        reversingValve?: any;
    };
}
export interface WshpDiagxResult {
    profileId?: string;
    domainResults: DomainResult[];
    overallStatus: DiagnosticStatus;
}
export declare function runWshpDiagx(input: WshpDiagxInput): WshpDiagxResult;
