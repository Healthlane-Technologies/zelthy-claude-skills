import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const UseTableDocs = () => {
  return (
    <DocPage
      title="useTable()"
      category="crud"
      subtitle="Access shared table context from any custom component rendered within CrudHandler. Stay in sync with table state and controls."
      badge="Hook"
    >
      <Section title="Overview">
        <p className="mb-4">
          Any custom component rendered within <InlineCode>{'<CrudHandler>'}</InlineCode> can consume the table context
          using the <InlineCode>useTable()</InlineCode> hook. This gives you access to all table state and control functions.
        </p>
        <Callout type="info" title="Context Requirement">
          This hook must be used inside a component that is a child of <InlineCode>{'<CrudHandler>'}</InlineCode>.
          Using it outside will throw an error.
        </Callout>
        <Callout type="tip" title="Specialized Hooks">
          <InlineCode>useTable()</InlineCode> is the unified hook. For granular control, specialized hooks like
          useTableSearch, useTableFilters, useTablePagination, useTableSelection, useTableColumns are also available.
          See the <a href="/app/workflow-hooks" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'underline' }}>Hooks Reference</a> for the complete list.
        </Callout>
      </Section>

      <Section title="Core Data">
        <p className="mb-4">
          Primary data and loading state returned from the API fetch.
        </p>
        <PropsTable
          props={[
            { name: 'data', type: 'T[]', description: 'Items currently rendered in the table body.' },
            { name: 'flatData', type: 'T[]', description: 'Flat (non-grouped) view of all fetched rows.' },
            { name: 'isLoading', type: 'boolean', description: 'True while the initial fetch is in flight.' },
            { name: 'isFetching', type: 'boolean', description: 'True during background refetches.' },
            { name: 'error', type: 'Error \| null', description: 'Last fetch error, or null when healthy.' },
            { name: 'totalCount', type: 'number', description: 'Total row count across all pages.' },
            { name: 'totalDBRowCount', type: 'number', description: 'Raw DB row count before any client filter.' },
            { name: 'metadata', type: 'Record<string, unknown> \| null', description: 'Extra metadata from API response.' },
            { name: 'rawResponse', type: 'unknown', description: 'Unprocessed API response payload.' },
            { name: 'rawTableData', type: 'T[]', description: 'Rows before table transformations.' },
            { name: 'isInfiniteScroll', type: 'boolean', description: 'Whether infinite-scroll mode is active.' },
          ]}
        />
        <CodeBlock
          language="tsx"
          title="core-data.tsx"
          code={`const { data, isLoading, isFetching, error, totalCount } = useTable();

if (isLoading) return <Spinner />;
if (error) return <p>Error: {error.message}</p>;

return <p>{totalCount} records loaded ({data.length} visible)</p>;`}
        />
      </Section>

      <Section title="Search">
        <p className="mb-4">
          Search term state and debounced variants for driving API queries.
        </p>
        <PropsTable
          props={[
            { name: 'searchTerm', type: 'string', description: 'Live value of the search input.' },
            { name: 'setSearchTerm', type: '(term: string) => void', description: 'Update the search term.' },
            { name: 'debouncedSearchTerm', type: 'string', description: 'Debounced value used in API calls.' },
            { name: 'isSearchActive', type: 'boolean', description: 'True when searchTerm is non-empty.' },
          ]}
        />
        <CodeBlock
          language="tsx"
          title="search.tsx"
          code={`const { searchTerm, setSearchTerm, isSearchActive } = useTable();

return (
  <div className="flex items-center gap-2">
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
    {isSearchActive && (
      <button onClick={() => setSearchTerm('')}>Clear</button>
    )}
  </div>
);`}
        />
      </Section>

      <Section title="Filters">
        <p className="mb-4">
          Filter object state plus helper methods for getting/setting individual filter keys.
        </p>
        <PropsTable
          props={[
            { name: 'filterObj', type: 'Record<string, TableFilter>', description: 'Map of all active filter key/values.' },
            { name: 'setFilterObj', type: '(filters: Record<string, TableFilter>) => void', description: 'Replace entire filter map.' },
            { name: 'debouncedFilterObj', type: 'Record<string, TableFilter>', description: 'Debounced filter map used in API calls.' },
            { name: 'activeFilterCount', type: 'number', description: 'Count of currently active filters.' },
            { name: 'clearFilters', type: '() => void', description: 'Reset all filters to empty.' },
            { name: 'setFilter', type: '(key: string, value: unknown) => void', description: 'Set a single filter by key.' },
            { name: 'removeFilter', type: '(key: string) => void', description: 'Remove a single filter by key.' },
            { name: 'hasFilter', type: '(key: string) => boolean', description: 'True when filter key has an active value.' },
            { name: 'getFilter', type: '(key: string) => TableFilter \| undefined', description: 'Read one filter value by key.' },
          ]}
        />
        <CodeBlock
          language="tsx"
          title="filters.tsx"
          code={`const { setFilter, removeFilter, activeFilterCount, clearFilters } = useTable();

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
);`}
        />
      </Section>

      <Section title="Pagination">
        <p className="mb-4">
          Page navigation state and helper methods. <InlineCode>canGoNext</InlineCode> / <InlineCode>canGoPrevious</InlineCode>
          are derived booleans; prefer them over manual comparisons.
        </p>
        <PropsTable
          props={[
            { name: 'currentPage', type: 'number', description: 'Current page number (1-based).' },
            { name: 'setCurrentPage', type: '(page: number) => void', description: 'Jump to a specific page.' },
            { name: 'totalPages', type: 'number', description: 'Total number of pages.' },
            { name: 'rowsPerPage', type: 'number', description: 'Rows per page.' },
            { name: 'setRowsPerPage', type: '(size: number) => void', description: 'Change page size.' },
            { name: 'hasNextPage', type: 'boolean', description: 'Whether a next page exists.' },
            { name: 'hasPreviousPage', type: 'boolean', description: 'Whether a previous page exists.' },
            { name: 'canGoNext', type: 'boolean', description: 'Derived: currentPage < totalPages.' },
            { name: 'canGoPrevious', type: 'boolean', description: 'Derived: currentPage > 1.' },
            { name: 'pageNumbers', type: 'number[]', description: 'Window of nearby page numbers for a page picker.' },
            { name: 'goToFirstPage', type: '() => void', description: 'Navigate to page 1.' },
            { name: 'goToLastPage', type: '() => void', description: 'Navigate to the last page.' },
            { name: 'goToNextPage', type: '() => void', description: 'Advance one page.' },
            { name: 'goToPreviousPage', type: '() => void', description: 'Go back one page.' },
            { name: 'startRow', type: 'number', description: 'First row index on current page (1-based).' },
            { name: 'endRow', type: 'number', description: 'Last row index on current page (clamped to totalCount).' },
          ]}
        />
        <CodeBlock
          language="tsx"
          title="pagination.tsx"
          code={`const {
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
);`}
        />
      </Section>

      <Section title="Selection">
        <p className="mb-4">
          Row selection state. <InlineCode>selectedRows</InlineCode> holds the actual row objects; helper IDs and booleans
          are derived from it for convenience.
        </p>
        <PropsTable
          props={[
            { name: 'selectedRows', type: 'T[]', description: 'Array of currently selected row objects.' },
            { name: 'setSelectedRows', type: '(rows: T[]) => void', description: 'Replace entire selection.' },
            { name: 'selectRow', type: '(row: Row<T>) => void', description: 'Select a single TanStack row.' },
            { name: 'selectAll', type: '() => void', description: 'Select all rows on current page.' },
            { name: 'clearSelection', type: '() => void', description: 'Deselect all rows.' },
            { name: 'selectedCount', type: 'number', description: 'Count of selected rows.' },
            { name: 'isAllSelected', type: 'boolean', description: 'True when all page rows are selected.' },
            { name: 'isSomeSelected', type: 'boolean', description: 'True when a partial selection exists.' },
            { name: 'hasSelection', type: 'boolean', description: 'True when at least one row is selected.' },
            { name: 'selectedRowIds', type: '(string \| number)[]', description: 'IDs extracted from selectedRows.' },
            { name: 'isRowSelected', type: '(row: Row<T>) => boolean', description: 'Check if a specific row is selected.' },
            { name: 'toggleRows', type: '(rows: Row<T>[]) => void', description: 'Toggle selection for a set of rows.' },
            { name: 'selectByIds', type: '(ids: (string \| number)[]) => void', description: 'Select rows matching given IDs.' },
            { name: 'deselectByIds', type: '(ids: (string \| number)[]) => void', description: 'Deselect rows matching given IDs.' },
            { name: 'getSelectedData', type: '() => T[]', description: 'Return currently selected rows.' },
            { name: 'withSelectedRows', type: '(callback: (rows: T[]) => void) => void', description: 'Run callback only if selection is non-empty.' },
          ]}
        />
        <CodeBlock
          language="tsx"
          title="selection.tsx"
          code={`const { hasSelection, selectedCount, selectedRowIds, clearSelection } = useTable();

if (!hasSelection) return null;

return (
  <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded">
    <span className="text-sm font-medium">{selectedCount} selected</span>
    <button onClick={() => console.log(selectedRowIds)}>Export IDs</button>
    <button onClick={clearSelection}>Clear</button>
  </div>
);`}
        />
      </Section>

      <Section title="Detail Drawer">
        <p className="mb-4">
          State for the row-detail side drawer and in-drawer navigation.
        </p>
        <PropsTable
          props={[
            { name: 'selectedDetailObjectUuid', type: 'string \| null', description: 'UUID of the row open in the detail drawer.' },
            { name: 'setSelectedDetailObjectUuid', type: '(uuid: string \| null) => void', description: 'Open detail for a specific UUID.' },
            { name: 'detailDrawerOpen', type: 'boolean', description: 'True when the detail drawer is visible.' },
            { name: 'setDetailDrawerOpen', type: '(open: boolean) => void', description: 'Programmatically show/hide the drawer.' },
            { name: 'handleRowClick', type: '(row: Row<T>, event?: React.MouseEvent) => void', description: 'Default row-click handler (opens drawer).' },
            { name: 'closeDetailDrawer', type: '() => void', description: 'Close the drawer and clear selection.' },
            { name: 'navigateToNextEntry', type: '() => void', description: 'Advance to next row inside the drawer.' },
            { name: 'navigateToPreviousEntry', type: '() => void', description: 'Go back to previous row inside the drawer.' },
          ]}
        />
        <CodeBlock
          language="tsx"
          title="detail-drawer.tsx"
          code={`const {
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
);`}
        />
      </Section>

      <Section title="View State">
        <p className="mb-4">
          Column visibility, ordering, pinning, and sorting state. Low-level setters pair with high-level helper methods.
        </p>
        <PropsTable
          props={[
            { name: 'columnVisibility', type: 'Record<string, boolean>', description: 'Map of columnId to visible flag.' },
            { name: 'setColumnVisibility', type: '(visibility: Record<string, boolean>) => void', description: 'Replace entire visibility map.' },
            { name: 'columnOrder', type: 'string[]', description: 'Ordered list of column IDs.' },
            { name: 'setColumnOrder', type: '(order: string[]) => void', description: 'Set column order array.' },
            { name: 'columnPinning', type: 'Record<string, { left?: string[]; right?: string[] }>', description: 'Pinned column IDs per side.' },
            { name: 'setColumnPinning', type: '(pinning: Record<string, object>) => void', description: 'Update pinning config.' },
            { name: 'sorting', type: 'SortingState', description: 'Active TanStack sorting state.' },
            { name: 'setSorting', type: '(sorting: SortingState) => void', description: 'Update sorting state.' },
            { name: 'visibleColumns', type: 'ColumnDef<T>[]', description: 'Subset of columns currently shown.' },
            { name: 'hiddenColumns', type: 'string[]', description: 'IDs of columns currently hidden.' },
            { name: 'visibleColumnCount', type: 'number', description: 'Count of visible columns.' },
            { name: 'hiddenColumnCount', type: 'number', description: 'Count of hidden columns.' },
            { name: 'totalColumnCount', type: 'number', description: 'Total columns (visible + hidden).' },
            { name: 'toggleColumnVisibility', type: '(columnId: string) => void', description: 'Toggle one column on/off.' },
            { name: 'showColumn', type: '(columnId: string) => void', description: 'Force one column visible.' },
            { name: 'hideColumn', type: '(columnId: string) => void', description: 'Force one column hidden.' },
            { name: 'showAllColumns', type: '() => void', description: 'Make all columns visible.' },
            { name: 'hideAllColumns', type: '() => void', description: 'Hide all columns.' },
            { name: 'isColumnVisible', type: '(columnId: string) => boolean', description: 'Check one column visibility.' },
            { name: 'moveColumn', type: '(columnId: string, toIndex: number) => void', description: 'Reorder a column by index.' },
            { name: 'pinColumnLeft', type: '(columnId: string) => void', description: 'Pin a column to the left.' },
            { name: 'pinColumnRight', type: '(columnId: string) => void', description: 'Pin a column to the right.' },
            { name: 'unpinColumn', type: '(columnId: string) => void', description: 'Remove a column from pinning.' },
          ]}
        />
        <CodeBlock
          language="tsx"
          title="view-state.tsx"
          code={`const {
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
          />
          {id}
        </label>
      );
    })}
  </div>
);`}
        />
      </Section>

      <Section title="Table Instance">
        <p className="mb-4">
          Direct access to the underlying TanStack Table instance and column definitions.
          Use only when the higher-level helpers are insufficient.
        </p>
        <PropsTable
          props={[
            { name: 'table', type: 'TanstackTable<T> \| null', description: 'Raw TanStack Table instance (context mode only).' },
            { name: 'columns', type: 'ColumnDef<T>[]', description: 'Active column definition array.' },
          ]}
        />
      </Section>

      <Section title="Actions">
        <p className="mb-4">
          Refresh, export, bulk operations, and utility actions.
        </p>
        <PropsTable
          props={[
            { name: 'refresh', type: '() => void', description: 'Trigger a data refresh.' },
            { name: 'refetch', type: '() => void', description: 'Alias for refresh (React Query style).' },
            { name: 'invalidateCache', type: '() => void', description: 'Invalidate cached query data.' },
            { name: 'isRefreshing', type: 'boolean', description: 'True while a background refetch runs.' },
            { name: 'canRefresh', type: 'boolean', description: 'True when not loading or fetching.' },
            { name: 'hasError', type: 'boolean', description: 'True when error is non-null.' },
            { name: 'exportData', type: '(format?: json \| csv \| xlsx) => void', description: 'Download current page data as a file.' },
            { name: 'printData', type: '() => void', description: 'Open a print-friendly table window.' },
            { name: 'performBulkAction', type: '(action: string, selectedRows?: T[]) => void', description: 'Execute a named bulk action on rows.' },
            { name: 'resetTable', type: '() => void', description: 'Clear filters, selection, sort, go to page 1.' },
            { name: 'getTableSummary', type: '() => TableSummary', description: 'Snapshot of current table metrics.' },
            { name: 'handleUploadClick', type: '() => void', description: 'Open file picker and POST to upload_data.' },
            { name: 'handleDownloadClick', type: '() => void', description: 'Download filtered data via download_data.' },
          ]}
        />
        <CodeBlock
          language="tsx"
          title="actions.tsx"
          code={`const { exportData, refetch, hasSelection, performBulkAction, resetTable } = useTable();

return (
  <div className="flex items-center gap-2">
    <button onClick={() => exportData('csv')}>Export CSV</button>
    {hasSelection && (
      <button onClick={() => performBulkAction('archive')}>Archive selected</button>
    )}
    <button onClick={refetch}>Refresh</button>
    <button onClick={resetTable}>Reset</button>
  </div>
);`}
        />
      </Section>

      <Section title="UI Controls">
        <p className="mb-4">
          Programmatic control over the built-in toolbar and utility controls.
        </p>
        <PropsTable
          props={[
            { name: 'hideControls', type: 'boolean', description: 'True when the built-in toolbar is hidden.' },
            { name: 'setHideControls', type: '(hide: boolean) => void', description: 'Show or hide the toolbar.' },
          ]}
        />
      </Section>

      <Section title="Configuration">
        <p className="mb-4">
          Read-only identifiers for the current table instance.
        </p>
        <PropsTable
          props={[
            { name: 'apiUrl', type: 'string', description: 'Resolved API endpoint for this table.' },
            { name: 'tableId', type: 'string', description: 'Unique ID scoping this table instance.' },
          ]}
        />
      </Section>

      <Section title="Full Signature">
        <CodeBlock
          language="tsx"
          title="useTable-signature.tsx"
          code={`const {
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
} = useTable();`}
        />
      </Section>
    </DocPage>
  );
};

export default UseTableDocs;
