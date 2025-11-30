export function generateCondenserApproachRecommendations(result) {
    const recs = [];
    const flags = result.flags;
    if (flags.approachStatus === 'critical') {
        recs.push({
            id: 'condenser_approach_critical',
            domain: 'condenser_approach',
            severity: 'critical',
            intent: 'safety',
            summary: 'Condenser approach severely low — heat rejection critically reduced.',
            rationale: 'Condenser approach below acceptable thresholds indicates severe restriction or poor heat rejection.',
            notes: [],
            requiresShutdown: true,
        });
    }
    if (flags.subcoolingStatus === 'critical') {
        recs.push({
            id: 'condenser_subcooling_critical',
            domain: 'condenser_approach',
            severity: 'critical',
            intent: 'safety',
            summary: 'Liquid subcooling severely low — possible poor condenser performance or undercharge.',
            rationale: 'Subcooling below safe thresholds may indicate condition that risks compressor operation.',
            notes: [],
            requiresShutdown: true,
        });
    }
    if (flags.subcoolingStatus === 'alert' || flags.subcoolingStatus === 'warning') {
        recs.push({
            id: 'condenser_subcooling_issue',
            domain: 'condenser_approach',
            severity: flags.subcoolingStatus === 'alert' ? 'alert' : 'advisory',
            intent: 'diagnostic',
            summary: 'Liquid subcooling outside expected range; verify charge and condenser performance.',
            rationale: 'Subcooling deviation may indicate charge or condenser issues; further diagnostics are advised.',
            notes: [],
            requiresShutdown: false,
        });
    }
    if (result.status === 'ok') {
        recs.push({
            id: 'condenser_preventive_trend',
            domain: 'condenser_approach',
            severity: 'info',
            intent: 'diagnostic',
            summary: 'Condenser approach and subcooling within expected ranges; continue monitoring trends.',
            rationale: 'Condenser performing within expected range; periodic verification recommended.',
            notes: [],
            requiresShutdown: false,
        });
    }
    return recs;
}
