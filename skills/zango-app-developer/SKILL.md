---
name: zango-app-developer
description: Use this skill when the user wants to bootstrap a Zango development environment (Docker-based setup), create a Zango app, add modules to a Zango app, implement backend or frontend features on a Zango project, or work with Zango models, views, forms, tables, workflows, policies, async tasks, React components, CrudHandler, FormRenderer, or ZangoApp. Triggers on mentions of "Zango", "zango app", "zango project", "zango environment", "zango setup", "DynamicModelBase", "BaseCrudView", "CrudHandler", "FormRenderer", "ZangoApp", "React component", "frontend", "zango module", "CRUD view", "create CRUD", "add CRUD", "workflow", "create workflow", "add workflow", "status transitions", "custom page", "routes", "menu", "navbar", "theme" or requests to build business applications using the Zango framework.
---

# Zango App Developer

You are an expert Zango framework developer. Zango is an open-source multi-tenant Django meta-framework for building custom business applications with built-in multi-tenancy, role-based access control, and a React-based frontend framework.

---

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
- Look for `deploy/docker_compose.yml` or `manage.py`
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

### STEP 3: Plan Implementation

Based on the requirement, determine what needs to be read:

| User wants | References to read | Action |
|------------|-------------------|--------|
| Create CRUD for entity | references/core/modules.md, references/core/models.md, references/packages/crud/*.md | Full CRUD Setup |
| Create module | references/core/modules.md | Module Creation |
| Create model | references/core/models.md | Model Creation |
| Add workflow | references/packages/workflow/*.md | Workflow Creation |
| Add/update policies | references/core/policies.md | Policy Creation |
| Add field to model | references/core/models.md | Model Update |
| Add async task | references/core/async-tasks.md | Async Task Creation |
| **Setup frontend app** | references/frontend/appbuilder.md | **Create React App** |
| **Create app module** | references/templates/app-module/README.md | **App Module Setup** |
| Build custom page | references/frontend/crud.md, references/frontend/appbuilder.md | Custom Page Creation |
| Implement table UI | references/frontend/crud.md | React Table Component |
| Implement form UI | references/frontend/form.md | React Form Component |
| Configure routes/menus | references/packages/appbuilder/api-configuration.md | Routes & Menus API |

**Planning checklist:**
- Identify which app and modules are affected
- **Identify user roles needed** (e.g., Admin, Manager, User, Viewer)
- Determine if new modules are needed
- Plan the data model (models and their relationships)
- Determine which view pattern to use (CRUD package vs raw API vs template)
- Plan permissions/policies needed per role
- Determine if workflow package is needed (statuses, transitions, role-based state changes)
- Plan AppBuilder routes and menus for each role
- **Setup frontend if not done** — Create React app with `npx @zango-core/create-zango-app frontend` in the workspace, configure `.env` with all backend routes in `VITE_PROXY_ROUTES` (see [frontend/appbuilder.md](references/frontend/appbuilder.md))
- **Create app module and deploy build** — After frontend setup, create `backend/app/` module, build frontend with `npm run build:zango`, copy to `static/js/`, sync static files, and update template (see [templates/app-module/README.md](references/templates/app-module/README.md))

### STEP 4: Read Documentation

**Before writing code, read the relevant references:**

| Component | Reference | Key Details |
|-----------|-----------|-------------|
| Modules | [core/modules.md](references/core/modules.md) | Structure, imports, registration in settings.json |
| Models | [core/models.md](references/core/models.md) | DynamicModelBase, ZForeignKey, no Meta class |
| CRUD Views | [packages/crud/views.md](references/packages/crud/views.md) | BaseCrudView attributes |
| Forms | [packages/crud/forms.md](references/packages/crud/forms.md) | BaseForm, ModelField |
| Tables | [packages/crud/tables.md](references/packages/crud/tables.md) | ModelTable, columns, actions |
| Workflows | [packages/workflow/overview.md](references/packages/workflow/overview.md) | WorkflowBase, transitions |
| Policies | [core/policies.md](references/core/policies.md) | policies.json per module |
| Async Tasks | [core/async-tasks.md](references/core/async-tasks.md) | @shared_task, sync |
| Secrets | [core/secrets.md](references/core/secrets.md) | get_app_secret, key naming, FIELD_ENCRYPTION_KEY |
| Frontend Setup | [frontend/appbuilder.md](references/frontend/appbuilder.md) | Create app, .env, proxy routes |
| App Module | [templates/app-module/README.md](references/templates/app-module/README.md) | Serve React frontend |
| Routes/Menus | [packages/appbuilder/api-configuration.md](references/packages/appbuilder/api-configuration.md) | Configure via API |

### STEP 5: Implement

**Implementation Workflow:**

1. **Read Documentation First** (MANDATORY)
   - Identify what you need to build (module? model? CRUD view? workflow?)
   - Read the corresponding reference doc(s) BEFORE writing code
   - Use exact patterns, attributes, and examples from the docs

2. **Follow Dependency Chain**
   ```
   Module → Models → Forms/Tables → Views → Policies → Sync → Frontend Setup → App Module → Build & Deploy
   ```

3. **Reference Documentation**

   | Component | Read This | Key Points |
   |-----------|-----------|------------|
   | **Modules** | [core/modules.md](references/core/modules.md) | Structure, imports, registration |
   | **Models** | [core/models.md](references/core/models.md) | DynamicModelBase, ZForeignKey, no Meta class |
   | **CRUD Views** | [packages/crud/views.md](references/packages/crud/views.md) | BaseCrudView attributes and structure |
   | **Forms** | [packages/crud/forms.md](references/packages/crud/forms.md) | BaseForm, ModelField |
   | **Tables** | [packages/crud/tables.md](references/packages/crud/tables.md) | ModelTable, columns, row_actions |
   | **Workflows** | [packages/workflow/overview.md](references/packages/workflow/overview.md) | WorkflowBase, transitions |
   | **Policies** | [core/policies.md](references/core/policies.md) | policies.json per module (only for views in that module) |
   | **Async Tasks** | [core/async-tasks.md](references/core/async-tasks.md) | @shared_task decorator, triggering, scheduling, sync and restart celery |
   | **AppBuilder** | [packages/appbuilder/api-configuration.md](references/packages/appbuilder/api-configuration.md) | Routes and menu configuration |
   | **App Module** | [templates/app-module/README.md](references/templates/app-module/README.md) | Create backend/app module, build & deploy frontend |

4. **Implementation Rules**
   - Create modules in `backend/` folder, register in `settings.json`
   - Create `policies.json` in EACH module containing views (only include views from that module)
   - **Always add trailing slash in URL patterns** in `urls.py` (e.g., `path('patients/', ...)`)
   - Use relative imports (see modules.md "Import Paths in Zango" section)
   - **Migrations**: Use `python manage.py ws_makemigration <app_name>` and `python manage.py ws_migrate <app_name>` (run from zango_project directory, NOT standard Django commands)
   - Follow exact attribute names from documentation

**Import Rules (CRITICAL):**
- **ALWAYS use relative imports** - NEVER absolute imports
- Count dots based on file depth: `. = current`, `.. = parent`, `... = grandparent`, etc.
- **For flat modules** (`backend/patients/forms.py`):
  ```python
  from .models import Patient                          # Same module
  from ..doctors.models import Doctor                  # Sibling module
  from ...packages.crud.forms import BaseForm         # Packages (3 dots to app root)
  ```
- **For nested modules** (`backend/masters/geography/models.py`):
  ```python
  from .utils import helper                            # Same directory
  from ..products.models import Product                # Parent sibling
  from ...patients.models import Patient               # Backend level
  from ....packages.crud.forms import BaseForm        # Packages (4 dots to app root)
  ```
- **Rule:** Count levels to app root, add one more dot to reach `packages/`
- See [modules.md "Import Paths in Zango"](references/core/modules.md) for detailed examples

### STEP 6: Post-Implementation

After implementing code, complete these tasks:

1. **Run migrations** (if models changed):
   ```bash
   docker compose -f deploy/docker_compose.yml exec app bash -c \
     "cd <PROJECT_NAME> && python manage.py ws_makemigration <app_name> && python manage.py ws_migrate <app_name>"
   ```
2. **Sync policies and tasks** (if policies.json or tasks.py created):
   ```bash
   docker compose -f deploy/docker_compose.yml exec app bash -c \
     "cd <PROJECT_NAME> && zango update-apps --app_name <app_name>"
   ```
3. **Restart Celery** (if tasks.py created or modified):
   ```bash
   docker compose -f deploy/docker_compose.yml restart celery
   ```
4. **Configure AppBuilder routes and menus via API** (MANDATORY for CRUD views):
   - Add the route to AppBuilder (defines the page path and API endpoint)
   - Add menu items for all relevant roles (makes page accessible in navigation)
   - **Must be done via API** - see [packages/appbuilder/api-configuration.md](references/packages/appbuilder/api-configuration.md)
5. **Setup frontend app** (if not already done):
   - Create React app named "frontend" in the workspace directory
   - Configure `.env` with `VITE_PROXY_ROUTES` including ALL backend routes — **never add `/app` as a proxy route** (it's served by the frontend itself)
   - See [frontend/appbuilder.md](references/frontend/appbuilder.md) for setup details
6. **Create app module and deploy frontend build** (MANDATORY) - See [templates/app-module/README.md](references/templates/app-module/README.md)

### STEP 7: Create Roles (If Needed)

Default roles exist: **AnonymousUsers**, **SystemUsers**

If additional roles needed:
1. Create via API - see [app-panel-api.md](references/app-panel-api.md) "Create roles"
2. **Update AllowFromAnywhere policy** (policy ID: 1):
   - Fetch ALL role IDs — see [app-panel-api.md](references/app-panel-api.md) "List Roles"
   - Use `-F "roles=X"` for EACH role ID (includes ALL roles in system)
   - See [app-panel-api.md](references/app-panel-api.md) "Update Policy (assign roles)" for exact curl command

### STEP 8: Verify

- Check logs: `docker compose -f deploy/docker_compose.yml logs app`
- Access configured routes (e.g., `http://yourdomain.com/app/patients`)
- Verify in App Panel: Code → Policies

### STEP 9: Create Test Users

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

## Capability 4: Develop Frontend

Use for React frontend with @zango-core packages.

### Determine Task

| User wants | Reference |
|------------|-----------|
| Create frontend app | [frontend/appbuilder.md](references/frontend/appbuilder.md) |
| Create page (dashboard, CRUD, custom) | [frontend/crud.md](references/frontend/crud.md) |
| Add data table | [frontend/crud.md](references/frontend/crud.md) |
| Add form (server-driven or local) | [frontend/form.md](references/frontend/form.md) |
| Add detail view (drawer or route-based) | [frontend/crud.md](references/frontend/crud.md) |
| Add workflow status/tags | [frontend/workflow.md](references/frontend/workflow.md) |
| Configure routes and menu | [frontend/appbuilder.md](references/frontend/appbuilder.md) |
| Customize sidebar/topbar/navbar | [frontend/appbuilder.md](references/frontend/appbuilder.md) |
| Configure login/auth | [frontend/appbuilder.md](references/frontend/appbuilder.md) |
| Configure theme/colors | [frontend/appbuilder.md](references/frontend/appbuilder.md) |
| Use hooks (useTable, useForm, useDetailView, useWorkflow) | [frontend/crud.md](references/frontend/crud.md) |
| Custom table body (cards, kanban) | [frontend/crud.md](references/frontend/crud.md) |
| Custom header with stats | [frontend/crud.md](references/frontend/crud.md) |

### Critical Rules

1. **Imports**: Use `@zango-core/crud/table` or `@zango-core/crud/form` (NOT `@zango-core/crud`)
2. **Server API**: snake_case (`json_schema`, `ui_schema`, `form_data`, `status_label`, `next_transitions`, `tag_details`, `display_name`, `tag_label`)
3. **Local RJSF**: camelCase (`schema`, `uiSchema`, `formData`)
4. **StatusCol data**: `{ status_label: "Active", status_color: "#12B76A" }`
5. **Row actions**: `type: "form"` opens drawer, `type: "simple"` shows confirmation
6. **Custom pages**: Export name in `pages/index.js` MUST match route's `component` field exactly
7. **Proxy routes**: MUST include ALL backend routes in `VITE_PROXY_ROUTES` in `.env` — **never add `/app`** (frontend route, not a backend proxy)
8. **Backend response format**: `{ response: { form: { json_schema, ui_schema, form_data } } }`

### Scaffolding Patterns

**Always ask clarifying questions first, then provide minimal code.**

#### Custom Page
```jsx
// src/custom/pages/{{PageName}}.jsx
const {{PageName}} = () => <div style={{ padding: 32 }}><h1>{{Title}}</h1></div>;
export default {{PageName}};
```
Update `src/custom/pages/index.js`: `export { default as {{PageName}} } from './{{PageName}}';`

#### Table
```jsx
import { CrudHandler } from '@zango-core/crud/table';
<CrudHandler api_endpoint="{{endpoint}}" headerProps={{ title: "{{Title}}" }} />
```

#### Form - Server-driven
```jsx
import { FormRenderer } from '@zango-core/crud/form';
<FormRenderer api_endpoint="{{endpoint}}" onResponse={(r) => {}} />
```

#### Form - Local RJSF
```jsx
<FormRenderer
  rjsf_schema={{ schema: {...}, uiSchema: {...}, formData: {} }}
  onSubmit={async (data) => { return { success: true }; }}
/>
```

#### Detail View - Drawer
```jsx
const Detail = ({ data, general_details, onClose, open }) => {
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

#### Workflow - Standalone
```jsx
import { WorkflowStatus, WorkflowTags } from '@zango-core/crud/table';
<WorkflowStatus apiUrl="/api/entity/?object_uuid=123" onStatusChange={() => refetch()} />
<WorkflowTags apiUrl="/api/entity/?object_uuid=123" onTagChange={() => refetch()} />
```

### Post-Actions
1. **Custom page** → Check export in `pages/index.js`
2. **New endpoint** → Check `VITE_PROXY_ROUTES` in `.env`
3. **Backend route** → Configure via AppBuilder API (Capability 2, STEP 6)
4. **`.env` changed** → Restart: `npm run dev`

---

## Critical Never Rules

- **Never** use `models.Model` - always `DynamicModelBase`
- **Never** add `class Meta:` in models
- **Never** use `models.ForeignKey` - always `ZForeignKey`
- **Never** use `ManyToManyField` - create intermediary model
- **Never** use absolute imports - always relative
- **Never** use standard Django migrations - use `ws_makemigration` / `ws_migrate`
- **Never** forget `add_btn_title` in CRUD views
- **Never** forget to register modules in `settings.json`
- **Never** forget to create `policies.json` in each module with views
- **Never** forget to sync policies after changes
- **Never** use empty path in CRUD URLs - specify non-empty path
- **Never** create manual status fields - use workflow package

## Critical Always Rules

- **Always** create modules in `backend/` folder
- **Always** verify required packages before creating CRUD/workflow
- **Always** install packages in order: appbuilder → crud → workflow
- **Always** run migrations after model changes
- **Always** sync policies/tasks after code changes
- **Always** configure AppBuilder routes/menus via API (MANDATORY for CRUD)
- **Always** use relative imports
- **Always** check logs if issues: `docker compose -f deploy/docker_compose.yml logs app`
