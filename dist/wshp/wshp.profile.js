// WSHP profile types and helpers
export function hasReversingValve(profile) {
    return !!profile.reversingValve && profile.supportsHeating;
}
export function hasVFD(profile) {
    return !!profile.compressor && profile.compressor.hasVFD;
}
