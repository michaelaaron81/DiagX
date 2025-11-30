export function validateAirsideMeasurements(m) {
    const issues = [];
    // Missing critical fields
    if (m.returnAirTemp == null) {
        issues.push({ field: 'returnAirTemp', code: 'missing', message: 'Return air temperature is required for airside diagnostics.', severity: 'error' });
    }
    if (m.supplyAirTemp == null) {
        issues.push({ field: 'supplyAirTemp', code: 'missing', message: 'Supply air temperature is required for airside diagnostics.', severity: 'error' });
    }
    // Obvious impossible values
    if (m.returnAirTemp != null && (m.returnAirTemp < -100 || m.returnAirTemp > 300)) {
        issues.push({ field: 'returnAirTemp', code: 'out_of_range', message: 'Return air temperature is outside reasonable bounds.', severity: 'error' });
    }
    if (m.supplyAirTemp != null && (m.supplyAirTemp < -100 || m.supplyAirTemp > 300)) {
        issues.push({ field: 'supplyAirTemp', code: 'out_of_range', message: 'Supply air temperature is outside reasonable bounds.', severity: 'error' });
    }
    // Conservative warning: suspicious humidity values
    if (m.returnAirRH !== undefined && (m.returnAirRH < 0 || m.returnAirRH > 100)) {
        issues.push({ field: 'returnAirRH', code: 'suspicious', message: 'Return air relative humidity outside 0-100%.', severity: 'warning' });
    }
    // delta-T too small may indicate not running (fatal)
    if (m.returnAirTemp != null && m.supplyAirTemp != null) {
        const deltaT = Math.abs(m.supplyAirTemp - m.returnAirTemp);
        if (deltaT < 0.5) {
            issues.push({ field: 'deltaT', code: 'impossible', message: 'Measured Delta-T is too small (<0.5°F) — unit may not be running or sensors misread.', severity: 'error' });
        }
    }
    return { ok: issues.every(i => i.severity !== 'error'), issues };
}
