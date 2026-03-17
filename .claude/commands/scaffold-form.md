---
description: "Generate FormRenderer configuration - server-driven or local RJSF schema with correct formats"
---

# Scaffold Form

Read the Zango CRUD reference for form API details:
**Read:** `@ZANGO-SKILL-REFERENCE.md`

## Task
Generate a FormRenderer component based on the user's requirements.

## Two Modes

### Mode A: Server-Driven (recommended for dynamic forms)
The form schema comes from the backend API. The frontend just renders it.

```jsx
import { FormRenderer } from '@zango-core/crud/form';

<FormRenderer
  api_endpoint="/api/{endpoint}/"
  getParams={{ action: 'initialize_form' }}
  postParams={{ form_type: 'create_form' }}
  onResponse={(response) => {
    // Handle success - close dialog, refresh table, show toast
  }}
  onError={(error) => {
    // Handle error
  }}
/>
```

Server response format (snake_case):
```json
{
  "response": {
    "is_multistep": false,
    "form": {
      "json_schema": { ... },
      "ui_schema": { ... },
      "form_data": { ... }
    }
  }
}
```

### Mode B: Local RJSF Schema (for static forms)
```jsx
<FormRenderer
  rjsf_schema={{
    schema: { type: 'object', properties: { ... } },
    uiSchema: { ... },
    formData: { ... }
  }}
  onSubmit={async (formData) => {
    // Handle submission
    return { success: true };
  }}
  onResponse={(response) => { }}
/>
```

## Key Props
- `showConfirmAlert` - Show confirmation before submit
- `skipAutoRefresh` - Don't auto-refresh table after submit
- `submitButtonContainerId` - Portal submit button to external container
- `onAddAnother` - Enable "Add Another" button (response must NOT include `hide_add_another_btn: true`)
- `customWidgets` - Custom RJSF widget overrides

## Checklist
- [ ] Import from `@zango-core/crud/form` (NOT `@zango-core/crud`)
- [ ] Server mode: use `api_endpoint` (ignores `rjsf_schema`)
- [ ] Local mode: use `rjsf_schema` with `{ schema, uiSchema, formData }`
- [ ] Server responses use snake_case: `json_schema`, `ui_schema`, `form_data`
- [ ] Local rjsf_schema prop uses camelCase: `schema`, `uiSchema`, `formData`
