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
              name: 'staticData',
              type: 'object',
              description: 'Static workflow data object with a tag_details array. Bypasses the API call entirely for display-only or server-rendered scenarios.',
            },
            {
              name: 'objectUuid',
              type: 'string',
              description: 'Explicit object UUID. Used with apiUrl to identify the target record without parsing the URL.',
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
              type: '(tag: TagDetail, newState: string) => Promise<void> \| void',
              description: 'Hook invoked before a tag change starts. Receives the TagDetail object and the target state string.',
            },
            {
              name: 'afterTagChange',
              type: '(tag: TagDetail, success: boolean) => Promise<void> \| void',
              description: 'Hook invoked after a tag change completes. Receives the TagDetail object and a boolean indicating success.',
            },
            {
              name: 'onShowTagForm',
              type: '(tag: TagDetail, apiUrl: string) => void',
              description: 'Callback to delegate form-based tag transitions to the parent. Parent handles showing the form UI.',
            },
            {
              name: 'confirmationAlert',
              type: '(props: ConfirmationAlertProps) => ReactNode',
              description: 'Custom confirmation UI function. Replaces the default dialog confirmation before toggling a tag. Receives onConfirm, onCancel, title, and message.',
            },
            {
              name: 'renderTags',
              type: '(params: { tags: TagDetail[], onTagToggle: (tag) => void, tagTransitionForm?: ReactNode, onFormCancel: () => void }) => ReactNode',
              description: 'Custom render function for the tags UI. Receives tags array, onTagToggle handler, optional tagTransitionForm node, and onFormCancel function.',
            },
            {
              name: 'onFormCancel',
              type: 'React.MutableRefObject<(() => void) \| null>',
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
          console.log(\`About to \${newState} tag: \${tag.name}\`);
          setShowModal(true);
        }}
        afterTagChange={async (tag, success) => {
          if (!success) {
            console.error("Tag change failed for:", tag.name);
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
  renderTags={({ tags, onTagToggle }) => (
    <div className="grid grid-cols-2 gap-4">
      {tags.map((tag) => (
        <div
          key={tag.name}
          className="flex items-center justify-between p-4 rounded-xl
                     border border-gray-200 bg-white shadow-sm"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">
              {tag.name.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {tag.state === "enabled" ? "Active" : "Inactive"}
            </p>
          </div>
          <button
            onClick={() => onTagToggle(tag)}
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
          The <InlineCode>onTagToggle</InlineCode> function passed to <InlineCode>renderTags</InlineCode>{' '}
          handles the full lifecycle automatically: confirmation, form display (if needed), API call,
          and callback execution. You only need to call it with the tag object.
        </Callout>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">With staticData</h3>
        <p className="mb-3">
          Pass pre-fetched workflow data via <InlineCode>staticData</InlineCode> to bypass the API
          call entirely. The component extracts <InlineCode>tag_details</InlineCode> from the object
          automatically. Useful when the parent already has the response from a detail view fetch.
        </p>
        <CodeBlock
          language="jsx"
          title="static-data.jsx"
          code={`import { WorkflowTags } from "@zango-core/crud/workflow";

function StaticTags({ workflowData }) {
  // workflowData is the response object containing tag_details
  // { tag_details: [{ name, state, enable, disable, is_enable_allowed, is_disable_allowed }] }
  return (
    <WorkflowTags
      staticData={workflowData}
      onTagChange={() => console.log("Tag changed")}
    />
  );
}`}
      </Section>
    </DocPage>
  );
};

export default WorkflowTagsDocs;
