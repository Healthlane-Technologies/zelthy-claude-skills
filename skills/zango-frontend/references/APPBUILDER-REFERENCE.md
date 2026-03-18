# App Builder Reference

Complete reference for ZangoApp, App Initializer, Navbar, Topbar, Routing, Authentication, Theme, and Build.

---

## Getting Started

### Create Your App

```bash
npx @zango-core/create-zango-app my-app
# or: npm init @zango-core/zango-app my-app
# or: yarn create @zango-core/zango-app my-app
# or: pnpm create @zango-core/zango-app my-app
```

CLI flags:

| Flag | Description |
|------|-------------|
| --verbose | Print additional logs during scaffolding. |
| --use-pnpm | Use pnpm as the package manager. |
| --skip-install | Skip installing dependencies after project creation. |

### Configure Environment

```bash
cd my-app
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_BASE_URL | `http://localhost:8000` | Backend API URL. Dev server proxies requests here. |
| VITE_PROXY_ROUTES | `/api,/zango,/frame` | Comma-separated routes to proxy. MUST include ALL backend routes. |
| VITE_APP_ENV | `development` | Environment flag. |

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server on port 3000 with hot reload and proxying. |
| `npm run build` | Production build to `dist/`. |
| `npm run build:zango` | Single-file IIFE build for Zango platform deployment. |
| `npm run preview` | Preview production build locally. |

---

## Project Structure

```
my-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── custom/
│   │   └── pages/              # Your custom pages
│   │       ├── Dashboard.jsx
│   │       └── index.js        # Export all custom pages
│   ├── App.tsx                  # ZangoApp configuration
│   ├── index.tsx                # Dev entry point
│   ├── index.zango.tsx          # Zango platform entry point
│   └── index.css                # Global styles + Tailwind
├── .env                         # Environment config
├── .env.example                 # Template
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts               # Dev/production build
└── vite.config.zango.ts         # Single-file build
```

### Where to Add Code

| What | Where |
|------|-------|
| New pages | `src/custom/pages/YourPage.jsx` + export in `index.js` |
| Custom components | `src/custom/components/` |
| Custom hooks | `src/custom/hooks/` |
| Constants / config | `src/custom/constants/` |
| Utilities | `src/custom/utils/` |
| Assets | `src/assets/` |

---

## ZangoApp

The root component that bootstraps your Zango frontend application.

### Import

```jsx
import { ZangoApp } from '@zango-core/crm-framework';
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| appInitializerEndpoint | `string` | `"/appbuilder/initializer/"` | API endpoint for app initialization data. |
| customPages | `object` | — | Map of component names to React components for custom page routing. |
| layoutConfig | `object` | — | `{ showTopbar, showNavbar, layoutType }` |
| topbarConfig | `object` | — | `{ showProfile, customLeftContent, customRightContent, customProfileMenu, customTopbar, className, style }` |
| navbarConfig | `object` | — | `{ showLogo, showMenu, isCollapsed, collapsible, customLogo, customMenu, customMenuContent, customBottomContent, customNavbar, menuConfig, className, style }` |
| authConfig | `object` | — | `{ customComponents, theme, card, logo, login, roleSelection, twoFactor, resetPassword, providers, messages }` |
| config | `object` | — | General app configuration. |
| customComponents | `object` | — | Custom component overrides: `{ Layout, Topbar, Navbar }` |

### Layout Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showTopbar | `boolean` | `true` | Show/hide the top navigation bar. |
| showNavbar | `boolean` | `true` | Show/hide the sidebar navigation. |
| layoutType | `'wide' \| 'compact'` | `'wide'` | Layout mode. "wide" uses full viewport; "compact" constrains content. |

### Basic Usage

```jsx
import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';

