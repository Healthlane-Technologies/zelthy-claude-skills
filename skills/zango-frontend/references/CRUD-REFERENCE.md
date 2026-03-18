# CRUD Reference

Complete reference for CrudHandler, Table, hooks, styling, detail views, and sub-components.

---

## CrudHandler

The main orchestrator component. Provides a flexible, customizable table interface with built-in support for headers, utilities, body, pagination, and detail views.

### Import

```jsx
import { CrudHandler } from "@zango-core/crud/table";
```

### Quick Start

```jsx
<CrudHandler api_endpoint="/api/users" />
```

### Required Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **api_endpoint** * | `string` | — | The API endpoint to fetch table data from. Example: `/api/crud/` |

### Section Visibility Controls

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showHeader | `boolean` | `true` | Show or hide the header section. |
| showUtilities | `boolean` | `true` | Show or hide the utilities panel (search, filters, actions). |
| showBody | `boolean` | `true` | Show or hide the table body. |
| showPagination | `boolean` | `true` | Show or hide pagination controls. |

### Route Controls

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| enableDetailViewRoute | `boolean` | `false` | Enable `/detail-view/:object_uuid` route and "View Details" button. |

### Drawer Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| detailDrawerSize | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | Sets the size of the detail drawer panel. |

### Custom Component Overrides

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| customHeader | `ReactNode \| string` | — | Replace the default header. Can be a component or HTML string. |
| customUtilities | `ReactNode` | — | Replace the utilities/action bar section. |
| customTableBody | `ReactNode` | — | Replace the default table body. |
| customPagination | `ReactNode` | — | Replace the default pagination. |
| customDrawerDetail | `ReactNode` | — | Provide a custom drawer-style detail view. Automatically receives fetched detail data. |
| customMainDetail | `ReactNode` | — | Provide a custom main detail view for route-based navigation. |

### Additional Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tableId | `string` | — | Unique identifier for the table. Auto-generated from api_endpoint if not provided. |
| columns | `any[]` | — | Array of column definitions for client-side column configuration. |
| className | `string` | — | Custom CSS class for the main container. |
| style | `React.CSSProperties` | — | Custom inline styles for the main container. |
| customClass | `TableCustomClasses` | — | Object with CSS class overrides for table elements. |
| customStyle | `TableCustomStyles` | — | Object with dynamic style functions for table elements. |

### Header Configuration (headerProps)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| headerProps.showSearch | `boolean` | — | Show/hide search in header. |
| headerProps.showFilters | `boolean` | — | Show/hide filter controls. |
| headerProps.showActions | `boolean` | — | Show/hide action buttons. |
| headerProps.searchPlaceholder | `string` | — | Custom search placeholder text. |
| headerProps.title | `string` | — | Header title text. |
| headerProps.customLeftActions | `ReactNode` | — | Custom actions on the left side. |
| headerProps.customRightActions | `ReactNode` | — | Custom actions on the right side. |

### Permission Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| has_add_perm | `boolean` | `true` | Show/hide the "Add New" button in the header. |
| has_upload_perm | `boolean` | `false` | Show/hide the upload button in utilities. |
| has_download_perm | `boolean` | `true` | Show/hide the download button in utilities. |

### Utilities Configuration (Backend-driven)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| show_search | `boolean` | `true` | Show/hide search input in utilities bar. |
| show_filters_button | `boolean` | `true` | Show/hide filters toggle button. |
| show_column_options | `boolean` | `true` | Show/hide column visibility options. |

### Utilities Configuration (utilityProps)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| utilityProps.showSearch | `boolean` | `true` | Override: show/hide search input. |
| utilityProps.showUpload | `boolean` | `false` | Override: show/hide upload button. |
| utilityProps.showDownload | `boolean` | `true` | Override: show/hide download button. |
| utilityProps.showFiltersButton | `boolean` | `true` | Override: show/hide filters toggle button. |
| utilityProps.showColumnOptions | `boolean` | `true` | Override: show/hide column visibility options. |
| utilityProps.searchPlaceholder | `string` | — | Custom search placeholder text. |
| utilityProps.extraLeftActions | `ReactNode` | — | Additional actions on the left. |
| utilityProps.extraRightActions | `ReactNode` | — | Additional actions on the right. |

### Code Examples

```jsx
// Hide specific sections
<CrudHandler
  api_endpoint="/api/users"
  showHeader={false}
  showUtilities={false}
  showPagination={false}
/>
```

