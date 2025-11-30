# Recommendation Gap Scans (machine)

This folder contains machine-generated outputs from the recommendation-gap-scan automation.

Files here are typically JSON or markdown that list scenarios where an engine produced flags but no matching recommendations. These artifacts are intended to be used by maintainers to identify coverage gaps and generate suggested recommendation entries.

How to re-run the scan locally:

```powershell
# run the script which produces docs/gap-scans/Recommendation_Gaps_<timestamp>.md
node -r ts-node/register scripts/recommendation-gap-scan.ts
```
