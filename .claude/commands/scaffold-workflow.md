---
description: "Add workflow status transitions and tags to a Zango page"
---

# Scaffold Workflow Integration

Read the Zango CRUD reference:
**Read:** `@ZANGO-SKILL-REFERENCE.md`

## Task
Add workflow components (status transitions and/or tags) to a page.

## Three Usage Patterns

### Pattern A: Inside CrudHandler (automatic)
CrudHandler automatically shows workflow in detail views. No extra code needed.
```jsx
<CrudHandler api_endpoint="/api/users/" />
// Workflow appears in detail drawer automatically
```

### Pattern B: Standalone with direct API
```jsx
import { WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';

<WorkflowStatus
  apiUrl="/api/users/?object_uuid=123"
  onStatusChange={() => refetch()}
  beforeTransition={async (transition) => {
    console.log("Starting:", transition.display_name);
  }}
  afterTransition={async (transition, success) => {
    console.log("Done:", success);
  }}
/>

<WorkflowTags
  apiUrl="/api/users/?object_uuid=123"
  onTagChange={() => refetch()}
  beforeTagChange={async (tag, newState) => {
    console.log("Tag:", tag.tag_label, "->", newState);
  }}
/>
```

### Pattern C: Shared context
```jsx
import { DetailViewProvider, WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';

<DetailViewProvider apiUrl="/api/users/?object_uuid=123">
  <WorkflowStatus />
  <WorkflowTags />
</DetailViewProvider>
```

## Advanced: Custom Form Container (Dialog)
```jsx
const [showDialog, setShowDialog] = useState(false);

<WorkflowStatus
  apiUrl="/api/users/?object_uuid=123"
  formContainerId="workflow-form-container"
  beforeTransition={async (t) => {
    if (t.is_form_based) setShowDialog(true);
  }}
  afterTransition={async (t, success) => {
    if (success) setShowDialog(false);
  }}
/>

<Dialog open={showDialog}>
  <div id="workflow-form-container" />
</Dialog>
```

## Advanced: Programmatic Cancel
```jsx
const cancelRef = useRef(null);

<WorkflowStatus onFormCancel={cancelRef} />

<button onClick={() => cancelRef.current?.()}>
  Cancel Form
</button>
```

## Workflow Data Format
- Status: `{ status_label, status_color }`
- Transitions: `{ name, display_name, from, to, is_form_based, is_manual, to_state_meta }`
- Tags: `{ name, tag_label, state, enable: { is_form_based, confirmation_message }, disable: {...} }`

## Hooks
```jsx
import { useWorkflow, useDetailView } from '@zango-core/crud/table';

const { workflowDetails, refreshWorkflow, executeTransition, toggleTag } = useWorkflow({
  apiUrl: "/api/users/?object_uuid=123"
});

const { data, loading, refresh, workflowDetails } = useDetailView({
  apiUrl: "/api/users/?object_uuid=123"
});
```

## Checklist
- [ ] Import from `@zango-core/crud/table`
- [ ] Use `next_transitions` not `transitions`
- [ ] Use `tag_details` not `tags`
- [ ] Transition labels: `transition.display_name`
- [ ] Tag labels: `tag.tag_label`
- [ ] Tag state: `tag.state === "enabled"` (string, not boolean)
