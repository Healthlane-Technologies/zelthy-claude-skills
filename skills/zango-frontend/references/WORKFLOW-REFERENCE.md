# Workflow Reference

Complete reference for WorkflowStatus, WorkflowTags, and workflow-related hooks.

---

## WorkflowStatus

Manages workflow status transitions with full lifecycle control and custom rendering options.

### Import

```jsx
import { WorkflowStatus } from "@zango-core/crud/table";
// or
import { WorkflowStatus } from "@zango-core/crud/workflow";
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| apiUrl | `string` | — | API endpoint for fetching workflow data. Uses DetailView context if not provided. |
| workflowDetails | `object` | — | Direct workflow data object. When provided, skips the API fetch. |
| formContainerId | `string` | — | DOM element ID where the transition form should render (portal). |
| onStatusChange | `() => void` | — | Callback after a successful status transition. |
| beforeTransition | `(transition) => Promise<void>` | — | Async callback before a transition starts. Useful for opening dialogs or validating. |
| afterTransition | `(transition, success) => Promise<void>` | — | Async callback after a transition completes. |
| confirmationAlert | `Function` | — | Custom confirmation UI function. Replaces default browser confirm. |
| renderTransitions | `Function` | — | Custom render function for the transitions UI. |
| onFormCancel | `React.Ref` | — | Ref that receives a function to programmatically close the active form. |

### Usage Patterns

**1. Auto (inside DetailView context) -- no props needed:**

```jsx
<WorkflowStatus />
```

**2. Standalone with API URL:**

```jsx
<WorkflowStatus
  apiUrl="/api/users/?object_uuid=123"
  onStatusChange={() => console.log("Changed!")}
/>
```

**3. With DetailViewProvider context:**

```jsx
import { DetailViewProvider, WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

<DetailViewProvider apiUrl="/api/users/?object_uuid=123">
  <WorkflowStatus />
  <WorkflowTags />
</DetailViewProvider>
```

### Dialog Pattern (Form in Modal)

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
          setShowDialog(true);
        }}
        afterTransition={async (transition, success) => {
          if (success) setShowDialog(false);
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

### Custom Rendering

```jsx
<WorkflowStatus
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
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
        >
          {t.display_name}
        </button>
      ))}
    </div>
  )}
/>
```

### Programmatic Form Control (onFormCancel)

```jsx
import { useRef } from "react";

function OrderWorkflow() {
  const cancelRef = useRef(null);

  return (
    <div>
      <WorkflowStatus
        apiUrl="/api/orders/?object_uuid=123"
        onFormCancel={cancelRef}
      />
      <button onClick={() => cancelRef.current?.()}>
        Close Form
      </button>
    </div>
  );
}
```

### Glitch-Free Portal Rendering

When rendering forms inside dialogs, delay portal activation until the DOM is ready:

```jsx
import { useState, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderWorkflow({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogReady, setDialogReady] = useState(false);
  const cancelRef = useRef(null);

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
        formContainerId={dialogReady ? "workflow-form-portal" : undefined}
        onFormCancel={cancelRef}
        beforeTransition={async () => {
          setShowDialog(true);
          await new Promise((r) => setTimeout(r, 100));
        }}
        afterTransition={async (transition, success) => {
          if (success) setShowDialog(false);
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
        <div id="workflow-form-portal" />
      </Dialog>
    </div>
  );
}
```

---

## WorkflowTags

Manages workflow tags with toggle functionality and form-based transitions.

### Import

```jsx
import { WorkflowTags } from "@zango-core/crud/table";
// or
import { WorkflowTags } from "@zango-core/crud/workflow";
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| apiUrl | `string` | — | API endpoint for fetching tag data. Uses DetailView context if not provided. |
| tagDetails | `TagDetail[]` | — | Direct tag data array. Skips API fetch when provided. |
| formContainerId | `string` | — | DOM element ID where the tag form renders (portal). |
| onTagChange | `() => void` | — | Callback after a successful tag change. |
| beforeTagChange | `(tag, newState) => Promise<void>` | — | Async callback before a tag change. |
| afterTagChange | `(tag, success) => Promise<void>` | — | Async callback after a tag change. |
| confirmationAlert | `Function` | — | Custom confirmation UI. |
| renderTags | `Function` | — | Custom render function for tags UI. |
| onFormCancel | `React.Ref` | — | Ref for programmatic form cancel. |

### Basic Usage

```jsx
<WorkflowTags apiUrl="/api/users/?object_uuid=123" />
```

### With Dialog for Forms

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
          setShowModal(true);
        }}
        afterTagChange={async (tag, success) => {
          if (!success) console.error("Tag change failed:", tag.tag_label);
        }}
        onTagChange={() => setShowModal(false)}
      />

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <div id="tag-form-container" />
      </Dialog>
    </div>
  );
}
```

### Custom Tag Rendering

```jsx
<WorkflowTags
  apiUrl="/api/users/?object_uuid=123"
  renderTags={({ tags, onToggle }) => (
    <div className="grid grid-cols-2 gap-4">
      {tags.map((tag) => (
        <div key={tag.name} className="flex items-center justify-between p-4 rounded-xl border">
          <div>
            <p className="text-sm font-medium">{tag.tag_label}</p>
            <p className="text-xs text-gray-500">
              {tag.state === "enabled" ? "Active" : "Inactive"}
            </p>
          </div>
          <button
            onClick={() => onToggle(tag)}
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors
              ${tag.state === "enabled" ? "bg-indigo-600" : "bg-gray-200"}`}
            disabled={tag.state === "enabled" ? !tag.is_disable_allowed : !tag.is_enable_allowed}
          >
            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5
              ${tag.state === "enabled" ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`}
            />
          </button>
        </div>
      ))}
    </div>
  )}
