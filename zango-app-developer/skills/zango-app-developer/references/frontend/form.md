# Zango FormRenderer Reference

> Auto-generated from documentation pages. Regenerate with: `node scripts/generate-reference.js`

## Import
```js
import { FormRenderer } from '@zango-core/crud/form';
```

## Server Response Format (snake_case)
```json
{ "success": true, "response": { "is_multistep": false, "form": { "json_schema": { "type": "object", "properties": {} }, "ui_schema": {}, "form_data": {} } } }
```

Note: Server uses `json_schema`, `ui_schema`, `form_data`. Local `rjsf_schema` prop uses camelCase: `schema`, `uiSchema`, `formData`.

---


## FormRenderer (Forms)

**Sections:** Import | Props | Server Response Format | Server-Driven Mode | Local RJSF Mode | Multi-Step Forms | Form Sync | Autocomplete | Integration with CrudHandler | Submit Button Portal | File Preview Layout | Nested Objects | CrudHandler Add Drawer | Theming | Server Form in a Drawer

> Render forms with `FormRenderer` (or `FormHandler` for themed chrome). Do not hand-build forms from hooks: `useForm` only reads live state inside a `FormHandler` tree.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `api_endpoint` | string | - | Enables server-driven mode. The endpoint used to GET the form schema and POST form submissions. When provided, rjsf_schema and onSubmit are ignored. |
| `getParams` | object | `{ action: "initialize_form" }` | Query parameters for the schema GET. Replaces the default (not merged), so include `action: "initialize_form"` yourself. |
| `postParams` | object | `{ form_type: "create_form" }` | Query parameters for the submit POST. Replaces the default (not merged). |
| `showConfirmAlert` | boolean | false | When true, shows the package's own confirmation sheet before submit (not a browser `confirm`). Tune it with `confirmTitle`, `confirmMessage`, `confirmText`, `cancelText`. |
| `customConfirmAlert` | ReactNode \| `(onConfirm, onCancel) => ReactNode` | - | Custom confirmation UI when showConfirmAlert is true. A function receives two positional callbacks; a ReactNode is cloned with `onConfirm` / `onCancel` props. |
| `rjsf_schema` | object | - | Local RJSF schema object with shape { schema, uiSchema, formData, submit_endpoint? }. Enables local mode. Ignored if api_endpoint is provided. |
| `onSubmit` | function | - | Client-side submit handler for local mode. Receives the validated formData as its argument. Can return a promise. Ignored if api_endpoint is provided. |
| `onResponse` | function | - | Callback invoked after a successful form submission. Receives the full server response object (server mode) or the return value of onSubmit (local mode). |
| `onError` | `(error: Error) => void` | - | Error handler for form operations. Use this for toast notifications or error logging. |
| `onSubmitStart` | `() => void` | - | Fires when the submit request is sent, before any response. Show your own pending state. |
| `onSubmitError` | `(response: unknown) => void` | - | Fires when the backend rejects a submission. The form stays mounted with field and banner errors applied. |
| `onFormLoad` | `() => void` | - | Fires once the server-driven form definition has loaded. Hold your own placeholder until then. |
| `onAddAnother` | `() => void` | - | Fires when the user clicks "Add another" after a successful submit. Reset drawer titles or other UI here. |
| `autocompleteParams` | object | - | Extra query parameters appended to every AsyncSelect autocomplete request. |
| `customWidgets` | object | - | Map of widget names to React components, merged over the default widget set. Keys match `ui:widget` values (e.g. `"TextFieldWidget"`). |
| `submitButtonContainerId` | string | - | DOM element ID where the submit button is portaled. Useful for placing the submit button outside the form, e.g., in a dialog footer. |
| `skipAutoRefresh` | boolean | false | When true, prevents the automatic table refresh that normally occurs after a successful form submission in CrudHandler integration. Useful when you want to handle refresh logic manually. |
| `templates` | `Record<string, any>` | - | RJSF templates merged over the defaults. ⚠️ Declared on `FormRendererProps`, but `FormRenderer` 2.1.1 does not forward it to the engine, so it has no effect here. Pass it to `FormHandler` instead, as a module-level constant: the engine memoises templates on object identity. |
| `containerProps` | `React.HTMLAttributes<HTMLDivElement>` | - | Spread onto the root `<div>` (`id`, `aria-*`, `data-*`, `style`). A `className` is merged with `form-renderer-container`. `FormRenderer` also forwards a `ref` to that `<div>`. |
| `footerActions` | ReactNode | - | Extra actions in the default footer, left of Submit (Submit stays rightmost). Give buttons `type="button"`. |
| `footerLayout` | `"sticky" \| "inline"` | `"sticky"` | `"sticky"`: bar pinned to the bottom with a full-width submit. `"inline"`: under a hairline rule at the foot of the form, natural-width submit right. Default (non-portalled) footer only. |

