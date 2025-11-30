import { generateCondenserApproachRecommendations } from './condenserApproach.recommendations';
import { runCondenserApproachEngine } from './condenserApproach.engine';
export const condenserApproachModule = {
    metadata: { id: 'condenser_approach', name: 'Condenser Approach' },
    help: { measurementHelp: {} },
    validate(measurements, profile) {
        const errors = [];
        if (!measurements)
            errors.push('missing measurements');
        if (!profile)
            errors.push('missing profile');
        return { valid: errors.length === 0, errors: errors.length ? errors : undefined };
    },
    diagnose(measurements, profile) {
        const result = runCondenserApproachEngine(measurements, { profile });
        // result is already strongly typed; module layer provides recommendations if missing
        result.recommendations = generateCondenserApproachRecommendations(result);
        return result;
    },
    getRecommendations(diagnosis) {
        return generateCondenserApproachRecommendations(diagnosis);
    },
};
export default condenserApproachModule;
