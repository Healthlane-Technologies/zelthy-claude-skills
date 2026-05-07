# Render Props
Advanced

Custom rendering for action, status, tag, and workflow-transition columns while maintaining all functionality and state management.

**Sections:** Overview | Actions Column | Status Column | Tags Column | Workflow Transitions Column | Default Render Targets | ActionsCell | StatusCell | WorkflowTransitionsCell | StatusBadge | StatusButton | TagSwitch

## Props

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

## Code Examples

### render-props-overview.jsx
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
```

### custom-actions.jsx
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick(action);
                    setMenuOpen(false);
                  }}
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

### custom-status.jsx
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
  ```

### custom-tags.jsx
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
```

### custom-workflow-transitions.jsx
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
            <MoreHorizontal className="w-4 h-4 text-gray-500"
```

### use-actions-cell.jsx
```jsx
import { ActionsCell } from "@zango-core/crud/table";

// Use as the direct return of renderActions to compose with a wrapper
<Table
  apiUrl="/api/users"
  tableMetadataObj={metadata}
  renderActions={(args) => (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <ActionsCell row={args.row}
```

### use-status-cell.jsx
```jsx
import { StatusCell } from "@zango-core/crud/table";

// Wrap StatusCell with a fixed-width container
<Table
  apiUrl="/api/orders"
  tableMetadataObj={metadata}
  renderStatus={(args) => (
    <div className="w-28">
      <StatusCell value={args.value}
```

### use-workflow-transitions-cell.jsx
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
```

### use-status-badge.jsx
```jsx
import { StatusBadge } from "@zango-core/crud/table";

// Use default colors from built-in map
<StatusBadge status="active"
```

### use-status-button.jsx
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
```

### use-tag-switch.jsx
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
```
