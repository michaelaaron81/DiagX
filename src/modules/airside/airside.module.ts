import { DiagnosticModule, ValidationResult, MeasurementHelp, DiagnosisExplanation, ModuleMetadata, ModuleHelp, formatTemperature } from '../../shared/wshp.types';
import { WaterCooledUnitProfile } from '../../wshp/wshp.profile';
import { AirsideMeasurements, AirsideEngineResult } from './airside.types';
import { runAirsideEngine, validateAirsideMeasurements as engineValidate } from './airside.engine';
import { validateAirsideMeasurements } from './airside.validation';

export const airsideMetadata: ModuleMetadata = {
  id: 'wshp_airside',
  name: 'Airside Diagnostics',
  version: '1.0.0',
  description: 'Analyzes temperature delta, airflow (CFM/Ton) and static pressure against equipment specs',
  compatibleEquipment: ['water_source_heat_pump', 'water_source_ac', 'ground_source_heat_pump', 'rtu', 'air_handler'],
  requiredProfileFields: ['airside', 'nominalTons'],
};

export const airsideHelp: ModuleHelp<AirsideMeasurements> = {
  measurementHelp: {
    returnAirTemp: { field: 'returnAirTemp', label: 'Return Air Temp', description: 'Dry bulb temperature entering unit', units: '°F' },
    supplyAirTemp: { field: 'supplyAirTemp', label: 'Supply Air Temp', description: 'Dry bulb temperature leaving unit', units: '°F' },
    returnAirRH: { field: 'returnAirRH', label: 'Return Air Relative Humidity', description: 'Relative humidity at return', units: '%' },
    supplyAirRH: { field: 'supplyAirRH', label: 'Supply Air Relative Humidity', description: 'Relative humidity at supply', units: '%' },
    returnPlenum: { field: 'returnPlenum', label: 'Return Plenum Temp', description: 'Temperature in return plenum', units: '°F' },
    supplyPlenum: { field: 'supplyPlenum', label: 'Supply Plenum Temp', description: 'Temperature in supply plenum', units: '°F' },
    externalStatic: { field: 'externalStatic', label: 'External Static Pressure', description: 'Total system resistance', units: 'in W.C.' },
    wetBulbTemp: { field: 'wetBulbTemp', label: 'Wet Bulb Temp', description: 'Outdoor/inlet wet bulb temp', units: '°F' },
    supplyWetBulb: { field: 'supplyWetBulb', label: 'Supply Wet Bulb', description: 'Wet bulb at supply side', units: '°F' },
    airVelocity: { field: 'airVelocity', label: 'Air Velocity', description: 'Measured in FPM', units: 'FPM' },
    measuredCFM: { field: 'measuredCFM', label: 'Measured CFM', description: 'Actual airflow measured at supply grilles', units: 'CFM' },
    mode: { field: 'mode', label: 'Operating Mode', description: 'cooling | heating | fan_only', units: 'mode' },
  },
  diagnosticHelp: { whatWeCheck: 'Temperature delta, airflow (CFM/ton), static pressure', whyItMatters: 'Airflow affects capacity and reliability', commonIssues: ['Dirty filters', 'Closed dampers', 'Wrong blower setting'] },
  // Important: we do NOT store or bundle OEM/manufacturer performance tables in the repository.
  // If you have manufacturer curves, provide them at runtime in the profile (profile.airside.manufacturerExpectedDeltaT, profile.airside.manufacturerCFMPerTon).
};

export class AirsideDiagnosticModule implements DiagnosticModule<WaterCooledUnitProfile, AirsideMeasurements, AirsideEngineResult> {
  metadata = airsideMetadata;
  help = airsideHelp;

  validate(measurements: AirsideMeasurements): ValidationResult {
    // Preserve engine-level validation for backward compatibility
    return engineValidate(measurements);
  }