const App = () => (
  <ZangoApp
    appInitializerEndpoint="/appbuilder/initializer/"
    customPages={customPages}
  />
);
```

### Full Configuration

```jsx
<ZangoApp
  appInitializerEndpoint="/appbuilder/initializer/"
  customPages={customPages}
  layoutConfig={{ showTopbar: false, showNavbar: true, layoutType: 'wide' }}
  navbarConfig={{
    collapsible: true,
    customLogo: <MyLogo />,
    customMenu: <DocsNavbar />,
    customBottomContent: <ProfileSection />,
  }}
  topbarConfig={{
    showProfile: true,
    customRightContent: <NotificationBell />,
  }}
  authConfig={{
    customComponents: { LoginPage: CustomLogin },
  }}
/>
```

### Accessing App Data

```jsx
import { useAppContext } from '@zango-core/crm-framework';

const MyComponent = () => {
  const {
    appData,      // Raw initializer response
    menu,         // Navigation menu items
    routes,       // Application routes
    profileInfo,  // Current user profile
    appLogo,      // App logo URL
    appName,      // Application name
    theme,        // Theme colors & typography
  } = useAppContext();

  return <div>Hello {profileInfo?.name}</div>;
};
```

---

## App Initializer

The backend API that configures your entire frontend.

### Endpoint

```
GET /appbuilder/initializer/
```

### Full Response Format

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
    "metadata": { "title": "My App", "description": "...", "favicon": "/favicon.ico" },
    "theme": {
      "colors": {
        "primary": "#5048ed", "secondary": "#6d7280", "success": "#10b981",
        "warning": "#f59e0b", "error": "#f04438", "gray": "#717680"
      },
      "typography": { "font_family": "Inter, sans-serif", "font_size_base": "14px", "line_height": 1.5 }
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
      "name": "John Doe", "email": "john@example.com", "mobile": "+1234567890",
      "user_role": "Admin", "member_since": "2024-01-01", "profile_pic": "/path/to/pic.jpg"
    }
  }
}
```

### Route Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| path | `string` | Yes | URL path, e.g. `/app/patients`. |
| page_type | `string` | Yes | `"crud"`, `"custom"`, `"login"`, or `"training"`. |
| component | `string` | No | Component name from customPages (for `"custom"`). |
| entity | `string` | No | Entity name (for `"crud"`). |
| route_id | `string` | No | UUID for syncing with menu items. |
| extra_params | `object` | No | Additional parameters: `{ api_endpoint, standalone, ... }` |

### Menu Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | `string` | Yes | Display text. |
| uri | `string` | Yes | Navigation URL. |
| icon | `string` | No | SVG string, emoji, or image URL. |
| children | `array` | No | Nested menu items (same structure). |
| route_id | `string` | No | UUID linking to a route. |

### Session Security

| Field | Type | Description |
|-------|------|-------------|
| enabled | `boolean` | Enable session timeout monitoring. |
| ping_url | `string` | URL to ping on user activity. |
| warn_after | `number` | Seconds before showing timeout warning. |
| expire_after | `number` | Seconds before auto-logout. |

---

## Navbar & Topbar

### Navbar Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showLogo | `boolean` | `true` | Show/hide logo section. |
| showMenu | `boolean` | `true` | Show/hide menu items. |
| isCollapsed | `boolean` | `false` | Start sidebar collapsed. |
| collapsible | `boolean` | `false` | Allow user to toggle collapse. |
| customLogo | `ReactNode` | — | Replace default logo. |
| customMenu | `ReactNode` | — | Replace entire menu. |
| customMenuContent | `ReactNode` | — | Content below menu items. |
| customBottomContent | `ReactNode` | — | Sticky bottom section. |
| customNavbar | `React.ComponentType` | — | Replace entire navbar. |
| menuConfig | `object` | — | Menu display options. |
| className | `string` | — | CSS class for navbar container. |
| style | `CSSProperties` | — | Inline styles for navbar. |

