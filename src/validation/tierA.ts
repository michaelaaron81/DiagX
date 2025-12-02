import { ValidationIssue } from '../shared/validation.types';
import { ProfileInputSchema } from '../shared/profileInput.types';

export function runTierAValidation(
  input: ProfileInputSchema
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // 1. Null profile check
  if (!input.profile) {
    issues.push({
      field: 'profile',
      code: 'missing',
      message: 'Profile is required but was not provided.',
      severity: 'error',
    });
    return issues; // Cannot proceed without profile
  }

  const { measurements } = input;

  // 2. Negative pressures
  if (measurements.refrigeration?.suctionPressure !== undefined && measurements.refrigeration.suctionPressure < 0) {
    issues.push({
      field: 'refrigeration.suctionPressure',
      code: 'out_of_range',
      message: 'Suction pressure cannot be negative.',
      severity: 'error',
    });
  }

  if (measurements.refrigeration?.dischargePressure !== undefined && measurements.refrigeration.dischargePressure < 0) {
    issues.push({
      field: 'refrigeration.dischargePressure',
      code: 'out_of_range',
      message: 'Discharge pressure cannot be negative.',
      severity: 'error',
    });
  }

  // 3. Impossible temperatures (any temp < -50°F or > 300°F)
  const tempFields: Array<{ path: string; value: number | undefined | null }> = [
    { path: 'refrigeration.suctionTemp', value: measurements.refrigeration?.suctionTemp },
    { path: 'refrigeration.liquidTemp', value: measurements.refrigeration?.liquidTemp },
    { path: 'refrigeration.dischargeTemp', value: measurements.refrigeration?.dischargeTemp },
    { path: 'refrigeration.enteringWaterTemp', value: measurements.refrigeration?.enteringWaterTemp },
    { path: 'refrigeration.leavingWaterTemp', value: measurements.refrigeration?.leavingWaterTemp },
    { path: 'refrigeration.indoorAirTemp', value: measurements.refrigeration?.indoorAirTemp },
    { path: 'refrigeration.ambientTemp', value: measurements.refrigeration?.ambientTemp },
    { path: 'airside.returnAirTemp', value: measurements.airside?.returnAirTemp },
    { path: 'airside.supplyAirTemp', value: measurements.airside?.supplyAirTemp },
    { path: 'airside.wetBulbTemp', value: measurements.airside?.wetBulbTemp },
    { path: 'airside.supplyWetBulb', value: measurements.airside?.supplyWetBulb },
    { path: 'hydronic.enteringWaterTemp', value: measurements.hydronic?.enteringWaterTemp },
    { path: 'hydronic.leavingWaterTemp', value: measurements.hydronic?.leavingWaterTemp },
    { path: 'recipCompressor.suctionTemp', value: measurements.recipCompressor?.suctionTemp },
    { path: 'recipCompressor.dischargeTemp', value: measurements.recipCompressor?.dischargeTemp },
    { path: 'scrollCompressor.suctionTemp', value: measurements.scrollCompressor?.suctionTemp },
    { path: 'scrollCompressor.dischargeTemp', value: measurements.scrollCompressor?.dischargeTemp },
    { path: 'condenserApproach.ambientTemp', value: measurements.condenserApproach?.ambientTemp },
    { path: 'condenserApproach.liquidLineTemp', value: measurements.condenserApproach?.liquidLineTemp },
  ];

  for (const { path, value } of tempFields) {
    if (value !== undefined && value !== null) {
      if (value < -50) {
        issues.push({
          field: path,
          code: 'out_of_range',
          message: `Temperature ${value}°F is below minimum plausible value (-50°F).`,
          severity: 'error',
        });
      } else if (value > 300) {
        issues.push({
          field: path,
          code: 'out_of_range',
          message: `Temperature ${value}°F exceeds maximum plausible value (300°F).`,
          severity: 'error',
        });
      }
    }
  }

  // 4. Contradictory mode checks
  const profile = input.profile;

  // profile.mode = 'cooling' but water temps reversed
  if (measurements.refrigeration?.mode === 'cooling') {
    const ewt = measurements.refrigeration.enteringWaterTemp;
    const lwt = measurements.refrigeration.leavingWaterTemp;
    if (ewt !== undefined && lwt !== undefined && lwt > ewt) {
      issues.push({
        field: 'refrigeration.mode',
        code: 'inconsistent',
        message: 'Mode is cooling but leaving water temp exceeds entering water temp (expected cooling to lower water temp).',
        severity: 'warning',
      });
    }
  }

  // profile.mode = 'heating' but airside ΔT negative
  if (measurements.refrigeration?.mode === 'heating' && measurements.airside) {
    const returnT = measurements.airside.returnAirTemp;
    const supplyT = measurements.airside.supplyAirTemp;
    if (returnT !== undefined && supplyT !== undefined && supplyT < returnT) {
      issues.push({
        field: 'airside.mode',
        code: 'inconsistent',
        message: 'Mode is heating but supply air temp is lower than return air temp (expected heating to raise air temp).',
        severity: 'warning',
      });
    }
  }

  // 5. Missing required-for-engine fields (only check if domain has ANY measurement present)

  // Refrigeration: suctionPressure, dischargePressure
  if (measurements.refrigeration && Object.keys(measurements.refrigeration).length > 0) {
    if (measurements.refrigeration.suctionPressure === undefined) {
      issues.push({
        field: 'refrigeration.suctionPressure',
        code: 'missing',
        message: 'Suction pressure is required for refrigeration analysis.',
        severity: 'error',
      });
    }
    if (measurements.refrigeration.dischargePressure === undefined) {
      issues.push({
        field: 'refrigeration.dischargePressure',
        code: 'missing',
        message: 'Discharge pressure is required for refrigeration analysis.',
        severity: 'error',
      });
    }
  }

  // Airside: returnDryBulb (returnAirTemp), supplyDryBulb (supplyAirTemp), totalExternalStatic
  if (measurements.airside && Object.keys(measurements.airside).length > 0) {
    if (measurements.airside.returnAirTemp === undefined) {
      issues.push({
        field: 'airside.returnAirTemp',
        code: 'missing',
        message: 'Return air temperature (dry bulb) is required for airside analysis.',
        severity: 'error',
      });
    }
    if (measurements.airside.supplyAirTemp === undefined) {
      issues.push({
        field: 'airside.supplyAirTemp',
        code: 'missing',
        message: 'Supply air temperature (dry bulb) is required for airside analysis.',
        severity: 'error',
      });
    }
    if (measurements.airside.totalExternalStatic === undefined) {
      issues.push({
        field: 'airside.totalExternalStatic',
        code: 'missing',
        message: 'Total external static pressure is required for airside analysis.',
        severity: 'error',
      });
    }
  }

  // Hydronic: enteringWaterTemp, leavingWaterTemp
  if (measurements.hydronic && Object.keys(measurements.hydronic).length > 0) {
    if (measurements.hydronic.enteringWaterTemp === undefined) {
      issues.push({
        field: 'hydronic.enteringWaterTemp',
        code: 'missing',
        message: 'Entering water temperature is required for hydronic analysis.',
        severity: 'error',
      });
    }
    if (measurements.hydronic.leavingWaterTemp === undefined) {
      issues.push({
        field: 'hydronic.leavingWaterTemp',
        code: 'missing',
        message: 'Leaving water temperature is required for hydronic analysis.',
        severity: 'error',
      });
    }
  }

  // Recip compressor: amperage (compressorCurrent), rla, dischargeTemp
  if (measurements.recipCompressor && Object.keys(measurements.recipCompressor).length > 0) {
    if (measurements.recipCompressor.compressorCurrent === undefined) {
      issues.push({
        field: 'recipCompressor.compressorCurrent',
        code: 'missing',
        message: 'Compressor current (amperage) is required for reciprocating compressor analysis.',
        severity: 'error',
      });
    }
    // Note: rla comes from profile.compressor.rla, not measurements
    if (!profile.compressor?.rla) {
      issues.push({
        field: 'profile.compressor.rla',
        code: 'missing',
        message: 'RLA (rated load amps) is required in profile for reciprocating compressor analysis.',
        severity: 'error',
      });
    }
    if (measurements.recipCompressor.dischargeTemp === undefined) {
      issues.push({
        field: 'recipCompressor.dischargeTemp',
        code: 'missing',
        message: 'Discharge temperature is required for reciprocating compressor analysis.',
        severity: 'error',
      });
    }
  }

  // Scroll compressor: amperage (runningCurrent), rla
  if (measurements.scrollCompressor && Object.keys(measurements.scrollCompressor).length > 0) {
    if (measurements.scrollCompressor.runningCurrent === undefined) {
      issues.push({
        field: 'scrollCompressor.runningCurrent',
        code: 'missing',
        message: 'Running current (amperage) is required for scroll compressor analysis.',
        severity: 'error',
      });
    }
    // Note: rla comes from profile.compressor.rla, not measurements
    if (!profile.compressor?.rla) {
      issues.push({
        field: 'profile.compressor.rla',
        code: 'missing',
        message: 'RLA (rated load amps) is required in profile for scroll compressor analysis.',
        severity: 'error',
      });
    }
  }

  // Reversing valve: mode (requestedMode)
  if (measurements.reversingValve && Object.keys(measurements.reversingValve).length > 0) {
    if (measurements.reversingValve.requestedMode === undefined) {
      issues.push({
        field: 'reversingValve.requestedMode',
        code: 'missing',
        message: 'Requested mode is required for reversing valve analysis.',
        severity: 'error',
      });
    }
  }

  // Condenser approach: outdoorAirTemp (ambientTemp), liquidLineTemp
  if (measurements.condenserApproach && Object.keys(measurements.condenserApproach).length > 0) {
    if (measurements.condenserApproach.ambientTemp === undefined) {
      issues.push({
        field: 'condenserApproach.ambientTemp',
        code: 'missing',
        message: 'Outdoor/ambient air temperature is required for condenser approach analysis.',
        severity: 'error',
      });
    }
    if (measurements.condenserApproach.liquidLineTemp === undefined) {
      issues.push({
        field: 'condenserApproach.liquidLineTemp',
        code: 'missing',
        message: 'Liquid line temperature is required for condenser approach analysis.',
        severity: 'error',
      });
    }
  }

  // 6. Airflow override plausibility hook
  if (measurements.airside?.airflowCFMOverride !== undefined && measurements.airside.totalExternalStatic === undefined) {
    issues.push({
      field: 'airside.airflowCFMOverride',
      code: 'inconsistent',
      message: 'Airflow override provided but total external static pressure is missing; override cannot be validated.',
      severity: 'warning',
    });
  }

  return issues;
}
