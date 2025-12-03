# Combined Profile Refrigerant Stress Test Log

Generated at: 2025-12-02T22:24:42.713Z

This log details 8 stress test scenarios for combined profile audits with refrigerant-related failures, including input parameters and output results.

## Scenario 1: Refrigerant Undercharge - High Superheat, Low Subcooling

### Input Profile
```json
{
  "id": "refrig-undercharge",
  "nominalTons": 5,
  "airside": {
    "designCFM": {
      "cooling": 2000
    },
    "externalStaticPressure": 0.5
  },
  "waterSide": {
    "flowRate": 50,
    "loopType": "open_tower"
  },
  "refrigeration": {
    "refrigerantType": "R410A",
    "metering": {
      "cooling": {
        "type": "txv"
      }
    }
  },
  "compressor": {
    "type": "recip",
    "stages": 1,
    "hasVFD": false,
    "rla": 12,
    "lra": 50
  },
  "electrical": {
    "nameplateVoltage": 460,
    "phase": 3
  }
}
```

### Input Measurements
```json
{
  "airside": {
    "enteringDryBulb": 80,
    "enteringWetBulb": 67,
    "leavingDryBulb": 55,
    "leavingWetBulb": 54,
    "cfm": 2000
  },
  "refrigeration": {
    "suctionPressure": 100,
    "dischargePressure": 300,
    "suctionTemp": 60,
    "dischargeTemp": 150,
    "liquidTemp": 130
  },
  "recipCompressor": {
    "compressorId": "A1",
    "suctionPressure": 100,
    "dischargePressure": 300,
    "suctionTemp": 60,
    "dischargeTemp": 150,
    "compressorCurrent": 10,
    "isRunning": true,
    "totalCylinders": 4
  },
  "scrollCompressor": {
    "compressorId": "A1",
    "suctionPressure": 100,
    "dischargePressure": 300,
    "suctionTemp": 60,
    "dischargeTemp": 150,
    "compressorCurrent": 10,
    "isRunning": true
  },
  "reversingValve": {
    "requestedMode": "cooling",
    "reversingValvePortTemps": {
      "dischargeInlet": 150,
      "suctionReturn": 60,
      "indoorCoilLine": 90,
      "outdoorCoilLine": 70
    },
    "solenoidVoltage": 24,
    "suctionPressure": 100,
    "dischargePressure": 300
  }
}
```

### Output Audit Result
```json
{
  "profileId": "refrig-undercharge",
  "domainResults": [
    {
      "domain": "airside",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "deltaT": null,
          "expectedDeltaT": {
            "min": 10,
            "ideal": 20,
            "max": 30,
            "source": "industry"
          },
          "expectedCFMPerTon": {
            "min": 360,
            "ideal": 400,
            "max": 440,
            "source": "nameplate_calculated"
          },
          "ratedESP": 0.5
        },
        "flags": {
          "deltaTStatus": "ok",
          "deltaTSource": "industry",
          "cfmSource": "nameplate_calculated",
          "airflowStatus": "ok",
          "disclaimers": [
            "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
            "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
          ]
        },
        "recommendations": [
          {
            "id": "airside_preventive_filter_maintenance",
            "domain": "airside",
            "severity": "info",
            "intent": "diagnostic",
            "summary": "Airflow currently within equipment design specifications.",
            "rationale": "Routine filter maintenance and replacement intervals should be followed per manufacturer guidance.",
            "notes": [
              "Airflow within design specs"
            ],
            "requiresShutdown": false
          }
        ],
        "deltaT": null,
        "deltaTStatus": "ok",
        "expectedDeltaT": {
          "min": 10,
          "ideal": 20,
          "max": 30,
          "source": "industry"
        },
        "deltaTSource": "industry",
        "expectedCFMPerTon": {
          "min": 360,
          "ideal": 400,
          "max": 440,
          "source": "nameplate_calculated"
        },
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "ok",
        "ratedESP": 0.5,
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      }
    },
    {
      "domain": "refrigeration",
      "ok": false,
      "findings": [
        {
          "code": "REF_UNDERCHARGE",
          "severity": "alert",
          "message": "High superheat and low subcooling indicate low refrigerant charge.",
          "relatedMeasurements": [
            "suctionPressure",
            "dischargePressure",
            "suctionTemp",
            "liquidTemp"
          ]
        }
      ],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 100,
          "dischargePressure": 300,
          "suctionSatTemp": 32,
          "dischargeSatTemp": 75,
          "superheat": 28,
          "subcooling": -55,
          "compressionRatio": 3,
          "waterDeltaT": 0,
          "dischargeSuperheat": 75
        },
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
        "suctionPressure": 100,
        "dischargePressure": 300,
        "suctionSatTemp": 32,
        "dischargeSatTemp": 75,
        "superheat": 28,
        "subcooling": -55,
        "compressionRatio": 3,
        "waterDeltaT": 0,
        "dischargeSuperheat": 75,
        "superheatStatus": "alert",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "recommendations": [
          {
            "id": "refrigeration_charge_pattern_low",
            "domain": "refrigeration",
            "severity": "alert",
            "intent": "diagnostic",
            "summary": "Superheat and subcooling pattern indicates refrigerant-side performance below expected range.",
            "rationale": "Superheat 28.0F, subcooling -55.0F.",
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
            "summary": "Water ΔT 0.0F indicates reduced heat transfer on the fluid side.",
            "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
            "notes": [
              "Water ΔT: 0.0F."
            ],
            "requiresShutdown": false
          }
        ],
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      }
    },
    {
      "domain": "compressor",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "compressionRatio": 3,
          "current": 10,
          "running": true
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
        "compressorId": "A1",
        "compressionRatio": 3,
        "compressionStatus": "ok",
        "current": 10,
        "currentStatus": "ok",
        "running": true,
        "disclaimers": []
      }
    },
    {
      "domain": "compressor",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "suctionPressure": 100,
          "dischargePressure": 300,
          "compressionRatio": 3
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
        "suctionPressure": 100,
        "dischargePressure": 300,
        "compressionRatio": 3,
        "compressionStatus": "ok",
        "currentStatus": "ok",
        "disclaimers": []
      }
    },
    {
      "domain": "reversing_valve",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "portTemps": {
            "dischargeInlet": 150,
            "suctionReturn": 60,
            "indoorCoilLine": 90,
            "outdoorCoilLine": 70
          },
          "tempSpread": 90,
          "hotPorts": [
            "discharge"
          ],
          "coldPorts": [
            "suction",
            "indoor",
            "outdoor"
          ],
          "compressionRatio": 3
        },
        "flags": {
          "patternMatch": "stuck"
        },
        "requestedMode": "cooling",
        "portTemps": {
          "dischargeInlet": 150,
          "suctionReturn": 60,
          "indoorCoilLine": 90,
          "outdoorCoilLine": 70
        },
        "tempSpread": 90,
        "hotPorts": [
          "discharge"
        ],
        "coldPorts": [
          "suction",
          "indoor",
          "outdoor"
        ],
        "patternMatch": "stuck",
        "compressionRatio": 3,
        "recommendations": []
      }
    }
  ],
  "overallStatus": "alert"
}
```

### Recommendations Generated (5)
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined

---

## Scenario 2: Refrigerant Overcharge - Low Superheat, High Subcooling

