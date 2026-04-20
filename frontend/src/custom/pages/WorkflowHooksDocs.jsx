import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const WorkflowHooksDocs = () => {
  return (
    <DocPage
      title="Hooks Reference"
      category="crud"
      subtitle="Complete reference for all hooks available in @zango-core/crud/table."
      badge="Hooks"
    >
      {/* ------------------------------------------------------------------ */}
      {/* useTable                                                            */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useTable()">
        <p className="mb-4">
          The main unified hook that combines every specialized hook below into a single
          convenient API. If you only need one import, this is it.
        </p>

        <Callout type="info" title="Combines All Hooks">
          <InlineCode>useTable</InlineCode> internally delegates to{' '}
          <InlineCode>useTableData</InlineCode>, <InlineCode>useTableSearch</InlineCode>,{' '}
          <InlineCode>useTableFilters</InlineCode>, <InlineCode>useTablePagination</InlineCode>,{' '}
          <InlineCode>useTableSelection</InlineCode>, <InlineCode>useTableColumns</InlineCode>,{' '}
          <InlineCode>useTableActions</InlineCode>, and <InlineCode>useTableRowActions</InlineCode>.
          Use the individual hooks when you only need a subset of functionality.
        </Callout>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Return Values</h3>
        <PropsTable
          props={[
            { name: 'data', type: 'array', description: 'Flat array of row objects for the current page.' },
            { name: 'totalCount', type: 'number', description: 'Total number of rows across all pages.' },
            { name: 'isLoading', type: 'boolean', description: 'True while data is being fetched.' },
            { name: 'currentPage', type: 'number', description: 'Zero-based index of the current page.' },
            { name: 'rowsPerPage', type: 'number', description: 'Number of rows displayed per page.' },
            { name: 'totalPages', type: 'number', description: 'Total number of pages.' },
            { name: 'hasPreviousPage', type: 'boolean', description: 'Whether a previous page exists.' },
            { name: 'hasNextPage', type: 'boolean', description: 'Whether a next page exists.' },
            { name: 'setCurrentPage', type: '(page: number) => void', description: 'Navigate to a specific page.' },
            { name: 'setRowsPerPage', type: '(size: number) => void', description: 'Change the page size.' },
            { name: 'selectedDetailRow', type: 'object \| null', description: 'The row currently open in the detail drawer.' },
            { name: 'openDetailDrawer', type: '(row) => void', description: 'Open the detail drawer for a row.' },
            { name: 'closeDetailDrawer', type: '() => void', description: 'Close the detail drawer.' },
            { name: 'navigateToNextEntry', type: '() => void', description: 'Move the detail drawer to the next row.' },
            { name: 'navigateToPreviousEntry', type: '() => void', description: 'Move the detail drawer to the previous row.' },
            { name: 'searchTerm', type: 'string', description: 'Current search query.' },
            { name: 'setSearchTerm', type: '(term: string) => void', description: 'Update the search query.' },
            { name: 'activeFilterCount', type: 'number', description: 'Number of currently active filters.' },
            { name: 'handleRowClick', type: '(row) => void', description: 'Default row-click handler that opens the detail drawer.' },
            { name: 'refetch', type: '() => void', description: 'Re-fetch data from the API.' },
            { name: 'api_endpoint', type: 'string', description: 'The resolved API endpoint URL.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-table.jsx"
          code={`import { useTable } from "@zango-core/crud/table";

function OrdersPage() {
  const { data, isLoading, totalCount, refetch } = useTable();
  if (isLoading) return <p>Loading…</p>;
  return <p>{totalCount} orders loaded. <button onClick={refetch}>Refresh</button></p>;
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useTableData                                                        */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useTableData()">
        <p className="mb-4">
          Handles data fetching, server-side sorting, and metadata resolution for the table.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Configuration</h3>
        <PropsTable
          props={[
            { name: 'apiUrl', type: 'string', required: true, description: 'API endpoint to fetch rows from.' },
            { name: 'columns', type: 'array', description: 'Column definitions. If omitted, derived from tableMetadata.' },
            { name: 'tableMetadata', type: 'object', description: 'Pre-fetched metadata object. If omitted, fetched from apiUrl.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Return Values</h3>
        <PropsTable
          props={[
            { name: 'flatData', type: 'array', description: 'Flat array of row objects for the current page.' },
            { name: 'totalDBRowCount', type: 'number', description: 'Total row count reported by the server.' },
            { name: 'totalPages', type: 'number', description: 'Computed total pages based on row count and page size.' },
            { name: 'isLoading', type: 'boolean', description: 'True during the initial data load.' },
            { name: 'isFetching', type: 'boolean', description: 'True during any fetch, including background refetches.' },
            { name: 'error', type: 'Error \| null', description: 'Error object if the fetch failed.' },
            { name: 'searchTerm', type: 'string', description: 'Current search term sent to the server.' },
            { name: 'setSearchTerm', type: '(term: string) => void', description: 'Update the search term.' },
            { name: 'filterObj', type: 'object', description: 'Current filter state sent to the server.' },
            { name: 'setFilterObj', type: '(filters: object) => void', description: 'Replace all active filters.' },
            { name: 'currentPage', type: 'number', description: 'Zero-based current page index.' },
            { name: 'setCurrentPage', type: '(page: number) => void', description: 'Navigate to a page.' },
            { name: 'rowsPerPage', type: 'number', description: 'Rows per page.' },
            { name: 'setRowsPerPage', type: '(size: number) => void', description: 'Change page size.' },
            { name: 'sorting', type: 'array', description: 'Current sorting state array.' },
            { name: 'setSorting', type: '(sorting: array) => void', description: 'Update sorting.' },
            { name: 'tableMetadata', type: 'object', description: 'Resolved table metadata (fetched or passed in).' },
            { name: 'columns', type: 'array', description: 'Effective column definitions used by the table.' },
            { name: 'refetch', type: '() => void', description: 'Re-fetch the current page of data.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-table-data.jsx"
          code={`import { useTableData } from "@zango-core/crud/table";

function ProductList() {
  const { flatData, isLoading, totalDBRowCount, refetch } = useTableData({
    apiUrl: "/api/products/",
  });
  if (isLoading) return <p>Loading…</p>;
  return <p>{totalDBRowCount} products found. <button onClick={refetch}>Refresh</button></p>;
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useTableSearch                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useTableSearch()">
        <p className="mb-4">
          Manages the search input state with built-in debouncing so rapid keystrokes
          do not trigger excessive API calls.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Return Values</h3>
        <PropsTable
          props={[
            { name: 'searchTerm', type: 'string', description: 'The raw search input value (updates on every keystroke).' },
            { name: 'setSearchTerm', type: '(term: string) => void', description: 'Update the search input.' },
            { name: 'debouncedSearchTerm', type: 'string', description: 'The debounced value actually sent to the API.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-table-search.jsx"
          code={`import { useTableSearch } from "@zango-core/crud/table";

function SearchBar() {
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useTableSearch();
  return (
    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search…" />
  );
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useTableFilters                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useTableFilters()">
        <p className="mb-4">
          Manages the active filter state for the table, including a convenience count
          of active filters and helpers to clear them.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Return Values</h3>
        <PropsTable
          props={[
            { name: 'filterObj', type: 'object', description: 'Current filter key-value map sent to the API.' },
            { name: 'setFilterObj', type: '(filters: object) => void', description: 'Replace the entire filter state.' },
            { name: 'activeFilterCount', type: 'number', description: 'Number of non-empty filter entries.' },
            { name: 'clearFilters', type: '() => void', description: 'Remove all active filters.' },
            { name: 'hasActiveFilters', type: 'boolean', description: 'True when at least one filter is active.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-table-filters.jsx"
          code={`import { useTableFilters } from "@zango-core/crud/table";

function FilterBar() {
  const { filterObj, setFilterObj, activeFilterCount, clearFilters } = useTableFilters();
  return (
    <div>
      <span>{activeFilterCount} filters active</span>
      <button onClick={clearFilters}>Clear all</button>
    </div>
  );
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useTablePagination                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useTablePagination()">
        <p className="mb-4">
          Provides pagination state and navigation helpers for moving between pages.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Return Values</h3>
        <PropsTable
          props={[
            { name: 'currentPage', type: 'number', description: 'Zero-based index of the current page.' },
            { name: 'totalPages', type: 'number', description: 'Total number of pages.' },
            { name: 'rowsPerPage', type: 'number', description: 'Rows displayed per page.' },
            { name: 'setCurrentPage', type: '(page: number) => void', description: 'Jump to a specific page.' },
            { name: 'setRowsPerPage', type: '(size: number) => void', description: 'Change the page size (resets to page 0).' },
            { name: 'hasPreviousPage', type: 'boolean', description: 'Whether navigating backward is possible.' },
            { name: 'hasNextPage', type: 'boolean', description: 'Whether navigating forward is possible.' },
            { name: 'goToFirstPage', type: '() => void', description: 'Navigate to the first page.' },
            { name: 'goToLastPage', type: '() => void', description: 'Navigate to the last page.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-table-pagination.jsx"
          code={`import { useTablePagination } from "@zango-core/crud/table";

function Pager() {
  const { currentPage, totalPages, hasPreviousPage, hasNextPage, setCurrentPage } = useTablePagination();
  return (
    <div>
      <button disabled={!hasPreviousPage} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
      <span>Page {currentPage + 1} of {totalPages}</span>
      <button disabled={!hasNextPage} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
    </div>
  );
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useTableSelection                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useTableSelection()">
        <p className="mb-4">
          Tracks which rows the user has selected, with helpers for toggling individual
          rows and select-all behaviour.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Return Values</h3>
        <PropsTable
          props={[
            { name: 'selectedRows', type: 'array', description: 'Array of currently selected row objects or IDs.' },
            { name: 'setSelectedRows', type: '(rows: array) => void', description: 'Directly set the selected rows.' },
            { name: 'isAllSelected', type: 'boolean', description: 'True when every visible row is selected.' },
            { name: 'toggleSelectAll', type: '() => void', description: 'Select all visible rows, or deselect all if already selected.' },
            { name: 'toggleSelectRow', type: '(row) => void', description: 'Toggle selection for a single row.' },
            { name: 'clearSelection', type: '() => void', description: 'Deselect all rows.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-table-selection.jsx"
          code={`import { useTableSelection } from "@zango-core/crud/table";

function BulkActions() {
  const { selectedRows, toggleSelectAll, isAllSelected, clearSelection } = useTableSelection();
  return (
    <div>
      <button onClick={toggleSelectAll}>{isAllSelected ? "Deselect All" : "Select All"}</button>
      <span>{selectedRows.length} selected</span>
      <button onClick={clearSelection}>Clear</button>
    </div>
  );
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useTableColumns                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useTableColumns()">
        <p className="mb-4">
          Controls column visibility, ordering, and pinning. Useful for building
          column-picker UIs or persisting user column preferences.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Return Values</h3>
        <PropsTable
          props={[
            { name: 'visibleColumns', type: 'array', description: 'Array of currently visible column definitions.' },
            { name: 'hiddenColumns', type: 'array', description: 'Array of currently hidden column definitions.' },
            { name: 'toggleColumnVisibility', type: '(columnId: string) => void', description: 'Toggle a column between visible and hidden.' },
            { name: 'showColumn', type: '(columnId: string) => void', description: 'Make a specific column visible.' },
            { name: 'hideColumn', type: '(columnId: string) => void', description: 'Hide a specific column.' },
            { name: 'showAllColumns', type: '() => void', description: 'Make all columns visible.' },
            { name: 'hideAllColumns', type: '() => void', description: 'Hide all columns.' },
            { name: 'isColumnVisible', type: '(columnId: string) => boolean', description: 'Check if a column is currently visible.' },
            { name: 'moveColumn', type: '(columnId: string, newIndex: number) => void', description: 'Reorder a column to a new position.' },
            { name: 'pinColumnLeft', type: '(columnId: string) => void', description: 'Pin a column to the left side of the table.' },
            { name: 'pinColumnRight', type: '(columnId: string) => void', description: 'Pin a column to the right side of the table.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-table-columns.jsx"
          code={`import { useTableColumns } from "@zango-core/crud/table";

function ColumnPicker() {
  const { visibleColumns, hiddenColumns, toggleColumnVisibility } = useTableColumns();
  return (
    <ul>
      {[...visibleColumns, ...hiddenColumns].map((col) => (
        <li key={col.id}>
          <label>
            <input type="checkbox" checked={visibleColumns.includes(col)}
              onChange={() => toggleColumnVisibility(col.id)} /> {col.header}
          </label>
        </li>
      ))}
    </ul>
  );
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useTableActions                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useTableActions()">
        <p className="mb-4">
          Exposes top-level table actions such as refetching data and exporting the
          table contents.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Return Values</h3>
        <PropsTable
          props={[
            { name: 'refetch', type: '() => void', description: 'Re-fetch the table data from the server.' },
            { name: 'exportTable', type: '() => void', description: 'Trigger an export of the current table data.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-table-actions.jsx"
          code={`import { useTableActions } from "@zango-core/crud/table";

function Toolbar() {
  const { refetch, exportTable } = useTableActions();
  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <button onClick={exportTable}>Export CSV</button>
    </div>
  );
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useTableRowActions                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useTableRowActions()">
        <p className="mb-4">
          Manages row-click behaviour and the detail drawer, including keyboard-style
          navigation between entries.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Return Values</h3>
        <PropsTable
          props={[
            { name: 'handleRowClick', type: '(row) => void', description: 'Default handler that opens the detail drawer for the clicked row.' },
            { name: 'selectedDetailRow', type: 'object \| null', description: 'The row currently displayed in the detail drawer.' },
            { name: 'openDetailDrawer', type: '(row) => void', description: 'Programmatically open the detail drawer for a row.' },
            { name: 'closeDetailDrawer', type: '() => void', description: 'Close the detail drawer.' },
            { name: 'navigateToNextEntry', type: '() => void', description: 'Move the detail drawer to the next row in the list.' },
            { name: 'navigateToPreviousEntry', type: '() => void', description: 'Move the detail drawer to the previous row in the list.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-table-row-actions.jsx"
          code={`import { useTableRowActions } from "@zango-core/crud/table";

function DetailDrawerNav() {
  const { selectedDetailRow, closeDetailDrawer, navigateToNextEntry, navigateToPreviousEntry } = useTableRowActions();
  if (!selectedDetailRow) return null;
  return (
    <div>
      <button onClick={navigateToPreviousEntry}>Prev</button>
      <button onClick={navigateToNextEntry}>Next</button>
      <button onClick={closeDetailDrawer}>Close</button>
    </div>
  );
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useDetailView                                                       */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useDetailView()">
        <p className="mb-4">
          Fetches and manages data for a single detail record, including its associated
          workflow state and available row-level actions.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Configuration</h3>
        <PropsTable
          props={[
            { name: 'apiUrl', type: 'string', description: 'API endpoint for the detail record. Automatically resolved from context if inside a DetailViewProvider.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Return Values</h3>
        <PropsTable
          props={[
            { name: 'data', type: 'object', description: 'The fetched detail data for the current object.' },
            { name: 'loading', type: 'boolean', description: 'True while detail data is being fetched.' },
            { name: 'error', type: 'string \| null', description: 'Error message if the detail fetch failed.' },
            { name: 'refresh', type: '() => Promise<void>', description: 'Re-fetch the detail data from the API.' },
            { name: 'objectUuid', type: 'string', description: 'UUID of the current detail object.' },
            { name: 'workflowDetails', type: 'object', description: 'Workflow data for the object (current_status, current_status_meta, next_transitions, tag_details).' },
            { name: 'rowActions', type: 'array', description: 'Available row-level actions for the current object.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-detail-view.jsx"
          code={`import { useDetailView } from "@zango-core/crud/table";

function UserProfile() {
  const { data, loading, error, refresh, objectUuid } = useDetailView({
    apiUrl: "/api/users/?object_uuid=abc-123",
  });
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  return <p>{data.name} ({objectUuid}) <button onClick={refresh}>Refresh</button></p>;
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useDetailViewContext                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useDetailViewContext()">
        <p className="mb-4">
          Accesses the nearest <InlineCode>DetailViewProvider</InlineCode> context. Returns the
          same shape as <InlineCode>useDetailView</InlineCode> but reads from the shared context
          rather than making its own API call. Must be used inside a{' '}
          <InlineCode>DetailViewProvider</InlineCode>.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Return Values</h3>
        <PropsTable
          props={[
            { name: 'data', type: 'object', description: 'Detail data from the shared context.' },
            { name: 'loading', type: 'boolean', description: 'True while the shared detail fetch is in progress.' },
            { name: 'error', type: 'string \| null', description: 'Error from the shared detail fetch.' },
            { name: 'refresh', type: '() => Promise<void>', description: 'Re-fetch detail data for the entire context.' },
            { name: 'objectUuid', type: 'string', description: 'UUID of the current detail object.' },
            { name: 'workflowDetails', type: 'object', description: 'Workflow data from the shared context.' },
            { name: 'rowActions', type: 'array', description: 'Row-level actions from the shared context.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example</h3>
        <CodeBlock
          language="jsx"
          title="use-detail-view-context.jsx"
          code={`import { useDetailViewContext } from "@zango-core/crud/table";

function StatusBadge() {
  const { workflowDetails, loading } = useDetailViewContext();
  if (loading || !workflowDetails) return null;
  return <span className="badge">{workflowDetails.current_status_meta?.status_label}</span>;
}`}
        />
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* useWorkflow                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Section title="useWorkflow()">
        <p className="mb-4">
          Provides full programmatic access to workflow state and operations. Use it when
          you need direct control over transitions, tags, or workflow data outside of the
          built-in workflow components. Automatically reads from{' '}
          <InlineCode>DetailViewContext</InlineCode> when no <InlineCode>apiUrl</InlineCode> is
          provided.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Configuration</h3>
        <PropsTable
          props={[
            { name: 'apiUrl', type: 'string', description: 'API endpoint for fetching and mutating workflow data. Optional — resolved from context when omitted. Required for executeTransition / toggleTag in static data mode.' },
            { name: 'initialWorkflowDetails', type: 'WorkflowDetails', description: 'Seed the hook with known workflow data. Overridden by staticData when both are supplied.' },
            { name: 'staticData', type: 'any', description: 'Pre-fetched payload that already contains workflow details. Accepts { workflow_details }, { response: { workflow_details } }, or a bare WorkflowDetails object. Bypasses the initial API fetch; apiUrl is still needed for mutations.' },
            { name: 'objectUuid', type: 'string', description: 'Explicit object UUID used in API calls. Extracted from apiUrl automatically when omitted.' },
            { name: 'beforeTransition', type: '(transition: Transition) => Promise<void> \| void', description: 'Async callback invoked before executing a status transition. Throw to abort.' },
            { name: 'afterTransition', type: '(transition: Transition, success: boolean) => Promise<void> \| void', description: 'Async callback invoked after a transition completes.' },
            { name: 'beforeTagChange', type: '(tag: TagDetail, newState: string) => Promise<void> \| void', description: 'Async callback invoked before toggling a tag.' },
            { name: 'afterTagChange', type: '(tag: TagDetail, success: boolean) => Promise<void> \| void', description: 'Async callback invoked after a tag toggle completes.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Return Values</h3>
        <PropsTable
          props={[
            { name: 'workflowDetails', type: 'WorkflowDetails \| undefined', description: 'Full workflow data: current_status, current_status_meta, next_transitions, and tag_details.' },
            { name: 'loading', type: 'boolean', description: 'True while workflow data is being fetched or a mutation is in-flight.' },
            { name: 'error', type: 'Error \| null', description: 'Error object if the workflow fetch or operation failed.' },
            { name: 'executeTransition', type: '(transition: Transition) => Promise<boolean>', description: 'Execute a status transition. Refreshes workflow data on success. Returns success boolean.' },
            { name: 'toggleTag', type: '(tag: TagDetail) => Promise<boolean>', description: 'Toggle a tag between enabled and disabled. Returns success boolean.' },
            { name: 'refreshWorkflow', type: '() => Promise<void>', description: 'Re-fetch workflow data from the API. No-op in static data mode without apiUrl.' },
            { name: 'handleFormSubmit', type: '() => Promise<void>', description: 'Call after a form-based transition submits; triggers refreshWorkflow internally.' },
            { name: 'setWorkflowDetails', type: '(details: WorkflowDetails) => void', description: 'Directly overwrite local workflow state — useful for optimistic updates.' },
            { name: 'onCancel', type: '() => void', description: 'Reset workflow to initialWorkflowDetails and re-fetch from API.' },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example — API mode</h3>
        <CodeBlock
          language="jsx"
          title="use-workflow-api.jsx"
          code={`import { useWorkflow } from "@zango-core/crud/table";

function ApproveButton({ objectUuid }) {
  const { workflowDetails, executeTransition, loading } = useWorkflow({
    apiUrl: \`/api/orders/?object_uuid=\${objectUuid}\`,
  });
  if (loading || !workflowDetails) return null;
  const approveTransition = workflowDetails.next_transitions.find((t) => t.name === "approve");
  if (!approveTransition) return null;
  return <button onClick={() => executeTransition(approveTransition)}>Approve</button>;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Example — static data mode</h3>
        <CodeBlock
          language="jsx"
          title="use-workflow-static.jsx"
          code={`import { useDetailView, useWorkflow } from "@zango-core/crud/table";

// Use when workflow data is already fetched as part of a detail view.
// Pass staticData to skip the extra API call; supply apiUrl for mutations.
function WorkflowPanel({ apiUrl }) {
  const { data, loading: detailLoading } = useDetailView({ apiUrl });

  const {
    workflowDetails,
    executeTransition,
    toggleTag,
    loading,
  } = useWorkflow({
    staticData: data,          // extracts data.workflow_details automatically
    apiUrl,                    // still required for executeTransition / toggleTag
  });

  if (detailLoading || !workflowDetails) return <p>Loading…</p>;

  return (
    <div>
      <p>Status: {workflowDetails.current_status_meta?.status_label}</p>
      {workflowDetails.next_transitions.map((t) => (
        <button key={t.name} disabled={loading} onClick={() => executeTransition(t)}>
          {t.display_name}
        </button>
      ))}
    </div>
  );
}`}
        />
      </Section>
    </DocPage>
  );
};

export default WorkflowHooksDocs;
