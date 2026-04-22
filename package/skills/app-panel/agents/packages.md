# Manage Packages

## What this does
View installed packages and access package-specific configuration.

## Prerequisites
- Inside an app → Code → Packages tab

## Navigation
`/platform/apps/{uuid}/code/#packages`

## Steps

### View packages
1. Stats: Total Packages, Installed Packages
2. Each package shows: name, status (Installed), version, "Configure" button
3. Available versions listed for upgrade

### Configure a package
1. Click "Configure" button on the package row
2. Opens package-specific configuration (e.g., appbuilder opens route/menu config)
3. IMPORTANT: Some packages open in a webview/iframe - extract URL and open in new tab

### Common packages
- appbuilder: Routes + menu configuration (see appbuilder-config.md)
- crud: CRUD table configuration
- workflow: Workflow engine
- communication: Email/SMS
- notifications: Push notifications
