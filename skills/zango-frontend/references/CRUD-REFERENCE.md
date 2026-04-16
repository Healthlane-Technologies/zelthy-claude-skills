# Zango CRUD Reference

> Auto-generated from documentation pages. Regenerate with: `node scripts/generate-reference.js`

## Quick Import Reference
```js
// Main CRUD component + unified hook
import { CrudHandler, useTable, Table } from '@zango-core/crud/table';

// Context / provider
import { TableProvider, useTableContext, DetailViewProvider } from '@zango-core/crud/table';

// Specialized hooks
import {
  useTableSearch, useTableFilters, useTablePagination, useTableSelection,
  useTableColumns, useTableActions, useTableRowActions, useTableData,
  useDetailView, useDetailViewContext, useWorkflow,
} from '@zango-core/crud/table';

// Composable components
import {
  TableSearch, TablePagination, TableBody, TableDrawer,
  TableHeader, TableUtilities, TableAddButton, TableFilters,
} from '@zango-core/crud/table';

// Individual control buttons
import {
  TableSearchField, TableFilterButton, TableUploadButton, TableDownloadButton,
  TableColumnOptionsButton, TableClearFiltersButton,
} from '@zango-core/crud/table';

// Layout helpers
import { TableLayout, TableToolbar, TableContainer } from '@zango-core/crud/table';

// Cell components
import { ActionsCell, StatusCell, WorkflowTransitionsCell } from '@zango-core/crud/table';

// Workflow (standalone, context-aware)
import {
  WorkflowStatus, WorkflowTags, StandaloneDetailView, WorkflowFormRenderer,
  StatusBadge, StatusButton, TagSwitch,
} from '@zango-core/crud/table';

// Detail wrappers
import { DetailWrapper, DrawerDetailWrapper } from '@zango-core/crud/table';

// Types
import type {
  CrudHandlerProps, RowClickAction, RowClickConfig,
  UseTableProps, UseTableReturn, TableConfig,
  TableAddButtonProps, TableHeaderProps, TableUtilitiesProps,
  TableSearchFieldProps, TableFilterButtonProps, TableUploadButtonProps,
  TableDownloadButtonProps, TableColumnOptionsButtonProps, TableClearFiltersButtonProps,
  WorkflowDetails, Transition, TagDetail, DetailViewData,
  ConfirmationAlertProps, WorkflowStatusRenderTransitionsParams,
  WorkflowStatusProps, WorkflowTagsProps,
} from '@zango-core/crud/table';
```

## API Response Formats

### Table Metadata (GET ?action=get_table_metadata)
```json
{ "success": true, "response": { "table_metadata": { "pagination": 10, "scrollMode": "pagination", "page_title": "Title", "add_btn_title": "Add Record", "has_add_perm": true, "has_download_perm": true, "has_upload_perm": true, "show_header": true, "show_utilities": true, "show_body": true, "show_pagination": true, "show_count": true, "show_add_button": true, "enable_empty_state_create": true, "columns": [{ "name": "field", "display_name": "Field", "type": "string", "sortable": true, "searchable": true }], "filters": [], "utilities_config": { "show_search": true, "show_filters_button": true, "show_column_options": true }, "pagination_config": { "show_rows_per_page": true, "rows_per_page_options": [10, 25, 50, 100], "show_page_info": true }, "detail_config": { "enable_route": false, "default_view": "drawer", "drawer_size": "lg" }, "table_features_config": { "enable_column_pinning": true, "enable_sorting": true, "enable_hiding": true, "enable_column_ordering": true }, "form_config": { "show_confirm_alert": false, "show_icon": true } } } }
```

### Table Data (GET ?action=get_table_data)
```json
{ "success": true, "response": { "table_data": [{ "id": 1, "object_uuid": "uuid", "workflow_status": { "status_label": "Active", "status_color": "#12B76A" }, "row_actions": [{ "name": "Edit", "key": "edit", "type": "form" }] }], "recordsTotal": 25 } }
```

### Detail View (GET ?action=fetch_item_details&object_uuid=UUID)
```json
{ "success": true, "response": { "pk": 1, "object_uuid": "uuid", "title": "Title", "general_details": { "fields": { "name": { "display_name": "Name", "value": "val" } } }, "workflow_details": { "current_status": "active", "current_status_meta": { "status_label": "Active", "status_color": "#12B76A" }, "next_transitions": [{ "name": "approve", "display_name": "Approve", "is_form_based": false, "confirmation_message": "Approve this record?", "description": "Moves record to approved state", "from": "pending", "to": "approved" }], "tag_details": [{ "name": "urgent", "state": "enabled", "enable": { "is_form_based": false, "confirmation_message": "Enable urgent tag?" }, "disable": { "is_form_based": false, "confirmation_message": "Disable urgent tag?" }, "is_enable_allowed": true, "is_disable_allowed": true }] }, "sections": [{ "key": "overview", "title": "Overview", "data": {} }] } }
```

Note: `to_state_meta` only appears on audit-log / workflow-transaction entries, NOT on `next_transitions[]`.

## Column Types
- `string`, `number`, `date` - primitive column types
- `StatusCol` - data: `{ status_label, status_color }`
- `TagsCol` - workflow tags
- `ActionsCol` - row actions: `[{ name, key, type: "form"|"simple", confirmation_message }]`
- `WorkflowTransitionsCol` - available transitions
- `select` - choice-backed column with `choices: [{ id, label }]`

---


## CrudHandler (Core Component)

**Sections:** Import | Quick Start | Required Props | Section Visibility Controls | Route Controls | Scroll & Filter Layout | Drawer Configuration | Custom Component Overrides | Additional Configuration | Top-Level Utility Props | Render Props (Cell Customization) | Header Configuration (headerProps) | Utilities Configuration | Examples | Low-Level Primitives | Table | TableProvider | TableLayout | TableToolbar | TableContainer

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `api_endpoint` | string | - | The API endpoint to fetch table data from. Example: /api/crud/ |
| `showHeader` | boolean | true | Show or hide the header section. |
| `showUtilities` | boolean | true | Show or hide the utilities panel (search, filters, actions). |
| `showBody` | boolean | true | Show or hide the table body. |
| `showPagination` | boolean | true | Show or hide pagination controls. |
| `showAddButton` | boolean | - | Show or hide the  |
| `enableDetailViewRoute` | boolean | false | Enable /detail-view/:object_uuid route and  |
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
| `has_add_perm` | boolean | true | Show/hide the  |
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
| `enableDetailViewRoute` | boolean | false | Enable detail view route and  |
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

### Code Examples

```jsx
import { CrudHandler } from "@zango-core/crud/table";
```

```jsx
<CrudHandler api_endpoint="/api/users" />
```

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
/>
```

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

```jsx
<CrudHandler
  api_endpoint="/api/users"
  enableDetailViewRoute={true}
  utilityProps={{
    showUpload: true
  }}
/>
```

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
/>
```

```jsx
<CrudHandler
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
/>
```

```jsx
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

```jsx
import { Table } from "@zango-core/crud/table";

<Table
  apiUrl="/api/users"
  tableMetadataObj={metadata}
  onRowClick={(row, e) => openMyDetail(row.original)}
/>
```

```jsx
import { TableProvider, useTableContext } from "@zango-core/crud/table";

const TableTitle = () => {
  const { totalCount } = useTableContext();
  return <h1>Users ({totalCount})</h1>;
};

<TableProvider apiUrl="/api/users">
  <TableTitle />
  <MyCustomTableBody />
</TableProvider>
```

```jsx
import { TableProvider, TableLayout, TableToolbar, TableContainer } from "@zango-core/crud/table";

<TableProvider apiUrl="/api/orders">
  <TableLayout variant="card">
    <TableToolbar>
      <TableSearch />
    </TableToolbar>
    <TableContainer>
      <MyOrderList />
    </TableContainer>
  </TableLayout>
</TableProvider>
```

```jsx
<TableToolbar variant="sticky" align="between">
  <TableSearch />
  <div className="flex gap-2">
    <Button>Export</Button>
    <Button variant="primary">Add</Button>
  </div>
</TableToolbar>
```

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
    <FavoritesGrid />
  </TableContainer>
</TableProvider>
```

---

## Table Styling (Styling)

**Sections:** Overview | Basic Usage | Customizable Elements | State-Aware Styling | State Type Definitions | Theme Examples | Advanced Techniques | Best Practices

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `container` | string | - | Main table container wrapper |
| `tableWrapper` | string | - | Table wrapper element |
| `table` | string | - | The actual table element |
| `headerContainer` | string | - | Main header wrapper above the table grid |
| `headerTitle` | string | - | Header title text element |
| `headerTitleCount` | string | - | Count badge next to the header title |
| `headerActions` | string | - | Container for header action buttons |
| `headerAddButton` | string | - | Add-record button in the header |
| `headerRow` | string | - | Header row container |
| `headerCell` | string | - | Individual header cells |
| `headerCellPinned` | string | - | Pinned header cells |
| `sortButton` | string | - | Sortable column buttons |
| `sortIcon` | string | - | Sort direction icons |
| `bodyRow` | string | - | Data row containers |
| `bodyRowSelected` | string | - | Selected row state |
| `bodyRowHover` | string | - | Hovered row state |
| `bodyCell` | string | - | Individual data cells |
| `bodyCellPinned` | string | - | Pinned data cells |
| `loadingOverlay` | string | - | Full-table loading overlay |
| `loadingCell` | string | - | Per-cell loading indicator |
| `emptyStateRow` | string | - | Row shown when table has no data |
| `skeletonRow` | string | - | Skeleton placeholder row during initial load |
| `skeletonCell` | string | - | Skeleton placeholder cell |
| `skeletonBar` | string | - | Animated bar inside skeleton cell |
| `infiniteScrollLoader` | string | - | Loader shown during infinite scroll fetch |
| `utilitiesContainer` | string | - | Action bar container |
| `utilitiesLeft` | string | - | Left slot of the utilities bar |
| `utilitiesRight` | string | - | Right slot of the utilities bar |
| `filterButton` | string | - | Filter toggle buttons |
| `clearFiltersButton` | string | - | Button that clears all active filters |
| `columnOptionsButton` | string | - | Column visibility/options toggle button |
| `searchInput` | string | - | Search input field |
| `uploadButton` | string | - | File upload button |
| `downloadButton` | string | - | Download/export button |
| `paginationContainer` | string | - | Pagination wrapper |
| `paginationControls` | string | - | Controls group inside pagination bar |
| `paginationButton` | string | - | Page number buttons |
| `paginationNavButton` | string | - | Previous/next buttons |
| `paginationButtonDisabled` | string | - | Disabled state of pagination buttons |
| `paginationButtonActive` | string | - | Active/current page button |
| `paginationSelect` | string | - | Per-page size select dropdown |
| `paginationInfo` | string | - | Page info display |
| `paginationEllipsis` | string | - | Overflow indicators |
| `filterSidebar` | string | - | Filter panel container |
| `filterHeader` | string | - | Filter panel header |
| `filterTitle` | string | - | Filter title text |
| `filterClearAll` | string | - | Clear filters button |
| `filterContent` | string | - | Filter content area |
| `filterAccordion` | string | - | Filter accordion wrapper |
| `filterItem` | string | - | Individual filter item row |
| `filterBadge` | string | - | Badge showing active filter count on filter button |
| `actionsContainer` | string | - | Row actions wrapper |
| `actionButton` | string | - | Individual action buttons |
| `actionMenuButton` | string | - | Action menu trigger |
| `actionDropdown` | string | - | Action dropdown menu |
| `actionDropdownItem` | string | - | Action menu items |
| `statusBadge` | string | - | Status display badges |
| `statusIcon` | string | - | Icon inside a status badge |
| `tagsContainer` | string | - | Tags wrapper |
| `tag` | string | - | Individual tag chip |
| `tagMore` | string | - | Overflow indicator for hidden tags |
| `workflowContainer` | string | - | Workflow elements wrapper |
| `workflowButton` | string | - | Workflow action buttons |
| `workflowDropdown` | string | - | Workflow dropdown menu |
| `subItemContainer` | string | - | Wrapper for sub-item list inside a cell |
| `subItemText` | string | - | Text of a single sub-item |
| `subItemSeparator` | string | - | Separator between sub-items |
| `subItemShowMore` | string | - | Show-more toggle for collapsed sub-items |
| `subItemTooltip` | string | - | Tooltip shown over overflowing sub-items |