```jsx
// Replace entire sections with custom components
<CrudHandler
  api_endpoint="/api/products"
  customHeader={<MyCustomHeader />}
  customUtilities={<MyCustomUtilities />}
  customTableBody={<MyCustomBody />}
  customPagination={<MyCustomPagination />}
/>
```

```jsx
// Full configuration
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
/>
```

```jsx
// Custom detail views
<CrudHandler
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
/>
```

---

## Table Styling

Complete visual customization using CSS classes or dynamic style functions.

### Type Imports

```tsx
import type { TableCustomClasses, TableCustomStyles } from '@zango-core/crud/table';
```

### Customizable Elements (customClass)

**Container & Table:**
| Key | Description |
|-----|-------------|
| container | Main table container wrapper |
| tableWrapper | Table wrapper element |
| table | The actual table element |

**Header:**
| Key | Description |
|-----|-------------|
| headerRow | Header row container |
| headerCell | Individual header cells |
| headerCellPinned | Pinned header cells |
| sortButton | Sortable column buttons |
| sortIcon | Sort direction icons |

**Body:**
| Key | Description |
|-----|-------------|
| bodyRow | Data row containers |
| bodyRowSelected | Selected row state |
| bodyCell | Individual data cells |
| bodyCellPinned | Pinned data cells |

**Utilities:**
| Key | Description |
|-----|-------------|
| utilitiesContainer | Action bar container |
| filterButton | Filter toggle buttons |
| searchInput | Search input field |
| uploadButton | File upload button |
| downloadButton | Download/export button |

**Pagination:**
| Key | Description |
|-----|-------------|
| paginationContainer | Pagination wrapper |
| paginationButton | Page number buttons |
| paginationNavButton | Previous/next buttons |
| paginationInfo | Page info display |
| paginationEllipsis | Overflow indicators |

**Filters:**
| Key | Description |
|-----|-------------|
| filterSidebar | Filter panel container |
| filterHeader | Filter panel header |
| filterTitle | Filter title text |
| filterClearAll | Clear filters button |
| filterContent | Filter content area |
| filterAccordion | Filter accordion wrapper |

**Actions & Workflow:**
| Key | Description |
|-----|-------------|
| actionsContainer | Row actions wrapper |
| actionButton | Individual action buttons |
| actionMenuButton | Action menu trigger |
| actionDropdown | Action dropdown menu |
| actionDropdownItem | Action menu items |
| statusBadge | Status display badges |
| tagsContainer | Tags wrapper |
| workflowContainer | Workflow elements wrapper |
| workflowButton | Workflow action buttons |
| workflowDropdown | Workflow dropdown menu |

### State-Aware Styling (customStyle)

```tsx
// Row state properties
interface RowState {
  rowIndex: number;
  isSelected: boolean;
  isHovered: boolean;
  rowData: any;
}

// Header state properties
interface HeaderCellState {
  isPinned: boolean;
  canSort: boolean;
  columnId: string;
  pinnedOffset: number;
}

// Action state properties
interface ActionButtonState {
  action: any;
  isFirst: boolean;
  isInDropdown: boolean;
}
```

### Examples

```jsx
// Class-based overrides
<CrudHandler
  api_endpoint="/api/users"
  customClass={{
    headerCell: "bg-blue-100 text-blue-900 font-bold",
    bodyRow: "hover:bg-gray-50",
    filterButton: "border-blue-300 text-blue-600"
  }}
/>
```

```jsx
// Dynamic style functions
<CrudHandler
  api_endpoint="/api/users"
  customStyle={{
    bodyRow: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? '#fef3c7' : baseStyles.backgroundColor,
      borderLeft: state.rowIndex % 2 === 0 ? '4px solid #3b82f6' : 'none'
    }),
    headerCell: (baseStyles, state) => ({
      ...baseStyles,
      fontSize: state.columnId === 'name' ? '18px' : '14px',
      fontWeight: state.isPinned ? 'bold' : 'normal'
    })
  }}
/>
```

```jsx
// Data-driven row styling
<CrudHandler
  api_endpoint="/api/tasks"
  customStyle={{
    bodyRow: (baseStyles, state) => {
      const { rowData } = state;
      let backgroundColor = baseStyles.backgroundColor;
      if (rowData?.status === 'active') backgroundColor = '#f0fdf4';
      else if (rowData?.status === 'inactive') backgroundColor = '#fef2f2';
      else if (rowData?.priority === 'high') backgroundColor = '#fef3c7';
      return {
        ...baseStyles,
        backgroundColor: state.isSelected ? '#dbeafe' : backgroundColor
      };
    }
  }}
/>
```

> **Performance tip:** Use `customClass` for static styles, `customStyle` only for dynamic/state-aware styles.

