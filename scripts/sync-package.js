#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'zango-app-developer', 'skills');
const DEST = path.join(ROOT, 'package', 'skills');

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

// Clean and copy
if (fs.existsSync(DEST)) {
  fs.rmSync(DEST, { recursive: true });
}

copyDir(SOURCE, DEST);

const count = [];
function countFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) countFiles(path.join(dir, entry.name));
    else count.push(entry.name);
  }
}
countFiles(DEST);

console.log(`Synced ${count.length} files: zango-app-developer/skills/ → package/skills/`);
