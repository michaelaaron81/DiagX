export function validatePTChart(pt) {
    const errors = [];
    const warnings = [];
    if (!pt) {
        errors.push('No PT data provided');
        return { ok: false, errors, warnings };
    }
    if (!Array.isArray(pt) || pt.length < 2) {
        errors.push('PT table must be an array with at least two [tempF, pressurePSIG] points');
        return { ok: false, errors, warnings };
    }
    // check shape & monotonicity
    let lastP = null;
    for (let i = 0; i < pt.length; i++) {
        const row = pt[i];
        if (!Array.isArray(row) || row.length !== 2) {
            errors.push(`Row ${i} is not [tempF, pressurePSIG]`);
            continue;
        }
        const [t, p] = row;
        if (typeof t !== 'number' || typeof p !== 'number' || Number.isNaN(t) || Number.isNaN(p)) {
            errors.push(`Row ${i} contains non-numeric values`);
        }
        if (lastP !== null) {
            if (p === lastP)
                warnings.push(`Row ${i} pressure ${p} duplicates previous row`);
            if (p < lastP)
                errors.push(`Row ${i} pressure ${p} is not ascending (previous ${lastP})`);
        }
        lastP = p;
    }
    // check pressure range plausibility
    const pressures = pt.map(r => r[1]);
    const minP = Math.min(...pressures);
    const maxP = Math.max(...pressures);
    if (minP < -100 || maxP > 2000) {
        warnings.push(`Pressure extremes seem suspicious (min=${minP}, max=${maxP})`);
    }
    return { ok: errors.length === 0, errors, warnings };
}
export default validatePTChart;
