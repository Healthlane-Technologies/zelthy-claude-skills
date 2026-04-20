import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const ZangoAppDocs = () => {
  return (
    <DocPage
      title="ZangoApp"
      category="appbuilder"
      subtitle="The root component that bootstraps your Zango frontend application."
      badge="App Builder"
    >
      <Section title="Import">
        <CodeBlock
          language="jsx"
          title="import.jsx"
          code={`import { ZangoApp } from '@zango-core/crm-framework';`}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          props={[
            {
              name: 'appInitializerEndpoint',
              type: 'string',
              default: '"/appbuilder/initializer/"',
              description: 'API endpoint for app initialization data.',
            },
            {
              name: 'customPages',
              type: 'object',
              description: 'Map of component names to React components for custom page routing.',
            },
            {
              name: 'layoutConfig',
              type: 'object',
              description: 'Layout configuration: { showTopbar: boolean (true), showNavbar: boolean (true), layoutType: \'wide\'|\'compact\' (\'wide\') }',
            },
            {
              name: 'topbarConfig',
              type: 'object',
              description: 'Topbar configuration: { showProfile, customLeftContent, customRightContent, customProfileMenu, customTopbar, profileMenuConfig, className, style }',
            },
            {
              name: 'navbarConfig',
              type: 'object',
              description: 'Navbar configuration: { showLogo, showMenu, isCollapsed, collapsible, customLogo, customMenuContent, customBottomContent, customNavbar, customMenu, menuConfig, className, style }',
            },
            {
              name: 'authConfig',
              type: 'object',
              description: 'Authentication configuration: { customComponents, theme, card, logo, login, roleSelection, twoFactor, resetPassword, providers, messages }',
            },
            {
              name: 'config',
              type: 'object',
              description: 'General app configuration.',
            },
            {
              name: 'customComponents',
              type: 'object',
              description: 'Custom component overrides: { Layout, Topbar, Navbar }',
            },
          ]}
        />
      </Section>

      <Section title="Basic Usage">
        <CodeBlock
          language="jsx"
          title="basic-usage.jsx"
          code={`import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';

const App = () => (
  <ZangoApp
    appInitializerEndpoint="/appbuilder/initializer/"
    customPages={customPages}
  />
);`}
        />
      </Section>

      <Section title="With Full Configuration">
        <p className="mb-4">
          A complete example showing layout, navbar, topbar, and auth customization.
        </p>
        <CodeBlock
          language="jsx"
          title="full-config.jsx"
          code={`import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';
import CustomLogin from './custom/pages/CustomLogin';
import DocsNavbar from './custom/components/DocsNavbar';

const App = () => (
  <ZangoApp
    appInitializerEndpoint="/appbuilder/initializer/"
    customPages={customPages}
    layoutConfig={{
      showTopbar: false,
      showNavbar: true,
      layoutType: 'wide',
    }}
    navbarConfig={{
      collapsible: true,
      customLogo: <MyLogo />,
      customMenu: <DocsNavbar />,
      customBottomContent: <ProfileSection />,
    }}
    topbarConfig={{
      showProfile: true,
      customRightContent: <NotificationBell />,
    }}
    authConfig={{
      customComponents: {
        LoginPage: CustomLogin,
      },
    }}
  />
);`}
        />
      </Section>

      <Section title="Accessing App Data">
        <p className="mb-4">
          Use the <InlineCode>useAppContext</InlineCode> hook from any component within <InlineCode>ZangoApp</InlineCode> to
          access initialization data, navigation menu, routes, user profile, and theme.
        </p>
        <CodeBlock
          language="jsx"
          title="use-app-context.jsx"
          code={`import { useAppContext } from '@zango-core/crm-framework';

const MyComponent = () => {
  const {
    appData,      // Raw initializer response
    menu,         // Navigation menu items
    routes,       // Application routes
    profileInfo,  // Current user profile
    appLogo,      // App logo URL
    appName,      // Application name
    theme,        // Theme colors & typography
  } = useAppContext();

  return <div>Hello {profileInfo?.name}</div>;
};`}
        />
      </Section>

      <Section title="Layout Configuration">
        <p className="mb-4">
          The <InlineCode>layoutConfig</InlineCode> prop controls the overall page structure.
        </p>
        <PropsTable
          props={[
            {
              name: 'showTopbar',
              type: 'boolean',
              default: true,
              description: 'Show/hide the top navigation bar.',
            },
            {
              name: 'showNavbar',
              type: 'boolean',
              default: true,
              description: 'Show/hide the sidebar navigation.',
            },
            {
              name: 'layoutType',
              type: "'wide' | 'compact'",
              default: "'wide'",
              description: 'Layout mode. "wide" uses the full viewport width; "compact" constrains content width.',
            },
          ]}
        />
      </Section>

      <Section title="What ZangoApp Does">
        <p className="mb-4">
          Behind the scenes, <InlineCode>ZangoApp</InlineCode> handles the complete application bootstrap:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
          <li>Fetches initialization data from the backend via the configured endpoint</li>
          <li>Sets up React Router with routes from the initializer response</li>
          <li>Creates CSS variables from the theme configuration for consistent styling</li>
          <li>Registers page types (<InlineCode>crud</InlineCode>, <InlineCode>custom</InlineCode>, <InlineCode>login</InlineCode>, <InlineCode>training</InlineCode>)</li>
          <li>Manages the authentication flow (login, role selection, two-factor, password reset)</li>
          <li>Provides <InlineCode>AppContext</InlineCode> to all children via <InlineCode>useAppContext()</InlineCode></li>
          <li>Handles session security (idle timeout, auto-logout, activity pings)</li>
        </ul>
      </Section>
    </DocPage>
  );
};

export default ZangoAppDocs;
