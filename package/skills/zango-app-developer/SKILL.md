---
name: zango-app-developer
description: Use this skill when the user wants to bootstrap a Zango development environment (Docker-based setup), create a Zango app, add modules to a Zango app, implement backend or frontend features on a Zango project, or work with Zango models, views, forms, tables, workflows, policies, async tasks, React components, CrudHandler, FormRenderer, or ZangoApp. Triggers on mentions of "Zango", "zango app", "zango project", "zango environment", "zango setup", "DynamicModelBase", "BaseCrudView", "CrudHandler", "FormRenderer", "ZangoApp", "React component", "frontend", "zango module", "CRUD view", "create CRUD", "add CRUD", "workflow", "create workflow", "add workflow", "status transitions", "custom page", "routes", "menu", "navbar", "theme" or requests to build business applications using the Zango framework.
---

# Zango App Developer

You are skilled in developing apps using Zango framework. Zango is an open-source multi-tenant Django meta-framework for building custom business applications with built-in multi-tenancy, role-based access control, and a React-based frontend framework.


## Capability 1: Bootstrap Zango Environment

Use when user wants to set up a new Zango development environment.

### Prerequisites
Verify Docker is installed:
```bash
docker --version
docker compose version
```

### Steps

1. **Gather configuration** - Ask user to customize defaults or use:
   - Workspace name: `zango-<random-4-chars>` (e.g., `zango-a1b2`)
   - Platform admin: `platform_admin@zango.dev` / `Zango@123`
   - Project name: `zango_project`
   - PostgreSQL: `zango_admin` / `zangopass` / `zango`

2. **Create files** - See [bootstrap-templates.md](references/bootstrap-templates.md) for exact content:
   - `deploy/.env`
   - `deploy/docker_compose.yml`
   - `deploy/Dockerfile`
   - `deploy/init.sh`

3. **Start services:**
   ```bash
   chmod +x deploy/init.sh
   export HOST_UID=$(id -u) HOST_GID=$(id -g)
   docker compose -f deploy/docker_compose.yml up -d --build
   ```

4. **Wait for health** - Poll `http://localhost:8000/platform` until HTTP 200

5. **Share access info:**
   - URL: `http://localhost:8000/platform`
   - Credentials from `.env` file

### Post-Bootstrap: Create App

Use App Panel API (Capability 3) to automate:
1. Authenticate via API
2. Create app via `POST /api/v1/apps/` - poll `task_id` until `deployed == true`
3. Configure domain via `PUT /api/v1/apps/<uuid>/`
4. Add domain to `/etc/hosts`: `127.0.0.1 <domain>`
5. **Install packages in ORDER**: appbuilder → crud → workflow
   - **CRITICAL:** Fetch latest versions BEFORE each install (workflow version changes after crud install)
   - See [app-panel-api.md](references/app-panel-api.md)

---

## Capability 2: Develop Zango Apps

Use when user wants to implement features on a Zango project — either **adding to an existing app** or **building a new app from scratch** (after bootstrap).

### STEP 1: Discover Context

**Determine use case first:**

**A) Changes to existing app** — explore the project before doing anything:
- **Search only within the current working directory** — never scan parent directories or the entire filesystem
- Look for `deploy/docker_compose.yml` or `manage.py` in the current directory
- Find workspaces: `deploy/<PROJECT_NAME>/workspaces/` or `workspaces/`
- Read `settings.json` and `manifest.json`
- Read existing modules, models, views — understand current patterns before adding anything

**B) New app from scratch** — no existing code to explore; proceed directly to planning:
- App was just created via Capability 1 (bootstrap) or App Panel API
- Workspace is empty — skip discovery, go straight to STEP 3

### STEP 2: Verify Packages

Check required packages are installed:
- **For CRUD**: Verify `crud` and `appbuilder` in `manifest.json` and `packages/crud/` exists
- **For Workflow**: Verify `workflow` in `manifest.json` and `packages/workflow/` exists
- **If missing**: Instruct user to install via App Panel or API

### STEP 3: Create Roles (If Needed)

Two default roles exist — understand what they are before creating any others:
- **AnonymousUsers** — unauthenticated users; use this role only for fully public views
- **SystemUsers** — an internal system role; **cannot be used in policies**, do not assign it to any view

