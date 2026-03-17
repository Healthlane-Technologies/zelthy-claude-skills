import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const WorkflowStatusDocs = () => {
  return (
    <DocPage
      title="WorkflowStatus"
      subtitle="Manages workflow status transitions with full lifecycle control and custom rendering options."
      badge="Workflow"
    >
      <Section title="Overview">
        <p className="mb-4">
          <InlineCode>WorkflowStatus</InlineCode> is a self-contained component that renders workflow
          status transitions for a given object. It works standalone without any wrapper or provider,
          auto-detects <InlineCode>DetailView</InlineCode> context when available, and does not
          require a <InlineCode>WorkflowProvider</InlineCode>.
        </p>
        <p className="mb-4">There are three primary usage patterns:</p>
        <ul style={{ paddingLeft: '20px', listStyleType: 'disc', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Auto context</strong> — Place inside a <InlineCode>DetailView</InlineCode> and it
            automatically picks up the API URL and workflow data from context.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Direct props</strong> — Pass an <InlineCode>apiUrl</InlineCode> prop to use it
            anywhere outside of a detail view.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Custom context</strong> — Wrap with <InlineCode>DetailViewProvider</InlineCode> to
            share state across multiple workflow components.
          </li>
        </ul>
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'apiUrl',
              type: 'string',
              description: 'API endpoint for fetching workflow data. Uses DetailView context if not provided.',
            },
            {
              name: 'workflowDetails',
              type: 'object',
              description: 'Direct workflow data object. When provided, skips the API fetch and uses this data directly.',
            },
            {
              name: 'formContainerId',
              type: 'string',
              description: 'DOM element ID where the transition form should render. Enables portal rendering into custom containers like dialogs or modals.',
            },
            {
              name: 'onStatusChange',
              type: '() => void',
              description: 'Callback invoked after a successful status transition completes. Use for refreshing data or updating UI.',
            },
            {
              name: 'beforeTransition',
              type: '(transition) => Promise<void>',
              description: 'Async callback invoked before a transition starts. Useful for opening dialogs, validating state, or showing custom UI.',
            },
            {
              name: 'afterTransition',
              type: '(transition, success) => Promise<void>',
              description: 'Async callback invoked after a transition completes. Receives the transition object and a boolean indicating success.',
            },
            {
              name: 'confirmationAlert',
              type: 'Function',
              description: 'Custom confirmation UI function. Replaces the default browser confirmation dialog before executing a transition.',
            },
            {
              name: 'renderTransitions',
              type: 'Function',
              description: 'Custom render function for the transitions UI. Receives the available transitions and allows complete control over their presentation.',
            },
            {
              name: 'onFormCancel',
              type: 'React.Ref',
              description: 'Ref that receives a function to programmatically close/cancel the active form. The ref value is a function when a form is shown, null otherwise.',
            },
          ]}
        />
      </Section>

      <Section title="Callback Lifecycle">
        <p className="mb-4">
          When a user initiates a status transition, the following sequence executes in order:
        </p>
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          margin: '16px 0',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: '13px',
          lineHeight: '2',
          color: '#334155',
        }}>
          <div>1. User clicks transition button</div>
          <div style={{ color: '#6366f1' }}>2. <strong>beforeTransition(transition)</strong> — prepare UI, open dialogs</div>
          <div>3. Form renders (if transition has a form) or Confirmation shows</div>
          <div>4. User submits form / confirms</div>
          <div>5. API call executes the transition</div>
          <div style={{ color: '#6366f1' }}>6. <strong>afterTransition(transition, success)</strong> — cleanup, close dialogs</div>
          <div style={{ color: '#6366f1' }}>7. <strong>onStatusChange()</strong> — refresh data, update parent state</div>
        </div>
        <Callout type="info" title="Order Matters">
          <InlineCode>afterTransition</InlineCode> always fires regardless of success or failure.
          Check the <InlineCode>success</InlineCode> parameter to conditionally handle each case.
          <InlineCode>onStatusChange</InlineCode> only fires on successful transitions.
        </Callout>
      </Section>

      <Section title="Usage Patterns">
        <h3 className="text-base font-semibold text-gray-800 mb-3">Basic (Auto-Context)</h3>
        <p className="mb-3">
          When placed inside a <InlineCode>DetailView</InlineCode>, no props are needed. The component
          reads the API URL and workflow data from context automatically.
        </p>
        <CodeBlock
          language="jsx"
          title="auto-context.jsx"
          code={`// Inside a DetailView — no props needed
<WorkflowStatus />`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Standalone with Direct API</h3>
        <p className="mb-3">
          Use anywhere outside a detail view by passing the API endpoint directly.
        </p>
        <CodeBlock
          language="jsx"
          title="standalone.jsx"
          code={`<WorkflowStatus
  apiUrl="/api/users/?object_uuid=123"
  onStatusChange={() => console.log("Changed!")}
/>`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Form Container (Dialog / Modal Pattern)</h3>
        <p className="mb-3">
          Render the transition form inside a custom dialog or modal by using{' '}
          <InlineCode>formContainerId</InlineCode> combined with lifecycle callbacks.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-form-container.jsx"
          code={`import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/workflow";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <WorkflowStatus
        apiUrl={\`/api/orders/?object_uuid=\${objectUuid}\`}
        formContainerId="workflow-form-container"
        beforeTransition={async (transition) => {
          // Open the dialog before the form renders
          setShowDialog(true);
        }}
        afterTransition={async (transition, success) => {
          // Close the dialog after a successful transition
          if (success) {
            setShowDialog(false);
          }
        }}
        onStatusChange={() => {
          console.log("Status updated, refreshing...");
        }}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div id="workflow-form-container" />
      </Dialog>
    </div>
  );
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Custom Rendering with renderTransitions</h3>
        <p className="mb-3">
          Take full control of how transitions are displayed using the{' '}
          <InlineCode>renderTransitions</InlineCode> prop.
        </p>
        <CodeBlock
          language="jsx"
          title="custom-rendering.jsx"
          code={`<WorkflowStatus
  apiUrl="/api/orders/?object_uuid=123"
  renderTransitions={({ currentStatus, currentStatusMeta, transitions, onTransition }) => (
    <div className="flex items-center gap-3">
      <span
        className="px-3 py-1 rounded-full text-sm font-medium"
        style={{
          backgroundColor: currentStatusMeta?.status_color || '#e0e7ff',
          color: '#1e40af',
        }}
      >
        {currentStatusMeta?.status_label || currentStatus}
      </span>
      {transitions.map((t) => (
        <button
          key={t.name}
          onClick={() => onTransition(t)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm
                     hover:bg-indigo-700 transition-colors"
        >
          {t.display_name}
        </button>
      ))}
    </div>
  )}
/>`}
        />
      </Section>

      <Section title="Programmatic Form Control">
        <p className="mb-4">
          Use the <InlineCode>onFormCancel</InlineCode> ref to programmatically close an active
          transition form. This is useful when you need external buttons or keyboard shortcuts to
          dismiss the form.
        </p>
        <CodeBlock
          language="jsx"
          title="programmatic-cancel.jsx"
          code={`import { useRef } from "react";
import { WorkflowStatus } from "@zango-core/crud/workflow";

function OrderWorkflow() {
  const cancelRef = useRef(null);

  return (
    <div>
      <WorkflowStatus
        apiUrl="/api/orders/?object_uuid=123"
        onFormCancel={cancelRef}
      />

      <button
        onClick={() => cancelRef.current?.()}
        className="mt-4 px-4 py-2 text-sm text-gray-600 border rounded-lg
                   hover:bg-gray-50 transition-colors"
      >
        Close Form
      </button>
    </div>
  );
}`}
        />
        <Callout type="tip" title="Ref Behavior">
          The ref value is a function when a form is currently displayed, and{' '}
          <InlineCode>null</InlineCode> when no form is active. Use optional chaining
          (<InlineCode>cancelRef.current?.()</InlineCode>) to safely call it.
        </Callout>
        <Callout type="info" title="Programmatic Workflow Control">
          For programmatic workflow management (executing transitions, toggling tags, refreshing),
          see the <a href="/app/workflow-hooks" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'underline' }}>Hooks Reference</a> —
          specifically <InlineCode>useWorkflow()</InlineCode> and <InlineCode>useDetailView()</InlineCode>.
        </Callout>
      </Section>
    </DocPage>
  );
};

export default WorkflowStatusDocs;
