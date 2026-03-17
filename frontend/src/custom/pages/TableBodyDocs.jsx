import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const TableBodyDocs = () => {
  return (
    <DocPage
      title="TableBody"
      subtitle="Main table data display component with virtualization and row interaction support."
      badge="Component"
    >
      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'table',
              type: 'TanstackTable<any>',
              required: true,
              description: 'TanStack table instance that provides row models, column definitions, and table state.',
            },
            {
              name: 'defaultDetailView',
              type: 'RowClickAction | RowClickConfig',
              description:
                "Row click behavior configuration. Can be a string ('drawer', 'navigate', 'custom') or a config object with action and additional options.",
              default: "'drawer'",
            },
            {
              name: 'selectedRow',
              type: 'Row | null',
              description: 'Currently selected row object. Used to highlight the active row in the table.',
            },
            {
              name: 'drawerOpen',
              type: 'boolean',
              description: 'Whether the detail drawer is currently open. Controls visual state of selected row.',
            },
            {
              name: 'isLoading',
              type: 'boolean',
              description: 'Loading state for initial data fetch. Displays skeleton placeholders when true.',
            },
            {
              name: 'isFetching',
              type: 'boolean',
              description: 'Loading state for subsequent data updates (e.g., pagination, filtering). Shows a subtle loading indicator without replacing content.',
            },
          ]}
        />
      </Section>

      <Section title="Row Click Behaviors">
        <p className="mb-4">
          <InlineCode>TableBody</InlineCode> supports three row click behaviors that determine what happens when
          a user clicks on a table row. The default behavior opens a detail drawer.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Drawer (Default)</h3>
        <p className="mb-3">
          Opens a side drawer with row details. This is the default behavior when no{' '}
          <InlineCode>defaultDetailView</InlineCode> prop is provided.
        </p>
        <CodeBlock
          language="jsx"
          title="drawer-default.jsx"
          code={`// Default behavior - opens a detail drawer on row click
<TableBody />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Navigate</h3>
        <p className="mb-3">
          Navigates to a detail page when a row is clicked. Uses the row's{' '}
          <InlineCode>object_uuid</InlineCode> to construct the URL by default.
        </p>
        <CodeBlock
          language="jsx"
          title="navigate-mode.jsx"
          code={`// Navigate to detail page on row click
<TableBody defaultDetailView="navigate" />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Navigate with Custom URL Template</h3>
        <p className="mb-3">
          Use a config object to specify a custom URL template. Placeholders like{' '}
          <InlineCode>{'{object_uuid}'}</InlineCode> are replaced with actual row values.
        </p>
        <CodeBlock
          language="jsx"
          title="navigate-custom-url.jsx"
          code={`// Navigate with a custom URL template
<TableBody
  defaultDetailView={{
    action: "navigate",
    navigateUrlTemplate: "/users/{object_uuid}/profile"
  }}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Handler</h3>
        <p className="mb-3">
          Provide a completely custom click handler for full control over row click behavior.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-handler.jsx"
          code={`// Custom row click handler
<TableBody
  defaultDetailView={{
    action: "custom",
    customHandler: (row) => console.log(row.original)
  }}
/>`}
        />

        <Callout type="info" title="Row Data Access">
          In the custom handler, <InlineCode>row.original</InlineCode> contains the raw data object
          for that row, giving you access to all fields returned by the API.
        </Callout>
      </Section>
    </DocPage>
  );
};

export default TableBodyDocs;
