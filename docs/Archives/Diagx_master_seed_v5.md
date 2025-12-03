DiagX Master Seed — V5

Version: 5
Date: 2024-12-01
Scope: DiagX HVAC Diagnostic Engine (WSHP/ASHP baseline; future profiles modular)
Status: Phase 2 complete; Phase 3 (Profile Wiring & Validation) in progress.

I. System Role

DiagX is a diagnostic engine, not a procedural troubleshooting system.

Its contract is:

profile + measurements → physics → flags → diagnostic status + recommendations

DiagX:

interprets measurements using deterministic physics

evaluates operating state

emits structured recommendations (diagnostic / safety / routing)

enforces safety and OEM-agnostic constraints

DiagX does not:

describe how to repair equipment

provide procedural steps

reference OEM/IOM data

generate instructions involving tools, parts, power manipulation, or disassembly

Any repair planning, procedural instruction, or step-by-step content belongs in a separate tool (e.g., DreamWeaver workflows, external planner modules, or human review).

II. Architecture Rules (Four-Layer Model)

DiagX uses a strict, non-negotiable four-layer architecture:

Types Layer (src/shared/*.ts, structural only)

Engine Layer (*.engine.ts, pure physics)

Recommendation Layer (*.recommendations.ts, flag → rec mapping)

Module Layer (*.module.ts, wiring + validation + summaries)

This is the authoritative contract for all future development.

1. Types Layer (Structural Only)

Files include (non-exhaustive):

src/shared/wshp.types.ts

src/shared/validation.types.ts

src/shared/recommendation.schema.ts

src/schema/recommendation.schema.json

The Types Layer defines:

Measurement objects

Profile/config slices

Domain identifiers

EngineResult<V,F> shape

DiagnosticStatus

ValidationIssue

Recommendation interface + JSON schema

Shared data structures used across modules

The Types Layer must NOT contain:

Thresholds

Physics

OEM/IOM data

Natural-language summaries

Troubleshooting logic

Any decision-making algorithm

Types define shape, not behavior.

This rule remains unchanged in V5.

2. Engine Layer (Physics Only)

Files:
src/modules/**/[*].engine.ts

Responsibilities (non-negotiable):

Compute physics-derived values (superheat, subcooling, delta-T, compression ratio, approach, etc.)

Apply thresholds

Determine flags

Roll up status (OK / warning / alert / critical)

Construct EngineResult<V,F> (values + flags + status)

Engines must NOT:

Emit human-readable text

Generate recommendations

Reference OEM data or tables

Duplicate thresholds across files

Infer cross-domain state

Include troubleshooting or procedural content

The engine layer is strictly:
numbers → flags → status.

3. Recommendation Layer (Flag → Recommendation)

Files:
src/modules/**/[*].recommendations.ts

Responsibilities:

Convert engine flags → Recommendation[]

Apply consistent domain tags

Apply severity and intent classifications

Allowed intent values:

diagnostic | safety | routing


Allowed domain values:
airside, refrigeration, compressor_recip, compressor_scroll, reversing_valve,
hydronic, condenser_approach, combined

Hard Constraints:

No physics

No threshold logic

No procedural advice (e.g., “replace”, “clean”, “adjust”, “remove panel”, “shut off…”)

No OEM/IOM dependencies

No repair planning (no time/cost/parts)

Shutdown Policy:

requiresShutdown: true is permitted only when:

A critical engine flag exists and

The physics justifies the risk state

Recommendations explain why a condition is unsafe,
not how to de-energize equipment.

4. Module Layer (Wiring, Validation, Summaries)

Files:
src/modules/**/[*].module.ts

Module Responsibilities:

Validate inputs

Map profile/measurement structures → engine input shapes

Run Tier-A validation (numeric bounds + impossible states)

Invoke engines only when safe

Invoke recommendation helpers

Produce module-level diagnostic summaries

Assemble results for the combined profile layer

Provide structured human-readable explanations (non-procedural)

Modules must NOT:

Modify engine flags

Change thresholds

Introduce new diagnostic logic

Produce procedural instructions

Re-invent physics

Modules are the translation + assembly layer around engines.

III. Safety Rules (Life/Safety Adjacent)

DiagX must behave conservatively and defensively.

Absolute Prohibitions

OEM/IOM data or curves

Procedural steps or disassembly instructions

“How to fix it” language

Tool usage guidance

Time/cost/parts estimates

Dangerous operational advice

Allowed Content

Physics-grounded state description

Additional measurement suggestions

Safety-oriented recommendations:

Must use intent: 'safety'

requiresShutdown: true permitted only when justified by physics

DiagX must describe risk, not prescribe actions.

IV. Roadmap — Full Lifecycle (Updated for V5)

This roadmap replaces the abbreviated Phase Summary in V4 and reflects the real project state as of 2024-12-01.

Phase 0 — Engine Family Definition (Complete)

Date: 2024-11-23

Outcomes:

Selected domain engines

Defined physics boundaries

Established OEM-agnostic framework

Created top-level architectural constraints

Phase 1 — Architecture Ruleset & Seeds (Complete)

Outcomes:

Four-layer architecture established

Seeds created (Architect / Engineer)

Safety rules formalized

Deterministic, non-inferential philosophy locked in

Phase 2 — Engine Normalization & Integrity (Complete)

Dates: 2024-11-27 → 2024-11-30

Outcomes:

All engines normalized under EngineResult<V,F>

Recommendation helpers unified

Domain behaviors stabilized

Full engine test suite passing

Validation and PT override behavior validated

Engines ready for profile-level wiring

Phase 3 — Profile Wiring & Validation (In Progress)

Start: 2024-11-30

Objectives

Introduce ProfileInputSchema (L1 / L2 / L3 measurement tiers)

Implement profile → engine mapping layer

Implement domain-level completeness classification:
full | limited | advisory | skipped

Normalize Tier-A validation (numeric bounds & impossibility checks)

Construct ModuleResult (new canonical module output)

Construct CombinedProfileResult (profile-level result)

Refactor orchestrator into a profile-driven diagnostic runner

Add a minimal CLI (runProfile)

Hard Forbidden (Phase-3 Specific)

Engine physics or threshold changes

Recommendation behavior changes

New engines

Cross-domain inference

Procedural content

OEM/IOM logic

Exit Criteria

Phase 3 is complete when:

All profiles have schemas + L1/L2/L3 definitions

All modules use ModuleResult

CombinedProfileResult is implemented

Completeness + validation gating is standardized

Engines never run on invalid or insufficient data

Orchestrator uses profile-driven execution

Tests cover completeness, validation, mapping, and combined-profile flows

No engine or recommendation changes occurred

Phase 4 — Kernel & Module Interface (Directional)

Goals:

Introduce DiagxModule interface

Introduce EngineContext

Build pluggable module bus

Adapt existing modules without modifying physics

Phase 5 — Module Registry & Profile Recipes (Directional)

Goals:

Declarative profile recipes

Module registry with versioning and capability tags

Dynamic module selection

Phase 6 — Cross-Domain Evaluators & Advanced Modules (Directional)

Goals:

Optional cross-domain evaluators

Hydronics, combustion, economizer, enthalpy, energy audit modules

Remain non-OEM, non-procedural

Phase 7 — Extensions / Plugins / UI / JIT-GL (Directional)

Goals:

Technician UI

Cloud execution

Plug-in modules

Just-in-Time Guidance Layer (optional)

V. Current State (V5)

As of V5:

Engine layer is complete and frozen (Phase 2 done)

Recommendation layer is stable, tested, and non-procedural

Module layer includes early Phase-3 validation and gating

Phase 3 core work (schemas, completeness, new orchestrator, ModuleResult, CombinedProfileResult) is active

No physics, thresholds, or rec logic have been modified since V4

Test suite is green; no critical failures

Safety and OEM-agnostic rules fully enforced

DiagX is now transitioning from a collection of normalized engines to a profile-driven diagnostic framework.

VI. Governance (Unchanged)

DiagX_master_seed_V5.md is the canonical product & safety specification

Engineers must operate strictly under this seed + the Engineer Seed

Engines, thresholds, or rec mappings may not be altered outside explicit roadmap updates

All development must preserve OEM-agnostic, non-procedural, deterministic behavior

End of DiagX Master Seed — V5

If you'd like, I can also generate:

Engineer Seed V3 (aligned to this Master Seed V5)

ModuleResult / CombinedProfileResult code templates

A “diff map” showing exactly what Phase 3 must add to your current repo