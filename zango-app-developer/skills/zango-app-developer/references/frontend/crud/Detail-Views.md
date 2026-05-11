# Detail Views
Views

Drawer and route-based detail views with automatic data fetching.

**Sections:** Overview | Automatic Data Fetching | Data Props Provided | Drawer Detail View | Main Detail View (Route-based) | StandaloneDetailView | DetailViewProvider | DetailWrapper | DrawerDetailWrapper | TableDrawer | Detail Hooks

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | object | - | Complete detail response from the API, containing all fields and nested data for the record. |
| `api_endpoint` | string | - | The API endpoint used to fetch the detail data. |
| `loading` | boolean | - | Whether the detail data is currently being fetched. |
| `error` | string \| null | - | Error message if the data fetch failed, or null if successful. |
| `onRefresh` | function | - | Callback to re-fetch the detail data. Useful after performing mutations like status transitions or edits. |
| `objectUuid` | string | - | The unique object UUID of the current record. |
| `pk` | string \| number | - | The primary key of the current record. |
| `title` | string | - | The display title for the detail view, derived from the record data. |
| `general_details` | object | - | General details section. fields is an object keyed by field_name; each entry is { display_name, value } only. |
| `workflow_details` | object | - | Workflow data including current_status (string), current_status_meta ({ status_label, status_color }), next_transitions (array of { name, display_name, is_form_based, confirmation_message, description, from, to }), and tag_details (array of { name, state, enable, disable, is_enable_allowed, is_disable_allowed }). |
| `sections` | array | - | Array of section objects, each with key, name, title, data (object), optional extra_html, and optional form ({ is_multistep, form: { json_schema, ui_schema } }). |
| `row_actions` | array | - | Array of available row-level actions for the current record. |
| `configurations` | object | - | Additional configuration metadata for the detail view. |
| `apiUrl` | string | - | Full API URL already containing object_uuid, action, and view query params. Use for standalone pages. |
| `objectUuid` | string | - | Object UUID only. The component builds the full URL from baseApiUrl + objectUuid. |
| `baseApiUrl` | string | /api/crud | Base API URL used when objectUuid is provided. |
| `onClose` | () => void | - | Close handler forwarded to the detail component (used in drawer contexts). |
| `customComponent` | React.ComponentType | - | Custom component rendered instead of the default Detail. Receives all context data plus any extra props passed to StandaloneDetailView. |
| `apiUrl` | string | - | Full API URL containing object_uuid. Takes priority over objectUuid + baseApiUrl. |
| `objectUuid` | string | - | Object UUID. Combined with baseApiUrl to build the fetch URL when apiUrl is not provided. |
| `baseApiUrl` | string | /api/crud | Base API URL used to build the fetch URL. |
| `children` | React.ReactNode | - | Child components that will have access to the detail view context. |
| `apiUrl` | string | - | Base API URL. The component appends object_uuid from route params plus action and view query params. |
| `customComponent` | React.ComponentType | - | Custom detail component to render. Receives data, loading, error, workflowDetails, generalDetails, sections, rowActions, objectUuid, pk, onRefresh, and apiUrl as props. |
| `objectUuid` | string | - | UUID of the record to display. |
| `open` | boolean | - | Whether the drawer is visible. Renders null when false. |
| `onClose` | () => void | - | Callback to close the drawer. |
| `apiUrl` | string | - | Base API URL forwarded to StandaloneDetailView as baseApiUrl. |
| `selectedRow` | object | - | The full row data object. Forwarded to the custom component. |
| `customComponent` | React.ComponentType | - | Custom component to render inside the drawer instead of the default Detail. |
| `open` | boolean | - | Whether the drawer is visible. |
| `onClose` | () => void | - | Callback invoked when the drawer requests to be closed. |
| `selectedRow` | Row<any> \| null | - | The currently selected TanStack table row. Used to derive the default title when no title prop is provided. |
| `position` | right \| left \| bottom \| top | right | Side of the screen the drawer slides in from. |
| `size` | sm \| md \| lg \| xl \| full | lg | Width (for left/right) or height (for top/bottom) of the drawer (500px for left/right when lg). |
| `title` | React.ReactNode | - | Custom drawer title. Falls back to UIStore drawerTitle then to an auto-generated title from row data (name, title, email, id, object_uuid, pk). |
| `children` | React.ReactNode | - | Drawer content. When omitted the drawer renders a default key/value list from selectedRow.original. |
| `className` | string | - | Additional CSS classes merged onto the drawer container. |
| `apiUrl` | string | - | API URL available for the default content slot. Has no effect when children are provided. |
| `showNavigation` | boolean | - | Show next/previous row navigation arrows inside the drawer header. |
| `onNavigateNext` | () => void | - | Handler called when the user clicks the next-row arrow. |
| `onNavigatePrevious` | () => void | - | Handler called when the user clicks the previous-row arrow. |
| `canNavigateNext` | boolean | - | Whether a next row is available; disables the next arrow when false. |
| `canNavigatePrevious` | boolean | - | Whether a previous row is available; disables the previous arrow when false. |
| `useDetailView({ apiUrl })` | Hook | - | Fetches detail data for a specific record. Returns: data, loading, error, refresh, objectUuid, workflowDetails, rowActions. |
| `useDetailViewContext()` | Hook | - | Reads from the nearest DetailViewProvider context. Same return shape as useDetailView but from shared context. |

