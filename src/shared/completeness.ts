import type { ProfileInputSchema, CompletenessLevel } from './profileInput.types';

export interface CompletenessClassification {
  airside: CompletenessLevel;
  refrigeration: CompletenessLevel;
  hydronic: CompletenessLevel;
  condenserApproach: CompletenessLevel;
  recipCompressor: CompletenessLevel;
  scrollCompressor: CompletenessLevel;
  reversingValve: CompletenessLevel;
}

/**
 * Classifies completeness for each domain based on presence of required measurements.
 * Returns 'full' if all required fields are present, 'skipped' if no measurements present,
 * 'limited' or 'advisory' for partial data.
 */
export function classifyCompleteness(input: ProfileInputSchema): CompletenessClassification {
  const { measurements, profile } = input;

  return {
    airside: classifyAirside(measurements.airside),
    refrigeration: classifyRefrigeration(measurements.refrigeration),
    hydronic: classifyHydronic(measurements.hydronic, profile),
    condenserApproach: classifyCondenserApproach(measurements.condenserApproach),
    recipCompressor: classifyRecipCompressor(measurements.recipCompressor, profile),
    scrollCompressor: classifyScrollCompressor(measurements.scrollCompressor, profile),
    reversingValve: classifyReversingValve(measurements.reversingValve),
  };
}

function classifyAirside(m: ProfileInputSchema['measurements']['airside']): CompletenessLevel {
  if (!m || Object.keys(m).length === 0) return 'skipped';

  const hasReturn = m.returnAirTemp !== undefined;
  const hasSupply = m.supplyAirTemp !== undefined;
  const hasStatic = m.totalExternalStatic !== undefined;

  if (hasReturn && hasSupply && hasStatic) return 'full';
  if (hasReturn && hasSupply) return 'limited';
  return 'advisory';
}

function classifyRefrigeration(m: ProfileInputSchema['measurements']['refrigeration']): CompletenessLevel {
  if (!m || Object.keys(m).length === 0) return 'skipped';

  const hasSuction = m.suctionPressure !== undefined;
  const hasDischarge = m.dischargePressure !== undefined;

  if (hasSuction && hasDischarge) return 'full';
  if (hasSuction || hasDischarge) return 'limited';
  return 'advisory';
}

function classifyHydronic(m: ProfileInputSchema['measurements']['hydronic'], profile: ProfileInputSchema['profile']): CompletenessLevel {
  if (!m || Object.keys(m).length === 0) return 'skipped';
  if (!profile.waterSide) return 'skipped';

  const hasEntering = m.enteringWaterTemp !== undefined && m.enteringWaterTemp !== null;
  const hasLeaving = m.leavingWaterTemp !== undefined && m.leavingWaterTemp !== null;

  if (hasEntering && hasLeaving) return 'full';
  if (hasEntering || hasLeaving) return 'limited';
  return 'advisory';
}

function classifyCondenserApproach(m: ProfileInputSchema['measurements']['condenserApproach']): CompletenessLevel {
  if (!m || Object.keys(m).length === 0) return 'skipped';

  const hasAmbient = m.ambientTemp !== undefined && m.ambientTemp !== null;
  const hasLiquidLine = m.liquidLineTemp !== undefined && m.liquidLineTemp !== null;

  if (hasAmbient && hasLiquidLine) return 'full';
  if (hasAmbient || hasLiquidLine) return 'limited';
  return 'advisory';
}

function classifyRecipCompressor(m: ProfileInputSchema['measurements']['recipCompressor'], profile: ProfileInputSchema['profile']): CompletenessLevel {
  if (!m || Object.keys(m).length === 0) return 'skipped';

  const hasCurrent = m.compressorCurrent !== undefined;
  const hasDischargeTemp = m.dischargeTemp !== undefined;
  const hasRLA = !!profile.compressor?.rla;

  if (hasCurrent && hasDischargeTemp && hasRLA) return 'full';
  if (hasCurrent || hasDischargeTemp) return 'limited';
  return 'advisory';
}

function classifyScrollCompressor(m: ProfileInputSchema['measurements']['scrollCompressor'], profile: ProfileInputSchema['profile']): CompletenessLevel {
  if (!m || Object.keys(m).length === 0) return 'skipped';

  const hasCurrent = m.runningCurrent !== undefined;
  const hasRLA = !!profile.compressor?.rla;

  if (hasCurrent && hasRLA) return 'full';
  if (hasCurrent) return 'limited';
  return 'advisory';
}

function classifyReversingValve(m: ProfileInputSchema['measurements']['reversingValve']): CompletenessLevel {
  if (!m || Object.keys(m).length === 0) return 'skipped';

  const hasMode = m.requestedMode !== undefined;

  if (hasMode) return 'full';
  return 'advisory';
}
