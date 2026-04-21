# App Initializer
App Builder

The backend API that configures your entire frontend - routes, menu, theme, and user profile.

**Sections:** Overview | Endpoint | Full Response Format | Routes | Menu | Theme | Session Security

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | string | - | URL path, e.g. "/app/patients". |
| `page_type` | string | - | Page renderer: "crud |
| `component` | string | - | Component name from customPages (for page_type: "custom"). |
| `entity` | string | - | Entity name (for page_type: "crud"). |
| `route_id` | string | - | UUID for syncing with menu items. |
| `extra_params` | object | - | Additional parameters: { api_endpoint, standalone, ... } |
| `name` | string | - | Display text for the menu item. |
| `uri` | string | - | Navigation URL. |
| `icon` | string | - | SVG string, emoji, or image URL. |
| `children` | array | - | Nested menu items (same structure). |
| `route_id` | string | - | UUID linking to the corresponding route. |
| `enabled` | boolean | - | Enable session timeout monitoring. |
| `ping_url` | string | - | URL to ping on user activity to keep the session alive. |
| `warn_after` | number | - | Seconds of inactivity before showing a timeout warning. |
| `expire_after` | number | - | Seconds of inactivity before auto-logout. |

## Code Examples

### endpoint
```bash
GET /appbuilder/initializer/
```

### initializer-response.json
```json
{
  "success": true,
  "response": {
    "app_name": "My Application",
    "app_version": "1.0.0",
    "app_logo": "/path/to/logo.png",
    "is_user_anonymous": false,
    "user_role": "Admin",
    "session_security_config": {
      "enabled": true,
      "ping_url": "/session_security/ping/",
      "warn_after": 1700,
      "expire_after": 1800
    },
    "metadata": {
      "title": "My App",
      "description": "Application description",
      "favicon": "/favicon.ico"
    },
    "theme": {
      "colors": {
        "primary": "#5048ed",
        "secondary": "#6d7280",
        "success": "#10b981",
        "warning": "#f59e0b",
        "error": "#f04438",
        "gray": "#717680"
      },
      "typography": {
        "font_family": "Inter, sans-serif",
        "font_size_base": "14px",
        "line_height": 1.5
      }
    },
    "routes": [
      { "route_id": "uuid", "path": "/app/dashboard", "page_type": "custom", "component": "Dashboard" },
      { "path": "/app/patients", "page_type": "crud", "entity": "Patient", "extra_params": { "api_endpoint": "/api/patients/" } }
    ],
    "menu": [
      { "name": "Dashboard", "uri": "/app/dashboard", "icon": "home-icon-svg" },
      { "name": "Management", "uri": "/app/patients", "icon": "users-icon", "children": [
        { "name": "Patients", "uri": "/app/patients" },
        { "name": "Doctors", "uri": "/app/doctors" }
      ]}
    ],
    "profile_info": {
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "+1234567890",
      "user_role": "Admin",
      "member_since": "2024-01-01",
      "profile_pic": "/path/to/pic.jpg"
    }
  }
}
```

### generated-css-variables.css
```css
--color-brand-500: #5048ed;   /* from theme.colors.primary */
--color-gray-500: #717680;    /* from theme.colors.gray */
--color-success-500: #10b981; /* from theme.colors.success */
--color-warning-500: #f59e0b; /* from theme.colors.warning */
--color-error-500: #f04438;   /* from theme.colors.error */
```

