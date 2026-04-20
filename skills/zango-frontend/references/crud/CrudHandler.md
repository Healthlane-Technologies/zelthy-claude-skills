# CrudHandler
Core Component

The main orchestrator component. Provides a flexible, customizable table interface with built-in support for headers, utilities, body, pagination, and detail views.

**Sections:** Import | Quick Start | Required Props | Section Visibility Controls | Route Controls | Scroll & Filter Layout | Drawer Configuration | Custom Component Overrides | Additional Configuration | Top-Level Utility Props | Render Props (Cell Customization) | Header Configuration (headerProps) | Utilities Configuration | Examples | Low-Level Primitives | Table | TableProvider | TableLayout | TableToolbar | TableContainer

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `api_endpoint` | string | - | The API endpoint to fetch table data from. Example: /api/crud/ |
| `showHeader` | boolean | true | Show or hide the header section. |
| `showUtilities` | boolean | true | Show or hide the utilities panel (search, filters, actions). |
| `showBody` | boolean | true | Show or hide the table body. |
| `showPagination` | boolean | true | Show or hide pagination controls. |
| `showAddButton` | boolean | - | Show or hide the "Add New" button. When undefined, falls back to backend metadata has_add_perm. |
| `enableDetailViewRoute` | boolean | false | Enable /detail-view/:object_uuid route and "View Details" button. When true, a full-page detail view route is registered. |
| `customHeader` | ReactNode | string | - | Replace the default header. Can be a component or HTML string. |
| `customUtilities` | ReactNode | - | Replace the utilities/action bar section. |
| `customTableBody` | ReactNode | - | Replace the default table body. |
| `customPagination` | ReactNode | - | Replace the default pagination. |
| `customDrawerDetail` | ReactNode | - | Provide a custom drawer-style detail view. Automatically receives fetched detail data. |
| `customMainDetail` | ReactNode | - | Provide a custom main detail view for route-based navigation. Automatically receives fetched detail data. |
| `tableId` | string | - | Unique identifier for the table, used for state management. Auto-generated from api_endpoint if not provided. |
| `columns` | any[] | - | Array of column definitions for client-side column configuration. |
| `className` | string | - | Custom CSS class for the main container. |
| `style` | React.CSSProperties | - | Custom inline styles for the main container. |
| `customClass` | TableCustomClasses | - | Object with CSS class overrides for table elements. |
| `customStyle` | TableCustomStyles | - | Object with dynamic style functions for table elements. |
| `formProps` | FormProps | - | Props forwarded to every FormRenderer instance rendered by this CrudHandler (add-button form and row-action forms). Useful for confirm sheet customization, field overrides, etc. |
| `showSearch` | boolean | - | Show/hide search input. Overrides utilities_config.show_search. |
| `showFiltersButton` | boolean | - | Show/hide filters toggle button. Overrides utilities_config.show_filters_button. |
| `showColumnOptions` | boolean | - | Show/hide column visibility options. Overrides utilities_config.show_column_options. |
| `showUpload` | boolean | - | Show/hide upload button. Overrides has_upload_perm. |
| `showDownload` | boolean | - | Show/hide download button. Overrides has_download_perm. |
| `searchPlaceholder` | string | - | Custom placeholder text for the search input. |
| `extraLeftActions` | ReactNode | - | Extra React nodes rendered on the left side of the utilities bar. |
| `extraRightActions` | ReactNode | - | Extra React nodes rendered on the right side of the utilities bar. |
| `renderActions` | (params) => ReactNode | - | Override the row actions menu. params: { actions, row, onActionClick, menuOpen, setMenuOpen }. |
| `renderStatus` | (params) => ReactNode | - | Override status cell rendering. params: { value, statusValue?: { status_label, status_color? }, isObject, isString, isHtml }. |
| `renderTags` | (params) => ReactNode | - | Override tag cell rendering. params: { tags, visibleTags, remainingTags, hasMoreTags, maxVisible }. |
| `renderWorkflowTransitions` | (params) => ReactNode | - | Override workflow transition buttons on each row. params: { transitions, visibleTransitions, dropdownTransitions, row, onTransitionClick, menuOpen, setMenuOpen }. |
| `headerProps.showSearch` | boolean | - | Show/hide search in header. |
| `headerProps.showFilters` | boolean | - | Show/hide filter controls. |
| `headerProps.showActions` | boolean | - | Show/hide action buttons. |
| `headerProps.searchPlaceholder` | string | - | Custom search placeholder text. |
| `headerProps.title` | string | - | Header title text. |
| `headerProps.customLeftActions` | ReactNode | - | Custom actions on the left side. |
| `headerProps.customRightActions` | ReactNode | - | Custom actions on the right side. |
| `has_add_perm` | boolean | true | Show/hide the "Add New" button in the header. |
| `has_upload_perm` | boolean | false | Show/hide the upload button in utilities. |
| `has_download_perm` | boolean | true | Show/hide the download button in utilities. |
| `show_search` | boolean | true | Show/hide search input in utilities bar. |
| `show_filters_button` | boolean | true | Show/hide filters toggle button. |
| `show_column_options` | boolean | true | Show/hide column visibility options. |
| `utilityProps.showSearch` | boolean | true | Override: show/hide search input. |
| `utilityProps.showUpload` | boolean | false | Override: show/hide upload button. |
| `utilityProps.showDownload` | boolean | true | Override: show/hide download button. |
| `utilityProps.showFiltersButton` | boolean | true | Override: show/hide filters toggle button. |
| `utilityProps.showColumnOptions` | boolean | true | Override: show/hide column visibility options. |
| `utilityProps.searchPlaceholder` | string | - | Custom search placeholder text. |
| `utilityProps.extraLeftActions` | ReactNode | - | Additional actions on the left. |
| `utilityProps.extraRightActions` | ReactNode | - | Additional actions on the right. |
| `utilityProps.filterIcon` | ReactNode | - | Replace the filter button icon. |
| `utilityProps.filterLabel` | string | - | Replace the filter button label text. |
| `utilityProps.filterBadgeClassName` | string | - | CSS class applied to the active-filter count badge. |
| `utilityProps.filterBadgeStyle` | React.CSSProperties | - | Inline style applied to the active-filter count badge. |
| `utilityProps.hideFilterIcon` | boolean | - | Hide the icon on the filter button while keeping the label. |
| `utilityProps.hideFilterBadge` | boolean | - | Hide the active-filter count badge on the filter button. |
| `utilityProps.downloadIcon` | ReactNode | - | Replace the download button icon. |
| `utilityProps.downloadLabel` | string | - | Replace the download button label text. |
| `utilityProps.hideDownloadIcon` | boolean | - | Hide the icon on the download button while keeping the label. |
| `apiUrl` | string | - | API endpoint used for data, filters, and mutations. |
| `tableMetadataObj` | TableMetadata | - | Pre-loaded table metadata (columns, features, pagination, scrollMode). Skips the metadata fetch step. |
| `onRowClick` | (row, event) => void | - | Custom handler invoked when a row is clicked. When provided, disables the default drawer behavior unless enableDefaultRowClick is true. |
| `enableDefaultRowClick` | boolean | - | Opt back into the built-in drawer behavior while still providing a custom onRowClick. Defaults to true when onRowClick is not supplied. |
| `renderActions` | (params) => ReactNode | - | Override the actions cell (same signature as CrudHandler.renderActions). |
| `renderStatus` | (params) => ReactNode | - | Override the status cell (same signature as CrudHandler.renderStatus). |
| `renderTags` | (params) => ReactNode | - | Override the tags cell (same signature as CrudHandler.renderTags). |
| `renderWorkflowTransitions` | (params) => ReactNode | - | Override workflow transition buttons per row. |
| `customClass` | TableCustomClasses | - | CSS class overrides for table elements. |
| `customStyle` | TableCustomStyles | - | Style function overrides for table elements. |
| `apiUrl` | string | - | API endpoint for table data. |
| `columns` | any[] | - | Optional explicit column definitions. When omitted, columns are derived from the API metadata. |
| `tableId` | string | - | Stable identifier used for persisted view state. Defaults to apiUrl. |
| `enableDetailViewRoute` | boolean | false | Enable detail view route and "View Details" UI for child components. |
| `renderActions` | (params) => ReactNode | - | Forwarded to every actions cell rendered under this provider. |
| `renderStatus` | (params) => ReactNode | - | Forwarded to every status cell rendered under this provider. |
| `renderTags` | (params) => ReactNode | - | Forwarded to every tags cell rendered under this provider. |
| `renderWorkflowTransitions` | (params) => ReactNode | - | Forwarded to every workflow-transitions cell rendered under this provider. |
| `customClass` | TableCustomClasses | - | CSS class overrides for elements rendered inside the provider. |
| `customStyle` | TableCustomStyles | - | Inline style function overrides for elements rendered inside the provider. |
| `formProps` | FormProps | - | Props forwarded to every FormRenderer rendered inside the provider (add button, row-action forms). |
| `children` | ReactNode | - | Components that should consume the table context. |
| `children` | ReactNode | - | Table content to render inside the layout shell. |
| `className` | string | default | Additional CSS classes applied on top of the variant classes. |
| `children` | ReactNode | - | Toolbar content (search, filter, buttons, etc.). |
| `className` | string | default | Additional CSS classes. |
| `children` | ReactNode | - | Content rendered when data is available (not loading, not empty, no error). |
| `className` | string | - | Additional CSS classes applied to the wrapper. |
| `loading` | boolean | - | Override the loading state. When omitted, uses TableProvider context. |
| `error` | string | null | - | Override the error state. When omitted, uses TableProvider context. |
| `empty` | boolean | - | Override the empty state. When omitted, uses TableProvider context. |
| `loadingComponent` | ReactNode | - | Replace the default loading indicator. |
| `errorComponent` | ReactNode | - | Replace the default error UI. |
| `emptyComponent` | ReactNode | - | Replace the default empty state UI. |

