import { formatTemperature } from '../../shared/wshp.types';
import { runReversingValveEngine, validateReversingValveMeasurements } from './reversing.engine';
export const reversingValveMetadata = {
    id: 'wshp_reversing_valve',
    name: 'Reversing Valve Diagnostics',
    version: '1.0.0',
    description: 'Verifies reversing valve switching and detects internal leakage',
    compatibleEquipment: ['water_source_heat_pump', 'ground_source_heat_pump'],
    requiredProfileFields: ['reversingValve'],
};
export const reversingValveHelp = {
    measurementHelp: {
        requestedMode: { field: 'requestedMode', label: 'Requested Mode', description: 'Mode requested at thermostat', units: 'mode' },
        reversingValvePortTemps: { field: 'reversingValvePortTemps', label: 'Port Temps', description: 'Temperatures of all 4 valve ports', units: '°F' },
        solenoidVoltage: { field: 'solenoidVoltage', label: 'Solenoid Voltage', description: 'Voltage at reversing valve solenoid coil', units: 'VAC' },
        suctionPressure: { field: 'suctionPressure', label: 'Suction Pressure', description: 'Low-side pressure', units: 'PSIG' },
        dischargePressure: { field: 'dischargePressure', label: 'Discharge Pressure', description: 'High-side pressure', units: 'PSIG' },
    }
};
export class ReversingValveDiagnosticModule {
    constructor() {
        this.metadata = reversingValveMetadata;
        this.help = reversingValveHelp;
    }
    validate(measurements, profile) {
        return validateReversingValveMeasurements(measurements, profile);
    }
    diagnose(measurements, profile) {
        return runReversingValveEngine(measurements, profile);
    }
    getRecommendations(diagnosis) {
        return diagnosis.recommendations;
    }
    summarizeForReport(diagnosis, profile) {
        const lines = [];
        lines.push(`REVERSING VALVE - ${diagnosis.status.toUpperCase()}`);
        lines.push('─'.repeat(60));
        lines.push(`Requested Mode: ${diagnosis.requestedMode}`);
        lines.push(`Valve Type: ${profile.reversingValve?.type || 'unknown'}`);
        lines.push('');
        lines.push('Port Temperatures:');
        lines.push(`  Discharge Inlet:  ${formatTemperature(diagnosis.portTemps.dischargeInlet)}`);
        lines.push(`  Suction Return:   ${formatTemperature(diagnosis.portTemps.suctionReturn)}`);
        lines.push(`  Indoor Coil:      ${formatTemperature(diagnosis.portTemps.indoorCoilLine)}`);
        lines.push(`  Outdoor Coil:     ${formatTemperature(diagnosis.portTemps.outdoorCoilLine)}`);
        lines.push('');
        lines.push(`Temperature Spread:   ${formatTemperature(diagnosis.tempSpread)}`);
        lines.push(`Hot Ports:            ${diagnosis.hotPorts.join(', ')}`);
        lines.push(`Cold Ports:           ${diagnosis.coldPorts.join(', ')}`);
        lines.push('');
        lines.push(`Pattern Match:        ${diagnosis.patternMatch.toUpperCase()}`);
        lines.push(`Compression Ratio:    ${diagnosis.compressionRatio}:1`);
        if (diagnosis.solenoidStatus)
            lines.push(`Solenoid Status:      ${diagnosis.solenoidStatus.toUpperCase()}`);
        lines.push('');
        lines.push('Diagnosis:');
        const criticalRec = (diagnosis.recommendations || []).find(r => r.severity === 'critical');
        const finding = criticalRec ? (criticalRec.summary || criticalRec.rationale || 'Critical issue detected') : (diagnosis.status === 'ok' ? 'Reversing valve appears to be operating normally' : 'See recommendations for details');
        lines.push(`  ${finding}`);
        const likely = (diagnosis.recommendations || []).find(r => r.severity === 'alert' && (r.rationale || r.summary)) || undefined;
        if (likely)
            lines.push(`  ${likely.rationale || likely.summary}`);
        return lines.join('\n');
    }
    getMeasurementHelp(field) {
        return this.help.measurementHelp[field];
    }
    explainDiagnosis(diagnosis) {
        // Minimal structured explanation (engines produce recommendations; module maps them to steps)
        const immediate = diagnosis.recommendations.filter(r => r.severity === 'critical' || r.severity === 'alert').map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '');
        const diagnostic = diagnosis.recommendations.filter(r => r.severity === 'advisory').map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '');
        const repair = diagnosis.recommendations.filter(r => r.severity === 'info').map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '');
        const criticalRec = (diagnosis.recommendations || []).find(r => r.severity === 'critical');
        const summary = criticalRec ? (criticalRec.summary || criticalRec.rationale || '') : (diagnosis.status === 'ok' ? 'Reversing valve operating normally' : 'See recommendations');
        return {
            summary,
            steps: [...immediate, ...diagnostic, ...repair],
        };
    }
}
export const reversingValveModule = new ReversingValveDiagnosticModule();
