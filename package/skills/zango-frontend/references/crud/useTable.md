# useTable()
Hook

Access shared table context from any custom component rendered within CrudHandler. Stay in sync with table state and controls.

**Sections:** Overview | Core Data | Search | Filters | Pagination | Selection | Detail Drawer | View State | Table Instance | Actions | UI Controls | Configuration | Full Signature

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | T[] | - | Items currently rendered in the table body. |
| `flatData` | T[] | - | Flat (non-grouped) view of all fetched rows. |
| `isLoading` | boolean | - | True while the initial fetch is in flight. |
| `isFetching` | boolean | - | True during background refetches. |
| `error` | Error \| null | - | Last fetch error, or null when healthy. |
| `totalCount` | number | - | Total row count across all pages. |
| `totalDBRowCount` | number | - | Raw DB row count before any client filter. |
| `metadata` | Record<string, unknown> \| null | - | Extra metadata from API response. |
| `rawResponse` | unknown | - | Unprocessed API response payload. |
| `rawTableData` | T[] | - | Rows before table transformations. |
| `isInfiniteScroll` | boolean | - | Whether infinite-scroll mode is active. |
| `searchTerm` | string | - | Live value of the search input. |
| `setSearchTerm` | (term: string) => void | - | Update the search term. |
| `debouncedSearchTerm` | string | - | Debounced value used in API calls. |
| `isSearchActive` | boolean | - | True when searchTerm is non-empty. |
| `filterObj` | Record<string, TableFilter> | - | Map of all active filter key/values. |
| `setFilterObj` | (filters: Record<string, TableFilter>) => void | - | Replace entire filter map. |
| `debouncedFilterObj` | Record<string, TableFilter> | - | Debounced filter map used in API calls. |
| `activeFilterCount` | number | - | Count of currently active filters. |
| `clearFilters` | () => void | - | Reset all filters to empty. |
| `setFilter` | (key: string, value: unknown) => void | - | Set a single filter by key. |
| `removeFilter` | (key: string) => void | - | Remove a single filter by key. |
| `hasFilter` | (key: string) => boolean | - | True when filter key has an active value. |
| `getFilter` | (key: string) => TableFilter \| undefined | - | Read one filter value by key. |
| `currentPage` | number | - | Current page number (1-based). |
| `setCurrentPage` | (page: number) => void | - | Jump to a specific page. |
| `totalPages` | number | - | Total number of pages. |
| `rowsPerPage` | number | - | Rows per page. |
| `setRowsPerPage` | (size: number) => void | - | Change page size. |
| `hasNextPage` | boolean | - | Whether a next page exists. |
| `hasPreviousPage` | boolean | - | Whether a previous page exists. |
| `canGoNext` | boolean | - | Derived: currentPage < totalPages. |
| `canGoPrevious` | boolean | - | Derived: currentPage > 1. |
| `pageNumbers` | number[] | - | Window of nearby page numbers for a page picker. |
| `goToFirstPage` | () => void | - | Navigate to page 1. |
| `goToLastPage` | () => void | - | Navigate to the last page. |
| `goToNextPage` | () => void | - | Advance one page. |
| `goToPreviousPage` | () => void | - | Go back one page. |
| `startRow` | number | - | First row index on current page (1-based). |
| `endRow` | number | - | Last row index on current page (clamped to totalCount). |
| `selectedRows` | T[] | - | Array of currently selected row objects. |
| `setSelectedRows` | (rows: T[]) => void | - | Replace entire selection. |
| `selectRow` | (row: Row<T>) => void | - | Select a single TanStack row. |
| `selectAll` | () => void | - | Select all rows on current page. |
| `clearSelection` | () => void | - | Deselect all rows. |
| `selectedCount` | number | - | Count of selected rows. |
| `isAllSelected` | boolean | - | True when all page rows are selected. |
| `isSomeSelected` | boolean | - | True when a partial selection exists. |
| `hasSelection` | boolean | - | True when at least one row is selected. |
| `selectedRowIds` | (string \| number)[] | - | IDs extracted from selectedRows. |
| `isRowSelected` | (row: Row<T>) => boolean | - | Check if a specific row is selected. |
| `toggleRows` | (rows: Row<T>[]) => void | - | Toggle selection for a set of rows. |
| `selectByIds` | (ids: (string \| number)[]) => void | - | Select rows matching given IDs. |
| `deselectByIds` | (ids: (string \| number)[]) => void | - | Deselect rows matching given IDs. |
| `getSelectedData` | () => T[] | - | Return currently selected rows. |
| `withSelectedRows` | (callback: (rows: T[]) => void) => void | - | Run callback only if selection is non-empty. |
| `selectedDetailObjectUuid` | string \| null | - | UUID of the row open in the detail drawer. |
| `setSelectedDetailObjectUuid` | (uuid: string \| null) => void | - | Open detail for a specific UUID. |
| `detailDrawerOpen` | boolean | - | True when the detail drawer is visible. |
| `setDetailDrawerOpen` | (open: boolean) => void | - | Programmatically show/hide the drawer. |
| `handleRowClick` | (row: Row<T>, event?: React.MouseEvent) => void | - | Default row-click handler (opens drawer). |
| `closeDetailDrawer` | () => void | - | Close the drawer and clear selection. |
| `navigateToNextEntry` | () => void | - | Advance to next row inside the drawer. |
| `navigateToPreviousEntry` | () => void | - | Go back to previous row inside the drawer. |
| `columnVisibility` | Record<string, boolean> | - | Map of columnId to visible flag. |
| `setColumnVisibility` | (visibility: Record<string, boolean>) => void | - | Replace entire visibility map. |
| `columnOrder` | string[] | - | Ordered list of column IDs. |
| `setColumnOrder` | (order: string[]) => void | - | Set column order array. |
| `columnPinning` | Record<string, { left?: string[]; right?: string[] }> | - | Pinned column IDs per side. |
| `setColumnPinning` | (pinning: Record<string, object>) => void | - | Update pinning config. |
| `sorting` | SortingState | - | Active TanStack sorting state. |
| `setSorting` | (sorting: SortingState) => void | - | Update sorting state. |
| `visibleColumns` | ColumnDef<T>[] | - | Subset of columns currently shown. |
| `hiddenColumns` | string[] | - | IDs of columns currently hidden. |
| `visibleColumnCount` | number | - | Count of visible columns. |
| `hiddenColumnCount` | number | - | Count of hidden columns. |
| `totalColumnCount` | number | - | Total columns (visible + hidden). |
| `toggleColumnVisibility` | (columnId: string) => void | - | Toggle one column on/off. |
| `showColumn` | (columnId: string) => void | - | Force one column visible. |
| `hideColumn` | (columnId: string) => void | - | Force one column hidden. |
| `showAllColumns` | () => void | - | Make all columns visible. |
| `hideAllColumns` | () => void | - | Hide all columns. |
| `isColumnVisible` | (columnId: string) => boolean | - | Check one column visibility. |
| `moveColumn` | (columnId: string, toIndex: number) => void | - | Reorder a column by index. |
| `pinColumnLeft` | (columnId: string) => void | - | Pin a column to the left. |
| `pinColumnRight` | (columnId: string) => void | - | Pin a column to the right. |
| `unpinColumn` | (columnId: string) => void | - | Remove a column from pinning. |
| `table` | TanstackTable<T> \| null | - | Raw TanStack Table instance (context mode only). |
| `columns` | ColumnDef<T>[] | - | Active column definition array. |
| `refresh` | () => void | - | Trigger a data refresh. |
| `refetch` | () => void | - | Alias for refresh (React Query style). |
| `invalidateCache` | () => void | - | Invalidate cached query data. |
| `isRefreshing` | boolean | - | True while a background refetch runs. |
| `canRefresh` | boolean | - | True when not loading or fetching. |
| `hasError` | boolean | - | True when error is non-null. |
| `exportData` | (format?: json \| csv \| xlsx) => void | - | Download current page data as a file. |
| `printData` | () => void | - | Open a print-friendly table window. |
| `performBulkAction` | (action: string, selectedRows?: T[]) => void | - | Execute a named bulk action on rows. |
| `resetTable` | () => void | - | Clear filters, selection, sort, go to page 1. |
| `getTableSummary` | () => TableSummary | - | Snapshot of current table metrics. |
| `handleUploadClick` | () => void | - | Open file picker and POST to upload_data. |
| `handleDownloadClick` | () => void | - | Download filtered data via download_data. |
| `hideControls` | boolean | - | True when the built-in toolbar is hidden. |
| `setHideControls` | (hide: boolean) => void | - | Show or hide the toolbar. |
| `apiUrl` | string | - | Resolved API endpoint for this table. |
| `tableId` | string | - | Unique ID scoping this table instance. |

