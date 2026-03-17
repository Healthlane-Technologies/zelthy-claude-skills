import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const TablePaginationDocs = () => {
  return (
    <DocPage
      title="TablePagination"
      subtitle="Pagination controls with page navigation and rows-per-page selection."
      badge="Component"
    >
      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'showRowsPerPage',
              type: 'boolean',
              default: true,
              description: 'Show or hide the rows-per-page selector dropdown. When hidden, the default page size is used.',
            },
            {
              name: 'rowsPerPageOptions',
              type: 'number[]',
              default: '[10, 20, 50, 100]',
              description: 'Array of available page size options displayed in the rows-per-page dropdown.',
            },
            {
              name: 'className',
              type: 'string',
              description: 'Additional CSS classes applied to the pagination container for custom styling.',
            },
            {
              name: 'showPageInfo',
              type: 'boolean',
              default: true,
              description: 'Show or hide the "Page X of Y" information text between the navigation controls.',
            },
          ]}
        />
      </Section>

      <Section title="Usage Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Basic Usage</h3>
        <p className="mb-3">
          With no props, <InlineCode>TablePagination</InlineCode> renders with default page size
          options and full navigation controls.
        </p>
        <CodeBlock
          language="jsx"
          title="basic.jsx"
          code={`// Default pagination with all controls
<TablePagination />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Page Sizes</h3>
        <p className="mb-3">
          Provide a custom set of page size options and optionally hide the page info text.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-sizes.jsx"
          code={`<TablePagination
  rowsPerPageOptions={[5, 10, 25, 50]}
  showPageInfo={false}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Hide Rows Per Page</h3>
        <p className="mb-3">
          When you want a fixed page size without user control, hide the rows-per-page selector.
        </p>
        <CodeBlock
          language="jsx"
          title="hide-rows-per-page.jsx"
          code={`<TablePagination showRowsPerPage={false} />`}
        />
      </Section>
    </DocPage>
  );
};

export default TablePaginationDocs;
