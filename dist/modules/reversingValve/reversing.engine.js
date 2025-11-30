import { round } from '../../shared/wshp.types';
import { hasReversingValve } from '../../wshp/wshp.profile';
export function validateReversingValveMeasurements(measurements, profile) {
    const errors = [];
    const warnings = [];
    if (!hasReversingValve(profile))
        errors.push('This diagnostic module requires a heat pump with reversing valve');
    const ports = measurements.reversingValvePortTemps;
    if (!ports)
        errors.push('reversingValvePortTemps required');
    else {
        if (ports.dischargeInlet < 80 || ports.dischargeInlet > 300)
            warnings.push('Discharge inlet temp outside expected range (80-300°F)');
        if (ports.suctionReturn < 20 || ports.suctionReturn > 100)
            warnings.push('Suction return temp outside expected range (20-100°F)');
        if (ports.indoorCoilLine < 20 || ports.indoorCoilLine > 300)
            warnings.push('Indoor coil line temp outside reasonable range');
        if (ports.outdoorCoilLine < 20 || ports.outdoorCoilLine > 300)
            warnings.push('Outdoor coil line temp outside reasonable range');
        const temps = [ports.dischargeInlet, ports.suctionReturn, ports.indoorCoilLine, ports.outdoorCoilLine];
        const spread = Math.max(...temps) - Math.min(...temps);
        if (spread < 30)
            warnings.push('Temperature spread very small (<30°F) - valve may be stuck or unit not running');
    }
    if (measurements.dischargePressure <= measurements.suctionPressure)
        errors.push('Discharge pressure must be higher than suction pressure');
    if (measurements.solenoidVoltage !== undefined) {
        if (measurements.solenoidVoltage < 18 && measurements.solenoidVoltage > 0)
            warnings.push('Solenoid voltage low (<18V) - may not energize reliably');
        if (measurements.solenoidVoltage > 30)
            warnings.push('Solenoid voltage high (>30V) - verify reading');
    }
    return { valid: errors.length === 0, ok: errors.length === 0, errors: errors.length ? errors : undefined, warnings };
}
function getExpectedPattern(mode) {
    if (mode === 'cooling')
        return { hotPorts: ['discharge', 'outdoor'], coldPorts: ['indoor', 'suction'] };
    return { hotPorts: ['discharge', 'indoor'], coldPorts: ['outdoor', 'suction'] };
}
function analyzeSolenoid(actualVoltage, ratedVoltage) {
    if (actualVoltage < 2)
        return { status: 'no_voltage' };
    const minAcceptable = ratedVoltage * 0.85;
    if (actualVoltage < minAcceptable)
        return { status: 'low_voltage' };
    return { status: 'ok' };
}
function analyzeValvePattern(requestedMode, ports, hotPorts, coldPorts, tempSpread, compressionRatio) {
    if (tempSpread < 50) {
        return {
            pattern: 'stuck',
            status: 'critical',
        };
    }
    const expected = getExpectedPattern(requestedMode);
    const actualHot = hotPorts.slice().sort();
    const actualCold = coldPorts.slice().sort();
    const expectedHot = expected.hotPorts.slice().sort();
    const expectedCold = expected.coldPorts.slice().sort();
    const matches = JSON.stringify(actualHot) === JSON.stringify(expectedHot) && JSON.stringify(actualCold) === JSON.stringify(expectedCold);
    if (matches) {
        if (compressionRatio < 3.0) {
            return { pattern: 'partial_leak', status: 'alert' };
        }
        if (compressionRatio < 3.5) {
            return { pattern: 'partial_leak', status: 'warning' };
        }
        return { pattern: 'correct', status: 'ok' };
    }
    const opposite = getExpectedPattern(requestedMode === 'cooling' ? 'heating' : 'cooling');
    if (JSON.stringify(actualHot.slice().sort()) === JSON.stringify(opposite.hotPorts.slice().sort()) && JSON.stringify(actualCold.slice().sort()) === JSON.stringify(opposite.coldPorts.slice().sort())) {
        return { pattern: 'reversed', status: 'alert' };
    }
    return { pattern: 'stuck', status: 'alert' };
}
export function generateRecommendations(patternAnalysis, solenoidStatus, measurements, profile) {
    const recommendations = [];
    if (patternAnalysis.pattern === 'stuck' && patternAnalysis.status === 'critical') {
        recommendations.push({
            id: 'reversing_valve_stuck_mid_position',
            domain: 'reversing_valve',
            severity: 'critical',
            intent: 'safety',
            summary: 'Valve ports show similar temperature and pressures — valve likely stuck mid-position causing mixing and elevated risk to compressor.',
            rationale: 'Mid-position valve permits high-pressure gas to bypass into suction causing compressor stress and efficiency loss.',
            notes: ['Pattern analysis indicates stuck-mid-position.'],
            requiresShutdown: true,
        });
    }
    if (patternAnalysis.pattern === 'reversed') {
        recommendations.push({
            id: 'reversing_valve_not_switching',
            domain: 'reversing_valve',
            severity: 'alert',
            intent: 'diagnostic',
            summary: `Requested ${measurements.requestedMode} but valve observed in opposite mode.`,
            rationale: 'Valve appears unable to switch to the requested mode; electrical or mechanical causes are possible.',
            notes: ['Pattern analysis indicates valve reversed relative to requested mode.'],
            requiresShutdown: false,
        });
    }
    if (patternAnalysis.pattern === 'partial_leak' && patternAnalysis.status === 'alert') {
        recommendations.push({
            id: 'reversing_valve_internal_leak',
            domain: 'reversing_valve',
            severity: 'alert',
            intent: 'diagnostic',
            summary: `Compression ratio low (${round(measurements.dischargePressure / measurements.suctionPressure, 2)}:1) — internal leakage suspected.`,
            rationale: 'Low compression ratio consistent with internal leakage past reversing valve; diagnose to confirm.',
            notes: [],
            requiresShutdown: false,
        });
    }
    if (solenoidStatus === 'no_voltage') {
        recommendations.push({
            id: 'reversing_valve_solenoid_no_voltage',
            domain: 'reversing_valve',
            severity: 'alert',
            intent: 'diagnostic',
            summary: 'Solenoid coil not receiving power — valve will not switch.',
            rationale: 'Lack of solenoid voltage prevents actuation; check electrical supply and controls.',
            notes: [],
            requiresShutdown: false,
        });
    }
    if (patternAnalysis.pattern === 'correct' && patternAnalysis.status === 'ok') {
        recommendations.push({
            id: 'reversing_valve_preventive_check',
            domain: 'reversing_valve',
            severity: 'info',
            intent: 'diagnostic',
            summary: 'Reversing valve pattern matches expected behavior — periodic preventive checks recommended.',
            rationale: 'Valve currently operating correctly; periodic verification aids early detection of wear.',
            notes: [],
            requiresShutdown: false,
        });
    }
    return recommendations.sort((a, b) => {
        const order = { critical: 0, alert: 1, advisory: 2, info: 3 };
        const ap = a.severity ?? 'info';
        const bp = b.severity ?? 'info';
        return order[ap] - order[bp];
    });
}
export function runReversingValveEngine(measurements, profile) {
    const ports = measurements.reversingValvePortTemps;
    const temps = [ports.dischargeInlet, ports.suctionReturn, ports.indoorCoilLine, ports.outdoorCoilLine];
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const tempSpread = maxTemp - minTemp;
    const hotThreshold = 120;
    const hotPorts = [];
    const coldPorts = [];
    if (ports.dischargeInlet >= hotThreshold)
        hotPorts.push('discharge');
    else
        coldPorts.push('discharge');
    if (ports.suctionReturn >= hotThreshold)
        hotPorts.push('suction');
    else
        coldPorts.push('suction');
    if (ports.indoorCoilLine >= hotThreshold)
        hotPorts.push('indoor');
    else
        coldPorts.push('indoor');
    if (ports.outdoorCoilLine >= hotThreshold)
        hotPorts.push('outdoor');
    else
        coldPorts.push('outdoor');
    const compressionRatio = measurements.dischargePressure / measurements.suctionPressure;
    const patternAnalysis = analyzeValvePattern(measurements.requestedMode, ports, hotPorts, coldPorts, tempSpread, compressionRatio);
    let solenoidStatus;
    if (measurements.solenoidVoltage !== undefined && profile.reversingValve) {
        const sol = analyzeSolenoid(measurements.solenoidVoltage, profile.reversingValve.solenoid.voltage);
        solenoidStatus = sol.status;
        // engine no longer captures presentation text (solenoidMessage) — modules should generate human-facing messages
    }
    let overallStatus = patternAnalysis.status;
    if (solenoidStatus === 'no_voltage')
        overallStatus = 'alert';
    const recommendations = generateRecommendations(patternAnalysis, solenoidStatus, measurements, profile);
    const values = {
        portTemps: { dischargeInlet: round(ports.dischargeInlet, 1), suctionReturn: round(ports.suctionReturn, 1), indoorCoilLine: round(ports.indoorCoilLine, 1), outdoorCoilLine: round(ports.outdoorCoilLine, 1) },
        tempSpread: round(tempSpread, 1),
        hotPorts,
        coldPorts,
        compressionRatio: round(compressionRatio, 2),
    };
    const flags = {
        patternMatch: patternAnalysis.pattern,
        solenoidStatus,
    };
    return {
        status: overallStatus,
        values,
        flags,
        // Backward-compatible flattened fields
        requestedMode: measurements.requestedMode,
        portTemps: values.portTemps,
        tempSpread: values.tempSpread,
        hotPorts: values.hotPorts,
        coldPorts: values.coldPorts,
        patternMatch: flags.patternMatch,
        compressionRatio: values.compressionRatio,
        solenoidStatus: flags.solenoidStatus,
        recommendations,
        // recommendations included above and left in flattened shape for backward compatibility
    };
}
