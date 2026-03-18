# Zango Platform Skills & Documentation

This repository serves as the **single source of truth** for Zango frontend development. It contains:
- Interactive documentation website (source of truth for all patterns)
- Industry-standard Agent Skills (following agentskills.io spec)
- Auto-generated reference for AI-assisted development

## Skills Available (in skills/ directory)

| Skill | Description |
|-------|-------------|
| `zango-frontend` | Get help with Zango CRUD - components, hooks, API formats |
| `scaffold-page` | Create a new page (dashboard, custom, or standard CRUD route) |
| `scaffold-table` | Add CrudHandler data table (with custom detail, cards, kanban, styling) |
| `scaffold-form` | Generate FormRenderer (server-driven or local RJSF) |
| `scaffold-detail` | Generate custom detail view (drawer or route-based) |
| `scaffold-workflow` | Add workflow status transitions and tags |
| `launch-frontend` | Create a new Zango frontend app from scratch |
| `setup-routes` | Configure routes and menu (frontend + backend) |
| `setup-navbar` | Customize sidebar - logo, menu, bottom content |
| `setup-auth` | Configure login, OAuth, 2FA, role selection |
| `setup-theme` | Configure colors, typography, CSS variables |
| `skill-creator` | Create and improve skills (from Anthropic) |

## Quick Reference

### Imports (CRITICAL - never import from `@zango-core/crud` directly)
```js
import { CrudHandler, useTable, TableBody, TableHeader } from '@zango-core/crud/table';
import { WorkflowStatus, WorkflowTags, DetailViewProvider } from '@zango-core/crud/table';
import { FormRenderer } from '@zango-core/crud/form';
```

### API Response Format (server uses snake_case)
- Table metadata: `response.table_metadata` with `columns`, `filters`, `utilities_config`, `form_config`
- Table data: `response.table_data` array with `recordsTotal`
- Detail view: `response` with `general_details.fields`, `workflow_details.next_transitions`, `workflow_details.tag_details`
- Form schema: `response.form` with `json_schema`, `ui_schema`, `form_data`

### Key Conventions
- StatusCol data: `{ status_label, status_color }` (not label/color)
- Row actions: `type: "form"` (opens drawer) or `type: "simple"` (confirmation dialog)
- Workflow transitions: `next_transitions` (not transitions), with `display_name`
- Workflow tags: `tag_details` (not tags), with `tag_label` and `state: "enabled"/"disabled"`
- Permissions: `has_add_perm`, `has_upload_perm`, `has_download_perm` (top-level metadata)

## Reference Files
- `skills/zango-frontend/references/CRUD-REFERENCE.md` - CrudHandler, components, hooks
- `skills/zango-frontend/references/WORKFLOW-REFERENCE.md` - WorkflowStatus, Tags, hooks
- `skills/zango-frontend/references/FORM-REFERENCE.md` - FormRenderer
- `skills/zango-frontend/references/APPBUILDER-REFERENCE.md` - ZangoApp, routing, auth, theme

## Development

### Documentation Website
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### Regenerate Reference
```bash
node scripts/generate-reference.js
```

### Build for Zango Platform
```bash
cd frontend
npm run build:zango
```

## Project Structure
```
├── skills/                      # Agent Skills (agentskills.io spec)
│   ├── zango-frontend/          # General help + shared references
│   │   ├── SKILL.md
│   │   └── references/          # 4 focused reference files
│   ├── scaffold-crud-page/
│   ├── scaffold-form/
│   ├── scaffold-detail/
│   ├── scaffold-workflow/
│   ├── launch-frontend/
│   ├── setup-routes/
│   ├── setup-navbar/
│   ├── setup-auth/
│   ├── setup-theme/
│   └── skill-creator/           # From Anthropic
├── scripts/
│   ├── generate-reference.js    # Reference generator
│   └── setup-skills.sh          # Setup script for other projects
├── frontend/                    # Documentation website
│   └── src/custom/pages/        # Source of truth (25 doc pages)
└── TRACKER.md
```
