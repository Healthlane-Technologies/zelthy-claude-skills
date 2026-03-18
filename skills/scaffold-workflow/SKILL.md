---
name: scaffold-workflow
description: "Add workflow status transitions and tags to a page. Use when integrating status management or tag toggles."
license: MIT
compatibility: Requires a Zango frontend app with @zango-core/crud and @zango-core/crm-framework packages.
metadata:
  author: Healthlane Technologies
  version: "1.0"
---

# Scaffold Workflow

Add workflow status transitions and tag toggles to a page.

## Before Starting

Read the Workflow reference for full props and API formats: [Workflow Reference](../zango-frontend/references/WORKFLOW-REFERENCE.md)

## Three Patterns

### Pattern 1: Auto (Inside CrudHandler)

WorkflowStatus and WorkflowTags work automatically inside CrudHandler's detail views. No additional configuration needed -- the components read from the detail view context.

```jsx
import { CrudHandler } from "@zango-core/crud/table";

<CrudHandler
  api_endpoint="/api/orders/"
  customDrawerDetail={({ data, workflow_details, onRefresh }) => (
    <div className="p-6">
      <h2>{data?.title}</h2>
      {/* WorkflowStatus auto-reads from CrudHandler's detail context */}
      <WorkflowStatus onStatusChange={onRefresh} />
      <WorkflowTags onTagChange={onRefresh} />
    </div>
  )}
/>
```

### Pattern 2: Standalone (with apiUrl)

Use when rendering workflow components outside of CrudHandler, such as on a custom page.

```jsx
import { WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

function {{EntityName}}Detail({ objectUuid }) {
  const apiUrl = `/api/{{entity_name}}/?object_uuid=${objectUuid}`;

  return (
    <div>
      <WorkflowStatus
        apiUrl={apiUrl}
        onStatusChange={() => {
          console.log("Status changed, refreshing...");
          // Refresh page data
        }}
      />
      <WorkflowTags
        apiUrl={apiUrl}
        onTagChange={() => {
          console.log("Tag changed");
        }}
      />
    </div>
  );
}
```

### Pattern 3: Shared Context (DetailViewProvider)

When multiple components need the same workflow data, wrap them in a DetailViewProvider.

```jsx
import { DetailViewProvider, WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";
import { useDetailViewContext } from "@zango-core/crud/table";

function CustomStatusBadge() {
  const { workflowDetails, loading } = useDetailViewContext();
  if (loading || !workflowDetails) return null;
  return (
    <span className="badge">
      {workflowDetails.current_status_meta?.status_label}
    </span>
  );
}

function {{EntityName}}Detail({ objectUuid }) {
  return (
    <DetailViewProvider apiUrl={`/api/{{entity_name}}/?object_uuid=${objectUuid}`}>
      <CustomStatusBadge />
      <WorkflowStatus />
      <WorkflowTags />
    </DetailViewProvider>
  );
}
```

## Dialog Pattern (Form in Modal)

When a transition requires a form (`is_form_based: true`), render it inside a dialog:

```jsx
import { useState, useEffect, useRef } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function {{EntityName}}Workflow({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogReady, setDialogReady] = useState(false);
  const cancelRef = useRef(null);

  // Wait for dialog DOM before activating portal
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
        apiUrl={`/api/{{entity_name}}/?object_uuid=${objectUuid}`}
        formContainerId={dialogReady ? "workflow-form-portal" : undefined}
        onFormCancel={cancelRef}
        beforeTransition={async (transition) => {
          setShowDialog(true);
          await new Promise((r) => setTimeout(r, 100));
        }}
        afterTransition={async (transition, success) => {
          if (success) setShowDialog(false);
        }}
        onStatusChange={() => {
          console.log("Status updated");
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

## Programmatic Form Control (onFormCancel)

Use `onFormCancel` ref to programmatically close workflow forms:

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
    <div>
      <button onClick={closeAllForms}>Close All Forms</button>

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

## useWorkflow Hook (Programmatic Control)

For fully custom workflow UI:

```jsx
import { useWorkflow } from "@zango-core/crud/table";

function ApproveButton({ objectUuid }) {
  const { workflowDetails, executeTransition, loading } = useWorkflow({
    apiUrl: `/api/orders/?object_uuid=${objectUuid}`,
  });

  if (loading || !workflowDetails) return null;

  const approveTransition = workflowDetails.next_transitions.find(
    (t) => t.name === "approve"
  );
  if (!approveTransition) return null;

  return (
    <button onClick={() => executeTransition(approveTransition)}>
      Approve
    </button>
  );
}
```

## After Generating

### Checklist

1. WorkflowStatus/WorkflowTags imported from `@zango-core/crud/table`
2. For standalone usage: `apiUrl` prop includes `?object_uuid=...`
3. For dialog pattern: `formContainerId` set conditionally (only when dialog DOM is ready)
4. `onFormCancel` ref used for cleanup when dialogs close
5. `onStatusChange`/`onTagChange` callbacks trigger data refresh

## Critical Rules

- Import from `@zango-core/crud/table` or `@zango-core/crud/workflow` -- NEVER from `@zango-core/crud`
- Inside CrudHandler detail views, WorkflowStatus/WorkflowTags need NO props -- they auto-read from context
- `formContainerId` must point to an existing DOM element. Use the dialogReady pattern for dialogs
- `onFormCancel` is a **ref** (not a callback). It receives a function when a form is shown, null otherwise
- `beforeTransition` receives the transition object. Use it to open dialogs BEFORE the form renders
- `afterTransition` receives `(transition, success)`. Only close dialogs when `success === true`
- Workflow API data uses snake_case: `current_status`, `current_status_meta`, `next_transitions`, `tag_details`, `status_label`, `status_color`, `display_name`, `tag_label`
