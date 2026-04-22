# FormRenderer
Forms

Dual-mode form engine with server-driven and local RJSF schema support, multi-step forms, autocomplete, and form sync.

**Sections:** Import | Props | Server Response Format | Server-Driven Mode | Local RJSF Mode | Multi-Step Forms | Form Sync | Autocomplete | Integration with CrudHandler | Submit Button Portal | Custom Widgets | Choosing Between Modes

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `api_endpoint` | string | - | Enables server-driven mode. The endpoint used to GET the form schema and POST form submissions. When provided, rjsf_schema and onSubmit are ignored. |
| `getParams` | Record<string, any> | { action: initialize_form | Query parameters appended to the GET request when fetching the form schema in server-driven mode. Override to load edit forms or pass context. |
| `postParams` | Record<string, any> | { form_type: create_form | Query parameters appended to the POST request when submitting the form in server-driven mode. Override with form_type and object_uuid for edit flows. |
| `showConfirmAlert` | boolean | false | When true, displays a confirmation dialog before submitting the form. Uses the browser default unless customConfirmAlert is provided. |
| `customConfirmAlert` | ReactNode | Function | - | Custom confirmation UI rendered when showConfirmAlert is true. Receives { onConfirm, onCancel } props. Return a React element that calls onConfirm to proceed or onCancel to abort. |
| `rjsf_schema` | object | - | Local RJSF schema object with shape { schema, uiSchema, formData, submit_endpoint }. Enables local mode. When submit_endpoint is provided, form submission is POSTed to that URL instead of calling onSubmit. Ignored if api_endpoint is provided. |
| `onSubmit` | function | - | Client-side submit handler for local mode. Receives the validated formData as its argument. Can return a promise. Ignored if api_endpoint is provided. |
| `onResponse` | function | - | Callback invoked after a successful form submission. Receives the full server response object (server mode) or the return value of onSubmit (local mode). |
| `onError` | function | - | Callback invoked when form submission fails. Receives the error object. Use this for toast notifications or error logging. |
| `autocompleteParams` | Record<string, any> | - | Query parameters appended to autocomplete API requests in AsyncSelectFieldWidget. Only applies when using api_endpoint or rjsf_schema with submit_endpoint. |
| `customWidgets` | Record<string, React.ComponentType<any>> | - | Map of widget names to React components that override default RJSF widgets. Reference in ui_schema via ui:widget. Widgets receive all standard RJSF widget props. |
| `submitButtonContainerId` | string | - | DOM element ID where the submit button should be portaled via React.createPortal. Useful for placing the submit button outside the form, e.g., in a dialog footer. The target element must exist in the DOM when the form mounts. |
| `skipAutoRefresh` | boolean | false | When true, prevents the automatic table refresh that normally occurs after a successful form submission in CrudHandler integration. Useful when you want to handle refresh logic manually. |

## Code Examples

### import.jsx
```jsx
import { FormRenderer } from "@zango-core/crud/form";
```

### server-response.json
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
          "role": {
            "type": "string",
            "title": "Role",
            "enum": ["Admin", "Editor", "Viewer"]
          }
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

### submit-response.json
```json
// POST /api/users/?form_type=create_form
// Request body: { "name": "Jane Doe", "email": "jane@acme.com", "role": "Admin" }

// Success response:
{
  "success": true,
  "response": {
    "message": "User created successfully"
  }
}

// Validation error response:
{
  "success": false,
  "response": {
    "message": "Validation failed",
    "errors": {
      "email": "A user with this email already exists"
    }
  }
}
```

### server-basic.jsx
```jsx
import { FormRenderer } from "@zango-core/crud/form";

function CreateUserForm() {
  return (
    <FormRenderer
      api_endpoint="/api/users/"
      onResponse={(response) => {
        console.log("Form submitted successfully:", response);
      }}
      onError={(error) => {
        console.error("Form submission failed:", error);
      }}
```

### server-edit-form.jsx
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
  onResponse={(response) => {
    console.log("User updated:", response);
  }}
  onError={(error) => {
    console.error("Update failed:", error);
  }}
```

### server-confirm.jsx
```jsx
<FormRenderer
  api_endpoint="/api/users/"
  showConfirmAlert={true}
  customConfirmAlert={({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Confirm Submission</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to save these changes?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700
                       hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                       hover:bg-indigo-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )}
  onResponse={(response) => {
    console.log("Submitted with confirmation:", response);
  }}
```

### local-rjsf.jsx
```jsx
import { FormRenderer } from "@zango-core/crud/form";

const userFormSchema = {
  schema: {
    type: "object",
    required: ["name", "email"],
    properties: {
      name: {
        type: "string",
        title: "Full Name",
        minLength: 2,
      },
      email: {
        type: "string",
        title: "Email Address",
        format: "email",
      },
      department: {
        type: "string",
        title: "Department",
        enum: ["Engineering", "Design", "Marketing", "Sales", "Support"],
      },
      bio: {
        type: "string",
        title: "Bio",
        maxLength: 500,
      },
      active: {
        type: "boolean",
        title: "Active Employee",
        default: true,
      },
    },
  },
  uiSchema: {
    name: {
      "ui:placeholder": "Enter full name",
      "ui:autofocus": true,
    },
    email: {
      "ui:placeholder": "user@company.com",
    },
    department: {
      "ui:placeholder": "Select department",
    },
    bio: {
      "ui:widget": "textarea",
      "ui:placeholder": "Tell us about yourself...",
      "ui:options": { rows: 4 },
    },
    active: {
      "ui:widget": "checkbox",
    },
    "ui:order": ["name", "email", "department", "bio", "active"],
  },
  formData: {
    active: true,
  },
};

function CreateUserForm() {
  return (
    <FormRenderer
      rjsf_schema={userFormSchema}
      onSubmit={async (formData) => {
        // Handle submission client-side
        const response = await fetch("/api/users/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        return response.json();
      }}
      onResponse={(result) => {
        console.log("User created:", result);
      }}
      onError={(error) => {
        console.error("Failed to create user:", error);
      }}
```

### local-rjsf-submit-endpoint.jsx
```jsx
<FormRenderer
  rjsf_schema={{
    schema: {
      type: "object",
      required: ["name", "email"],
      properties: {
        name: { type: "string", title: "Full Name" },
        email: { type: "string", title: "Email", format: "email" },
      },
    },
    uiSchema: {
      name: { "ui:placeholder": "Enter name" },
      email: { "ui:placeholder": "user@company.com" },
      "ui:order": ["name", "email"],
    },
    formData: {},
    submit_endpoint: "/api/users/",
  }}
  postParams={{ form_type: "create_form" }}
  autocompleteParams={{ limit: 20 }}
  onResponse={(response) => {
    console.log("User created:", response);
  }}
  onError={(error) => {
    console.error("Failed:", error);
  }}
```

### multistep-response.json
```json
// GET /api/onboarding/?action=initialize_form
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
              "last_name": { "type": "string", "title": "Last Name" },
              "phone": { "type": "string", "title": "Phone Number" }
            }
          },
          "step_2": {
            "type": "object",
            "title": "Company Details",
            "required": ["company_name"],
            "properties": {
              "company_name": { "type": "string", "title": "Company Name" },
              "role": {
                "type": "string",
                "title": "Role",
                "enum": ["Admin", "Manager", "Employee"]
              }
            }
          },
          "step_3": {
            "type": "object",
            "title": "Preferences",
            "properties": {
              "notifications": {
                "type": "boolean",
                "title": "Enable Notifications",
                "default": true
              },
              "theme": {
                "type": "string",
                "title": "Theme",
                "enum": ["Light", "Dark", "System"]
              }
            }
          }
        }
      },
      "ui_schema": {
        "step_1": {
          "first_name": { "ui:placeholder": "Enter first name", "ui:autofocus": true },
          "last_name": { "ui:placeholder": "Enter last name" },
          "phone": { "ui:placeholder": "+1 (555) 000-0000" }
        },
        "step_2": {
          "company_name": { "ui:placeholder": "Enter company name" },
          "role": { "ui:placeholder": "Select your role" }
        },
        "step_3": {}
      },
      "form_data": {}
    }
  }
}
```

### multistep-usage.jsx
```jsx
// The same FormRenderer component -- the wizard UI is driven entirely
// by the server response shape.
<FormRenderer
  api_endpoint="/api/onboarding/"
  onResponse={(response) => {
    console.log("Onboarding complete:", response);
    // Navigate to dashboard, show success toast, etc.
  }}
  onError={(error) => {
    console.error("Onboarding failed:", error);
  }}
