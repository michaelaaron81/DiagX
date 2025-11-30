import { WaterCooledUnitProfile } from './wshp.profile';
import { RefrigerationConfig } from '../modules/refrigeration/refrigeration.types';
import { CONSTANTS } from '../shared/wshp.types';

export function buildRefrigerationConfigFromWSHP(profile: WaterCooledUnitProfile): RefrigerationConfig {
  const { refrigeration, waterSide, nominalTons } = profile;

  return {
    refrigerant: refrigeration.refrigerantType,
    coolingMeterType: refrigeration.metering.cooling.type,
    heatingMeterType: refrigeration.metering.heating?.type,
    nominalTons,
    designWaterFlowGPM: waterSide?.flowRate ?? (typeof nominalTons === 'number' ? nominalTons * 2.4 : 0),
    superheatCoolingTXV: CONSTANTS.SUPERHEAT_COOLING_TXV,
    superheatCoolingFixed: CONSTANTS.SUPERHEAT_COOLING_FIXED,
    superheatHeatingTXV: CONSTANTS.SUPERHEAT_HEATING_TXV,
    subcoolingWaterCooled: CONSTANTS.SUBCOOLING_WATER_COOLED,
    compressionRatioRange: CONSTANTS.COMPRESSION_RATIO,
  };
}
