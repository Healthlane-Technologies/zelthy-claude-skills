import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const AppInitializerDocs = () => {
  return (
    <DocPage
      title="App Initializer"
      category="appbuilder"
      subtitle="The backend API that configures your entire frontend - routes, menu, theme, and user profile."
      badge="App Builder"
    >
      <Section title="Overview">
        <p className="mb-4">
          The App Initializer is a <InlineCode>GET</InlineCode> endpoint that returns everything the frontend needs
          to bootstrap: routes, menu, theme, user info, and session config. It is called once on app load by
          the <InlineCode>ZangoApp</InlineCode> component.
        </p>
      </Section>

      <Section title="Endpoint">
        <CodeBlock
          language="bash"
          title="endpoint"
          code={`GET /appbuilder/initializer/`}
        />
        <p className="mt-3 text-sm text-gray-600">
          Configured via the <InlineCode>appInitializerEndpoint</InlineCode> prop on <InlineCode>ZangoApp</InlineCode>.
          Defaults to <InlineCode>/appbuilder/initializer/</InlineCode>.
        </p>
      </Section>

      <Section title="Full Response Format">
        <p className="mb-4">
          The initializer returns a JSON object containing the full application configuration.
        </p>
        <CodeBlock
          language="json"
          title="initializer-response.json"
          code={`{
  "success": true,
  "response": {
    "app_name": "My Application",
    "app_version": "1.0.0",
    "app_logo": "/path/to/logo.png",
    "is_user_anonymous": false,
    "user_role": "Admin",
    "session_security_config": {
      "enabled": true,
      "ping_url": "/session_security/ping/",
      "warn_after": 1700,
      "expire_after": 1800
    },
    "metadata": {
      "title": "My App",
      "description": "Application description",
      "favicon": "/favicon.ico"
    },
    "theme": {
      "colors": {
        "primary": "#5048ed",
        "secondary": "#6d7280",
        "success": "#10b981",
        "warning": "#f59e0b",
        "error": "#f04438",
        "gray": "#717680"
      },
      "typography": {
        "font_family": "Inter, sans-serif",
        "font_size_base": "14px",
        "line_height": 1.5
      }
    },
    "routes": [
      { "route_id": "uuid", "path": "/app/dashboard", "page_type": "custom", "component": "Dashboard" },
      { "path": "/app/patients", "page_type": "crud", "entity": "Patient", "extra_params": { "api_endpoint": "/api/patients/" } }
    ],
    "menu": [
      { "name": "Dashboard", "uri": "/app/dashboard", "icon": "home-icon-svg" },
      { "name": "Management", "uri": "/app/patients", "icon": "users-icon", "children": [
        { "name": "Patients", "uri": "/app/patients" },
        { "name": "Doctors", "uri": "/app/doctors" }
      ]}
    ],
    "profile_info": {
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "+1234567890",
      "user_role": "Admin",
      "member_since": "2024-01-01",
      "profile_pic": "/path/to/pic.jpg"
    }
  }
}`}
        />
      </Section>

      <Section title="Routes">
        <p className="mb-4">
          Each route object tells <InlineCode>ZangoApp</InlineCode> how to render a page. The <InlineCode>page_type</InlineCode> determines
          which renderer is used, and <InlineCode>component</InlineCode> maps to a key in your <InlineCode>customPages</InlineCode> object.
        </p>
        <PropsTable
          props={[
            {
              name: 'path',
              type: 'string',
              required: true,
              description: 'URL path, e.g. "/app/patients".',
            },
            {
              name: 'page_type',
              type: 'string',
              required: true,
              description: 'Page renderer: "crud", "custom", "login", or "training".',
            },
            {
              name: 'component',
              type: 'string',
              description: 'Component name from customPages (for page_type: "custom").',
            },
            {
              name: 'entity',
              type: 'string',
              description: 'Entity name (for page_type: "crud").',
            },
            {
              name: 'route_id',
              type: 'string',
              description: 'UUID for syncing with menu items.',
            },
            {
              name: 'extra_params',
              type: 'object',
              description: 'Additional parameters: { api_endpoint, standalone, ... }',
            },
          ]}
        />
      </Section>

      <Section title="Menu">
        <p className="mb-4">
          Menu items define the sidebar navigation. Items can be nested using the <InlineCode>children</InlineCode> property
          for grouped navigation.
        </p>
        <PropsTable
          props={[
            {
              name: 'name',
              type: 'string',
              required: true,
              description: 'Display text for the menu item.',
            },
            {
              name: 'uri',
              type: 'string',
              required: true,
              description: 'Navigation URL.',
            },
            {
              name: 'icon',
              type: 'string',
              description: 'SVG string, emoji, or image URL.',
            },
            {
              name: 'children',
              type: 'array',
              description: 'Nested menu items (same structure).',
            },
            {
              name: 'route_id',
              type: 'string',
              description: 'UUID linking to the corresponding route.',
            },
          ]}
        />
      </Section>

      <Section title="Theme">
        <p className="mb-4">
          Theme colors from the initializer response are converted into CSS custom properties that
          all <InlineCode>@zango-core</InlineCode> components consume:
        </p>
        <CodeBlock
          language="css"
          title="generated-css-variables.css"
          code={`--color-brand-500: #5048ed;   /* from theme.colors.primary */
--color-gray-500: #717680;    /* from theme.colors.gray */
--color-success-500: #10b981; /* from theme.colors.success */
--color-warning-500: #f59e0b; /* from theme.colors.warning */
--color-error-500: #f04438;   /* from theme.colors.error */`}
        />
        <Callout type="tip" title="Dynamic Theming">
          All <InlineCode>@zango-core</InlineCode> components read from these CSS variables. Changing the
          theme in the backend changes the entire app's look without any frontend code changes.
        </Callout>
      </Section>

      <Section title="Session Security">
        <p className="mb-4">
          Session security configuration controls idle timeout behavior. When enabled, the app
          monitors user activity, shows a warning before expiration, and auto-logs out inactive users.
        </p>
        <PropsTable
          props={[
            {
              name: 'enabled',
              type: 'boolean',
              description: 'Enable session timeout monitoring.',
            },
            {
              name: 'ping_url',
              type: 'string',
              description: 'URL to ping on user activity to keep the session alive.',
            },
            {
              name: 'warn_after',
              type: 'number',
              description: 'Seconds of inactivity before showing a timeout warning.',
            },
            {
              name: 'expire_after',
              type: 'number',
              description: 'Seconds of inactivity before auto-logout.',
            },
          ]}
        />
      </Section>
    </DocPage>
  );
};

export default AppInitializerDocs;
