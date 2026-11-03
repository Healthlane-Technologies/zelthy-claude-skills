# Recipes — headless list pages

**This is the primary way to build a Zango list page.** Mount the engine with
`TableProvider`, read it with `useCrud()` / `useTableContext()` /
`useTableFilters()`, and render every pixel yourself. Production Zango apps
build every list page this way; `CrudHandler` (see [recipes.md](recipes.md)) is
for drop-in tables and for hosting a custom body inside a detail tab.

Written against `@zango-core/crud` **2.1.1** (published). APIs marked
**unreleased** exist on the package's main line after 2.1.1 and need the next
release.

| # | Recipe |
|---|--------|
| H1 | [The list page core](#h1-the-list-page-core) |
| H2 | [Rendering rows, columns and sorting](#h2-rendering-rows-columns-and-sorting) |
| H3 | [Pagination](#h3-pagination) |
| H4 | [Page chrome from table metadata](#h4-page-chrome-from-table-metadata) |
| H5 | [Toolbar from the package controls](#h5-toolbar-from-the-package-controls) |
| H6 | [Filters in a popover on the right](#h6-filters-in-a-popover-on-the-right) |
| H7 | [Quick filters from metadata](#h7-quick-filters-from-metadata) |
| H8 | [Export with the table's own query](#h8-export-with-the-tables-own-query) |
| H9 | [Row actions in your own table](#h9-row-actions-in-your-own-table) |
| H10 | [Row click opens a detail](#h10-row-click-opens-a-detail) |
| H11 | [Embedded table in a detail tab](#h11-embedded-table-in-a-detail-tab) |
| H12 | [Refresh after a change](#h12-refresh-after-a-change) |

---

## H1. The list page core

```tsx
import { useEffect } from 'react';
import { TableProvider, useTableContext, useTableFilters } from '@zango-core/crud/table';
import { CrudProvider, useCrud } from '@zango-core/crud/core';

function ListInner() {
  const crud = useCrud();                 // namespaced view: data, pagination, columns, metadata…
  const ctx = useTableContext();          // raw engine: requestRows, isMetadataLoading, columns…
  const filters = useTableFilters();      // filter reads and writes

  // deferRows holds the rows fetch; release it once metadata (and any filters
  // you apply on mount) have settled, so the first fetch is the one you keep.
  const { requestRows } = ctx;
  useEffect(() => {
    if (!ctx.isMetadataLoading) requestRows();
  }, [ctx.isMetadataLoading, requestRows]);

  return (
    <CrudProvider value={crud}>             {/* lets slotted children call useCrudContext() */}
      <ListHeader />
      <ListToolbar />
      <ListTable />
      <ListPager />
    </CrudProvider>
  );
}

export default function OrdersPage({ apiUrl = '/api/orders/' }) {
  return (
    <TableProvider key={apiUrl} apiUrl={apiUrl} deferRows>
      <ListInner />
    </TableProvider>
  );
}
```

**Why each piece:**
- `key={apiUrl}` — a changed endpoint (scope switch, parent uuid) remounts the
  provider: search, filters and page reset and metadata reloads.
- `deferRows` + `requestRows()` — without them the rows fetch fires before
  persisted or quick filters are applied and is thrown away. If you apply
  filters on mount, call `requestRows()` only once
  `JSON.stringify(ctx.filterObj) === JSON.stringify(ctx.debouncedFilterObj)`.
- `useCrud()` takes **no arguments** — passing `apiUrl` gives a standalone
  engine with `table: null` that never loads.
- `CrudProvider` is optional; add it when deep children need the same `crud`.

**Gotchas:**
- A deferred query reports `isLoading: false` with no rows. Treat "no fetch
  seen yet and no error" as loading, or the empty state flashes:
  ```ts
  const sawFetch = useRef(false);
  if (crud.isLoading || crud.isFetching || (crud.data?.length ?? 0) > 0) sawFetch.current = true;
  const awaitingFirstFetch = !sawFetch.current && !crud.error;
  ```
- One `QueryClient` is shared by every provider (5 min stale/gc,
  `refetchOnMount: 'always'`). Two providers on the same `apiUrl` share cache.


---

## H2. Rendering rows, columns and sorting

```tsx
import { useEffect, useRef } from 'react';
import { useCrudContext } from '@zango-core/crud/core';

function ListTable({ onRowClick }) {
  const crud = useCrudContext();

  // Smooth refetch: keep the last rows on screen while a page/filter change loads.
  const lastRows = useRef([]);
  useEffect(() => { if (Array.isArray(crud.data)) lastRows.current = crud.data; }, [crud.data]);
  const rows = crud.data ?? (crud.isLoading ? lastRows.current : []);

  // Columns: ColumnDef[] built from metadata — accessorKey = field name, header = display name.
  const columns = (crud.columns.definitions ?? []).map((c) => ({
    id: c.accessorKey ?? c.id,
    label: typeof c.header === 'string' ? c.header : c.accessorKey,
    sortable: c.enableSorting ?? false,
  }));

  // Sorting cycles asc → desc → none.
  const sorting = crud.columns.sorting ?? [];
  const toggleSort = (id) => {
    const s = sorting.find((x) => x.id === id);
    crud.columns.setSorting(!s ? [{ id, desc: false }] : s.desc ? [] : [{ id, desc: true }]);
  };

  return (
    <table>
      <thead>
        <tr>{columns.map((c) => (
          <th key={c.id} onClick={c.sortable ? () => toggleSort(c.id) : undefined}>{c.label}</th>
        ))}</tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.object_uuid} onClick={() => onRowClick?.(row)}>
            {columns.map((c) => <td key={c.id}>{renderCell(row[c.id])}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Gotchas:**
- Cell values are not always strings: status columns are
  `{ status_label, status_color }`, `actions_col` is an action array, headers
  may be HTML. Normalise in `renderCell`.
- For only the visible columns in the user's order, use
  `useTableColumns().visibleColumns`.
- Keep column overrides (hide, relabel, reorder) client-side and apply them in
  that fixed order — hide, then labels, then order — so indexes stay stable.

---

## H3. Pagination

```tsx
function ListPager() {
  const { pagination: p, totalCount } = useCrudContext();
  return (
    <footer>
      <span>Showing {p.startRow}–{p.endRow} of {totalCount}</span>
      <select value={p.rowsPerPage} onChange={(e) => p.setRowsPerPage(Number(e.target.value))}>
        {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
      </select>
      <button disabled={!p.canGoPrevious} onClick={p.goToPreviousPage}>Prev</button>
      <span>Page {p.currentPage} of {p.totalPages}</span>
      <button disabled={!p.canGoNext} onClick={p.goToNextPage}>Next</button>
    </footer>
  );
}
```

**Gotcha:** `currentPage` is **1-based** — display it as is, never `+ 1`.

---

## H4. Page chrome from table metadata

Let the backend decide the title, add button and download button. Pages do not
hard-code them.

```tsx
const meta = crud.metadata?.table_metadata ?? crud.metadata ?? {};
const metaLoaded = Object.keys(meta).length > 0;

const title       = props.title ?? meta.page_title;
const canAdd      = metaLoaded && meta.has_add_perm === true;      // nothing flashes while loading
const addLabel    = meta.add_btn_title || 'Add';
const canDownload = metaLoaded && meta.has_download_perm !== false;
const showFilters = meta.utilities_config?.show_filters_button !== false;
```

**Gotcha:** gate on `metaLoaded`, or the add button flashes in and out.
Client props should still win over metadata.

---

## H5. Toolbar from the package controls

The package's controls read the provider, so they work in your own layout.

```tsx
import { TableSearchField, TableDownloadButton, TableAddButton } from '@zango-core/crud/table';

function ListToolbar({ onExport }) {
  return (
    <div className="flex items-center gap-2 px-6 py-3">
      <TableSearchField inputSize="md" />            {/* default sm is 4px shorter than md buttons */}
      <div className="flex-1" />
      <FiltersButton />                              {/* H6 */}
      <TableDownloadButton size="md" onDownloadClick={onExport} />
      <TableAddButton enableDrawer />
    </div>
  );
}
```

**Gotchas:**
- Without `onDownloadClick`, `TableDownloadButton` opens the package's download
  drawer, which a headless page does not render. Pass your own export (H8).
- `TableSearchField` and `TableDownloadButton` hide themselves when metadata
  `utilities_config.show_search` / `show_download` is false.

---

## H6. Filters in a popover on the right

The package's filter sidebar is **left-only**. For filters on the right, render
the package's filter panel inside your own popover, anchored to a Filters button
at the right end of the toolbar.

```tsx
import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CrudFilters } from '@zango-core/crud/ui';
import { useTableFilters } from '@zango-core/crud/table';

function FiltersButton() {
  const { filterObj, clearFilters } = useTableFilters();
  const active = Object.values(filterObj ?? {}).filter(
    (v) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0),
  ).length;                                       // activeFilterCount can be undefined
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const r = trigger.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); };
  }, [open]);

  return (
    <>
      <button ref={trigger} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Filters {active > 0 && <span>{active}</span>}
      </button>
      {open && pos && createPortal(
        <>
          <div className="fixed inset-0" style={{ zIndex: 10000 }} onClick={() => setOpen(false)} />
          <div role="dialog" className="fixed w-[340px] max-h-[60vh] overflow-y-auto"
               style={{ ...pos, zIndex: 10001, transformOrigin: 'top right' }}>
            <CrudFilters hideHeader variant="fields" />
            <footer>
              <button disabled={active === 0} onClick={clearFilters}>Clear all</button>
              <button onClick={() => setOpen(false)}>Done</button>
            </footer>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}
```

Show what is applied under the toolbar with the chips component, and jump from
a chip to its field:

```tsx
import { AppliedFilters } from '@zango-core/crud/table';   // unreleased
<AppliedFilters onOpen={(key) => { setOpen(true); setFocus({ key }); }} />
// …and in the popover: <CrudFilters hideHeader variant="fields" focusField={focus} />
```

**Gotchas:**
- `variant="fields"` (labelled grid) and `AppliedFilters` / `focusField` are
  **unreleased** after 2.1.1. On 2.1.1, `CrudFilters` is an accordion whose
  collapsed rows are `inert`: production apps worked around it by clicking every
  collapsed `[id^="accordion-header-"]` on open. Drop that hack once on the next
  release.
- Inside a Radix modal drawer, portal into the drawer's content node instead of
  `document.body`, and keep the z-index ladder (backdrop 10000, panel 10001,
  react-select menus 10002).
- Filters apply on change; there is no "Apply" step. "Done" only closes.
- Styling guidance: [styling.md](styling.md).

---

## H7. Quick filters from metadata

Backends can declare quick-filter groups in `table_metadata.quick_filters`.
Two kinds:

| Kind | Writes to | Effect |
|------|-----------|--------|
| `filter` | `filterObj[param]` via `useTableFilters().setFilter` | Normal filter; rows refetch |
| `scope` | a query param on the endpoint | New `apiUrl` → provider remounts (H1 `key`) |

```tsx
const { setFilter, removeFilter, filterObj } = useTableFilters();
const pick = (group, value) =>
  group.kind === 'scope'
    ? setScope({ ...scope, [group.param]: value })        // parent rebuilds apiUrl
    : value == null ? removeFilter(group.param) : setFilter(group.param, value);
```

**Gotchas:**
- The provider restores persisted filters from `localStorage` in its first
  effect pass, which runs **after** your child's effects. Apply quick-filter
  values only after a mounted flag flips, or they get overwritten.
- Persisted values may no longer be valid choices; drop values the column no
  longer offers before applying.
- Keep quick-filter state in the URL (`useSearchParams`) on full pages, and in
  local state for tables embedded in a detail tab.
- Call `requestRows()` (H1) only after the scope and quick filters are applied.


---

## H8. Export with the table's own query

The backend export (`action=export_table&view=table`) expects the **same
parameter encoding** as the data call. The package's encoder
(`buildExportQueryParams`) is not exported, so mirror it:

```ts
export function exportParams({ columns, filterObj, searchTerm }) {
  const p = new URLSearchParams({ action: 'export_table', view: 'table' });
  if (searchTerm.trim()) p.append('search[value]', searchTerm.trim());
  const active = (v) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
  Object.entries(filterObj).forEach(([key, value]) => {
    if (key === 'search' || !active(value)) return;
    const i = columns.findIndex((c) => c.accessorKey === key || c.id === key);
    if (i === -1) {
      (Array.isArray(value) ? value : [value]).forEach((v, n) =>
        p.append(Array.isArray(value) ? `filter[${key}][${n}]` : `filter[${key}]`, String(v)));
      return;
    }
    const k = `columns[${i}][search][value]`;
    const type = columns[i].type;
    if ((type === 'date' || type === 'datetime') && Array.isArray(value) && value.length === 2)
      p.append(k, JSON.stringify({ start: value[0], end: value[1] }));
    else (Array.isArray(value) ? value : [value]).forEach((v) => p.append(k, String(v)));
    p.append(`columns[${i}][searchable]`, 'true');
  });
  return p;
}

// In the toolbar:
const ctx = useTableContext();
const onExport = () => {
  const params = exportParams({
    columns: ctx.columns, filterObj: ctx.debouncedFilterObj ?? {}, searchTerm: ctx.debouncedSearchTerm ?? '',
  });
  fetch(`${apiUrl}${apiUrl.includes('?') ? '&' : '?'}${params}`, { credentials: 'include' })
    .then((r) => r.json())
    .then((res) => notify(res?.success ? 'Your report is being prepared.' : res?.message));
};
```

**Gotchas:**
- Use `ctx.columns` (the provider's effective columns) — the column **index**
  must match what the data call used.
- Use the `debounced*` values; they are what the table actually queried.
- The export is asynchronous on the backend; the response is a message, not a file.

---

## H9. Row actions in your own table

An `actions_col` cell holds `[{ key, name, type, confirmation_message }]`.

```ts
export async function executeRowAction(apiUrl, objectUuid, actionKey) {
  const [base, search = ''] = apiUrl.split('?');
  const q = new URLSearchParams(search);
  q.set('action_type', 'row');
  q.set('action_key', actionKey);
  q.set('object_uuid', objectUuid);
  const res = await fetch(`${base}?${q}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data || data.success === false) throw new Error(data?.message ?? 'Action failed');
  return data;
}
```

| `action.type` | Do |
|---------------|-----|
| `'form'` | Open a `FormRenderer` drawer with `action_type: 'row'`, `action_key`, `form_type: 'row_action_form'`, `object_uuid` ([form.md](form.md)). **Never POST it** — that submits the form empty. |
| `'simple'` with `confirmation_message` | Confirm, then `executeRowAction`, then refetch. |
| `'simple'` | `executeRowAction`, then refetch. |

**Gotchas:**
- `action_type`, `action_key` and `object_uuid` go in the **query string** — the
  backend reads them from `request.GET`. Keep any query params already on the
  endpoint.
- Refetch with `crud.actions.refetch()` (or `invalidateCache()`); then
  `executeRowAction` / `executeTransition` on `crud.actions` are stubs — do not
  call them.

---

## H10. Row click opens a detail

A headless page has no package drawer. Choose one:

- **Navigate to the detail route** — the common choice. Route to an absolute
  path built from the page's route config, not from the API endpoint (see
  [recipes-detail.md](recipes-detail.md#d1-route-based-detail-page)).
- **Open your own drawer** — keep `detailUuid` in page state and render a drawer
  that fetches the record ([D2 variant B](recipes-detail.md#d2-drawer-detail)).

```tsx
const [detailUuid, setDetailUuid] = useState(null);
<ListTable onRowClick={(row) => setDetailUuid(row.object_uuid)} />
{detailUuid && <EntityDetailDrawer apiUrl={apiUrl} uuid={detailUuid} onClose={() => setDetailUuid(null)} />}
```

---

## H11. Embedded table in a detail tab

The same list page, without page chrome, scoped to a parent record.

```tsx
<OrdersList
  apiUrl={`/api/orders/?patient_uuid=${patientUuid}`}
  showHeader={false}
  quickFilterState="local"        // not the URL — the parent page owns it
  onTotal={(n) => tabCounts.set('orders', n)}
/>
```

**Gotchas:**
- Report counts to the parent through a store (zustand, context ref), **not**
  parent `useState`: re-rendering the parent with a new callback re-renders the
  table and can loop.
- Give the tab body a flex fill chain (`flex-1 min-h-0` down to the table) so
  the table scrolls inside the tab, not the page.

---

## H12. Refresh after a change

| Situation | Do |
|-----------|-----|
| A row action or form changed one row | `crud.actions.refetch()` |
| Rows changed in a way cached rows would misrepresent (bulk change, remount) | Remount with a new `key` **and** `freshRows` on `TableProvider` — it drops cached rows instead of painting stale ones first |
| Scope or endpoint changed | New `apiUrl` → `key` remount (H1) |

```tsx
<TableProvider key={`${apiUrl}:${version}`} apiUrl={apiUrl} deferRows freshRows>
```
