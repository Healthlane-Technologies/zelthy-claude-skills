# Zango CRUD - Complete Reference

> Auto-generated from documentation source files. Do not edit directly.
> Regenerate with: `node scripts/generate-reference.js`

## Quick Import Reference

```jsx
import type { TableCustomClasses, TableCustomStyles } from '@zango-core/crud/table';
import { Button } from "@/components/ui/button";
import { CrudHandler } from "@zango-core/crud/table";
import { CrudHandler } from '@zango-core/crud/table';
import { DetailViewProvider, WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";
import { Dialog } from "@/components/ui/dialog";
import { Filter, XCircle } from 'lucide-react';
import { FormRenderer } from "@zango-core/crud/form";
import { MoreHorizontal } from "lucide-react";
import { StandaloneDetailView } from "@zango-core/crud/table";
import { Table } from "@zango-core/crud/table";
import { WorkflowStatus } from "@zango-core/crud/table";
import { WorkflowStatus } from "@zango-core/crud/workflow";
import { WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";
import { WorkflowTags } from "@zango-core/crud/workflow";
import { ZangoApp } from '@zango-core/crm-framework';
import { useAppContext } from '@zango-core/crm-framework';
import { useDetailView } from "@zango-core/crud/table";
import { useDetailView, useDetailViewContext } from "@zango-core/crud/table";
import { useDetailViewContext } from "@zango-core/crud/table";
import { useNavigate } from 'react-router-dom';
import { useTable } from "@zango-core/crud/table";
import { useTableActions } from "@zango-core/crud/table";
import { useTableColumns } from "@zango-core/crud/table";
import { useTableData } from "@zango-core/crud/table";
import { useTableFilters } from "@zango-core/crud/table";
import { useTablePagination } from "@zango-core/crud/table";
import { useTableRowActions } from "@zango-core/crud/table";
import { useTableSearch } from "@zango-core/crud/table";
import { useTableSelection } from "@zango-core/crud/table";
import { useWorkflow } from "@zango-core/crud/table";
```

## API Response Formats

### Table Metadata (GET ?action=get_table_metadata)
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

### Table Data (GET ?action=get_table_data)
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

### Detail View (GET ?action=fetch_item_details&object_uuid=UUID)
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

### Form Schema (GET ?action=initialize_form)
```json
{
  "success": true,
  "response": {
    "is_multistep": false,
    "form": {
      "json_schema": { "type": "object", "title": "Form", "required": ["name"], "properties": { "name": { "type": "string", "title": "Name" } } },
      "ui_schema": { "name": { "ui:placeholder": "Enter name" } },
      "form_data": {}
    }
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

---

## CrudHandler

**Core Component** | The main orchestrator component. Provides a flexible, customizable table interface with built-in support for headers, utilities, body, pagination, and detail views.

### Sections
- Import
- Quick Start
- Required Props
- Section Visibility Controls
- Route Controls
- Drawer Configuration
- Custom Component Overrides
- Additional Configuration
- Header Configuration (headerProps)
- Utilities Configuration
- Examples

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **api_endpoint** * | `string` | — | The API endpoint to fetch table data from. Example: /api/crud/ |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showHeader | `boolean` | `true` | Show or hide the header section. |
| showUtilities | `boolean` | `true` | Show or hide the utilities panel (search, filters, actions). |
| showBody | `boolean` | `true` | Show or hide the table body. |
| showPagination | `boolean` | `true` | Show or hide pagination controls. |

#### Props Table 3

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| enableDetailViewRoute | `boolean` | `false` | Enable /detail-view/:object_uuid route and "View Details" button. When true, a full-page detail view route is registered. |

#### Props Table 4

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| detailDrawerSize | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | Sets the size of the detail drawer panel. |

#### Props Table 5

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| customHeader | `ReactNode \| string` | — | Replace the default header. Can be a component or HTML string. |
| customUtilities | `ReactNode` | — | Replace the utilities/action bar section. |
| customTableBody | `ReactNode` | — | Replace the default table body. |
| customPagination | `ReactNode` | — | Replace the default pagination. |
| customDrawerDetail | `ReactNode` | — | Provide a custom drawer-style detail view. Automatically receives fetched detail data. |
| customMainDetail | `ReactNode` | — | Provide a custom main detail view for route-based navigation. Automatically receives fetched detail data. |

#### Props Table 6

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tableId | `string` | — | Unique identifier for the table, used for state management. Auto-generated from api_endpoint if not provided. |
| columns | `any[]` | — | Array of column definitions for client-side column configuration. |
| className | `string` | — | Custom CSS class for the main container. |
| style | `React.CSSProperties` | — | Custom inline styles for the main container. |
| customClass | `TableCustomClasses` | — | Object with CSS class overrides for table elements. |
| customStyle | `TableCustomStyles` | — | Object with dynamic style functions for table elements. |

#### Props Table 7

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| headerProps.showSearch | `boolean` | — | Show/hide search in header. |
| headerProps.showFilters | `boolean` | — | Show/hide filter controls. |
| headerProps.showActions | `boolean` | — | Show/hide action buttons. |
| headerProps.searchPlaceholder | `string` | — | Custom search placeholder text. |
| headerProps.title | `string` | — | Header title text. |
| headerProps.customLeftActions | `ReactNode` | — | Custom actions on the left side. |
| headerProps.customRightActions | `ReactNode` | — | Custom actions on the right side. |

#### Props Table 8

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| has_add_perm | `boolean` | `true` | Show/hide the "Add New" button in the header. |
| has_upload_perm | `boolean` | `false` | Show/hide the upload button in utilities. |
| has_download_perm | `boolean` | `true` | Show/hide the download button in utilities. |

#### Props Table 9

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| show_search | `boolean` | `true` | Show/hide search input in utilities bar. |
| show_filters_button | `boolean` | `true` | Show/hide filters toggle button. |
| show_column_options | `boolean` | `true` | Show/hide column visibility options. |

#### Props Table 10

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

<!-- import.jsx -->
```jsx
import { CrudHandler } from "@zango-core/crud/table";
```

<!-- minimal.jsx -->
```jsx
<CrudHandler api_endpoint="/api/users" />
```

<!-- hide-sections.jsx -->
```jsx
// Hide specific sections
<CrudHandler
  api_endpoint="/api/users"
  showHeader={false}
  showUtilities={false}
  showPagination={false}
/>
```

<!-- custom-overrides.jsx -->
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

<!-- metadata-response.json -->
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

<!-- optional-features.jsx -->
```jsx
<CrudHandler
  api_endpoint="/api/users"
  enableDetailViewRoute={true}
  utilityProps={{
    showUpload: true
  }}
/>
```

<!-- configured-defaults.jsx -->
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

<!-- mix-and-match.jsx -->
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

<!-- custom-detail-views.jsx -->
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

---

## Table Styling

**Styling** | Complete visual customization of table components using CSS classes or dynamic style functions. Inspired by React Select's styling approach.

### Sections
- Overview
- Basic Usage
- Customizable Elements
- State-Aware Styling
- Theme Examples
- Advanced Techniques
- Best Practices

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| container | `string` | — | Main table container wrapper |
| tableWrapper | `string` | — | Table wrapper element |
| table | `string` | — | The actual table element |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| headerRow | `string` | — | Header row container |
| headerCell | `string` | — | Individual header cells |
| headerCellPinned | `string` | — | Pinned header cells |
| sortButton | `string` | — | Sortable column buttons |
| sortIcon | `string` | — | Sort direction icons |

#### Props Table 3

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| bodyRow | `string` | — | Data row containers |
| bodyRowSelected | `string` | — | Selected row state |
| bodyCell | `string` | — | Individual data cells |
| bodyCellPinned | `string` | — | Pinned data cells |

#### Props Table 4

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| utilitiesContainer | `string` | — | Action bar container |
| filterButton | `string` | — | Filter toggle buttons |
| searchInput | `string` | — | Search input field |
| uploadButton | `string` | — | File upload button |
| downloadButton | `string` | — | Download/export button |

#### Props Table 5

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| paginationContainer | `string` | — | Pagination wrapper |
| paginationButton | `string` | — | Page number buttons |
| paginationNavButton | `string` | — | Previous/next buttons |
| paginationInfo | `string` | — | Page info display |
| paginationEllipsis | `string` | — | Overflow indicators |

#### Props Table 6

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| filterSidebar | `string` | — | Filter panel container |
| filterHeader | `string` | — | Filter panel header |
| filterTitle | `string` | — | Filter title text |
| filterClearAll | `string` | — | Clear filters button |
| filterContent | `string` | — | Filter content area |
| filterAccordion | `string` | — | Filter accordion wrapper |

#### Props Table 7

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| actionsContainer | `string` | — | Row actions wrapper |
| actionButton | `string` | — | Individual action buttons |
| actionMenuButton | `string` | — | Action menu trigger |
| actionDropdown | `string` | — | Action dropdown menu |
| actionDropdownItem | `string` | — | Action menu items |
| statusBadge | `string` | — | Status display badges |
| tagsContainer | `string` | — | Tags wrapper |
| workflowContainer | `string` | — | Workflow elements wrapper |
| workflowButton | `string` | — | Workflow action buttons |
| workflowDropdown | `string` | — | Workflow dropdown menu |

### Code Examples

<!-- class-overrides.jsx -->
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

<!-- forced-classes.jsx -->
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

<!-- dynamic-styles.jsx -->
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

<!-- row-state.tsx -->
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

<!-- header-state.tsx -->
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

<!-- action-state.tsx -->
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

<!-- professional-theme.jsx -->
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

<!-- dark-theme.jsx -->
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

<!-- data-driven.jsx -->
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

<!-- gradients.jsx -->
```jsx
const backgroundStyles = {
  customClass: {
    container: 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50',
    tableWrapper: 'bg-white/80 backdrop-blur-sm shadow-xl rounded-lg',
    headerCell: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white'
  }
};
```

<!-- borderless.jsx -->
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

<!-- animations.jsx -->
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

<!-- theme-provider.jsx -->
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

<!-- performance.jsx -->
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

<!-- typescript.tsx -->
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

<!-- type-defs.tsx -->
```tsx
// Row state for bodyRow and bodyCell
interface RowState {
  rowIndex: number;
  isSelected: boolean;
  isHovered: boolean;
  rowData: any;
}

// Header state for headerCell and sortButton
interface HeaderCellState {
  isPinned: boolean;
  canSort: boolean;
  columnId: string;
  pinnedOffset: number;
}

