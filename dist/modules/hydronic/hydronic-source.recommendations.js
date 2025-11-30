export function generateHydronicSourceRecommendations(result, _context) {
    const recs = [];
    const { flags } = result;
    if (flags.deltaTStatus === 'critical') {
        recs.push({
            id: 'hydronic_source_delta_t_critical',
            domain: 'hydronic',
            severity: 'critical',
            intent: 'safety',
            summary: 'Hydronic loop ΔT is in a critical range and heat transfer is critically reduced.',
            rationale: 'Hydronic loop temperature difference outside expected range; evaluate heat transfer and flow.',
            notes: [],
            requiresShutdown: false,
        });
    }
    if (flags.approachStatus === 'alert') {
        recs.push({
            id: 'hydronic_source_approach_alert',
            domain: 'hydronic',
            severity: 'alert',
            intent: 'diagnostic',
            summary: 'Hydronic approach temperature outside expected range.',
            rationale: 'Hydronic approach to ambient is abnormal and may reduce performance.',
            notes: [],
            requiresShutdown: false,
        });
    }
    if (flags.flowStatus === 'warning') {
        recs.push({
            id: 'hydronic_source_flow_warning',
            domain: 'hydronic',
            severity: 'advisory',
            intent: 'diagnostic',
            summary: 'Hydronic flow index outside typical design range.',
            rationale: 'Hydronic flow deviates from typical design expectations and may affect heat transfer.',
            notes: [],
            requiresShutdown: false,
        });
    }
    if (flags.dataQualityStatus === 'warning') {
        recs.push({
            id: 'hydronic_source_data_quality_warning',
            domain: 'hydronic',
            severity: 'advisory',
            intent: 'diagnostic',
            summary: 'Hydronic source data incomplete or inconsistent; analysis confidence reduced.',
            rationale: 'Provide complete and consistent inputs to improve analysis confidence.',
            notes: [],
            requiresShutdown: false,
        });
    }
    if (result.status === 'ok' &&
        flags.deltaTStatus === 'ok' &&
        flags.approachStatus === 'ok' &&
        flags.flowStatus !== 'critical' &&
        flags.flowStatus !== 'alert') {
        recs.push({
            id: 'hydronic_source_preventive_check',
            domain: 'hydronic',
            severity: 'info',
            intent: 'diagnostic',
            summary: 'Hydronic source within expected thermal range — periodic verification recommended.',
            rationale: 'Periodic verification supports preventive maintenance.',
            notes: [],
            requiresShutdown: false,
        });
    }
    return recs;
}
