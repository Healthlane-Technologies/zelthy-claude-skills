# Zango CRUD Reference

**Package:** `@zango-core/crud` v2.0.0 · React 17/18

> **How this reference is ordered.** The package's own README leads with
> `CrudHandler` and calls it "the primary table component". This reference leads
> with the **hooks** instead, because Zango app code usually needs a custom
> layout, and the hooks are what make that possible without fighting the
> drop-in component. **Neither path is deprecated** — `CrudHandler` is fully
> supported and documented in full below. Use the drop-in when a standard table
> is what you want; use the hooks when you control the markup.

## Quick Import Reference
```js
// Headless logic (no UI, no CSS)
import { useCrud, CrudProvider, useCrudContext } from '@zango-core/crud/core';

// Table engine + all table hooks + CrudHandler
import { CrudHandler, TableProvider, useTable } from '@zango-core/crud/table';
import { useTableSearch, useTableFilters, useTablePagination, useTableSelection, useTableColumns, useTableActions } from '@zango-core/crud/table';
import { DetailViewProvider, useDetailView, useWorkflow, WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';

// Presentational components that pair with useCrud prop bags
import { CrudTable, CrudHeader, CrudToolbar, CrudPagination, CrudFilters, CrudDetailDrawer } from '@zango-core/crud/ui';

// Forms
// Forms — FormRenderer is the path to use; the form hooks are rarely needed
import { FormRenderer } from '@zango-core/crud/form';

import type { TableCustomClasses, TableCustomStyles } from '@zango-core/crud/table';
```

### Entry points

| Import | Contents |
|--------|----------|
| `@zango-core/crud` | Everything (convenience root barrel). |
| `@zango-core/crud/core` | Headless logic only — `useCrud`, `CrudProvider`, types. No UI, no CSS. |
| `@zango-core/crud/ui` | Presentational `Crud*` components and cells. |
| `@zango-core/crud/form` | `FormRenderer`, `FormHandler`, `useForm`, theming. |
| `@zango-core/crud/table` | Table engine — `CrudHandler`, `TableProvider`, all `useTable*` hooks. |

## API Response Formats

### Table Metadata (GET ?action=get_table_metadata)
```json
{ "success": true, "response": { "table_metadata": { "columns": [{ "name": "field", "display_name": "Field", "type": "string", "sortable": true }], "filters": [...], "page_title": "Title", "has_add_perm": true, "has_upload_perm": false, "has_download_perm": true, "utilities_config": { "show_search": true, "show_filters_button": true, "show_column_options": true }, "form_config": { "drawer_size": "md" }, "actions": [{ "name": "Edit", "key": "edit", "type": "form" }] } } }
```

### Table Data (GET ?action=get_table_data&view=table)

> **⚠️ `&view=table` is required.** Calling `?action=get_table_data` without `&view=table` returns a partial or incorrect response. Always include it when fetching table data directly.

The raw endpoint returns **DataTables format** (not a `response.table_data` wrapper):
```json
{ "draw": 0, "recordsTotal": 25, "recordsFiltered": 25, "data": [{ "id": 1, "object_uuid": "uuid", "workflow_status": { "status_label": "Active", "status_color": "#12B76A" }, "row_actions": [{ "name": "Edit", "key": "edit", "type": "form" }] }] }
```

> **Note:** The hooks and `CrudHandler` both normalize this internally — the DataTables format only matters when calling the endpoint directly (e.g. in a custom `fetch`). Read from `data.data` (the array), not `data.response.table_data`.

### Detail View (GET ?action=fetch_item_details&object_uuid=UUID)
```json
{ "success": true, "response": { "pk": 1, "object_uuid": "uuid", "title": "Title", "general_details": { "fields": { "name": { "name": "name", "display_name": "Name", "type": "string", "value": "val" } } }, "workflow_details": { "current_status": "active", "current_status_meta": { "status_label": "Active", "status_color": "#12B76A" }, "next_transitions": [{ "name": "approve", "display_name": "Approve", "is_form_based": false, "to_state_meta": { "status_label": "Approved" } }], "tag_details": [{ "name": "urgent", "state": "enabled", "tag_label": "Urgent" }] }, "sections": [{ "key": "overview", "title": "Overview", "data": {} }] } }
```

## Column Types
- `string`, `integer`, `float`, `boolean`, `date`, `datetime`, `email`, `file`, `url`, `uuid`, `json`
- `StatusCol` - data: `{ status_label, status_color }`
- `TagsCol` - workflow tags
- `ActionsCol` - row actions: `[{ name, key, type: "form"|"simple", confirmation_message }]`
- `WorkflowTransitionsCol` - available transitions

---

# Part 1 — Hooks (primary)

## Choosing a hook

Three ways to drive a table. Pick one per component; do not mix shapes.

| You want | Use | Return shape |
|----------|-----|--------------|
| Everything in one call, flat property names | `useTable()` | **flat** |
| Everything plus ready-made prop bags for `Crud*` components | `useCrud()` | **namespaced** |
| Just one concern (search, pagination, …) | slice hooks | flat, per-concern |

> **⚠️ The single biggest trap: flat vs namespaced.**
> `useTable()` and `useCrud()` return **different shapes for the same data**.
> Mixing them up silently yields `undefined`, not an error.
>
> ```js
> // useTable() — FLAT
> const t = useTable();
> t.searchTerm; t.setSearchTerm("x"); t.currentPage; t.goToNextPage(); t.handleRowClick(rowWrapper);
>
> // useCrud() — NAMESPACED
> const c = useCrud();
> c.search.term; c.search.setTerm("x"); c.pagination.currentPage; c.pagination.goToNextPage(); c.row.onClick(e, row);
> ```

## How to host the hooks

Every hook needs an engine above it. There are three ways to provide one.
Patterns A and B are what real Zango apps use; C is available but rarely chosen.

### A. CrudHandler + customTableBody (most common)

`CrudHandler` mounts `TableProvider`, calls `useCrud()`, and publishes it via
`CrudProvider`. Your custom body renders inside all of that, so it can call
`useCrud()` and get the live engine while you own every pixel of the list.

Use this when you want a custom list layout — cards, kanban, calendar — but are
happy to let the package own fetching, the toolbar, and the detail route.

```jsx
import { CrudHandler } from '@zango-core/crud/table';
import { useCrud } from '@zango-core/crud/core';

/* MUST be module scope — see the stable-reference trap below. */
function ProgramCards() {
  const crud = useCrud();
  const rows = crud.data ?? [];
  if (crud.isLoading && rows.length === 0) return <Skeleton />;
  return (
    <div className="grid grid-cols-3 gap-4">
      {rows.map((row) => <Card key={row.object_uuid} row={row} />)}
    </div>
  );
}

<CrudHandler
  api_endpoint="/api/programs/"
  showHeader={false}
  showPagination={false}
  enableDetailViewRoute
  defaultDetailView="navigate"
  customTableBody={ProgramCards}
/>
```

### B. TableProvider + useCrud + CrudProvider (full control)

Mount the engine yourself when you want no `CrudHandler` chrome at all — your
own header, toolbar and pagination. Re-publish the `useCrud()` result through
`CrudProvider` so slotted children can read it without prop drilling.

```jsx
import { TableProvider, CrudProvider } from '@zango-core/crud/table';
import { useCrud } from '@zango-core/crud/core';

function PageInner() {
  const crud = useCrud();
  return (
    <CrudProvider value={crud}>
      <MyHeader />
      <MyToolbar />
      <MyTable rows={crud.data} />
      <MyPager {...crud.pagination} />
    </CrudProvider>
  );
}

export default function OrdersPage() {
  return (
    <TableProvider apiUrl="/api/orders/">
      <PageInner />
    </TableProvider>
  );
}
```

### C. The packaged Crud* components (available, rarely used)

`useCrud()` also returns prop bags — `headerProps`, `toolbarProps`, `tableProps`,
`paginationProps`, `filterProps`, `detailProps`, `addFormProps` — that spread
onto the components in `@zango-core/crud/ui`. This works, but apps that reach
for the hooks usually want their own markup, which is the whole reason they left
`CrudHandler`. Prefer A or B unless you specifically want the package's look.

```jsx
import { CrudHeader, CrudTable, CrudPagination } from '@zango-core/crud/ui';
const crud = useCrud();
<CrudHeader {...crud.headerProps} />
<CrudTable {...crud.tableProps} />
<CrudPagination {...crud.paginationProps} />
```

> **Import note:** `useCrud` lives in `@zango-core/crud/core` (headless, no CSS)
> and is re-exported from `/table`. Prefer `/core` for it; use `/table` for
> `CrudHandler`, `TableProvider` and the `useTable*` hooks.

---

## Known traps

Each of these cost a real app real debugging time. All verified against source.

### `useCrud().filters` does not drive the query

`crud.filters.setFilter()` / `setFilterObj()` write to state that **never reaches
the provider's query** — the filter appears to apply, but the rows only change on
reload. Use `useTableFilters()`, which mutates `TableProvider` state directly.

```jsx
// ✗ writes persist but rows don't refetch
const crud = useCrud();
crud.filters.setFilter('status', 'active');

// ✓ actually filters
import { useTableFilters } from '@zango-core/crud/table';
const { filterObj, setFilter, removeFilter } = useTableFilters();
setFilter('status', 'active');
```

Read `crud.filters.filterObj` for display if you like, but perform writes through
`useTableFilters()`.

### `crud.filters.columns` is always `[]`

Hardcoded empty in `useCrud`, deliberately: it makes `shapeFilterProps` emit
`undefined` so `FilterContainer` falls back to the table context's transformed
columns. Raw `metadata.columns` uses a snake_case shape the filter inputs cannot
key off. Never read `crud.filters.columns` — source your filter column list from
table metadata instead.

### `customTableBody` / `customMainDetail` must be stable references

`CrudHandler` remounts the section whenever the component's identity changes, so
an arrow function defined during render remounts (and refetches) on every parent
render. Declare the component at module scope, or memoize it.

```jsx
// ✗ new identity every render → remount loop
<CrudHandler customTableBody={() => <OrdersTable bare />} />

// ✓ stable module-scope declaration
function BareOrdersTable() { return <OrdersTable bare />; }
<CrudHandler customTableBody={BareOrdersTable} />
```

### `detail.open(row)` needs a TanStack `Row<T>`, not a data object

