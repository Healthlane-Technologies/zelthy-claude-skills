---
name: zango-frontend
description: "Build Zango frontend apps - create pages, tables, forms, detail views, workflows, configure routes/menu/auth/theme/navbar. Also launches new apps via CLI. Use whenever a developer needs to build, scaffold, configure, or modify anything in a Zango frontend project. Covers CrudHandler, FormRenderer, WorkflowStatus, WorkflowTags, ZangoApp configuration, authentication, theming, and backend route/menu setup."
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
| Create a new app from scratch | [App Builder Ref](references/APPBUILDER-REFERENCE.md) | Launch App |
| Create a page (dashboard, CRUD, custom) | [CRUD Ref](references/CRUD-REFERENCE.md) | Scaffold Page |
| Add a data table | [CRUD Ref](references/CRUD-REFERENCE.md) | Scaffold Table |
| Add a form | [Form Ref](references/FORM-REFERENCE.md) | Scaffold Form |
| Add a detail view | [CRUD Ref](references/CRUD-REFERENCE.md) | Scaffold Detail |
| Add workflow status/tags | [Workflow Ref](references/WORKFLOW-REFERENCE.md) | Scaffold Workflow |
| Configure routes and menu | [App Builder Ref](references/APPBUILDER-REFERENCE.md) | Setup Routes |
| Customize sidebar/topbar | [App Builder Ref](references/APPBUILDER-REFERENCE.md) | Setup Navbar |
| Configure login/auth | [App Builder Ref](references/APPBUILDER-REFERENCE.md) | Setup Auth |
| Configure theme/colors | [App Builder Ref](references/APPBUILDER-REFERENCE.md) | Setup Theme |
| General question about Zango | Read the relevant reference based on topic | - |

## Critical Rules (always apply)

1. **Imports**: `@zango-core/crud/table` or `@zango-core/crud/form`. NEVER `@zango-core/crud`.
2. **Server API**: snake_case - `json_schema`, `ui_schema`, `form_data`, `status_label`, `next_transitions`, `tag_details`, `display_name`, `tag_label`
3. **Local RJSF prop**: camelCase - `schema`, `uiSchema`, `formData`
4. **StatusCol data**: `{ status_label: "Active", status_color: "#12B76A" }`
5. **Row actions**: `type: "form"` opens drawer, `type: "simple"` shows confirmation
6. **Custom page exports**: Name in `pages/index.js` MUST match route's `component` field exactly

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

**Route-based**: Same but receives `onRefresh` instead of `onClose`. Add `enableDetailViewRoute={true}`.

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