## Code Examples

### detail-view-response.json
```json
{
  "success": true,
  "response": {
    "object_uuid": "uuid-001",
    "pk": 1,
    "title": "Alice Johnson",
    "general_details": {
      "fields": {
        "name":       { "display_name": "Name",       "value": "Alice Johnson" },
        "email":      { "display_name": "Email",      "value": "alice@example.com" },
        "department": { "display_name": "Department", "value": "Engineering" }
      }
    },
    "workflow_details": {
      "current_status": "active",
      "current_status_meta": {
        "status_label": "Active",
        "status_color": "#22c55e"
      },
      "next_transitions": [
        {
          "name": "deactivate",
          "display_name": "Deactivate",
          "is_form_based": false,
          "confirmation_message": "Are you sure you want to deactivate this record?",
          "from": "active",
          "to": "inactive"
        },
        {
          "name": "suspend",
          "display_name": "Suspend",
          "is_form_based": true,
          "description": "Temporarily suspend this record",
          "from": "active",
          "to": "suspended"
        }
      ],
      "tag_details": [
        {
          "name": "priority",
          "state": "enabled",
          "enable":  { "is_form_based": false, "confirmation_message": "Enable priority tag?" },
          "disable": { "is_form_based": false, "confirmation_message": "Disable priority tag?" },
          "is_enable_allowed": true,
          "is_disable_allowed": true
        },
        {
          "name": "verified",
          "state": "disabled",
          "enable":  { "is_form_based": false, "confirmation_message": "Mark as verified?" },
          "disable": { "is_form_based": false },
          "is_enable_allowed": true,
          "is_disable_allowed": false
        }
      ]
    },
    "row_actions": [
      { "name": "Edit",   "key": "edit",   "icon": "edit",  "type": "form" },
      { "name": "Delete", "key": "delete", "icon": "trash", "type": "simple" }
    ],
    "sections": [
      {
        "key": "personal_info",
        "name": "personal_info",
        "title": "Personal Information",
        "data": { "name": "Alice Johnson", "email": "alice@example.com", "age": 28 }
      }
    ]
  }
}
```