### Input Profile
```json
{
  "id": "refrig-overcharge",
  "nominalTons": 5,
  "airside": {
    "designCFM": {
      "cooling": 2000
    },
    "externalStaticPressure": 0.5
  },
  "waterSide": {
    "flowRate": 50,
    "loopType": "open_tower"
  },
  "refrigeration": {
    "refrigerantType": "R410A",
    "metering": {
      "cooling": {
        "type": "txv"
      }
    }
  },
  "compressor": {
    "type": "recip",
    "stages": 1,
    "hasVFD": false,
    "rla": 12,
    "lra": 50
  },
  "electrical": {
    "nameplateVoltage": 460,
    "phase": 3
  }
}
```

### Input Measurements
```json
{
  "airside": {
    "enteringDryBulb": 80,
    "enteringWetBulb": 67,
    "leavingDryBulb": 55,
    "leavingWetBulb": 54,
    "cfm": 2000
  },
  "refrigeration": {
    "suctionPressure": 100,
    "dischargePressure": 300,
    "suctionTemp": 35,
    "dischargeTemp": 150,
    "liquidTemp": 40
  },
  "recipCompressor": {
    "compressorId": "A1",
    "suctionPressure": 100,
    "dischargePressure": 300,
    "suctionTemp": 35,
    "dischargeTemp": 150,
    "compressorCurrent": 10,
    "isRunning": true,
    "totalCylinders": 4
  },
  "scrollCompressor": {
    "compressorId": "A1",
    "suctionPressure": 100,
    "dischargePressure": 300,
    "suctionTemp": 35,
    "dischargeTemp": 150,
    "compressorCurrent": 10,
    "isRunning": true
  },
  "reversingValve": {
    "requestedMode": "cooling",
    "reversingValvePortTemps": {
      "dischargeInlet": 150,
      "suctionReturn": 35,
      "indoorCoilLine": 90,
      "outdoorCoilLine": 70
    },
    "solenoidVoltage": 24,
    "suctionPressure": 100,
    "dischargePressure": 300
  }
}
```

### Output Audit Result
```json
{
  "profileId": "refrig-overcharge",
  "domainResults": [
    {
      "domain": "airside",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "deltaT": null,
          "expectedDeltaT": {
            "min": 10,
            "ideal": 20,
            "max": 30,
            "source": "industry"
          },
          "expectedCFMPerTon": {
            "min": 360,
            "ideal": 400,
            "max": 440,
            "source": "nameplate_calculated"
          },
          "ratedESP": 0.5
        },
        "flags": {
          "deltaTStatus": "ok",
          "deltaTSource": "industry",
          "cfmSource": "nameplate_calculated",
          "airflowStatus": "ok",
          "disclaimers": [
            "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
            "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
          ]
        },
        "recommendations": [
          {
            "id": "airside_preventive_filter_maintenance",
            "domain": "airside",
            "severity": "info",
            "intent": "diagnostic",
            "summary": "Airflow currently within equipment design specifications.",
            "rationale": "Routine filter maintenance and replacement intervals should be followed per manufacturer guidance.",
            "notes": [
              "Airflow within design specs"
            ],
            "requiresShutdown": false
          }
        ],
        "deltaT": null,
        "deltaTStatus": "ok",
        "expectedDeltaT": {
          "min": 10,
          "ideal": 20,
          "max": 30,
          "source": "industry"
        },
        "deltaTSource": "industry",
        "expectedCFMPerTon": {
          "min": 360,
          "ideal": 400,
          "max": 440,
          "source": "nameplate_calculated"
        },
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "ok",
        "ratedESP": 0.5,
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      }
    },
    {
      "domain": "refrigeration",
      "ok": false,
      "findings": [],
      "details": {
        "status": "critical",
        "values": {
          "suctionPressure": 100,
          "dischargePressure": 300,
          "suctionSatTemp": 32,
          "dischargeSatTemp": 75,
          "superheat": 3,
          "subcooling": 35,
          "compressionRatio": 3,
          "waterDeltaT": 0,
          "dischargeSuperheat": 75
        },
        "flags": {
          "superheatStatus": "critical",
          "subcoolingStatus": "alert",
          "compressionRatioStatus": "ok",
          "waterTransferStatus": "alert",
          "refrigerantProfile": "standard",
          "disclaimers": [
            "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
          ]
        },
        "suctionPressure": 100,
        "dischargePressure": 300,
        "suctionSatTemp": 32,
        "dischargeSatTemp": 75,
        "superheat": 3,
        "subcooling": 35,
        "compressionRatio": 3,
        "waterDeltaT": 0,
        "dischargeSuperheat": 75,
        "superheatStatus": "critical",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "recommendations": [
          {
            "id": "refrigeration_subcooling_elevated_pattern",
            "domain": "refrigeration",
            "severity": "alert",
            "intent": "diagnostic",
            "summary": "Superheat low and subcooling elevated; refrigerant-side loading appears high.",
            "rationale": "Superheat 3.0F, subcooling 35.0F.",
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
            "summary": "Water ΔT 0.0F indicates reduced heat transfer on the fluid side.",
            "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
            "notes": [
              "Water ΔT: 0.0F."
            ],
            "requiresShutdown": false
          }
        ],
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      }
    },
    {
      "domain": "compressor",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "compressionRatio": 3,
          "current": 10,
          "running": true
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
        "compressorId": "A1",
        "compressionRatio": 3,
        "compressionStatus": "ok",
        "current": 10,
        "currentStatus": "ok",
        "running": true,
        "disclaimers": []
      }
    },
    {
      "domain": "compressor",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "suctionPressure": 100,
          "dischargePressure": 300,
          "compressionRatio": 3
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
        "suctionPressure": 100,
        "dischargePressure": 300,
        "compressionRatio": 3,
        "compressionStatus": "ok",
        "currentStatus": "ok",
        "disclaimers": []
      }
    },
    {
      "domain": "reversing_valve",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "portTemps": {
            "dischargeInlet": 150,
            "suctionReturn": 35,
            "indoorCoilLine": 90,
            "outdoorCoilLine": 70
          },
          "tempSpread": 115,
          "hotPorts": [
            "discharge"
          ],
          "coldPorts": [
            "suction",
            "indoor",
            "outdoor"
          ],
          "compressionRatio": 3
        },
        "flags": {
          "patternMatch": "stuck"
        },
        "requestedMode": "cooling",
        "portTemps": {
          "dischargeInlet": 150,
          "suctionReturn": 35,
          "indoorCoilLine": 90,
          "outdoorCoilLine": 70
        },
        "tempSpread": 115,
        "hotPorts": [
          "discharge"
        ],
        "coldPorts": [
          "suction",
          "indoor",
          "outdoor"
        ],
        "patternMatch": "stuck",
        "compressionRatio": 3,
        "recommendations": []
      }
    },
    {
      "domain": "controls",
      "ok": false,
      "findings": [
        {
          "code": "SYS_REFRIGERATION_SLUG_RISK",
          "severity": "critical",
          "message": "Refrigeration superheat extremely low — compressor operation risks liquid slugging. Do not run compressors until cleared.",
          "relatedMeasurements": [
            "refrigeration.superheat",
            "refrigeration.suctionTemp"
          ]
        }
      ]
    }
  ],
  "overallStatus": "ok"
}
```

### Recommendations Generated (5)
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined

---

## Scenario 3: Refrigerant Restriction - High Subcooling, High Superheat

