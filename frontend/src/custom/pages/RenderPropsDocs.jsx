import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const RenderPropsDocs = () => {
  return (
    <DocPage
      title="Render Props"
      subtitle="Custom rendering for action, status, and tag columns while maintaining all functionality and state management."
      badge="Advanced"
    >
      <Section title="Overview">
        <p className="mb-4">
          Three column types in the table support render props, allowing you to fully customize
          their appearance while the framework handles all underlying state management,
          event handling, and data resolution:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Actions</strong> — Custom action buttons and menus per row.</li>
          <li><strong>Status</strong> — Custom status badge rendering with resolved values.</li>
          <li><strong>Tags</strong> — Custom tag display with overflow handling.</li>
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
  renderActions={({ actions, row, onActionClick }) => (
    // Custom actions UI
  )}
  renderStatus={({ statusValue, isObject }) => (
    // Custom status badge
  )}
  renderTags={({ visibleTags, remainingTags, hasMoreTags }) => (
    // Custom tag layout
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
              type: 'any[]',
              description: 'Array of available action objects for the current row, each containing name, label, and configuration.',
            },
            {
              name: 'row',
              type: 'any',
              description: 'The full table row data object. Access fields via row.original for raw API data.',
            },
            {
              name: 'onActionClick',
              type: '(action) => void',
              description: 'Trigger the action execution pipeline for a given action. Handles confirmations, API calls, and table refresh.',
            },
            {
              name: 'menuOpen',
              type: 'boolean',
              description: 'Current state of the dropdown menu. Use this to control visual state of custom menus.',
            },
            {
              name: 'setMenuOpen',
              type: '(open) => void',
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
              type: 'string',
              description: 'The resolved status string ready for display. Extracted from value regardless of its original format.',
            },
            {
              name: 'isObject',
              type: 'boolean',
              description: 'True if the raw value is an object (e.g., { status_label: "Active", status_color: "#12B76A" }).',
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
        className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium \${colors.bg} \${colors.text}\`}
      >
        <span className={\`w-1.5 h-1.5 rounded-full \${colors.dot}\`} />
        {statusValue}
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
              type: 'any[]',
              description: 'The complete array of all tags assigned to the row.',
            },
            {
              name: 'visibleTags',
              type: 'any[]',
              description: 'Subset of tags displayed inline, sliced to fit within the maxVisible limit.',
            },
            {
              name: 'remainingTags',
              type: 'any[]',
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
              description: 'The maximum number of tags shown inline before overflow. Determined by the table column configuration.',
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
/>`}
        />

        <Callout type="info" title="Tag Value Types">
          Tags can be strings or objects. When tags are objects, access the display text via
          properties like <InlineCode>tag.label</InlineCode> or <InlineCode>tag.name</InlineCode>,
          depending on your API response structure.
        </Callout>
      </Section>
    </DocPage>
  );
};

export default RenderPropsDocs;
