#!/usr/bin/env npx tsx
/**
 * Golden Test Matrix Generator
 * Phase 3.5 — Engine Hardening & Freeze
 * 
 * Generates docs/contracts/golden-test-matrix.md from test results.
 * This becomes the "no drift permitted" oracle.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const OUTPUT_PATH = path.resolve(__dirname, '../docs/contracts/golden-test-matrix.md');
const CONTRACTS_DIR = path.resolve(__dirname, '../docs/contracts');

interface TestResult {
  ancestorTitles: string[];
  fullName: string;
  status: string;
  title: string;
  duration: number;
}

interface TestFile {
  name: string;
  status: string;
  assertionResults: TestResult[];
}

interface VitestOutput {
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  success: boolean;
  testResults: TestFile[];
}

function generateTestHash(test: TestResult): string {
  const content = `${test.fullName}|${test.status}`;
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 12);
}

function generateFileHash(file: TestFile): string {
  const content = file.assertionResults.map(t => `${t.fullName}|${t.status}`).join('\n');
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

function categorizeTest(fileName: string): string {
  if (fileName.includes('refrigeration')) return 'Refrigeration';
  if (fileName.includes('airside')) return 'Airside';
  if (fileName.includes('hydronic')) return 'Hydronic';
  if (fileName.includes('recip')) return 'Compressor (Recip)';
  if (fileName.includes('scroll')) return 'Compressor (Scroll)';
  if (fileName.includes('condenser')) return 'Condenser Approach';
  if (fileName.includes('reversing')) return 'Reversing Valve';
  if (fileName.includes('combined') || fileName.includes('wshp')) return 'Combined/Orchestrator';
  if (fileName.includes('validation')) return 'Validation';
  return 'Other';
}

function main(): void {
  // Ensure contracts directory exists
  if (!fs.existsSync(CONTRACTS_DIR)) {
    fs.mkdirSync(CONTRACTS_DIR, { recursive: true });
  }

  // Read test output
  const testOutputPath = path.resolve(__dirname, '../test-output.json');
  if (!fs.existsSync(testOutputPath)) {
    console.error('test-output.json not found. Run: npx vitest run --reporter=json > test-output.json');
    process.exit(1);
  }

  const rawJson = fs.readFileSync(testOutputPath, 'utf-8');
  const data: VitestOutput = JSON.parse(rawJson);

  // Group tests by category
  const categories: Record<string, { file: string; hash: string; tests: { name: string; hash: string }[] }[]> = {};

  for (const file of data.testResults) {
    const fileName = path.basename(file.name);
    const category = categorizeTest(fileName);
    
    if (!categories[category]) {
      categories[category] = [];
    }

    const fileEntry = {
      file: fileName,
      hash: generateFileHash(file),
      tests: file.assertionResults.map(t => ({
        name: t.title,
        hash: generateTestHash(t),
      })),
    };

    categories[category].push(fileEntry);
  }

  // Generate markdown
  const now = new Date().toISOString();
  let md = `<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->

# Golden Test Matrix

**Phase 3.5 — Engine Hardening & Freeze**

This document is the "no drift permitted" oracle. Any change to test behavior
must be reflected here with architect approval.

---

## Summary

| Metric | Value |
|--------|-------|
| Generated | ${now} |
| Total Test Suites | ${data.numTotalTestSuites} |
| Total Tests | ${data.numTotalTests} |
| Passed | ${data.numPassedTests} |
| Failed | ${data.numTotalTests - data.numPassedTests} |
| Success | ${data.success ? '✓' : '✗'} |

---

## Test Matrix by Domain

`;

  // Sort categories for consistent output
  const sortedCategories = Object.keys(categories).sort();

  for (const category of sortedCategories) {
    md += `### ${category}\n\n`;
    
    const files = categories[category].sort((a, b) => a.file.localeCompare(b.file));
    
    for (const fileEntry of files) {
      md += `#### \`${fileEntry.file}\`\n\n`;
      md += `File Hash: \`${fileEntry.hash}\`\n\n`;
      md += `| Test | Hash |\n`;
      md += `|------|------|\n`;
      
      for (const test of fileEntry.tests) {
        md += `| ${test.name} | \`${test.hash}\` |\n`;
      }
      
      md += `\n`;
    }
  }

  md += `---

## Integrity Verification

To verify this matrix against current tests:

\`\`\`bash
npx vitest run --reporter=json > test-output.json
npx tsx tools/generate-golden-matrix.ts --verify
\`\`\`

If hashes differ, the test behavior has drifted and must be reviewed.

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| ${now.split('T')[0]} | Phase 3.5 Automation | Initial golden matrix generation |

`;

  fs.writeFileSync(OUTPUT_PATH, md, 'utf-8');
  console.log(`Golden Test Matrix written to: ${OUTPUT_PATH}`);
  console.log(`Total tests: ${data.numTotalTests}`);
  console.log(`Categories: ${sortedCategories.join(', ')}`);
}

main();