### Input Profile
```json
{
  "id": "refrig-restriction",
  "nominalTons": 5,
  "airside": {
    "designCFM": {
      "cooling": 2000
    },
    "externalStaticPressure": 0.5
  },
  "waterSide": {
    "flowRate": 50,
    "loopType": "open_tower"
  },
  "refrigeration": {
    "refrigerantType": "R410A",
    "metering": {
      "cooling": {
        "type": "txv"
      }
    }
  },
  "compressor": {
    "type": "recip",
    "stages": 1,
    "hasVFD": false,
    "rla": 12,
    "lra": 50
  },
  "electrical": {
    "nameplateVoltage": 460,
    "phase": 3
  }
}
```

### Input Measurements
```json
{
  "airside": {
    "enteringDryBulb": 80,
    "enteringWetBulb": 67,
    "leavingDryBulb": 55,
    "leavingWetBulb": 54,
    "cfm": 2000
  },
  "refrigeration": {
    "suctionPressure": 100,
    "dischargePressure": 300,
    "suctionTemp": 60,
    "dischargeTemp": 150,
    "liquidTemp": 40
  },
  "recipCompressor": {
    "compressorId": "A1",
    "suctionPressure": 100,
    "dischargePressure": 300,
    "suctionTemp": 60,
    "dischargeTemp": 150,
    "compressorCurrent": 10,
    "isRunning": true,
    "totalCylinders": 4
  },
  "scrollCompressor": {
    "compressorId": "A1",
    "suctionPressure": 100,
    "dischargePressure": 300,
    "suctionTemp": 60,
    "dischargeTemp": 150,
    "compressorCurrent": 10,
    "isRunning": true
  },
  "reversingValve": {
    "requestedMode": "cooling",
    "reversingValvePortTemps": {
      "dischargeInlet": 150,
      "suctionReturn": 60,
      "indoorCoilLine": 90,
      "outdoorCoilLine": 70
    },
    "solenoidVoltage": 24,
    "suctionPressure": 100,
    "dischargePressure": 300
  }
}
```

### Output Audit Result
```json
{
  "profileId": "refrig-restriction",
  "domainResults": [
    {
      "domain": "airside",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "deltaT": null,
          "expectedDeltaT": {
            "min": 10,
            "ideal": 20,
            "max": 30,
            "source": "industry"
          },
          "expectedCFMPerTon": {
            "min": 360,
            "ideal": 400,
            "max": 440,
            "source": "nameplate_calculated"
          },
          "ratedESP": 0.5
        },
        "flags": {
          "deltaTStatus": "ok",
          "deltaTSource": "industry",
          "cfmSource": "nameplate_calculated",
          "airflowStatus": "ok",
          "disclaimers": [
            "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
            "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
          ]
        },
        "recommendations": [
          {
            "id": "airside_preventive_filter_maintenance",
            "domain": "airside",
            "severity": "info",
            "intent": "diagnostic",
            "summary": "Airflow currently within equipment design specifications.",
            "rationale": "Routine filter maintenance and replacement intervals should be followed per manufacturer guidance.",
            "notes": [
              "Airflow within design specs"
            ],
            "requiresShutdown": false
          }
        ],
        "deltaT": null,
        "deltaTStatus": "ok",
        "expectedDeltaT": {
          "min": 10,
          "ideal": 20,
          "max": 30,
          "source": "industry"
        },
        "deltaTSource": "industry",
        "expectedCFMPerTon": {
          "min": 360,
          "ideal": 400,
          "max": 440,
          "source": "nameplate_calculated"
        },
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "ok",
        "ratedESP": 0.5,
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      }
    },
    {
      "domain": "refrigeration",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 100,
          "dischargePressure": 300,
          "suctionSatTemp": 32,
          "dischargeSatTemp": 75,
          "superheat": 28,
          "subcooling": 35,
          "compressionRatio": 3,
          "waterDeltaT": 0,
          "dischargeSuperheat": 75
        },
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
        "suctionPressure": 100,
        "dischargePressure": 300,
        "suctionSatTemp": 32,
        "dischargeSatTemp": 75,
        "superheat": 28,
        "subcooling": 35,
        "compressionRatio": 3,
        "waterDeltaT": 0,
        "dischargeSuperheat": 75,
        "superheatStatus": "alert",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "recommendations": [
          {
            "id": "refrigeration_flow_or_heat_transfer_limited",
            "domain": "refrigeration",
            "severity": "alert",
            "intent": "diagnostic",
            "summary": "Superheat and subcooling patterns with water-transfer alert suggest limited refrigerant flow or reduced heat transfer.",
            "rationale": "Superheat 28.0F, subcooling 35.0F.",
            "notes": [
              "Flagged by superheatStatus, subcoolingStatus, and waterTransferStatus."
            ],
            "requiresShutdown": false
          },
          {
            "id": "refrigeration_water_transfer_abnormal",
            "domain": "refrigeration",
            "severity": "alert",
            "intent": "diagnostic",
            "summary": "Water ΔT 0.0F indicates reduced heat transfer on the fluid side.",
            "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
            "notes": [
              "Water ΔT: 0.0F."
            ],
            "requiresShutdown": false
          }
        ],
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      }
    },
    {
      "domain": "compressor",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "compressionRatio": 3,
          "current": 10,
          "running": true
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
        "compressorId": "A1",
        "compressionRatio": 3,
        "compressionStatus": "ok",
        "current": 10,
        "currentStatus": "ok",
        "running": true,
        "disclaimers": []
      }
    },
    {
      "domain": "compressor",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "suctionPressure": 100,
          "dischargePressure": 300,
          "compressionRatio": 3
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
        "suctionPressure": 100,
        "dischargePressure": 300,
        "compressionRatio": 3,
        "compressionStatus": "ok",
        "currentStatus": "ok",
        "disclaimers": []
      }
    },
    {
      "domain": "reversing_valve",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "portTemps": {
            "dischargeInlet": 150,
            "suctionReturn": 60,
            "indoorCoilLine": 90,
            "outdoorCoilLine": 70
          },
          "tempSpread": 90,
          "hotPorts": [
            "discharge"
          ],
          "coldPorts": [
            "suction",
            "indoor",
            "outdoor"
          ],
          "compressionRatio": 3
        },
        "flags": {
          "patternMatch": "stuck"
        },
        "requestedMode": "cooling",
        "portTemps": {
          "dischargeInlet": 150,
          "suctionReturn": 60,
          "indoorCoilLine": 90,
          "outdoorCoilLine": 70
        },
        "tempSpread": 90,
        "hotPorts": [
          "discharge"
        ],
        "coldPorts": [
          "suction",
          "indoor",
          "outdoor"
        ],
        "patternMatch": "stuck",
        "compressionRatio": 3,
        "recommendations": []
      }
    }
  ],
  "overallStatus": "ok"
}
```

### Recommendations Generated (5)
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined

---

## Scenario 4: Low Refrigerant Pressure - Low Suction/Discharge

### Input Profile
```json
{
  "id": "refrig-low-pressure",
  "nominalTons": 5,
  "airside": {
    "designCFM": {
      "cooling": 2000
    },
    "externalStaticPressure": 0.5
  },
  "waterSide": {
    "flowRate": 50,
    "loopType": "open_tower"
  },
  "refrigeration": {
    "refrigerantType": "R410A",
    "metering": {
      "cooling": {
        "type": "txv"
      }
    }
  },
  "compressor": {
    "type": "recip",
    "stages": 1,
    "hasVFD": false,
    "rla": 12,
    "lra": 50
  },
  "electrical": {
    "nameplateVoltage": 460,
    "phase": 3
  }
}
```