// Action state for action buttons
interface ActionButtonState {
  action: any;
  isFirst: boolean;
  isInDropdown: boolean;
}
```

---

## useTable()

**Hook** | Access shared table context from any custom component rendered within CrudHandler. Stay in sync with table state and controls.

### Sections
- Overview
- Context Values
- Full Signature
- Usage Examples

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | `array` | — | Array of items currently rendered in the body. |
| totalCount | `number` | — | Total items across all pages. |
| isLoading | `boolean` | — | Loading state for list fetches. |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| currentPage | `number` | — | Current page number. |
| rowsPerPage | `number` | — | Items per page. |
| totalPages | `number` | — | Total number of pages. |
| hasPreviousPage | `boolean` | — | Whether a previous page exists. |
| hasNextPage | `boolean` | — | Whether a next page exists. |
| setCurrentPage | `function` | — | Function to change the current page. |
| setRowsPerPage | `function` | — | Function to change page size. |

#### Props Table 3

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| selectedDetailRow | `object \| null` | — | Currently selected row for detail view. |
| openDetailDrawer | `function` | — | Function to open the detail drawer. |
| closeDetailDrawer | `function` | — | Function to close the detail drawer. |
| navigateToNextEntry | `function` | — | Navigate to next row in detail view. |
| navigateToPreviousEntry | `function` | — | Navigate to previous row in detail view. |

#### Props Table 4

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| searchTerm | `string` | — | Current search term. |
| setSearchTerm | `function` | — | Function to update the search term. |
| activeFilterCount | `number` | — | Number of currently active filters. |

#### Props Table 5

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| handleRowClick | `function` | — | Function to handle row clicks. |
| refetch | `function` | — | Manually refetch the table data. |
| api_endpoint | `string` | — | The API endpoint being used. |

### Code Examples

<!-- useTable-signature.tsx -->
```tsx
const {
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
} = useTable();
```

<!-- custom-stats.jsx -->
```jsx
// A custom component that shows table stats
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
/>
```

<!-- custom-search.jsx -->
```jsx
const AdvancedSearch = () => {
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
/>
```

<!-- custom-pagination.jsx -->
```jsx
const SimplePagination = () => {
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
/>
```

<!-- detail-nav.jsx -->
```jsx
const DetailNavigator = () => {
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
};
```

---

## Detail Views

**Views** | Drawer and route-based detail views with automatic data fetching.

### Sections
- Overview
- Automatic Data Fetching
- Data Props Provided
- Drawer Detail View
- Main Detail View (Route-based)
- DetailViewProvider
- StandaloneDetailView
- Detail Hooks

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | `object` | — | Complete detail response from the API, containing all fields and nested data for the record. |
| api_endpoint | `string` | — | The API endpoint used to fetch the detail data. |
| loading | `boolean` | — | Whether the detail data is currently being fetched. |
| error | `string \| null` | — | Error message if the data fetch failed, or null if successful. |
| onRefresh | `function` | — | Callback to re-fetch the detail data. Useful after performing mutations like status transitions or edits. |
| objectUuid | `string` | — | The unique object UUID of the current record. |
| pk | `string \| number` | — | The primary key of the current record. |
| title | `string` | — | The display title for the detail view, derived from the record data. |
| general_details | `object` | — | General details section with a fields object. Each field is keyed by field_name and has { name, display_name, type, value, searchable, sortable }. |
| workflow_details | `object` | — | Workflow data including current_status (string key), current_status_meta ({ name, from, to, status_label, status_color, is_form_based, is_manual }), next_transitions (array), and tag_details (array). |
| sections | `array` | — | Array of section objects, each with key, name, title, data (object), optional extra_html, and optional form ({ is_multistep, form: { json_schema, ui_schema } }). |
| row_actions | `array` | — | Array of available row-level actions for the current record. |
| configurations | `object` | — | Additional configuration metadata for the detail view. |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| useDetailView({ apiUrl }) | `Hook` | — | Fetches detail data for a specific record. Returns: data, loading, error, refresh, objectUuid, workflowDetails, rowActions. |
| useDetailViewContext() | `Hook` | — | Reads from the nearest DetailViewProvider context. Same return shape as useDetailView but from shared context. |

### Code Examples

<!-- CustomDrawerDetail.jsx -->
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

<!-- usage-drawer.jsx -->
```jsx
import CustomDrawerDetail from './CustomDrawerDetail';

<CrudHandler
  api_endpoint="/api/users"
  customDrawerDetail={CustomDrawerDetail}
/>
```

<!-- CustomMainDetail.jsx -->
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
                  {t.display_name} &rarr; {t.to_state_meta?.status_label}
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

<!-- usage-main-detail.jsx -->
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

<!-- detail-view-provider.jsx -->
```jsx
import { DetailViewProvider, WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

// Wrap components for shared context
<DetailViewProvider apiUrl="/api/users/?object_uuid=123">
  <WorkflowStatus />   {/* Automatically uses context */}
  <WorkflowTags />     {/* Automatically uses context */}
  <MyCustomComponent /> {/* Can call useDetailViewContext() */}
</DetailViewProvider>
```

<!-- standalone-detail.jsx -->
```jsx
import { StandaloneDetailView } from "@zango-core/crud/table";

<StandaloneDetailView
  apiUrl="/api/users/"
  objectUuid="550e8400-e29b-41d4-a716-446655440000"
/>
```

<!-- detail-hooks.jsx -->
```jsx
import { useDetailView, useDetailViewContext } from "@zango-core/crud/table";

// Standalone - fetches its own data
const { data, loading, workflowDetails } = useDetailView({
  apiUrl: "/api/users/?object_uuid=123"
});

// Context-based - reads from DetailViewProvider
const { data, refresh } = useDetailViewContext();
```

---

## TableBody

**Component** | Main table data display component with virtualization and row interaction support.

### Sections
- Props
- Row Click Behaviors

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **table** * | `TanstackTable<any>` | — | TanStack table instance that provides row models, column definitions, and table state. |
| defaultDetailView | `RowClickAction \| RowClickConfig` | `'drawer'` | Row click behavior configuration. Can be a string ('drawer', 'navigate', 'custom') or a config object with action and additional options. |
| selectedRow | `Row \| null` | — | Currently selected row object. Used to highlight the active row in the table. |
| drawerOpen | `boolean` | — | Whether the detail drawer is currently open. Controls visual state of selected row. |
| isLoading | `boolean` | — | Loading state for initial data fetch. Displays skeleton placeholders when true. |
| isFetching | `boolean` | — | Loading state for subsequent data updates (e.g., pagination, filtering). Shows a subtle loading indicator without replacing content. |

### Code Examples

<!-- drawer-default.jsx -->
```jsx
// Default behavior - opens a detail drawer on row click
<TableBody />
```

<!-- navigate-mode.jsx -->
```jsx
// Navigate to detail page on row click
<TableBody defaultDetailView="navigate" />
```

<!-- navigate-custom-url.jsx -->
```jsx
// Navigate with a custom URL template
<TableBody
  defaultDetailView={{
    action: "navigate",
    navigateUrlTemplate: "/users/{object_uuid}/profile"
  }}
/>
```

<!-- custom-handler.jsx -->
```jsx
// Custom row click handler
<TableBody
  defaultDetailView={{
    action: "custom",
    customHandler: (row) => console.log(row.original)
  }}
/>
```

---

## TableHeader

**Component** | Page header component with title, count, and action buttons.

### Sections
- Props
- Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string \| ReactNode` | — | Header title text or custom React element. Supports plain strings or JSX for rich formatting. |
| totalCount | `number` | — | Total number of items in the dataset. Displayed as a badge next to the title. |
| showCount | `boolean` | `true` | Show or hide the total count badge next to the title. |
| showAddButton | `boolean` | — | Show or hide the add/create button in the header actions area. |
| addButtonTitle | `string \| ReactNode` | — | Custom text or element for the add button. Defaults to a standard "Add" label. |
| onAddClick | `function` | — | Custom click handler for the add button. Overrides the default behavior of opening the built-in form drawer. |
| extraActions | `ReactNode` | — | Additional action elements rendered alongside the default add button. Useful for export, import, or bulk action buttons. |
| children | `ReactNode` | — | Content rendered between the title area and the action buttons. Commonly used for filters, status tabs, or date range selectors. |
| api_endpoint | `string` | — | API endpoint for the default add form. Used by the built-in form drawer to submit new records. |
| enableDefaultAddForm | `boolean` | `true` | Enable or disable the built-in form drawer that opens when the add button is clicked. Set to false when using a custom add flow. |

### Code Examples

<!-- basic.jsx -->
```jsx
// Uses defaults from table context
<TableHeader />
```

<!-- custom-actions.jsx -->
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

<!-- html-title.jsx -->
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

<!-- with-children.jsx -->
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

<!-- disable-default-form.jsx -->
```jsx
<TableHeader
  enableDefaultAddForm={false}
  onAddClick={() => router.push('/products/new')}
/>
```

---

## TableUtilities

**Component** | Action bar with search, filters, upload/download, and column options.

### Sections
- Props
- Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| searchTerm | `string` | — | Current search input value. Use this for controlled search state. |
| onSearchChange | `function` | — | Callback invoked when the search input value changes. Receives the new search string as an argument. |
| onUploadClick | `function` | — | Custom handler for the upload button click. Overrides the default upload behavior. |
| onDownloadClick | `function` | — | Custom handler for the download button click. Overrides the default download behavior. |
| searchPlaceholder | `string` | `"Search"` | Placeholder text for the search input field. |
| showFiltersButton | `boolean` | `true` | Show or hide the filter toggle button that opens the filters panel. |
| showSearch | `boolean` | `true` | Show or hide the search input field. |
| showUpload | `boolean` | `true` | Show or hide the upload button. |
| showDownload | `boolean` | `true` | Show or hide the download button. |
| showColumnOptions | `boolean` | `true` | Show or hide the column visibility toggle dropdown. |
| children | `ReactNode` | — | Custom content rendered between the left-side actions (search, filters) and right-side actions (upload, download, columns). Useful for dropdowns, date pickers, or custom filter controls. |

### Code Examples

<!-- basic.jsx -->
```jsx
// All default controls visible
<TableUtilities />
```

<!-- hide-features.jsx -->
```jsx
// Hide upload and filters
<TableUtilities
  showUpload={false}
  showFiltersButton={false}
/>
```

<!-- custom-handlers.jsx -->
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

<!-- with-children.jsx -->
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

## TablePagination

**Component** | Pagination controls with page navigation and rows-per-page selection.

### Sections
- Props
- Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showRowsPerPage | `boolean` | `true` | Show or hide the rows-per-page selector dropdown. When hidden, the default page size is used. |
| rowsPerPageOptions | `number[]` | `[10, 20, 50, 100]` | Array of available page size options displayed in the rows-per-page dropdown. |
| className | `string` | — | Additional CSS classes applied to the pagination container for custom styling. |
| showPageInfo | `boolean` | `true` | Show or hide the "Page X of Y" information text between the navigation controls. |

### Code Examples

<!-- basic.jsx -->
```jsx
// Default pagination with all controls
<TablePagination />
```

<!-- custom-sizes.jsx -->
```jsx
<TablePagination
  rowsPerPageOptions={[5, 10, 25, 50]}
  showPageInfo={false}
/>
```

<!-- hide-rows-per-page.jsx -->
```jsx
<TablePagination showRowsPerPage={false} />
```

---

## TableSearch

**Component** | Standalone search input that syncs with table context.

### Sections
- Props
- Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| placeholder | `string` | `"Search..."` | Placeholder text displayed when the search input is empty. |
| className | `string` | — | Additional CSS classes applied to the search input element for custom styling. |
| containerClassName | `string` | — | Additional CSS classes applied to the outer container wrapping the search input and icons. |
| leftIcon | `ReactNode` | — | Custom left icon element. Defaults to a magnifying glass search icon. |
| rightIcon | `ReactNode` | — | Custom right icon element. Useful for adding a clear button or secondary action. |

### Code Examples

<!-- basic.jsx -->
```jsx
// Default search with automatic table context sync
<TableSearch />
```

<!-- customized.jsx -->
```jsx
<TableSearch
  placeholder="Search by name, email, or ID..."
  className="text-sm font-medium"
/>
```

<!-- custom-icons.jsx -->
```jsx
import { Filter, XCircle } from 'lucide-react';

<TableSearch
  placeholder="Filter results..."
  leftIcon={<Filter size={16} className="text-gray-400" />}
  rightIcon={
    <button
      onClick={handleClearSearch}
      className="text-gray-400 hover:text-gray-600"
    >
      <XCircle size={16} />
    </button>
  }
/>
```

---

## TableAddButton

**Component** | Configurable add button with built-in drawer and form integration.

### Sections
- Props
- Usage Examples
- Integration Patterns

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| buttonText | `string \| ReactNode` | — | Button label text or custom React element. Supports plain strings or JSX for rich content. |
| onClick | `function` | — | Custom click handler. When provided, the built-in drawer behavior is disabled and your handler is called instead. |
| variant | `string` | `"primary"` | Button style variant. Controls the visual appearance (color scheme) of the button. |
| size | `string` | `"md"` | Button size. Affects padding, font size, and overall dimensions. |
| className | `string` | — | Additional CSS classes for custom styling on the button element. |
| showIcon | `boolean` | `false` | Show or hide an icon alongside the button text. |
| icon | `ReactNode` | — | Custom icon element. Only displayed when showIcon is true. |
| iconPosition | `'left' \| 'right'` | `"left"` | Position of the icon relative to the button text. |
| onFormSuccess | `function` | — | Callback invoked after the built-in form is submitted successfully. Useful for triggering data refresh or showing notifications. |
| drawerTitle | `string` | — | Custom title for the form drawer. Overrides the default title derived from the table context. |
| drawerSize | `string` | `"md"` | Size of the form drawer panel. Supports standard drawer size values. |

### Code Examples

<!-- basic.jsx -->
```jsx
// Default add button with built-in form drawer
<TableAddButton />
```

<!-- custom-styling.jsx -->
```jsx
<TableAddButton
  buttonText="New Product"
  variant="secondary"
  size="lg"
  showIcon={true}
  className="shadow-md"
/>
```

<!-- custom-click.jsx -->
```jsx
<TableAddButton
  buttonText="Create Order"
  onClick={() => {
    // Navigate to a custom creation page
    router.push('/orders/create');
  }}
/>
```

<!-- form-success.jsx -->
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

<!-- custom-content.jsx -->
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

<!-- integration-pattern.jsx -->
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

## WorkflowStatus

**Workflow** | Manages workflow status transitions with full lifecycle control and custom rendering options.

### Sections
- Overview
- Props
- Callback Lifecycle
- Usage Patterns
- Programmatic Form Control

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| apiUrl | `string` | — | API endpoint for fetching workflow data. Uses DetailView context if not provided. |
| workflowDetails | `object` | — | Direct workflow data object. When provided, skips the API fetch and uses this data directly. |
| formContainerId | `string` | — | DOM element ID where the transition form should render. Enables portal rendering into custom containers like dialogs or modals. |
| onStatusChange | `() => void` | — | Callback invoked after a successful status transition completes. Use for refreshing data or updating UI. |
| beforeTransition | `(transition) => Promise<void>` | — | Async callback invoked before a transition starts. Useful for opening dialogs, validating state, or showing custom UI. |
| afterTransition | `(transition, success) => Promise<void>` | — | Async callback invoked after a transition completes. Receives the transition object and a boolean indicating success. |
| confirmationAlert | `Function` | — | Custom confirmation UI function. Replaces the default browser confirmation dialog before executing a transition. |
| renderTransitions | `Function` | — | Custom render function for the transitions UI. Receives the available transitions and allows complete control over their presentation. |
| onFormCancel | `React.Ref` | — | Ref that receives a function to programmatically close/cancel the active form. The ref value is a function when a form is shown, null otherwise. |

### Code Examples

<!-- auto-context.jsx -->
```jsx
// Inside a DetailView — no props needed
<WorkflowStatus />
```

<!-- standalone.jsx -->
```jsx
<WorkflowStatus
  apiUrl="/api/users/?object_uuid=123"
  onStatusChange={() => console.log("Changed!")}
/>
```

<!-- custom-form-container.jsx -->
```jsx
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/workflow";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        formContainerId="workflow-form-container"
        beforeTransition={async (transition) => {
          // Open the dialog before the form renders
          setShowDialog(true);
        }}
        afterTransition={async (transition, success) => {
          // Close the dialog after a successful transition
          if (success) {
            setShowDialog(false);
          }
        }}
        onStatusChange={() => {
          console.log("Status updated, refreshing...");
        }}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div id="workflow-form-container" />
      </Dialog>
    </div>
  );
}
```

<!-- custom-rendering.jsx -->
```jsx
<WorkflowStatus
  apiUrl="/api/orders/?object_uuid=123"
  renderTransitions={({ currentStatus, currentStatusMeta, transitions, onTransition }) => (
    <div className="flex items-center gap-3">
      <span
        className="px-3 py-1 rounded-full text-sm font-medium"
        style={{
          backgroundColor: currentStatusMeta?.status_color || '#e0e7ff',
          color: '#1e40af',
        }}
      >
        {currentStatusMeta?.status_label || currentStatus}
      </span>
      {transitions.map((t) => (
        <button
          key={t.name}
          onClick={() => onTransition(t)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm
                     hover:bg-indigo-700 transition-colors"
        >
          {t.display_name}
        </button>
      ))}
    </div>
  )}
/>
```

<!-- programmatic-cancel.jsx -->
```jsx
import { useRef } from "react";
import { WorkflowStatus } from "@zango-core/crud/workflow";

function OrderWorkflow() {
  const cancelRef = useRef(null);

  return (
    <div>
      <WorkflowStatus
        apiUrl="/api/orders/?object_uuid=123"
        onFormCancel={cancelRef}
      />

      <button
        onClick={() => cancelRef.current?.()}
        className="mt-4 px-4 py-2 text-sm text-gray-600 border rounded-lg
                   hover:bg-gray-50 transition-colors"
      >
        Close Form
      </button>
    </div>
  );
}
```

---

## WorkflowTags

**Workflow** | Manages workflow tags with toggle functionality and form-based transitions.

### Sections
- Props
- Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| apiUrl | `string` | — | API endpoint for fetching tag data. Uses DetailView context if not provided. |
| tagDetails | `TagDetail[]` | — | Direct tag data array. When provided, skips the API fetch and uses this data directly. |
| formContainerId | `string` | — | DOM element ID where the tag transition form should render. Enables portal rendering into dialogs or modals. |
| onTagChange | `() => void` | — | Callback invoked after a successful tag change. Use for refreshing data or closing modals. |
| beforeTagChange | `(tag, newState) => Promise<void>` | — | Async callback invoked before a tag change starts. Receives the tag object and the target state (enabled/disabled). |
| afterTagChange | `(tag, success) => Promise<void>` | — | Async callback invoked after a tag change completes. Receives the tag object and a boolean indicating success. |
| confirmationAlert | `Function` | — | Custom confirmation UI function. Replaces the default browser confirmation before toggling a tag. |
| renderTags | `Function` | — | Custom render function for the tags UI. Receives the tags array and toggle handler for complete control over presentation. |
| onFormCancel | `React.Ref` | — | Ref that receives a function to programmatically close/cancel the active tag form. The ref value is a function when a form is shown, null otherwise. |

### Code Examples

<!-- basic.jsx -->
```jsx
<WorkflowTags apiUrl="/api/users/?object_uuid=123" />
```

<!-- custom-container.jsx -->
```jsx
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowTags } from "@zango-core/crud/workflow";

function UserTags({ objectUuid }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <WorkflowTags
        apiUrl={`/api/users/?object_uuid=${objectUuid}`}
        formContainerId="tag-form-container"
        beforeTagChange={async (tag, newState) => {
          console.log(`About to ${newState} tag: ${tag.tag_label}`);
          setShowModal(true);
        }}
        afterTagChange={async (tag, success) => {
          if (!success) {
            console.error("Tag change failed for:", tag.tag_label);
          }
        }}
        onTagChange={() => {
          setShowModal(false);
        }}
      />

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <div id="tag-form-container" />
      </Dialog>
    </div>
  );
}
```

<!-- custom-rendering.jsx -->
```jsx
<WorkflowTags
  apiUrl="/api/users/?object_uuid=123"
  renderTags={({ tags, onToggle }) => (
    <div className="grid grid-cols-2 gap-4">
      {tags.map((tag) => (
        <div
          key={tag.name}
          className="flex items-center justify-between p-4 rounded-xl
                     border border-gray-200 bg-white shadow-sm"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{tag.tag_label}</p>
            <p className="text-xs text-gray-500 mt-1">
              {tag.state === "enabled" ? "Active" : "Inactive"}
            </p>
          </div>
          <button
            onClick={() => onToggle(tag)}
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors
              ${tag.state === "enabled" ? "bg-indigo-600" : "bg-gray-200"}`}
            role="switch"
            aria-checked={tag.state === "enabled"}
            disabled={tag.state === "enabled" ? !tag.is_disable_allowed : !tag.is_enable_allowed}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transform
                transition-transform mt-0.5
                ${tag.state === "enabled" ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
      ))}
    </div>
  )}
