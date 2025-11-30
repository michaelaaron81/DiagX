# Reciprocating Compressor Engine Stress Test Log

Generated at: 2025-11-29T23:24:33.474Z

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
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined
- **undefined**: undefined

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
- **undefined**: undefined
- **undefined**: undefined

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
- **undefined**: undefined

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
- **undefined**: undefined

---

