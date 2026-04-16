# Zango Workflow Reference

> Auto-generated from documentation pages. Regenerate with: `node scripts/generate-reference.js`

## Import
```js
import { WorkflowStatus, WorkflowTags, DetailViewProvider, useWorkflow, useDetailView, useDetailViewContext } from '@zango-core/crud/table';
```

## Workflow Data Format
- Status: `{ status_label, status_color }`
- Transitions: `{ name, display_name, from, to, is_form_based, confirmation_message, description }`
- Tags: `{ name, state: "enabled"|"disabled", enable: { is_form_based, confirmation_message }, disable: { is_form_based, confirmation_message }, is_enable_allowed, is_disable_allowed }`
- Use `next_transitions` (NOT `transitions`), `tag_details` (NOT `tags`)
- `to_state_meta` only appears on audit-log / workflow-transaction entries, not on `next_transitions[]`.

---


## WorkflowStatus (Workflow)

**Sections:** Overview | Props | Callback Lifecycle | Usage Patterns | Programmatic Form Control | Cancelling Transitions with beforeTransition | WorkflowFormRenderer | WorkflowTransitionsCell

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | string | - | API endpoint for fetching workflow data. Uses DetailView context if not provided. |
| `workflowDetails` | WorkflowDetails | - | Direct workflow data object. When provided, skips the API fetch and uses this data directly. |
| `staticData` | object | - | Static workflow data that bypasses API calls. Accepts raw workflow details, a response wrapper with workflow_details, or an object with next_transitions/current_status. |
| `objectUuid` | string | - | Explicit object UUID. When provided alongside apiUrl, overrides UUID extraction from the URL query params. |
| `formContainerId` | string | - | DOM element ID where the transition form should render. Enables portal rendering into custom containers like dialogs or modals. |
| `onStatusChange` | () => void | - | Callback invoked after a successful status transition completes. Use for refreshing data or updating UI. |
| `onShowStatusForm` | (transition, apiUrl) => void | - | Callback to show the status form at the parent level. Fires instead of the internal drawer for form-based transitions. |
| `beforeTransition` | (transition: Transition) => Promise<void> \| void | - | Async callback invoked before a transition starts. Throw an error to cancel the transition. |
| `afterTransition` | (transition: Transition, success: boolean) => Promise<void> \| void | - | Async callback invoked after a transition completes. Receives the transition object and a boolean indicating success. Fires on both success and failure. |
| `confirmationAlert` | (props: ConfirmationAlertProps) => ReactNode | - | Custom confirmation UI function. Replaces the default dialog for non-form transitions. Receives onConfirm, onCancel, title, and message. |
| `renderTransitions` | (params) => ReactNode | - | Custom render function for the transitions UI. Receives an object with transitions, onTransitionClick, currentStatus, statusLabel, statusTransitionForm, and onFormCancel. |
| `onFormCancel` | React.MutableRefObject<(() => void) \| null> | - | Ref that receives a function to programmatically close/cancel the active form. The ref value is a function when a form is shown, null otherwise. |
| `transition` | Transition | - | Workflow transition to process. Required when transitionType is status. |
| `tag` | TagDetail | - | Tag detail for tag transitions. Required when transitionType is tag. |
| `apiUrl` | string | - | API URL for the workflow endpoint. |
| `transitionType` | status \| tag | - | Type of transition being rendered. |
| `actionType` | enabled \| disabled | - | Action type for tag transitions. Required when transitionType is tag. |
| `containerId` | string | - | DOM element ID where the form should render via portal. When omitted, renders with drawer-style animations. |
| `onSuccess` | () => void | - | Called when form is successfully submitted. |
| `onError` | (error: Error) => void | - | Called when form submission fails. |
| `onCancel` | () => void | - | Called when user cancels the form. |
| `transitions` | Transition[] | - | Array of available transitions for the row. |
| `row` | object | - | Table row data. Accepts either a raw row object or an object with an original property containing the row data. |
| `renderWorkflowTransitions` | (params) => ReactNode | - | Custom render function. Receives transitions, visibleTransitions, dropdownTransitions, row, onTransitionClick, menuOpen, and setMenuOpen. |

### Code Examples

```jsx
// Inside a DetailView — no props needed
<WorkflowStatus />
```

```jsx
<WorkflowStatus
  apiUrl="/api/users/?object_uuid=123"
  onStatusChange={() => console.log("Changed!")}
/>
```

```jsx
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/workflow";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
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
}
```

```jsx
<WorkflowStatus
  apiUrl="/api/orders/?object_uuid=123"
  renderTransitions={({ transitions, onTransitionClick, currentStatus, statusLabel }) => (
    <div className="flex items-center gap-3">
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
        {statusLabel}
      </span>
      {transitions.map((t) => (
        <button
          key={t.name}
          onClick={() => onTransitionClick(t)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm
                     hover:bg-indigo-700 transition-colors"
        >
          {t.display_name}
        </button>
      ))}
    </div>
  )}
/>
```

