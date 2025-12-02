/**
 * Airside Airflow Override + TESP Safety Gate Tests
 * 
 * Phase 3.1 Feature: Technician-supplied airflow override with physics-based plausibility checks
 * 
 * Tests cover:
 * 1. Override accepted when within CFM/ton bounds for given TESP
 * 2. Override rejected when CFM/ton too low for TESP
 * 3. Override rejected when CFM/ton too high for TESP
 * 4. Fallback to inferred airflow when override rejected
 * 5. airflowSource correctly set to 'technician_override' when accepted
 */

import { describe, it, expect } from 'vitest';
import { AirsideDiagnosticModule } from '../src/modules/airside/airside.module';
import { validateAirflowOverrideCFM } from '../src/modules/airside/airside.validation';
import { AirsideMeasurements } from '../src/modules/airside/airside.types';
import { WaterCooledUnitProfile } from '../src/wshp/wshp.profile';

// Test profile: 3-ton unit with standard specs
const testProfile: WaterCooledUnitProfile = {
  manufacturer: 'Test',
  model: 'TEST-36',
  nominalTons: 3,
  refrigerantType: 'R-410A',
  nominalEWT: 85,
  airside: {
    designCFM: { cooling: 1200, heating: 1200 },
    externalStaticPressure: { design: 0.4, max: 0.6 },
  },
  compressor: {
    type: 'scroll',
    rla: 15,
    lra: 85,
  },
  waterSide: {
    flowRate: { design: 9 },
    pressureDrop: { design: 5 },
    ewt: { min: 50, max: 110 },
  },
};

// Base measurements for cooling mode
const baseMeasurements: AirsideMeasurements = {
  returnAirTemp: 75,
  supplyAirTemp: 55,
  mode: 'cooling',
};

describe('validateAirflowOverrideCFM', () => {
  describe('validation helper function', () => {
    it('accepts override within CFM/ton bounds for low TESP', () => {
      // 1200 CFM / 3 tons = 400 CFM/ton, TESP 0.3 allows 300-550
      const result = validateAirflowOverrideCFM(1200, 3, 0.3);
      expect(result.accepted).toBe(true);
      expect(result.cfmPerTon).toBe(400);
      expect(result.tespUsed).toBe(0.3);
    });

    it('rejects override when CFM/ton too low for TESP', () => {
      // 600 CFM / 3 tons = 200 CFM/ton, TESP 0.3 requires min 300
      const result = validateAirflowOverrideCFM(600, 3, 0.3);
      expect(result.accepted).toBe(false);
      expect(result.reason).toContain('below minimum');
      expect(result.cfmPerTon).toBe(200);
    });

    it('rejects override when CFM/ton too high for TESP', () => {
      // 2400 CFM / 3 tons = 800 CFM/ton, TESP 0.5 allows max 500
      const result = validateAirflowOverrideCFM(2400, 3, 0.5);
      expect(result.accepted).toBe(false);
      expect(result.reason).toContain('exceeds maximum');
      expect(result.cfmPerTon).toBe(800);
    });

    it('uses conservative default TESP (0.5) when not provided', () => {
      // 1200 CFM / 3 tons = 400 CFM/ton, default TESP 0.5 allows 280-500
      const result = validateAirflowOverrideCFM(1200, 3);
      expect(result.accepted).toBe(true);
      expect(result.tespUsed).toBe(0.5);
    });

    it('rejects when nominalTons is zero or missing', () => {
      const result = validateAirflowOverrideCFM(1200, 0);
      expect(result.accepted).toBe(false);
      expect(result.reason).toContain('nominalTons');
    });

    it('rejects negative override values', () => {
      const result = validateAirflowOverrideCFM(-100, 3, 0.5);
      expect(result.accepted).toBe(false);
      expect(result.reason).toContain('positive');
    });

    it('handles high restriction scenario (TESP > 1.0)', () => {
      // 600 CFM / 3 tons = 200 CFM/ton, high TESP allows 150-350
      const result = validateAirflowOverrideCFM(600, 3, 1.5);
      expect(result.accepted).toBe(true);
      expect(result.cfmPerTon).toBe(200);
    });
  });
});