`crud.detail.open` is typed `(row: Row<T>) => void` and forwards to
`handleRowClick`, which expects the Row wrapper. But `crud.data` is plain `T[]`.
Inside a custom body there is no Row to hand it.

```jsx
// ✗ crud.data items are not Row<T>
crud.detail.open(crud.data[0]);

// ✓ get real Row objects off the table instance
const rows = crud.table?.getRowModel().rows ?? [];
crud.detail.open(rows[0]);

// ✓ or skip the drawer and route yourself
navigate(`/app/programs/${row.object_uuid}`);
```

`useTable().handleRowClick` has the same `Row<T>` requirement. Note also that in
`useTable`'s **standalone** branch (called *with* an endpoint, outside a
provider) `handleRowClick` is a no-op — row clicks only work on the context
branch, i.e. inside `TableProvider` or `CrudHandler`.

### `WorkflowStatus` / `WorkflowTags` self-fetch

Their internal `useWorkflow` reads `apiUrl` from `DetailViewContext`, not just
the prop — so withholding the prop cannot stop a duplicate `fetch_item_details`.
Only *not mounting* them does. Gate the mount on `workflowDetails` so the hook
short-circuits on data that is already present.

```jsx
if (!workflowDetails) return null;
return <WorkflowStatus workflowDetails={workflowDetails} … />;
```

### Do not forward `onChanged` inside a `DetailViewProvider`

`useWorkflow`'s `toggleTag` / `executeTransition` already `await
context.refreshDetail()` before invoking your callback. Refreshing again in
`onStatusChange` / `onTagChange` refetches the record a second time — one toggle,
two visible reloads. Forward your own refresh **only** when there is no provider
above you (`useDetailViewContext()` returns `null`).

---

## Provider hierarchy

```
TableProvider              owns TableContext + QueryClient + TanStack Table instance
  └─ CrudProvider          owns CrudContext (the useCrud result)
       └─ DetailViewProvider   single-record detail + workflow
```

`TableProvider` requires `apiUrl` and creates its own `QueryClient`. You do not
need to supply `QueryClientProvider` yourself.

```jsx
<TableProvider apiUrl="/api/orders">
  <YourLayout />
</TableProvider>
```

| `TableProvider` prop | Type | Notes |
|---------------------|------|-------|
| `apiUrl` | string | **required** |
| `children` | ReactNode | **required** |
| `columns` | TableColumn[] | Client-side column overrides. |
| `tableId` | string | Auto-derived from `apiUrl` when omitted. |
| `enableDetailViewRoute` | boolean | Enables `/detail-view/:object_uuid`. |
| `scrollMode` | `"pagination" \| "infinite"` | Falls back to API metadata. |
| `filterLayout` | `"sidebar" \| "horizontal"` | Falls back to API metadata. |
| `renderActions` / `renderStatus` / `renderTags` / `renderWorkflowTransitions` | fn | Cell render props (moved here from `useTableData`). |

## Provider requirements

Getting this wrong throws at runtime rather than failing quietly.

| Hook | Provider | Outside the provider |
|------|----------|----------------------|
| `useTableContext` | `TableProvider` | **throws** |
| `useTableSearch` | `TableProvider` | **throws** |
| `useTableFilters` | `TableProvider` | **throws** |
| `useTableColumns` | `TableProvider` | **throws** |
| `useTableSelection` | `TableProvider` | **throws** |
| `useTableActions` | `TableProvider` | **throws** |
| `useCrudContext` | `CrudProvider` | **throws** |
| `useCrud` | `TableProvider` | does not throw, but `table` is `null` and data never loads |
| `useTable` | optional (dual-mode) | safe |
| `useTablePagination` | optional (accepts overrides) | safe |
| `useDetailView` | `DetailViewProvider` optional | safe |
| `useWorkflow` | `DetailViewProvider` optional (auto-syncs) | safe |
| `useDetailViewContext` | `DetailViewProvider` | returns `null` |
| `useOptionalCrudContext` | `CrudProvider` | returns `null` |
| `useTableRowActions` | none (own local state) | standalone |
| `useTableData` | `QueryClientProvider` only | supplied by `TableProvider` |
| `useForm` / `useFormContext` | `FormProvider` | **throws** |
| `useOptionalFormContext` | `FormProvider` | returns `null` |

---

## useTable() — flat, everything in one call

Dual-mode. Reads `TableContext` when given no endpoint; creates a standalone
TanStack Table instance when given one. Never throws.

```ts
useTable<T = TableRowData>(props?: {
  api_endpoint?: string;
  apiUrl?: string;      // legacy alias for api_endpoint
  columns?: ColumnDef<T>[];
  tableId?: string;
}): UseTableReturn<T>
```

Returns a **flat** object — every key below sits at the top level. This is the
complete `UseTableReturn<T>`, grouped by concern for readability only.

**Data**

| Key | Type |
|-----|------|
| `data` | `T[]` — current page rows |
| `flatData` | `T[]` — all fetched rows (infinite scroll accumulates here) |
| `isLoading` | `boolean` — initial load |
| `isFetching` | `boolean` — any fetch, including background refetch |
| `error` | `Error \| null` |
| `totalCount` | `number` |
| `totalDBRowCount` | `number` — server-reported total |

**Search**

| Key | Type |
|-----|------|
| `searchTerm` | `string` |
| `setSearchTerm` | `(term: string) => void` |
| `debouncedSearchTerm` | `string` — the value actually sent |
| `isSearchActive` | `boolean` |

**Filters**

| Key | Type |
|-----|------|
| `filterObj` | `Record<string, TableFilter>` |
| `setFilterObj` | `(filters: Record<string, TableFilter>) => void` |
| `debouncedFilterObj` | `Record<string, TableFilter>` |
| `activeFilterCount` | `number` |
| `clearFilters` | `() => void` |
| `setFilter` | `(key: string, value: unknown) => void` |
| `removeFilter` | `(key: string) => void` |
| `hasFilter` | `(key: string) => boolean` |
| `getFilter` | `(key: string) => TableFilter \| undefined` |

**UI controls**

| Key | Type |
|-----|------|
| `hideControls` | `boolean` |
| `setHideControls` | `(hide: boolean) => void` |

**Pagination**

| Key | Type |
|-----|------|
| `currentPage` | `number` — zero-based |
| `setCurrentPage` | `(page: number) => void` |
| `totalPages` | `number` |
| `rowsPerPage` | `number` |
| `setRowsPerPage` | `(size: number) => void` |
| `hasNextPage` / `hasPreviousPage` | `boolean` |
| `canGoNext` / `canGoPrevious` | `boolean` |
| `pageNumbers` | `number[]` |
| `goToFirstPage` / `goToLastPage` / `goToNextPage` / `goToPreviousPage` | `() => void` |
| `startRow` / `endRow` | `number` |

**Table instance**

| Key | Type |
|-----|------|
| `table` | `TanstackTable<T> \| null` — escape hatch; `getRowModel().rows` gives `Row<T>` wrappers |
| `columns` | `ColumnDef<T>[]` |

**Selection**

| Key | Type |
|-----|------|
| `selectedRows` | `T[]` |
| `setSelectedRows` | `(rows: T[]) => void` |
| `selectRow` | `(row: Row<T>) => void` |
| `selectAll` / `clearSelection` | `() => void` |
| `selectedCount` | `number` |
| `isAllSelected` / `isSomeSelected` / `hasSelection` | `boolean` |
| `selectedRowIds` | `(string \| number)[]` |
| `isRowSelected` | `(row: Row<T>) => boolean` — takes a Row, not an id |
| `toggleRows` | `(rows: Row<T>[]) => void` |
| `selectByIds` / `deselectByIds` | `(ids: (string \| number)[]) => void` |
| `getSelectedData` | `() => T[]` |
| `withSelectedRows` | `(callback: (rows: T[]) => void) => void` |

**Detail drawer**

| Key | Type |
|-----|------|
| `selectedDetailObjectUuid` | `string \| null` |
| `setSelectedDetailObjectUuid` | `(objectUuid: string \| null) => void` |
| `selectedDetailRow` | `Row<T> \| null` |
| `detailDrawerOpen` | `boolean` |
| `setDetailDrawerOpen` | `(open: boolean) => void` |
| `handleRowClick` | `(row: Row<T>, event?: React.MouseEvent) => void` — needs a Row wrapper; no-op on the standalone branch |
| `closeDetailDrawer` | `() => void` |
| `navigateToNextEntry?` / `navigateToPreviousEntry?` | `() => void` — optional |

**Columns (view state)**

| Key | Type |
|-----|------|
| `columnVisibility` | `Record<string, boolean>` |
| `setColumnVisibility` | `(visibility: Record<string, boolean>) => void` |
| `columnOrder` | `string[]` |
| `setColumnOrder` | `(order: string[]) => void` |
| `columnPinning` | `ColumnPinningState` — a single `{left, right}` pair, not per-column |
| `setColumnPinning` | `(pinning: ColumnPinningState) => void` |
| `sorting` | `SortingState` |
| `setSorting` | `(sorting: SortingState) => void` |
| `visibleColumns` | `ColumnDef<T>[]` |
| `hiddenColumns` | `string[]` — ids, not defs |
| `visibleColumnCount` / `hiddenColumnCount` / `totalColumnCount` | `number` |
| `toggleColumnVisibility` / `showColumn` / `hideColumn` | `(columnId: string) => void` |
| `showAllColumns` / `hideAllColumns` | `() => void` |
| `isColumnVisible` | `(columnId: string) => boolean` |
| `moveColumn` | `(columnId: string, toIndex: number) => void` — not `(from, to)` |
| `pinColumnLeft` / `pinColumnRight` / `unpinColumn` | `(columnId: string) => void` |

**Actions**

| Key | Type |
|-----|------|
| `refresh` / `refetch` / `invalidateCache` | `() => void` |
| `isRefreshing` / `canRefresh` / `hasError` | `boolean` |
| `exportData` | `(format?: ExportFormat) => void` |
| `printData` | `() => void` |
| `performBulkAction` | `(action: string, selectedRows?: T[]) => void` |
| `resetTable` | `() => void` |
| `getTableSummary` | `() => { totalRows, visibleRows, selectedRows, currentPage, totalPages, activeFilters, searchTerm, isLoading, isFetching }` |
| `handleUploadClick` / `handleDownloadClick` | `() => void` |

**Configuration, metadata and raw access**

| Key | Type |
|-----|------|
| `apiUrl` | `string` — resolved endpoint |
| `tableId` | `string` |
| `metadata` | `Record<string, unknown> \| null` |
| `isInfiniteScroll` | `boolean` |
| `rawResponse?` | `unknown` — untouched server payload |
| `rawTableData?` | `T[]` — rows before normalization |

```jsx
import { TableProvider, useTable } from "@zango-core/crud/table";