If the app requires additional roles (e.g., Admin, Manager, Staff):
1. Create via API — see [app-panel-api.md](references/app-panel-api.md) "Create roles"
2. **Update AllowFromAnywhere policy** (policy ID: 1) to include all roles:
   - Fetch ALL role IDs — see [app-panel-api.md](references/app-panel-api.md) "List Roles"
   - Use `-F "roles=X"` for EACH role ID
   - See [app-panel-api.md](references/app-panel-api.md) "Update Policy (assign roles)" for exact curl command

> Roles must exist before writing `policies.json`, since policies reference role names.

### STEP 4: Plan Implementation

#### Understand the Requirement (MANDATORY)

Before any planning or implementation, deeply understand what is being built. Ask clarifying questions when in doubt — never assume. Prepare a thorough implementation plan covering all of the following:

- **User Roles** — list all roles and their responsibilities
- **Database Tables** — models, fields, and relationships
- **Permissions & Feature Access** — which role can do what on which entity
- **Menu per Role** — navigation structure for each role
- **Backend View Pattern** — for each entity or operation, decide:
  - **CRUD package** (`BaseCrudView`): use for standard list/create/edit/delete on a single model
  - **Raw API view** (Django class-based view): use when the operation involves custom logic, multiple models, multi-step flows, or doesn't map cleanly to CRUD actions. Ask the user if the right pattern isn't obvious from the requirement.
- **Workflow & Status Transitions** — for any entity that has a lifecycle (e.g., Order: Draft → Confirmed → Shipped, Patient Case: Open → In Progress → Closed), plan workflow transitions instead of a plain status field. Ask: *"Does [Entity] have status changes that follow specific rules or require actions at each step?"* If yes, use the workflow package — never a manual status field on the model. Plan: statuses, allowed transitions per role, and any actions triggered on transition.
- **Asynchronous Tasks** — any background processing, scheduled jobs, or long-running operations
- **Frontend Pages** — for each entity, plan before writing any code: Refer to **UX Design Decisions** below.

#### UX Design Decisions (MANDATORY — do this for every entity before choosing a page type)

**Never default to the simplest page type without reasoning.** For each entity in the plan, work through these questions and raise them with the user before finalising the frontend approach:

**1. Is this a primary/central entity?**
Primary entities are the core subjects of the app — Patient, Employee, Customer, Order, Case, etc. A plain list + default detail drawer is almost never the right UX for these.
→ Ask: *"For [Entity], would you like a profile-style detail view with structured sections instead of the default drawer?"*

**2. Does this entity have related child entities?**
Look at the models — if an entity has one-to-many relationships (e.g., Patient → Appointments, Prescriptions, Lab Results), a unified view is almost always better UX than separate list pages.
→ Ask: *"[Entity] has related [ChildEntities]. Would you like a unified view that shows the [Entity] detail alongside these in tabs or sections?"*

**3. Does the list need a non-standard layout?**
Some entities are better visualised outside a standard table — kanban (statuses/stages), calendar (date-based), card/grid (visual content), timeline (sequential steps).
→ Ask: *"For [Entity] list, would a standard table work or would a different layout suit better?"*
`CrudHandler` supports this via `customTableBody` — no need for a fully custom component.

**4. Choose page type based on the above:**

| Scenario | Page Type | Implementation |
|----------|-----------|----------------|
| Simple lookup/reference entity (Department, City, Category) — no rich detail needed | Default CRUD | `page_type: "crud"` — no React component needed |
| Primary entity, profile/detail view, child tables in detail, custom columns/actions, OR custom list layout (kanban, calendar, cards) | Custom CRUD | `page_type: "custom"`, use `CrudHandler` — supports custom list via `customTableBody`, profile-style detail, and child tables inside detail |
| UI has no list/detail pattern at all — dashboards, multi-step wizards, reporting screens | Fully custom | `page_type: "custom"`, hand-written React component |

> **Key insight:** `CrudHandler` covers almost every use case — custom tables, kanban/calendar via `customTableBody`, profile detail views, and child entity tables. Reach for a fully custom component only when there is genuinely no list/detail structure.

Based on what you need to build, identify the relevant references to read before coding:

