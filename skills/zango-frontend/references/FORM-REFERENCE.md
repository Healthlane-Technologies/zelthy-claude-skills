# Form Reference

Complete reference for FormRenderer -- dual-mode form engine with server-driven and local RJSF support.

---

## FormRenderer

### Import

```jsx
import { FormRenderer } from "@zango-core/crud/form";
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| api_endpoint | `string` | — | Enables server-driven mode. Endpoint for GET (schema) and POST (submit). When provided, `rjsf_schema` and `onSubmit` are ignored. |
| getParams | `object` | `{ action: 'initialize_form' }` | Query params appended to the GET request for fetching form schema. |
| postParams | `object` | `{ form_type: 'create_form' }` | Query params appended to the POST request for submission. |
| showConfirmAlert | `boolean` | `false` | Show confirmation dialog before submitting. |
| customConfirmAlert | `ReactNode \| Function` | — | Custom confirmation UI. Receives `{ onConfirm, onCancel }`. |
| rjsf_schema | `object` | — | Local RJSF schema: `{ schema, uiSchema, formData }`. Enables local mode. Ignored if `api_endpoint` is provided. |
| onSubmit | `function` | — | Client-side submit handler for local mode. Receives validated formData. Ignored if `api_endpoint` is provided. |
| onResponse | `function` | — | Callback after successful submission. Receives server response (server mode) or onSubmit return value (local mode). |
| onError | `function` | — | Callback when submission fails. Receives error object. |
| customWidgets | `object` | — | Map of custom RJSF widget names to React components. Reference via `"ui:widget": "yourWidgetName"`. |
| submitButtonContainerId | `string` | — | DOM element ID to portal the submit button into. |
| skipAutoRefresh | `boolean` | `false` | Prevent automatic table refresh after successful submission in CrudHandler. |

---

## Server-Driven Mode

The form schema is fetched from the server. Submission is handled automatically.

### Server Response Format

```json
// GET /api/users/?action=initialize_form
{
  "success": true,
  "response": {
    "is_multistep": false,
    "form": {
      "json_schema": {
        "type": "object",
        "required": ["name", "email"],
        "properties": {
          "name": { "type": "string", "title": "Full Name" },
          "email": { "type": "string", "title": "Email", "format": "email" },
          "role": { "type": "string", "title": "Role", "enum": ["Admin", "Editor", "Viewer"] }
        }
      },
      "ui_schema": {
        "name": { "ui:placeholder": "Enter full name", "ui:autofocus": true },
        "email": { "ui:placeholder": "user@company.com" },
        "role": { "ui:placeholder": "Select a role" },
        "ui:order": ["name", "email", "role"]
      },
      "form_data": {}
    }
  }
}
```

> **Key naming:** Server responses use snake_case: `json_schema`, `ui_schema`, `form_data`. Local `rjsf_schema` uses camelCase: `schema`, `uiSchema`, `formData`.

### Submit Response Format

```json
// Success:
{ "success": true, "response": { "message": "User created successfully" } }

// Validation error:
{ "success": false, "response": { "message": "Validation failed", "errors": { "email": "A user with this email already exists" } } }
```

### Create Form

```jsx
<FormRenderer
  api_endpoint="/api/users/"
  onResponse={(response) => console.log("Success:", response)}
  onError={(error) => console.error("Failed:", error)}
/>
// GET  /api/users/?action=initialize_form
// POST /api/users/?form_type=create_form
```

### Edit Form

```jsx
<FormRenderer
  api_endpoint="/api/users/"
  getParams={{
    action: "initialize_form",
    form_type: "edit_form",
    object_uuid: "abc-123-def-456",
  }}
  postParams={{
    form_type: "edit_form",
    object_uuid: "abc-123-def-456",
  }}
  onResponse={(response) => console.log("Updated:", response)}