### Code Examples

```jsx
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
<CrudHandler
  api_endpoint="/api/users"
  customClass={{
    headerCell: "!bg-gray-800 !text-gray-200 !font-bold",
    bodyRow: "!bg-gray-900 hover:!bg-gray-800",
    filterButton: "!bg-gray-700 !text-gray-200"
  }}
/>
```

```jsx
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

```tsx
bodyRow: (baseStyles, state) => {
  // Available state properties:
  // - rowIndex: number
  // - isSelected: boolean
  // - isHovered: boolean
  // - rowData: object

  return {
    ...baseStyles,
    backgroundColor: state.isSelected ? '#fef3c7' :
                    state.rowIndex % 2 === 0 ? '#f9fafb' : '#ffffff'
  };
}
```

```tsx
headerCell: (baseStyles, state) => {
  // Available state properties:
  // - isPinned: boolean
  // - canSort: boolean
  // - columnId: string
  // - pinnedOffset: number

  return {
    ...baseStyles,
    fontWeight: state.canSort ? 'bold' : 'normal',
    borderRight: state.isPinned ? '2px solid #374151' : '1px solid #e5e7eb'
  };
}
```

```tsx
actionButton: (baseStyles, state) => {
  // Available state properties:
  // - action: object (action data)
  // - isFirst: boolean
  // - isInDropdown: boolean

  return {
    ...baseStyles,
    backgroundColor: state.action.type === 'danger' ? '#fef2f2' : baseStyles.backgroundColor
  };
}
```

```typescript
export interface ContainerState {
  hideControls: boolean;
}
```

```typescript
export interface HeaderContainerState {
  hasActions: boolean;
  totalCount: number;
}
```

```typescript
export interface HeaderTitleState {
  title: string | React.ReactNode;
  hasCount: boolean;
  totalCount: number;
}
```

```typescript
export interface HeaderActionsState {
  hasAddButton: boolean;
  hasExtraActions: boolean;
}
```

```typescript
export interface HeaderAddButtonState {
  isDisabled: boolean;
  title: string | React.ReactNode;
}
```

```typescript
export interface HeaderCellState {
  isPinned: boolean;
  canSort: boolean;
  columnId: string;
  pinnedOffset?: number;
}
```

```typescript
export interface SortButtonState {
  sortDirection: 'asc' | 'desc' | null;
  isHovered: boolean;
}
```

```typescript
export interface BodyRowState {
  isSelected: boolean;
  isHovered: boolean;
  rowIndex: number;
  rowData: any;
}
```

```typescript
export interface BodyCellState {
  isPinned: boolean;
  columnId: string;
  rowData: any;
  cellValue: any;
  pinnedOffset?: number;
}
```

```typescript
export interface UtilitiesState {
  activeFilterCount: number;
  hasSearch: boolean;
}
```

```typescript
export interface FilterButtonState {
  isActive: boolean;
  filterCount: number;
}
```

```typescript
export interface PaginationContainerState {
  compact: boolean;
  totalPages: number;
  currentPage: number;
}
```

```typescript
export interface PaginationInfoState {
  startRow: number;
  endRow: number;
  totalCount: number;
  hasData: boolean;
}
```

```typescript
export interface PaginationButtonState {
  isActive: boolean;
  isDisabled: boolean;
  pageNumber?: number;
}
```

```typescript
export interface FilterSidebarState {
  isVisible: boolean;
  activeFilterCount: number;
}
```

```typescript
export interface ActionsState {
  actionsCount: number;
  rowData: any;
}
```

```typescript
export interface ActionButtonState {
  action: any;
  isFirst: boolean;
  isInDropdown: boolean;
}
```

```typescript
export interface StatusBadgeState {
  status: string;
  statusColor?: string;
  isObject: boolean;
}
```

```typescript
export interface TagsState {
  tagsCount: number;
  visibleCount: number;
}
```

```typescript
export interface TagState {
  tag: string;
  index: number;
  isVisible: boolean;
}
```

```jsx
const professionalTheme = {
  customClass: {
    container: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    headerCell: 'bg-gray-50 text-gray-700 font-semibold border-b-2 border-gray-200',
    bodyRow: 'hover:bg-gray-25 border-b border-gray-100',
    utilitiesContainer: 'bg-gray-50 border-b border-gray-200',
    paginationContainer: 'bg-white border-t border-gray-200'
  },
  customStyle: {
    bodyRow: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: state.isSelected ? '#e0f2fe' : baseStyles.backgroundColor,
      borderLeft: state.isSelected ? '4px solid #0ea5e9' : 'none'
    })
  }
};

<CrudHandler api_endpoint="/api/users" {...professionalTheme} />
```

```jsx
const darkTheme = {
  customClass: {
    container: '!bg-gray-900',
    tableWrapper: '!bg-gray-800 !border-gray-700',
    headerCell: '!bg-gray-800 !text-gray-200 !border-gray-700 !font-semibold',
    bodyRow: '!bg-gray-900 hover:!bg-gray-800 !border-gray-700',
    bodyCell: '!text-gray-200 !border-gray-700',
    utilitiesContainer: '!bg-gray-800 !border-gray-700',
    filterButton: '!bg-gray-700 !text-gray-200 hover:!bg-gray-600',
    searchInput: '!bg-gray-700 !text-gray-200 !border-gray-600',
    paginationContainer: '!bg-gray-800 !border-gray-700',
    filterSidebar: '!bg-gray-800 !border-gray-700'
  },
  customStyle: {
    container: (baseStyles) => ({
      backgroundColor: '#111827',
      color: '#e5e7eb',
    }),
    bodyRow: (baseStyles, state) => ({
      backgroundColor: state.isSelected ? '#1e3a8a' : '#111827',
      borderColor: '#374151',
    }),
    bodyCell: (baseStyles) => ({
      color: '#e5e7eb',
      borderColor: '#374151',
      backgroundColor: 'transparent',
    })
  }
};

<CrudHandler api_endpoint="/api/users" {...darkTheme} />
```

```jsx
const dataStyles = {
  customStyle: {
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
  }
};

<CrudHandler api_endpoint="/api/tasks" {...dataStyles} />
```

```jsx
const backgroundStyles = {
  customClass: {
    container: 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50',
    tableWrapper: 'bg-white/80 backdrop-blur-sm shadow-xl rounded-lg',
    headerCell: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white'
  }
};
```

```jsx
const borderlessTheme = {
  customClass: {
    table: 'border-0',
    headerRow: 'border-0',
    headerCell: 'border-0 bg-gray-50 text-gray-700',
    bodyRow: 'border-0 hover:bg-gray-25',
    bodyCell: 'border-0 py-4',
    utilitiesContainer: 'border-0 bg-transparent',
    paginationContainer: 'border-0 bg-transparent'
  },
  customStyle: {
    bodyCell: (baseStyles, state) => ({
      ...baseStyles,
      border: 'none',
      borderBottom: state.rowIndex % 5 === 4 ? '1px solid #f3f4f6' : 'none'
    })
  }
};
```

```jsx
const animatedStyles = {
  customStyle: {
    bodyRow: (baseStyles, state) => ({
      ...baseStyles,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: state.isSelected ? 'translateX(4px)' : 'translateX(0)',
      boxShadow: state.isSelected
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        : 'none'
    }),
    headerCell: (baseStyles, state) => ({
      ...baseStyles,
      transition: 'all 0.2s ease-in-out',
      transform: state.canSort ? 'scale(1)' : 'scale(0.98)'
    })
  }
};
```

```jsx
import { useTheme } from './ThemeProvider';

function ThemedTable() {
  const theme = useTheme();

  const themedStyles = {
    customStyle: {
      headerCell: (baseStyles) => ({
        ...baseStyles,
        backgroundColor: theme.colors.primary,
        color: theme.colors.primaryText
      }),
      bodyRow: (baseStyles, state) => ({
        ...baseStyles,
        backgroundColor: state.isSelected
          ? theme.colors.selected
          : theme.colors.background
      })
    }
  };

  return <CrudHandler api_endpoint="/api/users" {...themedStyles} />;
}
```

```jsx
// Bad - creates new object every render
customStyle={{
  bodyRow: () => ({ backgroundColor: 'red' })
}}

// Good - use customClass for static styles
customClass={{
  bodyRow: 'bg-red-100'
}}
```

```tsx
import type { TableCustomClasses, TableCustomStyles } from '@zango-core/crud/table';

const customClass: TableCustomClasses = {
  headerCell: 'bg-blue-100 text-blue-900',
  bodyRow: 'hover:bg-gray-50'
};

const customStyle: TableCustomStyles = {
  bodyRow: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isSelected ? '#fef3c7' : baseStyles.backgroundColor
  })
};

<CrudHandler
  api_endpoint="/api/users"
  customClass={customClass}
  customStyle={customStyle}
