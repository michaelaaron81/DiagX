UPDATED ROADMAP (PHASE 0 → COMPLETION)
Paste this into docs/process/Roadmap.md.

DIAGX ROADMAP — UPDATED & AUDIT-ALIGNED
Phase 0 — Engine Family Definition
Date: Nov 23
Domain engines selected (refrigeration, airside, scroll, recip, reversing valve).
Physics boundaries defined.
OEM-free, deterministic architecture established.
Status: Complete.

Phase 1 — Architecture Ruleset & Seeds
Create guardrails and system rules (no hallucination, no OEM, deterministic outputs).
Draft master + engineer seeds.
Status: Complete.

Phase 2 — Engine Normalization & Integrity
Dates: Nov 27 → Nov 30
Engines normalized under EngineResult<V,F>.
Recommendation helpers aligned.
Full test suite passing.
Integrity sweep complete.
Status: Complete.

Phase 3 — Profile Wiring & Validation (Current)
Start: Nov 30
Deliverables


ProfileInputSchema with L1/L2/L3 levels


Profile → Engine mapping layer


Completeness evaluators per domain


Tier-A validation normalization


ModuleResult standardization


CombinedProfileResult assembly


Orchestrator refactor to profile-first design


Minimal CLI


Full test expansion


Constraints


No engine changes


No recommendation changes


No new engines


No OEM/IOM content


No instructions to technicians


Status: In progress (foundation partially implemented).

Phase 4 — Kernel & Module Interface (Directional)
Introduce DiagxModule interface, EngineContext, and dynamic module bus.
Wrap existing modules with thin adapters.

Phase 5 — Module Registry & Profile Recipes (Directional)
Profiles become declarative recipes (choose modules + order).
Registry manages module versions and capabilities.

Phase 6 — Cross-Domain Evaluators & Advanced Modules (Directional)
Optional modules for hydronics, combustion, efficiency, enthalpy, ventilation, etc.
Cross-domain consistency evaluations.

Phase 7 — Extensions, UI/UX, JIT-GL (Directional)
Optional technician interface, cloud runner, plug-ins, JIT-GL measurement layer.

Ready.
If you want, I can now generate:


the file diffs for each Phase-3 task


or start with the most critical (ModuleResult + mapping layer) immediately.


Just say:
“Begin Phase 3 Task A.”