## Code Examples

### core-data.tsx
```tsx
const { data, isLoading, isFetching, error, totalCount } = useTable();

if (isLoading) return <Spinner
```

### search.tsx
```tsx
const { searchTerm, setSearchTerm, isSearchActive } = useTable();

return (
  <div className="flex items-center gap-2">
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
```

### filters.tsx
```tsx
const { setFilter, removeFilter, activeFilterCount, clearFilters } = useTable();

return (
  <div className="flex items-center gap-2">
    <select onChange={(e) => setFilter('status', e.target.value)}>
      <option value="">All statuses</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
    {activeFilterCount > 0 && (
      <button onClick={clearFilters}>{activeFilterCount} filters — clear</button>
    )}
  </div>
);
```

### pagination.tsx
```tsx
const {
  currentPage, totalPages, startRow, endRow, totalCount,
  goToPreviousPage, goToNextPage, canGoPrevious, canGoNext,
} = useTable();

return (
  <div className="flex items-center justify-between py-3 px-4 border-t">
    <span className="text-sm text-gray-500">
      {startRow}–{endRow} of {totalCount}
    </span>
    <div className="flex gap-2">
      <button disabled={!canGoPrevious} onClick={goToPreviousPage}>Previous</button>
      <span>{currentPage} / {totalPages}</span>
      <button disabled={!canGoNext} onClick={goToNextPage}>Next</button>
    </div>
  </div>
);
```

