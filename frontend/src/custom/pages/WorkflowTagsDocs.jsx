import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const WorkflowTagsDocs = () => {
  return (
    <DocPage
      title="WorkflowTags"
      subtitle="Manages workflow tags with toggle functionality and form-based transitions."
      badge="Workflow"
    >
      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'apiUrl',
              type: 'string',
              description: 'API endpoint for fetching tag data. Uses DetailView context if not provided.',
            },
            {
              name: 'tagDetails',
              type: 'TagDetail[]',
              description: 'Direct tag data array. When provided, skips the API fetch and uses this data directly.',
            },
            {
              name: 'formContainerId',
              type: 'string',
              description: 'DOM element ID where the tag transition form should render. Enables portal rendering into dialogs or modals.',
            },
            {
              name: 'onTagChange',
              type: '() => void',
              description: 'Callback invoked after a successful tag change. Use for refreshing data or closing modals.',
            },
            {
              name: 'beforeTagChange',
              type: '(tag, newState) => Promise<void>',
              description: 'Async callback invoked before a tag change starts. Receives the tag object and the target state (enabled/disabled).',
            },
            {
              name: 'afterTagChange',
              type: '(tag, success) => Promise<void>',
              description: 'Async callback invoked after a tag change completes. Receives the tag object and a boolean indicating success.',
            },
            {
              name: 'confirmationAlert',
              type: 'Function',
              description: 'Custom confirmation UI function. Replaces the default browser confirmation before toggling a tag.',
            },
            {
              name: 'renderTags',
              type: 'Function',
              description: 'Custom render function for the tags UI. Receives the tags array and toggle handler for complete control over presentation.',
            },
            {
              name: 'onFormCancel',
              type: 'React.Ref',
              description: 'Ref that receives a function to programmatically close/cancel the active tag form. The ref value is a function when a form is shown, null otherwise.',
            },
          ]}
        />
      </Section>

      <Section title="Usage Examples">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Basic Usage</h3>
        <p className="mb-3">
          At its simplest, pass an <InlineCode>apiUrl</InlineCode> and the component handles
          fetching, rendering, and toggling tags automatically.
        </p>
        <CodeBlock
          language="jsx"
          title="basic.jsx"
          code={`<WorkflowTags apiUrl="/api/users/?object_uuid=123" />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">With Custom Container</h3>
        <p className="mb-3">
          Render the tag form inside a modal by combining <InlineCode>formContainerId</InlineCode>{' '}
          with lifecycle callbacks. Use <InlineCode>beforeTagChange</InlineCode> to prepare the UI
          and <InlineCode>onTagChange</InlineCode> to clean up after success.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-container.jsx"
          code={`import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowTags } from "@zango-core/crud/workflow";

function UserTags({ objectUuid }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <WorkflowTags
        apiUrl={\`/api/users/?object_uuid=\${objectUuid}\`}
        formContainerId="tag-form-container"
        beforeTagChange={async (tag, newState) => {
          console.log(\`About to \${newState} tag: \${tag.tag_label}\`);
          setShowModal(true);
        }}
        afterTagChange={async (tag, success) => {
          if (!success) {
            console.error("Tag change failed for:", tag.tag_label);
          }
        }}
        onTagChange={() => {
          setShowModal(false);
        }}
      />

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <div id="tag-form-container" />
      </Dialog>
    </div>
  );
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Rendering with renderTags</h3>
        <p className="mb-3">
          Use <InlineCode>renderTags</InlineCode> to fully customize how tags are displayed. This
          example renders tags as a card grid with switch toggles.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-rendering.jsx"
          code={`<WorkflowTags
  apiUrl="/api/users/?object_uuid=123"
  renderTags={({ tags, onToggle }) => (
    <div className="grid grid-cols-2 gap-4">
      {tags.map((tag) => (
        <div
          key={tag.name}
          className="flex items-center justify-between p-4 rounded-xl
                     border border-gray-200 bg-white shadow-sm"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{tag.tag_label}</p>
            <p className="text-xs text-gray-500 mt-1">
              {tag.state === "enabled" ? "Active" : "Inactive"}
            </p>
          </div>
          <button
            onClick={() => onToggle(tag)}
            className={\`relative inline-flex h-6 w-11 rounded-full transition-colors
              \${tag.state === "enabled" ? "bg-indigo-600" : "bg-gray-200"}\`}
            role="switch"
            aria-checked={tag.state === "enabled"}
            disabled={tag.state === "enabled" ? !tag.is_disable_allowed : !tag.is_enable_allowed}
          >
            <span
              className={\`inline-block h-5 w-5 rounded-full bg-white shadow transform
                transition-transform mt-0.5
                \${tag.state === "enabled" ? "translate-x-5 ml-0.5" : "translate-x-0.5"}\`}
            />
          </button>
        </div>
      ))}
    </div>
  )}
/>`}
        />
        <Callout type="tip" title="Toggle Handler">
          The <InlineCode>onToggle</InlineCode> function passed to <InlineCode>renderTags</InlineCode>{' '}
          handles the full lifecycle automatically: confirmation, form display (if needed), API call,
          and callback execution. You only need to call it with the tag object.
        </Callout>
      </Section>
    </DocPage>
  );
};

export default WorkflowTagsDocs;
