#!/usr/bin/env npx tsx
/**
 * Engine Fingerprint Generator
 * Phase 3.5 — Engine Hardening & Freeze
 * 
 * Generates hash fingerprints for all frozen engine files.
 * Used for anti-theft and integrity verification.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as glob from 'glob';

const OUTPUT_PATH = path.resolve(__dirname, '../docs/contracts/ENGINE_FINGERPRINTS.json');
const CONTRACTS_DIR = path.resolve(__dirname, '../docs/contracts');
const SRC_DIR = path.resolve(__dirname, '../src');

interface FileFingerprint {
  path: string;
  sha256: string;
  size: number;
  lastModified: string;
}

interface FingerprintDocument {
  version: string;
  generated: string;
  phase: string;
  description: string;
  engines: FileFingerprint[];
  types: FileFingerprint[];
  kernel: FileFingerprint[];
  orchestrator: FileFingerprint[];
  checksum: string;
}

function hashFile(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function getFileInfo(filePath: string, basePath: string): FileFingerprint {
  const stats = fs.statSync(filePath);
  const relativePath = path.relative(basePath, filePath).replace(/\\/g, '/');
  
  return {
    path: relativePath,
    sha256: hashFile(filePath),
    size: stats.size,
    lastModified: stats.mtime.toISOString(),
  };
}

function findFiles(pattern: string, cwd: string): string[] {
  return glob.sync(pattern, { cwd, absolute: true });
}

function generateDocumentChecksum(doc: Omit<FingerprintDocument, 'checksum'>): string {
  const content = JSON.stringify({
    engines: doc.engines.map(f => f.sha256).sort(),
    types: doc.types.map(f => f.sha256).sort(),
    kernel: doc.kernel.map(f => f.sha256).sort(),
    orchestrator: doc.orchestrator.map(f => f.sha256).sort(),
  });
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

function main(): void {
  const verifyMode = process.argv.includes('--verify');
  
  // Ensure contracts directory exists
  if (!fs.existsSync(CONTRACTS_DIR)) {
    fs.mkdirSync(CONTRACTS_DIR, { recursive: true });
  }

  // Find all frozen files
  const engineFiles = findFiles('modules/**/*.engine.ts', SRC_DIR);
  const typeFiles = findFiles('**/*.types.ts', SRC_DIR);
  const kernelFiles = findFiles('physics/**/*.ts', SRC_DIR);
  const orchestratorFiles = findFiles('wshp/wshp.diagx.ts', SRC_DIR);

  // Generate fingerprints
  const engines = engineFiles.map(f => getFileInfo(f, SRC_DIR)).sort((a, b) => a.path.localeCompare(b.path));
  const types = typeFiles.map(f => getFileInfo(f, SRC_DIR)).sort((a, b) => a.path.localeCompare(b.path));
  const kernel = kernelFiles.map(f => getFileInfo(f, SRC_DIR)).sort((a, b) => a.path.localeCompare(b.path));
  const orchestrator = orchestratorFiles.map(f => getFileInfo(f, SRC_DIR)).sort((a, b) => a.path.localeCompare(b.path));

  const docWithoutChecksum: Omit<FingerprintDocument, 'checksum'> = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    phase: '3.5',
    description: 'Engine fingerprints for integrity verification. Any change to these files requires architect approval.',
    engines,
    types,
    kernel,
    orchestrator,
  };

  const doc: FingerprintDocument = {
    ...docWithoutChecksum,
    checksum: generateDocumentChecksum(docWithoutChecksum),
  };

  if (verifyMode) {
    // Verify against existing fingerprints
    if (!fs.existsSync(OUTPUT_PATH)) {
      console.error('ENGINE_FINGERPRINTS.json not found. Run without --verify to generate.');
      process.exit(1);
    }
    
    const existing: FingerprintDocument = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
    const existingChecksum = generateDocumentChecksum(existing);
    const currentChecksum = doc.checksum;
    
    if (existingChecksum !== currentChecksum) {
      console.error('❌ Fingerprint mismatch detected!');
      console.error(`  Expected: ${existing.checksum}`);
      console.error(`  Current:  ${currentChecksum}`);
      console.error('');
      console.error('Frozen files have been modified. Review required.');
      process.exit(1);
    }
    
    console.log('✅ Engine fingerprints verified successfully');
    console.log(`  Checksum: ${currentChecksum}`);
    console.log(`  Engines: ${engines.length}`);
    console.log(`  Types: ${types.length}`);
    console.log(`  Kernel: ${kernel.length}`);
    console.log(`  Orchestrator: ${orchestrator.length}`);
  } else {
    // Generate new fingerprints
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(doc, null, 2), 'utf-8');
    
    console.log('Engine fingerprints generated successfully');
    console.log(`  Output: ${OUTPUT_PATH}`);
    console.log(`  Checksum: ${doc.checksum}`);
    console.log(`  Engines: ${engines.length}`);
    console.log(`  Types: ${types.length}`);
    console.log(`  Kernel: ${kernel.length}`);
    console.log(`  Orchestrator: ${orchestrator.length}`);
  }
}

main();
