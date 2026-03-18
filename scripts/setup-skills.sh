#!/bin/bash
# Setup Zango Skills in a project (Agent Skills Spec format)
# Usage: bash /path/to/pkg-zango-skill/scripts/setup-skills.sh [project-dir]
#
# - Symlinks skill directories into project's skills/ folder
# - Creates or appends to CLAUDE.md with skill discovery info

set -e

SKILL_REPO="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_DIR="${1:-.}"
PROJECT_DIR="$(cd "$PROJECT_DIR" && pwd)"

echo "Zango Skills Setup"
echo "  Skills source: $SKILL_REPO/skills/"
echo "  Target project: $PROJECT_DIR"
echo ""

# 1. Symlink skill directories
mkdir -p "$PROJECT_DIR/skills"

linked=0
skipped=0
for skill_dir in "$SKILL_REPO"/skills/*/; do
  skill_name=$(basename "$skill_dir")
  target="$PROJECT_DIR/skills/$skill_name"
  if [ -L "$target" ]; then
    echo "  Skip (already linked): $skill_name/"
    skipped=$((skipped + 1))
  elif [ -d "$target" ]; then
    echo "  Skip (local dir exists): $skill_name/"
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
## Zango Frontend Skills

The following Zango skills are available in the `skills/` directory (Agent Skills Spec format):

| Skill | Description |
|-------|-------------|
| `zango-frontend` | Get help with Zango CRUD - components, hooks, API formats |
| `scaffold-crud-page` | Generate a complete CRUD page with CrudHandler |
| `scaffold-form` | Generate FormRenderer (server-driven or local RJSF) |
| `scaffold-detail` | Generate custom detail view (drawer or route-based) |
| `scaffold-workflow` | Add workflow status transitions and tags |
| `launch-frontend` | Create a new Zango frontend app from scratch |
| `setup-routes` | Configure routes and menu (frontend + backend) |
| `setup-navbar` | Customize sidebar - logo, menu, bottom content |
| `setup-auth` | Configure login, OAuth, 2FA, role selection |
| `setup-theme` | Configure colors, typography, CSS variables |

### Key Rules (for AI assistants)
- Import from `@zango-core/crud/table` and `@zango-core/crud/form` (NEVER `@zango-core/crud`)
- Server API uses snake_case: `json_schema`, `ui_schema`, `form_data`, `status_label`, `next_transitions`, `tag_details`
- Reference files are in `skills/zango-frontend/references/`
'

if [ -f "$CLAUDE_MD" ]; then
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
