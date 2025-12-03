#!/usr/bin/env npx ts-node
/**
 * Engine Documentation Validator (EDV)
 * Phase 3.5 — Engine Hardening & Freeze
 * 
 * Validates all engine documentation files against the 10-section schema:
 * 1. Purpose
 * 2. Inputs (Measurements)
 * 3. Inputs (Profile Fields)
 * 4. Outputs — Values
 * 5. Outputs — Flags
 * 6. Recommendations Produced
 * 7. Status Mapping
 * 8. Invariants (Architect-Defined)
 * 9. Physics Core Dependencies
 * 10. Validation Handshake
 * 
 * Also verifies:
 * - License block consistency
 * - No OEM or procedural content
 * - Physics function usage documented
 * - Flag/value description alignment
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// CONFIGURATION
// ============================================================================

const ENGINE_DOCS_DIR = path.resolve(__dirname, '../docs/engines');

const REQUIRED_SECTIONS = [
  '## 1. Purpose',
  '## 2. Inputs (Measurements)',
  '## 3. Inputs (Profile Fields)',
  '## 4. Outputs — Values',
  '## 5. Outputs — Flags',
  '## 6. Recommendations Produced',
  '## 7. Status Mapping',
  '## 8. Invariants (Architect-Defined)',
  '## 9. Physics Core Dependencies',
  '## 10. Validation Handshake',
];

const LICENSE_BLOCK = `<!--
This documentation is governed by the DiagX Internal License (DIL-1.0).
Unauthorized distribution or disclosure is strictly prohibited.
-->`;

const OEM_FORBIDDEN_PATTERNS = [
  /\bCarrier\b/i,
  /\bTrane\b/i,
  /\bLennox\b/i,
  /\bRheem\b/i,
  /\bYork\b/i,
  /\bDaikin\b/i,
  /\bMitsubishi\b/i,
  /\bLG\b(?!\s*Electronics)/i, // LG as brand, not "LG Electronics" in context
  /\bFujitsu\b/i,
  /\bBosch\b/i,
  /\bGoodman\b/i,
  /\bAmana\b/i,
  /\bBryant\b/i,
  /\bPayne\b/i,
  /\bAmerican\s+Standard\b/i,
  /\bIOM\b/,
  /installation\s+manual/i,
  /owner'?s?\s+manual/i,
  /service\s+manual/i,
  /technical\s+bulletin/i,
  /proprietary\s+curve/i,
  /OEM\s+table/i,
];

const PROCEDURAL_FORBIDDEN_PATTERNS = [
  /\breplace\s+the\b/i,
  /\binstall\s+a?\s*new\b/i,
  /\bremove\s+the\b/i,
  /\bopen\s+the\s+panel\b/i,
  /\bshut\s+off\b/i,
  /\bturn\s+off\b/i,
  /\bdisconnect\s+power\b/i,
  /\bclean\s+the\b/i,
  /\brepair\s+the\b/i,
  /\bestimated\s+time\b/i,
  /\bestimated\s+cost\b/i,
  /\brequired\s+parts\b/i,
  /\blabor\s+hours?\b/i,
];

// ============================================================================
// TYPES
// ============================================================================

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// VALIDATORS
// ============================================================================

function validateLicenseBlock(content: string, result: ValidationResult): void {
  const normalizedContent = content.replace(/\r\n/g, '\n').trim();
  const normalizedLicense = LICENSE_BLOCK.replace(/\r\n/g, '\n').trim();
  
  if (!normalizedContent.startsWith(normalizedLicense)) {
    result.errors.push('Missing or incorrect license block at start of file');
  }
}

function validateRequiredSections(content: string, result: ValidationResult): void {
  for (const section of REQUIRED_SECTIONS) {
    if (!content.includes(section)) {
      result.errors.push(`Missing required section: ${section}`);
    }
  }
}

function validateSectionOrder(content: string, result: ValidationResult): void {
  let lastIndex = -1;
  for (const section of REQUIRED_SECTIONS) {
    const index = content.indexOf(section);
    if (index !== -1) {
      if (index < lastIndex) {
        result.errors.push(`Section out of order: ${section}`);
      }
      lastIndex = index;
    }
  }
}

function validateNoOEMContent(content: string, result: ValidationResult): void {
  for (const pattern of OEM_FORBIDDEN_PATTERNS) {
    const match = content.match(pattern);
    if (match) {
      result.errors.push(`Forbidden OEM/IOM content found: "${match[0]}"`);
    }
  }
}

function validateNoProceduralContent(content: string, result: ValidationResult): void {
  for (const pattern of PROCEDURAL_FORBIDDEN_PATTERNS) {
    const match = content.match(pattern);
    if (match) {
      result.errors.push(`Forbidden procedural/repair content found: "${match[0]}"`);
    }
  }
}

function validatePhysicsDependencies(content: string, result: ValidationResult): void {
  const physicsSection = content.match(/## 9\. Physics Core Dependencies[\s\S]*?(?=## 10\.|$)/);
  if (!physicsSection) {
    result.errors.push('Physics Core Dependencies section is missing or malformed');
    return;
  }

  const sectionContent = physicsSection[0];
  
  // Check for kernel function table
  if (!sectionContent.includes('| Kernel Function |')) {
    result.warnings.push('Physics section should contain a Kernel Function table');
  }
  
  // Check for at least one function reference
  if (!sectionContent.includes('`compute') && !sectionContent.includes('`get') && !sectionContent.includes('`interpolate')) {
    result.warnings.push('Physics section should reference at least one kernel function');
  }
}

function validateFlagValueAlignment(content: string, result: ValidationResult): void {
  // Extract values section
  const valuesSection = content.match(/## 4\. Outputs — Values[\s\S]*?(?=## 5\.|$)/);
  const flagsSection = content.match(/## 5\. Outputs — Flags[\s\S]*?(?=## 6\.|$)/);
  
  if (!valuesSection || !flagsSection) {
    return; // Already caught by required sections check
  }
  
  // Check that both sections have tables
  if (!valuesSection[0].includes('| Field |')) {
    result.warnings.push('Values section should contain a Field table');
  }
  if (!flagsSection[0].includes('| Field |')) {
    result.warnings.push('Flags section should contain a Field table');
  }
}

function validateTitleFormat(content: string, result: ValidationResult): void {
  // Check for proper title format: # EngineName — Diagnostic Engine Contract
  const titleMatch = content.match(/^#\s+[\w\s]+—\s+Diagnostic Engine Contract/m);
  if (!titleMatch) {
    result.warnings.push('Document should have title in format: "# [Name] — Diagnostic Engine Contract"');
  }
}

// ============================================================================
// MAIN VALIDATION
// ============================================================================

function validateEngineDoc(filePath: string): ValidationResult {
  const result: ValidationResult = {
    file: path.basename(filePath),
    valid: true,
    errors: [],
    warnings: [],
  };

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    validateLicenseBlock(content, result);
    validateTitleFormat(content, result);
    validateRequiredSections(content, result);
    validateSectionOrder(content, result);
    validateNoOEMContent(content, result);
    validateNoProceduralContent(content, result);
    validatePhysicsDependencies(content, result);
    validateFlagValueAlignment(content, result);
    
    result.valid = result.errors.length === 0;
  } catch (err) {
    result.errors.push(`Failed to read file: ${err}`);
    result.valid = false;
  }

  return result;
}

function getAllEngineDocFiles(): string[] {
  if (!fs.existsSync(ENGINE_DOCS_DIR)) {
    console.error(`Engine docs directory not found: ${ENGINE_DOCS_DIR}`);
    process.exit(1);
  }
  
  return fs.readdirSync(ENGINE_DOCS_DIR)
    .filter(f => f.endsWith('.engine.md'))
    .map(f => path.join(ENGINE_DOCS_DIR, f));
}

function printResults(results: ValidationResult[]): void {
  console.log('\n========================================');
  console.log('  Engine Documentation Validator (EDV)');
  console.log('  Phase 3.5 — Engine Hardening & Freeze');
  console.log('========================================\n');
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  for (const result of results) {
    const status = result.valid ? '✓' : '✗';
    const statusColor = result.valid ? '\x1b[32m' : '\x1b[31m';
    
    console.log(`${statusColor}${status}\x1b[0m ${result.file}`);
    
    for (const error of result.errors) {
      console.log(`  \x1b[31m  ERROR: ${error}\x1b[0m`);
      totalErrors++;
    }
    
    for (const warning of result.warnings) {
      console.log(`  \x1b[33m  WARN:  ${warning}\x1b[0m`);
      totalWarnings++;
    }
  }
  
  console.log('\n----------------------------------------');
  console.log(`Files validated: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.valid).length}`);
  console.log(`Failed: ${results.filter(r => !r.valid).length}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Total warnings: ${totalWarnings}`);
  console.log('----------------------------------------\n');
}

// ============================================================================
// ENTRY POINT
// ============================================================================

function main(): void {
  const files = getAllEngineDocFiles();
  
  if (files.length === 0) {
    console.error('No engine documentation files found');
    process.exit(1);
  }
  
  const results = files.map(validateEngineDoc);
  printResults(results);
  
  const allValid = results.every(r => r.valid);
  process.exit(allValid ? 0 : 1);
}

main();
