---
name: zango-frontend
description: "TRIGGER when: user mentions crud, CRUD, CrudHandler, table, detail view, custom component, form, FormRenderer, workflow, WorkflowStatus, WorkflowTags, useTable, hooks, page, route, navbar, topbar, auth, theme, @zango-core, zango-core/crud, zango-core/form, zango-core/crm-framework, or any Zango frontend task — creating pages, tables, forms, detail views, workflows, configuring routes/menu/auth/theme/navbar. Also trigger when files import from @zango-core/* or package.json contains @zango-core dependencies. NOT for App Panel browser operations — use app-panel skill for that."
license: MIT
compatibility: Designed for Claude Code. Requires a Zango frontend project with @zango-core/crud and @zango-core/crm-framework packages.
metadata:
  author: Healthlane Technologies
  version: "2.0"
allowed-tools: Read Write Bash(npx:*) Bash(npm:*) Bash(python:*) Bash(docker:*)
---

# Zango Frontend

Single skill for all Zango frontend development. Routes to the right action based on what the user needs.

## Step 1: Understand the Task

Determine what the user wants and read the relevant reference:

| User wants | Reference to read | Section below |
|------------|-------------------|---------------|
| Create a new app from scratch | [App Builder Index](references/appbuilder/index.md) | Launch App |
| Create a page (dashboard, CRUD, custom) | [CRUD Index](references/crud/index.md) | Scaffold Page |
| Add a data table | [CRUD Index](references/crud/index.md) | Scaffold Table |
| Add a form | [Form Index](references/form/index.md) | Scaffold Form |
| Add a detail view | [CRUD Index](references/crud/index.md) | Scaffold Detail |
| Add workflow status/tags | [Workflow Index](references/workflow/index.md) | Scaffold Workflow |
| Configure routes and menu | [App Builder Index](references/appbuilder/index.md) | Setup Routes |
| Customize sidebar/topbar | [App Builder Index](references/appbuilder/index.md) | Setup Navbar |
| Configure login/auth | [App Builder Index](references/appbuilder/index.md) | Setup Auth |
| Configure theme/colors | [App Builder Index](references/appbuilder/index.md) | Setup Theme |
| Implement a common pattern | — | Common Flows |
| General question about Zango | Read the relevant index based on topic | - |

## Critical Rules (always apply)

1. **Imports**: `@zango-core/crud/table` or `@zango-core/crud/form`. NEVER `@zango-core/crud`.
2. **Server API**: snake_case - `json_schema`, `ui_schema`, `form_data`, `status_label`, `next_transitions`, `tag_details`, `display_name`, `tag_label`
3. **Local RJSF prop**: camelCase - `schema`, `uiSchema`, `formData`
4. **StatusCol data**: `{ status_label: "Active", status_color: "#12B76A" }`
5. **Row actions**: `type: "form"` opens drawer, `type: "simple"` shows confirmation
6. **Custom page exports**: Name in `pages/index.js` MUST match route's `component` field exactly
7. **Flows first**: Before scaffolding, check Common Flows for a matching recipe. Use the exact combo shown.

---

## Launch App

When user wants to create a new project:

```bash
npx @zango-core/create-zango-app <project-name>
cd <project-name>
cp .env.example .env
```

Ask: Backend URL? Proxy routes needed?

Write `.env` with `VITE_API_BASE_URL`, `VITE_PROXY_ROUTES` (MUST include all backend routes), `VITE_APP_ENV`.

```bash
npm run dev
```

After running, offer: "Want to add a page? Configure sidebar? Set up theme?"

---

## Scaffold Page

Ask: "What type of page?"

**Standard CRUD** (no frontend code): Only needs backend route with `page_type: "crud"`. Jump to Setup Routes.

**Custom page**: Generate component + register export + backend route:

```jsx
// src/custom/pages/{{PageName}}.jsx
const {{PageName}} = () => (
  <div style={{ padding: 32 }}>
    <h1>{{Title}}</h1>
  </div>
);
export default {{PageName}};
```

Update `src/custom/pages/index.js`: `export { default as {{PageName}} } from './{{PageName}}';`

Then offer: "Add a table? Form? Workflow? Set up backend route?"

---

## Scaffold Table

Ask: Where? (new page / existing page / standard CRUD route). API endpoint? Customizations?

```jsx
import { CrudHandler } from '@zango-core/crud/table';

<CrudHandler
  api_endpoint="{{endpoint}}"
  headerProps={{ title: "{{Title}}" }}
  // customDrawerDetail={CustomDetail}     // if custom detail
  // customTableBody={CardGridBody}        // if card/kanban view
  // customHeader={StatsHeader}            // if stats header
/>
```