### Code Examples

```jsx
import { FormRenderer } from "@zango-core/crud/form";
```

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
    />
  );
}

// GET  /api/users/?action=initialize_form      --> fetches schema
// POST /api/users/?form_type=create_form        --> submits data
```

```jsx
// Edit = a row action. There is no "edit_form" form_type: the backend picks
// the row action's form from action_type=row + action_key. action_key must
// match a row action key on the backend view ("edit" here is an app convention).
<FormRenderer
  api_endpoint="/api/users/"
  getParams={{
    action: "initialize_form",
    action_type: "row",
    action_key: "edit",
    object_uuid: "abc-123-def-456",
  }}
  postParams={{
    form_type: "row_action_form",
    action_type: "row",
    action_key: "edit",
    object_uuid: "abc-123-def-456",
  }}
  onResponse={(response) => {
    console.log("User updated:", response);
  }}
  onError={(error) => {
    console.error("Update failed:", error);
  }}
/>

// GET  /api/users/?action=initialize_form&action_type=row&action_key=edit&object_uuid=abc-123-def-456
// POST /api/users/?form_type=row_action_form&action_type=row&action_key=edit&object_uuid=abc-123-def-456
```

```jsx
<FormRenderer
  api_endpoint="/api/users/"
  showConfirmAlert={true}
  // Positional args, not a props object
  customConfirmAlert={(onConfirm, onCancel) => (
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
/>
```

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
    />
  );
}
```

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
/>
```

```json
{
  "country": {
    "ui:placeholder": "Select country",
    "ui:syncEnabled": true
  },
  "state": {
    "ui:placeholder": "Select state",
    "ui:syncEnabled": true
  },
  "city": {
    "ui:placeholder": "Select city"
  }
}
```

```json
// User selects "India" in the country dropdown.
// FormRenderer automatically sends (the POST url, minus `action`/`view`,
// plus form_action=sync_form and form_type=create_form):

// POST /api/address/?form_type=create_form&form_action=sync_form
// Request body (multipart FormData):
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
      "ui:widget": "AsyncSelectFieldWidget",
      "ui:placeholder": "Search vendors..."
    },
    "material": {
      "ui:widget": "AsyncSelectFieldWidget",
      "ui:placeholder": "Search materials..."
    }
  },
  "form_data": {}
}
```

```json
// User types "Acm" in the vendor field.
// FormRenderer sends (after debounce). The url is the POST url with its
// query string STRIPPED, plus these params and any autocompleteParams.
// The form_action spelling ("autcomplete") is what the package sends.

// POST /api/purchase-orders/?form_type=create_form&form_action=fetch_autcomplete_options&search_query=Acm&field_name=vendor
// Request body: the current form data (multipart FormData)

