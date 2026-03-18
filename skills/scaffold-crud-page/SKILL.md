---
name: scaffold-crud-page
description: "Generate a complete CRUD page with CrudHandler - table, detail view, forms, workflows. Use when creating a new page for listing, creating, editing records."
license: MIT
compatibility: Requires a Zango frontend app with @zango-core/crud and @zango-core/crm-framework packages.
metadata:
  author: Healthlane Technologies
  version: "1.0"
---

# Scaffold CRUD Page

Generate a complete CRUD page using CrudHandler with table, detail view, forms, and workflows.

## Before Starting

Read the CRUD reference for full props and API formats: [CRUD Reference](../zango-frontend/references/CRUD-REFERENCE.md)

## Gather Requirements

Ask the user:

1. **Entity name?** (e.g., "Patient", "Order", "Product")
2. **API endpoint?** (e.g., `/api/patients/`)
3. **Custom detail view?** (drawer, route-based, or default)
4. **Custom table body?** (default or custom)
5. **Any header customizations?** (title, extra actions)

## Template: Basic CRUD Page

```jsx
import { CrudHandler } from "@zango-core/crud/table";

const {{EntityName}}Page = () => {
  return (
    <CrudHandler
      api_endpoint="{{api_endpoint}}"
      headerProps={{
        title: "{{Entity Name}}",
      }}
    />
  );
};

export default {{EntityName}}Page;
```

## Template: CRUD Page with Custom Detail (Drawer)

```jsx
import { CrudHandler } from "@zango-core/crud/table";

const {{EntityName}}Detail = ({ selectedRow, open, onClose, data, workflow_details, general_details, sections }) => {
  if (!open || !data) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold">{data.title || '{{Entity Name}} Detail'}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {general_details?.fields && (
          <div className="space-y-2">
            {Object.entries(general_details.fields).map(([key, field]) => (
              <div key={key} className="flex justify-between py-2 border-b">
                <span className="text-sm text-gray-500">{field.display_name}</span>
                <span className="text-sm font-medium">{field.value}</span>
              </div>
            ))}
          </div>
        )}
        {workflow_details && (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm"
            style={{
              backgroundColor: workflow_details.current_status_meta?.status_color || '#eff6ff',
              color: '#1d4ed8',
            }}>
            {workflow_details.current_status_meta?.status_label || workflow_details.current_status}
          </div>
        )}
      </div>
    </div>
  );
};

const {{EntityName}}Page = () => {
  return (
    <CrudHandler
      api_endpoint="{{api_endpoint}}"
      headerProps={{
        title: "{{Entity Name}}",
      }}
      customDrawerDetail={{{EntityName}}Detail}
    />
  );
};

export default {{EntityName}}Page;
```

## Template: CRUD Page with Route-Based Detail

```jsx
import { CrudHandler } from "@zango-core/crud/table";
import { useNavigate } from "react-router-dom";

const {{EntityName}}MainDetail = ({ data, workflow_details, general_details, sections, onRefresh }) => {
  const navigate = useNavigate();
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-6">
        &larr; Back to list
      </button>
      <h1 className="text-2xl font-bold mb-6">{data.title}</h1>
      {general_details?.fields && (
        <div className="bg-white rounded-lg border p-6 mb-6">
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
    </div>
  );
};

const {{EntityName}}Page = () => {
  return (
    <CrudHandler
      api_endpoint="{{api_endpoint}}"
      enableDetailViewRoute={true}
      headerProps={{
        title: "{{Entity Name}}",
      }}
      customMainDetail={{{EntityName}}MainDetail}
    />
  );
};

export default {{EntityName}}Page;
```

## Template: CRUD Page with Custom Header Actions

```jsx
import { CrudHandler } from "@zango-core/crud/table";

const {{EntityName}}Page = () => {
  return (
    <CrudHandler
      api_endpoint="{{api_endpoint}}"
      headerProps={{
        title: "{{Entity Name}}",
        customRightActions: (
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">
            Export CSV
          </button>
        ),
      }}
      utilityProps={{
        showUpload: true,
        showDownload: true,
        searchPlaceholder: "Search {{entity_name}}...",
      }}
    />
  );
};

export default {{EntityName}}Page;
```

## After Generating

### Checklist

1. File created at `src/custom/pages/{{EntityName}}Page.jsx`
2. Export added to `src/custom/pages/index.js`:
   ```js
   export { default as {{EntityName}}Page } from './{{EntityName}}Page';
   ```
3. Route configured in backend (use `/setup-routes` skill if needed)
4. The export name matches the route's `component` field exactly
5. API endpoint is proxied (check `VITE_PROXY_ROUTES` in `.env`)

## Critical Rules

- Import from `@zango-core/crud/table` -- NEVER from `@zango-core/crud`
- `general_details.fields` is an **object** keyed by field_name, NOT an array
- `StatusCol` data format: `{ status_label: "Active", status_color: "#12B76A" }`
- Row actions: `type: "form"` opens drawer, `type: "simple"` shows confirmation
- Server responses use **snake_case**: `json_schema`, `ui_schema`, `form_data`, `status_label`, `display_name`