### CustomDrawerDetail.jsx
```jsx
import React from 'react';

const CustomDrawerDetail = ({
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
        <h2 className="text-lg font-semibold">{data.title || 'Detail View'}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* General Details — fields is an object keyed by field_name */}
        {general_details?.fields && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              General Information
            </h3>
            <div className="space-y-2">
              {Object.entries(general_details.fields).map(([key, field]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="text-sm text-gray-500">{field.display_name}</span>
                  <span className="text-sm font-medium">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workflow Status */}
        {workflow_details && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Workflow
            </h3>
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: workflow_details.current_status_meta?.status_color || '#eff6ff',
                color: '#1d4ed8',
              }}
            >
              {workflow_details.current_status_meta?.status_label || workflow_details.current_status || 'N/A'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDrawerDetail;
```

### usage-drawer.jsx
```jsx
import CustomDrawerDetail from './CustomDrawerDetail';

<CrudHandler
  api_endpoint="/api/users"
  customDrawerDetail={CustomDrawerDetail}
/>
```

### CustomMainDetail.jsx
```jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomMainDetail = ({
  data,
  workflow_details,
  general_details,
  sections,
  onRefresh,
}) => {
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        &larr; Back to list
      </button>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">
        {data.title || 'Record Detail'}
      </h1>

      {/* General Details — fields is an object keyed by field_name */}
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
    </div>
  );
};

export default CustomMainDetail;
```

### usage-main-detail.jsx
```jsx
import CustomMainDetail from './CustomMainDetail';

<CrudHandler
  api_endpoint="/api/users"
  customMainDetail={CustomMainDetail}
  customTableBody={
    <TableBody defaultDetailView="navigate" />
  }
/>
```

### standalone-detail.jsx
```jsx
import { StandaloneDetailView } from "@zango-core/crud/table";

// Option 1: full URL
<StandaloneDetailView
  apiUrl="/api/users/?object_uuid=uuid-001&action=fetch_item_details&view=detail"
/>
```

### detail-view-provider.jsx
```jsx
import { DetailViewProvider, WorkflowStatus, WorkflowTags } from "@zango-core/crud/table";

// Wrap components for shared context
<DetailViewProvider
  objectUuid="uuid-001"
  baseApiUrl="/api/users/"
>
  <WorkflowStatus />
  <WorkflowTags />
</DetailViewProvider>
```

### detail-wrapper-usage.jsx
```jsx
import { DetailWrapper } from "@zango-core/crud/table";

// Used internally by CrudHandler — direct usage only needed in advanced setups
<DetailWrapper
  apiUrl="/api/users/"
  customComponent={MyDetailPage}
/>
```

### drawer-detail-wrapper-usage.jsx
```jsx
import { DrawerDetailWrapper } from "@zango-core/crud/table";

// Used internally by CrudHandler — direct usage only needed in advanced setups
<DrawerDetailWrapper
  objectUuid={selectedRow?.object_uuid}
  open={drawerOpen}
  onClose={() => setDrawerOpen(false)}
  apiUrl="/api/users/"
  selectedRow={selectedRow}
  customComponent={MyDrawerDetail}
/>
```

### table-drawer-usage.jsx
```jsx
import { TableDrawer } from "@zango-core/crud/table";
import { useTableRowActions } from "@zango-core/crud/table";

const MyTable = () => {
  const { selectedRow, drawerOpen, closeDrawer, navigateNext, navigatePrevious, canNavigateNext, canNavigatePrevious } = useTableRowActions();

  return (
    <>
      {/* … your table … */}

      {/* Right drawer (default) */}
      <TableDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        selectedRow={selectedRow}
      >
        <MyDetailPanel row={selectedRow?.original} />
      </TableDrawer>
    </>
  );
};
```

### detail-hooks.jsx
```jsx
import { useDetailView, useDetailViewContext } from "@zango-core/crud/table";

// Standalone - fetches its own data
const { data, loading, workflowDetails } = useDetailView({
  apiUrl: "/api/users/?object_uuid=123"
});

// Context-based - reads from DetailViewProvider
const { data, refreshDetail } = useDetailViewContext();
```
