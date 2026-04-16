import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const FormRendererDocs = () => {
  return (
    <DocPage
      title="FormRenderer"
      subtitle="Dual-mode form engine with server-driven and local RJSF schema support, multi-step forms, autocomplete, and form sync."
      badge="Forms"
    >
      {/* ── 1. Import ── */}
      <Section title="Import">
        <CodeBlock
          language="jsx"
          title="import.jsx"
          code={`import { FormRenderer } from "@zango-core/crud/form";`}
        />
        <p className="mb-2">
          <InlineCode>FormRenderer</InlineCode> is a named export from the{' '}
          <InlineCode>@zango-core/crud/form</InlineCode> package. It wraps{' '}
          <strong>react-jsonschema-form (RJSF)</strong> and adds server integration,
          multi-step wizard support, form sync, and autocomplete capabilities on top.
        </p>
      </Section>

      {/* ── 2. Props ── */}
      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'api_endpoint',
              type: 'string',
              description:
                'Enables server-driven mode. The endpoint used to GET the form schema and POST form submissions. When provided, rjsf_schema and onSubmit are ignored.',
            },
            {
              name: 'getParams',
              type: 'Record<string, any>',
              default: "{ action: 'initialize_form' }",
              description:
                'Query parameters appended to the GET request when fetching the form schema in server-driven mode. Override to load edit forms or pass context.',
            },
            {
              name: 'postParams',
              type: 'Record<string, any>',
              default: "{ form_type: 'create_form' }",
              description:
                'Query parameters appended to the POST request when submitting the form in server-driven mode. Override with form_type and object_uuid for edit flows.',
            },
            {
              name: 'showConfirmAlert',
              type: 'boolean',
              default: 'false',
              description:
                'When true, displays a confirmation dialog before submitting the form. Uses the browser default unless customConfirmAlert is provided.',
            },
            {
              name: 'customConfirmAlert',
              type: 'ReactNode | Function',
              description:
                'Custom confirmation UI rendered when showConfirmAlert is true. Receives { onConfirm, onCancel } props. Return a React element that calls onConfirm to proceed or onCancel to abort.',
            },
            {
              name: 'rjsf_schema',
              type: 'object',
              description:
                'Local RJSF schema object with shape { schema, uiSchema, formData, submit_endpoint }. Enables local mode. When submit_endpoint is provided, form submission is POSTed to that URL instead of calling onSubmit. Ignored if api_endpoint is provided.',
            },
            {
              name: 'onSubmit',
              type: 'function',
              description:
                'Client-side submit handler for local mode. Receives the validated formData as its argument. Can return a promise. Ignored if api_endpoint is provided.',
            },
            {
              name: 'onResponse',
              type: 'function',
              description:
                'Callback invoked after a successful form submission. Receives the full server response object (server mode) or the return value of onSubmit (local mode).',
            },
            {
              name: 'onError',
              type: 'function',
              description:
                'Callback invoked when form submission fails. Receives the error object. Use this for toast notifications or error logging.',
            },
            {
              name: 'autocompleteParams',
              type: 'Record<string, any>',
              description:
                'Query parameters appended to autocomplete API requests in AsyncSelectFieldWidget. Only applies when using api_endpoint or rjsf_schema with submit_endpoint.',
            },
            {
              name: 'customWidgets',
              type: 'Record<string, React.ComponentType<any>>',
              description:
                'Map of widget names to React components that override default RJSF widgets. Reference in ui_schema via ui:widget. Widgets receive all standard RJSF widget props.',
            },
            {
              name: 'submitButtonContainerId',
              type: 'string',
              description:
                'DOM element ID where the submit button should be portaled via React.createPortal. Useful for placing the submit button outside the form, e.g., in a dialog footer. The target element must exist in the DOM when the form mounts.',
            },
            {
              name: 'skipAutoRefresh',
              type: 'boolean',
              default: 'false',
              description:
                'When true, prevents the automatic table refresh that normally occurs after a successful form submission in CrudHandler integration. Useful when you want to handle refresh logic manually.',
            },
          ]}
        />
        <Callout type="important" title="Mode Priority">
          If <InlineCode>api_endpoint</InlineCode> is provided, the component operates in
          server-driven mode and the <InlineCode>rjsf_schema</InlineCode> and{' '}
          <InlineCode>onSubmit</InlineCode> props are ignored. Remove{' '}
          <InlineCode>api_endpoint</InlineCode> to use local RJSF mode.
        </Callout>
      </Section>

      {/* ── 3. Server Response Format ── */}
      <Section title="Server Response Format">
        <p className="mb-4">
          When using server-driven mode, the GET request to{' '}
          <InlineCode>api_endpoint</InlineCode> must return a response in the following
          exact shape. <InlineCode>FormRenderer</InlineCode> parses this structure
          internally and maps the snake_case field names to their RJSF-compatible
          camelCase equivalents.
        </p>
        <CodeBlock
          language="json"
          title="server-response.json"
          code={`// GET /api/users/?action=initialize_form
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
}`}
        />
        <Callout type="important" title="snake_case vs camelCase">
          The server API response uses <InlineCode>json_schema</InlineCode>,{' '}
          <InlineCode>ui_schema</InlineCode>, and <InlineCode>form_data</InlineCode>{' '}
          (snake_case). The local <InlineCode>rjsf_schema</InlineCode> prop uses{' '}
          <InlineCode>schema</InlineCode>, <InlineCode>uiSchema</InlineCode>, and{' '}
          <InlineCode>formData</InlineCode> (camelCase). FormRenderer handles the mapping
          internally when in server-driven mode.
        </Callout>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">
          POST Submission Response
        </h3>
        <p className="mb-3">
          After the user submits the form, <InlineCode>FormRenderer</InlineCode> sends
          the form data as a POST request. On success, the server should return:
        </p>
        <CodeBlock
          language="json"
          title="submit-response.json"
          code={`// POST /api/users/?form_type=create_form
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
}`}
        />
      </Section>

      {/* ── 4. Server-Driven Mode ── */}
      <Section title="Server-Driven Mode">
        <p className="mb-4">
          In server-driven mode, <InlineCode>FormRenderer</InlineCode> performs a two-step
          request cycle:
        </p>
        <ol style={{ paddingLeft: '20px', listStyleType: 'decimal', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>GET</strong> -- Fetches the RJSF schema from the API using{' '}
            <InlineCode>getParams</InlineCode> as query parameters. The form renders a
            loading state until the schema arrives.
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>POST</strong> -- After the user fills in the form and passes client-side
            validation, the validated form data is submitted back to the same API endpoint
            using <InlineCode>postParams</InlineCode> as query parameters. The form data
            is sent in the request body as JSON.
          </li>
        </ol>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Basic Server-Driven Form</h3>
        <p className="mb-3">
          The simplest usage only requires <InlineCode>api_endpoint</InlineCode>. The
          defaults for <InlineCode>getParams</InlineCode> and{' '}
          <InlineCode>postParams</InlineCode> handle the standard create-form flow.
        </p>
        <CodeBlock
          language="jsx"
          title="server-basic.jsx"
          code={`import { FormRenderer } from "@zango-core/crud/form";

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
// POST /api/users/?form_type=create_form        --> submits data`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">
          With Custom Query Parameters (Edit Form)
        </h3>
        <p className="mb-3">
          Override <InlineCode>getParams</InlineCode> and{' '}
          <InlineCode>postParams</InlineCode> to load an edit form with pre-populated
          data. The server uses the <InlineCode>object_uuid</InlineCode> to look up the
          existing record and populate <InlineCode>form_data</InlineCode> in the response.
        </p>
        <CodeBlock
          language="jsx"
          title="server-edit-form.jsx"
          code={`<FormRenderer
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
/>

// GET  /api/users/?action=initialize_form&form_type=edit_form&object_uuid=abc-123-def-456
// POST /api/users/?form_type=edit_form&object_uuid=abc-123-def-456`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">
          With Custom Confirmation Dialog
        </h3>
        <p className="mb-3">
          Enable <InlineCode>showConfirmAlert</InlineCode> and provide a{' '}
          <InlineCode>customConfirmAlert</InlineCode> component to intercept form
          submission with a branded confirmation UI. The component receives{' '}
          <InlineCode>onConfirm</InlineCode> and <InlineCode>onCancel</InlineCode>{' '}
          callbacks.
        </p>
        <CodeBlock
          language="jsx"
          title="server-confirm.jsx"
          code={`<FormRenderer
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
/>`}
        />
        <Callout type="info" title="Default Confirm Behavior">
          When <InlineCode>showConfirmAlert</InlineCode> is true but{' '}
          <InlineCode>customConfirmAlert</InlineCode> is not provided, the component falls
          back to the browser's native <InlineCode>window.confirm()</InlineCode> dialog.
        </Callout>
      </Section>

      {/* ── 5. Local RJSF Mode ── */}
      <Section title="Local RJSF Mode">
        <p className="mb-4">
          In local mode, you provide the RJSF schema directly via the{' '}
          <InlineCode>rjsf_schema</InlineCode> prop and handle form submission on the
          client side with <InlineCode>onSubmit</InlineCode>. No server calls are made for
          schema fetching. This is ideal for static forms, offline scenarios, or rapid
          prototyping.
        </p>
        <p className="mb-4">
          The <InlineCode>rjsf_schema</InlineCode> object accepts these keys:
        </p>
        <ul style={{ paddingLeft: '20px', listStyleType: 'disc', marginBottom: '16px' }}>
          <li style={{ marginBottom: '6px' }}>
            <InlineCode>schema</InlineCode> -- The JSON Schema defining field types,
            validation, enums, and structure.
          </li>
          <li style={{ marginBottom: '6px' }}>
            <InlineCode>uiSchema</InlineCode> -- UI hints like placeholders, widgets,
            ordering, and display options.
          </li>
          <li style={{ marginBottom: '6px' }}>
            <InlineCode>formData</InlineCode> -- Initial/default values for the form
            fields.
          </li>
          <li style={{ marginBottom: '6px' }}>
            <InlineCode>submit_endpoint</InlineCode> -- API URL for server-side
            submission. When provided, the form POSTs to this URL with{' '}
            <InlineCode>postParams</InlineCode> as query parameters instead of calling
            onSubmit. Also enables form sync and autocomplete against this endpoint.
          </li>
        </ul>
        <CodeBlock
          language="jsx"
          title="local-rjsf.jsx"
          code={`import { FormRenderer } from "@zango-core/crud/form";

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
}`}
        />
        <Callout type="tip" title="onSubmit Return Value">
          The return value of <InlineCode>onSubmit</InlineCode> is passed to{' '}
          <InlineCode>onResponse</InlineCode>. If <InlineCode>onSubmit</InlineCode>{' '}
          returns a promise, FormRenderer awaits it and passes the resolved value.
          If the promise rejects, <InlineCode>onError</InlineCode> is called instead.
        </Callout>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">
          Local RJSF Mode with submit_endpoint
        </h3>
        <p className="mb-3">
          Provide <InlineCode>submit_endpoint</InlineCode> inside{' '}
          <InlineCode>rjsf_schema</InlineCode> to POST form data to a server URL
          instead of using a client-side <InlineCode>onSubmit</InlineCode> handler.
          This also enables form sync and autocomplete against that endpoint.
        </p>
        <CodeBlock
          language="jsx"
          title="local-rjsf-submit-endpoint.jsx"
          code={`<FormRenderer
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
/>

// POST /api/users/?form_type=create_form  --> submits form data`}
        />
      </Section>

      {/* ── 6. Multi-Step Forms ── */}
      <Section title="Multi-Step Forms">
        <p className="mb-4">
          When the server response sets <InlineCode>is_multistep: true</InlineCode>, the{' '}
          <InlineCode>FormRenderer</InlineCode> automatically renders the form as a wizard
          with step navigation. Each step is a top-level property in the{' '}
          <InlineCode>json_schema</InlineCode>, and the component handles step
          progression, back navigation, and per-step validation internally.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Multi-Step Server Response
        </h3>
        <p className="mb-3">
          Each step is defined as a nested object property (e.g.,{' '}
          <InlineCode>step_1</InlineCode>, <InlineCode>step_2</InlineCode>). The{' '}
          <InlineCode>title</InlineCode> of each step object is used as the step label in
          the wizard navigation bar.
        </p>
        <CodeBlock
          language="json"
          title="multistep-response.json"
          code={`// GET /api/onboarding/?action=initialize_form
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
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">Usage</h3>
        <p className="mb-3">
          No special client-side props are needed. The component detects the{' '}
          <InlineCode>is_multistep</InlineCode> flag from the server response and renders
          step navigation automatically. The final step triggers the POST submission.
        </p>
        <CodeBlock
          language="jsx"
          title="multistep-usage.jsx"
          code={`// The same FormRenderer component -- the wizard UI is driven entirely
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
/>`}
        />
        <Callout type="info" title="Wizard Behavior">
          The wizard validates each step before allowing navigation to the next step. The
          user cannot skip ahead to a later step without completing the current one. Users
          can navigate back to previous steps without losing entered data. The final
          step's "Submit" button triggers the POST to the server with the complete form
          data from all steps.
        </Callout>
      </Section>

      {/* ── 7. Form Sync ── */}
      <Section title="Form Sync">
        <p className="mb-4">
          Form sync enables live server-side schema updates via{' '}
          <InlineCode>form_action=sync_form</InlineCode>. When a field value changes, it
          triggers a sync request to the server, which returns an updated schema with
          modified field options, visibility, or validation rules. This powers dependent
          dropdowns, conditional fields, and dynamic form behavior.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">How It Works</h3>
        <ol style={{ paddingLeft: '20px', listStyleType: 'decimal', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}>
            A field in the <InlineCode>ui_schema</InlineCode> is configured with{' '}
            <InlineCode>"ui:options": {'{ "syncOnChange": true }'}</InlineCode>.
          </li>
          <li style={{ marginBottom: '8px' }}>
            When that field's value changes, <InlineCode>FormRenderer</InlineCode> sends a
            POST to the same <InlineCode>api_endpoint</InlineCode> with{' '}
            <InlineCode>form_action=sync_form</InlineCode> and the current form data in
            the request body.
          </li>
          <li style={{ marginBottom: '8px' }}>
            The server processes the current form state and returns an updated full schema
            response (with new enum options, modified required fields, new properties,
            etc.).
          </li>
          <li style={{ marginBottom: '8px' }}>
            <InlineCode>FormRenderer</InlineCode> re-renders the form with the updated
            schema while preserving the user's entered data.
          </li>
        </ol>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">
          ui_schema Configuration
        </h3>
        <p className="mb-3">
          Mark any field with <InlineCode>syncOnChange: true</InlineCode> to trigger a
          sync request when its value changes. In this example, selecting a country
          triggers a sync that populates the state dropdown, and selecting a state triggers
          another sync that populates the city dropdown.
        </p>
        <CodeBlock
          language="json"
          title="sync-ui-schema.json"
          code={`{
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
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">
          Sync Request / Response Flow
        </h3>
        <CodeBlock
          language="json"
          title="sync-request.json"
          code={`// User selects "India" in the country dropdown.
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
}`}
        />
        <Callout type="tip" title="Performance">
          Form sync requests are debounced internally to avoid excessive network calls
          during rapid value changes. The server must return the <strong>complete</strong>{' '}
          form schema on each sync request, not just the changed fields, because
          FormRenderer replaces the entire schema on each sync response.
        </Callout>
        <Callout type="warning" title="Avoid Circular Syncs">
          Be careful not to create circular sync dependencies where field A syncs and
          updates field B, which syncs and updates field A again. The server should only
          modify fields that are downstream of the changed field.
        </Callout>
      </Section>

      {/* ── 8. Autocomplete ── */}
      <Section title="Autocomplete">
        <p className="mb-4">
          Fields can fetch options dynamically from the server as the user types using{' '}
          <InlineCode>form_action=fetch_autocomplete_options</InlineCode>. This is
          configured entirely in the <InlineCode>ui_schema</InlineCode> returned by the
          server and works automatically with no extra client-side props.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">How It Works</h3>
        <ol style={{ paddingLeft: '20px', listStyleType: 'decimal', marginBottom: '16px' }}>
          <li style={{ marginBottom: '8px' }}>
            The server marks a field in the <InlineCode>ui_schema</InlineCode> with{' '}
            <InlineCode>"ui:widget": "autocomplete"</InlineCode>.
          </li>
          <li style={{ marginBottom: '8px' }}>
            When the user types in that field, <InlineCode>FormRenderer</InlineCode> sends
            a POST to the <InlineCode>api_endpoint</InlineCode> with{' '}
            <InlineCode>form_action=fetch_autocomplete_options</InlineCode>, the field
            name, and the search query in the request body.
          </li>
          <li style={{ marginBottom: '8px' }}>
            The server returns matching options as an array of{' '}
            <InlineCode>{'{ label, value }'}</InlineCode> objects.
          </li>
          <li style={{ marginBottom: '8px' }}>
            The options are displayed as a dropdown for the user to select from. The
            selected option's <InlineCode>value</InlineCode> is stored in the form data.
          </li>
        </ol>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">
          Server Schema for Autocomplete Fields
        </h3>
        <CodeBlock
          language="json"
          title="autocomplete-schema.json"
          code={`{
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
}`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-8">
          Autocomplete Request / Response
        </h3>
        <CodeBlock
          language="json"
          title="autocomplete-request.json"
          code={`// User types "Acm" in the vendor field.
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
}`}
        />
        <Callout type="info" title="Debounced Requests">
          Autocomplete requests are debounced so that a network call is not made on every
          keystroke. The search fires after the user pauses typing. A loading indicator is
          displayed while the request is in flight. An empty search query returns no
          options.
        </Callout>
        <Callout type="tip" title="Combining Autocomplete with Form Sync">
          Autocomplete and form sync can be used together. For example, selecting a vendor
          via autocomplete can trigger a <InlineCode>syncOnChange</InlineCode> that
          populates downstream fields (like address or payment terms) based on the
          selected vendor.
        </Callout>
      </Section>

      {/* ── 9. Integration with CrudHandler ── */}
      <Section title="Integration with CrudHandler">
        <p className="mb-4">
          <InlineCode>FormRenderer</InlineCode> works seamlessly with{' '}
          <InlineCode>CrudHandler</InlineCode> for add/edit dialogs. The typical pattern
          uses local state to control a dialog's visibility and passes the appropriate{' '}
          <InlineCode>getParams</InlineCode> / <InlineCode>postParams</InlineCode> based
          on whether the user is creating a new record or editing an existing one.
        </p>
        <CodeBlock
          language="jsx"
          title="crud-integration.jsx"
          code={`import { useState } from "react";
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
                  form_type: "edit_form",
                  object_uuid: formDialog.uuid,
                }),
              }}
              postParams={{
                form_type:
                  formDialog.mode === "edit" ? "edit_form" : "create_form",
                ...(formDialog.uuid && { object_uuid: formDialog.uuid }),
              }}
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
}`}
        />
        <Callout type="info" title="Auto-Refresh">
          After a successful form submission in server-driven mode,{' '}
          <InlineCode>CrudHandler</InlineCode> automatically refreshes the table data.
          Set <InlineCode>skipAutoRefresh=true</InlineCode> on{' '}
          <InlineCode>FormRenderer</InlineCode> to disable this behavior and handle
          refreshing manually.
        </Callout>
      </Section>

      {/* ── 10. Submit Button Portal ── */}
      <Section title="Submit Button Portal">
        <p className="mb-4">
          By default, the submit button renders at the bottom of the form. Use{' '}
          <InlineCode>submitButtonContainerId</InlineCode> to portal the submit button
          into an external DOM container via{' '}
          <InlineCode>React.createPortal</InlineCode>. This is especially useful when the
          form is inside a dialog and you want the submit button in the dialog footer
          alongside a cancel button.
        </p>
        <CodeBlock
          language="jsx"
          title="submit-portal.jsx"
          code={`import { FormRenderer } from "@zango-core/crud/form";
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
}`}
        />
        <Callout type="tip" title="How It Works">
          <InlineCode>FormRenderer</InlineCode> uses{' '}
          <InlineCode>React.createPortal</InlineCode> to render the submit button into
          the DOM element matching the provided ID. The target element must be present in
          the DOM when the form mounts. The button retains full access to the form's
          validation and submit logic despite being rendered outside the{' '}
          <InlineCode>{'<form>'}</InlineCode> element.
        </Callout>
        <Callout type="warning" title="Unique IDs">
          Ensure the <InlineCode>submitButtonContainerId</InlineCode> is unique in the
          DOM. If multiple forms are rendered simultaneously (e.g., in stacked dialogs),
          each must have a distinct portal target ID.
        </Callout>
      </Section>

      {/* ── 11. Custom Widgets ── */}
      <Section title="Custom Widgets">
        <p className="mb-4">
          Override default RJSF widgets by passing a <InlineCode>customWidgets</InlineCode>{' '}
          map. Each key is the widget name you reference in{' '}
          <InlineCode>uiSchema</InlineCode> via <InlineCode>"ui:widget"</InlineCode>, and
          each value is a React component receiving standard RJSF widget props (
          <InlineCode>value</InlineCode>, <InlineCode>onChange</InlineCode>,{' '}
          <InlineCode>schema</InlineCode>, <InlineCode>options</InlineCode>, etc.).
        </p>
        <CodeBlock
          language="jsx"
          title="custom-widgets.jsx"
          code={`import { FormRenderer } from "@zango-core/crud/form";

function PhoneNumberWidget({ value, onChange, schema, options }) {
  return (
    <div>
      <input
        type="tel"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={options?.placeholder || schema?.placeholder || ""}
        className="w-full px-3 py-2 border rounded-lg"
      />
      <p className="text-xs text-gray-400 mt-1">Enter with country code</p>
    </div>
  );
}

const myWidgets = {
  PhoneNumberWidget,
};

const formSchema = {
  schema: {
    type: "object",
    properties: {
      phone: { type: "string", title: "Phone Number" },
      name: { type: "string", title: "Name" },
    },
  },
  uiSchema: {
    phone: { "ui:widget": "PhoneNumberWidget" },
    name: { "ui:placeholder": "Full name" },
    "ui:order": ["name", "phone"],
  },
  formData: {},
  submit_endpoint: "/api/contacts/",
};

function ContactForm() {
  return (
    <FormRenderer
      rjsf_schema={formSchema}
      customWidgets={myWidgets}
      postParams={{ form_type: "create_form" }}
      onResponse={(res) => console.log("Saved:", res)}
    />
  );
}`}
        />
      </Section>

      {/* ── 12. Choosing Between Modes ── */}
      <Section title="Choosing Between Modes">
        <p className="mb-4">
          <InlineCode>FormRenderer</InlineCode> supports two distinct operational modes.
          Choose based on your use case:
        </p>
        <Callout type="info" title="Use api_endpoint (Server-Driven) When:">
          <ul style={{ paddingLeft: '16px', listStyleType: 'disc', margin: 0 }}>
            <li>Forms are dynamic and generated by the backend (Zango CRUD views)</li>
            <li>Form fields depend on user permissions, roles, or tenant configuration</li>
            <li>Validation rules are managed server-side</li>
            <li>You need edit forms that auto-populate with existing record data</li>
            <li>You need dependent dropdowns, autocomplete, or form sync</li>
            <li>You want multi-step wizard forms driven by the backend</li>
            <li>The backend already exposes RJSF-compatible endpoints</li>
          </ul>
        </Callout>
        <Callout type="tip" title="Use rjsf_schema (Local) When:">
          <ul style={{ paddingLeft: '16px', listStyleType: 'disc', margin: 0 }}>
            <li>Forms are static and known at build time</li>
            <li>You need forms to work offline or without a backend</li>
            <li>Rapid prototyping or building proof-of-concepts</li>
            <li>Client-side-only workflows (e.g., settings, preferences, filters)</li>
            <li>You want full control over submission logic</li>
            <li>You are embedding forms in non-CRUD contexts</li>
            <li>You need a form that does not map to a backend model</li>
          </ul>
        </Callout>
        <Callout type="warning" title="Mixing Modes">
          Do not provide both <InlineCode>api_endpoint</InlineCode> and{' '}
          <InlineCode>rjsf_schema</InlineCode> simultaneously. If both are present,{' '}
          <InlineCode>api_endpoint</InlineCode> takes precedence and the local schema is
          ignored entirely.
        </Callout>
      </Section>
    </DocPage>
  );
};

export default FormRendererDocs;
