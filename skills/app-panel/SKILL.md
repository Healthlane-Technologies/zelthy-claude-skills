---
name: app-panel
description: "Automate Zango App Panel operations via browser - launch apps, configure themes, sync policies, manage routes/users/packages/tasks. Use when users want to perform admin operations on the Zango platform panel without manual clicking."
license: MIT
compatibility: Requires browser automation capability (agent-browser or claude-in-chrome MCP tools). Needs Zango App Panel URL and admin credentials.
metadata:
  author: Healthlane Technologies
  version: "1.0"
---

# Zango App Panel Automation

Automate admin operations on the Zango App Panel via browser.

## Before Starting

Ask the user:
1. **App Panel URL?** (e.g., `http://app0.zelthy.com:8000/platform/apps`)
2. **Admin credentials?** (email + password - stored in memory only, never written to files)
3. **What operation?** (see list below)

## Login Flow

1. Navigate to `{base_url}/auth/login/`
2. Fill username (textbox "Enter Username")
3. Fill password (textbox "Email Password")
4. Click "Login" button
5. Wait for redirect to `/platform/apps`
6. Verify: page title should be "Zango App Panel"

## Operations

### Launch New App
**Path:** `/platform/apps` → Click "Launch New App"
**Form fields:** App Name (text), Description (textarea), Upload Template (file, optional)
**Action:** Click "Launch App" button
**Verify:** New app card appears in the grid

### Configure Theme
**Path:** Click app card → App Settings → Themes tab
**URL:** `/platform/apps/{app_uuid}/app-settings/app-configuration/#themes`
**Actions:**
- Click "Add Theme" to create new OR click edit (pencil icon) on existing
- Set colors: Primary, Secondary, Background, Gray, Success, Warning, Error, Info
- Set typography: Font Family, Font Size, Line Height
- Save
- Mark as ACTIVE if needed
**Verify:** Theme card shows updated colors with ACTIVE badge

### Edit Basic Information / Branding
**Path:** App Settings → Basic Information tab
**URL:** `/platform/apps/{app_uuid}/app-settings/app-configuration/`
**Actions:**
- Click "Edit Details"
- Update: App Name, Description, Meta Title, Logo, Favicon
- Save

### Configure User Roles
**Path:** App Settings → User Roles tab
**URL:** `/platform/apps/{app_uuid}/app-settings/app-configuration/#user-roles`
**Actions:** Create/edit/delete roles

### Configure Authentication
**Path:** App Settings → Authentication tab
**URL:** `/platform/apps/{app_uuid}/app-settings/app-configuration/#authentication`

### Manage Secrets
**Path:** App Settings → Secrets tab
**URL:** `/platform/apps/{app_uuid}/app-settings/app-configuration/#secrets`

### Sync Policies
**Path:** Code → Policies tab
**URL:** `/platform/apps/{app_uuid}/code/#policies`
**Actions:**
- Click "Sync Policies" button
- Wait for sync to complete
- Edit individual policies: assign roles per policy
**Verify:** Policy list refreshed with updated configurations

### Sync Async Tasks
**Path:** Code → Async Tasks tab
**URL:** `/platform/apps/{app_uuid}/code/#asynctasks`
**Actions:**
- Click "Sync Tasks" button
- Wait for sync
- Edit individual tasks: set schedule (cron), activate/deactivate
**Verify:** Task list shows updated status

### View/Manage Routes
**Path:** Code → Routes tab
**URL:** `/platform/apps/{app_uuid}/code/#routes`
**Shows:** App Routes (path pattern → module) and Package Routes
**Read-only** from panel (configured via settings.json)

### Manage Packages
**Path:** Code → Packages tab
**URL:** `/platform/apps/{app_uuid}/code/#packages`
**Shows:** Installed packages and their configurations

### Manage Users
**Path:** App Users (sidebar)
**URL:** `/platform/apps/{app_uuid}/user-management/`
**Actions:**
- Click "Add User" → Fill name, email, role → Save
- Edit existing user
- Reset Password
- Deactivate/Activate user
**Verify:** User appears in list with correct role and status

### View Logs
**Path:** Logs (sidebar)
**URL:** `/platform/apps/{app_uuid}/logs/`

### Manage Releases
**Path:** Releases (sidebar)
**URL:** `/platform/apps/{app_uuid}/releases/`

## Navigation Reference

### URL Patterns
```
/platform/apps                                          → Apps list
/platform/apps/{uuid}/app-settings/app-configuration/   → Basic Info
/platform/apps/{uuid}/app-settings/app-configuration/#themes → Themes
/platform/apps/{uuid}/app-settings/app-configuration/#user-roles → Roles
/platform/apps/{uuid}/app-settings/app-configuration/#authentication → Auth
/platform/apps/{uuid}/app-settings/app-configuration/#secrets → Secrets
/platform/apps/{uuid}/code/                             → Code Summary
/platform/apps/{uuid}/code/#data-models                 → Data Models
/platform/apps/{uuid}/code/#routes                      → Routes
/platform/apps/{uuid}/code/#policies                    → Policies
/platform/apps/{uuid}/code/#packages                    → Packages
/platform/apps/{uuid}/code/#asynctasks                  → Async Tasks
/platform/apps/{uuid}/user-management/                  → Users
/platform/apps/{uuid}/logs/                             → Logs
/platform/apps/{uuid}/releases/                         → Releases
```

### Left Sidebar Items
- App Settings (gear icon)
- Code (document icon)
- App Users (people icon)
- Logs (list icon)
- Releases (rocket icon)

### Key Buttons
- "Launch New App" - Top right on apps list
- "Edit Details" - Top right on Basic Information
- "+ Add Theme" - Top right on Themes
- "Sync Policies" - Top right on Policies
- "Sync Tasks" - Top right on Async Tasks
- "+ Add User" - On User Management

## Safety Rules
- NEVER store credentials in files
- ALWAYS screenshot before and after destructive actions
- ASK before: launching new apps, deactivating users, modifying themes
- Take GIF recording for multi-step operations when possible
