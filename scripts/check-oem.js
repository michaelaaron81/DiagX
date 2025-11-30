#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  fs.readdirSync(dir).forEach(f => {
    const fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) return walk(fp, cb);
    cb(fp);
  });
}

const patterns = [ /\bOEM\b/i, /\bIOM\b/i, /manufacturer\s*(?:table|data|IOM|OEM)/i, /manufacturer data/i ];

const matches = [];
walk(process.cwd(), (fp) => {
  if (!fp.endsWith('.ts') && !fp.endsWith('.js') && !fp.endsWith('.md') && !fp.endsWith('.json')) return;
  const content = fs.readFileSync(fp, 'utf8');
  patterns.forEach(p => {
    if (p.test(content)) matches.push({file: fp, pattern: p.toString()});
  });
});

if (matches.length === 0) {
  console.log('No obvious OEM/IOM/manufacturer-table matches found (advisory).');
  process.exit(0);
}

console.warn('Advisory: possible OEM/IOM/manufacturer table mentions were found in the following files:');
matches.forEach(m => console.warn(` - ${m.file}  (${m.pattern})`));
console.warn('\nThis is an advisory check only. Review these locations to ensure you are not committing manufacturer IOM/OEM tables into source control.');
process.exit(0);
