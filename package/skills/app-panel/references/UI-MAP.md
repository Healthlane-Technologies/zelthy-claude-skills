# Zango App Panel - UI Map

## URL Patterns
```
/auth/login/                                                → Login page
/platform/apps                                              → Apps list
/platform/apps/{uuid}/app-settings/app-configuration/       → Basic Info
/platform/apps/{uuid}/app-settings/app-configuration/#themes → Themes
/platform/apps/{uuid}/app-settings/app-configuration/#roles  → User Roles
/platform/apps/{uuid}/app-settings/app-configuration/#auth   → Authentication
/platform/apps/{uuid}/app-settings/app-configuration/#secrets → Secrets
/platform/apps/{uuid}/code/                                 → Code Summary
/platform/apps/{uuid}/code/#data-models                     → Data Models
/platform/apps/{uuid}/code/#routes                          → Routes
/platform/apps/{uuid}/code/#policies                        → Policies
/platform/apps/{uuid}/code/#packages                        → Packages
/platform/apps/{uuid}/code/#asynctasks                      → Async Tasks
/platform/apps/{uuid}/user-management/                      → Users
/platform/apps/{uuid}/logs/                                 → Logs
/platform/apps/{uuid}/Releases/                             → Releases
```

## Appbuilder Configure (webview)
Access: Code → Packages → appbuilder → "Configure" button
Opens iframe: `{app_domain}/appbuilder/configure/?token=...`
IMPORTANT: Extract iframe src via JavaScript and open in new tab for interaction:
```javascript
const iframes = document.querySelectorAll('iframe');
const src = iframes[0]?.src; // Use this URL in a new tab
```

## Left Sidebar (per app)
- App Settings (gear icon)
- Code (document icon)
- App Users (people icon)
- Logs (list icon)
- Releases (rocket icon)

## App Settings Tabs
- Basic Information, Themes, User Roles, Authentication, Secrets

## Code Tabs
- Summary, Data Models, Routes, Policies, Packages, Async Tasks

## Authentication Sub-tabs
- Overview, Login Methods, Security, Policies, SAML Providers, Role Overrides

## Key Buttons
- "Launch New App" - Apps list page, top right
- "Edit Details" - Basic Information, top right
- "+ Add Theme" - Themes tab, top right
- "+ Add User Role" - User Roles tab, top right
- "Edit Configuration" - Authentication tab, top right
- "+ Add Secret" - Secrets tab, top right
- "Sync Policies" - Policies tab, top right
- "Sync Tasks" - Async Tasks tab, top right
- "+ Add User" - User Management, top area
- "Configure" - Per package in Packages tab
- "+ Add Route" - Appbuilder configure, Routes tab
- "+ Add New" - Appbuilder configure, Role Configurations tab
