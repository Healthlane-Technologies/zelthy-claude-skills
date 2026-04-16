import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const DetailViewsDocs = () => {
  return (
    <DocPage
      title="Detail Views"
      subtitle="Drawer and route-based detail views with automatic data fetching."
      badge="Views"
    >
      <Section title="Overview">
        <p className="mb-4">
          <InlineCode>CrudHandler</InlineCode> supports two types of detail views for displaying
          individual record information:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <strong>Drawer Detail View</strong> — Opens a side panel overlay on the current page.
            Ideal for quick previews without leaving the table context.
          </li>
          <li>
            <strong>Main Detail View (Route-based)</strong> — Navigates to a dedicated detail page
            via routing. Best for full-page layouts with rich content.
          </li>
        </ul>
        <p>
          The latest version automatically fetches detail data for both view types, so your custom
          components receive fully resolved data as props without any manual API calls.
        </p>
      </Section>

      <Section title="Automatic Data Fetching">
        <p className="mb-4">
          When you provide a <InlineCode>customDrawerDetail</InlineCode> or{' '}
          <InlineCode>customMainDetail</InlineCode> component to <InlineCode>CrudHandler</InlineCode>,
          the framework automatically handles the entire data lifecycle:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>
            Wraps your component with <InlineCode>DetailWrapper</InlineCode> (for main views) or{' '}
            <InlineCode>DrawerDetailWrapper</InlineCode> (for drawer views).
          </li>
          <li>
            Fetches the detail data from the API using the record's{' '}
            <InlineCode>object_uuid</InlineCode> or <InlineCode>pk</InlineCode>.
          </li>
          <li>
            Passes the complete response data as props to your custom component.
          </li>
          <li>
            Provides an <InlineCode>onRefresh</InlineCode> callback to re-fetch data on demand.
          </li>
          <li>
            Handles loading and error states automatically, so your component only renders when data
            is available.
          </li>
        </ol>
        <Callout type="tip" title="No Manual Fetching Required">
          Data is automatically fetched — no need to manually fetch using the API endpoint.
          Your custom detail component receives everything it needs through props.
        </Callout>
      </Section>

      <Section title="Data Props Provided">
        <p className="mb-4">
          Both drawer and main detail components receive the following props automatically:
        </p>
        <PropsTable
          props={[
            {
              name: 'data',
              type: 'object',
              description: 'Complete detail response from the API, containing all fields and nested data for the record.',
            },
            {
              name: 'api_endpoint',
              type: 'string',
              description: 'The API endpoint used to fetch the detail data.',
            },
            {
              name: 'loading',
              type: 'boolean',
              description: 'Whether the detail data is currently being fetched.',
            },
            {
              name: 'error',
              type: 'string \\| null',
              description: 'Error message if the data fetch failed, or null if successful.',
            },
            {
              name: 'onRefresh',
              type: 'function',
              description: 'Callback to re-fetch the detail data. Useful after performing mutations like status transitions or edits.',
            },
            {
              name: 'objectUuid',
              type: 'string',
              description: 'The unique object UUID of the current record.',
            },
            {
              name: 'pk',
              type: 'string \\| number',
              description: 'The primary key of the current record.',
            },
            {
              name: 'title',
              type: 'string',
              description: 'The display title for the detail view, derived from the record data.',
            },
            {
              name: 'general_details',
              type: 'object',
              description: 'General details section. fields is an object keyed by field_name; each entry is { display_name, value } only.',
            },
            {
              name: 'workflow_details',
              type: 'object',
              description: 'Workflow data including current_status (string), current_status_meta ({ status_label, status_color }), next_transitions (array of { name, display_name, is_form_based, confirmation_message, description, from, to }), and tag_details (array of { name, state, enable, disable, is_enable_allowed, is_disable_allowed }).',
            },
            {
              name: 'sections',
              type: 'array',
              description: 'Array of section objects, each with key, name, title, data (object), optional extra_html, and optional form ({ is_multistep, form: { json_schema, ui_schema } }).',
            },
            {
              name: 'row_actions',
              type: 'array',
              description: 'Array of available row-level actions for the current record.',
            },
            {
              name: 'configurations',
              type: 'object',
              description: 'Additional configuration metadata for the detail view.',
            },
          ]}
        />
        <p className="mt-4 mb-2 font-medium">API response shape (ground truth):</p>
        <CodeBlock
          language="json"
          title="detail-view-response.json"
          code={`{
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
}`}
        />
      </Section>

      <Section title="Drawer Detail View">
        <p className="mb-4">
          The drawer detail view opens as a side panel overlay. Your custom component receives
          additional drawer-specific props like <InlineCode>selectedRow</InlineCode>,{' '}
          <InlineCode>open</InlineCode>, and <InlineCode>onClose</InlineCode> alongside the
          auto-fetched data props.
        </p>
        <CodeBlock
          language="jsx"
          title="CustomDrawerDetail.jsx"
          code={`import React from 'react';

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

export default CustomDrawerDetail;`}
        />

        <p className="mt-6 mb-4">
          Pass the custom drawer component to <InlineCode>CrudHandler</InlineCode>:
        </p>
        <CodeBlock
          language="jsx"
          title="usage-drawer.jsx"
          code={`import CustomDrawerDetail from './CustomDrawerDetail';

<CrudHandler
  api_endpoint="/api/users"
  customDrawerDetail={CustomDrawerDetail}
/>`}
        />
      </Section>

      <Section title="Main Detail View (Route-based)">
        <p className="mb-4">
          The main detail view replaces the table with a full-page detail layout, accessible via
          route navigation. Your component receives the auto-fetched data along with an{' '}
          <InlineCode>onRefresh</InlineCode> callback for re-fetching after mutations.
        </p>
        <CodeBlock
          language="jsx"
          title="CustomMainDetail.jsx"
          code={`import React from 'react';
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

export default CustomMainDetail;`}
        />

        <p className="mt-6 mb-4">
          Pass the custom main detail component to <InlineCode>CrudHandler</InlineCode>. Use{' '}
          <InlineCode>customTableBody</InlineCode> with{' '}
          <InlineCode>defaultDetailView="navigate"</InlineCode> to enable row-click navigation
          to the detail route:
        </p>
        <CodeBlock
          language="jsx"
          title="usage-main-detail.jsx"
          code={`import CustomMainDetail from './CustomMainDetail';

<CrudHandler
  api_endpoint="/api/users"
  customMainDetail={CustomMainDetail}
  customTableBody={
    <TableBody defaultDetailView="navigate" />
  }
/>`}
        />

        <Callout type="tip" title="Automatic Data Fetching">
          Data is automatically fetched — no need to manually fetch using the API endpoint.
          Both drawer and main detail components receive the complete detail response through props,
          including <InlineCode>general_details</InlineCode>, <InlineCode>workflow_details</InlineCode>,
          and <InlineCode>sections</InlineCode>.
        </Callout>
      </Section>

      <Section title="StandaloneDetailView">
        <p className="mb-4">
          Renders a complete detail view independently — no <InlineCode>CrudHandler</InlineCode> needed.
          Internally wraps children with <InlineCode>DetailViewProvider</InlineCode> and renders the
          default Detail UI (or a <InlineCode>customComponent</InlineCode> if supplied). Accepts either
          a full <InlineCode>apiUrl</InlineCode> or an <InlineCode>objectUuid</InlineCode> plus a{' '}
          <InlineCode>baseApiUrl</InlineCode>.
        </p>
        <PropsTable
          props={[
            {
              name: 'apiUrl',
              type: 'string',
              description: 'Full API URL already containing object_uuid, action, and view query params. Use for standalone pages.',
            },
            {
              name: 'objectUuid',
              type: 'string',
              description: 'Object UUID only. The component builds the full URL from baseApiUrl + objectUuid.',
            },
            {
              name: 'baseApiUrl',
              type: 'string',
              default: '/api/crud',
              description: 'Base API URL used when objectUuid is provided.',
            },
            {
              name: 'onClose',
              type: '() => void',
              description: 'Close handler forwarded to the detail component (used in drawer contexts).',
            },
            {
              name: 'customComponent',
              type: 'React.ComponentType',
              description: 'Custom component rendered instead of the default Detail. Receives all context data plus any extra props passed to StandaloneDetailView.',
            },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="standalone-detail.jsx"
          code={`import { StandaloneDetailView } from "@zango-core/crud/table";

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
/>`}
        />
      </Section>

      <Section title="DetailViewProvider">
        <p className="mb-4">
          Context provider that fetches detail data once and shares it with all descendant components.
          Use it to avoid prop-drilling when multiple components on the same page need the same
          record data. Children can call <InlineCode>useDetailViewContext()</InlineCode> to consume
          the shared data.
        </p>
        <PropsTable
          props={[
            {
              name: 'apiUrl',
              type: 'string',
              description: 'Full API URL containing object_uuid. Takes priority over objectUuid + baseApiUrl.',
            },
            {
              name: 'objectUuid',
              type: 'string',
              description: 'Object UUID. Combined with baseApiUrl to build the fetch URL when apiUrl is not provided.',
            },
            {
              name: 'baseApiUrl',
              type: 'string',
              default: '/api/crud',
              description: 'Base API URL used to build the fetch URL.',
            },
            {
              name: 'children',
              type: 'React.ReactNode',
              required: true,
              description: 'Child components that will have access to the detail view context.',
            },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="detail-view-provider.jsx"
          code={`import { DetailViewProvider, WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

// Wrap components for shared context
<DetailViewProvider
  objectUuid="uuid-001"
  baseApiUrl="/api/users/"
>
  <WorkflowStatus />    {/* reads context automatically */}
  <WorkflowTags />      {/* reads context automatically */}
  <MyCustomComponent /> {/* can call useDetailViewContext() */}
</DetailViewProvider>`}
        />
      </Section>

      <Section title="DetailWrapper">
        <p className="mb-4">
          Internal component used by <InlineCode>CrudHandler</InlineCode> to wrap the main
          (route-based) detail view. Reads <InlineCode>object_uuid</InlineCode> from URL params,
          builds the full API URL, and provides the <InlineCode>DetailViewProvider</InlineCode>
          context before rendering the default or custom detail component.
        </p>
        <PropsTable
          props={[
            {
              name: 'apiUrl',
              type: 'string',
              required: true,
              description: 'Base API URL. The component appends object_uuid from route params plus action and view query params.',
            },
            {
              name: 'customComponent',
              type: 'React.ComponentType',
              description: 'Custom detail component to render. Receives data, loading, error, workflowDetails, generalDetails, sections, rowActions, objectUuid, pk, onRefresh, and apiUrl as props.',
            },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="detail-wrapper-usage.jsx"
          code={`import { DetailWrapper } from "@zango-core/crud/table";

// Used internally by CrudHandler — direct usage only needed in advanced setups
<DetailWrapper
  apiUrl="/api/users/"
  customComponent={MyDetailPage}
/>`}
        />
      </Section>

      <Section title="DrawerDetailWrapper">
        <p className="mb-4">
          Internal component used by <InlineCode>CrudHandler</InlineCode> to wrap the drawer detail
          view. Delegates to <InlineCode>StandaloneDetailView</InlineCode> with the row's
          <InlineCode>objectUuid</InlineCode>, rendering nothing when{' '}
          <InlineCode>open</InlineCode> is false.
        </p>
        <PropsTable
          props={[
            {
              name: 'objectUuid',
              type: 'string',
              required: true,
              description: 'UUID of the record to display.',
            },
            {
              name: 'open',
              type: 'boolean',
              required: true,
              description: 'Whether the drawer is visible. Renders null when false.',
            },
            {
              name: 'onClose',
              type: '() => void',
              required: true,
              description: 'Callback to close the drawer.',
            },
            {
              name: 'apiUrl',
              type: 'string',
              required: true,
              description: 'Base API URL forwarded to StandaloneDetailView as baseApiUrl.',
            },
            {
              name: 'selectedRow',
              type: 'object',
              description: 'The full row data object. Forwarded to the custom component.',
            },
            {
              name: 'customComponent',
              type: 'React.ComponentType',
              description: 'Custom component to render inside the drawer instead of the default Detail.',
            },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="drawer-detail-wrapper-usage.jsx"
          code={`import { DrawerDetailWrapper } from "@zango-core/crud/table";

// Used internally by CrudHandler — direct usage only needed in advanced setups
<DrawerDetailWrapper
  objectUuid={selectedRow?.object_uuid}
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  apiUrl="/api/users/"
  selectedRow={selectedRow}
  customComponent={MyDrawerDetail}
/>`}
        />
      </Section>

      <Section title="TableDrawer">
        <p className="mb-4">
          The generic drawer primitive exported from <InlineCode>@zango-core/crud/table</InlineCode>.
          Use <InlineCode>TableDrawer</InlineCode> when you need direct control over the drawer shell —
          position, size, navigation arrows, and arbitrary children — without tying it to the
          <InlineCode>CrudHandler</InlineCode> lifecycle. Use{' '}
          <InlineCode>DrawerDetailWrapper</InlineCode> instead when you want the automatic data-fetch
          behaviour that <InlineCode>CrudHandler</InlineCode> provides for drawer detail views.
        </p>
        <PropsTable
          props={[
            {
              name: 'open',
              type: 'boolean',
              required: true,
              description: 'Whether the drawer is visible.',
            },
            {
              name: 'onClose',
              type: '() => void',
              required: true,
              description: 'Callback invoked when the drawer requests to be closed.',
            },
            {
              name: 'selectedRow',
              type: 'Row<any> \\| null',
              required: true,
              description: 'The currently selected TanStack table row. Used to derive the default title when no title prop is provided.',
            },
            {
              name: 'position',
              type: 'right \\| left \\| bottom \\| top',
              default: 'right',
              description: 'Side of the screen the drawer slides in from.',
            },
            {
              name: 'size',
              type: 'sm \\| md \\| lg \\| xl \\| full',
              default: 'lg',
              description: 'Width (for left/right) or height (for top/bottom) of the drawer (500px for left/right when lg).',
            },
            {
              name: 'title',
              type: 'React.ReactNode',
              description: 'Custom drawer title. Falls back to UIStore drawerTitle then to an auto-generated title from row data (name, title, email, id, object_uuid, pk).',
            },
            {
              name: 'children',
              type: 'React.ReactNode',
              description: 'Drawer content. When omitted the drawer renders a default key/value list from selectedRow.original.',
            },
            {
              name: 'className',
              type: 'string',
              description: 'Additional CSS classes merged onto the drawer container.',
            },
            {
              name: 'apiUrl',
              type: 'string',
              description: 'API URL available for the default content slot. Has no effect when children are provided.',
            },
            {
              name: 'showNavigation',
              type: 'boolean',
              description: 'Show next/previous row navigation arrows inside the drawer header.',
            },
            {
              name: 'onNavigateNext',
              type: '() => void',
              description: 'Handler called when the user clicks the next-row arrow.',
            },
            {
              name: 'onNavigatePrevious',
              type: '() => void',
              description: 'Handler called when the user clicks the previous-row arrow.',
            },
            {
              name: 'canNavigateNext',
              type: 'boolean',
              description: 'Whether a next row is available; disables the next arrow when false.',
            },
            {
              name: 'canNavigatePrevious',
              type: 'boolean',
              description: 'Whether a previous row is available; disables the previous arrow when false.',
            },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="table-drawer-usage.jsx"
          code={`import { TableDrawer } from "@zango-core/crud/table";
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
};`}
        />
      </Section>

      <Section title="Detail Hooks">
        <p className="mb-4">
          Two hooks are available for programmatic access to detail data:
        </p>
        <PropsTable
          props={[
            { name: 'useDetailView({ apiUrl })', type: 'Hook', description: 'Fetches detail data for a specific record. Returns: data, loading, error, refresh, objectUuid, workflowDetails, rowActions.' },
            { name: 'useDetailViewContext()', type: 'Hook', description: 'Reads from the nearest DetailViewProvider context. Same return shape as useDetailView but from shared context.' },
          ]}
        />
        <CodeBlock
          language="jsx"
          title="detail-hooks.jsx"
          code={`import { useDetailView, useDetailViewContext } from "@zango-core/crud/table";

// Standalone - fetches its own data
const { data, loading, workflowDetails } = useDetailView({
  apiUrl: "/api/users/?object_uuid=123"
});

// Context-based - reads from DetailViewProvider
const { data, refreshDetail } = useDetailViewContext();`}
        />
        <Callout type="info" title="Full Hook Reference">
          See the <a href="/app/workflow-hooks" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'underline' }}>Hooks Reference</a> page for complete documentation on all available hooks including useDetailView, useDetailViewContext, useWorkflow, and more.
        </Callout>
      </Section>
    </DocPage>
  );
};

export default DetailViewsDocs;
