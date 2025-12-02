# DiagX File Tree

> NOTE: The canonical internal file-tree and process documents have been consolidated under `docs/process/FILE_TREE.md`.
This top-level `FILE_TREE.md` remains as the public master copy; internal developer-facing file-tree and process documents live under `docs/process/`.
This document shows the project structure with short descriptions and live GitHub links. It is focused on all files that matter for diagnostics, engines, modules, orchestration, and tests.

---

## Root Files

| File | Description |
|------|-------------|
| [COMMANDS.md](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/COMMANDS.md) | Common CLI commands reference |
| [FILE_TREE.md](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/FILE_TREE.md) | This file – project structure map |
| [LICENSE](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/LICENSE) | DiagX Internal License (DIL-1.0) |
| [README.md](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/README.md) | Project overview and getting started |
| [package.json](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/package.json) | Dependencies and npm scripts |
| [tsconfig.json](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/tsconfig.json) | TypeScript compiler config |
| [tsconfig.eslint.json](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/tsconfig.eslint.json) | ESLint TypeScript config |
| [vitest.config.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/vitest.config.ts) | Vitest test runner config |
| [.eslintrc.cjs](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/.eslintrc.cjs) | ESLint configuration |
| [.prettierrc](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/.prettierrc) | Prettier code formatting |
| [.gitignore](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/.gitignore) | Git ignore patterns |

---

## Folders

