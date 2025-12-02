# DiagX File Tree

> NOTE: The canonical internal file-tree and process documents have been consolidated under `docs/process/FILE_TREE.md`.

This top-level `FILE_TREE.md` remains as the public master copy; internal developer-facing file-tree and process documents live under `docs/process/`.

This document shows the project structure with short descriptions and live GitHub links. It is focused on all files that matter for diagnostics, engines, modules, orchestration, and tests.

---

## High-Level Structure

```text
DiagX/
├── .eslintrc.cjs
├── .git/
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .prettierrc
├── .vscode/
│   └── settings.json
├── dist/
├── docs/
│   ├── Archives/
│   │   ├── DiagX_engineer_seed_V1.md
│   │   └── DiagX_master_seed_V3.md
│   ├── audits/
│   │   ├── Combined_Profile_Refrigerant_Stress_Test_Log_2025-11-30T23-34-49.md
│   │   └── Consolidated_Test_and_Lint_Report_2025-11-30.md
│   ├── backups/
│   │   └── 2025-11-29/
│   │       └── docs_backup_2025-11-29.zip
│   ├── CHANGELOG.md
│   ├── engines/
│   │   ├── DiagX_Engines_Inventory.md
│   │   ├── Engines_Core_Spec.md
│   │   └── README.md
│   ├── gap-scans/
│   │   ├── 1_Recommendation_Gaps_2025-11-29T15-07-11.md
│   │   ├── 3_Recommendation_Gaps_2025-11-29T15-15-36.md
│   │   ├── 4_Recommendation_Gaps_2025-11-29T17-51-14.md
│   │   ├── 5_Recommendation_Gaps_2025-11-29T18-10-27.md
│   │   ├── README.md
│   │   └── Recommendation_Gaps_*.md
│   ├── Gap_Scan_Run_Initial.json
│   ├── inventory/
│   │   ├── DiagX_Engines_Inventory.md
│   │   ├── Engines_Core_Spec.md
│   │   ├── FILE_TREE.md
│   │   └── README.md
│   ├── NO_OEM_IOM.md
│   ├── plans/
│   │   ├── handoff.md
│   │   ├── Instructions.md
│   │   ├── Plan_to_fix_existing_integrity_issues.md
│   │   └── README.md
│   ├── PR_BODY_phase-2.4-cleanup.md
│   ├── process/
│   │   ├── CHANGELOG.md
│   │   ├── DiagX_engineer_seed_V2.md
│   │   ├── DiagX_master_seed_V4.md
│   │   ├── DiagX_Safety_Manual_Outline.md
│   │   ├── FILE_TREE.md
│   │   ├── Local_Editor_Guardrails.md
│   │   ├── NO_OEM_IOM.md
│   │   ├── Phase.md
│   │   ├── Plan_to_fix_existing_integrity_issues.md
│   │   ├── README.md
│   │   ├── Roadmap.md
│   │   └── Testing limits.md
│   ├── recommendations/
│   │   ├── README.md
│   │   ├── Recip_FailureMode_Map.md
│   │   └── Recommendation_Suggestions_2025-11-29.md
│   ├── suggestions/
│   │   └── Recommendation_System_Expansion_Plan.md
│   ├── Test_Run_Vitest_2025-11-29T19-18-35.json
│   └── under-review/
│       ├── Combined_Profile_Stress_Test_Audit_*.md
│       ├── Recip_Stress_Test_Log_*.md
│       ├── Recommendation_Gaps_*.md
│       └── Scroll_Stress_Test_Log_*.md
├── FILE_TREE.md
├── node_modules/
├── package-lock.json
├── package.json
├── README.md
├── scripts/
│   ├── check-oem.js
│   ├── consolidate-audit.js
│   ├── recommendation-gap-scan.ts
│   ├── run-airside-test.ts
│   ├── run-combined-profile.ts
│   └── run-recip-debug.ts
├── src/
│   ├── cli/
│   │   ├── demo.ts
│   │   ├── localOverrides.ts
│   │   └── pt.ts
│   ├── measurements/
│   │   └── types.ts
│   ├── modules/
│   │   ├── airside/
│   │   │   ├── airside.engine.ts
│   │   │   ├── airside.module.ts
│   │   │   ├── airside.types.ts
│   │   │   └── airside.validation.ts
│   │   ├── compressor/
│   │   │   ├── recip.engine.ts
│   │   │   ├── recip.module.ts
│   │   │   ├── recip.types.ts
│   │   │   ├── scroll.engine.ts
│   │   │   ├── scroll.module.ts
│   │   │   └── scroll.types.ts
│   │   ├── condenserApproach/
│   │   │   ├── condenserApproach.engine.ts
│   │   │   ├── condenserApproach.module.ts
│   │   │   ├── condenserApproach.recommendations.ts
│   │   │   └── condenserApproach.types.ts
│   │   ├── hydronic/
│   │   │   ├── hydronic-source.engine.ts
│   │   │   ├── hydronic-source.module.ts
│   │   │   ├── hydronic-source.recommendations.ts
│   │   │   ├── hydronic-source.types.ts
│   │   │   ├── hydronic.engine.ts
│   │   │   ├── hydronic.module.ts
│   │   │   ├── hydronic.recommendations.ts
│   │   │   └── hydronic.types.ts
│   │   ├── placeholder.txt
│   │   ├── refrigeration/
│   │   │   ├── ptUtils.ts
│   │   │   ├── refrigerantData.ts
│   │   │   ├── refrigeration.domain.ts
│   │   │   ├── refrigeration.engine.ts
│   │   │   ├── refrigeration.measurements.ts
│   │   │   ├── refrigeration.module.ts
│   │   │   ├── refrigeration.types.ts
│   │   │   └── refrigeration.validation.ts
│   │   └── reversingValve/
│   │       ├── reversing.engine.ts
│   │       ├── reversing.module.ts
│   │       └── reversing.types.ts
│   ├── profiles/
│   │   └── types.ts
│   ├── schema/
│   │   └── recommendation.schema.json
│   ├── shared/
│   │   ├── placeholder.txt
│   │   ├── recommendation.schema.ts
│   │   ├── validation.types.ts
│   │   └── wshp.types.ts
│   └── wshp/
│       ├── index.ts
│       ├── placeholder.txt
│       ├── wshp.config.refrigeration.ts
│       ├── wshp.diagx.ts
│       └── wshp.profile.ts
├── test/
│   ├── airside.engine.full.test.ts
│   ├── airside.module.test.ts
│   ├── airside.recommendations.test.ts
│   ├── airside.validation.test.ts
│   ├── combined.profile.refrigerant.stress.test.ts
│   ├── combined.profile.stress.test.ts
│   ├── compressor.recip.engine.full.test.ts
│   ├── compressor.recip.module.test.ts
│   ├── compressor.recip.recommendations.test.ts
│   ├── compressor.recip.stress.test.ts
│   ├── compressor.scroll.engine.full.test.ts
│   ├── compressor.scroll.module.test.ts
│   ├── compressor.scroll.recommendations.test.ts
│   ├── compressor.scroll.stress.test.ts
│   ├── condenser-approach.engine.full.test.ts
│   ├── condenser-approach.recommendations.test.ts
│   ├── condenserApproach.engine.full.test.ts
│   ├── condenserApproach.module.test.ts
│   ├── condenserApproach.recommendations.test.ts
│   ├── debug.airside.badvalues.test.ts
│   ├── debug.hydronic.attach.test.ts
│   ├── fixtures/
│   │   ├── airside/
│   │   │   ├── frozen.json
│   │   │   ├── lowflow.json
│   │   │   └── nominal.json
│   │   ├── compressor/
│   │   │   ├── recip/
│   │   │   │   ├── highcurrent.json
│   │   │   │   ├── lowcompression.json
│   │   │   │   └── nominal.json
│   │   │   └── scroll/
│   │   │       ├── badcompression.json
│   │   │       ├── highcurrent.json
│   │   │       └── nominal.json
│   │   ├── refrigeration/
│   │   │   ├── demo.json
│   │   │   ├── nominal.json
│   │   │   ├── overcharge.json
│   │   │   └── undercharge.json
│   │   └── reversingValve/
│   │       ├── nominal.json
│   │       ├── partial_leak.json
│   │       ├── reversed.json
│   │       └── stuck.json
│   ├── helpers/
│   │   └── recommendationGuards.ts
│   ├── hydronic-source.engine.full.test.ts
│   ├── hydronic-source.module.test.ts
│   ├── hydronic-source.recommendations.test.ts
│   ├── hydronic.engine.full.test.ts
│   ├── hydronic.module.test.ts
│   ├── hydronic.recommendations.test.ts
│   ├── integration/
│   │   └── forbidden-in-dist.test.ts
│   ├── localOverrides.test.ts
│   ├── recommendation-gap-scan.test.ts
│   ├── recommendation.safety.test.ts
│   ├── refrigeration.engine.full.test.ts
│   ├── refrigeration.engine.test.ts
│   ├── refrigeration.ptoverride.test.ts
│   ├── refrigeration.ptutils.test.ts
│   ├── refrigeration.recommendations.test.ts
│   ├── refrigeration.validation.test.ts
│   ├── reversingvalve.engine.full.test.ts
│   ├── reversingvalve.module.test.ts
│   ├── reversingvalve.recommendations.test.ts
│   ├── validation.human-error.test.ts
│   └── wshp.orchestrator.correlation.test.ts
├── tsconfig.eslint.json
├── tsconfig.json
└── vitest.config.ts
```

