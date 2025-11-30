import { DomainResult, DomainFinding } from '../../shared/wshp.types';
import { RefrigerationConfig, RefrigerationMeasurements } from './refrigeration.types';
import { runRefrigerationEngine, RefrigerationEngineResult } from './refrigeration.engine';

export function runRefrigerationDomain(
  measurements: RefrigerationMeasurements,
  config: RefrigerationConfig
): DomainResult<RefrigerationEngineResult> {
  const e = runRefrigerationEngine(measurements, config);

  const findings: DomainFinding[] = [];

  // Undercharge pattern: high superheat and low subcooling
  if (e.superheat > 15 && e.subcooling < 8) {
    findings.push({
      code: 'REF_UNDERCHARGE',
      severity: 'alert',
      message: 'High superheat and low subcooling indicate low refrigerant charge.',
      relatedMeasurements: ['suctionPressure', 'dischargePressure', 'suctionTemp', 'liquidTemp'],
    });
  }

  // Overcharge / restriction sample
  if (e.subcooling > 20 && e.superheat < 3) {
    findings.push({
      code: 'REF_OVERCHARGE_OR_RESTRICTION',
      severity: 'warning',
      message: 'Very high subcooling with low superheat — possible overcharge or restriction',
      relatedMeasurements: ['liquidTemp', 'suctionTemp'],
    });
  }

  // Compression problems
  if (e.compressionRatio > 4 && e.compressionRatioStatus === 'alert') {
    findings.push({
      code: 'REF_COMPRESSION_ISSUE',
      severity: 'alert',
      message: 'High compression ratio detected — check discharge side.',
      relatedMeasurements: ['dischargePressure', 'suctionPressure'],
    });
  }

  const ok = e.status === 'ok';

  return {
    domain: 'refrigeration',
    ok,
    findings,
    details: e,
  };
}
