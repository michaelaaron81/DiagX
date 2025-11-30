# Recommendation Gaps Scan — 2025-11-29T17:51:14

Scanned at: 2025-11-29T17:51:14.540Z

{
  "scannedAt": "2025-11-29T17:51:14.540Z",
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
      "recCount": 0,
      "gaps": [
        "No hydronic recommendations present for deltaT abnormal"
      ]
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
      "recCount": 0,
      "gaps": [
        "No hydronic recommendations present for deltaT abnormal"
      ]
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
      "recCount": 0,
      "gaps": [
        "No hydronic recommendations present for deltaT abnormal",
        "No hydronic recommendations present for flow abnormal"
      ]
    },
    {
      "engine": "condenser_approach",
      "scenario": "missing_pressure",
      "flags": {
        "approachStatus": "unknown",
        "subcoolingStatus": "unknown",
        "refrigerantProfile": "standard",
        "disclaimers": [
          "Condenser approach analysis uses generic thermodynamic properties for the selected refrigerant."
        ]
      },
      "recCount": 0,
      "gaps": [
        "No recommendation addressing condenser approach",
        "No recommendation addressing condenser subcooling"
      ]
    },
    {
      "engine": "condenser_approach",
      "scenario": "bad_approach",
      "flags": {
        "approachStatus": "critical",
        "subcoolingStatus": "ok",
        "refrigerantProfile": "standard",
        "disclaimers": [
          "Condenser approach analysis uses generic thermodynamic properties for the selected refrigerant."
        ]
      },
      "recCount": 0,
      "gaps": [
        "No recommendation addressing condenser approach"
      ]
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
      "gaps": []
    }
  ]
}