### selection.tsx
```tsx
const { hasSelection, selectedCount, selectedRowIds, clearSelection } = useTable();

if (!hasSelection) return null;

return (
  <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded">
    <span className="text-sm font-medium">{selectedCount} selected</span>
    <button onClick={() => console.log(selectedRowIds)}>Export IDs</button>
    <button onClick={clearSelection}>Clear</button>
  </div>
);
```

### detail-drawer.tsx
```tsx
const {
  detailDrawerOpen, selectedDetailObjectUuid,
  navigateToNextEntry, navigateToPreviousEntry, closeDetailDrawer,
} = useTable();

if (!detailDrawerOpen) return null;

return (
  <div className="flex items-center gap-2 p-2 border-b">
    <button onClick={navigateToPreviousEntry}>Previous</button>
    <span className="text-xs text-gray-500">{selectedDetailObjectUuid}</span>
    <button onClick={navigateToNextEntry}>Next</button>
    <button onClick={closeDetailDrawer} className="ml-auto">Close</button>
  </div>
);
```

### view-state.tsx
```tsx
const {
  visibleColumnCount, totalColumnCount,
  toggleColumnVisibility, isColumnVisible, columns,
} = useTable();

return (
  <div className="p-3 border rounded shadow-sm space-y-1">
    <p className="text-xs font-semibold text-gray-500">
      {visibleColumnCount} / {totalColumnCount} columns visible
    </p>
    {columns.map((col) => {
      const id = col.id ?? col.accessorKey;
      return (
        <label key={id} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isColumnVisible(id)}
            onChange={() => toggleColumnVisibility(id)}
```

### actions.tsx
```tsx
const { exportData, refetch, hasSelection, performBulkAction, resetTable } = useTable();

return (
  <div className="flex items-center gap-2">
    <button onClick={() => exportData('csv')}>Export CSV</button>
    {hasSelection && (
      <button onClick={() => performBulkAction('archive')}>Archive selected</button>
    )}
    <button onClick={refetch}>Refresh</button>
    <button onClick={resetTable}>Reset</button>
  </div>
);
```

### useTable-signature.tsx
```tsx
const {
  // Core Data
  data, flatData, isLoading, isFetching, error,
  totalCount, totalDBRowCount,
  metadata, rawResponse, rawTableData, isInfiniteScroll,

  // Search
  searchTerm, setSearchTerm, debouncedSearchTerm, isSearchActive,

  // Filters
  filterObj, setFilterObj, debouncedFilterObj, activeFilterCount,
  clearFilters, setFilter, removeFilter, hasFilter, getFilter,

  // Pagination
  currentPage, setCurrentPage, totalPages,
  rowsPerPage, setRowsPerPage, hasNextPage, hasPreviousPage,
  canGoNext, canGoPrevious, pageNumbers,
  goToFirstPage, goToLastPage, goToNextPage, goToPreviousPage,
  startRow, endRow,

  // Selection
  selectedRows, setSelectedRows, selectRow, selectAll, clearSelection,
  selectedCount, isAllSelected, isSomeSelected, hasSelection,
  selectedRowIds, isRowSelected, toggleRows, selectByIds, deselectByIds,
  getSelectedData, withSelectedRows,

  // Detail Drawer
  selectedDetailObjectUuid, setSelectedDetailObjectUuid,
  detailDrawerOpen, setDetailDrawerOpen,
  handleRowClick, closeDetailDrawer,
  navigateToNextEntry, navigateToPreviousEntry,

  // View State
  columnVisibility, setColumnVisibility,
  columnOrder, setColumnOrder,
  columnPinning, setColumnPinning,
  sorting, setSorting,
  visibleColumns, hiddenColumns,
  visibleColumnCount, hiddenColumnCount, totalColumnCount,
  toggleColumnVisibility, showColumn, hideColumn,
  showAllColumns, hideAllColumns, isColumnVisible,
  moveColumn, pinColumnLeft, pinColumnRight, unpinColumn,

  // Table Instance
  table, columns,

  // Actions
  refresh, refetch, invalidateCache,
  isRefreshing, canRefresh, hasError,
  exportData, printData, performBulkAction,
  resetTable, getTableSummary,
  handleUploadClick, handleDownloadClick,

  // UI Controls
  hideControls, setHideControls,

  // Configuration
  apiUrl, tableId,
} = useTable();
```

