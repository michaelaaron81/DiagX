// Helpful formatters used across modules
export function formatPressure(p) {
    return `${round(p, 1)} PSIG`;
}
export function formatCurrent(a) {
    return `${round(a, 1)} A`;
}
export function formatVoltage(v) {
    return `${Math.round(v)} V`;
}
export function formatFlow(cfm) {
    return `${Math.round(cfm)} CFM`;
}
export function formatPercentage(p) {
    return `${round(p * 100, 1)}%`;
}
export const CONSTANTS = {
    SUPERHEAT_COOLING_TXV: { min: 6, ideal: 10, max: 15 },
    SUPERHEAT_COOLING_FIXED: { min: 8, ideal: 12, max: 20 },
    SUPERHEAT_HEATING_TXV: { min: 6, ideal: 10, max: 15 },
    SUBCOOLING_WATER_COOLED: { min: 6, ideal: 10, max: 15 },
    COMPRESSION_RATIO: { min: 2.0, ideal: 3.0, max: 4.5 },
};
export function round(n, decimals = 2) {
    const p = Math.pow(10, decimals);
    return Math.round(n * p) / p;
}
export function formatTemperature(t) {
    return `${round(t, 1)} °F`;
}
