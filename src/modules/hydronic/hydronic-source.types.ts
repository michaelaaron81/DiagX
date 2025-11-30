import { DiagnosticStatus, Recommendation } from '../../shared/wshp.types';

export type HydronicSeverityStatus = 'ok' | 'warning' | 'alert' | 'critical' | 'unknown';

export interface HydronicSourceMeasurements {
  enteringWaterTemp: number | null;    // °F
  leavingWaterTemp: number | null;     // °F
  loopFluidTemp?: number | null;       // optional, if different from entering
  flowGpm?: number | null;             // GPM if available
  ambientWetBulb?: number | null;      // for cooling towers, optional
  ambientDryBulb?: number | null;      // for dry coolers, optional
}

export interface HydronicSourceProfileConfig {
  designEnteringWaterTemp?: {
    min: number;
    ideal: number;
    max: number;
    source?: 'industry' | 'nameplate_calculated' | 'manufacturer';
  };

  designDeltaT?: {
    min: number;
    ideal: number;
    max: number;
    source?: 'industry' | 'nameplate_calculated' | 'manufacturer';
  };

  designFlowGpmPerTon?: {
    min: number;
    ideal: number;
    max: number;
    source?: 'industry' | 'nameplate_calculated' | 'manufacturer';
  };

  manufacturerExpectedEWTRange?: {
    min: number;
    max: number;
  };

  manufacturerExpectedDeltaT?: {
    min: number;
    max: number;
  };
}

export interface HydronicSourceContext {
  profileId: string;
  tons: number | null;
  refrigerantType?: string | null;
  loopType?: 'open_tower' | 'closed_loop' | 'dry_cooler' | 'unknown';
  profileConfig?: HydronicSourceProfileConfig;
}

export interface HydronicSourceValues {
  enteringWaterTemp: number | null;
  leavingWaterTemp: number | null;
  deltaT: number | null;            // leaving - entering
  approachToAmbient: number | null; // loop fluid vs ambient WB/DB depending on loop type
  normalizedFlowIndex: number | null; // dimensionless index, TODO in engine
}

export interface HydronicSourceFlags {
  enteringWaterTempStatus: HydronicSeverityStatus;
  leavingWaterTempStatus: HydronicSeverityStatus;
  deltaTStatus: HydronicSeverityStatus;
  approachStatus: HydronicSeverityStatus;
  flowStatus: HydronicSeverityStatus;
  dataQualityStatus: HydronicSeverityStatus;
  disclaimers: string[];
}

export interface HydronicSourceEngineResult {
  status: DiagnosticStatus;
  values: HydronicSourceValues;
  flags: HydronicSourceFlags;
  recommendations: Recommendation[];
}

export interface HydronicSourceEngineInput {
  measurements: HydronicSourceMeasurements;
  context: HydronicSourceContext;
}
