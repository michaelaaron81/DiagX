#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DOCS = path.resolve(__dirname, '..', 'docs');
const AUDITS = path.join(DOCS, 'audits');
const UNDER_REVIEW = path.join(DOCS, 'under-review');

function findConsolidatedFile() {
  // search in docs root and audits for consolidated files
  const candidates = [];
  for (const dir of [DOCS, AUDITS]) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.startsWith('Consolidated_Test_and_Lint_Report'));
    for (const f of files) {
      const p = path.join(dir, f);
      const m = fs.statSync(p).mtimeMs;
      candidates.push({ f, p, m });
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.m - a.m);
  return candidates[0].p;
}

function nextSequence() {
  const entries = fs.readdirSync(AUDITS).filter(f => /^[0-9]+_/.test(f));
  if (entries.length === 0) return 0;
  const nums = entries.map(f => parseInt(f.split('_')[0], 10)).filter(n => !Number.isNaN(n));
  return nums.length === 0 ? 0 : Math.max(...nums) + 1;
}

function run() {
  if (!fs.existsSync(AUDITS)) fs.mkdirSync(AUDITS, { recursive: true });
  const consolidated = findConsolidatedFile();
  if (!consolidated) {
    console.error('No consolidated report found in docs/. Expected a file named Consolidated_Test_and_Lint_Report*.md');
    process.exit(1);
  }

  const seq = nextSequence();
  const base = path.basename(consolidated);
  const outName = `${seq}_${base}`;
  const outPath = path.join(AUDITS, outName);

  fs.copyFileSync(consolidated, outPath);
  console.log(`Copied consolidated report to: ${outPath}`);

  // if the found consolidated file was in docs/audits but not prefixed, remove the old un-prefixed copy
  const foundDir = path.dirname(consolidated);
  const foundBase = path.basename(consolidated);
  if (foundDir === AUDITS && !/^[0-9]+_/.test(foundBase)) {
    try {
      fs.unlinkSync(consolidated);
      console.log('Removed original un-prefixed consolidated file from docs/audits/');
    } catch (err) {
      console.warn('Failed to remove original consolidated file in audits:', err && err.message);
    }
  }

  // clear under-review
  if (fs.existsSync(UNDER_REVIEW)) {
    const underFiles = fs.readdirSync(UNDER_REVIEW).map(f => path.join(UNDER_REVIEW, f));
    for (const f of underFiles) {
      try {
        const stat = fs.statSync(f);
        if (stat.isDirectory()) {
          fs.rmSync(f, { recursive: true, force: true });
        } else {
          fs.unlinkSync(f);
        }
      } catch (err) {
        console.warn('Failed to remove', f, err && err.message);
      }
    }
    console.log('Cleared docs/under-review/');
  } else {
    console.log('docs/under-review/ not found; nothing to clear');
  }

  console.log('Done.');
}

try {
  run();
} catch (err) {
  console.error('Error during consolidation:', err && err.stack ? err.stack : err);
  process.exit(2);
}
