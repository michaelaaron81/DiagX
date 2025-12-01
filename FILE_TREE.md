> NOTE: The canonical internal file-tree and process documents have been consolidated under `docs/process/FILE_TREE.md`.

This top-level `FILE_TREE.md` remains as the public master copy; internal developer-facing file-tree and process documents live under `docs/process/`.

This document shows the project structure with short descriptions and live GitHub links. It is focused on all files that matter for diagnostics, engines, modules, orchestration, and tests.

---

## High-Level Structure

```text
DiagX/
 .eslintrc.cjs
 .git/
 .github/
 .gitignore
 .prettierrc
 .vscode/
 dist/
 docs/
 docs/backups/
 node_modules/
 scripts/
   check-oem.js
   run-combined-profile.ts
 src/
   cli/
   modules/
   shared/
   wshp/
 test/
   fixtures/
   *.test.ts
 package.json
 package-lock.json
 README.md
 Roadmap.docx
 tsconfig.json
 vitest.config.ts
```

---

## Root Files

- `README.md`  project overview and usage notes  
  https://github.com/michaelaaron81/DiagX/blob/main/README.md

- `.github/PULL_REQUEST_TEMPLATE.md`  PR template used by the repo  
  https://github.com/michaelaaron81/DiagX/blob/main/.github/PULL_REQUEST_TEMPLATE.md

- `package.json`  Node/TypeScript project manifest and scripts  
  https://github.com/michaelaaron81/DiagX/blob/main/package.json

- `package-lock.json`  exact dependency lockfile  
  https://github.com/michaelaaron81/DiagX/blob/main/package-lock.json

- `tsconfig.json`  TypeScript compiler configuration  
  https://github.com/michaelaaron81/DiagX/blob/main/tsconfig.json

  https://github.com/michaelaaron81/DiagX/blob/main/vitest.config.ts

- `.eslintrc.cjs`  ESLint configuration  
  https://github.com/michaelaaron81/DiagX/blob/main/.eslintrc.cjs

- `.prettierrc`  Prettier formatting configuration  
  https://github.com/michaelaaron81/DiagX/blob/main/.prettierrc

- `.vscode/`  workspace/editor settings for VS Code  
  https://github.com/michaelaaron81/DiagX/tree/main/.vscode

- `.gitignore`  files/paths excluded from git  
  https://github.com/michaelaaron81/DiagX/blob/main/.gitignore

- `dist/`  compiled output (when `tsc` build is run)  
  https://github.com/michaelaaron81/DiagX/tree/main/dist

- `.git/`  git metadata (not browsed in GitHub UI; internal to git)

---

## `docs/` (canonicalized)

```text
docs/
 audits/
 under-review/
 gap-scans/
 recommendations/
 inventory/
 engines/
 plans/
 process/
 backups/
 README.md
```

Notes and highlights:

- `docs/backups/`  archived snapshots and zips of the docs folder (e.g., `2025-11-29/docs_backup_2025-11-29.zip`)
  https://github.com/michaelaaron81/DiagX/tree/main/docs/backups

- `docs/process/NO_OEM_IOM.md`  policy on excluding OEM/IOM tables from the repo  
  https://github.com/michaelaaron81/DiagX/blob/main/docs/process/NO_OEM_IOM.md

`docs/process/DiagX_engineer_seed_V2.md`  engineer-facing seed and development guidance  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/process/DiagX_engineer_seed_V2.md

`docs/process/DiagX_master_seed_V4.md`  master seed V4; canonical product/domain behavior spec  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/process/DiagX_master_seed_V4.md

- `docs/process/Local_Editor_Guardrails.md`  local editor / VS Code guardrails for DiagX  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/process/Local_Editor_Guardrails.md

- `docs/CHANGELOG.md`  human-readable changelog  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/CHANGELOG.md

- `docs/audits/`  audit logs and test run reports (Vitest logs, integrity checks)

Recent generation artifacts (promoted into `docs/audits/`):

- `docs/audits/5_Test_Run_Summary_2025-11-29T18-10-27.md` — Generation 5 test + lint summary
- `docs/audits/5_Recip_Stress_Test_Log_2025-11-29T18-10-27.md` — Generation 5 recip compressor stress log (promoted)
- `docs/audits/5_Scroll_Stress_Test_Log_2025-11-29T18-10-28.md` — Generation 5 scroll compressor stress log (promoted)
- `docs/audits/5_Combined_Profile_Stress_Test_Audit_2025-11-29T18-10-27.md` — Generation 5 combined profile audit (promoted)
- `docs/audits/5_Combined_Profile_Refrigerant_Stress_Test_Log_2025-11-29T18-10-27.md` — Generation 5 refrigerant stress log (promoted)
- `docs/gap-scans/5_Recommendation_Gaps_2025-11-29T18-10-27.md` — Generation 5 recommendation gap-scan (promoted)

Recent artifacts (backup branch)
- `docs/audits/Engine_Test_Run_2025-11-29-20-48-37.md` — Engine test run summary and recommendations audit (added on backup/vitest-upgrade-2025-11-29)
- `docs/audits/coverage-final-2025-11-29T19-38-52.3504965-05-00.json` — v8 coverage JSON (archived)
- `docs/audits/lcov-2025-11-29T19-38-52.3504965-05-00.info` — LCOV coverage report (archived)

- `docs/under-review/`  staging area for machine-generated reports pending human review before promotion into `docs/audits/` or `docs/gap-scans/`

- `docs/inventory/DiagX_Engines_Inventory.md`  canonical list of engine entry points and inventory  
  https://github.com/michaelaaron81/DiagX/blob/main/docs/inventory/DiagX_Engines_Inventory.md

- `docs/inventory/Engines_Core_Spec.md`  core engine result contract and normalization guidance (EngineResult<V,F>)  
  https://github.com/michaelaaron81/DiagX/blob/main/docs/inventory/Engines_Core_Spec.md

- `docs/engines/README.md`  short pointer to canonical `docs/inventory` specs and engine authoring guides
  https://github.com/michaelaaron81/DiagX/blob/main/docs/engines/README.md

---

## `scripts/`

```text
scripts/
 check-oem.js
 recommendation-gap-scan.ts
 run-combined-profile.ts
 run-tests.sh (helper)
 ...
```

- `scripts/recommendation-gap-scan.ts`  searches scenarios for recommendation gaps and prints results  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/scripts/recommendation-gap-scan.ts

---

## `src/` (summary)

```text
 src/
  cli/
  modules/
    airside/
    hydronic/
    condenserApproach/
    compressor/
    refrigeration/
    reversingValve/
 shared/
 wshp/
```

- `src/shared/wshp.types.ts`  shared contracts including `EngineResult`, `Recommendation`, and `DiagnosticStatus`  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/src/shared/wshp.types.ts

---

## `test/`  Tests and Fixtures (representative)

```text
test/
 airside.*.test.ts
 compressor.*.test.ts
 refrigeration.*.test.ts
 reversingvalve.*.test.ts
 hydronic.*.test.ts
 condenserApproach.*.test.ts
 recommendation-gap-scan.test.ts
 combined.profile.stress.test.ts
 fixtures/*
```

Key tests with fixtures live under `test/fixtures/` for each domain (airside, compressor, refrigeration, reversingValve).

---

If you'd like, I can also:
- add an automated CI check that keeps this file up-to-date, or
- convert this file into a generated README that pulls the canonical canonical list from `docs/process/FILE_TREE.md` to avoid manual syncs.