For custom body using hooks:
```jsx
import { CrudHandler, useTable } from '@zango-core/crud/table';
const CardBody = () => {
  const { data, isLoading, handleRowClick } = useTable();
  // render cards
};
```

---

## Scaffold Form

Ask: Server-driven or local? Where does it render?

**Server-driven:**
```jsx
import { FormRenderer } from '@zango-core/crud/form';
<FormRenderer
  api_endpoint="{{endpoint}}"
  onResponse={(r) => { /* close dialog, refresh */ }}
  onError={(e) => { /* handle error */ }}
/>
```

**Local RJSF:**
```jsx
<FormRenderer
  rjsf_schema={{ schema: {...}, uiSchema: {...}, formData: {} }}
  onSubmit={async (data) => { return { success: true }; }}
/>
```

Key props: `showConfirmAlert`, `skipAutoRefresh`, `submitButtonContainerId`, `onAddAnother`.

Backend response format: `{ response: { form: { json_schema, ui_schema, form_data } } }`

---

## Common Flows

Copy-paste recipes for common implementation patterns. Check here before scaffolding.

---

### Flow 1: Route-Based Detail View

**When:** User wants detail view as a separate page/route, not a drawer.

**Required:**
```jsx
import { CrudHandler } from '@zango-core/crud/table';
import { TableBody } from '@zango-core/crud/table';

const EntityDetail = ({ data, general_details, workflow_details, onRefresh }) => {
  return (
    <div>
      <h2>{data?.title}</h2>
      {Object.entries(general_details?.fields || {}).map(([k, f]) => (
        <div key={k}>{f.display_name}: {f.value}</div>
      ))}
    </div>
  );
};

<CrudHandler
  api_endpoint="/api/entity/"
  customMainDetail={EntityDetail}
  enableDetailViewRoute={true}
  customTableBody={() => <TableBody defaultDetailView="navigate" />}
/>
```

**Gotcha:** All three props required together. Miss any one = detail view won't work. `customMainDetail` (not `customDrawerDetail`) for route-based.

---

### Flow 2: Drawer-Based Detail View

**When:** User wants detail view as a side drawer overlay.

**Required:**
```jsx
import { CrudHandler } from '@zango-core/crud/table';

const EntityDrawer = ({ selectedRow, open, onClose }) => {
  if (!open) return null;
  return (
    <div>
      <h2>{selectedRow?.name}</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

<CrudHandler
  api_endpoint="/api/entity/"
  customDrawerDetail={({ selectedRow, open, onClose }) => (
    <EntityDrawer selectedRow={selectedRow} open={open} onClose={onClose} />
  )}
  detailDrawerSize="full"
/>
```

**Gotcha:** Props are `selectedRow`, `open`, `onClose` — not `data`/`general_details`. Different from route-based detail.

---

### Flow 3: Custom Table Body

**When:** User wants cards, kanban, or custom row click behavior instead of default table.

**Required:**
```jsx
// Variant A: Custom row click handler (open modal, navigate, etc.)
import { CrudHandler } from '@zango-core/crud/table';
import { TableBody } from '@zango-core/crud/table';
import { useNavigate } from 'react-router-dom';

const Page = () => {
  const navigate = useNavigate();
  return (
    <CrudHandler
      api_endpoint="/api/entity/"
      customTableBody={() => (
        <TableBody
          defaultDetailView={{
            action: 'custom',
            customHandler: (row) => navigate(`/app/entity/${row.original.object_uuid}`)
          }}
        />
      )}
    />
  );
};
```

```jsx
// Variant B: Fully custom body using useTable hook
import { CrudHandler, useTable } from '@zango-core/crud/table';

const CardGrid = () => {
  const { data, isLoading, handleRowClick } = useTable();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {data?.map((row) => (
        <div key={row.object_uuid} onClick={() => handleRowClick(row)}>
          {row.name}
        </div>
      ))}
    </div>
  );
};

<CrudHandler api_endpoint="/api/entity/" customTableBody={CardGrid} />
```

**Gotcha:** `row.original.object_uuid` in Variant A (row is wrapped). Direct `row.object_uuid` in Variant B (useTable gives raw data).

---

### Flow 4: Custom Stats Header

**When:** User wants stats cards or summary above the table.

**Required:**
```jsx
import { CrudHandler, useTable } from '@zango-core/crud/table';

const StatsHeader = () => {
  const tableContext = useTable();
  const stats = tableContext?.rawResponse?.stats || {};

  if (tableContext?.isLoading) return null;
  return (
    <div style={{ display: 'flex', gap: 16, padding: 16 }}>
      <div>Total: {stats.total || 0}</div>
      <div>Active: {stats.active || 0}</div>
      <div>Pending: {stats.pending || 0}</div>
    </div>
  );
};

<CrudHandler
  api_endpoint="/api/entity/"
  customHeader={StatsHeader}
/>
```

