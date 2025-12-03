DiagX Master Seed — Version 6

Unified Physics Core Integration + Revised Roadmap

0. System Role

DiagX is a physics-driven diagnostic platform built to evaluate HVAC systems through deterministic, OEM-agnostic physical principles.

DiagX does not:

Provide repair procedures

Use OEM/IOM data

Make prescriptive actions

Perform “fuzzy” or heuristic guesses

DiagX evaluates systems, not components.
It diagnoses phenomena, not brands.

The system converts:

Profile + Measurements → Physics Engines → System Modules → Diagnostic Output

1. Architectural Contract (Hard Layers)

DiagX operates on a strict multi-layer architecture:

Tier 0 — Language / Numeric Foundations

Native math, unit conversions, no domain logic.

Tier 1 — Generic Numeric Utilities

Unit conversion helpers

Smoothing / statistics

Domain-agnostic utilities

Tier 2 — Domain Physics Kernels (Physics Core / P-Core)

Pure mathematics only. No diagnostics, no flags.

Namespaces:

physics/hvac_refrigeration/

physics/hvac_airside/

physics/hydronic/

physics/steam/

physics/combustion/

physics/electrical/

Properties of all functions:

deterministic

side-effect-free

no thresholds

no OEM data

no classification

return numbers or structured data only

All domain engines call into these kernels.

Tier 3 — Domain Engines (DiagX Engines)

Each engine:

Accepts structured measurement + profile data

Calls Tier-2 physics

Produces:

Values

Flags

DiagnosticStatus

Performs NO raw physics internally

Performs NO UI behavior or recommendations

Current engines:

airside

refrigeration

compressor_scroll

compressor_recip

hydronic

reversing_valve

condenser_approach

Future engines:

steam

combustion

economizer

energy_audit (meta-engine)

Tier 4 — System Modules

Aggregate domain engines into coherent system-level evaluations.

Examples:

Refrigerant Circuit System Module

Airside System Module

Hydronic System Module

Steam System Module

Combustion System Module

Electrical System Module

Energy Audit System Module

System modules:

never compute raw physics

never perform equipment-specific behavior

interpret engine-level flags and values into system-level states

Tier 5 — Equipment Orchestrators

Equipment-level combinators.

Examples:

WSHP

RTU

Split System

Boiler

Steam Boiler

Chiller

Electric Water Heater

They wire:

profiles → engines → system modules → CombinedProfileResult

No physics.
No thresholds.
No inference beyond selection/order of modules.

Tier 6 — UI / API

Rendering, formatting, user experience.

UI consumes only:

CombinedProfileResult

module summaries

profile metadata

It must not:

interpret physics

hide errors

compute math

derive flags

2. Diagnostic Contract

All diagnostic outputs must be:

deterministic

OEM-agnostic

physics-grounded

recommendation-layer safe

non-procedural

non-prescriptive

The engines are frozen once Phase 3.5 completes.

3. Licenses and Safety

DiagX Internal License (DIL-1.0) applies.

All modules, documentation, code, diagrams, tables, and derived works are:

proprietary

internal use only

non-distributable

non-trainable for ML systems without explicit consent

Every file must carry the DIL-1.0 header.

4. Physics Core Vision (P-Core)

(Inserted exactly as locked in earlier—abbreviated here for brevity, but V6 carries the full text.)

Tier-2 kernels enforce physics purity

Engines call kernels

System modules interpret engines

Orchestrators wire systems

HVAC is the first vertical built on P-Core

Additional domains may be added using same layered pattern

Full text remains unchanged from the locked version.

5. Revised Roadmap (UI-Adjusted + Domain-Correct)
PHASE 0 — Vision & Constitution (DONE)
PHASE 1 — Baseline HVAC Engines (DONE)
PHASE 2 — Engine Safety & Validation (DONE)
PHASE 3 — Structural Consolidation (CURRENT)

3.1 Profile/Overrides (DONE)

3.2 Module/CombinedProfile (DONE)

3.3 Docs/License (DONE)

3.4 Physics Kernel Extraction (NEXT)

3.5 Engine Hardening & Freeze

PHASE 4 — RTU + Split Systems

Minimum viable multi-equipment suite for UI.

PHASE 5 — UI / APP DEVELOPMENT

Before full-suite HVAC expansion.

PHASE 6 — Full HVAC Expansion (UPDATED ORDER)

6.1 Boilers (Hydronic)

6.2 Steam Boilers + Distribution

6.3 Chillers (Air/Water Cooled)

6.4 Electric Water Heaters

6.5 Economizers

6.6 Energy Audit System

PHASE 7 — Behavioral / Time-Series Analysis
PHASE 8 — Multi-Domain Physics Extensions
PHASE 9 — Release, Certification, Support

Roadmap priority corrections are locked into V6.