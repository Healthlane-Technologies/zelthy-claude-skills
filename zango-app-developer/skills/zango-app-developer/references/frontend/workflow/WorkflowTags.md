# WorkflowTags
Workflow

Manages workflow tags with toggle functionality and form-based transitions.

**Sections:** Props | Usage Examples

## Props

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

## Code Examples

### basic.jsx
```jsx
<WorkflowTags apiUrl="/api/users/?object_uuid=123"
```

### custom-container.jsx
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
```

### custom-rendering.jsx
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
```

### static-data.jsx
```jsx
import { WorkflowTags } from "@zango-core/crud/workflow";

function StaticTags({ workflowData }) {
  // workflowData is the response object containing tag_details
  // { tag_details: [{ name, state, enable, disable, is_enable_allowed, is_disable_allowed }] }
  return (
    <WorkflowTags
      staticData={workflowData}
      onTagChange={() => console.log("Tag changed")}
```

