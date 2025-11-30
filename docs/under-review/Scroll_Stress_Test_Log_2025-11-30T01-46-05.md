# Scroll Compressor Engine Stress Test Log

Generated at: 2025-11-30T01:46:05.140Z

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
    "dischargeSuperheat": 120,
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
  "dischargeSuperheat": 120,
  "currentDraw": 8,
  "currentStatus": "ok",
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **undefined**: undefined

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
    "dischargeSuperheat": 120,
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
  "dischargeSuperheat": 120,
  "currentDraw": 14,
  "currentStatus": "critical",
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **undefined**: undefined

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
    "dischargeSuperheat": 240,
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
  "dischargeSuperheat": 240,
  "currentDraw": 9,
  "currentStatus": "ok",
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **undefined**: undefined

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
    "dischargeSuperheat": 120,
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
  "dischargeSuperheat": 120,
  "currentDraw": 3,
  "currentStatus": "warning",
  "disclaimers": []
}
```

### Recommendations Generated (1)
- **undefined**: undefined

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
    "dischargeSuperheat": 240,
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
  "dischargeSuperheat": 240,
  "currentDraw": 16,
  "currentStatus": "critical",
  "disclaimers": []
}
```

### Recommendations Generated (2)
- **undefined**: undefined
- **undefined**: undefined

---

