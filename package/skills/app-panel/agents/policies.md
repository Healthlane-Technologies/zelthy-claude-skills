# Sync & Manage Policies

## What this does
Syncs security policies from code and assigns roles to each policy. Policies control which roles can access which views/endpoints.

## Prerequisites
- Inside an app → Code → Policies tab

## Navigation
`/platform/apps/{uuid}/code/#policies`

## Steps

### Sync policies
1. Click "Sync Policies" button (top right, purple)
2. Wait for sync to complete
3. New policies from code appear in the list

### Edit policy roles
1. Find the policy in the list
2. Click "Edit" button
3. Assign/remove roles (which roles can access this policy)
4. Save

### View policy config
1. Click "View Config" link to see the policy's JSON configuration

## Policy list columns
- Policy name and ID
- Configuration (View Config link)
- Assigned Roles
- Edit button

## Important
- Run "Sync Policies" after adding new views/endpoints in backend code
- Each policy maps to a Django view/API endpoint
- Roles assigned to a policy can access that endpoint
- AnonymousUsers role = publicly accessible