### Input Measurements
```json
{
  "airside": {
    "enteringDryBulb": 80,
    "enteringWetBulb": 67,
    "leavingDryBulb": 55,
    "leavingWetBulb": 54,
    "cfm": 2000
  },
  "refrigeration": {
    "suctionPressure": 80,
    "dischargePressure": 200,
    "suctionTemp": 40,
    "dischargeTemp": 100,
    "liquidTemp": 85
  },
  "recipCompressor": {
    "compressorId": "A1",
    "suctionPressure": 80,
    "dischargePressure": 200,
    "suctionTemp": 40,
    "dischargeTemp": 100,
    "compressorCurrent": 10,
    "isRunning": true,
    "totalCylinders": 4
  },
  "scrollCompressor": {
    "compressorId": "A1",
    "suctionPressure": 80,
    "dischargePressure": 200,
    "suctionTemp": 40,
    "dischargeTemp": 100,
    "compressorCurrent": 10,
    "isRunning": true
  },
  "reversingValve": {
    "requestedMode": "cooling",
    "reversingValvePortTemps": {
      "dischargeInlet": 100,
      "suctionReturn": 40,
      "indoorCoilLine": 60,
      "outdoorCoilLine": 50
    },
    "solenoidVoltage": 24,
    "suctionPressure": 80,
    "dischargePressure": 200
  }
}
```

### Output Audit Result
```json
{
  "profileId": "refrig-low-pressure",
  "domainResults": [
    {
      "domain": "airside",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "deltaT": null,
          "expectedDeltaT": {
            "min": 10,
            "ideal": 20,
            "max": 30,
            "source": "industry"
          },
          "expectedCFMPerTon": {
            "min": 360,
            "ideal": 400,
            "max": 440,
            "source": "nameplate_calculated"
          },
          "ratedESP": 0.5
        },
        "flags": {
          "deltaTStatus": "ok",
          "deltaTSource": "industry",
          "cfmSource": "nameplate_calculated",
          "airflowStatus": "ok",
          "disclaimers": [
            "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
            "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
          ]
        },
        "recommendations": [
          {
            "id": "airside_preventive_filter_maintenance",
            "domain": "airside",
            "severity": "info",
            "intent": "diagnostic",
            "summary": "Airflow currently within equipment design specifications.",
            "rationale": "Routine filter maintenance and replacement intervals should be followed per manufacturer guidance.",
            "notes": [
              "Airflow within design specs"
            ],
            "requiresShutdown": false
          }
        ],
        "deltaT": null,
        "deltaTStatus": "ok",
        "expectedDeltaT": {
          "min": 10,
          "ideal": 20,
          "max": 30,
          "source": "industry"
        },
        "deltaTSource": "industry",
        "expectedCFMPerTon": {
          "min": 360,
          "ideal": 400,
          "max": 440,
          "source": "nameplate_calculated"
        },
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "ok",
        "ratedESP": 0.5,
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      }
    },
    {
      "domain": "refrigeration",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 80,
          "dischargePressure": 200,
          "suctionSatTemp": 27.7,
          "dischargeSatTemp": 53.5,
          "superheat": 12.3,
          "subcooling": -31.5,
          "compressionRatio": 2.5,
          "waterDeltaT": 0,
          "dischargeSuperheat": 46.5
        },
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
        "suctionPressure": 80,
        "dischargePressure": 200,
        "suctionSatTemp": 27.7,
        "dischargeSatTemp": 53.5,
        "superheat": 12.3,
        "subcooling": -31.5,
        "compressionRatio": 2.5,
        "waterDeltaT": 0,
        "dischargeSuperheat": 46.5,
        "superheatStatus": "ok",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "recommendations": [
          {
            "id": "refrigeration_charge_pattern_low",
            "domain": "refrigeration",
            "severity": "alert",
            "intent": "diagnostic",
            "summary": "Superheat and subcooling pattern indicates refrigerant-side performance below expected range.",
            "rationale": "Superheat 12.3F, subcooling -31.5F.",
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
            "summary": "Water ΔT 0.0F indicates reduced heat transfer on the fluid side.",
            "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
            "notes": [
              "Water ΔT: 0.0F."
            ],
            "requiresShutdown": false
          }
        ],
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      }
    },
    {
      "domain": "compressor",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "compressionRatio": 2.5,
          "current": 10,
          "running": true
        },
        "flags": {
          "compressionStatus": "alert",
          "currentStatus": "ok",
          "recipHealth": {},
          "disclaimers": [],
          "refrigerantProfile": "standard"
        },
        "recommendations": [],
        "compressorId": "A1",
        "compressionRatio": 2.5,
        "compressionStatus": "alert",
        "current": 10,
        "currentStatus": "ok",
        "running": true,
        "disclaimers": []
      }
    },
    {
      "domain": "compressor",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 80,
          "dischargePressure": 200,
          "compressionRatio": 2.5
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
            "summary": "Compression ratio 2.5:1 is outside expected range.",
            "rationale": "Compression ratio flagged outside expected range; further diagnostic evaluation is recommended.",
            "notes": [
              "Compression ratio: 2.5:1"
            ],
            "requiresShutdown": false
          }
        ],
        "compressorType": "scroll",
        "suctionPressure": 80,
        "dischargePressure": 200,
        "compressionRatio": 2.5,
        "compressionStatus": "alert",
        "currentStatus": "ok",
        "disclaimers": []
      }
    },
    {
      "domain": "reversing_valve",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "portTemps": {
            "dischargeInlet": 100,
            "suctionReturn": 40,
            "indoorCoilLine": 60,
            "outdoorCoilLine": 50
          },
          "tempSpread": 60,
          "hotPorts": [],
          "coldPorts": [
            "discharge",
            "suction",
            "indoor",
            "outdoor"
          ],
          "compressionRatio": 2.5
        },
        "flags": {
          "patternMatch": "stuck"
        },
        "requestedMode": "cooling",
        "portTemps": {
          "dischargeInlet": 100,
          "suctionReturn": 40,
          "indoorCoilLine": 60,
          "outdoorCoilLine": 50
        },
        "tempSpread": 60,
        "hotPorts": [],
        "coldPorts": [
          "discharge",
          "suction",
          "indoor",
          "outdoor"
        ],
        "patternMatch": "stuck",
        "compressionRatio": 2.5,
        "recommendations": []
      }
    }
  ],
  "overallStatus": "ok"
}
```

### Recommendations Generated (4)
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined

---

## Scenario 5: High Refrigerant Pressure - High Suction/Discharge

### Input Profile
```json
{
  "id": "refrig-high-pressure",
  "nominalTons": 5,
  "airside": {
    "designCFM": {
      "cooling": 2000
    },
    "externalStaticPressure": 0.5
  },
  "waterSide": {
    "flowRate": 50,
    "loopType": "open_tower"
  },
  "refrigeration": {
    "refrigerantType": "R410A",
    "metering": {
      "cooling": {
        "type": "txv"
      }
    }
  },
  "compressor": {
    "type": "recip",
    "stages": 1,
    "hasVFD": false,
    "rla": 12,
    "lra": 50
  },
  "electrical": {
    "nameplateVoltage": 460,
    "phase": 3
  }
}
```

