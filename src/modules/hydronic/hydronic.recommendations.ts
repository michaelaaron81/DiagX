import { HydronicEngineResult, HydronicEngineContext } from './hydronic.types';
import { Recommendation } from '../../shared/wshp.types';

export function generateHydronicRecommendations(result: HydronicEngineResult, context?: HydronicEngineContext): Recommendation[] {
  void context;
  const recs: Recommendation[] = [];
  const { flags, values, status } = result;

  // Critical delta-T: immediate attention recommended (no forced shutdown)
  if (flags.deltaTStatus === 'critical') {
    recs.push({
      id: 'hydronic_deltaT_critical',
      domain: 'hydronic',
      severity: 'critical',
      intent: 'safety',
      summary: `Hydronic ΔT critically low (${values.waterDeltaT ?? 'unknown'}F) — heat transfer severely reduced.`,
      rationale: 'Hydronic heat transfer ΔT critically low; verify flow and heat exchanger condition as operation may be unsafe for continued loading.',
      notes: [`Measured ΔT ${values.waterDeltaT ?? 'unknown'}F`],
      requiresShutdown: false,
    });
  }

  // Alerts
  if (flags.deltaTStatus === 'alert') {
    recs.push({
      id: 'hydronic_deltaT_alert',
      domain: 'hydronic',
      severity: 'alert',
      intent: 'diagnostic',
      summary: `Measured hydronic ΔT outside expected range (${values.waterDeltaT ?? 'unknown'}F).`,
      rationale: 'Hydronic heat transfer outside expected range; evaluate flow and heat exchanger.',
      notes: [`Measured ΔT ${values.waterDeltaT ?? 'unknown'}F`],
      requiresShutdown: false,
    });
  }

  if (flags.flowStatus === 'alert' || flags.flowStatus === 'critical') {
    recs.push({
      id: 'hydronic_flow_issue',
      domain: 'hydronic',
      severity: flags.flowStatus === 'critical' ? 'critical' : 'alert',
      intent: 'diagnostic',
      summary: `Measured flow (${values.flowRateGPM ?? 'unknown'} GPM) outside expected range for design.`,
      rationale: 'Measured flow deviates significantly from design expectations and may impact heat transfer.',
      notes: [`Measured flow ${values.flowRateGPM ?? 'unknown'} GPM`],
      requiresShutdown: false,
    });
  }

  // Preventive
  if (status === 'ok' && flags.deltaTStatus === 'ok' && (flags.flowStatus === 'ok' || flags.flowStatus === 'unknown')) {
    recs.push({
      id: 'hydronic_preventive_trend',
      domain: 'hydronic',
      severity: 'info',
      intent: 'diagnostic',
      summary: 'Hydronic conditions within expected range — trend monitoring recommended.',
      rationale: 'Record hydronic ΔT and flow under stable conditions to detect early degradation.',
      notes: ['Hydronic conditions currently within expected range.'],
      requiresShutdown: false,
    });
  }

  // Data quality / missing measurements
  if (flags.deltaTStatus === 'unknown' || flags.flowStatus === 'unknown') {
    recs.push({
      id: 'hydronic_data_quality_issue',
      domain: 'hydronic',
      severity: 'advisory',
      intent: 'diagnostic',
      summary: 'Hydronic measurement inputs are incomplete or unavailable and prevent accurate diagnosis.',
      rationale: flags.deltaTStatus === 'unknown' ? 'Missing ΔT inputs' : 'Missing flow inputs',
      notes: ['Provide entering/leaving temperatures and flow for accurate analysis.'],
      requiresShutdown: false,
    });
  }

  return recs;
}
