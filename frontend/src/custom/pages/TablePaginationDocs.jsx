import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const TablePaginationDocs = () => {
  return (
    <DocPage
      title="TablePagination"
      subtitle="Pagination controls with page navigation and rows-per-page selection."
      badge="Component"
    >
      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'showRowsPerPage',
              type: 'boolean',
              default: 'true',
              description: 'Show or hide the rows-per-page selector dropdown. Falls back to metadata pagination_config.show_rows_per_page when undefined.',
            },
            {
              name: 'rowsPerPageOptions',
              type: 'number[]',
              default: '10/20/50/100',
              description: 'Array of available page size options. Falls back to metadata pagination_config.rows_per_page_options when provided.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional CSS classes applied to the pagination container for custom styling.',
            },
            {
              name: 'showPageInfo',
              type: 'boolean',
              default: 'true',
              description: 'Show or hide the X-Y of N page info text. Falls back to metadata pagination_config.show_page_info when undefined.',
            },
            {
              name: 'compact',
              type: 'boolean',
              default: 'false',
              description: 'Use the compact mobile layout with a single prev/next control instead of the full page-number row.',
            },
          ]}
        />
        <Callout type="info" title="Auto-hidden in infinite scroll">
          When the table is in infinite-scroll mode, <InlineCode>TablePagination</InlineCode> renders
          nothing. It also hides when there is only one page and zero rows. In paged mode the
          component pulls state from the nearest <InlineCode>TableProvider</InlineCode> via
          <InlineCode>useTablePagination()</InlineCode>.
        </Callout>
      </Section>

      <Section title="useTablePagination() Hook">
        <p className="mb-4">
          The <InlineCode>useTablePagination()</InlineCode> hook exposes the same pagination state
          that <InlineCode>TablePagination</InlineCode> consumes, so you can build a fully custom
          pagination UI while staying in sync with the rest of the table.
        </p>
        <PropsTable
          props={[
            {
              name: 'currentPage',
              type: 'number',
              description: 'Current 1-based page index.',
            },
            {
              name: 'setCurrentPage',
              type: '(page: number) => void',
              description: 'Jump to a specific page number.',
            },
            {
              name: 'totalPages',
              type: 'number',
              description: 'Total number of pages derived from totalCount and rowsPerPage.',
            },
            {
              name: 'rowsPerPage',
              type: 'number',
              description: 'Current rows-per-page value.',
            },
            {
              name: 'setRowsPerPage',
              type: '(size: number) => void',
              description: 'Update the rows-per-page value. Resets to page 1 on change.',
            },
            {
              name: 'totalCount',
              type: 'number',
              description: 'Total row count across all pages.',
            },
            {
              name: 'canGoNext',
              type: 'boolean',
              description: 'True when currentPage is less than totalPages.',
            },
            {
              name: 'canGoPrevious',
              type: 'boolean',
              description: 'True when currentPage is greater than 1.',
            },
            {
              name: 'hasNextPage',
              type: 'boolean',
              description: 'Server-reported flag indicating a next page is available. Useful for infinite scroll.',
            },
            {
              name: 'hasPreviousPage',
              type: 'boolean',
              description: 'Server-reported flag indicating a previous page is available.',
            },
            {
              name: 'pageNumbers',
              type: 'number[]',
              description: 'Array of page numbers in a window around currentPage (delta of 2).',
            },
            {
              name: 'startRow',
              type: 'number',
              description: 'First row index on the current page (1-based).',
            },
            {
              name: 'endRow',
              type: 'number',
              description: 'Last row index on the current page, clamped to totalCount.',
            },
            {
              name: 'goToFirstPage',
              type: '() => void',
              description: 'Jump to page 1.',
            },
            {
              name: 'goToLastPage',
              type: '() => void',
              description: 'Jump to totalPages.',
            },
            {
              name: 'goToNextPage',
              type: '() => void',
              description: 'Advance one page if canGoNext is true.',
            },
            {
              name: 'goToPreviousPage',
              type: '() => void',
              description: 'Go back one page if canGoPrevious is true.',
            },
            {
              name: 'isInfiniteScroll',
              type: 'boolean',
              description: 'True when the table is running in infinite-scroll mode.',
            },
          ]}
        />
      </Section>

      <Section title="Usage Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Basic Usage</h3>
        <p className="mb-3">
          With no props, <InlineCode>TablePagination</InlineCode> renders with default page size
          options and full navigation controls.
        </p>
        <CodeBlock
          language="jsx"
          title="basic.jsx"
          code={`// Default pagination with all controls
<TablePagination />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Page Sizes</h3>
        <p className="mb-3">
          Provide a custom set of page size options and optionally hide the page info text.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-sizes.jsx"
          code={`<TablePagination
  rowsPerPageOptions={[5, 10, 25, 50]}
  showPageInfo={false}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Hide Rows Per Page</h3>
        <p className="mb-3">
          When you want a fixed page size without user control, hide the rows-per-page selector.
        </p>
        <CodeBlock
          language="jsx"
          title="hide-rows-per-page.jsx"
          code={`<TablePagination showRowsPerPage={false} />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Compact Mobile Layout</h3>
        <p className="mb-3">
          Use the compact layout for narrow screens where the full page-number row will not fit.
        </p>
        <CodeBlock
          language="jsx"
          title="compact.jsx"
          code={`<TablePagination compact showPageInfo={false} />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Pagination via Hook</h3>
        <p className="mb-3">
          Build your own pagination UI with <InlineCode>useTablePagination()</InlineCode>.
        </p>
        <CodeBlock
          language="tsx"
          title="custom-pagination.tsx"
          code={`import { useTablePagination } from '@zango-core/crud/table';

function CustomPagination() {
  const {
    currentPage,
    totalPages,
    canGoNext,
    canGoPrevious,
    goToNextPage,
    goToPreviousPage,
  } = useTablePagination();

  return (
    <div className="flex items-center gap-2">
      <button onClick={goToPreviousPage} disabled={!canGoPrevious}>Prev</button>
      <span>{currentPage} / {totalPages}</span>
      <button onClick={goToNextPage} disabled={!canGoNext}>Next</button>
    </div>
  );
}`}
        />
      </Section>
    </DocPage>
  );
};

export default TablePaginationDocs;