### Topbar Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showProfile | `boolean` | `true` | Show profile section with dropdown. |
| showLeftSection | `boolean` | `true` | Show left section. |
| showRightSection | `boolean` | `true` | Show right section. |
| customLeftContent | `ReactNode` | — | Custom left content. |
| customRightContent | `ReactNode` | — | Custom right content (before profile). |
| customProfileMenu | `ReactNode` | — | Replace profile dropdown. |
| customTopbar | `React.ComponentType` | — | Replace entire topbar. |
| className | `string` | — | CSS class for topbar container. |
| style | `CSSProperties` | — | Inline styles for topbar. |

### Examples

```jsx
// Custom logo
<ZangoApp navbarConfig={{ customLogo: <MyLogo /> }} />

// Collapsible sidebar
<ZangoApp navbarConfig={{ collapsible: true }} />

// Hide topbar
<ZangoApp layoutConfig={{ showTopbar: false }} />

// Custom topbar content
<ZangoApp topbarConfig={{
  customLeftContent: <Breadcrumbs />,
  customRightContent: <NotificationBell />,
}} />

// Sticky bottom content
<ZangoApp navbarConfig={{ customBottomContent: <ProfileCard /> }} />
```

---

## Routing & Pages

### Page Types

| Type | Description |
|------|-------------|
| `crud` | Auto-generated CRUD table + detail + forms. |
| `custom` | Your React component, loaded from customPages. |
| `login` | Authentication pages (standalone, no layout). |
| `training` | Training module pages. |

### CRUD Route

```json
{ "path": "/app/patients", "page_type": "crud", "entity": "Patient", "extra_params": { "api_endpoint": "/api/patients/" } }
```

Auto-generates routes:
- `/app/patients` -- Table view
- `/app/patients/detail-view/:uuid` -- Detail view (if `enableDetailViewRoute`)

### Custom Page Route

```jsx
// 1. Create page: src/custom/pages/Analytics.jsx
const Analytics = () => <div>My Analytics Page</div>;
export default Analytics;

// 2. Export: src/custom/pages/index.js
export { default as Analytics } from './Analytics';

// 3. Route config:
{ "path": "/app/analytics", "page_type": "custom", "component": "Analytics" }
```

### Standalone Pages (No Layout)

```json
{ "path": "/app/public-form", "page_type": "custom", "component": "PublicForm", "extra_params": { "standalone": true } }
```

### Using CrudHandler in Custom Pages

```jsx
import { CrudHandler } from '@zango-core/crud/table';

const CustomPatientPage = () => (
  <CrudHandler
    api_endpoint="/api/patients/"
    headerProps={{ title: "Patient Management" }}
    customDrawerDetail={MyCustomDetail}
  />
);
export default CustomPatientPage;
```

### Backend: Route & Menu Models

```python
from packages.appbuilder.backend.configure.models import AppRoutesModel, AppMenuModel
from zango.apps.appauth.models import UserRoleModel

# Create routes
AppRoutesModel.objects.create(routes=[
    { "name": "Dashboard", "path": "/app/dashboard", "page_type": "custom", "component": "Dashboard" },
    { "name": "Patients", "path": "/app/patients", "page_type": "crud", "extra_params": { "api_endpoint": "/api/patients/" } }
])

# Create menu for a role
role = UserRoleModel.objects.get(name="Admin")
AppMenuModel.objects.create(role=role, menu=[
    {"name": "Dashboard", "uri": "/app/dashboard", "icon": "home-icon"},
    {"name": "Management", "uri": "/app/patients", "children": [
        {"name": "Patients", "uri": "/app/patients"},
        {"name": "Doctors", "uri": "/app/doctors"}
    ]}
])
```

### Backend APIs

**Routes:**
- `GET ?action=get_routes` -- Get active routes
- `POST ?action=save_routes` -- Save routes (auto-assigns route_ids)
- `PUT ?action=update_routes&pk=ID` -- Update routes

