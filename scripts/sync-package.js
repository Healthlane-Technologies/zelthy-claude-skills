#!/usr/bin/env node

/**
 * Syncs root skills/ into package/skills/ before npm publish.
 * Run automatically via package.json build/prepublishOnly scripts.
 *
 * Usage: node scripts/sync-package.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'skills');
const DEST = path.join(ROOT, 'package', 'skills');

console.log('Syncing skills into package/');
console.log(`  Source: ${SRC}`);
console.log(`  Target: ${DEST}`);

// Clean destination
if (fs.existsSync(DEST)) {
  fs.rmSync(DEST, { recursive: true });
  console.log('  Cleaned existing package/skills/');
}

// Recursive copy
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(SRC, DEST);

// Count files
let count = 0;
function countFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) countFiles(path.join(dir, entry.name));
    else count++;
  }
}
countFiles(DEST);

console.log(`  Synced ${count} files`);
console.log('Done!');
