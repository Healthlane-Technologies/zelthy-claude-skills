---
name: app-panel
description: "Automate Zango App Panel via browser - launch new apps, configure themes, set up routes and menus, sync policies, manage users/packages/tasks, configure authentication. Use when the user mentions app panel, platform panel, launch app, create app, sync policies, sync tasks, manage users, set up theme via panel, or any admin operation that requires browser interaction with the Zango platform UI. Always use this skill instead of zango-frontend when the task involves the App Panel web interface."
license: MIT
compatibility: Requires agent-browser CLI (npm i -g agent-browser && agent-browser install). Needs Zango App Panel URL and platform admin credentials.
metadata:
  author: Healthlane Technologies
  version: "3.0"
allowed-tools: Bash(agent-browser:*) Bash(bash:*)
---

# Zango App Panel Automation

Automate admin operations on the Zango App Panel using agent-browser CLI.

## Prerequisites

agent-browser must be installed:
```bash
npm install -g agent-browser
agent-browser install  # Downloads Chrome for Testing
```

## Before Starting

Ask the user:
1. **App Panel URL?** (e.g., `http://app0.zelthy.com:8000`)
2. **Admin credentials?** (email + password - NEVER write to files)
3. **Which app?** (if multiple apps exist)
4. **What operation?** (see list below)

## Core Workflow Pattern

Every operation follows: open → snapshot → interact → verify

```bash
agent-browser open <url>
agent-browser wait --load networkidle
agent-browser snapshot -i          # Get refs like @e1, @e2
agent-browser fill @e1 "value"     # Interact using refs
agent-browser click @e2
agent-browser screenshot result.png # Verify
```

## Login Flow

```bash
agent-browser open "{base_url}/auth/login/"
agent-browser wait --load networkidle
agent-browser find placeholder "Enter Username" fill "{email}"
agent-browser find placeholder "Email Password" fill "{password}"
agent-browser find role button click --name "Login"
agent-browser wait --url "**/platform/apps" --timeout 10000
```

Or use the login script: `bash scripts/login.sh {url} {email} {password}`

## Handling Webviews (Appbuilder Configure)

The appbuilder configure panel opens in an iframe. Extract URL and open directly:
```bash
# Get iframe URL
agent-browser eval "document.querySelector('iframe')?.src"
# Open in current browser
agent-browser open "<extracted-url>"
```

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