**Menu:**
- `GET ?action=get_configs` -- Get all menu configs
- `GET ?action=get_available_roles` -- Roles without menus
- `POST ?action=create_config` -- Create menu: `{ "user_role": id, "menu": [...] }`
- `PUT ?action=update_config&pk=ID` -- Update menu
- `DELETE ?action=delete_config&pk=ID` -- Delete menu

### settings.json

```json
{
  "package_routes": [
    { "re_path": "^appbuilder/", "package": "appbuilder", "url": "urls" },
    { "re_path": "^crud/", "package": "crud", "url": "urls" }
  ],
  "app_routes": [
    { "module": "app", "re_path": "^", "url": "urls" }
  ]
}
```

---

## Authentication

### Auth Configuration

```jsx
<ZangoApp authConfig={{ /* theme, custom components, login config, etc. */ }} />
```

### Login Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string \| ReactNode` | `"Sign In"` | Login page title. |
| subtitle | `string \| ReactNode` | — | Text below the title. |
| submitButtonText | `string` | `"Sign In"` | Submit button label. |
| showRememberMe | `boolean` | `true` | Show remember me checkbox. |
| enableTabSwitching | `boolean` | `true` | Allow email/mobile tab switching. |
| defaultTab | `'email' \| 'mobile'` | `'email'` | Default login tab. |
| redirectAfterLogin | `string` | — | Custom redirect URL after login. |
| formLabels | `object` | — | Custom labels: `{ email, mobile, password }`. |
| formPlaceholders | `object` | — | Custom placeholders: `{ email, mobile, password }`. |
| customHeader | `ReactNode` | — | Content above the form. |
| customFooter | `ReactNode` | — | Content below the form. |

### Theme

| Prop | Type | Description |
|------|------|-------------|
| background | `object` | `{ color, image, gradient }` |
| primaryColor | `string` | Brand color for buttons and accents. |
| fontFamily | `string` | Font family. |
| borderRadius | `string` | Global border radius. |
| textColor | `string` | Primary text color. |
| alignTitle | `'left' \| 'center' \| 'right'` | Title alignment. |

### Card

| Prop | Type | Description |
|------|------|-------------|
| backgroundColor | `string` | Card background. |
| borderRadius | `string` | Card border radius. |
| boxShadow | `string` | Card shadow. |
| maxWidth | `string` | Card max width. |
| padding | `string` | Card padding. |

### Logo

| Prop | Type | Description |
|------|------|-------------|
| url | `string` | Logo image URL. |
| width | `string` | Logo width. |
| height | `string` | Logo height. |
| position | `'center' \| 'left' \| 'right'` | Logo alignment. |

### Role Selection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `string \| ReactNode` | — | Page title. |
| cardLayout | `'grid' \| 'list'` | `'grid'` | Layout mode. |
| gridColumns | `2 \| 3` | `2` | Grid columns. |
| customRoleCard | `ReactNode` | — | Custom role card component. |

### Two-Factor Authentication

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| codeLength | `number` | `6` | OTP digits. |
| resendCountdown | `number` | `60` | Seconds before resend. |
| customCodeInput | `ReactNode` | — | Custom OTP input. |

### OAuth/OIDC Providers

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| buttonStyle | `'outline' \| 'filled' \| 'minimal'` | `'outline'` | Provider button style. |
| showProviderIcons | `boolean` | `true` | Show icons. |
| separatorText | `string` | `"OR"` | Separator text. |

### Custom Component Overrides

| Component | Description |
|-----------|-------------|
| LoginPage | Replace entire login page. |
| LoginCard | Replace login card. |
| RoleSelection | Replace role selection page. |
| TwoFactorAuth | Replace 2FA page. |
| ForgotPasswordPage | Replace forgot password page. |
| ResetPasswordPage | Replace reset password page. |
| OAuthCallbackPage | Replace OAuth callback. |
| DynamicLoginForm | Replace login form within card. |
| OTPForm | Replace OTP input form. |
| ProviderButton | Replace OAuth provider button. |

### Complete Example