/>
```

---

## Hooks Reference

**Hooks** | Complete reference for all hooks available in @zango-core/crud/table.

### Sections
- useTable()
- useTableData()
- useTableSearch()
- useTableFilters()
- useTablePagination()
- useTableSelection()
- useTableColumns()
- useTableActions()
- useTableRowActions()
- useDetailView()
- useDetailViewContext()
- useWorkflow()

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | `array` | — | Flat array of row objects for the current page. |
| totalCount | `number` | — | Total number of rows across all pages. |
| isLoading | `boolean` | — | True while data is being fetched. |
| currentPage | `number` | — | Zero-based index of the current page. |
| rowsPerPage | `number` | — | Number of rows displayed per page. |
| totalPages | `number` | — | Total number of pages. |
| hasPreviousPage | `boolean` | — | Whether a previous page exists. |
| hasNextPage | `boolean` | — | Whether a next page exists. |
| setCurrentPage | `(page: number) => void` | — | Navigate to a specific page. |
| setRowsPerPage | `(size: number) => void` | — | Change the page size. |
| selectedDetailRow | `object \| null` | — | The row currently open in the detail drawer. |
| openDetailDrawer | `(row) => void` | — | Open the detail drawer for a row. |
| closeDetailDrawer | `() => void` | — | Close the detail drawer. |
| navigateToNextEntry | `() => void` | — | Move the detail drawer to the next row. |
| navigateToPreviousEntry | `() => void` | — | Move the detail drawer to the previous row. |
| searchTerm | `string` | — | Current search query. |
| setSearchTerm | `(term: string) => void` | — | Update the search query. |
| activeFilterCount | `number` | — | Number of currently active filters. |
| handleRowClick | `(row) => void` | — | Default row-click handler that opens the detail drawer. |
| refetch | `() => void` | — | Re-fetch data from the API. |
| api_endpoint | `string` | — | The resolved API endpoint URL. |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **apiUrl** * | `string` | — | API endpoint to fetch rows from. |
| columns | `array` | — | Column definitions. If omitted, derived from tableMetadata. |
| tableMetadata | `object` | — | Pre-fetched metadata object. If omitted, fetched from apiUrl. |

#### Props Table 3

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| flatData | `array` | — | Flat array of row objects for the current page. |
| totalDBRowCount | `number` | — | Total row count reported by the server. |
| totalPages | `number` | — | Computed total pages based on row count and page size. |
| isLoading | `boolean` | — | True during the initial data load. |
| isFetching | `boolean` | — | True during any fetch, including background refetches. |
| error | `Error \| null` | — | Error object if the fetch failed. |
| searchTerm | `string` | — | Current search term sent to the server. |
| setSearchTerm | `(term: string) => void` | — | Update the search term. |
| filterObj | `object` | — | Current filter state sent to the server. |
| setFilterObj | `(filters: object) => void` | — | Replace all active filters. |
| currentPage | `number` | — | Zero-based current page index. |
| setCurrentPage | `(page: number) => void` | — | Navigate to a page. |
| rowsPerPage | `number` | — | Rows per page. |
| setRowsPerPage | `(size: number) => void` | — | Change page size. |
| sorting | `array` | — | Current sorting state array. |
| setSorting | `(sorting: array) => void` | — | Update sorting. |
| tableMetadata | `object` | — | Resolved table metadata (fetched or passed in). |
| columns | `array` | — | Effective column definitions used by the table. |
| refetch | `() => void` | — | Re-fetch the current page of data. |

#### Props Table 4

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| searchTerm | `string` | — | The raw search input value (updates on every keystroke). |
| setSearchTerm | `(term: string) => void` | — | Update the search input. |
| debouncedSearchTerm | `string` | — | The debounced value actually sent to the API. |

#### Props Table 5

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| filterObj | `object` | — | Current filter key-value map sent to the API. |
| setFilterObj | `(filters: object) => void` | — | Replace the entire filter state. |
| activeFilterCount | `number` | — | Number of non-empty filter entries. |
| clearFilters | `() => void` | — | Remove all active filters. |
| hasActiveFilters | `boolean` | — | True when at least one filter is active. |

#### Props Table 6

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| currentPage | `number` | — | Zero-based index of the current page. |
| totalPages | `number` | — | Total number of pages. |
| rowsPerPage | `number` | — | Rows displayed per page. |
| setCurrentPage | `(page: number) => void` | — | Jump to a specific page. |
| setRowsPerPage | `(size: number) => void` | — | Change the page size (resets to page 0). |
| hasPreviousPage | `boolean` | — | Whether navigating backward is possible. |
| hasNextPage | `boolean` | — | Whether navigating forward is possible. |
| goToFirstPage | `() => void` | — | Navigate to the first page. |
| goToLastPage | `() => void` | — | Navigate to the last page. |

#### Props Table 7

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| selectedRows | `array` | — | Array of currently selected row objects or IDs. |
| setSelectedRows | `(rows: array) => void` | — | Directly set the selected rows. |
| isAllSelected | `boolean` | — | True when every visible row is selected. |
| toggleSelectAll | `() => void` | — | Select all visible rows, or deselect all if already selected. |
| toggleSelectRow | `(row) => void` | — | Toggle selection for a single row. |
| clearSelection | `() => void` | — | Deselect all rows. |

#### Props Table 8

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| visibleColumns | `array` | — | Array of currently visible column definitions. |
| hiddenColumns | `array` | — | Array of currently hidden column definitions. |
| toggleColumnVisibility | `(columnId: string) => void` | — | Toggle a column between visible and hidden. |
| showColumn | `(columnId: string) => void` | — | Make a specific column visible. |
| hideColumn | `(columnId: string) => void` | — | Hide a specific column. |
| showAllColumns | `() => void` | — | Make all columns visible. |
| hideAllColumns | `() => void` | — | Hide all columns. |
| isColumnVisible | `(columnId: string) => boolean` | — | Check if a column is currently visible. |
| moveColumn | `(columnId: string, newIndex: number) => void` | — | Reorder a column to a new position. |
| pinColumnLeft | `(columnId: string) => void` | — | Pin a column to the left side of the table. |
| pinColumnRight | `(columnId: string) => void` | — | Pin a column to the right side of the table. |

#### Props Table 9

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| refetch | `() => void` | — | Re-fetch the table data from the server. |
| exportTable | `() => void` | — | Trigger an export of the current table data. |

#### Props Table 10

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| handleRowClick | `(row) => void` | — | Default handler that opens the detail drawer for the clicked row. |
| selectedDetailRow | `object \| null` | — | The row currently displayed in the detail drawer. |
| openDetailDrawer | `(row) => void` | — | Programmatically open the detail drawer for a row. |
| closeDetailDrawer | `() => void` | — | Close the detail drawer. |
| navigateToNextEntry | `() => void` | — | Move the detail drawer to the next row in the list. |
| navigateToPreviousEntry | `() => void` | — | Move the detail drawer to the previous row in the list. |

#### Props Table 11

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| apiUrl | `string` | — | API endpoint for the detail record. Automatically resolved from context if inside a DetailViewProvider. |

#### Props Table 12

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | `object` | — | The fetched detail data for the current object. |
| loading | `boolean` | — | True while detail data is being fetched. |
| error | `string \| null` | — | Error message if the detail fetch failed. |
| refresh | `() => Promise<void>` | — | Re-fetch the detail data from the API. |
| objectUuid | `string` | — | UUID of the current detail object. |
| workflowDetails | `object` | — | Workflow data for the object (current_status, current_status_meta, next_transitions, tag_details). |
| rowActions | `array` | — | Available row-level actions for the current object. |

#### Props Table 13

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | `object` | — | Detail data from the shared context. |
| loading | `boolean` | — | True while the shared detail fetch is in progress. |
| error | `string \| null` | — | Error from the shared detail fetch. |
| refresh | `() => Promise<void>` | — | Re-fetch detail data for the entire context. |
| objectUuid | `string` | — | UUID of the current detail object. |
| workflowDetails | `object` | — | Workflow data from the shared context. |
| rowActions | `array` | — | Row-level actions from the shared context. |

#### Props Table 14

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **apiUrl** * | `string` | — | API endpoint for fetching workflow data. |
| beforeTransition | `(transition) => Promise<void>` | — | Async callback invoked before executing a transition. |
| afterTransition | `(transition, success) => Promise<void>` | — | Async callback invoked after a transition completes. |

#### Props Table 15

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| workflowDetails | `object` | — | Full workflow data: current_status, current_status_meta, next_transitions, and tag_details. |
| loading | `boolean` | — | True while workflow data is being fetched. |
| error | `string \| null` | — | Error message if the workflow fetch or operation failed. |
| refreshWorkflow | `() => Promise<void>` | — | Re-fetch workflow data from the API. |
| executeTransition | `(transition, formData?) => Promise<boolean>` | — | Execute a status transition. Optionally pass form data. Returns success boolean. |
| toggleTag | `(tag) => Promise<boolean>` | — | Toggle a tag on or off. Returns success boolean. |

### Code Examples

<!-- use-table.jsx -->
```jsx
import { useTable } from "@zango-core/crud/table";

