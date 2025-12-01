# Consolidated Test & Lint Report — 2025-11-30

Scanned / generated: 2025-11-30T23:34:49Z (local test runs)

Summary
-------
- Test runner: Vitest
- TypeScript build: tsc (tsconfig.json)
- Lint: ESLint (strict; run with --max-warnings=0)

Overall results (most recent run)
---------------------------------
- Tests: 42 files / 118 tests — ALL PASSED
- TypeScript build: OK (no compile errors)
- ESLint: OK (no rule errors or warnings; note: tool printed an advisory about the TypeScript version used by @typescript-eslint)

Generated artifacts (latest run, all under main branch)
---------------------------------------------------
- docs/audits/Combined_Profile_Refrigerant_Stress_Test_Log_2025-11-30T23-34-49.md
- docs/under-review/Combined_Profile_Stress_Test_Audit_2025-11-30T23-34-49.md
- docs/under-review/Recip_Stress_Test_Log_2025-11-30T23-34-48.md
- docs/under-review/Scroll_Stress_Test_Log_2025-11-30T23-34-49.md
- docs/under-review/Recommendation_Gaps_2025-11-30T23-34-49.md

Direct links (open in GitHub)
-----------------------------
- Combined (refrigerant) report: https://github.com/michaelaaron81/DiagX/blob/main/docs/audits/Combined_Profile_Refrigerant_Stress_Test_Log_2025-11-30T23-34-49.md
- Combined audit (under-review): https://github.com/michaelaaron81/DiagX/blob/main/docs/under-review/Combined_Profile_Stress_Test_Audit_2025-11-30T23-34-49.md
- Recip stress log: https://github.com/michaelaaron81/DiagX/blob/main/docs/under-review/Recip_Stress_Test_Log_2025-11-30T23-34-48.md
- Scroll stress log: https://github.com/michaelaaron81/DiagX/blob/main/docs/under-review/Scroll_Stress_Test_Log_2025-11-30T23-34-49.md
- Recommendation gaps scan: https://github.com/michaelaaron81/DiagX/blob/main/docs/under-review/Recommendation_Gaps_2025-11-30T23-34-49.md

Notes and next steps
--------------------
- ESLint output included an advisory that the installed TypeScript (5.9.3) is newer than the supported range of @typescript-eslint/typescript-estree; this is informational and can be addressed by aligning the tool versions if desired.
- The logs in docs/under-review are machine-generated and should be reviewed before promoting to docs/audits permanently. The combined refrigerant report has already been promoted into docs/audits/.
- If you'd like, I can:
  - promote selected under-review artifacts into docs/audits/
  - add a CI step to automatically generate and publish a consolidated report as a release artifact
  - add a README badge linking to the latest consolidated report

---

Generated automatically by the repo helper on 2025-11-30.