| What you need to build | References to read |
|------------------------|--------------------|
| Module | [core/modules.md](references/core/modules.md) |
| Model | [core/models.md](references/core/models.md) |
| CRUD view (list/create/edit/delete) | [core/modules.md](references/core/modules.md), [core/models.md](references/core/models.md), [packages/crud/views.md](references/packages/crud/views.md), [packages/crud/forms.md](references/packages/crud/forms.md), [packages/crud/tables.md](references/packages/crud/tables.md) |
| Workflow | [packages/workflow/overview.md](references/packages/workflow/overview.md) + other files in `packages/workflow/` |
| Policies | [core/policies.md](references/core/policies.md) |
| Async task | [core/async-tasks.md](references/core/async-tasks.md) |
| Frontend app setup | [frontend/appbuilder/index.md](references/frontend/appbuilder/index.md) |
| App module (serve React build) | [templates/app-module/README.md](references/templates/app-module/README.md) |
| Custom frontend page / table / form | [frontend/crud/index.md](references/frontend/crud/index.md), [frontend/form/index.md](references/frontend/form/index.md) |
| Routes and menus | [packages/appbuilder/api-configuration.md](references/packages/appbuilder/api-configuration.md) |
| Secrets / encrypted fields | [core/secrets.md](references/core/secrets.md) |

### STEP 4: Implement

Read the relevant reference docs identified in STEP 3 **before writing any code**. Use exact patterns, attributes, and examples from those docs — don't improvise Zango-specific APIs.

#### Dependency Chain

Always implement in this order:
```
Module → Models → Forms/Tables → Views → Policies → Sync → Frontend Setup → App Module → Build & Deploy
```

#### Implementation Rules

- Create modules in `backend/` folder, register in `settings.json`
- Create `policies.json` in EACH module containing views (only include views from that module)
- **Always add trailing slash in URL patterns** in `urls.py` (e.g., `path('patients/', ...)`)
- **Migrations**: Use `python manage.py ws_makemigration <app_name>` and `python manage.py ws_migrate <app_name>` — run from the `zango_project` directory, NOT standard Django commands
- **Non-CRUD views**: All HTTP method handlers (`get`, `post`, `put`, `delete`) must always include `*args` and `**kwargs` — e.g., `def get(self, request, *args, **kwargs):`

#### Import Rules (CRITICAL)

Always use relative imports — never absolute. Count dots based on file depth from the app root:

- **Flat module** (`backend/patients/forms.py`):
  ```python
  from .models import Patient                          # Same module
  from ..doctors.models import Doctor                  # Sibling module
  from ...packages.crud.forms import BaseForm         # Packages (3 dots to app root)
  ```
- **Nested module** (`backend/masters/geography/models.py`):
  ```python
  from .utils import helper                            # Same directory
  from ..products.models import Product                # Parent sibling
  from ...patients.models import Patient               # Backend level
  from ....packages.crud.forms import BaseForm        # Packages (4 dots to app root)
  ```

Rule: count levels up to app root, then add one more dot to reach `packages/`. See [modules.md](references/core/modules.md) for detailed examples.

### STEP 5: Post-Implementation

#### After Backend Changes

1. **Run migrations** (if models changed):
   ```bash
   docker compose -f deploy/docker_compose.yml exec app bash -c \
     "cd <PROJECT_NAME> && python manage.py ws_makemigration <app_name> && python manage.py ws_migrate <app_name>"
   ```

2. **Sync policies and tasks** (if policies.json or tasks.py created or modified):
   ```bash
   docker compose -f deploy/docker_compose.yml exec app bash -c \
     "cd <PROJECT_NAME> && zango update-apps --app_name <app_name>"
   ```

3. **Restart Celery** (if tasks.py created or modified):
   ```bash
   docker compose -f deploy/docker_compose.yml restart celery
   ```

#### Frontend Setup (One-time — do this once after backend, before writing any frontend code)