// The widget reads the options from `autocomplete_options`:
{
  "success": true,
  "response": {
    "autocomplete_options": [
      { "label": "Acme Corp", "value": "acme-uuid-001" },
      { "label": "Acme Industries", "value": "acme-uuid-002" },
      { "label": "Acmatic Solutions", "value": "acmatic-uuid-003" }
    ]
  }
}
```

```jsx
import { useMemo, useState } from "react";
import { CrudHandler } from "@zango-core/crud/table";
import { useCrud } from "@zango-core/crud/core";
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

  const closeForm = () => {
    setFormDialog({ open: false, mode: null, uuid: null });
  };

  /* customTableBody gets no props and must keep a stable identity, so build it
     once. It reads rows from useCrud(); setFormDialog never changes. */
  const UsersTableBody = useMemo(
    () =>
      function UsersTableBody() {
        const crud = useCrud();
        return (
          <table className="w-full">
            <tbody>
              {(crud.data ?? []).map((row) => (
                <tr key={row.object_uuid} className="border-b hover:bg-gray-50">
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.email}</td>
                  <td className="p-3">
                    <button
                      onClick={() => setFormDialog({ open: true, mode: "edit", uuid: row.object_uuid })}
                      className="text-indigo-600 text-sm hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      },
    [],
  );

  return (
    <div>
      <CrudHandler
        api_endpoint="/api/users/"
        headerProps={{
          title: "User Management",
          // Keeps the package add button (and its add-permission check);
          // onAddClick replaces the built-in drawer with this dialog.
          addButtonTitle: "Add User",
          onAddClick: openCreateForm,
        }}
        customTableBody={UsersTableBody}
      />

      {/* Add/Edit Dialog with FormRenderer */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(open) => !open && closeForm()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {formDialog.mode === "edit" ? "Edit User" : "Add User"}
            </DialogTitle>
          </DialogHeader>

          {formDialog.open && (
            <FormRenderer
              api_endpoint="/api/users/"
              getParams={{
                action: "initialize_form",
                ...(formDialog.mode === "edit" && {
                  action_type: "row",
                  action_key: "edit",
                  object_uuid: formDialog.uuid,
                }),
              }}
              postParams={
                formDialog.mode === "edit"
                  ? {
                      form_type: "row_action_form",
                      action_type: "row",
                      action_key: "edit",
                      object_uuid: formDialog.uuid,
                    }
                  : { form_type: "create_form" }
              }
              submitButtonContainerId="user-form-footer"
              onResponse={() => {
                closeForm();
                // CrudHandler auto-refreshes the table after submission
              }}
              onError={(error) => {
                console.error("Form error:", error);
              }}
            />
          )}

          <DialogFooter>
            <button
              onClick={closeForm}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            {/* Submit button is portaled here */}
            <div id="user-form-footer" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

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
        />

        <DialogFooter>
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          {/* The submit button is portaled into this container */}
          <div id="user-form-footer" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

⚠️ The submit button looks up `submitButtonContainerId` at render. If the node is missing it falls back to the default footer. The portaled button submits through `form="zango-rjsf-form"`, a fixed id, so keep only one portalled form mounted at a time.

### File Preview Layout

Set `ui:options.previewLayout: true` on a `FileFieldWidget` entry to render the form two-column: live file preview left (60%), fields right. It stacks to one column when the form is narrower than 680px.

```json
{
  "contract": {
    "ui:widget": "FileFieldWidget",
    "ui:options": { "previewLayout": true }
  }
}
```

### Nested Objects

The default `ObjectFieldTemplate` treats non-root objects differently from the root:

- Nested object fields indent 20px and get a small grey `<h3>` title (12px, `--color-gray-400`).
- Array items (ids ending `_<digits>`, e.g. `zango-form_contacts_0`) get no title.
- Only the root object gets `--form-padding` (default 20px). Nested objects add none.
- A uiSchema with `ui:sections` takes a separate sectioned layout.

### Sync Forms and File Fields

When a `ui:syncEnabled` field changes, the form POSTs to the sync url and reloads the schema. The backend cannot echo an unsaved file back, so the package keeps every picked file's data URI for fields still in the new schema. A file picked before a sync survives the reload. You do not need to work around this.

### CrudHandler Add Drawer

`CrudHandler`'s add button (`TableAddButton`) keeps its `Drawer` mounted after close so the slide-out animation plays. Its form config is not gated on `open`; the Drawer renders content only while open or exiting, so the form still loads only on open. It builds the FormRenderer as:

- `api_endpoint`: the table url's path, without the query string.
- `getParams` / `postParams`: parsed from `?action=initialize_form` / `?form_type=create_form` urls (or `formConfig.getDataUrl` / `postDataUrl`).
- `autocompleteParams`: the table url's query string.
- `CrudHandler` `formProps` are spread onto it.

Do the same in your own drawers: keep the drawer mounted with `open={false}` instead of returning `null`, or the panel cuts off mid-close.

### Theming

Fields read `--form-*` CSS variables. The field rules are scoped to both `.form-renderer-container` (FormRenderer) and `.zango-form-root` (FormHandler), so variables set on any ancestor apply.

| Variable | Controls |
|----------|----------|
| `--form-padding` | Root object padding (default `20px`) |
| `--form-field-height` | Field height |
| `--form-field-radius` | Field corner radius |
| `--form-field-bg` / `--form-field-color` | Field background / text |
| `--form-field-gap` | Gap between fields in `ui:order` rows and sections (default `16px`) |
| `--form-field-border` / `--form-field-border-hover` / `--form-field-border-focus` | Field borders |
| `--form-field-font-size` / `--form-field-placeholder` / `--form-placeholder-font-size` | Text and placeholder |
| `--form-label-color` / `--form-label-font-weight` / `--form-label-font-size` | Labels |
| `--form-disabled-bg` / `--form-disabled-color` | Disabled fields |
| `--form-select-radius` / `--form-select-option-hover-bg` / `--form-select-tag-radius` | Select widgets |

⚠️ `FormTheme.errorBorderColor` / `errorColor` set `--form-field-border-error` / `--form-error-color`, but no 2.1.1 stylesheet reads them.

Field height precedence: `--form-field-height`, then `--zango-control-height-md`, then `36px`. Set `--zango-control-height-md` to resize form fields and every Zango control together. Set `--form-field-height` to resize forms only.

`FormRenderer` has no `theme` prop. Set the variables on an ancestor or through `containerProps`. `FormHandler` also takes `theme` (a `FormTheme` object mapped to these variables) and `variant` (`"default" | "compact" | "floating" | "inline"`); `theme` wins over `variant`.

```jsx
<FormRenderer
  api_endpoint="/api/users/"
  containerProps={{ style: { "--form-field-radius": "10px", "--form-field-height": "40px" } }}
/>
```

### Server Form in a Drawer

A pattern proven in a production Zango app for create/edit drawers. Package behaviour is marked; the rest is app convention.

1. **Keep the trailing slash before the query string.** Package behaviour: `buildApiUrl` adds `/?` only when the endpoint has no `?`. With a query string it appends `&...` and leaves the path alone, so `/api/records?x=1` posts to `/api/records?x=1&...`. Django routes end in `/`, and `APPEND_SLASH` cannot redirect a POST. Normalise the path before passing it.
2. **Put each param in one place.** Package behaviour: the GET url is `api_endpoint` + `getParams`, and the POST url is `api_endpoint` + `postParams`, appended without de-duplication. A param on the endpoint and also in a param bag is sent twice. Put endpoint-scoping params (e.g. `?order_type=`) on the url only, or in the bags only.
3. **Repeat endpoint params in `autocompleteParams`.** Package behaviour: autocomplete requests strip the POST url's query string and add only their own params plus `autocompleteParams`.
4. **Remount per record.** Package behaviour: FormRenderer remounts its inner form when `api_endpoint` or the `getParams` contents change. App convention adds `key={endpoint}` so the whole renderer resets too.
5. **Portal the submit button into your footer** with `submitButtonContainerId` and a stable id (e.g. from `useId()`).
6. **Hold a placeholder with `onFormLoad`.** Package behaviour: it fires after the schema GET succeeds. Show "Loading form…" until then; do not watch the DOM with a `MutationObserver`. Reset the flag when the endpoint changes.
7. **Params per mode** (backend contract):
   - Create: `getParams={{ action: "initialize_form" }}`, `postParams={{ form_type: "create_form" }}`.
   - Edit or any row action: `getParams={{ action: "initialize_form", action_type: "row", action_key, object_uuid }}`, `postParams={{ form_type: "row_action_form", action_type: "row", action_key, object_uuid }}`. `action_key` is the row action key (app convention: default `"edit"`).

```jsx
import { useEffect, useId, useState } from "react";
import { Drawer, Button } from "@zango-core/components";
import { FormRenderer } from "@zango-core/crud/form";

const withTrailingSlash = (url) => {
  const [path, ...rest] = url.split("?");
  const query = rest.join("?");
  const slashed = path.endsWith("/") ? path : `${path}/`;
  return query ? `${slashed}?${query}` : slashed;
};

function RecordFormDrawer({ open, onClose, onSuccess, apiEndpoint, objectUuid, actionKey = "edit" }) {
  const submitId = `rec-submit-${useId().replace(/:/g, "")}`;
  const endpoint = withTrailingSlash(apiEndpoint); // endpoint params stay on the url only
  const isEdit = Boolean(objectUuid);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(false), [endpoint]);

  const getParams = isEdit
    ? { action: "initialize_form", action_type: "row", action_key: actionKey, object_uuid: objectUuid }
    : { action: "initialize_form" };
  const postParams = isEdit
    ? { form_type: "row_action_form", action_type: "row", action_key: actionKey, object_uuid: objectUuid }
    : { form_type: "create_form" };

  return (
    // Stay mounted while closed so the drawer slides out
    <Drawer open={open} onClose={onClose} position="right" size="lg" title={isEdit ? "Edit" : "Create"}>
      <div className="flex flex-col h-full min-h-0">
        <div className="relative flex-1 min-h-0 overflow-y-auto">
          {!ready && <div className="absolute inset-0 grid place-items-center">Loading form…</div>}
          <FormRenderer
            key={endpoint}
            api_endpoint={endpoint}
            getParams={getParams}
            postParams={postParams}
            submitButtonContainerId={submitId}
            onFormLoad={() => setReady(true)}
            onResponse={onSuccess}
          />
        </div>
        <div className="shrink-0 mt-auto flex justify-end gap-2 px-5 py-3 border-t">
          <Button variant="outline" size="small" onClick={onClose}>Cancel</Button>
          <div id={submitId} className="inline-flex items-center" />
        </div>
      </div>
    </Drawer>
  );
}
```

---
