---
name: scaffold-page
description: "Create a new page in a Zango app - dashboard, custom UI, or standard CRUD. Handles route creation, menu entry, component registration. Use when users want to add a new page or screen to their app."
license: MIT
compatibility: Requires a Zango frontend app with @zango-core/crm-framework.
metadata:
  author: Healthlane Technologies
  version: "1.0"
allowed-tools: Read Write Bash(python:*) Bash(docker:*)
---

# Scaffold Page

Create a new page in a Zango frontend application.

## Step 1: Understand What They Need

Ask the user:

1. **What is this page for?** (e.g., "Patient list", "Dashboard", "Settings")
2. **What type of page?**
   - **Standard CRUD** - Auto-generated table from backend. NO frontend code needed. Just a backend route with `page_type: "crud"`.
   - **Custom page** - Your own React component. For dashboards, analytics, settings, or when you need CrudHandler with customizations.
3. **Should it appear in the sidebar menu?** If yes, for which user role?

## Step 2A: Standard CRUD Page (no frontend code)

If the user just needs a data table with default behavior:

- NO files to create in frontend
- Only backend configuration needed
- Chain to setup-routes: "I'll set up the backend route and menu for you."

The route config:
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

Ask: "How do you access your backend?" (shell/docker/app panel)
Then generate the AppRoutesModel + AppMenuModel commands. See [setup-routes skill](../setup-routes/SKILL.md) for details.

After setup, remind: "Navigate to /app/patients - the CRUD table should be working."

## Step 2B: Custom Page

If the user needs a custom page:

### Generate the component

```jsx
// src/custom/pages/{{PageName}}.jsx
import React from 'react';

const {{PageName}} = () => {
  return (
    <div style={{ padding: 32 }}>
      <h1>{{Page Title}}</h1>
      {/* Add your content here */}
    </div>
  );
};

export default {{PageName}};
```

### Register the export

Read `src/custom/pages/index.js` and add:
```js
export { default as {{PageName}} } from './{{PageName}}';
```

CRITICAL: The export name MUST exactly match the `component` field in the backend route.

### Set up backend route

Chain to setup-routes with `page_type: "custom"` and `component: "{{PageName}}"`.

## Step 3: Post-Setup Checks

After creating the page:

1. **Check .env** - If a new API endpoint is used, verify it's in `VITE_PROXY_ROUTES`. If not, add it and remind user to restart dev server.
2. **Verify** - "Restart your dev server and navigate to /app/{{path}}"

## Step 4: Follow-up Offers

Ask: "Do you also want to:"
- Add a data table to this page? → Chain to `/scaffold-table`
- Add a form? → Chain to `/scaffold-form`
- Add workflow status/tags? → Chain to `/scaffold-workflow`
- Customize the sidebar? → Chain to `/setup-navbar`
