# Table Styling
Styling

Complete visual customization of table components using CSS classes or dynamic style functions. Inspired by React Select's styling approach.

**Sections:** Overview | Basic Usage | Customizable Elements | State-Aware Styling | State Type Definitions | Theme Examples | Advanced Techniques | Best Practices

## Props

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

## Code Examples

### class-overrides.jsx
```jsx
<CrudHandler
  api_endpoint="/api/users"
  customClass={{
    headerCell: "bg-blue-100 text-blue-900 font-bold",
    bodyRow: "hover:bg-gray-50",
    filterButton: "border-blue-300 text-blue-600"
  }}
```

### forced-classes.jsx
```jsx
<CrudHandler
  api_endpoint="/api/users"
  customClass={{
    headerCell: "!bg-gray-800 !text-gray-200 !font-bold",
    bodyRow: "!bg-gray-900 hover:!bg-gray-800",
    filterButton: "!bg-gray-700 !text-gray-200"
  }}
```

### dynamic-styles.jsx
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
```

### row-state.tsx
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

### header-state.tsx
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

### action-state.tsx
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

### ContainerState
```typescript
export interface ContainerState {
  hideControls: boolean;
}
```

### HeaderContainerState
```typescript
export interface HeaderContainerState {
  hasActions: boolean;
  totalCount: number;
}
```

### HeaderTitleState
```typescript
export interface HeaderTitleState {
  title: string | React.ReactNode;
  hasCount: boolean;
  totalCount: number;
}
```

### HeaderActionsState
```typescript
export interface HeaderActionsState {
  hasAddButton: boolean;
  hasExtraActions: boolean;
}
```

### HeaderAddButtonState
```typescript
export interface HeaderAddButtonState {
  isDisabled: boolean;
  title: string | React.ReactNode;
}
```

### HeaderCellState
```typescript
export interface HeaderCellState {
  isPinned: boolean;
  canSort: boolean;
  columnId: string;
  pinnedOffset?: number;
}
```

### SortButtonState
```typescript
export interface SortButtonState {
  sortDirection: 'asc' | 'desc' | null;
  isHovered: boolean;
}
```

### BodyRowState
```typescript
export interface BodyRowState {
  isSelected: boolean;
  isHovered: boolean;
  rowIndex: number;
  rowData: any;
}
```

### BodyCellState
```typescript
export interface BodyCellState {
  isPinned: boolean;
  columnId: string;
  rowData: any;
  cellValue: any;
  pinnedOffset?: number;
}
```

### UtilitiesState
```typescript
export interface UtilitiesState {
  activeFilterCount: number;
  hasSearch: boolean;
}
```

### FilterButtonState
```typescript
export interface FilterButtonState {
  isActive: boolean;
  filterCount: number;
}
```

### PaginationContainerState
```typescript
export interface PaginationContainerState {
  compact: boolean;
  totalPages: number;
  currentPage: number;
}
```

### PaginationInfoState
```typescript
export interface PaginationInfoState {
  startRow: number;
  endRow: number;
  totalCount: number;
  hasData: boolean;
}
```

### PaginationButtonState
```typescript
export interface PaginationButtonState {
  isActive: boolean;
  isDisabled: boolean;
  pageNumber?: number;
}
```

### FilterSidebarState
```typescript
export interface FilterSidebarState {
  isVisible: boolean;
  activeFilterCount: number;
}
```

### ActionsState
```typescript
export interface ActionsState {
  actionsCount: number;
  rowData: any;
}
```

### ActionButtonState
```typescript
export interface ActionButtonState {
  action: any;
  isFirst: boolean;
  isInDropdown: boolean;
}
```

### StatusBadgeState
```typescript
export interface StatusBadgeState {
  status: string;
  statusColor?: string;
  isObject: boolean;
}
```

### TagsState
```typescript
export interface TagsState {
  tagsCount: number;
  visibleCount: number;
}
```

### TagState
```typescript
export interface TagState {
  tag: string;
  index: number;
  isVisible: boolean;
}
```

### professional-theme.jsx
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

<CrudHandler api_endpoint="/api/users" {...professionalTheme}
```

### dark-theme.jsx
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

<CrudHandler api_endpoint="/api/users" {...darkTheme}
```

### data-driven.jsx
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

<CrudHandler api_endpoint="/api/tasks" {...dataStyles}
```

### gradients.jsx
```jsx
const backgroundStyles = {
  customClass: {
    container: 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50',
    tableWrapper: 'bg-white/80 backdrop-blur-sm shadow-xl rounded-lg',
    headerCell: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white'
  }
};
```

### borderless.jsx
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

### animations.jsx
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

### theme-provider.jsx
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

  return <CrudHandler api_endpoint="/api/users" {...themedStyles}
```

### performance.jsx
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

### typescript.tsx
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
```

