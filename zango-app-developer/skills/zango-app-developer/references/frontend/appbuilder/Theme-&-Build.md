# Theme & Build
App Builder

Configure colors, typography, and build your app for development and production deployment.

**Sections:** Theme System | Color Configuration | Typography | Backend: Theme Configuration | Using Theme in Custom Components | Tailwind CSS v4 Setup | Build Configuration | Vite Configuration | Entry Points | Django Template Integration | Frontend Build Workflow | Deployment Checklist

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `primary` | string | - | Brand color. Maps to --color-brand-* palette (25 through 950). |
| `secondary` | string | - | Secondary color. |
| `success` | string | - | Success/positive actions. Maps to --color-success-*. |
| `warning` | string | - | Warning states. Maps to --color-warning-*. |
| `error` | string | - | Error/danger states. Maps to --color-error-*. |
| `gray` | string | - | Neutral palette. Maps to --color-gray-*. |
| `background` | string | - | Page background. |
| `text` | string | - | Default text color. |
| `font_family` | string | - | Font family (loaded via Google Fonts or local). |
| `font_size_base` | string | - | Base font size. |
| `line_height` | number | - | Base line height. |

## Code Examples

### generated-css-variables.css
```css
:root {
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
}
```

### themed-component.jsx
```jsx
// Use CSS variables directly in styles
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
);
```

### index.css
```css
@import 'tailwindcss';

@theme {
  --color-brand-50: var(--color-brand-50, #EAE8FF);
  --color-brand-500: var(--color-brand-500, #5048ED);
  --color-gray-50: var(--color-gray-50, #F9FAFB);
  --color-gray-500: var(--color-gray-500, #667085);
  /* ... etc */
}
```

### vite.config.ts - Development
```js
// vite.config.ts - Development
{
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': './src' },
  },
  server: {
    port: 3000,
    proxy: { /* from VITE_PROXY_ROUTES */ }
  }
}
```

### vite.config.zango.ts - Zango build
```js
// vite.config.zango.ts - Zango build
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
}
```

### index.zango.tsx
```tsx
function initializeApp() {
  let rootElement = document.getElementById('zango-app')
    || document.getElementById('root');

  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'zango-app';
    document.body.appendChild(rootElement);
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(<App
```

### django-template.html
```html
<div id="zango-app" data-base-path="/app/"></div>
<script>
  window.app_initializer_endpoint = "/appbuilder/initializer/";
</script>
<script type="module" src="{% zstatic 'packages/appbuilder/js/build.min.js' %}"></script>
```

