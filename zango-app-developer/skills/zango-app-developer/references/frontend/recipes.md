# Recipes

Copy-paste recipes for common frontend patterns. Check here before scaffolding.

Every recipe follows the hooks-first model in [crud.md](crud.md): `CrudHandler`
(or `TableProvider`) hosts the engine, and your own components read it with
`useCrud()` / `useTable()` / the slice hooks. Three rules apply to every recipe
below — they are the reason most hand-written versions break:

1. **Component props get component references, never inline arrows.**
   `customTableBody`, `customHeader`, `customDrawerDetail`, `customMainDetail`:
   declare the component at module scope, or `useMemo` it. An inline arrow is a
   new component every render, so the section remounts and refetches.
2. **Open the drawer with `useTableContext().openDetailDrawer(row)`.** In
   `@zango-core/crud` 2.0.0, `crud.detail.open`, `crud.row.onClick` and
   `useTable().handleRowClick` pass their arguments in the wrong order and do
   nothing. See [crud.md → Known traps](crud.md#known-traps).
3. **`DetailViewProvider` needs the uuid inside the URL.** Pass
   `apiUrl={`${endpoint}?object_uuid=${uuid}`}`, or `baseApiUrl` + `objectUuid`.
   `apiUrl` + `objectUuid` together silently drops the uuid.

| # | Recipe | Main pieces |
|---|--------|-------------|
| 1 | [Custom list layout (cards, kanban)](#1-custom-list-layout-cards-kanban) | `customTableBody` + `useCrud()` |
| 2 | [Drawer detail view](#2-drawer-detail-view) | `customDrawerDetail` + `DetailViewProvider` + `useDetailViewContext()` |
| 3 | [Route-based detail view](#3-route-based-detail-view) | `enableDetailViewRoute` + `customMainDetail` |
| 4 | [Row click opens your own modal](#4-row-click-opens-your-own-modal) | `TableBody` custom handler |
| 5 | [Stats header above the table](#5-stats-header-above-the-table) | `customHeader` + `useTable().rawResponse` |
| 6 | [Custom filter controls](#6-custom-filter-controls) | `useTableFilters()` |
| 7 | [Export with current search, filters and sort](#7-export-with-current-search-filters-and-sort) | `useTable()` debounced state |
| 8 | [Full control, no CrudHandler chrome](#8-full-control-no-crudhandler-chrome) | `TableProvider` + `useCrud()` + `CrudProvider` |
| 9 | [Custom page with a CRUD table](#9-custom-page-with-a-crud-table) | `CrudHandler` in a page |
| 10 | [Nested CRUD in tabs](#10-nested-crud-in-tabs) | one `CrudHandler` per tab |
| 11 | [Multi-tab detail page](#11-multi-tab-detail-page) | `useDetailView()` + nested `CrudHandler` |
| 12 | [Standalone workflow status and tags](#12-standalone-workflow-status-and-tags) | `DetailViewProvider` + `WorkflowStatus` |
| 13 | [Server-driven form in a drawer](#13-server-driven-form-in-a-drawer) | `FormRenderer` |
| 14 | [App branding and theming](#14-app-branding-and-theming) | `ZangoApp` configs |

---

## 1. Custom list layout (cards, kanban)

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

**Gotcha:** `customTableBody` receives **no props** — read everything from
`useCrud()`. A body written as `({ data }) => …` gets `undefined` and renders
nothing. Pagination, search and filters keep working because the header,
toolbar and pager are still `CrudHandler`'s.

---

## 2. Drawer detail view

**When:** clicking a row opens the record in a side drawer with your own layout.

```jsx
import { CrudHandler, DetailViewProvider, useDetailViewContext } from '@zango-core/crud/table';

const ENDPOINT = '/api/entity/';

function EntityDrawerBody({ onClose }) {
  const ctx = useDetailViewContext();                 // reads the provider, never fetches
  const { data, loading, workflowDetails } = ctx ?? {};
  if (loading || !data) return <p>Loading…</p>;
  return (
    <div>
      <h2>{data.title}</h2>
      <p>{workflowDetails?.current_status_meta?.status_label}</p>
      {Object.entries(data.general_details?.fields ?? {}).map(([key, f]) => (
        <div key={key}>{f.display_name}: {f.value}</div>
      ))}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

/* Module scope. Receives exactly { selectedRow, open, onClose }. */
function EntityDrawer({ selectedRow, open, onClose }) {
  const uuid = selectedRow?.original?.object_uuid;
  if (!open || !uuid) return null;
  return (
    <DetailViewProvider baseApiUrl={ENDPOINT} objectUuid={uuid}>
      <EntityDrawerBody onClose={onClose} />
    </DetailViewProvider>
  );
}

<CrudHandler api_endpoint={ENDPOINT} customDrawerDetail={EntityDrawer} detailDrawerSize="lg" />
```

**Gotcha:** `customDrawerDetail` gets **no fetched data** — only
`{ selectedRow, open, onClose }`, where `selectedRow` is a TanStack `Row`
(`selectedRow.original` holds the record). Fetch it yourself through
`DetailViewProvider`. Use `baseApiUrl` + `objectUuid`; `apiUrl` +
`objectUuid` fetches without the uuid. Read it with `useDetailViewContext()`:
`useDetailView()` under a provider starts its own fetch until the provider's
data arrives, so the record loads twice.

---

## 3. Route-based detail view

**When:** the detail is its own page at `…/detail-view/:object_uuid`, not a drawer.

```jsx
import { useNavigate } from 'react-router-dom';
import { CrudHandler, TableBody } from '@zango-core/crud/table';

/* Module scope — makes default-table rows navigate on click. */
function NavigateTableBody() {
  return <TableBody defaultDetailView="navigate" />;
}

/* Module scope. Props are camelCase, injected by the package. */
function EntityDetail({ data, generalDetails, workflowDetails, onRefresh }) {
  const navigate = useNavigate();
  if (!data) return null;
  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{data.title}</h1>
      <p>{workflowDetails?.current_status_meta?.status_label}</p>
      {Object.entries(generalDetails?.fields ?? {}).map(([key, f]) => (
        <div key={key}>{f.display_name}: {f.value}</div>
      ))}
      <button onClick={onRefresh}>Reload</button>
    </div>
  );
}

<CrudHandler
  api_endpoint="/api/entity/"
  enableDetailViewRoute
  customMainDetail={EntityDetail}
  customTableBody={NavigateTableBody}
/>
```

With a custom body (recipe 1), navigate yourself instead of using `TableBody`:

```jsx
import { useCrud } from '@zango-core/crud/core';

/* Module scope. Still needs enableDetailViewRoute + customMainDetail. */
function EntityCards() {
  const crud = useCrud();
  const navigate = useNavigate();
  const open = (uuid) =>
    navigate(`${window.location.pathname.replace(/\/$/, '')}/detail-view/${uuid}`);
  return (crud.data ?? []).map((row) => (
    <article key={row.object_uuid} onClick={() => open(row.object_uuid)}>{row.title}</article>
  ));
}
```

**Gotchas:**
- `customMainDetail` props are **camelCase** (`generalDetails`,
  `workflowDetails`, `onRefresh`, `objectUuid`), unlike the snake_case API
  payload. Destructuring `general_details` gets `undefined`.
- `<CrudHandler defaultDetailView="navigate">` is **ignored** in 2.0.0 —
  `CrudHandler` drops the prop. Put it on `TableBody`, or set
  `detail_config.default_view` in the backend table metadata.
- Without `enableDetailViewRoute` the URL changes but no route matches it.

---

## 4. Row click opens your own modal

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

## 5. Stats header above the table

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

**Gotcha:** `stats` exists only if the backend adds it to the list response —
`rawResponse` is the untouched server payload. `customHeader` replaces the whole
header, so render `<TableHeader />` again if you still want the title and add
button.

---

## 6. Custom filter controls

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

<CrudHandler
  api_endpoint="/api/entity/"
  headerProps={{ customRightActions: <StatusChips /> }}
/>
```

**Gotcha:** write filters through `useTableFilters()`. `crud.filters.setFilter()`
from `useCrud()` updates state that never reaches the query, so the rows only
change on reload. `setFilter(key, value)` stores `value` as-is — use the shape
the column's filter type expects (e.g. an array for multi-select).

---

## 7. Export with current search, filters and sort

**When:** an export button that respects what the user has applied.

```jsx
import { useTable } from '@zango-core/crud/table';

/* Render anywhere inside CrudHandler — e.g. headerProps.customRightActions. */
function ExportButton({ exportEndpoint }) {
  const t = useTable();
  const handleExport = () => {
    const params = new URLSearchParams({
      search: t.debouncedSearchTerm ?? '',
      filters: JSON.stringify(t.debouncedFilterObj ?? {}),
      sorting: JSON.stringify(t.sorting ?? []),
    });
    window.open(`${exportEndpoint}?${params}`);
  };
  return <button onClick={handleExport}>Export</button>;
}

<CrudHandler
  api_endpoint="/api/entity/"
  headerProps={{ customRightActions: <ExportButton exportEndpoint="/api/entity/export/" /> }}
/>
```

**Gotcha:** use the `debounced*` values — they are what the table actually
queried. `useTableFilters()` has `debouncedFilterObj` but **no**
`debouncedSearchTerm`; that lives on `useTableSearch()` and `useTable()`.
Match the parameter names to what your export view parses.

---

## 8. Full control, no CrudHandler chrome

**When:** your own header, toolbar, list and pager — nothing from the package UI.

```jsx
import { TableProvider, CrudProvider } from '@zango-core/crud/table';
import { useCrud } from '@zango-core/crud/core';

function OrdersInner() {
  const crud = useCrud();                     // no arguments
  return (
    <CrudProvider value={crud}>
      <input value={crud.search.term} onChange={(e) => crud.search.setTerm(e.target.value)} />
      <ul>{(crud.data ?? []).map((o) => <li key={o.object_uuid}>{o.title}</li>)}</ul>
      <button disabled={!crud.pagination.hasPreviousPage} onClick={crud.pagination.goToPreviousPage}>Prev</button>
      <button disabled={!crud.pagination.hasNextPage} onClick={crud.pagination.goToNextPage}>Next</button>
    </CrudProvider>
  );
}

export default function OrdersPage() {
  return (
    <TableProvider apiUrl="/api/orders/">
      <OrdersInner />
    </TableProvider>
  );
}
```

**Gotcha:** `useCrud()` takes **no** `apiUrl` — it reads `TableProvider`.
Passing one leaves `crud.table` null and loads nothing. `useCrud()` is
namespaced (`crud.search.term`); `useTable()` is flat (`t.searchTerm`).
There is no drawer here, so route to a detail page or render your own.

---

## 9. Custom page with a CRUD table

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

**Gotcha:** export name in `pages/index.js` must match the backend route's
`component` field exactly. A mismatch renders a blank page.

---

## 10. Nested CRUD in tabs

**When:** a detail view has tabs, each with its own CRUD table
(Program → Teams, Vendors).

```jsx
import { useState } from 'react';
import { CrudHandler } from '@zango-core/crud/table';

/* Module scope — one component per tab, no inline arrows. */
function TeamsTab({ programUuid }) {
  return (
    <CrudHandler
      api_endpoint={`/api/team/?program_uuid=${programUuid}`}
      enableDetailViewRoute={false}
      customDrawerDetail={TeamDrawer}       // module-scope, see recipe 2
      detailDrawerSize="full"
    />
  );
}

function VendorsTab({ programUuid }) {
  return (
    <CrudHandler
      api_endpoint={`/api/vendor/?program_uuid=${programUuid}`}
      enableDetailViewRoute={false}
    />
  );
}

export function ProgramTabs({ programUuid }) {
  const [tab, setTab] = useState('teams');
  return (
    <div>
      <button onClick={() => setTab('teams')}>Teams</button>
      <button onClick={() => setTab('vendors')}>Vendors</button>
      {tab === 'teams' && <TeamsTab programUuid={programUuid} />}
      {tab === 'vendors' && <VendorsTab programUuid={programUuid} />}
    </div>
  );
}
```

**Gotcha:** set `enableDetailViewRoute={false}` on nested handlers — their
detail route would fight the parent's. Each handler is a separate engine keyed
by its `api_endpoint`, so the parent uuid goes in the query string.

---

## 11. Multi-tab detail page

**When:** a full detail page with tabs: overview, workflow, related records.

```jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CrudHandler, useDetailView, WorkflowStatus } from '@zango-core/crud/table';

export default function EntityDetailPage() {
  const { object_uuid: uuid } = useParams();
  const detailUrl = `/api/entity/?object_uuid=${uuid}`;
  const { data, loading, workflowDetails, refresh } = useDetailView({ apiUrl: detailUrl });
  const [tab, setTab] = useState('overview');

  if (loading || !data) return <p>Loading…</p>;
  return (
    <div>
      <h1>{data.title}</h1>
      {workflowDetails && (
        <WorkflowStatus apiUrl={detailUrl} workflowDetails={workflowDetails} onStatusChange={refresh} />
      )}
      <button onClick={() => setTab('overview')}>Overview</button>
      <button onClick={() => setTab('items')}>Items</button>
      {tab === 'overview' && <Overview data={data} />}
      {tab === 'items' && (
        <CrudHandler api_endpoint={`/api/items/?entity_uuid=${uuid}`} enableDetailViewRoute={false} />
      )}
    </div>
  );
}
```

**Gotcha:** take the uuid from `useParams()`, not by splitting
`window.location.pathname`. If this page is a `customMainDetail` instead,
skip the fetch — the props already carry `data`, `workflowDetails` and
`onRefresh` (recipe 3).

---

## 12. Standalone workflow status and tags

**When:** workflow status/tags on a page that is not inside `CrudHandler`.

```jsx
import { DetailViewProvider, useDetailViewContext, WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';

function WorkflowBar() {
  const ctx = useDetailViewContext();
  if (!ctx?.workflowDetails) return null;     // gate the mount — see crud.md traps
  return (
    <div>
      <WorkflowStatus workflowDetails={ctx.workflowDetails} />
      <WorkflowTags tagDetails={ctx.workflowDetails.tag_details} />
    </div>
  );
}

export function EntityWorkflow({ objectUuid }) {
  return (
    <DetailViewProvider apiUrl={`/api/entity/?object_uuid=${objectUuid}`}>
      <WorkflowBar />
    </DetailViewProvider>
  );
}
```

**Gotchas:**
- One provider = one fetch shared by both components. Without it, give each an
  `apiUrl` containing `object_uuid`, and each fetches on its own.
- Inside a provider, do not pass `onStatusChange` / `onTagChange` that refresh
  again — the hook already refreshes the provider, and you get two reloads.

---

## 13. Server-driven form in a drawer

**When:** a form whose schema comes from the backend, in your own drawer or
dialog — edit forms, row actions, status-dependent forms.

```jsx
import { FormRenderer } from '@zango-core/crud/form';

export function EditDrawer({ objectUuid, status, open, onClose, onSuccess }) {
  if (!open) return null;
  // Different action_key → different form schema from the backend.
  const actionKey = status === 'draft' ? 'edit_basic' : 'edit';
  return (
    <Drawer open={open} onClose={onClose}>
      <FormRenderer
        api_endpoint="/api/entity/"
        getParams={{ action: 'initialize_form', action_type: 'row', action_key: actionKey, object_uuid: objectUuid }}
        postParams={{ form_type: 'row_action_form', action_type: 'row', action_key: actionKey, object_uuid: objectUuid }}
        onResponse={() => { onSuccess?.(); onClose(); }}
        onError={(e) => console.error(e)}
      />
    </Drawer>
  );
}
```

**Gotcha:** forms are the one place hooks are not the primary path — use
`FormRenderer` and wrap it in your own chrome (see [form.md](form.md)).
`getParams` loads the schema, `postParams` submits; `action_key` must match a
form the backend registered. Backend response:
`{ response: { form: { json_schema, ui_schema, form_data } } }`.

---

## 14. App branding and theming

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
