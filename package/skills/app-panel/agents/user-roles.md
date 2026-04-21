# Manage User Roles

## What this does
Creates and manages user roles that control access permissions and menu visibility.

## Prerequisites
- Inside an app → App Settings → User Roles tab

## Navigation
`/platform/apps/{uuid}/app-settings/app-configuration/#roles`

## Reserved Roles (cannot modify)
- AnonymousUsers (#1) - Unauthenticated visitors
- SystemUsers (#2) - Background processes

## Steps

### Create a role
1. Click "+ Add User Role" (top right, purple)
2. Enter role name (e.g., "Doctor", "Manager", "Viewer")
3. Save

### View roles
- Stats at top: Total, Active, Inactive
- Cards/List view toggle
- Search, filter by status, sort

## After creating a role
- Set up menu for this role in Appbuilder Configure → Role Configurations
- Assign policies to this role in Code → Policies
- Create users with this role in App Users
