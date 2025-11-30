import { round, } from '../../shared/wshp.types';
// Compression ratio analysis
function analyzeCompressionRatio(ratio) {
    if (!isFinite(ratio) || ratio <= 0) {
        return { status: 'critical' };
    }
    if (ratio < 2.5) {
        return { status: 'critical' };
    }
    if (ratio < 3.0) {
        return { status: 'alert' };
    }
    if (ratio > 10) {
        return { status: 'critical' };
    }
    if (ratio > 6.5) {
        return { status: 'alert' };
    }
    return { status: 'ok' };
}
// Current vs RLA analysis
function analyzeCurrent(measured, rla) {
    if (measured === undefined || rla === undefined || rla <= 0) {
        return { status: 'ok' };
    }
    const pct = measured / rla;
    if (pct > 1.4) {
        return { status: 'critical' };
    }
    if (pct > 1.15) {
        return { status: 'alert' };
    }
    if (pct < 0.3) {
        return { status: 'warning' };
    }
    return { status: 'ok' };
}
// Cylinder unloading analysis
function analyzeUnloading(total, unloaded) {
    if (!total || total <= 0)
        return undefined;
    if (unloaded === undefined)
        return undefined;
    const status = unloaded < 0 || unloaded > total ? 'alert' : unloaded === 0 ? 'ok' : 'warning';
    // note: message removed from engine-level output; modules/UI should generate human-facing text
    return { unloadedCount: unloaded, total, status };
}
// Simple recip health flags from symptoms
function deriveRecipHealthFlags(ratioStatus, sounds) {
    const health = {};
    if ((ratioStatus === 'alert' || ratioStatus === 'critical') && sounds?.hissing)
        health.reedValveSuspected = true;
    if ((ratioStatus === 'alert' || ratioStatus === 'critical') && sounds?.knocking)
        health.pistonRingWearSuspected = true;
    return health;
}
// Worst-status helper
function worstStatus(statuses) {
    if (statuses.includes('critical'))
        return 'critical';
    if (statuses.includes('alert'))
        return 'alert';
    if (statuses.includes('warning'))
        return 'warning';
    return 'ok';
}
// VALIDATION â€“ parallel to airside
export function validateReciprocatingCompressorMeasurements(measurements) {
    const errors = [];
    const warnings = [];
    if (measurements.suctionPressure === undefined || measurements.suctionPressure <= 0)
        errors.push('Suction pressure must be > 0 PSIG.');
    if (measurements.dischargePressure === undefined || measurements.dischargePressure <= 0)
        errors.push('Discharge pressure must be > 0 PSIG.');
    if (measurements.dischargePressure !== undefined && measurements.suctionPressure !== undefined && measurements.dischargePressure <= measurements.suctionPressure)
        errors.push('Discharge pressure must be higher than suction pressure.');
    if (measurements.suctionTemp < -40 || measurements.suctionTemp > 200)
        warnings.push('Suction temperature is outside typical range (-40 to 200Â°F).');
    if (measurements.dischargeTemp !== undefined) {
        if (measurements.dischargeTemp < measurements.suctionTemp)
            warnings.push('Discharge temperature should normally be higher than suction temperature.');
        if (measurements.dischargeTemp > 275)
            warnings.push('Discharge temperature is very high (>275Â°F) â€“ compressor stress risk.');
    }
    if (measurements.isRunning === false)
        warnings.push('Compressor marked as not running; readings may not represent operating conditions.');
    return { valid: errors.length === 0, errors: errors.length ? errors : undefined, warnings };
}
// CORE ENGINE
export function generateRecipRecommendations(params) {
    const recs = [];
    const { compressionRatio: ratio, compressionStatus, current, currentStatus, rla: _rla, unloadingStatus, recipHealth } = params;
    // Trust the engine-produced flag as the single source of truth.
    // If the compressionStatus flag is 'critical', always emit a critical
    // recommendation indicating suspected internal bypass / valve failure.
    if (compressionStatus === 'critical') {
        recs.push({
            id: 'compressor_recip_internal_bypass_suspected',
            domain: 'compressor_recip',
            severity: 'critical',
            intent: 'diagnostic',
            summary: isFinite(ratio) ? `Compression ratio critical (${round(ratio, 2)}:1) — internal bypass or valve failure suspected.` : 'Compression ratio critical — internal bypass or valve failure suspected.',
            rationale: 'Severe internal bypass prevents proper compression and can overheat the compressor.',
            notes: [isFinite(ratio) ? `Compression ratio: ${round(ratio, 2)}:1` : 'Compression ratio critical — measurement unavailable'],
            requiresShutdown: true,
        });
    }
    if (currentStatus === 'critical') {
        let notes;
        if (current !== undefined) {
            const pct = _rla ? current / _rla : undefined;
            notes = pct ? `Measured current is ${round(current, 1)}A (${round(pct * 100, 0)}% of RLA).` : `Measured current is ${round(current, 1)}A (RLA not available in profile).`;
        }
        else {
            notes = 'Measured current not available in readings (engine flagged current as critical).';
        }
        recs.push({
            id: 'compressor_recip_current_far_above_rla',
            domain: 'compressor_recip',
            severity: 'critical',
            intent: 'safety',
            summary: 'Measured compressor current far above RLA — risk of overheating.',
            rationale: 'Compressor current indicates severe overload which may rapidly overheat windings.',
            notes: [notes],
            requiresShutdown: true,
        });
    }
    if (currentStatus === 'alert') {
        recs.push({
            id: 'compressor_recip_current_high_alert',
            domain: 'compressor_recip',
            severity: 'alert',
            intent: 'diagnostic',
            summary: 'Compressor current elevated — possible mechanical or electrical issues.',
            rationale: 'Elevated current detected; verify motor, load, and electrical supply.',
            notes: ['Current status flagged as alert.'],
            requiresShutdown: false,
        });
    }
    if (currentStatus === 'warning') {
        recs.push({
            id: 'compressor_recip_current_low_warning',
            domain: 'compressor_recip',
            severity: 'advisory',
            intent: 'diagnostic',
            summary: 'Slight current deviation detected; monitor for trends.',
            rationale: 'Compressor current near lower/higher thresholds — trend monitoring recommended.',
            notes: ['Current status flagged as warning.'],
            requiresShutdown: false,
        });
    }
    if (unloadingStatus === 'alert') {
        recs.push({
            id: 'compressor_recip_unloading_abnormal_alert',
            domain: 'compressor_recip',
            severity: 'alert',
            intent: 'diagnostic',
            summary: 'Cylinder unloading status indicates abnormal operation.',
            rationale: 'Unloading status flagged as alert; inspect unloading mechanism and control settings.',
            notes: ['Unloading status flagged as alert.'],
            requiresShutdown: false,
        });
    }
    if (unloadingStatus === 'warning') {
        recs.push({
            id: 'compressor_recip_unloading_partial_warning',
            domain: 'compressor_recip',
            severity: 'advisory',
            intent: 'diagnostic',
            summary: 'Partial cylinder unloading detected; verify configuration and settings.',
            rationale: 'Unloading status flagged as warning; check configuration and cylinder unload control.',
            notes: ['Unloading status flagged as warning.'],
            requiresShutdown: false,
        });
    }
    if (recipHealth?.reedValveSuspected) {
        recs.push({
            id: 'compressor_recip_reed_valve_issue_suspected',
            domain: 'compressor_recip',
            severity: 'alert',
            intent: 'diagnostic',
            summary: 'Reed valve issue suspected based on compression and sound characteristics.',
            rationale: 'Compression pattern and sound characteristics (hissing) align with reed valve problems.',
            notes: ['Reed valve suspected.'],
            requiresShutdown: false,
        });
    }
    if (recipHealth?.pistonRingWearSuspected) {
        recs.push({
            id: 'compressor_recip_piston_ring_wear_suspected',
            domain: 'compressor_recip',
            severity: 'alert',
            intent: 'diagnostic',
            summary: 'Piston ring wear suspected based on compression and sound characteristics.',
            rationale: 'Compression pattern and knocking sound suggest piston ring wear.',
            notes: ['Piston ring wear suspected.'],
            requiresShutdown: false,
        });
    }
    if (!recs.length && params.overallStatus === 'ok') {
        recs.push({
            id: 'compressor_recip_preventive_check',
            domain: 'compressor_recip',
            severity: 'info',
            intent: 'diagnostic',
            summary: 'Compressor within expected range — periodic trend monitoring recommended.',
            rationale: 'Periodic verification of pressures and currents under design load supports trend analysis.',
            notes: ['Compressor currently operating within expected range.'],
            requiresShutdown: false,
        });
    }
    return recs;
}
export function runReciprocatingCompressorEngine(measurements, profile) {
    const disc = [];
    const ratio = measurements.dischargePressure / measurements.suctionPressure;
    const comp = analyzeCompressionRatio(ratio);
    const compressorProfile = profile?.compressor;
    const rla = compressorProfile?.rla;
    const curr = analyzeCurrent(measurements.compressorCurrent, rla);
    const unloadingAnalysis = analyzeUnloading(measurements.totalCylinders, measurements.unloadedCylinders);
    const health = deriveRecipHealthFlags(comp.status, measurements.soundCharacteristics);
    if (!rla && measurements.compressorCurrent !== undefined)
        disc.push('No RLA in profile; current analysis is limited to absolute value, not % of RLA.');
    // Accept either canonical refrigerantType or older refrigerant value; if OTHER, record a disclaimer
    const refrigerantFromProfile = profile?.refrigeration?.refrigerantType ?? profile?.refrigeration?.refrigerant;
    const knownRefrigerants = new Set(['R410A', 'R22', 'R134A', 'R407C']);
    const refType = String(refrigerantFromProfile || '').toUpperCase().replace(/-/g, '');
    const refrigerantProfile = refType && knownRefrigerants.has(refType) ? 'standard' : 'unknown';
    if (refrigerantProfile === 'unknown') {
        disc.push('Refrigerant type is not in the standard profile library; analysis is limited to generic compression and current behavior.');
    }
    const statuses = [comp.status, curr.status];
    if (unloadingAnalysis)
        statuses.push(unloadingAnalysis.status);
    const overallStatus = worstStatus(statuses);
    // presentation-level overallFinding/likelyIssue are generated at the module/UI layer; engines only produce flags, values, status, and recommendations
    const recommendations = generateRecipRecommendations({ compressionRatio: ratio, compressionStatus: comp.status, current: measurements.compressorCurrent, currentStatus: curr.status, compressorId: measurements.compressorId, rla, overallStatus, unloadingStatus: unloadingAnalysis?.status, recipHealth: health });
    if (refrigerantProfile === 'unknown') {
        recommendations.push({
            id: 'refrigerant_profile_unknown',
            domain: 'compressor_recip',
            severity: 'info',
            intent: 'diagnostic',
            summary: 'Refrigerant type not in standard profile library; analysis used generic compressor behavior.',
            rationale: 'Analysis based on generic compression and current behavior when refrigerant profile is unknown.',
            notes: ['Informational: Unknown refrigerant profile detected.'],
            requiresShutdown: false,
        });
    }
    // Build EngineResult-shaped object (values + flags) and include backward-compatible flattened fields
    const values = {
        compressionRatio: round(ratio, 2),
        current: measurements.compressorCurrent,
        running: measurements.isRunning,
        unloadingInfo: unloadingAnalysis ? { unloadedCount: unloadingAnalysis.unloadedCount, total: unloadingAnalysis.total } : undefined,
    };
    const flags = {
        compressionStatus: comp.status,
        currentStatus: curr.status,
        recipHealth: health,
        disclaimers: disc,
        refrigerantProfile,
    };
    const result = {
        status: overallStatus,
        values,
        flags,
        recommendations,
        // Backward-compatible flattened fields
        compressorId: measurements.compressorId,
        compressionRatio: values.compressionRatio,
        compressionStatus: flags.compressionStatus,
        current: values.current,
        currentStatus: flags.currentStatus,
        running: values.running,
        unloadingInfo: unloadingAnalysis,
        disclaimers: flags.disclaimers || [],
    };
    return result;
}