---

## Detail Views

Drawer and route-based detail views with automatic data fetching.

### Data Props Provided to Custom Detail Components

| Prop | Type | Description |
|------|------|-------------|
| data | `object` | Complete detail response from the API. |
| api_endpoint | `string` | The API endpoint used to fetch the detail data. |
| loading | `boolean` | Whether the detail data is currently being fetched. |
| error | `string \| null` | Error message if the data fetch failed. |
| onRefresh | `function` | Callback to re-fetch the detail data. |
| objectUuid | `string` | The unique object UUID of the current record. |
| pk | `string \| number` | The primary key of the current record. |
| title | `string` | The display title for the detail view. |
| general_details | `object` | General details with a `fields` object. Each field: `{ name, display_name, type, value }`. |
| workflow_details | `object` | Workflow data: `current_status`, `current_status_meta`, `next_transitions`, `tag_details`. |
| sections | `array` | Array of section objects: `{ key, title, data, extra_html, form }`. |
| row_actions | `array` | Array of available row-level actions. |
| configurations | `object` | Additional configuration metadata. |

### Drawer Detail View

```jsx
const CustomDrawerDetail = ({ selectedRow, open, onClose, data, workflow_details, general_details, sections }) => {
  if (!open || !data) return null;
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold">{data.title || 'Detail View'}</h2>
        <button onClick={onClose}>&times;</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {general_details?.fields && (
          <div className="space-y-2">
            {Object.entries(general_details.fields).map(([key, field]) => (
              <div key={key} className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-500">{field.display_name}</span>
                <span className="text-sm font-medium">{field.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Usage
<CrudHandler api_endpoint="/api/users" customDrawerDetail={CustomDrawerDetail} />
```

### Route-Based Detail View

```jsx
const CustomMainDetail = ({ data, workflow_details, general_details, sections, onRefresh }) => {
  const navigate = useNavigate();
  if (!data) return null;
  return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={() => navigate(-1)}>&larr; Back to list</button>
      <h1 className="text-2xl font-bold mb-6">{data.title}</h1>
      {/* Render general_details, sections, workflow_details */}
    </div>
  );
};

// Usage — must set defaultDetailView="navigate" on TableBody
<CrudHandler
  api_endpoint="/api/users"
  customMainDetail={CustomMainDetail}
  customTableBody={<TableBody defaultDetailView="navigate" />}
/>
```

### DetailViewProvider & StandaloneDetailView

```jsx
import { DetailViewProvider, StandaloneDetailView } from "@zango-core/crud/table";

// Shared context for multiple components
<DetailViewProvider apiUrl="/api/users/?object_uuid=123">
  <WorkflowStatus />
  <WorkflowTags />
  <MyCustomComponent />  {/* Can call useDetailViewContext() */}
</DetailViewProvider>

// Or use the standalone component
<StandaloneDetailView apiUrl="/api/users/" objectUuid="550e8400-..." />
```

---

## TableBody

Main table data display component with virtualization and row interaction.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **table** * | `TanstackTable<any>` | — | TanStack table instance. |
| defaultDetailView | `RowClickAction \| RowClickConfig` | `'drawer'` | Row click behavior: `'drawer'`, `'navigate'`, `'custom'`, or config object. |
| selectedRow | `Row \| null` | — | Currently selected row. |
| drawerOpen | `boolean` | — | Whether the detail drawer is open. |
| isLoading | `boolean` | — | Loading state for initial data fetch. |
| isFetching | `boolean` | — | Loading state for subsequent fetches. |

```jsx
// Navigate with custom URL template
<TableBody defaultDetailView={{ action: "navigate", navigateUrlTemplate: "/users/{object_uuid}/profile" }} />

// Custom row click handler
<TableBody defaultDetailView={{ action: "custom", customHandler: (row) => console.log(row.original) }} />
```

---

## TableHeader

