import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const CrudHandlerDocs = () => {
  return (
    <DocPage
      title="CrudHandler"
      category="crud"
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
            { name: 'showAddButton', type: 'boolean', description: 'Show or hide the "Add New" button. When undefined, falls back to backend metadata has_add_perm.' },
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

      <Section title="Scroll & Filter Layout">
        <p className="mb-4">
          Override how the table paginates and how filters render. When omitted, CrudHandler falls back
          to the values provided by the backend table metadata.
        </p>
        <PropsTable
          props={[
            {
              name: 'scrollMode',
              type: "'pagination' | 'infinite'",
              description: 'Override scroll mode. When set, takes precedence over API metadata scrollMode. In infinite mode, pagination is hidden and rows load on scroll.',
            },
            {
              name: 'filterLayout',
              type: "'sidebar' | 'horizontal'",
              description: 'Override filter layout. Sidebar shows the filter panel on the left; horizontal shows an expandable filter bar above the table. Falls back to API metadata when omitted.',
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
            {
              name: 'defaultDetailView',
              type: "'drawer' | 'navigate' | 'custom' | 'none'",
              description: 'Default behavior when a row is clicked. Also populated from API metadata detail_config.default_view if not provided as a prop.',
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
            { name: 'formProps', type: 'FormProps', description: 'Props forwarded to every FormRenderer instance rendered by this CrudHandler (add-button form and row-action forms). Useful for confirm sheet customization, field overrides, etc.' },
          ]}
        />
      </Section>

      <Section title="Top-Level Utility Props">
        <p className="mb-4">
          In addition to nesting under <InlineCode>utilityProps</InlineCode>, several utility toggles are
          also exposed as top-level props so they can be bound directly to backend metadata. Top-level
          values take precedence over <InlineCode>utilityProps.*</InlineCode>, which in turn override the
          backend <InlineCode>utilities_config</InlineCode>.
        </p>
        <PropsTable
          props={[
            { name: 'showSearch', type: 'boolean', description: 'Show/hide search input. Overrides utilities_config.show_search.' },
            { name: 'showFiltersButton', type: 'boolean', description: 'Show/hide filters toggle button. Overrides utilities_config.show_filters_button.' },
            { name: 'showColumnOptions', type: 'boolean', description: 'Show/hide column visibility options. Overrides utilities_config.show_column_options.' },
            { name: 'showUpload', type: 'boolean', description: 'Show/hide upload button. Overrides has_upload_perm.' },
            { name: 'showDownload', type: 'boolean', description: 'Show/hide download button. Overrides has_download_perm.' },
            { name: 'searchPlaceholder', type: 'string', description: 'Custom placeholder text for the search input.' },
            { name: 'extraLeftActions', type: 'ReactNode', description: 'Extra React nodes rendered on the left side of the utilities bar.' },
            { name: 'extraRightActions', type: 'ReactNode', description: 'Extra React nodes rendered on the right side of the utilities bar.' },
          ]}
        />
      </Section>

      <Section title="Render Props (Cell Customization)">
        <p className="mb-4">
          Render props let you fully replace how certain built-in cells are rendered. Each render prop
          receives a params object describing the cell state and is expected to return a React node.
          Register them on CrudHandler; they are forwarded into TableProvider and applied to every
          matching cell.
        </p>
        <PropsTable
          props={[
            {
              name: 'renderActions',
              type: '(params) => ReactNode',
              description: 'Override the row actions menu. params: { actions, row, onActionClick, menuOpen, setMenuOpen }.',
            },
            {
              name: 'renderStatus',
              type: '(params) => ReactNode',
              description: 'Override status cell rendering. params: { value, statusValue?: { status_label, status_color? }, isObject, isString, isHtml }.',
            },
            {
              name: 'renderTags',
              type: '(params) => ReactNode',
              description: 'Override tag cell rendering. params: { tags, visibleTags, remainingTags, hasMoreTags, maxVisible }.',
            },
            {
              name: 'renderWorkflowTransitions',
              type: '(params) => ReactNode',
              description: 'Override workflow transition buttons on each row. params: { transitions, visibleTransitions, dropdownTransitions, row, onTransitionClick, menuOpen, setMenuOpen }.',
            },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="render-props.jsx"
          code={`<CrudHandler
  api_endpoint="/api/users"
  renderStatus={({ value, statusValue, isObject }) =>
    isObject ? (
      <Pill color={statusValue?.status_color}>{statusValue?.status_label}</Pill>
    ) : (
      <span>{value}</span>
    )
  }
  renderActions={({ actions, row, onActionClick }) => (
    <Menu>
      {actions.map((a) => (
        <Menu.Item key={a.key} onClick={() => onActionClick(a)}>
          {a.label}
        </Menu.Item>
      ))}
    </Menu>
  )}
/>`}
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
            { name: 'utilityProps.filterIcon', type: 'ReactNode', description: 'Replace the filter button icon.' },
            { name: 'utilityProps.filterLabel', type: 'string', description: 'Replace the filter button label text.' },
            { name: 'utilityProps.filterIconPosition', type: "'left' | 'right'", description: 'Position of the filter icon relative to the label.' },
            { name: 'utilityProps.filterBadgeClassName', type: 'string', description: 'CSS class applied to the active-filter count badge.' },
            { name: 'utilityProps.filterBadgeStyle', type: 'React.CSSProperties', description: 'Inline style applied to the active-filter count badge.' },
            { name: 'utilityProps.hideFilterIcon', type: 'boolean', description: 'Hide the icon on the filter button while keeping the label.' },
            { name: 'utilityProps.hideFilterBadge', type: 'boolean', description: 'Hide the active-filter count badge on the filter button.' },
            { name: 'utilityProps.downloadIcon', type: 'ReactNode', description: 'Replace the download button icon.' },
            { name: 'utilityProps.downloadLabel', type: 'string', description: 'Replace the download button label text.' },
            { name: 'utilityProps.downloadIconPosition', type: "'left' | 'right'", description: 'Position of the download icon relative to the label.' },
            { name: 'utilityProps.hideDownloadIcon', type: 'boolean', description: 'Hide the icon on the download button while keeping the label.' },
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

      <Section title="Low-Level Primitives">
        <p className="mb-4">
          <InlineCode>CrudHandler</InlineCode> is the recommended entry point for most apps. For fully
          custom layouts you can drop down to the primitives that CrudHandler is built on. They are all
          exported from <InlineCode>@zango-core/crud/table</InlineCode>.
        </p>
      </Section>

      <Section title="Table">
        <p className="mb-4">
          <InlineCode>Table</InlineCode> is a batteries-included table that takes a pre-fetched
          metadata object. Unlike <InlineCode>CrudHandler</InlineCode>, which owns routing and metadata
          loading, <InlineCode>Table</InlineCode> is a self-contained standalone view driven entirely by
          the metadata you pass in.
        </p>
        <PropsTable
          props={[
            { name: 'apiUrl', type: 'string', required: true, description: 'API endpoint used for data, filters, and mutations.' },
            { name: 'tableMetadataObj', type: 'TableMetadata', required: true, description: 'Pre-loaded table metadata (columns, features, pagination, scrollMode). Skips the metadata fetch step.' },
            { name: 'onRowClick', type: '(row, event) => void', description: 'Custom handler invoked when a row is clicked. When provided, disables the default drawer behavior unless enableDefaultRowClick is true.' },
            { name: 'enableDefaultRowClick', type: 'boolean', description: 'Opt back into the built-in drawer behavior while still providing a custom onRowClick. Defaults to true when onRowClick is not supplied.' },
            { name: 'renderActions', type: '(params) => ReactNode', description: 'Override the actions cell (same signature as CrudHandler.renderActions).' },
            { name: 'renderStatus', type: '(params) => ReactNode', description: 'Override the status cell (same signature as CrudHandler.renderStatus).' },
            { name: 'renderTags', type: '(params) => ReactNode', description: 'Override the tags cell (same signature as CrudHandler.renderTags).' },
            { name: 'renderWorkflowTransitions', type: '(params) => ReactNode', description: 'Override workflow transition buttons per row.' },
            { name: 'customClass', type: 'TableCustomClasses', description: 'CSS class overrides for table elements.' },
            { name: 'customStyle', type: 'TableCustomStyles', description: 'Style function overrides for table elements.' },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="table.jsx"
          code={`import { Table } from "@zango-core/crud/table";

<Table
  apiUrl="/api/users"
  tableMetadataObj={metadata}
  onRowClick={(row, e) => openMyDetail(row.original)}
/>`}
        />
      </Section>

      <Section title="TableProvider">
        <p className="mb-4">
          <InlineCode>TableProvider</InlineCode> is the context provider that holds all table state.
          Use it directly when composing a custom layout from hooks (<InlineCode>useTableContext</InlineCode>,
          <InlineCode>useTableSearch</InlineCode>, etc.) or when swapping in custom components that
          need access to the table state.
        </p>
        <PropsTable
          props={[
            { name: 'apiUrl', type: 'string', required: true, description: 'API endpoint for table data.' },
            { name: 'columns', type: 'any[]', description: 'Optional explicit column definitions. When omitted, columns are derived from the API metadata.' },
            { name: 'tableId', type: 'string', description: 'Stable identifier used for persisted view state. Defaults to apiUrl.' },
            { name: 'enableDetailViewRoute', type: 'boolean', default: false, description: 'Enable detail view route and "View Details" UI for child components.' },
            { name: 'scrollMode', type: "'pagination' | 'infinite'", description: 'Override scroll mode. Takes precedence over API metadata scrollMode.' },
            { name: 'filterLayout', type: "'sidebar' | 'horizontal'", description: 'Override filter layout. Takes precedence over API metadata filter_layout.' },
            { name: 'renderActions', type: '(params) => ReactNode', description: 'Forwarded to every actions cell rendered under this provider.' },
            { name: 'renderStatus', type: '(params) => ReactNode', description: 'Forwarded to every status cell rendered under this provider.' },
            { name: 'renderTags', type: '(params) => ReactNode', description: 'Forwarded to every tags cell rendered under this provider.' },
            { name: 'renderWorkflowTransitions', type: '(params) => ReactNode', description: 'Forwarded to every workflow-transitions cell rendered under this provider.' },
            { name: 'customClass', type: 'TableCustomClasses', description: 'CSS class overrides for elements rendered inside the provider.' },
            { name: 'customStyle', type: 'TableCustomStyles', description: 'Inline style function overrides for elements rendered inside the provider.' },
            { name: 'formProps', type: 'FormProps', description: 'Props forwarded to every FormRenderer rendered inside the provider (add button, row-action forms).' },
            { name: 'children', type: 'ReactNode', required: true, description: 'Components that should consume the table context.' },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="table-provider.jsx"
          code={`import { TableProvider, useTableContext } from "@zango-core/crud/table";

const TableTitle = () => {
  const { totalCount } = useTableContext();
  return <h1>Users ({totalCount})</h1>;
};

<TableProvider apiUrl="/api/users">
  <TableTitle />
  <MyCustomTableBody />
</TableProvider>`}
        />
      </Section>

      <Section title="TableLayout">
        <p className="mb-4">
          <InlineCode>TableLayout</InlineCode> is a layout wrapper that applies consistent spacing and
          background styles around the toolbar, body, and pagination.
        </p>
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', required: true, description: 'Table content to render inside the layout shell.' },
            { name: 'className', type: 'string', description: 'Additional CSS classes applied on top of the variant classes.' },
            { name: 'variant', type: "'default' | 'compact' | 'card' | 'full-width'", default: "'default'", description: 'Layout variant. default = standard white surface, compact = dashboard spacing, card = rounded gray card, full-width = stretched container.' },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="table-layout.jsx"
          code={`import { TableProvider, TableLayout, TableToolbar, TableContainer } from "@zango-core/crud/table";

<TableProvider apiUrl="/api/orders">
  <TableLayout variant="card">
    <TableToolbar>
      <TableSearch />
    </TableToolbar>
    <TableContainer>
      <MyOrderList />
    </TableContainer>
  </TableLayout>
</TableProvider>`}
        />
      </Section>

      <Section title="TableToolbar">
        <p className="mb-4">
          <InlineCode>TableToolbar</InlineCode> is a flex container for search, filters, and action
          buttons. Place it near the top of your custom layout.
        </p>
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', required: true, description: 'Toolbar content (search, filter, buttons, etc.).' },
            { name: 'className', type: 'string', description: 'Additional CSS classes.' },
            { name: 'variant', type: "'default' | 'sticky' | 'floating' | 'minimal'", default: "'default'", description: 'Visual variant. default = bordered bar, sticky = sticky with backdrop blur, floating = rounded card, minimal = transparent.' },
            { name: 'align', type: "'left' | 'right' | 'between' | 'center'", default: "'between'", description: 'Flex alignment for children.' },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="table-toolbar.jsx"
          code={`<TableToolbar variant="sticky" align="between">
  <TableSearch />
  <div className="flex gap-2">
    <Button>Export</Button>
    <Button variant="primary">Add</Button>
  </div>
</TableToolbar>`}
        />
      </Section>

      <Section title="TableContainer">
        <p className="mb-4">
          <InlineCode>TableContainer</InlineCode> is a smart wrapper that automatically renders
          loading, error, and empty states based on the current <InlineCode>TableProvider</InlineCode>
          context, or from explicit props when used outside a provider.
        </p>
        <PropsTable
          props={[
            { name: 'children', type: 'ReactNode', required: true, description: 'Content rendered when data is available (not loading, not empty, no error).' },
            { name: 'className', type: 'string', description: 'Additional CSS classes applied to the wrapper.' },
            { name: 'loading', type: 'boolean', description: 'Override the loading state. When omitted, uses TableProvider context.' },
            { name: 'error', type: 'string | null', description: 'Override the error state. When omitted, uses TableProvider context.' },
            { name: 'empty', type: 'boolean', description: 'Override the empty state. When omitted, uses TableProvider context.' },
            { name: 'loadingComponent', type: 'ReactNode', description: 'Replace the default loading indicator.' },
            { name: 'errorComponent', type: 'ReactNode', description: 'Replace the default error UI.' },
            { name: 'emptyComponent', type: 'ReactNode', description: 'Replace the default empty state UI.' },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="table-container.jsx"
          code={`<TableProvider apiUrl="/api/favorites">
  <TableContainer
    emptyComponent={
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No favorites yet</h3>
        <p className="text-gray-500">Star an item to see it here.</p>
      </div>
    }
  >
    <FavoritesGrid />
  </TableContainer>
</TableProvider>`}
        />
      </Section>
    </DocPage>
  );
};

export default CrudHandlerDocs;
