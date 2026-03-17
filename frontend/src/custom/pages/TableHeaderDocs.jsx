import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const TableHeaderDocs = () => {
  return (
    <DocPage
      title="TableHeader"
      subtitle="Page header component with title, count, and action buttons."
      badge="Component"
    >
      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'title',
              type: 'string | ReactNode',
              description: 'Header title text or custom React element. Supports plain strings or JSX for rich formatting.',
            },
            {
              name: 'totalCount',
              type: 'number',
              description: 'Total number of items in the dataset. Displayed as a badge next to the title.',
            },
            {
              name: 'showCount',
              type: 'boolean',
              default: true,
              description: 'Show or hide the total count badge next to the title.',
            },
            {
              name: 'showAddButton',
              type: 'boolean',
              description: 'Show or hide the add/create button in the header actions area.',
            },
            {
              name: 'addButtonTitle',
              type: 'string | ReactNode',
              description: 'Custom text or element for the add button. Defaults to a standard "Add" label.',
            },
            {
              name: 'onAddClick',
              type: 'function',
              description: 'Custom click handler for the add button. Overrides the default behavior of opening the built-in form drawer.',
            },
            {
              name: 'extraActions',
              type: 'ReactNode',
              description: 'Additional action elements rendered alongside the default add button. Useful for export, import, or bulk action buttons.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Content rendered between the title area and the action buttons. Commonly used for filters, status tabs, or date range selectors.',
            },
            {
              name: 'api_endpoint',
              type: 'string',
              description: 'API endpoint for the default add form. Used by the built-in form drawer to submit new records.',
            },
            {
              name: 'enableDefaultAddForm',
              type: 'boolean',
              default: true,
              description: 'Enable or disable the built-in form drawer that opens when the add button is clicked. Set to false when using a custom add flow.',
            },
          ]}
        />
      </Section>

      <Section title="Usage Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Basic Usage</h3>
        <p className="mb-3">
          With no props, <InlineCode>TableHeader</InlineCode> renders a default header with title and
          add button driven by the table context.
        </p>
        <CodeBlock
          language="jsx"
          title="basic.jsx"
          code={`// Uses defaults from table context
<TableHeader />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Title and Extra Actions</h3>
        <CodeBlock
          language="jsx"
          title="custom-actions.jsx"
          code={`<TableHeader
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
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">HTML Title with Custom Handler</h3>
        <CodeBlock
          language="jsx"
          title="html-title.jsx"
          code={`<TableHeader
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
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">With Children (Filters)</h3>
        <p className="mb-3">
          Use the <InlineCode>children</InlineCode> prop to render filters or other controls between
          the title and action buttons.
        </p>
        <CodeBlock
          language="jsx"
          title="with-children.jsx"
          code={`<TableHeader title="Inventory" totalCount={856}>
  <StatusFilter
    options={['All', 'In Stock', 'Low Stock', 'Out of Stock']}
    onChange={handleStatusChange}
  />
  <DateRangeFilter
    onRangeChange={handleDateChange}
  />
</TableHeader>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Disable Default Form</h3>
        <p className="mb-3">
          When you need to navigate to a separate creation page instead of using the built-in form drawer,
          disable the default form and provide a custom click handler.
        </p>
        <CodeBlock
          language="jsx"
          title="disable-default-form.jsx"
          code={`<TableHeader
  enableDefaultAddForm={false}
  onAddClick={() => router.push('/products/new')}
/>`}
        />
      </Section>
    </DocPage>
  );
};

export default TableHeaderDocs;