function OrdersTable() {
  const t = useTable();
  if (t.isLoading) return <p>Loading…</p>;

  return (
    <div>
      <input
        value={t.searchTerm}
        onChange={(e) => t.setSearchTerm(e.target.value)}
        placeholder="Search orders…"
      />
      <ul>
        {/* Row<T> wrappers — handleRowClick needs them, plain data items won't do. */}
        {(t.table?.getRowModel().rows ?? []).map((r) => (
          <li key={r.original.id} onClick={() => t.handleRowClick(r)}>
            {r.original.name}
          </li>
        ))}
      </ul>
      <button disabled={!t.hasPreviousPage} onClick={t.goToPreviousPage}>Prev</button>
      <span>Page {t.currentPage + 1} of {t.totalPages}</span>
      <button disabled={!t.hasNextPage} onClick={t.goToNextPage}>Next</button>
    </div>
  );
}

export default function App() {
  return (
    <TableProvider apiUrl="/api/orders">
      <OrdersTable />
    </TableProvider>
  );
}
```

---

## useCrud() — namespaced, with prop bags

Feature-complete CRUD state plus prebuilt prop bags you spread onto the `Crud*`
components from `@zango-core/crud/ui`. This is the composable path.

```ts
useCrud<T = TableRowData>(options?: UseCrudOptions): UseCrudReturn<T>
```

> **⚠️ `useCrud` takes no `apiUrl` and no `tableId`.** Some published examples
> show `useCrud({ apiUrl: "/api/orders" })` — that is wrong and will not
> type-check. The endpoint comes from the surrounding `TableProvider`.
> `useCrud` must be called inside one; used standalone its `table` is always
> `null` and no data loads.

| `UseCrudOptions` | Type |
|------------------|------|
| `initialFilters` | `Record<string, unknown>` |
| `initialSort` | `SortingState` |
| `initialPage` | number |
| `rowsPerPage` | number |
| `scrollMode` | `"pagination" \| "infinite"` |
| `filterLayout` | `"sidebar" \| "horizontal"` |
| `enableDetailView` | boolean |
| `defaultDetailView` | `"drawer" \| "navigate" \| "custom" \| "none"` |
| `navigateUrl` | string |
| `formProps` | `Record<string, unknown>` |
| `config` | `Record<string, unknown>` |

> **⚠️ `scrollMode` is `"pagination"`,** not `"paginated"`.

**Return shape** — flat at the top, namespaced underneath:

| Top level | `data`, `flatData`, `totalCount`, `totalDBRowCount`, `isLoading`, `isFetching`, `error`, `metadata`, `isMetadataLoading`, `features`, `table` |
|-----------|---|
| `features` | `{ add?, edit?, delete?, upload?, download? }` |
| `search` | `{ term, setTerm, debouncedTerm, isActive }` |
| `filters` | `{ filterObj, setFilterObj, setFilter, removeFilter, clearFilters, hasFilter, getFilter, activeCount, debouncedFilterObj, columns }` — ⚠️ **writes here do not drive the query** (use `useTableFilters()`), and `columns` is always `[]`. See Known traps. |
| `pagination` | `{ currentPage, setCurrentPage, totalPages, rowsPerPage, setRowsPerPage, hasNextPage, hasPreviousPage, canGoNext, canGoPrevious, goToNextPage, goToPreviousPage, goToFirstPage, goToLastPage, pageNumbers, startRow, endRow, isInfiniteScroll, fetchMoreOnBottomReached? }` |
| `selection` | `{ selectedRows, selectRow, selectAll, clearSelection, selectedCount, isAllSelected, isSomeSelected, hasSelection, isRowSelected, selectedRowIds, toggleRows, getSelectedData }` |
| `columns` | `{ definitions, visibility, setVisibility, order, setOrder, pinning, setPinning, sorting, setSorting, wrap, setWrap }` |
| `row` | `{ onClick(event, row), onClickAction, navigateUrl?, customClickHandler? }` |
| `detail` | `{ selectedRow, selectedObjectUuid, drawerOpen, open(row), close(), navigateNext(), navigatePrevious(), canNavigateNext, canNavigatePrevious }` — ⚠️ `open()` takes a TanStack `Row<T>`, not an item from `crud.data`. See Known traps. |
| `actions` | `{ refresh, refetch, invalidateCache, executeRowAction(actionKey, objectUuid), executeTransition(transitionName, objectUuid) }` |
| `workflow` | `{ details, transitions, tags }` |
| `ui` | `{ hideControls, setHideControls, filterLayout }` |
| Prop bags | `headerProps`, `toolbarProps`, `tableProps`, `paginationProps`, `filterProps`, `detailProps`, `addFormProps` |

### Composing with the /ui components

The prop bags line up one-to-one with the presentational components, so you can
let the package render its own chrome while you arrange it. This is hosting
pattern C — it works, but most apps that reach for `useCrud` want their own
markup and render the state directly instead.

```jsx
import { TableProvider, useCrud } from "@zango-core/crud/table";
import {
  CrudHeader, CrudToolbar, CrudTable, CrudPagination, CrudFilters, CrudDetailDrawer,
} from "@zango-core/crud/ui";

function OrdersLayout() {
  const crud = useCrud();

  return (
    <div className="grid grid-cols-[240px_1fr] gap-4">
      <aside>
        <CrudFilters {...crud.filterProps} />
      </aside>

      <main>
        <CrudHeader {...crud.headerProps} />
        <CrudToolbar {...crud.toolbarProps} />
        <CrudTable {...crud.tableProps} />
        <CrudPagination {...crud.paginationProps} />
      </main>

      <CrudDetailDrawer {...crud.detailProps} />
    </div>
  );
}

export default function Orders() {
  return (
    <TableProvider apiUrl="/api/orders">
      <OrdersLayout />
    </TableProvider>
  );
}
```

### Sharing crud state with deep children

`useCrud` returns a value; `CrudProvider` publishes it. Children then read it
with `useCrudContext()` instead of prop drilling.

```jsx
import { TableProvider, CrudProvider, useCrud, useCrudContext } from "@zango-core/crud/table";

function OrderCount() {
  const crud = useCrudContext();        // throws outside CrudProvider
  return <p>{crud.totalCount} orders</p>;
}

function OrdersRoot() {
  const crud = useCrud();               // no arguments
  return (
    <CrudProvider value={crud}>
      <OrderCount />
    </CrudProvider>
  );
}

export default function App() {
  return (
    <TableProvider apiUrl="/api/orders">
      <OrdersRoot />
    </TableProvider>
  );
}
```

Use `useOptionalCrudContext()` when a component may render outside a
`CrudProvider` — it returns `null` instead of throwing.

> Anything rendered inside a `CrudHandler` can also call `useCrudContext()`,
> because `CrudHandler` publishes its own `useCrud` result. See Part 2.

---

## Slice hooks

Each covers one concern and reads the surrounding `TableProvider`. All return
**flat** objects. All except `useTablePagination` and `useTableRowActions`
throw when used outside `TableProvider`.

| Hook | Signature | Returns |
|------|-----------|---------|
| `useTableSearch` | `useTableSearch()` | `searchTerm`, `setSearchTerm`, `debouncedSearchTerm` — three keys only |
| `useTableFilters` | `useTableFilters()` | `filterObj`, `setFilterObj`, `debouncedFilterObj`, `activeFilterCount`, `clearFilters`, `setFilter`, `removeFilter`, `hasFilter`, `getFilter` |
| `useTablePagination` | `useTablePagination(overrides?)` | `currentPage`, `setCurrentPage`, `totalPages`, `rowsPerPage`, `setRowsPerPage`, `totalCount`, `canGoNext`, `canGoPrevious`, `hasNextPage`, `hasPreviousPage`, `pageNumbers`, `startRow`, `endRow`, `goToFirstPage`, `goToLastPage`, `goToNextPage`, `goToPreviousPage`, `isInfiniteScroll` |
| `useTableSelection` | `useTableSelection()` | `selectedRows`, `setSelectedRows`, `selectRow`, `selectAll`, `clearSelection`, `selectedCount`, `isAllSelected`, `isSomeSelected`, `hasSelection`, `selectedRowIds`, `isRowSelected`, `toggleRows`, `selectByIds`, `deselectByIds`, `getSelectedData`, `withSelectedRows` |
| `useTableColumns` | `useTableColumns()` | `columns`, `columnVisibility`, `setColumnVisibility`, `columnOrder`, `setColumnOrder`, `columnPinning`, `setColumnPinning`, `sorting`, `setSorting`, `visibleColumns`, `hiddenColumns`, `visibleColumnCount`, `hiddenColumnCount`, `totalColumnCount`, `toggleColumnVisibility`, `showColumn`, `hideColumn`, `showAllColumns`, `hideAllColumns`, `isColumnVisible`, `moveColumn`, `pinColumnLeft`, `pinColumnRight`, `unpinColumn` |
| `useTableActions` | `useTableActions()` | `refresh`, `refetch`, `invalidateCache`, `isRefreshing`, `canRefresh`, `isLoading`, `isFetching`, `hasError`, `error`, `exportData`, `printData`, `performBulkAction`, `resetTable`, `getTableSummary`, `apiUrl`, `tableId`, `config`, `features` |

> **Slice hooks are narrower than `useTable`.** `isSearchActive`,
> `handleUploadClick` and `handleDownloadClick` exist on `useTable()` only —
> not on `useTableSearch()` or `useTableActions()`.

### useTableRowActions() — row interaction behavior

Standalone (own local state, no provider). Configures what a row click does and
tracks the drawer/modal it opens.

```ts
useTableRowActions({
  config?: {
    onRowClick?: RowClickAction;
    onRowDoubleClick?: RowClickAction;
    drawerPosition?: "right" | "left" | "bottom" | "top";
    drawerSize?: "sm" | "md" | "lg" | "xl" | "full";
    customRowClickHandler?: (row: Row<unknown>, event?) => void;
    customRowDoubleClickHandler?: (row: Row<unknown>, event?) => void;
    modalComponent?: React.ComponentType<{ row: Row<unknown>; onClose: () => void }>;
    navigateUrlTemplate?: string;   // "/users/{object_uuid}" or "/users/{id}"
  };
  apiUrl?: string;                  // falls back to context when available
})
```

> **⚠️ Two different `RowClickAction` types share one name.** This hook's union
> is `"drawer" | "navigate" | "modal" | "custom" | "none"`. The one exported
> from `CrudHandler` / `useCrud` has **no `"modal"`** —
> `"drawer" | "navigate" | "custom" | "none"`. Importing the wrong one gives a
> confusing type error on `"modal"`.
| `useTableRowActions` | `useTableRowActions({ config?, apiUrl? })` | `handleRowClick`, `handleRowDoubleClick`, `selectedRow`, `drawerOpen`, `modalOpen`, `setSelectedRow`, `setDrawerOpen`, `setModalOpen`, `closeDrawer`, `closeModal`, `config` — see below |
| `useTableContext` | `useTableContext()` | Raw `TableContext` value. |

```jsx
import { TableProvider, useTableSearch, useTablePagination } from "@zango-core/crud/table";

