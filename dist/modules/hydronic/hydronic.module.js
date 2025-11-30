import { formatTemperature } from '../../shared/wshp.types';
import { runHydronicEngine, validateHydronicMeasurements, getExpectedHydronicDeltaT } from './hydronic.engine';
import { generateHydronicRecommendations } from './hydronic.recommendations';
export const hydronicMetadata = {
    id: 'hydronic_source',
    name: 'Hydronic Source Diagnostics',
    version: '1.0.0',
    description: 'Analyzes hydronic loop ΔT and flow conditions.',
    compatibleEquipment: ['water_source_heat_pump', 'ground_source_heat_pump', 'hydronic_boiler_loop'],
    requiredProfileFields: ['waterSide'],
    detailedHelpPath: 'help/hydronic.md',
};
export const hydronicHelp = {
    detailedHelpPath: 'help/hydronic.md',
    measurementHelp: {
        enteringWaterTemp: { field: 'enteringWaterTemp', label: 'Entering Water Temp', description: 'Water temperature entering the heat exchanger (°F)', units: '°F' },
        leavingWaterTemp: { field: 'leavingWaterTemp', label: 'Leaving Water Temp', description: 'Water temperature leaving the heat exchanger (°F)', units: '°F' },
        flowRateGPM: { field: 'flowRateGPM', label: 'Flow rate', description: 'Pump/loop flow rate in GPM', units: 'GPM' },
    },
    diagnosticHelp: {
        whatWeCheck: 'Analyzes hydronic source ΔT, flow rate compared to design, and heat transfer performance.',
        whyItMatters: 'Hydronic heat transfer feeds the condenser/evaporator and affects system capacity and longevity.',
        commonIssues: ['Low ΔT (possible fouling, low flow), high ΔT (low flow through heat exchanger), incorrect pump sizing or valve settings'],
    },
    resultHelp: {
        critical: { meaning: 'Severely out of range — requires fast inspection', urgency: 'Immediate', typicalCauses: ['No flow, blocked exchanger'] },
        alert: { meaning: 'Outside expected range — repair soon', urgency: 'High', typicalCauses: ['Under/overflow or degraded exchanger performance'] },
        warning: { meaning: 'Deviation from expected range; monitor', urgency: 'Medium', typicalCauses: ['Slight flow deviation or measurement errors'] },
        ok: { meaning: 'Within expected ranges', urgency: 'Low', typicalCauses: null },
    }
};
export class HydronicDiagnosticModule {
    constructor() {
        this.metadata = hydronicMetadata;
        this.help = hydronicHelp;
    }
    validate(measurements) {
        return validateHydronicMeasurements(measurements);
    }
    diagnose(measurements, profile) {
        const validation = validateHydronicMeasurements(measurements);
        // If invalid, follow existing pattern - throw if fatal errors (none expected here)
        if (!validation.ok && validation.errors && validation.errors.length) {
            const err = new Error('Measurement validation failed');
            err.validation = validation;
            throw err;
        }
        const result = runHydronicEngine(measurements, { profile });
        // generate recommendations via helper
        result.recommendations = generateHydronicRecommendations(result, { profile });
        return result;
    }
    getRecommendations(diagnosis) {
        return diagnosis.recommendations;
    }
    summarizeForReport(diagnosis, profile) {
        const lines = [];
        lines.push(`HYDRONIC SOURCE - ${diagnosis.status.toUpperCase()}`);
        lines.push('─'.repeat(60));
        lines.push(`Measured ΔT: ${diagnosis.values.waterDeltaT !== null ? formatTemperature(diagnosis.values.waterDeltaT) : 'unknown'}`);
        lines.push(`Measured Flow: ${diagnosis.values.flowRateGPM !== null ? `${diagnosis.values.flowRateGPM} GPM` : 'unknown'}`);
        const expected = getExpectedHydronicDeltaT(profile);
        lines.push(`Expected ΔT: ${expected.min}–${expected.max} (${expected.source})`);
        if (diagnosis.flags.disclaimers && diagnosis.flags.disclaimers.length) {
            lines.push('');
            lines.push('Notes:');
            diagnosis.flags.disclaimers.forEach(d => lines.push(`- ${d}`));
        }
        return lines.join('\n');
    }
    getMeasurementHelp(field) {
        return this.help.measurementHelp[field];
    }
    explainDiagnosis(diagnosis) {
        const summary = (diagnosis.recommendations || []).find(r => r.severity === 'critical')?.summary || (diagnosis.recommendations && diagnosis.recommendations.length ? (diagnosis.recommendations[0].summary || diagnosis.recommendations[0].rationale) : 'No recommendations');
        return { summary, steps: diagnosis.recommendations.map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '') };
    }
}
export const hydronicModule = new HydronicDiagnosticModule();
