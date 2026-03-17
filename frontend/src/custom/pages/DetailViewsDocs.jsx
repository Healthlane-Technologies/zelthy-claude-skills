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
              type: 'string | null',
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
              type: 'string | number',
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
              description: 'General details section with a fields object. Each field is keyed by field_name and has { name, display_name, type, value, searchable, sortable }.',
            },
            {
              name: 'workflow_details',
              type: 'object',
              description: 'Workflow data including current_status (string key), current_status_meta ({ name, from, to, status_label, status_color, is_form_based, is_manual }), next_transitions (array), and tag_details (array).',
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

      <Section title="DetailViewProvider">
        <p className="mb-4">
          Wraps child components with shared detail view context. All children can access detail data
          via <InlineCode>useDetailViewContext()</InlineCode> without prop drilling.
        </p>
        <CodeBlock
          language="jsx"
          title="detail-view-provider.jsx"
          code={`import { DetailViewProvider, WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

// Wrap components for shared context
<DetailViewProvider apiUrl="/api/users/?object_uuid=123">
  <WorkflowStatus />   {/* Automatically uses context */}
  <WorkflowTags />     {/* Automatically uses context */}
  <MyCustomComponent /> {/* Can call useDetailViewContext() */}
</DetailViewProvider>`}
        />
      </Section>

      <Section title="StandaloneDetailView">
        <p className="mb-4">
          Renders a detail view independently without <InlineCode>CrudHandler</InlineCode>.
          Useful for custom detail pages or embedding detail views in other layouts.
        </p>
        <CodeBlock
          language="jsx"
          title="standalone-detail.jsx"
          code={`import { StandaloneDetailView } from "@zango-core/crud/table";

<StandaloneDetailView
  apiUrl="/api/users/"
  objectUuid="550e8400-e29b-41d4-a716-446655440000"
/>`}
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
const { data, refresh } = useDetailViewContext();`}
        />
        <Callout type="info" title="Full Hook Reference">
          See the <a href="/app/workflow-hooks" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'underline' }}>Hooks Reference</a> page for complete documentation on all available hooks including useDetailView, useDetailViewContext, useWorkflow, and more.
        </Callout>
      </Section>
    </DocPage>
  );
};

export default DetailViewsDocs;