function SearchBar() {
  const { searchTerm, setSearchTerm } = useTableSearch();
  return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />;
}

function Pager() {
  const { currentPage, totalPages, goToNextPage, hasNextPage } = useTablePagination();
  return (
    <>
      <span>{currentPage + 1} / {totalPages}</span>
      <button disabled={!hasNextPage} onClick={goToNextPage}>Next</button>
    </>
  );
}
```

### useTableData() — the raw engine

Lowest level. Fetches and normalizes; no table instance, no UI. Needs only a
`QueryClientProvider` (which `TableProvider` supplies).

```ts
useTableData({
  apiUrl?: string;
  tableId?: string;
  tableMetadata?: TableMetadata;
  columns?: ColumnDef<TableRowData>[];
  preferProvidedColumns?: boolean;        // default true
  scrollMode?: "pagination" | "infinite";
  filterLayout?: "sidebar" | "horizontal";
})
```

Returns (flat):

| Group | Keys |
|-------|------|
| Data | `flatData`, `totalDBRowCount`, `totalPages`, `totalFetched` |
| Loading | `isLoading`, `isFetching`, `error`, `isMetadataLoading` |
| Search | `searchTerm`, `setSearchTerm`, `debouncedSearchTerm` |
| Filters | `filterObj`, `setFilterObj`, `debouncedFilterObj` |
| Pagination | `currentPage`, `setCurrentPage`, `rowsPerPage`, `setRowsPerPage` |
| Sorting | `sorting`, `setSorting` |
| Infinite scroll | `isInfiniteScroll`, `fetchMoreOnBottomReached`, `initialFetchRef`, `hasNextPage`, `isFetchingNextPage`, `fetchNextPageError` |
| Layout | `filterLayout` |
| Metadata | `tableMetadata`, `columns` |
| Raw | `rawResponse`, `rawTableData` |
| Actions | `refetch`, `refetchAll` |

Note there is **no `data`** here — only `flatData`. Page slicing and the TanStack
table instance belong to `useTable`/`useCrud` above it.

> Cell render props were removed from this hook. They now live on
> `TableProvider` (`renderActions`, `renderStatus`, `renderTags`,
> `renderWorkflowTransitions`).

---

## Detail and workflow hooks

### useDetailView()

```ts
useDetailView(options?: { apiUrl?: string; enabled?: boolean }): {
  data: DetailViewData | null;
  loading: boolean;
  error: Error | null;
  workflowDetails: WorkflowDetails | undefined;   // undefined, not null
  rowActions: unknown[] | undefined;
  refresh: () => Promise<void>;                   // returns a Promise
  objectUuid: string | undefined;
}
```

### useDetailViewContext()

Reads the shared `DetailViewProvider` value. Returns `null` outside one —
null-safe, never throws. Inside a provider it returns the whole context **plus**
a `refreshDetailView` convenience alias.

| Key | Type |
|-----|------|
| `apiUrl` | `string` |
| `objectUuid?` | `string` |
| `data?` | `DetailViewData` |
| `loading` | `boolean` |
| `error` | `Error \| null` |
| `refreshDetail` | `() => Promise<void>` |
| `refreshDetailView` | `() => Promise<void>` — added by the hook; same thing, clearer name |
| `rowActions?` | `unknown[]` |
| `workflowDetails?` | `WorkflowDetails` |

Because it returns `null` outside a provider, it doubles as a probe for "am I
inside a detail view?" — which is how you decide whether to forward your own
refresh callback (see Known traps).

### useWorkflow()

```ts
useWorkflow(options?: {
  apiUrl?: string;
  initialWorkflowDetails?: WorkflowDetails;
  staticData?: unknown;                 // bypasses the API call
  objectUuid?: string;
  beforeTransition?: (t: Transition) => Promise<void> | void;
  afterTransition?: (t: Transition, success: boolean) => Promise<void> | void;
  beforeTagChange?: (tag: TagDetail, newState: string) => Promise<void> | void;
  afterTagChange?: (tag: TagDetail, success: boolean) => Promise<void> | void;
}): {
  workflowDetails: WorkflowDetails | undefined;
  loading: boolean;
  error: Error | null;
  executeTransition: (t: Transition) => Promise<boolean>;
  toggleTag: (tag: TagDetail) => Promise<boolean>;
  refreshWorkflow: () => Promise<void>;
  handleFormSubmit: () => Promise<void>;          // submit a form-based transition
  setWorkflowDetails: (details: WorkflowDetails) => void;
  onCancel: () => void;                           // reset to initial state
}
```

Auto-syncs with `DetailViewProvider` when rendered inside one.

```jsx
import { DetailViewProvider, useDetailView, useWorkflow } from "@zango-core/crud/table";

function OrderDetail() {
  const { data, loading } = useDetailView();
  const { workflowDetails, executeTransition } = useWorkflow();

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h2>{data?.title}</h2>
      <p>Status: {workflowDetails?.current_status_meta?.status_label}</p>
      {workflowDetails?.next_transitions?.map((t) => (
        <button key={t.name} onClick={() => executeTransition(t)}>
          {t.display_name}
        </button>
      ))}
    </div>
  );
}

export default function Wrapper({ objectUuid }) {
  return (
    <DetailViewProvider apiUrl="/api/orders" objectUuid={objectUuid}>
      <OrderDetail />
    </DetailViewProvider>
  );
}
```

---

## Forms — use FormRenderer, not the hooks

**Forms are the exception to this document.** Everywhere else the hooks are the
primary path; for forms they are not. Use `<FormRenderer />` in server-driven
mode, which is what real Zango apps do — by a wide margin, and for a reason.

```jsx
import { FormRenderer } from "@zango-core/crud/form";

<FormRenderer
  api_endpoint="/api/users"
  getParams={{ action: "initialize_form" }}
  postParams={{ form_type: "create_form" }}
  onResponse={closeDrawer}
/>
```

`FormRenderer` reliably drives the `api_endpoint` init/submit cycle: it GETs the
schema, renders the fields, and POSTs back to the same endpoint.

> **⚠️ `FormHandler`'s `renderFields` slot does not fire the init request** in
> shipped builds — the form mounts and stays stuck on its loading spinner. If
> you want custom chrome around a server-driven form, wrap `FormRenderer` in
> your own drawer or dialog rather than reaching for `FormHandler`.

See [form.md](form.md) for the full `FormRenderer` reference — props, local RJSF
mode, and theming.

### The form hooks (rarely needed)

`@zango-core/crud/form` also exports three context readers. They only make sense
inside a `FormHandler`, which supplies the `FormProvider` — most commonly in a
`renderFooter` slot, which does work.

```ts
useForm(): UseFormReturn                        // alias for useFormContext
useFormContext(): UseFormReturn                 // throws outside FormProvider
useOptionalFormContext(): UseFormReturn | null  // null-safe
```

> **⚠️ `useForm()` takes no arguments.** Unlike RJSF's or react-hook-form's
> hooks of the same name, this one is a pure context reader — literally
> `return useFormContext()`. It throws outside a `FormProvider`. Form options
> (`api_endpoint`, schemas, callbacks) are configured on `FormHandler` /
> `FormRenderer`, not passed to the hook.

`UseFormReturn`:

| Key | Type |
|-----|------|
| `formData` | `Record<string, unknown>` |
| `errors` | `any[]` — RJSF error shape |
| `isValid` | `boolean` |
| `isSubmitting` | `boolean` |
| `isSubmitDisabled` | `boolean` |
| `status` | `FormStatus` |
| `schema` | `Record<string, any> \| null` |
| `uiSchema` | `Record<string, any> \| null` |
| `meta` | `Record<string, unknown> \| null` |
| `fields` | `FormField[]` |
| `submit` | `() => void` |
| `reset` | `() => void` |
| `addAnother` | `() => void` — submit and keep the form open for another entry |
| `setFormData` | `(next: Record<string, unknown>) => void` |

The one place they earn their keep is a custom footer on `FormHandler`, whose
`renderFooter` slot hands you the form state directly (no hook call needed) —
and unlike `renderFields`, this slot works:

```jsx
import { FormHandler } from "@zango-core/crud/form";

<FormHandler
  api_endpoint="/api/users"
  renderFooter={(form) => (
    <div className="flex justify-end gap-2">
      <button onClick={form.reset} disabled={form.isSubmitting}>Reset</button>
      <button onClick={form.submit} disabled={form.isSubmitDisabled}>
        {form.isSubmitting ? "Saving…" : "Save"}
      </button>
    </div>
  )}