### Input Measurements
```json
{
  "airside": {
    "enteringDryBulb": 80,
    "enteringWetBulb": 67,
    "leavingDryBulb": 55,
    "leavingWetBulb": 54,
    "cfm": 2000
  },
  "refrigeration": {
    "suctionPressure": 180,
    "dischargePressure": 500,
    "suctionTemp": 65,
    "dischargeTemp": 180,
    "liquidTemp": 125
  },
  "recipCompressor": {
    "compressorId": "A1",
    "suctionPressure": 180,
    "dischargePressure": 500,
    "suctionTemp": 65,
    "dischargeTemp": 180,
    "compressorCurrent": 10,
    "isRunning": true,
    "totalCylinders": 4
  },
  "scrollCompressor": {
    "compressorId": "A1",
    "suctionPressure": 180,
    "dischargePressure": 500,
    "suctionTemp": 65,
    "dischargeTemp": 180,
    "compressorCurrent": 10,
    "isRunning": true
  },
  "reversingValve": {
    "requestedMode": "cooling",
    "reversingValvePortTemps": {
      "dischargeInlet": 180,
      "suctionReturn": 65,
      "indoorCoilLine": 110,
      "outdoorCoilLine": 90
    },
    "solenoidVoltage": 24,
    "suctionPressure": 180,
    "dischargePressure": 500
  }
}
```

### Output Audit Result
```json
{
  "profileId": "refrig-high-pressure",
  "domainResults": [
    {
      "domain": "airside",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "deltaT": null,
          "expectedDeltaT": {
            "min": 10,
            "ideal": 20,
            "max": 30,
            "source": "industry"
          },
          "expectedCFMPerTon": {
            "min": 360,
            "ideal": 400,
            "max": 440,
            "source": "nameplate_calculated"
          },
          "ratedESP": 0.5
        },
        "flags": {
          "deltaTStatus": "ok",
          "deltaTSource": "industry",
          "cfmSource": "nameplate_calculated",
          "airflowStatus": "ok",
          "disclaimers": [
            "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
            "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
          ]
        },
        "recommendations": [
          {
            "id": "airside_preventive_filter_maintenance",
            "domain": "airside",
            "severity": "info",
            "intent": "diagnostic",
            "summary": "Airflow currently within equipment design specifications.",
            "rationale": "Routine filter maintenance and replacement intervals should be followed per manufacturer guidance.",
            "notes": [
              "Airflow within design specs"
            ],
            "requiresShutdown": false
          }
        ],
        "deltaT": null,
        "deltaTStatus": "ok",
        "expectedDeltaT": {
          "min": 10,
          "ideal": 20,
          "max": 30,
          "source": "industry"
        },
        "deltaTSource": "industry",
        "expectedCFMPerTon": {
          "min": 360,
          "ideal": 400,
          "max": 440,
          "source": "nameplate_calculated"
        },
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "ok",
        "ratedESP": 0.5,
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      }
    },
    {
      "domain": "refrigeration",
      "ok": false,
      "findings": [
        {
          "code": "REF_UNDERCHARGE",
          "severity": "alert",
          "message": "High superheat and low subcooling indicate low refrigerant charge.",
          "relatedMeasurements": [
            "suctionPressure",
            "dischargePressure",
            "suctionTemp",
            "liquidTemp"
          ]
        }
      ],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 180,
          "dischargePressure": 500,
          "suctionSatTemp": 49.2,
          "dischargeSatTemp": 118,
          "superheat": 15.8,
          "subcooling": -7,
          "compressionRatio": 2.78,
          "waterDeltaT": 0,
          "dischargeSuperheat": 62
        },
        "flags": {
          "superheatStatus": "warning",
          "subcoolingStatus": "alert",
          "compressionRatioStatus": "ok",
          "waterTransferStatus": "alert",
          "refrigerantProfile": "standard",
          "disclaimers": [
            "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
          ]
        },
        "suctionPressure": 180,
        "dischargePressure": 500,
        "suctionSatTemp": 49.2,
        "dischargeSatTemp": 118,
        "superheat": 15.8,
        "subcooling": -7,
        "compressionRatio": 2.78,
        "waterDeltaT": 0,
        "dischargeSuperheat": 62,
        "superheatStatus": "warning",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "recommendations": [
          {
            "id": "refrigeration_charge_pattern_low",
            "domain": "refrigeration",
            "severity": "alert",
            "intent": "diagnostic",
            "summary": "Superheat and subcooling pattern indicates refrigerant-side performance below expected range.",
            "rationale": "Superheat 15.8F, subcooling -7.0F.",
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
            "summary": "Water ΔT 0.0F indicates reduced heat transfer on the fluid side.",
            "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
            "notes": [
              "Water ΔT: 0.0F."
            ],
            "requiresShutdown": false
          }
        ],
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      }
    },
    {
      "domain": "compressor",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "compressionRatio": 2.78,
          "current": 10,
          "running": true
        },
        "flags": {
          "compressionStatus": "alert",
          "currentStatus": "ok",
          "recipHealth": {},
          "disclaimers": [],
          "refrigerantProfile": "standard"
        },
        "recommendations": [],
        "compressorId": "A1",
        "compressionRatio": 2.78,
        "compressionStatus": "alert",
        "current": 10,
        "currentStatus": "ok",
        "running": true,
        "disclaimers": []
      }
    },
    {
      "domain": "compressor",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 180,
          "dischargePressure": 500,
          "compressionRatio": 2.78
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
            "summary": "Compression ratio 2.78:1 is outside expected range.",
            "rationale": "Compression ratio flagged outside expected range; further diagnostic evaluation is recommended.",
            "notes": [
              "Compression ratio: 2.78:1"
            ],
            "requiresShutdown": false
          }
        ],
        "compressorType": "scroll",
        "suctionPressure": 180,
        "dischargePressure": 500,
        "compressionRatio": 2.78,
        "compressionStatus": "alert",
        "currentStatus": "ok",
        "disclaimers": []
      }
    },
    {
      "domain": "reversing_valve",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "portTemps": {
            "dischargeInlet": 180,
            "suctionReturn": 65,
            "indoorCoilLine": 110,
            "outdoorCoilLine": 90
          },
          "tempSpread": 115,
          "hotPorts": [
            "discharge"
          ],
          "coldPorts": [
            "suction",
            "indoor",
            "outdoor"
          ],
          "compressionRatio": 2.78
        },
        "flags": {
          "patternMatch": "stuck"
        },
        "requestedMode": "cooling",
        "portTemps": {
          "dischargeInlet": 180,
          "suctionReturn": 65,
          "indoorCoilLine": 110,
          "outdoorCoilLine": 90
        },
        "tempSpread": 115,
        "hotPorts": [
          "discharge"
        ],
        "coldPorts": [
          "suction",
          "indoor",
          "outdoor"
        ],
        "patternMatch": "stuck",
        "compressionRatio": 2.78,
        "recommendations": []
      }
    }
  ],
  "overallStatus": "alert"
}
```

### Recommendations Generated (4)
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined

---

## Scenario 6: Non-Condensables - Low Subcooling, Normal Superheat

### Input Profile
```json
{
  "id": "refrig-noncondensables",
  "nominalTons": 5,
  "airside": {
    "designCFM": {
      "cooling": 2000
    },
    "externalStaticPressure": 0.5
  },
  "waterSide": {
    "flowRate": 50,
    "loopType": "open_tower"
  },
  "refrigeration": {
    "refrigerantType": "R410A",
    "metering": {
      "cooling": {
        "type": "txv"
      }
    }
  },
  "compressor": {
    "type": "recip",
    "stages": 1,
    "hasVFD": false,
    "rla": 12,
    "lra": 50
  },
  "electrical": {
    "nameplateVoltage": 460,
    "phase": 3
  }
}
```

