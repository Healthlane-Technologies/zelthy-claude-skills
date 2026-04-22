import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const RenderPropsDocs = () => {
  return (
    <DocPage
      title="Render Props"
      category="crud"
      subtitle="Custom rendering for action, status, tag, and workflow-transition columns while maintaining all functionality and state management."
      badge="Advanced"
    >
      <Section title="Overview">
        <p className="mb-4">
          Four column types in the table support render props, allowing you to fully customize
          their appearance while the framework handles all underlying state management,
          event handling, and data resolution:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Actions</strong> — Custom action buttons and menus per row.</li>
          <li><strong>Status</strong> — Custom status badge rendering with resolved values.</li>
          <li><strong>Tags</strong> — Custom tag display with overflow handling.</li>
          <li><strong>Workflow Transitions</strong> — Custom transition buttons with split visible/dropdown sets.</li>
        </ul>
        <p className="mb-4">
          Pass render functions to the <InlineCode>Table</InlineCode> component to override the
          default rendering for each column type:
        </p>
        <CodeBlock
          language="jsx"
          title="render-props-overview.jsx"
          code={`import { Table } from "@zango-core/crud/table";

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
/>`}
        />
      </Section>

      <Section title="Actions Column">
        <p className="mb-4">
          The <InlineCode>renderActions</InlineCode> prop lets you replace the default action
          dropdown with a custom layout. The framework provides the available actions for each
          row, an <InlineCode>onActionClick</InlineCode> handler that triggers the action execution
          pipeline (confirmations, API calls, refreshes), and menu state controls.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Parameters</h3>
        <PropsTable
          props={[
            {
              name: 'actions',
              type: 'RowAction[]',
              description: 'Array of available action objects for the current row. Each action has key, name, type, and optional description, confirmation_message, and icon fields.',
            },
            {
              name: 'row',
              type: 'any',
              description: 'The resolved row data object (row.original unwrapped). Access fields directly — no need for row.original.',
            },
            {
              name: 'onActionClick',
              type: '(action: RowAction) => void',
              description: 'Trigger the action execution pipeline for a given action. Handles confirmations, API calls, and table refresh.',
            },
            {
              name: 'menuOpen',
              type: 'boolean',
              description: 'Current state of the dropdown menu. Use this to control visual state of custom menus.',
            },
            {
              name: 'setMenuOpen',
              type: '(open: boolean) => void',
              description: 'Control the dropdown menu visibility. Call with true to open, false to close.',
            },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Example</h3>
        <p className="mb-4">
          This example renders the first three actions as inline buttons and groups the rest
          into a dropdown overflow menu:
        </p>
        <CodeBlock
          language="jsx"
          title="custom-actions.jsx"
          code={`import { Button } from "@/components/ui/button";
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
/>`}
        />
      </Section>

      <Section title="Status Column">
        <p className="mb-4">
          The <InlineCode>renderStatus</InlineCode> prop lets you customize how status values
          are displayed. The framework resolves the raw value and provides helper flags so you
          can handle different value formats (strings, objects, HTML) without parsing logic.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Parameters</h3>
        <PropsTable
          props={[
            {
              name: 'value',
              type: 'any',
              description: 'The raw status value from the API response. Can be a string, object, or HTML string.',
            },
            {
              name: 'statusValue',
              type: '{ status_label: string; status_color?: string } \| undefined',
              description: 'The resolved status object when value is an object with status_label. Undefined when value is a plain string or HTML.',
            },
            {
              name: 'isObject',
              type: 'boolean',
              description: 'True if the raw value is an object with a status_label field (e.g., status_label Active, status_color 12B76A).',
            },
            {
              name: 'isString',
              type: 'boolean',
              description: 'True if the raw value is a plain string.',
            },
            {
              name: 'isHtml',
              type: 'boolean',
              description: 'True if the raw value contains HTML markup that needs special rendering.',
            },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Example</h3>
        <p className="mb-4">
          Render a custom status badge with color-coded backgrounds based on the status value:
        </p>
        <CodeBlock
          language="jsx"
          title="custom-status.jsx"
          code={`<Table
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
          className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium \${colors.bg} \${colors.text}\`}
        >
          <span className={\`w-1.5 h-1.5 rounded-full \${colors.dot}\`} />
          {statusValue.status_label}
        </span>
      );
    }

    // Handle plain string status
    const key = (isString ? value : '').toLowerCase();
    const colors = statusColors[key] || statusColors.inactive;
    return (
      <span
        className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium \${colors.bg} \${colors.text}\`}
      >
        <span className={\`w-1.5 h-1.5 rounded-full \${colors.dot}\`} />
        {value}
      </span>
    );
  }}
/>`}
        />
      </Section>

      <Section title="Tags Column">
        <p className="mb-4">
          The <InlineCode>renderTags</InlineCode> prop lets you customize the display of tag
          arrays. The framework handles tag slicing and overflow calculation, providing both the
          visible set and the remaining overflow tags for your custom layout.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Parameters</h3>
        <PropsTable
          props={[
            {
              name: 'tags',
              type: 'string[]',
              description: 'The complete array of all tag strings assigned to the row.',
            },
            {
              name: 'visibleTags',
              type: 'string[]',
              description: 'Subset of tags displayed inline, sliced to fit within the maxVisible limit.',
            },
            {
              name: 'remainingTags',
              type: 'string[]',
              description: 'Tags that overflow beyond the visible limit. Display these in a popover or tooltip.',
            },
            {
              name: 'hasMoreTags',
              type: 'boolean',
              description: 'True if there are more tags than the maxVisible count allows. Use to conditionally render overflow UI.',
            },
            {
              name: 'maxVisible',
              type: 'number',
              description: 'The maximum number of tags shown inline before overflow. Default is 2, determined by the table column configuration.',
            },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Example</h3>
        <p className="mb-4">
          Render tags in a compact grid layout with a popover for overflow tags:
        </p>
        <CodeBlock
          language="jsx"
          title="custom-tags.jsx"
          code={`import {
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
            className={\`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border \${tagColors[index % tagColors.length]}\`}
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
/>`}
        />

        <Callout type="info" title="Tag Value Types">
          Tags in the table column are plain strings. The <InlineCode>tags</InlineCode>,{' '}
          <InlineCode>visibleTags</InlineCode>, and <InlineCode>remainingTags</InlineCode> arrays
          all contain raw string values — no object unwrapping needed.
        </Callout>
      </Section>

      <Section title="Workflow Transitions Column">
        <p className="mb-4">
          The <InlineCode>renderWorkflowTransitions</InlineCode> prop lets you replace the default
          transition button layout. The framework splits transitions into visible and dropdown sets,
          provides an <InlineCode>onTransitionClick</InlineCode> handler that handles form-based
          and simple transitions, confirmation dialogs, and table refresh.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Parameters</h3>
        <PropsTable
          props={[
            {
              name: 'transitions',
              type: 'Transition[]',
              description: 'Full array of available workflow transitions for the row. Each transition has name, display_name, is_form_based, confirmation_message, and description fields.',
            },
            {
              name: 'visibleTransitions',
              type: 'Transition[]',
              description: 'First two transitions shown inline (default behavior splits at index 2).',
            },
            {
              name: 'dropdownTransitions',
              type: 'Transition[]',
              description: 'Remaining transitions beyond the first two, intended for a dropdown overflow menu.',
            },
            {
              name: 'row',
              type: 'any',
              description: 'The resolved row data object (row.original unwrapped).',
            },
            {
              name: 'onTransitionClick',
              type: '(transition: Transition, e?: React.MouseEvent) => void',
              description: 'Trigger the transition execution pipeline. Handles form-based drawers, simple confirmation dialogs, and table refresh.',
            },
            {
              name: 'menuOpen',
              type: 'boolean',
              description: 'Current state of the overflow dropdown menu.',
            },
            {
              name: 'setMenuOpen',
              type: '(open: boolean) => void',
              description: 'Control the overflow dropdown visibility.',
            },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Example</h3>
        <p className="mb-4">
          Render visible transitions as primary buttons and overflow transitions in a dropdown:
        </p>
        <CodeBlock
          language="jsx"
          title="custom-workflow-transitions.jsx"
          code={`import { MoreHorizontal } from "lucide-react";

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
/>`}
        />
      </Section>

      <Section title="Default Render Targets">
        <p className="mb-4">
          All default cell renderers are exported from <InlineCode>@zango-core/crud/table</InlineCode>{' '}
          and can be used directly as the return value of a render prop, or composed with your
          own wrapper components.
        </p>

        <Section title="ActionsCell">
          <p className="mb-4">
            The default cell for action columns. Renders the first two actions as inline text
            buttons and additional actions in a three-dot dropdown menu. Handles form drawers and
            simple action confirmation dialogs automatically.
          </p>
          <PropsTable
            props={[
              {
                name: 'row',
                type: 'any',
                required: true,
                description: 'The TanStack row object or raw row data. Actions are read from row.original.actions_col or row.original.row_actions.',
              },
              {
                name: 'renderActions',
                type: '(params) => ReactNode',
                description: 'Optional nested render prop passed through to customize the action layout while keeping the drawer and confirmation logic.',
              },
            ]}
          />
          <CodeBlock
            language="jsx"
            title="use-actions-cell.jsx"
            code={`import { ActionsCell } from "@zango-core/crud/table";

// Use as the direct return of renderActions to compose with a wrapper
<Table
  apiUrl="/api/users"
  tableMetadataObj={metadata}
  renderActions={(args) => (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <ActionsCell row={args.row} />
    </div>
  )}
/>`}
          />
        </Section>

        <Section title="StatusCell">
          <p className="mb-4">
            The default cell for status columns. Renders HTML content as-is, objects with
            <InlineCode>status_label</InlineCode> and <InlineCode>status_color</InlineCode> as
            colored badges, and plain strings as outline badges.
          </p>
          <PropsTable
            props={[
              {
                name: 'value',
                type: 'any',
                required: true,
                description: 'The raw status value from the API — string, HTML string, or object with status_label.',
              },
              {
                name: 'renderStatus',
                type: '(params) => ReactNode',
                description: 'Optional nested render prop for custom rendering inside the cell.',
              },
            ]}
          />
          <CodeBlock
            language="jsx"
            title="use-status-cell.jsx"
            code={`import { StatusCell } from "@zango-core/crud/table";

// Wrap StatusCell with a fixed-width container
<Table
  apiUrl="/api/orders"
  tableMetadataObj={metadata}
  renderStatus={(args) => (
    <div className="w-28">
      <StatusCell value={args.value} />
    </div>
  )}
/>`}
          />
        </Section>

        <Section title="WorkflowTransitionsCell">
          <p className="mb-4">
            The default cell for workflow transition columns. Renders the first two transitions
            as inline text buttons and additional transitions in a dropdown. Handles form-based
            transitions in a drawer and simple transitions with a confirmation dialog.
          </p>
          <PropsTable
            props={[
              {
                name: 'transitions',
                type: 'Transition[]',
                required: true,
                description: 'Array of available transitions. Each has name, display_name, is_form_based, confirmation_message, and description.',
              },
              {
                name: 'row',
                type: 'any',
                required: true,
                description: 'The row data object used to extract object_uuid for API calls.',
              },
              {
                name: 'renderWorkflowTransitions',
                type: '(params) => ReactNode',
                description: 'Optional nested render prop for custom button layout while keeping execution logic.',
              },
            ]}
          />
          <CodeBlock
            language="jsx"
            title="use-workflow-transitions-cell.jsx"
            code={`import { WorkflowTransitionsCell } from "@zango-core/crud/table";

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
/>`}
          />
        </Section>

        <Section title="StatusBadge">
          <p className="mb-4">
            A pure display component for showing a workflow status as a colored dot-and-label
            badge. Does not make API calls. Use it inside <InlineCode>renderStatus</InlineCode>{' '}
            or anywhere a status label needs to appear.
          </p>
          <PropsTable
            props={[
              {
                name: 'status',
                type: 'string',
                required: true,
                description: 'The status key used for default color lookup (e.g., active, pending, rejected). Case-insensitive.',
              },
              {
                name: 'label',
                type: 'string',
                description: 'Display label shown in the badge. Defaults to the status key with underscores replaced by spaces.',
              },
              {
                name: 'color',
                type: 'string',
                description: 'Custom hex or CSS color that overrides the built-in status color map.',
              },
              {
                name: 'showDot',
                type: 'boolean',
                default: 'true',
                description: 'Show a small colored dot before the label.',
              },
              {
                name: 'size',
                type: 'sm \| md \| lg',
                default: 'md',
                description: 'Size variant controlling padding and font size.',
              },
              {
                name: 'className',
                type: 'string',
                description: 'Additional CSS classes applied to the badge container.',
              },
            ]}
          />
          <CodeBlock
            language="jsx"
            title="use-status-badge.jsx"
            code={`import { StatusBadge } from "@zango-core/crud/table";

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
/>`}
          />
        </Section>

        <Section title="StatusButton">
          <p className="mb-4">
            A standalone button that triggers a single workflow status transition via the Zango
            API. Handles confirmation dialogs, loading state, success and error toasts, and
            lifecycle hooks. Use it inside <InlineCode>renderWorkflowTransitions</InlineCode> or
            in detail views.
          </p>
          <PropsTable
            props={[
              {
                name: 'transition',
                type: 'Transition',
                required: true,
                description: 'The transition object with name and display_name. Drives the API call and button label.',
              },
              {
                name: 'apiUrl',
                type: 'string',
                required: true,
                description: 'API endpoint URL. The component extracts object_uuid or pk from the URL automatically.',
              },
              {
                name: 'onSuccess',
                type: '() => void',
                description: 'Called after a successful transition.',
              },
              {
                name: 'onError',
                type: '(error: Error) => void',
                description: 'Called when the transition fails.',
              },
              {
                name: 'beforeClick',
                type: '() => Promise<void> \| void',
                description: 'Hook called before executing the transition. Throw to abort.',
              },
              {
                name: 'afterClick',
                type: '(success: boolean) => void',
                description: 'Hook called after execution regardless of outcome.',
              },
              {
                name: 'showConfirmation',
                type: 'boolean',
                default: 'false',
                description: 'Force a confirmation dialog before executing.',
              },
              {
                name: 'confirmationMessage',
                type: 'string',
                description: 'Custom message shown in the confirmation dialog.',
              },
              {
                name: 'variant',
                type: 'primary \| secondary \| outline \| ghost \| danger',
                default: 'primary',
                description: 'Button visual variant.',
              },
              {
                name: 'size',
                type: 'sm \| md \| lg',
                default: 'md',
                description: 'Button size variant.',
              },
              {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disable the button.',
              },
              {
                name: 'className',
                type: 'string',
                description: 'Additional CSS classes applied to the button.',
              },
            ]}
          />
          <CodeBlock
            language="jsx"
            title="use-status-button.jsx"
            code={`import { StatusButton } from "@zango-core/crud/table";

// Inside renderWorkflowTransitions
<Table
  apiUrl="/api/cases"
  tableMetadataObj={metadata}
  renderWorkflowTransitions={({ transitions, row, onTransitionClick }) =>
    transitions.map((t) => (
      <StatusButton
        key={t.name}
        transition={t}
        apiUrl={\`/api/cases/\${row.object_uuid}/\`}
        variant="outline"
        size="sm"
        onSuccess={() => console.log("Transition complete")}
      />
    ))
  }
/>`}
          />
        </Section>

        <Section title="TagSwitch">
          <p className="mb-4">
            A standalone toggle switch component for workflow tags. Reads the current tag state,
            calls the Zango API to enable or disable the tag, handles confirmation dialogs, and
            fires lifecycle hooks. Intended for use in detail views or custom tag column renderers.
          </p>
          <p className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            Note: TagSwitch expects a full tag detail object (with enable/disable metadata), while{' '}
            <InlineCode>renderTags</InlineCode> receives only <InlineCode>string[]</InlineCode>.
            Use TagSwitch inside <InlineCode>renderWorkflowTransitions</InlineCode> or{' '}
            <InlineCode>DetailWrapper</InlineCode>&apos;s custom component where the full tag shape is available.
          </p>
          <PropsTable
            props={[
              {
                name: 'tag',
                type: 'TagDetail',
                required: true,
                description: 'The tag detail object from the workflow API. Contains name, state (enabled \| disabled), enable/disable configs, and permission flags.',
              },
              {
                name: 'apiUrl',
                type: 'string',
                required: true,
                description: 'API endpoint URL. object_uuid or pk is extracted from the URL automatically.',
              },
              {
                name: 'onToggle',
                type: '(newState: boolean) => void',
                description: 'Called with the new enabled state after a successful toggle.',
              },
              {
                name: 'onError',
                type: '(error: Error) => void',
                description: 'Called when the toggle operation fails.',
              },
              {
                name: 'beforeToggle',
                type: '() => Promise<void> \| void',
                description: 'Hook called before toggling. Throw to abort.',
              },
              {
                name: 'afterToggle',
                type: '(success: boolean) => void',
                description: 'Hook called after toggle regardless of outcome.',
              },
              {
                name: 'label',
                type: 'string',
                description: 'Label displayed next to the switch. Defaults to the tag name with underscores replaced by spaces.',
              },
              {
                name: 'size',
                type: 'sm \| md \| lg',
                default: 'md',
                description: 'Size variant for the switch.',
              },
              {
                name: 'disabled',
                type: 'boolean',
                default: 'false',
                description: 'Disable the switch. Permission flags from TagDetail also prevent toggling when not allowed.',
              },
              {
                name: 'className',
                type: 'string',
                description: 'Additional CSS classes applied to the outer container.',
              },
            ]}
          />
          <CodeBlock
            language="jsx"
            title="use-tag-switch.jsx"
            code={`import { TagSwitch } from "@zango-core/crud/table";
import { WorkflowTags } from "@zango-core/crud/table";

// Use TagSwitch directly in a detail view
function CaseDetail({ caseData }) {
  return (
    <div className="space-y-3">
      {caseData.workflow_details?.tag_details?.map((tag) => (
        <TagSwitch
          key={tag.name}
          tag={tag}
          apiUrl={\`/api/cases/\${caseData.object_uuid}/\`}
          onToggle={(enabled) => console.log(tag.name, enabled)}
        />
      ))}
    </div>
  );
}`}
          />
        </Section>
      </Section>
    </DocPage>
  );
};

export default RenderPropsDocs;
