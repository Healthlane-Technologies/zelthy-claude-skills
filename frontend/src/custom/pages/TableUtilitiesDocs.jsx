import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const TableUtilitiesDocs = () => {
  return (
    <DocPage
      title="TableUtilities"
      category="crud"
      subtitle="Action bar with search, filters, upload/download, and column options."
      badge="Component"
    >
      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'searchTerm',
              type: 'string',
              description: 'Current search input value. Falls back to context searchTerm, then internal state.',
            },
            {
              name: 'onSearchChange',
              type: '(e: ChangeEvent) => void',
              description: 'Handler for search input change events. Falls back to context setSearchTerm.',
            },
            {
              name: 'hideControls',
              type: 'boolean',
              description: 'Controlled flag for whether filters panel is hidden. Falls back to context.',
            },
            {
              name: 'onToggleControls',
              type: '() => void',
              description: 'Handler invoked when the filters toggle button is clicked.',
            },
            {
              name: 'filterObj',
              type: 'Record<string, any>',
              description: 'Current filter values object. Drives the active filter count badge.',
            },
            {
              name: 'onClearFilters',
              type: '() => void',
              description: 'Handler invoked when the clear filters link is clicked.',
            },
            {
              name: 'onUploadClick',
              type: '() => void',
              description: 'Custom handler for the upload button. When omitted, opens the default UploadDialog if apiUrl is available.',
            },
            {
              name: 'onDownloadClick',
              type: '() => void',
              description: 'Custom handler for the download button. When omitted, triggers the default export flow against apiUrl.',
            },
            {
              name: 'table',
              type: 'Table<any>',
              description: 'TanStack Table instance used by the column options dropdown. Falls back to context table.',
            },
            {
              name: 'tableId',
              type: 'string',
              default: "''",
              description: 'Identifier used to persist column options state.',
            },
            {
              name: 'apiUrl',
              type: 'string',
              description: 'API base path used by the default upload and download flows.',
            },
            {
              name: 'searchPlaceholder',
              type: 'string',
              default: "'Search'",
              description: 'Placeholder for the search input. Falls back to metadata utilities_config.search_placeholder.',
            },
            {
              name: 'showFiltersButton',
              type: 'boolean',
              default: 'true',
              description: 'Show or hide the filters toggle button.',
            },
            {
              name: 'showSearch',
              type: 'boolean',
              default: 'true',
              description: 'Show or hide the search input. Also driven by metadata utilities_config.show_search.',
            },
            {
              name: 'showUpload',
              type: 'boolean',
              default: 'false',
              description: 'Show or hide the upload button. Metadata has_upload_perm overrides when present.',
            },
            {
              name: 'showDownload',
              type: 'boolean',
              default: 'true',
              description: 'Show or hide the download button. Metadata has_download_perm overrides when present.',
            },
            {
              name: 'showColumnOptions',
              type: 'boolean',
              default: 'true',
              description: 'Show or hide the column visibility dropdown. Also driven by metadata utilities_config.show_column_options.',
            },
            {
              name: 'extraLeftActions',
              type: 'ReactNode',
              description: 'Content appended to the left action cluster after the Filters button.',
            },
            {
              name: 'extraRightActions',
              type: 'ReactNode',
              description: 'Content appended to the right action cluster after the search input.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Extra classes applied to the inner flex row.',
            },
            {
              name: 'containerClassName',
              type: 'string',
              default: "''",
              description: 'Extra classes applied to the outer container wrapper.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Custom content rendered between the left and right action clusters. Useful for extra filter controls.',
            },
            {
              name: 'extraRightComponent',
              type: 'ReactNode',
              description: 'Optional component rendered alongside the right cluster. Placement controlled by extraRightPosition.',
            },
            {
              name: 'extraRightPosition',
              type: 'outside \| inside',
              default: 'outside',
              description: 'Where extraRightComponent renders relative to the right actions container.',
            },
          ]}
        />
      </Section>

      <Section title="Sub-Components">
        <p className="mb-4">
          Each right-side action is also exported as a standalone, context-aware control. Use these
          when you need finer layout control than the all-in-one <InlineCode>TableUtilities</InlineCode>{' '}
          offers.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">TableSearchField</h3>
        <PropsTable
          props={[
            {
              name: 'searchTerm',
              type: 'string',
              description: 'Controlled search value. Falls back to context searchTerm.',
            },
            {
              name: 'onSearchChange',
              type: '(e: ChangeEvent) => void',
              description: 'Handler for input change events. Falls back to context setSearchTerm.',
            },
            {
              name: 'placeholder',
              type: 'string',
              description: 'Placeholder text. Falls back to metadata utilities_config.search_placeholder, then Search.',
            },
            {
              name: 'inputSize',
              type: 'sm \| md \| lg',
              default: "'sm'",
              description: 'Size token applied to the underlying Input.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Extra classes for the outer wrapper.',
            },
            {
              name: 'style',
              type: 'CSSProperties',
              description: 'Inline styles applied to the outer wrapper.',
            },
            {
              name: 'containerClassName',
              type: 'string',
              default: "''",
              description: 'Extra classes merged onto the max-w-sm container.',
            },
            {
              name: 'showSearch',
              type: 'boolean',
              default: 'true',
              description: 'Hide the field entirely when false. Falls back to metadata utilities_config.show_search.',
            },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">TableFilterButton</h3>
        <PropsTable
          props={[
            {
              name: 'onFilterClick',
              type: '() => void',
              description: 'Handler for the button click. Falls back to context setFilterSidebarOpen toggle.',
            },
            {
              name: 'activeFilterCount',
              type: 'number',
              description: 'Active filter count used to render the badge. Falls back to context activeFilterCount.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Custom button content. Overrides the default label.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Extra classes merged onto the button.',
            },
            {
              name: 'style',
              type: 'CSSProperties',
              description: 'Inline styles applied to the button.',
            },
            {
              name: 'showFilter',
              type: 'boolean',
              default: 'true',
              description: 'Hide the button entirely when false.',
            },
            {
              name: 'size',
              type: 'sm \| md \| lg',
              default: "'sm'",
              description: 'Button size token.',
            },
            {
              name: 'variant',
              type: 'outline \| ghost \| secondary \| primary',
              default: "'outline'",
              description: 'Button variant token.',
            },
            {
              name: 'icon',
              type: 'ReactNode',
              description: 'Custom icon replacing the default filter icon.',
            },
            {
              name: 'label',
              type: 'string',
              description: 'Text label used when children is not provided.',
            },
            {
              name: 'iconPosition',
              type: 'left \| right',
              default: "'left'",
              description: 'Icon placement relative to the label.',
            },
            {
              name: 'badgeClassName',
              type: 'string',
              description: 'Custom class applied to the active filter count badge.',
            },
            {
              name: 'badgeStyle',
              type: 'CSSProperties',
              description: 'Inline styles applied to the active filter count badge.',
            },
            {
              name: 'hideIcon',
              type: 'boolean',
              default: 'false',
              description: 'Hide the icon slot entirely.',
            },
            {
              name: 'hideBadge',
              type: 'boolean',
              default: 'false',
              description: 'Hide the active filter count badge entirely.',
            },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">TableClearFiltersButton</h3>
        <PropsTable
          props={[
            {
              name: 'onClearFilters',
              type: '() => void',
              description: 'Handler for the clear click. Falls back to context clearAllFilters.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Custom button content. Overrides the default label.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Extra classes merged onto the button.',
            },
            {
              name: 'style',
              type: 'CSSProperties',
              description: 'Inline styles applied to the button.',
            },
            {
              name: 'showClearFilters',
              type: 'boolean',
              default: 'true',
              description: 'Hide the button when false.',
            },
            {
              name: 'size',
              type: 'sm \| md \| lg',
              default: "'sm'",
              description: 'Button size token.',
            },
            {
              name: 'variant',
              type: 'outline \| ghost \| secondary \| primary',
              default: "'ghost'",
              description: 'Button variant token.',
            },
            {
              name: 'activeFilterCount',
              type: 'number',
              description: 'When zero, the button renders nothing. Falls back to context activeFilterCount.',
            },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">TableColumnOptionsButton</h3>
        <PropsTable
          props={[
            {
              name: 'onColumnOptionsClick',
              type: '() => void',
              description: 'Handler for the click. Falls back to context setColumnSidebarOpen toggle.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Custom button content. Overrides the default Columns label.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Extra classes merged onto the button.',
            },
            {
              name: 'style',
              type: 'CSSProperties',
              description: 'Inline styles applied to the button.',
            },
            {
              name: 'showColumnOptions',
              type: 'boolean',
              default: 'true',
              description: 'Hide the button when false.',
            },
            {
              name: 'size',
              type: 'sm \| md \| lg',
              default: "'sm'",
              description: 'Button size token.',
            },
            {
              name: 'variant',
              type: 'outline \| ghost \| secondary \| primary',
              default: "'outline'",
              description: 'Button variant token.',
            },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">TableUploadButton</h3>
        <PropsTable
          props={[
            {
              name: 'onUploadClick',
              type: '() => void',
              description: 'Handler for the click. Falls back to context setUploadDrawerOpen.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Custom button content. Overrides the default Upload label.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Extra classes merged onto the button.',
            },
            {
              name: 'style',
              type: 'CSSProperties',
              description: 'Inline styles applied to the button.',
            },
            {
              name: 'showUpload',
              type: 'boolean',
              default: 'true',
              description: 'Hide the button when false.',
            },
            {
              name: 'size',
              type: 'sm \| md \| lg',
              default: "'sm'",
              description: 'Button size token.',
            },
            {
              name: 'variant',
              type: 'outline \| ghost \| secondary \| primary',
              default: "'outline'",
              description: 'Button variant token.',
            },
            {
              name: 'accept',
              type: 'string',
              description: 'File-input accept attribute. Only used when asFileInput is true.',
            },
            {
              name: 'multiple',
              type: 'boolean',
              default: 'false',
              description: 'Whether the file input accepts multiple files.',
            },
            {
              name: 'asFileInput',
              type: 'boolean',
              default: 'false',
              description: 'Render a hidden file input layered over the button so users pick a file directly.',
            },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">TableDownloadButton</h3>
        <PropsTable
          props={[
            {
              name: 'onDownloadClick',
              type: '() => void',
              description: 'Handler for the click. Falls back to context setDownloadDrawerOpen.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Custom button content. Overrides the default icon-only layout.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Extra classes merged onto the button.',
            },
            {
              name: 'style',
              type: 'CSSProperties',
              description: 'Inline styles applied to the button.',
            },
            {
              name: 'showDownload',
              type: 'boolean',
              default: 'true',
              description: 'Hide the button when false.',
            },
            {
              name: 'size',
              type: 'sm \| md \| lg',
              default: "'sm'",
              description: 'Button size token.',
            },
            {
              name: 'variant',
              type: 'outline \| ghost \| secondary \| primary',
              default: "'outline'",
              description: 'Button variant token.',
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description: 'Disables the button and swaps the icon for a spinner.',
            },
            {
              name: 'icon',
              type: 'ReactNode',
              description: 'Custom icon replacing the default download icon.',
            },
            {
              name: 'label',
              type: 'string',
              description: 'Optional label text shown next to the icon when children is not provided.',
            },
            {
              name: 'iconPosition',
              type: 'left \| right',
              default: "'left'",
              description: 'Icon placement relative to the label.',
            },
            {
              name: 'hideIcon',
              type: 'boolean',
              default: 'false',
              description: 'Hide the icon slot entirely.',
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
