# Consolidated Test Report

**Generated:** 2025-12-02T03:25:58.119Z

**Source:** docs/under-review/

**Files consolidated:** 12

---

## Contents

- [Combined Profile](#combined-profile)
- [Recip Stress](#recip-stress)
- [Recommendation Gaps](#recommendation-gaps)
- [Scroll Stress](#scroll-stress)

---

## Combined Profile

**Source file:** Combined_Profile_Stress_Test_Audit_2025-12-01T22-24-36.md

Scanned at: 2025-12-01T22:24:36.913Z

## Profile

```json
{
  "id": "stress-test-1",
  "nominalTons": 5,
  "airside": {
    "designCFM": {
      "cooling": 2400
    },
    "externalStaticPressure": {
      "design": 0.25,
      "max": 0.6
    }
  },
  "refrigeration": {
    "refrigerant": "R-410A",
    "metering": {
      "cooling": {
        "type": "txv"
      }
    }
  },
  "waterSide": {
    "flowRate": 50,
    "loopType": "closed_tower"
  },
  "compressor": {
    "type": "scroll",
    "rla": 10,
    "lra": 35
  },
  "reversingValve": {
    "type": "standard",
    "solenoid": {
      "voltage": 24
    }
  }
}
```

## Engine Results

```json
{
  "air": {
    "status": "critical",
    "values": {
      "deltaT": 48,
      "expectedDeltaT": {
        "min": 8,
        "ideal": 12,
        "max": 16,
        "source": "industry"
      },
      "estimatedCFM": 1157,
      "measuredCFM": 600,
      "airflowCFM": 600,
      "airflowSource": "measured",
      "cfmPerTon": 120,
      "expectedCFMPerTon": {
        "min": 432,
        "ideal": 480,
        "max": 528,
        "source": "nameplate_calculated"
      },
      "totalESP": 0.85,
      "ratedESP": {
        "design": 0.25,
        "max": 0.6
      }
    },
    "flags": {
      "mode": "cooling",
      "deltaTStatus": "critical",
      "deltaTSource": "industry",
      "cfmSource": "nameplate_calculated",
      "airflowStatus": "critical",
      "staticPressureStatus": "critical",
      "disclaimers": [
        "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
        "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
      ]
    },
    "recommendations": [
      {
        "id": "airside_frozen_coil_or_restriction",
        "domain": "airside",
        "severity": "critical",
        "intent": "safety",
        "summary": "Measured ΔT 48 °F indicates severe restriction or possible frozen coil",
        "rationale": "Delta-T is critically outside expected range and suggests severe airflow restriction or coil icing.",
        "notes": [
          "Delta-T indication: 48 °F"
        ],
        "requiresShutdown": true
      },
      {
        "id": "airside.low_airflow.inspect_air_path",
        "domain": "airside",
        "severity": "critical",
        "intent": "diagnostic",
        "summary": "Airflow indicators suggest system airflow is below expected range for cooling operation.",
        "rationale": "Potential contributors include filter and coil condition, blower wheel issues, or duct restrictions; confirm with field measurements.",
        "notes": [
          "Advisory based on airflow and ΔT status; verify with measurements and equipment documentation."
        ]
      },
      {
        "id": "airside.static_pressure.inspect_ductwork",
        "domain": "airside",
        "severity": "critical",
        "intent": "diagnostic",
        "summary": "External static pressure is outside expected range for cooling operation.",
        "rationale": "Duct sizing, balancing dampers, or obstructions can contribute; verify filter loading independently of OEM curves.",
        "notes": [
          "Advisory based on static pressure and airflow flags; confirm with field measurements."
        ],
        "requiresShutdown": false
      },
      {
        "id": "airside.abnormal_deltaT.check_for_icing_or_restriction",
        "domain": "airside",
        "severity": "critical",
        "intent": "diagnostic",
        "summary": "Supply-air ΔT low while airflow is critically low; coil fouling, icing, or airflow restrictions are plausible contributors.",
        "rationale": "When ΔT is low and airflow critically low, refrigeration-side diagnostics are unreliable until airflow/coil issues are resolved.",
        "notes": [
          "Review coil and airflow path before interpreting refrigeration diagnostics."
        ]
      }
    ],
    "mode": "cooling",
    "deltaT": 48,
    "deltaTStatus": "critical",
    "expectedDeltaT": {
      "min": 8,
      "ideal": 12,
      "max": 16,
      "source": "industry"
    },
    "deltaTSource": "industry",
    "estimatedCFM": 1157,
    "measuredCFM": 600,
    "airflowCFM": 600,
    "airflowSource": "measured",
    "cfmPerTon": 120,
    "expectedCFMPerTon": {
      "min": 432,
      "ideal": 480,
      "max": 528,
      "source": "nameplate_calculated"
    },
    "cfmSource": "nameplate_calculated",
    "airflowStatus": "critical",
    "staticPressureStatus": "critical",
    "totalESP": 0.85,
    "ratedESP": {
      "design": 0.25,
      "max": 0.6
    },
    "disclaimers": [
      "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
      "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
    ]
  },
  "ref": {
    "status": "alert",
    "values": {
      "suctionPressure": 70,
      "dischargePressure": 360,
      "suctionSatTemp": 8.7,
      "dischargeSatTemp": 77.4,
      "superheat": 51.3,
      "subcooling": -17.6,
      "compressionRatio": 5.14,
      "waterDeltaT": 8
    },
    "flags": {
      "superheatStatus": "alert",
      "subcoolingStatus": "alert",
      "compressionRatioStatus": "warning",
      "waterTransferStatus": "ok",
      "refrigerantProfile": "standard",
      "disclaimers": [
        "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
      ]
    },
    "mode": "cooling",
    "suctionPressure": 70,
    "dischargePressure": 360,
    "suctionSatTemp": 8.7,
    "dischargeSatTemp": 77.4,
    "superheat": 51.3,
    "subcooling": -17.6,
    "compressionRatio": 5.14,
    "waterDeltaT": 8,
    "superheatStatus": "alert",
    "subcoolingStatus": "alert",
    "compressionRatioStatus": "warning",
    "waterTransferStatus": "ok",
    "recommendations": [
      {
        "id": "refrigeration_charge_pattern_low",
        "domain": "refrigeration",
        "severity": "alert",
        "intent": "diagnostic",
        "summary": "Superheat and subcooling pattern indicates refrigerant-side performance below expected range.",
        "rationale": "Superheat 51.3F, subcooling -17.6F.",
        "notes": [
          "Pattern suggests undercharge or refrigerant-side restriction; confirm with further testing."
        ],
        "requiresShutdown": false
      }
    ],
    "disclaimers": [
      "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
    ]
  },
  "rec": {
    "status": "critical",
    "values": {
      "compressionRatio": 5.14,
      "current": 30,
      "unloadingInfo": {
        "unloadedCount": 0,
        "total": 4
      }
    },
    "flags": {
      "compressionStatus": "ok",
      "currentStatus": "critical",
      "recipHealth": {},
      "disclaimers": [
        "Refrigerant type is not in the standard profile library; analysis is limited to generic compression and current behavior."
      ],
      "refrigerantProfile": "unknown"
    },
    "recommendations": [
      {
        "id": "compressor_recip_current_far_above_rla",
        "domain": "compressor_recip",
        "severity": "critical",
        "intent": "safety",
        "summary": "Measured compressor current far above RLA — risk of overheating.",
        "rationale": "Compressor current indicates severe overload which may rapidly overheat windings.",
        "notes": [
          "Measured current is 30A (300% of RLA)."
        ],
        "requiresShutdown": true
      },
      {
        "id": "refrigerant_profile_unknown",
        "domain": "compressor_recip",
        "severity": "info",
        "intent": "diagnostic",
        "summary": "Refrigerant type not in standard profile library; analysis used generic compressor behavior.",
        "rationale": "Analysis based on generic compression and current behavior when refrigerant profile is unknown.",
        "notes": [
          "Informational: Unknown refrigerant profile detected."
        ],
        "requiresShutdown": false
      }
    ],
    "compressionRatio": 5.14,
    "compressionStatus": "ok",
    "current": 30,
    "currentStatus": "critical",
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 4,
      "status": "ok"
    },
    "disclaimers": [
      "Refrigerant type is not in the standard profile library; analysis is limited to generic compression and current behavior."
    ]
  },
  "scroll": {
    "status": "alert",
    "values": {
      "suctionPressure": 70,
      "dischargePressure": 360,
      "compressionRatio": 5.14,
      "currentDraw": 12
    },
    "flags": {
      "currentStatus": "alert",
      "compressionStatus": "ok",
      "disclaimers": []
    },
    "recommendations": [
      {
        "id": "compressor_scroll_current_issue",
        "domain": "compressor_scroll",
        "severity": "alert",
        "intent": "diagnostic",
        "summary": "Measured current 12 A is outside expected range.",
        "rationale": "Electrical or mechanical loading issue suspected; verify motor and circuit conditions.",
        "notes": [
          "Measured current 12 A"
        ],
        "requiresShutdown": false
      }
    ],
    "compressorType": "scroll",
    "suctionPressure": 70,
    "dischargePressure": 360,
    "compressionRatio": 5.14,
    "compressionStatus": "ok",
    "currentDraw": 12,
    "currentStatus": "alert",
    "disclaimers": []
  },
  "rev": {
    "status": "alert",
    "values": {
      "portTemps": {
        "dischargeInlet": 200,
        "suctionReturn": 65,
        "indoorCoilLine": 190,
        "outdoorCoilLine": 70
      },
      "tempSpread": 135,
      "hotPorts": [
        "discharge",
        "indoor"
      ],
      "coldPorts": [
        "suction",
        "outdoor"
      ],
      "compressionRatio": 5.14
    },
    "flags": {
      "patternMatch": "reversed",
      "solenoidStatus": "ok"
    },
    "requestedMode": "cooling",
    "portTemps": {
      "dischargeInlet": 200,
      "suctionReturn": 65,
      "indoorCoilLine": 190,
      "outdoorCoilLine": 70
    },
    "tempSpread": 135,
    "hotPorts": [
      "discharge",
      "indoor"
    ],
    "coldPorts": [
      "suction",
      "outdoor"
    ],
    "patternMatch": "reversed",
    "compressionRatio": 5.14,
    "solenoidStatus": "ok",
    "recommendations": [
      {
        "id": "reversing_valve_not_switching",
        "domain": "reversing_valve",
        "severity": "alert",
        "intent": "diagnostic",
        "summary": "Requested cooling but valve observed in opposite mode.",
        "rationale": "Valve appears unable to switch to the requested mode; electrical or mechanical causes are possible.",
        "notes": [
          "Pattern analysis indicates valve reversed relative to requested mode."
        ],
        "requiresShutdown": false
      }
    ]
  }
}
```

## Combined Recommendations

```json
[
  {
    "id": "airside_frozen_coil_or_restriction",
    "domain": "airside",
    "severity": "critical",
    "intent": "safety",
    "summary": "Measured ΔT 48 °F indicates severe restriction or possible frozen coil",
    "rationale": "Delta-T is critically outside expected range and suggests severe airflow restriction or coil icing.",
    "notes": [
      "Delta-T indication: 48 °F"
    ],
    "requiresShutdown": true
  },
  {
    "id": "airside.low_airflow.inspect_air_path",
    "domain": "airside",
    "severity": "critical",
    "intent": "diagnostic",
    "summary": "Airflow indicators suggest system airflow is below expected range for cooling operation.",
    "rationale": "Potential contributors include filter and coil condition, blower wheel issues, or duct restrictions; confirm with field measurements.",
    "notes": [
      "Advisory based on airflow and ΔT status; verify with measurements and equipment documentation."
    ]
  },
  {
    "id": "airside.static_pressure.inspect_ductwork",
    "domain": "airside",
    "severity": "critical",
    "intent": "diagnostic",
    "summary": "External static pressure is outside expected range for cooling operation.",
    "rationale": "Duct sizing, balancing dampers, or obstructions can contribute; verify filter loading independently of OEM curves.",
    "notes": [
      "Advisory based on static pressure and airflow flags; confirm with field measurements."
    ],
    "requiresShutdown": false
  },
  {
    "id": "airside.abnormal_deltaT.check_for_icing_or_restriction",
    "domain": "airside",
    "severity": "critical",
    "intent": "diagnostic",
    "summary": "Supply-air ΔT low while airflow is critically low; coil fouling, icing, or airflow restrictions are plausible contributors.",
    "rationale": "When ΔT is low and airflow critically low, refrigeration-side diagnostics are unreliable until airflow/coil issues are resolved.",
    "notes": [
      "Review coil and airflow path before interpreting refrigeration diagnostics."
    ]
  },
  {
    "id": "refrigeration_charge_pattern_low",
    "domain": "refrigeration",
    "severity": "alert",
    "intent": "diagnostic",
    "summary": "Superheat and subcooling pattern indicates refrigerant-side performance below expected range.",
    "rationale": "Superheat 51.3F, subcooling -17.6F.",
    "notes": [
      "Pattern suggests undercharge or refrigerant-side restriction; confirm with further testing."
    ],
    "requiresShutdown": false
  },
  {
    "id": "compressor_recip_current_far_above_rla",
    "domain": "compressor_recip",
    "severity": "critical",
    "intent": "safety",
    "summary": "Measured compressor current far above RLA — risk of overheating.",
    "rationale": "Compressor current indicates severe overload which may rapidly overheat windings.",
    "notes": [
      "Measured current is 30A (300% of RLA)."
    ],
    "requiresShutdown": true
  },
  {
    "id": "refrigerant_profile_unknown",
    "domain": "compressor_recip",
    "severity": "info",
    "intent": "diagnostic",
    "summary": "Refrigerant type not in standard profile library; analysis used generic compressor behavior.",
    "rationale": "Analysis based on generic compression and current behavior when refrigerant profile is unknown.",
    "notes": [
      "Informational: Unknown refrigerant profile detected."
    ],
    "requiresShutdown": false
  },
  {
    "id": "compressor_scroll_current_issue",
    "domain": "compressor_scroll",
    "severity": "alert",
    "intent": "diagnostic",
    "summary": "Measured current 12 A is outside expected range.",
    "rationale": "Electrical or mechanical loading issue suspected; verify motor and circuit conditions.",
    "notes": [
      "Measured current 12 A"
    ],
    "requiresShutdown": false
  },
  {
    "id": "reversing_valve_not_switching",
    "domain": "reversing_valve",
    "severity": "alert",
    "intent": "diagnostic",
    "summary": "Requested cooling but valve observed in opposite mode.",
    "rationale": "Valve appears unable to switch to the requested mode; electrical or mechanical causes are possible.",
    "notes": [
      "Pattern analysis indicates valve reversed relative to requested mode."
    ],
    "requiresShutdown": false
  },
  {
    "id": "hydronic_deltaT_alert",
    "domain": "hydronic",
    "severity": "alert",
    "intent": "diagnostic",
    "summary": "Measured hydronic ΔT outside expected range (8F).",
    "rationale": "Hydronic heat transfer outside expected range; evaluate flow and heat exchanger.",
    "notes": [
      "Measured ΔT 8F"
    ],
    "requiresShutdown": false
  }
]
```

---

## Recip Stress

**Source file:** Recip_Stress_Test_Log_2025-12-01T22-24-36.md

Generated at: 2025-12-01T22:24:36.595Z

This log details 15 stress test scenarios for the reciprocating compressor engine, including input parameters and output results.

## Scenario 1: Normal Operation - OK Status

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 250,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "ok",
  "values": {
    "compressionRatio": 5,
    "current": 10,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "ok",
    "currentStatus": "ok",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_preventive_check",
      "domain": "compressor_recip",
      "severity": "info",
      "intent": "diagnostic",
      "summary": "Compressor within expected range — periodic trend monitoring recommended.",
      "rationale": "Periodic verification of pressures and currents under design load supports trend analysis.",
      "notes": [
        "Compressor currently operating within expected range."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 5,
  "compressionStatus": "ok",
  "current": 10,
  "currentStatus": "ok",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_preventive_check**: Compressor within expected range — periodic trend monitoring recommended.

---

## Scenario 2: Critical Compression Ratio - High (>10)

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 10,
  "dischargePressure": 150,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "critical",
  "values": {
    "compressionRatio": 15,
    "current": 10,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "critical",
    "currentStatus": "ok",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_internal_bypass_suspected",
      "domain": "compressor_recip",
      "severity": "critical",
      "intent": "diagnostic",
      "summary": "Compression ratio critical (15:1) — internal bypass or valve failure suspected.",
      "rationale": "Severe internal bypass prevents proper compression and can overheat the compressor.",
      "notes": [
        "Compression ratio: 15:1"
      ],
      "requiresShutdown": true
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 15,
  "compressionStatus": "critical",
  "current": 10,
  "currentStatus": "ok",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_internal_bypass_suspected**: Compression ratio critical (15:1) — internal bypass or valve failure suspected.

---

## Scenario 3: Critical Compression Ratio - Low (<2.5)

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 100,
  "dischargePressure": 200,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "critical",
  "values": {
    "compressionRatio": 2,
    "current": 10,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "critical",
    "currentStatus": "ok",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_internal_bypass_suspected",
      "domain": "compressor_recip",
      "severity": "critical",
      "intent": "diagnostic",
      "summary": "Compression ratio critical (2:1) — internal bypass or valve failure suspected.",
      "rationale": "Severe internal bypass prevents proper compression and can overheat the compressor.",
      "notes": [
        "Compression ratio: 2:1"
      ],
      "requiresShutdown": true
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 2,
  "compressionStatus": "critical",
  "current": 10,
  "currentStatus": "ok",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_internal_bypass_suspected**: Compression ratio critical (2:1) — internal bypass or valve failure suspected.

---

## Scenario 4: Critical Current - Far Above RLA (>140%)

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 250,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 18,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "critical",
  "values": {
    "compressionRatio": 5,
    "current": 18,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "ok",
    "currentStatus": "critical",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_current_far_above_rla",
      "domain": "compressor_recip",
      "severity": "critical",
      "intent": "safety",
      "summary": "Measured compressor current far above RLA — risk of overheating.",
      "rationale": "Compressor current indicates severe overload which may rapidly overheat windings.",
      "notes": [
        "Measured current is 18A (150% of RLA)."
      ],
      "requiresShutdown": true
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 5,
  "compressionStatus": "ok",
  "current": 18,
  "currentStatus": "critical",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_current_far_above_rla**: Measured compressor current far above RLA — risk of overheating.

---

## Scenario 5: Warning Current - Low (<30%)

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 250,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 3,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "warning",
  "values": {
    "compressionRatio": 5,
    "current": 3,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "ok",
    "currentStatus": "warning",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_current_low_warning",
      "domain": "compressor_recip",
      "severity": "advisory",
      "intent": "diagnostic",
      "summary": "Slight current deviation detected; monitor for trends.",
      "rationale": "Compressor current near lower/higher thresholds — trend monitoring recommended.",
      "notes": [
        "Current status flagged as warning."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 5,
  "compressionStatus": "ok",
  "current": 3,
  "currentStatus": "warning",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_current_low_warning**: Slight current deviation detected; monitor for trends.

---

## Scenario 6: Alert Compression Ratio (3.0-6.5)

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 300,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "ok",
  "values": {
    "compressionRatio": 6,
    "current": 10,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "ok",
    "currentStatus": "ok",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_preventive_check",
      "domain": "compressor_recip",
      "severity": "info",
      "intent": "diagnostic",
      "summary": "Compressor within expected range — periodic trend monitoring recommended.",
      "rationale": "Periodic verification of pressures and currents under design load supports trend analysis.",
      "notes": [
        "Compressor currently operating within expected range."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 6,
  "compressionStatus": "ok",
  "current": 10,
  "currentStatus": "ok",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_preventive_check**: Compressor within expected range — periodic trend monitoring recommended.

---

## Scenario 7: Alert Current (115-140%)

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 250,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 14,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "alert",
  "values": {
    "compressionRatio": 5,
    "current": 14,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "ok",
    "currentStatus": "alert",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_current_high_alert",
      "domain": "compressor_recip",
      "severity": "alert",
      "intent": "diagnostic",
      "summary": "Compressor current elevated — possible mechanical or electrical issues.",
      "rationale": "Elevated current detected; verify motor, load, and electrical supply.",
      "notes": [
        "Current status flagged as alert."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 5,
  "compressionStatus": "ok",
  "current": 14,
  "currentStatus": "alert",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_current_high_alert**: Compressor current elevated — possible mechanical or electrical issues.

---

## Scenario 8: Unloading Alert - Negative Unloaded

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 250,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": -1,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "alert",
  "values": {
    "compressionRatio": 5,
    "current": 10,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": -1,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "ok",
    "currentStatus": "ok",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_unloading_abnormal_alert",
      "domain": "compressor_recip",
      "severity": "alert",
      "intent": "diagnostic",
      "summary": "Cylinder unloading status indicates abnormal operation.",
      "rationale": "Unloading status flagged as alert; inspect unloading mechanism and control settings.",
      "notes": [
        "Unloading status flagged as alert."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 5,
  "compressionStatus": "ok",
  "current": 10,
  "currentStatus": "ok",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": -1,
    "total": 6,
    "status": "alert"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_unloading_abnormal_alert**: Cylinder unloading status indicates abnormal operation.

---

## Scenario 9: Unloading Warning - Partial Unload

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 250,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 2,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "warning",
  "values": {
    "compressionRatio": 5,
    "current": 10,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 2,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "ok",
    "currentStatus": "ok",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_unloading_partial_warning",
      "domain": "compressor_recip",
      "severity": "advisory",
      "intent": "diagnostic",
      "summary": "Partial cylinder unloading detected; verify configuration and settings.",
      "rationale": "Unloading status flagged as warning; check configuration and cylinder unload control.",
      "notes": [
        "Unloading status flagged as warning."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 5,
  "compressionStatus": "ok",
  "current": 10,
  "currentStatus": "ok",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 2,
    "total": 6,
    "status": "warning"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_unloading_partial_warning**: Partial cylinder unloading detected; verify configuration and settings.

---

## Scenario 10: Health Flags - Reed Valve Suspected (Hissing + Bad Ratio)

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 350,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {
    "hissing": true
  }
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "alert",
  "values": {
    "compressionRatio": 7,
    "current": 10,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "alert",
    "currentStatus": "ok",
    "recipHealth": {
      "reedValveSuspected": true
    },
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_reed_valve_issue_suspected",
      "domain": "compressor_recip",
      "severity": "alert",
      "intent": "diagnostic",
      "summary": "Reed valve issue suspected based on compression and sound characteristics.",
      "rationale": "Compression pattern and sound characteristics (hissing) align with reed valve problems.",
      "notes": [
        "Reed valve suspected."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 7,
  "compressionStatus": "alert",
  "current": 10,
  "currentStatus": "ok",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_reed_valve_issue_suspected**: Reed valve issue suspected based on compression and sound characteristics.

---

## Scenario 11: Health Flags - Piston Ring Wear Suspected (Knocking + Bad Ratio)

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 350,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {
    "knocking": true
  }
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "alert",
  "values": {
    "compressionRatio": 7,
    "current": 10,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "alert",
    "currentStatus": "ok",
    "recipHealth": {
      "pistonRingWearSuspected": true
    },
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_piston_ring_wear_suspected",
      "domain": "compressor_recip",
      "severity": "alert",
      "intent": "diagnostic",
      "summary": "Piston ring wear suspected based on compression and sound characteristics.",
      "rationale": "Compression pattern and knocking sound suggest piston ring wear.",
      "notes": [
        "Piston ring wear suspected."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 7,
  "compressionStatus": "alert",
  "current": 10,
  "currentStatus": "ok",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_piston_ring_wear_suspected**: Piston ring wear suspected based on compression and sound characteristics.

---

## Scenario 12: Combined Critical - Compression + Current

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 10,
  "dischargePressure": 150,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 18,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "critical",
  "values": {
    "compressionRatio": 15,
    "current": 18,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "critical",
    "currentStatus": "critical",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_internal_bypass_suspected",
      "domain": "compressor_recip",
      "severity": "critical",
      "intent": "diagnostic",
      "summary": "Compression ratio critical (15:1) — internal bypass or valve failure suspected.",
      "rationale": "Severe internal bypass prevents proper compression and can overheat the compressor.",
      "notes": [
        "Compression ratio: 15:1"
      ],
      "requiresShutdown": true
    },
    {
      "id": "compressor_recip_current_far_above_rla",
      "domain": "compressor_recip",
      "severity": "critical",
      "intent": "safety",
      "summary": "Measured compressor current far above RLA — risk of overheating.",
      "rationale": "Compressor current indicates severe overload which may rapidly overheat windings.",
      "notes": [
        "Measured current is 18A (150% of RLA)."
      ],
      "requiresShutdown": true
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 15,
  "compressionStatus": "critical",
  "current": 18,
  "currentStatus": "critical",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (2)
- **compressor_recip_internal_bypass_suspected**: Compression ratio critical (15:1) — internal bypass or valve failure suspected.
- **compressor_recip_current_far_above_rla**: Measured compressor current far above RLA — risk of overheating.

---

## Scenario 13: Custom Refrigerant Disclaimer

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 250,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerant": "OTHER"
  }
}
```

### Output Result
```json
{
  "status": "ok",
  "values": {
    "compressionRatio": 5,
    "current": 10,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "ok",
    "currentStatus": "ok",
    "recipHealth": {},
    "disclaimers": [
      "Refrigerant type is not in the standard profile library; analysis is limited to generic compression and current behavior."
    ],
    "refrigerantProfile": "unknown"
  },
  "recommendations": [
    {
      "id": "compressor_recip_preventive_check",
      "domain": "compressor_recip",
      "severity": "info",
      "intent": "diagnostic",
      "summary": "Compressor within expected range — periodic trend monitoring recommended.",
      "rationale": "Periodic verification of pressures and currents under design load supports trend analysis.",
      "notes": [
        "Compressor currently operating within expected range."
      ],
      "requiresShutdown": false
    },
    {
      "id": "refrigerant_profile_unknown",
      "domain": "compressor_recip",
      "severity": "info",
      "intent": "diagnostic",
      "summary": "Refrigerant type not in standard profile library; analysis used generic compressor behavior.",
      "rationale": "Analysis based on generic compression and current behavior when refrigerant profile is unknown.",
      "notes": [
        "Informational: Unknown refrigerant profile detected."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 5,
  "compressionStatus": "ok",
  "current": 10,
  "currentStatus": "ok",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": [
    "Refrigerant type is not in the standard profile library; analysis is limited to generic compression and current behavior."
  ]
}
```

### Recommendations Generated (2)
- **compressor_recip_preventive_check**: Compressor within expected range — periodic trend monitoring recommended.
- **refrigerant_profile_unknown**: Refrigerant type not in standard profile library; analysis used generic compressor behavior.

---

## Scenario 14: No RLA in Profile

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 250,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": true,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {},
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "ok",
  "values": {
    "compressionRatio": 5,
    "current": 10,
    "running": true,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "ok",
    "currentStatus": "ok",
    "recipHealth": {},
    "disclaimers": [
      "No RLA in profile; current analysis is limited to absolute value, not % of RLA."
    ],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_preventive_check",
      "domain": "compressor_recip",
      "severity": "info",
      "intent": "diagnostic",
      "summary": "Compressor within expected range — periodic trend monitoring recommended.",
      "rationale": "Periodic verification of pressures and currents under design load supports trend analysis.",
      "notes": [
        "Compressor currently operating within expected range."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 5,
  "compressionStatus": "ok",
  "current": 10,
  "currentStatus": "ok",
  "running": true,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": [
    "No RLA in profile; current analysis is limited to absolute value, not % of RLA."
  ]
}
```

### Recommendations Generated (1)
- **compressor_recip_preventive_check**: Compressor within expected range — periodic trend monitoring recommended.

---

## Scenario 15: Not Running Warning

### Input Measurements
```json
{
  "compressorId": "recip1",
  "suctionPressure": 50,
  "dischargePressure": 250,
  "suctionTemp": 45,
  "dischargeTemp": 120,
  "compressorCurrent": 10,
  "isRunning": false,
  "totalCylinders": 6,
  "unloadedCylinders": 0,
  "soundCharacteristics": {}
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "rla": 12
  },
  "refrigeration": {
    "refrigerantType": "R410A"
  }
}
```

### Output Result
```json
{
  "status": "ok",
  "values": {
    "compressionRatio": 5,
    "current": 10,
    "running": false,
    "unloadingInfo": {
      "unloadedCount": 0,
      "total": 6
    }
  },
  "flags": {
    "compressionStatus": "ok",
    "currentStatus": "ok",
    "recipHealth": {},
    "disclaimers": [],
    "refrigerantProfile": "standard"
  },
  "recommendations": [
    {
      "id": "compressor_recip_preventive_check",
      "domain": "compressor_recip",
      "severity": "info",
      "intent": "diagnostic",
      "summary": "Compressor within expected range — periodic trend monitoring recommended.",
      "rationale": "Periodic verification of pressures and currents under design load supports trend analysis.",
      "notes": [
        "Compressor currently operating within expected range."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorId": "recip1",
  "compressionRatio": 5,
  "compressionStatus": "ok",
  "current": 10,
  "currentStatus": "ok",
  "running": false,
  "unloadingInfo": {
    "unloadedCount": 0,
    "total": 6,
    "status": "ok"
  },
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_recip_preventive_check**: Compressor within expected range — periodic trend monitoring recommended.

---



---

## Recommendation Gaps

**Source file:** Recommendation_Gaps_2025-12-01T22-24-36.md

Scanned at: 2025-12-01T22:24:36.911Z

{
  "scannedAt": "2025-12-01T22:24:36.911Z",
  "findings": [
    {
      "engine": "airside",
      "scenario": "frozen_coil_like",
      "flags": {
        "mode": "cooling",
        "deltaTStatus": "critical",
        "deltaTSource": "industry",
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "critical",
        "staticPressureStatus": "critical",
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      },
      "recCount": 4,
      "recommendations": [
        {
          "id": "airside_frozen_coil_or_restriction",
          "domain": "airside",
          "severity": "critical",
          "intent": "safety",
          "summary": "Measured ΔT 45 °F indicates severe restriction or possible frozen coil",
          "rationale": "Delta-T is critically outside expected range and suggests severe airflow restriction or coil icing.",
          "notes": [
            "Delta-T indication: 45 °F"
          ],
          "requiresShutdown": true
        },
        {
          "id": "airside.low_airflow.inspect_air_path",
          "domain": "airside",
          "severity": "critical",
          "intent": "diagnostic",
          "summary": "Airflow indicators suggest system airflow is below expected range for cooling operation.",
          "rationale": "Potential contributors include filter and coil condition, blower wheel issues, or duct restrictions; confirm with field measurements.",
          "notes": [
            "Advisory based on airflow and ΔT status; verify with measurements and equipment documentation."
          ]
        },
        {
          "id": "airside.static_pressure.inspect_ductwork",
          "domain": "airside",
          "severity": "critical",
          "intent": "diagnostic",
          "summary": "External static pressure is outside expected range for cooling operation.",
          "rationale": "Duct sizing, balancing dampers, or obstructions can contribute; verify filter loading independently of OEM curves.",
          "notes": [
            "Advisory based on static pressure and airflow flags; confirm with field measurements."
          ],
          "requiresShutdown": false
        },
        {
          "id": "airside.abnormal_deltaT.check_for_icing_or_restriction",
          "domain": "airside",
          "severity": "critical",
          "intent": "diagnostic",
          "summary": "Supply-air ΔT low while airflow is critically low; coil fouling, icing, or airflow restrictions are plausible contributors.",
          "rationale": "When ΔT is low and airflow critically low, refrigeration-side diagnostics are unreliable until airflow/coil issues are resolved.",
          "notes": [
            "Review coil and airflow path before interpreting refrigeration diagnostics."
          ]
        }
      ],
      "gaps": []
    },
    {
      "engine": "airside",
      "scenario": "very_high_airflow",
      "flags": {
        "mode": "cooling",
        "deltaTStatus": "warning",
        "deltaTSource": "industry",
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "alert",
        "staticPressureStatus": "ok",
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      },
      "recCount": 3,
      "recommendations": [
        {
          "id": "airside_airflow_below_design",
          "domain": "airside",
          "severity": "alert",
          "intent": "diagnostic",
          "summary": "Measured or calculated airflow below equipment design (2400 CFM).",
          "rationale": "Airflow below design reduces system capacity and may indicate filter, register, or blower issues.",
          "notes": [
            "Design CFM: 2400"
          ],
          "requiresShutdown": false
        },
        {
          "id": "airside.low_airflow.inspect_air_path",
          "domain": "airside",
          "severity": "advisory",
          "intent": "diagnostic",
          "summary": "Airflow indicators suggest system airflow is below expected range for cooling operation.",
          "rationale": "Potential contributors include filter and coil condition, blower wheel issues, or duct restrictions; confirm with field measurements.",
          "notes": [
            "Advisory based on airflow and ΔT status; verify with measurements and equipment documentation."
          ]
        },
        {
          "id": "airside.high_airflow.low_deltaT_review",
          "domain": "airside",
          "severity": "advisory",
          "intent": "diagnostic",
          "summary": "Airflow above expected range but ΔT is degraded; verify fan, ducts, and measurement technique before drawing refrigerant-side conclusions.",
          "rationale": "High airflow can reduce ΔT; be cautious when interpreting refrigerant diagnostics based on ΔT in this situation.",
          "notes": [
            "Advisory — do not infer refrigerant charge solely from this recommendation."
          ]
        }
      ],
      "gaps": []
    },
    {
      "engine": "airside",
      "scenario": "low_delta_but_low_cfm",
      "flags": {
        "mode": "cooling",
        "deltaTStatus": "warning",
        "deltaTSource": "industry",
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "critical",
        "staticPressureStatus": "ok",
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      },
      "recCount": 2,
      "recommendations": [
        {
          "id": "airside.low_airflow.inspect_air_path",
          "domain": "airside",
          "severity": "critical",
          "intent": "diagnostic",
          "summary": "Airflow indicators suggest system airflow is below expected range for cooling operation.",
          "rationale": "Potential contributors include filter and coil condition, blower wheel issues, or duct restrictions; confirm with field measurements.",
          "notes": [
            "Advisory based on airflow and ΔT status; verify with measurements and equipment documentation."
          ]
        },
        {
          "id": "airside.abnormal_deltaT.check_for_icing_or_restriction",
          "domain": "airside",
          "severity": "advisory",
          "intent": "diagnostic",
          "summary": "Supply-air ΔT low while airflow is critically low; coil fouling, icing, or airflow restrictions are plausible contributors.",
          "rationale": "When ΔT is low and airflow critically low, refrigeration-side diagnostics are unreliable until airflow/coil issues are resolved.",
          "notes": [
            "Review coil and airflow path before interpreting refrigeration diagnostics."
          ]
        }
      ],
      "gaps": []
    },
    {
      "engine": "refrigeration",
      "scenario": "very_low_superheat",
      "flags": {
        "superheatStatus": "ok",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "refrigerantProfile": "standard",
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      },
      "recCount": 2,
      "recommendations": [
        {
          "id": "refrigeration_charge_pattern_low",
          "domain": "refrigeration",
          "severity": "alert",
          "intent": "diagnostic",
          "summary": "Superheat and subcooling pattern indicates refrigerant-side performance below expected range.",
          "rationale": "Superheat 14.1F, subcooling -47.7F.",
          "notes": [
            "Pattern suggests undercharge or refrigerant-side restriction; confirm with further testing."
          ],
          "requiresShutdown": false
        },
        {
          "id": "refrigeration_water_transfer_abnormal",
          "domain": "refrigeration",
          "severity": "alert",
          "intent": "diagnostic",
          "summary": "Water ΔT 8.0F indicates reduced heat transfer on the fluid side.",
          "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
          "notes": [
            "Water ΔT: 8.0F."
          ],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    },
    {
      "engine": "refrigeration",
      "scenario": "overcharge_like",
      "flags": {
        "superheatStatus": "alert",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "refrigerantProfile": "standard",
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      },
      "recCount": 2,
      "recommendations": [
        {
          "id": "refrigeration_subcooling_elevated_pattern",
          "domain": "refrigeration",
          "severity": "alert",
          "intent": "diagnostic",
          "summary": "Superheat low and subcooling elevated; refrigerant-side loading appears high.",
          "rationale": "Superheat 7.2F, subcooling 26.4F.",
          "notes": [
            "Pattern indicates elevated refrigerant-side loading; verify condenser and liquid line conditions."
          ],
          "requiresShutdown": false
        },
        {
          "id": "refrigeration_water_transfer_abnormal",
          "domain": "refrigeration",
          "severity": "alert",
          "intent": "diagnostic",
          "summary": "Water ΔT 8.0F indicates reduced heat transfer on the fluid side.",
          "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
          "notes": [
            "Water ΔT: 8.0F."
          ],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    },
    {
      "engine": "refrigeration",
      "scenario": "high_water_dt",
      "flags": {
        "superheatStatus": "alert",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "refrigerantProfile": "standard",
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      },
      "recCount": 2,
      "recommendations": [
        {
          "id": "refrigeration_charge_pattern_low",
          "domain": "refrigeration",
          "severity": "alert",
          "intent": "diagnostic",
          "summary": "Superheat and subcooling pattern indicates refrigerant-side performance below expected range.",
          "rationale": "Superheat 69.1F, subcooling -47.7F.",
          "notes": [
            "Pattern suggests undercharge or refrigerant-side restriction; confirm with further testing."
          ],
          "requiresShutdown": false
        },
        {
          "id": "refrigeration_water_transfer_abnormal",
          "domain": "refrigeration",
          "severity": "alert",
          "intent": "diagnostic",
          "summary": "Water ΔT 40.0F indicates reduced heat transfer on the fluid side.",
          "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
          "notes": [
            "Water ΔT: 40.0F."
          ],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    },
    {
      "engine": "hydronic",
      "scenario": "very_low_dt",
      "flags": {
        "deltaTStatus": "critical",
        "flowStatus": "ok",
        "disclaimers": [
          "Hydronic expected ΔT values are industry defaults; provide profile.expectedDeltaT to tune performance checks."
        ]
      },
      "recCount": 1,
      "recommendations": [
        {
          "id": "hydronic_deltaT_critical",
          "domain": "hydronic",
          "severity": "critical",
          "intent": "safety",
          "summary": "Hydronic ΔT critically low (1F) — heat transfer severely reduced.",
          "rationale": "Hydronic heat transfer ΔT critically low; verify flow and heat exchanger condition as operation may be unsafe for continued loading.",
          "notes": [
            "Measured ΔT 1F"
          ],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    },
    {
      "engine": "hydronic",
      "scenario": "high_dt",
      "flags": {
        "deltaTStatus": "critical",
        "flowStatus": "ok",
        "disclaimers": [
          "Hydronic expected ΔT values are industry defaults; provide profile.expectedDeltaT to tune performance checks."
        ]
      },
      "recCount": 1,
      "recommendations": [
        {
          "id": "hydronic_deltaT_critical",
          "domain": "hydronic",
          "severity": "critical",
          "intent": "safety",
          "summary": "Hydronic ΔT critically low (30F) — heat transfer severely reduced.",
          "rationale": "Hydronic heat transfer ΔT critically low; verify flow and heat exchanger condition as operation may be unsafe for continued loading.",
          "notes": [
            "Measured ΔT 30F"
          ],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    },
    {
      "engine": "hydronic",
      "scenario": "missing_measurements",
      "flags": {
        "deltaTStatus": "unknown",
        "flowStatus": "unknown",
        "disclaimers": [
          "Hydronic expected ΔT values are industry defaults; provide profile.expectedDeltaT to tune performance checks."
        ]
      },
      "recCount": 1,
      "recommendations": [
        {
          "id": "hydronic_data_quality_issue",
          "domain": "hydronic",
          "severity": "advisory",
          "intent": "diagnostic",
          "summary": "Hydronic measurement inputs are incomplete or unavailable and prevent accurate diagnosis.",
          "rationale": "Missing ΔT inputs",
          "notes": [
            "Provide entering/leaving temperatures and flow for accurate analysis."
          ],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    },
    {
      "engine": "condenser_approach",
      "scenario": "missing_pressure",
      "flags": {
        "approachStatus": "unknown",
        "subcoolingStatus": "unknown",
        "refrigerantProfile": "standard"
      },
      "recCount": 1,
      "recommendations": [
        {
          "id": "condenser_preventive_trend",
          "domain": "condenser_approach",
          "severity": "info",
          "intent": "diagnostic",
          "summary": "Condenser approach and subcooling within expected ranges; continue monitoring trends.",
          "rationale": "Condenser performing within expected range; periodic verification recommended.",
          "notes": [],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    },
    {
      "engine": "condenser_approach",
      "scenario": "bad_approach",
      "flags": {
        "approachStatus": "critical",
        "subcoolingStatus": "critical",
        "refrigerantProfile": "standard"
      },
      "recCount": 2,
      "recommendations": [
        {
          "id": "condenser_approach_critical",
          "domain": "condenser_approach",
          "severity": "critical",
          "intent": "safety",
          "summary": "Condenser approach severely low — heat rejection critically reduced.",
          "rationale": "Condenser approach below acceptable thresholds indicates severe restriction or poor heat rejection.",
          "notes": [],
          "requiresShutdown": true
        },
        {
          "id": "condenser_subcooling_critical",
          "domain": "condenser_approach",
          "severity": "critical",
          "intent": "safety",
          "summary": "Liquid subcooling severely low — possible poor condenser performance or undercharge.",
          "rationale": "Subcooling below safe thresholds may indicate condition that risks compressor operation.",
          "notes": [],
          "requiresShutdown": true
        }
      ],
      "gaps": []
    },
    {
      "engine": "compressor_recip",
      "scenario": "low_compression_ratio",
      "flags": {
        "compressionStatus": "critical",
        "currentStatus": "ok",
        "recipHealth": {},
        "disclaimers": [
          "Refrigerant type is not in the standard profile library; analysis is limited to generic compression and current behavior."
        ],
        "refrigerantProfile": "unknown"
      },
      "recCount": 2,
      "recommendations": [
        {
          "id": "compressor_recip_internal_bypass_suspected",
          "domain": "compressor_recip",
          "severity": "critical",
          "intent": "diagnostic",
          "summary": "Compression ratio critical (1.5:1) — internal bypass or valve failure suspected.",
          "rationale": "Severe internal bypass prevents proper compression and can overheat the compressor.",
          "notes": [
            "Compression ratio: 1.5:1"
          ],
          "requiresShutdown": true
        },
        {
          "id": "refrigerant_profile_unknown",
          "domain": "compressor_recip",
          "severity": "info",
          "intent": "diagnostic",
          "summary": "Refrigerant type not in standard profile library; analysis used generic compressor behavior.",
          "rationale": "Analysis based on generic compression and current behavior when refrigerant profile is unknown.",
          "notes": [
            "Informational: Unknown refrigerant profile detected."
          ],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    },
    {
      "engine": "compressor_recip",
      "scenario": "very_high_current",
      "flags": {
        "compressionStatus": "ok",
        "currentStatus": "critical",
        "recipHealth": {},
        "disclaimers": [
          "Refrigerant type is not in the standard profile library; analysis is limited to generic compression and current behavior."
        ],
        "refrigerantProfile": "unknown"
      },
      "recCount": 2,
      "recommendations": [
        {
          "id": "compressor_recip_current_far_above_rla",
          "domain": "compressor_recip",
          "severity": "critical",
          "intent": "safety",
          "summary": "Measured compressor current far above RLA — risk of overheating.",
          "rationale": "Compressor current indicates severe overload which may rapidly overheat windings.",
          "notes": [
            "Measured current is 80A (160% of RLA)."
          ],
          "requiresShutdown": true
        },
        {
          "id": "refrigerant_profile_unknown",
          "domain": "compressor_recip",
          "severity": "info",
          "intent": "diagnostic",
          "summary": "Refrigerant type not in standard profile library; analysis used generic compressor behavior.",
          "rationale": "Analysis based on generic compression and current behavior when refrigerant profile is unknown.",
          "notes": [
            "Informational: Unknown refrigerant profile detected."
          ],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    },
    {
      "engine": "compressor_scroll",
      "scenario": "bad_compression",
      "flags": {
        "currentStatus": "ok",
        "compressionStatus": "alert",
        "disclaimers": []
      },
      "recCount": 1,
      "recommendations": [
        {
          "id": "compressor_scroll_compression_ratio_issue",
          "domain": "compressor_scroll",
          "severity": "alert",
          "intent": "diagnostic",
          "summary": "Compression ratio 13:1 is outside expected range.",
          "rationale": "Compression ratio flagged outside expected range; further diagnostic evaluation is recommended.",
          "notes": [
            "Compression ratio: 13:1"
          ],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    },
    {
      "engine": "compressor_scroll",
      "scenario": "high_current",
      "flags": {
        "currentStatus": "critical",
        "compressionStatus": "ok",
        "disclaimers": []
      },
      "recCount": 1,
      "recommendations": [
        {
          "id": "compressor_scroll_current_issue",
          "domain": "compressor_scroll",
          "severity": "critical",
          "intent": "diagnostic",
          "summary": "Measured current 14 A is outside expected range.",
          "rationale": "Electrical or mechanical loading issue suspected; verify motor and circuit conditions.",
          "notes": [
            "Measured current 14 A"
          ],
          "requiresShutdown": true
        }
      ],
      "gaps": []
    },
    {
      "engine": "reversing_valve",
      "scenario": "stuck_valve",
      "flags": {
        "patternMatch": "stuck",
        "solenoidStatus": "ok"
      },
      "recCount": 1,
      "recommendations": [
        {
          "id": "reversing_valve_stuck_mid_position",
          "domain": "reversing_valve",
          "severity": "critical",
          "intent": "safety",
          "summary": "Valve ports show similar temperature and pressures — valve likely stuck mid-position causing mixing and elevated risk to compressor.",
          "rationale": "Mid-position valve permits high-pressure gas to bypass into suction causing compressor stress and efficiency loss.",
          "notes": [
            "Pattern analysis indicates stuck-mid-position."
          ],
          "requiresShutdown": true
        }
      ],
      "gaps": []
    },
    {
      "engine": "reversing_valve",
      "scenario": "reversed_pattern",
      "flags": {
        "patternMatch": "reversed",
        "solenoidStatus": "ok"
      },
      "recCount": 1,
      "recommendations": [
        {
          "id": "reversing_valve_not_switching",
          "domain": "reversing_valve",
          "severity": "alert",
          "intent": "diagnostic",
          "summary": "Requested cooling but valve observed in opposite mode.",
          "rationale": "Valve appears unable to switch to the requested mode; electrical or mechanical causes are possible.",
          "notes": [
            "Pattern analysis indicates valve reversed relative to requested mode."
          ],
          "requiresShutdown": false
        }
      ],
      "gaps": []
    }
  ]
}

---

## Scroll Stress

**Source file:** Scroll_Stress_Test_Log_2025-12-01T22-24-37.md

Generated at: 2025-12-01T22:24:37.160Z

This log details 5 stress test scenarios for the scroll compressor engine, including input parameters and output results.

## Scenario 1: Normal Operation - OK Status

### Input Measurements
```json
{
  "mode": "cooling",
  "suctionPressure": 110,
  "dischargePressure": 400,
  "suctionTemp": 60,
  "dischargeTemp": 180,
  "runningCurrent": 8
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "type": "scroll",
    "rla": 10
  },
  "refrigeration": {
    "refrigerantType": "R-410A"
  }
}
```

### Output Result
```json
{
  "status": "ok",
  "values": {
    "suctionPressure": 110,
    "dischargePressure": 400,
    "compressionRatio": 3.64,
    "currentDraw": 8
  },
  "flags": {
    "currentStatus": "ok",
    "compressionStatus": "ok",
    "disclaimers": []
  },
  "recommendations": [
    {
      "id": "compressor_scroll_no_immediate_action",
      "domain": "compressor_scroll",
      "severity": "info",
      "intent": "diagnostic",
      "summary": "Compressor within normal parameters — continue routine monitoring.",
      "rationale": "No abnormal compressor compression or current detected.",
      "notes": [
        "Compressor within normal parameters."
      ],
      "requiresShutdown": false
    }
  ],
  "compressorType": "scroll",
  "suctionPressure": 110,
  "dischargePressure": 400,
  "compressionRatio": 3.64,
  "compressionStatus": "ok",
  "currentDraw": 8,
  "currentStatus": "ok",
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_scroll_no_immediate_action**: Compressor within normal parameters — continue routine monitoring.

---

## Scenario 2: High Current - Above RLA

### Input Measurements
```json
{
  "mode": "cooling",
  "suctionPressure": 110,
  "dischargePressure": 400,
  "suctionTemp": 60,
  "dischargeTemp": 180,
  "runningCurrent": 14
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "type": "scroll",
    "rla": 10
  },
  "refrigeration": {
    "refrigerantType": "R-410A"
  }
}
```

### Output Result
```json
{
  "status": "critical",
  "values": {
    "suctionPressure": 110,
    "dischargePressure": 400,
    "compressionRatio": 3.64,
    "currentDraw": 14
  },
  "flags": {
    "currentStatus": "critical",
    "compressionStatus": "ok",
    "disclaimers": []
  },
  "recommendations": [
    {
      "id": "compressor_scroll_current_issue",
      "domain": "compressor_scroll",
      "severity": "critical",
      "intent": "diagnostic",
      "summary": "Measured current 14 A is outside expected range.",
      "rationale": "Electrical or mechanical loading issue suspected; verify motor and circuit conditions.",
      "notes": [
        "Measured current 14 A"
      ],
      "requiresShutdown": true
    }
  ],
  "compressorType": "scroll",
  "suctionPressure": 110,
  "dischargePressure": 400,
  "compressionRatio": 3.64,
  "compressionStatus": "ok",
  "currentDraw": 14,
  "currentStatus": "critical",
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_scroll_current_issue**: Measured current 14 A is outside expected range.

---

## Scenario 3: Bad Compression - High Ratio

### Input Measurements
```json
{
  "mode": "cooling",
  "suctionPressure": 40,
  "dischargePressure": 520,
  "suctionTemp": 60,
  "dischargeTemp": 300,
  "runningCurrent": 9
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "type": "scroll",
    "rla": 10
  },
  "refrigeration": {
    "refrigerantType": "R-410A"
  }
}
```

### Output Result
```json
{
  "status": "alert",
  "values": {
    "suctionPressure": 40,
    "dischargePressure": 520,
    "compressionRatio": 13,
    "currentDraw": 9
  },
  "flags": {
    "currentStatus": "ok",
    "compressionStatus": "alert",
    "disclaimers": []
  },
  "recommendations": [
    {
      "id": "compressor_scroll_compression_ratio_issue",
      "domain": "compressor_scroll",
      "severity": "alert",
      "intent": "diagnostic",
      "summary": "Compression ratio 13:1 is outside expected range.",
      "rationale": "Compression ratio flagged outside expected range; further diagnostic evaluation is recommended.",
      "notes": [
        "Compression ratio: 13:1"
      ],
      "requiresShutdown": false
    }
  ],
  "compressorType": "scroll",
  "suctionPressure": 40,
  "dischargePressure": 520,
  "compressionRatio": 13,
  "compressionStatus": "alert",
  "currentDraw": 9,
  "currentStatus": "ok",
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_scroll_compression_ratio_issue**: Compression ratio 13:1 is outside expected range.

---

## Scenario 4: Low Current - Below Expected Range

### Input Measurements
```json
{
  "mode": "cooling",
  "suctionPressure": 110,
  "dischargePressure": 400,
  "suctionTemp": 60,
  "dischargeTemp": 180,
  "runningCurrent": 3
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "type": "scroll",
    "rla": 10
  },
  "refrigeration": {
    "refrigerantType": "R-410A"
  }
}
```

### Output Result
```json
{
  "status": "warning",
  "values": {
    "suctionPressure": 110,
    "dischargePressure": 400,
    "compressionRatio": 3.64,
    "currentDraw": 3
  },
  "flags": {
    "currentStatus": "warning",
    "compressionStatus": "ok",
    "disclaimers": []
  },
  "recommendations": [
    {
      "id": "compressor_scroll_current_issue",
      "domain": "compressor_scroll",
      "severity": "alert",
      "intent": "diagnostic",
      "summary": "Measured current 3 A is outside expected range.",
      "rationale": "Electrical or mechanical loading issue suspected; verify motor and circuit conditions.",
      "notes": [
        "Measured current 3 A"
      ],
      "requiresShutdown": false
    }
  ],
  "compressorType": "scroll",
  "suctionPressure": 110,
  "dischargePressure": 400,
  "compressionRatio": 3.64,
  "compressionStatus": "ok",
  "currentDraw": 3,
  "currentStatus": "warning",
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **compressor_scroll_current_issue**: Measured current 3 A is outside expected range.

---

## Scenario 5: Combined Critical - High Ratio and High Current

### Input Measurements
```json
{
  "mode": "cooling",
  "suctionPressure": 40,
  "dischargePressure": 520,
  "suctionTemp": 60,
  "dischargeTemp": 300,
  "runningCurrent": 16
}
```

### Input Profile (Relevant Parts)
```json
{
  "compressor": {
    "type": "scroll",
    "rla": 10
  },
  "refrigeration": {
    "refrigerantType": "R-410A"
  }
}
```

### Output Result
```json
{
  "status": "critical",
  "values": {
    "suctionPressure": 40,
    "dischargePressure": 520,
    "compressionRatio": 13,
    "currentDraw": 16
  },
  "flags": {
    "currentStatus": "critical",
    "compressionStatus": "alert",
    "disclaimers": []
  },
  "recommendations": [
    {
      "id": "compressor_scroll_compression_ratio_issue",
      "domain": "compressor_scroll",
      "severity": "alert",
      "intent": "diagnostic",
      "summary": "Compression ratio 13:1 is outside expected range.",
      "rationale": "Compression ratio flagged outside expected range; further diagnostic evaluation is recommended.",
      "notes": [
        "Compression ratio: 13:1"
      ],
      "requiresShutdown": false
    },
    {
      "id": "compressor_scroll_current_issue",
      "domain": "compressor_scroll",
      "severity": "critical",
      "intent": "diagnostic",
      "summary": "Measured current 16 A is outside expected range.",
      "rationale": "Electrical or mechanical loading issue suspected; verify motor and circuit conditions.",
      "notes": [
        "Measured current 16 A"
      ],
      "requiresShutdown": true
    }
  ],
  "compressorType": "scroll",
  "suctionPressure": 40,
  "dischargePressure": 520,
  "compressionRatio": 13,
  "compressionStatus": "alert",
  "currentDraw": 16,
  "currentStatus": "critical",
  "disclaimers": []
}
```

### Recommendations Generated (2)
- **compressor_scroll_compression_ratio_issue**: Compression ratio 13:1 is outside expected range.
- **compressor_scroll_current_issue**: Measured current 16 A is outside expected range.

---



---

## Summary

| Category | File | Timestamp |
|----------|------|----------|
| Combined Profile | Combined_Profile_Stress_Test_Audit_2025-12-01T22-24-36.md | 2025-12-02T03:24:36.924Z |
| Recip Stress | Recip_Stress_Test_Log_2025-12-01T22-24-36.md | 2025-12-02T03:24:36.609Z |
| Recommendation Gaps | Recommendation_Gaps_2025-12-01T22-24-36.md | 2025-12-02T03:24:36.914Z |
| Scroll Stress | Scroll_Stress_Test_Log_2025-12-01T22-24-37.md | 2025-12-02T03:24:37.163Z |
