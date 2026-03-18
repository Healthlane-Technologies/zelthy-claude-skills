---
name: scaffold-form
description: "Generate FormRenderer configuration - server-driven or local RJSF schema. Use when creating forms for data entry."
license: MIT
compatibility: Requires a Zango frontend app with @zango-core/crud and @zango-core/crm-framework packages.
metadata:
  author: Healthlane Technologies
  version: "1.0"
---

# Scaffold Form

Generate FormRenderer configuration for data entry forms.

## Before Starting

Read the Form reference for full props and API formats: [Form Reference](../zango-frontend/references/FORM-REFERENCE.md)

## Gather Requirements

Ask the user:

1. **Mode?**
   - **Server-driven**: Backend provides schema via API (recommended for CRUD)
   - **Local RJSF**: Client-side schema definition
2. **For server-driven**: What is the API endpoint? (e.g., `/api/users/`)
3. **For local RJSF**: What fields are needed? (name, type, required, options)
4. **Where does the form render?** (standalone page, dialog, CrudHandler drawer)

## Template: Server-Driven Form (Create)

```jsx
import { FormRenderer } from "@zango-core/crud/form";

function Create{{EntityName}}Form() {
  return (
    <FormRenderer
      api_endpoint="{{api_endpoint}}"
      onResponse={(response) => {
        console.log("Created:", response);
        // Navigate, show toast, close dialog, etc.
      }}
      onError={(error) => {
        console.error("Failed:", error);
      }}
    />
  );
}
// GET  {{api_endpoint}}?action=initialize_form      --> fetches schema
// POST {{api_endpoint}}?form_type=create_form        --> submits data
```

## Template: Server-Driven Form (Edit)

```jsx
import { FormRenderer } from "@zango-core/crud/form";

function Edit{{EntityName}}Form({ objectUuid }) {
  return (
    <FormRenderer
      api_endpoint="{{api_endpoint}}"
      getParams={{
        action: "initialize_form",
        form_type: "edit_form",
        object_uuid: objectUuid,
      }}
      postParams={{
        form_type: "edit_form",
        object_uuid: objectUuid,
      }}
      onResponse={(response) => {
        console.log("Updated:", response);
      }}
      onError={(error) => {
        console.error("Update failed:", error);
      }}
    />
  );
}
```

## Template: Local RJSF Form

```jsx
import { FormRenderer } from "@zango-core/crud/form";

const {{entityName}}Schema = {
  schema: {
    type: "object",
    required: [{{required_fields}}],
    properties: {
      {{#each fields}}
      {{name}}: {
        type: "{{type}}",
        title: "{{title}}",
        {{#if enum}}enum: [{{enum}}],{{/if}}
      },
      {{/each}}
    },
  },
  uiSchema: {
    {{#each fields}}
    {{name}}: {
      "ui:placeholder": "{{placeholder}}",
      {{#if widget}}"ui:widget": "{{widget}}",{{/if}}
    },
    {{/each}}
    "ui:order": [{{field_order}}],
  },
  formData: {},
};

function {{EntityName}}Form() {
  return (
    <FormRenderer
      rjsf_schema={ {{entityName}}Schema}
      onSubmit={async (formData) => {
        const response = await fetch("{{api_endpoint}}", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        return response.json();
      }}
      onResponse={(result) => {
        console.log("Submitted:", result);
      }}
      onError={(error) => {
        console.error("Failed:", error);
      }}
    />
  );
}
```

## Template: Form in Dialog with Submit Button Portal

```jsx
import { useState } from "react";
import { FormRenderer } from "@zango-core/crud/form";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

function {{EntityName}}FormDialog({ open, onClose, mode = "create", objectUuid = null }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit" : "Create"} {{Entity Name}}</DialogTitle>
        </DialogHeader>

        {open && (
          <FormRenderer
            api_endpoint="{{api_endpoint}}"
            getParams={{
              action: "initialize_form",
              ...(mode === "edit" && {
                form_type: "edit_form",
                object_uuid: objectUuid,
              }),
            }}
            postParams={{
              form_type: mode === "edit" ? "edit_form" : "create_form",
              ...(objectUuid && { object_uuid: objectUuid }),
            }}
            submitButtonContainerId="{{entityName}}-form-footer"
            onResponse={() => onClose()}
            onError={(error) => console.error("Form error:", error)}
          />
        )}

        <DialogFooter>
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <div id="{{entityName}}-form-footer" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Key Props Reference

| Prop | Mode | Description |
|------|------|-------------|
| `api_endpoint` | Server | Endpoint for GET (schema) and POST (submit) |
| `getParams` | Server | Query params for GET. Default: `{ action: 'initialize_form' }` |
| `postParams` | Server | Query params for POST. Default: `{ form_type: 'create_form' }` |
| `rjsf_schema` | Local | `{ schema, uiSchema, formData }` -- note camelCase |
| `onSubmit` | Local | Client-side submit handler |
| `onResponse` | Both | Callback after successful submission |
| `onError` | Both | Callback on failure |
| `submitButtonContainerId` | Both | Portal submit button to a DOM element |
| `showConfirmAlert` | Both | Show confirmation before submit |
| `customWidgets` | Both | Custom RJSF widget components |
| `skipAutoRefresh` | Both | Skip CrudHandler auto-refresh after submit |

## After Generating

### Checklist

1. FormRenderer imported from `@zango-core/crud/form` (not `@zango-core/crud`)
2. Server-driven: API endpoint exists and is proxied
3. Local RJSF: Schema uses **camelCase** (`schema`, `uiSchema`, `formData`)
4. Server responses use **snake_case** (`json_schema`, `ui_schema`, `form_data`)
5. If using `submitButtonContainerId`, the target DOM element exists when the form mounts
6. Edit forms pass both `getParams` and `postParams` with `object_uuid`

## Critical Rules

- Import from `@zango-core/crud/form` -- NEVER from `@zango-core/crud`
- Server-driven mode: `api_endpoint` prop. `rjsf_schema` and `onSubmit` are IGNORED when `api_endpoint` is set
- Local RJSF mode: `rjsf_schema` prop with `onSubmit` handler
- Naming: Server uses `json_schema`/`ui_schema`/`form_data`. Local uses `schema`/`uiSchema`/`formData`
- Multi-step forms: Driven by server response with `is_multistep: true` -- no special client code needed
- Form sync: Add `"ui:options": { "syncOnChange": true }` in ui_schema for dependent dropdowns
- Autocomplete: Use `"ui:widget": "autocomplete"` for search-as-you-type fields
