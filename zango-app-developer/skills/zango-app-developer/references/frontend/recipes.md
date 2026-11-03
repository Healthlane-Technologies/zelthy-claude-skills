# Recipes — CrudHandler

Copy-paste recipes for pages hosted by `CrudHandler`. Check the right file
before scaffolding:

| Building | Read |
|----------|------|
| **A list page** (primary path — your own table, toolbar, filters, pager) | [recipes-headless.md](recipes-headless.md) |
| Detail pages, drawers, workflow, forms | [recipes-detail.md](recipes-detail.md) |
| A drop-in table, or a custom body inside `CrudHandler` | this file |
| Styling and theming | [styling.md](styling.md) |

Written against `@zango-core/crud` **2.1.1**. Four rules apply to every recipe
below:

1. **Section props take stable component references.** `customTableBody`,
   `customHeader`, `customUtilities`, `customPagination`, `customMainDetail`:
   declare the component at module scope or `useMemo` it. An inline arrow is a
   new component type every render, so the section remounts and refetches.
   (`customDrawerDetail` is the exception — the package *calls* it as a
   function inside its own detail provider — but module scope is still the
   clearer habit.)
2. **Open the package drawer with `useTableContext().openDetailDrawer(row)`**,
   passing a `Row<T>` from `crud.table.getRowModel().rows`. On crud ≤ 2.1.1,
   `crud.detail.open`, `crud.row.onClick` and `useTable().handleRowClick` do
   nothing (see [crud.md → Version notes](crud.md#version-notes-crud--211)).
3. **`customDrawerDetail` already sits inside a `DetailViewProvider`.** Read the
   record with `useDetailViewContext()`; wrapping your own provider around it
   fetches the record twice.
4. **Extra buttons go in `extraRightActions` or `headerProps.extraActions`.**
   `extraLeftActions` / `extraRightActions` land in the toolbar;
   `headerProps.extraActions` lands in the header beside the add button.
   `headerProps.customRightActions` / `customLeftActions` are typed but nothing
   renders them, and `utilityProps` only reaches a `customUtilities` component.

| # | Recipe | Main pieces |
|---|--------|-------------|
| C1 | [Custom list layout (cards, kanban)](#c1-custom-list-layout-cards-kanban) | `customTableBody` + `useCrud()` |
| C2 | [Row click opens your own modal](#c2-row-click-opens-your-own-modal) | `TableBody` custom handler |
| C3 | [Stats header above the table](#c3-stats-header-above-the-table) | `customHeader` + metadata `stats` |
| C4 | [Custom filter controls](#c4-custom-filter-controls) | `useTableFilters()` |
| C5 | [Export](#c5-export) | default download, or `exportParams` |
| C6 | [Custom page with a CRUD table](#c6-custom-page-with-a-crud-table) | `CrudHandler` in a page |
| C7 | [Own toolbar from the package controls](#c7-own-toolbar-from-the-package-controls) | `customUtilities` |
| C8 | [Row actions in a custom body](#c8-row-actions-in-a-custom-body) | `ActionsCell` |
| C9 | [React to a create from the add drawer](#c9-react-to-a-create-from-the-add-drawer) | `TableAddButton onFormSuccess` |
| C10 | [Remount to refresh](#c10-remount-to-refresh) | `key` + `freshRows` |
| C11 | [App branding and theming](#c11-app-branding-and-theming) | `ZangoApp` configs |

Moved: drawer detail → [D2](recipes-detail.md#d2-drawer-detail), route detail →
[D1](recipes-detail.md#d1-route-based-detail-page), full control →
[H1](recipes-headless.md#h1-the-list-page-core), nested tabs →
[D6](recipes-detail.md#d6-related-records-in-a-tab), multi-tab detail →
[D3](recipes-detail.md#d3-multi-tab-detail-page), workflow →
[D4](recipes-detail.md#d4-workflow-status-and-tags), form drawer →
[D5](recipes-detail.md#d5-server-driven-form-in-a-drawer).

---

## C1. Custom list layout (cards, kanban)

**When:** the user wants cards, a kanban board or a calendar instead of the
default table, but the package should still own fetching, toolbar and drawer.

```jsx
import { CrudHandler, useTableContext } from '@zango-core/crud/table';
import { useCrud } from '@zango-core/crud/core';

// List rows carry workflow_status as { status_label, status_color } — no status key.
const COLUMNS = ['To do', 'In progress', 'Done'];

/* Module scope — a stable component reference. */
function TaskBoard() {
  const crud = useCrud();
  const { openDetailDrawer } = useTableContext();

  // Row<T> wrappers, not crud.data: customDrawerDetail reads selectedRow.original.
  const rows = crud.table?.getRowModel().rows ?? [];
  if (crud.isLoading && rows.length === 0) return <p>Loading…</p>;

  return (
    <div className="flex gap-4">
      {COLUMNS.map((status) => (
        <section key={status} className="flex-1">
          <h3>{status}</h3>
          {rows
            .filter((r) => r.original.workflow_status?.status_label === status)
            .map((r) => (
              <article key={r.original.object_uuid} onClick={() => openDetailDrawer(r)}>
                {r.original.title}
              </article>
            ))}
        </section>
      ))}
    </div>
  );
}

<CrudHandler api_endpoint="/api/tasks/" customTableBody={TaskBoard} />
```

**Gotchas:**
- `customTableBody` receives **no props** — read everything from `useCrud()`.
  A body written as `({ data }) => …` gets `undefined` and renders nothing.
  Pagination, search and filters keep working because the header, toolbar and
  pager are still `CrudHandler`'s.
- Pass page callbacks (open my drawer, start a flow) to the body through React
  context, not props or closures — the body must stay a stable component.
- For a card grid with its own pager, set `showPagination={false}` and render
  `TablePagination` (or your own pager from `crud.pagination`) inside the body.
- Reporting a row count up to the parent? Write to a store, not parent state —
  a parent re-render with a new callback loops.

---

## C2. Row click opens your own modal

**When:** a row click should open a modal or dialog that your page owns.

```jsx
import { useMemo, useState } from 'react';
import { CrudHandler, TableBody } from '@zango-core/crud/table';

export default function EntityPage() {
  const [selectedUuid, setSelectedUuid] = useState(null);

  /* Memoized so the reference stays stable; setSelectedUuid never changes. */
  const ModalTableBody = useMemo(
    () =>
      function ModalTableBody() {
        return (
          <TableBody
            defaultDetailView={{
              action: 'custom',
              customHandler: (row) => setSelectedUuid(row.original.object_uuid),
            }}
          />
        );
      },
    [],
  );

  return (
    <>
      <CrudHandler api_endpoint="/api/entity/" customTableBody={ModalTableBody} />
      {selectedUuid && (
        <EntityModal uuid={selectedUuid} onClose={() => setSelectedUuid(null)} />
      )}
    </>
  );
}
```

**Gotcha:** keep the modal as a sibling of `CrudHandler`, not inside its tree.
`customHandler` receives the TanStack `Row`, so the uuid is
`row.original.object_uuid`.

---

## C3. Stats header above the table

**When:** summary cards above the table, fed by the same list response.

```jsx
import { CrudHandler, useTable, TableHeader } from '@zango-core/crud/table';

/* Module scope. */
function StatsHeader() {
  const t = useTable();                       // flat shape
  const stats = t.rawResponse?.stats ?? {};
  return (
    <>
      <div className="flex gap-4 p-4">
        <div>Total: {stats.total ?? '—'}</div>
        <div>Active: {stats.active ?? '—'}</div>
        <div>Pending: {stats.pending ?? '—'}</div>
      </div>
      <TableHeader />
    </>
  );
}

<CrudHandler api_endpoint="/api/entity/" customHeader={StatsHeader} />
```

Prefer **metadata stats** when the backend declares them: read
`crud.metadata?.table_metadata?.stats` (from `useCrud()`) instead of the list
response, so the cards do not change with the current page.

**Gotcha:** `rawResponse.stats` exists only if the backend adds it to the list response —
`rawResponse` is the untouched server payload. `customHeader` replaces the whole
header, so render `<TableHeader />` again if you still want the title and add
button.

---

## C4. Custom filter controls

**When:** status chips, a date toggle or any filter UI of your own.

```jsx
import { CrudHandler, useTableFilters } from '@zango-core/crud/table';

const STATUSES = ['active', 'pending', 'closed'];

/* Module scope. */
function StatusChips() {
  const { getFilter, setFilter, removeFilter } = useTableFilters();
  const current = getFilter('status');
  return (
    <div className="flex gap-2">
      {STATUSES.map((s) => (
        <button
          key={s}
          aria-pressed={current === s}
          onClick={() => (current === s ? removeFilter('status') : setFilter('status', s))}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

<CrudHandler api_endpoint="/api/entity/" extraRightActions={<StatusChips />} />
```

**Gotchas:**
- `useTableFilters()` is the filter slice hook — use it for reads and writes.
- `setFilter(key, value)` stores `value` as-is — use the shape the column's
  filter type expects (an array for multi-select, `[ymdStart, ymdEnd]` for a
  date range).
- Show what is applied with `<AppliedFilters />` (**unreleased** after 2.1.1):
  one chip per filter plus "Clear all". Pass `hidden={['status']}` for keys your
  own chips already show.

---

## C5. Export

**When:** an export that respects the current search and filters.

- **Default:** keep `CrudHandler`'s toolbar download button. It already sends
  the backend export (`action=export_table`) with the table's own query.
- **Custom button:** build the params with `exportParams` from
  [H8](recipes-headless.md#h8-export-with-the-tables-own-query) — it reads
  `useTableContext()`, which works inside `CrudHandler` too — and put the button
  in `extraRightActions`.

**Gotcha:** the backend expects the data call's encoding (`search[value]`,
`columns[i][search][value]`, `filter[key]`), not JSON blobs of `filterObj` /
`sorting`. Hand-rolled JSON params are not read by the backend.

---

## C6. Custom page with a CRUD table

**When:** a custom page mixes a CRUD table with other UI.

```jsx
// src/custom/pages/DashboardPage.jsx
import { CrudHandler } from '@zango-core/crud/table';

const DashboardPage = () => (
  <div style={{ padding: 32 }}>
    <h1>Dashboard</h1>
    <div>Custom stats or UI here</div>
    <CrudHandler api_endpoint="/api/entity/" headerProps={{ title: 'Recent items' }} />
  </div>
);
export default DashboardPage;

// src/custom/pages/index.js — the export name MUST match the route's `component`
export { default as DashboardPage } from './DashboardPage';
```

**Gotchas:**
- The export name in `pages/index.js` must match the backend route's
  `component` field exactly. A mismatch renders a blank page.
- `export * from './X'` re-exports **named** exports only. A page whose component
  is a default export must be re-exported by name:
  `export { default as X } from './X'`.
- Routes that render the same component for several pages tell them apart with
  `extra_params.page_key`.

---

## C7. Own toolbar from the package controls

**When:** the toolbar needs a different layout or extra controls, but search,
filters and export should keep their package behaviour.

```jsx
import { CrudHandler, TableDownloadButton, TableSearchField, useTable } from '@zango-core/crud/table';

/* Module scope. Each control wires itself to the table through context. */
function Toolbar() {
  const { hideControls, setHideControls } = useTable();
  return (
    <div className="flex items-center gap-2 p-3">
      <TableSearchField inputSize="md" placeholder="Search…" />
      <button onClick={() => setHideControls(!hideControls)}>Filters</button>
      <TableDownloadButton label="Export" size="md" />
    </div>
  );
}

<CrudHandler api_endpoint="/api/entity/" customUtilities={Toolbar} />
```

**Gotchas:**
- The Filters button toggles the package's own filter panel (sidebar or
  horizontal, per `filterLayout`). It starts hidden. To show filters in your
  own popover instead (filters on the right), see
  [H6](recipes-headless.md#h6-filters-in-a-popover-on-the-right) — the same
  popover works inside `CrudHandler`.
- `TableSearchField` and `TableDownloadButton` default to `sm`, one step
  smaller than the other controls. Pass `inputSize="md"` / `size="md"` to line
  them up.
- `TableDownloadButton` hides itself when `utilities_config.show_download` is
  false in the metadata; `showDownload` overrides that.
- `customUtilities` receives the `utilityProps` bag as props. The default
  toolbar never sees `utilityProps`.

---

## C8. Row actions in a custom body

**When:** a card or kanban body (recipe 1) needs the same row actions the
default table shows, with their confirmations and forms.

```jsx
import { ActionsCell, CrudHandler, useTableContext } from '@zango-core/crud/table';
import { useCrud } from '@zango-core/crud/core';

/* Module scope. */
function EntityCards() {
  const crud = useCrud();
  const { openDetailDrawer } = useTableContext();
  const rows = crud.table?.getRowModel().rows ?? [];
  return rows.map((r) => (
    <article key={r.original.object_uuid} onClick={() => openDetailDrawer(r)}>
      <h3>{r.original.title}</h3>
      {/* Keep a click on an action from also opening the drawer. */}
      <span onClick={(e) => e.stopPropagation()}>
        <ActionsCell row={r} />
      </span>
    </article>
  ));
}

<CrudHandler api_endpoint="/api/entity/" customTableBody={EntityCards} />
```

**Gotchas:**
- `ActionsCell` reads the actions from the row (`actions_col` or
  `row_actions`) and owns their confirmation dialogs and form drawers. Pass the
  `Row` or the plain record; both work.
- By default the first two actions render inline and the rest go into a
  three-dot menu. To put all of them behind a menu, pass
  `renderActions={({ actions, onActionClick }) => …}` and call
  `onActionClick(action)` from your own menu items.
- Intercept `type === 'form'` actions in your `renderActions` if you want them
  in your own panel instead of the package's form drawer.

---

## C9. React to a create from the add drawer

**When:** the page must do something after a record is created from the add
drawer (refresh a count, open the new record, refetch a sibling table).

```jsx
import { CrudHandler, TableAddButton } from '@zango-core/crud/table';

function AddButton() {                               // module scope
  const onCreated = useContext(CreatedContext);      // page callback via context
  return <TableAddButton enableDrawer size="md" onFormSuccess={onCreated} />;
}

<CrudHandler
  api_endpoint="/api/entity/"
  showAddButton={false}                              // hide the default one
  headerProps={{ extraActions: <AddButton /> }}
/>
```

**Gotchas:**
- `TableAddButton` refreshes the table itself, then calls `onFormSuccess`. Its
  drawer size follows `drawerSize` → metadata `form_config.drawer_size` → `md`.
- Do **not** use `formProps={{ onResponse }}`: `formProps` is spread **after**
  the add button's own `onResponse`, so it replaces the package handler — no
  table refresh, no success screen — and `onResponse` is not in the `FormProps`
  type.
- `TableAddButton` reads the table context; it can sit anywhere under the
  provider, including a portal into another header slot.

---

## C10. Remount to refresh

**When:** the rows changed in a way a refetch alone shows wrongly — a bulk
change, or a table whose cached rows would paint the pre-change state first.

```jsx
const [version, setVersion] = useState(0);
<CrudHandler key={version} api_endpoint="/api/entity/" freshRows />
// after the change:
setVersion((v) => v + 1);
```

**Gotcha:** `freshRows` drops the cached rows for that endpoint on mount;
without it the remounted table first paints the cached (stale) rows. For a
plain "a row changed" case, `crud.actions.refetch()` is enough.

---

## C11. App branding and theming

**When:** customise login page, navbar, topbar and colours.

```jsx
import { ZangoApp } from '@zango-core/appbuilder';
import * as customPages from './custom/pages';

const App = () => (
  <ZangoApp
    appInitializerEndpoint="/appbuilder/initializer/"
    customPages={customPages}
    layoutConfig={{ showTopbar: true, showNavbar: true }}
    navbarConfig={{
      collapsible: true,
      customLogo: <img src="/logo.svg" width={28} height={28} alt="Logo" />,
      customBottomContent: <div style={{ padding: 12, fontSize: 12 }}>v1.0.0</div>,
    }}
    topbarConfig={{
      customRightContent: <button>Help</button>,
    }}
    authConfig={{
      theme: { primaryColor: '#5048ED', background: { color: '#F7F7FB' } },
      logo: { url: '/logo.svg', width: '120px' },
      login: { title: 'Welcome back', submitButtonText: 'Sign in', showRememberMe: true },
      roleSelection: { title: 'Select your role' },
    }}
  />
);
```

Theme colours come from the backend AppBuilder config and become CSS variables
(`var(--color-brand-500)`, `var(--color-gray-200)`) and Tailwind classes
(`bg-brand-50`, `text-brand-500`) for your own components.

**Gotchas:**
- The package is `@zango-core/appbuilder` — not `crm-framework`.
- `showTopbar` / `showNavbar` live inside `layoutConfig`, not on `ZangoApp`.
- Colours are configured in the App Panel / initializer API, not in React.
- Full prop reference: [appbuilder.md](appbuilder.md).
- Theme seams outside `ZangoApp` props (sidebar width, page background) are CSS
  variables — see [styling.md](styling.md).