Page header component with title, count, and action buttons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string \| ReactNode` | — | Header title. |
| totalCount | `number` | — | Total number of items. |
| showCount | `boolean` | `true` | Show/hide total count badge. |
| showAddButton | `boolean` | — | Show/hide the add button. |
| addButtonTitle | `string \| ReactNode` | — | Custom add button text. |
| onAddClick | `function` | — | Custom click handler for the add button. |
| extraActions | `ReactNode` | — | Additional action elements. |
| children | `ReactNode` | — | Content between title and actions (filters, tabs). |
| enableDefaultAddForm | `boolean` | `true` | Enable/disable built-in form drawer. |

---

## TableUtilities

Action bar with search, filters, upload/download, and column options.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| searchTerm | `string` | — | Current search input value. |
| onSearchChange | `function` | — | Search change callback. |
| onUploadClick | `function` | — | Custom upload handler. |
| onDownloadClick | `function` | — | Custom download handler. |
| searchPlaceholder | `string` | `"Search"` | Search placeholder text. |
| showFiltersButton | `boolean` | `true` | Show/hide filter toggle. |
| showSearch | `boolean` | `true` | Show/hide search input. |
| showUpload | `boolean` | `true` | Show/hide upload button. |
| showDownload | `boolean` | `true` | Show/hide download button. |
| showColumnOptions | `boolean` | `true` | Show/hide column visibility toggle. |
| children | `ReactNode` | — | Custom content between left and right actions. |

---

## TablePagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showRowsPerPage | `boolean` | `true` | Show/hide rows-per-page selector. |
| rowsPerPageOptions | `number[]` | `[10, 20, 50, 100]` | Available page size options. |
| className | `string` | — | Custom CSS classes. |
| showPageInfo | `boolean` | `true` | Show/hide "Page X of Y" text. |

---

## TableSearch

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| placeholder | `string` | `"Search..."` | Placeholder text. |
| className | `string` | — | CSS classes for the input. |
| containerClassName | `string` | — | CSS classes for the container. |
| leftIcon | `ReactNode` | — | Custom left icon. |
| rightIcon | `ReactNode` | — | Custom right icon. |

---

## TableAddButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| buttonText | `string \| ReactNode` | — | Button label. |
| onClick | `function` | — | Custom click handler (disables built-in drawer). |
| variant | `string` | `"primary"` | Button style variant. |
| size | `string` | `"md"` | Button size. |
| className | `string` | — | Additional CSS classes. |
| showIcon | `boolean` | `false` | Show/hide icon. |
| icon | `ReactNode` | — | Custom icon element. |
| iconPosition | `'left' \| 'right'` | `"left"` | Icon position. |
| onFormSuccess | `function` | — | Callback after successful form submission. |
| drawerTitle | `string` | — | Custom drawer title. |
| drawerSize | `string` | `"md"` | Drawer panel size. |

---

## Render Props

Custom rendering for action, status, and tag columns.

### Actions Column

```jsx
<Table
  apiUrl="/api/orders"
  renderActions={({ actions, row, onActionClick, menuOpen, setMenuOpen }) => (
    <div className="flex items-center gap-1">
      {actions.map((action) => (
        <button key={action.name} onClick={() => onActionClick(action)}>
          {action.label}
        </button>
      ))}
    </div>
  )}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| actions | `any[]` | Array of action objects for the row. |
| row | `any` | Full row data. Access raw API data via `row.original`. |
| onActionClick | `(action) => void` | Trigger action execution pipeline. |
| menuOpen | `boolean` | Dropdown menu state. |
| setMenuOpen | `(open) => void` | Control dropdown visibility. |

### Status Column

```jsx
<Table
  apiUrl="/api/orders"
  renderStatus={({ value, statusValue, isObject, isString, isHtml }) => (
    <span className="badge">{statusValue}</span>
  )}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| value | `any` | Raw status value from API. |
| statusValue | `string` | Resolved display string. |
| isObject | `boolean` | True if value is `{ status_label, status_color }`. |
| isString | `boolean` | True if value is plain string. |
| isHtml | `boolean` | True if value contains HTML. |

### Tags Column

```jsx
<Table
  apiUrl="/api/products"
  renderTags={({ tags, visibleTags, remainingTags, hasMoreTags, maxVisible }) => (
    <div className="flex gap-1">
      {visibleTags.map((tag, i) => <span key={i} className="badge">{tag.label || tag}</span>)}
      {hasMoreTags && <span>+{remainingTags.length} more</span>}
    </div>
  )}
