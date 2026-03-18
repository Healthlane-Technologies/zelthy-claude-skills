---
name: setup-routes
description: "Configure routes and menu for a Zango app via backend database or config panel. Use when adding pages or sidebar navigation."
license: MIT
compatibility: Requires access to Django shell (direct or via Docker) for backend configuration.
metadata:
  author: Healthlane Technologies
  version: "1.0"
allowed-tools: Bash(python:*) Bash(docker:*) Read Write
---

# Setup Routes & Menu

Configure application routes and navigation menu for a Zango frontend app.

## Before Starting - Gather Information

Ask the user:

1. **Shell access method:**
   - Direct: `source /path/to/venv/bin/activate && python manage.py shell`
   - Docker: `docker exec -it <container> python manage.py shell`
   - Other?

2. **Workspace/app name?** (e.g., `bmspspmonitoring`)

3. **What pages to add?** For each page, determine:
   - Name and URL path
   - Page type: `crud` or `custom`
   - For crud: the `api_endpoint`
   - For custom: the `component` name (must match export in `pages/index.js`)
   - Menu placement: which section, which user role

## Option A: Configuration Panel (Recommended for UI Users)

Navigate to `/appbuilder/configure/` in the browser. This provides a visual interface for managing routes and menus. No shell access needed.

## Option B: Django Shell

### Adding Routes

```python
# Enter shell using user's preferred method
# e.g., python manage.py shell

from packages.appbuilder.backend.configure.models import AppRoutesModel

# Get existing routes (or start fresh)
routes_obj = AppRoutesModel.objects.first()
routes = routes_obj.routes if routes_obj else []

# Add a CRUD page
routes.append({
    "name": "Patients",
    "path": "/app/patients",
    "page_type": "crud",
    "extra_params": {
        "api_endpoint": "/api/patients/"
    }
})

# Add a custom page
routes.append({
    "name": "Dashboard",
    "path": "/app/dashboard",
    "page_type": "custom",
    "component": "Dashboard"
})

# Save
if routes_obj:
    routes_obj.routes = routes
    routes_obj.save()
else:
    AppRoutesModel.objects.create(routes=routes)
```

### Adding Menu Items

```python
from packages.appbuilder.backend.configure.models import AppMenuModel
from zango.apps.appauth.models import UserRoleModel

role = UserRoleModel.objects.get(name="<RoleName>")
menu_obj, created = AppMenuModel.objects.get_or_create(
    role=role, defaults={"menu": []}
)
menu = menu_obj.menu

# Flat menu item
menu.append({
    "name": "Dashboard",
    "uri": "/app/dashboard",
    "icon": "<emoji_or_svg>"
})

# Nested section with children
menu.append({
    "name": "Management",
    "uri": "/app/patients",
    "icon": "<icon>",
    "children": [
        {"name": "Patients", "uri": "/app/patients"},
        {"name": "Doctors", "uri": "/app/doctors"}
    ]
})

menu_obj.menu = menu
menu_obj.save()
```

### Via Docker

Wrap the same Python code in a docker exec call:

```bash
docker exec -it <container> python manage.py shell -c "
from packages.appbuilder.backend.configure.models import AppRoutesModel
routes_obj = AppRoutesModel.objects.first()
routes = routes_obj.routes if routes_obj else []
routes.append({
    'name': 'Dashboard',
    'path': '/app/dashboard',
    'page_type': 'custom',
    'component': 'Dashboard'
})
if routes_obj:
    routes_obj.routes = routes
    routes_obj.save()
else:
    AppRoutesModel.objects.create(routes=routes)
print('Routes saved:', len(routes))
"
```

## Route Types

| Type | Description | Required Fields |
|------|-------------|-----------------|
| `crud` | Auto table + detail + forms | `extra_params.api_endpoint` |
| `custom` | Your React component | `component` (must match export name) |
| `login` | Auth pages (standalone, no layout) | — |
| `training` | Training module pages | — |

### CRUD Route Example
```json
{
    "name": "Patients",
    "path": "/app/patients",
    "page_type": "crud",
    "extra_params": {
        "api_endpoint": "/api/patients/"
    }
}
```

Auto-generates these frontend routes:
- `/app/patients` - Table view
- `/app/patients/detail-view/:uuid` - Detail view (if `enableDetailViewRoute` is true)

### Custom Route Example
```json
{
    "name": "Analytics",
    "path": "/app/analytics",
    "page_type": "custom",
    "component": "Analytics"
}
```

### Standalone Route (No Layout)
```json
{
    "path": "/app/public-form",
    "page_type": "custom",
    "component": "PublicForm",
    "extra_params": {
        "standalone": true
    }
}
```

## Menu Item Format

```json
{
    "name": "Display Name",
    "uri": "/app/path",
    "icon": "<svg>...</svg>",
    "children": [
        {"name": "Child Page", "uri": "/app/child-path"}
    ]
}
```

Icons can be:
- SVG string: `"<svg>...</svg>"`
- Emoji: `"📊"`
- Image URL: `"/path/to/icon.png"`

## After Adding Routes

### For Custom Pages
1. Create the React component in `src/custom/pages/YourComponent.jsx`
2. Export it in `src/custom/pages/index.js`:
   ```js
   export { default as YourComponent } from './YourComponent';
   ```
3. The export name MUST exactly match the route's `component` field

### For New API Endpoints
If the route introduces a new backend URL prefix not already proxied:
1. Add it to `VITE_PROXY_ROUTES` in `.env`
2. Restart the dev server (`npm run dev`)

### Menu Visibility
- Menu items are per-role: each `UserRoleModel` gets its own `AppMenuModel`
- Users only see menu items configured for their role
- The same route can appear in multiple role menus

## Route-Menu Sync

When routes are saved via the Configuration Panel (`/appbuilder/configure/`), each route gets an auto-assigned `route_id` (UUID). Menu items can reference this `route_id` for automatic synchronization - if a route's path changes, linked menu items update automatically.

When configuring via Django shell, this sync is manual. You can set `route_id` on both route and menu item to link them.

## Backend URL Configuration (settings.json)

Routes also depend on `settings.json` in the workspace root:
```json
{
    "package_routes": [
        {"re_path": "^appbuilder/", "package": "appbuilder", "url": "urls"},
        {"re_path": "^crud/", "package": "crud", "url": "urls"}
    ],
    "app_routes": [
        {"module": "app", "re_path": "^", "url": "urls"}
    ]
}
```

Make sure `appbuilder` is mounted so the initializer API works.

For the complete routing and pages reference, see: [App Builder Reference](../zango-frontend/references/APPBUILDER-REFERENCE.md)
