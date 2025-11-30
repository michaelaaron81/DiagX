> NOTE: The canonical internal file-tree and process documents have been consolidated under `docs/process/FILE_TREE.md`.

This top-level `FILE_TREE.md` remains as the public master copy; internal developer-facing file-tree and process documents live under `docs/process/`.

This document shows the project structure with short descriptions and live GitHub links. It is focused on all files that matter for diagnostics, engines, modules, orchestration, and tests.

---

## High-Level Structure

```text
Diagx-Omen/
├─ .eslintrc.cjs
├─ .git/
├─ .prettierrc
├─ .vscode/
├─ dist/
├─ docs/
├─ (deleted) Engines to be extracted/
├─ node_modules/
├─ scripts/
├─ src/
│  ├─ cli/
│  ├─ modules/
│  ├─ shared/
│  └─ wshp/
├─ test/
│  ├─ fixtures/
│  └─ *.test.ts
├─ package.json
├─ package-lock.json
├─ README.md
├─ Roadmap.docx
└─ tsconfig.json
```

---

## Root Files

- `README.md` – project overview and usage notes  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/README.md

 - `docs/process/Roadmap.docx` – roadmap / planning document (internal)  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/process/Roadmap.docx

- `package.json` – Node/TypeScript project manifest and scripts  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/package.json

- `package-lock.json` – exact dependency lockfile  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/package-lock.json

- `tsconfig.json` – TypeScript compiler configuration  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/tsconfig.json

- `.eslintrc.cjs` – ESLint configuration  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/.eslintrc.cjs

- `.prettierrc` – Prettier formatting configuration  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/.prettierrc

- `.vscode/` – workspace/editor settings for VS Code  
  https://github.com/michaelaaron81/Diagx-Omen/tree/main/.vscode

- `dist/` – compiled output (when `tsc` build is run)  
  https://github.com/michaelaaron81/Diagx-Omen/tree/main/dist

- `.git/` – git metadata (not browsed in GitHub UI; internal to git)

---

## `docs/`

```text
docs/
├─ audits/
│  ├─ Test_Run_Vitest_2025-11-29.md
│  ├─ Test_Run_Vitest_2025-11-29-Integrity-Report.md
│  ├─ Combined_Profile_Stress_Test_Audit_2025-11-29.md
│  └─ Integrity_Tests.md
├─ engines/
│  ├─ DiagX_Engines_Inventory.md
│  └─ Engines_Core_Spec.md
├─ NO_OEM_IOM.md
├─ CHANGELOG.md
├─ DiagX_engineer_seed_V2.md
├─ DiagX_master_seed_V4.md
├─ DiagX_Safety_Manual_Outline.md
├─ Plan_to_fix_existing_integrity_issues.md
├─ Test_Run_Vitest_2025-11-29.md
└─ Testing limits.md
```

 - `docs/process/NO_OEM_IOM.md` – policy on excluding OEM/IOM tables from the repo  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/process/NO_OEM_IOM.md

- `docs/process/DiagX_engineer_seed_V2.md` – engineer-facing seed (V2) defining how the DiagX engine should behave and be used during development  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/process/DiagX_engineer_seed_V2.md

- `docs/process/DiagX_master_seed_V4.md` – master seed V4; canonical product, domain, and behavior spec for DiagX  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/process/DiagX_master_seed_V4.md

 - `docs/process/DiagX_Safety_Manual_Outline.md` – section-only safety manual outline  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/process/DiagX_Safety_Manual_Outline.md

 - `docs/process/Local_Editor_Guardrails.md` – local editor / VS Code guardrails for DiagX  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/process/Local_Editor_Guardrails.md

- `docs/CHANGELOG.md` – high-level human-readable changelog  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/CHANGELOG.md

 - `docs/audits/Test_Run_Vitest_2025-11-29.md` – detailed Vitest run and scenario matrix log  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/audits/Test_Run_Vitest_2025-11-29.md

 - `docs/audits/Test_Run_Vitest_2025-11-29-Integrity-Report.md` – integrity report and final test verification for 2025-11-29  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/audits/Test_Run_Vitest_2025-11-29-Integrity-Report.md

 - `docs/inventory/DiagX_Engines_Inventory.md` – canonical list of engine entry points and inventory used during normalization  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/inventory/DiagX_Engines_Inventory.md

 - `docs/inventory/Engines_Core_Spec.md` – core engine result contract and normalization guidance (EngineResult<V,F>)  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/inventory/Engines_Core_Spec.md

 - `docs/plans/Plan_to_fix_existing_integrity_issues.md` – follow-up plan and TODOs discovered during integrity sweep  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/plans/Plan_to_fix_existing_integrity_issues.md

