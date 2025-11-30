import { HydronicSourceEngineResult } from './hydronic-source.types';
import { CombinedProfile } from '../../profiles/types';
import { CombinedMeasurements } from '../../measurements/types';
export declare function runHydronicSourceModule(profile: CombinedProfile, measurements: CombinedMeasurements): HydronicSourceEngineResult;
