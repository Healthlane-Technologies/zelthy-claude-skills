import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const TableStylingDocs = () => {
  return (
    <DocPage
      title="Table Styling"
      subtitle="Complete visual customization of table components using CSS classes or dynamic style functions. Inspired by React Select's styling approach."
      badge="Styling"
    >
      <Section title="Overview">
        <p className="mb-4">Two complementary approaches that work together:</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
            <p className="font-semibold text-gray-900 text-sm mb-1">customClass</p>
            <p className="text-xs text-gray-500">Simple CSS class overrides for static styling</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
            <p className="font-semibold text-gray-900 text-sm mb-1">customStyle</p>
            <p className="text-xs text-gray-500">Dynamic style functions with access to component state</p>
          </div>
        </div>
      </Section>

      <Section title="Basic Usage">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Simple Class Overrides</h3>
        <CodeBlock
          language="jsx"
          title="class-overrides.jsx"
          code={`<CrudHandler
  api_endpoint="/api/users"
  customClass={{
    headerCell: "bg-blue-100 text-blue-900 font-bold",
    bodyRow: "hover:bg-gray-50",
    filterButton: "border-blue-300 text-blue-600"
  }}
/>`}
        />

        <Callout type="tip" title="Force styles with !">
          For stronger styling (like dark themes), use the <InlineCode>!</InlineCode> prefix to force styles over defaults.
        </Callout>

        <CodeBlock
          language="jsx"
          title="forced-classes.jsx"
          code={`<CrudHandler
  api_endpoint="/api/users"
  customClass={{
    headerCell: "!bg-gray-800 !text-gray-200 !font-bold",
    bodyRow: "!bg-gray-900 hover:!bg-gray-800",
    filterButton: "!bg-gray-700 !text-gray-200"
  }}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Dynamic Styling Functions</h3>
        <CodeBlock
          language="jsx"
          title="dynamic-styles.jsx"
          code={`<CrudHandler
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
/>`}
        />
      </Section>

      <Section title="Customizable Elements">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Container & Structure</h3>
        <PropsTable
          props={[
            { name: 'container', type: 'string', description: 'Main table container wrapper' },
            { name: 'tableWrapper', type: 'string', description: 'Table wrapper element' },
            { name: 'table', type: 'string', description: 'The actual table element' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Header Area</h3>
        <PropsTable
          props={[
            { name: 'headerContainer', type: 'string', description: 'Main header wrapper above the table grid' },
            { name: 'headerTitle', type: 'string', description: 'Header title text element' },
            { name: 'headerTitleCount', type: 'string', description: 'Count badge next to the header title' },
            { name: 'headerActions', type: 'string', description: 'Container for header action buttons' },
            { name: 'headerAddButton', type: 'string', description: 'Add-record button in the header' },
            { name: 'headerRow', type: 'string', description: 'Header row container' },
            { name: 'headerCell', type: 'string', description: 'Individual header cells' },
            { name: 'headerCellPinned', type: 'string', description: 'Pinned header cells' },
            { name: 'sortButton', type: 'string', description: 'Sortable column buttons' },
            { name: 'sortIcon', type: 'string', description: 'Sort direction icons' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Body & Rows</h3>
        <PropsTable
          props={[
            { name: 'bodyRow', type: 'string', description: 'Data row containers' },
            { name: 'bodyRowSelected', type: 'string', description: 'Selected row state' },
            { name: 'bodyRowHover', type: 'string', description: 'Hovered row state' },
            { name: 'bodyCell', type: 'string', description: 'Individual data cells' },
            { name: 'bodyCellPinned', type: 'string', description: 'Pinned data cells' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Loading & Empty States</h3>
        <PropsTable
          props={[
            { name: 'loadingOverlay', type: 'string', description: 'Full-table loading overlay' },
            { name: 'loadingCell', type: 'string', description: 'Per-cell loading indicator' },
            { name: 'emptyStateRow', type: 'string', description: 'Row shown when table has no data' },
            { name: 'skeletonRow', type: 'string', description: 'Skeleton placeholder row during initial load' },
            { name: 'skeletonCell', type: 'string', description: 'Skeleton placeholder cell' },
            { name: 'skeletonBar', type: 'string', description: 'Animated bar inside skeleton cell' },
            { name: 'infiniteScrollLoader', type: 'string', description: 'Loader shown during infinite scroll fetch' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Utilities & Controls</h3>
        <PropsTable
          props={[
            { name: 'utilitiesContainer', type: 'string', description: 'Action bar container' },
            { name: 'utilitiesLeft', type: 'string', description: 'Left slot of the utilities bar' },
            { name: 'utilitiesRight', type: 'string', description: 'Right slot of the utilities bar' },
            { name: 'filterButton', type: 'string', description: 'Filter toggle buttons' },
            { name: 'clearFiltersButton', type: 'string', description: 'Button that clears all active filters' },
            { name: 'columnOptionsButton', type: 'string', description: 'Column visibility/options toggle button' },
            { name: 'searchInput', type: 'string', description: 'Search input field' },
            { name: 'uploadButton', type: 'string', description: 'File upload button' },
            { name: 'downloadButton', type: 'string', description: 'Download/export button' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Pagination</h3>
        <PropsTable
          props={[
            { name: 'paginationContainer', type: 'string', description: 'Pagination wrapper' },
            { name: 'paginationControls', type: 'string', description: 'Controls group inside pagination bar' },
            { name: 'paginationButton', type: 'string', description: 'Page number buttons' },
            { name: 'paginationNavButton', type: 'string', description: 'Previous/next buttons' },
            { name: 'paginationButtonDisabled', type: 'string', description: 'Disabled state of pagination buttons' },
            { name: 'paginationButtonActive', type: 'string', description: 'Active/current page button' },
            { name: 'paginationSelect', type: 'string', description: 'Per-page size select dropdown' },
            { name: 'paginationInfo', type: 'string', description: 'Page info display' },
            { name: 'paginationEllipsis', type: 'string', description: 'Overflow indicators' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Filters & Sidebar</h3>
        <PropsTable
          props={[
            { name: 'filterSidebar', type: 'string', description: 'Filter panel container' },
            { name: 'filterHeader', type: 'string', description: 'Filter panel header' },
            { name: 'filterTitle', type: 'string', description: 'Filter title text' },
            { name: 'filterClearAll', type: 'string', description: 'Clear filters button' },
            { name: 'filterContent', type: 'string', description: 'Filter content area' },
            { name: 'filterAccordion', type: 'string', description: 'Filter accordion wrapper' },
            { name: 'filterItem', type: 'string', description: 'Individual filter item row' },
            { name: 'filterBadge', type: 'string', description: 'Badge showing active filter count on filter button' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Actions, Status & Tags</h3>
        <PropsTable
          props={[
            { name: 'actionsContainer', type: 'string', description: 'Row actions wrapper' },
            { name: 'actionButton', type: 'string', description: 'Individual action buttons' },
            { name: 'actionMenuButton', type: 'string', description: 'Action menu trigger' },
            { name: 'actionDropdown', type: 'string', description: 'Action dropdown menu' },
            { name: 'actionDropdownItem', type: 'string', description: 'Action menu items' },
            { name: 'statusBadge', type: 'string', description: 'Status display badges' },
            { name: 'statusIcon', type: 'string', description: 'Icon inside a status badge' },
            { name: 'tagsContainer', type: 'string', description: 'Tags wrapper' },
            { name: 'tag', type: 'string', description: 'Individual tag chip' },
            { name: 'tagMore', type: 'string', description: 'Overflow indicator for hidden tags' },
            { name: 'workflowContainer', type: 'string', description: 'Workflow elements wrapper' },
            { name: 'workflowButton', type: 'string', description: 'Workflow action buttons' },
            { name: 'workflowDropdown', type: 'string', description: 'Workflow dropdown menu' },
          ]}
        />

        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">Sub-Item Cells</h3>
        <PropsTable
          props={[
            { name: 'subItemContainer', type: 'string', description: 'Wrapper for sub-item list inside a cell' },
            { name: 'subItemText', type: 'string', description: 'Text of a single sub-item' },
            { name: 'subItemSeparator', type: 'string', description: 'Separator between sub-items' },
            { name: 'subItemShowMore', type: 'string', description: 'Show-more toggle for collapsed sub-items' },
            { name: 'subItemTooltip', type: 'string', description: 'Tooltip shown over overflowing sub-items' },
          ]}
        />
      </Section>

      <Section title="State-Aware Styling">
        <p className="mb-4">Dynamic style functions receive state objects with context for conditional styling.</p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Row State</h3>
        <CodeBlock
          language="tsx"
          title="row-state.tsx"
          code={`bodyRow: (baseStyles, state) => {
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
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Header State</h3>
        <CodeBlock
          language="tsx"
          title="header-state.tsx"
          code={`headerCell: (baseStyles, state) => {
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
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Action State</h3>
        <CodeBlock
          language="tsx"
          title="action-state.tsx"
          code={`actionButton: (baseStyles, state) => {
  // Available state properties:
  // - action: object (action data)
  // - isFirst: boolean
  // - isInDropdown: boolean

  return {
    ...baseStyles,
    backgroundColor: state.action.type === 'danger' ? '#fef2f2' : baseStyles.backgroundColor
  };
}`}
        />
      </Section>

      <Section title="State Type Definitions">
        <p className="mb-4">Complete TypeScript interfaces for all state objects passed to customStyle functions.</p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">ContainerState</h3>
        <CodeBlock
          language="typescript"
          title="ContainerState"
          code={`export interface ContainerState {
  hideControls: boolean;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">HeaderContainerState</h3>
        <CodeBlock
          language="typescript"
          title="HeaderContainerState"
          code={`export interface HeaderContainerState {
  hasActions: boolean;
  totalCount: number;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">HeaderTitleState</h3>
        <CodeBlock
          language="typescript"
          title="HeaderTitleState"
          code={`export interface HeaderTitleState {
  title: string | React.ReactNode;
  hasCount: boolean;
  totalCount: number;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">HeaderActionsState</h3>
        <CodeBlock
          language="typescript"
          title="HeaderActionsState"
          code={`export interface HeaderActionsState {
  hasAddButton: boolean;
  hasExtraActions: boolean;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">HeaderAddButtonState</h3>
        <CodeBlock
          language="typescript"
          title="HeaderAddButtonState"
          code={`export interface HeaderAddButtonState {
  isDisabled: boolean;
  title: string | React.ReactNode;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">HeaderCellState</h3>
        <CodeBlock
          language="typescript"
          title="HeaderCellState"
          code={`export interface HeaderCellState {
  isPinned: boolean;
  canSort: boolean;
  columnId: string;
  pinnedOffset?: number;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">SortButtonState</h3>
        <CodeBlock
          language="typescript"
          title="SortButtonState"
          code={`export interface SortButtonState {
  sortDirection: 'asc' | 'desc' | null;
  isHovered: boolean;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">BodyRowState</h3>
        <CodeBlock
          language="typescript"
          title="BodyRowState"
          code={`export interface BodyRowState {
  isSelected: boolean;
  isHovered: boolean;
  rowIndex: number;
  rowData: any;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">BodyCellState</h3>
        <CodeBlock
          language="typescript"
          title="BodyCellState"
          code={`export interface BodyCellState {
  isPinned: boolean;
  columnId: string;
  rowData: any;
  cellValue: any;
  pinnedOffset?: number;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">UtilitiesState</h3>
        <CodeBlock
          language="typescript"
          title="UtilitiesState"
          code={`export interface UtilitiesState {
  activeFilterCount: number;
  hasSearch: boolean;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">FilterButtonState</h3>
        <CodeBlock
          language="typescript"
          title="FilterButtonState"
          code={`export interface FilterButtonState {
  isActive: boolean;
  filterCount: number;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">PaginationContainerState</h3>
        <CodeBlock
          language="typescript"
          title="PaginationContainerState"
          code={`export interface PaginationContainerState {
  compact: boolean;
  totalPages: number;
  currentPage: number;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">PaginationInfoState</h3>
        <CodeBlock
          language="typescript"
          title="PaginationInfoState"
          code={`export interface PaginationInfoState {
  startRow: number;
  endRow: number;
  totalCount: number;
  hasData: boolean;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">PaginationButtonState</h3>
        <CodeBlock
          language="typescript"
          title="PaginationButtonState"
          code={`export interface PaginationButtonState {
  isActive: boolean;
  isDisabled: boolean;
  pageNumber?: number;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">FilterSidebarState</h3>
        <CodeBlock
          language="typescript"
          title="FilterSidebarState"
          code={`export interface FilterSidebarState {
  isVisible: boolean;
  activeFilterCount: number;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">ActionsState</h3>
        <CodeBlock
          language="typescript"
          title="ActionsState"
          code={`export interface ActionsState {
  actionsCount: number;
  rowData: any;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">ActionButtonState</h3>
        <CodeBlock
          language="typescript"
          title="ActionButtonState"
          code={`export interface ActionButtonState {
  action: any;
  isFirst: boolean;
  isInDropdown: boolean;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">StatusBadgeState</h3>
        <CodeBlock
          language="typescript"
          title="StatusBadgeState"
          code={`export interface StatusBadgeState {
  status: string;
  statusColor?: string;
  isObject: boolean;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">TagsState</h3>
        <CodeBlock
          language="typescript"
          title="TagsState"
          code={`export interface TagsState {
  tagsCount: number;
  visibleCount: number;
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">TagState</h3>
        <CodeBlock
          language="typescript"
          title="TagState"
          code={`export interface TagState {
  tag: string;
  index: number;
  isVisible: boolean;
}`}
        />
      </Section>

      <Section title="Theme Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Professional Theme</h3>
        <CodeBlock
          language="jsx"
          title="professional-theme.jsx"
          code={`const professionalTheme = {
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

<CrudHandler api_endpoint="/api/users" {...professionalTheme} />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Dark Theme</h3>
        <CodeBlock
          language="jsx"
          title="dark-theme.jsx"
          code={`const darkTheme = {
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

<CrudHandler api_endpoint="/api/users" {...darkTheme} />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Data-Driven Row Colors</h3>
        <CodeBlock
          language="jsx"
          title="data-driven.jsx"
          code={`const dataStyles = {
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

<CrudHandler api_endpoint="/api/tasks" {...dataStyles} />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Background Patterns & Gradients</h3>
        <CodeBlock
          language="jsx"
          title="gradients.jsx"
          code={`const backgroundStyles = {
  customClass: {
    container: 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50',
    tableWrapper: 'bg-white/80 backdrop-blur-sm shadow-xl rounded-lg',
    headerCell: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white'
  }
};`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Borderless Clean Design</h3>
        <CodeBlock
          language="jsx"
          title="borderless.jsx"
          code={`const borderlessTheme = {
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
};`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Animation & Transitions</h3>
        <CodeBlock
          language="jsx"
          title="animations.jsx"
          code={`const animatedStyles = {
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
};`}
        />
      </Section>

      <Section title="Advanced Techniques">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Theme Provider Integration</h3>
        <CodeBlock
          language="jsx"
          title="theme-provider.jsx"
          code={`import { useTheme } from './ThemeProvider';

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
}`}
        />
      </Section>

      <Section title="Best Practices">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Performance</h3>
        <CodeBlock
          language="jsx"
          title="performance.jsx"
          code={`// Bad - creates new object every render
customStyle={{
  bodyRow: () => ({ backgroundColor: 'red' })
}}

// Good - use customClass for static styles
customClass={{
  bodyRow: 'bg-red-100'
}}`}
        />

        <Callout type="important" title="CSS Specificity">
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>Use Tailwind's <InlineCode>!</InlineCode> prefix to force important styles when needed</li>
            <li><InlineCode>customStyle</InlineCode> overrides <InlineCode>customClass</InlineCode> in cascade order</li>
            <li>Combine both approaches for maximum control</li>
          </ul>
        </Callout>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">TypeScript Support</h3>
        <CodeBlock
          language="tsx"
          title="typescript.tsx"
          code={`import type { TableCustomClasses, TableCustomStyles } from '@zango-core/crud/table';

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
/>`}
        />

      </Section>
    </DocPage>
  );
};

export default TableStylingDocs;