**Gotcha:** Stats come from `tableContext.rawResponse.stats` — backend must include `stats` key in response. `useTable()` only works inside CrudHandler's render tree.

---

### Flow 5: Server-Driven Form in Drawer

**When:** User wants a form that opens in a drawer/dialog, schema loaded from backend.

**Required:**
```jsx
import { FormRenderer } from '@zango-core/crud/form';

const EditDialog = ({ objectUuid, open, onClose, onSuccess }) => {
  if (!open) return null;
  return (
    <Drawer open={open} onClose={onClose}>
      <FormRenderer
        api_endpoint="/api/entity/"
        getParams={{
          action: 'initialize_form',
          action_type: 'row',
          action_key: 'edit',
          object_uuid: objectUuid,
        }}
        postParams={{
          form_type: 'row_action_form',
          action_type: 'row',
          action_key: 'edit',
          object_uuid: objectUuid,
        }}
        onResponse={(r) => { onSuccess(); onClose(); }}
        onError={(e) => console.error(e)}
      />
    </Drawer>
  );
};
```

**Gotcha:** Both `getParams` and `postParams` needed — get loads schema, post submits. Backend returns `{ response: { form: { json_schema, ui_schema, form_data } } }`.

---

### Flow 6: Custom Page with CrudHandler

**When:** User wants a custom page that includes a CRUD table alongside other UI.

**Required:**
```jsx
// src/custom/pages/DashboardPage.jsx
import { CrudHandler } from '@zango-core/crud/table';

const DashboardPage = () => (
  <div style={{ padding: 32 }}>
    <h1>Dashboard</h1>
    <div>Custom stats or UI here</div>
    <CrudHandler
      api_endpoint="/api/entity/"
      headerProps={{ title: "Recent Items" }}
    />
  </div>
);
export default DashboardPage;

// src/custom/pages/index.js — MUST add export
export { default as DashboardPage } from './DashboardPage';
```

**Gotcha:** Export name in `pages/index.js` MUST match backend route's `component` field exactly. Mismatch = blank page.

---

### Flow 7: Standalone Workflow

**When:** User wants workflow status/tags outside of CrudHandler (custom page, standalone detail).

**Required:**
```jsx
import { WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';

const EntityDetail = ({ objectUuid }) => (
  <div>
    <WorkflowStatus
      apiUrl={`/api/entity/?object_uuid=${objectUuid}`}
      onStatusChange={() => window.location.reload()}
    />
    <WorkflowTags
      apiUrl={`/api/entity/?object_uuid=${objectUuid}`}
      onTagChange={() => window.location.reload()}
    />
  </div>
);
```

**Gotcha:** `apiUrl` must include `object_uuid` param. For shared fetch, wrap both in `<DetailViewProvider apiUrl="...">` and omit individual `apiUrl` props.

---

### Flow 8: Nested CRUD in Tabs

**When:** Detail view has tabs, each tab shows a different CRUD table (e.g., Program → Teams tab, Vendors tab).

**Required:**
```jsx
import { CrudHandler, useTable } from '@zango-core/crud/table';
import { TableHeader } from '@zango-core/crud/table';

const MinimalHeader = () => {
  const tableContext = useTable();
  if (tableContext?.isLoading) return null;
  return <TableHeader showAddButton={true} />;
};

const TabCrud = ({ endpoint, DetailComponent }) => (
  <CrudHandler
    api_endpoint={endpoint}
    customHeader={MinimalHeader}
    showUtilities={true}
    enableDetailViewRoute={false}
    customDrawerDetail={DetailComponent ? ({ selectedRow, open, onClose }) => (
      <DetailComponent selectedRow={selectedRow} open={open} onClose={onClose} />
    ) : undefined}
    detailDrawerSize="full"
  />
);

// Usage in parent detail view:
const ProgramDetail = ({ programUUID }) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div>
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab label="Teams" />
        <Tab label="Vendors" />
      </Tabs>
      {activeTab === 0 && <TabCrud endpoint={`/api/team/?program_uuid=${programUUID}`} />}
      {activeTab === 1 && <TabCrud endpoint={`/api/vendor/?program_uuid=${programUUID}`} />}
    </div>
  );
};
```

**Gotcha:** Each tab's CrudHandler needs its own `api_endpoint` with parent UUID as query param. Set `enableDetailViewRoute={false}` — nested route-based details conflict with parent route.

