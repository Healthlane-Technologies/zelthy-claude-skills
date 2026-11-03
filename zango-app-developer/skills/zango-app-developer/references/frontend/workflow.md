# Zango Workflow Reference

## About this package

**What it is.** The workflow components in `@zango-core/crud/table` show and
move a record's status. The backend half is the `workflow` Zango package, which
owns statuses, transitions and tags.

**What it provides.**
- `WorkflowStatus`: current status badge plus its next transitions.
- `WorkflowTags`: tag switches that enable or disable per record.
- `WorkflowFormRenderer`: the form for form-based transitions.
- `useWorkflow`: the same logic without UI.
- `DetailViewProvider` and `useDetailView`: load one record and its workflow
  data.

**Where it fits.** The detail side of a crud page. It sits in a detail route,
drawer or tab, next to the record's fields. There is no
`@zango-core/crud/workflow` entry. Import from `/table` and `/ui`.

**Pairs with.** [recipes-detail.md](recipes-detail.md) for detail pages.
[form.md](form.md) for transition forms.
[../packages/workflow/overview.md](../packages/workflow/overview.md) for the
backend.

> Auto-generated from documentation pages. Regenerate with: `node scripts/generate-reference.js`

## Import
```js
import { WorkflowStatus, WorkflowTags, WorkflowFormRenderer, DetailViewProvider, useWorkflow, useDetailView, useDetailViewContext } from '@zango-core/crud/table';
import type { Transition, TagDetail, ConfirmationAlertProps, WorkflowStatusProps, WorkflowTagsProps } from '@zango-core/crud/table';
import { StatusBadge, StatusButton, TagSwitch } from '@zango-core/crud/ui'; // also exported from /table
```

There is no `@zango-core/crud/workflow` entry. Subpaths are `/core`, `/ui`, `/form`, `/table`.

## Workflow Data Format
- Status: `{ status_label, status_color }`
- Transitions: `{ name, display_name, from, to, is_form_based, is_manual, to_state_meta: { status_label, status_color } }`
- Tags: `{ name, tag_label, state: "enabled"|"disabled", enable: { is_form_based, confirmation_message }, disable: { ... } }`
- Use `next_transitions` (NOT `transitions`), `tag_details` (NOT `tags`)

---


## WorkflowStatus (Workflow)

