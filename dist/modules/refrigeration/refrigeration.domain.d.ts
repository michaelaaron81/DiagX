import { DomainResult } from '../../shared/wshp.types';
import { RefrigerationConfig, RefrigerationMeasurements } from './refrigeration.types';
import { RefrigerationEngineResult } from './refrigeration.engine';
export declare function runRefrigerationDomain(measurements: RefrigerationMeasurements, config: RefrigerationConfig): DomainResult<RefrigerationEngineResult>;