---

### Flow 9: Dynamic API Endpoints

**When:** API endpoint depends on a runtime value (parent UUID, filter, user selection).

**Required:**
```jsx
import { CrudHandler } from '@zango-core/crud/table';

const FilteredTable = ({ parentUuid, status }) => (
  <CrudHandler
    api_endpoint={`/api/entity/?parent_uuid=${parentUuid}&status=${status}`}
  />
);
```

**Gotcha:** CrudHandler re-fetches when `api_endpoint` string changes. Use stable references — avoid building the string inline in render if parent re-renders frequently.

---

### Flow 10: Multi-Tab Detail View

**When:** User wants a full detail page with multiple tabs, each showing different content (overview, timeline, nested CRUD, documents).

**Required:**
```jsx
import { useDetailView } from '@zango-core/crud/table';
import { WorkflowStatus } from '@zango-core/crud/table';

const EntityDetail = () => {
  const uuid = window.location.pathname.split('/').pop();
  const { data, refresh, loading } = useDetailView({
    apiUrl: `/api/entity/?object_uuid=${uuid}`,
  });
  const [activeTab, setActiveTab] = useState(0);

  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h1>{data?.name}</h1>
      <WorkflowStatus
        apiUrl={`/api/entity/?object_uuid=${uuid}`}
        onStatusChange={refresh}
      />
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tab label="Overview" />
        <Tab label="Items" />
      </Tabs>
      {activeTab === 0 && <Overview data={data} />}
      {activeTab === 1 && (
        <CrudHandler
          api_endpoint={`/api/items/?entity_uuid=${uuid}`}
          enableDetailViewRoute={false}
        />
      )}
    </div>
  );
};
```

**Gotcha:** `useDetailView` is for the parent entity data. Nested CrudHandlers in tabs use their own `api_endpoint`. Extract UUID from URL pathname — not passed as prop in route-based views.

---

### Flow 11: Status-Dependent Form Action

**When:** Form schema changes based on workflow status (e.g., draft shows "edit_basic", active shows "edit").

**Required:**
```jsx
import { FormRenderer } from '@zango-core/crud/form';

const EditForm = ({ objectUuid, currentStatus, onSuccess }) => {
  const actionKey = currentStatus === 'draft' ? 'edit_basic' : 'edit';
  return (
    <FormRenderer
      api_endpoint="/api/entity/"
      getParams={{
        action: 'initialize_form',
        action_type: 'row',
        action_key: actionKey,
        object_uuid: objectUuid,
      }}
      postParams={{
        form_type: 'row_action_form',
        action_type: 'row',
        action_key: actionKey,
        object_uuid: objectUuid,
      }}
      onResponse={onSuccess}
    />
  );
};
```

**Gotcha:** `action_key` must match backend's registered form actions. Different `action_key` = different form schema from backend.

---

### Flow 12: PDF Export with Filters

**When:** User wants an export button that respects current table filters and search.

**Required:**
```jsx
import { useTable, useTableFilters } from '@zango-core/crud/table';

const ExportButton = ({ exportEndpoint }) => {
  const tableData = useTable();
  const filterData = useTableFilters();

  const handleExport = async () => {
    const params = new URLSearchParams({
      search: filterData?.debouncedSearchTerm || '',
      ...filterData?.debouncedFilterObj,
      sorting: JSON.stringify(tableData?.sorting || []),
    });
    window.open(`${exportEndpoint}?${params.toString()}`);
  };

  return <button onClick={handleExport}>Export PDF</button>;
};

// Place inside CrudHandler's customHeader or any component within CrudHandler tree
```

**Gotcha:** `useTableFilters()` only works inside CrudHandler's render tree. `debouncedSearchTerm` and `debouncedFilterObj` are debounced — they reflect what the user last committed, not in-progress typing.

---

### Flow 13: Modal-Within-CRUD

**When:** Row click opens a modal/dialog instead of a drawer or route.

**Required:**
```jsx
import { CrudHandler } from '@zango-core/crud/table';
import { TableBody } from '@zango-core/crud/table';
import { useState } from 'react';

const Page = () => {
  const [selectedUuid, setSelectedUuid] = useState(null);

  return (
    <>
      <CrudHandler
        api_endpoint="/api/entity/"
        customTableBody={() => (
          <TableBody
            defaultDetailView={{
              action: 'custom',
              customHandler: (row) => setSelectedUuid(row.original.object_uuid),
            }}
          />
        )}
      />
      {selectedUuid && (
        <div className="modal-overlay" onClick={() => setSelectedUuid(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <EntityModal uuid={selectedUuid} onClose={() => setSelectedUuid(null)} />
          </div>
        </div>
      )}
    </>
  );
};
```