/>
```

---

## useTable() (Hook)

**Sections:** Overview | Core Data | Search | Filters | Pagination | Selection | Detail Drawer | View State | Table Instance | Actions | UI Controls | Configuration | Full Signature

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | T[] | - | Items currently rendered in the table body. |
| `flatData` | T[] | - | Flat (non-grouped) view of all fetched rows. |
| `isLoading` | boolean | - | True while the initial fetch is in flight. |
| `isFetching` | boolean | - | True during background refetches. |
| `error` | Error \| null | - | Last fetch error, or null when healthy. |
| `totalCount` | number | - | Total row count across all pages. |
| `totalDBRowCount` | number | - | Raw DB row count before any client filter. |
| `metadata` | Record<string, unknown> \| null | - | Extra metadata from API response. |
| `rawResponse` | unknown | - | Unprocessed API response payload. |
| `rawTableData` | T[] | - | Rows before table transformations. |
| `isInfiniteScroll` | boolean | - | Whether infinite-scroll mode is active. |
| `searchTerm` | string | - | Live value of the search input. |
| `setSearchTerm` | (term: string) => void | - | Update the search term. |
| `debouncedSearchTerm` | string | - | Debounced value used in API calls. |
| `isSearchActive` | boolean | - | True when searchTerm is non-empty. |
| `filterObj` | Record<string, TableFilter> | - | Map of all active filter key/values. |
| `setFilterObj` | (filters: Record<string, TableFilter>) => void | - | Replace entire filter map. |
| `debouncedFilterObj` | Record<string, TableFilter> | - | Debounced filter map used in API calls. |
| `activeFilterCount` | number | - | Count of currently active filters. |
| `clearFilters` | () => void | - | Reset all filters to empty. |
| `setFilter` | (key: string, value: unknown) => void | - | Set a single filter by key. |
| `removeFilter` | (key: string) => void | - | Remove a single filter by key. |
| `hasFilter` | (key: string) => boolean | - | True when filter key has an active value. |
| `getFilter` | (key: string) => TableFilter \| undefined | - | Read one filter value by key. |
| `currentPage` | number | - | Current page number (1-based). |
| `setCurrentPage` | (page: number) => void | - | Jump to a specific page. |
| `totalPages` | number | - | Total number of pages. |
| `rowsPerPage` | number | - | Rows per page. |
| `setRowsPerPage` | (size: number) => void | - | Change page size. |
| `hasNextPage` | boolean | - | Whether a next page exists. |
| `hasPreviousPage` | boolean | - | Whether a previous page exists. |
| `canGoNext` | boolean | - | Derived: currentPage < totalPages. |
| `canGoPrevious` | boolean | - | Derived: currentPage > 1. |
| `pageNumbers` | number[] | - | Window of nearby page numbers for a page picker. |
| `goToFirstPage` | () => void | - | Navigate to page 1. |
| `goToLastPage` | () => void | - | Navigate to the last page. |
| `goToNextPage` | () => void | - | Advance one page. |
| `goToPreviousPage` | () => void | - | Go back one page. |
| `startRow` | number | - | First row index on current page (1-based). |
| `endRow` | number | - | Last row index on current page (clamped to totalCount). |
| `selectedRows` | T[] | - | Array of currently selected row objects. |
| `setSelectedRows` | (rows: T[]) => void | - | Replace entire selection. |
| `selectRow` | (row: Row<T>) => void | - | Select a single TanStack row. |
| `selectAll` | () => void | - | Select all rows on current page. |
| `clearSelection` | () => void | - | Deselect all rows. |
| `selectedCount` | number | - | Count of selected rows. |
| `isAllSelected` | boolean | - | True when all page rows are selected. |
| `isSomeSelected` | boolean | - | True when a partial selection exists. |
| `hasSelection` | boolean | - | True when at least one row is selected. |
| `selectedRowIds` | (string \| number)[] | - | IDs extracted from selectedRows. |
| `isRowSelected` | (row: Row<T>) => boolean | - | Check if a specific row is selected. |
| `toggleRows` | (rows: Row<T>[]) => void | - | Toggle selection for a set of rows. |
| `selectByIds` | (ids: (string \| number)[]) => void | - | Select rows matching given IDs. |
| `deselectByIds` | (ids: (string \| number)[]) => void | - | Deselect rows matching given IDs. |
| `getSelectedData` | () => T[] | - | Return currently selected rows. |
| `withSelectedRows` | (callback: (rows: T[]) => void) => void | - | Run callback only if selection is non-empty. |
| `selectedDetailObjectUuid` | string \| null | - | UUID of the row open in the detail drawer. |
| `setSelectedDetailObjectUuid` | (uuid: string \| null) => void | - | Open detail for a specific UUID. |
| `detailDrawerOpen` | boolean | - | True when the detail drawer is visible. |
| `setDetailDrawerOpen` | (open: boolean) => void | - | Programmatically show/hide the drawer. |
| `handleRowClick` | (row: Row<T>, event?: React.MouseEvent) => void | - | Default row-click handler (opens drawer). |
| `closeDetailDrawer` | () => void | - | Close the drawer and clear selection. |
| `navigateToNextEntry` | () => void | - | Advance to next row inside the drawer. |
| `navigateToPreviousEntry` | () => void | - | Go back to previous row inside the drawer. |
| `columnVisibility` | Record<string, boolean> | - | Map of columnId to visible flag. |
| `setColumnVisibility` | (visibility: Record<string, boolean>) => void | - | Replace entire visibility map. |
| `columnOrder` | string[] | - | Ordered list of column IDs. |
| `setColumnOrder` | (order: string[]) => void | - | Set column order array. |
| `columnPinning` | Record<string, { left?: string[]; right?: string[] }> | - | Pinned column IDs per side. |
| `setColumnPinning` | (pinning: Record<string, object>) => void | - | Update pinning config. |
| `sorting` | SortingState | - | Active TanStack sorting state. |
| `setSorting` | (sorting: SortingState) => void | - | Update sorting state. |
| `visibleColumns` | ColumnDef<T>[] | - | Subset of columns currently shown. |
| `hiddenColumns` | string[] | - | IDs of columns currently hidden. |
| `visibleColumnCount` | number | - | Count of visible columns. |
| `hiddenColumnCount` | number | - | Count of hidden columns. |
| `totalColumnCount` | number | - | Total columns (visible + hidden). |
| `toggleColumnVisibility` | (columnId: string) => void | - | Toggle one column on/off. |
| `showColumn` | (columnId: string) => void | - | Force one column visible. |
| `hideColumn` | (columnId: string) => void | - | Force one column hidden. |
| `showAllColumns` | () => void | - | Make all columns visible. |
| `hideAllColumns` | () => void | - | Hide all columns. |
| `isColumnVisible` | (columnId: string) => boolean | - | Check one column visibility. |
| `moveColumn` | (columnId: string, toIndex: number) => void | - | Reorder a column by index. |
| `pinColumnLeft` | (columnId: string) => void | - | Pin a column to the left. |
| `pinColumnRight` | (columnId: string) => void | - | Pin a column to the right. |
| `unpinColumn` | (columnId: string) => void | - | Remove a column from pinning. |
| `table` | TanstackTable<T> \| null | - | Raw TanStack Table instance (context mode only). |
| `columns` | ColumnDef<T>[] | - | Active column definition array. |
| `refresh` | () => void | - | Trigger a data refresh. |
| `refetch` | () => void | - | Alias for refresh (React Query style). |
| `invalidateCache` | () => void | - | Invalidate cached query data. |
| `isRefreshing` | boolean | - | True while a background refetch runs. |
| `canRefresh` | boolean | - | True when not loading or fetching. |
| `hasError` | boolean | - | True when error is non-null. |
| `exportData` | (format?: json \| csv \| xlsx) => void | - | Download current page data as a file. |
| `printData` | () => void | - | Open a print-friendly table window. |
| `performBulkAction` | (action: string, selectedRows?: T[]) => void | - | Execute a named bulk action on rows. |
| `resetTable` | () => void | - | Clear filters, selection, sort, go to page 1. |
| `getTableSummary` | () => TableSummary | - | Snapshot of current table metrics. |
| `handleUploadClick` | () => void | - | Open file picker and POST to upload_data. |
| `handleDownloadClick` | () => void | - | Download filtered data via download_data. |
| `hideControls` | boolean | - | True when the built-in toolbar is hidden. |
| `setHideControls` | (hide: boolean) => void | - | Show or hide the toolbar. |
| `apiUrl` | string | - | Resolved API endpoint for this table. |
| `tableId` | string | - | Unique ID scoping this table instance. |

### Code Examples

```tsx
const { data, isLoading, isFetching, error, totalCount } = useTable();

if (isLoading) return <Spinner />;
if (error) return <p>Error: {error.message}</p>;

return <p>{totalCount} records loaded ({data.length} visible)</p>;
```

```tsx
const { searchTerm, setSearchTerm, isSearchActive } = useTable();

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
);
```

```tsx
const { setFilter, removeFilter, activeFilterCount, clearFilters } = useTable();

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
);
```

```tsx
const {
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
);
```

```tsx
const { hasSelection, selectedCount, selectedRowIds, clearSelection } = useTable();

if (!hasSelection) return null;

return (
  <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded">
    <span className="text-sm font-medium">{selectedCount} selected</span>
    <button onClick={() => console.log(selectedRowIds)}>Export IDs</button>
    <button onClick={clearSelection}>Clear</button>
  </div>
);
```

```tsx
const {
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
);
```

```tsx
const {
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
);
```

```tsx
const { exportData, refetch, hasSelection, performBulkAction, resetTable } = useTable();