/>
```

---

## Workflow API Response Format

### Detail View workflow_details

```json
{
  "workflow_details": {
    "current_status": "active",
    "current_status_meta": {
      "status_label": "Active",
      "status_color": "#12B76A"
    },
    "next_transitions": [
      {
        "name": "approve",
        "display_name": "Approve",
        "from": "active",
        "to": "approved",
        "is_form_based": false,
        "to_state_meta": {
          "status_label": "Approved",
          "status_color": "#12B76A"
        }
      }
    ],
    "tag_details": [
      {
        "name": "urgent",
        "state": "enabled",
        "tag_label": "Urgent",
        "enable": { "is_form_based": false },
        "disable": { "is_form_based": false }
      }
    ]
  }
}
```

### StatusCol Data Format (in table rows)

```json
{
  "workflow_status": {
    "status_label": "Active",
    "status_color": "#12B76A"
  }
}
```

---

## Workflow Hooks

### useWorkflow({ apiUrl, beforeTransition?, afterTransition? })

Low-level hook for programmatic workflow control.

```jsx
import { useWorkflow } from "@zango-core/crud/table";

function ApproveButton({ objectUuid }) {
  const { workflowDetails, executeTransition, loading } = useWorkflow({
    apiUrl: `/api/orders/?object_uuid=${objectUuid}`,
  });

  if (loading || !workflowDetails) return null;
  const approveTransition = workflowDetails.next_transitions.find((t) => t.name === "approve");
  if (!approveTransition) return null;

  return <button onClick={() => executeTransition(approveTransition)}>Approve</button>;
}
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| workflowDetails | `object` | Full workflow data: current_status, current_status_meta, next_transitions, tag_details. |
| loading | `boolean` | True while workflow data is being fetched. |
| error | `string \| null` | Error message if fetch or operation failed. |
| refreshWorkflow | `() => Promise<void>` | Re-fetch workflow data. |
| executeTransition | `(transition, formData?) => Promise<boolean>` | Execute a status transition. Returns success boolean. |
| toggleTag | `(tag) => Promise<boolean>` | Toggle a tag on or off. Returns success boolean. |

### useDetailView({ apiUrl })

Fetches detail data for a specific record.

```jsx
import { useDetailView } from "@zango-core/crud/table";

const { data, loading, error, refresh, objectUuid, workflowDetails, rowActions } = useDetailView({
  apiUrl: "/api/users/?object_uuid=abc-123",
});
```

### useDetailViewContext()

Reads from the nearest DetailViewProvider context. Same return shape as useDetailView.

```jsx
import { useDetailViewContext } from "@zango-core/crud/table";

function StatusBadge() {
  const { workflowDetails, loading } = useDetailViewContext();
  if (loading || !workflowDetails) return null;
  return <span className="badge">{workflowDetails.current_status_meta?.status_label}</span>;
}
```

---

## Combining WorkflowStatus and WorkflowTags

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
        <button onClick={closeAllForms}>Close All Forms</button>
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
