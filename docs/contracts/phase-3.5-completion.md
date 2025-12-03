<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->

# Phase 3.5 — Engine Hardening & Freeze

**Completion Date:** 2025-12-02  
**Status:** COMPLETE

---

## Overview

Phase 3.5 implements engine hardening and freeze mechanisms to protect the
diagnostic engine codebase from unauthorized modifications. This phase
establishes the "no drift permitted" policy for all frozen components.

---

## Completed Steps

### Step 6: Engine Documentation Validator (EDV)

**Tool:** `tools/validate-engine-docs.ts`

Validates all engine documentation files against the 10-section schema:
1. Purpose
2. Inputs (Measurements)
3. Inputs (Profile Fields)
4. Outputs — Values
5. Outputs — Flags
6. Recommendations Produced
7. Status Mapping
8. Invariants (Architect-Defined)
9. Physics Core Dependencies
10. Validation Handshake

Also verifies:
- License block consistency
- No OEM or procedural content
- Physics function usage documented
- Flag/value description alignment

**Result:** All 7 engine docs pass validation.

---

### Step 7: Golden Test Matrix

**Output:** `docs/contracts/golden-test-matrix.md`

Generated from test suite output, this document contains:
- Test counts by domain
- File hashes for each test file
- Individual test hashes for drift detection

**Total Tests:** 135 (all passing)

---

### Step 8: Freeze Enforcer CI

**Workflow:** `.github/workflows/freeze.yml`

Protects the following file patterns:
- `src/modules/**/*.engine.ts`
- `src/**/*.types.ts`
- `src/wshp/wshp.diagx.ts`
- `src/physics/**/*.ts`

Override requires:
1. Architect review
2. `freeze-override-approved` label on PR

---

### Step 9: Kernel Fingerprint File

**Output:** `docs/contracts/ENGINE_FINGERPRINTS.json`

Contains SHA-256 hashes for:
- 8 engine files
- 13 type definition files
- 4 physics kernel files
- 1 orchestrator file

**Document Checksum:** Included for tamper detection

---

### Step 10: Documentation Mirror

All critical documentation mirrored to `docs/contracts/`:

| File | Source |
|------|--------|
| `airside.engine.md` | `docs/engines/` |
| `condenserApproach.engine.md` | `docs/engines/` |
| `hydronic.engine.md` | `docs/engines/` |
| `recipCompressor.engine.md` | `docs/engines/` |
| `refrigeration.engine.md` | `docs/engines/` |
| `reversingValve.engine.md` | `docs/engines/` |
| `scrollCompressor.engine.md` | `docs/engines/` |
| `engine_math_inventory.md` | `docs/phase-3.4/` |
| `kernel_api.md` | `docs/phase-3.4/` |
| `golden-test-matrix.md` | Generated |
| `ENGINE_FINGERPRINTS.json` | Generated |
| `DIL-1.0.txt` | `LICENSE` |

---

## Completion Criteria Verification

| Criterion | Status |
|-----------|--------|
| All physics removed from engines | ✅ |
| All engines call kernel exclusively | ✅ |
| All tests pass with 0 diffs | ✅ (135/135) |
| EDV passes all engine docs | ✅ (7/7) |
| Golden Test Matrix matches existing behavior | ✅ |
| Freeze enforcer active in CI | ✅ |
| Fingerprints match | ✅ |
| Documentation mirror complete | ✅ |

---

## Phase 3 Status

**FROZEN**

All eight completion criteria are met. Phase 3 is now frozen.

Proceed to Phase 4 (RTU + Split Systems) when ready.

---

## Tools Created

| Tool | Purpose |
|------|---------|
| `tools/validate-engine-docs.ts` | Validate engine documentation |
| `tools/generate-golden-matrix.ts` | Generate test matrix |
| `tools/generate-fingerprints.ts` | Generate integrity fingerprints |

---

## Next Steps

1. Merge this branch to `main`
2. Create Phase 4 tracking issue
3. Begin RTU + Split Systems implementation