return (
  <div className="flex items-center gap-2">
    <button onClick={() => exportData('csv')}>Export CSV</button>
    {hasSelection && (
      <button onClick={() => performBulkAction('archive')}>Archive selected</button>
    )}
    <button onClick={refetch}>Refresh</button>
    <button onClick={resetTable}>Reset</button>
  </div>
);
```

```tsx
const {
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
} = useTable();
```

---

## Detail Views (Views)

**Sections:** Overview | Automatic Data Fetching | Data Props Provided | Drawer Detail View | Main Detail View (Route-based) | StandaloneDetailView | DetailViewProvider | DetailWrapper | DrawerDetailWrapper | TableDrawer | Detail Hooks

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | object | - | Complete detail response from the API, containing all fields and nested data for the record. |
| `api_endpoint` | string | - | The API endpoint used to fetch the detail data. |
| `loading` | boolean | - | Whether the detail data is currently being fetched. |
| `error` | string \| null | - | Error message if the data fetch failed, or null if successful. |
| `onRefresh` | function | - | Callback to re-fetch the detail data. Useful after performing mutations like status transitions or edits. |
| `objectUuid` | string | - | The unique object UUID of the current record. |
| `pk` | string \| number | - | The primary key of the current record. |
| `title` | string | - | The display title for the detail view, derived from the record data. |
| `general_details` | object | - | General details section. fields is an object keyed by field_name; each entry is { display_name, value } only. |
| `workflow_details` | object | - | Workflow data including current_status (string), current_status_meta ({ status_label, status_color }), next_transitions (array of { name, display_name, is_form_based, confirmation_message, description, from, to }), and tag_details (array of { name, state, enable, disable, is_enable_allowed, is_disable_allowed }). |
| `sections` | array | - | Array of section objects, each with key, name, title, data (object), optional extra_html, and optional form ({ is_multistep, form: { json_schema, ui_schema } }). |
| `row_actions` | array | - | Array of available row-level actions for the current record. |
| `configurations` | object | - | Additional configuration metadata for the detail view. |
| `apiUrl` | string | - | Full API URL already containing object_uuid, action, and view query params. Use for standalone pages. |
| `objectUuid` | string | - | Object UUID only. The component builds the full URL from baseApiUrl + objectUuid. |
| `baseApiUrl` | string | /api/crud | Base API URL used when objectUuid is provided. |
| `onClose` | () => void | - | Close handler forwarded to the detail component (used in drawer contexts). |
| `customComponent` | React.ComponentType | - | Custom component rendered instead of the default Detail. Receives all context data plus any extra props passed to StandaloneDetailView. |
| `apiUrl` | string | - | Full API URL containing object_uuid. Takes priority over objectUuid + baseApiUrl. |
| `objectUuid` | string | - | Object UUID. Combined with baseApiUrl to build the fetch URL when apiUrl is not provided. |
| `baseApiUrl` | string | /api/crud | Base API URL used to build the fetch URL. |
| `children` | React.ReactNode | - | Child components that will have access to the detail view context. |
| `apiUrl` | string | - | Base API URL. The component appends object_uuid from route params plus action and view query params. |
| `customComponent` | React.ComponentType | - | Custom detail component to render. Receives data, loading, error, workflowDetails, generalDetails, sections, rowActions, objectUuid, pk, onRefresh, and apiUrl as props. |
| `objectUuid` | string | - | UUID of the record to display. |
| `open` | boolean | - | Whether the drawer is visible. Renders null when false. |
| `onClose` | () => void | - | Callback to close the drawer. |
| `apiUrl` | string | - | Base API URL forwarded to StandaloneDetailView as baseApiUrl. |
| `selectedRow` | object | - | The full row data object. Forwarded to the custom component. |
| `customComponent` | React.ComponentType | - | Custom component to render inside the drawer instead of the default Detail. |
| `open` | boolean | - | Whether the drawer is visible. |
| `onClose` | () => void | - | Callback invoked when the drawer requests to be closed. |
| `selectedRow` | Row<any> \| null | - | The currently selected TanStack table row. Used to derive the default title when no title prop is provided. |
| `position` | right \| left \| bottom \| top | right | Side of the screen the drawer slides in from. |
| `size` | sm \| md \| lg \| xl \| full | lg | Width (for left/right) or height (for top/bottom) of the drawer (500px for left/right when lg). |
| `title` | React.ReactNode | - | Custom drawer title. Falls back to UIStore drawerTitle then to an auto-generated title from row data (name, title, email, id, object_uuid, pk). |
| `children` | React.ReactNode | - | Drawer content. When omitted the drawer renders a default key/value list from selectedRow.original. |
| `className` | string | - | Additional CSS classes merged onto the drawer container. |
| `apiUrl` | string | - | API URL available for the default content slot. Has no effect when children are provided. |
| `showNavigation` | boolean | - | Show next/previous row navigation arrows inside the drawer header. |
| `onNavigateNext` | () => void | - | Handler called when the user clicks the next-row arrow. |
| `onNavigatePrevious` | () => void | - | Handler called when the user clicks the previous-row arrow. |
| `canNavigateNext` | boolean | - | Whether a next row is available; disables the next arrow when false. |
| `canNavigatePrevious` | boolean | - | Whether a previous row is available; disables the previous arrow when false. |
| `useDetailView({ apiUrl })` | Hook | - | Fetches detail data for a specific record. Returns: data, loading, error, refresh, objectUuid, workflowDetails, rowActions. |
| `useDetailViewContext()` | Hook | - | Reads from the nearest DetailViewProvider context. Same return shape as useDetailView but from shared context. |

### Code Examples

```json
{
  "success": true,
  "response": {
    "object_uuid": "uuid-001",
    "pk": 1,
    "title": "Alice Johnson",
    "general_details": {
      "fields": {
        "name":       { "display_name": "Name",       "value": "Alice Johnson" },
        "email":      { "display_name": "Email",      "value": "alice@example.com" },
        "department": { "display_name": "Department", "value": "Engineering" }
      }
    },
    "workflow_details": {
      "current_status": "active",
      "current_status_meta": {
        "status_label": "Active",
        "status_color": "#22c55e"
      },
      "next_transitions": [
        {
          "name": "deactivate",
          "display_name": "Deactivate",
          "is_form_based": false,
          "confirmation_message": "Are you sure you want to deactivate this record?",
          "from": "active",
          "to": "inactive"
        },
        {
          "name": "suspend",
          "display_name": "Suspend",
          "is_form_based": true,
          "description": "Temporarily suspend this record",
          "from": "active",
          "to": "suspended"
        }
      ],
      "tag_details": [
        {
          "name": "priority",
          "state": "enabled",
          "enable":  { "is_form_based": false, "confirmation_message": "Enable priority tag?" },
          "disable": { "is_form_based": false, "confirmation_message": "Disable priority tag?" },
          "is_enable_allowed": true,
          "is_disable_allowed": true
        },
        {
          "name": "verified",
          "state": "disabled",
          "enable":  { "is_form_based": false, "confirmation_message": "Mark as verified?" },
          "disable": { "is_form_based": false },
          "is_enable_allowed": true,
          "is_disable_allowed": false
        }
      ]
    },
    "row_actions": [
      { "name": "Edit",   "key": "edit",   "icon": "edit",  "type": "form" },
      { "name": "Delete", "key": "delete", "icon": "trash", "type": "simple" }
    ],
    "sections": [
      {
        "key": "personal_info",
        "name": "personal_info",
        "title": "Personal Information",
        "data": { "name": "Alice Johnson", "email": "alice@example.com", "age": 28 }
      }
    ]
  }
}
```

```jsx
import React from 'react';

