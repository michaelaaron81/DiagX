# DiagX Commands Reference

Quick reference for all available npm scripts, standalone scripts, and common git commands.

---

## NPM Scripts

Run these with `npm run <script>`:

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run demo` | Run the demo CLI (`src/cli/demo.ts`) |
| `npm run start` | Alias for `demo` |
| `npm test` | Run all tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint on all `.ts` files |
| `npm run format` | Format all files with Prettier |
| `npm run pt` | Run PT chart utility (`src/cli/pt.ts`) |
| `npm run pt:check` | Check for OEM data leaks |
| `npm run check:oem` | Alias for `pt:check` |
| `npm run consolidate-audit` | Run legacy audit consolidation script |

---

## Standalone Scripts

Run these directly with `node` or `ts-node`:

| Script | Command | Description |
|--------|---------|-------------|
| `consolidate-under-review.js` | `node scripts/consolidate-under-review.js` | Consolidate all files from `docs/under-review/` into a timestamped report in `docs/audits/`, then delete originals |
| `consolidate-audit.js` | `node scripts/consolidate-audit.js` | Legacy: copy consolidated report and clear under-review |
| `check-oem.js` | `node scripts/check-oem.js` | Scan for OEM/proprietary data that shouldn't be in the repo |
| `recommendation-gap-scan.ts` | `npx ts-node scripts/recommendation-gap-scan.ts` | Scan engines for missing recommendation coverage |
| `run-airside-test.ts` | `npx ts-node scripts/run-airside-test.ts` | Run airside engine test scenarios |
| `run-combined-profile.ts` | `npx ts-node scripts/run-combined-profile.ts` | Run combined profile stress tests |
| `run-recip-debug.ts` | `npx ts-node scripts/run-recip-debug.ts` | Debug reciprocating compressor engine |

---

## Common Workflows

### After Making Changes
```bash
npm run lint          # Check for lint errors
npm test              # Run all tests
npm run build         # Compile TypeScript
```

### After Running Tests (consolidate reports)
```bash
node scripts/consolidate-under-review.js
```

### Full Test + Consolidate Loop
```bash
npm test && node scripts/consolidate-under-review.js
```

---

## Git Commands

### Daily Workflow
```bash
git status                    # Check what's changed
git add .                     # Stage all changes
git commit -m "message"       # Commit with message
git push                      # Push to remote
```

### Branches
```bash
git branch                    # List local branches
git branch -a                 # List all branches (including remote)
git checkout <branch>         # Switch to branch
git checkout -b <new-branch>  # Create and switch to new branch
git merge <branch>            # Merge branch into current
git branch -d <branch>        # Delete local branch
```

### Sync with Remote
```bash
git pull                      # Pull latest changes
git fetch                     # Fetch without merging
git push -u origin <branch>   # Push new branch to remote
```

### Viewing History
```bash
git log --oneline             # Compact commit history
git log --oneline -10         # Last 10 commits
git diff                      # Show unstaged changes
git diff --staged             # Show staged changes
git show <commit>             # Show specific commit
```

### Undoing Changes
```bash
git checkout -- <file>        # Discard changes to file
git reset HEAD <file>         # Unstage file
git reset --soft HEAD~1       # Undo last commit, keep changes staged
git reset --hard HEAD~1       # Undo last commit, discard changes (DANGEROUS)
git stash                     # Stash working changes
git stash pop                 # Restore stashed changes
```

### Tags
```bash
git tag                       # List tags
git tag v1.0.0                # Create lightweight tag
git tag -a v1.0.0 -m "msg"    # Create annotated tag
git push --tags               # Push tags to remote
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Run tests | `npm test` |
| Build project | `npm run build` |
| Check linting | `npm run lint` |
| Format code | `npm run format` |
| Consolidate test reports | `node scripts/consolidate-under-review.js` |
| Full test loop | `npm test && node scripts/consolidate-under-review.js` |
| Commit all changes | `git add . && git commit -m "message"` |
| Push to GitHub | `git push` |
