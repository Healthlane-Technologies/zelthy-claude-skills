---
name: app-panel
description: "Automate Zango App Panel operations via browser - launch apps, configure themes, set up routes and menus, sync policies, manage users/packages/tasks, configure authentication. Use when users want to perform admin operations on the Zango platform without manual clicking."
license: MIT
compatibility: Requires browser automation capability (agent-browser or claude-in-chrome MCP tools). Needs Zango App Panel URL and platform admin credentials.
metadata:
  author: Healthlane Technologies
  version: "2.0"
---

# Zango App Panel Automation

Automate admin operations on the Zango App Panel via browser.

## Before Starting

Ask the user:
1. **App Panel URL?** (e.g., `http://app0.zelthy.com:8000`)
2. **Admin credentials?** (email + password - stored in memory only, NEVER written to files)
3. **Which app?** (if multiple apps exist)
4. **What operation?** (see list below)

## Login Flow

1. Navigate to `{base_url}/auth/login/`
2. Fill "Enter Username" textbox with email
3. Fill "Email Password" textbox with password
4. Click "Login" button
5. Wait for redirect to `/platform/apps`
6. Verify: page title = "Zango App Panel"

## Routing to Agents

Based on what the user wants, read the relevant agent file:

| Operation | Agent File |
|-----------|------------|
| Launch new app | [launch-app.md](agents/launch-app.md) |
| Edit app info, branding, logo | [basic-info.md](agents/basic-info.md) |
| Configure theme colors/typography | [theme.md](agents/theme.md) |
| Set up routes and menus | [appbuilder-config.md](agents/appbuilder-config.md) |
| Configure authentication | [authentication.md](agents/authentication.md) |
| Manage user roles | [user-roles.md](agents/user-roles.md) |
| Manage app users | [users.md](agents/users.md) |
| Manage secrets | [secrets.md](agents/secrets.md) |
| Sync policies | [policies.md](agents/policies.md) |
| Manage packages | [packages.md](agents/packages.md) |
| Sync async tasks | [async-tasks.md](agents/async-tasks.md) |

## Navigation Reference

See [UI-MAP.md](references/UI-MAP.md) for complete URL patterns, selectors, and page structure.

## Safety Rules
- NEVER store credentials in files
- ALWAYS screenshot before and after destructive actions
- ASK user before: launching apps, deleting routes/menus, deactivating users
- For webview pages (appbuilder configure): extract iframe src URL and open in new tab