const CustomDrawerDetail = ({
  selectedRow,
  open,
  onClose,
  data,
  workflow_details,
  general_details,
  sections,
}) => {
  if (!open || !data) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold">{data.title || 'Detail View'}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* General Details — fields is an object keyed by field_name */}
        {general_details?.fields && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              General Information
            </h3>
            <div className="space-y-2">
              {Object.entries(general_details.fields).map(([key, field]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="text-sm text-gray-500">{field.display_name}</span>
                  <span className="text-sm font-medium">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflow Status */}
        {workflow_details && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Workflow
            </h3>
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: workflow_details.current_status_meta?.status_color || '#eff6ff',
                color: '#1d4ed8',
              }}
            >
              {workflow_details.current_status_meta?.status_label || workflow_details.current_status || 'N/A'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDrawerDetail;
```

```jsx
import CustomDrawerDetail from './CustomDrawerDetail';

<CrudHandler
  api_endpoint="/api/users"
  customDrawerDetail={CustomDrawerDetail}
/>
```

```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomMainDetail = ({
  data,
  workflow_details,
  general_details,
  sections,
  onRefresh,
}) => {
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        &larr; Back to list
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">
        {data.title || 'Record Detail'}
      </h1>

      {/* General Details — fields is an object keyed by field_name */}
      {general_details?.fields && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">General Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(general_details.fields).map(([key, field]) => (
              <div key={key}>
                <span className="text-sm text-gray-500 block">{field.display_name}</span>
                <span className="text-sm font-medium">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      {sections?.map((section) => (
        <div key={section.key} className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
          {section.data && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(section.data).map(([key, value]) => (
                <div key={key}>
                  <span className="text-sm text-gray-500 block">{key}</span>
                  <span className="text-sm font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
          {section.extra_html && (
            <div dangerouslySetInnerHTML={{ __html: section.extra_html }} />
          )}
        </div>
      ))}

      {/* Workflow Section */}
      {workflow_details && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Workflow</h2>
          <div>
            <p className="text-sm text-gray-500 mb-2">Current Status</p>
            <span
              className="inline-flex px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: workflow_details.current_status_meta?.status_color || '#eff6ff',
                color: '#1d4ed8',
              }}
            >
              {workflow_details.current_status_meta?.status_label || workflow_details.current_status}
            </span>
          </div>
          {workflow_details.next_transitions?.length > 0 && (
            <div className="flex gap-2 mt-4">
              {workflow_details.next_transitions.map((t) => (
                <span key={t.name} className="text-sm text-gray-600">
                  {t.display_name}: {t.from} &rarr; {t.to}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Refresh */}
      <button
        onClick={onRefresh}
        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Refresh Data
      </button>
    </div>
  );
};

export default CustomMainDetail;
```

```jsx
import CustomMainDetail from './CustomMainDetail';

<CrudHandler
  api_endpoint="/api/users"
  customMainDetail={CustomMainDetail}
  customTableBody={
    <TableBody defaultDetailView="navigate" />
  }
/>
```

```jsx
import { StandaloneDetailView } from "@zango-core/crud/table";

// Option 1: full URL
<StandaloneDetailView
  apiUrl="/api/users/?object_uuid=uuid-001&action=fetch_item_details&view=detail"
/>

// Option 2: UUID + base URL (component builds URL)
<StandaloneDetailView
  objectUuid="uuid-001"
  baseApiUrl="/api/users/"
/>

// Option 3: custom renderer
<StandaloneDetailView
  objectUuid="uuid-001"
  baseApiUrl="/api/users/"
  onClose={() => setOpen(false)}
  customComponent={MyDetailPanel}
/>
```

```jsx
import { DetailViewProvider, WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

// Wrap components for shared context
<DetailViewProvider
  objectUuid="uuid-001"
  baseApiUrl="/api/users/"
>
  <WorkflowStatus />    {/* reads context automatically */}
  <WorkflowTags />      {/* reads context automatically */}
  <MyCustomComponent /> {/* can call useDetailViewContext() */}
</DetailViewProvider>
```

```jsx
import { DetailWrapper } from "@zango-core/crud/table";

// Used internally by CrudHandler — direct usage only needed in advanced setups
<DetailWrapper
  apiUrl="/api/users/"
  customComponent={MyDetailPage}
/>
```

```jsx
import { DrawerDetailWrapper } from "@zango-core/crud/table";

// Used internally by CrudHandler — direct usage only needed in advanced setups
<DrawerDetailWrapper
  objectUuid={selectedRow?.object_uuid}
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  apiUrl="/api/users/"
  selectedRow={selectedRow}
  customComponent={MyDrawerDetail}
/>
```

```jsx
import { TableDrawer } from "@zango-core/crud/table";
import { useTableRowActions } from "@zango-core/crud/table";

const MyTable = () => {
  const { selectedRow, drawerOpen, closeDrawer, navigateNext, navigatePrevious, canNavigateNext, canNavigatePrevious } = useTableRowActions();

  return (
    <>
      {/* … your table … */}

      {/* Right drawer (default) */}
      <TableDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        selectedRow={selectedRow}
      >
        <MyDetailPanel row={selectedRow?.original} />
      </TableDrawer>

      {/* Bottom drawer for mobile with navigation */}
      <TableDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        selectedRow={selectedRow}
        position="bottom"
        size="lg"
        showNavigation
        onNavigateNext={navigateNext}
        onNavigatePrevious={navigatePrevious}
        canNavigateNext={canNavigateNext}
        canNavigatePrevious={canNavigatePrevious}
      >
        <MobileDetailView row={selectedRow?.original} />
      </TableDrawer>
    </>
  );
};
```

```jsx
import { useDetailView, useDetailViewContext } from "@zango-core/crud/table";

// Standalone - fetches its own data
const { data, loading, workflowDetails } = useDetailView({
  apiUrl: "/api/users/?object_uuid=123"
});

// Context-based - reads from DetailViewProvider
const { data, refreshDetail } = useDetailViewContext();
```

---

## TableBody (Component)

**Sections:** Props | Row Click Behaviors | Infinite Scroll Setup

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `table` | TanstackTable<any> | - | TanStack table instance that provides row models, column definitions, and table state. |
| `defaultDetailView` | RowClickAction | RowClickConfig | drawer | Row click behavior configuration. Can be a string ( |
| `selectedRow` | Row | null | - | Currently selected row object. Used to highlight the active row in the table. |
| `drawerOpen` | boolean | - | Whether the detail drawer is currently open. Controls visual state of selected row. |
| `isLoading` | boolean | - | Loading state for initial data fetch. Displays skeleton placeholders when true. |
| `isFetching` | boolean | - | Loading state for subsequent data updates (e.g., pagination, filtering). Shows a subtle loading indicator without replacing content. |
| `isInfiniteScroll` | boolean | false | Enables infinite-scroll mode. Removes the top border separator and shows a spinner row at the bottom while fetching more pages. |
| `onScroll` | (e: React.UIEvent<HTMLDivElement>) => void | - | Scroll event handler on the table container div. In infinite-scroll mode the context wires this to fetchMoreOnBottomReached automatically; pass a custom handler to override. |
| `hideControls` | boolean | false | Hides the table control bar (search, filters, pagination) when true. Applied via ContainerState styling to the outer wrapper. |
| `enableEmptyStateCreate` | boolean | false | Shows a Create button inside the empty-state overlay. Requires the table context apiUrl and metadata.show_add_button to be truthy; opens a FormRenderer drawer on click. |

### Code Examples

```jsx
// Default behavior - opens a detail drawer on row click
<TableBody />
```

```jsx
// Navigate to detail page on row click
<TableBody defaultDetailView="navigate" />
```

```jsx
// Navigate with a custom URL template
<TableBody
  defaultDetailView={{
    action: "navigate",
    navigateUrlTemplate: "/users/{object_uuid}/profile"
  }}
/>
```

```jsx
// Custom row click handler
<TableBody
  defaultDetailView={{
    action: "custom",
    customHandler: (row) => console.log(row.original)
  }}
/>
```

```jsx
const handleScroll = (e) => {
  const target = e.target;
  const nearBottom =
    target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
  if (nearBottom && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }
};

<TableBody
  isInfiniteScroll={true}
  onScroll={handleScroll}
  isFetching={isFetchingNextPage}
/>
```

---

## TableHeader (Component)

**Sections:** Props | Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | ReactNode | - | Header title text or custom React element. Supports plain strings or JSX for rich formatting. |
| `totalCount` | number | - | Total number of items in the dataset. Displayed as a badge next to the title. |
| `showCount` | boolean | true | Show or hide the total count badge next to the title. |
| `showAddButton` | boolean | - | Show or hide the add/create button in the header actions area. |
| `addButtonTitle` | string | ReactNode | - | Custom text or element for the add button. Defaults to a standard  |
| `onAddClick` | function | - | Custom click handler for the add button. Overrides the default behavior of opening the built-in form drawer. |
| `extraActions` | ReactNode | - | Additional action elements rendered alongside the default add button. Useful for export, import, or bulk action buttons. |
| `children` | ReactNode | - | Content rendered between the title area and the action buttons. Commonly used for filters, status tabs, or date range selectors. |
| `apiUrl` | string | - | API URL for the default add form drawer. When omitted, falls back to the URL from TableProvider context. |
| `enableDefaultAddForm` | boolean | true | Enable or disable the built-in form drawer that opens when the add button is clicked. Set to false when using a custom add flow. |
| `className` | string | - | Extra CSS classes applied to the inner flex row (title + actions). Default empty string. |
| `containerClassName` | string | - | Extra CSS classes applied to the outermost container div. Default empty string. |
| `titleClassName` | string | - | Extra CSS classes applied to the h1 title element. Default empty string. |
| `buttonClassName` | string | - | Extra CSS classes applied to the add button element. Default empty string. |

### Code Examples

```jsx
// Uses defaults from table context
<TableHeader />
```

```jsx
<TableHeader
  title="Products"
  totalCount={142}
  showAddButton={true}
  addButtonTitle="New Product"
  extraActions={
    <>
      <button className="btn-secondary">Export CSV</button>
      <button className="btn-secondary">Import</button>
    </>
  }
/>
```

```jsx
<TableHeader
  title={
    <div className="flex items-center gap-2">
      <span className="text-xl font-bold">Orders</span>
      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
    </div>
  }
  onAddClick={() => {
    // Custom logic instead of default form
    openCustomOrderModal();
  }}
/>
```

```jsx
<TableHeader title="Inventory" totalCount={856}>
  <StatusFilter
    options={['All', 'In Stock', 'Low Stock', 'Out of Stock']}
    onChange={handleStatusChange}
  />
  <DateRangeFilter
    onRangeChange={handleDateChange}
  />
</TableHeader>
```

```jsx
<TableHeader
  enableDefaultAddForm={false}
  onAddClick={() => router.push('/products/new')}
/>
```

---

## TableUtilities (Component)

**Sections:** Props | Sub-Components | Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchTerm` | string | - | Current search input value. Falls back to context searchTerm, then internal state. |
| `onSearchChange` | (e: ChangeEvent) => void | - | Handler for search input change events. Falls back to context setSearchTerm. |
| `hideControls` | boolean | - | Controlled flag for whether filters panel is hidden. Falls back to context. |
| `onToggleControls` | () => void | - | Handler invoked when the filters toggle button is clicked. |
| `filterObj` | Record<string, any> | - | Current filter values object. Drives the active filter count badge. |
| `onClearFilters` | () => void | - | Handler invoked when the clear filters link is clicked. |
| `onUploadClick` | () => void | - | Custom handler for the upload button. When omitted, opens the default UploadDialog if apiUrl is available. |
| `onDownloadClick` | () => void | - | Custom handler for the download button. When omitted, triggers the default export flow against apiUrl. |
| `table` | Table<any> | - | TanStack Table instance used by the column options dropdown. Falls back to context table. |
| `tableId` | string | - | Identifier used to persist column options state. |
| `apiUrl` | string | - | API base path used by the default upload and download flows. |
| `searchPlaceholder` | string | Search | Placeholder for the search input. Falls back to metadata utilities_config.search_placeholder. |
| `showFiltersButton` | boolean | true | Show or hide the filters toggle button. |
| `showSearch` | boolean | true | Show or hide the search input. Also driven by metadata utilities_config.show_search. |
| `showUpload` | boolean | false | Show or hide the upload button. Metadata has_upload_perm overrides when present. |
| `showDownload` | boolean | true | Show or hide the download button. Metadata has_download_perm overrides when present. |
| `showColumnOptions` | boolean | true | Show or hide the column visibility dropdown. Also driven by metadata utilities_config.show_column_options. |
| `extraLeftActions` | ReactNode | - | Content appended to the left action cluster after the Filters button. |
| `extraRightActions` | ReactNode | - | Content appended to the right action cluster after the search input. |
| `className` | string | - | Extra classes applied to the inner flex row. |
| `containerClassName` | string | - | Extra classes applied to the outer container wrapper. |
| `children` | ReactNode | - | Custom content rendered between the left and right action clusters. Useful for extra filter controls. |
| `extraRightComponent` | ReactNode | - | Optional component rendered alongside the right cluster. Placement controlled by extraRightPosition. |
| `extraRightPosition` | outside \| inside | outside | Where extraRightComponent renders relative to the right actions container. |
| `searchTerm` | string | - | Controlled search value. Falls back to context searchTerm. |
| `onSearchChange` | (e: ChangeEvent) => void | - | Handler for input change events. Falls back to context setSearchTerm. |
| `placeholder` | string | - | Placeholder text. Falls back to metadata utilities_config.search_placeholder, then Search. |
| `inputSize` | sm \| md \| lg | sm | Size token applied to the underlying Input. |
| `className` | string | - | Extra classes for the outer wrapper. |
| `style` | CSSProperties | - | Inline styles applied to the outer wrapper. |
| `containerClassName` | string | - | Extra classes merged onto the max-w-sm container. |
| `showSearch` | boolean | true | Hide the field entirely when false. Falls back to metadata utilities_config.show_search. |
| `onFilterClick` | () => void | - | Handler for the button click. Falls back to context setFilterSidebarOpen toggle. |
| `activeFilterCount` | number | - | Active filter count used to render the badge. Falls back to context activeFilterCount. |
| `children` | ReactNode | - | Custom button content. Overrides the default label. |
| `className` | string | - | Extra classes merged onto the button. |
| `style` | CSSProperties | - | Inline styles applied to the button. |
| `showFilter` | boolean | true | Hide the button entirely when false. |
| `size` | sm \| md \| lg | sm | Button size token. |
| `variant` | outline \| ghost \| secondary \| primary | outline | Button variant token. |
| `icon` | ReactNode | - | Custom icon replacing the default filter icon. |
| `label` | string | - | Text label used when children is not provided. |
| `iconPosition` | left \| right | left | Icon placement relative to the label. |
| `badgeClassName` | string | - | Custom class applied to the active filter count badge. |
| `badgeStyle` | CSSProperties | - | Inline styles applied to the active filter count badge. |
| `hideIcon` | boolean | false | Hide the icon slot entirely. |
| `hideBadge` | boolean | false | Hide the active filter count badge entirely. |
| `onClearFilters` | () => void | - | Handler for the clear click. Falls back to context clearAllFilters. |
| `children` | ReactNode | - | Custom button content. Overrides the default label. |
| `className` | string | - | Extra classes merged onto the button. |
| `style` | CSSProperties | - | Inline styles applied to the button. |
| `showClearFilters` | boolean | true | Hide the button when false. |
| `size` | sm \| md \| lg | sm | Button size token. |
| `variant` | outline \| ghost \| secondary \| primary | ghost | Button variant token. |
| `activeFilterCount` | number | - | When zero, the button renders nothing. Falls back to context activeFilterCount. |
| `onColumnOptionsClick` | () => void | - | Handler for the click. Falls back to context setColumnSidebarOpen toggle. |
| `children` | ReactNode | - | Custom button content. Overrides the default Columns label. |
| `className` | string | - | Extra classes merged onto the button. |
| `style` | CSSProperties | - | Inline styles applied to the button. |
| `showColumnOptions` | boolean | true | Hide the button when false. |
| `size` | sm \| md \| lg | sm | Button size token. |
| `variant` | outline \| ghost \| secondary \| primary | outline | Button variant token. |
| `onUploadClick` | () => void | - | Handler for the click. Falls back to context setUploadDrawerOpen. |
| `children` | ReactNode | - | Custom button content. Overrides the default Upload label. |
| `className` | string | - | Extra classes merged onto the button. |
| `style` | CSSProperties | - | Inline styles applied to the button. |
| `showUpload` | boolean | true | Hide the button when false. |
| `size` | sm \| md \| lg | sm | Button size token. |
| `variant` | outline \| ghost \| secondary \| primary | outline | Button variant token. |
| `accept` | string | - | File-input accept attribute. Only used when asFileInput is true. |
| `multiple` | boolean | false | Whether the file input accepts multiple files. |
| `asFileInput` | boolean | false | Render a hidden file input layered over the button so users pick a file directly. |
| `onDownloadClick` | () => void | - | Handler for the click. Falls back to context setDownloadDrawerOpen. |
| `children` | ReactNode | - | Custom button content. Overrides the default icon-only layout. |
| `className` | string | - | Extra classes merged onto the button. |
| `style` | CSSProperties | - | Inline styles applied to the button. |
| `showDownload` | boolean | true | Hide the button when false. |
| `size` | sm \| md \| lg | sm | Button size token. |
| `variant` | outline \| ghost \| secondary \| primary | outline | Button variant token. |
| `loading` | boolean | false | Disables the button and swaps the icon for a spinner. |
| `icon` | ReactNode | - | Custom icon replacing the default download icon. |
| `label` | string | - | Optional label text shown next to the icon when children is not provided. |
| `iconPosition` | left \| right | left | Icon placement relative to the label. |
| `hideIcon` | boolean | false | Hide the icon slot entirely. |

### Code Examples

```jsx
// All default controls visible
<TableUtilities />
```

```jsx
// Hide upload and filters
<TableUtilities
  showUpload={false}
  showFiltersButton={false}
/>
```

```jsx
<TableUtilities
  onUploadClick={() => {
    // Open a custom upload modal
    openUploadModal();
  }}
  onDownloadClick={() => {
    // Trigger a custom export
    exportToExcel(currentFilters);
  }}
/>
```

```jsx
<TableUtilities searchPlaceholder="Search orders...">
  <Select
    options={statusOptions}
    placeholder="Filter by status"
    onChange={handleStatusFilter}
  />
  <DateRangePicker
    onRangeChange={handleDateRange}
  />
</TableUtilities>
```

---

## TablePagination (Component)

**Sections:** Props | useTablePagination() Hook | Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showRowsPerPage` | boolean | true | Show or hide the rows-per-page selector dropdown. Falls back to metadata pagination_config.show_rows_per_page when undefined. |
| `rowsPerPageOptions` | number[] | 10/20/50/100 | Array of available page size options. Falls back to metadata pagination_config.rows_per_page_options when provided. |
| `className` | string | - | Additional CSS classes applied to the pagination container for custom styling. |
| `showPageInfo` | boolean | true | Show or hide the X-Y of N page info text. Falls back to metadata pagination_config.show_page_info when undefined. |
| `compact` | boolean | false | Use the compact mobile layout with a single prev/next control instead of the full page-number row. |
| `currentPage` | number | - | Current 1-based page index. |
| `setCurrentPage` | (page: number) => void | - | Jump to a specific page number. |
| `totalPages` | number | - | Total number of pages derived from totalCount and rowsPerPage. |
| `rowsPerPage` | number | - | Current rows-per-page value. |
| `setRowsPerPage` | (size: number) => void | - | Update the rows-per-page value. Resets to page 1 on change. |
| `totalCount` | number | - | Total row count across all pages. |
| `canGoNext` | boolean | - | True when currentPage is less than totalPages. |
| `canGoPrevious` | boolean | - | True when currentPage is greater than 1. |
| `hasNextPage` | boolean | - | Server-reported flag indicating a next page is available. Useful for infinite scroll. |
| `hasPreviousPage` | boolean | - | Server-reported flag indicating a previous page is available. |
| `pageNumbers` | number[] | - | Array of page numbers in a window around currentPage (delta of 2). |
| `startRow` | number | - | First row index on the current page (1-based). |
| `endRow` | number | - | Last row index on the current page, clamped to totalCount. |
| `goToFirstPage` | () => void | - | Jump to page 1. |
| `goToLastPage` | () => void | - | Jump to totalPages. |
| `goToNextPage` | () => void | - | Advance one page if canGoNext is true. |
| `goToPreviousPage` | () => void | - | Go back one page if canGoPrevious is true. |
| `isInfiniteScroll` | boolean | - | True when the table is running in infinite-scroll mode. |

### Code Examples

```jsx
// Default pagination with all controls
<TablePagination />
```

```jsx
<TablePagination
  rowsPerPageOptions={[5, 10, 25, 50]}
  showPageInfo={false}
/>
```

```jsx
<TablePagination showRowsPerPage={false} />
```

```jsx
<TablePagination compact showPageInfo={false} />
```

```tsx
import { useTablePagination } from '@zango-core/crud/table';

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
}
```

---

## TableSearch (Component + Hook)

**Sections:** TableSearchField Props | useTableSearch Hook | Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchTerm` | string | - | Controlled search value. Falls back to context searchTerm when omitted. |
| `onSearchChange` | (e: ChangeEvent<HTMLInputElement>) => void | - | Change handler. When omitted, the field calls context.setSearchTerm automatically. |
| `placeholder` | string | - | Placeholder text. Falls back to metadata.utilities_config.search_placeholder then Search. |
| `inputSize` | sm \| md \| lg | sm | Height variant forwarded to the underlying Input component. |
| `className` | string | - | Extra classes merged onto the outer wrapper div. |
| `style` | CSSProperties | - | Inline style applied to the outer wrapper div. |
| `containerClassName` | string | - | Extra classes concatenated before the max-w-sm wrapper classes. |
| `showSearch` | boolean | true | When false the field returns null. Falls back to metadata.utilities_config.show_search. |
| `searchTerm` | string | - | Current raw search value typed by the user. |
| `setSearchTerm` | (value: string) => void | - | Updates the raw search term. The context debounces this before firing list requests. |
| `debouncedSearchTerm` | string | - | Debounced search value used by the provider when fetching rows. |

### Code Examples

```jsx
// Default search — placeholder and handler come from context
<TableSearchField />
```

```jsx
<TableSearchField
  searchTerm={searchTerm}
  onSearchChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search products..."
  inputSize="md"
/>
```

```jsx
import { useTableSearch } from '@zango-core/crud/table';

function CommandBarSearch() {
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useTableSearch();

  return (
    <div className="flex items-center gap-2">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search..."
      />
      {debouncedSearchTerm && (
        <span className="text-xs text-gray-500">
          Searching for: {debouncedSearchTerm}
        </span>
      )}
    </div>
  );
}
```

```jsx
<TableSearchField showSearch={userRole === 'admin'} />
```

---

## TableAddButton (Component)

**Sections:** Props | Usage Examples | Integration Patterns

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `buttonText` | string | ReactNode | - | Button label text or custom React element. Supports plain strings or JSX for rich content. |
| `onClick` | function | - | Custom click handler. When provided, the built-in drawer behavior is disabled and your handler is called instead. |
| `variant` | string | primary | Button style variant. Controls the visual appearance (color scheme) of the button. |
| `size` | string | md | Button size. Affects padding, font size, and overall dimensions. |
| `className` | string | - | Additional CSS classes for custom styling on the button element. |
| `showIcon` | boolean | false | Show or hide an icon alongside the button text. |
| `icon` | ReactNode | left | Custom icon element. Only displayed when showIcon is true. |
| `onFormSuccess` | function | - | Callback invoked after the built-in form is submitted successfully. Useful for triggering data refresh or showing notifications. |
| `drawerTitle` | string | - | Custom title for the form drawer. Overrides the default title derived from the table context. |
| `drawerSize` | string | md | Size of the form drawer panel. Supports standard drawer size values. |

### Code Examples

```jsx
// Default add button with built-in form drawer
<TableAddButton />
```

```jsx
<TableAddButton
  buttonText="New Product"
  variant="secondary"
  size="lg"
  showIcon={true}
  className="shadow-md"
/>
```

```jsx
<TableAddButton
  buttonText="Create Order"
  onClick={() => {
    // Navigate to a custom creation page
    router.push('/orders/create');
  }}
/>
```

```jsx
<TableAddButton
  buttonText="Add User"
  drawerTitle="Create New User"
  drawerSize="lg"
  onFormSuccess={() => {
    toast.success('User created successfully!');
    refetchData();
  }}
/>
```

```jsx
<TableAddButton
  buttonText={
    <span className="flex items-center gap-2">
      <PlusCircle size={16} />
      <span>Add Item</span>
    </span>
  }
/>
```

```jsx
<CrudHandler
  api_endpoint="/api/products"
  customHeader={
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h1 className="text-lg font-bold">Products</h1>
        <p className="text-sm text-gray-500">Manage your product catalog</p>
      </div>
      <div className="flex items-center gap-3">
        <TableUtilities
          showSearch={true}
          showDownload={true}
          showUpload={false}
          showFiltersButton={false}
          showColumnOptions={false}
        />
        <TableAddButton
          buttonText="New Product"
          showIcon={true}
          variant="primary"
          drawerTitle="Add Product"
          onFormSuccess={() => toast.success('Product added!')}
        />
      </div>
    </div>
  }
/>
```

---

## Render Props (Advanced)

**Sections:** Overview | Actions Column | Status Column | Tags Column | Workflow Transitions Column | Default Render Targets | ActionsCell | StatusCell | WorkflowTransitionsCell | StatusBadge | StatusButton | TagSwitch

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | RowAction[] | - | Array of available action objects for the current row. Each action has key, name, type, and optional description, confirmation_message, and icon fields. |
| `row` | any | - | The resolved row data object (row.original unwrapped). Access fields directly — no need for row.original. |
| `onActionClick` | (action: RowAction) => void | - | Trigger the action execution pipeline for a given action. Handles confirmations, API calls, and table refresh. |
| `menuOpen` | boolean | - | Current state of the dropdown menu. Use this to control visual state of custom menus. |
| `setMenuOpen` | (open: boolean) => void | - | Control the dropdown menu visibility. Call with true to open, false to close. |
| `value` | any | - | The raw status value from the API response. Can be a string, object, or HTML string. |
| `statusValue` | { status_label: string; status_color?: string } \| undefined | - | The resolved status object when value is an object with status_label. Undefined when value is a plain string or HTML. |
| `isObject` | boolean | - | True if the raw value is an object with a status_label field (e.g., status_label Active, status_color 12B76A). |
| `isString` | boolean | - | True if the raw value is a plain string. |
| `isHtml` | boolean | - | True if the raw value contains HTML markup that needs special rendering. |
| `tags` | string[] | - | The complete array of all tag strings assigned to the row. |
| `visibleTags` | string[] | - | Subset of tags displayed inline, sliced to fit within the maxVisible limit. |
| `remainingTags` | string[] | - | Tags that overflow beyond the visible limit. Display these in a popover or tooltip. |
| `hasMoreTags` | boolean | - | True if there are more tags than the maxVisible count allows. Use to conditionally render overflow UI. |
| `maxVisible` | number | - | The maximum number of tags shown inline before overflow. Default is 2, determined by the table column configuration. |
| `transitions` | Transition[] | - | Full array of available workflow transitions for the row. Each transition has name, display_name, is_form_based, confirmation_message, and description fields. |
| `visibleTransitions` | Transition[] | - | First two transitions shown inline (default behavior splits at index 2). |
| `dropdownTransitions` | Transition[] | - | Remaining transitions beyond the first two, intended for a dropdown overflow menu. |
| `row` | any | - | The resolved row data object (row.original unwrapped). |
| `onTransitionClick` | (transition: Transition, e?: React.MouseEvent) => void | - | Trigger the transition execution pipeline. Handles form-based drawers, simple confirmation dialogs, and table refresh. |
| `menuOpen` | boolean | - | Current state of the overflow dropdown menu. |
| `setMenuOpen` | (open: boolean) => void | - | Control the overflow dropdown visibility. |
| `row` | any | - | The TanStack row object or raw row data. Actions are read from row.original.actions_col or row.original.row_actions. |
| `renderActions` | (params) => ReactNode | - | Optional nested render prop passed through to customize the action layout while keeping the drawer and confirmation logic. |
| `value` | any | - | The raw status value from the API — string, HTML string, or object with status_label. |
| `renderStatus` | (params) => ReactNode | - | Optional nested render prop for custom rendering inside the cell. |
| `transitions` | Transition[] | - | Array of available transitions. Each has name, display_name, is_form_based, confirmation_message, and description. |
| `row` | any | - | The row data object used to extract object_uuid for API calls. |
| `renderWorkflowTransitions` | (params) => ReactNode | - | Optional nested render prop for custom button layout while keeping execution logic. |
| `status` | string | - | The status key used for default color lookup (e.g., active, pending, rejected). Case-insensitive. |
| `label` | string | - | Display label shown in the badge. Defaults to the status key with underscores replaced by spaces. |
| `color` | string | - | Custom hex or CSS color that overrides the built-in status color map. |
| `showDot` | boolean | true | Show a small colored dot before the label. |
| `size` | sm \| md \| lg | md | Size variant controlling padding and font size. |
| `className` | string | - | Additional CSS classes applied to the badge container. |
| `transition` | Transition | - | The transition object with name and display_name. Drives the API call and button label. |
| `apiUrl` | string | - | API endpoint URL. The component extracts object_uuid or pk from the URL automatically. |
| `onSuccess` | () => void | - | Called after a successful transition. |
| `onError` | (error: Error) => void | - | Called when the transition fails. |
| `beforeClick` | () => Promise<void> \| void | - | Hook called before executing the transition. Throw to abort. |
| `afterClick` | (success: boolean) => void | - | Hook called after execution regardless of outcome. |
| `showConfirmation` | boolean | false | Force a confirmation dialog before executing. |
| `confirmationMessage` | string | - | Custom message shown in the confirmation dialog. |
| `variant` | primary \| secondary \| outline \| ghost \| danger | primary | Button visual variant. |
| `size` | sm \| md \| lg | md | Button size variant. |
| `disabled` | boolean | false | Disable the button. |
| `className` | string | - | Additional CSS classes applied to the button. |
| `tag` | TagDetail | - | The tag detail object from the workflow API. Contains name, state (enabled \| disabled), enable/disable configs, and permission flags. |
| `apiUrl` | string | - | API endpoint URL. object_uuid or pk is extracted from the URL automatically. |
| `onToggle` | (newState: boolean) => void | - | Called with the new enabled state after a successful toggle. |
| `onError` | (error: Error) => void | - | Called when the toggle operation fails. |
| `beforeToggle` | () => Promise<void> \| void | - | Hook called before toggling. Throw to abort. |
| `afterToggle` | (success: boolean) => void | - | Hook called after toggle regardless of outcome. |
| `label` | string | - | Label displayed next to the switch. Defaults to the tag name with underscores replaced by spaces. |
| `size` | sm \| md \| lg | md | Size variant for the switch. |
| `disabled` | boolean | false | Disable the switch. Permission flags from TagDetail also prevent toggling when not allowed. |
| `className` | string | - | Additional CSS classes applied to the outer container. |

### Code Examples

```jsx
import { Table } from "@zango-core/crud/table";

<Table
  apiUrl="/api/users"
  tableMetadataObj={metadata}
  renderActions={({ actions, row, onActionClick, menuOpen, setMenuOpen }) => (
    // Custom actions UI
  )}
  renderStatus={({ value, statusValue, isObject, isString, isHtml }) => (
    // Custom status badge
  )}
  renderTags={({ tags, visibleTags, remainingTags, hasMoreTags, maxVisible }) => (
    // Custom tag layout
  )}
  renderWorkflowTransitions={({ transitions, visibleTransitions, dropdownTransitions, row, onTransitionClick, menuOpen, setMenuOpen }) => (
    // Custom workflow transition buttons
  )}
/>
```

```jsx
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

<Table
  apiUrl="/api/orders"
  tableMetadataObj={metadata}
  renderActions={({ actions, row, onActionClick, menuOpen, setMenuOpen }) => {
    const inlineActions = actions.slice(0, 3);
    const overflowActions = actions.slice(3);

    return (
      <div className="flex items-center gap-1">
        {/* Inline action buttons */}
        {inlineActions.map((action) => (
          <Button
            key={action.key}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick(action);
            }}
          >
            {action.name}
          </Button>
        ))}

        {/* Overflow dropdown for remaining actions */}
        {overflowActions.length > 0 && (
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {overflowActions.map((action) => (
                <DropdownMenuItem
                  key={action.key}
                  onClick={() => onActionClick(action)}
                >
                  {action.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  }}
/>
```

```jsx
<Table
  apiUrl="/api/orders"
  tableMetadataObj={metadata}
  renderStatus={({ value, statusValue, isObject, isString, isHtml }) => {
    // Define color mappings for known statuses
    const statusColors = {
      active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
      pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
      inactive: { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
      rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    };

    // Handle HTML status values
    if (isHtml) {
      return (
        <span
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );
    }

    // Handle object status values
    if (isObject && statusValue) {
      const key = statusValue.status_label?.toLowerCase() || 'inactive';
      const colors = statusColors[key] || statusColors.inactive;
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          {statusValue.status_label}
        </span>
      );
    }

    // Handle plain string status
    const key = (isString ? value : '').toLowerCase();
    const colors = statusColors[key] || statusColors.inactive;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        {value}
      </span>
    );
  }}
/>
```

```jsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

<Table
  apiUrl="/api/products"
  tableMetadataObj={metadata}
  renderTags={({ tags, visibleTags, remainingTags, hasMoreTags, maxVisible }) => {
    // Color palette for tags
    const tagColors = [
      'bg-blue-50 text-blue-700 border-blue-200',
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-teal-50 text-teal-700 border-teal-200',
      'bg-orange-50 text-orange-700 border-orange-200',
      'bg-pink-50 text-pink-700 border-pink-200',
    ];

    return (
      <div className="flex flex-wrap items-center gap-1">
        {/* Visible tags */}
        {visibleTags.map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${tagColors[index % tagColors.length]}`}
          >
            {tag}
          </span>
        ))}

        {/* Overflow indicator with tooltip */}
        {hasMoreTags && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 cursor-pointer hover:bg-gray-200">
                  +{remainingTags.length} more
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="flex flex-wrap gap-1 p-1">
                  {remainingTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-white border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }}
/>
```

```jsx
import { MoreHorizontal } from "lucide-react";

<Table
  apiUrl="/api/cases"
  tableMetadataObj={metadata}
  renderWorkflowTransitions={({
    transitions,
    visibleTransitions,
    dropdownTransitions,
    row,
    onTransitionClick,
    menuOpen,
    setMenuOpen,
  }) => (
    <div className="flex items-center gap-1">
      {visibleTransitions.map((t) => (
        <button
          key={t.name}
          className="px-3 py-1 text-xs font-medium rounded-md bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onTransitionClick(t, e);
          }}
        >
          {t.display_name}
        </button>
      ))}

      {dropdownTransitions.length > 0 && (
        <div className="relative">
          <button
            className="p-1 hover:bg-gray-100 rounded-sm"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 bg-white border shadow-lg rounded-sm z-50">
              {dropdownTransitions.map((t) => (
                <button
                  key={t.name}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTransitionClick(t, e);
                    setMenuOpen(false);
                  }}
                >
                  {t.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )}
/>
```

```jsx
import { ActionsCell } from "@zango-core/crud/table";

// Use as the direct return of renderActions to compose with a wrapper
<Table
  apiUrl="/api/users"
  tableMetadataObj={metadata}
  renderActions={(args) => (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <ActionsCell row={args.row} />
    </div>
  )}
/>
```

```jsx
import { StatusCell } from "@zango-core/crud/table";

// Wrap StatusCell with a fixed-width container
<Table
  apiUrl="/api/orders"
  tableMetadataObj={metadata}
  renderStatus={(args) => (
    <div className="w-28">
      <StatusCell value={args.value} />
    </div>
  )}
/>
```

```jsx
import { WorkflowTransitionsCell } from "@zango-core/crud/table";

// Re-use default cell inside a render prop wrapper
<Table
  apiUrl="/api/cases"
  tableMetadataObj={metadata}
  renderWorkflowTransitions={(args) => (
    <div className="min-w-[160px]">
      <WorkflowTransitionsCell
        transitions={args.transitions}
        row={args.row}
      />
    </div>
  )}
/>
```

```jsx
import { StatusBadge } from "@zango-core/crud/table";

// Use default colors from built-in map
<StatusBadge status="active" />

// Override color for a custom status
<StatusBadge status="under_review" label="Under Review" color="#6366F1" />

// Use inside renderStatus
<Table
  apiUrl="/api/orders"
  tableMetadataObj={metadata}
  renderStatus={({ value, statusValue, isObject, isString }) => {
    if (isObject && statusValue) {
      return (
        <StatusBadge
          status={statusValue.status_label}
          color={statusValue.status_color}
        />
      );
    }
    return <StatusBadge status={isString ? value : String(value)} />;
  }}
/>
```

```jsx
import { StatusButton } from "@zango-core/crud/table";

// Inside renderWorkflowTransitions
<Table
  apiUrl="/api/cases"
  tableMetadataObj={metadata}
  renderWorkflowTransitions={({ transitions, row, onTransitionClick }) =>
    transitions.map((t) => (
      <StatusButton
        key={t.name}
        transition={t}
        apiUrl={`/api/cases/${row.object_uuid}/`}
        variant="outline"
        size="sm"
        onSuccess={() => console.log("Transition complete")}
      />
    ))
  }
/>
```

```jsx
import { TagSwitch } from "@zango-core/crud/table";
import { WorkflowTags } from "@zango-core/crud/table";

// Use TagSwitch directly in a detail view
function CaseDetail({ caseData }) {
  return (
    <div className="space-y-3">
      {caseData.workflow_details?.tag_details?.map((tag) => (
        <TagSwitch
          key={tag.name}
          tag={tag}
          apiUrl={`/api/cases/${caseData.object_uuid}/`}
          onToggle={(enabled) => console.log(tag.name, enabled)}
        />
      ))}
    </div>
  );
}
```

---

## Hooks Reference (Hooks)

**Sections:** useTable() | useTableData() | useTableSearch() | useTableFilters() | useTablePagination() | useTableSelection() | useTableColumns() | useTableActions() | useTableRowActions() | useDetailView() | useDetailViewContext() | useWorkflow()

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | array | - | Flat array of row objects for the current page. |
| `totalCount` | number | - | Total number of rows across all pages. |
| `isLoading` | boolean | - | True while data is being fetched. |
| `currentPage` | number | - | Zero-based index of the current page. |
| `rowsPerPage` | number | - | Number of rows displayed per page. |
| `totalPages` | number | - | Total number of pages. |
| `hasPreviousPage` | boolean | - | Whether a previous page exists. |
| `hasNextPage` | boolean | - | Whether a next page exists. |
| `setCurrentPage` | (page: number) => void | - | Navigate to a specific page. |
| `setRowsPerPage` | (size: number) => void | - | Change the page size. |
| `selectedDetailRow` | object | null | - | The row currently open in the detail drawer. |
| `openDetailDrawer` | (row) => void | - | Open the detail drawer for a row. |
| `closeDetailDrawer` | () => void | - | Close the detail drawer. |
| `navigateToNextEntry` | () => void | - | Move the detail drawer to the next row. |
| `navigateToPreviousEntry` | () => void | - | Move the detail drawer to the previous row. |
| `searchTerm` | string | - | Current search query. |
| `setSearchTerm` | (term: string) => void | - | Update the search query. |
| `activeFilterCount` | number | - | Number of currently active filters. |
| `handleRowClick` | (row) => void | - | Default row-click handler that opens the detail drawer. |
| `refetch` | () => void | - | Re-fetch data from the API. |
| `api_endpoint` | string | - | The resolved API endpoint URL. |
| `apiUrl` | string | - | API endpoint to fetch rows from. |
| `columns` | array | - | Column definitions. If omitted, derived from tableMetadata. |
| `tableMetadata` | object | - | Pre-fetched metadata object. If omitted, fetched from apiUrl. |
| `flatData` | array | - | Flat array of row objects for the current page. |
| `totalDBRowCount` | number | - | Total row count reported by the server. |
| `totalPages` | number | - | Computed total pages based on row count and page size. |
| `isLoading` | boolean | - | True during the initial data load. |
| `isFetching` | boolean | - | True during any fetch, including background refetches. |
| `error` | Error | null | - | Error object if the fetch failed. |
| `searchTerm` | string | - | Current search term sent to the server. |
| `setSearchTerm` | (term: string) => void | - | Update the search term. |
| `filterObj` | object | - | Current filter state sent to the server. |
| `setFilterObj` | (filters: object) => void | - | Replace all active filters. |
| `currentPage` | number | - | Zero-based current page index. |
| `setCurrentPage` | (page: number) => void | - | Navigate to a page. |
| `rowsPerPage` | number | - | Rows per page. |
| `setRowsPerPage` | (size: number) => void | - | Change page size. |
| `sorting` | array | - | Current sorting state array. |
| `setSorting` | (sorting: array) => void | - | Update sorting. |
| `tableMetadata` | object | - | Resolved table metadata (fetched or passed in). |
| `columns` | array | - | Effective column definitions used by the table. |
| `refetch` | () => void | - | Re-fetch the current page of data. |
| `searchTerm` | string | - | The raw search input value (updates on every keystroke). |
| `setSearchTerm` | (term: string) => void | - | Update the search input. |
| `debouncedSearchTerm` | string | - | The debounced value actually sent to the API. |
| `filterObj` | object | - | Current filter key-value map sent to the API. |
| `setFilterObj` | (filters: object) => void | - | Replace the entire filter state. |
| `activeFilterCount` | number | - | Number of non-empty filter entries. |
| `clearFilters` | () => void | - | Remove all active filters. |
| `hasActiveFilters` | boolean | - | True when at least one filter is active. |
| `currentPage` | number | - | Zero-based index of the current page. |
| `totalPages` | number | - | Total number of pages. |
| `rowsPerPage` | number | - | Rows displayed per page. |
| `setCurrentPage` | (page: number) => void | - | Jump to a specific page. |
| `setRowsPerPage` | (size: number) => void | - | Change the page size (resets to page 0). |
| `hasPreviousPage` | boolean | - | Whether navigating backward is possible. |
| `hasNextPage` | boolean | - | Whether navigating forward is possible. |
| `goToFirstPage` | () => void | - | Navigate to the first page. |
| `goToLastPage` | () => void | - | Navigate to the last page. |
| `selectedRows` | array | - | Array of currently selected row objects or IDs. |
| `setSelectedRows` | (rows: array) => void | - | Directly set the selected rows. |
| `isAllSelected` | boolean | - | True when every visible row is selected. |
| `toggleSelectAll` | () => void | - | Select all visible rows, or deselect all if already selected. |
| `toggleSelectRow` | (row) => void | - | Toggle selection for a single row. |
| `clearSelection` | () => void | - | Deselect all rows. |
| `visibleColumns` | array | - | Array of currently visible column definitions. |
| `hiddenColumns` | array | - | Array of currently hidden column definitions. |
| `toggleColumnVisibility` | (columnId: string) => void | - | Toggle a column between visible and hidden. |
| `showColumn` | (columnId: string) => void | - | Make a specific column visible. |
| `hideColumn` | (columnId: string) => void | - | Hide a specific column. |
| `showAllColumns` | () => void | - | Make all columns visible. |
| `hideAllColumns` | () => void | - | Hide all columns. |
| `isColumnVisible` | (columnId: string) => boolean | - | Check if a column is currently visible. |
| `moveColumn` | (columnId: string, newIndex: number) => void | - | Reorder a column to a new position. |
| `pinColumnLeft` | (columnId: string) => void | - | Pin a column to the left side of the table. |
| `pinColumnRight` | (columnId: string) => void | - | Pin a column to the right side of the table. |
| `refetch` | () => void | - | Re-fetch the table data from the server. |
| `exportTable` | () => void | - | Trigger an export of the current table data. |
| `handleRowClick` | (row) => void | - | Default handler that opens the detail drawer for the clicked row. |
| `selectedDetailRow` | object | null | - | The row currently displayed in the detail drawer. |
| `openDetailDrawer` | (row) => void | - | Programmatically open the detail drawer for a row. |
| `closeDetailDrawer` | () => void | - | Close the detail drawer. |
| `navigateToNextEntry` | () => void | - | Move the detail drawer to the next row in the list. |
| `navigateToPreviousEntry` | () => void | - | Move the detail drawer to the previous row in the list. |
| `apiUrl` | string | - | API endpoint for the detail record. Automatically resolved from context if inside a DetailViewProvider. |
| `data` | object | - | The fetched detail data for the current object. |
| `loading` | boolean | - | True while detail data is being fetched. |
| `error` | string | null | - | Error message if the detail fetch failed. |
| `refresh` | () => Promise<void> | - | Re-fetch the detail data from the API. |
| `objectUuid` | string | - | UUID of the current detail object. |
| `workflowDetails` | object | - | Workflow data for the object (current_status, current_status_meta, next_transitions, tag_details). |
| `rowActions` | array | - | Available row-level actions for the current object. |
| `data` | object | - | Detail data from the shared context. |
| `loading` | boolean | - | True while the shared detail fetch is in progress. |
| `error` | string | null | - | Error from the shared detail fetch. |
| `refresh` | () => Promise<void> | - | Re-fetch detail data for the entire context. |
| `objectUuid` | string | - | UUID of the current detail object. |
| `workflowDetails` | object | - | Workflow data from the shared context. |
| `rowActions` | array | - | Row-level actions from the shared context. |
| `apiUrl` | string | - | API endpoint for fetching and mutating workflow data. Optional — resolved from context when omitted. Required for executeTransition / toggleTag in static data mode. |
| `initialWorkflowDetails` | WorkflowDetails | - | Seed the hook with known workflow data. Overridden by staticData when both are supplied. |
| `staticData` | any | - | Pre-fetched payload that already contains workflow details. Accepts { workflow_details }, { response: { workflow_details } }, or a bare WorkflowDetails object. Bypasses the initial API fetch; apiUrl is still needed for mutations. |
| `objectUuid` | string | - | Explicit object UUID used in API calls. Extracted from apiUrl automatically when omitted. |
| `beforeTransition` | (transition: Transition) => Promise<void> \| void | - | Async callback invoked before executing a status transition. Throw to abort. |
| `afterTransition` | (transition: Transition, success: boolean) => Promise<void> \| void | - | Async callback invoked after a transition completes. |
| `beforeTagChange` | (tag: TagDetail, newState: string) => Promise<void> \| void | - | Async callback invoked before toggling a tag. |
| `afterTagChange` | (tag: TagDetail, success: boolean) => Promise<void> \| void | - | Async callback invoked after a tag toggle completes. |
| `workflowDetails` | WorkflowDetails \| undefined | - | Full workflow data: current_status, current_status_meta, next_transitions, and tag_details. |
| `loading` | boolean | - | True while workflow data is being fetched or a mutation is in-flight. |
| `error` | Error \| null | - | Error object if the workflow fetch or operation failed. |
| `executeTransition` | (transition: Transition) => Promise<boolean> | - | Execute a status transition. Refreshes workflow data on success. Returns success boolean. |
| `toggleTag` | (tag: TagDetail) => Promise<boolean> | - | Toggle a tag between enabled and disabled. Returns success boolean. |
| `refreshWorkflow` | () => Promise<void> | - | Re-fetch workflow data from the API. No-op in static data mode without apiUrl. |
| `handleFormSubmit` | () => Promise<void> | - | Call after a form-based transition submits; triggers refreshWorkflow internally. |
| `setWorkflowDetails` | (details: WorkflowDetails) => void | - | Directly overwrite local workflow state — useful for optimistic updates. |
| `onCancel` | () => void | - | Reset workflow to initialWorkflowDetails and re-fetch from API. |

### Code Examples

```jsx
import { useTable } from "@zango-core/crud/table";

function OrdersPage() {
  const { data, isLoading, totalCount, refetch } = useTable();
  if (isLoading) return <p>Loading…</p>;
  return <p>{totalCount} orders loaded. <button onClick={refetch}>Refresh</button></p>;
}
```

```jsx
import { useTableData } from "@zango-core/crud/table";

function ProductList() {
  const { flatData, isLoading, totalDBRowCount, refetch } = useTableData({
    apiUrl: "/api/products/",
  });
  if (isLoading) return <p>Loading…</p>;
  return <p>{totalDBRowCount} products found. <button onClick={refetch}>Refresh</button></p>;
}
```

```jsx
import { useTableSearch } from "@zango-core/crud/table";

function SearchBar() {
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useTableSearch();
  return (
    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search…" />
  );
}
```

```jsx
import { useTableFilters } from "@zango-core/crud/table";

function FilterBar() {
  const { filterObj, setFilterObj, activeFilterCount, clearFilters } = useTableFilters();
  return (
    <div>
      <span>{activeFilterCount} filters active</span>
      <button onClick={clearFilters}>Clear all</button>
    </div>
  );
}
```

```jsx
import { useTablePagination } from "@zango-core/crud/table";

function Pager() {
  const { currentPage, totalPages, hasPreviousPage, hasNextPage, setCurrentPage } = useTablePagination();
  return (
    <div>
      <button disabled={!hasPreviousPage} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
      <span>Page {currentPage + 1} of {totalPages}</span>
      <button disabled={!hasNextPage} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
    </div>
  );
}
```

```jsx
import { useTableSelection } from "@zango-core/crud/table";

function BulkActions() {
  const { selectedRows, toggleSelectAll, isAllSelected, clearSelection } = useTableSelection();
  return (
    <div>
      <button onClick={toggleSelectAll}>{isAllSelected ? "Deselect All" : "Select All"}</button>
      <span>{selectedRows.length} selected</span>
      <button onClick={clearSelection}>Clear</button>
    </div>
  );
}
```

```jsx
import { useTableColumns } from "@zango-core/crud/table";

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
}
```

```jsx
import { useTableActions } from "@zango-core/crud/table";

function Toolbar() {
  const { refetch, exportTable } = useTableActions();
  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <button onClick={exportTable}>Export CSV</button>
    </div>
  );
}
```

```jsx
import { useTableRowActions } from "@zango-core/crud/table";

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
}
```

```jsx
import { useDetailView } from "@zango-core/crud/table";

function UserProfile() {
  const { data, loading, error, refresh, objectUuid } = useDetailView({
    apiUrl: "/api/users/?object_uuid=abc-123",
  });
  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  return <p>{data.name} ({objectUuid}) <button onClick={refresh}>Refresh</button></p>;
}
```

```jsx
import { useDetailViewContext } from "@zango-core/crud/table";

function StatusBadge() {
  const { workflowDetails, loading } = useDetailViewContext();
  if (loading || !workflowDetails) return null;
  return <span className="badge">{workflowDetails.current_status_meta?.status_label}</span>;
}
```

```jsx
import { useWorkflow } from "@zango-core/crud/table";

function ApproveButton({ objectUuid }) {
  const { workflowDetails, executeTransition, loading } = useWorkflow({
    apiUrl: `/api/orders/?object_uuid=${objectUuid}`,
  });
  if (loading || !workflowDetails) return null;
  const approveTransition = workflowDetails.next_transitions.find((t) => t.name === "approve");
  if (!approveTransition) return null;
  return <button onClick={() => executeTransition(approveTransition)}>Approve</button>;
}
```

```jsx
import { useDetailView, useWorkflow } from "@zango-core/crud/table";

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
}
```

---