```

### sync-ui-schema.json
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
  "city": {
    "ui:placeholder": "Select city"
  }
}
```

### sync-request.json
```json
// User selects "India" in the country dropdown.
// FormRenderer automatically sends:

// POST /api/address/?form_action=sync_form
// Request body:
{
  "country": "India",
  "state": "",
  "city": ""
}

// Server returns the full updated schema with state options filtered by country:
{
  "success": true,
  "response": {
    "is_multistep": false,
    "form": {
      "json_schema": {
        "type": "object",
        "properties": {
          "country": {
            "type": "string",
            "title": "Country",
            "enum": ["India", "USA", "UK"]
          },
          "state": {
            "type": "string",
            "title": "State",
            "enum": ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu"]
          },
          "city": { "type": "string", "title": "City" }
        }
      },
      "ui_schema": {
        "country": {
          "ui:placeholder": "Select country",
          "ui:options": { "syncOnChange": true }
        },
        "state": {
          "ui:placeholder": "Select state",
          "ui:options": { "syncOnChange": true }
        },
        "city": { "ui:placeholder": "Select city" }
      },
      "form_data": {
        "country": "India",
        "state": "",
        "city": ""
      }
    }
  }
}
```

### autocomplete-schema.json
```json
{
  "json_schema": {
    "type": "object",
    "required": ["vendor"],
    "properties": {
      "vendor": {
        "type": "string",
        "title": "Vendor"
      },
      "material": {
        "type": "string",
        "title": "Material"
      }
    }
  },
  "ui_schema": {
    "vendor": {
      "ui:widget": "autocomplete",
      "ui:placeholder": "Search vendors..."
    },
    "material": {
      "ui:widget": "autocomplete",
      "ui:placeholder": "Search materials..."
    }
  },
  "form_data": {}
}
```