/>
```

Reach for `useForm()` itself only when a component nested deeper than that slot
needs the same state.

---

# Part 2 — CrudHandler (reference)

`CrudHandler` renders a complete table — header, search, filters, pagination,
detail drawer — from one endpoint. Fully supported; not deprecated.

**It is the same engine as Part 1, pre-wired.** Internally it renders
`TableProvider`, calls `useCrud()`, publishes the result through `CrudProvider`,
and spreads the prop bags onto the `Crud*` components. So anything you render
inside it can call `useCrud()`, `useCrudContext()`, `useTableContext()` or the
slice hooks without prop drilling.

**That makes it two things at once**, and the difference matters:

- **As a drop-in** — `<CrudHandler api_endpoint="…" />` on its own, when a
  standard table is exactly what you want.
- **As a host for the hooks** — hosting pattern A in Part 1. You pass
  `customTableBody` (or `customHeader` / `customMainDetail`), and that component
  calls `useCrud()` to render your own layout on the package's engine. This is
  the most common way real apps use both.

So reading this section is not a fallback to the "old" way. The props below are
what you configure when hosting hooks, and `customTableBody` is the seam.

```jsx
import { CrudHandler } from "@zango-core/crud/table";

export function Users() {
  return <CrudHandler api_endpoint="/api/users/" />;
}
```

## Props

`api_endpoint` is the only required prop.

### Core

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `api_endpoint` | string | — | **Required.** URL of a Zango CRUD view. |
| `tableId` | string | auto | Identifier for state management. Derived from `api_endpoint` when omitted. |
| `columns` | unknown[] | — | Client-side column definitions. |
| `className` | string | — | Class for the main container. |
| `style` | React.CSSProperties | — | Inline styles for the main container. |

### Section visibility

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showHeader` | boolean | true | Show/hide the header section. |
| `showUtilities` | boolean | true | Show/hide the utilities panel. |
| `showBody` | boolean | true | Show/hide the table body. |
| `showPagination` | boolean | true | Show/hide pagination controls. |
| `showAddButton` | boolean | metadata | Show/hide the add button. Falls back to API metadata. |

### Behaviour

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableDetailViewRoute` | boolean | false | Enable the `/detail-view/:object_uuid` route. |
| `scrollMode` | `"pagination" \| "infinite"` | metadata | Pagination or infinite scroll. |
| `filterLayout` | `"sidebar" \| "horizontal"` | metadata | Filter panel placement. |
| `detailDrawerSize` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` | Detail drawer width. Precedence: this prop → `metadata.detail_config.drawer_size` → `"md"`. (A source comment claims `"lg"`; the code uses `"md"`.) |
| `defaultDetailView` | `"drawer" \| "navigate" \| "custom" \| "none"` | — | What a row click does. |

### Section replacement

| Prop | Type | Description |
|------|------|-------------|
| `customHeader` | ComponentType \| string | Replace the header. A string renders as the title. |
| `customUtilities` | ComponentType | Replace the utilities/action bar. |
| `customTableBody` | ComponentType | Replace the table body — this is how you get kanban, calendar or card layouts, and the seam for hosting `useCrud()`. ⚠️ Must be a **stable** component reference. |
| `customPagination` | ComponentType | Replace pagination. |
| `customDrawerDetail` | ComponentType | Custom drawer detail. Receives **only** `{ selectedRow, open, onClose }`. |
| `customMainDetail` | ComponentType | Custom full-page detail for route-based navigation. Receives fetched data — see below. |

> **⚠️ The two detail props are NOT symmetric.** This trips people up.
>
> **`customDrawerDetail` gets no fetched data** — exactly
> `{ selectedRow, open, onClose }`. To load the record, call `useDetailView()`
> inside your component or wrap it in `DetailViewProvider`. Examples that
> destructure `data` or `workflowDetails` from this prop are wrong.
>
> **`customMainDetail` does get fetched data**, injected by `DetailWrapper`:
> `apiUrl`, `data`, `loading`, `error`, `workflowDetails`, `generalDetails`
> (i.e. `data.general_details`), `sections`, `rowActions`, `objectUuid`, `pk`,
> `onRefresh`. Note these are **camelCase**, unlike the snake_case API payload.

### Utilities

Available both as top-level shortcuts and inside `utilityProps`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showSearch` | boolean | true | Search input in the utilities bar. |
| `showFiltersButton` | boolean | true | Filters toggle button. |
| `showColumnOptions` | boolean | true | Column visibility menu. |
| `showUpload` | boolean | false | Upload button. |
| `showDownload` | boolean | true | Download button. |
| `searchPlaceholder` | string | — | Search placeholder text. |
| `extraLeftActions` | ReactNode | — | Extra actions on the left. |
| `extraRightActions` | ReactNode | — | Extra actions on the right. |

`utilityProps` accepts all of the above plus icon/label overrides:
`filterIcon`, `filterLabel`, `filterIconPosition`, `filterBadgeClassName`,
`filterBadgeStyle`, `hideFilterIcon`, `hideFilterBadge`, `downloadIcon`,
`downloadLabel`, `downloadIconPosition`, `hideDownloadIcon`.

### headerProps

| Prop | Type | Description |
|------|------|-------------|
| `headerProps.title` | string | Header title text. |
| `headerProps.showSearch` | boolean | Show/hide search in header. |
| `headerProps.showFilters` | boolean | Show/hide filter controls. |
| `headerProps.showActions` | boolean | Show/hide action buttons. |
| `headerProps.searchPlaceholder` | string | Search placeholder. |
| `headerProps.customLeftActions` | ReactNode | Custom actions, left. |
| `headerProps.customRightActions` | ReactNode | Custom actions, right. |

### Render props

Customize individual cell types without replacing the body.

| Prop | Receives |
|------|----------|
| `renderActions` | `{ actions, row, onActionClick, menuOpen, setMenuOpen }` |
| `renderStatus` | `{ value, statusValue, isObject, isString, isHtml }` |
| `renderTags` | `{ tags, visibleTags, remainingTags, hasMoreTags, maxVisible }` |
| `renderWorkflowTransitions` | `{ transitions, visibleTransitions, dropdownTransitions, row, onTransitionClick, menuOpen, setMenuOpen }` |

### Styling and forms

| Prop | Type | Description |
|------|------|-------------|
| `customClass` | TableCustomClasses | CSS class overrides for table elements. |
| `customStyle` | TableCustomStyles | Dynamic style functions for table elements. |
| `formProps` | FormProps | Forwarded to every `FormRenderer` this handler renders (add form, row-action forms). Accepts `showConfirmAlert`, `customConfirmAlert`, `confirmTitle`, `confirmMessage`, `confirmText`, `cancelText`. |

## Examples

```jsx
// Hide sections
<CrudHandler
  api_endpoint="/api/users"
  showHeader={false}
  showUtilities={false}
  showPagination={false}
/>
```

```jsx
// Replace sections
<CrudHandler
  api_endpoint="/api/products"
  customHeader={MyCustomHeader}
  customUtilities={MyCustomUtilities}
  customTableBody={MyCustomBody}
  customPagination={MyCustomPagination}
/>
```

```jsx
// Header and utilities configuration
<CrudHandler
  api_endpoint="/api/crud"
  headerProps={{
    title: "User Management",
    showSearch: true,
    searchPlaceholder: "Search users...",
    customRightActions: <Button>Export</Button>,
  }}
  utilityProps={{
    showUpload: true,
    showColumnOptions: false,
    searchPlaceholder: "Quick search...",
  }}
  className="custom-table-wrapper"
  style={{ height: "600px" }}
/>
```

```jsx
// Custom drawer detail — fetch the record yourself
import { CrudHandler, DetailViewProvider, useDetailView } from "@zango-core/crud/table";

function UserDrawer({ selectedRow, open, onClose }) {
  const objectUuid = selectedRow?.original?.object_uuid;
  return (
    <DetailViewProvider apiUrl="/api/users" objectUuid={objectUuid}>
      <UserDrawerBody open={open} onClose={onClose} />
    </DetailViewProvider>
  );
}

function UserDrawerBody({ open, onClose }) {
  const { data, loading, workflowDetails } = useDetailView();
  if (!open) return null;
  if (loading) return <p>Loading…</p>;
  return (
    <aside>
      <h2>{data?.title}</h2>
      <p>{workflowDetails?.current_status_meta?.status_label}</p>
      <button onClick={onClose}>Close</button>
    </aside>
  );
}

<CrudHandler api_endpoint="/api/users" customDrawerDetail={UserDrawer} />
```

```jsx
// Custom list layout (kanban / calendar / cards) via customTableBody.
// The body reads table state from context — no props needed.
// Module scope keeps the component reference stable.
import { CrudHandler } from "@zango-core/crud/table";
import { useCrud } from "@zango-core/crud/core";

function KanbanBody() {
  const crud = useCrud();
  if (crud.isLoading) return <p>Loading…</p>;

  // Real Row<T> wrappers — crud.data items alone can't open the detail view.
  const rows = crud.table?.getRowModel().rows ?? [];
  const statuses = ["todo", "in_progress", "done"];

  return (
    <div className="flex gap-4">
      {statuses.map((status) => (
        <div key={status} className="flex-1">
          <h3>{status}</h3>
          {rows
            .filter((r) => r.original.workflow_status?.current_status === status)
            .map((r) => (
              <article key={r.original.object_uuid} onClick={() => crud.detail.open(r)}>
                {r.original.title}
              </article>
            ))}
        </div>
      ))}
    </div>
  );
}

