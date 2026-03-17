import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const TableSearchDocs = () => {
  return (
    <DocPage
      title="TableSearch"
      subtitle="Standalone search input that syncs with table context."
      badge="Component"
    >
      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'placeholder',
              type: 'string',
              default: '"Search..."',
              description: 'Placeholder text displayed when the search input is empty.',
            },
            {
              name: 'className',
              type: 'string',
              description: 'Additional CSS classes applied to the search input element for custom styling.',
            },
            {
              name: 'containerClassName',
              type: 'string',
              description: 'Additional CSS classes applied to the outer container wrapping the search input and icons.',
            },
            {
              name: 'leftIcon',
              type: 'ReactNode',
              description: 'Custom left icon element. Defaults to a magnifying glass search icon.',
            },
            {
              name: 'rightIcon',
              type: 'ReactNode',
              description: 'Custom right icon element. Useful for adding a clear button or secondary action.',
            },
          ]}
        />
        <Callout type="info" title="Table Context">
          <InlineCode>TableSearch</InlineCode> automatically syncs with the table context. The search
          value is debounced and triggers a server-side search request, so there is no need to
          manage search state manually.
        </Callout>
      </Section>

      <Section title="Usage Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Basic Usage</h3>
        <p className="mb-3">
          Renders a search input with default placeholder and the built-in search icon.
        </p>
        <CodeBlock
          language="jsx"
          title="basic.jsx"
          code={`// Default search with automatic table context sync
<TableSearch />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Customized Search</h3>
        <p className="mb-3">
          Customize the placeholder text and apply additional styles via class names.
        </p>
        <CodeBlock
          language="jsx"
          title="customized.jsx"
          code={`<TableSearch
  placeholder="Search by name, email, or ID..."
  className="text-sm font-medium"
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Icons</h3>
        <p className="mb-3">
          Replace the default icons with custom elements. A common pattern is adding a clear button
          as the right icon.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-icons.jsx"
          code={`import { Filter, XCircle } from 'lucide-react';

<TableSearch
  placeholder="Filter results..."
  leftIcon={<Filter size={16} className="text-gray-400" />}
  rightIcon={
    <button
      onClick={handleClearSearch}
      className="text-gray-400 hover:text-gray-600"
    >
      <XCircle size={16} />
    </button>
  }
/>`}
        />
      </Section>
    </DocPage>
  );
};

export default TableSearchDocs;
