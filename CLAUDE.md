# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A **skills authoring repo**, not an end-user project. Develops two Claude Code skills (`zango-frontend`, `app-panel`) plus the Vite docs website that backs them. Consumer Zango projects install the skills via symlink — they don't copy them.

## Common Commands

```bash
# Docs website (source of truth for CRUD/Workflow/Form/AppBuilder reference)
cd frontend && npm install --legacy-peer-deps && npm run dev

# Regenerate reference files after editing any frontend/src/custom/pages/*.jsx doc
node scripts/generate-reference.js

# Install skills into a consumer project (symlinks — updates flow back automatically)
bash scripts/setup-skills.sh /path/to/consumer-project

# Build docs as standalone or single-file Zango bundle
cd frontend && npm run build           # standalone
cd frontend && npm run build:zango     # single-file via vite.config.zango.js
```

`npm install --legacy-peer-deps` is required — peer-dep mismatch between `@zango-core/*` RC versions and React 18. Do not drop the flag.

## High-Level Architecture

**One-way data flow:** docs pages → generator → reference markdown → skills read references.

```
frontend/src/custom/pages/*.jsx     ← human-authored doc pages (source of truth)
        │                             each has category="crud|workflow|form|appbuilder"
        │
        │  scripts/generate-reference.js
        │  (auto-discovers category=, parses title=, <Section>, props={[...]}, code={`...`})
        ▼
skills/zango-frontend/references/   ← per-category directories
  crud/index.md + CrudHandler.md, TableBody.md, ...
  workflow/index.md + WorkflowStatus.md, ...
  form/index.md + FormRenderer.md
  appbuilder/index.md + ZangoApp.md, ...
        │
        ▼
skills/zango-frontend/SKILL.md      ← routes task → category index → component file
skills/app-panel/SKILL.md           ← routes task → agents/*.md → browser actions
```

Generator auto-discovers category from `<DocPage category="...">` prop in each `.jsx` page. No manual mapping needed. Adding a new doc page with a `category` prop automatically includes it in the right reference bucket.

### The two skills have different shapes

- **`zango-frontend`** — single `SKILL.md` with a routing table, plus `references/` of generated markdown. Writes code.
- **`app-panel`** — `SKILL.md` dispatches to `agents/*.md` (11 sub-docs: launch-app, theme, users, policies, etc.) and uses `references/UI-MAP.md` for selectors. Drives `agent-browser` CLI against the Zango admin UI, no code generation.

### Skill installation model

`scripts/setup-skills.sh` symlinks each `skills/<name>/` directory into `<project>/.claude/skills/<name>/`. Because it's a symlink, regenerating references here updates every consumer project immediately — no re-copy step. The installer appends a short "Zango Skills" block to the consumer's `CLAUDE.md` if absent; it never overwrites existing content.

## Editing Rules Specific to This Repo

- **Do not hand-edit files in `skills/zango-frontend/references/`.** They are regenerated from `frontend/src/custom/pages/`. Edit the `.jsx` page, then run `node scripts/generate-reference.js`.
- **Adding a new doc page** requires two changes: the `.jsx` file (with `category` prop on `<DocPage>`), and an entry in `frontend/src/custom/pages/index.js`.
- **Frontmatter is load-bearing.** Each `SKILL.md` starts with YAML frontmatter (`name`, `description`, `allowed-tools`). Claude Code uses `description` to decide when to trigger the skill — keep it specific about when to use vs. when not to (see `zango-frontend` vs `app-panel` boundary in their descriptions).
- **Tailwind v4** in `frontend/` — no `tailwind.config.js`, styles configured via `@theme` in `index.css` and the `@tailwindcss/vite` plugin.

## Domain Conventions the Skills Enforce

These surface in skill output and in review of generated code:

- Imports: `@zango-core/crud/table` or `@zango-core/crud/form`. Never the bare `@zango-core/crud`.
- Server API payloads are snake_case (`json_schema`, `ui_schema`, `form_data`, `status_label`, `next_transitions`, `tag_details`). The local `rjsf_schema` prop uses camelCase.
- Custom page component name in `pages/index.js` must match the backend route's `component` field exactly — mismatch = blank page.