| Folder | Description |
|--------|-------------|
| [docs/](https://github.com/michaelaaron81/DiagX/tree/phase-3.1-profile-runner/docs) | Documentation, audits, changelogs, plans |
| [docs/engines/](https://github.com/michaelaaron81/DiagX/tree/phase-3.1-profile-runner/docs/engines) | Engine contract documentation (IP-sensitive) |
| [scripts/](https://github.com/michaelaaron81/DiagX/tree/phase-3.1-profile-runner/scripts) | Utility and dev scripts |
| [src/](https://github.com/michaelaaron81/DiagX/tree/phase-3.1-profile-runner/src) | Source code – modules, engines, types |
| [test/](https://github.com/michaelaaron81/DiagX/tree/phase-3.1-profile-runner/test) | Vitest test files |

---

## docs/engines/ (Phase 3.3 — IP-Sensitive)

| File | Description |
|------|-------------|
| [airside.engine.md](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/docs/engines/airside.engine.md) | Airside diagnostic engine contract |
| [refrigeration.engine.md](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/docs/engines/refrigeration.engine.md) | Refrigeration diagnostic engine contract |
| [hydronic.engine.md](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/docs/engines/hydronic.engine.md) | Hydronic diagnostic engine contract |
| [condenserApproach.engine.md](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/docs/engines/condenserApproach.engine.md) | Condenser approach diagnostic engine contract |
| [reversingValve.engine.md](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/docs/engines/reversingValve.engine.md) | Reversing valve diagnostic engine contract |
| [scrollCompressor.engine.md](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/docs/engines/scrollCompressor.engine.md) | Scroll compressor diagnostic engine contract |
| [recipCompressor.engine.md](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/docs/engines/recipCompressor.engine.md) | Reciprocating compressor diagnostic engine contract |

---

## src/ Structure

### src/cli/
| File | Description |
|------|-------------|
| [demo.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/cli/demo.ts) | Demo CLI runner |
| [localOverrides.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/cli/localOverrides.ts) | Local override configuration |
| [pt.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/cli/pt.ts) | Pressure-temperature CLI tool |

### src/measurements/
| File | Description |
|------|-------------|
| [types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/measurements/types.ts) | Measurement type definitions |

### src/profiles/
| File | Description |
|------|-------------|
| [types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/profiles/types.ts) | Profile type definitions |

### src/schema/
| File | Description |
|------|-------------|
| [recommendation.schema.json](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/schema/recommendation.schema.json) | JSON schema for recommendations |

### src/shared/
| File | Description |
|------|-------------|
| [combinedProfileResult.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/shared/combinedProfileResult.types.ts) | Combined profile result type |
| [completeness.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/shared/completeness.ts) | Completeness classification logic |
| [moduleResult.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/shared/moduleResult.types.ts) | Generic ModuleResult<V,F> and domain aliases |
| [profileInput.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/shared/profileInput.types.ts) | ProfileInputSchema and CompletenessLevel |
| [recommendation.schema.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/shared/recommendation.schema.ts) | Recommendation schema utilities |
| [validation.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/shared/validation.types.ts) | Validation type definitions |
| [wshp.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/shared/wshp.types.ts) | WSHP shared types |

### src/validation/
| File | Description |
|------|-------------|
| [tierA.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/validation/tierA.ts) | Tier-A validation (6 checks) |

### src/wshp/
| File | Description |
|------|-------------|
| [index.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/wshp/index.ts) | WSHP module entry point |
| [wshp.config.refrigeration.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/wshp/wshp.config.refrigeration.ts) | Refrigeration configuration |
| [wshp.diagx.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/wshp/wshp.diagx.ts) | WSHP orchestrator (main runner) |
| [wshp.profile.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/wshp/wshp.profile.ts) | WSHP profile logic |

---

## src/modules/ Structure

### src/modules/airside/
| File | Description |
|------|-------------|
| [airside.engine.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/airside/airside.engine.ts) | Airside diagnostic engine |
| [airside.module.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/airside/airside.module.ts) | Airside module entry |
| [airside.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/airside/airside.types.ts) | Airside type definitions |
| [airside.validation.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/airside/airside.validation.ts) | Airside validation logic |

### src/modules/compressor/
| File | Description |
|------|-------------|
| [recip.engine.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/compressor/recip.engine.ts) | Reciprocating compressor engine |
| [recip.module.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/compressor/recip.module.ts) | Reciprocating compressor module |
| [recip.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/compressor/recip.types.ts) | Reciprocating compressor types |
| [scroll.engine.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/compressor/scroll.engine.ts) | Scroll compressor engine |
| [scroll.module.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/compressor/scroll.module.ts) | Scroll compressor module |
| [scroll.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/compressor/scroll.types.ts) | Scroll compressor types |

### src/modules/condenserApproach/
| File | Description |
|------|-------------|
| [condenserApproach.engine.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/condenserApproach/condenserApproach.engine.ts) | Condenser approach engine |
| [condenserApproach.module.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/condenserApproach/condenserApproach.module.ts) | Condenser approach module |
| [condenserApproach.recommendations.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/condenserApproach/condenserApproach.recommendations.ts) | Condenser approach recommendations |
| [condenserApproach.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/condenserApproach/condenserApproach.types.ts) | Condenser approach types |

### src/modules/hydronic/
| File | Description |
|------|-------------|
| [hydronic.engine.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/hydronic/hydronic.engine.ts) | Hydronic engine |
| [hydronic.module.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/hydronic/hydronic.module.ts) | Hydronic module |
| [hydronic.recommendations.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/hydronic/hydronic.recommendations.ts) | Hydronic recommendations |
| [hydronic.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/hydronic/hydronic.types.ts) | Hydronic types |
| [hydronic-source.engine.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/hydronic/hydronic-source.engine.ts) | Hydronic source engine |
| [hydronic-source.module.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/hydronic/hydronic-source.module.ts) | Hydronic source module |
| [hydronic-source.recommendations.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/hydronic/hydronic-source.recommendations.ts) | Hydronic source recommendations |
| [hydronic-source.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/hydronic/hydronic-source.types.ts) | Hydronic source types |

### src/modules/refrigeration/
| File | Description |
|------|-------------|
| [ptUtils.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/refrigeration/ptUtils.ts) | Pressure-temperature utilities |
| [refrigerantData.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/refrigeration/refrigerantData.ts) | Refrigerant data tables |
| [refrigeration.domain.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/refrigeration/refrigeration.domain.ts) | Refrigeration domain logic |
| [refrigeration.engine.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/refrigeration/refrigeration.engine.ts) | Refrigeration diagnostic engine |
| [refrigeration.measurements.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/refrigeration/refrigeration.measurements.ts) | Refrigeration measurements |
| [refrigeration.module.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/refrigeration/refrigeration.module.ts) | Refrigeration module entry |
| [refrigeration.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/refrigeration/refrigeration.types.ts) | Refrigeration type definitions |
| [refrigeration.validation.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/refrigeration/refrigeration.validation.ts) | Refrigeration validation logic |

### src/modules/reversingValve/
| File | Description |
|------|-------------|
| [reversing.engine.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/reversingValve/reversing.engine.ts) | Reversing valve engine |
| [reversing.module.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/reversingValve/reversing.module.ts) | Reversing valve module |
| [reversing.types.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/src/modules/reversingValve/reversing.types.ts) | Reversing valve types |

---

## scripts/

| File | Description |
|------|-------------|
| [check-oem.js](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/scripts/check-oem.js) | OEM check script |
| [consolidate-audit.js](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/scripts/consolidate-audit.js) | Audit consolidation |
| [consolidate-under-review.js](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/scripts/consolidate-under-review.js) | Under-review consolidation |
| [recommendation-gap-scan.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/scripts/recommendation-gap-scan.ts) | Recommendation gap scanner |
| [run-airside-test.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/scripts/run-airside-test.ts) | Airside test runner |
| [run-combined-profile.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/scripts/run-combined-profile.ts) | Combined profile test runner |
| [run-recip-debug.ts](https://github.com/michaelaaron81/DiagX/blob/phase-3.1-profile-runner/scripts/run-recip-debug.ts) | Reciprocating debug runner |

---

*Last updated: 2025-12-01 – Phase 3.1 Shared Types Implementation*

