# Zango CRUD Reference


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

## Components & Hooks

| Name | Type | Description | Reference |
|------|------|-------------|----------|
| CrudHandler | Core Component | The main orchestrator component. Provides a flexible, customizable table interface with built-in support for headers, utilities, body, pagination, and detail views. | [CrudHandler.md](CrudHandler.md) |
| Detail Views | Views | Drawer and route-based detail views with automatic data fetching. | [Detail-Views.md](Detail-Views.md) |
| Render Props | Advanced | Custom rendering for action, status, tag, and workflow-transition columns while maintaining all functionality and state management. | [Render-Props.md](Render-Props.md) |
| TableAddButton | Component | Configurable add button with built-in drawer and form integration. | [TableAddButton.md](TableAddButton.md) |
| TableBody | Component | Main table data display component with virtualization and row interaction support. | [TableBody.md](TableBody.md) |
| TableHeader | Component | Page header component with title, count, and action buttons. | [TableHeader.md](TableHeader.md) |
| TablePagination | Component | Pagination controls with page navigation and rows-per-page selection. | [TablePagination.md](TablePagination.md) |
| TableSearch | Component + Hook | Standalone search input that syncs with table context, plus the useTableSearch hook for custom search UIs. | [TableSearch.md](TableSearch.md) |
| Table Styling | Styling | Complete visual customization of table components using CSS classes or dynamic style functions. Inspired by React Select's styling approach. | [Table-Styling.md](Table-Styling.md) |
| TableUtilities | Component | Action bar with search, filters, upload/download, and column options. | [TableUtilities.md](TableUtilities.md) |
| useTable() | Hook | Access shared table context from any custom component rendered within CrudHandler. Stay in sync with table state and controls. | [useTable.md](useTable.md) |
| Hooks Reference | Hooks | Complete reference for all hooks available in @zango-core/crud/table. | [Hooks-Reference.md](Hooks-Reference.md) |