```jsx
<ZangoApp
  authConfig={{
    theme: {
      background: { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      primaryColor: '#5048ED',
    },
    logo: { url: '/logo.svg', width: '120px', position: 'center' },
    card: { borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      defaultTab: 'email',
      showRememberMe: true,
    },
    providers: {
      buttonStyle: 'outline',
      separatorText: 'or continue with',
    },
  }}
/>
```

---

## Theme & Build

### Theme System

Colors from the initializer response generate CSS custom properties:

```css
:root {
  --color-brand-50: #EAE8FF;
  --color-brand-500: #5048ED;   /* primary */
  --color-brand-900: #151263;
  --color-gray-50: #F9FAFB;
  --color-gray-500: #667085;
  --color-success-500: #10B981;
  --color-error-500: #F04438;
  --color-warning-500: #F59E0B;
}
```

### Color Configuration

| Key | CSS Variable | Description |
|-----|-------------|-------------|
| primary | `--color-brand-*` | Brand color palette (25-950). |
| success | `--color-success-*` | Success/positive. |
| warning | `--color-warning-*` | Warning states. |
| error | `--color-error-*` | Error/danger. |
| gray | `--color-gray-*` | Neutral palette. |

### Using Theme in Components

```jsx
// CSS variables
<div style={{ color: 'var(--color-brand-500)', backgroundColor: 'var(--color-gray-50)' }}>
  Themed content
</div>

// Tailwind (with @theme configured)
<div className="text-brand-500 bg-gray-50 border-gray-200">
  Themed content
</div>
```

### Tailwind CSS v4 Setup (index.css)

```css
@import 'tailwindcss';

@theme {
  --color-brand-50: var(--color-brand-50, #EAE8FF);
  --color-brand-500: var(--color-brand-500, #5048ED);
  --color-gray-50: var(--color-gray-50, #F9FAFB);
  --color-gray-500: var(--color-gray-500, #667085);
}
```

### Build Configuration

**Development (vite.config.ts):**
```js
{
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': './src' } },
  server: { port: 3000, proxy: { /* from VITE_PROXY_ROUTES */ } }
}
```

**Zango platform (vite.config.zango.ts):**
```js
{
  plugins: [react(), cssInjectedByJsPlugin(), viteSingleFile(), tailwindcss()],
  build: {
    rollupOptions: {
      input: 'src/index.zango.tsx',
      output: { format: 'iife', entryFileNames: 'zango-app.[timestamp].min.js', inlineDynamicImports: true }
    },
    minify: 'terser', cssCodeSplit: false, assetsInlineLimit: 100000000,
  }
}
```

### Django Template Integration

```html
<div id="zango-app" data-base-path="/app/"></div>
<script>window.app_initializer_endpoint = "/appbuilder/initializer/";</script>
<script type="module" src="{% zstatic 'packages/appbuilder/js/build.min.js' %}"></script>
```

---

## Additional Information

### URL Configuration

```python
# appbuilder/backend/app/urls.py
urlpatterns = [
    re_path(r'^initializer/$', AppInitializeAPI.as_view()),  # Reserved
    re_path(r'/', AppView.as_view()),                         # Catch-all SPA
]
```

### Root URL Redirect

```python
from django.shortcuts import redirect
from django.views.generic import View

class RedirectAppView(View):
    def get(self, request, *args, **kwargs):
        return redirect("/app")
```

### Extending the App Initializer

```python
import json
from django.http import HttpResponse
from ...packages.appbuilder.backend.app.views import AppInitializeAPI

class ExtendedAppInitializeAPI(AppInitializeAPI):
    def get(self, request, *args, **kwargs):
        response = super().get(request, *args, **kwargs)
        response_data = json.loads(response.content)
        response_data["response"]["feature_flags"] = {
            "enable_chat": True,
            "enable_analytics": False,
        }
        return HttpResponse(json.dumps(response_data), status=response.status_code, content_type="application/json")
```