  diagnose(measurements: AirsideMeasurements, profile: WaterCooledUnitProfile) {
    // Run Phase-2 conservative validation before running engine physics
    const validation = validateAirsideMeasurements(measurements);
    if (!validation.ok) {
      const hasError = validation.issues.some(i => i.severity === 'error');
      if (hasError) {
        const err = new Error('Airside measurement validation failed') as Error & {
          validation: ReturnType<typeof validateAirsideMeasurements>;
        };
        err.validation = validation;
        throw err;
      }
    }

    return runAirsideEngine(measurements, profile);
  }

  getRecommendations(diagnosis: AirsideEngineResult) {
    return diagnosis.recommendations;
  }

  summarizeForReport(diagnosis: AirsideEngineResult, profile: WaterCooledUnitProfile): string {
    const lines: string[] = [];
    lines.push(`AIRSIDE - ${diagnosis.status.toUpperCase()}`);
    lines.push('─'.repeat(60));
    lines.push(`Mode: ${diagnosis.mode}`);
    if (profile.model) {
      lines.push(`Equipment model: ${profile.model}`);
    }
    lines.push(`Delta T: ${formatTemperature(diagnosis.deltaT)} (expected ${formatTemperature(diagnosis.expectedDeltaT.ideal)}) [${diagnosis.deltaTStatus}]`);
    if (diagnosis.cfmPerTon) lines.push(`CFM/Ton: ${diagnosis.cfmPerTon} (expected ${diagnosis.expectedCFMPerTon.ideal}) [${diagnosis.airflowStatus}]`);
    if (diagnosis.disclaimers && diagnosis.disclaimers.length) {
      lines.push('');
      lines.push('IMPORTANT:');
      diagnosis.disclaimers.forEach((d: string) => lines.push(`- ${d}`));
    }
    if (diagnosis.totalESP && diagnosis.ratedESP) lines.push(`Static: ${diagnosis.totalESP} in W.C. (max ${diagnosis.ratedESP.max})`);
    lines.push('');
    const criticalRec = (diagnosis.recommendations || []).find(r => r.severity === 'critical');
    const finding = criticalRec ? (criticalRec.summary || criticalRec.rationale || 'Critical issue detected') : (diagnosis.status === 'ok' ? 'Airside operating normally - see recommendations for details' : 'See recommendations for diagnostic details');
    lines.push(`Finding: ${finding}`);
    return lines.join('\n');
  }

  getMeasurementHelp(field: keyof AirsideMeasurements): MeasurementHelp | undefined {
    // We expect `this.help.measurementHelp` to provide entries for all measurement keys.
    const mh = this.help.measurementHelp as Partial<Record<keyof AirsideMeasurements, MeasurementHelp>>;
    return mh[field];
  }

  explainDiagnosis(diagnosis: AirsideEngineResult): DiagnosisExplanation {
    // Provide a richer, structured explanation amenable to UI consumption.
    
        const immediate = diagnosis.recommendations.filter(r => (r.severity === 'critical' || r.severity === 'alert')).map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '');
        const diagnostic = diagnosis.recommendations.filter(r => r.severity === 'advisory').map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '');
        const repair = diagnosis.recommendations.filter(r => r.severity === 'info').map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '');

    const criticalRec2 = (diagnosis.recommendations || []).find(r => r.severity === 'critical');
        const summary = criticalRec2 ? (criticalRec2.summary || criticalRec2.rationale || '') : (diagnosis.status === 'ok' ? 'Airside operating normally - see recommendations for details' : 'See recommendations for diagnostic details');

    return {
      finding: summary,
      whatThisMeans: `Airside analysis: ${diagnosis.deltaT}°F delta and ${diagnosis.cfmPerTon ?? 'N/A'} CFM/ton — see recommendations for diagnostic details.`,
      whyThisHappens: (diagnosis.recommendations || []).slice(0, 3).map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || ''),
      whatToDoNext: {
        immediate,
        diagnostic,
        repair,
      },
    };
  }
}

export const airsideModule = new AirsideDiagnosticModule();
