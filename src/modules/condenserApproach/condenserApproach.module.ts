import { DiagnosticModule, ValidationResult, EngineResult } from '../../shared/wshp.types';
import { generateCondenserApproachRecommendations } from './condenserApproach.recommendations';
import { runCondenserApproachEngine } from './condenserApproach.engine';

export const condenserApproachModule: DiagnosticModule<any, any, any> = {
  metadata: { id: 'condenser_approach', name: 'Condenser Approach' },
  help: { measurementHelp: {} },
  validate(measurements: any, profile: any): ValidationResult {
    const errors: string[] = [];
    // at least ambient or condensing pressure should be provided
    if (!measurements) return { valid: false, errors: ['missing measurements'] };
    return { valid: true };
  },
  diagnose(measurements: any, profile: any) {
    const result = runCondenserApproachEngine(measurements, { profile });
    (result as any).recommendations = generateCondenserApproachRecommendations(result as any);
    return result as any;
  },
  getRecommendations(diagnosis: any) {
    return generateCondenserApproachRecommendations(diagnosis as any);
  },
};

export default condenserApproachModule;
