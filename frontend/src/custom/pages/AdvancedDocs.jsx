import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const AdvancedDocs = () => {
  return (
    <DocPage
      title="Advanced Features"
      category="workflow"
      subtitle="Programmatic form control, portal rendering, error handling, and migration guides."
      badge="Advanced"
    >
      <Section title="Programmatic Form Control (onFormCancel)">
        <p className="mb-4">
          The <InlineCode>onFormCancel</InlineCode> ref provides programmatic control over active
          forms in both <InlineCode>WorkflowStatus</InlineCode> and{' '}
          <InlineCode>WorkflowTags</InlineCode>. When a form is visible, the ref holds a function
          that closes it. When no form is active, the ref is <InlineCode>null</InlineCode>.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Key Features</h3>
        <ul style={{ paddingLeft: '20px', listStyleType: 'disc', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}>
            Uses the standard React <InlineCode>useRef</InlineCode> pattern
          </li>
          <li style={{ marginBottom: '8px' }}>
            Works with both <InlineCode>WorkflowStatus</InlineCode> and{' '}
            <InlineCode>WorkflowTags</InlineCode>
          </li>
          <li style={{ marginBottom: '8px' }}>
            Ref value is a function when a form is shown, <InlineCode>null</InlineCode> when hidden
          </li>
        </ul>

        <CodeBlock
          language="jsx"
          title="programmatic-form-control.jsx"
          code={`import { useRef } from "react";
import { WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const statusFormRef = useRef(null);
  const tagFormRef = useRef(null);

  const closeAllForms = () => {
    statusFormRef.current?.();
    tagFormRef.current?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Order Detail</h2>
        <button
          onClick={closeAllForms}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300
                     rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close All Forms
        </button>
      </div>

      <WorkflowStatus
        apiUrl={\`/api/orders/?object_uuid=\${objectUuid}\`}
        onFormCancel={statusFormRef}
      />

      <WorkflowTags
        apiUrl={\`/api/orders/?object_uuid=\${objectUuid}\`}
        onFormCancel={tagFormRef}
      />
    </div>
  );
}`}
        />
        <Callout type="tip" title="Safe Invocation">
          Always use optional chaining when calling the ref:{' '}
          <InlineCode>ref.current?.()</InlineCode>. This ensures no error is thrown when no form is
          currently active.
        </Callout>
      </Section>

      <Section title="Glitch-Free Portal Rendering">
        <p className="mb-4">
          When rendering workflow forms inside a dialog or modal via{' '}
          <InlineCode>formContainerId</InlineCode>, the target DOM element may not exist at the
          moment the form tries to render. This causes a brief visual glitch or the form falling back
          to the default drawer.
        </p>
        <p className="mb-4">
          The enhanced container pattern uses a <InlineCode>dialogReady</InlineCode> state with a
          small delay to ensure the dialog DOM is fully mounted before the form attempts to portal
          into it.
        </p>

        <CodeBlock
          language="jsx"
          title="glitch-free-portal.jsx"
          code={`import { useState, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderWorkflow({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogReady, setDialogReady] = useState(false);
  const cancelRef = useRef(null);

  // When dialog opens, wait for DOM to be ready before enabling portal
  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => {
        setDialogReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDialogReady(false);
    }
  }, [showDialog]);

  return (
    <div>
      <WorkflowStatus
        apiUrl={\`/api/orders/?object_uuid=\${objectUuid}\`}
        formContainerId={dialogReady ? "workflow-form-portal" : undefined}
        onFormCancel={cancelRef}
        beforeTransition={async (transition) => {
          setShowDialog(true);
          // Wait for dialog DOM to mount
          await new Promise((resolve) => setTimeout(resolve, 100));
        }}
        afterTransition={async (transition, success) => {
          if (success) {
            setShowDialog(false);
          }
        }}
      />

      <Dialog
        open={showDialog}
        onOpenChange={(open) => {
          if (!open) {
            cancelRef.current?.();
            setShowDialog(false);
          }
        }}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transition Form</h3>
          <div id="workflow-form-portal" />
        </div>
      </Dialog>
    </div>
  );
}`}
        />

        <Callout type="info" title="How It Works">
          <ol style={{ paddingLeft: '16px', listStyleType: 'decimal', margin: 0 }}>
            <li style={{ marginBottom: '4px' }}>
              <InlineCode>beforeTransition</InlineCode> opens the dialog and waits 100ms
            </li>
            <li style={{ marginBottom: '4px' }}>
              The <InlineCode>useEffect</InlineCode> detects the dialog is open and sets{' '}
              <InlineCode>dialogReady</InlineCode> after 100ms
            </li>
            <li style={{ marginBottom: '4px' }}>
              <InlineCode>formContainerId</InlineCode> is only passed when{' '}
              <InlineCode>dialogReady</InlineCode> is true, ensuring the DOM target exists
            </li>
            <li>
              On close, the <InlineCode>onFormCancel</InlineCode> ref cleans up the form before the
              dialog unmounts
            </li>
          </ol>
        </Callout>
      </Section>

      <Section title="Error Handling & Timeouts">
        <p className="mb-4">
          The workflow components include built-in error handling and timeout mechanisms to provide a
          resilient user experience.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Built-in Features</h3>
        <ul style={{ paddingLeft: '20px', listStyleType: 'disc', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>3-second timeout</strong> — Portal rendering times out after 3 seconds if the
            target container is not found, preventing indefinite loading states.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Clear error messages</strong> — Descriptive error text is displayed when a
            transition or tag operation fails.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Automatic fallback to drawer</strong> — If{' '}
            <InlineCode>formContainerId</InlineCode> targets a non-existent element, the form
            gracefully falls back to the default drawer renderer.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Debug logging</strong> — Detailed console logs for diagnosing portal rendering
            and transition issues during development.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Retry mechanism</strong> — The portal renderer checks for the target container
            every 100ms before falling back, handling race conditions with dialog animations.
          </li>
        </ul>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Error UI Example</h3>
        <CodeBlock
          language="jsx"
          title="error-handling.jsx"
          code={`import { WorkflowStatus } from "@zango-core/crud/table";

function OrderWorkflow({ objectUuid }) {
  return (
    <WorkflowStatus
      apiUrl={\`/api/orders/?object_uuid=\${objectUuid}\`}
      afterTransition={async (transition, success) => {
        if (!success) {
          // The component already displays an error message.
          // Use this callback for additional error handling:
          console.error("Transition failed:", transition.label);

          // Send to error tracking
          // errorTracker.capture("workflow_transition_failed", { transition });
        }
      }}
      onStatusChange={() => {
        // Only called on success — safe to refresh data here
        window.location.reload();
      }}
    />
  );
}

// The component renders error states automatically:
//
// +------------------------------------------+
// |  ⚠ Transition failed                      |
// |  Could not complete "Approve Order".      |
// |  Please try again or contact support.     |
// |                                           |
// |  [Retry]  [Dismiss]                       |
// +------------------------------------------+`}
        />
      </Section>

      <Section title="Migration Guide">
        <p className="mb-4">
          If you are upgrading from the basic pattern to the enhanced portal pattern with glitch-free
          rendering and programmatic form control, follow this before/after guide.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Before: Basic Pattern</h3>
        <CodeBlock
          language="jsx"
          title="before-migration.jsx"
          code={`import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <WorkflowStatus
        apiUrl={\`/api/orders/?object_uuid=\${objectUuid}\`}
        formContainerId="workflow-form"
        beforeTransition={async () => {
          setShowDialog(true);
        }}
        afterTransition={async (transition, success) => {
          if (success) setShowDialog(false);
        }}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div id="workflow-form" />
      </Dialog>
    </div>
  );
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">After: Enhanced Pattern</h3>
        <CodeBlock
          language="jsx"
          title="after-migration.jsx"
          code={`import { useState, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogReady, setDialogReady] = useState(false);  // NEW: track DOM readiness
  const cancelRef = useRef(null);                          // NEW: programmatic cancel

  // NEW: delay portal activation until dialog DOM is mounted
  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => setDialogReady(true), 100);
      return () => clearTimeout(timer);
    }
    setDialogReady(false);
  }, [showDialog]);

  return (
    <div>
      <WorkflowStatus
        apiUrl={\`/api/orders/?object_uuid=\${objectUuid}\`}
        formContainerId={dialogReady ? "workflow-form" : undefined}  // CHANGED: conditional
        onFormCancel={cancelRef}                                      // NEW: cancel ref
        beforeTransition={async () => {
          setShowDialog(true);
          await new Promise((r) => setTimeout(r, 100));              // NEW: wait for DOM
        }}
        afterTransition={async (transition, success) => {
          if (success) setShowDialog(false);
        }}
      />

      <Dialog
        open={showDialog}
        onOpenChange={(open) => {                                    // CHANGED: cleanup on close
          if (!open) {
            cancelRef.current?.();
            setShowDialog(false);
          }
        }}
      >
        <div id="workflow-form" />
      </Dialog>
    </div>
  );
}`}
        />

        <Callout type="warning" title="Migration Checklist">
          <ul style={{ paddingLeft: '16px', listStyleType: 'disc', margin: 0 }}>
            <li style={{ marginBottom: '4px' }}>
              Add <InlineCode>dialogReady</InlineCode> state and the <InlineCode>useEffect</InlineCode>{' '}
              with 100ms delay
            </li>
            <li style={{ marginBottom: '4px' }}>
              Add <InlineCode>cancelRef</InlineCode> with <InlineCode>useRef(null)</InlineCode> and
              pass it as <InlineCode>onFormCancel</InlineCode>
            </li>
            <li style={{ marginBottom: '4px' }}>
              Make <InlineCode>formContainerId</InlineCode> conditional on{' '}
              <InlineCode>dialogReady</InlineCode>
            </li>
            <li style={{ marginBottom: '4px' }}>
              Add <InlineCode>await new Promise</InlineCode> delay in{' '}
              <InlineCode>beforeTransition</InlineCode>
            </li>
            <li>
              Update <InlineCode>onOpenChange</InlineCode> to call{' '}
              <InlineCode>cancelRef.current?.()</InlineCode> before closing
            </li>
          </ul>
        </Callout>
      </Section>
    </DocPage>
  );
};

export default AdvancedDocs;
