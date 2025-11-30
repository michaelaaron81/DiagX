DiagX – Master Roadmap (Full Updated Version)

Revision: 2025-11-29

This roadmap defines the architectural, engineering, and implementation phases of the DiagX diagnostic system.
It governs development sequence, gating milestones, and constraints.

Only the phase currently in progress may be executed.
Future phases may be discussed conceptually but not implemented.

PHASE 0 — Foundation & Constraints (COMPLETED)

Establishes the rules that govern all development.

Achievements

Defined engine/module separation

Locked architectural guardrails (Master Seed v3)

Created engineer-side seed

Created local-editor seed

Added safety constraints (“life-critical accuracy” block)

Established integrity test system

Created file-tree, changelog, audit, gap-scan docs

Established Raptor stress-test workflow

Set the rule: every change requires updated file tree + updated changelog + updated test artifacts

Gate to Phase 1

Seeds stable

Rules stable

Structure stable

No open decisions remaining

Status: PASSED

PHASE 1 — Baseline System Initialization (COMPLETED)

This phase created the working skeleton of the DiagX system.

Achievements

Repo scaffolding completed

Core shared types established

Initial engines created:

Airside

Refrigeration

Scroll compressor

Recip compressor

Reversing valve

WSHP orchestrator established

Initial CLI tools working

Vitest integrated

Baseline documentation suite established

All tests passed for the baseline set

Status: PASSED

PHASE 2 — Engine Normalization & Recommendation Integrity (ACTIVE)

This phase ensures that all engines are correct, stable, deterministic, complete, and safe.

This is the phase we are currently in.

PHASE 2 – Objectives
2.1 Normalize all existing engines

For each domain:

Engines must emit:

status

values (numbers only)

flags (booleans only)

recommendations[] via designated helper

No English text inside engines

No inference

No root-cause guessing

No UI text

No formatting

No OEM/IOM data

(COMPLETE for current engines)

2.2 Validate all engines

Each engine must have:

Validation helpers

Module-level validation gate

Tests verifying:

missing inputs

malformed inputs

edge-case physics

flag boundaries

(COMPLETE for current engines)

2.3 Recommendation Completeness (CURRENT STEP)

Stress testing + gap scanning identified missing recommendations.
These must be corrected before adding new engines.

Order of correction (mandatory):

Recip compressor (critical safety gaps)

Refrigeration (superheat/slugging, under/over-charge safety recs)

Airside (freeze-up, airflow-critical, ESP-critical)

Scroll compressor (light patch)

Each fix requires:

Updating generateXxxRecommendations()

Adding tests for the new recs

Updating changelog, inventory, gap-scan

Re-running Raptor + Vitest

Updating docs + file tree

Gate:

All existing engines must produce complete, safe recommendation sets for all stress-tested flag combinations.

Status: IN PROGRESS

2.4 Add Beta-1 engines (AFTER rec-fix)

Only after outstanding recommendations are fixed:

New engines to add:

HydronicSourceEngine (WSHP + GSHP loop)

CondenserApproachEngine (ASHP outdoor condenser)

These require:

Types

Engine

Recommendations

Validation

Tests

Inventory updates

Gap-scan re-run

Gate to Phase 3:

All engines (old + new) normalized

All recommendations complete

All tests pass

Integrity report clean

No open gaps

PHASE 3 — Profile Wiring (NOT YET STARTED)

Profiles equate to “unit types” in DiagX.
Phase 3 wires engines into full diagnostic flows.

Beta-1 Profile Set

WSHP (water source heat pump)

GSHP (ground source heat pump)

ASHP (air source heat pump)

Profile work includes:

Profile definition files

Domain bundle selection

Mode-based engine execution

Module text (safe, professional, non-procedural)

Unit capability metadata

Measurement help text

Final structured “DiagnosisExplanation” objects

Report-formatting layer (still module-only, not UI)

Deferred Low-Effort Profiles (Post-Beta-1)

(Logged only, not to be implemented)

Straight-cool split AC

Cooling-only RTU

Air handler (airside-only)

Fan coil + hydronic loop

Fresh air unit (airside or airside+hydronic)

Fresh air + DX tempering (RTU-like)

Exhaust fan

TEM UA/DOAS-lite style units

Any future VRF module

No work allowed in Phase 3 on these.

PHASE 4 — Correlation & Multi-Domain Diagnostics (FUTURE, CONCEPTUAL ONLY)

This phase links domains to strengthen diagnostics without violating purity.

Examples:

Airside + Refrigeration:

Coil freeze requires airflow remediation recommendation set

Refrigeration + Compressor:

Critical superheat + critical compression = enhanced safety block

Reversing valve + Refrigeration:

Extreme imbalance patterns produce cross-domain flags

This phase stays conceptual until Phase 3 is complete.

PHASE 5 — Technician Safety, On-Device Validation, and Testing Viewer (FUTURE)

This is where the idea of “in-app integrity tests” is implemented.

Features:

Embedded form of engine tests (safe for technicians)

“How DiagX tests itself” viewer

Stress-test visualizer

Local integrity checks

PT override validation viewer

Safety manual integration

Grainger-linked PPE listings (as allowed)

Shutdown logic + warnings (non-procedural)

Error-checking for:

Sensor overlaps

Impossible combinations

Contradictory measurements

No work allowed until Phase 3 and 4 complete.

PHASE 6 — Voice / Flow Mode + Device-Native Integrations (FUTURE)

This is the phase where the hands-free technician workflow is built.

Voice capture using native OS voice → parsed to structured measurements

OCR for data plates using native OS OCR

Tap-to-assign fields from extracted text

Flow-mode (“Tell me supply,” “Tell me suction pressure”)

Hands-free mode for roof/field operation

Low-vision mode

“Profile-first” measurement flow logic

Strictly conceptual until Phase 5 is finished.

PHASE 7 — UI Shell + Tooling (FUTURE)

Still conceptual.

Desktop + mobile unified UI

Offline-first shell

Local caching

Module bundle loader

JSON-first profile storage

Optional cloud synchronization layer

Not started until everything above is stable.

PHASE 8 — Distribution + Multi-Platform Packaging (FUTURE)

Potential paths:

Progressive Web App

Capacitor native packaging

Desktop packaging (Electron-like wrapper)

Enterprise deployment flows

Offline feature policy

User roles and permissions

Conceptual only.

PHASE 9 — Expansion (FUTURE)

New engines, VRF support, combustion engines, economizer engines, IAQ engines, and multi-unit system diagnostics.

Not allowed until Phase 1–8 are complete.

CURRENT STATUS SUMMARY (2025-11-29)
Phase	Status
Phase 0	COMPLETE
Phase 1	COMPLETE
Phase 2	ACTIVE — recommendation-gap correction underway
Hydronic & condenser engines	BLOCKED until rec-fix complete
Phase 3	Not yet started
Phase 4–9	Conceptual only