Revised DiagX Master Roadmap (UI-adjusted)

Aligned with Physics Core Vision (P-Core)

PHASE 0 — Vision & Constitution (DONE)

Locked architecture, layering, kernel contract, safety, DIL-1.0, etc.

PHASE 1 — Baseline HVAC Engines (DONE)

WSHP-centered domain engines established.

PHASE 2 — Engine Safety & Validation (DONE)

Tier-A, completeness, override safety, TESP gate, deterministic tests.

PHASE 3 — Structural Consolidation (CURRENT)

This is still the hinge point before expanding outward.

3.1 – Profile Wiring + Overrides (DONE)
3.2 – ModuleResult + CombinedProfileResult (DONE)
3.3 – Documentation, Licensing (DONE)
3.4 – Physics Kernel Extraction (NEXT)
3.5 – Engine Hardening & Freeze (AFTER 3.4)

Once 3.4 + 3.5 are complete, the HVAC engine layer is safe to build UI on top of.

PHASE 4 — RTU + Split Systems (PREREQUISITE DECK)

These are the minimum set before UI development can meaningfully begin.

RTU diagnostic modules

Economizer module (OA %, mixed air, free cooling)

Split-system topology logic

Minimal chiller/boiler placeholders (for future-proofing, not full diagnostics)

Why RTU + Split before UI?
Because technicians encounter these categories in the wild constantly.
A WSHP-only UI would underrepresent real-world field conditions and would mislead users about coverage.
RTU + Split is the minimum “critical mass” for a credible release candidate.

PHASE 5 — UI / APP DEVELOPMENT (REPRIORITIZED + MOVED EARLIER)

This phase now comes after RTU+Split, not after full HVAC suite.

5.1 – UI Architecture

Layout engine

Navigation flow

Tab structure

Result presentation

Profile entry

Data validation overlays (JIT-GL)

Error highlighting

5.2 – Diagnostic Experience

Problem summary

Values + flags

System modules integrated

Practical readability at technician level

Result grouping by domain + equipment

5.3 – First Release Candidate UI

Supports:

WSHP

RTU

Split Systems

Not the full suite — but enough for technician field evaluation and early adopters.

5.4 – App Packaging

Mobile-first responsive design

Desktop-friendly alternative

Offline mode (optional)

Caching profiles

Local-only logging

When Phase 5 is complete, you have a public-facing preview you can actually hand to technicians.

PHASE 6 — Remaining HVAC Domains

(Chillers, boilers, steam, electric water heaters, combustion, energy audit)

Once the UI exists and field-tested feedback is captured, you expand safely:

6.1 – Chillers

Condenser water / evaporator water

Approaches

Lift

Refrigerant configuration differences

TXV/EEV variance

Chiller system modules

6.2 – Boilers (HW) + Steam Boilers

Hydronic-only module extension

Steam module

Combustion module tie-in

ΔT, stack loss, combustion efficiency

6.3 – Electric Water Heaters

Electrical-only variant

Element diagnostics

6.4 – Full Economizer & Ventilation Module

Outdoor air fraction

Mixed air psychrometrics

Coil load reduction

Free-cooling logic

6.5 – Energy Audit System Module

Enthalpy-based energy flows

System-level capacity tracking

Envelope interactions

Efficiency estimation

This brings DiagX to “full HVAC vertical.”

PHASE 7 — Building-Level + Behavioral Analysis

Time-series, cycling patterns, combined-system diagnostics.

PHASE 8 — Multi-Domain Physics Core Expansion

(If you choose: auto, power, networking, etc.)

PHASE 9 — Release, Certification, Support

Final release, documentation, training materials.

WHERE WE ARE RIGHT NOW
Phase 3.4 — Physics Kernel Extraction

This is the key:
You must complete kernel extraction and engine freeze before touching UI.

Why?

UI requires stable engine signatures.

CombinedProfileResult must be frozen before UI binding.

System modules must be stable for UI presentation.

Tier-A + completeness behavior must be frozen to avoid UI errors.

UI will require clean, centralized math to present values consistently.

NEXT STEPS (OPERATIONAL)
1. Begin Phase 3.4 Immediately

Inventory all embedded physics

Draft kernel API

Extract SH/SC/enthalpy/ΔT-BTU/%RLA/psychro math

Refactor engines

Run full regression suite (must pass 100%)

2. Lock Phase 3.5 Structure

Engine Documentation Validator

Golden Test Matrix

Freeze rules (no inline math ever again)

Fingerprinting system

Documentation mirror

3. Prepare for Phase 4 (RTU + Split)

Once kernel refactor + freeze is complete:

Begin domain analysis for RTU & Split

Update profiles

Outline new system modules

4. Begin UI Planning Only After 3.5 + 4.1

Sketch wireframes only once the math & engines are fully isolated.