function OrdersPage() {
  const { data, isLoading, totalCount, refetch } = useTable();
  if (isLoading) return <p>Loading…</p>;
  return <p>{totalCount} orders loaded. <button onClick={refetch}>Refresh</button></p>;
}
```

<!-- use-table-data.jsx -->
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

<!-- use-table-search.jsx -->
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

<!-- use-table-filters.jsx -->
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

<!-- use-table-pagination.jsx -->
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

<!-- use-table-selection.jsx -->
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

<!-- use-table-columns.jsx -->
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

<!-- use-table-actions.jsx -->
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

<!-- use-table-row-actions.jsx -->
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

<!-- use-detail-view.jsx -->
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

<!-- use-detail-view-context.jsx -->
```jsx
import { useDetailViewContext } from "@zango-core/crud/table";

function StatusBadge() {
  const { workflowDetails, loading } = useDetailViewContext();
  if (loading || !workflowDetails) return null;
  return <span className="badge">{workflowDetails.current_status_meta?.status_label}</span>;
}
```

<!-- use-workflow.jsx -->
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

---

## FormRenderer

**Forms** | Dual-mode form engine with server-driven and local RJSF schema support, multi-step forms, autocomplete, and form sync.

### Sections
- Import
- Props
- Server Response Format
- Server-Driven Mode
- Local RJSF Mode
- Multi-Step Forms
- Form Sync
- Autocomplete
- Integration with CrudHandler
- Submit Button Portal
- Choosing Between Modes

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| api_endpoint | `string` | — | Enables server-driven mode. The endpoint used to GET the form schema and POST form submissions. When provided, rjsf_schema and onSubmit are ignored. |
| getParams | `object` | `{ action: 'initialize_form' }` | Query parameters appended to the GET request when fetching the form schema in server-driven mode. Override to load edit forms or pass context. |
| postParams | `object` | `{ form_type: 'create_form' }` | Query parameters appended to the POST request when submitting the form in server-driven mode. Typically set to { form_type: "edit_form", object_uuid: "..." } for updates. |
| showConfirmAlert | `boolean` | `false` | When true, displays a confirmation dialog before submitting the form. Uses the browser default unless customConfirmAlert is provided. |
| customConfirmAlert | `ReactNode \| Function` | — | Custom confirmation UI rendered when showConfirmAlert is true. Receives { onConfirm, onCancel } props. Return a React element that calls onConfirm to proceed or onCancel to abort. |
| rjsf_schema | `object` | — | Local RJSF schema object with shape { schema, uiSchema, formData }. Enables local mode for client-side form rendering without any server calls. Ignored if api_endpoint is provided. |
| onSubmit | `function` | — | Client-side submit handler for local mode. Receives the validated formData as its argument. Can return a promise. Ignored if api_endpoint is provided. |
| onResponse | `function` | — | Callback invoked after a successful form submission. Receives the full server response object (server mode) or the return value of onSubmit (local mode). |
| onError | `function` | — | Callback invoked when form submission fails. Receives the error object. Use this for toast notifications or error logging. |
| customWidgets | `object` | — | Map of custom RJSF widget names to React components. Merged with the default widget set. Reference a custom widget in ui_schema via "ui:widget": "yourWidgetName". |
| submitButtonContainerId | `string` | — | DOM element ID where the submit button should be portaled via React.createPortal. Useful for placing the submit button outside the form, e.g., in a dialog footer. The target element must exist in the DOM when the form mounts. |
| skipAutoRefresh | `boolean` | `false` | When true, prevents the automatic table refresh that normally occurs after a successful form submission in CrudHandler integration. Useful when you want to handle refresh logic manually. |

### Code Examples

<!-- import.jsx -->
```jsx
import { FormRenderer } from "@zango-core/crud/form";
```

<!-- server-response.json -->
```json
// GET /api/users/?action=initialize_form
{
  "success": true,
  "response": {
    "is_multistep": false,
    "form": {
      "json_schema": {
        "type": "object",
        "required": ["name", "email"],
        "properties": {
          "name": { "type": "string", "title": "Full Name" },
          "email": { "type": "string", "title": "Email", "format": "email" },
          "role": {
            "type": "string",
            "title": "Role",
            "enum": ["Admin", "Editor", "Viewer"]
          }
        }
      },
      "ui_schema": {
        "name": { "ui:placeholder": "Enter full name", "ui:autofocus": true },
        "email": { "ui:placeholder": "user@company.com" },
        "role": { "ui:placeholder": "Select a role" },
        "ui:order": ["name", "email", "role"]
      },
      "form_data": {}
    }
  }
}
```

<!-- submit-response.json -->
```json
// POST /api/users/?form_type=create_form
// Request body: { "name": "Jane Doe", "email": "jane@acme.com", "role": "Admin" }

// Success response:
{
  "success": true,
  "response": {
    "message": "User created successfully"
  }
}

// Validation error response:
{
  "success": false,
  "response": {
    "message": "Validation failed",
    "errors": {
      "email": "A user with this email already exists"
    }
  }
}
```

<!-- server-basic.jsx -->
```jsx
import { FormRenderer } from "@zango-core/crud/form";

function CreateUserForm() {
  return (
    <FormRenderer
      api_endpoint="/api/users/"
      onResponse={(response) => {
        console.log("Form submitted successfully:", response);
      }}
      onError={(error) => {
        console.error("Form submission failed:", error);
      }}
    />
  );
}

// GET  /api/users/?action=initialize_form      --> fetches schema
// POST /api/users/?form_type=create_form        --> submits data
```

<!-- server-edit-form.jsx -->
```jsx
<FormRenderer
  api_endpoint="/api/users/"
  getParams={{
    action: "initialize_form",
    form_type: "edit_form",
    object_uuid: "abc-123-def-456",
  }}
  postParams={{
    form_type: "edit_form",
    object_uuid: "abc-123-def-456",
  }}
  onResponse={(response) => {
    console.log("User updated:", response);
  }}
  onError={(error) => {
    console.error("Update failed:", error);
  }}
/>

