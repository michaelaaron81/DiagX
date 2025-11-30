import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('integration: compiled artifacts should not contain forbidden Recommendation fields', () => {
  it('dist files must not contain legacy recommendation fields', () => {
    const repoRoot = path.resolve(__dirname, '../../');
    const distPath = path.join(repoRoot, 'dist');

    if (!fs.existsSync(distPath)) {
      // No compiled artifacts present — nothing to assert in this CI-neutral test.
      // CI should run build before tests to surface any compiled leftovers.
      return expect(true).toBe(true);
    }

    const forbidden = [
      'estimatedTime',
      'requiredParts',
      'estimatedCost',
      '"action"',
      "category: 'repair'",
      'safetyWarning',
    ];

    const jsFiles: string[] = [];
    function walk(dir: string) {
      for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const fp = path.join(dir, f.name);
        if (f.isDirectory()) walk(fp);
        else if (f.isFile() && fp.endsWith('.js')) jsFiles.push(fp);
      }
    }

    walk(distPath);

    // Check each JS file for forbidden literals
    const matches: Record<string, string[]> = {};
    for (const f of jsFiles) {
      const content = fs.readFileSync(f, 'utf8');
      for (const token of forbidden) {
        if (content.includes(token)) {
          matches[f] = matches[f] || [];
          matches[f].push(token);
        }
      }
    }

    const foundFiles = Object.keys(matches);
    if (foundFiles.length) {
      // Fail with information for quick remediation
      const msg = foundFiles
        .map(f => `${f}: ${matches[f].join(', ')}`)
        .join('\n');
      throw new Error(`Forbidden keys found in compiled artifacts:\n${msg}`);
    }

    expect(true).toBe(true);
  });
});