### Input Measurements
```json
{
  "airside": {
    "enteringDryBulb": 80,
    "enteringWetBulb": 67,
    "leavingDryBulb": 55,
    "leavingWetBulb": 54,
    "cfm": 2000
  },
  "refrigeration": {
    "suctionPressure": 130,
    "dischargePressure": 360,
    "suctionTemp": 50,
    "dischargeTemp": 145,
    "liquidTemp": 95
  },
  "recipCompressor": {
    "compressorId": "A1",
    "suctionPressure": 130,
    "dischargePressure": 360,
    "suctionTemp": 50,
    "dischargeTemp": 145,
    "compressorCurrent": 10,
    "isRunning": true,
    "totalCylinders": 4
  },
  "scrollCompressor": {
    "compressorId": "A1",
    "suctionPressure": 130,
    "dischargePressure": 360,
    "suctionTemp": 50,
    "dischargeTemp": 145,
    "compressorCurrent": 10,
    "isRunning": true
  },
  "reversingValve": {
    "requestedMode": "cooling",
    "reversingValvePortTemps": {
      "dischargeInlet": 145,
      "suctionReturn": 50,
      "indoorCoilLine": 85,
      "outdoorCoilLine": 65
    },
    "solenoidVoltage": 24,
    "suctionPressure": 130,
    "dischargePressure": 360
  }
}
```

### Output Audit Result
```json
{
  "profileId": "refrig-noncondensables",
  "domainResults": [
    {
      "domain": "airside",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "deltaT": null,
          "expectedDeltaT": {
            "min": 10,
            "ideal": 20,
            "max": 30,
            "source": "industry"
          },
          "expectedCFMPerTon": {
            "min": 360,
            "ideal": 400,
            "max": 440,
            "source": "nameplate_calculated"
          },
          "ratedESP": 0.5
        },
        "flags": {
          "deltaTStatus": "ok",
          "deltaTSource": "industry",
          "cfmSource": "nameplate_calculated",
          "airflowStatus": "ok",
          "disclaimers": [
            "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
            "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
          ]
        },
        "recommendations": [
          {
            "id": "airside_preventive_filter_maintenance",
            "domain": "airside",
            "severity": "info",
            "intent": "diagnostic",
            "summary": "Airflow currently within equipment design specifications.",
            "rationale": "Routine filter maintenance and replacement intervals should be followed per manufacturer guidance.",
            "notes": [
              "Airflow within design specs"
            ],
            "requiresShutdown": false
          }
        ],
        "deltaT": null,
        "deltaTStatus": "ok",
        "expectedDeltaT": {
          "min": 10,
          "ideal": 20,
          "max": 30,
          "source": "industry"
        },
        "deltaTSource": "industry",
        "expectedCFMPerTon": {
          "min": 360,
          "ideal": 400,
          "max": 440,
          "source": "nameplate_calculated"
        },
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "ok",
        "ratedESP": 0.5,
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      }
    },
    {
      "domain": "refrigeration",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 130,
          "dischargePressure": 360,
          "suctionSatTemp": 38.5,
          "dischargeSatTemp": 87.9,
          "superheat": 11.5,
          "subcooling": -7.1,
          "compressionRatio": 2.77,
          "waterDeltaT": 0,
          "dischargeSuperheat": 57.1
        },
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
        "suctionPressure": 130,
        "dischargePressure": 360,
        "suctionSatTemp": 38.5,
        "dischargeSatTemp": 87.9,
        "superheat": 11.5,
        "subcooling": -7.1,
        "compressionRatio": 2.77,
        "waterDeltaT": 0,
        "dischargeSuperheat": 57.1,
        "superheatStatus": "ok",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "recommendations": [
          {
            "id": "refrigeration_charge_pattern_low",
            "domain": "refrigeration",
            "severity": "alert",
            "intent": "diagnostic",
            "summary": "Superheat and subcooling pattern indicates refrigerant-side performance below expected range.",
            "rationale": "Superheat 11.5F, subcooling -7.1F.",
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
            "summary": "Water ΔT 0.0F indicates reduced heat transfer on the fluid side.",
            "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
            "notes": [
              "Water ΔT: 0.0F."
            ],
            "requiresShutdown": false
          }
        ],
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      }
    },
    {
      "domain": "compressor",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "compressionRatio": 2.77,
          "current": 10,
          "running": true
        },
        "flags": {
          "compressionStatus": "alert",
          "currentStatus": "ok",
          "recipHealth": {},
          "disclaimers": [],
          "refrigerantProfile": "standard"
        },
        "recommendations": [],
        "compressorId": "A1",
        "compressionRatio": 2.77,
        "compressionStatus": "alert",
        "current": 10,
        "currentStatus": "ok",
        "running": true,
        "disclaimers": []
      }
    },
    {
      "domain": "compressor",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 130,
          "dischargePressure": 360,
          "compressionRatio": 2.77
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
            "summary": "Compression ratio 2.77:1 is outside expected range.",
            "rationale": "Compression ratio flagged outside expected range; further diagnostic evaluation is recommended.",
            "notes": [
              "Compression ratio: 2.77:1"
            ],
            "requiresShutdown": false
          }
        ],
        "compressorType": "scroll",
        "suctionPressure": 130,
        "dischargePressure": 360,
        "compressionRatio": 2.77,
        "compressionStatus": "alert",
        "currentStatus": "ok",
        "disclaimers": []
      }
    },
    {
      "domain": "reversing_valve",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "portTemps": {
            "dischargeInlet": 145,
            "suctionReturn": 50,
            "indoorCoilLine": 85,
            "outdoorCoilLine": 65
          },
          "tempSpread": 95,
          "hotPorts": [
            "discharge"
          ],
          "coldPorts": [
            "suction",
            "indoor",
            "outdoor"
          ],
          "compressionRatio": 2.77
        },
        "flags": {
          "patternMatch": "stuck"
        },
        "requestedMode": "cooling",
        "portTemps": {
          "dischargeInlet": 145,
          "suctionReturn": 50,
          "indoorCoilLine": 85,
          "outdoorCoilLine": 65
        },
        "tempSpread": 95,
        "hotPorts": [
          "discharge"
        ],
        "coldPorts": [
          "suction",
          "indoor",
          "outdoor"
        ],
        "patternMatch": "stuck",
        "compressionRatio": 2.77,
        "recommendations": []
      }
    }
  ],
  "overallStatus": "ok"
}
```

### Recommendations Generated (4)
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined

---

## Scenario 7: TXV Failure - Erratic Superheat/Subcooling

### Input Profile
```json
{
  "id": "refrig-txv-failure",
  "nominalTons": 5,
  "airside": {
    "designCFM": {
      "cooling": 2000
    },
    "externalStaticPressure": 0.5
  },
  "waterSide": {
    "flowRate": 50,
    "loopType": "open_tower"
  },
  "refrigeration": {
    "refrigerantType": "R410A",
    "metering": {
      "cooling": {
        "type": "txv"
      }
    }
  },
  "compressor": {
    "type": "recip",
    "stages": 1,
    "hasVFD": false,
    "rla": 12,
    "lra": 50
  },
  "electrical": {
    "nameplateVoltage": 460,
    "phase": 3
  }
}
```