**Gotcha:** Modal state lives OUTSIDE CrudHandler. `customHandler` sets state, modal renders as sibling. Don't put modal inside CrudHandler tree — it unmounts on re-render.

---

## Scaffold Detail

Ask: Drawer or route-based? What to display?

**Drawer** (receives: data, workflow_details, general_details, sections, onClose, open):
```jsx
const Detail = ({ data, general_details, workflow_details, onClose, open }) => {
  if (!open) return null;
  return (
    <div>
      <h2>{data?.title}</h2>
      {Object.entries(general_details?.fields || {}).map(([k, f]) => (
        <div key={k}>{f.display_name}: {f.value}</div>
      ))}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

<CrudHandler api_endpoint="..." customDrawerDetail={Detail} />
```

**Route-based**: `customMainDetail` instead of `customDrawerDetail` receives `onRefresh` instead of `onClose`. Add `enableDetailViewRoute={true}` and `customTableBody={() => <TableBody defaultDetailView="navigate" />}` props.

---

## Scaffold Workflow

Three patterns:

**Auto** (inside CrudHandler detail - already works, no extra code).

**Standalone:**
```jsx
import { WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';
<WorkflowStatus apiUrl="/api/entity/?object_uuid=123" onStatusChange={() => refetch()} />
<WorkflowTags apiUrl="/api/entity/?object_uuid=123" onTagChange={() => refetch()} />
```

**Shared context:**
```jsx
import { DetailViewProvider, WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';
<DetailViewProvider apiUrl="...">
  <WorkflowStatus />
  <WorkflowTags />
</DetailViewProvider>
```

Backend needs WorkflowBase class. Remind user about: `status_transitions`, `tag_transitions`, `Meta.statuses`, `Meta.on_create_status`.

---

## Setup Routes

Ask: "How do you access your backend?" (shell command / docker / app panel)

**App Panel**: Navigate to `/appbuilder/configure/`

**Shell:**
```python
from packages.appbuilder.backend.configure.models import AppRoutesModel, AppMenuModel
from zango.apps.appauth.models import UserRoleModel

# Add route
routes_obj = AppRoutesModel.objects.first()
routes = routes_obj.routes if routes_obj else []
routes.append({"name": "...", "path": "/app/...", "page_type": "crud|custom", "component": "...", "extra_params": {"api_endpoint": "..."}})
if routes_obj: routes_obj.routes = routes; routes_obj.save()
else: AppRoutesModel.objects.create(routes=routes)

# Add menu for role
role = UserRoleModel.objects.get(name="Admin")
menu_obj, _ = AppMenuModel.objects.get_or_create(role=role, defaults={"menu": []})
menu_obj.menu.append({"name": "...", "uri": "/app/...", "icon": "..."})
menu_obj.save()
```

After: Check `.env` VITE_PROXY_ROUTES, remind to restart dev server.

---

## Setup Navbar

All via `navbarConfig` prop on ZangoApp:

```jsx
<ZangoApp
  navbarConfig={{
    customLogo: <MyLogo />,
    customMenu: <CustomMenu />,        // replace entire menu
    customBottomContent: <Profile />,   // sticky bottom
    collapsible: true,                  // toggle button
  }}
  layoutConfig={{ showTopbar: false }}  // hide topbar
/>
```

Custom menu with section headers: use `useLocation()` for active state, render sections with uppercase labels.

---

## Setup Auth

Via `authConfig` prop on ZangoApp:

```jsx
<ZangoApp authConfig={{
  theme: { background: { gradient: '...' }, primaryColor: '#5048ED' },
  logo: { url: '/logo.svg', width: '120px', position: 'center' },
  card: { borderRadius: '16px', boxShadow: '...' },
  login: { title: 'Welcome', defaultTab: 'email', showRememberMe: true },
  customComponents: { LoginPage: CustomLogin },  // full override
}} />
```

---

## Setup Theme

**App Panel** (no code): Configure → Themes → Set colors → Save. No rebuild needed.

**Backend:**
```python
from packages.appbuilder.backend.configure.models import ThemesModel
ThemesModel.objects.create(colors={"primary": "#5048ED", ...}, typography={...})
```

**Tailwind v4**: Add `@theme` block in `index.css` mapping CSS variables. No `tailwind.config.js`.

---

## Post-Action Checklist (always verify)

1. Custom page created? → Check export in `pages/index.js`
2. New API endpoint? → Check `VITE_PROXY_ROUTES` in `.env`
3. Backend route needed? → Offer to set up via shell/panel
4. `.env` changed? → Remind to restart dev server
