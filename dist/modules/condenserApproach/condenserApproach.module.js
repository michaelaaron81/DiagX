import { generateCondenserApproachRecommendations } from './condenserApproach.recommendations';
import { runCondenserApproachEngine } from './condenserApproach.engine';
export const condenserApproachModule = {
    metadata: { id: 'condenser_approach', name: 'Condenser Approach' },
    help: { measurementHelp: {} },
    validate(measurements, profile) {
        const errors = [];
        // at least ambient or condensing pressure should be provided
        if (!measurements)
            return { valid: false, errors: ['missing measurements'] };
        return { valid: true };
    },
    diagnose(measurements, profile) {
        const result = runCondenserApproachEngine(measurements, { profile });
        result.recommendations = generateCondenserApproachRecommendations(result);
        return result;
    },
    getRecommendations(diagnosis) {
        return generateCondenserApproachRecommendations(diagnosis);
    },
};
export default condenserApproachModule;