// GET  /api/users/?action=initialize_form&form_type=edit_form&object_uuid=abc-123-def-456
// POST /api/users/?form_type=edit_form&object_uuid=abc-123-def-456
```

<!-- server-confirm.jsx -->
```jsx
<FormRenderer
  api_endpoint="/api/users/"
  showConfirmAlert={true}
  customConfirmAlert={({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Confirm Submission</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to save these changes?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700
                       hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                       hover:bg-indigo-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )}
  onResponse={(response) => {
    console.log("Submitted with confirmation:", response);
  }}
/>
```

<!-- local-rjsf.jsx -->
```jsx
import { FormRenderer } from "@zango-core/crud/form";

const userFormSchema = {
  schema: {
    type: "object",
    required: ["name", "email"],
    properties: {
      name: {
        type: "string",
        title: "Full Name",
        minLength: 2,
      },
      email: {
        type: "string",
        title: "Email Address",
        format: "email",
      },
      department: {
        type: "string",
        title: "Department",
        enum: ["Engineering", "Design", "Marketing", "Sales", "Support"],
      },
      bio: {
        type: "string",
        title: "Bio",
        maxLength: 500,
      },
      active: {
        type: "boolean",
        title: "Active Employee",
        default: true,
      },
    },
  },
  uiSchema: {
    name: {
      "ui:placeholder": "Enter full name",
      "ui:autofocus": true,
    },
    email: {
      "ui:placeholder": "user@company.com",
    },
    department: {
      "ui:placeholder": "Select department",
    },
    bio: {
      "ui:widget": "textarea",
      "ui:placeholder": "Tell us about yourself...",
      "ui:options": { rows: 4 },
    },
    active: {
      "ui:widget": "checkbox",
    },
    "ui:order": ["name", "email", "department", "bio", "active"],
  },
  formData: {
    active: true,
  },
};

function CreateUserForm() {
  return (
    <FormRenderer
      rjsf_schema={userFormSchema}
      onSubmit={async (formData) => {
        // Handle submission client-side
        const response = await fetch("/api/users/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        return response.json();
      }}
      onResponse={(result) => {
        console.log("User created:", result);
      }}
      onError={(error) => {
        console.error("Failed to create user:", error);
      }}
    />
  );
}
```

<!-- multistep-response.json -->
```json
// GET /api/onboarding/?action=initialize_form
{
  "success": true,
  "response": {
    "is_multistep": true,
    "form": {
      "json_schema": {
        "type": "object",
        "properties": {
          "step_1": {
            "type": "object",
            "title": "Personal Information",
            "required": ["first_name", "last_name"],
            "properties": {
              "first_name": { "type": "string", "title": "First Name" },
              "last_name": { "type": "string", "title": "Last Name" },
              "phone": { "type": "string", "title": "Phone Number" }
            }
          },
          "step_2": {
            "type": "object",
            "title": "Company Details",
            "required": ["company_name"],
            "properties": {
              "company_name": { "type": "string", "title": "Company Name" },
              "role": {
                "type": "string",
                "title": "Role",
                "enum": ["Admin", "Manager", "Employee"]
              }
            }
          },
          "step_3": {
            "type": "object",
            "title": "Preferences",
            "properties": {
              "notifications": {
                "type": "boolean",
                "title": "Enable Notifications",
                "default": true
              },
              "theme": {
                "type": "string",
                "title": "Theme",
                "enum": ["Light", "Dark", "System"]
              }
            }
          }
        }
      },
      "ui_schema": {
        "step_1": {
          "first_name": { "ui:placeholder": "Enter first name", "ui:autofocus": true },
          "last_name": { "ui:placeholder": "Enter last name" },
          "phone": { "ui:placeholder": "+1 (555) 000-0000" }
        },
        "step_2": {
          "company_name": { "ui:placeholder": "Enter company name" },
          "role": { "ui:placeholder": "Select your role" }
        },
        "step_3": {}
      },
      "form_data": {}
    }
  }
}
```

<!-- multistep-usage.jsx -->
```jsx
// The same FormRenderer component -- the wizard UI is driven entirely
// by the server response shape.
<FormRenderer
  api_endpoint="/api/onboarding/"
  onResponse={(response) => {
    console.log("Onboarding complete:", response);
    // Navigate to dashboard, show success toast, etc.
  }}
  onError={(error) => {
    console.error("Onboarding failed:", error);
  }}
/>
```

<!-- sync-ui-schema.json -->
```json
{
  "country": {
    "ui:placeholder": "Select country",
    "ui:options": { "syncOnChange": true }
  },
  "state": {
    "ui:placeholder": "Select state",
    "ui:options": { "syncOnChange": true }
  },
  "city": {
    "ui:placeholder": "Select city"
  }
}
```

<!-- sync-request.json -->
```json
// User selects "India" in the country dropdown.
// FormRenderer automatically sends:

// POST /api/address/?form_action=sync_form
// Request body:
{
  "country": "India",
  "state": "",
  "city": ""
}

// Server returns the full updated schema with state options filtered by country:
{
  "success": true,
  "response": {
    "is_multistep": false,
    "form": {
      "json_schema": {
        "type": "object",
        "properties": {
          "country": {
            "type": "string",
            "title": "Country",
            "enum": ["India", "USA", "UK"]
          },
          "state": {
            "type": "string",
            "title": "State",
            "enum": ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"]
          },
          "city": { "type": "string", "title": "City" }
        }
      },
      "ui_schema": {
        "country": {
          "ui:placeholder": "Select country",
          "ui:options": { "syncOnChange": true }
        },
        "state": {
          "ui:placeholder": "Select state",
          "ui:options": { "syncOnChange": true }
        },
        "city": { "ui:placeholder": "Select city" }
      },
      "form_data": {
        "country": "India",
        "state": "",
        "city": ""
      }
    }
  }
}
```

<!-- autocomplete-schema.json -->
```json
{
  "json_schema": {
    "type": "object",
    "required": ["vendor"],
    "properties": {
      "vendor": {
        "type": "string",
        "title": "Vendor"
      },
      "material": {
        "type": "string",
        "title": "Material"
      }
    }
  },
  "ui_schema": {
    "vendor": {
      "ui:widget": "autocomplete",
      "ui:placeholder": "Search vendors..."
    },
    "material": {
      "ui:widget": "autocomplete",
      "ui:placeholder": "Search materials..."
    }
  },
  "form_data": {}
}
```

<!-- autocomplete-request.json -->
```json
// User types "Acm" in the vendor field.
// FormRenderer sends (after debounce):

// POST /api/purchase-orders/?form_action=fetch_autocomplete_options
// Request body:
{
  "field_name": "vendor",
  "search_query": "Acm"
}

// Server response:
{
  "success": true,
  "response": {
    "options": [
      { "label": "Acme Corp", "value": "acme-uuid-001" },
      { "label": "Acme Industries", "value": "acme-uuid-002" },
      { "label": "Acmatic Solutions", "value": "acmatic-uuid-003" }
    ]
  }
}
```

<!-- crud-integration.jsx -->
```jsx
import { useState } from "react";
import { CrudHandler } from "@zango-core/crud/table";
import { FormRenderer } from "@zango-core/crud/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function UserManagement() {
  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: null,     // "create" | "edit"
    uuid: null,
  });

  const openCreateForm = () => {
    setFormDialog({ open: true, mode: "create", uuid: null });
  };

  const openEditForm = (uuid) => {
    setFormDialog({ open: true, mode: "edit", uuid });
  };

  const closeForm = () => {
    setFormDialog({ open: false, mode: null, uuid: null });
  };

  return (
    <div>
      <CrudHandler
        api_endpoint="/api/users/"
        headerProps={{
          title: "User Management",
          customRightActions: (
            <button
              onClick={openCreateForm}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
            >
              Add User
            </button>
          ),
        }}
        customTableBody={({ data }) => (
          <table className="w-full">
            <tbody>
              {data?.map((row) => (
                <tr key={row.uuid} className="border-b hover:bg-gray-50">
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.email}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openEditForm(row.uuid)}
                      className="text-indigo-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      />

      {/* Add/Edit Dialog with FormRenderer */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(open) => !open && closeForm()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formDialog.mode === "edit" ? "Edit User" : "Add User"}
            </DialogTitle>
          </DialogHeader>

          {formDialog.open && (
            <FormRenderer
              api_endpoint="/api/users/"
              getParams={{
                action: "initialize_form",
                ...(formDialog.mode === "edit" && {
                  form_type: "edit_form",
                  object_uuid: formDialog.uuid,
                }),
              }}
              postParams={{
                form_type:
                  formDialog.mode === "edit" ? "edit_form" : "create_form",
                ...(formDialog.uuid && { object_uuid: formDialog.uuid }),
              }}
              submitButtonContainerId="user-form-footer"
              onResponse={() => {
                closeForm();
                // CrudHandler auto-refreshes the table after submission
              }}
              onError={(error) => {
                console.error("Form error:", error);
              }}
            />
          )}

          <DialogFooter>
            <button
              onClick={closeForm}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            {/* Submit button is portaled here */}
            <div id="user-form-footer" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

<!-- submit-portal.jsx -->
```jsx
import { FormRenderer } from "@zango-core/crud/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function UserFormDialog({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        {/* Form body renders here, without the submit button */}
        <FormRenderer
          api_endpoint="/api/users/"
          submitButtonContainerId="user-form-footer"
          onResponse={() => onClose()}
        />

        <DialogFooter>
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          {/* The submit button is portaled into this container */}
          <div id="user-form-footer" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Render Props

**Advanced** | Custom rendering for action, status, and tag columns while maintaining all functionality and state management.

### Sections
- Overview
- Actions Column
- Status Column
- Tags Column

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| actions | `any[]` | — | Array of available action objects for the current row, each containing name, label, and configuration. |
| row | `any` | — | The full table row data object. Access fields via row.original for raw API data. |
| onActionClick | `(action) => void` | — | Trigger the action execution pipeline for a given action. Handles confirmations, API calls, and table refresh. |
| menuOpen | `boolean` | — | Current state of the dropdown menu. Use this to control visual state of custom menus. |
| setMenuOpen | `(open) => void` | — | Control the dropdown menu visibility. Call with true to open, false to close. |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `any` | — | The raw status value from the API response. Can be a string, object, or HTML string. |
| statusValue | `string` | — | The resolved status string ready for display. Extracted from value regardless of its original format. |
| isObject | `boolean` | — | True if the raw value is an object (e.g., { status_label: "Active", status_color: "#12B76A" }). |
| isString | `boolean` | — | True if the raw value is a plain string. |
| isHtml | `boolean` | — | True if the raw value contains HTML markup that needs special rendering. |

#### Props Table 3

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| tags | `any[]` | — | The complete array of all tags assigned to the row. |
| visibleTags | `any[]` | — | Subset of tags displayed inline, sliced to fit within the maxVisible limit. |
| remainingTags | `any[]` | — | Tags that overflow beyond the visible limit. Display these in a popover or tooltip. |
| hasMoreTags | `boolean` | — | True if there are more tags than the maxVisible count allows. Use to conditionally render overflow UI. |
| maxVisible | `number` | — | The maximum number of tags shown inline before overflow. Determined by the table column configuration. |

### Code Examples

<!-- render-props-overview.jsx -->
```jsx
import { Table } from "@zango-core/crud/table";

<Table
  apiUrl="/api/users"
  tableMetadataObj={metadata}
  renderActions={({ actions, row, onActionClick }) => (
    // Custom actions UI
  )}
  renderStatus={({ statusValue, isObject }) => (
    // Custom status badge
  )}
  renderTags={({ visibleTags, remainingTags, hasMoreTags }) => (
    // Custom tag layout
  )}
/>
```

<!-- custom-actions.jsx -->
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
            key={action.name}
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onActionClick(action);
            }}
          >
            {action.label}
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
                  key={action.name}
                  onClick={() => onActionClick(action)}
                >
                  {action.label}
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

<!-- custom-status.jsx -->
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

    const key = statusValue?.toLowerCase() || 'inactive';
    const colors = statusColors[key] || statusColors.inactive;

    // Handle HTML status values
    if (isHtml) {
      return (
        <span
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
        {statusValue}
      </span>
    );
  }}
/>
```

<!-- custom-tags.jsx -->
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
            {typeof tag === 'object' ? tag.label || tag.name : tag}
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
                      {typeof tag === 'object' ? tag.label || tag.name : tag}
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

---

## Advanced Features

**Advanced** | Programmatic form control, portal rendering, error handling, and migration guides.

### Sections
- Programmatic Form Control (onFormCancel)
- Glitch-Free Portal Rendering
- Error Handling & Timeouts
- Migration Guide

### Code Examples

<!-- programmatic-form-control.jsx -->
```jsx
import { useRef } from "react";
import { WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const statusFormRef = useRef(null);
  const tagFormRef = useRef(null);

  const closeAllForms = () => {
    statusFormRef.current?.();
    tagFormRef.current?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Order Detail</h2>
        <button
          onClick={closeAllForms}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300
                     rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close All Forms
        </button>
      </div>

      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        onFormCancel={statusFormRef}
      />

      <WorkflowTags
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        onFormCancel={tagFormRef}
      />
    </div>
  );
}
```

<!-- glitch-free-portal.jsx -->
```jsx
import { useState, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderWorkflow({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogReady, setDialogReady] = useState(false);
  const cancelRef = useRef(null);

  // When dialog opens, wait for DOM to be ready before enabling portal
  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => {
        setDialogReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDialogReady(false);
    }
  }, [showDialog]);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        formContainerId={dialogReady ? "workflow-form-portal" : undefined}
        onFormCancel={cancelRef}
        beforeTransition={async (transition) => {
          setShowDialog(true);
          // Wait for dialog DOM to mount
          await new Promise((resolve) => setTimeout(resolve, 100));
        }}
        afterTransition={async (transition, success) => {
          if (success) {
            setShowDialog(false);
          }
        }}
      />

      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          if (!open) {
            cancelRef.current?.();
            setShowDialog(false);
          }
        }}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transition Form</h3>
          <div id="workflow-form-portal" />
        </div>
      </Dialog>
    </div>
  );
}
```

<!-- error-handling.jsx -->
```jsx
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderWorkflow({ objectUuid }) {
  return (
    <WorkflowStatus
      apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
      afterTransition={async (transition, success) => {
        if (!success) {
          // The component already displays an error message.
          // Use this callback for additional error handling:
          console.error("Transition failed:", transition.label);

          // Send to error tracking
          // errorTracker.capture("workflow_transition_failed", { transition });
        }
      }}
      onStatusChange={() => {
        // Only called on success — safe to refresh data here
        window.location.reload();
      }}
    />
  );
}

// The component renders error states automatically:
//
// +------------------------------------------+
// |  ⚠ Transition failed                      |
// |  Could not complete "Approve Order".      |
// |  Please try again or contact support.     |
// |                                           |
// |  [Retry]  [Dismiss]                       |
// +------------------------------------------+
```

<!-- before-migration.jsx -->
```jsx
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        formContainerId="workflow-form"
        beforeTransition={async () => {
          setShowDialog(true);
        }}
        afterTransition={async (transition, success) => {
          if (success) setShowDialog(false);
        }}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div id="workflow-form" />
      </Dialog>
    </div>
  );
}
```

<!-- after-migration.jsx -->
```jsx
import { useState, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogReady, setDialogReady] = useState(false);  // NEW: track DOM readiness
  const cancelRef = useRef(null);                          // NEW: programmatic cancel

  // NEW: delay portal activation until dialog DOM is mounted
  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => setDialogReady(true), 100);
      return () => clearTimeout(timer);
    }
    setDialogReady(false);
  }, [showDialog]);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        formContainerId={dialogReady ? "workflow-form" : undefined}  // CHANGED: conditional
        onFormCancel={cancelRef}                                      // NEW: cancel ref
        beforeTransition={async () => {
          setShowDialog(true);
          await new Promise((r) => setTimeout(r, 100));              // NEW: wait for DOM
        }}
        afterTransition={async (transition, success) => {
          if (success) setShowDialog(false);
        }}
      />

      <Dialog
        open={showDialog}
        onOpenChange={(open) => {                                    // CHANGED: cleanup on close
          if (!open) {
            cancelRef.current?.();
            setShowDialog(false);
          }
        }}
      >
        <div id="workflow-form" />
      </Dialog>
    </div>
  );
}
```

---

## Quick Start

**Getting Started** | Create and launch a new Zango frontend app in minutes.

### Sections
- Create Your App
- Configure Environment
- Start Development
- Create Your First Custom Page
- Add CRUD Page
- Build for Production
- Available Scripts

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| --verbose | `boolean` | — | Print additional logs during scaffolding. |
| --use-pnpm | `boolean` | — | Use pnpm as the package manager. |
| --skip-install | `boolean` | — | Skip installing dependencies after project creation. |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| VITE_API_BASE_URL | `string` | `http://localhost:8000` | Backend API URL. In dev, the Vite dev server proxies requests here. |
| VITE_PROXY_ROUTES | `string` | `/api,/zango,/frame` | Comma-separated routes to proxy to backend. MUST include ALL backend routes your app uses (app initializer, CRUD endpoints, workflow, etc.). |
| VITE_APP_ENV | `string` | `development` | Environment flag (development / staging / production). |

#### Props Table 3

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| npm run dev | `string` | — | Start development server on port 3000 with hot reload and backend proxying. |
| npm run build | `string` | — | Production build to dist/ directory. |
| npm run build:zango | `string` | — | Single-file build for Zango platform deployment (IIFE format). |
| npm run preview | `string` | — | Preview the production build locally. |

### Code Examples

<!-- terminal -->
```bash
npx @zango-core/create-zango-app my-app
```

<!-- npm -->
```bash
npm init @zango-core/zango-app my-app
```

<!-- yarn -->
```bash
yarn create @zango-core/zango-app my-app
```

<!-- pnpm -->
```bash
pnpm create @zango-core/zango-app my-app
```

<!-- terminal -->
```bash
cd my-app\ncp .env.example .env
```

<!-- terminal -->
```bash
npm run dev
```

<!-- src/custom/pages/Dashboard.jsx -->
```jsx
const Dashboard = () => {
  return (
    <div style={{ padding: 32 }}>
      <h1>Dashboard</h1>
      <p>Welcome to my app!</p>
    </div>
  );
};

export default Dashboard;
```

<!-- src/custom/pages/index.js -->
```jsx
export { default as Dashboard } from './Dashboard';
```

<!-- backend-route-config.json -->
```json
{
  "path": "/app/patients",
  "page_type": "crud",
  "entity": "Patient"
}
```

<!-- terminal -->
```bash
npm run build          # Standard build to dist/
npm run build:zango    # Single-file build for Zango platform
```

---

## Project Structure

**Getting Started** | Understanding the file structure of a Zango frontend app.

### Sections
- Directory Overview
- Key Files Explained
- Where to Add Code
- App.tsx Deep Dive

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| New pages | `string` | — | src/custom/pages/YourPage.jsx + export in index.js |
| Custom components | `string` | — | src/custom/components/ |
| Custom hooks | `string` | — | src/custom/hooks/ |
| Constants / config | `string` | — | src/custom/constants/ |
| Utilities | `string` | — | src/custom/utils/ |
| Assets (images/fonts) | `string` | — | src/assets/ |

### Code Examples

<!-- my-app/ -->
```bash
my-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── custom/
│   │   └── pages/              # Your custom pages go here
│   │       ├── Dashboard.jsx
│   │       └── index.js        # Export all custom pages
│   ├── App.tsx                  # Main app - ZangoApp configuration
│   ├── index.tsx                # Dev entry point
│   ├── index.zango.tsx          # Zango platform entry point
│   └── index.css                # Global styles + Tailwind
├── .env                         # Environment config (create from .env.example)
├── .env.example                 # Environment template
├── index.html                   # HTML template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts               # Dev/production build config
└── vite.config.zango.ts         # Zango single-file build config
```

<!-- src/App.tsx -->
```tsx
import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';

const App = () => {
  return (
    <ZangoApp
      appInitializerEndpoint="/appbuilder/initializer/"
      customPages={customPages}
    />
  );
};

export default App;
```

---

## ZangoApp

**App Builder** | The root component that bootstraps your Zango frontend application.

### Sections
- Import
- Props
- Basic Usage
- With Full Configuration
- Accessing App Data
- Layout Configuration
- What ZangoApp Does

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| appInitializerEndpoint | `string` | `"/appbuilder/initializer/"` | API endpoint for app initialization data. |
| customPages | `object` | — | Map of component names to React components for custom page routing. |
| layoutConfig | `object` | — | Layout configuration: { showTopbar: boolean (true), showNavbar: boolean (true), layoutType: 'wide'\|'compact' ('wide') } |
| topbarConfig | `object` | — | Topbar configuration: { showProfile, customLeftContent, customRightContent, customProfileMenu, customTopbar, profileMenuConfig, className, style } |
| navbarConfig | `object` | — | Navbar configuration: { showLogo, showMenu, isCollapsed, collapsible, customLogo, customMenuContent, customBottomContent, customNavbar, customMenu, menuConfig, className, style } |
| authConfig | `object` | — | Authentication configuration: { customComponents, theme, card, logo, login, roleSelection, twoFactor, resetPassword, providers, messages } |
| config | `object` | — | General app configuration. |
| customComponents | `object` | — | Custom component overrides: { Layout, Topbar, Navbar } |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showTopbar | `boolean` | `true` | Show/hide the top navigation bar. |
| showNavbar | `boolean` | `true` | Show/hide the sidebar navigation. |
| layoutType | `'wide' \| 'compact'` | `'wide'` | Layout mode. "wide" uses the full viewport width; "compact" constrains content width. |

### Code Examples

<!-- import.jsx -->
```jsx
import { ZangoApp } from '@zango-core/crm-framework';
```

<!-- basic-usage.jsx -->
```jsx
import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';

const App = () => (
  <ZangoApp
    appInitializerEndpoint="/appbuilder/initializer/"
    customPages={customPages}
  />
);
```

<!-- full-config.jsx -->
```jsx
import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';
import CustomLogin from './custom/pages/CustomLogin';
import DocsNavbar from './custom/components/DocsNavbar';

const App = () => (
  <ZangoApp
    appInitializerEndpoint="/appbuilder/initializer/"
    customPages={customPages}
    layoutConfig={{
      showTopbar: false,
      showNavbar: true,
      layoutType: 'wide',
    }}
    navbarConfig={{
      collapsible: true,
      customLogo: <MyLogo />,
      customMenu: <DocsNavbar />,
      customBottomContent: <ProfileSection />,
    }}
    topbarConfig={{
      showProfile: true,
      customRightContent: <NotificationBell />,
    }}
    authConfig={{
      customComponents: {
        LoginPage: CustomLogin,
      },
    }}
  />
);
```

<!-- use-app-context.jsx -->
```jsx
import { useAppContext } from '@zango-core/crm-framework';

const MyComponent = () => {
  const {
    appData,      // Raw initializer response
    menu,         // Navigation menu items
    routes,       // Application routes
    profileInfo,  // Current user profile
    appLogo,      // App logo URL
    appName,      // Application name
    theme,        // Theme colors & typography
  } = useAppContext();

  return <div>Hello {profileInfo?.name}</div>;
};
```

---

## App Initializer

**App Builder** | The backend API that configures your entire frontend - routes, menu, theme, and user profile.

### Sections
- Overview
- Endpoint
- Full Response Format
- Routes
- Menu
- Theme
- Session Security

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **path** * | `string` | — | URL path, e.g. "/app/patients". |
| **page_type** * | `string` | — | Page renderer: "crud", "custom", "login", or "training". |
| component | `string` | — | Component name from customPages (for page_type: "custom"). |
| entity | `string` | — | Entity name (for page_type: "crud"). |
| route_id | `string` | — | UUID for syncing with menu items. |
| extra_params | `object` | — | Additional parameters: { api_endpoint, standalone, ... } |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **name** * | `string` | — | Display text for the menu item. |
| **uri** * | `string` | — | Navigation URL. |
| icon | `string` | — | SVG string, emoji, or image URL. |
| children | `array` | — | Nested menu items (same structure). |
| route_id | `string` | — | UUID linking to the corresponding route. |

#### Props Table 3

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| enabled | `boolean` | — | Enable session timeout monitoring. |
| ping_url | `string` | — | URL to ping on user activity to keep the session alive. |
| warn_after | `number` | — | Seconds of inactivity before showing a timeout warning. |
| expire_after | `number` | — | Seconds of inactivity before auto-logout. |

### Code Examples

<!-- endpoint -->
```bash
GET /appbuilder/initializer/
```

<!-- initializer-response.json -->
```json
{
  "success": true,
  "response": {
    "app_name": "My Application",
    "app_version": "1.0.0",
    "app_logo": "/path/to/logo.png",
    "is_user_anonymous": false,
    "user_role": "Admin",
    "session_security_config": {
      "enabled": true,
      "ping_url": "/session_security/ping/",
      "warn_after": 1700,
      "expire_after": 1800
    },
    "metadata": {
      "title": "My App",
      "description": "Application description",
      "favicon": "/favicon.ico"
    },
    "theme": {
      "colors": {
        "primary": "#5048ed",
        "secondary": "#6d7280",
        "success": "#10b981",
        "warning": "#f59e0b",
        "error": "#f04438",
        "gray": "#717680"
      },
      "typography": {
        "font_family": "Inter, sans-serif",
        "font_size_base": "14px",
        "line_height": 1.5
      }
    },
    "routes": [
      { "route_id": "uuid", "path": "/app/dashboard", "page_type": "custom", "component": "Dashboard" },
      { "path": "/app/patients", "page_type": "crud", "entity": "Patient", "extra_params": { "api_endpoint": "/api/patients/" } }
    ],
    "menu": [
      { "name": "Dashboard", "uri": "/app/dashboard", "icon": "home-icon-svg" },
      { "name": "Management", "uri": "/app/patients", "icon": "users-icon", "children": [
        { "name": "Patients", "uri": "/app/patients" },
        { "name": "Doctors", "uri": "/app/doctors" }
      ]}
    ],
    "profile_info": {
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "+1234567890",
      "user_role": "Admin",
      "member_since": "2024-01-01",
      "profile_pic": "/path/to/pic.jpg"
    }
  }
}
```

<!-- generated-css-variables.css -->
```css
--color-brand-500: #5048ed;   /* from theme.colors.primary */
--color-gray-500: #717680;    /* from theme.colors.gray */
--color-success-500: #10b981; /* from theme.colors.success */
--color-warning-500: #f59e0b; /* from theme.colors.warning */
--color-error-500: #f04438;   /* from theme.colors.error */
```

---

## Navbar & Topbar

**App Builder** | Customize the sidebar navigation and top bar with custom components, logos, and menus.

### Sections
- Navbar Configuration
- Custom Logo
- Custom Menu
- Custom Bottom Content
- Collapsible Sidebar
- Menu Item Format
- Topbar Configuration
- Hiding Topbar
- Custom Topbar Content

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showLogo | `boolean` | `true` | Show/hide the logo section at the top of the sidebar. |
| showMenu | `boolean` | `true` | Show/hide the menu items in the sidebar. |
| isCollapsed | `boolean` | `false` | Start the sidebar in collapsed mode. |
| collapsible | `boolean` | `false` | Allow the user to toggle collapse with a button. |
| customLogo | `ReactNode` | — | Replace the default logo with a custom component. |
| customMenu | `ReactNode` | — | Replace the entire menu with a custom component. |
| customMenuContent | `ReactNode` | — | Content appended below the menu items. |
| customBottomContent | `ReactNode` | — | Sticky section pinned to the bottom of the sidebar. |
| customNavbar | `React.ComponentType` | — | Replace the entire navbar component. |
| menuConfig | `object` | — | Menu display options. |
| className | `string` | — | Additional CSS class for the navbar container. |
| style | `CSSProperties` | — | Custom inline styles for the navbar container. |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showProfile | `boolean` | `true` | Show the profile section with dropdown menu. |
| showLeftSection | `boolean` | `true` | Show the left section of the topbar. |
| showRightSection | `boolean` | `true` | Show the right section of the topbar. |
| customLeftContent | `ReactNode` | — | Custom content rendered on the left side of the topbar. |
| customRightContent | `ReactNode` | — | Custom content rendered on the right side (before the profile section). |
| customProfileMenu | `ReactNode` | — | Replace the default profile dropdown content. |
| customTopbar | `React.ComponentType` | — | Replace the entire topbar component. |
| className | `string` | — | Additional CSS class for the topbar container. |
| style | `CSSProperties` | — | Custom inline styles for the topbar container. |

### Code Examples

<!-- custom-logo.jsx -->
```jsx
const MyLogo = () => (
  <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
    <img src="/logo.svg" width={28} height={28} />
    <span style={{ fontSize: 16, fontWeight: 700 }}>My App</span>
  </div>
);

<ZangoApp navbarConfig={{ customLogo: <MyLogo /> }} />
```

<!-- custom-menu.jsx -->
```jsx
const CustomMenu = () => {
  const location = useLocation();
  const isActive = (uri) => location.pathname.replace(/\\/$/, '') === uri.replace(/\\/$/, '');

  return (
    <div style={{ padding: '4px 8px' }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#98a2b3', padding: '6px 10px' }}>
        SECTION HEADER
      </div>
      <Link to="/app/dashboard" style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
        borderRadius: 6, backgroundColor: isActive('/app/dashboard') ? '#EAE8FF' : 'transparent',
        color: isActive('/app/dashboard') ? '#5048ED' : '#414651',
        textDecoration: 'none', fontSize: 13, fontWeight: isActive('/app/dashboard') ? 600 : 500,
      }}>
        Dashboard
      </Link>
    </div>
  );
};

<ZangoApp navbarConfig={{ customMenu: <CustomMenu /> }} />
```

<!-- custom-bottom-content.jsx -->
```jsx
<ZangoApp navbarConfig={{
  customBottomContent: <ProfileCard />,
}} />
```

<!-- collapsible-sidebar.jsx -->
```jsx
<ZangoApp navbarConfig={{ collapsible: true }} />
```

<!-- hide-topbar.jsx -->
```jsx
<ZangoApp layoutConfig={{ showTopbar: false }} />
```

<!-- custom-topbar-content.jsx -->
```jsx
<ZangoApp topbarConfig={{
  customLeftContent: <Breadcrumbs />,
  customRightContent: <NotificationBell />,
}} />
```

---

## Routing & Pages

**App Builder** | How routes, page types, and custom pages work together in Zango.

### Sections
- Page Types
- Route Configuration
- CRUD Pages
- Custom Pages
- Standalone Pages
- Route Matching
- Nested Routes
- Using CrudHandler in Custom Pages
- Backend: Route Model
- Backend: Menu Model
- Backend: Routes API
- Backend: Menu API
- Route-Menu Sync
- Configuration Panel
- settings.json

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| crud | `string` | — | Auto-generated CRUD table + detail + forms. Uses CrudHandler internally. |
| custom | `string` | — | Your React component. Loaded from the customPages prop. |
| login | `string` | — | Authentication pages. Rendered standalone (no layout). |
| training | `string` | — | Training module pages. |
| 404 | `string` | — | Not found page. |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **path** * | `string` | — | URL path, e.g. "/app/patients". |
| **page_type** * | `string` | — | One of: crud, custom, login, training. |
| component | `string` | — | Component name for custom pages (must match the export name exactly). |
| entity | `string` | — | Entity name for CRUD pages. |
| extra_params | `object` | — | Additional parameters: { api_endpoint, standalone, ... }. |
| route_id | `string` | — | UUID for menu synchronization. |

#### Props Table 3

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| route_id | `string` | — | UUID, auto-generated when routes are saved. |
| name | `string` | — | Display name for the route. |
| path | `string` | — | URL path, e.g. "/app/dashboard". |
| icon | `string` | — | Icon identifier for the route. |
| page_type | `string` | — | One of: login, custom, crud, training. |
| component | `string` | — | Component name for custom page types. |
| extra_params | `object` | — | Additional parameters such as api_endpoint. |

#### Props Table 4

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| route_id | `string` | — | UUID linking the menu item to a route for automatic sync. |
| name | `string` | — | Display name for the menu item. |
| uri | `string` | — | URL path the menu item links to. |
| icon | `string` | — | Icon identifier for the menu item. |
| children | `array` | — | Nested child menu items (supports sub-menus). |

#### Props Table 5

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| GET ?action=get_routes | `GET` | — | Returns the active routes configuration. |
| POST ?action=save_routes | `POST` | — | Save routes. Auto-assigns route_ids and syncs menus. |
| PUT ?action=update_routes&pk=ID | `PUT` | — | Update an existing routes configuration. |

#### Props Table 6

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| GET ?action=get_configs | `GET` | — | Returns all menu configurations. |
| GET ?action=get_available_roles | `GET` | — | Returns roles that do not yet have a menu configured. |
| POST ?action=create_config | `POST` | — | Create a menu for a role. Body: { "user_role": id, "menu": [...] }. |
| PUT ?action=update_config&pk=ID | `PUT` | — | Update an existing menu configuration. |
| DELETE ?action=delete_config&pk=ID | `DELETE` | — | Delete a menu configuration. |

#### Props Table 7

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| package_routes | `array` | — | Mount package URL patterns (appbuilder, crud, workflow, etc.) to specific path prefixes. |
| app_routes | `array` | — | Mount app-level URL patterns. Typically a catch-all for the frontend. |

### Code Examples

<!-- crud-route.json -->
```json
{
  "path": "/app/patients",
  "page_type": "crud",
  "entity": "Patient",
  "extra_params": {
    "api_endpoint": "/api/patients/"
  }
}
```

<!-- src/custom/pages/Analytics.jsx -->
```jsx
// src/custom/pages/Analytics.jsx
const Analytics = () => <div>My Analytics Page</div>;
export default Analytics;
```

<!-- src/custom/pages/index.js -->
```jsx
// src/custom/pages/index.js
export { default as Analytics } from './Analytics';
```

<!-- route-config.json -->
```json
{
  "path": "/app/analytics",
  "page_type": "custom",
  "component": "Analytics"
}
```

<!-- standalone-route.json -->
```json
{
  "path": "/app/public-form",
  "page_type": "custom",
  "component": "PublicForm",
  "extra_params": {
    "standalone": true
  }
}
```

<!-- auto-routes.txt -->
```text
/app/patients                    → Table view
/app/patients/detail-view/:uuid  → Detail view (if enableDetailViewRoute)
```

<!-- CustomPatientPage.jsx -->
```jsx
import { CrudHandler } from '@zango-core/crud/table';

const CustomPatientPage = () => (
  <CrudHandler
    api_endpoint="/api/patients/"
    headerProps={{ title: "Patient Management" }}
    customDrawerDetail={MyCustomDetail}
  />
);
export default CustomPatientPage;
```

<!-- Import -->
```python
from packages.appbuilder.backend.configure.models import AppRoutesModel
```

<!-- Django shell example -->
```python
# Django shell - create routes
from packages.appbuilder.backend.configure.models import AppRoutesModel

AppRoutesModel.objects.create(routes=[
    {
        "name": "Dashboard",
        "path": "/app/dashboard",
        "page_type": "custom",
        "component": "Dashboard",
        "icon": "home-icon"
    },
    {
        "name": "Patients",
        "path": "/app/patients",
        "page_type": "crud",
        "extra_params": {
            "api_endpoint": "/api/patients/"
        }
    }
])
```

<!-- Import -->
```python
from packages.appbuilder.backend.configure.models import AppMenuModel
```

<!-- Django shell example -->
```python
from packages.appbuilder.backend.configure.models import AppMenuModel
from zango.apps.appauth.models import UserRoleModel

role = UserRoleModel.objects.get(name="Admin")
AppMenuModel.objects.create(
    role=role,
    menu=[
        {"name": "Dashboard", "uri": "/app/dashboard", "icon": "home-icon"},
        {
            "name": "Management",
            "uri": "/app/patients",
            "icon": "users-icon",
            "children": [
                {"name": "Patients", "uri": "/app/patients"},
                {"name": "Doctors", "uri": "/app/doctors"}
            ]
        }
    ]
)
```

<!-- settings.json -->
```json
{
  "package_routes": [
    { "re_path": "^appbuilder/", "package": "appbuilder", "url": "urls" }
  ],
  "app_routes": [
    { "module": "app", "re_path": "^", "url": "urls" }
  ]
}
```

---

## Authentication

**App Builder** | Complete authentication system with password, OTP, OAuth, 2FA, role selection, and full customization.

### Sections
- Overview
- Auth Configuration
- Custom Login Page
- Login Configuration
- Theme Customization
- Role Selection
- Two-Factor Authentication
- OAuth/OIDC Providers
- Password Reset
- Custom Component Overrides
- Complete Example

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string \| ReactNode` | `"Sign In"` | Login page title. |
| subtitle | `string \| ReactNode` | — | Text displayed below the title. |
| submitButtonText | `string` | `"Sign In"` | Submit button label. |
| rememberMeText | `string` | `"Remember me"` | Remember me checkbox label. |
| forgotPasswordText | `string` | `"Forgot password?"` | Forgot password link text. |
| otpButtonText | `string` | `"Send OTP"` | OTP button label. |
| showRememberMe | `boolean` | `true` | Show or hide the remember me checkbox. |
| enableTabSwitching | `boolean` | `true` | Allow switching between email and mobile tabs. |
| defaultTab | `'email' \| 'mobile'` | `'email'` | Default active login tab. |
| redirectAfterLogin | `string` | — | Custom redirect URL after successful login. |
| formLabels | `object` | — | Custom labels for form fields: { email, mobile, password }. |
| formPlaceholders | `object` | — | Custom placeholders for form fields: { email, mobile, password }. |
| tabLabels | `object` | — | Custom labels for login tabs: { email, mobile }. |
| customHeader | `ReactNode` | — | Custom content rendered above the login form. |
| customFooter | `ReactNode` | — | Custom content rendered below the login form. |
| customElementsBelowDescription | `ReactNode[]` | — | Elements rendered between the description and the form. |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| background | `object` | — | Background configuration: { color, image, gradient } for the login page. |
| primaryColor | `string` | — | Primary brand color used for buttons and accents. |
| fontFamily | `string` | — | Font family for the auth pages. |
| borderRadius | `string` | — | Global border radius for inputs and buttons. |
| textColor | `string` | — | Primary text color. |
| linkColor | `string` | — | Color for links (forgot password, etc.). |
| alignTitle | `'left' \| 'center' \| 'right'` | — | Title text alignment. |

#### Props Table 3

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| backgroundColor | `string` | — | Card background color. |
| borderRadius | `string` | — | Card border radius. |
| boxShadow | `string` | — | Card box shadow. |
| maxWidth | `string` | — | Card maximum width. |
| padding | `string` | — | Card inner padding. |

#### Props Table 4

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| url | `string` | — | Logo image URL. |
| width | `string` | — | Logo width. |
| height | `string` | — | Logo height. |
| position | `'center' \| 'left' \| 'right'` | — | Logo alignment within the card. |

#### Props Table 5

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string \| ReactNode` | — | Role selection page title. |
| subtitle | `string \| ReactNode` | — | Subtitle text below the title. |
| instructionText | `string` | — | Instruction text for the user. |
| continueButtonText | `string` | `"Continue"` | Continue button label. |
| cardLayout | `'grid' \| 'list'` | `'grid'` | Layout mode for role cards. |
| gridColumns | `2 \| 3` | `2` | Number of columns in grid layout. |
| customRoleCard | `ReactNode` | — | Custom component for rendering individual role cards. |
| customEmptyState | `ReactNode` | — | Custom component shown when no roles are available. |

#### Props Table 6

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string \| ReactNode` | — | 2FA page title. |
| subtitle | `string \| ReactNode` | — | Subtitle text below the title. |
| codeLength | `number` | `6` | Number of digits in the OTP code. |
| resendCountdown | `number` | `60` | Seconds before the resend button becomes available. |
| submitButtonText | `string` | `"Verify"` | Submit button label. |
| resendButtonText | `string` | `"Resend Code"` | Resend button label. |
| customCodeInput | `ReactNode` | — | Custom OTP input component. |
| customMethodSelector | `ReactNode` | — | Custom method selector component (email/SMS toggle). |

#### Props Table 7

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| buttonStyle | `'outline' \| 'filled' \| 'minimal'` | `'outline'` | Visual style of provider buttons. |
| showProviderIcons | `boolean` | `true` | Show icons on provider buttons. |
| separatorText | `string` | `"OR"` | Text shown in the separator between the login form and provider buttons. |
| customProviderButtons | `object` | — | Custom button components keyed by provider name. |

#### Props Table 8

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| LoginPage | `React.ComponentType` | — | Replace the entire login page. |
| LoginCard | `React.ComponentType` | — | Replace just the login card within the page. |
| RoleSelection | `React.ComponentType` | — | Replace the role selection page. |
| TwoFactorAuth | `React.ComponentType` | — | Replace the two-factor authentication page. |
| ForgotPasswordPage | `React.ComponentType` | — | Replace the forgot password page. |
| ResetPasswordPage | `React.ComponentType` | — | Replace the reset password page. |
| OAuthCallbackPage | `React.ComponentType` | — | Replace the OAuth callback handling page. |
| DynamicLoginForm | `React.ComponentType` | — | Replace the login form (within the login card). |
| OTPForm | `React.ComponentType` | — | Replace the OTP input form. |
| ProviderButton | `React.ComponentType` | — | Replace the OAuth provider button component. |

### Code Examples

<!-- auth-config.jsx -->
```jsx
<ZangoApp
  authConfig={{
    // Theme, custom components, login config, etc.
  }}
/>
```

<!-- custom-login.jsx -->
```jsx
import CustomLogin from './custom/pages/CustomLogin';

<ZangoApp
  authConfig={{
    customComponents: {
      LoginPage: CustomLogin,
    },
  }}
/>
```

<!-- password-reset-config.jsx -->
```jsx
<ZangoApp
  authConfig={{
    resetPassword: {
      forgotPassword: {
        title: 'Forgot your password?',
        subtitle: 'Enter your email to receive a reset link.',
        submitButtonText: 'Send Reset Link',
      },
      resetForm: {
        title: 'Set New Password',
        subtitle: 'Choose a strong password for your account.',
        submitButtonText: 'Reset Password',
        passwordRules: 'At least 8 characters with one uppercase and one number.',
      },
    },
  }}
/>
```

<!-- complete-auth-config.jsx -->
```jsx
<ZangoApp
  authConfig={{
    theme: {
      background: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      primaryColor: '#5048ED',
    },
    logo: { url: '/logo.svg', width: '120px', position: 'center' },
    card: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      defaultTab: 'email',
      showRememberMe: true,
    },
    providers: {
      buttonStyle: 'outline',
      separatorText: 'or continue with',
    },
  }}
/>
```

---

## Theme & Build

**App Builder** | Configure colors, typography, and build your app for development and production deployment.

### Sections
- Theme System
- Color Configuration
- Typography
- Backend: Theme Configuration
- Using Theme in Custom Components
- Tailwind CSS v4 Setup
- Build Configuration
- Vite Configuration
- Entry Points
- Django Template Integration
- Frontend Build Workflow
- Deployment Checklist

### Props

#### Props Table 1

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| primary | `string` | — | Brand color. Maps to --color-brand-* palette (25 through 950). |
| secondary | `string` | — | Secondary color. |
| success | `string` | — | Success/positive actions. Maps to --color-success-*. |
| warning | `string` | — | Warning states. Maps to --color-warning-*. |
| error | `string` | — | Error/danger states. Maps to --color-error-*. |
| gray | `string` | — | Neutral palette. Maps to --color-gray-*. |
| background | `string` | — | Page background. |
| text | `string` | — | Default text color. |

#### Props Table 2

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| font_family | `string` | — | Font family (loaded via Google Fonts or local). |
| font_size_base | `string` | — | Base font size. |
| line_height | `number` | — | Base line height. |

### Code Examples

<!-- generated-css-variables.css -->
```css
:root {
  --color-brand-50: #EAE8FF;
  --color-brand-100: #D4D0FF;
  --color-brand-500: #5048ED;   /* primary */
  --color-brand-700: #302AA8;
  --color-brand-900: #151263;

  --color-gray-50: #F9FAFB;
  --color-gray-500: #667085;
  --color-gray-900: #101828;

  --color-success-500: #10B981;
  --color-error-500: #F04438;
  --color-warning-500: #F59E0B;
}
```

<!-- themed-component.jsx -->
```jsx
// Use CSS variables directly in styles
const MyComponent = () => (
  <div style={{
    color: 'var(--color-brand-500)',
    backgroundColor: 'var(--color-gray-50)',
    borderColor: 'var(--color-gray-200)',
  }}>
    Themed content
  </div>
);

// Or with Tailwind (if @theme is configured in CSS)
const MyComponent = () => (
  <div className="text-brand-500 bg-gray-50 border-gray-200">
    Themed content
  </div>
);
```

<!-- index.css -->
```css
@import 'tailwindcss';

@theme {
  --color-brand-50: var(--color-brand-50, #EAE8FF);
  --color-brand-500: var(--color-brand-500, #5048ED);
  --color-gray-50: var(--color-gray-50, #F9FAFB);
  --color-gray-500: var(--color-gray-500, #667085);
  /* ... etc */
}
```

<!-- vite.config.ts - Development -->
```js
// vite.config.ts - Development
{
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': './src' },
  },
  server: {
    port: 3000,
    proxy: { /* from VITE_PROXY_ROUTES */ }
  }
}
```

<!-- vite.config.zango.ts - Zango build -->
```js
// vite.config.zango.ts - Zango build
{
  plugins: [react(), cssInjectedByJsPlugin(), viteSingleFile(), tailwindcss()],
  build: {
    rollupOptions: {
      input: 'src/index.zango.tsx',
      output: {
        format: 'iife',
        entryFileNames: 'zango-app.[timestamp].min.js',
        inlineDynamicImports: true,
      }
    },
    minify: 'terser',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  }
}
```

<!-- index.zango.tsx -->
```tsx
function initializeApp() {
  let rootElement = document.getElementById('zango-app')
    || document.getElementById('root');

  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'zango-app';
    document.body.appendChild(rootElement);
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
```

<!-- django-template.html -->
```html
<div id="zango-app" data-base-path="/app/"></div>
<script>
  window.app_initializer_endpoint = "/appbuilder/initializer/";
</script>
<script type="module" src="{% zstatic 'packages/appbuilder/js/build.min.js' %}"></script>
```

---

## Additional Information

**App Builder** | Backend app views, URL routing, redirects, and deployment patterns.

### Sections
- App View (HTML Shell)
- URL Configuration
- Redirect Flow
- Security
- Authentication Flow
- Reserved Routes
- settings.json Reference
- Standalone Pages
- Root URL Redirect
- Extending the App Initializer
- Custom App View

### Code Examples

<!-- appbuilder/backend/app/views.py -->
```python
class AppView(TemplateView):
    template_name = "appbuilder/app.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["app_initializer_endpoint"] = "/app/initializer/"
        context["build_version"] = packages_json.get("version", "0.1.0")
        return context
```

<!-- appbuilder/backend/app/urls.py -->
```python
urlpatterns = [
    re_path(r'^initializer/$', AppInitializeAPI.as_view()),  # Reserved
    re_path(r'/', AppView.as_view()),                         # Catch-all SPA
]
```

<!-- settings.json -->
```json
{
  "version": "1.0.0",
  "package_routes": [
    { "re_path": "^appbuilder/", "package": "appbuilder", "url": "urls" },
    { "re_path": "^crud/", "package": "crud", "url": "urls" }
  ],
  "app_routes": [
    { "module": "app", "re_path": "^", "url": "urls" }
  ]
}
```

<!-- backend/app/views.py -->
```python
from django.shortcuts import redirect
from django.views.generic import View

class RedirectAppView(View):
    def get(self, request, *args, **kwargs):
        return redirect("/app")
```

<!-- backend/app/urls.py -->
```python
from django.urls import re_path
from .views import AppView, RedirectAppView, ExtendedAppInitializeAPI

urlpatterns = [
    re_path(r'^app/initializer/$', ExtendedAppInitializeAPI.as_view()),
    re_path(r'^app/', AppView.as_view()),
    re_path(r'^/', RedirectAppView.as_view()),     # Root -> /app
    re_path(r'^login/', RedirectAppView.as_view()), # Legacy login -> /app
]
```

<!-- backend/app/views.py -->
```python
import json
from django.http import HttpResponse
from ...packages.appbuilder.backend.app.views import AppInitializeAPI

class ExtendedAppInitializeAPI(AppInitializeAPI):
    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)

        # Add custom data to the response
        response_data = json.loads(response.content)
        response_data["response"]["feature_flags"] = {
            "enable_chat": True,
            "enable_analytics": False,
        }

        return HttpResponse(
            json.dumps(response_data),
            status=response.status_code,
            content_type="application/json",
        )
```

<!-- backend/app/views.py -->
```python
from django.views.generic import TemplateView
from zango.core.utils import get_current_role

class AppView(TemplateView):
    template_name = "app.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        user = self.request.user
        if user.is_authenticated:
            context["user_authenticated"] = True
            context["user_name"] = user.name
            context["user_email"] = user.email
            context["role_name"] = get_current_role().name

        return context
```

---

