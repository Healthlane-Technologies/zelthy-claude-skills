---
description: "Create a new Zango frontend app from scratch - CLI setup, .env config, first page, routes"
---

# Launch New Zango Frontend App

Read the reference for complete details:
**Read:** `@ZANGO-SKILL-REFERENCE.md`

## Step-by-Step Guide

Walk the user through each step. Ask clarifying questions when needed.

### Step 1: Create the app
```bash
npx @zango-core/create-zango-app <project-name>
```
Options: --use-pnpm, --skip-install, --verbose

### Step 2: Configure environment
```bash
cd <project-name>
cp .env.example .env
```

Ask the user:
- What is their backend API URL? (default: http://localhost:8000)
- What proxy routes do they need? (default: /api,/zango,/frame)

Generate .env:
```
VITE_API_BASE_URL=<their-url>
VITE_PROXY_ROUTES=<their-routes>
VITE_APP_ENV=development
```

**IMPORTANT about VITE_PROXY_ROUTES:** This MUST include ALL backend routes the app uses. If a route returns 404 in dev, it's likely missing from this list. Common routes to include:
- /app/initializer (or /appbuilder/initializer)
- /api (CRUD endpoints)
- /zango (Zango core)
- /frame (Frame package)
- Any custom backend routes

### Step 3: Start development
```bash
npm run dev
```

### Step 4: Create first custom page
Generate a page component in src/custom/pages/ and export it in index.js.

### Step 5: Configure routes
Explain that routes are configured in the backend via AppRoutesModel or the Configuration Panel at /appbuilder/configure/.

### Step 6: Build for deployment
```bash
npm run build:zango
```

## Key Rules
- Import from `@zango-core/crud/table` and `@zango-core/crud/form` (NEVER `@zango-core/crud`)
- App.tsx should use `<ZangoApp appInitializerEndpoint="/appbuilder/initializer/" customPages={customPages} />`
- Custom pages go in src/custom/pages/ and MUST be exported in index.js
- The export name MUST match the `component` field in the route config exactly
