import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const TableAddButtonDocs = () => {
  return (
    <DocPage
      title="TableAddButton"
      subtitle="Configurable add button with built-in drawer and form integration."
      badge="Component"
    >
      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'buttonText',
              type: 'string | ReactNode',
              description: 'Button content. Falls back to API metadata add_btn_title then Add New.',
            },
            {
              name: 'onClick',
              type: 'function',
              description: 'Custom click handler. When provided, the built-in drawer is not used.',
            },
            {
              name: 'apiUrl',
              type: 'string',
              description: 'API URL for form initialization and submission. Falls back to context apiUrl.',
            },
            {
              name: 'showButton',
              type: 'boolean',
              description: 'Whether to show the button. Falls back to API metadata has_add_perm or features.add.',
            },
            {
              name: 'enableDrawer',
              type: 'boolean',
              default: true,
              description: 'Enable the default form drawer behavior.',
            },
            {
              name: 'variant',
              type: 'primary | secondary | outline | ghost | danger',
              default: '"primary"',
              description: 'Button style variant controlling visual appearance.',
            },
            {
              name: 'size',
              type: 'sm | md | lg',
              default: '"md"',
              description: 'Button size affecting padding and font size.',
            },
            {
              name: 'className',
              type: 'string',
              description: 'Additional CSS classes for the button element.',
            },
            {
              name: 'style',
              type: 'object',
              description: 'Custom CSS styles for the button element.',
            },
            {
              name: 'showIcon',
              type: 'boolean',
              default: false,
              description: 'Show an icon alongside the button text. Falls back to API metadata form_config.show_icon.',
            },
            {
              name: 'icon',
              type: 'ReactNode',
              description: 'Custom icon element replacing the default Plus icon.',
            },
            {
              name: 'iconPosition',
              type: 'left | right',
              default: '"left"',
              description: 'Position of the icon relative to the button text.',
            },
            {
              name: 'formConfig',
              type: 'object',
              description: 'Custom form configuration with getDataUrl, postDataUrl, httpMethod, and payloadType fields.',
            },
            {
              name: 'onFormSuccess',
              type: 'function',
              description: 'Callback after the form is submitted successfully. Table data is automatically refreshed.',
            },
            {
              name: 'drawerTitle',
              type: 'string',
              description: 'Custom title for the form drawer. Defaults to the effective button text.',
            },
            {
              name: 'drawerSize',
              type: 'sm | md | lg | xl | full',
              default: '"md"',
              description: 'Size of the form drawer panel.',
            },
          ]}
        />
      </Section>

      <Section title="Usage Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Basic Usage</h3>
        <p className="mb-3">
          With no props, <InlineCode>TableAddButton</InlineCode> renders a default add button that
          opens a form drawer powered by the table context.
        </p>
        <CodeBlock
          language="jsx"
          title="basic.jsx"
          code={`// Default add button with built-in form drawer
<TableAddButton />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Styling</h3>
        <p className="mb-3">
          Customize the button appearance with text, variant, size, icon, and additional class names.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-styling.jsx"
          code={`<TableAddButton
  buttonText="New Product"
  variant="secondary"
  size="lg"
  showIcon={true}
  className="shadow-md"
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Click (No Drawer)</h3>
        <p className="mb-3">
          When you provide an <InlineCode>onClick</InlineCode> handler, the built-in drawer is
          disabled and your custom logic takes over.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-click.jsx"
          code={`<TableAddButton
  buttonText="Create Order"
  onClick={() => {
    // Navigate to a custom creation page
    router.push('/orders/create');
  }}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">With Form Success Callback</h3>
        <p className="mb-3">
          Use <InlineCode>onFormSuccess</InlineCode> to perform actions after the form is
          submitted successfully, such as showing a toast or refreshing data.
        </p>
        <CodeBlock
          language="jsx"
          title="form-success.jsx"
          code={`<TableAddButton
  buttonText="Add User"
  drawerTitle="Create New User"
  drawerSize="lg"
  onFormSuccess={() => {
    toast.success('User created successfully!');
    refetchData();
  }}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom HTML Content</h3>
        <p className="mb-3">
          Pass JSX as <InlineCode>buttonText</InlineCode> for rich button content.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-content.jsx"
          code={`<TableAddButton
  buttonText={
    <span className="flex items-center gap-2">
      <PlusCircle size={16} />
      <span>Add Item</span>
    </span>
  }
/>`}
        />
      </Section>

      <Section title="Integration Patterns">
        <p className="mb-4">
          <InlineCode>TableAddButton</InlineCode> works well as part of a custom header alongside
          other table components. Here is an example using it within a{' '}
          <InlineCode>CrudHandler</InlineCode> custom header.
        </p>
        <CodeBlock
          language="jsx"
          title="integration-pattern.jsx"
          code={`<CrudHandler
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
/>`}
        />
        <Callout type="tip" title="Context Aware">
          When used inside a <InlineCode>CrudHandler</InlineCode>, both{' '}
          <InlineCode>TableAddButton</InlineCode> and <InlineCode>TableUtilities</InlineCode>{' '}
          automatically inherit the table context, including the API endpoint and column definitions.
          No additional wiring is needed.
        </Callout>
      </Section>
    </DocPage>
  );
};

export default TableAddButtonDocs;