<CrudHandler api_endpoint="/api/tasks" customTableBody={KanbanBody} />
```

---

# Part 3 — Components, styling and advanced customization

## Table Styling (Styling)

**Sections:** Overview | Basic Usage | Customizable Elements | State-Aware Styling | Theme Examples | Advanced Techniques | Best Practices

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `container` | string | - | Main table container wrapper |
| `tableWrapper` | string | - | Table wrapper element |
| `table` | string | - | The actual table element |
| `headerRow` | string | - | Header row container |
| `headerCell` | string | - | Individual header cells |
| `headerCellPinned` | string | - | Pinned header cells |
| `sortButton` | string | - | Sortable column buttons |
| `sortIcon` | string | - | Sort direction icons |
| `bodyRow` | string | - | Data row containers |
| `bodyRowSelected` | string | - | Selected row state |
| `bodyCell` | string | - | Individual data cells |
| `bodyCellPinned` | string | - | Pinned data cells |
| `utilitiesContainer` | string | - | Action bar container |
| `filterButton` | string | - | Filter toggle buttons |
| `searchInput` | string | - | Search input field |
| `uploadButton` | string | - | File upload button |
| `downloadButton` | string | - | Download/export button |
| `paginationContainer` | string | - | Pagination wrapper |
| `paginationButton` | string | - | Page number buttons |
| `paginationNavButton` | string | - | Previous/next buttons |
| `paginationInfo` | string | - | Page info display |
| `paginationEllipsis` | string | - | Overflow indicators |
| `filterSidebar` | string | - | Filter panel container |
| `filterHeader` | string | - | Filter panel header |
| `filterTitle` | string | - | Filter title text |
| `filterClearAll` | string | - | Clear filters button |
| `filterContent` | string | - | Filter content area |
| `filterAccordion` | string | - | Filter accordion wrapper |
| `actionsContainer` | string | - | Row actions wrapper |
| `actionButton` | string | - | Individual action buttons |
| `actionMenuButton` | string | - | Action menu trigger |
| `actionDropdown` | string | - | Action dropdown menu |
| `actionDropdownItem` | string | - | Action menu items |
| `statusBadge` | string | - | Status display badges |
| `tagsContainer` | string | - | Tags wrapper |
| `workflowContainer` | string | - | Workflow elements wrapper |
| `workflowButton` | string | - | Workflow action buttons |
| `workflowDropdown` | string | - | Workflow dropdown menu |

### Code Examples

```jsx
<CrudHandler
  api_endpoint="/api/users"
  customClass={{
    headerCell: "bg-blue-100 text-blue-900 font-bold",
    bodyRow: "hover:bg-gray-50",
    filterButton: "border-blue-300 text-blue-600"
  }}
/>
```

```jsx
<CrudHandler
  api_endpoint="/api/users"
  customClass={{
    headerCell: "!bg-gray-800 !text-gray-200 !font-bold",
    bodyRow: "!bg-gray-900 hover:!bg-gray-800",
    filterButton: "!bg-gray-700 !text-gray-200"
  }}
/>
```

```jsx
<CrudHandler
  api_endpoint="/api/users"
  customStyle={{
    bodyRow: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? '#fef3c7' : baseStyles.backgroundColor,
      borderLeft: state.rowIndex % 2 === 0 ? '4px solid #3b82f6' : 'none'
    }),
    headerCell: (baseStyles, state) => ({
      ...baseStyles,
      fontSize: state.columnId === 'name' ? '18px' : '14px',
      fontWeight: state.isPinned ? 'bold' : 'normal'
    })
  }}
/>
```

```tsx
bodyRow: (baseStyles, state) => {
  // Available state properties:
  // - rowIndex: number
  // - isSelected: boolean
  // - isHovered: boolean
  // - rowData: object

  return {
    ...baseStyles,
    backgroundColor: state.isSelected ? '#fef3c7' :
                    state.rowIndex % 2 === 0 ? '#f9fafb' : '#ffffff'
  };
}
```

```tsx
headerCell: (baseStyles, state) => {
  // Available state properties:
  // - isPinned: boolean
  // - canSort: boolean
  // - columnId: string
  // - pinnedOffset: number

  return {
    ...baseStyles,
    fontWeight: state.canSort ? 'bold' : 'normal',
    borderRight: state.isPinned ? '2px solid #374151' : '1px solid #e5e7eb'
  };
}
```

```tsx
actionButton: (baseStyles, state) => {
  // Available state properties:
  // - action: object (action data)
  // - isFirst: boolean
  // - isInDropdown: boolean

  return {
    ...baseStyles,
    backgroundColor: state.action.type === 'danger' ? '#fef2f2' : baseStyles.backgroundColor
  };
}
```

```jsx
const professionalTheme = {
  customClass: {
    container: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    headerCell: 'bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200',
    bodyRow: 'hover:bg-gray-25 border-b border-gray-100',
    utilitiesContainer: 'bg-gray-50 border-b border-gray-200',
    paginationContainer: 'bg-white border-t border-gray-200'
  },
  customStyle: {
    bodyRow: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? '#e0f2fe' : baseStyles.backgroundColor,
      borderLeft: state.isSelected ? '4px solid #0ea5e9' : 'none'
    })
  }
};

<CrudHandler api_endpoint="/api/users" {...professionalTheme} />
```

```jsx
const darkTheme = {
  customClass: {
    container: '!bg-gray-900',
    tableWrapper: '!bg-gray-800 !border-gray-700',
    headerCell: '!bg-gray-800 !text-gray-200 !border-gray-700 !font-semibold',
    bodyRow: '!bg-gray-900 hover:!bg-gray-800 !border-gray-700',
    bodyCell: '!text-gray-200 !border-gray-700',
    utilitiesContainer: '!bg-gray-800 !border-gray-700',
    filterButton: '!bg-gray-700 !text-gray-200 hover:!bg-gray-600',
    searchInput: '!bg-gray-700 !text-gray-200 !border-gray-600',
    paginationContainer: '!bg-gray-800 !border-gray-700',
    filterSidebar: '!bg-gray-800 !border-gray-700'
  },
  customStyle: {
    container: (baseStyles) => ({
      backgroundColor: '#111827',
      color: '#e5e7eb',
    }),
    bodyRow: (baseStyles, state) => ({
      backgroundColor: state.isSelected ? '#1e3a8a' : '#111827',
      borderColor: '#374151',
    }),
    bodyCell: (baseStyles) => ({
      color: '#e5e7eb',
      borderColor: '#374151',
      backgroundColor: 'transparent',
    })
  }
};

<CrudHandler api_endpoint="/api/users" {...darkTheme} />
```

```jsx
const dataStyles = {
  customStyle: {
    bodyRow: (baseStyles, state) => {
      const { rowData } = state;
      let backgroundColor = baseStyles.backgroundColor;

      if (rowData?.status === 'active') backgroundColor = '#f0fdf4';
      else if (rowData?.status === 'inactive') backgroundColor = '#fef2f2';
      else if (rowData?.priority === 'high') backgroundColor = '#fef3c7';

      return {
        ...baseStyles,
        backgroundColor: state.isSelected ? '#dbeafe' : backgroundColor
      };
    }
  }
};

<CrudHandler api_endpoint="/api/tasks" {...dataStyles} />
```

```jsx
const backgroundStyles = {
  customClass: {
    container: 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50',
    tableWrapper: 'bg-white/80 backdrop-blur-sm shadow-xl rounded-lg',
    headerCell: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white'
  }
};
```

```jsx
const borderlessTheme = {
  customClass: {
    table: 'border-0',
    headerRow: 'border-0',
    headerCell: 'border-0 bg-gray-50 text-gray-700',
    bodyRow: 'border-0 hover:bg-gray-25',
    bodyCell: 'border-0 py-4',
    utilitiesContainer: 'border-0 bg-transparent',
    paginationContainer: 'border-0 bg-transparent'
  },
  customStyle: {
    bodyCell: (baseStyles, state) => ({
      ...baseStyles,
      border: 'none',
      borderBottom: state.rowIndex % 5 === 4 ? '1px solid #f3f4f6' : 'none'
    })
  }
};
```

```jsx
const animatedStyles = {
  customStyle: {
    bodyRow: (baseStyles, state) => ({
      ...baseStyles,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: state.isSelected ? 'translateX(4px)' : 'translateX(0)',
      boxShadow: state.isSelected
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        : 'none'
    }),
    headerCell: (baseStyles, state) => ({
      ...baseStyles,
      transition: 'all 0.2s ease-in-out',
      transform: state.canSort ? 'scale(1)' : 'scale(0.98)'
    })
  }
};
```

```jsx
import { useTheme } from './ThemeProvider';

function ThemedTable() {
  const theme = useTheme();

  const themedStyles = {
    customStyle: {
      headerCell: (baseStyles) => ({
        ...baseStyles,
        backgroundColor: theme.colors.primary,
        color: theme.colors.primaryText
      }),
      bodyRow: (baseStyles, state) => ({
        ...baseStyles,
        backgroundColor: state.isSelected
          ? theme.colors.selected
          : theme.colors.background
      })
    }
  };

  return <CrudHandler api_endpoint="/api/users" {...themedStyles} />;
}
```

```jsx
// Bad - creates new object every render
customStyle={{
  bodyRow: () => ({ backgroundColor: 'red' })
}}

// Good - use customClass for static styles
customClass={{
  bodyRow: 'bg-red-100'
}}
```

```tsx
import type { TableCustomClasses, TableCustomStyles } from '@zango-core/crud/table';

const customClass: TableCustomClasses = {
  headerCell: 'bg-blue-100 text-blue-900',
  bodyRow: 'hover:bg-gray-50'
};

const customStyle: TableCustomStyles = {
  bodyRow: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isSelected ? '#fef3c7' : baseStyles.backgroundColor
  })
};

<CrudHandler
  api_endpoint="/api/users"
  customClass={customClass}
  customStyle={customStyle}
/>
```

```tsx
// Row state for bodyRow and bodyCell
interface RowState {
  rowIndex: number;
  isSelected: boolean;
  isHovered: boolean;
  rowData: any;
}

// Header state for headerCell and sortButton
interface HeaderCellState {
  isPinned: boolean;
  canSort: boolean;
  columnId: string;
  pinnedOffset: number;
}

// Action state for action buttons
interface ActionButtonState {
  action: any;
  isFirst: boolean;
  isInDropdown: boolean;
}
```


## Detail Views (Views)

**Sections:** Overview | Automatic Data Fetching | Data Props Provided | Drawer Detail View | Main Detail View (Route-based) | DetailViewProvider | StandaloneDetailView | Detail Hooks

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | object | - | Complete detail response from the API, containing all fields and nested data for the record. |
| `api_endpoint` | string | - | The API endpoint used to fetch the detail data. |
| `loading` | boolean | - | Whether the detail data is currently being fetched. |
| `error` | string | null | - | Error message if the data fetch failed, or null if successful. |
| `onRefresh` | function | - | Callback to re-fetch the detail data. Useful after performing mutations like status transitions or edits. |
| `objectUuid` | string | - | The unique object UUID of the current record. |
| `pk` | string | number | - | The primary key of the current record. |
| `title` | string | - | The display title for the detail view, derived from the record data. |
| `general_details` | object | - | General details section with a fields object. Each field is keyed by field_name and has { name, display_name, type, value, searchable, sortable }. |
| `workflow_details` | object | - | Workflow data including current_status (string key), current_status_meta ({ name, from, to, status_label, status_color, is_form_based, is_manual }), next_transitions (array), and tag_details (array). |
| `sections` | array | - | Array of section objects, each with key, name, title, data (object), optional extra_html, and optional form ({ is_multistep, form: { json_schema, ui_schema } }). |
| `row_actions` | array | - | Array of available row-level actions for the current record. |
| `configurations` | object | - | Additional configuration metadata for the detail view. |
| `useDetailView({ apiUrl })` | Hook | - | Fetches detail data for a specific record. Returns: data, loading, error, refresh, objectUuid, workflowDetails, rowActions. |
| `useDetailViewContext()` | Hook | - | Reads from the nearest DetailViewProvider context. Same return shape as useDetailView but from shared context. |

### Code Examples

```jsx
import React from 'react';

