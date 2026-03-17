import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const TableUtilitiesDocs = () => {
  return (
    <DocPage
      title="TableUtilities"
      subtitle="Action bar with search, filters, upload/download, and column options."
      badge="Component"
    >
      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'searchTerm',
              type: 'string',
              description: 'Current search input value. Use this for controlled search state.',
            },
            {
              name: 'onSearchChange',
              type: 'function',
              description: 'Callback invoked when the search input value changes. Receives the new search string as an argument.',
            },
            {
              name: 'onUploadClick',
              type: 'function',
              description: 'Custom handler for the upload button click. Overrides the default upload behavior.',
            },
            {
              name: 'onDownloadClick',
              type: 'function',
              description: 'Custom handler for the download button click. Overrides the default download behavior.',
            },
            {
              name: 'searchPlaceholder',
              type: 'string',
              default: '"Search"',
              description: 'Placeholder text for the search input field.',
            },
            {
              name: 'showFiltersButton',
              type: 'boolean',
              default: true,
              description: 'Show or hide the filter toggle button that opens the filters panel.',
            },
            {
              name: 'showSearch',
              type: 'boolean',
              default: true,
              description: 'Show or hide the search input field.',
            },
            {
              name: 'showUpload',
              type: 'boolean',
              default: true,
              description: 'Show or hide the upload button.',
            },
            {
              name: 'showDownload',
              type: 'boolean',
              default: true,
              description: 'Show or hide the download button.',
            },
            {
              name: 'showColumnOptions',
              type: 'boolean',
              default: true,
              description: 'Show or hide the column visibility toggle dropdown.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Custom content rendered between the left-side actions (search, filters) and right-side actions (upload, download, columns). Useful for dropdowns, date pickers, or custom filter controls.',
            },
          ]}
        />
      </Section>

      <Section title="Usage Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Basic Usage</h3>
        <p className="mb-3">
          With no props, <InlineCode>TableUtilities</InlineCode> renders all default controls
          (search, filters, download, and column options) using the table context.
        </p>
        <CodeBlock
          language="jsx"
          title="basic.jsx"
          code={`// All default controls visible
<TableUtilities />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Hide Features</h3>
        <p className="mb-3">
          Selectively hide controls that are not needed for your use case.
        </p>
        <CodeBlock
          language="jsx"
          title="hide-features.jsx"
          code={`// Hide upload and filters
<TableUtilities
  showUpload={false}
  showFiltersButton={false}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Handlers</h3>
        <p className="mb-3">
          Override the default upload and download behaviors with custom handlers.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-handlers.jsx"
          code={`<TableUtilities
  onUploadClick={() => {
    // Open a custom upload modal
    openUploadModal();
  }}
  onDownloadClick={() => {
    // Trigger a custom export
    exportToExcel(currentFilters);
  }}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">With Children</h3>
        <p className="mb-3">
          Add custom controls between the left and right action groups using{' '}
          <InlineCode>children</InlineCode>.
        </p>
        <CodeBlock
          language="jsx"
          title="with-children.jsx"
          code={`<TableUtilities searchPlaceholder="Search orders...">
  <Select
    options={statusOptions}
    placeholder="Filter by status"
    onChange={handleStatusFilter}
  />
  <DateRangePicker
    onRangeChange={handleDateRange}
  />
</TableUtilities>`}
        />
      </Section>
    </DocPage>
  );
};

export default TableUtilitiesDocs;
