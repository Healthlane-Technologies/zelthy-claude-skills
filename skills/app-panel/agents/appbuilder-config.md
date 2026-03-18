# Appbuilder Configuration (Routes & Menus)

## What this does
Configures application routes (what pages exist) and role-based menus (what each role sees in the sidebar). This is THE critical configuration for any Zango frontend app.

## Prerequisites
- Inside an app → Code → Packages tab
- appbuilder package must be installed

## Navigation
1. Go to Code → Packages tab
2. Find "appbuilder" package
3. Click "Configure" button
4. IMPORTANT: This opens a webview/iframe. Extract the URL and open in a new tab:
   ```javascript
   const iframes = document.querySelectorAll('iframe');
   // Open iframes[0].src in a new tab
   ```

## Routes Tab

### Add a route
1. Click "+ Add Route" (top right, purple)
2. Fill form:
   - Name: Display name (e.g., "Patients")
   - Path: URL path (e.g., "/app/patients")
   - Page Type: Select "CRUD" or "CUSTOM" or "LOGIN" or "TRAINING"
   - Component: (for CUSTOM only) Component name matching frontend export
   - Icon: Emoji or SVG string
   - Extra Params: JSON object (for CRUD: {"api_endpoint": "/api/patients/"})
3. Save

### Edit a route
1. Click pencil icon on the route row
2. Update fields
3. Save

### Delete a route
1. Click trash icon on the route row
2. Confirm deletion

### Route types
- CRUD (yellow badge): Auto-generated table+detail. Needs api_endpoint in extra_params
- CUSTOM (green badge): Your React component. Component name must match pages/index.js export
- LOGIN: Authentication pages (standalone)
- TRAINING: Training module pages

## Role Configurations Tab

### View menu for a role
1. Click the role name tab (e.g., "Program Owner", "BMS Admin")
2. See menu items with icons, names, paths
3. Nested items show as indented children

### Create menu for a new role
1. Click "+ Add New" (top right)
2. Select User Role from dropdown
3. Add menu items using:
   - "+ Add Route": Pick from existing routes
   - "Add Custom URI": Enter custom URL manually
   - "Add Group": Create parent item with children
4. Drag to reorder items
5. Click "Save Configuration"

### Edit existing menu
1. Click "Edit" button on the role section
2. Edit Configuration modal opens:
   - User Role dropdown (can switch role)
   - Menu items list with drag handles
   - Per item: edit (pencil) and delete (trash)
   - Groups have + (add child) and v (collapse)
3. Use "+ Add Route", "Add Custom URI", "Add Group" to add items
4. Drag to reorder
5. Click "Save Configuration"

### Delete menu config
1. Click "Delete" button (red) on the role section
2. Confirm - removes entire menu for that role

## Menu item types
- Route item: Links to an existing route (synced via route_id)
- Custom URI: Manual URL (not synced with routes)
- Group: Parent with children, creates nested sidebar section

## Important
- Routes and menus are synced: changing a route's name/path auto-updates linked menu items
- Each role has its own menu - "Admin" sees different items than "Viewer"
- AnonymousUsers role menu = what unauthenticated users see
- The frontend's App Initializer serves the menu for the current user's role
