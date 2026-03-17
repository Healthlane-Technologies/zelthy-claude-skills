import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const GettingStarted = () => {
  return (
    <DocPage
      title="Quick Start"
      subtitle="Create and launch a new Zango frontend app in minutes."
      badge="Getting Started"
    >
      <Section title="Create Your App">
        <p className="mb-4">
          Scaffold a new project with a single command:
        </p>
        <CodeBlock
          language="bash"
          title="terminal"
          code={`npx @zango-core/create-zango-app my-app`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">CLI Options</h3>
        <PropsTable
          props={[
            {
              name: '--verbose',
              type: 'boolean',
              description: 'Print additional logs during scaffolding.',
            },
            {
              name: '--use-pnpm',
              type: 'boolean',
              description: 'Use pnpm as the package manager.',
            },
            {
              name: '--skip-install',
              type: 'boolean',
              description: 'Skip installing dependencies after project creation.',
            },
          ]}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Alternative Package Managers</h3>
        <p className="mb-4">
          You can also use <InlineCode>npm init</InlineCode>, <InlineCode>yarn create</InlineCode>, or <InlineCode>pnpm create</InlineCode>:
        </p>
        <CodeBlock
          language="bash"
          title="npm"
          code={`npm init @zango-core/zango-app my-app`}
        />
        <CodeBlock
          language="bash"
          title="yarn"
          code={`yarn create @zango-core/zango-app my-app`}
        />
        <CodeBlock
          language="bash"
          title="pnpm"
          code={`pnpm create @zango-core/zango-app my-app`}
        />
      </Section>

      <Section title="Configure Environment">
        <p className="mb-4">
          After creating the project, set up your environment variables:
        </p>
        <CodeBlock
          language="bash"
          title="terminal"
          code={`cd my-app\ncp .env.example .env`}
        />

        <h3 className="text-base font-semibold text-gray-800 mb-3 mt-6">Environment Variables</h3>
        <PropsTable
          props={[
            {
              name: 'VITE_API_BASE_URL',
              type: 'string',
              default: 'http://localhost:8000',
              description: 'Backend API URL. In dev, the Vite dev server proxies requests here.',
            },
            {
              name: 'VITE_PROXY_ROUTES',
              type: 'string',
              default: '/api,/zango,/frame',
              description: 'Comma-separated routes to proxy to backend. MUST include ALL backend routes your app uses (app initializer, CRUD endpoints, workflow, etc.).',
            },
            {
              name: 'VITE_APP_ENV',
              type: 'string',
              default: 'development',
              description: 'Environment flag (development / staging / production).',
            },
          ]}
        />

        <Callout type="important" title="Missing Routes Return 404">
          If a route returns 404 in development, check whether it is listed in{' '}
          <InlineCode>VITE_PROXY_ROUTES</InlineCode>. Every backend route your app
          calls must be included so the Vite dev server proxies it correctly.
        </Callout>
      </Section>

      <Section title="Start Development">
        <p className="mb-4">
          Launch the development server:
        </p>
        <CodeBlock
          language="bash"
          title="terminal"
          code={`npm run dev`}
        />
        <p className="mb-4">
          The app opens at <InlineCode>http://localhost:3000</InlineCode>. On load it
          fetches configuration from the backend via the{' '}
          <InlineCode>/appbuilder/initializer/</InlineCode> endpoint, which provides
          route definitions, navigation, and theme settings.
        </p>
      </Section>

      <Section title="Create Your First Custom Page">
        <p className="mb-4">
          Add a new file inside <InlineCode>src/custom/pages/</InlineCode>:
        </p>
        <CodeBlock
          language="jsx"
          title="src/custom/pages/Dashboard.jsx"
          code={`const Dashboard = () => {
  return (
    <div style={{ padding: 32 }}>
      <h1>Dashboard</h1>
      <p>Welcome to my app!</p>
    </div>
  );
};

export default Dashboard;`}
        />

        <p className="mb-4">
          Then register it in the barrel export file:
        </p>
        <CodeBlock
          language="jsx"
          title="src/custom/pages/index.js"
          code={`export { default as Dashboard } from './Dashboard';`}
        />

        <p className="mb-4">
          On the backend, create a route with <InlineCode>page_type: "custom"</InlineCode>{' '}
          and <InlineCode>component: "Dashboard"</InlineCode> pointing to this page. The
          component name in the route config must exactly match the export name in{' '}
          <InlineCode>index.js</InlineCode>.
        </p>
      </Section>

      <Section title="Add CRUD Page">
        <p className="mb-4">
          For basic CRUD pages, no custom frontend code is needed. Simply define the route
          in your backend configuration:
        </p>
        <CodeBlock
          language="json"
          title="backend-route-config.json"
          code={`{
  "path": "/app/patients",
  "page_type": "crud",
  "entity": "Patient"
}`}
        />
        <p className="mb-4">
          The <InlineCode>CrudHandler</InlineCode> component is automatically used to
          render the table, search, filters, pagination, and detail views. For
          customization, create a custom page that wraps <InlineCode>CrudHandler</InlineCode>{' '}
          with your own props and overrides.
        </p>
      </Section>

      <Section title="Build for Production">
        <p className="mb-4">
          When you are ready to deploy, build the application:
        </p>
        <CodeBlock
          language="bash"
          title="terminal"
          code={`npm run build          # Standard build to dist/
npm run build:zango    # Single-file build for Zango platform`}
        />
        <p className="mb-4">
          The standard build outputs to <InlineCode>dist/</InlineCode> and can be served
          by any static hosting provider. The <InlineCode>build:zango</InlineCode> command
          produces a single-file IIFE bundle suitable for embedding in the Zango platform.
        </p>
      </Section>

      <Section title="Available Scripts">
        <PropsTable
          props={[
            {
              name: 'npm run dev',
              type: 'string',
              description: 'Start development server on port 3000 with hot reload and backend proxying.',
            },
            {
              name: 'npm run build',
              type: 'string',
              description: 'Production build to dist/ directory.',
            },
            {
              name: 'npm run build:zango',
              type: 'string',
              description: 'Single-file build for Zango platform deployment (IIFE format).',
            },
            {
              name: 'npm run preview',
              type: 'string',
              description: 'Preview the production build locally.',
            },
          ]}
        />
      </Section>
    </DocPage>
  );
};

export default GettingStarted;
