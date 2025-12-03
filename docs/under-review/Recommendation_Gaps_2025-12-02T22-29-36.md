# Recommendation Gaps Scan — 2025-12-02T22:29:36

Scanned at: 2025-12-02T22:29:36.014Z

{
  "scannedAt": "2025-12-02T22:29:36.014Z",
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