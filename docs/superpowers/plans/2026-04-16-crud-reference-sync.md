# CRUD / Workflow / Form Reference Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `skills/zango-frontend/references/{CRUD,WORKFLOW,FORM}-REFERENCE.md` in line with `@zango-core/crud` 1.0.13-rc.8 by editing the 16 `.jsx` source-of-truth doc pages and regenerating.

**Architecture:** Docs pages (`frontend/src/custom/pages/*.jsx`) are the source of truth. The generator `scripts/generate-reference.js` parses only `title=`, `badge=`, `<Section title=>`, `props={[{ name, type, default, description }, …]}`, and `` code={`…`} `` literals. All edits are confined to those literals. Per-page cycle: read → cross-check real package → edit → regenerate → diff-guard → browser-verify → commit. One page per commit.

**Tech Stack:** React 18, Vite (Tailwind v4 via `@tailwindcss/vite`), `bun` (package manager + runtime), `chrome-devtools-mcp` (primary browser driver, `playwright` skill as fallback), git.

**Spec:** `docs/superpowers/specs/2026-04-16-crud-reference-sync-design.md`

**Branch:** `dev-ravi` (already created from `development`)

---

## File Structure

**Source-of-truth edits (16 `.jsx` pages):**

```
frontend/src/custom/pages/
├── CrudHandlerDocs.jsx              ← Task 1
├── DetailViewsDocs.jsx              ← Task 2
├── TableStylingDocs.jsx             ← Task 3
├── UseTableDocs.jsx                 ← Task 4
├── RenderPropsDocs.jsx              ← Task 5
├── WorkflowHooksDocs.jsx            ← Task 6
├── TableBodyDocs.jsx                ← Task 7
├── TableHeaderDocs.jsx              ← Task 8
├── TableUtilitiesDocs.jsx           ← Task 9
├── TablePaginationDocs.jsx          ← Task 10
├── TableSearchDocs.jsx              ← Task 11
├── TableAddButtonDocs.jsx           ← Task 12
├── WorkflowStatusDocs.jsx           ← Task 13
├── WorkflowTagsDocs.jsx             ← Task 14
├── AdvancedDocs.jsx                 ← Task 15
└── FormRendererDocs.jsx             ← Task 16
```

**Regenerated (never hand-edited):**

```
skills/zango-frontend/references/
├── CRUD-REFERENCE.md        ← updated by Tasks 1-12
├── WORKFLOW-REFERENCE.md    ← updated by Tasks 13-15
└── FORM-REFERENCE.md        ← updated by Task 16
```

**Out of scope:** `APPBUILDER-REFERENCE.md`, `Overview.jsx`, `Playground*.jsx`, `scripts/generate-reference.js` (extractor), `SKILL.md`, backend.

**Cross-check sources (read-only, never edit):**

```
/Users/ravi/Downloads/Repos/zango-react-stack/pkg-zango-crud/crud/frontend/src/
├── table/hooks/useTableData.ts           ← envelope + table metadata shape
├── table/hooks/useDetailView.ts          ← detail envelope
├── table/hooks/useWorkflow.ts            ← staticData + return shape
├── table/hooks/useTable.ts               ← unified hook return
├── table/types/customStyles.ts           ← TableCustomClasses / TableCustomStyles
├── table/types/auditLogs.ts              ← `to_state_meta` lives here
├── table/components/TableAddButton.tsx   ← real AddButton surface
├── table/components/WorkflowTransitionsCell.tsx
├── table/detail/StandaloneDetailView.tsx
├── table/detail/DetailViewProvider.tsx
├── table/detail/ChangeLog.tsx            ← `to_state_meta` usage site
├── table/CrudHandler.tsx                 ← CrudHandler prop surface
├── table/index.ts                        ← full export list
├── form/FormRenderer.tsx
└── e2e/mocks/table/{table-metadata,detail-view}.json
```

---

## Conventions All Tasks Follow

1. **Regeneration command:** `cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills && bun scripts/generate-reference.js`
2. **Diff guard:** After regeneration, `git status` / `git diff skills/zango-frontend/references/` must only show the reference file(s) for the current page's category. Cross-file churn → stop and investigate.
3. **Browser verify:** Open `http://localhost:<dev-server-port>/app/<page-route>`. Pass criteria: page renders, no console `error`/`warn` tied to the page, props table row count matches new `props={[...]}` length, code blocks show Prism highlighting.
4. **Commit identity:** `-c user.email=ravi60353@gmail.com -c user.name=cybertron288`. No signature / co-author trailer.
5. **Commit granularity:** One commit per page task. Stage both the `.jsx` edit AND the regenerated reference file delta in the same commit.
6. **Stop condition:** If a field or prop claimed in the current reference is in **no** real source (not types, not hooks, not mocks, not components), stop the task and ask the user before inventing or deleting.
7. **Browser tool order:** Prefer `chrome-devtools-mcp` tools (`mcp__chrome-devtools-mcp__*`). If unavailable, invoke the `playwright` skill. If neither, pause and ask the user.

---

## Task 0: Preflight & baseline

**Files:**
- Read: `scripts/generate-reference.js` (confirm extractor rules)
- Read: `frontend/src/mock/appInitializer.js:63-91` (route → component mapping)
- Dev-server: `frontend/` (background process)

- [ ] **Step 1: Confirm working tree clean on `dev-ravi`**

Run: `cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills && git status && git branch --show-current`
Expected: `On branch dev-ravi` with only pre-existing uncommitted non-plan files (plan + spec already committed on this or ancestor branch). Hard stop if anything under `frontend/src/custom/pages/` or `skills/zango-frontend/references/` is dirty.

- [ ] **Step 2: Install frontend deps if missing**