/>
```

---

## Hooks Reference (Table Hooks)

### useTable()

Access shared table context from any custom component within CrudHandler.

```tsx
const {
  data, totalCount, isLoading,                          // Data & State
  currentPage, rowsPerPage, totalPages,                 // Pagination
  hasPreviousPage, hasNextPage,
  setCurrentPage, setRowsPerPage,
  selectedDetailRow, openDetailDrawer,                  // Detail Navigation
  closeDetailDrawer, navigateToNextEntry, navigateToPreviousEntry,
  searchTerm, setSearchTerm, activeFilterCount,         // Search & Filters
  handleRowClick, refetch, api_endpoint,                // Actions & API
} = useTable();
```

### useTableData({ apiUrl, columns?, tableMetadata? })

Low-level hook for data fetching. Returns:
`flatData`, `totalDBRowCount`, `totalPages`, `isLoading`, `isFetching`, `error`, `searchTerm`, `setSearchTerm`, `filterObj`, `setFilterObj`, `currentPage`, `setCurrentPage`, `rowsPerPage`, `setRowsPerPage`, `sorting`, `setSorting`, `tableMetadata`, `columns`, `refetch`.

### useTableSearch()

`searchTerm`, `setSearchTerm`, `debouncedSearchTerm`.

### useTableFilters()

`filterObj`, `setFilterObj`, `activeFilterCount`, `clearFilters`, `hasActiveFilters`.

### useTablePagination()

`currentPage`, `totalPages`, `rowsPerPage`, `setCurrentPage`, `setRowsPerPage`, `hasPreviousPage`, `hasNextPage`, `goToFirstPage`, `goToLastPage`.

### useTableSelection()

`selectedRows`, `setSelectedRows`, `isAllSelected`, `toggleSelectAll`, `toggleSelectRow`, `clearSelection`.

### useTableColumns()

`visibleColumns`, `hiddenColumns`, `toggleColumnVisibility`, `showColumn`, `hideColumn`, `showAllColumns`, `hideAllColumns`, `isColumnVisible`, `moveColumn`, `pinColumnLeft`, `pinColumnRight`.

### useTableActions()

`refetch`, `exportTable`.

### useTableRowActions()

`handleRowClick`, `selectedDetailRow`, `openDetailDrawer`, `closeDetailDrawer`, `navigateToNextEntry`, `navigateToPreviousEntry`.

---

## API Response Formats

### Table Metadata (GET `?action=get_table_metadata`)

```json
{
  "success": true,
  "response": {
    "table_metadata": {
      "columns": [{ "name": "field", "display_name": "Field", "type": "string", "sortable": true, "filterable": true }],
      "filters": [{ "id": "field", "name": "Field", "type": "select", "options": [{ "value": "v", "label": "L" }] }],
      "page_title": "Page Title",
      "has_add_perm": true,
      "has_upload_perm": false,
      "has_download_perm": true,
      "utilities_config": { "show_search": true, "show_filters_button": true, "show_column_options": true },
      "form_config": { "drawer_size": "md", "show_confirm_alert": false },
      "actions": [{ "name": "Edit", "key": "edit", "type": "form" }]
    }
  }
}
```

### Table Data (GET `?action=get_table_data`)

```json
{
  "success": true,
  "response": {
    "table_data": [{ "id": 1, "object_uuid": "uuid", "field": "value", "workflow_status": { "status_label": "Active", "status_color": "#12B76A" }, "row_actions": [{ "name": "Edit", "key": "edit", "type": "form" }] }],
    "table_metadata": { "..." : "..." },
    "recordsTotal": 25,
    "recordsFiltered": 25
  }
}
```

### Detail View (GET `?action=fetch_item_details&object_uuid=UUID`)

```json
{
  "success": true,
  "response": {
    "pk": 1, "object_uuid": "uuid", "title": "Record Title",
    "general_details": { "fields": { "field_name": { "name": "field_name", "display_name": "Field", "type": "string", "value": "val" } } },
    "workflow_details": {
      "current_status": "active",
      "current_status_meta": { "status_label": "Active", "status_color": "#12B76A" },
      "next_transitions": [{ "name": "approve", "display_name": "Approve", "from": "active", "to": "approved", "is_form_based": false, "to_state_meta": { "status_label": "Approved", "status_color": "#12B76A" } }],
      "tag_details": [{ "name": "urgent", "state": "enabled", "tag_label": "Urgent", "enable": { "is_form_based": false }, "disable": { "is_form_based": false } }]
    },
    "row_actions": [{ "name": "Edit", "key": "edit", "type": "form" }],
    "sections": [{ "key": "overview", "title": "Overview", "data": {} }]
  }
}
```

## Column Types

- `string`, `integer`, `float`, `boolean`, `date`, `datetime`, `email`, `file`, `url`, `uuid`, `json`
- `StatusCol` - workflow status badge (data: `{ status_label, status_color }`)
- `TagsCol` - workflow tags
- `ActionsCol` - row action buttons (data: `[{ name, key, type: "form"|"simple", confirmation_message }]`)
- `WorkflowTransitionsCol` - available transitions

## Row Action Types

- `type: "form"` - opens form drawer
- `type: "simple"` - shows confirmation dialog (uses `confirmation_message` field)
