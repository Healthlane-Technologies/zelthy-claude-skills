import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const ProjectStructure = () => {
  return (
    <DocPage
      title="Project Structure"
      category="appbuilder"
      subtitle="Understanding the file structure of a Zango frontend app."
      badge="Getting Started"
    >
      <Section title="Directory Overview">
        <p className="mb-4">
          After scaffolding with <InlineCode>create-zango-app</InlineCode>, your project
          has the following structure:
        </p>
        <CodeBlock
          language="bash"
          title="my-app/"
          code={`my-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── custom/
│   │   └── pages/              # Your custom pages go here
│   │       ├── Dashboard.jsx
│   │       └── index.js        # Export all custom pages
│   ├── App.tsx                  # Main app - ZangoApp configuration
│   ├── index.tsx                # Dev entry point
│   ├── index.zango.tsx          # Zango platform entry point
│   └── index.css                # Global styles + Tailwind
├── .env                         # Environment config (create from .env.example)
├── .env.example                 # Environment template
├── index.html                   # HTML template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts               # Dev/production build config
└── vite.config.zango.ts         # Zango single-file build config`}
        />
      </Section>

      <Section title="Key Files Explained">
        <h3 className="text-base font-semibold text-gray-800 mb-3">App.tsx</h3>
        <p className="mb-4">
          The main application component. Renders <InlineCode>{'<ZangoApp>'}</InlineCode>{' '}
          with configuration including <InlineCode>navbarConfig</InlineCode>,{' '}
          <InlineCode>topbarConfig</InlineCode>, <InlineCode>layoutConfig</InlineCode>,{' '}
          <InlineCode>authConfig</InlineCode>, and the <InlineCode>customPages</InlineCode>{' '}
          map. This is the central place where the framework connects to your custom code.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">index.tsx</h3>
        <p className="mb-4">
          The development entry point. Mounts the React application to the{' '}
          <InlineCode>#root</InlineCode> div in <InlineCode>index.html</InlineCode>. Used
          when running <InlineCode>npm run dev</InlineCode>.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">index.zango.tsx</h3>
        <p className="mb-4">
          The production entry point for the Zango platform. Looks for a{' '}
          <InlineCode>#zango-app</InlineCode> container first, falls back to{' '}
          <InlineCode>#root</InlineCode>, and creates one if neither exists. Waits for DOM
          ready before mounting.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">custom/pages/index.js</h3>
        <p className="mb-4">
          Barrel export file for all custom pages. Every custom page must be exported here
          with the <strong>exact name</strong> matching the <InlineCode>component</InlineCode>{' '}
          field in the backend route configuration.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">vite.config.ts</h3>
        <p className="mb-4">
          Development and standard production build configuration. Sets up the Vite dev
          server with proxy rules (read from <InlineCode>.env</InlineCode>), path aliases
          (<InlineCode>@/</InlineCode> maps to <InlineCode>src/</InlineCode>), and esbuild
          JSX loader configuration.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">vite.config.zango.ts</h3>
        <p className="mb-4">
          Single-file build configuration using{' '}
          <InlineCode>vite-plugin-singlefile</InlineCode> and{' '}
          <InlineCode>vite-plugin-css-injected-by-js</InlineCode>. Outputs an IIFE-format
          bundle that can be embedded directly in the Zango platform.
        </p>
      </Section>

      <Section title="Where to Add Code">
        <p className="mb-4">
          Quick reference for where new code should go:
        </p>
        <PropsTable
          props={[
            {
              name: 'New pages',
              type: 'string',
              description: 'src/custom/pages/YourPage.jsx + export in index.js',
            },
            {
              name: 'Custom components',
              type: 'string',
              description: 'src/custom/components/',
            },
            {
              name: 'Custom hooks',
              type: 'string',
              description: 'src/custom/hooks/',
            },
            {
              name: 'Constants / config',
              type: 'string',
              description: 'src/custom/constants/',
            },
            {
              name: 'Utilities',
              type: 'string',
              description: 'src/custom/utils/',
            },
            {
              name: 'Assets (images/fonts)',
              type: 'string',
              description: 'src/assets/',
            },
          ]}
        />
      </Section>

      <Section title="App.tsx Deep Dive">
        <p className="mb-4">
          The default <InlineCode>App.tsx</InlineCode> is minimal by design. Here is what
          it looks like out of the box:
        </p>
        <CodeBlock
          language="tsx"
          title="src/App.tsx"
          code={`import { ZangoApp } from '@zango-core/crm-framework';
import * as customPages from './custom/pages';

const App = () => {
  return (
    <ZangoApp
      appInitializerEndpoint="/appbuilder/initializer/"
      customPages={customPages}
    />
  );
};

export default App;`}
        />

        <Callout type="info" title="How It Works">
          <InlineCode>appInitializerEndpoint</InlineCode> defaults to{' '}
          <InlineCode>/appbuilder/initializer/</InlineCode>. The framework fetches route
          definitions, navigation structure, and theme settings from this endpoint at
          startup. The <InlineCode>customPages</InlineCode> object maps component names
          (as strings) to React components -- when a route has{' '}
          <InlineCode>page_type: "custom"</InlineCode>, the framework looks up the{' '}
          <InlineCode>component</InlineCode> value in this map to render the correct page.
        </Callout>

        <p className="mb-4">
          As your app grows you can add more configuration props to{' '}
          <InlineCode>{'<ZangoApp>'}</InlineCode> such as{' '}
          <InlineCode>navbarConfig</InlineCode> for sidebar navigation,{' '}
          <InlineCode>topbarConfig</InlineCode> for the top header bar,{' '}
          <InlineCode>layoutConfig</InlineCode> for layout overrides, and{' '}
          <InlineCode>authConfig</InlineCode> for authentication settings.
        </p>
      </Section>
    </DocPage>
  );
};

export default ProjectStructure;