### autocomplete-request.json
```json
// User types "Acm" in the vendor field.
// FormRenderer sends (after debounce):

// POST /api/purchase-orders/?form_action=fetch_autocomplete_options
// Request body:
{
  "field_name": "vendor",
  "search_query": "Acm"
}

// Server response:
{
  "success": true,
  "response": {
    "options": [
      { "label": "Acme Corp", "value": "acme-uuid-001" },
      { "label": "Acme Industries", "value": "acme-uuid-002" },
      { "label": "Acmatic Solutions", "value": "acmatic-uuid-003" }
    ]
  }
}
```

### crud-integration.jsx
```jsx
import { useState } from "react";
import { CrudHandler } from "@zango-core/crud/table";
import { FormRenderer } from "@zango-core/crud/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function UserManagement() {
  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: null,     // "create" | "edit"
    uuid: null,
  });

  const openCreateForm = () => {
    setFormDialog({ open: true, mode: "create", uuid: null });
  };

  const openEditForm = (uuid) => {
    setFormDialog({ open: true, mode: "edit", uuid });
  };

  const closeForm = () => {
    setFormDialog({ open: false, mode: null, uuid: null });
  };

  return (
    <div>
      <CrudHandler
        api_endpoint="/api/users/"
        headerProps={{
          title: "User Management",
          customRightActions: (
            <button
              onClick={openCreateForm}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
            >
              Add User
            </button>
          ),
        }}
        customTableBody={({ data }) => (
          <table className="w-full">
            <tbody>
              {data?.map((row) => (
                <tr key={row.uuid} className="border-b hover:bg-gray-50">
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.email}</td>
                  <td className="p-3">
                    <button
                      onClick={() => openEditForm(row.uuid)}
                      className="text-indigo-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
```

### submit-portal.jsx
```jsx
import { FormRenderer } from "@zango-core/crud/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

function UserFormDialog({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        {/* Form body renders here, without the submit button */}
        <FormRenderer
          api_endpoint="/api/users/"
          submitButtonContainerId="user-form-footer"
          onResponse={() => onClose()}
```

### custom-widgets.jsx
```jsx
import { FormRenderer } from "@zango-core/crud/form";

function PhoneNumberWidget({ value, onChange, schema, options }) {
  return (
    <div>
      <input
        type="tel"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={options?.placeholder || schema?.placeholder || ""}
        className="w-full px-3 py-2 border rounded-lg"
```

