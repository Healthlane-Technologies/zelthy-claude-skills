---
description: "Configure routes and menu for a Zango app - frontend routing, backend database, shell commands"
---

# Setup Routes & Menu

Read the reference:
**Read:** `@ZANGO-SKILL-REFERENCE.md`

## Before Starting

Ask the user these questions first:

1. **How do you access your backend?** Pick one:
   - Direct shell: `source /path/to/venv/bin/activate && python manage.py shell`
   - Docker: `docker exec -it <container> python manage.py shell`
   - Other (ask for their command)

2. **What is their workspace/app name?** (e.g., bmspspmonitoring, KardiganDemo)

3. **What pages do they want to add?** For each page:
   - Page name (e.g., "Patients")
   - Page type: crud or custom?
   - If crud: what's the API endpoint? (e.g., /api/patients/)
   - If custom: what component name? (e.g., "PatientDashboard")
   - Should it appear in the sidebar menu?
   - Under which menu section/group?
   - For which user role(s)?

## Generate Route Configuration

### Option A: Via Configuration Panel (recommended)
Navigate to `/appbuilder/configure/` in the browser. Use the drag-and-drop UI to add routes and menus.

### Option B: Via Django Shell

Generate the shell commands based on user's answers:

```bash
# Step 1: Access the shell
<user's shell command>

# Step 2: Create/update routes
from packages.appbuilder.backend.configure.models import AppRoutesModel

# Get existing routes or create new
routes_obj = AppRoutesModel.objects.first()
if routes_obj:
    routes = routes_obj.routes
else:
    routes = []

# Add new routes
routes.append({
    "name": "<page_name>",
    "path": "/app/<page_path>",
    "page_type": "<crud|custom>",
    "component": "<ComponentName>",  # for custom pages
    "extra_params": {
        "api_endpoint": "/api/<endpoint>/"  # for crud pages
    }
})

# Save
if routes_obj:
    routes_obj.routes = routes
    routes_obj.save()
else:
    AppRoutesModel.objects.create(routes=routes)

# Step 3: Create/update menu for a role
from packages.appbuilder.backend.configure.models import AppMenuModel
from zango.apps.appauth.models import UserRoleModel

role = UserRoleModel.objects.get(name="<RoleName>")

menu_obj, created = AppMenuModel.objects.get_or_create(role=role, defaults={"menu": []})
menu = menu_obj.menu

# Add menu item
menu.append({
    "name": "<display_name>",
    "uri": "/app/<page_path>",
    "icon": "<icon_svg_or_emoji>"
})

# Or add nested menu
menu.append({
    "name": "<section_name>",
    "uri": "/app/<first_child_path>",
    "icon": "<icon>",
    "children": [
        {"name": "<child1>", "uri": "/app/<path1>"},
        {"name": "<child2>", "uri": "/app/<path2>"}
    ]
})

menu_obj.menu = menu
menu_obj.save()
```

### Option C: Frontend-only (for custom pages)

If routes are already configured in the backend, the user just needs to:
1. Create the component in src/custom/pages/
2. Export it in index.js with the EXACT name matching the route's `component` field

## Route Types Reference
- `crud` - Auto CRUD table. Needs: path, extra_params.api_endpoint
- `custom` - Your React component. Needs: path, component (matching export name)
- `login` - Auth pages (standalone, no layout)
- `training` - Training module pages

## Menu Icons
Icons can be:
- Inline SVG string (if contains `<svg`)
- Emoji (Unicode characters, length <= 4)
- Image URL

## After Adding Routes
Remind the user:
- Restart the dev server if .env proxy routes changed
- If using custom pages, the component must be exported in pages/index.js
- The menu appears based on the user's role