```jsx
import { useRef } from "react";
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
}
```

```jsx
<WorkflowStatus
  apiUrl="/api/orders/?object_uuid=123"
  beforeTransition={async (transition) => {
    if (transition.name === 'archive' && !window.confirm('Really archive?')) {
      throw new Error('Transition cancelled by user');
    }
    // Throwing an error prevents the transition
  }}
/>
```

---

## WorkflowTags (Workflow)

**Sections:** Props | Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | string | - | API endpoint for fetching tag data. Uses DetailView context if not provided. |
| `tagDetails` | TagDetail[] | - | Direct tag data array. When provided, skips the API fetch and uses this data directly. |
| `staticData` | object | - | Static workflow data object with a tag_details array. Bypasses the API call entirely for display-only or server-rendered scenarios. |
| `objectUuid` | string | - | Explicit object UUID. Used with apiUrl to identify the target record without parsing the URL. |
| `formContainerId` | string | - | DOM element ID where the tag transition form should render. Enables portal rendering into dialogs or modals. |
| `onTagChange` | () => void | - | Callback invoked after a successful tag change. Use for refreshing data or closing modals. |
| `beforeTagChange` | (tag: TagDetail, newState: string) => Promise<void> \| void | - | Hook invoked before a tag change starts. Receives the TagDetail object and the target state string. |
| `afterTagChange` | (tag: TagDetail, success: boolean) => Promise<void> \| void | - | Hook invoked after a tag change completes. Receives the TagDetail object and a boolean indicating success. |
| `onShowTagForm` | (tag: TagDetail, apiUrl: string) => void | - | Callback to delegate form-based tag transitions to the parent. Parent handles showing the form UI. |
| `confirmationAlert` | (props: ConfirmationAlertProps) => ReactNode | - | Custom confirmation UI function. Replaces the default dialog confirmation before toggling a tag. Receives onConfirm, onCancel, title, and message. |
| `renderTags` | (params: { tags: TagDetail[], onTagToggle: (tag) => void, tagTransitionForm?: ReactNode, onFormCancel: () => void }) => ReactNode | - | Custom render function for the tags UI. Receives tags array, onTagToggle handler, optional tagTransitionForm node, and onFormCancel function. |
| `onFormCancel` | React.MutableRefObject<(() => void) \| null> | - | Ref that receives a function to programmatically close/cancel the active tag form. The ref value is a function when a form is shown, null otherwise. |

### Code Examples

```jsx
<WorkflowTags apiUrl="/api/users/?object_uuid=123" />
```

```jsx
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowTags } from "@zango-core/crud/workflow";

function UserTags({ objectUuid }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <WorkflowTags
        apiUrl={`/api/users/?object_uuid=${objectUuid}`}
        formContainerId="tag-form-container"
        beforeTagChange={async (tag, newState) => {
          console.log(`About to ${newState} tag: ${tag.name}`);
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
}
```

```jsx
<WorkflowTags
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
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors
              ${tag.state === "enabled" ? "bg-indigo-600" : "bg-gray-200"}`}
            role="switch"
            aria-checked={tag.state === "enabled"}
            disabled={tag.state === "enabled" ? !tag.is_disable_allowed : !tag.is_enable_allowed}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transform
                transition-transform mt-0.5
                ${tag.state === "enabled" ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
      ))}
    </div>
  )}
/>
```

```jsx
import { WorkflowTags } from "@zango-core/crud/workflow";

function StaticTags({ workflowData }) {
  // workflowData is the response object containing tag_details
  // { tag_details: [{ name, state, enable, disable, is_enable_allowed, is_disable_allowed }] }
  return (
    <WorkflowTags
      staticData={workflowData}
      onTagChange={() => console.log("Tag changed")}
    />
  );
}
```

---

## Advanced Features (Advanced)

**Sections:** Programmatic Form Control (onFormCancel) | Glitch-Free Portal Rendering | Error Handling & Timeouts | Migration Guide

### Code Examples

```jsx
import { useRef } from "react";
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
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        onFormCancel={statusFormRef}
      />

      <WorkflowTags
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        onFormCancel={tagFormRef}
      />
    </div>
  );
}
```

```jsx
import { useState, useEffect, useRef } from "react";
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
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
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
}
```

```jsx
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderWorkflow({ objectUuid }) {
  return (
    <WorkflowStatus
      apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
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
// +------------------------------------------+
```

```jsx
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
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
}
```

```jsx
import { useState, useEffect, useRef } from "react";
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
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
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
}
```

---