### Input Measurements
```json
{
  "airside": {
    "enteringDryBulb": 80,
    "enteringWetBulb": 67,
    "leavingDryBulb": 55,
    "leavingWetBulb": 54,
    "cfm": 2000
  },
  "refrigeration": {
    "suctionPressure": 125,
    "dischargePressure": 375,
    "suctionTemp": 48,
    "dischargeTemp": 155,
    "liquidTemp": 105
  },
  "recipCompressor": {
    "compressorId": "A1",
    "suctionPressure": 125,
    "dischargePressure": 375,
    "suctionTemp": 48,
    "dischargeTemp": 155,
    "compressorCurrent": 10,
    "isRunning": true,
    "totalCylinders": 4
  },
  "scrollCompressor": {
    "compressorId": "A1",
    "suctionPressure": 125,
    "dischargePressure": 375,
    "suctionTemp": 48,
    "dischargeTemp": 155,
    "compressorCurrent": 10,
    "isRunning": true
  },
  "reversingValve": {
    "requestedMode": "cooling",
    "reversingValvePortTemps": {
      "dischargeInlet": 155,
      "suctionReturn": 48,
      "indoorCoilLine": 90,
      "outdoorCoilLine": 70
    },
    "solenoidVoltage": 24,
    "suctionPressure": 125,
    "dischargePressure": 375
  }
}
```

### Output Audit Result
```json
{
  "profileId": "refrig-txv-failure",
  "domainResults": [
    {
      "domain": "airside",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "deltaT": null,
          "expectedDeltaT": {
            "min": 10,
            "ideal": 20,
            "max": 30,
            "source": "industry"
          },
          "expectedCFMPerTon": {
            "min": 360,
            "ideal": 400,
            "max": 440,
            "source": "nameplate_calculated"
          },
          "ratedESP": 0.5
        },
        "flags": {
          "deltaTStatus": "ok",
          "deltaTSource": "industry",
          "cfmSource": "nameplate_calculated",
          "airflowStatus": "ok",
          "disclaimers": [
            "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
            "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
          ]
        },
        "recommendations": [
          {
            "id": "airside_preventive_filter_maintenance",
            "domain": "airside",
            "severity": "info",
            "intent": "diagnostic",
            "summary": "Airflow currently within equipment design specifications.",
            "rationale": "Routine filter maintenance and replacement intervals should be followed per manufacturer guidance.",
            "notes": [
              "Airflow within design specs"
            ],
            "requiresShutdown": false
          }
        ],
        "deltaT": null,
        "deltaTStatus": "ok",
        "expectedDeltaT": {
          "min": 10,
          "ideal": 20,
          "max": 30,
          "source": "industry"
        },
        "deltaTSource": "industry",
        "expectedCFMPerTon": {
          "min": 360,
          "ideal": 400,
          "max": 440,
          "source": "nameplate_calculated"
        },
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "ok",
        "ratedESP": 0.5,
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      }
    },
    {
      "domain": "refrigeration",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 125,
          "dischargePressure": 375,
          "suctionSatTemp": 37.4,
          "dischargeSatTemp": 91.1,
          "superheat": 10.6,
          "subcooling": -13.9,
          "compressionRatio": 3,
          "waterDeltaT": 0,
          "dischargeSuperheat": 63.9
        },
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
        "suctionPressure": 125,
        "dischargePressure": 375,
        "suctionSatTemp": 37.4,
        "dischargeSatTemp": 91.1,
        "superheat": 10.6,
        "subcooling": -13.9,
        "compressionRatio": 3,
        "waterDeltaT": 0,
        "dischargeSuperheat": 63.9,
        "superheatStatus": "ok",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "recommendations": [
          {
            "id": "refrigeration_charge_pattern_low",
            "domain": "refrigeration",
            "severity": "alert",
            "intent": "diagnostic",
            "summary": "Superheat and subcooling pattern indicates refrigerant-side performance below expected range.",
            "rationale": "Superheat 10.6F, subcooling -13.9F.",
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
            "summary": "Water ΔT 0.0F indicates reduced heat transfer on the fluid side.",
            "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
            "notes": [
              "Water ΔT: 0.0F."
            ],
            "requiresShutdown": false
          }
        ],
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      }
    },
    {
      "domain": "compressor",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "compressionRatio": 3,
          "current": 10,
          "running": true
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
        "compressorId": "A1",
        "compressionRatio": 3,
        "compressionStatus": "ok",
        "current": 10,
        "currentStatus": "ok",
        "running": true,
        "disclaimers": []
      }
    },
    {
      "domain": "compressor",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "suctionPressure": 125,
          "dischargePressure": 375,
          "compressionRatio": 3
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
        "suctionPressure": 125,
        "dischargePressure": 375,
        "compressionRatio": 3,
        "compressionStatus": "ok",
        "currentStatus": "ok",
        "disclaimers": []
      }
    },
    {
      "domain": "reversing_valve",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "portTemps": {
            "dischargeInlet": 155,
            "suctionReturn": 48,
            "indoorCoilLine": 90,
            "outdoorCoilLine": 70
          },
          "tempSpread": 107,
          "hotPorts": [
            "discharge"
          ],
          "coldPorts": [
            "suction",
            "indoor",
            "outdoor"
          ],
          "compressionRatio": 3
        },
        "flags": {
          "patternMatch": "stuck"
        },
        "requestedMode": "cooling",
        "portTemps": {
          "dischargeInlet": 155,
          "suctionReturn": 48,
          "indoorCoilLine": 90,
          "outdoorCoilLine": 70
        },
        "tempSpread": 107,
        "hotPorts": [
          "discharge"
        ],
        "coldPorts": [
          "suction",
          "indoor",
          "outdoor"
        ],
        "patternMatch": "stuck",
        "compressionRatio": 3,
        "recommendations": []
      }
    }
  ],
  "overallStatus": "ok"
}
```

### Recommendations Generated (5)
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined

---

## Scenario 8: Combined Refrigerant + Airside Problems

### Input Profile
```json
{
  "id": "refrig-airside-combined",
  "nominalTons": 5,
  "airside": {
    "designCFM": {
      "cooling": 2000
    },
    "externalStaticPressure": 0.5
  },
  "waterSide": {
    "flowRate": 50,
    "loopType": "open_tower"
  },
  "refrigeration": {
    "refrigerantType": "R410A",
    "metering": {
      "cooling": {
        "type": "txv"
      }
    }
  },
  "compressor": {
    "type": "recip",
    "stages": 1,
    "hasVFD": false,
    "rla": 12,
    "lra": 50
  },
  "electrical": {
    "nameplateVoltage": 460,
    "phase": 3
  }
}
```

### Input Measurements
```json
{
  "airside": {
    "enteringDryBulb": 80,
    "enteringWetBulb": 67,
    "leavingDryBulb": 70,
    "leavingWetBulb": 68,
    "cfm": 1000
  },
  "refrigeration": {
    "suctionPressure": 110,
    "dischargePressure": 320,
    "suctionTemp": 52,
    "dischargeTemp": 135,
    "liquidTemp": 98
  },
  "recipCompressor": {
    "compressorId": "A1",
    "suctionPressure": 110,
    "dischargePressure": 320,
    "suctionTemp": 52,
    "dischargeTemp": 135,
    "compressorCurrent": 10,
    "isRunning": true,
    "totalCylinders": 4
  },
  "scrollCompressor": {
    "compressorId": "A1",
    "suctionPressure": 110,
    "dischargePressure": 320,
    "suctionTemp": 52,
    "dischargeTemp": 135,
    "compressorCurrent": 10,
    "isRunning": true
  },
  "reversingValve": {
    "requestedMode": "cooling",
    "reversingValvePortTemps": {
      "dischargeInlet": 135,
      "suctionReturn": 52,
      "indoorCoilLine": 80,
      "outdoorCoilLine": 60
    },
    "solenoidVoltage": 24,
    "suctionPressure": 110,
    "dischargePressure": 320
  }
}
```