- `docs/Integrity_Tests.md` – integrity test log (TypeScript build, test runs, recommendations, fixes applied)  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/Integrity_Tests.md

- `docs/Testing limits.md` – minimal note marking testing limits for this environment  
  https://github.com/michaelaaron81/Diagx-Omen/blob/main/docs/Testing%20limits.md

---

## `test/` – Tests and Fixtures

```text
test/
├─ airside.engine.full.test.ts
├─ airside.module.test.ts
├─ airside.recommendations.test.ts
├─ airside.validation.test.ts
├─ compressor.recip.engine.full.test.ts
├─ compressor.recip.module.test.ts
├─ compressor.recip.recommendations.test.ts
├─ compressor.scroll.engine.full.test.ts
├─ compressor.scroll.module.test.ts
├─ compressor.scroll.recommendations.test.ts
├─ localOverrides.test.ts
├─ refrigeration.engine.full.test.ts
├─ refrigeration.engine.test.ts
├─ refrigeration.ptoverride.test.ts
├─ refrigeration.ptutils.test.ts
├─ refrigeration.recommendations.test.ts
├─ refrigeration.validation.test.ts
├─ reversingvalve.engine.full.test.ts
├─ reversingvalve.module.test.ts
├─ reversingvalve.recommendations.test.ts
└─ fixtures/
   ├─ airside/
   ├─ compressor/
   ├─ refrigeration/
   └─ reversingValve/
```

Key tests (each has its own JSON fixtures):

- Airside:
  - `airside.engine.full.test.ts`, `airside.module.test.ts` – airside engine/module behavior  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/airside.engine.full.test.ts  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/airside.module.test.ts  
  - `airside.validation.test.ts` – airside measurement validation behavior  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/airside.validation.test.ts  
  - `airside.recommendations.test.ts` – airside recommendation helper behavior  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/airside.recommendations.test.ts

- Compressors:
  - `compressor.recip.engine.full.test.ts`, `compressor.recip.module.test.ts`, `compressor.recip.recommendations.test.ts` – recip compressor engine, module, and recommendation generator  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/compressor.recip.engine.full.test.ts  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/compressor.recip.module.test.ts  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/compressor.recip.recommendations.test.ts  
  - `compressor.scroll.engine.full.test.ts`, `compressor.scroll.module.test.ts`, `compressor.scroll.recommendations.test.ts` – scroll compressor diagnostics and recommendations  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/compressor.scroll.engine.full.test.ts  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/compressor.scroll.module.test.ts  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/compressor.scroll.recommendations.test.ts

- Refrigeration:
  - `refrigeration.engine.full.test.ts`, `refrigeration.engine.test.ts` – refrigeration engine and WSHP wrapper behavior  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/refrigeration.engine.full.test.ts  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/refrigeration.engine.test.ts  
  - `refrigeration.ptoverride.test.ts`, `refrigeration.ptutils.test.ts` – PT overrides and PT table validation  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/refrigeration.ptoverride.test.ts  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/refrigeration.ptutils.test.ts  
  - `refrigeration.validation.test.ts` – refrigeration measurement validation behavior  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/refrigeration.validation.test.ts  
  - `refrigeration.recommendations.test.ts` – refrigeration recommendation helper behavior  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/refrigeration.recommendations.test.ts

- Reversing valve:
  - `reversingvalve.engine.full.test.ts`, `reversingvalve.module.test.ts` – reversing valve engine/module tests  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/reversingvalve.engine.full.test.ts  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/reversingvalve.module.test.ts  
  - `reversingvalve.recommendations.test.ts` – reversing valve recommendation helper behavior  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/reversingvalve.recommendations.test.ts

- Helpers:
  - `localOverrides.test.ts` – ensures local PT overrides behave as designed  
    https://github.com/michaelaaron81/Diagx-Omen/blob/main/test/localOverrides.test.ts

Fixtures:

- `test/fixtures/airside/*.json` – nominal/low-flow/frozen airside scenarios  
  https://github.com/michaelaaron81/Diagx-Omen/tree/main/test/fixtures/airside

- `test/fixtures/compressor/recip/*.json`, `test/fixtures/compressor/scroll/*.json` – recip & scroll compressor cases  
  https://github.com/michaelaaron81/Diagx-Omen/tree/main/test/fixtures/compressor

- `test/fixtures/refrigeration/*.json` – refrigeration charge and operating state examples  
  https://github.com/michaelaaron81/Diagx-Omen/tree/main/test/fixtures/refrigeration

- `test/fixtures/reversingValve/*.json` – reversing valve pattern cases (nominal, stuck, reversed, partial leak)  
  https://github.com/michaelaaron81/Diagx-Omen/tree/main/test/fixtures/reversingValve

