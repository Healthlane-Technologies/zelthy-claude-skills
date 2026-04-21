#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const VERSION = require('../package.json').version;
const PACKAGE_SKILLS = path.join(__dirname, '..', 'skills');
const GLOBAL_DIR = path.join(os.homedir(), '.claude', 'skill-repos', 'zango-skills');
const USER_SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills');
const PROJECT_DIR = process.cwd();
const PROJECT_SKILLS_DIR = path.join(PROJECT_DIR, '.claude', 'skills');

const SKILLS = ['zango-frontend', 'app-panel'];

const CLAUDE_MD_BLOCK = `
## Zango Skills

| Skill | Description |
|-------|-------------|
| \`zango-frontend\` | Build Zango frontend - pages, tables, forms, workflows, routing, auth, theme |
| \`app-panel\` | Browser automation for Zango admin panel |

### Key Rules
- Import from \`@zango-core/crud/table\` and \`@zango-core/crud/form\` (NEVER \`@zango-core/crud\`)
- Server API uses snake_case: \`json_schema\`, \`ui_schema\`, \`form_data\`, \`status_label\`, \`next_transitions\`, \`tag_details\`
`;

// ─── Helpers ───

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

// ─── Step 1: Copy skills to global location ───

console.log('');
console.log('Zango Skills Installer');
console.log('======================');
console.log('');

if (fs.existsSync(GLOBAL_DIR)) {
  fs.rmSync(GLOBAL_DIR, { recursive: true });
}

copyDir(PACKAGE_SKILLS, GLOBAL_DIR);
fs.writeFileSync(path.join(GLOBAL_DIR, '.version'), VERSION, 'utf8');

console.log(`  Global: ~/.claude/skill-repos/zango-skills/ (v${VERSION})`);

// ─── Step 2: Symlink into ~/.claude/skills/ (global) ───

function linkSkills(skillsDir, label) {
  fs.mkdirSync(skillsDir, { recursive: true });

  const linked = [];
  const skipped = [];

  for (const skill of SKILLS) {
    const target = path.join(skillsDir, skill);
    const source = path.join(GLOBAL_DIR, skill);

    if (fs.existsSync(target)) {
      const stat = fs.lstatSync(target);

      if (stat.isSymbolicLink()) {
        const existing = fs.readlinkSync(target);
        if (existing === source) {
          skipped.push(skill);
          continue;
        }
        fs.unlinkSync(target);
      } else if (stat.isDirectory()) {
        console.log(`  WARN: ${skill}/ is a regular directory in ${label} — skipping (local override)`);
        skipped.push(skill);
        continue;
      }
    }

    fs.symlinkSync(source, target);
    linked.push(skill);
  }

  if (linked.length > 0) {
    console.log(`  ${label}: linked ${linked.join(', ')}`);
  }
  if (skipped.length > 0) {
    console.log(`  ${label}: skipped ${skipped.join(', ')} (already linked)`);
  }
}

// Always link globally
linkSkills(USER_SKILLS_DIR, 'Global (~/.claude/skills)');

// ─── Step 3: Update CLAUDE.md (only if in a project directory) ───

const claudeMdPath = path.join(PROJECT_DIR, 'CLAUDE.md');
const isProjectDir = fs.existsSync(path.join(PROJECT_DIR, '.git')) || fs.existsSync(path.join(PROJECT_DIR, 'package.json'));

if (isProjectDir) {
  if (fs.existsSync(claudeMdPath)) {
    const content = fs.readFileSync(claudeMdPath, 'utf8');
    if (content.includes('Zango Skills')) {
      console.log('  CLAUDE.md: already has Zango section');
    } else {
      fs.appendFileSync(claudeMdPath, '\n' + CLAUDE_MD_BLOCK);
      console.log('  CLAUDE.md: appended Zango section');
    }
  } else {
    fs.writeFileSync(claudeMdPath, '# Project Instructions\n' + CLAUDE_MD_BLOCK, 'utf8');
    console.log('  CLAUDE.md: created');
  }
} else {
  console.log('  CLAUDE.md: skipped (not a project directory)');
}

// ─── Step 4: Summary ───

console.log('');
console.log(`Zango Skills installed (v${VERSION})`);
console.log('  Restart Claude Code to use skills.');
console.log('');