### Output Audit Result
```json
{
  "profileId": "refrig-airside-combined",
  "domainResults": [
    {
      "domain": "airside",
      "ok": true,
      "findings": [],
      "details": {
        "status": "ok",
        "values": {
          "deltaT": null,
          "expectedDeltaT": {
            "min": 10,
            "ideal": 20,
            "max": 30,
            "source": "industry"
          },
          "expectedCFMPerTon": {
            "min": 360,
            "ideal": 400,
            "max": 440,
            "source": "nameplate_calculated"
          },
          "ratedESP": 0.5
        },
        "flags": {
          "deltaTStatus": "ok",
          "deltaTSource": "industry",
          "cfmSource": "nameplate_calculated",
          "airflowStatus": "ok",
          "disclaimers": [
            "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
            "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
          ]
        },
        "recommendations": [
          {
            "id": "airside_preventive_filter_maintenance",
            "domain": "airside",
            "severity": "info",
            "intent": "diagnostic",
            "summary": "Airflow currently within equipment design specifications.",
            "rationale": "Routine filter maintenance and replacement intervals should be followed per manufacturer guidance.",
            "notes": [
              "Airflow within design specs"
            ],
            "requiresShutdown": false
          }
        ],
        "deltaT": null,
        "deltaTStatus": "ok",
        "expectedDeltaT": {
          "min": 10,
          "ideal": 20,
          "max": 30,
          "source": "industry"
        },
        "deltaTSource": "industry",
        "expectedCFMPerTon": {
          "min": 360,
          "ideal": 400,
          "max": 440,
          "source": "nameplate_calculated"
        },
        "cfmSource": "nameplate_calculated",
        "airflowStatus": "ok",
        "ratedESP": 0.5,
        "disclaimers": [
          "Always verify expected coil and fan curves with the equipment Installation, Operation & Maintenance (IOM) manual. You can pass manufacturer ranges via profile.airside.manufacturerExpectedDeltaT and profile.airside.manufacturerCFMPerTon if available (do not commit OEM data into the repository).",
          "Manufacturer data for coil performance not found in profile — relying on industry defaults. Verify with equipment documentation."
        ]
      }
    },
    {
      "domain": "refrigeration",
      "ok": false,
      "findings": [
        {
          "code": "REF_UNDERCHARGE",
          "severity": "alert",
          "message": "High superheat and low subcooling indicate low refrigerant charge.",
          "relatedMeasurements": [
            "suctionPressure",
            "dischargePressure",
            "suctionTemp",
            "liquidTemp"
          ]
        }
      ],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 110,
          "dischargePressure": 320,
          "suctionSatTemp": 34.2,
          "dischargeSatTemp": 79.3,
          "superheat": 17.9,
          "subcooling": -18.7,
          "compressionRatio": 2.91,
          "waterDeltaT": 0,
          "dischargeSuperheat": 55.7
        },
        "flags": {
          "superheatStatus": "warning",
          "subcoolingStatus": "alert",
          "compressionRatioStatus": "ok",
          "waterTransferStatus": "alert",
          "refrigerantProfile": "standard",
          "disclaimers": [
            "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
          ]
        },
        "suctionPressure": 110,
        "dischargePressure": 320,
        "suctionSatTemp": 34.2,
        "dischargeSatTemp": 79.3,
        "superheat": 17.9,
        "subcooling": -18.7,
        "compressionRatio": 2.91,
        "waterDeltaT": 0,
        "dischargeSuperheat": 55.7,
        "superheatStatus": "warning",
        "subcoolingStatus": "alert",
        "compressionRatioStatus": "ok",
        "waterTransferStatus": "alert",
        "recommendations": [
          {
            "id": "refrigeration_charge_pattern_low",
            "domain": "refrigeration",
            "severity": "alert",
            "intent": "diagnostic",
            "summary": "Superheat and subcooling pattern indicates refrigerant-side performance below expected range.",
            "rationale": "Superheat 17.9F, subcooling -18.7F.",
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
            "summary": "Water ΔT 0.0F indicates reduced heat transfer on the fluid side.",
            "rationale": "Heat-transfer on the fluid side may be limited by reduced flow or exchanger fouling.",
            "notes": [
              "Water ΔT: 0.0F."
            ],
            "requiresShutdown": false
          }
        ],
        "disclaimers": [
          "Refrigerant analysis is based on generic thermodynamic properties for the selected refrigerant. Field measurements and equipment documentation should always be used to confirm limits."
        ]
      }
    },
    {
      "domain": "compressor",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "compressionRatio": 2.91,
          "current": 10,
          "running": true
        },
        "flags": {
          "compressionStatus": "alert",
          "currentStatus": "ok",
          "recipHealth": {},
          "disclaimers": [],
          "refrigerantProfile": "standard"
        },
        "recommendations": [],
        "compressorId": "A1",
        "compressionRatio": 2.91,
        "compressionStatus": "alert",
        "current": 10,
        "currentStatus": "ok",
        "running": true,
        "disclaimers": []
      }
    },
    {
      "domain": "compressor",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "suctionPressure": 110,
          "dischargePressure": 320,
          "compressionRatio": 2.91
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
            "summary": "Compression ratio 2.91:1 is outside expected range.",
            "rationale": "Compression ratio flagged outside expected range; further diagnostic evaluation is recommended.",
            "notes": [
              "Compression ratio: 2.91:1"
            ],
            "requiresShutdown": false
          }
        ],
        "compressorType": "scroll",
        "suctionPressure": 110,
        "dischargePressure": 320,
        "compressionRatio": 2.91,
        "compressionStatus": "alert",
        "currentStatus": "ok",
        "disclaimers": []
      }
    },
    {
      "domain": "reversing_valve",
      "ok": false,
      "findings": [],
      "details": {
        "status": "alert",
        "values": {
          "portTemps": {
            "dischargeInlet": 135,
            "suctionReturn": 52,
            "indoorCoilLine": 80,
            "outdoorCoilLine": 60
          },
          "tempSpread": 83,
          "hotPorts": [
            "discharge"
          ],
          "coldPorts": [
            "suction",
            "indoor",
            "outdoor"
          ],
          "compressionRatio": 2.91
        },
        "flags": {
          "patternMatch": "stuck"
        },
        "requestedMode": "cooling",
        "portTemps": {
          "dischargeInlet": 135,
          "suctionReturn": 52,
          "indoorCoilLine": 80,
          "outdoorCoilLine": 60
        },
        "tempSpread": 83,
        "hotPorts": [
          "discharge"
        ],
        "coldPorts": [
          "suction",
          "indoor",
          "outdoor"
        ],
        "patternMatch": "stuck",
        "compressionRatio": 2.91,
        "recommendations": []
      }
    }
  ],
  "overallStatus": "alert"
}
```

### Recommendations Generated (4)
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined
- **undefined**: undefined

---

