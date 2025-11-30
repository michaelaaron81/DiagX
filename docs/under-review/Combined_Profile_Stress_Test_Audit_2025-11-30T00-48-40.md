# Combined Profile Stress Test — 2025-11-30T00:48:40
Scanned at: 2025-11-30T00:48:40.163Z

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
      "dischargeSuperheat": 180,
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
    "dischargeSuperheat": 180,
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