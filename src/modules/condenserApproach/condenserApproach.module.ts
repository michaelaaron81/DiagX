import { DiagnosticModule, ValidationResult } from '../../shared/wshp.types';
import { generateCondenserApproachRecommendations } from './condenserApproach.recommendations';
import { runCondenserApproachEngine } from './condenserApproach.engine';

import { CondenserApproachMeasurements, CondenserApproachProfile, CondenserApproachResult } from './condenserApproach.types';

export const condenserApproachModule: DiagnosticModule<CondenserApproachProfile, CondenserApproachMeasurements, CondenserApproachResult> = {
  metadata: { id: 'condenser_approach', name: 'Condenser Approach' },
  help: { measurementHelp: {} },
  validate(measurements: CondenserApproachMeasurements, profile: CondenserApproachProfile): ValidationResult {
    const errors: string[] = [];
    if (!measurements) errors.push('missing measurements');
    if (!profile) errors.push('missing profile');
    return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
  },
  diagnose(measurements: CondenserApproachMeasurements, profile: CondenserApproachProfile) {
    const result = runCondenserApproachEngine(measurements, { profile });
    // result is already strongly typed; module layer provides recommendations if missing
    result.recommendations = generateCondenserApproachRecommendations(result);
    return result;
  },
  getRecommendations(diagnosis: CondenserApproachResult) {
    return generateCondenserApproachRecommendations(diagnosis);
  },
};

export default condenserApproachModule;
