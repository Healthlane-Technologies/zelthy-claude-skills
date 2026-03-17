import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const CrudHandlerDocs = () => {
  return (
    <DocPage
      title="CrudHandler"
      subtitle="The main orchestrator component. Provides a flexible, customizable table interface with built-in support for headers, utilities, body, pagination, and detail views."
      badge="Core Component"
    >
      <Section title="Import">
        <CodeBlock
          language="jsx"
          title="import.jsx"
          code={`import { CrudHandler } from "@zango-core/crud/table";`}
        />
      </Section>

      <Section title="Quick Start">
        <p className="mb-4">
          At its simplest, <InlineCode>CrudHandler</InlineCode> only needs an API endpoint. Everything else has sensible defaults.
        </p>
        <CodeBlock
          language="jsx"
          title="minimal.jsx"
          code={`<CrudHandler api_endpoint="/api/users" />`}
        />
      </Section>

      <Section title="Required Props">
        <PropsTable
          props={[
            {
              name: 'api_endpoint',
              type: 'string',
              required: true,
              description: 'The API endpoint to fetch table data from. Example: /api/crud/',
            },
          ]}
        />
      </Section>

      <Section title="Section Visibility Controls">
        <p className="mb-4">Control which default sections are visible. All default to <InlineCode>true</InlineCode>.</p>
        <PropsTable
          props={[
            { name: 'showHeader', type: 'boolean', default: true, description: 'Show or hide the header section.' },
            { name: 'showUtilities', type: 'boolean', default: true, description: 'Show or hide the utilities panel (search, filters, actions).' },
            { name: 'showBody', type: 'boolean', default: true, description: 'Show or hide the table body.' },
            { name: 'showPagination', type: 'boolean', default: true, description: 'Show or hide pagination controls.' },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="hide-sections.jsx"
          code={`// Hide specific sections
<CrudHandler
  api_endpoint="/api/users"
  showHeader={false}
  showUtilities={false}
  showPagination={false}
/>`}
        />
      </Section>

      <Section title="Route Controls">
        <PropsTable
          props={[
            {
              name: 'enableDetailViewRoute',
              type: 'boolean',
              default: false,
              description: 'Enable /detail-view/:object_uuid route and "View Details" button. When true, a full-page detail view route is registered.',
            },
          ]}
        />
      </Section>

      <Section title="Drawer Configuration">
        <PropsTable
          props={[
            {
              name: 'detailDrawerSize',
              type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
              default: "'lg'",
              description: 'Sets the size of the detail drawer panel.',
            },
          ]}
        />
      </Section>

      <Section title="Custom Component Overrides">
        <p className="mb-4">Replace entire sections with your own React components.</p>
        <PropsTable
          props={[
            { name: 'customHeader', type: 'ReactNode | string', description: 'Replace the default header. Can be a component or HTML string.' },
            { name: 'customUtilities', type: 'ReactNode', description: 'Replace the utilities/action bar section.' },
            { name: 'customTableBody', type: 'ReactNode', description: 'Replace the default table body.' },
            { name: 'customPagination', type: 'ReactNode', description: 'Replace the default pagination.' },
            { name: 'customDrawerDetail', type: 'ReactNode', description: 'Provide a custom drawer-style detail view. Automatically receives fetched detail data.' },
            { name: 'customMainDetail', type: 'ReactNode', description: 'Provide a custom main detail view for route-based navigation. Automatically receives fetched detail data.' },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="custom-overrides.jsx"
          code={`// Replace entire sections with custom components
<CrudHandler
  api_endpoint="/api/products"
  customHeader={<MyCustomHeader />}
  customUtilities={<MyCustomUtilities />}
  customTableBody={<MyCustomBody />}
  customPagination={<MyCustomPagination />}
/>`}
        />
      </Section>

      <Section title="Additional Configuration">
        <PropsTable
          props={[
            { name: 'tableId', type: 'string', description: 'Unique identifier for the table, used for state management. Auto-generated from api_endpoint if not provided.' },
            { name: 'columns', type: 'any[]', description: 'Array of column definitions for client-side column configuration.' },
            { name: 'className', type: 'string', description: 'Custom CSS class for the main container.' },
            { name: 'style', type: 'React.CSSProperties', description: 'Custom inline styles for the main container.' },
            { name: 'customClass', type: 'TableCustomClasses', description: 'Object with CSS class overrides for table elements.' },
            { name: 'customStyle', type: 'TableCustomStyles', description: 'Object with dynamic style functions for table elements.' },
          ]}
        />
      </Section>

      <Section title="Header Configuration (headerProps)">
        <PropsTable
          props={[
            { name: 'headerProps.showSearch', type: 'boolean', description: 'Show/hide search in header.' },
            { name: 'headerProps.showFilters', type: 'boolean', description: 'Show/hide filter controls.' },
            { name: 'headerProps.showActions', type: 'boolean', description: 'Show/hide action buttons.' },
            { name: 'headerProps.searchPlaceholder', type: 'string', description: 'Custom search placeholder text.' },
            { name: 'headerProps.title', type: 'string', description: 'Header title text.' },
            { name: 'headerProps.customLeftActions', type: 'ReactNode', description: 'Custom actions on the left side.' },
            { name: 'headerProps.customRightActions', type: 'ReactNode', description: 'Custom actions on the right side.' },
          ]}
        />
      </Section>

      <Section title="Utilities Configuration">
        <Callout type="important" title="Backend-Driven Utility Controls">
          Utility visibility (search, filters, upload, download, column options) is primarily controlled by the
          backend API via <InlineCode>utilities_config</InlineCode> in the table metadata response.
          Props passed via <InlineCode>utilityProps</InlineCode> act as client-side overrides.
        </Callout>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Backend Metadata</h3>
        <p className="mb-4">
          The <InlineCode>{'?action=get_table_metadata'}</InlineCode> API response controls utility visibility
          via two mechanisms: <InlineCode>utilities_config</InlineCode> for the utilities bar, and
          top-level permission flags for add/upload/download.
        </p>

        <h4 className="text-sm font-semibold text-gray-700 mb-2 mt-6">Permissions (top-level metadata)</h4>
        <PropsTable
          props={[
            { name: 'has_add_perm', type: 'boolean', default: true, description: 'Show/hide the "Add New" button in the header.' },
            { name: 'has_upload_perm', type: 'boolean', default: false, description: 'Show/hide the upload button in utilities.' },
            { name: 'has_download_perm', type: 'boolean', default: true, description: 'Show/hide the download button in utilities.' },
          ]}
        />

        <h4 className="text-sm font-semibold text-gray-700 mb-2 mt-6">Utilities Bar (utilities_config)</h4>
        <PropsTable
          props={[
            { name: 'show_search', type: 'boolean', default: true, description: 'Show/hide search input in utilities bar.' },
            { name: 'show_filters_button', type: 'boolean', default: true, description: 'Show/hide filters toggle button.' },
            { name: 'show_column_options', type: 'boolean', default: true, description: 'Show/hide column visibility options.' },
          ]}
        />
        <CodeBlock
          language="json"
          title="metadata-response.json"
          code={`// GET /api/users/?action=get_table_metadata
{
  "response": {
    "table_metadata": {
      "columns": [...],
      "filters": [...],
      "has_add_perm": true,
      "has_upload_perm": false,
      "has_download_perm": true,
      "utilities_config": {
        "show_search": true,
        "show_filters_button": true,
        "show_column_options": true
      }
    }
  }
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Client-Side Overrides (utilityProps)</h3>
        <p className="mb-4">
          Props passed via <InlineCode>utilityProps</InlineCode> override the backend metadata values.
          Use these for client-side customization on top of what the backend defines.
        </p>
        <PropsTable
          props={[
            { name: 'utilityProps.showSearch', type: 'boolean', default: true, description: 'Override: show/hide search input.' },
            { name: 'utilityProps.showUpload', type: 'boolean', default: false, description: 'Override: show/hide upload button.' },
            { name: 'utilityProps.showDownload', type: 'boolean', default: true, description: 'Override: show/hide download button.' },
            { name: 'utilityProps.showFiltersButton', type: 'boolean', default: true, description: 'Override: show/hide filters toggle button.' },
            { name: 'utilityProps.showColumnOptions', type: 'boolean', default: true, description: 'Override: show/hide column visibility options.' },
            { name: 'utilityProps.searchPlaceholder', type: 'string', description: 'Custom search placeholder text.' },
            { name: 'utilityProps.extraLeftActions', type: 'ReactNode', description: 'Additional actions on the left.' },
            { name: 'utilityProps.extraRightActions', type: 'ReactNode', description: 'Additional actions on the right.' },
          ]}
        />
      </Section>

      <Section title="Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Enable Optional Features</h3>
        <CodeBlock
          language="jsx"
          title="optional-features.jsx"
          code={`<CrudHandler
  api_endpoint="/api/users"
  enableDetailViewRoute={true}
  utilityProps={{
    showUpload: true
  }}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Customize Default Components via Props</h3>
        <CodeBlock
          language="jsx"
          title="configured-defaults.jsx"
          code={`<CrudHandler
  api_endpoint="/api/crud"
  headerProps={{
    title: "User Management",
    showSearch: true,
    showFilters: true,
    showActions: true,
    searchPlaceholder: "Search users...",
    customLeftActions: <Button>Import</Button>,
    customRightActions: <Button>Export</Button>
  }}
  utilityProps={{
    showSearch: false,
    showUpload: true,
    showDownload: true,
    showFiltersButton: true,
    showColumnOptions: true,
    searchPlaceholder: "Quick search...",
    extraLeftActions: <Button>Bulk Actions</Button>,
    extraRightActions: <Button>Settings</Button>
  }}
  className="custom-table-wrapper"
  style={{ height: '600px' }}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Mix and Match</h3>
        <CodeBlock
          language="jsx"
          title="mix-and-match.jsx"
          code={`<CrudHandler
  api_endpoint="/api/orders"
  customHeader="Order Management"
  customUtilities={<MyAdvancedFilters />}
  headerProps={{
    showSearch: false,
    customRightActions: <RefreshButton />
  }}
  utilityProps={{
    showSearch: true,
    showColumnOptions: false
  }}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Detail Views</h3>
        <Callout type="tip" title="Automatic Data Fetching">
          Both drawer and main detail components automatically receive fetched detail data.
          You don't need to manually fetch using the API endpoint.
        </Callout>
        <CodeBlock
          language="jsx"
          title="custom-detail-views.jsx"
          code={`<CrudHandler
  api_endpoint="/api/users"
  customDrawerDetail={({ selectedRow, open, onClose, data, workflowDetails }) => (
    <UserDetailDrawer
      user={data}
      workflowDetails={workflowDetails}
      isOpen={open}
      onClose={onClose}
    />
  )}
  customMainDetail={({ data, workflowDetails, onRefresh }) => (
    <UserDetailPage
      userData={data}
      workflowDetails={workflowDetails}
      onRefresh={onRefresh}
    />
  )}
/>`}
        />
      </Section>
    </DocPage>
  );
};

export default CrudHandlerDocs;
