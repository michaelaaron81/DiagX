import { formatTemperature, CONSTANTS } from '../../shared/wshp.types';
import { runRefrigerationEngine, validateRefrigerationMeasurements as engineValidate } from './refrigeration.engine';
import { validateRefrigerationMeasurements } from './refrigeration.validation';
export const refrigerationMetadata = {
    id: 'wshp_refrigeration',
    name: 'Refrigeration Circuit Diagnostics',
    version: '1.0.0',
    description: 'Analyzes superheat, subcooling, pressures, and charge level',
    compatibleEquipment: ['water_source_heat_pump', 'water_source_ac', 'ground_source_heat_pump'],
    requiredProfileFields: ['refrigeration', 'waterSide', 'compressor', 'nominalTons'],
    detailedHelpPath: 'help/refrigeration.md',
};
export const refrigerationHelp = {
    detailedHelpPath: 'help/refrigeration.md',
    measurementHelp: {
        mode: { field: 'mode', label: 'Operating Mode', description: 'Current operating mode (cooling or heating)', units: 'mode' },
        suctionPressure: { field: 'suctionPressure', label: 'Suction Pressure', description: 'Low-side refrigerant pressure (PSIG)', units: 'PSIG' },
        dischargePressure: { field: 'dischargePressure', label: 'Discharge Pressure', description: 'High-side refrigerant pressure (PSIG)', units: 'PSIG' },
        suctionTemp: { field: 'suctionTemp', label: 'Suction Temperature', description: 'Measured temp on suction line (°F)', units: '°F' },
        liquidTemp: { field: 'liquidTemp', label: 'Liquid Temperature', description: 'Measured temp on liquid line before metering (°F)', units: '°F' },
        dischargeTemp: { field: 'dischargeTemp', label: 'Discharge Temperature (Optional)', description: 'Discharge line temperature (°F)', units: '°F' },
        enteringWaterTemp: { field: 'enteringWaterTemp', label: 'Entering Water Temp', description: 'Water temperature entering condenser/coil (°F)', units: '°F' },
        leavingWaterTemp: { field: 'leavingWaterTemp', label: 'Leaving Water Temp', description: 'Water temperature leaving condenser/coil (°F)', units: '°F' },
        indoorAirTemp: { field: 'indoorAirTemp', label: 'Indoor Air Temp', description: 'Indoor air return temp (°F)', units: '°F' },
    },
    diagnosticHelp: {
        whatWeCheck: 'Analyzes refrigerant circuit saturation temps, superheat, subcooling, compression ratio, and water-side heat transfer.',
        whyItMatters: 'Correct refrigerant charge and heat rejection are essential for equipment safety, efficiency, and longevity.',
        commonIssues: ['Undercharge, overcharge, metering device problems, water-side restrictions, reversing valve issues'],
    },
    resultHelp: {
        critical: { meaning: 'Dangerous condition requiring immediate shutdown', urgency: 'Immediate', typicalCauses: ['Liquid slugging, severe internal bypass, extreme over/undercharge'] },
        alert: { meaning: 'Significant issue that should be repaired soon', urgency: '24-48 hours', typicalCauses: ['Undercharge, restriction, reversing valve leakage'] },
        warning: { meaning: 'Minor issue or deviation; monitor and schedule service', urgency: '1-2 weeks', typicalCauses: ['Slight charge imbalance or water flow drift'] },
        ok: { meaning: 'Within normal ranges', urgency: 'None', typicalCauses: null },
    }
};
export class RefrigerationDiagnosticModule {
    constructor() {
        this.metadata = refrigerationMetadata;
        this.help = refrigerationHelp;
    }
    validate(measurements) {
        // preserve existing engine validation contract for module.validate (back-compat)
        return engineValidate(measurements);
    }
    diagnose(measurements, profile) {
        // run Phase-1 validation (conservative, non-physics) before engine
        const validation = validateRefrigerationMeasurements(measurements);
        if (!validation.ok) {
            // If any issue of severity 'error' exists, do not run physics/engine.
            const hasError = validation.issues.some(i => i.severity === 'error');
            if (hasError) {
                // Deterministic behavior for Phase 1: throw a structured error including validation details.
                const err = new Error('Measurement validation failed');
                err.validation = validation;
                throw err;
            }
            // If only warnings/infos present, proceed to engine (Phase 1 allows engine to run on non-error issues)
        }
        // Build a minimal config for engine using profile values. The engine expects RefrigerationConfig shape
        const cfg = {
            refrigerant: profile.refrigeration.refrigerantType,
            coolingMeterType: profile.refrigeration.metering.cooling.type,
            heatingMeterType: profile.refrigeration.metering.heating?.type,
            nominalTons: profile.nominalTons,
            designWaterFlowGPM: profile.waterSide.flowRate,
            superheatCoolingTXV: CONSTANTS.SUPERHEAT_COOLING_TXV,
            superheatCoolingFixed: CONSTANTS.SUPERHEAT_COOLING_FIXED,
            superheatHeatingTXV: CONSTANTS.SUPERHEAT_HEATING_TXV,
            subcoolingWaterCooled: CONSTANTS.SUBCOOLING_WATER_COOLED,
            compressionRatioRange: CONSTANTS.COMPRESSION_RATIO,
            ptOverride: profile.refrigeration.ptOverride,
        };
        return runRefrigerationEngine(measurements, cfg);
    }
    getRecommendations(diagnosis) {
        return diagnosis.recommendations;
    }
    summarizeForReport(diagnosis, profile) {
        const lines = [];
        lines.push(`REFRIGERATION - ${diagnosis.status.toUpperCase()}`);
        lines.push('─'.repeat(60));
        lines.push(`Mode: ${diagnosis.mode}`);
        lines.push(`Refrigerant: ${profile.refrigeration.refrigerantType}`);
        lines.push('');
        lines.push(`Suction Sat Temp: ${formatTemperature(diagnosis.suctionSatTemp)}`);
        lines.push(`Discharge Sat Temp: ${formatTemperature(diagnosis.dischargeSatTemp)}`);
        lines.push(`Superheat: ${formatTemperature(diagnosis.superheat)} [${diagnosis.superheatStatus}]`);
        lines.push(`Subcooling: ${formatTemperature(diagnosis.subcooling)} [${diagnosis.subcoolingStatus}]`);
        lines.push(`Compression Ratio: ${diagnosis.compressionRatio}:1 [${diagnosis.compressionRatioStatus}]`);
        lines.push('');
        // Presentation-level finding: derive from recommendations or severity
        let finding = '';
        const criticalRec = (diagnosis.recommendations || []).find(r => r.severity === 'critical');
        if (criticalRec)
            finding = criticalRec.summary || criticalRec.rationale || 'Critical issue detected';
        else if (diagnosis.status === 'alert')
            finding = 'Alert: see recommendations';
        else if (diagnosis.status === 'warning')
            finding = 'Warning: monitor equipment and follow recommendations';
        else
            finding = 'Refrigeration circuit operating normally - see recommendations for details';
        lines.push(`Finding: ${finding}`);
        if (diagnosis.disclaimers && diagnosis.disclaimers.length) {
            lines.push('');
            lines.push('IMPORTANT:');
            diagnosis.disclaimers.forEach(d => lines.push(`- ${d}`));
        }
        return lines.join('\n');
    }
    getMeasurementHelp(field) {
        return this.help.measurementHelp[field];
    }
    explainDiagnosis(diagnosis) {
        const summary = (diagnosis.recommendations || []).find(r => r.severity === 'critical')?.summary
            || (diagnosis.recommendations && diagnosis.recommendations.length ? (diagnosis.recommendations[0].summary || diagnosis.recommendations[0].rationale) : 'No immediate recommendations');
        return { summary, steps: diagnosis.recommendations.map(r => r.summary || r.rationale || (r.notes && r.notes[0]) || '') };
    }
}
export const refrigerationModule = new RefrigerationDiagnosticModule();
