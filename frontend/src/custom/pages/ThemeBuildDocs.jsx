import React from 'react';
import DocPage from '../components/DocPage';
import CodeBlock from '../components/CodeBlock';
import PropsTable from '../components/PropsTable';

const { Section, Callout, InlineCode } = DocPage;

const ThemeBuildDocs = () => {
  return (
    <DocPage
      title="Theme & Build"
      subtitle="Configure colors, typography, and build your app for development and production deployment."
      badge="App Builder"
    >
      <Section title="Theme System">
        <p className="mb-4">
          Zango uses CSS custom properties (variables) for theming. Colors are set by the backend via
          the App Initializer response and automatically applied to all <InlineCode>@zango-core</InlineCode> components.
        </p>
      </Section>

      <Section title="Color Configuration">
        <p className="mb-4">
          The backend <InlineCode>theme.colors</InlineCode> object maps to CSS variables:
        </p>
        <PropsTable
          props={[
            {
              name: 'primary',
              type: 'string',
              defaultValue: '"#5048ed"',
              description: 'Brand color. Maps to --color-brand-* palette (25 through 950).',
            },
            {
              name: 'secondary',
              type: 'string',
              defaultValue: '"#6d7280"',
              description: 'Secondary color.',
            },
            {
              name: 'success',
              type: 'string',
              defaultValue: '"#10b981"',
              description: 'Success/positive actions. Maps to --color-success-*.',
            },
            {
              name: 'warning',
              type: 'string',
              defaultValue: '"#f59e0b"',
              description: 'Warning states. Maps to --color-warning-*.',
            },
            {
              name: 'error',
              type: 'string',
              defaultValue: '"#f04438"',
              description: 'Error/danger states. Maps to --color-error-*.',
            },
            {
              name: 'gray',
              type: 'string',
              defaultValue: '"#717680"',
              description: 'Neutral palette. Maps to --color-gray-*.',
            },
            {
              name: 'background',
              type: 'string',
              defaultValue: '"#f9fafb"',
              description: 'Page background.',
            },
            {
              name: 'text',
              type: 'string',
              defaultValue: '"#252b37"',
              description: 'Default text color.',
            },
          ]}
        />

        <p className="mt-6 mb-3 text-sm font-medium text-gray-700">
          CSS variables generated from the theme colors:
        </p>
        <CodeBlock
          language="css"
          title="generated-css-variables.css"
          code={`:root {
  --color-brand-50: #EAE8FF;
  --color-brand-100: #D4D0FF;
  --color-brand-500: #5048ED;   /* primary */
  --color-brand-700: #302AA8;
  --color-brand-900: #151263;

  --color-gray-50: #F9FAFB;
  --color-gray-500: #667085;
  --color-gray-900: #101828;

  --color-success-500: #10B981;
  --color-error-500: #F04438;
  --color-warning-500: #F59E0B;
}`}
        />
      </Section>

      <Section title="Typography">
        <p className="mb-4">
          Typography settings from <InlineCode>theme.typography</InlineCode>:
        </p>
        <PropsTable
          props={[
            {
              name: 'font_family',
              type: 'string',
              description: 'Font family (loaded via Google Fonts or local).',
            },
            {
              name: 'font_size_base',
              type: 'string',
              defaultValue: '"14px"',
              description: 'Base font size.',
            },
            {
              name: 'line_height',
              type: 'number',
              defaultValue: '1.5',
              description: 'Base line height.',
            },
          ]}
        />
      </Section>

      <Section title="Backend: Theme Configuration">
        <p className="mb-4">
          Themes are managed via <InlineCode>ThemesModel</InlineCode> in the backend. The active
          theme is served by the App Initializer API, which the frontend reads on startup
          to apply colors, typography, and other settings.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 mb-4">
          <li>
            Theme colors are set in the <strong>Zango admin panel</strong> or via API by editing
            the <InlineCode>ThemesModel</InlineCode> record.
          </li>
          <li>
            The frontend auto-generates a <strong>full palette</strong> (25 through 950 shades)
            from each base color returned by the initializer.
          </li>
          <li>
            The active theme is determined by the backend and included in every App
            Initializer response.
          </li>
        </ul>
        <Callout type="tip" title="Shade Generation">
          You don't need to define all shade values - the framework generates them from
          the base color. Just set one hex value per color key (e.g.{' '}
          <InlineCode>"primary": "#5048ed"</InlineCode>) and the palette is computed
          automatically on the frontend.
        </Callout>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginTop: 20, marginBottom: 10 }}>Zango App Panel</h3>
        <p className="mb-4">
          The easiest way to configure themes is through the <strong>Zango App Panel</strong> (admin UI).
          Navigate to the App Panel and look for the <strong>Themes</strong> section under Configuration. From there you can:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 mb-4">
          <li>Set primary, secondary, success, warning, error, and gray colors using a color picker</li>
          <li>Configure typography (font family, base size, line height)</li>
          <li>Toggle between multiple saved themes</li>
          <li>Set one theme as active - the App Initializer serves the active theme automatically</li>
        </ul>
        <Callout type="info" title="No Code Needed">
          Theme changes made in the App Panel take effect immediately. No frontend rebuild required -
          the next page load picks up the new theme from the App Initializer response.
        </Callout>
      </Section>

      <Section title="Using Theme in Custom Components">
        <p className="mb-4">
          Access theme values via CSS variables in your custom components:
        </p>
        <CodeBlock
          language="jsx"
          title="themed-component.jsx"
          code={`// Use CSS variables directly in styles
const MyComponent = () => (
  <div style={{
    color: 'var(--color-brand-500)',
    backgroundColor: 'var(--color-gray-50)',
    borderColor: 'var(--color-gray-200)',
  }}>
    Themed content
  </div>
);

// Or with Tailwind (if @theme is configured in CSS)
const MyComponent = () => (
  <div className="text-brand-500 bg-gray-50 border-gray-200">
    Themed content
  </div>
);`}
        />
      </Section>

      <Section title="Tailwind CSS v4 Setup">
        <p className="mb-4">
          For Tailwind to use theme variables, add to your <InlineCode>index.css</InlineCode>:
        </p>
        <CodeBlock
          language="css"
          title="index.css"
          code={`@import 'tailwindcss';

@theme {
  --color-brand-50: var(--color-brand-50, #EAE8FF);
  --color-brand-500: var(--color-brand-500, #5048ED);
  --color-gray-50: var(--color-gray-50, #F9FAFB);
  --color-gray-500: var(--color-gray-500, #667085);
  /* ... etc */
}`}
        />
        <Callout type="important" title="No tailwind.config.js">
          Don't use <InlineCode>tailwind.config.js</InlineCode> — Tailwind v4 uses CSS-based
          configuration via the <InlineCode>@theme</InlineCode> directive.
        </Callout>
      </Section>

      <Section title="Build Configuration">
        <p className="mb-4">
          The project supports two build targets:
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Development Build (<InlineCode>npm run dev</InlineCode>)
        </h3>
        <ul className="list-disc pl-6 space-y-1 mb-6">
          <li>Vite dev server on port 3000</li>
          <li>Hot Module Replacement (HMR)</li>
          <li>API proxy via <InlineCode>VITE_API_BASE_URL</InlineCode></li>
          <li>Source maps enabled</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Production Build (<InlineCode>npm run build</InlineCode>)
        </h3>
        <ul className="list-disc pl-6 space-y-1 mb-6">
          <li>Output to <InlineCode>dist/</InlineCode> folder</li>
          <li>Optimized, minified code</li>
          <li>Source maps for debugging</li>
          <li>Standard web deployment</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Zango Platform Build (<InlineCode>npm run build:zango</InlineCode>)
        </h3>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Single JavaScript file output (IIFE format)</li>
          <li>CSS injected into JS (no separate CSS file)</li>
          <li>All assets inlined (images, fonts)</li>
          <li>Output to <InlineCode>zango-build/</InlineCode> folder</li>
          <li>Used for deploying to Zango multi-tenant platform</li>
        </ul>
      </Section>

      <Section title="Vite Configuration">
        <p className="mb-4">
          Key configuration details for each build target:
        </p>
        <CodeBlock
          language="js"
          title="vite.config.ts - Development"
          code={`// vite.config.ts - Development
{
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': './src' },
  },
  server: {
    port: 3000,
    proxy: { /* from VITE_PROXY_ROUTES */ }
  }
}`}
        />

        <CodeBlock
          language="js"
          title="vite.config.zango.ts - Zango build"
          code={`// vite.config.zango.ts - Zango build
{
  plugins: [react(), cssInjectedByJsPlugin(), viteSingleFile(), tailwindcss()],
  build: {
    rollupOptions: {
      input: 'src/index.zango.tsx',
      output: {
        format: 'iife',
        entryFileNames: 'zango-app.[timestamp].min.js',
        inlineDynamicImports: true,
      }
    },
    minify: 'terser',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  }
}`}
        />
      </Section>

      <Section title="Entry Points">
        <p className="mb-4">
          The project has two entry points for different environments:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>
            <InlineCode>index.tsx</InlineCode> (dev): Standard React mount to <InlineCode>#root</InlineCode>.
          </li>
          <li>
            <InlineCode>index.zango.tsx</InlineCode> (production): Smart mount — looks for{' '}
            <InlineCode>#zango-app</InlineCode>, falls back to <InlineCode>#root</InlineCode>, creates
            if neither exists. Waits for DOM ready.
          </li>
        </ul>
        <CodeBlock
          language="tsx"
          title="index.zango.tsx"
          code={`function initializeApp() {
  let rootElement = document.getElementById('zango-app')
    || document.getElementById('root');

  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'zango-app';
    document.body.appendChild(rootElement);
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}`}
        />
      </Section>

      <Section title="Django Template Integration">
        <p className="mb-4">
          How the built JS loads in the Zango platform:
        </p>
        <CodeBlock
          language="html"
          title="django-template.html"
          code={`<div id="zango-app" data-base-path="/app/"></div>
<script>
  window.app_initializer_endpoint = "/appbuilder/initializer/";
</script>
<script type="module" src="{% zstatic 'packages/appbuilder/js/build.min.js' %}"></script>`}
        />
      </Section>

      <Section title="Frontend Build Workflow">
        <p className="mb-4">
          Step-by-step workflow for deploying frontend changes to the Zango platform:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-sm text-gray-700 mb-4">
          <li>
            Developer makes changes in <InlineCode>src/</InlineCode>.
          </li>
          <li>
            Run <InlineCode>npm run build:zango</InlineCode> to create a single-file build.
          </li>
          <li>
            Output: <InlineCode>zango-build/zango-app.{'{timestamp}'}.min.js</InlineCode>
          </li>
          <li>
            Run the Django management command:{' '}
            <InlineCode>python manage.py collectstatic</InlineCode> or{' '}
            <InlineCode>python manage.py sync_static</InlineCode>.
          </li>
          <li>
            The JS file is served via <InlineCode>{'{% zstatic %}'}</InlineCode> template tag
            from the workspace's static folder.
          </li>
          <li>
            The <InlineCode>build_version</InlineCode> in <InlineCode>package.json</InlineCode> is
            used for cache-busting in the template.
          </li>
        </ol>
        <Callout type="important" title="Don't forget collectstatic">
          After building, always run <InlineCode>collectstatic</InlineCode> or{' '}
          <InlineCode>sync_static</InlineCode> for changes to take effect on the server.
        </Callout>
      </Section>

      <Section title="Deployment Checklist">
        <Callout type="tip" title="Deployment Checklist">
          <ul className="list-disc pl-5 space-y-2">
            <li>Build with <InlineCode>npm run build:zango</InlineCode></li>
            <li>Verify single JS file in <InlineCode>zango-build/</InlineCode></li>
            <li>Upload to Zango platform static files</li>
            <li>Verify <InlineCode>window.app_initializer_endpoint</InlineCode> is set in template</li>
            <li>Test the initializer endpoint returns valid JSON</li>
            <li>Check all <InlineCode>VITE_PROXY_ROUTES</InlineCode> are accessible in production</li>
          </ul>
        </Callout>
      </Section>
    </DocPage>
  );
};

export default ThemeBuildDocs;
