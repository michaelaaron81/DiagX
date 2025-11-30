> NOTE: OEM/IOM policy (internal) moved to `docs/process/`.

Refer to `docs/process/NO_OEM_IOM.md` for the canonical policy document.

Guidelines
- Do NOT commit manufacturer-specific IOM/OEM performance tables to source control.
- If you need to run diagnostics against manufacturer data, provide them at runtime using the profile object (e.g., `profile.refrigeration.ptOverride`) or other runtime-only hooks.
- The engines accept a profile-provided `ptOverride` only when `refrigeration.refrigerantType === 'OTHER'` to reduce accidental falsification of fixed refrigerants.
- Always include a disclaimer when using user-supplied manufacturer data and validate shapes with `src/modules/refrigeration/ptUtils.ts` before use.

Local, ephemeral storage (recommended)
- For convenience, we provide local-only save/load helpers so technicians can stash custom PT tables on their machines without committing them to source control.
- These are stored in a per-user config location and are intentionally outside the repository:
	- Windows: %APPDATA%/diagx-omen/pt-overrides.json
	- Linux/macOS: ~/.config/diagx-omen/pt-overrides.json
- You can provide a custom local directory (useful for testing) via the environment variable `DIAGX_LOCAL_DIR`.

CLI usage (quick).
- The repository ships a tiny CLI for managing local PT entries via `ts-node`:
	- Import: `npm run pt -- import <profileId> <pt.json> -d "optional description"`
	- List: `npm run pt -- list`
	- Show: `npm run pt -- show <profileId>`
	- Remove: `npm run pt -- remove <profileId>`

These local entries are ephemeral and only used at runtime when you explicitly add them to your in-memory profile (or set `profile.refrigeration.ptOverride` programmatically). They will never be checked in or used by default for non-OTHER refrigerants.

Enforcement (developer tooling)
- There's an advisory npm script `npm run check:oem` that will scan the repo for likely text patterns and warn. This script is intentionally advisory — use it during code review and CI to flag questionable commits.

If you have a legitimate reason to add manufacturer tables to the repo, discuss and add them only to a secured artifacts storage and reference them by URL or environment-provided path (not committed to the main repository).

Engine-level flags and disclaimers may indicate unknown/custom refrigerants but must not instruct users to consult OEM/IOM or perform specific procedures.
