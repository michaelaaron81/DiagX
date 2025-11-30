import { getRefrigerantData, isValidRefrigerant, PTChartData } from '../refrigeration/refrigerantData';
import { CondenserApproachMeasurements, CondenserApproachProfile, CondenserApproachResult } from './condenserApproach.types';
import { generateCondenserApproachRecommendations } from './condenserApproach.recommendations';

// very small helper: linear interpolation over PT chart where x=temperature,y=pressure in sample dataset
function interpolatePTForPressure(pt: PTChartData, pressure: number): number | null {
  // pt entries are [temperature, pressure]; but dataset may have pressure as second item
  // We'll search nearest entries where pressure spans desired value and linearly interpolate on temperature axis.
  if (!pt || pt.length === 0) return null;
  for (let i = 0; i < pt.length - 1; i++) {
    const [t1, p1] = pt[i];
    const [t2, p2] = pt[i + 1];
    // if pressure is between p1 and p2 (either direction)
    if ((pressure >= p1 && pressure <= p2) || (pressure <= p1 && pressure >= p2)) {
      const frac = (pressure - p1) / (p2 - p1);
      return t1 + frac * (t2 - t1);
    }
  }
  // fallback: use closest value
  let closest = pt[0];
  let bestDiff = Math.abs(pt[0][1] - pressure);
  for (const entry of pt) {
    const d = Math.abs(entry[1] - pressure);
    if (d < bestDiff) {
      closest = entry;
      bestDiff = d;
    }
  }
  return closest[0];
}

export function runCondenserApproachEngine(measurements: CondenserApproachMeasurements, context: { profile?: CondenserApproachProfile }): CondenserApproachResult {
  const { profile } = context || {};

  const values: any = {
    condenserApproach: null,
    condensingSatTemp: null,
    liquidSubcooling: null,
  };

  const flags: any = {
    approachStatus: 'unknown',
    subcoolingStatus: 'unknown',
    refrigerantProfile: 'standard',
  };

  // Determine refrigerant profile availability
  if (profile?.refrigerantType) {
    if (!isValidRefrigerant(profile.refrigerantType)) {
      flags.refrigerantProfile = 'unknown_curve';
    } else {
      flags.refrigerantProfile = 'standard';
    }
  }

  const ambient = measurements?.ambientTemp ?? null;
  const liquidTemp = measurements?.liquidLineTemp ?? null;
  const condP = measurements?.condensingPressure ?? null;

  // compute condensing saturation temperature when pressure available and refrigerant data provided
  if (condP !== null && profile?.refrigerantType) {
    const r = getRefrigerantData(profile.refrigerantType);
    if (r && r.pt) {
      const satTemp = interpolatePTForPressure(r.pt as PTChartData, condP);
      values.condensingSatTemp = satTemp;
      if (liquidTemp !== null && satTemp !== null) {
        values.liquidSubcooling = liquidTemp - satTemp;
      }
    } else {
      // refrigerant not in dataset
      values.condensingSatTemp = null;
    }
  }

  // compute condenser approach. require condensing pressure (sat temp) for most reliable approach determination
  if (condP !== null && ambient !== null) {
    // prefer liquidLineTemp - ambient when available (actual measured liquid line) otherwise use sat temp
    if (liquidTemp !== null) values.condenserApproach = liquidTemp - ambient;
    else if (values.condensingSatTemp !== null) values.condenserApproach = values.condensingSatTemp - ambient;
  }

  // decide statuses using expectedApproach if provided, otherwise use baseline heuristics
  const expected = profile?.expectedApproach ?? { min: 8, ideal: 15, max: 30 };

  if (values.condenserApproach === null) {
    flags.approachStatus = 'unknown';
  } else if (values.condenserApproach < expected.min) {
    flags.approachStatus = values.condenserApproach < 0 ? 'critical' : 'alert';
  } else if (values.condenserApproach >= expected.min && values.condenserApproach < expected.ideal) {
    flags.approachStatus = 'warning';
  } else {
    flags.approachStatus = 'ok';
  }

  // subcooling thresholds (liberal defaults)
  if (values.liquidSubcooling === null) {
    flags.subcoolingStatus = 'unknown';
  } else if (values.liquidSubcooling < 3) {
    flags.subcoolingStatus = 'critical';
  } else if (values.liquidSubcooling < 6) {
    flags.subcoolingStatus = 'alert';
  } else if (values.liquidSubcooling < 10) {
    flags.subcoolingStatus = 'warning';
  } else {
    flags.subcoolingStatus = 'ok';
  }

  // result status: one of flags is critical -> critical, else alert->alert, else warning->warning, else ok
  const combined = [flags.approachStatus, flags.subcoolingStatus];
  let status: any = 'ok';
  if (combined.includes('critical')) status = 'critical';
  else if (combined.includes('alert')) status = 'alert';
  else if (combined.includes('warning')) status = 'warning';

  const result: CondenserApproachResult = {
    status,
    values,
    flags,
    recommendations: [],
  };

  try {
    (result as any).recommendations = generateCondenserApproachRecommendations(result as any);
  } catch (e) {
    // ignore
  }

  return result;
}
