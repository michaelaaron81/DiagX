# Recommendations & Suggestions

This folder stores human-readable recommendation suggestions and proposed entries discovered by the gap-scan process. Use these documents as the source of truth when adding new recommendation IDs and tests.

Typical files:
- `Recommendation_Suggestions_<date>.md` — human-friendly suggested recommendations and tests

How to use
- Review each suggestion before implementing a new recommendation in code. Implementations should match the existing `Recommendation` contract in `src/shared/wshp.types.ts` and be covered by tests under `test/`.
