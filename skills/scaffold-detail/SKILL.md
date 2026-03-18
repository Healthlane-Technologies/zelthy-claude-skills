---
name: scaffold-detail
description: "Generate custom detail view - drawer or full-page route-based with workflow. Use when customizing how record details are displayed."
license: MIT
compatibility: Requires a Zango frontend app with @zango-core/crud and @zango-core/crm-framework packages.
metadata:
  author: Healthlane Technologies
  version: "1.0"
---

# Scaffold Detail View

Generate custom detail views for displaying record details.

## Before Starting

Read the CRUD reference for detail view props and API formats: [CRUD Reference](../zango-frontend/references/CRUD-REFERENCE.md)

## Gather Requirements

Ask the user:

1. **Detail type?**
   - **Drawer**: Side panel that opens on row click (default)
   - **Route-based**: Full page at `/detail-view/:object_uuid`
2. **What to display?** General details, workflow status, custom sections, actions
3. **Need workflow transitions?** (status buttons, tags)
4. **Custom layout requirements?** (tabs, cards, grids)

## Data Props Auto-Provided

Both drawer and route-based detail components automatically receive these props from CrudHandler:

| Prop | Type | Description |
|------|------|-------------|
| `data` | `object` | Complete detail response from the API |
| `api_endpoint` | `string` | The API endpoint |
| `loading` | `boolean` | Whether data is being fetched |
| `error` | `string \| null` | Error message if fetch failed |
| `onRefresh` | `function` | Callback to re-fetch detail data |
| `objectUuid` | `string` | UUID of the current record |
| `pk` | `string \| number` | Primary key of the record |
| `title` | `string` | Display title from the record |
| `general_details` | `object` | Fields object: `{ field_name: { name, display_name, type, value } }` |
| `workflow_details` | `object` | `{ current_status, current_status_meta, next_transitions, tag_details }` |
| `sections` | `array` | Section objects: `{ key, title, data, extra_html, form }` |
| `row_actions` | `array` | Available row-level actions |

**Drawer-only extra props:** `selectedRow`, `open`, `onClose`

## Template: Custom Drawer Detail

```jsx
import React from "react";

const {{EntityName}}DrawerDetail = ({
  selectedRow,
  open,
  onClose,
  data,
  workflow_details,
  general_details,
  sections,
}) => {
  if (!open || !data) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold">{data.title || "Detail View"}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Workflow Status Badge */}
        {workflow_details?.current_status_meta && (
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm"
            style={{
              backgroundColor: workflow_details.current_status_meta.status_color || "#eff6ff",
              color: "#1d4ed8",
            }}
          >
            {workflow_details.current_status_meta.status_label}
          </div>
        )}

        {/* General Details */}
        {general_details?.fields && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">General Information</h3>
            <div className="space-y-2">
              {Object.entries(general_details.fields).map(([key, field]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">{field.display_name}</span>
                  <span className="text-sm font-medium">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sections */}
        {sections?.map((section) => (
          <div key={section.key}>
            <h3 className="text-sm font-medium text-gray-500 mb-3">{section.title}</h3>
            {section.data && (
              <div className="space-y-2">
                {Object.entries(section.data).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">{key}</span>
                    <span className="text-sm font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default {{EntityName}}DrawerDetail;
```

### Wire Up Drawer Detail

```jsx
import { CrudHandler } from "@zango-core/crud/table";
import {{EntityName}}DrawerDetail from "./{{EntityName}}DrawerDetail";

<CrudHandler
  api_endpoint="{{api_endpoint}}"
  customDrawerDetail={{{EntityName}}DrawerDetail}
/>
```

## Template: Route-Based Detail (Full Page)

```jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowStatus, WorkflowTags, DetailViewProvider } from "@zango-core/crud/table";

const {{EntityName}}MainDetail = ({
  data,
  workflow_details,
  general_details,
  sections,
  onRefresh,
  objectUuid,
}) => {
  const navigate = useNavigate();

  if (!data) return null;

  const apiUrl = `{{api_endpoint}}?object_uuid=${objectUuid}`;

  return (
    <DetailViewProvider apiUrl={apiUrl}>
      <div className="max-w-4xl mx-auto p-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
        >
          &larr; Back to list
        </button>

        {/* Title + Workflow */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{data.title || "Record Detail"}</h1>
          <div className="flex items-center gap-3">
            <WorkflowStatus onStatusChange={onRefresh} />
            <WorkflowTags onTagChange={onRefresh} />
          </div>
        </div>

        {/* General Details */}
        {general_details?.fields && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">General Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(general_details.fields).map(([key, field]) => (
                <div key={key}>
                  <span className="text-sm text-gray-500 block">{field.display_name}</span>
                  <span className="text-sm font-medium">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sections */}
        {sections?.map((section) => (
          <div key={section.key} className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
            {section.data && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(section.data).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm text-gray-500 block">{key}</span>
                    <span className="text-sm font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
            {section.extra_html && (
              <div dangerouslySetInnerHTML={{ __html: section.extra_html }} />
            )}
          </div>
        ))}

        <button
          onClick={onRefresh}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Refresh Data
        </button>
      </div>
    </DetailViewProvider>
  );
};

export default {{EntityName}}MainDetail;
```

### Wire Up Route-Based Detail

```jsx
import { CrudHandler } from "@zango-core/crud/table";
import {{EntityName}}MainDetail from "./{{EntityName}}MainDetail";

<CrudHandler
  api_endpoint="{{api_endpoint}}"
  enableDetailViewRoute={true}
  customMainDetail={{{EntityName}}MainDetail}
/>
```

## After Generating

### Checklist

1. Detail component created and imported correctly
2. For drawer: passed as `customDrawerDetail` prop to CrudHandler
3. For route-based: passed as `customMainDetail` + `enableDetailViewRoute={true}`
4. `general_details.fields` iterated as **object** (`Object.entries()`), not array
5. Workflow components imported from `@zango-core/crud/table`
6. `onRefresh` called after workflow transitions to update displayed data

## Critical Rules

- Import from `@zango-core/crud/table` -- NEVER from `@zango-core/crud`
- `general_details.fields` is an **object** keyed by field_name: `{ field_name: { name, display_name, type, value } }`
- `workflow_details.current_status_meta` has `{ status_label, status_color }`
- `workflow_details.next_transitions` is an array of `{ name, display_name, from, to, is_form_based, to_state_meta }`
- For route-based detail with workflow, wrap content in `<DetailViewProvider>` so WorkflowStatus/WorkflowTags auto-fetch
- `sections` array items have `{ key, title, data (object), extra_html (optional), form (optional) }`