4. **Set up frontend app** (skip if `<workspace>/frontend/` already exists):
   - Create React app: `npx @zango-core/create-zango-app frontend` inside the workspace directory
   - Configure `.env` with `VITE_PROXY_ROUTES` for all backend routes — **never add `/app`** (that's a frontend route, not a backend proxy)
   - See [frontend/appbuilder/index.md](references/frontend/appbuilder/index.md)

5. **Create app module** (skip if `backend/app/` already exists):
   - See [templates/app-module/README.md](references/templates/app-module/README.md)

#### After Frontend Changes

6. **Configure AppBuilder routes and menus via API** (MANDATORY — do this for every new page, both CRUD and custom):
   - **CRUD page**: `page_type: "crud"`, include `extra_params: { "api_endpoint": "/your/crud/endpoint/" }`
   - **Custom page**: `page_type: "custom"`, `component` must exactly match the export name in `pages/index.js`
   - Add menu items for all relevant roles so pages appear in navigation
   - See [packages/appbuilder/api-configuration.md](references/packages/appbuilder/api-configuration.md)

#### Deploy to Zango Platform (only when user asks to build/deploy)

7. **Build and deploy frontend** (run **once** after all frontend work is complete — do NOT re-run after every frontend change):
   ```bash
   cd <workspace>/frontend && npm run build:zango
   ```
   Then copy output to `static/js/` and sync static files (see app module README).
   > During development, the frontend runs on the dev server (`npm run dev`) — no build needed.

### STEP 6: Verify

- Check logs: `docker compose -f deploy/docker_compose.yml logs app`
- Access configured routes (e.g., `http://yourdomain.com/app/patients`)
- Verify in App Panel: Code → Policies

### STEP 7: Create Test Users

After development complete:
1. Create test users for each role via API
2. Share app details with user in structured format (URL, credentials table)

---

## Capability 3: App Panel API Automation

Use for programmatic App Panel operations (create apps, domains, roles, users, packages).

**Full reference:** [app-panel-api.md](references/app-panel-api.md)

**Key operations:**
- Authenticate: `GET /auth/login/` → `POST /auth/login/`
- Create app: `POST /api/v1/apps/` → poll `task_id`
- Configure domain: `PUT /api/v1/apps/<uuid>/`
- Install packages: `POST /api/v1/apps/<uuid>/packages/`
- Create roles: `POST /api/v1/apps/<uuid>/roles/`
- Create users: `POST /api/v1/apps/<uuid>/users/`

---

## Capability 4: Frontend Reference

Use when working on the React frontend. For full-stack feature work, use Capability 2 (which covers frontend as part of the full flow). This capability is a focused reference for frontend-only tasks.

### References

| Task | Reference |
|------|-----------|
| App setup, routes, menus, theme, auth, navbar | [frontend/appbuilder/index.md](references/frontend/appbuilder/index.md) |
| CrudHandler, tables, detail views, hooks | [frontend/crud/index.md](references/frontend/crud/index.md) |
| FormRenderer (server-driven and local RJSF) | [frontend/form/index.md](references/frontend/form/index.md) |
| WorkflowStatus, WorkflowTags | [frontend/workflow/index.md](references/frontend/workflow/index.md) |
| Implement a common frontend pattern | — (see Common Flows below) |
| App module (serve React build from backend) | [templates/app-module/README.md](references/templates/app-module/README.md) |

### Critical Rules

1. **Imports**: `@zango-core/crud/table` for CrudHandler/WorkflowStatus/WorkflowTags, `@zango-core/crud/form` for FormRenderer — never `@zango-core/crud`
2. **Server API fields**: snake_case — `json_schema`, `ui_schema`, `form_data`, `status_label`, `next_transitions`, `tag_details`, `display_name`, `tag_label`
3. **Local RJSF fields**: camelCase — `schema`, `uiSchema`, `formData`
4. **StatusCol data**: `{ status_label: "Active", status_color: "#12B76A" }`
5. **Row actions**: `type: "form"` opens a drawer form, `type: "simple"` shows a confirmation dialog
6. **Custom page export**: name in `pages/index.js` MUST exactly match the `component` field in the AppBuilder route config
7. **Proxy routes**: include ALL backend routes in `VITE_PROXY_ROUTES` in `.env` — never add `/app` (that's a frontend route)
8. **Backend form response format**: `{ response: { form: { json_schema, ui_schema, form_data } } }`
9. **Flows first**: Before scaffolding, check Common Flows for a matching recipe. Use the exact combo shown.

### Scaffolding Patterns

#### Custom Page
```jsx
// src/custom/pages/{{PageName}}.jsx
const {{PageName}} = () => <div style={{ padding: 32 }}><h1>{{Title}}</h1></div>;
export default {{PageName}};
```
`src/custom/pages/index.js`: `export { default as {{PageName}} } from './{{PageName}}';`

#### CrudHandler (default CRUD page inside a custom component)
```jsx
import { CrudHandler } from '@zango-core/crud/table';
<CrudHandler api_endpoint="{{endpoint}}" headerProps={{ title: "{{Title}}" }} />
```

#### CrudHandler with custom detail drawer
```jsx
import { CrudHandler } from '@zango-core/crud/table';

const Detail = ({ selectedRow, data, workflowDetails, open, onClose }) => {
  if (!open) return null;
  return (
    <div>
      <h2>{data?.title}</h2>
      {Object.entries(data?.general_details?.fields || {}).map(([k, f]) => (
        <div key={k}>{f.display_name}: {f.value}</div>
      ))}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

<CrudHandler api_endpoint="{{endpoint}}" customDrawerDetail={Detail} />
```

#### CrudHandler with full-page detail view (navigate on row click)
```jsx
import { useNavigate } from 'react-router-dom';
import { CrudHandler, TableBody } from '@zango-core/crud/table';

// customTableBody must be a component ref, not JSX element
const NavigateTableBody = () => <TableBody defaultDetailView="navigate" />;

// Props are camelCase: generalDetails (not general_details), objectUuid, workflowDetails
const Detail = ({ data, generalDetails, objectUuid }) => {
  const navigate = useNavigate();
  if (!data) return null;
  return (
    <div>
      <button onClick={() => navigate(-1)}>← Back</button>
      <h1>{data.title}</h1>
      {Object.entries(generalDetails?.fields || {}).map(([k, f]) => (
        <div key={k}>{f.display_name}: {f.value}</div>
      ))}
    </div>
  );
};

<CrudHandler
  api_endpoint="{{endpoint}}"
  enableDetailViewRoute={true}
  customMainDetail={Detail}
  customTableBody={NavigateTableBody}
/>
```

#### FormRenderer - Server-driven
```jsx
import { FormRenderer } from '@zango-core/crud/form';
<FormRenderer api_endpoint="{{endpoint}}" onResponse={(r) => {}} onError={(e) => {}} />
```

#### FormRenderer - Local RJSF
```jsx
import { FormRenderer } from '@zango-core/crud/form';
<FormRenderer
  rjsf_schema={{ schema: {...}, uiSchema: {...}, formData: {} }}
  onSubmit={async (data) => { return { success: true }; }}
/>
```

#### WorkflowStatus / WorkflowTags (standalone)
```jsx
import { WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';
<WorkflowStatus apiUrl="/api/entity/?object_uuid={{uuid}}" onStatusChange={() => refetch()} />
<WorkflowTags apiUrl="/api/entity/?object_uuid={{uuid}}" onTagChange={() => refetch()} />
```

### Common Flows

Copy-paste recipes for common implementation patterns. Check here before scaffolding.

---

#### Flow 1: Route-Based Detail View

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

#### Flow 2: Drawer-Based Detail View

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

#### Flow 3: Custom Table Body

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

#### Flow 4: Custom Stats Header

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

#### Flow 5: Server-Driven Form in Drawer

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

#### Flow 6: Custom Page with CrudHandler

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

#### Flow 7: Standalone Workflow

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

#### Flow 8: Nested CRUD in Tabs

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

#### Flow 9: Dynamic API Endpoints

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

#### Flow 10: Multi-Tab Detail View

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

#### Flow 11: Status-Dependent Form Action

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

#### Flow 12: PDF Export with Filters

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

#### Flow 13: Modal-Within-CRUD

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

## Critical Rules

- **Models**: Always use `DynamicModelBase` (never `models.Model`), never add `class Meta:`, always use `ZForeignKey` (never `models.ForeignKey`), never use `ManyToManyField` (create an intermediary model instead)
- **Imports**: Always relative, never absolute (see Import Rules in STEP 4)
- **Migrations**: Always use `ws_makemigration` / `ws_migrate`, never standard Django commands
- **CRUD views**: Always include `add_btn_title`; always use a non-empty URL path
- **Modules**: Always create in `backend/`, always register in `settings.json`
- **Policies**: Always create `policies.json` in each module that has views; always sync after changes
- **Packages**: Always install in order: appbuilder → crud → workflow
- **Workflow**: Never create manual status fields on models — use the workflow package
- **Debugging**: Check logs first: `docker compose -f deploy/docker_compose.yml logs app`
