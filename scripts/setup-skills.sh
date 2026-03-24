#!/bin/bash
# Setup Zango Skills in a project
# Symlinks skills from this repo into the workspace's .claude/skills/ directory
# Usage: bash /path/to/pkg-zango-skill/scripts/setup-skills.sh [project-dir]

set -e

SKILL_REPO="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_DIR="${1:-.}"
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"

echo "Zango Skills Setup"
echo "  Source: $SKILL_REPO/skills/"
echo "  Target: $PROJECT_DIR/.claude/skills/"
echo ""

# 1. Symlink skill directories into .claude/skills/
mkdir -p "$PROJECT_DIR/.claude/skills"

linked=0
skipped=0
for skill_dir in "$SKILL_REPO"/skills/*/; do
  skill_name=$(basename "$skill_dir")
  target="$PROJECT_DIR/.claude/skills/$skill_name"
  if [ -L "$target" ]; then
    echo "  Skip (linked): $skill_name/"
    skipped=$((skipped + 1))
  elif [ -d "$target" ]; then
    echo "  Skip (exists): $skill_name/"
    skipped=$((skipped + 1))
  else
    ln -s "$skill_dir" "$target"
    echo "  Linked: $skill_name/"
    linked=$((linked + 1))
  fi
done

echo ""
echo "  Skills: $linked linked, $skipped skipped"
echo ""

# 2. Create or append CLAUDE.md
CLAUDE_MD="$PROJECT_DIR/CLAUDE.md"
SKILLS_BLOCK='
## Zango Skills

| Skill | Description |
|-------|-------------|
| `zango-backend` | Build Zango backend - modules, models, CRUD views, policies, workflows |
| `zango-frontend` | Build Zango frontend - pages, tables, forms, workflows, routing, auth, theme |
| `app-panel` | Browser automation for Zango admin panel |

### Key Rules
- **Backend**: Models must inherit from `DynamicModelBase`, use `ZForeignKey` for relationships
- **Frontend**: Import from `@zango-core/crud/table` and `@zango-core/crud/form` (NEVER `@zango-core/crud`)
- Server API uses snake_case: `json_schema`, `ui_schema`, `form_data`, `status_label`, `next_transitions`, `tag_details`
'

if [ -f "$CLAUDE_MD" ]; then
  if grep -q "Zango Skills" "$CLAUDE_MD" 2>/dev/null; then
    echo "  CLAUDE.md: already has Zango section"
  else
    echo "" >> "$CLAUDE_MD"
    echo "$SKILLS_BLOCK" >> "$CLAUDE_MD"
    echo "  CLAUDE.md: appended Zango section"
  fi
else
  echo "# Project Instructions" > "$CLAUDE_MD"
  echo "$SKILLS_BLOCK" >> "$CLAUDE_MD"
  echo "  CLAUDE.md: created"
fi

echo ""
echo "Done! Restart Claude Code to use skills."
echo "  /zango-backend - Backend development (modules, models, CRUD)"
echo "  /zango-frontend - Frontend development"
echo "  /app-panel - App Panel automation"