const CustomDrawerDetail = ({
  selectedRow,
  open,
  onClose,
  data,
  workflow_details,
  general_details,
  sections,
}) => {
  if (!open || !data) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold">{data.title || 'Detail View'}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* General Details — fields is an object keyed by field_name */}
        {general_details?.fields && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              General Information
            </h3>
            <div className="space-y-2">
              {Object.entries(general_details.fields).map(([key, field]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="text-sm text-gray-500">{field.display_name}</span>
                  <span className="text-sm font-medium">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflow Status */}
        {workflow_details && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Workflow
            </h3>
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: workflow_details.current_status_meta?.status_color || '#eff6ff',
                color: '#1d4ed8',
              }}
            >
              {workflow_details.current_status_meta?.status_label || workflow_details.current_status || 'N/A'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDrawerDetail;
```

```jsx
import CustomDrawerDetail from './CustomDrawerDetail';

<CrudHandler
  api_endpoint="/api/users"
  customDrawerDetail={CustomDrawerDetail}
/>
```

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomMainDetail = ({
  data,
  workflow_details,
  general_details,
  sections,
  onRefresh,
}) => {
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        &larr; Back to list
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">
        {data.title || 'Record Detail'}
      </h1>

      {/* General Details — fields is an object keyed by field_name */}
      {general_details?.fields && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">General Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(general_details.fields).map(([key, field]) => (
              <div key={key}>
                <span className="text-sm text-gray-500 block">{field.display_name}</span>
                <span className="text-sm font-medium">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      {sections?.map((section) => (
        <div key={section.key} className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
          {section.data && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(section.data).map(([key, value]) => (
                <div key={key}>
                  <span className="text-sm text-gray-500 block">{key}</span>
                  <span className="text-sm font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
          {section.extra_html && (
            <div dangerouslySetInnerHTML={{ __html: section.extra_html }} />
          )}
        </div>
      ))}

      {/* Workflow Section */}
      {workflow_details && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Workflow</h2>
          <div>
            <p className="text-sm text-gray-500 mb-2">Current Status</p>
            <span
              className="inline-flex px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: workflow_details.current_status_meta?.status_color || '#eff6ff',
                color: '#1d4ed8',
              }}
            >
              {workflow_details.current_status_meta?.status_label || workflow_details.current_status}
            </span>
          </div>
          {workflow_details.next_transitions?.length > 0 && (
            <div className="flex gap-2 mt-4">
              {workflow_details.next_transitions.map((t) => (
                <span key={t.name} className="text-sm text-gray-600">
                  {t.display_name} &rarr; {t.to_state_meta?.status_label}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Refresh */}
      <button
        onClick={onRefresh}
        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Refresh Data
      </button>
    </div>
  );
};

export default CustomMainDetail;
```

```jsx
import CustomMainDetail from './CustomMainDetail';

<CrudHandler
  api_endpoint="/api/users"
  customMainDetail={CustomMainDetail}
  customTableBody={
    <TableBody defaultDetailView="navigate" />
  }
/>
```

> **VERIFIED WORKING PATTERN** — all 3 props are required together:
> - `enableDetailViewRoute={true}` — registers the `/detail-view/:object_uuid` route
> - `customMainDetail={MyDetail}` — your component rendered at that route
> - `customTableBody={NavigateTableBody}` — makes rows navigate on click
>
> ⚠️ `customTableBody` must be a **component reference**, NOT a JSX element. Passing `<TableBody ... />` (an object) crashes with "Element type is invalid: got object". Wrap it in a named component.
>
> ⚠️ Props received by `customMainDetail` are **camelCase** (verified from source): `generalDetails` (not `general_details`), `workflowDetails` (not `workflow_details`).

```jsx
import { useNavigate } from 'react-router-dom';
import { CrudHandler, TableBody } from '@zango-core/crud/table';

// Must be a named component — NOT inline JSX passed to customTableBody
const NavigateTableBody = () => <TableBody defaultDetailView="navigate" />;

// Actual props: data, generalDetails, objectUuid, workflowDetails, sections, rowActions, pk, onRefresh, apiUrl
const MyDetail = ({ data, generalDetails, objectUuid }) => {
  const navigate = useNavigate();
  if (!data) return null;
  const fields = generalDetails?.fields || {};
  return (
    <div style={{ padding: 32 }}>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{data.title}</h1>
      {Object.entries(fields).map(([key, field]) => (
        <div key={key}>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>{field.display_name}</div>
          <div dangerouslySetInnerHTML={{ __html: field.value || '—' }} />
        </div>
      ))}
      {/* Embed related child records — requires get_table_data_queryset override on backend */}
      {objectUuid && (
        <CrudHandler api_endpoint={`/child/records/?parent_uuid=${objectUuid}`} showHeader={false} />
      )}
    </div>
  );
};

const MyPage = () => (
  <CrudHandler
    api_endpoint="/my/records/"
    headerProps={{ title: 'My Records' }}
    enableDetailViewRoute={true}
    customMainDetail={MyDetail}
    customTableBody={NavigateTableBody}
  />
);
```

```jsx
import { DetailViewProvider, WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

// Wrap components for shared context
<DetailViewProvider apiUrl="/api/users/?object_uuid=123">
  <WorkflowStatus />   {/* Automatically uses context */}
  <WorkflowTags />     {/* Automatically uses context */}
  <MyCustomComponent /> {/* Can call useDetailViewContext() */}
</DetailViewProvider>
```

```jsx
import { StandaloneDetailView } from "@zango-core/crud/table";

<StandaloneDetailView
  apiUrl="/api/users/"
  objectUuid="550e8400-e29b-41d4-a716-446655440000"
/>
```

```jsx
import { useDetailView, useDetailViewContext } from "@zango-core/crud/table";

// Standalone - fetches its own data
const { data, loading, workflowDetails } = useDetailView({
  apiUrl: "/api/users/?object_uuid=123"
});

// Context-based - reads from DetailViewProvider
const { data, refresh } = useDetailViewContext();
```

---

## TableBody (Component)

**Sections:** Props | Row Click Behaviors

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | TanstackTable<any> | drawer | TanStack table instance that provides row models, column definitions, and table state. |
| `defaultDetailView` | RowClickAction | RowClickConfig | drawer | Row click behavior configuration. Can be a string ( |
| `selectedRow` | Row | null | - | Currently selected row object. Used to highlight the active row in the table. |
| `drawerOpen` | boolean | - | Whether the detail drawer is currently open. Controls visual state of selected row. |
| `isLoading` | boolean | - | Loading state for initial data fetch. Displays skeleton placeholders when true. |
| `isFetching` | boolean | - | Loading state for subsequent data updates (e.g., pagination, filtering). Shows a subtle loading indicator without replacing content. |

### Code Examples

```jsx
// Default behavior - opens a detail drawer on row click
<TableBody />
```

```jsx
// Navigate to detail page on row click
<TableBody defaultDetailView="navigate" />
```

```jsx
// Navigate with a custom URL template
<TableBody
  defaultDetailView={{
    action: "navigate",
    navigateUrlTemplate: "/users/{object_uuid}/profile"
  }}
/>
```

```jsx
// Custom row click handler
<TableBody
  defaultDetailView={{
    action: "custom",
    customHandler: (row) => console.log(row.original)
  }}
/>
```

---

## TableHeader (Component)

**Sections:** Props | Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | ReactNode | true | Header title text or custom React element. Supports plain strings or JSX for rich formatting. |
| `totalCount` | number | true | Total number of items in the dataset. Displayed as a badge next to the title. |
| `showCount` | boolean | true | Show or hide the total count badge next to the title. |
| `showAddButton` | boolean | true | Show or hide the add/create button in the header actions area. |
| `addButtonTitle` | string | ReactNode | true | Custom text or element for the add button. Defaults to a standard  |
| `onAddClick` | function | true | Custom click handler for the add button. Overrides the default behavior of opening the built-in form drawer. |
| `extraActions` | ReactNode | true | Additional action elements rendered alongside the default add button. Useful for export, import, or bulk action buttons. |
| `children` | ReactNode | true | Content rendered between the title area and the action buttons. Commonly used for filters, status tabs, or date range selectors. |
| `api_endpoint` | string | true | API endpoint for the default add form. Used by the built-in form drawer to submit new records. |
| `enableDefaultAddForm` | boolean | true | Enable or disable the built-in form drawer that opens when the add button is clicked. Set to false when using a custom add flow. |

### Code Examples

```jsx
// Uses defaults from table context
<TableHeader />
```

```jsx
<TableHeader
  title="Products"
  totalCount={142}
  showAddButton={true}
  addButtonTitle="New Product"
  extraActions={
    <>
      <button className="btn-secondary">Export CSV</button>
      <button className="btn-secondary">Import</button>
    </>
  }
/>
```

```jsx
<TableHeader
  title={
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold">Orders</span>
      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
    </div>
  }
  onAddClick={() => {
    // Custom logic instead of default form
    openCustomOrderModal();
  }}
/>
```

```jsx
<TableHeader title="Inventory" totalCount={856}>
  <StatusFilter
    options={['All', 'In Stock', 'Low Stock', 'Out of Stock']}
    onChange={handleStatusChange}
  />
  <DateRangeFilter
    onRangeChange={handleDateChange}
  />
</TableHeader>
```

```jsx
<TableHeader
  enableDefaultAddForm={false}
  onAddClick={() => router.push('/products/new')}
/>
```

---

## TableUtilities (Component)

**Sections:** Props | Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchTerm` | string | Search | Current search input value. Use this for controlled search state. |
| `onSearchChange` | function | Search | Callback invoked when the search input value changes. Receives the new search string as an argument. |
| `onUploadClick` | function | Search | Custom handler for the upload button click. Overrides the default upload behavior. |
| `onDownloadClick` | function | Search | Custom handler for the download button click. Overrides the default download behavior. |
| `searchPlaceholder` | string | Search | Placeholder text for the search input field. |
| `showFiltersButton` | boolean | true | Show or hide the filter toggle button that opens the filters panel. |
| `showSearch` | boolean | true | Show or hide the search input field. |
| `showUpload` | boolean | true | Show or hide the upload button. |
| `showDownload` | boolean | true | Show or hide the download button. |
| `showColumnOptions` | boolean | true | Show or hide the column visibility toggle dropdown. |
| `children` | ReactNode | - | Custom content rendered between the left-side actions (search, filters) and right-side actions (upload, download, columns). Useful for dropdowns, date pickers, or custom filter controls. |

### Code Examples

```jsx
// All default controls visible
<TableUtilities />
```

```jsx
// Hide upload and filters
<TableUtilities
  showUpload={false}
  showFiltersButton={false}
/>
```

```jsx
<TableUtilities
  onUploadClick={() => {
    // Open a custom upload modal
    openUploadModal();
  }}
  onDownloadClick={() => {
    // Trigger a custom export
    exportToExcel(currentFilters);
  }}
/>
```

```jsx
<TableUtilities searchPlaceholder="Search orders...">
  <Select
    options={statusOptions}
    placeholder="Filter by status"
    onChange={handleStatusFilter}
  />
  <DateRangePicker
    onRangeChange={handleDateRange}
  />
</TableUtilities>
```

---

## TablePagination (Component)

**Sections:** Props | Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showRowsPerPage` | boolean | true | Show or hide the rows-per-page selector dropdown. When hidden, the default page size is used. |
| `rowsPerPageOptions` | number[] | [10 | Array of available page size options displayed in the rows-per-page dropdown. |
| `className` | string | true | Additional CSS classes applied to the pagination container for custom styling. |
| `showPageInfo` | boolean | true | Show or hide the  |

### Code Examples

```jsx
// Default pagination with all controls
<TablePagination />
```

```jsx
<TablePagination
  rowsPerPageOptions={[5, 10, 25, 50]}
  showPageInfo={false}
/>
```

```jsx
<TablePagination showRowsPerPage={false} />
```

---

## TableSearch (Component)

**Sections:** Props | Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | string | Search... | Placeholder text displayed when the search input is empty. |
| `className` | string | - | Additional CSS classes applied to the search input element for custom styling. |
| `containerClassName` | string | - | Additional CSS classes applied to the outer container wrapping the search input and icons. |
| `leftIcon` | ReactNode | - | Custom left icon element. Defaults to a magnifying glass search icon. |
| `rightIcon` | ReactNode | - | Custom right icon element. Useful for adding a clear button or secondary action. |

### Code Examples

```jsx
// Default search with automatic table context sync
<TableSearch />
```

```jsx
<TableSearch
  placeholder="Search by name, email, or ID..."
  className="text-sm font-medium"
/>
```

```jsx
import { Filter, XCircle } from 'lucide-react';

<TableSearch
  placeholder="Filter results..."
  leftIcon={<Filter size={16} className="text-gray-400" />}
  rightIcon={
    <button
      onClick={handleClearSearch}
      className="text-gray-400 hover:text-gray-600"
    >
      <XCircle size={16} />
    </button>
  }
/>
```

---

## TableAddButton (Component)

**Sections:** Props | Usage Examples | Integration Patterns

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttonText` | string | ReactNode | primary | Button label text or custom React element. Supports plain strings or JSX for rich content. |
| `onClick` | function | primary | Custom click handler. When provided, the built-in drawer behavior is disabled and your handler is called instead. |
| `variant` | string | primary | Button style variant. Controls the visual appearance (color scheme) of the button. |
| `size` | string | md | Button size. Affects padding, font size, and overall dimensions. |
| `className` | string | false | Additional CSS classes for custom styling on the button element. |
| `showIcon` | boolean | false | Show or hide an icon alongside the button text. |
| `icon` | ReactNode | left | Custom icon element. Only displayed when showIcon is true. |
| `onFormSuccess` | function | md | Callback invoked after the built-in form is submitted successfully. Useful for triggering data refresh or showing notifications. |
| `drawerTitle` | string | md | Custom title for the form drawer. Overrides the default title derived from the table context. |
| `drawerSize` | string | md | Size of the form drawer panel. Supports standard drawer size values. |

### Code Examples

```jsx
// Default add button with built-in form drawer
<TableAddButton />
```

```jsx
<TableAddButton
  buttonText="New Product"
  variant="secondary"
  size="lg"
  showIcon={true}
  className="shadow-md"
/>
```

```jsx
<TableAddButton
  buttonText="Create Order"
  onClick={() => {
    // Navigate to a custom creation page
    router.push('/orders/create');
  }}
/>
```

```jsx
<TableAddButton
  buttonText="Add User"
  drawerTitle="Create New User"
  drawerSize="lg"
  onFormSuccess={() => {
    toast.success('User created successfully!');
    refetchData();
  }}
/>
```

```jsx
<TableAddButton
  buttonText={
    <span className="flex items-center gap-2">
      <PlusCircle size={16} />
      <span>Add Item</span>
    </span>
  }
/>
```

```jsx
<CrudHandler
  api_endpoint="/api/products"
  customHeader={
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-lg font-bold">Products</h1>
        <p className="text-sm text-gray-500">Manage your product catalog</p>
      </div>
      <div className="flex items-center gap-3">
        <TableUtilities
          showSearch={true}
          showDownload={true}
          showUpload={false}
          showFiltersButton={false}
          showColumnOptions={false}
        />
        <TableAddButton
          buttonText="New Product"
          showIcon={true}
          variant="primary"
          drawerTitle="Add Product"
          onFormSuccess={() => toast.success('Product added!')}
        />
      </div>
    </div>
  }
/>
```

---

## Render Props (Advanced)

**Sections:** Overview | Actions Column | Status Column | Tags Column

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | any[] | - | Array of available action objects for the current row, each containing name, label, and configuration. |
| `row` | any | - | The full table row data object. Access fields via row.original for raw API data. |
| `onActionClick` | (action) => void | - | Trigger the action execution pipeline for a given action. Handles confirmations, API calls, and table refresh. |
| `menuOpen` | boolean | - | Current state of the dropdown menu. Use this to control visual state of custom menus. |
| `setMenuOpen` | (open) => void | - | Control the dropdown menu visibility. Call with true to open, false to close. |
| `value` | any | - | The raw status value from the API response. Can be a string, object, or HTML string. |
| `statusValue` | string | - | The resolved status string ready for display. Extracted from value regardless of its original format. |
| `isObject` | boolean | - | True if the raw value is an object (e.g., { status_label:  |
| `isString` | boolean | - | True if the raw value is a plain string. |
| `isHtml` | boolean | - | True if the raw value contains HTML markup that needs special rendering. |
| `tags` | any[] | - | The complete array of all tags assigned to the row. |
| `visibleTags` | any[] | - | Subset of tags displayed inline, sliced to fit within the maxVisible limit. |
| `remainingTags` | any[] | - | Tags that overflow beyond the visible limit. Display these in a popover or tooltip. |
| `hasMoreTags` | boolean | - | True if there are more tags than the maxVisible count allows. Use to conditionally render overflow UI. |
| `maxVisible` | number | - | The maximum number of tags shown inline before overflow. Determined by the table column configuration. |

### Code Examples

```jsx
import { Table } from "@zango-core/crud/table";

<Table
  apiUrl="/api/users"
  tableMetadataObj={metadata}
  renderActions={({ actions, row, onActionClick }) => (
    // Custom actions UI
  )}
  renderStatus={({ statusValue, isObject }) => (
    // Custom status badge
  )}
  renderTags={({ visibleTags, remainingTags, hasMoreTags }) => (
    // Custom tag layout
  )}
/>
```

```jsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

<Table
  apiUrl="/api/orders"
  tableMetadataObj={metadata}
  renderActions={({ actions, row, onActionClick, menuOpen, setMenuOpen }) => {
    const inlineActions = actions.slice(0, 3);
    const overflowActions = actions.slice(3);

    return (
      <div className="flex items-center gap-1">
        {/* Inline action buttons */}
        {inlineActions.map((action) => (
          <Button
            key={action.name}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick(action);
            }}
          >
            {action.label}
          </Button>
        ))}

        {/* Overflow dropdown for remaining actions */}
        {overflowActions.length > 0 && (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {overflowActions.map((action) => (
                <DropdownMenuItem
                  key={action.name}
                  onClick={() => onActionClick(action)}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }}
/>
```

```jsx
<Table
  apiUrl="/api/orders"
  tableMetadataObj={metadata}
  renderStatus={({ value, statusValue, isObject, isString, isHtml }) => {
    // Define color mappings for known statuses
    const statusColors = {
      active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
      pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
      inactive: { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
      rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    };

    const key = statusValue?.toLowerCase() || 'inactive';
    const colors = statusColors[key] || statusColors.inactive;

    // Handle HTML status values
    if (isHtml) {
      return (
        <span
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        {statusValue}
      </span>
    );
  }}
/>
```

```jsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<Table
  apiUrl="/api/products"
  tableMetadataObj={metadata}
  renderTags={({ tags, visibleTags, remainingTags, hasMoreTags, maxVisible }) => {
    // Color palette for tags
    const tagColors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-teal-50 text-teal-700 border-teal-200',
      'bg-orange-50 text-orange-700 border-orange-200',
      'bg-pink-50 text-pink-700 border-pink-200',
    ];

    return (
      <div className="flex flex-wrap items-center gap-1">
        {/* Visible tags */}
        {visibleTags.map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${tagColors[index % tagColors.length]}`}
          >
            {typeof tag === 'object' ? tag.label || tag.name : tag}
          </span>
        ))}

        {/* Overflow indicator with tooltip */}
        {hasMoreTags && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-200">
                  +{remainingTags.length} more
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="flex flex-wrap gap-1 p-1">
                  {remainingTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-white border"
                    >
                      {typeof tag === 'object' ? tag.label || tag.name : tag}
                    </span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }}
/>
```

---

