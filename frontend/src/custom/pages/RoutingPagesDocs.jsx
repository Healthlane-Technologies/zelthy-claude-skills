import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const RoutingPagesDocs = () => {
  return (
    <DocPage
      title="Routing & Pages"
      category="appbuilder"
      subtitle="How routes, page types, and custom pages work together in Zango."
      badge="App Builder"
    >
      <Section title="Page Types">
        <p className="mb-4">
          Zango supports several page types, each rendering a different kind of view:
        </p>
        <PropsTable
          props={[
            { name: 'crud', type: 'string', description: 'Auto-generated CRUD table + detail + forms. Uses CrudHandler internally.' },
            { name: 'custom', type: 'string', description: 'Your React component. Loaded from the customPages prop.' },
            { name: 'login', type: 'string', description: 'Authentication pages. Rendered standalone (no layout).' },
            { name: 'training', type: 'string', description: 'Training module pages.' },
            { name: '404', type: 'string', description: 'Not found page.' },
          ]}
        />
      </Section>

      <Section title="Route Configuration">
        <p className="mb-4">
          Each route object defines how a URL maps to a page. Routes are typically configured in the
          backend and passed to <InlineCode>ZangoApp</InlineCode>.
        </p>
        <PropsTable
          props={[
            { name: 'path', type: 'string', required: true, description: 'URL path, e.g. "/app/patients".' },
            { name: 'page_type', type: 'string', required: true, description: 'One of: crud, custom, login, training.' },
            { name: 'component', type: 'string', description: 'Component name for custom pages (must match the export name exactly).' },
            { name: 'entity', type: 'string', description: 'Entity name for CRUD pages.' },
            { name: 'extra_params', type: 'object', description: 'Additional parameters: { api_endpoint, standalone, ... }.' },
            { name: 'route_id', type: 'string', description: 'UUID for menu synchronization.' },
          ]}
        />
      </Section>

      <Section title="CRUD Pages">
        <p className="mb-4">
          CRUD pages are automatic — no frontend code is needed. The framework renders{' '}
          <InlineCode>CrudHandler</InlineCode> automatically based on the route configuration. The{' '}
          <InlineCode>api_endpoint</InlineCode> is passed to <InlineCode>CrudHandler</InlineCode>.
        </p>
        <CodeBlock
          language="json"
          title="crud-route.json"
          code={`{
  "path": "/app/patients",
  "page_type": "crud",
  "entity": "Patient",
  "extra_params": {
    "api_endpoint": "/api/patients/"
  }
}`}
        />
      </Section>

      <Section title="Custom Pages">
        <p className="mb-4">
          Custom pages require three steps to set up:
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">Step 1: Create the component</h3>
        <CodeBlock
          language="jsx"
          title="src/custom/pages/Analytics.jsx"
          code={`// src/custom/pages/Analytics.jsx
const Analytics = () => <div>My Analytics Page</div>;
export default Analytics;`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Step 2: Export it</h3>
        <CodeBlock
          language="jsx"
          title="src/custom/pages/index.js"
          code={`// src/custom/pages/index.js
export { default as Analytics } from './Analytics';`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Step 3: Backend route</h3>
        <CodeBlock
          language="json"
          title="route-config.json"
          code={`{
  "path": "/app/analytics",
  "page_type": "custom",
  "component": "Analytics"
}`}
        />

        <Callout type="important" title="Name Must Match Exactly">
          The <InlineCode>component</InlineCode> field in the route configuration <strong>must</strong> match
          the export name in <InlineCode>index.js</InlineCode> exactly. For example,{' '}
          <InlineCode>"Analytics"</InlineCode> in the route must correspond to{' '}
          <InlineCode>{'export { default as Analytics }'}</InlineCode> in the code.
        </Callout>
      </Section>

      <Section title="Standalone Pages">
        <p className="mb-4">
          Standalone pages are rendered <strong>without</strong> the sidebar/topbar layout. They are
          useful for public-facing pages, embeds, or full-screen views.
        </p>
        <CodeBlock
          language="json"
          title="standalone-route.json"
          code={`{
  "path": "/app/public-form",
  "page_type": "custom",
  "component": "PublicForm",
  "extra_params": {
    "standalone": true
  }
}`}
        />
      </Section>

      <Section title="Route Matching">
        <p className="mb-4">
          The router resolves pages using the following priority order:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mb-4">
          <li>Exact path match first</li>
          <li>Pattern matching for parameterized routes (<InlineCode>:id</InlineCode>)</li>
          <li>Parent route matching for nested routes</li>
          <li>Routes sorted by specificity (more segments = higher priority)</li>
          <li>Fallback to 404</li>
        </ol>
      </Section>

      <Section title="Nested Routes">
        <p className="mb-4">
          <InlineCode>CrudHandler</InlineCode> creates sub-routes automatically for detail views:
        </p>
        <CodeBlock
          language="text"
          title="auto-routes.txt"
          code={`/app/patients                    → Table view
/app/patients/detail-view/:uuid  → Detail view (if enableDetailViewRoute)`}
        />
      </Section>

      <Section title="Using CrudHandler in Custom Pages">
        <p className="mb-4">
          When you need customization beyond what the <InlineCode>crud</InlineCode> page type offers,
          you can use <InlineCode>CrudHandler</InlineCode> directly inside a custom page. Register
          the route as a <InlineCode>custom</InlineCode> page type and render{' '}
          <InlineCode>CrudHandler</InlineCode> with your desired props.
        </p>
        <CodeBlock
          language="jsx"
          title="CustomPatientPage.jsx"
          code={`import { CrudHandler } from '@zango-core/crud/table';

const CustomPatientPage = () => (
  <CrudHandler
    api_endpoint="/api/patients/"
    headerProps={{ title: "Patient Management" }}
    customDrawerDetail={MyCustomDetail}
  />
);
export default CustomPatientPage;`}
        />
        <Callout type="tip" title="Best of Both Worlds">
          This pattern gives you the full power of <InlineCode>CrudHandler</InlineCode> props (custom
          headers, detail views, styling) while still being registered as a custom page in the routing
          system.
        </Callout>
      </Section>

      <Section title="Backend: Route Model">
        <p className="mb-4">
          Routes are stored in the backend using <InlineCode>AppRoutesModel</InlineCode>, which keeps
          all routes as a JSON list.
        </p>
        <CodeBlock
          language="python"
          title="Import"
          code={`from packages.appbuilder.backend.configure.models import AppRoutesModel`}
        />
        <p className="mb-4">
          <InlineCode>AppRoutesModel</InlineCode> stores routes as a <InlineCode>JSONField</InlineCode>{' '}
          (a list of route objects). Each route object contains the following fields:
        </p>
        <PropsTable
          props={[
            { name: 'route_id', type: 'string', description: 'UUID, auto-generated when routes are saved.' },
            { name: 'name', type: 'string', description: 'Display name for the route.' },
            { name: 'path', type: 'string', description: 'URL path, e.g. "/app/dashboard".' },
            { name: 'icon', type: 'string', description: 'Icon identifier for the route.' },
            { name: 'page_type', type: 'string', description: 'One of: login, custom, crud, training.' },
            { name: 'component', type: 'string', description: 'Component name for custom page types.' },
            { name: 'extra_params', type: 'object', description: 'Additional parameters such as api_endpoint.' },
          ]}
        />
        <CodeBlock
          language="python"
          title="Django shell example"
          code={`# Django shell - create routes
from packages.appbuilder.backend.configure.models import AppRoutesModel

AppRoutesModel.objects.create(routes=[
    {
        "name": "Dashboard",
        "path": "/app/dashboard",
        "page_type": "custom",
        "component": "Dashboard",
        "icon": "home-icon"
    },
    {
        "name": "Patients",
        "path": "/app/patients",
        "page_type": "crud",
        "extra_params": {
            "api_endpoint": "/api/patients/"
        }
    }
])`}
        />
      </Section>

      <Section title="Backend: Menu Model">
        <p className="mb-4">
          Menus are stored using <InlineCode>AppMenuModel</InlineCode>, which has a{' '}
          <strong>OneToOne</strong> relationship with <InlineCode>UserRoleModel</InlineCode> — each
          role gets its own menu configuration.
        </p>
        <CodeBlock
          language="python"
          title="Import"
          code={`from packages.appbuilder.backend.configure.models import AppMenuModel`}
        />
        <p className="mb-4">
          The menu is a <InlineCode>JSONField</InlineCode> containing a list of menu items. Each item
          can have the following fields:
        </p>
        <PropsTable
          props={[
            { name: 'route_id', type: 'string', description: 'UUID linking the menu item to a route for automatic sync.' },
            { name: 'name', type: 'string', description: 'Display name for the menu item.' },
            { name: 'uri', type: 'string', description: 'URL path the menu item links to.' },
            { name: 'icon', type: 'string', description: 'Icon identifier for the menu item.' },
            { name: 'children', type: 'array', description: 'Nested child menu items (supports sub-menus).' },
          ]}
        />
        <CodeBlock
          language="python"
          title="Django shell example"
          code={`from packages.appbuilder.backend.configure.models import AppMenuModel
from zango.apps.appauth.models import UserRoleModel

role = UserRoleModel.objects.get(name="Admin")
AppMenuModel.objects.create(
    role=role,
    menu=[
        {"name": "Dashboard", "uri": "/app/dashboard", "icon": "home-icon"},
        {
            "name": "Management",
            "uri": "/app/patients",
            "icon": "users-icon",
            "children": [
                {"name": "Patients", "uri": "/app/patients"},
                {"name": "Doctors", "uri": "/app/doctors"}
            ]
        }
    ]
)`}
        />
      </Section>

      <Section title="Backend: Routes API">
        <p className="mb-4">
          The routes API endpoint is available at{' '}
          <InlineCode>/appbuilder/configure/routes/api/</InlineCode> and supports the following
          actions:
        </p>
        <PropsTable
          props={[
            { name: 'GET ?action=get_routes', type: 'GET', description: 'Returns the active routes configuration.' },
            { name: 'POST ?action=save_routes', type: 'POST', description: 'Save routes. Auto-assigns route_ids and syncs menus.' },
            { name: 'PUT ?action=update_routes&pk=ID', type: 'PUT', description: 'Update an existing routes configuration.' },
          ]}
        />
      </Section>

      <Section title="Backend: Menu API">
        <p className="mb-4">
          The menu API endpoint is available at{' '}
          <InlineCode>/appbuilder/configure/api/</InlineCode> and supports the following actions:
        </p>
        <PropsTable
          props={[
            { name: 'GET ?action=get_configs', type: 'GET', description: 'Returns all menu configurations.' },
            { name: 'GET ?action=get_available_roles', type: 'GET', description: 'Returns roles that do not yet have a menu configured.' },
            { name: 'POST ?action=create_config', type: 'POST', description: 'Create a menu for a role. Body: { "user_role": id, "menu": [...] }.' },
            { name: 'PUT ?action=update_config&pk=ID', type: 'PUT', description: 'Update an existing menu configuration.' },
            { name: 'DELETE ?action=delete_config&pk=ID', type: 'DELETE', description: 'Delete a menu configuration.' },
          ]}
        />
      </Section>

      <Section title="Route-Menu Sync">
        <p className="mb-4">
          When routes are saved or updated, <strong>all menus automatically sync</strong>. Route
          changes (name, icon, path) propagate to any menu items linked by{' '}
          <InlineCode>route_id</InlineCode>.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>New routes get auto-generated UUIDs as <InlineCode>route_id</InlineCode>.</li>
          <li>When a route's name, icon, or path changes, all menu items referencing that <InlineCode>route_id</InlineCode> are updated automatically.</li>
          <li>Sync happens on every route save/update operation.</li>
        </ul>
        <Callout type="important" title="Always Use route_id">
          Always use <InlineCode>route_id</InlineCode> to link menu items to routes. This ensures
          that changes to routes (name, icon, path) automatically propagate to the corresponding
          menu items without manual updates.
        </Callout>
      </Section>

      <Section title="Configuration Panel">
        <p className="mb-4">
          Zango provides a built-in web UI at <InlineCode>/appbuilder/configure/</InlineCode> for
          managing routes and menus visually.
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Drag-and-drop route ordering</li>
          <li>Visual menu builder per role</li>
          <li>Route-to-menu assignment</li>
        </ul>
        <Callout type="tip" title="Recommended Approach">
          For most use cases, use the Configuration Panel UI instead of shell commands. It provides
          a visual interface for managing routes and menus with built-in validation and sync.
        </Callout>
      </Section>

      <Section title="settings.json">
        <p className="mb-4">
          Located in the workspace root, <InlineCode>settings.json</InlineCode> configures how
          packages and app modules are mounted to URL paths.
        </p>
        <CodeBlock
          language="json"
          title="settings.json"
          code={`{
  "package_routes": [
    { "re_path": "^appbuilder/", "package": "appbuilder", "url": "urls" }
  ],
  "app_routes": [
    { "module": "app", "re_path": "^", "url": "urls" }
  ]
}`}
        />
        <PropsTable
          props={[
            { name: 'package_routes', type: 'array', description: 'Mount package URL patterns (appbuilder, crud, workflow, etc.) to specific path prefixes.' },
            { name: 'app_routes', type: 'array', description: 'Mount app-level URL patterns. Typically a catch-all for the frontend.' },
          ]}
        />
      </Section>
    </DocPage>
  );
};

export default RoutingPagesDocs;
