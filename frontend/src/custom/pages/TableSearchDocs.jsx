import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const TableSearchDocs = () => {
  return (
    <DocPage
      title="TableSearch"
      subtitle="Standalone search input that syncs with table context, plus the useTableSearch hook for custom search UIs."
      badge="Component + Hook"
    >
      <Section title="TableSearchField Props">
        <PropsTable
          props={[
            {
              name: 'searchTerm',
              type: 'string',
              description: 'Controlled search value. Falls back to context searchTerm when omitted.',
            },
            {
              name: 'onSearchChange',
              type: '(e: ChangeEvent<HTMLInputElement>) => void',
              description: 'Change handler. When omitted, the field calls context.setSearchTerm automatically.',
            },
            {
              name: 'placeholder',
              type: 'string',
              description: 'Placeholder text. Falls back to metadata.utilities_config.search_placeholder then Search.',
            },
            {
              name: 'inputSize',
              type: 'sm \| md \| lg',
              default: 'sm',
              description: 'Height variant forwarded to the underlying Input component.',
            },
            {
              name: 'className',
              type: 'string',
              description: 'Extra classes merged onto the outer wrapper div.',
            },
            {
              name: 'style',
              type: 'CSSProperties',
              description: 'Inline style applied to the outer wrapper div.',
            },
            {
              name: 'containerClassName',
              type: 'string',
              description: 'Extra classes concatenated before the max-w-sm wrapper classes.',
            },
            {
              name: 'showSearch',
              type: 'boolean',
              default: 'true',
              description: 'When false the field returns null. Falls back to metadata.utilities_config.show_search.',
            },
          ]}
        />
        <Callout type="info" title="Table Context">
          <InlineCode>TableSearchField</InlineCode> auto-syncs with the nearest <InlineCode>TableProvider</InlineCode>. When used inside a provider you can omit <InlineCode>searchTerm</InlineCode> and <InlineCode>onSearchChange</InlineCode> entirely — the field reads and writes context state for you.
        </Callout>
      </Section>

      <Section title="useTableSearch Hook">
        <p className="mb-3">
          Lightweight hook that exposes the search slice of <InlineCode>TableContext</InlineCode>.
          Use it when you want to build a fully custom search UI while still syncing with the
          shared table state.
        </p>
        <PropsTable
          title="Return Value"
          props={[
            {
              name: 'searchTerm',
              type: 'string',
              default: "''",
              description: 'Current raw search value typed by the user.',
            },
            {
              name: 'setSearchTerm',
              type: '(value: string) => void',
              description: 'Updates the raw search term. The context debounces this before firing list requests.',
            },
            {
              name: 'debouncedSearchTerm',
              type: 'string',
              default: "''",
              description: 'Debounced search value used by the provider when fetching rows.',
            },
          ]}
        />
        <Callout type="warning" title="Requires TableProvider">
          <InlineCode>useTableSearch</InlineCode> must be called inside a <InlineCode>TableProvider</InlineCode> subtree. Calling it outside a provider throws from <InlineCode>useTableContext</InlineCode>.
        </Callout>
      </Section>

      <Section title="Usage Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Basic Usage</h3>
        <p className="mb-3">
          Renders a search input that binds to the surrounding table context automatically.
        </p>
        <CodeBlock
          language="jsx"
          title="basic.jsx"
          code={`// Default search — placeholder and handler come from context
<TableSearchField />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Controlled Standalone</h3>
        <p className="mb-3">
          Use outside a provider by passing <InlineCode>searchTerm</InlineCode> and
          <InlineCode> onSearchChange</InlineCode> directly.
        </p>
        <CodeBlock
          language="jsx"
          title="standalone.jsx"
          code={`<TableSearchField
  searchTerm={searchTerm}
  onSearchChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search products..."
  inputSize="md"
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom UI with Hook</h3>
        <p className="mb-3">
          Build your own search surface while keeping the list in sync via
          <InlineCode> useTableSearch</InlineCode>.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-search.jsx"
          code={`import { useTableSearch } from '@zango-core/crud/table';

function CommandBarSearch() {
  const { searchTerm, setSearchTerm, debouncedSearchTerm } = useTableSearch();

  return (
    <div className="flex items-center gap-2">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search..."
      />
      {debouncedSearchTerm && (
        <span className="text-xs text-gray-500">
          Searching for: {debouncedSearchTerm}
        </span>
      )}
    </div>
  );
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Hide Search Conditionally</h3>
        <p className="mb-3">
          Set <InlineCode>showSearch</InlineCode> to false to unmount the field (or let
          backend metadata drive this via <InlineCode>utilities_config.show_search</InlineCode>).
        </p>
        <CodeBlock
          language="jsx"
          title="hide.jsx"
          code={`<TableSearchField showSearch={userRole === 'admin'} />`}
        />
      </Section>
    </DocPage>
  );
};

export default TableSearchDocs;