**Sections:** Overview | Props | Callback Lifecycle | Confirmation | Usage Patterns | Programmatic Form Control

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | string | context | Record endpoint. Falls back to `DetailViewProvider`'s `apiUrl`. Put `object_uuid` in its query string: the transition form reads it only from there. |
| `workflowDetails` | WorkflowDetails | - | Workflow data to start from. Skips the mount fetch. |
| `staticData` | unknown | - | Workflow data in any of these shapes: `{ workflow_details }`, `{ response: { workflow_details } }`, or a bare workflow-details object. Skips the mount fetch. Executing a transition still needs `apiUrl`. |
| `objectUuid` | string | - | Explicit object UUID for the fetch and execute calls. The transition form ignores it (see `apiUrl`). |
| `formContainerId` | string | - | DOM id to portal the transition form into. Without it the package opens its own `Drawer`. |
| `onStatusChange` | `() => void` | - | Fires ~100ms after a successful transition. |
| `onShowStatusForm` | `(transition, apiUrl) => void` | - | Form-based transitions call this instead of rendering a form. You render the form (e.g. `WorkflowFormRenderer`); `afterTransition` and `onStatusChange` then do not fire for that transition. |
| `beforeTransition` | `(transition) => Promise<void> \| void` | - | Runs before a transition. Throwing aborts it; the default rendering shows the error inline (`renderTransitions` does not). |
| `afterTransition` | `(transition, success) => Promise<void> \| void` | - | Runs after a transition. See [Callback Lifecycle](#callback-lifecycle): it fires twice for non-form transitions. |
| `confirmationAlert` | `(props: { onConfirm, onCancel, title, message }) => ReactNode` | - | Replaces the package's confirmation `Dialog`. Called only for non-form transitions that carry `confirmation_message`. |
| `renderTransitions` | `(params) => ReactNode` | - | Replaces the status pill and menu. Receives `{ transitions, onTransitionClick, currentStatus, statusLabel, statusTransitionForm, onFormCancel }`. |
| `onFormCancel` | `React.MutableRefObject<(() => void) \| null>` | - | Ref the package fills with a close function while a form is shown, `null` otherwise. |

`renderTransitions` notes:
- `statusTransitionForm` is `null` when `formContainerId` is set. The form is portaled there instead.
- It is not called when `next_transitions` is empty. The package renders a plain status pill.
- The component returns `null` when there is no `current_status` and no `current_status_meta`.

### Callback Lifecycle

| Transition kind | Sequence |
|-----------------|----------|
| No confirmation | `beforeTransition` → (`useWorkflow`) `beforeTransition` again → POST → refresh → `afterTransition` → `afterTransition` again → `onStatusChange` |
| `confirmation_message` | `beforeTransition` → confirmation → on confirm, same as above. Cancel fires nothing more. |
| `is_form_based` | `beforeTransition` → form → on success: refresh → `afterTransition(t, true)` once → `onStatusChange`. Cancel fires nothing more. |

⚠️ Non-form transitions call `beforeTransition` and `afterTransition` twice: once in `WorkflowStatus`, once in `useWorkflow.executeTransition`. On failure `afterTransition(t, false)` also fires twice. Guard side effects with a ref.

After a success the package refreshes on its own: `refreshWorkflow()` (a `fetch_item_details` GET), then `refreshDetail()` when inside a `DetailViewProvider`.

### Confirmation

- Default: the package's own `Dialog` titled "Confirm `<display_name>`", body `confirmation_message`, Cancel / Confirm buttons. Not a browser `confirm`.
- Only non-form transitions with `confirmation_message` confirm. Others execute on click.
- `confirmationAlert` replaces the dialog. ⚠️ `WorkflowStatus` keeps rendering your element after `onConfirm`; only `onCancel` clears it. Track open state inside your element. (`WorkflowTags` clears it after the toggle.)
- The default confirmation `Dialog`, the status menu and the package form `Drawer` stay mounted while closed, so they animate out. A custom `confirmationAlert` element is unmounted at once, with no exit.

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
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderDetail({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        formContainerId="workflow-form-container"
        beforeTransition={async (transition) => {
          // beforeTransition fires for every transition: open only for forms
          if (transition.is_form_based) setShowDialog(true);
        }}
        afterTransition={async () => {
          setShowDialog(false);
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
  renderTransitions={({ statusLabel, transitions, onTransitionClick, statusTransitionForm }) => (
    <div className="flex items-center gap-3">
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100">
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
      {/* Present when there is no formContainerId */}
      {statusTransitionForm}
    </div>
  )}
/>
```

```jsx
import { useRef } from "react";
import { WorkflowStatus } from "@zango-core/crud/table";

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

---

## WorkflowTags (Workflow)

**Sections:** Props | Callback Lifecycle | Usage Examples

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiUrl` | string | context | Record endpoint. Falls back to `DetailViewProvider`'s `apiUrl`. Put `object_uuid` in its query string. |
| `tagDetails` | TagDetail[] | - | Tag data to start from. Skips the mount fetch. |
| `staticData` | unknown | - | `{ tag_details }`, `{ response: { tag_details } }`, `{ workflow_details }` or `{ response: { workflow_details } }`. Skips the mount fetch. Toggling still needs `apiUrl`. |
| `objectUuid` | string | - | Explicit object UUID for fetch and toggle calls. The tag form ignores it. |
| `formContainerId` | string | - | DOM id to portal the tag form into. |
| `onTagChange` | `() => void` | - | Fires ~100ms after a successful toggle or tag form. |
| `onShowTagForm` | `(tag, apiUrl) => void` | - | Form-based toggles call this instead of rendering a form. You render the form. |
| `beforeTagChange` | `(tag, newState) => Promise<void> \| void` | - | `newState` is `"enabled"` or `"disabled"`. Throwing aborts. Fires twice for non-form toggles (component + `useWorkflow.toggleTag`). |
| `afterTagChange` | `(tag, success) => Promise<void> \| void` | - | Fires once for non-form toggles. ⚠️ Never fires for form-based toggles; use `onTagChange`. |
| `confirmationAlert` | `(props: { onConfirm, onCancel, title, message }) => ReactNode` | - | Replaces the package's confirmation `Dialog` for non-form toggles with a `confirmation_message`. Cleared after the toggle. |
| `renderTags` | `(params) => ReactNode` | - | Receives `{ tags, onTagToggle, tagTransitionForm, onFormCancel }`. `tagTransitionForm` is `null` when `formContainerId` is set. Not called when there are no tags (the component returns `null`). ⚠️ Its `onFormCancel` clears a pending confirmation, not the form; close a form with the `onFormCancel` ref. |
| `onFormCancel` | `React.MutableRefObject<(() => void) \| null>` | - | Ref the package fills with a close function while a tag form is shown, `null` otherwise. |

A toggle the user is not allowed to make (`is_enable_allowed` / `is_disable_allowed` false) shows an error toast and stops. The default confirmation `Dialog` stays mounted to animate out.

### Code Examples

```jsx
<WorkflowTags apiUrl="/api/users/?object_uuid=123" />
```

```jsx
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowTags } from "@zango-core/crud/table";

function UserTags({ objectUuid }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <WorkflowTags
        apiUrl={`/api/users/?object_uuid=${objectUuid}`}
        formContainerId="tag-form-container"
        beforeTagChange={async (tag, newState) => {
          const formBased = newState === "enabled" ? tag.enable.is_form_based : tag.disable.is_form_based;
          if (formBased) setShowModal(true);
        }}
        onTagChange={() => {
          // afterTagChange never fires for form-based toggles; close here
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
  renderTags={({ tags, onTagToggle, tagTransitionForm }) => (
    <div className="grid grid-cols-2 gap-4">
      {tags.map((tag) => (
        <div
          key={tag.name}
          className="flex items-center justify-between p-4 rounded-xl
                     border border-gray-200 bg-white shadow-sm"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">{tag.name.replace(/_/g, " ")}</p>
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
      {tagTransitionForm}
    </div>
  )}
/>
```

---

## Standalone Controls (StatusBadge, StatusButton, TagSwitch)

Single-purpose controls from `@zango-core/crud/ui`. They need no `DetailViewProvider` and do not refresh anything: refetch in `onSuccess` / `onToggle`.

| Component | Props |
|-----------|-------|
| `StatusBadge` | `status` (required), `label` (default: `status` capitalised, `_` → space), `color` (overrides the built-in map: `active`, `pending`, `approved`, `rejected`, `draft`, `completed`, `failed`, ...; unknown → gray), `showDot` (default `true`), `size` (`"sm" \| "md" \| "lg"`, default `sm` on mobile, `md` otherwise), `className`. Display only. |
| `StatusButton` | `transition` and `apiUrl` (required), `onSuccess`, `onError`, `beforeClick`, `afterClick(success)`, `variant` (`"primary" \| "secondary" \| "outline" \| "ghost" \| "danger"`, default `primary`), `size`, `disabled`, `showConfirmation`, `confirmationMessage`, `className`. |
| `TagSwitch` | `tag` and `apiUrl` (required), `onToggle(newState: boolean)`, `onError`, `beforeToggle`, `afterToggle(success)`, `label` (default: humanised `tag.name`), `size` (default `md`), `disabled`, `className`. |

- Both actions read `object_uuid` from `apiUrl`'s `?object_uuid=`, or a trailing UUID path segment.
- `StatusButton` POSTs `process_transition` directly. ⚠️ It does not open forms: do not use it for `is_form_based` transitions. It confirms through the package `Dialog` when `showConfirmation`, `confirmationMessage` or `transition.confirmation_message` is set.
- `TagSwitch` confirms when the direction's `confirmation_message` is set, and blocks disallowed toggles with a toast. It keeps local state synced from `tag.state`.

```jsx
import { StatusBadge, StatusButton, TagSwitch } from "@zango-core/crud/ui";

<StatusBadge status="pending" label="Pending review" />

<StatusButton
  transition={{ name: "approve", display_name: "Approve" }}
  apiUrl="/api/orders/?object_uuid=123"
  showConfirmation
  onSuccess={() => refetch()}
/>

<TagSwitch
  tag={tagDetail}
  apiUrl="/api/orders/?object_uuid=123"
  onToggle={(enabled) => refetch()}
/>
```

---

## Production Guidance

Patterns proven in a production Zango app's detail view. Each is backed by package source.

1. **Mount only once `workflowDetails` exists.** `useWorkflow` fetches `fetch_item_details` on mount when it has no initial details and has an `apiUrl` with an object UUID. The `apiUrl` can come from the context, so withholding the prop does not stop it. Render `null` until the detail payload arrives, then pass `staticData={workflowDetails}`.
2. **Do not refresh twice inside a `DetailViewProvider`.** The package already awaits `context.refreshDetail()` after a transition, a toggle or a transition form, before `onStatusChange` / `onTagChange` fire. Refreshing again there reloads the detail a second time. Outside a provider the callbacks are your only refresh.
3. **Put `object_uuid` in `apiUrl`'s query string.** The transition form builds its init and submit urls from `apiUrl` and keeps only its `object_uuid` param. Without it a form-based transition posts no object. `objectUuid` does not reach the form.
4. **De-duplicate `afterTransition`.** It fires twice per non-form transition. Track a pending ref and act on the first call only.
5. **Open your form container only for forms.** `beforeTransition` fires for every transition. Check `t.is_form_based` (tags: `tag.enable/disable.is_form_based` by `newState`).
6. **No delay before the portal.** With `formContainerId`, the form polls for the container every 100ms for up to 3s and renders nothing until found. It can mount right after `beforeTransition` opens your dialog.

```jsx
import { useRef, useState } from "react";
import { WorkflowStatus, useDetailViewContext } from "@zango-core/crud/table";

function StatusControl({ apiUrl, objectUuid, workflowDetails, onChanged }) {
  const ctx = useDetailViewContext();
  const [formOpen, setFormOpen] = useState(false);
  const pending = useRef(false);
  const cancelRef = useRef(null);

  if (!workflowDetails) return null; // (1)

  const url = `${apiUrl.split("?")[0]}?object_uuid=${objectUuid}`; // (3)
  const notify = ctx?.refreshDetail ? undefined : onChanged; // (2)

  return (
    <>
      <WorkflowStatus
        apiUrl={url}
        staticData={workflowDetails}
        formContainerId="wf-form"
        onFormCancel={cancelRef}
        onStatusChange={notify}
        beforeTransition={async (t) => {
          pending.current = true;
          if (t.is_form_based) setFormOpen(true); // (5)
        }}
        afterTransition={async () => {
          if (!pending.current) return; // (4)
          pending.current = false;
          setFormOpen(false);
        }}
      />
      <MyDialog open={formOpen} onClose={() => { cancelRef.current?.(); setFormOpen(false); }}>
        <div id="wf-form" />
      </MyDialog>
    </>
  );
}
```

---

## Advanced Features (Advanced)

**Sections:** Programmatic Form Control (onFormCancel) | Portal Rendering | Error Handling

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
// Portal into a dialog. Keep formContainerId constant: toggling it to
// undefined makes the package open its own Drawer instead.
import { useRef, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { WorkflowStatus } from "@zango-core/crud/table";

function OrderWorkflow({ objectUuid }) {
  const [showDialog, setShowDialog] = useState(false);
  const cancelRef = useRef(null);

  return (
    <div>
      <WorkflowStatus
        apiUrl={`/api/orders/?object_uuid=${objectUuid}`}
        formContainerId="workflow-form-portal"
        onFormCancel={cancelRef}
        beforeTransition={async (transition) => {
          if (transition.is_form_based) setShowDialog(true);
        }}
        afterTransition={async () => setShowDialog(false)}
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
          // The package already shows an error toast. Use this for extra
          // handling. Fires twice for non-form transitions.
          console.error("Transition failed:", transition.display_name);
        }
      }}
      onStatusChange={() => {
        // Only called on success. Inside a DetailViewProvider the detail
        // is already refreshed; refresh here only outside one.
      }}
    />
  );
}

// Errors surface as toasts. An error thrown from beforeTransition shows
// inline under the status pill. There is no retry UI.
```

---