## Code Examples

### import.jsx
```jsx
import { CrudHandler } from "@zango-core/crud/table";
```

### minimal.jsx
```jsx
<CrudHandler api_endpoint="/api/users"
```

### hide-sections.jsx
```jsx
// Hide specific sections
<CrudHandler
  api_endpoint="/api/users"
  showHeader={false}
  showUtilities={false}
  showPagination={false}
```

### custom-overrides.jsx
```jsx
// Replace entire sections with custom components
<CrudHandler
  api_endpoint="/api/products"
  customHeader={<MyCustomHeader
```

### render-props.jsx
```jsx
<CrudHandler
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
```

### metadata-response.json
```json
// GET /api/users/?action=get_table_metadata
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
}
```

### optional-features.jsx
```jsx
<CrudHandler
  api_endpoint="/api/users"
  enableDetailViewRoute={true}
  utilityProps={{
    showUpload: true
  }}
```

### configured-defaults.jsx
```jsx
<CrudHandler
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
```

### mix-and-match.jsx
```jsx
<CrudHandler
  api_endpoint="/api/orders"
  customHeader="Order Management"
  customUtilities={<MyAdvancedFilters
```

### custom-detail-views.jsx
```jsx
<CrudHandler
  api_endpoint="/api/users"
  customDrawerDetail={({ selectedRow, open, onClose, data, workflowDetails }) => (
    <UserDetailDrawer
      user={data}
      workflowDetails={workflowDetails}
      isOpen={open}
      onClose={onClose}
```

### table.jsx
```jsx
import { Table } from "@zango-core/crud/table";

<Table
  apiUrl="/api/users"
  tableMetadataObj={metadata}
  onRowClick={(row, e) => openMyDetail(row.original)}
```

### table-provider.jsx
```jsx
import { TableProvider, useTableContext } from "@zango-core/crud/table";

const TableTitle = () => {
  const { totalCount } = useTableContext();
  return <h1>Users ({totalCount})</h1>;
};

<TableProvider apiUrl="/api/users">
  <TableTitle
```

### table-layout.jsx
```jsx
import { TableProvider, TableLayout, TableToolbar, TableContainer } from "@zango-core/crud/table";

<TableProvider apiUrl="/api/orders">
  <TableLayout variant="card">
    <TableToolbar>
      <TableSearch
```

### table-toolbar.jsx
```jsx
<TableToolbar variant="sticky" align="between">
  <TableSearch
```

### table-container.jsx
```jsx
<TableProvider apiUrl="/api/favorites">
  <TableContainer
    emptyComponent={
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No favorites yet</h3>
        <p className="text-gray-500">Star an item to see it here.</p>
      </div>
    }
  >
    <FavoritesGrid
```

