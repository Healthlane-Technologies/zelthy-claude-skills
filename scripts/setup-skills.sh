#!/bin/bash
# Setup Zango Skills in a project
# Usage: bash /path/to/pkg-zango-skill/scripts/setup-skills.sh [project-dir]
#
# If project-dir is not provided, uses current directory.
# - Symlinks all skill files into .claude/commands/
# - Symlinks ZANGO-SKILL-REFERENCE.md
# - Creates or appends to CLAUDE.md with skill discovery info

set -e

SKILL_REPO="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_DIR="${1:-.}"
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"

echo "Zango Skills Setup"
echo "  Skills source: $SKILL_REPO"
echo "  Target project: $PROJECT_DIR"
echo ""

# 1. Symlink skill files
mkdir -p "$PROJECT_DIR/.claude/commands"

linked=0
skipped=0
for f in "$SKILL_REPO"/.claude/commands/*.md; do
  filename=$(basename "$f")
  target="$PROJECT_DIR/.claude/commands/$filename"
  if [ -L "$target" ]; then
    echo "  Skip (already linked): $filename"
    skipped=$((skipped + 1))
  elif [ -f "$target" ]; then
    echo "  Skip (local file exists): $filename"
    skipped=$((skipped + 1))
  else
    ln -s "$f" "$target"
    echo "  Linked: $filename"
    linked=$((linked + 1))
  fi
done

echo "  Skills: $linked linked, $skipped skipped"
echo ""

# 2. Symlink reference
REF_TARGET="$PROJECT_DIR/ZANGO-SKILL-REFERENCE.md"
if [ -L "$REF_TARGET" ] || [ -f "$REF_TARGET" ]; then
  echo "  Reference: already exists, skipping"
else
  ln -s "$SKILL_REPO/ZANGO-SKILL-REFERENCE.md" "$REF_TARGET"
  echo "  Reference: linked"
fi
echo ""

# 3. Create or append CLAUDE.md
CLAUDE_MD="$PROJECT_DIR/CLAUDE.md"
SKILLS_BLOCK='
## Zango Frontend Skills

The following Zango skills are available via Claude Code slash commands:

| Command | Description |
|---------|-------------|
| `/zango-frontend` | Get help with Zango CRUD - components, hooks, API formats |
| `/scaffold-crud-page` | Generate a complete CRUD page with CrudHandler |
| `/scaffold-form` | Generate FormRenderer (server-driven or local RJSF) |
| `/scaffold-detail` | Generate custom detail view (drawer or route-based) |
| `/scaffold-workflow` | Add workflow status transitions and tags |
| `/launch-frontend` | Create a new Zango frontend app from scratch |
| `/setup-routes` | Configure routes and menu (frontend + backend) |
| `/setup-navbar` | Customize sidebar - logo, menu, bottom content |
| `/setup-auth` | Configure login, OAuth, 2FA, role selection |
| `/setup-theme` | Configure colors, typography, CSS variables |

### Key Rules (for Claude)
- Import from `@zango-core/crud/table` and `@zango-core/crud/form` (NEVER `@zango-core/crud`)
- Server API uses snake_case: `json_schema`, `ui_schema`, `form_data`, `status_label`, `next_transitions`, `tag_details`
- See `ZANGO-SKILL-REFERENCE.md` for complete API reference
'

if [ -f "$CLAUDE_MD" ]; then
  # Check if already contains our block
  if grep -q "Zango Frontend Skills" "$CLAUDE_MD" 2>/dev/null; then
    echo "  CLAUDE.md: already contains Zango skills section, skipping"
  else
    echo "" >> "$CLAUDE_MD"
    echo "$SKILLS_BLOCK" >> "$CLAUDE_MD"
    echo "  CLAUDE.md: appended Zango skills section"
  fi
else
  echo "# Project Instructions" > "$CLAUDE_MD"
  echo "$SKILLS_BLOCK" >> "$CLAUDE_MD"
  echo "  CLAUDE.md: created with Zango skills section"
fi

echo ""
echo "Done! Restart Claude Code in $PROJECT_DIR to use the skills."
echo "Try: /zango-frontend, /launch-frontend, /setup-routes"
