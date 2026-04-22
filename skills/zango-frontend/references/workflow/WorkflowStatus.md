# WorkflowStatus
Workflow

Manages workflow status transitions with full lifecycle control and custom rendering options.

**Sections:** Overview | Props | Callback Lifecycle | Usage Patterns | Programmatic Form Control | Cancelling Transitions with beforeTransition | WorkflowFormRenderer | WorkflowTransitionsCell

## Props

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

## Code Examples

### auto-context.jsx
```jsx
// Inside a DetailView — no props needed
<WorkflowStatus
```

### standalone.jsx
```jsx
<WorkflowStatus
  apiUrl="/api/users/?object_uuid=123"
  onStatusChange={() => console.log("Changed!")}
```

### custom-form-container.jsx
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
```

### custom-rendering.jsx
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
```

### programmatic-cancel.jsx
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
```

### cancel-transition.jsx
```jsx
<WorkflowStatus
  apiUrl="/api/orders/?object_uuid=123"
  beforeTransition={async (transition) => {
    if (transition.name === 'archive' && !window.confirm('Really archive?')) {
      throw new Error('Transition cancelled by user');
    }
    // Throwing an error prevents the transition
  }}
```