---

## Top-Level Folders (GitHub Links)

- [`.github/`](https://github.com/michaelaaron81/DiagX/tree/main/.github) — GitHub workflows and PR templates
- [`.vscode/`](https://github.com/michaelaaron81/DiagX/tree/main/.vscode) — VS Code workspace settings
- [`dist/`](https://github.com/michaelaaron81/DiagX/tree/main/dist) — Compiled output (when `tsc` build is run)
- [`docs/`](https://github.com/michaelaaron81/DiagX/tree/main/docs) — Documentation, audits, process guides, and archives
- [`scripts/`](https://github.com/michaelaaron81/DiagX/tree/main/scripts) — Utility scripts for testing and gap scanning
- [`src/`](https://github.com/michaelaaron81/DiagX/tree/main/src) — Source code: CLI, modules, shared types, and WSHP orchestration
- [`test/`](https://github.com/michaelaaron81/DiagX/tree/main/test) — Test suites and fixtures

---

## Root Files

- [`README.md`](https://github.com/michaelaaron81/DiagX/blob/main/README.md) — Project overview and usage notes
- [`package.json`](https://github.com/michaelaaron81/DiagX/blob/main/package.json) — Node/TypeScript project manifest and scripts
- [`package-lock.json`](https://github.com/michaelaaron81/DiagX/blob/main/package-lock.json) — Exact dependency lockfile
- [`tsconfig.json`](https://github.com/michaelaaron81/DiagX/blob/main/tsconfig.json) — TypeScript compiler configuration
- [`tsconfig.eslint.json`](https://github.com/michaelaaron81/DiagX/blob/main/tsconfig.eslint.json) — TypeScript config for ESLint
- [`vitest.config.ts`](https://github.com/michaelaaron81/DiagX/blob/main/vitest.config.ts) — Vitest test runner configuration
- [`.eslintrc.cjs`](https://github.com/michaelaaron81/DiagX/blob/main/.eslintrc.cjs) — ESLint configuration
- [`.prettierrc`](https://github.com/michaelaaron81/DiagX/blob/main/.prettierrc) — Prettier formatting configuration
- [`.gitignore`](https://github.com/michaelaaron81/DiagX/blob/main/.gitignore) — Files/paths excluded from git