describe('AirsideDiagnosticModule with airflow override', () => {
  const module = new AirsideDiagnosticModule();

  it('accepts valid override and sets airflowSource to technician_override', () => {
    const measurements: AirsideMeasurements = {
      ...baseMeasurements,
      airflowCFMOverride: 1200,
      totalExternalStatic: 0.4,
    };

    const result = module.diagnose(measurements, testProfile);

    expect(result.airflowSource).toBe('technician_override');
    expect(result.airflowCFM).toBe(1200);
    expect(result.disclaimers).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Technician airflow override of 1200 CFM was accepted'),
      ])
    );
  });

  it('includes technician note in disclaimer when provided', () => {
    const measurements: AirsideMeasurements = {
      ...baseMeasurements,
      airflowCFMOverride: 1200,
      totalExternalStatic: 0.4,
      airflowOverrideNote: 'Measured with anemometer traverse',
    };

    const result = module.diagnose(measurements, testProfile);

    expect(result.airflowSource).toBe('technician_override');
    expect(result.disclaimers).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Measured with anemometer traverse'),
      ])
    );
  });

  it('rejects override and falls back to inferred when CFM/ton too low', () => {
    const measurements: AirsideMeasurements = {
      ...baseMeasurements,
      airflowCFMOverride: 600, // 200 CFM/ton - too low
      totalExternalStatic: 0.4,
    };

    const result = module.diagnose(measurements, testProfile);

    // Should NOT be technician_override since it was rejected
    expect(result.airflowSource).not.toBe('technician_override');
    expect(result.disclaimers).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Airflow override rejected'),
        expect.stringContaining('below minimum'),
      ])
    );
  });

  it('rejects override and falls back when CFM/ton too high', () => {
    const measurements: AirsideMeasurements = {
      ...baseMeasurements,
      airflowCFMOverride: 2400, // 800 CFM/ton - too high
      totalExternalStatic: 0.4,
    };

    const result = module.diagnose(measurements, testProfile);

    expect(result.airflowSource).not.toBe('technician_override');
    expect(result.disclaimers).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Airflow override rejected'),
        expect.stringContaining('exceeds maximum'),
      ])
    );
  });

  it('uses externalStatic as fallback when totalExternalStatic not provided', () => {
    const measurements: AirsideMeasurements = {
      ...baseMeasurements,
      airflowCFMOverride: 1200,
      externalStatic: 0.35, // Use this as TESP fallback
    };

    const result = module.diagnose(measurements, testProfile);

    // Should accept - 400 CFM/ton is within 300-550 for TESP 0.35
    expect(result.airflowSource).toBe('technician_override');
    expect(result.airflowCFM).toBe(1200);
  });

  it('infers airflow from deltaT when no override provided', () => {
    const measurements: AirsideMeasurements = {
      ...baseMeasurements,
      // No override, no measuredCFM
    };

    const result = module.diagnose(measurements, testProfile);

    expect(result.airflowSource).toBe('inferred_deltaT');
    expect(result.estimatedCFM).toBeDefined();
    expect(result.airflowCFM).toBe(result.estimatedCFM);
  });

  it('uses measuredCFM when provided without override', () => {
    const measurements: AirsideMeasurements = {
      ...baseMeasurements,
      measuredCFM: 1100,
    };

    const result = module.diagnose(measurements, testProfile);

    expect(result.airflowSource).toBe('measured');
    expect(result.measuredCFM).toBe(1100);
    expect(result.airflowCFM).toBe(1100);
  });

  it('override takes precedence over measuredCFM when valid', () => {
    const measurements: AirsideMeasurements = {
      ...baseMeasurements,
      measuredCFM: 1100,
      airflowCFMOverride: 1200,
      totalExternalStatic: 0.4,
    };

    const result = module.diagnose(measurements, testProfile);

    // Override should win
    expect(result.airflowSource).toBe('technician_override');
    expect(result.airflowCFM).toBe(1200);
  });
});

describe('AirsideEngineResult structure', () => {
  const module = new AirsideDiagnosticModule();

  it('includes airflowCFM and airflowSource in values object', () => {
    const measurements: AirsideMeasurements = {
      ...baseMeasurements,
      airflowCFMOverride: 1200,
      totalExternalStatic: 0.4,
    };

    const result = module.diagnose(measurements, testProfile);

    // Check nested values object
    expect(result.values.airflowCFM).toBe(1200);
    expect(result.values.airflowSource).toBe('technician_override');

    // Check flattened fields (backward compatibility)
    expect(result.airflowCFM).toBe(1200);
    expect(result.airflowSource).toBe('technician_override');
  });

  it('preserves existing engine output fields', () => {
    const measurements: AirsideMeasurements = {
      ...baseMeasurements,
    };

    const result = module.diagnose(measurements, testProfile);

    // Ensure existing fields are still present
    expect(result.deltaT).toBeDefined();
    expect(result.deltaTStatus).toBeDefined();
    expect(result.expectedDeltaT).toBeDefined();
    expect(result.cfmPerTon).toBeDefined();
    expect(result.expectedCFMPerTon).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.recommendations).toBeDefined();
  });
});
