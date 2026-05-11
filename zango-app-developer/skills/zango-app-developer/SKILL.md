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
   - Configure `.env` with:
     - `VITE_API_BASE_URL=http://<app-domain>:<backend-port>` using the app domain configured in platform (do not keep localhost for platform apps)
     - `VITE_USE_PROXY=true`
     - `VITE_PROXY_ROUTES` for all backend routes (core + module routes such as `/patients`, `/doctors`) — **never add `/app`** (that's a frontend route, not a backend proxy)
   - Verify the configured API base URL resolves to the same backend where your module routes are mounted before writing frontend code
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
   Then complete all of the following from the workspace root:
   ```bash
   cp -r frontend/zango-build/* static/js/
   docker compose -f deploy/docker_compose.yml exec app bash -c "cd <PROJECT_NAME> && python manage.py sync_static <app_name> && python manage.py collectstatic --noinput"
   ```
   Finally update `backend/app/templates/app.html` with the generated build filename (see app module README).
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
10. **Theme and layout safety checks (AppBuilder)**:
    - Theme from initializer is derived from active `ThemesModel` config (`color.primary` and `typography`) with backend defaults for other colors; align custom UI with this shape
    - Validate sidebar/topbar contrast against resolved CSS variables before finalizing style overrides (avoid white-on-white and low-contrast combinations)
    - Keep sidebar visibility logic compatible with `theme.menu_config.display_sidebar` and layout config

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

Copy-paste recipes for common implementation patterns. Check [Common-Flows.md](references/frontend/Common-Flows.md) before scaffolding.

14 flows: Route-Based Detail, Drawer Detail, Custom Table Body, Custom Stats Header, Server-Driven Form, Custom Page with CrudHandler, Standalone Workflow, Nested CRUD in Tabs, Dynamic API Endpoints, Multi-Tab Detail, Status-Dependent Form, PDF Export with Filters, Modal-Within-CRUD, App Branding & Theming.

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
