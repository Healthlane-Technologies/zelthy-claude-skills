# Zango Skills & Documentation

Interactive documentation website + Claude Code skills for Zango frontend development.

## What's Included

### Documentation Website
A full interactive docs site covering CrudHandler, FormRenderer, Workflows, App Builder, Authentication, Theme, and more. Includes live playgrounds with real component rendering.

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Claude Code Skills (10 skills)

| Skill | Command | Description |
|-------|---------|-------------|
| General Help | `/zango-frontend` | Ask anything about Zango CRUD - components, hooks, API formats |
| Scaffold CRUD Page | `/scaffold-crud-page` | Generate a complete CrudHandler page |
| Scaffold Form | `/scaffold-form` | Generate FormRenderer (server-driven or local RJSF) |
| Scaffold Detail | `/scaffold-detail` | Generate custom detail view (drawer or route-based) |
| Scaffold Workflow | `/scaffold-workflow` | Add workflow status transitions and tags |
| Launch Frontend | `/launch-frontend` | Create a new Zango frontend app from scratch |
| Setup Routes | `/setup-routes` | Configure routes and menu (frontend + backend database) |
| Setup Navbar | `/setup-navbar` | Customize sidebar - logo, menu, bottom content |
| Setup Auth | `/setup-auth` | Configure login page, OAuth, 2FA, role selection |
| Setup Theme | `/setup-theme` | Configure colors, typography, CSS variables |

### Auto-Generated Reference
`ZANGO-SKILL-REFERENCE.md` - 144KB reference file with 484 props, 161 code blocks, extracted from all 25 documentation pages. This is what the skills read for knowledge.

---

## Setup: Adding Skills to Your Project

### Option 1: Setup Script (recommended)

One command does everything - symlinks skills, reference, and creates/updates CLAUDE.md:

```bash
bash /path/to/pkg-zango-skill/scripts/setup-skills.sh /path/to/your-project
```

**Example:**
```bash
bash ~/poc_projects/poc/pkg-zango-skill/scripts/setup-skills.sh ~/poc_projects/poc/workspaces/bmspspmonitoring
```

**What it does:**
1. Symlinks each skill file individually into `.claude/commands/` (skips if file already exists)
2. Symlinks `ZANGO-SKILL-REFERENCE.md`
3. If `CLAUDE.md` exists - appends the skills section (won't duplicate if already present)
4. If `CLAUDE.md` doesn't exist - creates it with the skills section

**Safe with existing projects:**
- Won't override existing skill files with the same name
- Won't replace your project's existing CLAUDE.md content
- Idempotent - running it twice is safe

### Option 2: Copy

Copy the files into your project. Simple but requires manual updates.

```bash
cp -r /path/to/pkg-zango-skill/.claude/commands/ your-project/.claude/commands/
cp /path/to/pkg-zango-skill/ZANGO-SKILL-REFERENCE.md your-project/
```

### Option 3: Global (per machine)

Available in every project on the machine.

```bash
mkdir -p ~/.claude/commands
ln -s ~/poc_projects/poc/pkg-zango-skill/.claude/commands/* ~/.claude/commands/
```

---

## Updating Skills

When documentation changes:

```bash
# 1. Update doc pages in frontend/src/custom/pages/
# 2. Regenerate reference
node scripts/generate-reference.js

# 3. If using symlinks - done! Reference auto-updates.
# 4. If using copy - re-copy the files.
```

## Quick Setup Script

Run this from your project to set up everything at once:

```bash
#!/bin/bash
# setup-zango-skills.sh
# Usage: bash setup-zango-skills.sh /path/to/pkg-zango-skill

SKILL_PATH="${1:-$HOME/poc_projects/poc/pkg-zango-skill}"

if [ ! -d "$SKILL_PATH" ]; then
  echo "Error: $SKILL_PATH not found"
  exit 1
fi

mkdir -p .claude/commands

# Symlink each skill file (won't override existing files)
for f in "$SKILL_PATH"/.claude/commands/*.md; do
  filename=$(basename "$f")
  if [ ! -f ".claude/commands/$filename" ]; then
    ln -s "$f" ".claude/commands/$filename"
    echo "Linked: $filename"
  else
    echo "Skipped (exists): $filename"
  fi
done

# Symlink reference
if [ ! -f "ZANGO-SKILL-REFERENCE.md" ]; then
  ln -s "$SKILL_PATH/ZANGO-SKILL-REFERENCE.md" ./ZANGO-SKILL-REFERENCE.md
  echo "Linked: ZANGO-SKILL-REFERENCE.md"
fi

echo "Done! Skills available in Claude Code."
```

---

## Project Structure

```
pkg-zango-skill/
├── .claude/commands/           # Claude Code skills (10 files)
├── ZANGO-SKILL-REFERENCE.md    # Auto-generated reference (144KB)
├── CLAUDE.md                   # Master instructions (auto-loaded)
├── scripts/
│   └── generate-reference.js   # Reference generator
├── frontend/                   # Documentation website
│   └── src/custom/pages/       # Source of truth (25 doc pages)
├── TRACKER.md                  # Project tracker
└── README.md                   # This file
```
