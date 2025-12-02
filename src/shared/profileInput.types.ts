import { WaterCooledUnitProfile } from '../wshp/wshp.profile';
import { RefrigerationMeasurements } from '../modules/refrigeration/refrigeration.types';
import { AirsideMeasurements } from '../modules/airside/airside.types';
import { HydronicMeasurements } from '../modules/hydronic/hydronic.types';
import { ReciprocatingCompressorMeasurements } from '../modules/compressor/recip.types';
import { ScrollCompressorMeasurements } from '../modules/compressor/scroll.types';
import { ReversingValveMeasurements } from '../modules/reversingValve/reversing.types';
import { CondenserApproachMeasurements } from '../modules/condenserApproach/condenserApproach.types';

export type CompletenessLevel =
  | 'full'
  | 'limited'
  | 'advisory'
  | 'skipped';

export interface ProfileInputSchema {
  profile: WaterCooledUnitProfile;
  measurements: {
    refrigeration?: Partial<RefrigerationMeasurements>;
    airside?: Partial<AirsideMeasurements>;
    hydronic?: Partial<HydronicMeasurements>;
    condenserApproach?: Partial<CondenserApproachMeasurements>;
    recipCompressor?: Partial<ReciprocatingCompressorMeasurements>;
    scrollCompressor?: Partial<ScrollCompressorMeasurements>;
    reversingValve?: Partial<ReversingValveMeasurements>;
  };
}
