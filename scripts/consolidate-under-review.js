#!/usr/bin/env node
/**
 * consolidate-under-review.js
 * 
 * Takes all files from docs/under-review/, consolidates them into a single
 * timestamped report in docs/audits/, then deletes the originals.
 * 
 * Usage: node scripts/consolidate-under-review.js
 */

const fs = require('fs');
const path = require('path');

const DOCS = path.resolve(__dirname, '..', 'docs');
const AUDITS = path.join(DOCS, 'audits');
const UNDER_REVIEW = path.join(DOCS, 'under-review');

function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

function categorizeFile(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('recip_stress') || lower.includes('recip-stress')) return 'recip_stress';
  if (lower.includes('scroll_stress') || lower.includes('scroll-stress')) return 'scroll_stress';
  if (lower.includes('combined_profile') || lower.includes('combined-profile')) return 'combined_profile';
  if (lower.includes('recommendation_gap') || lower.includes('recommendation-gap')) return 'recommendation_gaps';
  if (lower.includes('refrigerant_stress') || lower.includes('refrigerant-stress')) return 'refrigerant_stress';
  return 'other';
}

function run() {
  // Ensure directories exist
  if (!fs.existsSync(AUDITS)) {
    fs.mkdirSync(AUDITS, { recursive: true });
  }

  if (!fs.existsSync(UNDER_REVIEW)) {
    console.log('No docs/under-review/ directory found. Nothing to consolidate.');
    return;
  }

  const files = fs.readdirSync(UNDER_REVIEW)
    .filter(f => f.endsWith('.md') || f.endsWith('.json'))
    .map(f => ({
      name: f,
      path: path.join(UNDER_REVIEW, f),
      category: categorizeFile(f),
      mtime: fs.statSync(path.join(UNDER_REVIEW, f)).mtimeMs
    }))
    .sort((a, b) => a.mtime - b.mtime);

  if (files.length === 0) {
    console.log('No files found in docs/under-review/. Nothing to consolidate.');
    return;
  }

  // Group by category and take only the latest of each
  const latestByCategory = {};
  for (const file of files) {
    latestByCategory[file.category] = file; // last one wins (sorted by mtime ascending)
  }

  const timestamp = getTimestamp();
  const outputName = `Consolidated_Test_Report_${timestamp}.md`;
  const outputPath = path.join(AUDITS, outputName);

  let report = `# Consolidated Test Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `**Source:** docs/under-review/\n\n`;
  report += `**Files consolidated:** ${files.length}\n\n`;
  report += `---\n\n`;

  // Table of contents
  report += `## Contents\n\n`;
  const categories = Object.keys(latestByCategory).sort();
  for (const cat of categories) {
    const displayName = cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    report += `- [${displayName}](#${cat.replace(/_/g, '-')})\n`;
  }
  report += `\n---\n\n`;

  // Include each category's latest file
  for (const cat of categories) {
    const file = latestByCategory[cat];
    const displayName = cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    report += `## ${displayName}\n\n`;
    report += `**Source file:** ${file.name}\n\n`;
    
    try {
      const content = fs.readFileSync(file.path, 'utf-8');
      // Strip any leading H1 header to avoid duplicate headers
      const cleanedContent = content.replace(/^#\s+[^\n]+\n+/, '');
      report += cleanedContent;
    } catch (err) {
      report += `*Error reading file: ${err.message}*\n`;
    }
    
    report += `\n\n---\n\n`;
  }

  // Summary section
  report += `## Summary\n\n`;
  report += `| Category | File | Timestamp |\n`;
  report += `|----------|------|----------|\n`;
  for (const cat of categories) {
    const file = latestByCategory[cat];
    const displayName = cat.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const fileTime = new Date(file.mtime).toISOString();
    report += `| ${displayName} | ${file.name} | ${fileTime} |\n`;
  }

  // Write consolidated report
  fs.writeFileSync(outputPath, report, 'utf-8');
  console.log(`✓ Wrote consolidated report: ${outputPath}`);

  // Delete all files from under-review
  let deleted = 0;
  for (const file of files) {
    try {
      fs.unlinkSync(file.path);
      deleted++;
    } catch (err) {
      console.warn(`  Warning: Could not delete ${file.name}: ${err.message}`);
    }
  }
  console.log(`✓ Deleted ${deleted} file(s) from docs/under-review/`);

  console.log('\nDone.');
}

try {
  run();
} catch (err) {
  console.error('Error during consolidation:', err.stack || err);
  process.exit(1);
}
