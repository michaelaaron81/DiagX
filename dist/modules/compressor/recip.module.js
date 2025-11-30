import { runReciprocatingCompressorEngine, validateReciprocatingCompressorMeasurements } from './recip.engine';
export const recipCompressorMetadata = {
    id: 'compressor_recip',
    name: 'Reciprocating Compressor Diagnostics',
    version: '1.0.0',
    description: 'Reciprocating compressor diagnostics (reed valves, cylinder unload, piston wear)',
    compatibleEquipment: ['water_source_heat_pump', 'water_source_ac', 'ground_source_heat_pump', 'rtu', 'chiller'],
    requiredProfileFields: ['compressor'],
};
export const recipCompressorHelp = {
    measurementHelp: {
        suctionPressure: { field: 'suctionPressure', label: 'Suction Pressure', description: 'PSIG' },
        dischargePressure: { field: 'dischargePressure', label: 'Discharge Pressure', description: 'PSIG' },
        suctionTemp: { field: 'suctionTemp', label: 'Suction Temp', description: '°F' },
        dischargeTemp: { field: 'dischargeTemp', label: 'Discharge Temp', description: '°F' },
        compressorCurrent: { field: 'compressorCurrent', label: 'Compressor Current', description: 'Amps' },
    }
};
export class ReciprocatingCompressorDiagnosticModule {
    constructor() {
        this.metadata = recipCompressorMetadata;
        this.help = recipCompressorHelp;
    }
    validate(measurements) {
        return validateReciprocatingCompressorMeasurements(measurements);
    }
    diagnose(measurements, profile) {
        return runReciprocatingCompressorEngine(measurements, profile);
    }
    summarizeForReport(diagnosis) {
        const lines = [];
        lines.push(`COMPRESSOR (Reciprocating) - ${diagnosis.status.toUpperCase()}`);
        lines.push('─'.repeat(60));
        lines.push(`Compression ratio: ${diagnosis.compressionRatio}:1 (${diagnosis.compressionStatus})`);
        if (diagnosis.disclaimers && diagnosis.disclaimers.length)
            diagnosis.disclaimers.forEach(d => lines.push(`- ${d}`));
        // Build a short presentation-level finding from engine facts/recommendations
        let finding = '';
        if (diagnosis.status === 'critical') {
            finding = 'CRITICAL: Immediate attention required. See recommendations.';
        }
        else if (diagnosis.status === 'alert') {
            finding = 'Alert: Performance issues detected — follow recommendations.';
        }
        else if (diagnosis.status === 'warning') {
            finding = 'Warning: Minor issues detected — monitor and investigate.';
        }
        else {
            const firstRec = diagnosis.recommendations && diagnosis.recommendations.length ? (diagnosis.recommendations[0].summary || diagnosis.recommendations[0].rationale || '') : 'Operating within expected range.';
            finding = `OK: ${firstRec}`;
        }
        lines.push(`Finding: ${finding}`);
        return lines.join('\n');
    }
    explainDiagnosis(diagnosis) {
        // Build an explanation structure using engine facts and recommendations
        const whyThisHappens = [];
        const whatToDoNext = { immediate: [], diagnostic: [], repair: [] };
        if (diagnosis.compressionStatus === 'critical')
            whyThisHappens.push('Compression ratio is critical — internal bypass or severe valve issues may be present.');
        if (diagnosis.currentStatus === 'critical')
            whyThisHappens.push('Measured current is far above RLA — overload or mechanical binding is possible.');
        if (diagnosis.unloadingInfo && diagnosis.unloadingInfo.status !== 'ok')
            whyThisHappens.push('Cylinder unloading reported which can change loading balance and current draw.');
        // Pull actions from top priority recommendations where appropriate
        (diagnosis.recommendations || []).forEach((r) => {
            const actionText = r.summary || r.rationale || (r.notes && r.notes[0]) || '';
            if (r.severity === 'critical' || r.severity === 'alert')
                whatToDoNext.immediate.push(actionText);
            else if (r.severity === 'advisory')
                whatToDoNext.diagnostic.push(actionText);
            else
                whatToDoNext.repair.push(actionText);
        });
        return {
            finding: `Reciprocating compressor — ${diagnosis.status.toUpperCase()}`,
            whatThisMeans: 'Summary based on compression ratio, current, and unloading state.',
            whyThisHappens,
            whatToDoNext,
        };
    }
}
export const recipCompressorModule = new ReciprocatingCompressorDiagnosticModule();
