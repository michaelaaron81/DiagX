import { DiagnosticModule, ValidationResult, Recommendation, MeasurementHelp, DiagnosisExplanation, ModuleMetadata, ModuleHelp, formatTemperature } from '../../shared/wshp.types';
import { ScrollCompressorMeasurements, ScrollCompressorResult, ScrollCompressorConfig } from './scroll.types';
import { runScrollCompressorEngine } from './scroll.engine';

export const scrollCompressorMetadata: ModuleMetadata = {
  id: 'compressor_scroll',
  name: 'Scroll Compressor Diagnostics',
  version: '1.0.0',
  description: 'Basic diagnostics for scroll compressors: compression ratio, current draw, discharge temp',
  compatibleEquipment: ['water_source_heat_pump', 'water_source_ac', 'ground_source_heat_pump', 'rtu'],
  requiredProfileFields: ['compressor'],
};

export const scrollCompressorHelp: ModuleHelp<ScrollCompressorMeasurements> = {
  measurementHelp: {
    mode: { field: 'mode', label: 'Operating Mode', description: 'cooling | heating', units: 'mode' },
    suctionPressure: { field: 'suctionPressure', label: 'Suction Pressure', description: 'PSIG' },
    dischargePressure: { field: 'dischargePressure', label: 'Discharge Pressure', description: 'PSIG' },
    suctionTemp: { field: 'suctionTemp', label: 'Suction Temp', description: '°F' },
    dischargeTemp: { field: 'dischargeTemp', label: 'Discharge Temp', description: '°F (optional)' },
    runningCurrent: { field: 'runningCurrent', label: 'Running Current', description: 'Amps (if measured)' },
    voltage: { field: 'voltage', label: 'Supply Voltage', description: 'Compressor motor supply voltage', units: 'V' },
    isRunning: { field: 'isRunning', label: 'Compressor Running', description: 'Whether compressor was running during measurement', units: 'boolean' },
  },
  diagnosticHelp: { whatWeCheck: 'Compression ratio and motor current draw', whyItMatters: 'Abnormal compression or current indicates mechanical or electrical faults', commonIssues: ['Poor valve condition, internal bypass, motor issues'] },
};

export class ScrollCompressorDiagnosticModule implements DiagnosticModule<ScrollCompressorConfig, ScrollCompressorMeasurements, ScrollCompressorResult> {
  metadata = scrollCompressorMetadata;
  help = scrollCompressorHelp;

  validate(measurements: ScrollCompressorMeasurements): ValidationResult {
    const errors: string[] = [];
    if (measurements.suctionPressure === undefined) errors.push('suctionPressure required');
    if (measurements.dischargePressure === undefined) errors.push('dischargePressure required');
    return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
  }

  diagnose(measurements: ScrollCompressorMeasurements, profile: ScrollCompressorConfig) {
    return runScrollCompressorEngine(measurements, profile);
  }

  getRecommendations(diagnosis: ScrollCompressorResult) {
    return diagnosis.recommendations;
  }

  summarizeForReport(diagnosis: ScrollCompressorResult, profile: ScrollCompressorConfig): string {
    void profile;
    const lines: string[] = [];
    lines.push(`COMPRESSOR (Scroll) - ${diagnosis.status.toUpperCase()}`);
    lines.push('─'.repeat(60));
    lines.push(`Compression ratio: ${diagnosis.compressionRatio}:1`);
    if (diagnosis.dischargeSuperheat !== undefined) lines.push(`Discharge delta: ${formatTemperature(diagnosis.dischargeSuperheat)}`);
    if (diagnosis.disclaimers && diagnosis.disclaimers.length) {
      lines.push('');
      lines.push('IMPORTANT:');
      diagnosis.disclaimers.forEach((d: string) => lines.push(`- ${d}`));
    }
    lines.push('');
    const criticalRec = (diagnosis.recommendations || []).find(r => r.severity === 'critical');
    const finding = criticalRec ? (criticalRec.summary || criticalRec.rationale || 'Critical issue detected') : (diagnosis.status === 'ok' ? 'Scroll compressor operating within normal limits' : 'See recommendations for diagnostic details');
    lines.push(`Finding: ${finding}`);
    return lines.join('\n');
  }

  getMeasurementHelp(field: keyof ScrollCompressorMeasurements): MeasurementHelp | undefined {
    // help.measurementHelp covers all keys; return it directly (treat missing as programmer error)
    return this.help.measurementHelp[field] as MeasurementHelp | undefined;
  }

  explainDiagnosis(diagnosis: ScrollCompressorResult): DiagnosisExplanation {
    const immediate = diagnosis.recommendations.filter((r: Recommendation) => r.severity === 'critical' || r.severity === 'alert').map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '');
    const diagnostic = diagnosis.recommendations.filter((r: Recommendation) => r.severity === 'advisory').map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '');
    const repair = diagnosis.recommendations.filter((r: Recommendation) => r.severity === 'info').map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '');

    const criticalRec2 = (diagnosis.recommendations || []).find(r => r.severity === 'critical');
    const summary = criticalRec2 ? (criticalRec2.summary || criticalRec2.rationale || '') : (diagnosis.status === 'ok' ? 'Scroll compressor operating within normal limits' : 'See recommendations for details');
    return {
      finding: summary,
      whatThisMeans: `Scroll compressor status: ${summary}`,
      whyThisHappens: (diagnosis.recommendations || []).slice(0, 3).map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || ''),
      whatToDoNext: { immediate, diagnostic, repair },
    };
  }
}

export const scrollCompressorModule = new ScrollCompressorDiagnosticModule();