Run:
```bash
cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills/frontend
test -d node_modules || bun install
```
Expected: `node_modules/` exists after. `bun install` output ends without errors. If peer-dep warnings, ignore.

- [ ] **Step 3: Start dev server in background**

Run (background):
```bash
cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills/frontend && bun run dev
```
Expected stdout contains a line like `Local:   http://localhost:5173/` (or another port). Record the URL — every browser-verify step uses it.

- [ ] **Step 4: Baseline the generator (no-op run)**

Run:
```bash
cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills && bun scripts/generate-reference.js
git status
```
Expected: Generator finishes with `Done! Pages: … Total Props: …`. `git status` shows the three reference files either clean OR with whitespace-only diff. If non-trivial diff appears without any `.jsx` edit, the generator is non-deterministic — stop and flag before proceeding.

- [ ] **Step 5: Smoke-test one page in the browser**

Using `chrome-devtools-mcp` (or playwright skill fallback):
- Navigate to `http://localhost:<port>/app/crud-handler`
- Wait for networkidle
- Capture console messages
- Capture a screenshot

Expected: Page renders with "CrudHandler" title visible, no red console errors. If page is blank or errors, stop — dev server setup is wrong.

- [ ] **Step 6: Commit preflight note (only if anything changed)**

If `git status` shows any staged deltas from steps above (it shouldn't, but if it does):
```bash
cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills
git add -A
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "chore(docs): preflight baseline for CRUD reference sync"
```
Otherwise: no commit, move to Task 1.

---

## Task 0.5: Fix generator `HEADERS` constants

**Files:**
- Modify: `scripts/generate-reference.js` (only the `HEADERS.crud`, `HEADERS.workflow`, `HEADERS.form` string literals — NOT the extractor functions)
- Regenerated: all 4 reference files (the 3 in-scope will change; `APPBUILDER-REFERENCE.md` header is untouched)

**Known drift in the HEADERS constants (all in `HEADERS.crud`):**
1. `Detail View` JSON example has `to_state_meta` on a `next_transitions[]` entry — wrong. Real `to_state_meta` only appears on audit-log entries.
2. Same JSON example has `tag_details: [{ …, tag_label: "Urgent" }]` — wrong. Real shape has `enable`, `disable`, `is_enable_allowed`, `is_disable_allowed`.
3. Same JSON example shows `general_details.fields.name = { name, display_name, type, value }` — real shape is `{ display_name, value }` only.
4. `## Column Types` list includes `integer, float, boolean, datetime, email, file, url, uuid, json` — real column types are `string, number, date, StatusCol, TagsCol, select` (and custom cell components enumerated per-page).
5. `Table Metadata` JSON example missing real fields: `pagination`, `scrollMode`, `add_btn_title`, `show_header`, `show_utilities`, `show_body`, `show_pagination`, `show_count`, `show_add_button`, `enable_empty_state_create`.
6. `Quick Import Reference` block is missing ~20 real exports. Confirmed exports currently listed: `CrudHandler, useTable, TableBody, TableHeader, TableUtilities, TablePagination, TableSearch, TableAddButton, WorkflowStatus, WorkflowTags, DetailViewProvider, useTableSearch, useTableFilters, useTablePagination, useTableSelection, useTableColumns, useTableActions, TableCustomClasses, TableCustomStyles`. Missing (per `pkg-zango-crud/crud/frontend/src/table/index.ts`): `Table, TableProvider, TableDrawer, TableSearchField, TableFilterButton, TableUploadButton, TableDownloadButton, TableColumnOptionsButton, TableClearFiltersButton, TableFilters, TableLayout, TableToolbar, TableContainer, DetailWrapper, DrawerDetailWrapper, StandaloneDetailView, WorkflowFormRenderer, StatusBadge, StatusButton, TagSwitch, ActionsCell, StatusCell, WorkflowTransitionsCell`. Verify via `grep -n '^export' pkg-zango-crud/crud/frontend/src/table/index.ts` before editing — the canonical list is whatever that file exports.

`HEADERS.workflow`: recheck `Workflow Data Format` block. Entries like `Tags: { name, tag_label, state, enable, disable }` list both `tag_label` (wrong — doesn't exist) and `enable`/`disable`. Keep `enable`/`disable`, remove `tag_label`. Transitions line lists `to_state_meta` — remove.

`HEADERS.form`: appears accurate; verify against `pkg-zango-crud/crud/frontend/src/form/FormRenderer.tsx` before committing.

- [ ] **Step 1: Read current headers**

Read `scripts/generate-reference.js:66-171` (the `HEADERS` object). Note exact strings and escape sequences (they're template literals with escaped backticks).

- [ ] **Step 2: Read real shapes**

Read:
1. `pkg-zango-crud/crud/frontend/e2e/mocks/table/detail-view.json` — real `next_transitions`, `tag_details`, `general_details.fields` shape.
2. `pkg-zango-crud/crud/frontend/e2e/mocks/table/table-metadata.json` — real `table_metadata` envelope.
3. `pkg-zango-crud/crud/frontend/src/table/types/auditLogs.ts` — confirm `to_state_meta` is an audit-log field, not transition.

Copy the exact field names from real mocks. Do not paraphrase.

- [ ] **Step 3: Apply edits to `HEADERS.crud`**

1. In the `Detail View` JSON: remove `to_state_meta` from the `next_transitions[]` entry; add the real fields (`confirmation_message`, `description`, `from`, `to`).
2. In the same JSON: replace `tag_details: [{ "name": "urgent", "state": "enabled", "tag_label": "Urgent" }]` with the real shape: `[{ "name": "urgent", "state": "enabled", "enable": { "is_form_based": false, "confirmation_message": "…" }, "disable": { "is_form_based": false, "confirmation_message": "…" }, "is_enable_allowed": true, "is_disable_allowed": true }]`.
3. In the same JSON: `general_details.fields.name = { "display_name": "Name", "value": "val" }` (drop `name` and `type` keys).
4. Replace the `## Column Types` bullet list's inline types with: `string, number, date` (plus retain the cell components `StatusCol`, `TagsCol`, `ActionsCol`, `WorkflowTransitionsCol`, and `select`).
5. In the `Table Metadata` JSON: add the 10 missing top-level fields from `table-metadata.json` in their real positions.
6. In the `Quick Import Reference` code block: replace existing imports with a block that enumerates every name exported by `pkg-zango-crud/crud/frontend/src/table/index.ts`. Group onto logical lines (components, workflow components, hooks, types) but keep the list flat — no commentary. If the export list is very long, split into two `import {...}` statements for readability.

- [ ] **Step 4: Apply edits to `HEADERS.workflow`**

1. In the `Workflow Data Format` block, remove `tag_label` from the Tags line.
2. Remove `to_state_meta: { status_label, status_color }` from the Transitions line.
3. Keep `enable: { is_form_based, confirmation_message }` and `disable: { ... }` on the Tags line.

- [ ] **Step 5: Verify `HEADERS.form`**

Read `HEADERS.form` (around line 124) and `pkg-zango-crud/crud/frontend/src/form/FormRenderer.tsx`. If the header's Server Response Format block is accurate, leave alone. If it drifts, correct.

- [ ] **Step 6: Regenerate and sanity check**

Run:
```bash
cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills && bun scripts/generate-reference.js
```
Expected: script finishes without error. `git diff skills/zango-frontend/references/` shows the three in-scope reference files updated — headers only (page-section content unchanged).

- [ ] **Step 7: Diff guard**

Run: `git status && git diff --stat`
Expected: `scripts/generate-reference.js`, `CRUD-REFERENCE.md`, `WORKFLOW-REFERENCE.md`, and optionally `FORM-REFERENCE.md` changed. Nothing else. `APPBUILDER-REFERENCE.md` may have no diff (its header wasn't touched) — that's fine.

- [ ] **Step 8: Browser verify (spot-check)**

Since the headers are not rendered in the docs website (they're metadata for the generated reference files, consumed by the skill), a browser verify isn't applicable. Instead, read the regenerated `CRUD-REFERENCE.md` head section and confirm:
- No `to_state_meta` under `next_transitions`.
- No `tag_label` under `tag_details`.
- Column types list starts with `string, number, date` (no `integer/float/boolean/datetime/email/file/url/uuid/json`).
- Table metadata JSON has the 10 added fields.
- Quick Import Reference block now enumerates every export from `src/table/index.ts` (cross-ref by grepping `^export` in that file).

- [ ] **Step 9: Commit**

Run:
```bash
cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills
git add scripts/generate-reference.js skills/zango-frontend/references/CRUD-REFERENCE.md skills/zango-frontend/references/WORKFLOW-REFERENCE.md skills/zango-frontend/references/FORM-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(generator): fix HEADERS constants — real next_transitions/tag_details/general_details/column_types shapes"
```

Note: this commit is NOT an extractor change. Only string literals in the `HEADERS` object are edited.

---

## Task 1: CrudHandlerDocs.jsx — full prop refresh

**Files:**
- Modify: `frontend/src/custom/pages/CrudHandlerDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/CrudHandler.tsx`, `.../src/table/index.ts`

**Known drift (from spec §Verified drift):**
- Missing props: `showAddButton, scrollMode, filterLayout, detailDrawerSize, defaultDetailView, renderActions, renderStatus, renderTags, renderWorkflowTransitions, formProps`.
- Unassigned low-level primitives also live here (they compose CrudHandler): `Table`, `TableProvider`, `TableContainer`, `TableLayout`, `TableToolbar`. Verify each exists in `src/table/index.ts`; for each, add a `<Section title="…">` with a short intro + `<PropsTable>` from the real component.

- [ ] **Step 1: Read the current doc page**

Run: open `frontend/src/custom/pages/CrudHandlerDocs.jsx` in full. Note the existing `<Section>` blocks, the current `props={[ … ]}` array, and all `` code={`…`} `` examples.

- [ ] **Step 2: Read the real CrudHandler surface**

Read in order:
1. `pkg-zango-crud/crud/frontend/src/table/CrudHandler.tsx` — prop interface at top of file.
2. `pkg-zango-crud/crud/frontend/src/table/index.ts` — grep for `export { CrudHandler` and any named re-exports.
3. Any TS interface/type the prop `renderActions` / `renderStatus` / `renderTags` / `renderWorkflowTransitions` refers to (search from CrudHandler.tsx).

For each missing prop listed under "Known drift", capture: final name, TypeScript type, default (if any), one-line description grounded in the source.

- [ ] **Step 3: Apply the edit to `CrudHandlerDocs.jsx`**

In the existing `props={[ … ]}` array for the main `<PropsTable>`:
- **Add** each missing prop as a new object `{ name: '…', type: '…', default: '…', description: '…' }`.
- **Correct** any existing entry whose `type` / `default` disagrees with the source.
- **Do not** reorder unrelated entries; append new ones at the end of the array.

If any existing `` code={`…`} `` example calls out a prop that was renamed in source, fix the example to match. Keep indentation/formatting identical to the rest of the file.

- [ ] **Step 4: Regenerate reference files**

Run:
```bash
cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills && bun scripts/generate-reference.js
```
Expected: output includes `CrudHandlerDocs.jsx -> crud: <S> sections, <P> props, <C> code blocks` where `<P>` equals the new `props={[...]}` length.

- [ ] **Step 5: Diff guard**

Run: `git status && git diff --stat`
Expected: only two paths changed — `frontend/src/custom/pages/CrudHandlerDocs.jsx` and `skills/zango-frontend/references/CRUD-REFERENCE.md`. If any other reference file (`WORKFLOW-REFERENCE.md`, `FORM-REFERENCE.md`, `APPBUILDER-REFERENCE.md`) shows any change, stop — generator order is leaking state.

- [ ] **Step 6: Browser verify**

Using `chrome-devtools-mcp` (fallback: playwright skill):
- Navigate to `http://localhost:<port>/app/crud-handler`
- Wait for networkidle
- Capture console, screenshot
- Assert: title "CrudHandler" visible; the new props appear as rows in the PropsTable; no console errors tied to the page.

If any console error or runtime crash — revert the edit (`git restore frontend/src/custom/pages/CrudHandlerDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md`), re-read the source, try again.

- [ ] **Step 7: Commit**

Run:
```bash
cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills
git add frontend/src/custom/pages/CrudHandlerDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): CrudHandler — add missing render props and config props"
```

---

## Task 2: DetailViewsDocs.jsx — detail shape fixes

**Files:**
- Modify: `frontend/src/custom/pages/DetailViewsDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/hooks/useDetailView.ts`, `.../src/table/detail/StandaloneDetailView.tsx`, `.../src/table/detail/DetailViewProvider.tsx`, `.../e2e/mocks/table/detail-view.json`, `.../src/table/types/auditLogs.ts`

**Known drift:**
- `next_transitions[]` entries carry `confirmation_message, description, from, to` — NOT `to_state_meta`.
- `to_state_meta` only exists on audit-log entries (`src/table/types/auditLogs.ts:36`, `src/table/detail/ChangeLog.tsx:300`).
- `tag_details[]` carries `enable: { is_form_based, confirmation_message }`, `disable: { is_form_based, confirmation_message }`, `is_enable_allowed`, `is_disable_allowed` — NOT `tag_label`.
- `general_details.fields[key]` is shape `{ display_name, value }` only. Extra fields (`name, type, searchable, sortable`) in the current prop table don't exist.
- Missing sections: `StandaloneDetailView`, `DetailViewProvider`, `TableDrawer`, `DetailWrapper`, `DrawerDetailWrapper` (verify these three in `src/table/index.ts` / `src/table/detail/` and add a small section per export with a `<PropsTable>`).

- [ ] **Step 1: Read the current doc page**

Read `frontend/src/custom/pages/DetailViewsDocs.jsx` fully. Identify every `<Section>` block, every `` code={`…`} `` with a JSON sample, every `props={[ … ]}` array.

- [ ] **Step 2: Read real shapes**

Read:
1. `pkg-zango-crud/crud/frontend/e2e/mocks/table/detail-view.json` — ground truth for JSON samples.
2. `pkg-zango-crud/crud/frontend/src/table/hooks/useDetailView.ts` — envelope unwrap.
3. `pkg-zango-crud/crud/frontend/src/table/types/auditLogs.ts` — where `to_state_meta` actually lives.
4. `pkg-zango-crud/crud/frontend/src/table/detail/StandaloneDetailView.tsx` — prop surface for new section.
5. `pkg-zango-crud/crud/frontend/src/table/detail/DetailViewProvider.tsx` — prop surface for new section.

- [ ] **Step 3: Apply edits**

1. In every `` code={`…`} `` that shows a `next_transitions[]` item, replace fabricated `to_state_meta: { … }` with the real fields (`confirmation_message`, `description`, `from`, `to`, and keep `name`, `display_name`, `is_form_based`, `is_manual`).
2. In every `` code={`…`} `` that shows a `tag_details[]` entry, replace `tag_label: "…"` with the real shape `{ enable: { is_form_based, confirmation_message }, disable: { is_form_based, confirmation_message }, is_enable_allowed, is_disable_allowed }`. Keep `name` and `state`.
3. In every `` code={`…`} `` that shows `general_details.fields`, reduce each field to `{ display_name, value }`. Remove `name`, `type`, `searchable`, `sortable`.
4. If a `props={[ … ]}` entry documents `general_details.fields[key]`, drop the removed sub-keys and keep only `display_name` and `value`.
5. Add a `<Section title="StandaloneDetailView">` block (after existing detail sections) with: a short intro (plain JSX), a `<PropsTable>` populated from the real component's prop surface, and one `` code={`…`} `` usage example mirroring real patterns.
6. Add a `<Section title="DetailViewProvider">` block with the same shape.
7. For each of `TableDrawer`, `DetailWrapper`, `DrawerDetailWrapper`: verify it exists in `pkg-zango-crud/crud/frontend/src/table/index.ts`. If exported, add a `<Section title="<Name>">` with a short intro and `<PropsTable>` from the source. If not exported (internal-only), skip without adding.

Preserve any correct content; do not rewrite unrelated prose.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js` (from repo root).
Expected: `DetailViewsDocs.jsx -> crud: <S> sections, <P> props, <C> code blocks` with `<S>` increased by 2 (the two new sections) and `<C>` reflecting edited/added blocks.

- [ ] **Step 5: Diff guard**

Run: `git status && git diff --stat`
Expected: only `DetailViewsDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/detail-views`. Assert: page renders, both new sections render with titles, props tables render without row count zero, JSON code blocks render (Prism), no console errors.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/DetailViewsDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): DetailViews — correct next_transitions/tag_details/fields shapes, add StandaloneDetailView + DetailViewProvider sections"
```

---

## Task 3: TableStylingDocs.jsx — expanded class slots + state interfaces

**Files:**
- Modify: `frontend/src/custom/pages/TableStylingDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/types/customStyles.ts` (authoritative)

**Known drift:**
- `TableCustomClasses` — current ~35 slots, real ~55. Missing: `headerContainer, headerTitle, headerTitleCount, headerActions, headerAddButton, loadingOverlay, loadingCell, emptyStateRow, utilitiesLeft, utilitiesRight, clearFiltersButton, columnOptionsButton, paginationControls, paginationSelect, filterItem, statusIcon, tag, tagMore, subItem*, filterBadge, infiniteScrollLoader, skeleton*, bodyRowHover`.
- `TableCustomStyles` state interfaces — current 3 (`RowState, HeaderCellState, ActionButtonState`); real ~20 adding `ContainerState, HeaderContainerState, HeaderTitleState, HeaderActionsState, BodyCellState, UtilitiesState, FilterButtonState, PaginationContainerState, PaginationInfoState, PaginationButtonState, FilterSidebarState, ActionsState, StatusBadgeState, TagsState, TagState, SortButtonState`.

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/TableStylingDocs.jsx` fully.

- [ ] **Step 2: Read real types**

Read `pkg-zango-crud/crud/frontend/src/table/types/customStyles.ts` end to end. Produce a flat list of:
- All string-keyed slots on `TableCustomClasses`.
- All state-interface names and their members.

- [ ] **Step 3: Apply edits**

1. In the `props={[ … ]}` (or `` code={`…`} `` block) documenting `TableCustomClasses`, add one row per missing slot. Row shape: `{ name: '<slot>', type: 'string', default: '-', description: '<one line from the real type / adjacent code>' }`.
2. For `TableCustomStyles`, for every missing state interface add a `<Section title="<Name>State">` with a `` code={`…`} `` TypeScript snippet quoting the real interface verbatim (so it renders as TS in the site).
3. If the file uses a single `props={[ … ]}` for all slots and all interface keys, either keep that shape or split into per-interface `<Section>` blocks — whichever matches the existing page's pattern. Prefer the minimum restructuring that lets each state interface get its own named section.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.
Expected: `TableStylingDocs.jsx -> crud: <S> sections, <P> props, <C> code blocks` with `<P>` increased by ~20 and `<S>` increased by the number of added `<Section>` blocks.

- [ ] **Step 5: Diff guard**

Expected: only `TableStylingDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/table-styling`. Assert: page renders, all new sections appear in any in-page TOC (if present), TS code blocks render.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/TableStylingDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): TableStyling — full TableCustomClasses slot list + all TableCustomStyles state interfaces"
```

---

## Task 4: UseTableDocs.jsx — unified hook return shape

**Files:**
- Modify: `frontend/src/custom/pages/UseTableDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/hooks/useTable.ts`

**Known drift:** Reference documents a small subset; real return has ~100 fields grouped into selection, view-state (column visibility/order/pinning), summary, bulk actions, plus the known `data`, `isLoading`, `handleRowClick`, etc.

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/UseTableDocs.jsx` (lines 1-256, already sized).

- [ ] **Step 2: Read the real hook**

Read `pkg-zango-crud/crud/frontend/src/table/hooks/useTable.ts` end to end. List every returned field under logical groups: core data, loading/error, selection, view state (columns), pagination, filters, search, summary, bulk actions, workflow integration.

- [ ] **Step 3: Apply edits**

1. If the page currently lists return fields in a single `props={[ … ]}` array, expand it to cover every field identified in Step 2. Use the `name` column for the field name, `type` for its TS type (keep types short; truncate with `| …` if very long), `default` = `-`, `description` = one line.
2. Optionally split into `<Section title="Selection">`, `<Section title="View State">`, etc., each with its own `<PropsTable>`. Prefer splitting if the resulting single table would exceed ~40 rows.
3. Update the existing `` code={`…`} `` usage example to destructure one field from each new group, so readers see how to access them.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `UseTableDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/use-table`. Assert: tables render, code example compiles (no syntax-highlight failure from broken backticks), no console errors.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/UseTableDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): useTable — document full unified hook return (selection, view state, summary, bulk actions)"
```

---

## Task 5: RenderPropsDocs.jsx — corrected render-prop argument shapes

**Files:**
- Modify: `frontend/src/custom/pages/RenderPropsDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/components/ActionsCell.tsx`, `StatusCell.tsx`, `TagSwitch.tsx`, `WorkflowTransitionsCell.tsx`, and wherever `renderActions`/`renderStatus`/`renderTags`/`renderWorkflowTransitions` are invoked (grep from `CrudHandler.tsx`).

**Known drift:** Reference arg shapes for these render props don't match real invocation sites. Additionally, the default render targets themselves (`ActionsCell`, `StatusCell`, `StatusBadge`, `StatusButton`, `TagSwitch`) are exports but currently undocumented — each should get a short section here showing its prop surface so users can compose them into custom renderers.

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/RenderPropsDocs.jsx` fully.

- [ ] **Step 2: Read real call sites**

Grep in `pkg-zango-crud/crud/frontend/src/` for each of `renderActions(`, `renderStatus(`, `renderTags(`, `renderWorkflowTransitions(`. Capture the arg object shape at the call site. Note the TS prop type on `CrudHandler`.

- [ ] **Step 3: Apply edits**

For each of the four render props:
1. In the corresponding section's `props={[ … ]}` entry, update `type` to the real TS signature, e.g. `(args: { row, actions, onAction, … }) => ReactNode`.
2. In any `` code={`…`} `` example, ensure the destructured arg matches the real shape.

Then, for each default render target (`ActionsCell`, `StatusCell`, `StatusBadge`, `StatusButton`, `TagSwitch`):
3. Verify the component is exported from `pkg-zango-crud/crud/frontend/src/table/index.ts`.
4. Add a `<Section title="<Name>">` (or sub-section under a grouped section) with a one-line intro and a `<PropsTable>` from the real component's TS interface.
5. Add one `` code={`…`} `` snippet showing usage inside a custom render prop, e.g. `renderStatus={(args) => <StatusBadge {...args} />}`.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `RenderPropsDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/render-props`. Assert: sections render, code examples valid.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/RenderPropsDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): RenderProps — correct arg shapes for renderActions/Status/Tags/WorkflowTransitions"
```

---

## Task 6: WorkflowHooksDocs.jsx — `useWorkflow.staticData` + return shape

**Files:**
- Modify: `frontend/src/custom/pages/WorkflowHooksDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/hooks/useWorkflow.ts`, `useDetailView.ts`

**Known drift:** `useWorkflow` missing new `staticData` option (`useWorkflow.ts:61-64`). Return shape not fully documented.

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/WorkflowHooksDocs.jsx`.

- [ ] **Step 2: Read the real hook**

Read `pkg-zango-crud/crud/frontend/src/table/hooks/useWorkflow.ts` end to end. Capture: options signature (including `staticData`), return shape, usage with and without `apiUrl`.

- [ ] **Step 3: Apply edits**

1. Add `staticData` to the options `props={[ … ]}`. Type: `{ workflow_details?, tag_details? } | undefined`. Default: `-`. Description: one line about bypassing API when data is already fetched elsewhere.
2. Ensure return fields are documented (split into sections if long).
3. Add a second `` code={`…`} `` example showing `useWorkflow({ staticData: detail.workflow_details })` usage.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `WorkflowHooksDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/workflow-hooks`. Assert: new `staticData` prop row visible, new code example renders.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/WorkflowHooksDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): WorkflowHooks — add useWorkflow.staticData + document return shape"
```

---

## Task 7: TableBodyDocs.jsx — scroll + controls props

**Files:**
- Modify: `frontend/src/custom/pages/TableBodyDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/components/TableBody.tsx`

**Known drift:** missing `isInfiniteScroll`, `onScroll`, `hideControls`, `enableEmptyStateCreate`.

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/TableBodyDocs.jsx`.

- [ ] **Step 2: Read real component**

Read `pkg-zango-crud/crud/frontend/src/table/components/TableBody.tsx`. Capture prop TS interface.

- [ ] **Step 3: Apply edits**

Append the 4 missing prop rows to the existing `props={[ … ]}`, using names/types/defaults from the source. Add one small `` code={`…`} `` showing infinite-scroll setup (`isInfiniteScroll`, `onScroll`).

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `TableBodyDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/table-body`. Assert: new prop rows render; new example renders.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/TableBodyDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): TableBody — add isInfiniteScroll/onScroll/hideControls/enableEmptyStateCreate"
```

---

## Task 8: TableHeaderDocs.jsx — prop verification

**Files:**
- Modify: `frontend/src/custom/pages/TableHeaderDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/components/TableHeader.tsx` (and anything it re-exports / renders — e.g. `TableAddButton.tsx`)

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/TableHeaderDocs.jsx`.

- [ ] **Step 2: Read real component**

Read `pkg-zango-crud/crud/frontend/src/table/components/TableHeader.tsx`. Capture the full prop TS interface.

- [ ] **Step 3: Apply edits**

For every prop in the source that is missing from the doc page: append a row. For every doc-page prop that doesn't appear in source: if it's NOT in any related component (grep to confirm), stop and ask — don't silently delete. Otherwise correct its type.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `TableHeaderDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/table-header`. Assert props table matches new length.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/TableHeaderDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): TableHeader — align props to real component surface"
```

---

## Task 9: TableUtilitiesDocs.jsx — prop verification

**Files:**
- Modify: `frontend/src/custom/pages/TableUtilitiesDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/components/TableUtilities.tsx` (and children: `TableSearchField.tsx`, `TableFilterButton.tsx`, `TableClearFiltersButton.tsx`, `TableColumnOptionsButton.tsx`, `TableUploadButton.tsx`, `TableDownloadButton.tsx`).

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/TableUtilitiesDocs.jsx`.

- [ ] **Step 2: Read real components**

Read `TableUtilities.tsx` plus each child component file listed above. Capture each component's prop interface.

- [ ] **Step 3: Apply edits**

1. Correct the main `TableUtilities` `props={[ … ]}`.
2. If the page has a section listing the utility sub-components individually, add/correct each. If not, add a `<Section title="Sub-Components">` with one small `<PropsTable>` per component.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `TableUtilitiesDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/table-utilities`. Assert: all sub-component tables render.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/TableUtilitiesDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): TableUtilities — align main + sub-component props"
```

---

## Task 10: TablePaginationDocs.jsx — prop verification

**Files:**
- Modify: `frontend/src/custom/pages/TablePaginationDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/components/TablePagination.tsx`

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/TablePaginationDocs.jsx`.

- [ ] **Step 2: Read real component**

Read `pkg-zango-crud/crud/frontend/src/table/components/TablePagination.tsx`.

- [ ] **Step 3: Apply edits**

Add/correct props in `props={[ … ]}`. Ensure `pageSize`, `pageSizeOptions`, callbacks, and any pagination-mode flags (`scrollMode`) are present.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `TablePaginationDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/table-pagination`.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/TablePaginationDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): TablePagination — align props to real component"
```

---

## Task 11: TableSearchDocs.jsx — prop verification

**Files:**
- Modify: `frontend/src/custom/pages/TableSearchDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/components/TableSearchField.tsx`, `.../hooks/useTableSearch.ts`

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/TableSearchDocs.jsx`.

- [ ] **Step 2: Read real component + hook**

Read `TableSearchField.tsx` and `useTableSearch.ts`.

- [ ] **Step 3: Apply edits**

Correct/add props for both the field component and the hook. If the current page only documents one, add a section for the other.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `TableSearchDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/table-search`.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/TableSearchDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): TableSearch — align props for field + useTableSearch hook"
```

---

## Task 12: TableAddButtonDocs.jsx — trim unreal props

**Files:**
- Modify: `frontend/src/custom/pages/TableAddButtonDocs.jsx`
- Regenerated: `skills/zango-frontend/references/CRUD-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/components/TableAddButton.tsx`

**Known drift:** current reference lists `variant`, `size`, `showIcon`, `icon`, `onFormSuccess`, `drawerTitle`, `drawerSize` — real surface may be narrower (likely `title`, `onClick`). Verify before removing.

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/TableAddButtonDocs.jsx`.

- [ ] **Step 2: Read real component**

Read `pkg-zango-crud/crud/frontend/src/table/components/TableAddButton.tsx`. Capture exact prop interface verbatim.

- [ ] **Step 3: Apply edits (with stop-condition)**

For each prop currently on the doc page:
- If source has it → keep, correct type/default/description.
- If source does NOT have it → grep for the name in all of `pkg-zango-crud/crud/frontend/src/`. If found nowhere → stop and ask before removing (per spec stop condition). If found only on a different component, remove from this page.

Add any source-only props missing from the doc page.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `TableAddButtonDocs.jsx` and `CRUD-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/table-add-button`.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/TableAddButtonDocs.jsx skills/zango-frontend/references/CRUD-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(crud): TableAddButton — align to real component surface"
```

---

## Task 13: WorkflowStatusDocs.jsx — staticData, renderTransitions sig, before/after hooks

**Files:**
- Modify: `frontend/src/custom/pages/WorkflowStatusDocs.jsx`
- Regenerated: `skills/zango-frontend/references/WORKFLOW-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/components/WorkflowStatus.tsx` (or equivalent), `WorkflowTransitionsCell.tsx`

**Known drift:** Missing `staticData` prop, `renderTransitions` argument shape, `beforeTransition` / `afterTransition` hooks. Additionally, `WorkflowFormRenderer` and `WorkflowTransitionsCell` are exports but undocumented — add sections for each.

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/WorkflowStatusDocs.jsx`.

- [ ] **Step 2: Read real component**

Locate and read `WorkflowStatus` component's source in `pkg-zango-crud/crud/frontend/src/table/` (search: `grep -r "WorkflowStatus" --include='*.ts*'`). Read `WorkflowTransitionsCell.tsx` for the transitions arg shape.

- [ ] **Step 3: Apply edits**

1. Add `staticData`, `beforeTransition`, `afterTransition` rows to `props={[ … ]}`.
2. Update `renderTransitions` row type to the real signature `(args: { transitions, onTransition, … }) => ReactNode`.
3. Add/update a `` code={`…`} `` example showing a `beforeTransition` returning `false` to cancel.
4. Verify `WorkflowFormRenderer` and `WorkflowTransitionsCell` are exported from `pkg-zango-crud/crud/frontend/src/table/index.ts`. For each exported one, add a `<Section title="<Name>">` with a short intro and `<PropsTable>` from the real component's TS interface.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `WorkflowStatusDocs.jsx` and `WORKFLOW-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/workflow-status`.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/WorkflowStatusDocs.jsx skills/zango-frontend/references/WORKFLOW-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(workflow): WorkflowStatus — add staticData, before/afterTransition, fix renderTransitions sig"
```

---

## Task 14: WorkflowTagsDocs.jsx — tag_details shape + staticData + renderTags sig + before/after hooks

**Files:**
- Modify: `frontend/src/custom/pages/WorkflowTagsDocs.jsx`
- Regenerated: `skills/zango-frontend/references/WORKFLOW-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/table/components/WorkflowTags.tsx` (or equivalent), `TagSwitch.tsx`, `e2e/mocks/table/detail-view.json`

**Known drift:** `tag_details[]` shape (see Task 2 Known Drift). Missing `staticData`, `renderTags` signature, `beforeTagChange`, `afterTagChange`.

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/WorkflowTagsDocs.jsx`.

- [ ] **Step 2: Read real component + mocks**

Read `WorkflowTags.tsx` and `TagSwitch.tsx`. Cross-reference `tag_details[]` entries in `e2e/mocks/table/detail-view.json`.

- [ ] **Step 3: Apply edits**

1. In every `` code={`…`} `` showing `tag_details[]`, use the real shape (`enable`, `disable`, `is_enable_allowed`, `is_disable_allowed`, `name`, `state`). No `tag_label`.
2. Add `staticData`, `beforeTagChange`, `afterTagChange` rows to `props={[ … ]}`.
3. Correct `renderTags` row type to real signature.
4. Add a second code example using `staticData`.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `WorkflowTagsDocs.jsx` and `WORKFLOW-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/workflow-tags`.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/WorkflowTagsDocs.jsx skills/zango-frontend/references/WORKFLOW-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(workflow): WorkflowTags — real tag_details shape, add staticData/renderTags/before-after hooks"
```

---

## Task 15: AdvancedDocs.jsx — sweep for stale references

**Files:**
- Modify: `frontend/src/custom/pages/AdvancedDocs.jsx`
- Regenerated: `skills/zango-frontend/references/WORKFLOW-REFERENCE.md`
- Cross-check: any package paths referenced in the page's prose / code examples.

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/AdvancedDocs.jsx` fully.

- [ ] **Step 2: Cross-check every named export / hook / prop**

For each exported name, hook, prop, or type referenced in the page, grep `pkg-zango-crud/crud/frontend/src/` to confirm it still exists. List mismatches.

- [ ] **Step 3: Apply edits**

For each mismatch: either correct the name/type or, if the construct was removed from the package entirely, remove the example (no stop-ask required when source is authoritative — deletion of doc content for deleted API is expected).

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `AdvancedDocs.jsx` and `WORKFLOW-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/advanced`.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/AdvancedDocs.jsx skills/zango-frontend/references/WORKFLOW-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(workflow): Advanced — remove stale refs, align to current package"
```

---

## Task 16: FormRendererDocs.jsx — customWidgets, params, submitButtonContainerId, skipAutoRefresh

**Files:**
- Modify: `frontend/src/custom/pages/FormRendererDocs.jsx`
- Regenerated: `skills/zango-frontend/references/FORM-REFERENCE.md`
- Cross-check: `pkg-zango-crud/crud/frontend/src/form/FormRenderer.tsx` and any adjacent hook/utility it imports

**Known drift:** missing `customWidgets, getParams, postParams, autocompleteParams, submitButtonContainerId, skipAutoRefresh`. `rjsf_schema` client-side mode with `submit_endpoint` not fully documented.

- [ ] **Step 1: Read doc page**

Read `frontend/src/custom/pages/FormRendererDocs.jsx` fully.

- [ ] **Step 2: Read real component**

Read `pkg-zango-crud/crud/frontend/src/form/FormRenderer.tsx` fully. Capture the prop TS interface and any inner types (`CustomWidgets`, etc.).

- [ ] **Step 3: Apply edits**

1. Add rows for `customWidgets, getParams, postParams, autocompleteParams, submitButtonContainerId, skipAutoRefresh` with source-backed types and one-line descriptions.
2. In the `rjsf_schema` section / code examples, add/document the client-side `submit_endpoint` flow. Show a full example: `<FormRenderer rjsf_schema={{ schema, uiSchema, formData, submit_endpoint: '/api/…' }} />`.
3. If `customWidgets` has a specific required shape (verify from source), add a `` code={`…`} `` illustrating registering a widget.

- [ ] **Step 4: Regenerate**

Run: `bun scripts/generate-reference.js`.

- [ ] **Step 5: Diff guard**

Expected: only `FormRendererDocs.jsx` and `FORM-REFERENCE.md` changed.

- [ ] **Step 6: Browser verify**

Navigate to `http://localhost:<port>/app/form-renderer`.

- [ ] **Step 7: Commit**

Run:
```bash
git add frontend/src/custom/pages/FormRendererDocs.jsx skills/zango-frontend/references/FORM-REFERENCE.md
git -c user.email=ravi60353@gmail.com -c user.name=cybertron288 commit -m "docs(form): FormRenderer — add customWidgets/params/submitButtonContainerId/skipAutoRefresh + rjsf_schema.submit_endpoint"
```

---

## Task 17: Final audit

**Files:**
- Read-only: all three regenerated references
- Read-only: git log on `dev-ravi`

- [ ] **Step 1: Read each reference end-to-end**

Read:
1. `skills/zango-frontend/references/CRUD-REFERENCE.md`
2. `skills/zango-frontend/references/WORKFLOW-REFERENCE.md`
3. `skills/zango-frontend/references/FORM-REFERENCE.md`

Scan for:
- Any remaining `to_state_meta` on a `next_transitions[]` context (bug — should only appear in audit-log context).
- Any `tag_label` reference (bug — real shape has `enable`/`disable`).
- Any `{ name, type, searchable, sortable }` description for `general_details.fields[key]` (bug).
- Any mention of `integer, float, boolean, datetime, email, file, url, uuid, json` as a column-types list (bug — real usage is `string, number, date, StatusCol, TagsCol, select`).

If any found — identify which source page carries the stale content and run a delta fix through that page's cycle (treat as Task N.1).

- [ ] **Step 2: Verify commit history**

Run:
```bash
cd /Users/ravi/Downloads/Repos/zango-react-stack/zelthy-claude-skills
git log --oneline dev-ravi ^development
```
Expected: 16 page commits (Tasks 1-16), in order, each following the message template.

- [ ] **Step 3: Verify diff scope vs. `development`**

Run:
```bash
git diff --stat development...dev-ravi -- frontend/src/custom/pages/ skills/zango-frontend/references/
git diff --stat development...dev-ravi -- ':!frontend/src/custom/pages/' ':!skills/zango-frontend/references/' ':!docs/'
```
Expected: first command shows 16 `.jsx` + 3 `.md` paths changed. Second command is empty (no collateral edits anywhere else). If second command shows anything, investigate.

- [ ] **Step 4: Run the generator one more time (idempotence check)**

Run:
```bash
bun scripts/generate-reference.js
git status
```
Expected: `git status` clean. If anything changed on this pass, the last task wasn't committed with its regenerated reference — fix and amend (separate commit on top).

- [ ] **Step 5: Stop dev server**

Terminate the background dev server recorded in Task 0 Step 3.

- [ ] **Step 6: Announce done**

Report to user: branch `dev-ravi` contains 16 per-page commits plus spec + plan. Ready for review / PR against `development`.

---

## Risks and rollback

- **Docs website runtime error from a bad `.jsx` edit:** Per-task browser verify (Step 6) catches these before commit. Revert with `git restore` on the two paths changed in that task.
- **Generator regex edge case (nested braces, backticks in `description`):** Mitigated by keeping descriptions plain ASCII and by inspecting the regenerated reference after every run (Step 5 diff guard).
- **Real-package drift during execution:** Pin cross-check to the current working copy of `pkg-zango-crud`. If mid-plan the package gets updated, note the SHA captured at Task 0 and continue with the captured version; don't re-baseline mid-task.
- **Browser tool unavailable:** Fallback order: chrome-devtools-mcp → playwright skill → pause and ask. Do NOT commit without a browser verify.
- **Cross-file churn on generator run (diff guard fails):** Stop, read the generator, identify why untouched categories' output changed. Likely culprit: accumulator ordering. Resolve before proceeding.
