---
name: launch-frontend
description: "Create a new Zango frontend app from scratch using create-zango-app CLI. Use when starting a new project."
license: MIT
compatibility: Requires Node.js 18+, npm/pnpm/yarn. Uses npx @zango-core/create-zango-app CLI.
metadata:
  author: Healthlane Technologies
  version: "1.0"
allowed-tools: Bash(npx:*) Bash(npm:*) Write Read
---

# Launch New Zango Frontend App

Create and configure a Zango frontend application from zero to running dev server.

## Step 1: Create the App

Ask the user for the **project name**, then scaffold:

```bash
npx @zango-core/create-zango-app <project-name>
```

Alternative package managers:
```bash
npm init @zango-core/zango-app <project-name>
yarn create @zango-core/zango-app <project-name>
pnpm create @zango-core/zango-app <project-name>
```

CLI options:
| Flag | Description |
|------|-------------|
| `--use-pnpm` | Use pnpm as package manager |
| `--skip-install` | Skip dependency installation |
| `--verbose` | Print additional logs |

## Step 2: Configure Environment

```bash
cd <project-name>
cp .env.example .env
```

Ask the user these questions, then write `.env`:

1. **Backend API URL?** (default: `http://localhost:8000`)
2. **Which routes need proxying?** (default: `/api,/zango,/frame`)
3. **Environment?** (default: `development`)

Generate `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_PROXY_ROUTES=/api,/zango,/frame,/appbuilder,/session_security
VITE_APP_ENV=development
```

**CRITICAL**: `VITE_PROXY_ROUTES` must include ALL backend routes the app uses. Missing routes cause 404 errors in development. Common routes to include:
- `/api` - CRUD endpoints
- `/zango` - Zango platform routes
- `/frame` - Frame package routes
- `/appbuilder` - App builder / initializer
- `/session_security` - Session keep-alive pings
- `/crud` - CRUD package routes (if used)

## Step 3: Start Development Server

```bash
npm run dev
```

Dev server runs on port 3000 with hot reload and automatic backend proxying.

## Step 4: Create First Custom Page

Create `src/custom/pages/Dashboard.jsx`:
```jsx
const Dashboard = () => {
  return (
    <div style={{ padding: 32 }}>
      <h1>Dashboard</h1>
      <p>Welcome to my app!</p>
    </div>
  );
};

export default Dashboard;
```

Export it in `src/custom/pages/index.js`:
```jsx
export { default as Dashboard } from './Dashboard';
```

**CRITICAL**: The export name (e.g., `Dashboard`) MUST exactly match the `component` field in the backend route configuration. A mismatch causes blank pages with no error.

## Step 5: Configure Routes

Routes are configured on the backend via one of:
- **Configuration Panel**: Navigate to `/appbuilder/configure/` in browser
- **Django shell**: Create `AppRoutesModel` and `AppMenuModel` entries

For route setup details, use the `/setup-routes` skill.

## Step 6: Build for Deployment

```bash
npm run build:zango    # Single-file IIFE build for Zango platform
npm run build          # Standard web build to dist/
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3000 with hot reload + proxy |
| `npm run build` | Production build to `dist/` |
| `npm run build:zango` | Single-file IIFE build for Zango platform deployment |
| `npm run preview` | Preview production build locally |

## Generated Project Structure

```
my-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── custom/
│   │   └── pages/              # Custom pages go here
│   │       ├── Dashboard.jsx
│   │       └── index.js        # Export all custom pages
│   ├── App.tsx                  # ZangoApp configuration
│   ├── index.tsx                # Dev entry point
│   ├── index.zango.tsx          # Zango platform entry point
│   └── index.css                # Global styles + Tailwind
├── .env                         # Environment config
├── .env.example                 # Template
├── vite.config.ts               # Dev/production build
└── vite.config.zango.ts         # Zango single-file build
```

## App.tsx Configuration

The generated `App.tsx` uses `ZangoApp` as the root component:
```tsx
import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';

const App = () => (
  <ZangoApp
    appInitializerEndpoint="/appbuilder/initializer/"
    customPages={customPages}
  />
);

export default App;
```

`ZangoApp` accepts these configuration props for later customization:
- `layoutConfig` - Show/hide topbar, navbar; layout type
- `navbarConfig` - Custom logo, menu, bottom content, collapsible
- `topbarConfig` - Profile section, custom left/right content
- `authConfig` - Login theme, custom components, OAuth

For details on these, use `/setup-navbar`, `/setup-auth`, or `/setup-theme`.

## Key Rules

- Always import from `@zango-core/crud/table` and `@zango-core/crud/form` (never from `@zango-core/crud` directly)
- Custom pages live in `src/custom/pages/` and must be exported in `index.js`
- The export name must EXACTLY match the route's `component` field in the backend
- Proxy routes in `.env` must cover all backend API paths used by the app
- For full API reference, see [CRUD Reference](../zango-frontend/references/CRUD-REFERENCE.md) and [App Builder Reference](../zango-frontend/references/APPBUILDER-REFERENCE.md)

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| 404 on API calls | Missing proxy route | Add route to `VITE_PROXY_ROUTES` in `.env`, restart dev server |
| Blank page after login | Component name mismatch | Ensure export name matches route's `component` field exactly |
| Build fails | Dependency issues | Run `npm install --legacy-peer-deps` |
| Styles missing | Tailwind not configured | Check `index.css` has `@import 'tailwindcss';` |

## Post-Setup Offers

After the app is running, ask:

"Your app is running! What would you like to do next?"
- Add a page → Chain to `/scaffold-page`
- Customize the sidebar → Chain to `/setup-navbar`
- Set up theme/branding → Chain to `/setup-theme`
- Configure authentication → Chain to `/setup-auth`
