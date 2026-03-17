import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const UseTableDocs = () => {
  return (
    <DocPage
      title="useTable()"
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

      <Section title="Context Values">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Data & State</h3>
        <PropsTable
          props={[
            { name: 'data', type: 'array', description: 'Array of items currently rendered in the body.' },
            { name: 'totalCount', type: 'number', description: 'Total items across all pages.' },
            { name: 'isLoading', type: 'boolean', description: 'Loading state for list fetches.' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Pagination</h3>
        <PropsTable
          props={[
            { name: 'currentPage', type: 'number', description: 'Current page number.' },
            { name: 'rowsPerPage', type: 'number', description: 'Items per page.' },
            { name: 'totalPages', type: 'number', description: 'Total number of pages.' },
            { name: 'hasPreviousPage', type: 'boolean', description: 'Whether a previous page exists.' },
            { name: 'hasNextPage', type: 'boolean', description: 'Whether a next page exists.' },
            { name: 'setCurrentPage', type: 'function', description: 'Function to change the current page.' },
            { name: 'setRowsPerPage', type: 'function', description: 'Function to change page size.' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Selection & Navigation</h3>
        <PropsTable
          props={[
            { name: 'selectedDetailRow', type: 'object | null', description: 'Currently selected row for detail view.' },
            { name: 'openDetailDrawer', type: 'function', description: 'Function to open the detail drawer.' },
            { name: 'closeDetailDrawer', type: 'function', description: 'Function to close the detail drawer.' },
            { name: 'navigateToNextEntry', type: 'function', description: 'Navigate to next row in detail view.' },
            { name: 'navigateToPreviousEntry', type: 'function', description: 'Navigate to previous row in detail view.' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Search & Filters</h3>
        <PropsTable
          props={[
            { name: 'searchTerm', type: 'string', description: 'Current search term.' },
            { name: 'setSearchTerm', type: 'function', description: 'Function to update the search term.' },
            { name: 'activeFilterCount', type: 'number', description: 'Number of currently active filters.' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Actions & API</h3>
        <PropsTable
          props={[
            { name: 'handleRowClick', type: 'function', description: 'Function to handle row clicks.' },
            { name: 'refetch', type: 'function', description: 'Manually refetch the table data.' },
            { name: 'api_endpoint', type: 'string', description: 'The API endpoint being used.' },
          ]}
        />
      </Section>

      <Section title="Full Signature">
        <CodeBlock
          language="tsx"
          title="useTable-signature.tsx"
          code={`const {
  // Data & State
  data,                    // array of items rendered in the body
  totalCount,             // total items across pages
  isLoading,              // loading state for list fetches

  // Pagination
  currentPage,            // current page number
  rowsPerPage,           // items per page
  totalPages,            // total number of pages
  hasPreviousPage,       // boolean for pagination
  hasNextPage,           // boolean for pagination
  setCurrentPage,        // function to change page
  setRowsPerPage,       // function to change page size

  // Selection & Navigation
  selectedDetailRow,     // currently selected row for detail view
  openDetailDrawer,      // function to open detail drawer
  closeDetailDrawer,     // function to close detail drawer
  navigateToNextEntry,   // navigate to next row in detail view
  navigateToPreviousEntry, // navigate to previous row in detail view

  // Search & Filters
  searchTerm,            // current search term
  setSearchTerm,         // function to update search
  activeFilterCount,     // number of active filters

  // Actions
  handleRowClick,        // function to handle row clicks
  refetch,              // manually refetch the table

  // API
  api_endpoint,         // the API endpoint being used
} = useTable();`}
        />
      </Section>

      <Section title="Usage Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Custom Stats Bar</h3>
        <CodeBlock
          language="jsx"
          title="custom-stats.jsx"
          code={`// A custom component that shows table stats
const TableStatsBar = () => {
  const { totalCount, currentPage, totalPages, isLoading } = useTable();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
      <span className="text-sm font-medium">
        {totalCount} total records
      </span>
      <span className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

// Use inside CrudHandler
<CrudHandler
  api_endpoint="/api/users"
  customHeader={() => <TableStatsBar />}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Search with Filters</h3>
        <CodeBlock
          language="jsx"
          title="custom-search.jsx"
          code={`const AdvancedSearch = () => {
  const { searchTerm, setSearchTerm, activeFilterCount, refetch } = useTable();

  return (
    <div className="flex items-center gap-3 p-4">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="flex-1 px-3 py-2 border rounded-lg"
      />
      <span className="text-xs text-gray-500">
        {activeFilterCount} filters active
      </span>
      <button onClick={refetch} className="px-3 py-2 bg-blue-500 text-white rounded-lg">
        Refresh
      </button>
    </div>
  );
};

<CrudHandler
  api_endpoint="/api/users"
  customUtilities={() => <AdvancedSearch />}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Pagination</h3>
        <CodeBlock
          language="jsx"
          title="custom-pagination.jsx"
          code={`const SimplePagination = () => {
  const {
    currentPage, totalPages, setCurrentPage,
    hasPreviousPage, hasNextPage
  } = useTable();

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        disabled={!hasPreviousPage}
        onClick={() => setCurrentPage(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm">
        {currentPage} / {totalPages}
      </span>
      <button
        disabled={!hasNextPage}
        onClick={() => setCurrentPage(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

<CrudHandler
  api_endpoint="/api/users"
  customPagination={() => <SimplePagination />}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Detail View Navigation</h3>
        <CodeBlock
          language="jsx"
          title="detail-nav.jsx"
          code={`const DetailNavigator = () => {
  const {
    selectedDetailRow,
    navigateToNextEntry,
    navigateToPreviousEntry,
    closeDetailDrawer
  } = useTable();

  if (!selectedDetailRow) return null;

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <button onClick={navigateToPreviousEntry}>Previous</button>
      <span className="text-sm text-gray-500">
        Viewing: {selectedDetailRow.original?.name}
      </span>
      <button onClick={navigateToNextEntry}>Next</button>
      <button onClick={closeDetailDrawer} className="ml-auto">Close</button>
    </div>
  );
};`}
        />
      </Section>
    </DocPage>
  );
};

export default UseTableDocs;