/>
// GET  /api/users/?action=initialize_form&form_type=edit_form&object_uuid=abc-123-def-456
// POST /api/users/?form_type=edit_form&object_uuid=abc-123-def-456
```

### With Confirm Alert

```jsx
<FormRenderer
  api_endpoint="/api/users/"
  showConfirmAlert={true}
  customConfirmAlert={({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Confirm Submission</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to save?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Confirm</button>
        </div>
      </div>
    </div>
  )}
/>
```

---

## Local RJSF Mode

Define schema client-side. No server calls for schema loading.

```jsx
const userFormSchema = {
  schema: {
    type: "object",
    required: ["name", "email"],
    properties: {
      name: { type: "string", title: "Full Name", minLength: 2 },
      email: { type: "string", title: "Email Address", format: "email" },
      department: {
        type: "string",
        title: "Department",
        enum: ["Engineering", "Design", "Marketing", "Sales", "Support"],
      },
      bio: { type: "string", title: "Bio", maxLength: 500 },
      active: { type: "boolean", title: "Active Employee", default: true },
    },
  },
  uiSchema: {
    name: { "ui:placeholder": "Enter full name", "ui:autofocus": true },
    email: { "ui:placeholder": "user@company.com" },
    department: { "ui:placeholder": "Select department" },
    bio: {
      "ui:widget": "textarea",
      "ui:placeholder": "Tell us about yourself...",
      "ui:options": { rows: 4 },
    },
    active: { "ui:widget": "checkbox" },
    "ui:order": ["name", "email", "department", "bio", "active"],
  },
  formData: { active: true },
};

function CreateUserForm() {
  return (
    <FormRenderer
      rjsf_schema={userFormSchema}
      onSubmit={async (formData) => {
        const response = await fetch("/api/users/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        return response.json();
      }}
      onResponse={(result) => console.log("Created:", result)}
      onError={(error) => console.error("Failed:", error)}
    />
  );
}
```

---

## Multi-Step Forms

Multi-step forms are driven entirely by the server response shape. The `json_schema` properties are keyed by step (`step_1`, `step_2`, etc.), and `is_multistep: true` signals wizard mode.

### Server Response

```json
{
  "success": true,
  "response": {
    "is_multistep": true,
    "form": {
      "json_schema": {
        "type": "object",
        "properties": {
          "step_1": {
            "type": "object",
            "title": "Personal Information",
            "required": ["first_name", "last_name"],
            "properties": {
              "first_name": { "type": "string", "title": "First Name" },
              "last_name": { "type": "string", "title": "Last Name" }
            }
          },
          "step_2": {
            "type": "object",
            "title": "Company Details",
            "required": ["company_name"],
            "properties": {
              "company_name": { "type": "string", "title": "Company Name" },
              "role": { "type": "string", "title": "Role", "enum": ["Admin", "Manager", "Employee"] }
            }
          }
        }
      },
      "ui_schema": {
        "step_1": {
          "first_name": { "ui:placeholder": "Enter first name", "ui:autofocus": true },
          "last_name": { "ui:placeholder": "Enter last name" }
        },
        "step_2": {
          "company_name": { "ui:placeholder": "Enter company name" },
          "role": { "ui:placeholder": "Select your role" }
        }
      },
      "form_data": {}
    }
  }
}
```

### Usage

```jsx
// Same component -- wizard UI is driven by the response shape
<FormRenderer
  api_endpoint="/api/onboarding/"
  onResponse={(response) => console.log("Onboarding complete:", response)}
  onError={(error) => console.error("Onboarding failed:", error)}
/>
```

---

## Form Sync

When a field has `"ui:options": { "syncOnChange": true }`, changing that field triggers a POST to `?form_action=sync_form` with the current form data. The server returns an updated schema (e.g., with filtered dropdown options).

### UI Schema

```json
{
  "country": {
    "ui:placeholder": "Select country",
    "ui:options": { "syncOnChange": true }
  },
  "state": {
    "ui:placeholder": "Select state",
    "ui:options": { "syncOnChange": true }
  },
  "city": { "ui:placeholder": "Select city" }
}
```

### Sync Request/Response

```
POST /api/address/?form_action=sync_form
Body: { "country": "India", "state": "", "city": "" }

Response: Full updated form schema with state options filtered for India.
```

---

## Autocomplete

Fields with `"ui:widget": "autocomplete"` trigger a debounced search to the server.

### Schema

```json
{
  "vendor": {
    "ui:widget": "autocomplete",
    "ui:placeholder": "Search vendors..."
  }
}
```

### Request/Response

```
POST /api/purchase-orders/?form_action=fetch_autocomplete_options
Body: { "field_name": "vendor", "search_query": "Acm" }

Response:
{
  "success": true,
  "response": {
    "options": [
      { "label": "Acme Corp", "value": "acme-uuid-001" },
      { "label": "Acme Industries", "value": "acme-uuid-002" }
    ]
  }
}
```

---

## Submit Button Portal

Use `submitButtonContainerId` to render the submit button outside the form (e.g., in a dialog footer).

```jsx
import { FormRenderer } from "@zango-core/crud/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

function UserFormDialog({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <FormRenderer
          api_endpoint="/api/users/"
          submitButtonContainerId="user-form-footer"
          onResponse={() => onClose()}
        />

        <DialogFooter>
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button>
          <div id="user-form-footer" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Integration with CrudHandler

```jsx
import { useState } from "react";
import { CrudHandler } from "@zango-core/crud/table";
import { FormRenderer } from "@zango-core/crud/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

function UserManagement() {
  const [formDialog, setFormDialog] = useState({ open: false, mode: null, uuid: null });

  const openCreateForm = () => setFormDialog({ open: true, mode: "create", uuid: null });
  const openEditForm = (uuid) => setFormDialog({ open: true, mode: "edit", uuid });
  const closeForm = () => setFormDialog({ open: false, mode: null, uuid: null });

  return (
    <div>
      <CrudHandler
        api_endpoint="/api/users/"
        headerProps={{
          title: "User Management",
          customRightActions: (
            <button onClick={openCreateForm} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Add User
            </button>
          ),
        }}
      />

      <Dialog open={formDialog.open} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formDialog.mode === "edit" ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>

          {formDialog.open && (
            <FormRenderer
              api_endpoint="/api/users/"
              getParams={{
                action: "initialize_form",
                ...(formDialog.mode === "edit" && {
                  form_type: "edit_form",
                  object_uuid: formDialog.uuid,
                }),
              }}
              postParams={{
                form_type: formDialog.mode === "edit" ? "edit_form" : "create_form",
                ...(formDialog.uuid && { object_uuid: formDialog.uuid }),
              }}
              submitButtonContainerId="user-form-footer"
              onResponse={() => closeForm()}
              onError={(error) => console.error("Form error:", error)}
            />
          )}

          <DialogFooter>
            <button onClick={closeForm} className="px-4 py-2 border rounded-lg">Cancel</button>
            <div id="user-form-footer" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## Choosing Between Modes

| Feature | Server-Driven | Local RJSF |
|---------|---------------|-------------|
| Schema source | Backend API | Client-side object |
| Submission | Automatic POST | Custom `onSubmit` handler |
| Multi-step | Supported via `is_multistep` | Manual implementation |
| Form sync | Supported via `syncOnChange` | Not available |
| Autocomplete | Supported via `"ui:widget": "autocomplete"` | Not available |
| Best for | Standard CRUD forms, admin panels | Custom forms, wizards, client-only validation |
