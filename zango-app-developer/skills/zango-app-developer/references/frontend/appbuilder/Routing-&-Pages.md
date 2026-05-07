# Routing & Pages
App Builder

How routes, page types, and custom pages work together in Zango.

**Sections:** Page Types | Route Configuration | CRUD Pages | Custom Pages | Standalone Pages | Route Matching | Nested Routes | Using CrudHandler in Custom Pages | Backend: Route Model | Backend: Menu Model | Backend: Routes API | Backend: Menu API | Route-Menu Sync | Configuration Panel | settings.json

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `crud` | string | - | Auto-generated CRUD table + detail + forms. Uses CrudHandler internally. |
| `custom` | string | - | Your React component. Loaded from the customPages prop. |
| `login` | string | - | Authentication pages. Rendered standalone (no layout). |
| `training` | string | - | Training module pages. |
| `404` | string | - | Not found page. |
| `path` | string | - | URL path, e.g. "/app/patients". |
| `page_type` | string | - | One of: crud, custom, login, training. |
| `component` | string | - | Component name for custom pages (must match the export name exactly). |
| `entity` | string | - | Entity name for CRUD pages. |
| `extra_params` | object | - | Additional parameters: { api_endpoint, standalone, ... }. |
| `route_id` | string | - | UUID for menu synchronization. |
| `route_id` | string | - | UUID, auto-generated when routes are saved. |
| `name` | string | - | Display name for the route. |
| `path` | string | - | URL path, e.g. "/app/dashboard". |
| `icon` | string | - | Icon identifier for the route. |
| `page_type` | string | - | One of: login, custom, crud, training. |
| `component` | string | - | Component name for custom page types. |
| `extra_params` | object | - | Additional parameters such as api_endpoint. |
| `route_id` | string | - | UUID linking the menu item to a route for automatic sync. |
| `name` | string | - | Display name for the menu item. |
| `uri` | string | - | URL path the menu item links to. |
| `icon` | string | - | Icon identifier for the menu item. |
| `children` | array | - | Nested child menu items (supports sub-menus). |
| `GET ?action=get_routes` | GET | - | Returns the active routes configuration. |
| `POST ?action=save_routes` | POST | - | Save routes. Auto-assigns route_ids and syncs menus. |
| `PUT ?action=update_routes&pk=ID` | PUT | - | Update an existing routes configuration. |
| `GET ?action=get_configs` | GET | - | Returns all menu configurations. |
| `GET ?action=get_available_roles` | GET | - | Returns roles that do not yet have a menu configured. |
| `POST ?action=create_config` | POST | - | Create a menu for a role. Body: { "user_role": id, "menu": [...] }. |
| `PUT ?action=update_config&pk=ID` | PUT | - | Update an existing menu configuration. |
| `DELETE ?action=delete_config&pk=ID` | DELETE | - | Delete a menu configuration. |
| `package_routes` | array | - | Mount package URL patterns (appbuilder, crud, workflow, etc.) to specific path prefixes. |
| `app_routes` | array | - | Mount app-level URL patterns. Typically a catch-all for the frontend. |

## Code Examples

### crud-route.json
```json
{
  "path": "/app/patients",
  "page_type": "crud",
  "entity": "Patient",
  "extra_params": {
    "api_endpoint": "/api/patients/"
  }
}
```

### src/custom/pages/Analytics.jsx
```jsx
// src/custom/pages/Analytics.jsx
const Analytics = () => <div>My Analytics Page</div>;
export default Analytics;
```

### src/custom/pages/index.js
```jsx
// src/custom/pages/index.js
export { default as Analytics } from './Analytics';
```

Critical:
- Register custom pages in `src/custom/pages/index.js` and reference that exact export in route `component`.
- Do not wire custom pages directly in `App.tsx` for AppBuilder-managed routing.

### route-config.json
```json
{
  "path": "/app/analytics",
  "page_type": "custom",
  "component": "Analytics"
}
```

### standalone-route.json
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

### auto-routes.txt
```text
/app/patients                    → Table view
/app/patients/detail-view/:uuid  → Detail view (if enableDetailViewRoute)
```

### CustomPatientPage.jsx
```jsx
import { CrudHandler } from '@zango-core/crud/table';

const CustomPatientPage = () => (
  <CrudHandler
    api_endpoint="/api/patients/"
    headerProps={{ title: "Patient Management" }}
    customDrawerDetail={MyCustomDetail}
  />
);
```

### Import
```python
from packages.appbuilder.backend.configure.models import AppRoutesModel
```

### Django shell example
```python
# Django shell - create routes
from packages.appbuilder.backend.configure.models import AppRoutesModel

AppRoutesModel.objects.create(routes=[
    {
        "name": "Dashboard",
        "path": "/app/dashboard",
        "page_type": "custom",
        "component": "Dashboard",
        "icon": "home-icon"
    },
    {
        "name": "Patients",
        "path": "/app/patients",
        "page_type": "crud",
        "extra_params": {
            "api_endpoint": "/api/patients/"
        }
    }
])
```

### Import
```python
from packages.appbuilder.backend.configure.models import AppMenuModel
```

### Django shell example
```python
from packages.appbuilder.backend.configure.models import AppMenuModel
from zango.apps.appauth.models import UserRoleModel

role = UserRoleModel.objects.get(name="Admin")
AppMenuModel.objects.create(
    role=role,
    menu=[
        {"name": "Dashboard", "uri": "/app/dashboard", "icon": "home-icon"},
        {
            "name": "Management",
            "uri": "/app/patients",
            "icon": "users-icon",
            "children": [
                {"name": "Patients", "uri": "/app/patients"},
                {"name": "Doctors", "uri": "/app/doctors"}
            ]
        }
    ]
)
```

### settings.json
```json
{
  "package_routes": [
    { "re_path": "^appbuilder/", "package": "appbuilder", "url": "urls" }
  ],
  "app_routes": [
    { "module": "app", "re_path": "^", "url": "urls" }
  ]
}
```
