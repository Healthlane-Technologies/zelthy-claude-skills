# Zango Platform Skills & Documentation

This repository serves as the **single source of truth** for Zango frontend development. It contains:
- Interactive documentation website (source of truth for all patterns)
- Claude Code skills for scaffolding and help
- Auto-generated reference for AI-assisted development

## Skills Available

| Command | Description |
|---------|-------------|
| `/zango-frontend` | Get help with any Zango CRUD question - components, hooks, API formats |
| `/scaffold-crud-page` | Generate a complete CRUD page with CrudHandler |
| `/scaffold-form` | Generate FormRenderer - server-driven or local RJSF |
| `/scaffold-detail` | Generate custom detail view - drawer or route-based |
| `/scaffold-workflow` | Add workflow status transitions and tags |

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
- Utilities: `utilities_config.show_search`, `show_filters_button`, `show_column_options`
- Form drawer size: `metadata.form_config.drawer_size`
- Detail drawer size: `detailDrawerSize` prop on CrudHandler

## For full reference
See `ZANGO-SKILL-REFERENCE.md` (auto-generated from documentation pages).

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
Run this after updating any documentation page in `frontend/src/custom/pages/`.

### Build for Zango Platform
```bash
cd frontend
npm run build:zango
```

## Project Structure
```
├── .claude/commands/        # Claude Code skills
├── ZANGO-SKILL-REFERENCE.md      # Auto-generated full reference
├── scripts/                 # Reference generator
├── frontend/                # Documentation website
│   └── src/custom/pages/    # Source of truth (doc pages)
└── TRACKER.md               # Project progress tracker
```
